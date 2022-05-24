import { writable } from "svelte/store";
import { HDWebSocket, WebSocketState } from "../websockets";

export const state = writable(WebSocketState.Pending);
export const data = writable(null);

export const ws = new HDWebSocket("pacifist", "Pacifist", state, data);
