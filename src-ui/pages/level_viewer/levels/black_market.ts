import { RoomFlags, RoomType } from "../enums";
import type { Level } from "../types";

const config: Level = {
  rooms: [
    {
      name: "Entrance",
      rooms: [
        {
          name: "Room 1 - Unused",
          notes: "Unused as Entrance is always PATH_DROP.",
          data: "60000600000000000000000000000000000000000008000000000000000000000000000000000000",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },

        {
          name: "Room 2 - Unused",
          notes: "Unused as Entrance is always PATH_DROP.",
          data: "11111111112222222222000000000000000000000008000000000000000000000000000000000000",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },

        {
          name: "Room 3 - Drop",
          data: "60000600000000000000000000000000000000000008000000000000000000000000000002112000",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },

        {
          name: "Room 4 - Drop",
          data: "11111111112222222222000000000000000000000008000000000000000000000000000002112000",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Room 1 - Unused",
          notes: "Only used when room above is PATH_DROP. So never.",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.EXIT],
        },

        {
          name: "Room 2 - Unused",
          notes: "Only used when room above is PATH_DROP. So never.",

          data: "00000000000011111100000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.EXIT],
        },

        {
          name: "Room 3",
          data: "60000600000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.EXIT],
        },

        {
          name: "Room 4",
          data: "11111111112222222222000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.EXIT],
        },
      ],
    },
    {
      name: "Path",
      rooms: [
        {
          name: "Room 1",
          notes: "Used for middle two rooms on bottom row.",
          data: "60000600000000000000000000000000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 2",
          notes: "Used for middle two rooms on bottom row.",
          data: "60000600000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 3",
          notes: "Used for middle two rooms on bottom row.",
          data: "60000600000000000000000000000050000500000000000000000000000011111111111111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 4",
          notes: "Used for middle two rooms on bottom row.",
          data: "60000600000000000000000000000000000000000000000000000111110000111111001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 5",
          notes: "Used for middle two rooms on bottom row.",
          data: "1111111111V0000V000000000000000000000000000000000010000000011ssssssss11111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 6",
          notes:
            "Used for middle two rooms on bottom row. Also used for PATH_NOTOP.",
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 7",
          notes:
            "Used for middle two rooms on bottom row. Also used for PATH_NOTOP.",
          data: "000000000000000000000000000000013wwww310013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 8",
          notes: "Used for middle two rooms on bottom row.",
          data: "0060000000000000000000000000000000000000013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path - Drop",
      rooms: [
        {
          name: "Room 1",
          notes: "Allowed when room above is PATH_DROP.",
          data: "12G000002100P111100000G222200000G000000000G000000000G000002200000002111111202111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 2",
          notes: "Allowed when room above is PATH_DROP.",
          data: "1200000G210001111P000002222G000000000G000000000G002200000G00112T0000001111202111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 3",
          notes: "Allowed when room above is PATH_DROP.",
          data: "12000000G160000011P000000000G000000000G0G0000000G0P1122000G0G0000000G011100001p1",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 4",
          notes: "Allowed when room above is PATH_DROP.",
          data: "1200000G210001111P000002222G000000000G000000000G00000000000020000222221000111111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 5",
          notes: "Allowed when room above is PATH_DROP.",
          data: "12G000002100P111100000G222200000G000000000G0000000000000000022222000021111110001",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 6",
          notes:
            "This is the only room that can be used if the room above is not PATH drop meaning this room can only be selected in the top-right corner,",
          data: "11111111111111111111120000002120000000020000000000022000022021120021121111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room Above Ankh",
          notes: "Room index 7 always, and exclusively, uses this room.",
          data: "12G000002100P111100000G222200000G000000000G00000000000000022001G000211111P011111",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Path - No Top",
      rooms: [
        {
          name: "Room 1",
          notes: "Used for bottom left corner",
          data: "00000000000000000000000000000000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 2",
          notes: "Used for bottom left corner. Also used for PATH.",
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 3",
          notes: "Used for bottom left corner",
          data: "00000000000000000000000000000050000500000000000000000000000011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 4",
          notes: "Used for bottom left corner",
          data: "00000000000000000000000000000000000000000002222220001111111011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 5",
          notes: "Used for bottom left corner",
          data: "00000000000000000000000000000000000000000000000221000002211100002211111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 6",
          notes: "Used for bottom left corner. Also used for PATH.",
          data: "000000000000000000000000000000013wwww310013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 7",
          notes: "Used for bottom left corner",
          data: "0000000000006000000000000000000000000000013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH_NOTOP,
        },
      ],
    },
    {
      name: "Shopkeepers",
      rooms: [
        {
          name: "Ankh",
          notes:
            "Uses the code for RIGHT_FACING_SHOP but hard coded to appear at room index 11.",
          data: "...G011111...G0000.....G00a0lK...bbbbbbb..........111111111111111111111111111111",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Single NPC",
          notes: "Used for Single HH or Damsel.",
          data: "........................22......2l00l2..0.000000.00k000000k00000S00K00bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Triple NPC",
          notes: "1 / 100 Chance for HH Shop to have three.",
          data: "........................22......2l00l2..0.000000.00k000000k0000SSS0K00bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Double NPC",
          notes: "1 / 20 Chance for HH Shop to have two.",
          data: "........................22......2l00l2..0.000000.00k000000k0000S0S0K00bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },

        {
          name: "Item Shop",
          notes: "",
          data: "........................22......2l00l2..0.000000.00k000000k0000S000K00bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Prize Wheel",
          notes: "This is the only shop that uses SHOP_LEFT_FACING.",
          data: "1111111111111111111111112211111120000lK101W00001110k00000%010000S00%$1bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
      ],
    },
  ],
  chunks: {
    door: [{ data: "009000111011111" }],
    ground: [
      { data: "000000000022222", notes: "7/16 chance." },
      { data: "000002222211111", notes: "7/16 chance." },
      { data: "00000000000T022", notes: "1/24 chance." },
      { data: "000000000020T02", notes: "1/24 chance." },
      { data: "0000000000220T0", notes: "1/24 chance." },
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

export default config;
