import { RoomType } from "../enums";
import type { Level } from "../types";

const config: Level = {
  rooms: [
    {
      name: "Entrance",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 2",
          data: "00000000000000000000000000000000000000000080000000000000000000000000001111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 3 - Drop",
          data: "00000000000000000000000000000000000000000008000000000000000000000000000011111110",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 4 - Drop",
          data: "00000000000000000000000000000000000000000080000000000000000000000000000011111110",
          type: RoomType.PATH_DROP,
        },
      ],
    },
    {
      name: "Exit",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000000000000000000000000000000000008000000000000000000000000001111qqq111",
          type: RoomType.PATH,
        },

        {
          name: "Room 2",
          data: "0000000000000000000000000000000000000000008000000000000000000000000000111qqq1111",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Path / Drop / Side",
      notes:
        "PATH and PATH_DROP share these rooms with the exception of room 9 which can't be used for PATH_DROP. SIDE have a 50% chance to use this pool of rooms instead of the Side rooms.",
      rooms: [
        {
          name: "Room 1 - A",
          data: "0111100000110010000000011000i1000000000011200ii0001120000000000000000011iiii0000",
          type: RoomType.PATH,
        },
        {
          name: "Room 1 - B",
          data: "000001111000000100111i000110000000000000000ii00211000000021100000000000000iiii11",
          type: RoomType.PATH,
        },

        {
          name: "Room 2 - A",
          data: "00000000000000000000000000000000000000001100000001200000000200000000000000000000",
          type: RoomType.PATH,
        },
        {
          name: "Room 2 - B",
          data: "00000000000000000000000000000000000000001000000011200000000200000000000000000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 3",
          data: "01111200001111112000111111200000002120001120000000112021200000001120001111120000",
          type: RoomType.PATH,
        },

        {
          name: "Room 4",
          data: "00002111100002111111000211111100021200000000000211000212021100021100000000211111",
          type: RoomType.PATH,
        },

        {
          name: "Room 5 - A",
          data: "000000000000000000jj00f2100iii000210000000021110ii000021100100000211000000002111",
          type: RoomType.PATH,
        },
        {
          name: "Room 5 - B",
          data: "0000000000jj00000000iii0012f000000012000ii01112000100112000000112000001112000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 6",
          data: "000000000000000000000000000000F00F00F0000000000000000000000000000000000000000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 7",
          data: "00000000000000000000000000000000000000000iiiiiiii00021ii120000022220000000000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 8",
          data: "000000000000000000000iiiiiiii00021ii12000002222000000000000000000000000000000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 9",
          notes: "Not used for when room is PATH_DROP",
          data: "0011111100000222200000000000000000000000jjjjjjjjjjiiiiiiiiii00000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 10 - A",
          notes: "Only used on levels 1 and 2.",
          data: "000000000000000000000000000000000000010000100001f00f1000000000000000000000000000",
          type: RoomType.PATH,
        },
        {
          name: "Room 10 - B",
          notes: "Only used on levels 1 and 2.",
          data: "00000000000000000000000000000000100000000f1000010000000001f000000000000000000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 11 - A",
          notes: "Only used on levels 1 and 2.",
          data: "000000000000000000000000i000f000000000000f0000000000000i000000000000000000000000",
          type: RoomType.PATH,
        },
        {
          name: "Room 11 - B",
          notes: "Only used on levels 1 and 2.",
          data: "000000000000000000000f000i0000000000000000000000f00000i0000000000000000000000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 12",
          notes: "Only used on levels 1 and 2.",
          data: "00000000000000000000000000000000000000001100000011000ssss00000011110000000000000",
          type: RoomType.PATH,
        },

        {
          name: "Room 13 - A - Rare",
          notes: "5% chance this room is chosen",
          data: "00000000000000000000000000000000005000000000000000000000000000021111100000222211",
          type: RoomType.PATH,
        },
        {
          name: "Room 13 - B - Rare",
          notes: "5% chance this room is chosen.",
          data: "00000000000000000000000000000005000000000000000000000000000001111120001122220000",
          type: RoomType.PATH,
        },
      ],
    },
    {
      name: "Side",
      rooms: [
        {
          name: "Room 1",
          data: "20000000020000000000000000000000000000000000000000000000000000000000002000000002",
          type: RoomType.SIDE,
        },
        {
          name: "Room 2",
          data: "10000000001000000000111000000022201100000000220100000000010000000001110000000222",
          type: RoomType.SIDE,
        },
        {
          name: "Room 3",
          data: "00000000010000000001000000011100001102220010220000001000000011100000002220000000",
          type: RoomType.SIDE,
        },
        {
          name: "Room 4",
          data: "00000000000002112000000111100000f1111f000001111000f00211200f00021120000000000000",
          type: RoomType.SIDE,
        },
        {
          name: "Room 5",
          data: "0000000000000000000000220022000011ff11000011001200202100120220210012020002002000",
          type: RoomType.SIDE,
        },
        {
          name: "Room 6",
          data: "0jiiiiiij00jij00jij0jjii0jiij0000000jij0jjiij0iij00jiij0jijj0jiij000000jjiiiiijj",
          type: RoomType.SIDE,
        },
        {
          name: "Room 7",
          data: "0jiiiiiij00jij00jij00jii0jiijj0jij0000000jij0jiijj0jij0jiij000000jiij00jjiiiiijj",
          type: RoomType.SIDE,
        },
        {
          name: "Room 8",
          data: "011iiii110000jjjj0000000ii00000000jj00000000ii00000000jj00000000ii00000002222000",
          type: RoomType.SIDE,
        },
        {
          name: "Idol Room",
          notes:
            "Normally 1/9 chance but due to 50% chance of SIDE room's being used actually closer to 1/18.",
          data: "00000000000000I000000000--00000000000000000000000000000000000000ss00000000110000",
          type: RoomType.SIDE,
        },
        {
          name: "Kali's Altar",
          notes:
            "Normally 1/14 chance but due to 50% chance of SIDE room's being used actually 1/28.",
          data: "000000000000000000000000000000000000000000000000000000x0000002211112201111111111",
          type: RoomType.SIDE,
        },
      ],
    },
    {
      name: "Ice Caves",
      rooms: [
        {
          name: "Moai - A",
          data: "000000000000000O000000000000000000000000021110002002111mmm2000111111000000000000",
          type: RoomType.MOAI,
        },
        {
          name: "Moai - B",
          data: "000000000000O000000000000000000000000000020001112002mmm1112000111111000000000000",
          type: RoomType.MOAI,
        },

        {
          name: "Psychic Presence - Left",
          data: "0000000000000+++++++0+++0000000+000000000+000000000++000000000========0000000000",
          type: RoomType.PSYCHIC_PRESENCE_LEFT,
        },
        {
          name: "Psychic Presence - Center",
          data: "0000000000++++++++++0000000000000000000000000000000000000000==========0000000000",
          type: RoomType.PSYCHIC_PRESENCE_CENTER,
        },
        {
          name: "Psychic Presence - Right",
          data: "0022122111++++++11110+00002211000000X01100000000M10+;0021111=====1=1110000222221",
          type: RoomType.PSYCHIC_PRESENCE_RIGHT,
        },

        {
          name: "Mothership Entrance - Top - A",
          data: "++++++++++++000000++++0T0000+++++000++++++++00++++++++00++++++++00++++++++00++++",
          type: RoomType.MOTHERSHIP_ENTRANCE_TOP,
        },
        {
          name: "Mothership Entrance - Top - B",
          data: "++++++++++++000000++++0000T0++++++000+++++++00++++++++00++++++++00++++++++00++++",
          type: RoomType.MOTHERSHIP_ENTRANCE_TOP,
        },
        {
          name: "Mothership Entrance - Bottom",
          data: "++++00++++++++00++++++++00++++++++00++++++000000++0+++00+++000++00++000000000000",
          type: RoomType.MOTHERSHIP_ENTRANCE_BOTTOM,
        },
        {
          name: "Pool - Single",
          data: "000000000021------1221wwwwww1221vwwwwv1201vwwwwv10011vvvv11002111111200022222200",
          type: RoomType.ICE_CAVES_POOL_SINGLE_ROOM,
        },
        {
          name: "Pool - Top",
          data: "000000000021------1221wwwwww1221vwwwwv1221vwwwwv1221vwwwwv1221vwwwwv1221vwwwwv12",
          type: RoomType.ICE_CAVES_POOL_TOP,
        },
        {
          name: "Pool - Bottom",
          data: "21vwwwwv1221vwwwwv1221vwwwwv1221vwwwwv1201vwwwwv10011vvvv11002111111200022222200",
          type: RoomType.ICE_CAVES_POOL_BOTTOM,
        },
      ],
    },
    {
      name: "Coffins",
      rooms: [
        {
          name: "Coffin",
          data: "0021111200021iiii12002i0000i20000000000000i0g00i0002iiiiii2000211112000002222000",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - Exit Right",
          data: "00:0000000iiii00f000i00:00000fig0i000000iiiiff0000iiii000ff00ii00000000000000000",
          type: RoomType.COFFIN_EXIT_RIGHT,
        },
        {
          name: "Coffin - Exit Left",
          data: "0000000:00000f00iiiif00000:00i000000ig0i0000ffiiii0ff000iiii0000000ii00000000000",
          type: RoomType.COFFIN_EXIT_LEFT,
        },
        {
          name: "Coffin - No Top",
          data: "0000000000000000000000000000000000g000000fiiiiiif0000iiii00000000000000000000000",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin - Drop",
          data: "000000000000000000000000g00000002111120000000000002111ff111200210012000000000000",
          type: RoomType.COFFIN_DROP,
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
          data: "11111111111111..11111...22..11..2000l.11..W0000...0k00000...0000S00K..bbbbbbbbbb",
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
          data: "11111111111111..11111...22..11..2000l.11..W0000...0k00000...000SSS0K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Left Facing - Shop",
          data: "11111111111111..11111...22..11..2000l.11..W0000...0k00000...000S000K..bbbbbbbbbb",
          type: RoomType.SHOP_LEFT_FACING,
        },
        {
          name: "Vault",
          data: "02222222202111111112211|00011221100001122110EE0112211000011221111111120222222220",
          type: RoomType.VAULT,
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
      { data: "111110000000000" },
      { data: "000001111100000" },
      { data: "000000000011111" },
      { data: "000002020010100" },
      { data: "000000202001010" },
      { data: "000000020200101" },
      { data: "000002220011100" },
      { data: "000000222001110" },
      { data: "000000022200111" },
      { data: "111002220000000" },
      { data: "011100222000000" },
      { data: "001110022200000" },
      { data: "000000222021112" },
      { data: "000002010000110" },
      { data: "000000010201100" },
    ],
    air: [
      { data: "000000000011111" },
      { data: "000001111122222" },
      { data: "111112222200000" },
      { data: "0jij00jij00jij0" },
    ],
    ice: [
      { data: "0ff000000" },
      { data: "0000ff000" },
      { data: "0000000ff" },
      { data: "00f000000" },
      { data: "0000f0000" },
      { data: "0000000f0" },
      { data: "0ji000000" },
      { data: "0000ji000" },
      { data: "0000000ji" },
      { data: "00i000000" },
      { data: "0000i0000" },
      { data: "0000000i0" },
    ],
  },
};

export default config;
