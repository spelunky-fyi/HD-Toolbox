import { createExternalTool } from "@hdt/shared/external-tool";
import type { ExternalToolDefinition } from "@hdt/shared/external-tool-types";

const webDefinition: ExternalToolDefinition = {
  title: "Web HD",
  releasesUrls: ["https://api.github.com/repos/spelunky-fyi/WebHD/releases"],
  docsUrl:
    "https://raw.githubusercontent.com/spelunky-fyi/WebHD/main/DOCS.md",
  docsRepoUrl: "https://github.com/spelunky-fyi/WebHD/blob/main/DOCS.md",
  cacheDirName: "web",
  assetFileName: "web.dll",
  invokeCommand: "inject_dll",
  invokeParamName: "dll",
  configStoreName: "web.config",
  fileFilterLabel: "Web DLL",
  fileFilterExtensions: ["dll"],
  chooseFileLabel: "Choose DLL",
  helpTexts: {
    latest:
      "Always use the most recent version of Web HD. You can hit refresh to check if new versions are available.",
    specificVersion:
      "Choose a specific version of Web HD. You can hit refresh to check if new versions are available.",
    file:
      "Browse to a local dll. This is useful for development or if you downloaded a version manually. Not typical for most users.",
  },
};

export const webTool = createExternalTool(webDefinition);
