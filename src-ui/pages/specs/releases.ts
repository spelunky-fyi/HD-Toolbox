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

const RELEASES_URL =
  "https://api.github.com/repos/spelunky-fyi/SpecsHD/releases";
const RELEASE_FILENAME = "releases.json";
const RELEASE_LAST_FILENAME = "releases.json.last";
const CACHE_TIMEOUT = 10 * 60 * 1000;

async function getCachePath() {
  const cachePath = await join("specs", "cache");
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

async function getDllDirectoryPath(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string
) {
  if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
    return await join("specs", "releases", selectedVersion);
  }

  if (activeMethod == LoadMethod.LATEST) {
    return await join("specs", "releases", cachedReleases[0].version);
  }
}

async function getDllPath(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string,
  selectedFile: string
) {
  if (activeMethod == LoadMethod.FILE) {
    return selectedFile;
  }

  if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
    return await join("specs", "releases", selectedVersion, "specs.dll");
  }

  if (activeMethod == LoadMethod.LATEST) {
    return await join(
      "specs",
      "releases",
      cachedReleases[0].version,
      "specs.dll"
    );
  }
}

async function checkDllExists(dllDirPath: string) {
  let entries;
  try {
    entries = await readDir(dllDirPath, { dir: BaseDirectory.App });
  } catch (error) {
    await createDir(dllDirPath, { recursive: true, dir: BaseDirectory.App });
    return false;
  }

  for (let entry of entries) {
    if (entry.name == "specs.dll") {
      return true;
    }
  }
  return false;
}

async function downloadDll(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string,
  localDllPath: string
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
  await writeBinaryFile(localDllPath, response.data, {
    dir: BaseDirectory.App,
  });
}

async function launchSpecs(
  cachedReleases: Release[],
  activeMethod: LoadMethod,
  selectedVersion: string,
  selectedFile: string
) {
  let localDll = await getDllPath(
    cachedReleases,
    activeMethod,
    selectedVersion,
    selectedFile
  );

  if (
    activeMethod == LoadMethod.LATEST ||
    activeMethod == LoadMethod.SPECIFIC_VERSION
  ) {
    const dllDirPath = await getDllDirectoryPath(
      cachedReleases,
      activeMethod,
      selectedVersion
    );
    if (!(await checkDllExists(dllDirPath))) {
      console.log("DLL Didn't exist... Downloading!");
      await downloadDll(
        cachedReleases,
        activeMethod,
        selectedVersion,
        localDll
      );
    }
    localDll = await join(await appDir(), localDll);
  }

  invoke("inject_specs", { dll: localDll })
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
      if ((asset.browser_download_url ?? "").endsWith(".dll")) {
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
  launchSpecs,
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

    let data: Response<string> = await fetch(RELEASES_URL, {
      responseType: ResponseType.Text,
      method: "GET",
    });

    await writeTextFile(cacheFilePath, data.data, {
      dir: BaseDirectory.App,
    });
    await writeLastCacheTimestamp(cachePath);
    await loadCachedReleases();
  },
};
