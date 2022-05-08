use thiserror::Error;
use tokio::io::AsyncBufReadExt;
use tokio::io::AsyncRead;
use tokio::io::AsyncWrite;
use tokio::io::AsyncWriteExt;
use tokio::io::BufReader;
use tokio::io::BufWriter;

#[derive(Debug)]
pub struct IndexFile {
    pub filename: String,
    pub offset: u64,
    pub size: u64,
}

#[derive(Debug)]
pub struct FileGroup {
    pub name: String,
    pub files: Vec<IndexFile>,
}

#[derive(Debug, Error)]
pub enum WixError {
    #[error("wix file is an invalid format.")]
    InvalidFormat,

    #[error("Unknown error: {0}")]
    IOError(#[from] std::io::Error),
}

#[derive(Debug)]
pub struct Wix(Vec<FileGroup>);

impl Wix {
    pub async fn from_reader<T: AsyncRead + Unpin>(reader: BufReader<T>) -> Result<Self, WixError> {
        let mut lines = reader.lines();

        let mut out: Vec<FileGroup> = vec![];

        let mut name: Option<String> = None;
        let mut files: Vec<IndexFile> = vec![];

        while let Some(line) = lines.next_line().await.map_err(WixError::IOError)? {
            let parts: Vec<&str> = line.split_ascii_whitespace().collect();
            if parts.len() < 2 {
                return Err(WixError::InvalidFormat);
            }

            if parts[0] == "!group" {
                if parts.len() != 2 {
                    return Err(WixError::InvalidFormat);
                }

                if let Some(name) = name {
                    out.push(FileGroup {
                        name: name,
                        files: files,
                    })
                }

                name = Some(parts[1].into());
                files = vec![];
            } else {
                if parts.len() != 3 {
                    return Err(WixError::InvalidFormat);
                }

                files.push(IndexFile {
                    filename: parts[0].into(),
                    offset: parts[1].parse().map_err(|_| WixError::InvalidFormat)?,
                    size: parts[2].parse().map_err(|_| WixError::InvalidFormat)?,
                })
            }
        }

        if let Some(last) = out.last() {
            if let Some(name) = name {
                if last.name != name {
                    out.push(FileGroup {
                        name: name,
                        files: files,
                    })
                }
            }
        }

        Ok(Self(out))
    }

    pub async fn to_writer<T: AsyncWrite + Unpin>(
        &self,
        mut writer: BufWriter<T>,
    ) -> Result<(), WixError> {
        for file_group in &self.0 {
            writer
                .write(format!("!group {}\r\n", &file_group.name).as_bytes())
                .await?;
            for index_file in &file_group.files {
                writer
                    .write(
                        format!(
                            "{} {} {}\r\n",
                            &index_file.filename, &index_file.offset, &index_file.size
                        )
                        .as_bytes(),
                    )
                    .await?;
            }
        }
        writer.flush().await?;
        Ok(())
    }
}
