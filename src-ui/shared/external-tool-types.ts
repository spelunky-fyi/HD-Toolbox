import type { Writable, Readable } from "svelte/store";

export type Release = {
  version: string;
  downloadUrl: string;
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
  assetFileName: string;
  invokeCommand: string;
  invokeParamName: string;
  configStoreName: string;
  fileFilterLabel: string;
  fileFilterExtensions: string[];
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
