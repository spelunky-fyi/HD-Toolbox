import type { Writable } from "svelte/store";
import { get } from "svelte/store";

const backoff = 1000;

export const enum WebSocketState {
  Pending,
  Connected,
}

export class HDWebSocket {
  name: string;
  payloadKey: string;
  stateStore: Writable<WebSocketState>;
  dataStore: Writable<any>;
  ws?: WebSocket;

  constructor(
    name: string,
    payloadKey: string,
    stateStore: Writable<WebSocketState>,
    dataStore: Writable<WebSocketState>
  ) {
    this.name = name;
    this.payloadKey = payloadKey;
    this.stateStore = stateStore;
    this.dataStore = dataStore;

    this.connect();
  }

  connect() {
    this.ws = new WebSocket(`ws://${location.host}/ws/${this.name}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type == this.payloadKey) {
        this.stateStore.set(WebSocketState.Connected);
        this.dataStore.set(data.data);
      } else if (
        data.type == "Failure" &&
        get(this.stateStore) == WebSocketState.Connected
      ) {
        this.stateStore.set(WebSocketState.Pending);
        this.dataStore.set(null);
      } else {
        console.error("Unknown data", data);
      }
    };

    this.ws.onclose = (event) => {
      this.ws = null;
      console.log("Websocket server went away...", event.reason);
      this.stateStore.set(WebSocketState.Pending);
      setTimeout(() => this.connect(), backoff);
    };

    this.ws.onerror = (err) => {
      console.error("Socket encountered error: ", err, "Closing socket");
      this.ws.close();
    };
  }
}
