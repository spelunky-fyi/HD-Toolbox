import { RoomFlags, RoomType } from "../enums";
import type { Level } from "../types";

const config: Level = {
  rooms: [
    {
      name: "Entrance",
      rooms: [
        {
          name: "Temple",
          data: "11111111110000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Temple - Drop",
          data: "11111111110000000000000000000000000000000008000000000000000000000000002000000002",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "CoG - A",
          data: "011111110000000000000000000000000000000000z090z000011111110001111111001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE, RoomFlags.CoG],
        },

        {
          name: "CoG - B",
          data: "0011111110000000000000000000000000000000000z090z00001111111000111111101111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE, RoomFlags.CoG],
        },
        {
          name: "CoG - Drop - A",
          data: "011111110000000000000000000000000000000000z090z000011111110004000001001112002111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE, RoomFlags.CoG],
        },

        {
          name: "CoG - Drop - B",
          data: "0011111110000000000000000000000000000000000z090z00001111111000100000401112002111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE, RoomFlags.CoG],
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000000000000000000000000000000000008000000000000000000000000000000000000",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path",
      notes: "SIDE has a 25% chance to use this pool of rooms instead of Side.",
      rooms: [
        {
          name: "Room 1 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "1000000001200r00000210000000011000000001110000001100000000000000Y00000qqqqqqqqqq",
          type: RoomType.PATH,
        },
        {
          name: "Room 1 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "1000000001200r000002100000000110000000011100000011000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 2 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "1000000000100r00000010000000001000000000110000000000000000000000Y00000qqqqqqqqqq",
          type: RoomType.PATH,
        },
        {
          name: "Room 2 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "1000000000100r000000100000000010000000001100000000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 3 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "0000000001000r00000100000000010000000001000000001100000000000000Y00000qqqqqqqqqq",
          type: RoomType.PATH,
        },
        {
          name: "Room 3 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "0000000001000r000001000000000100000000010000000011000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 4",
          notes: "Can be used for Temple or City of Gold",
          data: "0000000001000r000001000000000100000000010000000011000022000000011110001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 5 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "110000001100L0000L0011Pr000P1111L0000L1111L0000L1102L0000L200000Y00000qqqqqqqqqq",
          type: RoomType.PATH,
        },
        {
          name: "Room 5 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "110000001100L0000L0011Pr000P1111L0000L1111L0000L1102L0000L2000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 6 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "1111111111111111111111111111111111111111111111111100000000000000Y00000qqqqqqqqqq",
          type: RoomType.PATH,
        },
        {
          name: "Room 6 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "11111111111111111111111111111111111111111111111111000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 7 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "1000000001000r00000010000000011000000001111111111100000000000000Y00000qqqqqqqqqq",
          type: RoomType.PATH,
        },
        {
          name: "Room 7 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "1000000001000r000000100000000110000000011111111111000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 9 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "1111111111240000004211011110111200000021111111111100000000000000Y00000qqqqqqqqqq",
          type: RoomType.PATH,
        },
        {
          name: "Room 9 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "11111111112400000042110111101112000000211111111111000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 10 - A",
          notes: "Can be used for Temple or City of Gold",
          data: "000000000000000000000000&0000000000000000qqwwwwwq0013wwww31011133331111111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 10 - B",
          notes: "Can be used for Temple or City of Gold",
          data: "000000000000000000000000&0000000000000000qwwwwwqq0013wwww31011133331111111111111",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path - No Top",
      rooms: [
        {
          name: "Room 1",
          data: "1000000001100r000001100000000110000000011100000011000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 2",
          data: "1000000000100r000000100000000010000000001100000000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 3",
          data: "0000000001000r000001000000000100000000010000000011000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 4",
          data: "000000000000000000000000&0000000000000000q3wwww3q0013wwww31011133331111111111111",
          type: RoomType.PATH_NOTOP,
        },
      ],
    },
    {
      name: "Path - Drop",
      rooms: [
        {
          name: "Room 1 - No Top",
          data: "00000000006000060000000000000000000000006000060000000000000000000000000000000000",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 2 - No Top",
          data: "00000000006000060000000000000000000000000000000000000060000000000000001202000000",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 3 - No Top",
          data: "00000000006000060000000000000000000000000500000000000000000000000000001111112021",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 4 - No Top",
          data: "00000000006000060000000000000000000000000000000000000000000002200002201112002111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 5 - No Top",
          data: "00000000000000220000000000000000200002000112002110011100111011200002111111001111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 6 - No Top",
          data: "0000000000006000000000000000000000000000000000000000q1122200021000000011101qqqq1",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 7 - No Top",
          data: "000000000000600000000000000000000000000000000000000022211q0000000001201qqqq10111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 8 - No Top",
          data: "00000000000060000000000000000000000000000000000000002022020000100001001111001111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },

        {
          name: "Room 9",
          notes: "Only used when room above isn't PATH_DROP",
          data: "11111111112222222222000000000000000000000000000000000000000000000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 10",
          notes: "Only used when room above isn't PATH_DROP",
          data: "11111111112222111111000002211100000002110000000000200000000000000000211120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 11",
          notes: "Only used when room above isn't PATH_DROP",
          data: "11111111111111112222111220000011200000000000000000000000000012000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 12",
          notes: "Only used when room above isn't PATH_DROP",
          data: "11111111112111111112021111112000211112000002112000000022000002200002201111001111",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Side",
      notes:
        "There's a 25% chance SIDE rooms will use the Path pool of rooms instead.",
      rooms: [
        {
          name: "Room 1",
          notes: "Can be used for Temple or City of Gold",
          data: "11111000001111100000111110000011111000001111150000111110000011111000001111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 2",
          notes: "Can be used for Temple or City of Gold",
          data: "00000111110000011111000001111100000111115000011111000001111100000111111111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 3",
          notes: "Can be used for Temple or City of Gold",
          data: "11000000001110000000211100000011111000002211110000111111100022211111001111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 4",
          notes: "Can be used for Temple or City of Gold",
          data: "00000000110000000111000000111200000111110000111122000111111100111112221111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 5",
          notes: "Can be used for Temple or City of Gold",
          data: "11111111110000000000111111100011111100001111100000111100000011100000001100000011",
          type: RoomType.SIDE,
        },

        {
          name: "Room 6",
          notes: "Can be used for Temple or City of Gold",
          data: "11111111110000000000000111111100001111110000011111000000111100000001111100000011",
          type: RoomType.SIDE,
        },

        {
          name: "Room 7",
          notes: "Can be used for Temple or City of Gold",
          data: "11111111112000000002110122101111000000111101221011200000000220012210021100000011",
          type: RoomType.SIDE,
        },

        {
          name: "Room 8",
          notes: "Can be used for Temple or City of Gold",
          data: "11111111110002112000110011001111102201111100110011020111102000021120001111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 9",
          notes: "Can be used for Temple or City of Gold",
          data: "1111111111000000000011011110111101111011100111100111wwwwww1111wwwwww111111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 10",
          notes: "Can be used for Temple or City of Gold",
          data: "11ttttt0111111111011110ttttt11110111111111ttttt011111111101111Ettttt111111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 11",
          notes: "Can be used for Temple or City of Gold",
          data: "1111111111110ttttE11110111111111ttttt0111111111011110ttttt1111011111111100000011",
          type: RoomType.SIDE,
        },

        {
          name: "Room 12",
          notes: "Can be used for Temple or City of Gold",
          data: "111111111111111111111111EE1111110111101111E1111E111111EE111111111111111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 13",
          notes: "Temple Only. Not City of Gold.",
          data: "1000000001000000000010000000011000000001100000000100T0000T000dddddddd01111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 14",
          notes: "Temple Only. Not City of Gold.",
          data: "10000000010021111200100000000110000000011111001111111200211111120021111111001111",
          type: RoomType.SIDE,
        },
        {
          name: "Idol Room",
          notes: "1/15 Chance. Temple Only.",
          data: "11CCCCCC11110000001111000000111D000000D11D000000D100000000000000I00000qqqqA0qqqq",
          type: RoomType.SIDE,
        },
        {
          name: "Kali's Altar",
          notes: "1/14 Chance. Temple Only.",
          data: "220000002200000000000000000000000000000000000000000000x0000000111111001111111111",
          type: RoomType.SIDE,
        },
      ],
    },
    {
      name: "Kali's Pit",
      rooms: [
        {
          name: "Top",
          data: "0000000000000000000000000000000000000000000100100000110011000111;01110111BBBB111",
          type: RoomType.KALI_PIT_TOP,
        },
        {
          name: "Middle",
          data: "11200002111120000211112000021111200002111120000211112000021111200002111120000211",
          type: RoomType.KALI_PIT_MIDDLE,
        },
        {
          name: "Bottom",
          data: "112000021111200002111120000211113wwww311113wwww311113wwww31111yyyyyy111111111111",
          type: RoomType.KALI_PIT_BOTTOM,
        },
      ],
    },
    {
      name: "Book of the Dead",
      rooms: [
        {
          name: "Left",
          data: "00000111110000011000000001100000Y00110001111111000000001100#00Y001100A1111111111",
          type: RoomType.NECRONOMICON_LEFT,
          flags: [RoomFlags.CoG],
        },
        {
          name: "Right",
          data: "111110000000011000000001100Y000001111111000110000000011000000001100Y001111111111",
          type: RoomType.NECRONOMICON_RIGHT,
          flags: [RoomFlags.CoG],
        },
      ],
    },
    {
      name: "Coffins",
      rooms: [
        {
          name: "Coffin",
          data: "000000000000000000000000g000000000110000013wwww310013wwww31011133331111111111111",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - Exit Right",
          data: "111111111110001101004g00110400111000011010000000101wwwwwww111wwwwwww111111111111",
          type: RoomType.COFFIN_EXIT_RIGHT,
        },
        {
          name: "Coffin - Exit Left",
          data: "111111111100101100010040110g040110000111010000000111wwwwwww111wwwwwww11111111111",
          type: RoomType.COFFIN_EXIT_LEFT,
        },
        {
          name: "Coffin - No Top",
          data: "000000000000000000000000g000000000110000013wwww310013wwww31011133331111111111111",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin",
          data: "100000000100000000001000g000011L011110L11P110011P10L000000L00L000000L01111001111",
          type: RoomType.COFFIN_DROP,
        },
        {
          name: "Coffin - Golden Monk",
          data: "000111100000110011000011g0110000011110000011111100000011000002201102201110000111",
          type: RoomType.COFFIN_DROP,
          flags: [RoomFlags.CoG],
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
          notes: "1/20",
          data: "11111111111111..111111..22...111.l0002.....000W0.0...00000k0..K0S0S000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Triple Hired Hand",
          notes: "1/100",
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
          notes: "1/20",
          data: "11111111111111..11111...22..11..2000l.110.W0000...0k00000...000S0S0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Triple Hired Hand",
          notes: "1/100",
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
    door: [{ data: "00900q111q21112" }],
    ground: [
      { data: "000000222021112" },
      { data: "000000202021212" },
      { data: "111001111011111" },
      { data: "001110111111111" },
      { data: "211122222200000" },
      { data: "000220001100011" },
      { data: "220001100011000" },
      { data: "000000000000000" },
    ],
    air: [
      { data: "022220000022220" },
      { data: "222200000002222" },
      { data: "222002220000000" },
      { data: "022200222000000" },
      { data: "002220022200000" },
      { data: "000000111000000" },
      { data: "000000111002220" },
      { data: "000000222001110" },
      { data: "000002010000111" },
      { data: "000000010211100" },
    ],
    temple: [
      { data: "111100000000" },
      { data: "222200000000" },
      { data: "222022200000" },
      { data: "022202220000" },
      { data: "222200002222" },
      { data: "000011110000" },
      { data: "000011112222" },
      { data: "000022221111" },
      { data: "000002202112" },
      { data: "000020021221" },
    ],
  },
};

export default config;
