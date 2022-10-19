import {
  BaseDirectory,
  createDir,
  readDir,
  readTextFile,
  writeBinaryFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { join, appDir } from "@tauri-apps/api/path";
import { fetch, Response, ResponseType } from "@tauri-apps/api/http";
import { LoadMethod } from "./config";
import { cachedReleases, type Release } from "./stores";
import { invoke } from "@tauri-apps/api/tauri";

const RELEASES_URLS = [
  "https://api.github.com/repos/spelunky-fyi/Frozlunky/releases",
  "https://api.github.com/repos/sashavol/Frozlunky/releases",
];
const RELEASE_FILENAME = "releases.json";
const RELEASE_LAST_FILENAME = "releases.json.last";
const CACHE_TIMEOUT = 10 * 60 * 1000;

async function getCachePath() {
  const cachePath = await join("frozlunky", "cache");
  await createDir(cachePath, { recursive: true, dir: BaseDirectory.App });
  return cachePath;
}

async function getLastCacheTimestamp(cachePath?: string) {
  if (!cachePath) {
    cachePath = await getCachePath();
  }

  const cacheTimestampPath = await join(cachePath, RELEASE_LAST_FILENAME);
  let contents;
  try {
    contents = await readTextFile(cacheTimestampPath, {
      dir: BaseDirectory.App,
    });
  } catch (error) {
    console.log("No cached timestamp.");
    return 0;
  }
  return parseInt(contents.trim(), 10);
}

async function getExeDirectoryPath(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string
) {
  if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
    return await join("frozlunky", "releases", selectedVersion);
  }

  if (activeMethod == LoadMethod.LATEST) {
    return await join("frozlunky", "releases", cachedReleases[0].version);
  }
}

async function getExePath(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string,
  selectedFile: string
) {
  if (activeMethod == LoadMethod.FILE) {
    return selectedFile;
  }

  if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
    return await join("frozlunky", "releases", selectedVersion, "Frozlunky.exe");
  }

  if (activeMethod == LoadMethod.LATEST) {
    return await join(
      "frozlunky",
      "releases",
      cachedReleases[0].version,
      "Frozlunky.exe"
    );
  }
}

async function checkExeExists(exeDirPath: string) {
  let entries;
  try {
    entries = await readDir(exeDirPath, { dir: BaseDirectory.App });
  } catch (error) {
    await createDir(exeDirPath, { recursive: true, dir: BaseDirectory.App });
    return false;
  }

  for (let entry of entries) {
    if (entry.name == "Frozlunky.exe") {
      return true;
    }
  }
  return false;
}

async function downloadExe(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string,
  localExePath: string
) {
  let downloadRelease;
  if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
    for (let release of cachedReleases) {
      if (release.version == selectedVersion) {
        downloadRelease = release;
        break;
      }
    }
  } else if (activeMethod == LoadMethod.LATEST) {
    downloadRelease = cachedReleases[0];
  }

  if (!downloadRelease) {
    return;
  }

  let response: Response<Uint8Array> = await fetch(
    downloadRelease.downloadUrl,
    { responseType: ResponseType.Binary, method: "GET" }
  );
  await writeBinaryFile(localExePath, response.data, {
    dir: BaseDirectory.App,
  });
}

async function launchFrozlunky(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string,
  selectedFile: string
) {
  let localExe = await getExePath(
    cachedReleases,
    activeMethod,
    selectedVersion,
    selectedFile
  );

  if (
    activeMethod == LoadMethod.LATEST ||
    activeMethod == LoadMethod.SPECIFIC_VERSION
  ) {
    const exeDirPath = await getExeDirectoryPath(
      cachedReleases,
      activeMethod,
      selectedVersion
    );
    if (!(await checkExeExists(exeDirPath))) {
      console.log("EXE Didn't exist... Downloading!");
      await downloadExe(
        cachedReleases,
        activeMethod,
        selectedVersion,
        localExe
      );
    }
    localExe = await join(await appDir(), localExe);
  }

  invoke("launch_frozlunky", { exe: localExe })
    .then((msg) => console.log("Success"))
    .catch((err) => console.log("Error:", err));
}

async function writeLastCacheTimestamp(cachePath?: string) {
  if (!cachePath) {
    cachePath = await getCachePath();
  }

  const cacheTimestampPath = await join(cachePath, RELEASE_LAST_FILENAME);
  const now = new Date().getTime();
  await writeTextFile(cacheTimestampPath, now.toString(), {
    dir: BaseDirectory.App,
  });
}

async function loadCachedReleases() {
  const cachePath = await getCachePath();
  const cacheFilePath = await join(cachePath, RELEASE_FILENAME);
  const contents = await readTextFile(cacheFilePath, {
    dir: BaseDirectory.App,
  });

  const data = JSON.parse(contents);
  let releases: Release[] = [];

  for (let release of data) {
    if ((release.draft ?? true) || (release.prerelease ?? true)) {
      continue;
    }

    if (!release.tag_name) {
      continue;
    }

    let downloadUrl = null;
    for (let asset of release.assets ?? []) {
      if ((asset.browser_download_url ?? "").endsWith(".exe")) {
        downloadUrl = asset.browser_download_url;
        break;
      }
    }
    if (!downloadUrl) {
      continue;
    }

    releases.push({
      version: release.tag_name,
      downloadUrl: downloadUrl,
    });
  }

  cachedReleases.set(releases);
}

export default {
  launchFrozlunky,
  loadCachedReleases,
  cacheReleases: async (force?: boolean) => {
    const cachePath = await getCachePath();
    const cacheFilePath = await join(cachePath, RELEASE_FILENAME);

    if (!force) {
      const now = new Date().getTime();
      const lastCache = await getLastCacheTimestamp(cachePath);
      if (now - lastCache < CACHE_TIMEOUT) {
        console.log(
          "Attempted to download too recently. Run with force to override the timeout."
        );
        return;
      }
    }

    let releases = [];

    for (const release_url of RELEASES_URLS) {
      let data: Response<string> = await fetch(release_url, {
        responseType: ResponseType.Text,
        method: "GET",
      });
      releases.push(...JSON.parse(data.data));
    }

    await writeTextFile(cacheFilePath, JSON.stringify(releases), {
      dir: BaseDirectory.App,
    });
    await writeLastCacheTimestamp(cachePath);
    await loadCachedReleases();
  },
};
