import { RoomFlags, RoomType } from "../enums";
import type { Level } from "../types";

const config: Level = {
  rooms: [
    {
      name: "Entrance",
      rooms: [
        {
          name: "Room 1 - Unused",
          notes: "Used when the entrance is not PATH_DROP, so never.",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 2",
          data: "00000000000000000000000000000000000000000008000000000000000000000000002021111120",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 3",
          data: "00000000000000000000000000000000000000000008000000000000000000000000000211111202",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Room - 1",
          notes: "Used when room above is CASTLE_4",
          data: "0G00000000tPtt00tt000G000000000G000000000G00h000000G00000090rrrttttrrr1111111111",
          type: RoomType.CASTLE_6,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room - 2",
          notes: "Used when room above is CASTLE_3",
          data: "00000000000000000000000000000000000000000000h000000900000000rrrttttrrr1111111111",
          type: RoomType.CASTLE_5,
          flags: [RoomFlags.EXIT],
        },
      ],
    },
    {
      name: "Path",
      rooms: [
        {
          name: "Room 1 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
          data: "60000600000000000000000000000000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 2 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
          data: "60000600000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 3 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
          data: "60000600000000000000000000000050000500000000000000000000000011111111111111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 4 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
          data: "60000600000000000000000000000000000000000000000000000111110000111111001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 5 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
          data: "1111111111V0000V000000000000000000000000000000000010000000011ssssssss11111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 6 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 7 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
          data: "000000000000000000000000000000013wwww310013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 8 - Unused",
          notes: "PATH rooms aren't used in Haunted Castle",
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
          data: "00G000000000P111100000G222200000G000000000G000000000G000002200000002111111202111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 2",
          data: "0000000G000001111P000002222G000000000G000000000G002200000G00112T0000001111202111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 3",
          data: "00000000G060000011P000000000G000000000G0G0000000G0P1122000G0G0000000G011100001p1",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 4",
          data: "0000000G000001111P000002222G000000000G000000000G00000000000020000222221000111111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 5",
          data: "00G000000000P111100000G222200000G000000000G0000000000000000022222000021111110001",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 6 - Unused",
          notes:
            "Can only be used if room above isn't PATH_DROP which only happens at the entrance so this room is unused.",
          data: "11111111111111111111120000002120000000020000000000022000022021120021121111001111",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Path - No Top",
      rooms: [
        {
          name: "Room 1 - Unused",
          notes: "PATH_NOTOP aren't used in Haunted Castle",
          data: "00000000000000000000000000000000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 2 - Unused",
          notes: "PATH_NOTOP aren't used in Haunted Castle",
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 3 - Unused",
          notes: "PATH_NOTOP aren't used in Haunted Castle",
          data: "00000000000000000000000000000050000500000000000000000000000011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 4 - Unused",
          notes: "PATH_NOTOP aren't used in Haunted Castle",
          data: "00000000000000000000000000000000000000000002222220001111111011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 5 - Unused",
          notes: "PATH_NOTOP aren't used in Haunted Castle",
          data: "00000000000000000000000000000000000000000000000221000002211100002211111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 6 - Unused",
          notes: "PATH_NOTOP aren't used in Haunted Castle",
          data: "000000000000000000000000000000013wwww310013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 7 - Unused",
          notes: "PATH_NOTOP aren't used in Haunted Castle",
          data: "0000000000006000000000000000000000000000013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH_NOTOP,
        },
      ],
    },
    {
      name: "Coffin",
      rooms: [
        {
          name: "Coffin",
          data: "00000000000t0t0t0t0ttttttttttttttttttttt000400000tg00tt0000tttttU00000tttttttttt",
          type: RoomType.COFFIN,
        },
      ],
    },
    {
      name: "Castle",
      rooms: [
        {
          name: "Castle 1 (30) - A",
          notes:
            "Used if placed at room index 0 which is where the COFFIN room is normally placed.",
          data: "00000000000t0t0t0t0ttttttttttttttttttttt000000000t000000000t0U00000000tttttttttt",
          type: RoomType.CASTLE_1,
        },
        {
          name: "Castle 1 (30) - B",
          notes: "Used if not placed at room index 0 (always).",
          data: "00000000000t0t0t0t0ttttttttttttttttttttt0000000000tttt00tttt0000000000tttttttttt",
          type: RoomType.CASTLE_1,
        },
        {
          name: "Castle 2 (31)",
          notes: "Castle Top-Right Corner",
          data: "00000000000t0t0t0t0ttttttttttttttttttttt0000000ttttttt000ttt00000x0ttttt000ttttt",
          type: RoomType.CASTLE_2,
        },
        {
          name: "Castle 3 (32) - A",
          data: "0000000000000t000G00000ttttPtt0000000G000000000G00ttt0000G00ttttt00G00tttttttttt",
          type: RoomType.CASTLE_3,
        },
        {
          name: "Castle 3 (32) - B",
          notes: "Inner floors of castle.",
          data: "000000000000G000t000ttPtttt00000G000000000G000000000G0000ttt00G00ttttttttttttttt",
          type: RoomType.CASTLE_3,
        },
        {
          name: "Castle 4 (33)",
          notes: "Inner floors of castle.",
          data: "000G00G000tttPttPttt000G00G000000G00G000000tttt0000000000000tt000000ttttt0000ttt",
          type: RoomType.CASTLE_4,
        },
        {
          name: "Castle 5 (34) - A",
          notes: "Used for bottom floor of castle.",
          data: "0000000000tt000000tt000000000000000000000000tt00000000tt0000rrrrttrrrr1111111111",
          type: RoomType.CASTLE_5,
        },
        {
          name: "Castle 5 (34) - B",
          notes: "Used for bottom floor of castle.",
          data: "0000000000tt000000000000000000000000000000000000tt0000rrrrttrrrrrrrrtt1111111111",
          type: RoomType.CASTLE_5,
        },
        {
          name: "Castle 5 (34) - C",
          notes: "Used for bottom floor of castle.",
          data: "000000000000000000tt00000000000000000000tt00000000ttrrrr0000ttrrrrrrrr1111111111",
          type: RoomType.CASTLE_5,
        },
        {
          name: "Castle 5 (34) - D",
          notes: "Used for bottom floor of castle.",
          data: "000000000000000000tt000000000000000000000000000000000T000000rrrrrrrrrr1111111111",
          type: RoomType.CASTLE_5,
        },
        {
          name: "Castle 5 (34) - E",
          notes: "Used for bottom floor of castle.",
          data: "0000000000tt00000000000000000000000000000000000000000000T000rrrrrrrrrr1111111111",
          type: RoomType.CASTLE_5,
        },
        {
          name: "Castle 6 (35)",
          notes: "Used for bottom floor of castle.",
          data: "0000GG0000ttttPPtttt0000GG00000000GG00000000GG00000000GG0000rrrrrrrrrr1111111111",
          type: RoomType.CASTLE_6,
        },
        {
          name: "Castle 7 (36) - A",
          notes: "Castle outer wall.",
          data: "0000G00ttt000tG00tttttttPttttt0000G002tt0000G00ttt0000G00ttt0000G00ttttttttttttt",
          type: RoomType.CASTLE_7,
        },
        {
          name: "Castle 7 (36) - B",
          notes: "Castle outer wall.",
          data: "0000G00ttt0000Pttttt0000G0tttt0000G002tt0000G00ttt000ttttttt0ttttttttttttttttttt",
          type: RoomType.CASTLE_7,
        },
        {
          name: "Castle 7 (36) - C - Unused",
          notes: "Unused. Does 1 of 2 and this is the third choice.",
          data: "0000000ttt00tt000ttt000000tttt00000002tt000ttttttt0000000ttttt000002tttttttttttt",
          type: RoomType.CASTLE_7,
        },
        {
          name: "Castle 8 (37)",
          notes: "Castle outer wall.",
          data: "0000000ttt00000ttttt000000tttt0ttt0002tt00t0000ttt000000tttt000000tttttt0000tttt",
          type: RoomType.CASTLE_8,
        },
        {
          name: "Castle 9 (38)",
          notes: "Castle Door",
          data: "0000000ttt0000000ttt0000000ttD0000000ttD00000000000000000x00rrrrrrrrrr1111111111",
          type: RoomType.CASTLE_9,
        },
        {
          name: "Castle 10 (39)",
          notes: "Castle Door",
          data: "0000000ttt0000tttttt0000000ttD000ttttttDt000000000t000x00x00trrrrrrrrr1111111111",
          type: RoomType.CASTLE_10,
        },
        {
          name: "Castle 11 (40)",
          notes: "Castle Moat - Bottom right corner",
          data: "000000000000000000000000000000000000000000000000000000000T00wwwww11111wwwww11111",
          type: RoomType.CASTLE_11,
        },
      ],
    },
  ],
  chunks: {
    door: [{ data: "009000ttt011111" }],
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
