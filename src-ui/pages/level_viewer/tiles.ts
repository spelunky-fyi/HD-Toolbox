import { RoomFlags, RoomType } from "./enums";

interface ImageSpec {
  name: string;
  x: number;
  y: number;
  alpha?: number;
  w?: number;
  h?: number;
  offX?: number;
  offY?: number;
}

function getTerrainFunc(alpha?: number) {
  return (ctx): ImageSpec[] => {
    if (ctx.area == "Jungle") {
      return [{ name: "alltiles", x: 512, y: 128, alpha: alpha }];
    } else if (ctx.area == "Hell / Yama") {
      return [{ name: "alltiles", x: 16 * 64, y: 9 * 64, alpha: alpha }];
    }

    // Default to mines
    return [{ name: "alltiles", x: 0, y: 128, alpha: alpha }];
  };
}

function getTerrainSpikesFunc(alpha?: number) {
  return (ctx): ImageSpec[] => {
    if (ctx.area == "Jungle") {
      return [{ name: "alltiles", x: 64 * 13, y: 64 * 6, alpha: alpha }];
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

export default {
  ".": {
    images: getTerrainFunc(),
    label: ".",
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
      imgs.push({ name: "water", x: 64 + 32, y: 0, w: 32, offX: 32 });
      return imgs;
    },
    label: "t/w",
  },
  q: {
    images: getTerrainFunc(),
    label: "q",
  },
  T: { label: "Tree" },
  L: {
    images: function (ctx) {
      if (ctx.area == "Jungle") {
        if (ctx.below != "L") {
          return [{ name: "alltiles", x: 576, y: 0 }];
        }
        return [{ name: "alltiles", x: 960, y: 192 }];
      } else if (ctx.area == "Hell / Yama") {
        if (ctx.below != "L") {
          return [{ name: "alltiles", x: 64 * 17, y: 64 * 8 }];
        }
        return [{ name: "alltiles", x: 64 * 18, y: 64 * 8 }];
      }
      return [{ name: "alltiles", x: 128, y: 0 }];
    },
  },
  Q: {
    images: function (ctx) {
      if (ctx.area == "Jungle") {
        return [
          { name: "alltiles", x: 960, y: 192 },
          { name: "alltiles", x: 576, y: 0, offY: 64 },
        ];
      } else if (ctx.area == "Hell / Yama") {
        return [
          { name: "alltiles", x: 64 * 18, y: 64 * 8 },
          { name: "alltiles", x: 64 * 17, y: 64 * 8, offY: 64 },
        ];
      }
      return [{ name: "alltiles", x: 128, y: 0 }];
    },
    label: "Grow",
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
      if (ctx.area == "Mines") {
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
      }
      return [{ name: "alltiles", x: 1536, y: 1600 }];
    },

    label: "=",
  },
  x: {
    images: [
      { name: "alltiles", x: 384, y: 576 },
      { name: "alltiles", x: 384 + 64, y: 576, offX: 64 },
    ],
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
      if (ctx.roomFlags.includes(RoomFlags.YAMA)) {
        return [
          { name: "alltiles", x: 64 * 15, y: 64 * 6, offY: -64 },
          { name: "alltiles", x: 64 * 15, y: 64 * 7 },
        ];
      }
      // Idol
      return [{ name: "items", x: 960, y: 0, offX: 24, w: 80, h: 80 }];
    },
  },
  "#": {
    images: [{ name: "alltiles", x: 448, y: 384 }],
  },
  "4": {
    images: function (ctx) {
      if (ctx.roomFlags.includes(RoomFlags.VLADS)) {
        return [{ name: "alltiles", x: 64 * 16, y: 64 * 16 }];
      }
      return [{ name: "alltiles", x: 0, y: 0 }];
    },
  },
  M: {
    images: [
      { name: "alltiles", x: 0, y: 128 },
      { name: "items", x: 1680, y: 480, w: 80, h: 80 },
    ],
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
  "9": {
    images: function (ctx) {
      let x = 0;
      let y = 0;

      if (ctx.area == "Jungle") {
        x = 256 * 2;
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
  // Area specific, needs update for other biomes
  ":": {
    images: [{ name: "monsters5", x: 0, y: 0, w: 80, h: 80 }],
  },
  "+": {
    images: [{ name: "alltiles", x: 256, y: 320 }],
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
      if (ctx.area == "Hell / Yama") {
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
      // Hell Bricks
      return [{ name: "alltiles", x: 16 * 64, y: 17 * 64 }];
    },
  },
  y: {
    images: function (ctx) {
      return [
        // Hell Bricks
        { name: "alltiles", x: 16 * 64, y: 17 * 64 },
        // Rubies
        { name: "items", x: 480, y: 0, w: 80, h: 80, offX: -8 },
      ];
    },
  },
  r: {
    images: function (ctx) {
      if (ctx.area == "Hell / Yama") {
        // Hell Bricks
        return [{ name: "alltiles", x: 16 * 64, y: 17 * 64, alpha: 0.5 }];
      }

      return [{ name: "alltiles", x: 1536, y: 64 }];
    },
    label: "50%",
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
  "&": {
    label: "Spout",
  },
};
