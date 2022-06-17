import { RoomFlags, RoomType } from "../enums";
import type { Level } from "../types";

const config: Level = {
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
          name: "Room 3 - Drop",
          data: "60000600000000000000000000000000000000000008000000000000000000000000000000111000",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 4 - Drop",
          data: "11111111112222222222000000000000000000000008000000000000000000000000000000111000",
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
          notes: "Due to off-by-1 this room is never used.",
          data: "00000000006000060000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 2",
          notes: "Used only if room above is Drop",
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
          notes: "Used only if room above is not Drop",
          data: "60000600000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 6",
          notes: "Used only if room above is not Drop",
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
          data: "11111111112111111112211111111221111111120111111110022222222000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 8",
          data: "6000060000000000000000000000000000000000000000000000000000000000000000----------",
          type: RoomType.PATH,
        },
        {
          name: "Room 9",
          data: "6000060000000000000000000000000000000000000000000001------1021ssssss121111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 10 - Unused",
          notes:
            "This room is unused due to off-by-1. It's also one character too short...",
          data: "iiiiiiiiiijiiiiiiiij0jjjjjjjj0000000000000000000000000Y0000000::00::00qqqqqqqqq",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path - Drop",
      rooms: [
        {
          name: "Room 1",
          data: "00000000006000060000000000000000000000006000060000000000000000000000000000000000",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          data: "00000000006000060000000000000000000000000000050000000000000000000000001202111111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          data: "00000000006000060000000000000000000000050000000000000000000000000000001111112021",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          data: "00000000006000060000000000000000000000000000000000000000000002200002201112002111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          data: "00000000000000220000000000000000200002000112002110011100111012000000211111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          data: "00000000000060000000000000000000000000000000000000001112220002100000001110111111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          data: "00000000000060000000000000000000000000000000000000002221110000000001201111110111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          data: "00000000000060000000000000000000000000000000000000002022020000100001001111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          notes:
            "Only used if room above is not PATH_DROP, COFFIN_DROP, or WET_FUR_2",
          data: "11111111112222222222000000000000000000000000000000000000000000000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          notes:
            "Only used if room above is not PATH_DROP, COFFIN_DROP, or WET_FUR_2",
          data: "11111111112222111111000002211100000002110000000000200000000000000000211120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          notes:
            "Only used if room above is not PATH_DROP, COFFIN_DROP, or WET_FUR_2",
          data: "11111111111111112222111220000011200000000000000000000000000012000000001120000211",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 1",
          notes:
            "Only used if room above is not PATH_DROP, COFFIN_DROP, or WET_FUR_2",
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
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 3",
          data: "00000000000000000000000000000050000500000000000000000000000011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 4",
          data: "00000000000000000000000600000000000000000000000000000111110000111111001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 5",
          data: "00000000000111111110001111110000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 6",
          data: "00000000000000000000000000000000000000000021111200021111112021111111121111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 7",
          data: "10000000011112002111111200211100000000000022222000111111111111111111111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 8",
          data: "0000000000600006000000000000000000000000000000000000000000000000000000----------",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 9",
          data: "0000000000600006000000000000000000000000000000000001------1021ssssss121111111111",
          type: RoomType.PATH_NOTOP,
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
          data: "000000000011------11120000002112002200211200000021120022002111ssssss111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Kali's Altar",
          notes: "1/14 Chance",
          data: "220000002200000000000000000000000000000000000000000000x00000022qqqq2201111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling 1",
          notes: "Only used past row 4.",
          data: "22222222220000000000000000000000000000000000000000000000000000000000000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling 2",
          notes: "Only used past row 4.",
          data: "11111111112222222222000000000000000000000000000000000000000000000000000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling 3",
          notes: "Only used past row 4.",
          data: "22211112220001111000000211200000011110000002112000000022000000000000000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling 4",
          notes: "Only used past row 4.",
          data: "11112211112112002112022000022000000000000000000000000000000000000000000000000000",
          type: RoomType.SIDE,
        },
      ],
    },
    {
      name: "Wet Fur",
      rooms: [
        {
          name: "Wet Fur 1 - No Top",
          notes: "Exact same room used for WET_FUR_2 and WET_FUR_3",
          data: "ii000000iijiii00iiij0jj0000jj0000000000000000000000000Y0000000::00::00iiiiiiiiii",
          type: RoomType.WET_FUR_1,
        },
        {
          name: "Wet Fur 1",
          notes: "Exact same room used for WET_FUR_2 and WET_FUR_3",
          data: "iiiiiiiiiijiiiiiiiij0jjjjjjjj0000000000000000000000000Y0000000::00::00iiiiiiiiii",
          type: RoomType.WET_FUR_1,
        },
        {
          name: "Wet Fur 2 - No Top",
          notes: "Exact same room used for WET_FUR_1 and WET_FUR_3",
          data: "ii000000iijiii00iiij0jj0000jj0000000000000000000000000Y0000000::00::00iiiiiiiiii",
          type: RoomType.WET_FUR_1,
        },
        {
          name: "Wet Fur 2",
          notes: "Exact same room used for WET_FUR_1 and WET_FUR_3",
          data: "iiiiiiiiiijiiiiiiiij0jjjjjjjj0000000000000000000000000Y0000000::00::00iiiiiiiiii",
          type: RoomType.WET_FUR_1,
        },
        {
          name: "Wet Fur 3 - No Top",
          notes: "Exact same room used for WET_FUR_1 and WET_FUR_2",
          data: "ii000000iijiii00iiij0jj0000jj0000000000000000000000000Y0000000::00::00iiiiiiiiii",
          type: RoomType.WET_FUR_1,
        },
        {
          name: "Wet Fur 3",
          notes: "Exact same room used for WET_FUR_1 and WET_FUR_2",
          data: "iiiiiiiiiijiiiiiiiij0jjjjjjjj0000000000000000000000000Y0000000::00::00iiiiiiiiii",
          type: RoomType.WET_FUR_1,
        },
      ],
    },
    {
      name: "Shopkeepers",
      rooms: [
        {
          name: "Right Facing - Prize Wheel",
          data: "11111111111111..1111....22...1.Kl00002.....000W0...0%00000k0.$%00S0000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Single NPC",
          notes: "Used for Single HH or Damsel.",
          data: "11111111111111..111111..22...111.l0002.....000W0.....00000k0..K00S0000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Double Hired Hand",
          notes: "1/20",
          data: "11111111111111..111111..22...111.l0002.....000W0.....00000k0..K0S0S000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Triple Hired Hand",
          notes: "1/100",
          data: "11111111111111..111111..22...111.l0002.....000W0.....00000k0..K0SSS000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Right Facing - Shop",
          data: "11111111111111..111111..22...111.l0002.....000W0.....00000k0..KS000000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Left Facing - Prize Wheel",
          data: "11111111111111..11111...22......20000lK...W0000...0k00000%0.0000S00%$.bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Single NPC",
          notes: "Used for Single HH or Damsel.",
          data: "11111111111111..11111...22..11..2000l.11..W0000...0k00000...0000S00K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Double Hired Hand",
          notes: "1/20",
          data: "11111111111111..11111...22..11..2000l.11..W0000...0k00000...000S0S0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Triple Hired Hand",
          notes: "1/100",
          data: "11111111111111..11111...22..11..2000l.11..W0000...0k00000...000SSS0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Shop",
          data: "11111111111111..11111...22..11..2000l.11..W0000...0k00000...000S000K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
      ],
    },
    {
      name: "Coffins",
      rooms: [
        {
          name: "Coffin",
          data: "0000000000000000000000000000000000g0000001--11--10010000001011ssssss111111111111",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - Exit Right",
          data: "0:::000000i-----i000i00000i000ig0000ii00i--0001i00i0000011i01sssss11101111111111",
          type: RoomType.COFFIN_EXIT_RIGHT,
        },
        {
          name: "Coffin - Exit Left",
          data: "000000:::0000i-----i000i00000i00ii000g0i00i1000--i0i1100000i0111sssss11111111111",
          type: RoomType.COFFIN_EXIT_LEFT,
        },
        {
          name: "Coffin - No Top",
          data: "0000000000000000000000000000000000g0000001--11--10010000001011ssssss111111111111",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin - Drop, No Top",
          notes: "Used when room above is PATH_DROP or WET_FUR_2",
          data: "0000000000000000000022000000220000g000000000110000000000000002100001201111001111",
          type: RoomType.COFFIN_DROP,
        },
        {
          name: "Coffin - Drop",
          data: "11111111112111111112022222222000000000000000g00000000011000002200002201111001111",
          type: RoomType.COFFIN_DROP,
        },
      ],
    },
  ],
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
