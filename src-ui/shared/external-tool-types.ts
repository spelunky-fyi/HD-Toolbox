import type { Writable, Readable } from "svelte/store";

export type Release = {
  version: string;
  // One per entry of assetFileNames, in the same order
  downloadUrls: string[];
};

export enum LoadMethod {
  LATEST = 0,
  SPECIFIC_VERSION = 1,
  FILE = 2,
}

export type ExternalToolDefinition = {
  title: string;
  releasesUrls: string[];
  docsUrl: string;
  docsRepoUrl: string;
  cacheDirName: string;
  // Every file a release must have. A single asset is matched by extension
  // so it can be saved under a different name than it's published as.
  assetFileNames: string[];
  // "folder" picks and launches with the directory holding the assets
  pathKind?: "file" | "folder";
  invokeCommand?: string;
  invokeParamName?: string;
  configStoreName: string;
  fileFilterLabel?: string;
  fileFilterExtensions?: string[];
  chooseFileLabel: string;
  helpTexts: {
    latest: string;
    specificVersion: string;
    file: string;
  };
};

export type ExternalToolInstance = {
  definition: ExternalToolDefinition;
  configLoaded: Writable<boolean>;
  activeMethod: Writable<LoadMethod>;
  selectedVersion: Writable<string>;
  selectedFile: Writable<string>;
  cachedReleases: Writable<Release[]>;
  cachedDocs: Writable<string>;
  launchable: Readable<boolean>;
  releases: {
    cacheReleases: (force?: boolean) => Promise<void>;
    loadCachedReleases: () => Promise<void>;
    resolvePath: (
      cachedReleases: Release[],
      activeMethod: LoadMethod,
      selectedVersion: string,
      selectedFile: string
    ) => Promise<string>;
    launch: (
      cachedReleases: Release[],
      activeMethod: LoadMethod,
      selectedVersion: string,
      selectedFile: string
    ) => Promise<void>;
  };
  docs: {
    cacheDocs: (force?: boolean) => Promise<void>;
    loadDocs: () => Promise<void>;
  };
};
