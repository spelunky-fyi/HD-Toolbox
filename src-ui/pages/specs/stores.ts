import { writable, type Writable } from "svelte/store";

export type Release = {
  version: string;
  downloadUrl: string;
};

export const cachedReleases: Writable<Release[]> = writable([]);
