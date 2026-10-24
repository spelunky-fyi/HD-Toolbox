import { createExternalTool } from "@hdt/shared/external-tool";
import type { ExternalToolDefinition } from "@hdt/shared/external-tool-types";

const frozlunkyDefinition: ExternalToolDefinition = {
  title: "Frozlunky",
  releasesUrls: [
    "https://api.github.com/repos/spelunky-fyi/Frozlunky/releases",
    "https://api.github.com/repos/sashavol/Frozlunky/releases",
  ],
  docsUrl:
    "https://raw.githubusercontent.com/spelunky-fyi/Frozlunky/main/docs/DOCS.md",
  docsRepoUrl:
    "https://github.com/spelunky-fyi/Frozlunky/blob/main/docs/DOCS.md",
  cacheDirName: "frozlunky",
  assetFileNames: ["Frozlunky.exe"],
  invokeCommand: "launch_frozlunky",
  invokeParamName: "exe",
  configStoreName: "frozlunky.config",
  fileFilterLabel: "Frozlunky",
  fileFilterExtensions: ["exe"],
  chooseFileLabel: "Choose EXE",
  helpTexts: {
    latest:
      "Always use the most recent version of Frozlunky. You can hit refresh to check if new versions are available.",
    specificVersion:
      "Choose a specific version of Frozlunky. You can hit refresh to check if new versions are available.",
    file:
      "Browse to a local exe. This is useful for development or if you downloaded a version manually. Not typical for most users.",
  },
};

export const frozlunkyTool = createExternalTool(frozlunkyDefinition);
