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
          data: "00000000000008000000000000000000L000000000P111111000L111111000L00111111111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 4",
          data: "0000000000008000000000000000000000000L000111111P000111111L001111100L001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 5 - A",
          notes: "50% chance of this variant",
          data: "011111111001111111100vvvvvvvv00vv0000vv0000090000001v====v1001111111101111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 5 - B",
          notes: "50% chance of this variant",
          data: "011111111001111111100vvvvvvvv00vv0000vv0000009000001v====v1001111111101111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
      ],
    },
    {
      name: "Entrance - Drop",
      rooms: [
        {
          name: "Room 1",
          data: "60000600000000000000000000000000000000000008000000000000000000000000002000000002",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 2",
          data: "11111111112222222222000000000000000000000008000000000000000000000000002000000002",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 3",
          data: "00000000000008000000000000000000L000000000P111111000Lvvvv11000L000v1111vvvv0v111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 4",
          data: "0000000000008000000000000000000000000L000111111P00011vvvvL00111v000L00111v0vvvv1",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 5 - A",
          notes: "50% chance of this variant",
          data: "011111111001111111100vvvvvvvv00vv0000vv0000090000001v====v100111v000001111v0vv11",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 5 - B",
          notes: "50% chance of this variant",
          data: "011111111001111111100vvvvvvvv00vv0000vv0000009000001v====v1000000v111011vv0v1111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Room 1",
          data: "00000000006000060000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 2",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 3",
          data: "00000000000010021110001001111000110111129012000000111111111021111111201111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 4",
          data: "00000000000111200100011110010021111011000000002109011111111102111111121111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 5",
          data: "60000600000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 6",
          data: "11111111112222222222000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
      ],
    },
    {
      name: "Exit - No Top",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
        {
          name: "Room 2",
          data: "00000000000010021110001001111000110111129012000000111111111021111111201111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
        {
          name: "Room 3",
          data: "00000000000111200100011110010021111011000000002109011111111102111111121111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
      ],
    },
    {
      name: "Side",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000010111100000000000000011010000050000000000000000000000000001111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 2",
          notes:
            "50% chance Room 3 will be used instead. Room 4 will use this room on 1-1 and 1-2.",
          data: "110000000040L600000011P000000011L000000011L5000000110000000011000000001111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 3",
          notes:
            "Slightly more common as Room 2 has 50% chance to choose this room instead.",
          data: "00000000110060000L040000000P110000000L110050000L11000000001100000000111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 4",
          notes:
            "If selected on 1-1 or 1-2 use Room 2 (Room 2 can still reroll to Room 3)",
          data: "11000000110#000000#0111100111111200002112200000022110000001111200002111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 5 - A",
          notes: "50% chance of this variant",
          data: "11111111112000L000021vvvP0vvv11v0vL0v0v10000L000001v=v11v=v111111111111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 5 - B",
          notes: "50% chance of this variant",
          data: "111111111120000L00021vvv0Pvvv11v0v0Lv0v100000L00001v=v11v=v111111111111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 6",
          data: "11111111110221111220002111120000022220000002222000002111120002211112201111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 7",
          data: "11111111111112222111112000021111102201111120000211111022011111200002111112222111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 8 - A",
          notes: "33% chance of this variant",
          data: "11111111110000000000110000001111222222111111111111012222221200000000201100000011",
          type: RoomType.SIDE,
        },
        {
          name: "Room 8 - B",
          notes: "33% chance of this variant",
          data: "11111111110000000000110000001111222222111111111111212222221002000000001100000011",
          type: RoomType.SIDE,
        },
        {
          name: "Room 8 - C",
          notes: "33% chance of this variant",
          data: "11111111110000000000110000001111222222111111111111112222221112000000211100000011",
          type: RoomType.SIDE,
        },
        {
          name: "Room 9",
          data: "121111112100L2112L0011P1111P1111L2112L1111L1111L1111L1221L1100L0000L001111221111",
          type: RoomType.SIDE,
        },
        {
          name: "Idol Room ",
          notes: "1/10 chance. Levels 1-2, 1-3, 1-4 only. Top 3 rows only.",
          data: "2200000022000000000000000000000000000000000000000000000000000000I000001111A01111",
          type: RoomType.SIDE,
          flags: [RoomFlags.IDOL_ROOM],
        },
        {
          name: "Kali's Altar",
          notes: "1/14 chance. Levels 1-2, 1-3, 1-4 only.",
          data: "220000002200000000000000000000000000000000000000000000x0000002211112201111111111",
          type: RoomType.SIDE,
          flags: [RoomFlags.KALI_ROOM],
        },
      ],
    },
    {
      name: "Path",
      rooms: [
        {
          name: "Room 1",
          data: "60000600000000000000000000000000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 2",
          data: "60000600000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 3",
          data: "60000600000000000000000000000000050000000000000000000000000011111111111111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 4",
          data: "60000600000000000000000600000000000000000000000000000222220000111111001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 5",
          data: "11111111112222222222000000000000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 6",
          data: "11111111112111111112022222222000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 7",
          data: "11111111112111111112211111111201111111100111111110022222222000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 8 - A",
          notes: "50% chance of this variant",

          data: "1111111111000000000L111111111P000000000L5000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 8 - B",
          notes: "50% chance of this variant",

          data: "1111111111L000000000P111111111L0000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 9",
          data: "000000000000L0000L0000PvvvvP0000L0000L0000PvvvvP0000L1111L0000L1111L001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 10",
          data: "00000000000111111110001111110000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 11",
          data: "00000000000000000000000000000000000000000021111200021111112021111111121111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 12 - A",
          notes: "50% chance of this variant",

          data: "2222222222000000000000000000L00vvvvvvvP00v050000L0vv000000L0v0000000L01111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room - B",
          notes: "50% chance of this variant",

          data: "222222222200000000000L000000000Pvvvvvvv00L500000v00L000000vv0L0000000v1111111111",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path Drop",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000000000000600006000000000000000000000000600006000000000000000000000000",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 2",
          data: "00000000000000000000600006000000000000000000050000000000000000000000001202111111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 2 - Skin is crawling",
          data: "00000000000000000000600006000000000000000000050000000000000000000000001200021111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 3",
          data: "00000000000000000000600006000000000000050000000000000000000000000000001111112021",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 3 - Skin is crawling",
          data: "00000000000000000000600006000000000000050000000000000000000000000000001111200021",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 4",
          notes: "Also used for SNAKE_PIT_TOP",
          data: "00000000000060000000000000000000000000000000000000001112220002100000001110111111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 4 - Skin is crawling",
          data: "00000000000060000000000000000000000000000000000000001112220002100000001110011111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 5",
          notes: "Also used for SNAKE_PIT_TOP",
          data: "00000000000060000000000000000000000000000000000000002221110000000001201111110111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 5 - Skin is crawling",
          data: "00000000000060000000000000000000000000000000000000002221110000000001201111100111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 6",
          notes: "Also used for SNAKE_PIT_TOP",
          data: "00000000000000000000600006000000000000000000000000000000000002200002201112002111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 7",
          notes: "Also used for SNAKE_PIT_TOP",
          data: "00000000000000220000000000000000200002000112002110011100111012000000211111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 8",
          notes: "Also used for SNAKE_PIT_TOP",
          data: "00000000000060000000000000000000000000000000000000002022020000100001001111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 9",
          notes:
            "Also used for SNAKE_PIT_TOP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111112222222222000000000000000000000000000000000000000000000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 10",
          notes:
            "Also used for SNAKE_PIT_TOP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111112222111111000002211200000002100000000000200000000000000000211120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 11",
          notes:
            "Also used for SNAKE_PIT_TOP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111111111112222211220000001200000000000000000000000000012000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 12",
          notes:
            "Also used for SNAKE_PIT_TOP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111112111111112021111112000211112000002112000000022000002200002201111001111",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Path - No Top",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000000000000000000000000000000000050000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 2",
          notes: "Twice as likely.",
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 3",
          data: "00000000000000000000000600000000000000000000000000000111110000111111001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 4",
          notes: "Same as PATH Room 10.",
          data: "00000000000111111110001111110000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 5",
          notes: "Same as PATH Room 11.",
          data: "00000000000000000000000000000000000000000021111200021111112021111111121111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 6",
          data: "10000000011112002111111200211100000000000022222000011111111011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 7 - A",
          data: "0000000000000000000000000000L00vvvvvvvP00v050000L0vv000000L0v0000000L01111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 7 - B",
          data: "000000000000000000000L000000000Pvvvvvvv00L500000v00L000000vv0L0000000v1111111111",
          type: RoomType.PATH_NOTOP,
        },
      ],
    },
    {
      name: "Snake Pit",
      rooms: [
        {
          name: "Top 1",
          notes: "Also used for PATH_DROP",
          data: "00000000000060000000000000000000000000000000000000001112220002100000001110111111",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 2",
          notes: "Also used for PATH_DROP",
          data: "00000000000060000000000000000000000000000000000000002221110000000001201111110111",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 3",
          notes: "Also used for PATH_DROP",
          data: "00000000000000000000600006000000000000000000000000000000000002200002201112002111",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 4",
          notes: "Also used for PATH_DROP",
          data: "00000000000000220000000000000000200002000112002110011100111012000000211111001111",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 5",
          notes: "Also used for PATH_DROP",
          data: "00000000000060000000000000000000000000000000000000002022020000100001001111001111",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 6",
          notes:
            "Also used for PATH_DROP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111112222222222000000000000000000000000000000000000000000000000001120000211",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 7",
          notes:
            "Also used for PATH_DROP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111112222111111000002211200000002100000000000200000000000000000211120000211",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 8",
          notes:
            "Also used for PATH_DROP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111111111112222211220000001200000000000000000000000000012000000001120000211",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Top 9",
          notes:
            "Also used for PATH_DROP. Not used if room above is PATH_DROP or COFFIN_DROP.",
          data: "11111111112111111112021111112000211112000002112000000022000002200002201111001111",
          type: RoomType.SNAKE_PIT_TOP,
        },
        {
          name: "Middle",
          data: "111000011111n0000n11111200211111n0000n11111200211111n0000n11111200211111n0000n11",
          type: RoomType.SNAKE_PIT_MIDDLE,
        },
        {
          name: "Bottom",
          data: "111000011111n0000n1111100001111100N0001111N0110N11111NRRN1111111M111111111111111",
          type: RoomType.SNAKE_PIT_BOTTOM,
        },
      ],
    },
    {
      name: "Coffin",
      rooms: [
        {
          name: "Coffin",
          data: "vvvvvvvvvv0++++++++0vL00g000LvvPvvvvvvPv0L000000L00L000000L00L000000L01111111111",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - Exit Right",
          data: "vvvvvvvvvvv++++++++vvL00000g0vvPvvvvvvvv0L000000000L0:000:0011111111111111111111",
          type: RoomType.COFFIN_EXIT_RIGHT,
        },
        {
          name: "Coffin - Exit Left",
          data: "vvvvvvvvvvv++++++++vvg000000LvvvvvvvvvPv00000000L000:000:0L011111111111111111111",
          type: RoomType.COFFIN_EXIT_LEFT,
        },
        {
          name: "Coffin - No Top",
          data: "0000000000000000000000000000000L222222L0vPvvvvvvPvvL000000LvvL00g000Lvv========v",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin - Drop, No Top",
          data: "000000000000vvvvvv0000v0000v000L00g000L00Pv====vP00L0v00v0L00L000000L0111v00v111",
          type: RoomType.COFFIN_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Coffin - Drop",
          data: "vvvvvvvvvvv++++++++vvL00g000LvvPvvvvvvPv0L000000L00L000000L00L000000L01111001111",
          type: RoomType.COFFIN_DROP,
        },
      ],
    },
    {
      name: "Spider Lair",
      rooms: [
        {
          name: "Spider Lair 1 - A",
          data: "11111111111111112X02111X02000011200000000120002222012000000000000222221111111111",
          type: RoomType.SPIDER_LAIR_1,
        },
        {
          name: "Spider Lair 1 - B",
          data: "11111111111111122222111X00000011200001100111000X00012000100000000212221111111111",
          type: RoomType.SPIDER_LAIR_1,
        },
        {
          name: "Spider Lair 1 - C",
          data: "111111111111X01112221100002000112010000001201011100120001X0000000110001111111111",
          type: RoomType.SPIDER_LAIR_1,
        },
        {
          name: "Spider Lair 1 - No Top - A",
          data: "1v000000v11vvv00vvv11X0v00vX0010000000000020002222112000000000000222221111111111",
          type: RoomType.SPIDER_LAIR_1,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Spider Lair 1 - No Top - B",
          data: "1v000000v11vvv00vvv11X0v00v000100000vvv00012000X00111000100000000212221111111111",
          type: RoomType.SPIDER_LAIR_1,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Spider Lair 1 - No Top - C",
          data: "1v000000v11vvv00vvv11X0v00v000100000000000200011101120001X0000000110001111111111",
          type: RoomType.SPIDER_LAIR_1,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Spider Lair 2 - A",
          data: "11111111112X0211111100002X011100000002112222000210000000021022222000001111111111",
          type: RoomType.SPIDER_LAIR_2,
        },
        {
          name: "Spider Lair 2 - B",
          data: "1111111111222221111100000X011101100002110X00001110000100021022212000001111111111",
          type: RoomType.SPIDER_LAIR_2,
        },
        {
          name: "Spider Lair 2 - C",
          data: "1111111111222111X0110002000011000001021101110102100X0100021000011000001111111111",
          type: RoomType.SPIDER_LAIR_2,
        },
        {
          name: "Spider Lair 2 - No Top - A",
          data: "1v000000v11vvv00vvv10X0v00vX0100000000012222000200000000021122222000001111111111",
          type: RoomType.SPIDER_LAIR_2,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Spider Lair 2 - No Top - B",
          data: "1v000000v11vvv00vvv1000v00vX010vvv0000010X00002100000100011122212000001111111111",
          type: RoomType.SPIDER_LAIR_2,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Spider Lair 2 - No Top - C",
          data: "1v000000v11vvv00vvv1000v00vX01000000000101110002000X0100021100011000001111111111",
          type: RoomType.SPIDER_LAIR_2,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Spider Lair 3",
          data: "1111111111111vvvvX02111vX0v000112000000021200022220100000000000v00v222111v00v111",
          type: RoomType.SPIDER_LAIR_3,
        },
        {
          name: "Spider Lair 3 - No Top",
          data: "111v00v111111v00vX02111v00v000112v000000212v00v1110100000X00000v00v000111v00v111",
          type: RoomType.SPIDER_LAIR_3,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Spider Lair 4",
          data: "11111111112X0vvvv111000vX0v111000000021122220002120000000010222v00v000111v00v111",
          type: RoomType.SPIDER_LAIR_4,
        },
        {
          name: "Spider Lair 4 - No Top",
          data: "111v00v1112X0v00v111000v00v111000000v211111v00v2120X00000010000v00v000111v00v111",
          type: RoomType.SPIDER_LAIR_4,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Round Girl Coffin",
          notes: "Not used on Daily Challenge",
          data: "1111111111111X0X000211100000011111100g010120001111012000000000000122221111111111",
          type: RoomType.SPIDER_LAIR_1,
          flags: [RoomFlags.NO_DAILY, RoomFlags.CHAR_UNLOCK],
        },
        {
          name: "Round Girl Coffin - No Top",
          notes: "Not used on Daily Challenge",
          data: "1v000000v11vvv00vvv1X00000vX00000010000000g0102222111110000000000022221111111111",
          type: RoomType.SPIDER_LAIR_1,
          flags: [RoomFlags.NO_DAILY, RoomFlags.CHAR_UNLOCK, RoomFlags.NO_TOP],
        },
      ],
    },
    {
      name: "Shopkeepers",
      rooms: [
        {
          name: "Right Facing - Prize Wheel",
          data: "11111111111111..1111....22...1.Kl00002.....000W0.0.0%00000k0.$%00S0000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Single NPC",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..K00S0000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Double Hired Hand",
          notes: "1/100",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..K0S0S000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Triple Hired Hand",
          notes: "1/20",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..K0SSS000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Shop",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..KS000000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Left Facing - Prize Wheel",
          data: "11111111111111..11111...22......20000lK.0.W0000...0k00000%0.0000S00%$.bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Single NPC",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...0000S00K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Double Hired Hand",
          notes: "1/100",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...000S0S0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Triple Hired Hand",
          notes: "1/20",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...000SSS0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Shop",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...000S000K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Vault",
          data: "11111111111111111111111|00011111100001111110EE0111111000011111111111111111111111",
          type: RoomType.VAULT,
        },
      ],
    },
  ],
  chunks: {
    door: [{ data: "009000111011111" }],
    ground: [
      { data: "011100020000000", notes: "Used on 1-3 and 1-4 only." },
      { data: "000001111000000", notes: "Used on 1-3 and 1-4 only." },
      { data: "000000111100000", notes: "Used on 1-3 and 1-4 only." },
      { data: "000000000011111" },
      { data: "000002020017177", notes: "Used on 1-3 and 1-4 only." },
      { data: "000000202071717", notes: "Used on 1-3 and 1-4 only." },
      { data: "000000020277171", notes: "Used on 1-3 and 1-4 only." },
      { data: "000002220011100" },
      { data: "000000222001110" },
      { data: "000000022200111" },
      { data: "111002220000000", notes: "Used on 1-3 and 1-4 only." },
      { data: "011100222000000", notes: "Used on 1-3 and 1-4 only." },
      { data: "001110022200000", notes: "Used on 1-3 and 1-4 only." },
      { data: "000001111000000", notes: "Used on 1-1 and 1-2 only." },
      { data: "000000222021112" },
      { data: "000002010077117", notes: "Used on 1-3 and 1-4 only." },
      { data: "000000010271177", notes: "Used on 1-3 and 1-4 only." },
      { data: "0010000#0002120", notes: "Used on 1-1 and 1-2 only." },
      { data: "000000111100000", notes: "Used on 1-1 and 1-2 only." },
      {
        data: "000000020077177",
        notes:
          "Used on 1-1 and 1-2 only. Has slightly higher weight from other chunks.",
      },
      { data: "000000010077777", notes: "Used on 1-1 and 1-2 only." },
      { data: "111002220000077", notes: "Used on 1-1 and 1-2 only." },
      { data: "011100222070007", notes: "Used on 1-1 and 1-2 only." },
      { data: "001110022277000", notes: "Used on 1-1 and 1-2 only." },
      { data: "000002010077177", notes: "Used on 1-1 and 1-2 only." },
      { data: "000000010277177", notes: "Used on 1-1 and 1-2 only." },
    ],
    air: [
      { data: "022220000022220" },
      { data: "222200000002222" },
      { data: "111002220000000" },
      { data: "011100222000000" },
      { data: "001110022200000" },
      { data: "000000111000000" },
      { data: "000000111002220" },
      { data: "000000222001110" },
      { data: "000000022001111" },
      { data: "000002220011100" },
    ],
  },
};
