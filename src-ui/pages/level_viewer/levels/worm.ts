import { RoomFlags, RoomType } from "../enums";

export default {
  rooms: [
    {
      name: "Entrance",
      rooms: [
        {
          name: "Room 1",
          data: "60000600000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },

        {
          name: "Room 2",
          data: "11111111112222222222000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },

        {
          name: "Room 3",
          data: "60000600000000000000000000000000000000000008000000000000000000000000002021111120",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },

        {
          name: "Room 4",
          data: "11111111112222222222000000000000000000000008000000000000000000000000002021111120",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Room 1 - No Top",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },

        {
          name: "Room 2 - No Top",
          data: "00000000000011111100000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },

        {
          name: "Room 3",
          data: "60000600000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 4",
          data: "000000000000000000000000090000000111100001wvvvvw1001wwwwww1011wwwwww111vvwwwwvv1",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },

        {
          name: "Room 5 - Unused",
          notes: "Unused.",
          data: "11111111112222222222000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
      ],
    },
    {
      name: "Path",
      rooms: [
        {
          name: "Room 1",
          data: "00100001000111121101010000010221011101010001000000012101101101000100002111112121",
          type: RoomType.PATH,
        },

        {
          name: "Room 2",
          data: "00100001000111121121010000000221110111010200000000011010111000001000101212112112",
          type: RoomType.PATH,
        },

        {
          name: "Room 3",
          data: "0010000100011000011021wwwwww1221wwwwww12011wwww110021111112000000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 4 - A",
          data: "0000000000111000000000L000000011L000000011L001110011L011Q11000001202101110120211",
          type: RoomType.PATH,
        },
        {
          name: "Room 4 - B",
          data: "000000000000000001110000000L000000000L110011100L11011Q110L1101202100001120210111",
          type: RoomType.PATH,
        },

        {
          name: "Room 5 - No Top",
          data: "00000000010110011111011100011001100001100110001110011110011000001000001110101111",
          type: RoomType.PATH,
        },

        {
          name: "Room 5 - With Top",
          data: "00000100000110011111011100011001100001100110001110011110011000001000001110101111",
          type: RoomType.PATH,
        },
        {
          name: "Room 6 - A",
          data: "00000000000021200000000L002120212L000Q000L0L0000000L0L0000000L000000000000000000",
          type: RoomType.PATH,
        },
        {
          name: "Room 6 - B",
          data: "00000000000000021200021200L00000Q000L212000000L0L0000000L0L000000000L00000000000",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path - Drop",
      rooms: [
        {
          name: "Room 1",
          data: "00200001000111101101010000010221011101010001000000012101101101000100002111110121",
          type: RoomType.PATH_DROP,
        },

        {
          name: "Room 2",
          data: "00100002000111101121010000000221110111010200000000011010111000001000101210112112",
          type: RoomType.PATH_DROP,
        },

        {
          name: "Room 3 - No Top",
          data: "0000000000011000011001wwwwww1001wwwwww10011wwww110021111112000000000001112002111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 3 - With Top",
          data: "0010000100011000011021wwwwww1221wwwwww12011wwww110021111112000000000001112002111",
          type: RoomType.PATH_DROP,
        },

        {
          name: "Room 4 - A",
          data: "0000000000111000000000L000000011L000000011L001110011L011Q11000001202101110120211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 4 - B",
          data: "000000000000000001110000000L000000000L110011100L11011Q110L1101202100001120210111",
          type: RoomType.PATH_DROP,
        },

        {
          name: "Room 5 - With Top",
          data: "00000100000110011111011100011001100001100110001110011110011000001000001110101111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 5 - No Top",
          data: "00000000010110011111011100011001100001100110001110011110011000001000001110101111",
          type: RoomType.PATH_DROP,
        },

        {
          name: "Room 6 - A",
          data: "00000000000021200000000L002120212L000Q000L0L0000000L0L0000000L000000000000000000",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 6 - B",
          data: "00000000000000021200021200L00000Q000L212000000L0L0000000L0L000000000L00000000000",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 7 - Unused",
          notes: "Unused as PATH_DROP. Same room used for WORM_REGEN_STRUCTURE",
          data: "0dd0000dd02d0dddd0d20ddd00ddd02d0dddd0d20ddd00ddd000dddddd0011d0000d111111001111",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Path - No Top",
      rooms: [
        {
          name: "Room 1",
          data: "000000000000000000000001002000000000000000020020001s000000s111ssssss111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 2",
          data: "000000000000000000000002001000000000000000020020001s000000s111ssssss111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 3",
          data: "000000000000000000000002002000000000000000010010001s000000s111ssssss111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 4 - Unused",
          notes:
            "Unused. Can be written but is always overwritten but another PATH_NOTOP room.",
          data: "0000000000000000000000000000002000001000wwwwww1100wwwwwww110wwwwww11201111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 5 - Unused",
          notes:
            "Unused. Can be written but is always overwritten but another PATH_NOTOP room.",
          data: "00000000000000000000000000000000010000020011wwwwww011wwwwwww0211wwwwww1111111111",
          type: RoomType.PATH_NOTOP,
        },
      ],
    },
    {
      name: "Side",
      rooms: [
        {
          name: "Room 1",
          data: "00100001020111121101010000010221011101010201000002012101101101000100022111112121",
          type: RoomType.SIDE,
        },

        {
          name: "Room 2",
          data: "00100001000111121121010000000221110111010200000200111010111020001000101212112112",
          type: RoomType.SIDE,
        },

        {
          name: "Room 3",
          data: "0010000100011000011021wwwwww1221wwwwww12011wwww110021111112000000000001111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 4 - A",
          data: "0000000000111000000000L000000011L000000011L001110011L011Q11000001202101110120211",
          type: RoomType.SIDE,
        },
        {
          name: "Room 4 - B",
          data: "000000000000000001110000000L000000000L110011100L11011Q110L1101202100001120210111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 5",
          data: "00000100000110011111011100011001100001100110001110011110011000001000001112111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 6 - A",
          data: "00000000000021200000000L002120212L000Q000L0L0000000L0L0000000L000000000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Room 6 - B",
          data: "00000000000000021200021200L00000Q000L212000000L0L0000000L0L000000000L00000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Room 7 - Unused",
          notes: "Unused.",
          data: "11111111111111QQ1111110000001111110011111110000111110000001111002200111100000011",
          type: RoomType.SIDE,
        },
      ],
    },
    {
      name: "Worm Stuff",
      rooms: [
        {
          name: "Crysknife - Left",
          data: "0000000dd00011111110011vvvvvvw01vwwwwwww01vwwwwwww011cwwwwww00111111110000000000",
          type: RoomType.CRYSKNIFE_PIT_LEFT,
        },
        {
          name: "Crysknife - Right",
          data: "0dd00000000111111100wvvvvvv110wwwwwwwv10wwwwwwwv10wwwwwww11011111111000000000000",
          type: RoomType.CRYSKNIFE_PIT_RIGHT,
        },
        {
          name: "Regen Structure",
          data: "0dd0000dd02d0dddd0d20ddd00ddd02d0dddd0d20ddd00ddd000dddddd0011d0000d111111001111",
          type: RoomType.WORM_REGEN_STRUCTURE,
        },
      ],
    },
    {
      name: "Coffin",
      rooms: [
        {
          name: "Coffin",
          data: "11111111111100000011100000000100000000000000g00000100000000111000000111111111111",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - No Top",
          data: "10000000011100000011100000000100000000000000g00000100000000111000000111111111111",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin - Drop - No Top",
          data: "10000000011100000011100000000100000000000000g00000100000000111000000111111001111",
          type: RoomType.COFFIN_DROP,
        },
        {
          name: "Coffin - Drop",
          data: "11111111111100000011100000000100000000000000g00000100000000111000000111111001111",
          type: RoomType.COFFIN_DROP,
        },
      ],
    },
  ],
  chunks: {
    door: [{ data: "009000111011111" }],
    ground: [
      { data: "000000000022222", notes: "7/16 chance" },
      { data: "000002222211111", notes: "7/16 chance" },
      { data: "00000000000T022", notes: "1 / 24 chance" },
      { data: "000000000020T02", notes: "1 / 24 chance" },
      { data: "0000000000220T0", notes: "1 / 24 chance" },
    ],
    air: [
      { data: "111122222000000" },
      { data: "211110222200000" },
      { data: "222220000000000" },
      { data: "111112111200000" },
    ],
    vine: [
      { data: "L0L0LL0L0LL000LL0000" },
      { data: "L0L0LL0L0LL000L0000L" },
      { data: "0L0L00L0L00L0L0000L0" },
    ],
  },
};
