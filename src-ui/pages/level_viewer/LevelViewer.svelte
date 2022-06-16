<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";

  import levels from "@hdt/pages/level_viewer/levels";
  import tiles from "@hdt/pages/level_viewer/tiles";
  import { images } from "@hdt/images";
  import { RoomFlags, RoomType } from "./enums";
  import type { Room, TileContext } from "./types";

  let canvas;
  let ctx;
  let areaIndex = 0;
  let typeAndRoomIndex = "rooms,0,0";
  let currentRoomType = getCurrentRoomType();
  let currentLevel = getCurrentLevel();
  let levelChunks = getChunks();
  let usableChunks = [];
  let finalLevelFormat = "".padStart(80, "0");
  let formattedLevel = formatLevelString(currentLevel.data);
  let rectHeight = 64;
  let rectWidth = 64;

  const chunkCodes = ["5", "6", "8", "V", "F"];

  function getNameOfChunk(tileCode) {
    switch (tileCode) {
      case "5":
        return "ground";
      case "6":
        return "air";
      case "8":
        return "door";
      case "V":
        return "vine";
      case "F":
        return "ice";
    }
  }

  function initChunks() {
    usableChunks = [];
    let room = currentLevel.data.split("");

    room.forEach((value, idx) => {
      // Chunk Tile Codes
      if (!chunkCodes.includes(value)) {
        return;
      }

      emptyChunk(room, value, idx);

      const type_ = getNameOfChunk(value);
      usableChunks.push({
        index: null,
        type: type_.toUpperCase(),
        chunks: levels[areaIndex].data.chunks[type_] ?? [],
      });
    });

    finalLevelFormat = room.join("");
  }

  function emptyChunk(room, type, idx) {
    room[idx + 0] = type;
    room[idx + 1] = 0;
    room[idx + 2] = 0;
    if (type !== "F") {
      room[idx + 3] = 0;
      room[idx + 4] = 0;
    }

    room[idx + 10 + 0] = 0;
    room[idx + 10 + 1] = 0;
    room[idx + 10 + 2] = 0;
    if (type !== "F") {
      room[idx + 10 + 3] = 0;
      room[idx + 10 + 4] = 0;
    }

    room[idx + 20 + 0] = 0;
    room[idx + 20 + 1] = 0;
    room[idx + 20 + 2] = 0;
    if (type !== "F") {
      room[idx + 20 + 3] = 0;
      room[idx + 20 + 4] = 0;
    }

    if (type === "V") {
      room[idx + 30 + 0] = 0;
      room[idx + 30 + 1] = 0;
      room[idx + 30 + 2] = 0;
      room[idx + 30 + 3] = 0;
      room[idx + 30 + 4] = 0;
    }
  }

  function updateChunks() {
    let room = currentLevel.data.split("");
    let chunkIdx = 0;
    room.forEach((value, idx) => {
      // Chunk Tile Codes
      if (!chunkCodes.includes(value)) {
        return;
      }

      if (usableChunks[chunkIdx].index === null) {
        emptyChunk(room, value, idx);
        chunkIdx++;
        return;
      }

      let chunk =
        usableChunks[chunkIdx].chunks[usableChunks[chunkIdx].index].data.split(
          ""
        );

      let tileIdx = 0;

      room[idx + 0] = chunk[tileIdx++];
      room[idx + 1] = chunk[tileIdx++];
      room[idx + 2] = chunk[tileIdx++];
      if (value !== "F") {
        room[idx + 3] = chunk[tileIdx++];
        room[idx + 4] = chunk[tileIdx++];
      }

      room[idx + 10 + 0] = chunk[tileIdx++];
      room[idx + 10 + 1] = chunk[tileIdx++];
      room[idx + 10 + 2] = chunk[tileIdx++];
      if (value !== "F") {
        room[idx + 10 + 3] = chunk[tileIdx++];
        room[idx + 10 + 4] = chunk[tileIdx++];
      }

      room[idx + 20 + 0] = chunk[tileIdx++];
      room[idx + 20 + 1] = chunk[tileIdx++];
      room[idx + 20 + 2] = chunk[tileIdx++];
      if (value !== "F") {
        room[idx + 20 + 3] = chunk[tileIdx++];
        room[idx + 20 + 4] = chunk[tileIdx++];
      }

      if (value == "V") {
        room[idx + 30 + 0] = chunk[tileIdx++];
        room[idx + 30 + 1] = chunk[tileIdx++];
        room[idx + 30 + 2] = chunk[tileIdx++];
        room[idx + 30 + 3] = chunk[tileIdx++];
        room[idx + 30 + 4] = chunk[tileIdx++];
      }
      chunkIdx++;
    });

    finalLevelFormat = room.join("");
  }

  function drawTileLabel(
    x: number,
    y: number,
    label: string,
    width?: number,
    height?: number
  ) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff";

    ctx.beginPath();
    ctx.rect(x, y, width ?? rectWidth, height ?? rectHeight);
    ctx.stroke();

    ctx.font = "20px Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";

    ctx.fillText(
      label,
      x + (width ?? rectWidth) / 2,
      y + (height ?? rectHeight) / 2
    );
  }

  function formatLevelString(levelStr: string) {
    let out = levelStr;

    if (levelStr.length == 9) {
      out = levelStr.match(/.{3}/g).join("\n");
    } else if (levelStr.length == 15 || levelStr.length == 20) {
      out = levelStr.match(/.{5}/g).join("\n");
    } else if (levelStr.length == 80 || levelStr.length == 79) {
      out = levelStr.match(/.{10}/g).join("\n");
      if (out.length == 76) {
        out = out.concat("\n", levelStr.slice(70));
      }
    }

    return out;
  }

  function getChunks() {
    let chunks: Array<[string, Array<{ data: string }>]> = Object.entries(
      levels[areaIndex].data.chunks
    );
    return chunks;
  }

  function getCurrentRoomType() {
    let parts = typeAndRoomIndex.split(",");
    let variant = parts[0];

    if (variant == "rooms") {
      let roomType = parseInt(parts[1], 10);
      return (
        levels[areaIndex].data[variant][roomType] ?? {
          name: "No Room Type...",
          rooms: [],
        }
      );
    }

    return { name: `Chunk ${parts[1]}`, rooms: [] };
  }

  function getCurrentLevel(): Room {
    let parts = typeAndRoomIndex.split(",");
    let variant = parts[0];
    let room = parseInt(parts[2], 10);

    if (variant == "rooms") {
      let roomType = parseInt(parts[1], 10);
      return (
        levels[areaIndex].data[variant][roomType]?.rooms[room] ?? {
          name: "No Rooms...",
          data: "",
          type: RoomType.UNSET,
        }
      );
    }

    return (
      levels[areaIndex].data[variant][parts[1]][room] ?? {
        name: "No Chunks...",
        data: "",
        type: RoomType.UNSET,
      }
    );
  }

  function drawRoom() {
    let bg = images[levels[areaIndex].bg];
    let pattern = ctx.createPattern(bg, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let idx = 0;

    let numColumns = 5;
    switch (finalLevelFormat.length) {
      case 79:
      case 80:
        numColumns = 10;
        break;
      case 9:
        numColumns = 3;
        break;
    }

    for (const c of finalLevelFormat) {
      if (c == "0") {
        idx++;
        continue;
      }
      let column = idx % numColumns;
      let row = (idx - column) / numColumns;

      let x = column * rectWidth;
      let y = row * rectHeight;

      let tile = tiles[c];
      if (tile) {
        let tileImages = tile.images ?? [];

        let tileContext: TileContext = {
          above: finalLevelFormat.charAt(idx - numColumns),
          below: finalLevelFormat.charAt(idx + numColumns),
          area: levels[areaIndex].name,
          roomType: currentLevel.type,
          roomFlags: currentLevel.flags ?? [],
        };

        if (tileImages instanceof Function) {
          tileImages = tileImages(tileContext) ?? [];
        }

        let label = tile.label;
        if (label instanceof Function) {
          label = label(tileContext);
        }

        if (!tileImages.length && !label) {
          drawTileLabel(x, y, c);
        } else {
          for (const tile of tileImages) {
            let img = images[tile.name];
            ctx.save();
            ctx.globalAlpha = tile.alpha ?? 1;
            ctx.drawImage(
              img,
              tile.x,
              tile.y,
              tile.w ?? rectWidth,
              tile.h ?? rectHeight,
              x + (tile.offX ?? 0),
              y + (tile.offY ?? 0),
              (tile.w ?? rectWidth) * (tile.scale ?? 1),
              (tile.h ?? rectHeight) * (tile.scale ?? 1)
            );
            ctx.restore();
          }

          if (label) {
            ctx.font = "20px Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#fff";

            ctx.fillText(label, x + rectWidth / 2, y + rectHeight / 2);
          }
        }
      } else if (chunkCodes.includes(c)) {
        let height = 3;
        let width = 5;
        if (c == "V") {
          height = 4;
        }
        if (c == "F") {
          width = 3;
        }
        drawTileLabel(
          x,
          y,
          getNameOfChunk(c),
          rectWidth * width,
          rectHeight * height
        );
      } else {
        drawTileLabel(x, y, c);
      }
      idx++;
    }
  }

  onMount(() => {
    ctx = canvas.getContext("2d");
    initChunks();
    drawRoom();
  });

  function updateArea() {
    typeAndRoomIndex = "rooms,0,0";
    currentLevel = getCurrentLevel();
    currentRoomType = getCurrentRoomType();
    levelChunks = getChunks();
    formattedLevel = formatLevelString(currentLevel.data);
    initChunks();
    drawRoom();
  }

  function updateRoom() {
    currentLevel = getCurrentLevel();
    currentRoomType = getCurrentRoomType();
    formattedLevel = formatLevelString(currentLevel.data);
    initChunks();
    drawRoom();
  }

  function updateChunk() {
    updateChunks();
    drawRoom();
  }
</script>

<LayoutGrid>
  <Cell span={8}>
    <div class="canvas-wrapper">
      <canvas bind:this={canvas} height="512" width="640" />
    </div>
  </Cell>
  <Cell span={4}>
    <div>
      <select
        bind:value={areaIndex}
        on:change={updateArea}
        width="100%"
        label="Area"
      >
        {#each levels as level, tmpAreaIndex}
          <option value={tmpAreaIndex}>{level.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <h4>
        {currentRoomType.name}
      </h4>
      {#if currentRoomType.notes}
        <div style="padding-bottom: 10px;">
          <i>{currentRoomType.notes}</i>
        </div>
      {/if}
      <select
        bind:value={typeAndRoomIndex}
        on:change={updateRoom}
        width="100%"
        label="Room Type"
      >
        {#each levels[areaIndex].data.rooms as rooms, roomTypeIndex}
          <optgroup label={rooms.name}>
            {#each rooms.rooms as room, roomIndex}
              <option value={`rooms,${roomTypeIndex},${roomIndex}`}
                >{room.name}</option
              >
            {/each}
          </optgroup>
        {/each}
        {#each levelChunks as [name, chunks]}
          <optgroup label="Chunk {name}">
            {#each chunks as chunk, chunkIndex}
              <option value={`chunks,${name},${chunkIndex}`}>
                {chunk.data}
              </option>
            {/each}
          </optgroup>
        {/each}
      </select>
    </div>
    <div>
      <textarea class="mono room-string" readonly value={formattedLevel} />
    </div>

    {#if usableChunks.length}
      <div style="padding-bottom: 10px;">
        <h4>Chunks</h4>
        {#each usableChunks as usableChunk, usableChunkIdx}
          <div>
            <select
              width="100%"
              label={usableChunk.type}
              bind:value={usableChunk.index}
              on:change={updateChunk}
            >
              <option value={null} />

              {#each usableChunk.chunks as chunk, chunkIdx}
                <option value={chunkIdx}>{chunk.data}</option>
              {/each}
            </select>
            {usableChunk.type}
          </div>
        {/each}
      </div>
    {/if}

    {#if currentLevel.type}
      <div style="padding-bottom: 10px;">
        <h4>Room Type</h4>
        {RoomType[currentLevel.type]} ({currentLevel.type})
      </div>
    {/if}

    {#if currentLevel.notes}
      <div style="padding-bottom: 10px;">
        <h4>Notes</h4>
        {currentLevel.notes}
      </div>
    {/if}
  </Cell>
</LayoutGrid>

<style>
  h4 {
    margin-block-end: 0.5em;
  }

  .canvas-wrapper {
    width: 100%;
    height: 100%;
  }
  canvas {
    width: 100%;
    max-height: 512px;
    max-width: 640px;
  }

  textarea.room-string {
    height: 170px;
    resize: none;
  }
</style>
