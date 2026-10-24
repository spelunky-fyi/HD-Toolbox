//! Finds where Steam installed Spelunky HD, since the Toolbox launches it
//! through Steam rather than from a folder

use std::ffi::OsString;
use std::fs;
use std::os::windows::ffi::{OsStrExt, OsStringExt};
use std::path::{Path, PathBuf};
use std::ptr::null_mut;

use anyhow::{bail, Context};
use winapi::shared::minwindef::{DWORD, HKEY};
use winapi::shared::winerror::ERROR_SUCCESS;
use winapi::um::winreg::{RegGetValueW, HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE, RRF_RT_REG_SZ};

const SPELUNKY_APP_ID: &str = "239350";

fn wide(text: &str) -> Vec<u16> {
    OsString::from(text)
        .encode_wide()
        .chain(Some(0))
        .collect()
}

fn registry_string(root: HKEY, key: &str, value: &str) -> Option<String> {
    let key = wide(key);
    let value = wide(value);
    let mut size: DWORD = 0;
    unsafe {
        if RegGetValueW(root, key.as_ptr(), value.as_ptr(), RRF_RT_REG_SZ, null_mut(), null_mut(), &mut size)
            != ERROR_SUCCESS as i32
        {
            return None;
        }
        let mut buffer = vec![0u16; size as usize / 2];
        if RegGetValueW(
            root,
            key.as_ptr(),
            value.as_ptr(),
            RRF_RT_REG_SZ,
            null_mut(),
            buffer.as_mut_ptr() as *mut _,
            &mut size,
        ) != ERROR_SUCCESS as i32
        {
            return None;
        }
        let len = buffer.iter().position(|&c| c == 0).unwrap_or(buffer.len());
        Some(OsString::from_wide(&buffer[..len]).to_string_lossy().into_owned())
    }
}

fn steam_dir() -> Option<PathBuf> {
    registry_string(HKEY_CURRENT_USER, "Software\\Valve\\Steam", "SteamPath")
        .or_else(|| {
            registry_string(
                HKEY_LOCAL_MACHINE,
                "SOFTWARE\\WOW6432Node\\Valve\\Steam",
                "InstallPath",
            )
        })
        .map(PathBuf::from)
}

/// The value of each `"key" "value"` line in a Steam .vdf or .acf file
fn vdf_values(contents: &str, key: &str) -> Vec<String> {
    let quoted = format!("\"{}\"", key);
    contents
        .lines()
        .filter_map(|line| {
            let rest = line.trim().strip_prefix(&quoted)?;
            let value = rest.trim().strip_prefix('"')?.strip_suffix('"')?;
            Some(value.replace("\\\\", "\\"))
        })
        .collect()
}

/// Steam's library folders, its own first
fn library_dirs(steam: &Path) -> Vec<PathBuf> {
    let mut dirs = vec![steam.to_path_buf()];
    if let Ok(contents) = fs::read_to_string(steam.join("steamapps").join("libraryfolders.vdf")) {
        dirs.extend(vdf_values(&contents, "path").into_iter().map(PathBuf::from));
    }
    dirs
}

/// The folder with Spelunky.exe, as installed by Steam
pub fn spelunky_dir() -> anyhow::Result<PathBuf> {
    let steam = steam_dir().context("Couldn't find Steam. Is it installed?")?;
    for library in library_dirs(&steam) {
        let steamapps = library.join("steamapps");
        let Ok(manifest) =
            fs::read_to_string(steamapps.join(format!("appmanifest_{}.acf", SPELUNKY_APP_ID)))
        else {
            continue;
        };
        let installdir = vdf_values(&manifest, "installdir")
            .into_iter()
            .next()
            .unwrap_or_else(|| "Spelunky".into());
        let dir = steamapps.join("common").join(installdir);
        if dir.join("Spelunky.exe").exists() {
            return Ok(dir);
        }
    }
    bail!("Couldn't find Spelunky HD in any Steam library. Is it installed?")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reads_vdf_values() {
        let vdf = "\"libraryfolders\"\n{\n\t\"0\"\n\t{\n\t\t\"path\"\t\t\"C:\\\\Program Files (x86)\\\\Steam\"\n\t}\n\t\"1\"\n\t{\n\t\t\"path\"\t\t\"D:\\\\SteamLibrary\"\n\t}\n}";
        assert_eq!(
            vdf_values(vdf, "path"),
            ["C:\\Program Files (x86)\\Steam", "D:\\SteamLibrary"]
        );
    }
}
