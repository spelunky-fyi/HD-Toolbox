import type { RoomFlags, RoomType } from "./enums";

export interface Room {
  name: string;
  data: string;
  notes?: string;
  type: RoomType;
  flags?: RoomFlags[];
}

export interface RoomKind {
  name: string;
  notes?: string;
  rooms: Room[];
}

export interface Chunk {
  data: string;
  notes?: string;
}

export interface Chunks {
  door?: Chunk[];
  ground?: Chunk[];
  air?: Chunk[];
  vine?: Chunk[];
  ice?: Chunk[];
  temple?: Chunk[];
}

export interface Level {
  rooms: RoomKind[];
  chunks: Chunks;
}

export interface LevelConfig {
  name: string;
  data: Level;
  bg: string;
}

export interface TileContext {
  here: string;
  above: string;
  below: string;
  area: string;
  roomType: RoomType;
  roomFlags: RoomFlags[];
}
