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
  type: string;
  data: any;
}

export class Task {
  taskName: string;
  taskStateStore: Writable<TaskState>;
  taskDataStore: Writable<any>;
  taskFailureStore: Writable<string>;

  unlistener: UnlistenFn = null;

  constructor(
    taskName: string,
    taskStateStore: Writable<TaskState>,
    taskDataStore?: Writable<any>,
    taskFailureStore?: Writable<string>
  ) {
    this.taskName = taskName;
    this.taskStateStore = taskStateStore;
    this.taskDataStore = taskDataStore;
    this.taskFailureStore = taskFailureStore;
  }
  start(options: {} = {}) {
    listen(`task-state:${this.taskName}`, (event) => {
      let payload: RemoteTaskState = <RemoteTaskState>event.payload;

      if (payload.type !== this.taskName || !payload.data) {
        console.error(
          "Malformed or unexpected message...",
          this.taskName,
          payload
        );
        return;
      }

      let data = payload.data;
      if (data.type == "Failure") {
        if (this.taskFailureStore) {
          this.taskFailureStore.set(data.data);
        }
        this.taskStateStore.set(TaskState.Pending);
      } else if (data.type == this.taskName) {
        if (this.taskDataStore) {
          this.taskDataStore.set(data.data);
        }
        this.taskStateStore.set(TaskState.Connected);
      } else {
        console.error("Got unexpected message...", data);
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

export const musicEngineState = writable(TaskState.Disconnected);
export const musicEngineFailMessage = writable("");

export const autoFixerState = writable(TaskState.Disconnected);

const memoryUpdaterDefault = {
  camera_speed: 0,
  chars: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};
export const memoryUpdaterState = writable(TaskState.Disconnected);
export const memoryUpdaterData = writable({ ...memoryUpdaterDefault });
