// Puts hd-seed-search's binaries in src-tauri/resources/seed-search/ for the
// app to bundle. The Seed Search tab runs them to generate levels.
//
// Downloads the pinned release from spelunky-fyi/hd-seed-search, or copies
// them from a local build when HD_SEED_SEARCH_BUILD is set to its
// build/Release folder.

import { copyFileSync, createWriteStream, mkdirSync, renameSync, rmSync } from "fs";
import { get } from "https";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const VERSION = "v0.1.0";
const RELEASE = `https://github.com/spelunky-fyi/hd-seed-search/releases/download/${VERSION}`;
const FILES = ["hd-seed-search.exe", "hd-seed-search-hook.dll"];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "src-tauri", "resources", "seed-search");

// Follows GitHub's redirect to where the asset is stored
function download(url, path) {
  return new Promise((resolve, reject) => {
    get(url, { headers: { "User-Agent": "hd-toolbox-build" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        download(res.headers.location, path).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`${url}: HTTP ${res.statusCode}`));
        return;
      }
      const partial = `${path}.partial`;
      const file = createWriteStream(partial);
      res.pipe(file);
      file.on("finish", () => file.close(() => {
        renameSync(partial, path);
        resolve();
      }));
      file.on("error", (err) => {
        rmSync(partial, { force: true });
        reject(err);
      });
    }).on("error", reject);
  });
}

mkdirSync(dest, { recursive: true });
const localBuild = process.env.HD_SEED_SEARCH_BUILD;
for (const name of FILES) {
  if (localBuild) {
    copyFileSync(join(localBuild, name), join(dest, name));
    console.log(`copied ${name} from ${localBuild}`);
  } else {
    await download(`${RELEASE}/${name}`, join(dest, name));
    console.log(`downloaded ${name} ${VERSION}`);
  }
}
