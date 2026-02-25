import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { fetch, Response, ResponseType } from "@tauri-apps/api/http";
import type { Writable } from "svelte/store";

const DOCS_FILENAME = "DOCS.md";
const DOCS_LAST_FILENAME = "DOCS.md.last";
const CACHE_TIMEOUT = 10 * 60 * 1000;

export function createExternalToolDocs(opts: {
  docsUrl: string;
  cacheDirName: string;
  cachedDocs: Writable<string>;
}) {
  const { docsUrl, cacheDirName, cachedDocs } = opts;

  async function getCachePath() {
    const cachePath = await join(cacheDirName, "cache");
    await createDir(cachePath, { recursive: true, dir: BaseDirectory.App });
    return cachePath;
  }

  async function getLastCacheTimestamp(cachePath?: string) {
    if (!cachePath) {
      cachePath = await getCachePath();
    }

    const cacheTimestampPath = await join(cachePath, DOCS_LAST_FILENAME);
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

  async function writeLastCacheTimestamp(cachePath?: string) {
    if (!cachePath) {
      cachePath = await getCachePath();
    }

    const cacheTimestampPath = await join(cachePath, DOCS_LAST_FILENAME);
    const now = new Date().getTime();
    await writeTextFile(cacheTimestampPath, now.toString(), {
      dir: BaseDirectory.App,
    });
  }

  async function loadDocs() {
    const cachePath = await getCachePath();
    const cacheFilePath = await join(cachePath, DOCS_FILENAME);
    const contents = await readTextFile(cacheFilePath, {
      dir: BaseDirectory.App,
    });

    cachedDocs.set(contents);
  }

  async function cacheDocs(force?: boolean) {
    const cachePath = await getCachePath();
    const cacheFilePath = await join(cachePath, DOCS_FILENAME);

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

    let data: Response<string> = await fetch(docsUrl, {
      responseType: ResponseType.Text,
      method: "GET",
      headers: { "User-Agent": "HD-Toolbox" },
    });

    if (!data.ok) {
      console.error(`Failed to fetch docs: ${data.status}`);
      return;
    }

    await writeTextFile(cacheFilePath, data.data, {
      dir: BaseDirectory.App,
    });
    await writeLastCacheTimestamp(cachePath);
    await loadDocs();
  }

  return { cacheDocs, loadDocs };
}
