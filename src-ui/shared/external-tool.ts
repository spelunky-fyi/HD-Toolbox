import { writable } from "svelte/store";
import type { ExternalToolDefinition, ExternalToolInstance } from "./external-tool-types";
import { createExternalToolConfig } from "./external-tool-config";
import { createExternalToolReleases } from "./external-tool-releases";
import { createExternalToolDocs } from "./external-tool-docs";

export function createExternalTool(definition: ExternalToolDefinition): ExternalToolInstance {
  const cachedReleases = writable([]);
  const cachedDocs = writable("");

  const config = createExternalToolConfig(definition.configStoreName, cachedReleases);

  const releases = createExternalToolReleases({
    releasesUrls: definition.releasesUrls,
    cacheDirName: definition.cacheDirName,
    assetFileNames: definition.assetFileNames,
    pathKind: definition.pathKind ?? "file",
    invokeCommand: definition.invokeCommand,
    invokeParamName: definition.invokeParamName,
    cachedReleases,
  });

  const docs = createExternalToolDocs({
    docsUrl: definition.docsUrl,
    cacheDirName: definition.cacheDirName,
    cachedDocs,
  });

  return {
    definition,
    ...config,
    cachedReleases,
    cachedDocs,
    releases,
    docs,
  };
}
