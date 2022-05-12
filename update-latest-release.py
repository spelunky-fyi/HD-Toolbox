import json
from urllib.request import urlopen

with urlopen(
    "https://api.github.com/repos/spelunky-fyi/HD-Toolbox/releases/latest"
) as handle:
    data = json.load(handle)


version = data["tag_name"]
pub_date = data["published_at"]

for asset in data["assets"]:
    url = asset["browser_download_url"]
    if url.endswith(".msi.zip.sig"):
        with urlopen(url) as handle:
            sig = handle.read().decode()

    elif url.endswith(".msi.zip"):
        download_url = url

print(
    json.dumps(
        {
            "version": version,
            "notes": "",
            "pub_date": pub_date,
            "platforms": {
                "windows-x86_64": {
                    "signature": sig,
                    "url": download_url,
                }
            },
        },
        indent=2,
    )
)
