import { RoomFlags, RoomType } from "../enums";
import type { Level } from "../types";

const config: Level = {
  rooms: [
    {
      name: "Entrance",
      rooms: [
        {
          name: "Room 1 - A",
          data: "1100000L002h09000L00hhhhhhhL00h000000L000050000L000000000L0000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 1 - B",
          data: "00L000001100L00090h200Lhhhhhhh00L000000h00L500000000L000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 2 - A",
          data: "0000000000000900000000hhh0000000hhhh000000hhhhh00000hhhhhh000hhhh222001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 2 - B",
          data: "0000000000000000900000000hhh000000hhhh00000hhhhh0000hhhhhh0000222hhhh01111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 3 - A",
          data: "000L00L0000hhL00Lhh00hhL00Lhh00hhL00Lhh00hhL00Lhh00hh0900hh01hh====hh11hhhhhhhh1",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 3 - B",
          data: "000L00L0000hhL00Lhh00hhL00Lhh00hhL00Lhh00hhL00Lhh00hh0090hh01hh====hh11hhhhhhhh1",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
      ],
    },
    {
      name: "Entrance - Drop",
      rooms: [
        {
          name: "Room 1 - A",
          data: "1100000L002h09000L00hhhhhhhL00h060000L000000000L000000000L0000000000001111001111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 1 - B",
          data: "00L000001100L00090h200Lhhhhhhh00L600000h00L000000000L000000000000000001111001111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 2 - A",
          data: "0000000000000900000000hhh0000000hhhh000000hhhhh00000hhhhhh000hhhh000001111101111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 2 - B",
          data: "0000000000000000900000000hhh000000hhhh00000hhhhh0000hhhhhh0000000hhhh01111011111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 3 - A",
          data: "000L00L0000hhL00Lhh00hhL00Lhh00hhL00Lhh00hh0000hh00hh0900hh01hh==-=hh11hhhh0hhh1",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 3 - B",
          data: "000L00L0000hhL00Lhh00hhL00Lhh00hhL00Lhh00hh0000hh00hh0090hh01hh=-==hh11hhh0hhhh1",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Exit - 1",
          notes: "Unused.",
          data: "00000000006000060000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Exit - 2",
          notes: "NO_TOP only",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
        {
          name: "Exit - 3",
          notes: "Can be used for NO_TOP or normal PATH",
          data: "000000000000100hhhh000100h00h000110h00h2001200000090111h==h011111111201111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
        {
          name: "Exit - 4",
          notes: "Can be used for NO_TOP or normal PATH",
          data: "00000000000hhhh001000h00h001002h00h0110000000021000h==h1110902111111111111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
        {
          name: "Exit - 5",
          notes: "Used when path comes from side.",
          data: "60000600000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Exit - 6",
          notes: "Used when path comes from side.",
          data: "11111111112222222222000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
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
          data: "50000500000000000000000000000011111111111111111111022222222000000000001100000011",
          type: RoomType.SIDE,
        },
        {
          name: "Room 3",
          notes: "Same room used for PATH",
          data: "00011110000002112000000022000011200002110112002110022000022000002200001111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 4 - A",
          data: "00002110000000211100000021120011200211110112002110022000022000000000001122112211",
          type: RoomType.SIDE,
        },
        {
          name: "Room 4 - B",
          data: "00011200000011120000000112000011112002110112002110022000022000000000001122112211",
          type: RoomType.SIDE,
        },
        {
          name: "Room 5 - A",
          data: "0000050000001000000000L000000011L111111111L111111100L211120000L21120001001111001",
          type: RoomType.SIDE,
        },
        {
          name: "Room 5 - B",
          data: "500000000000000001000000000L001111111L111111111L110021112L000002112L001001111001",
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
          name: "Room 8",
          data: "11111111110000000000110000001111222222111111111111112222221122000000221100000011",
          type: RoomType.SIDE,
        },
        {
          name: "Room 9",
          data: "00000000000000hh00000000hh0000h0&0hh0&0hhwwwhhwwwhhwwwhhwwwhhhwwhhwwhh1111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Idol Room ",
          notes: "1/10 chance. Top 3 rows only.",
          data: "111111111101*1111*10001111110000000000000000I000000011A0110001*1111*101111111111",
          type: RoomType.SIDE,
          flags: [RoomFlags.IDOL_ROOM],
        },
        {
          name: "Kali's Altar",
          notes: "1/14 chance.",
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
          data: "00000000000000q00000000020000000q010q0000020102000q0101010q01s1s1s1s1s1111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 8 - A",
          data: "000000011000001100L00110L000L000L0L000L000L00000L000L000000000000000001100000011",
          type: RoomType.PATH,
        },
        {
          name: "Room 8 - B",
          data: "01100000000L001100000L000L01100L000L0L000L00000L000000000L0000000000001100000011",
          type: RoomType.PATH,
        },

        {
          name: "Room 9",
          notes: "Same room used for SIDE.",
          data: "00011110000002112000000022000011200002110112002110022000022000002200001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 10",
          data: "0000000000000hhhh000000h00h00000hhhhhh0000hh00hh000hhhhhhhh00h00hh00h0hh0hhhh0hh",
          type: RoomType.PATH,
        },

        {
          name: "Room 11",
          data: "00000000000000000000000000000000000000000021111200021111112021111111121111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 12 - A",
          data: "00000000000111000000001110000001110000000011150000011100000000111000001112111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 12 - B",
          data: "00000000000000001110000001110000000011105000011100000000111000000111001111112111",
          type: RoomType.PATH,
        },

        // Same as PATH_NOTOP
        {
          name: "Room 13 - A",
          notes: "Same room used for PATH_NOTOP",
          data: "0000000000000000000000000000000000&00000013wwww310013wwww31011133331111111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 13 - B",
          notes: "Same room used for PATH_NOTOP",
          data: "00000000000000000000000000000000000&0000013wwww310013wwww31011133331111111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 14",
          data: "hhhhhhhhhhh00000000h00rr00rr00h00000000hh========h000000000000000000001111111111",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path Drop",
      rooms: [
        {
          name: "Room 1",
          notes: "Can be used for NO_TOP or not.",
          data: "00000000006000060000000000000000000000006000060000000000000000000000000000000000",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 2",
          notes: "Can be used for NO_TOP or not.",
          data: "00000000006000060000000000000000000000000000050000000000000000000000001200011111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 3",
          notes: "Can be used for NO_TOP or not.",
          data: "00000000006000060000000000000000000000005000000000000000000000000000001111100021",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 4",
          notes: "Can be used for NO_TOP or not.",
          data: "00000000006000060000000000000000000000000000000000000000000002200002201112002111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 5",
          notes: "Can be used for NO_TOP or not.",
          data: "00000000000000220000000000000000200002000112002110011100111012000000211111001111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 6",
          notes: "Can be used for NO_TOP or not.",
          data: "001000010000L0110L0000L2112L0000L2112L0000L2112L0000L0110L0000001100001000000001",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 7",
          notes: "Can be used for NO_TOP or not.",
          data: "00000000000f000000f00000000000000q00q00000010010000f010010f000010010001111001111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 8",
          notes: "Only used when room above isn't drop.",
          data: "11111111112222222222000000000000000000000000000000000000000000000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 9",
          notes: "Only used when room above isn't drop.",
          data: "50000500000000000000000000000011111111110211111120002222220000000000001100000011",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 10",
          notes: "Only used when room above isn't drop.",
          data: "11111111112222111111000002211100000002110000000000200000000000000000211120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 11",
          notes: "Only used when room above isn't drop.",
          data: "11111111111111112222111220000011200000000000000000000000000012000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 12",
          notes: "Only used when room above isn't drop.",
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
          name: "Room 2 - A",
          data: "hhq0000hhhh000000q0q00qhqh0000h=h0000q=q0000q000000010h1200000002122201111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 2 - B",
          data: "hhh0000qhhh0q000000h0000hqhq00h=q0000h=h00000q000000021h010002221200001111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 3",
          data: "hhhq00qhhhq00000000q000q00q000q==h00h==q0000000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 4",
          data: "00000000000000000000000600000000000000000000000000000111110000111111001111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 5",
          data: "000000000000000000000000000000000000000000210012000021001200ssssssssss1111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 6",
          data: "00000000000000000000000000000000000000000021111200021111112001111111101111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 7",
          data: "10000000011112002111111200211110000000010022222200001111110002111111201111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 8",
          data: "00000000000000000000000000000000ffffff000000000000020000002011ssssss111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 9 - A",
          notes: "Same room used for PATH",

          data: "0000000000000000000000000000000000&00000013wwww310013wwww31011133331111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 9 - B",
          notes: "Same room used for PATH",

          data: "00000000000000000000000000000000000&0000013wwww310013wwww31011133331111111111111",
          type: RoomType.PATH_NOTOP,
        },
      ],
    },

    {
      name: "Shopkeepers",
      rooms: [
        {
          name: "Right Facing - Prize Wheel",
          data: "1111111111111111111111112211111Kl0000211111000W01010%00000k01$%00S0000bbbbbbbbbb",
          notes: "Unused but code exists.",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Single NPC",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..K00S0000bbbbbbbbbb",
          notes: "Unused but code exists.",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Double Hired Hand",
          notes: "Unused but code exists. 1/100",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..K0S0S000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Triple Hired Hand",
          notes: "Unused but code exists. 1/20",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..K0SSS000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Shop",
          notes: "Unused but code exists.",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..KS000000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Left Facing - Prize Wheel",
          notes: "Unused but code exists.",
          data: "1111111111111111111111112211111120000lK101W00001110k00000%010000S00%$1bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Single NPC",
          notes: "Unused but code exists.",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...0000S00K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Double Hired Hand",
          notes: "Unused but code exists. 1/100",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...000S0S0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Triple Hired Hand",
          notes: "Unused but code exists. 1/20",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...000SSS0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Shop",
          notes: "Unused but code exists.",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...000S000K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
      ],
    },

    {
      name: "Coffin",
      rooms: [
        {
          name: "Coffin",
          data: "00000000000000000000001wwww100001wwww100011111111001100001100000g000001111111111",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - No Top",
          data: "000000000000000000000011ww11000011ww1100011111111001100001100000g000001111111111",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin - Drop, No Top",
          data: "01110011100011001100000000000022000000220000g0000000001100000000QQ00001111001111",
          type: RoomType.COFFIN_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Coffin - Drop",
          data: "01111111100011111100000000000022000000220000g0000000001100000000QQ00001111001111",
          type: RoomType.COFFIN_DROP,
        },
      ],
    },

    {
      name: "Vlad's Tower",
      rooms: [
        {
          name: "Vlad's Top",
          data: "0000hh000000shhhhs000shhhhhhs00hhhU0hhh0shh0000hhshhhh00hhhhhhQ0000Qhhhh000000hh",
          type: RoomType.VLADS_TOWER_TOP,
          flags: [RoomFlags.VLADS],
        },
        {
          name: "Vlad's Middle - A",
          data: "hh000000hhhh0V0000hhhh000000hhhh000000hhhh000000hhhhh00000hhhhQ0hhhhhhhh0qhhhhhh",
          type: RoomType.VLADS_TOWER_MIDDLE,
          flags: [RoomFlags.VLADS],
        },
        {
          name: "Vlad's Middle - B",
          data: "hh000000hhhh0V0000hhhh000000hhhh000000hhhh000000hhhh00000hhhhhhhhh0Qhhhhhhhhq0hh",
          type: RoomType.VLADS_TOWER_MIDDLE,
          flags: [RoomFlags.VLADS],
        },
        {
          name: "Vlad's Bottom",
          data: "hh0L00L0hhhhhL00Lhhh040L00L040hhhL00Lhhhhh0L00L0hh040ssss040hhshhhhshhhhhhhhhhhh",
          type: RoomType.VLADS_TOWER_BOTTOM,
          flags: [RoomFlags.VLADS],
        },
      ],
    },
    {
      name: "Yama's Throne",
      rooms: [
        {
          name: "Yama Top 0_0 - Exit",
          data: "0000Q000L000000000L009000000L0hhhh00h0L0hhhh00h000hhhh00h000hhhh00h0000000000000",
          type: RoomType.YAMA_0_0,
          flags: [RoomFlags.EXIT, RoomFlags.YAMA],
        },
        {
          name: "Yama Top 0_0",
          data: "0000Q000L000000000L0CCC00000L0hhhh00h0L0hhhh00h000hhhh00h000hhhh00h0000000000000",
          type: RoomType.YAMA_0_0,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Top 0_1",
          data: "0L00L0L0000L00L0L0000L00L000000000L000000000L000000000000Y0000000000000000000000",
          type: RoomType.YAMA_0_1,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Top 0_2",
          data: "000L0L00L0000L0L00L000000L00L000000L000000000L0000000000000000000000000000000000",
          type: RoomType.YAMA_0_2,
          flags: [RoomFlags.YAMA],
        },

        {
          name: "Yama Top 0_3",
          data: "0L000Q00000L000000000L00000CCC0L0h00hhhh000h00hhhh000h00hhhh000h00hhhh0000000000",
          type: RoomType.YAMA_0_3,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Top 0_3 - Exit",
          data: "0L000Q00000L000000000L000000900L0h00hhhh000h00hhhh000h00hhhh000h00hhhh0000000000",
          type: RoomType.YAMA_0_3,
          flags: [RoomFlags.EXIT, RoomFlags.YAMA],
        },

        {
          name: "Yama Middle Left - 0",
          data: "0000000000000070000000021207000000Q00120070000000021000000000Q000212000000000000",
          type: RoomType.YAMA_MIDDLE_LEFT,
          notes: "Exact room exists on YAMA_MIDDLE_RIGHT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Left - 1",
          data: "00000000000000070000007021200002100Q00000000000070000000001202120000Q00000000000",
          type: RoomType.YAMA_MIDDLE_LEFT,
          notes: "Exact room exists on YAMA_MIDDLE_RIGHT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Left - 2",
          data: "00000070000700001200010000L0000Q0020L000000000L000007000L020001200L0000000000000",
          type: RoomType.YAMA_MIDDLE_LEFT,
          notes: "Exact room exists on YAMA_MIDDLE_RIGHT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Left - 3",
          data: "00070000000021000070000L000010000L0200Q0000L000000020L000700000L0021000000000000",
          type: RoomType.YAMA_MIDDLE_LEFT,
          notes: "Exact room exists on YAMA_MIDDLE_RIGHT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Left - 4",
          data: "0000000000200000070000000001000010000L0000Q0020L001000000L0020007000000000100000",
          type: RoomType.YAMA_MIDDLE_LEFT,
          notes: "Exact room exists on YAMA_MIDDLE_RIGHT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Left - 5",
          data: "00000000000070000002001000000000L000010000L0200Q0000L000000700000700010000010000",
          type: RoomType.YAMA_MIDDLE_LEFT,
          notes: "Exact room exists on YAMA_MIDDLE_RIGHT",
          flags: [RoomFlags.YAMA],
        },

        {
          name: "Yama Throne Top Left",
          data: "0000000000000000000000000000000000000000000000Ihhh0000000hyy000000Ihyy0000000hyy",
          type: RoomType.YAMA_THRONE_TOP_LEFT,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Throne Top Right",
          data: "0000000000000000000000000000000000000000hhhI000000yyh0000000yyhI000000yyh0000000",
          type: RoomType.YAMA_THRONE_TOP_RIGHT,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Throne Bottom Left - 0",
          data: "000000Ihyy0000200hyy000000Ihyy0000000hyy002000Ihyy0000000hyy000000Ihyy000200hhyy",
          type: RoomType.YAMA_THRONE_BOTTOM_LEFT,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Throne Bottom Left - 1",
          data: "000000Ihyy0000100hyy000020Ihyy0100000hyy020000Ihyy0000100hyy000020Ihyy000000hhyy",
          type: RoomType.YAMA_THRONE_BOTTOM_LEFT,
          flags: [RoomFlags.YAMA],
        },

        {
          name: "Yama Throne Bottom Right - 0",
          data: "yyhI000000yyh0020000yyhI000000yyh0000000yyhI000200yyh0000000yyhI000000yyhh020000",
          type: RoomType.YAMA_THRONE_BOTTOM_RIGHT,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Throne Bottom Right - 1",
          data: "yyhI000000yyh0010000yyhI020000yyh0000010yyhI000020yyh0010000yyhI020000yyhh000000",
          type: RoomType.YAMA_THRONE_BOTTOM_RIGHT,
          flags: [RoomFlags.YAMA],
        },

        {
          name: "Yama Middle Right - 0",
          data: "0000000000000070000000021207000000Q00120070000000021000000000Q000212000000000000",
          type: RoomType.YAMA_MIDDLE_RIGHT,
          notes: "Exact room exists on YAMA_MIDDLE_LEFT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Right - 1",
          data: "00000000000000070000007021200002100Q00000000000070000000001202120000Q00000000000",
          type: RoomType.YAMA_MIDDLE_RIGHT,
          notes: "Exact room exists on YAMA_MIDDLE_LEFT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Right - 2",
          data: "00000070000700001200010000L0000Q0020L000000000L000007000L020001200L0000000000000",
          type: RoomType.YAMA_MIDDLE_RIGHT,
          notes: "Exact room exists on YAMA_MIDDLE_LEFT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Right - 3",
          data: "00070000000021000070000L000010000L0200Q0000L000000020L000700000L0021000000000000",
          type: RoomType.YAMA_MIDDLE_RIGHT,
          notes: "Exact room exists on YAMA_MIDDLE_LEFT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Right - 4",
          data: "0000000000200000070000000001000010000L0000Q0020L001000000L0020007000000000100000",
          type: RoomType.YAMA_MIDDLE_RIGHT,
          notes: "Exact room exists on YAMA_MIDDLE_LEFT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Middle Right - 5",
          data: "00000000000070000002001000000000L000010000L0200Q0000L000000700000700010000010000",
          type: RoomType.YAMA_MIDDLE_RIGHT,
          notes: "Exact room exists on YAMA_MIDDLE_LEFT",
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Bottom 3_0",
          data: "00000000000000000000000000000000000X00000&00qqq000000qqqqqqqwwwwwwwwwwwwwwwwwwww",
          type: RoomType.YAMA_3_0,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Bottom 3_1",
          data: "000000000000000000000000000000000000000000000z0009qqqqqqqqqqwwwwwwwwwwwwwwwwwwww",
          type: RoomType.YAMA_3_1,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Bottom 3_2",
          data: "00000000000000000000000000000000000000000000000000qqqqqqqqqqwwwwwwwwwwwwwwwwwwww",
          type: RoomType.YAMA_3_2,
          flags: [RoomFlags.YAMA],
        },
        {
          name: "Yama Bottom 3_3",
          data: "0000000000000000000000000000000000X00000000qqq00&0qqqqqqq000wwwwwwwwwwwwwwwwwwww",
          type: RoomType.YAMA_3_3,
          flags: [RoomFlags.YAMA],
        },
      ],
    },
  ],
  chunks: {
    door: [{ data: "009000111011111" }],
    ground: [
      { data: "000000000022222", notes: "7/16 Chance" },
      { data: "000002222211111", notes: "7/16 Chance" },
      { data: "000000000000022", notes: "1/24 Chance" },
      { data: "00000sssss11111", notes: "1/24 Chance" },
      { data: "000000000022000", notes: "1/24 Chance" },
    ],
    air: [
      { data: "111102222000000" },
      { data: "011110222200000" },
      { data: "222200000000000" },
      { data: "022220000000000" },
      { data: "011100222000000" },
      { data: "000000ssss01111" },
      { data: "00000ssss011110" },
    ],
    vine: [
      { data: "0hhh000u000000000000" },
      { data: "0hhh00u0u00000000000" },
      { data: "0hhh00uu000000000000" },
      { data: "0hh00hhhh0uhhu0uhhu0" },
      { data: "00hh00hhhh0uhhu0uhhu" },
    ],
  },
};

export default config;
