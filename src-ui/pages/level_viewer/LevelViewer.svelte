<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";

  import levels from "@hdt/pages/level_viewer/levels";
  import { images, imagesLoaded } from "@hdt/pages/level_viewer/store";
  import tiles from "@hdt/pages/level_viewer/tiles";

  let canvas;
  let ctx;
  let unsubscribeImagesLoaded;
  let areaIndex = 0;
  let typeAndRoomIndex = "0,0";
  let currentRoomType = getCurrentRoomType();
  let currentLevel = getCurrentLevel();
  let usableChunks = [];
  let finalLevelFormat = "".padStart(80, "0");
  let formattedLevel = formatLevelString(currentLevel.data);
  let rectHeight = 64;
  let rectWidth = 64;

  function getNameOfChunk(tileCode) {
    switch (tileCode) {
      case "5":
        return "ground";
      case "6":
        return "air";
      case "8":
        return "door";
    }
  }

  function initChunks() {
    usableChunks = [];
    let room = currentLevel.data.split("");

    room.forEach((value, idx) => {
      // Chunk Tile Codes
      if (!["5", "6", "8"].includes(value)) {
        return;
      }

      emptyChunk(room, value, idx);

      const type_ = getNameOfChunk(value);
      usableChunks.push({
        index: null,
        type: type_.toUpperCase(),
        chunks: levels[areaIndex].data.chunks[type_],
      });
    });

    finalLevelFormat = room.join("");
  }

  function emptyChunk(room, type, idx) {
    room[idx] = type;
    room[idx + 1] = 0;
    room[idx + 2] = 0;
    room[idx + 3] = 0;
    room[idx + 4] = 0;

    room[idx + 10] = 0;
    room[idx + 10 + 1] = 0;
    room[idx + 10 + 2] = 0;
    room[idx + 10 + 3] = 0;
    room[idx + 10 + 4] = 0;

    room[idx + 20] = 0;
    room[idx + 20 + 1] = 0;
    room[idx + 20 + 2] = 0;
    room[idx + 20 + 3] = 0;
    room[idx + 20 + 4] = 0;
  }

  function updateChunks() {
    let room = currentLevel.data.split("");
    let chunkIdx = 0;
    room.forEach((value, idx) => {
      // Chunk Tile Codes
      if (!["5", "6", "8"].includes(value)) {
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
      room[idx + 0] = chunk[0];
      room[idx + 1] = chunk[1];
      room[idx + 2] = chunk[2];
      room[idx + 3] = chunk[3];
      room[idx + 4] = chunk[4];

      room[idx + 10 + 0] = chunk[5];
      room[idx + 10 + 1] = chunk[6];
      room[idx + 10 + 2] = chunk[7];
      room[idx + 10 + 3] = chunk[8];
      room[idx + 10 + 4] = chunk[9];

      room[idx + 20 + 0] = chunk[10];
      room[idx + 20 + 1] = chunk[11];
      room[idx + 20 + 2] = chunk[12];
      room[idx + 20 + 3] = chunk[13];
      room[idx + 20 + 4] = chunk[14];
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

    if (levelStr.length == 15) {
      out = levelStr.match(/.{5}/g).join("\n");
    } else if (levelStr.length == 80) {
      out = levelStr.match(/.{10}/g).join("\n");
    }

    return out;
  }

  function getCurrentRoomType() {
    let parts = typeAndRoomIndex.split(",");
    let roomType = parseInt(parts[0], 10);

    return (
      levels[areaIndex].data.rooms[roomType] ?? {
        name: "No Room Type...",
        rooms: [],
      }
    );
  }

  function getCurrentLevel() {
    let parts = typeAndRoomIndex.split(",");
    let roomType = parseInt(parts[0], 10);
    let room = parseInt(parts[1], 10);

    return (
      levels[areaIndex].data.rooms[roomType]?.rooms[room] ?? {
        name: "No Rooms...",
        data: "",
      }
    );
  }

  function drawRoom() {
    let pattern = ctx.createPattern(images.minebg, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let idx = 0;
    let numColumns = finalLevelFormat.length == 80 ? 10 : 5;

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
        if (tileImages instanceof Function) {
          tileImages = tileImages({
            above: finalLevelFormat.charAt(idx - 10),
            below: finalLevelFormat.charAt(idx + 10),
          });
        }
        let label = tile.label;

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
      } else if (["5", "6", "8"].includes(c)) {
        drawTileLabel(x, y, getNameOfChunk(c), rectWidth * 5, rectHeight * 3);
      } else {
        drawTileLabel(x, y, c);
      }
      idx++;
    }
  }

  onMount(() => {
    ctx = canvas.getContext("2d");
    unsubscribeImagesLoaded = imagesLoaded.subscribe((value) => {
      if (!value) {
        return;
      }
      initChunks();
      drawRoom();
    });
  });

  function updateArea() {
    typeAndRoomIndex = "0,0";
    currentLevel = getCurrentLevel();
    currentRoomType = getCurrentRoomType();
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

  onDestroy(() => unsubscribeImagesLoaded && unsubscribeImagesLoaded());
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
      <select
        bind:value={typeAndRoomIndex}
        on:change={updateRoom}
        width="100%"
        label="Room Type"
      >
        {#each levels[areaIndex].data.rooms as rooms, roomTypeIndex}
          <optgroup label={rooms.name}>
            {#each rooms.rooms as room, roomIndex}
              <option value={`${roomTypeIndex},${roomIndex}`} selected={true}
                >{room.name}</option
              >
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
    height: 160px;
  }
</style>
