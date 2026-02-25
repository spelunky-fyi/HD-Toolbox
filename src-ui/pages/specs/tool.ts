import { createExternalTool } from "@hdt/shared/external-tool";
import type { ExternalToolDefinition } from "@hdt/shared/external-tool-types";

const specsDefinition: ExternalToolDefinition = {
  title: "Specs HD",
  releasesUrls: ["https://api.github.com/repos/spelunky-fyi/SpecsHD/releases"],
  docsUrl:
    "https://raw.githubusercontent.com/spelunky-fyi/SpecsHD/main/DOCS.md",
  docsRepoUrl: "https://github.com/spelunky-fyi/SpecsHD/blob/main/DOCS.md",
  cacheDirName: "specs",
  assetFileName: "specs.dll",
  invokeCommand: "inject_dll",
  invokeParamName: "dll",
  configStoreName: "specs.config",
  fileFilterLabel: "Specs DLL",
  fileFilterExtensions: ["dll"],
  chooseFileLabel: "Choose DLL",
  helpTexts: {
    latest:
      "Always use the most recent version of Specs HD. You can hit refresh to check if new versions are available.",
    specificVersion:
      "Choose a specific version of Specs HD. You can hit refresh to check if new versions are available.",
    file:
      "Browse to a local dll. This is useful for development or if you downloaded a version manually. Not typical for most users.",
  },
};

export const specsTool = createExternalTool(specsDefinition);
