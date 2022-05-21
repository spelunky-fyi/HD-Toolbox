import { writable } from "svelte/store";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import type { Writable } from "svelte/store";
import type { UnlistenFn } from "@tauri-apps/api/event";

export const enum TaskState {
  Disconnected,
  Pending,
  Connected,
}

export interface RemoteTaskState {
  type: "Connected" | "Pending";
}

export class Task {
  taskName: string;
  taskStateStore: Writable<TaskState>;

  unlistener: UnlistenFn = null;

  constructor(taskName: string, taskStateStore: Writable<TaskState>) {
    this.taskName = taskName;
    this.taskStateStore = taskStateStore;
  }

  start(options: {} = {}) {
    listen(`task-state:${this.taskName}`, (event) => {
      let payload: RemoteTaskState = <RemoteTaskState>event.payload;
      if (payload.type == "Connected") {
        this.taskStateStore.set(TaskState.Connected);
      }
    }).then((unlistenFunc) => {
      this.unlistener = unlistenFunc;
    });
    this.taskStateStore.set(TaskState.Pending);
    invoke("start_task", {
      task: { ...options, type: this.taskName },
    });
  }

  stop() {
    this.unlistener && this.unlistener();
    this.taskStateStore.set(TaskState.Disconnected);
    invoke("stop_task", { task: { type: this.taskName } });
  }
}

export const trackersState = writable(TaskState.Disconnected);
export const trackersFailMessage = writable("");

export const autoFixerState = writable(TaskState.Disconnected);
export const autoFixerFailMessage = writable("");

export const memoryUpdaterState = writable(TaskState.Disconnected);
export const memoryUpdaterFailMessage = writable("");
