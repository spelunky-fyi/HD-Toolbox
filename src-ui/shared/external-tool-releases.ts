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
  assetFileNames: string[];
  pathKind: "file" | "folder";
  invokeCommand?: string;
  invokeParamName?: string;
  cachedReleases: Writable<Release[]>;
}) {
  const {
    releasesUrls,
    cacheDirName,
    assetFileNames,
    pathKind,
    invokeCommand,
    invokeParamName,
    cachedReleases,
  } = opts;

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

  function findRelease(
    releases: Release[],
    activeMethod: LoadMethod,
    selectedVersion: string
  ) {
    if (activeMethod == LoadMethod.SPECIFIC_VERSION) {
      return releases.find((release) => release.version == selectedVersion);
    }

    if (activeMethod == LoadMethod.LATEST) {
      return releases[0];
    }
  }

  async function checkAssetsExist(assetDirPath: string) {
    let entries;
    try {
      entries = await readDir(assetDirPath, { dir: BaseDirectory.App });
    } catch (error) {
      await createDir(assetDirPath, { recursive: true, dir: BaseDirectory.App });
      return false;
    }

    const names = entries.map((entry) => entry.name);
    return assetFileNames.every((name) => names.includes(name));
  }

  async function downloadAssets(release: Release, assetDirPath: string) {
    for (const [idx, name] of assetFileNames.entries()) {
      let response: Response<Uint8Array> = await fetch(
        release.downloadUrls[idx],
        { responseType: ResponseType.Binary, method: "GET", headers: { "User-Agent": "HD-Toolbox" } }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to download ${name} ${release.version}: ${response.status}`
        );
      }
      await writeBinaryFile(await join(assetDirPath, name), response.data, {
        dir: BaseDirectory.App,
      });
    }
  }

  // The absolute path of the chosen file or folder, downloading the release
  // first if it isn't already
  async function resolvePath(
    releases: Release[],
    activeMethod: LoadMethod,
    selectedVersion: string,
    selectedFile: string
  ) {
    if (activeMethod == LoadMethod.FILE) {
      return selectedFile;
    }

    const release = findRelease(releases, activeMethod, selectedVersion);
    if (!release) {
      throw new Error(`No release found for ${selectedVersion || "latest"}`);
    }

    const assetDirPath = await join(cacheDirName, "releases", release.version);
    if (!(await checkAssetsExist(assetDirPath))) {
      console.log("Assets didn't exist... Downloading!");
      await downloadAssets(release, assetDirPath);
    }

    const localDir = await join(await appDir(), assetDirPath);
    if (pathKind == "folder") {
      return localDir;
    }
    return await join(localDir, assetFileNames[0]);
  }

  async function launch(
    releases: Release[],
    activeMethod: LoadMethod,
    selectedVersion: string,
    selectedFile: string
  ) {
    const localPath = await resolvePath(
      releases,
      activeMethod,
      selectedVersion,
      selectedFile
    );

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

  // The url of each of assetFileNames in a release's assets, or null if any
  // are missing
  function findDownloadUrls(assets: any[]): string[] | null {
    const urls = assetFileNames.map((name) => {
      const match =
        assetFileNames.length == 1
          ? (asset) => (asset.browser_download_url ?? "").endsWith(
              "." + name.split(".").pop()
            )
          : (asset) => asset.name == name;
      return assets.find(match)?.browser_download_url;
    });
    return urls.every((url) => url) ? urls : null;
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

      const downloadUrls = findDownloadUrls(release.assets ?? []);
      if (!downloadUrls) {
        continue;
      }

      releases.push({
        version: release.tag_name,
        downloadUrls,
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

  return { cacheReleases, loadCachedReleases, resolvePath, launch };
}
