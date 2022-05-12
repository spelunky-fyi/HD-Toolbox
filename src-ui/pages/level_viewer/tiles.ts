export default {
  ".": {
    images: [{ name: "alltiles", x: 0, y: 128 }],
    label: ".",
  },
  "1": {
    images: [{ name: "alltiles", x: 0, y: 128 }],
  },
  "2": {
    images: [{ name: "alltiles", x: 0, y: 128, alpha: 0.5 }],
    label: "50%",
  },
  L: {
    images: [{ name: "alltiles", x: 128, y: 0 }],
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
    images: [{ name: "alltiles", x: 1536, y: 1600 }],
    label: "v",
  },
  "=": {
    images: [{ name: "alltiles", x: 1536, y: 1600 }],
    label: "=",
  },
  x: {
    images: [
      { name: "alltiles", x: 384, y: 576 },
      { name: "alltiles", x: 384 + 64, y: 576, offX: 64 },
    ],
  },
  A: {
    images: [
      { name: "alltiles", x: 256, y: 448 },
      { name: "alltiles", x: 256 + 64, y: 448, offX: 64 },
    ],
  },
  I: {
    images: [{ name: "items", x: 960, y: 0, offX: 24, w: 80, h: 80 }],
  },
  "#": {
    images: [{ name: "alltiles", x: 448, y: 384 }],
  },
  "4": {
    images: [{ name: "alltiles", x: 0, y: 0 }],
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
    images: [
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
    ],
  },
  "9": {
    images: [
      {
        name: "doors",
        x: 0,
        y: 0,
        w: 256,
        h: 256,
        offX: -64 - 32,
        offY: -128 + 44,
      },
    ],
  },
  // Area specific, needs update for other biomes
  ":": {
    images: [{ name: "monsters5", x: 0, y: 0, w: 80, h: 80 }],
  },
  "+": {
    images: [{ name: "alltiles", x: 256, y: 320 }],
  },
  "7": {
    images: [{ name: "alltiles", x: 256, y: 384, alpha: 0.5 }],
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
};
