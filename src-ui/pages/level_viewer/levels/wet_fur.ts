import type { Level } from "../types";

const config: Level = {
  rooms: [],
  chunks: {
    door: [{ data: "009000111011111" }],
    ground: [
      { data: "111110000000000" },
      { data: "000001111000000" },
      { data: "000000111100000" },
      { data: "000000000011111" },
      { data: "000002020017177" },
      { data: "000000202071717" },
      { data: "000000020277171" },
      { data: "000002220011100" },
      { data: "000000222001110" },
      { data: "000000022200111" },
      { data: "111002220000000" },
      { data: "011100222000000" },
      { data: "001110022200000" },
      { data: "000000222021112" },
      { data: "000002010077117" },
      { data: "000000010271177" },
    ],
    air: [
      { data: "022220000022220" },
      { data: "222200000002222" },
      { data: "111002220000000" },
      { data: "011100222000000" },
      { data: "001110022200000" },
      { data: "000000111000000" },
      { data: "000000111002220" },
      { data: "000000022001111" },
      { data: "000002220011100" },
    ],
  },
};

export default config;
