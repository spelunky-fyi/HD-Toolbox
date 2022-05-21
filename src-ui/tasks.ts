import { derived, Writable, writable } from "svelte/store";

export const enum TaskState {
  Disconnected,
  Pending,
  Connected,
}

export type RemoteTaskState = {
  type: "Connected" | "Pending";
};

export const trackersState = writable(TaskState.Disconnected);
export const trackersFailMessage = writable("");

export const autoFixerState = writable(TaskState.Disconnected);
export const autoFixerFailMessage = writable("");

export const memoryUpdaterState = writable(TaskState.Disconnected);
export const memoryUpdaterFailMessage = writable("");
