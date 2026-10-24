import { createExternalTool } from "@hdt/shared/external-tool";
import type { ExternalToolDefinition } from "@hdt/shared/external-tool-types";

const seedSearchDefinition: ExternalToolDefinition = {
  title: "hd-seed-search",
  releasesUrls: [
    "https://api.github.com/repos/spelunky-fyi/hd-seed-search/releases",
  ],
  docsUrl:
    "https://raw.githubusercontent.com/spelunky-fyi/hd-seed-search/main/README.md",
  docsRepoUrl:
    "https://github.com/spelunky-fyi/hd-seed-search/blob/main/README.md",
  cacheDirName: "seed-search",
  assetFileNames: ["hd-seed-search.exe", "hd-seed-search-hook.dll"],
  pathKind: "folder",
  configStoreName: "seed-search.config",
  chooseFileLabel: "Choose Folder",
  helpTexts: {
    latest:
      "Always use the most recent version of hd-seed-search. You can hit refresh to check if new versions are available.",
    specificVersion:
      "Choose a specific version of hd-seed-search. You can hit refresh to check if new versions are available.",
    file:
      "Browse to a folder with hd-seed-search.exe and hd-seed-search-hook.dll, such as its build/Release folder. Useful for development. Not typical for most users.",
  },
};

export const seedSearchTool = createExternalTool(seedSearchDefinition);
