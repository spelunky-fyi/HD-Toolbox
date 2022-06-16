import { RoomType } from "../enums";
import type { Level } from "../types";

const config: Level = {
  rooms: [
    {
      name: "Entrance",
      rooms: [
        {
          name: "Room 1",
          notes: "Only room when room above isn't PATH_DROP.",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 1 - No Top",
          notes: "Used when room above is PATH_DROP",
          data: "000000000000000000000000000000000000000000000000000001mm100000219012001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 1 - No Top",
          notes: "Used when room above is PATH_DROP",
          data: "000000000000000000000000000000000000000000000000000001mm100000210912001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 1 - No Top",
          notes: "Used when room above is PATH_DROP",
          data: "0000000000000000000000000000000000~000000011111000011000110000009000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 1 - No Top",
          notes: "Used when room above is PATH_DROP",
          data: "00000000000000000000000000000000000~00000001111100001100011000000900001111111111",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Room 1",
          data: "01000001000z00000z00000000000000000000000011011000011090110001111111001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 2",
          data: "001000001000z00000z0000000000000000000000001101100001109011000111111101111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 3 - Drop",
          data: "000000000000110011000010009100001111110000z0000z000000000000mm000000mm1111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 4 - Drop",
          data: "000000000000110011000019000100001111110000z0000z000000000000mm000000mm1111001111",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Path",
      rooms: [
        {
          name: "Room 1",
          data: "50000500000000000000000000000011111111115000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 2 - No Top",
          data: "000000000000000000000000000000000000000000000000000000mm000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 3 - No Top",
          data: "0000000000000000000000000000000000~~0000000011000000001100000~001100~01111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 4 - Drop, No Top",
          data: "0000000000000000000000000000000000~~00000000110000000000000000~0000~001112002111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 5 - Drop, No Top",
          data: "000000000000000000000000000000000000000000000000000000mm000000000000001112002111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 6 - Drop",
          notes: "Used when room above is not PATH_DROP",
          data: "00000000000000000000000000000000002200000000000000000022000000000000001111001111",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Alien Queen",
      rooms: [
        {
          name: "Room 1",
          data: "110000011010000000100000Q000000L00000L000100000100L110*011L011110111101111111111",
          type: RoomType.ALIEN_QUEEN,
        },
        {
          name: "Room 2",
          data: "0110000011010000000100000Q000000L00000L000100000100L110*011L01111011111111111111",
          type: RoomType.ALIEN_QUEEN,
        },
        {
          name: "Room 3",
          data: "1100000011100000001100000Q00110LL000001101111100010000010*0111000110111111001111",
          type: RoomType.ALIEN_QUEEN,
        },
        {
          name: "Room 4",
          data: "110000001111000000011100Q000001100000LL0100011111010*010000011011000111111001111",
          type: RoomType.ALIEN_QUEEN,
        },
      ],
    },
    {
      name: "Side",
      rooms: [
        {
          name: "Room 1",
          notes:
            "After the first 2 SIDE rooms are generated this room can be selected.",
          data: "50000500000000000000000000000011111111115000050000000000000000000000001111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 2",
          notes:
            "After the first 2 SIDE rooms are generated this room can be selected.",
          data: "00000000000000110000000022000010001100011000110001100000000120~0000~021111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 3 - A",
          notes: "Can only be selected as on of the first 2 side rooms.",
          data: "0000000000000000000000111111000011X000000011000L0000111111000~111111~01111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 3 - B",
          notes: "Can only be selected as on of the first 2 side rooms.",
          data: "0000000000000000000000111111000000X0110000L000110000111111000~111111~01111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 4",
          notes: "10% chance this room is chosen.",
          data: "11110011110000000000010:00:01001111111100000000000m10:00:01m01111111101111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling - 1",
          notes: "Only used past row 4.",
          data: "22222222220000000000000000000000000000000000000000000000000000000000000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling - 2",
          notes: "Only used past row 4.",
          data: "11111111112222222222000000000000000000000000000000000000000000000000000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling - 3",
          notes: "Only used past row 4.",
          data: "22211112220001111000000211200000011110000002112000000022000000000000000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Pit Ceiling - 4",
          notes: "Only used past row 4.",
          data: "11112211112112002112022000022000000000000000000000000000000000000000000000000000",
          type: RoomType.SIDE,
        },
      ],
    },
    {
      name: "Shopkeepers",
      rooms: [
        {
          name: "Shop - Facing Right",
          notes: "Unused. No shops in Mothership",
          data: "111111111111111111111111221111111l000211...000W010...00000k0..KS000000bbbbbbbbbb",
          type: RoomType.SHOP_RIGHT_FACING,
        },
        {
          name: "Shop - Facing Left",
          notes: "Unused. No shops in Mothership",
          data: "111111111111111111111111221111112000l11101W0000...0k00000...000S000K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
      ],
    },
    {
      name: "Coffins",
      rooms: [
        {
          name: "Coffin",
          data: "5000050000000000000000000000001111111111010z00z0100100g0001000001100001111111111",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - Exit Right",
          data: "11000000001111111110110010001011g00000001111100000000010000011000LLL~01111111111",
          type: RoomType.COFFIN_EXIT_RIGHT,
        },
        {
          name: "Coffin - Exit Left",
          data: "000000001101111111110100010011000000g011000001111100000100000~LLL000111111111111",
          type: RoomType.COFFIN_EXIT_LEFT,
        },
        {
          name: "Coffin - No Top",
          data: "500005000000000000000000000000101111110100000000000000g000000~001100~01111111111",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin - Drop",
          data: "0000000000000011000000000000001000g000010000110000000000000000~0000~001112002111",
          type: RoomType.COFFIN_DROP,
        },
      ],
    },
  ],
  chunks: {
    door: [
      { data: "009000111011111" },
      { data: "009000212002120" },
      { data: "000000000092222" },
      { data: "000000000022229" },
      { data: "000001100119001" },
      { data: "000001001110091" },
    ],
    ground: [
      { data: "000001000010000" },
      { data: "000000000100001" },
      { data: "000000010000100" },
      { data: "000000000000000" },
    ],
    air: [
      { data: "000000000011111", notes: "Unused. Exact copy of Ice Caves." },
      { data: "000001111122222", notes: "Unused. Exact copy of Ice Caves." },
      { data: "111112222200000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0jij00jij00jij0", notes: "Unused. Exact copy of Ice Caves." },
    ],
    ice: [
      { data: "0ff000000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000ff000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000000ff", notes: "Unused. Exact copy of Ice Caves." },
      { data: "00f000000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000f0000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000000f0", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0ji000000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000ji000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000000ji", notes: "Unused. Exact copy of Ice Caves." },
      { data: "00i000000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000i0000", notes: "Unused. Exact copy of Ice Caves." },
      { data: "0000000i0", notes: "Unused. Exact copy of Ice Caves." },
    ],
  },
};

export default config;
