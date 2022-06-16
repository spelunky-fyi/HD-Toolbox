import { RoomFlags, RoomType } from "./enums";
import type { TileContext } from "./types";

interface ImageSpec {
  name: string;
  x: number;
  y: number;
  alpha?: number;
  w?: number;
  h?: number;
  offX?: number;
  offY?: number;
  scale?: number;
}

type ImagesSpec = ImageSpec[] | ((ctx: TileContext) => ImageSpec[]);
type LabelSpec = string | ((ctx: TileContext) => string);

type TileSpec = {
  images?: ImagesSpec;
  label?: LabelSpec;
};

type TileSpecDyn = ((ctx: TileContext) => TileSpec) | TileSpec;

function getTerrainFunc(alpha?: number) {
  return (ctx): ImageSpec[] => {
    if (["Jungle", "Black Market", "Haunted Castle"].includes(ctx.area)) {
      return [{ name: "alltiles", x: 512, y: 128, alpha: alpha }];
    } else if (ctx.area == "Worm") {
      return [{ name: "alltiles", x: 0, y: 17 * 64, alpha: alpha }];
    } else if (["Ice Caves"].includes(ctx.area)) {
      return [{ name: "alltiles", x: 64 * 16, y: 64 * 1, alpha: alpha }];
    } else if (["Wet Fur"].includes(ctx.area)) {
      return [
        { name: "alltiles", x: 64 * 6, y: 64 * 11, w: 50, alpha: alpha },
        {
          name: "alltiles",
          x: 64 * 16 + 50,
          y: 64 * 1,
          w: 16,
          offX: 50,
          alpha: alpha,
        },
      ];
    } else if (ctx.area == "Mothership") {
      if (ctx.here == "m") {
        return [{ name: "alltiles", x: 64 * 5, y: 64 * 12, alpha: alpha }];
      } else {
        return [{ name: "alltiles", x: 64 * 19, y: 64 * 28, alpha: alpha }];
      }
    } else if (["Temple / CoG", "Olmec's Lair"].includes(ctx.area)) {
      if (ctx.roomFlags.includes(RoomFlags.CoG)) {
        return [{ name: "alltiles", x: 64 * 8, y: 64 * 9, alpha: alpha }];
      } else {
        return [{ name: "alltiles", x: 64 * 24, y: 64 * 1, alpha: alpha }];
      }
    } else if (ctx.area == "Hell / Yama") {
      return [{ name: "alltiles", x: 16 * 64, y: 9 * 64, alpha: alpha }];
    }

    // Default to mines
    return [{ name: "alltiles", x: 0, y: 128, alpha: alpha }];
  };
}

function getTerrainSpikesFunc(alpha?: number) {
  return (ctx): ImageSpec[] => {
    if (["Jungle", "Black Market", "Haunted Castle"].includes(ctx.area)) {
      return [{ name: "alltiles", x: 64 * 13, y: 64 * 6, alpha: alpha }];
    } else if (ctx.area == "Worm") {
      return [{ name: "alltiles", x: 64 * 5, y: 64 * 22, alpha: alpha }];
    } else if (["Ice Caves", "Wet Fur"].includes(ctx.area)) {
      return [{ name: "alltiles", x: 64 * 21, y: 64 * 6, alpha: alpha }];
    } else if (ctx.area == "Hell / Yama") {
      if (ctx.roomFlags.includes(RoomFlags.VLADS)) {
        return [{ name: "alltiles", x: 64 * 21, y: 64 * 23, alpha: alpha }];
      }
      return [{ name: "alltiles", x: 64 * 21, y: 64 * 14, alpha: alpha }];
    }

    // Default to mines
    return [{ name: "alltiles", x: 64 * 5, y: 64 * 6, alpha: alpha }];
  };
}

const config: { [key: string]: TileSpecDyn } = {
  ".": {
    images: getTerrainFunc(),
    label: ".",
  },
  m: {
    images: getTerrainFunc(),
    label: function (ctx) {
      if (ctx.area == "Mothership") {
        return;
      }
      return "m";
    },
  },
  "1": {
    images: getTerrainFunc(),
  },
  "2": {
    images: getTerrainFunc(0.5),
    label: "50%",
  },
  "3": {
    images: function (ctx) {
      let imgs = getTerrainFunc(0.5)(ctx);
      imgs[0].w = 32;

      if (["Hell / Yama", "Temple / CoG"].includes(ctx.area)) {
        imgs.push({ name: "water", x: 64 * 3, y: 0, w: 32, offX: 32 });
      } else {
        imgs.push({ name: "water", x: 64 + 32, y: 0, w: 32, offX: 32 });
      }
      return imgs;
    },
    label: "t/w",
  },
  ",": {
    images: function (ctx) {
      let imgs = getTerrainFunc(1)(ctx);
      imgs[0].w = 32;
      imgs.push({ name: "alltiles", x: 1536 + 32, y: 1600, w: 32, offX: 32 });

      return imgs;
    },
    label: ",",
  },
  e: {
    images: function (ctx) {
      if (ctx.area == "Jungle") {
        // Beehive
        return [{ name: "alltiles", x: 64 * 24, y: 64 * 17 }];
      }
      return;
    },
  },
  z: {
    images: function (ctx) {
      if (ctx.area == "Mothership") {
        return [
          {
            name: "items",
            x: 80 * 7,
            y: 80 * 8,
            w: 80,
            h: 80,
            offX: -10,
            offY: -10,
          },
        ];
      }
      // Beehive
      if (ctx.area == "Jungle") {
        return [{ name: "alltiles", x: 64 * 24, y: 64 * 17, alpha: 0.5 }];
      }

      return;
    },
    label: function (ctx) {
      if (ctx.roomFlags.includes(RoomFlags.CoG)) {
        return "Deco";
      }
      return;
    },
  },
  q: {
    images: getTerrainFunc(),
    label: "q",
  },
  T: {
    images: function (ctx) {
      if (ctx.area == "Ice Caves") {
        return [
          {
            name: "doors",
            x: 0,
            y: 256 * 3,
            w: 256,
            h: 256,
            offX: -64 - 32,
            offY: -128 + 44,
          },
          { name: "alltiles", x: 64 * 19, y: 64 * 28, offY: 64 },
        ];
      }

      // Tree
      return [
        { name: "alltiles", x: 64 * 0, y: 64 * 15 },
        { name: "alltiles", x: 64 * 0, y: 64 * 14, offY: -64 },
        { name: "alltiles", x: 64 * 3, y: 64 * 11, offY: -64 - 32 },
      ];
    },
    label: function (ctx) {
      if (ctx.area == "Ice Caves") {
        return;
      }

      return "Grow";
    },
  },
  L: {
    images: function (ctx) {
      if (["Jungle", "Black Market", "Haunted Castle"].includes(ctx.area)) {
        if (ctx.below != "L") {
          return [{ name: "alltiles", x: 576, y: 0 }];
        }
        return [{ name: "alltiles", x: 960, y: 192 }];
      } else if (ctx.area == "Worm") {
        if (ctx.below != "L") {
          return [{ name: "alltiles", x: 64 * 1, y: 64 * 16 }];
        }
        return [{ name: "alltiles", x: 64 * 2, y: 64 * 16 }];
      } else if (ctx.area == "Mothership") {
        return [
          {
            name: "items",
            x: 80 * 5,
            y: 80 * 8,
            w: 80,
            h: 80,
            scale: 0.8,
          },
        ];
      } else if (ctx.area == "Hell / Yama") {
        if (ctx.below != "L") {
          return [{ name: "alltiles", x: 64 * 17, y: 64 * 8 }];
        }
        return [{ name: "alltiles", x: 64 * 18, y: 64 * 8 }];
      }
      return [{ name: "alltiles", x: 128, y: 0 }];
    },
  },
  G: {
    images: [{ name: "alltiles", x: 128, y: 0 }],
  },
  Q: {
    images: function (ctx) {
      if (["Jungle", "Black Market", "Haunted Castle"].includes(ctx.area)) {
        return [
          { name: "alltiles", x: 960, y: 192 },
          { name: "alltiles", x: 576, y: 0, offY: 64 },
        ];
      } else if (ctx.area == "Worm") {
        return [
          { name: "alltiles", x: 64 * 2, y: 64 * 16 },
          { name: "alltiles", x: 64 * 1, y: 64 * 16, offY: 64 },
        ];
      } else if (ctx.area == "Mothership") {
        return [
          {
            name: "monstersbig4",
            x: 0,
            y: 320 * 4,
            w: 320,
            h: 320,
            offX: -((320 / 3) * 0.8),
            offY: -((320 / 3) * 0.8),
            scale: 0.8,
          },
        ];
      } else if (ctx.area == "Hell / Yama") {
        return [
          { name: "alltiles", x: 64 * 18, y: 64 * 8 },
          { name: "alltiles", x: 64 * 17, y: 64 * 8, offY: 64 },
        ];
      }
      return [{ name: "alltiles", x: 128, y: 0 }];
    },
    label: function (ctx) {
      if (ctx.area == "Mothership") {
        return;
      }
      return "Grow";
    },
  },
  P: {
    images: [{ name: "alltiles", x: 192, y: 0 }],
  },
  "|": {
    images: [
      { name: "alltiles", x: 1536, y: 64 },
      { name: "alltiles", x: 1536, y: 64, offX: 64 },
      { name: "alltiles", x: 1536, y: 64, offX: 64 * 2 },
      { name: "alltiles", x: 1536, y: 64, offX: 64 * 3 },

      { name: "alltiles", x: 1536, y: 64, offY: 64 },
      { name: "alltiles", x: 1536, y: 64, offY: 64, offX: 64 * 3 },

      { name: "alltiles", x: 1536, y: 64, offY: 64 * 2 },
      { name: "alltiles", x: 1536, y: 64, offY: 64 * 2, offX: 64 * 3 },

      { name: "alltiles", x: 1536, y: 64, offY: 64 * 3 },
      { name: "alltiles", x: 1536, y: 64, offY: 64 * 3, offX: 64 },
      { name: "alltiles", x: 1536, y: 64, offY: 64 * 3, offX: 64 * 2 },
      { name: "alltiles", x: 1536, y: 64, offY: 64 * 3, offX: 64 * 3 },
    ],
  },
  E: { label: "Treas." },
  v: {
    images: function (ctx) {
      // Wood block in mines
      if (["Mines", "Tutorial"].includes(ctx.area)) {
        return [{ name: "alltiles", x: 1536, y: 1600 }];
      }

      return getTerrainFunc(0.5)(ctx);
    },
    label: "v",
  },
  "=": {
    images: function (ctx) {
      if (ctx.area == "Hell / Yama") {
        return [{ name: "alltiles", x: 16 * 64, y: 17 * 64 }];
      } else if (ctx.area == "Ice Caves") {
        return [{ name: "alltiles", x: 64 * 19, y: 64 * 28 }];
      }
      return [{ name: "alltiles", x: 1536, y: 1600 }];
    },

    label: "=",
  },
  x: {
    images: function (ctx) {
      if (ctx.area == "Haunted Castle") {
        // Wall torches
        return null;
      }
      return [
        { name: "alltiles", x: 384, y: 576 },
        { name: "alltiles", x: 384 + 64, y: 576, offX: 64 },
      ];
    },
  },
  A: {
    images: function (ctx) {
      if (ctx.area == "Hell / Yama") {
        return [
          { name: "alltiles", x: 64 * 22, y: 64 * 15 },
          { name: "alltiles", x: 64 * 23, y: 64 * 15, offX: 64 },
        ];
      }
      return [
        { name: "alltiles", x: 256, y: 448 },
        { name: "alltiles", x: 256 + 64, y: 448, offX: 64 },
      ];
    },
  },
  I: {
    images: function (ctx) {
      if (
        ctx.roomFlags.includes(RoomFlags.YAMA) ||
        [RoomType.COFFIN_EXIT_LEFT, RoomType.COFFIN_EXIT_RIGHT].includes(
          ctx.roomType
        )
      ) {
        return [
          { name: "alltiles", x: 64 * 15, y: 64 * 6, offY: -64 },
          { name: "alltiles", x: 64 * 15, y: 64 * 7 },
        ];
      }
      // Idol
      return [{ name: "items", x: 960, y: 0, offX: 24, w: 80, h: 80 }];
    },
  },
  "*": {
    images: function (ctx) {
      if (ctx.area == "Hell / Yama") {
        return [{ name: "alltiles", x: 64 * 1, y: 64 * 9 }];
      }

      // Plasma Cannon
      return [
        { name: "items", x: 80 * 18, y: 80 * 3, offX: -10, w: 80, h: 80 },
        { name: "alltiles", x: 64 * 19, y: 64 * 24, offY: 64 },
      ];
    },
  },
  c: {
    images: function (ctx) {
      if (ctx.area == "Worm") {
        return [
          { name: "items", x: 80 * 11, y: 80 * 7, offY: -20, w: 80, h: 80 },
          { name: "water", x: 64, y: 0 },
        ];
      }
      return [{ name: "items", x: 1040, y: 0, offX: 24, w: 80, h: 80 }];
    },
  },
  "#": {
    images: function (ctx) {
      if (ctx.roomFlags.includes(RoomFlags.CoG)) {
        return [{ name: "items", x: 80 * 5, y: 80 * 9, w: 80, h: 80 }];
      }
      return [{ name: "alltiles", x: 448, y: 384 }];
    },
  },
  "4": {
    images: function (ctx) {
      if (ctx.roomFlags.includes(RoomFlags.VLADS)) {
        return [{ name: "alltiles", x: 64 * 16, y: 64 * 16 }];
      } else if (ctx.roomFlags.includes(RoomFlags.CoG)) {
        return [{ name: "alltiles", x: 64 * 8, y: 64 * 8 }];
      }
      return [{ name: "alltiles", x: 0, y: 0 }];
    },
  },
  M: {
    images: function (ctx) {
      let images = getTerrainFunc(1)(ctx);

      if (ctx.area == "Mines") {
        // Mattock
        images.push({ name: "items", x: 1680, y: 480, w: 80, h: 80 });
      } else if (ctx.area == "Ice Caves") {
        // Jetpack
        images.push({
          name: "items",
          x: 80 * 13,
          y: 80 * 1,
          w: 80,
          h: 80,
          offX: -10,
          offY: -10,
        });
      }
      return images;
    },
  },
  "-": {
    images: function (ctx) {
      if (ctx.area == "Hell / Yama") {
        return null;
      }
      return [{ name: "alltiles", x: 64 * 0, y: 64 * 8 }];
    },
  },
  R: {
    images: [{ name: "items", x: 480, y: 0, w: 80, h: 80, offX: -8 }],
  },
  N: {
    images: [
      { name: "monsters", x: 0, y: 0, w: 40, h: 80 },
      { name: "monsters4", x: 40, y: 720, w: 40, h: 80, offX: 40 },
    ],
  },
  n: {
    images: [
      { name: "alltiles", x: 0, y: 128, w: 32, h: 64, alpha: 0.5 },
      { name: "monsters", x: 40, y: 0, w: 40, h: 80, offX: 40 - 8, alpha: 0.5 },
    ],
  },
  g: {
    images: [{ name: "coffin", x: 0, y: 0, w: 128, h: 128, offY: -64 }],
  },
  O: {
    images: [{ name: "icesmallbg", x: 0, y: 256 * 2, w: 192, h: 256 }],
  },
  X: {
    images: function (ctx) {
      if (ctx.roomType == RoomType.YAMA_3_0) {
        return [
          {
            name: "monstersbig4",
            x: 0,
            y: 80 * 8,
            w: 160,
            h: 160,
            offY: -80,
            offX: -40,
            scale: 0.9,
          },
        ];
      } else if (ctx.roomType == RoomType.YAMA_3_3) {
        return [
          {
            name: "monstersbig4",
            x: 0,
            y: 80 * 20,
            w: 160,
            h: 160,
            offY: -80,
            offX: -40,
            scale: 0.9,
          },
        ];
      } else if (["Ice Caves", "Mothership"].includes(ctx.area)) {
        return [
          {
            name: "monstersbig5",
            x: 0,
            y: 0,
            w: 160,
            h: 160,
            offX: -11,
            offY: -5,
            scale: 0.9,
          },
        ];
      }

      return [
        {
          name: "monstersbig2",
          x: 0,
          y: 0,
          w: 160,
          h: 160,
          offY: -32,
          offX: -8,
          scale: 0.9,
        },
      ];
    },
  },
  Y: {
    images: function (ctx) {
      if (ctx.area == "Hell / Yama") {
        return null;
      }
      if (ctx.area == "Temple / CoG") {
        return [
          {
            name: "monstersbig",
            x: 0,
            y: 0,
            w: 160,
            h: 160,
            offY: -60,
            scale: 0.8,
          },
        ];
      }
      return [
        {
          name: "monstersbig3",
          x: 0,
          y: 0,
          w: 160,
          h: 160,
          offX: -10,
          offY: -30,
        },
      ];
    },
  },
  "9": {
    images: function (ctx) {
      let x = 0;
      let y = 0;

      if (["Jungle", "Black Market", "Haunted Castle"].includes(ctx.area)) {
        x = 256 * 2;
      } else if (ctx.area == "Worm") {
        x = 256 * 2;
        y = 256 * 2;
      } else if (["Ice Caves", "Wet Fur"].includes(ctx.area)) {
        y = 256 * 1;
      } else if (["Mothership"].includes(ctx.area)) {
        y = 256 * 3;
      } else if (ctx.area == "Temple / CoG") {
        x = 256 * 2;
        y = 256 * 1;
        if (ctx.roomFlags.includes(RoomFlags.CoG)) {
          y = 256 * 3;
        }
      } else if (ctx.area == "Hell / Yama") {
        y = 256 * 2;
      }

      if (ctx.roomFlags.includes(RoomFlags.ENTRANCE)) {
        x = x + 256;
      }

      return [
        {
          name: "doors",
          x: x,
          y: y,
          w: 256,
          h: 256,
          offX: -64 - 32,
          offY: -128 + 44,
        },
      ];
    },
  },
  ":": {
    images: function (ctx) {
      if (["Jungle", "Black Market", "Haunted Castle"].includes(ctx.area)) {
        return [{ name: "monsters5", x: 0, y: 80 * 3, w: 80, h: 80 }];
      } else if (["Ice Caves", "Wet Fur"].includes(ctx.area)) {
        return [{ name: "monsters2", x: 0, y: 80 * 3, w: 80, h: 80 }];
      } else if (ctx.area == "Mothership") {
        return [
          { name: "monsters", x: 0, y: 80 * 3, w: 40, h: 80 },
          { name: "monsters2", x: 0 + 40, y: 80 * 3, w: 40, h: 80, offX: 40 },
        ];
      }
      return [{ name: "monsters5", x: 0, y: 0, w: 80, h: 80 }];
    },
  },
  "+": {
    images: function (ctx) {
      if (ctx.area == "Ice Caves") {
        return [{ name: "alltiles", x: 64 * 19, y: 64 * 28 }];
      }
      // Wood Background
      return [{ name: "alltiles", x: 256, y: 320 }];
    },
  },
  "7": {
    images: getTerrainSpikesFunc(0.5),
    label: "33%",
  },
  b: {
    images: [{ name: "alltiles", x: 1536, y: 1600 }],
    label: "b",
  },
  l: {
    images: [
      { name: "items", x: 1200, y: 0, w: 80, h: 80, offX: -8, offY: -8 },
    ],
  },
  "~": {
    images: [
      {
        name: "items",
        x: 80 * 2,
        y: 80 * 4,
        w: 80,
        h: 80,
        scale: 0.8,
      },
    ],
  },
  S: { label: "Item" },
  $: { label: "Prize" },
  k: {
    images: [{ name: "alltiles", x: 64, y: 640 }],
  },
  W: {
    images: [{ name: "alltiles", x: 512, y: 1728, h: 128, w: 128 }],
  },
  K: {
    images: [
      { name: "monsters", x: 320, y: 560, h: 80, w: 80, offX: -8, offY: -8 },
    ],
  },
  "%": {
    images: function (ctx) {
      if (ctx.below == "%") {
        return [{ name: "items", x: 240, y: 240, h: 80, w: 80, scale: 0.8 }];
      }
      return [{ name: "items", x: 1520, y: 240, h: 80, w: 80, scale: 0.8 }];
    },
  },
  w: {
    images: function (ctx) {
      if (["Hell / Yama", "Temple / CoG"].includes(ctx.area)) {
        if (!["w", "v"].includes(ctx.above)) {
          return [{ name: "water", x: 64 * 3, y: 128 }];
        }
        return [{ name: "water", x: 64 * 3, y: 0 }];
      } else {
        if (!["w", "v", ",", "J"].includes(ctx.above)) {
          return [{ name: "water", x: 64, y: 128 }];
        }
        return [{ name: "water", x: 64, y: 0 }];
      }
    },
  },
  t: { images: [{ name: "alltiles", x: 1536, y: 64 }] },
  // Has many variants...
  h: {
    images: function (ctx) {
      if (["Jungle", "Black Market"].includes(ctx.area)) {
        return [{ name: "alltiles", x: 12 * 64, y: 5 * 64 }];
      }

      if (ctx.area == "Haunted Castle") {
        // Kali Altar
        return null;
      }

      if (ctx.area == "Tutorial") {
        return null;
      }

      // Hell Bricks
      return [{ name: "alltiles", x: 16 * 64, y: 17 * 64 }];
    },
  },
  B: {
    images: function (ctx) {
      return [{ name: "alltiles", x: 15 * 64, y: 5 * 64 }];
    },
  },
  i: {
    images: function (ctx) {
      if (ctx.area == "Jungle") {
        // Firepot+terrain+torch
        return;
      }
      return [{ name: "alltiles", x: 64 * 6, y: 64 * 11 }];
    },
  },
  j: {
    label: "n/a",
  },
  y: {
    images: function (ctx) {
      if (ctx.area == "Temple / CoG") {
        return [
          // Bricks
          { name: "alltiles", x: 64 * 24, y: 64 * 1 },
          // Rubies
          { name: "items", x: 480, y: 0, w: 80, h: 80, offX: -8 },
        ];
      }
      return [
        // Hell Bricks
        { name: "alltiles", x: 16 * 64, y: 17 * 64 },
        // Rubies
        { name: "items", x: 480, y: 0, w: 80, h: 80, offX: -8 },
      ];
    },
  },
  r: function (ctx) {
    // This is used as a chunk in this area.
    if (ctx.area == "Temple / CoG") {
      return;
    }

    return {
      images: function (ctx) {
        if (ctx.area == "Hell / Yama") {
          // Hell Bricks
          return [{ name: "alltiles", x: 16 * 64, y: 17 * 64, alpha: 0.5 }];
        }

        return [{ name: "alltiles", x: 1536, y: 64 }];
      },
      label: "50%",
    };
  },
  s: {
    images: getTerrainSpikesFunc(1),
  },
  f: {
    images: function (ctx) {
      if (ctx.area == "Hell / Yama") {
        return [{ name: "alltiles", x: 64 * 23, y: 64 * 13 }];
      }
      return [{ name: "alltiles", x: 64 * 23, y: 64 * 5 }];
    },
  },
  d: {
    images: function (ctx) {
      if (ctx.area == "Worm") {
        return [{ name: "alltiles", x: 64 * 20, y: 64 * 15 }];
      }
      if (ctx.area == "Temple / CoG") {
        return [{ name: "alltiles", x: 512, y: 128 }];
      }
      return [{ name: "alltiles", x: 1536, y: 1600 }];
    },

    label: "d",
  },

  "&": {
    label: "Spout",
  },
};

export default config;
