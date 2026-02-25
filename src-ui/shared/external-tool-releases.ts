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
import { invoke } from "@tauri-apps/api/tauri";
import type { Writable } from "svelte/store";
import { LoadMethod, type Release } from "./external-tool-types";

const RELEASE_FILENAME = "releases.json";
const RELEASE_LAST_FILENAME = "releases.json.last";
const CACHE_TIMEOUT = 10 * 60 * 1000;

export function createExternalToolReleases(opts: {
  releasesUrls: string[];
  cacheDirName: string;
  assetFileName: string;
  invokeCommand: string;
  invokeParamName: string;
  cachedReleases: Writable<Release[]>;
}) {
  const { releasesUrls, cacheDirName, assetFileName, invokeCommand, invokeParamName, cachedReleases } = opts;
  const assetExtension = "." + assetFileName.split(".").pop();

  async function getCachePath() {
    const cachePath = await join(cacheDirName, "cache");
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

  async function getAssetDirectoryPath(
    releases: Release[],
    activeMethod: LoadMethod,
    selectedVersion: string
  ) {
    if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
      return await join(cacheDirName, "releases", selectedVersion);
    }

    if (activeMethod == LoadMethod.LATEST) {
      return await join(cacheDirName, "releases", releases[0].version);
    }
  }

  async function getAssetPath(
    releases: Release[],
    activeMethod: LoadMethod,
    selectedVersion: string,
    selectedFile: string
  ) {
    if (activeMethod == LoadMethod.FILE) {
      return selectedFile;
    }

    if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
      return await join(cacheDirName, "releases", selectedVersion, assetFileName);
    }

    if (activeMethod == LoadMethod.LATEST) {
      return await join(
        cacheDirName,
        "releases",
        releases[0].version,
        assetFileName
      );
    }
  }

  async function checkAssetExists(assetDirPath: string) {
    let entries;
    try {
      entries = await readDir(assetDirPath, { dir: BaseDirectory.App });
    } catch (error) {
      await createDir(assetDirPath, { recursive: true, dir: BaseDirectory.App });
      return false;
    }

    for (let entry of entries) {
      if (entry.name == assetFileName) {
        return true;
      }
    }
    return false;
  }

  async function downloadAsset(
    releases: Release[],
    activeMethod: LoadMethod,
    selectedVersion: string,
    localAssetPath: string
  ) {
    let downloadRelease;
    if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
      for (let release of releases) {
        if (release.version == selectedVersion) {
          downloadRelease = release;
          break;
        }
      }
    } else if (activeMethod == LoadMethod.LATEST) {
      downloadRelease = releases[0];
    }

    if (!downloadRelease) {
      return;
    }

    let response: Response<Uint8Array> = await fetch(
      downloadRelease.downloadUrl,
      { responseType: ResponseType.Binary, method: "GET", headers: { "User-Agent": "HD-Toolbox" } }
    );
    await writeBinaryFile(localAssetPath, response.data, {
      dir: BaseDirectory.App,
    });
  }

  async function launch(
    releases: Release[],
    activeMethod: LoadMethod,
    selectedVersion: string,
    selectedFile: string
  ) {
    let localPath = await getAssetPath(
      releases,
      activeMethod,
      selectedVersion,
      selectedFile
    );

    if (
      activeMethod == LoadMethod.LATEST ||
      activeMethod == LoadMethod.SPECIFIC_VERSION
    ) {
      const assetDirPath = await getAssetDirectoryPath(
        releases,
        activeMethod,
        selectedVersion
      );
      if (!(await checkAssetExists(assetDirPath))) {
        console.log("Asset didn't exist... Downloading!");
        await downloadAsset(
          releases,
          activeMethod,
          selectedVersion,
          localPath
        );
      }
      localPath = await join(await appDir(), localPath);
    }

    invoke(invokeCommand, { [invokeParamName]: localPath })
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
        if ((asset.browser_download_url ?? "").endsWith(assetExtension)) {
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

  async function cacheReleases(force?: boolean) {
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

    let allReleases = [];

    for (const releasesUrl of releasesUrls) {
      let data: Response<string> = await fetch(releasesUrl, {
        responseType: ResponseType.Text,
        method: "GET",
        headers: { "User-Agent": "HD-Toolbox" },
      });

      if (!data.ok) {
        console.error(`Failed to fetch releases from ${releasesUrl}: ${data.status}`);
        continue;
      }

      allReleases.push(...JSON.parse(data.data));
    }

    if (allReleases.length === 0) {
      return;
    }

    await writeTextFile(cacheFilePath, JSON.stringify(allReleases), {
      dir: BaseDirectory.App,
    });
    await writeLastCacheTimestamp(cachePath);
    await loadCachedReleases();
  }

  return { cacheReleases, loadCachedReleases, launch };
}
