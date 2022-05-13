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
          data: "01111111100222222220000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 3 - Drop",
          data: "60000600000000000000000000000000080000000000000000000000000000000000001110000111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.ENTRANCE],
        },
        {
          name: "Room 4 - Drop",
          data: "60000600000000000000000000000000800000000000000000000000000000000000001110000111",
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
          data: "20000000020000000000000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
        {
          name: "Room 2",
          data: "00000000000011111100000000000000000000000008000000000000000000000000001111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT, RoomFlags.NO_TOP],
        },
        {
          name: "Room 3",
          data: "60000600000000000000000000000000000000000008000000000000000000000000001111111111",
          notes: "Same as Entrance - Room 1",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 4",
          data: "11111111112222222222000000000000000000000008000000000000000000000000001111111111",
          notes: "",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 5 - A",
          data: "1111111111L000011112L009000000L011000020L012000000021100000000220T00T01111111111",
          notes: "50% chance of this variant.",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Room 5 - A",
          data: "1111111111211110000L000000900L020000110L000000210L00000011200T00T022001111111111",
          notes: "50% chance of this variant.",
          type: RoomType.PATH,
          flags: [RoomFlags.EXIT],
        },
        {
          name: "Rushing Water",
          data: "000000000000000900000221111220wwvvvvvvwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          notes: "",
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
          data: "111111111111V0000211120000021100000002110000000211112000021111120021111111001111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 3",
          data: "1111111111112V000011112000002111200000001120000000112000021111120021111111001111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 4",
          data: "11120021111100000222120000021100000002220000000211112000022211177T71111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 5",
          notes: "Twice as likely",
          data: "1112002111222000001111200000212220000000112000000022200002111117T771111111111111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 6 - A",
          notes: "50% chance of this variant",
          data: "111111111112000Q0211120000021112000002111200000211112000021111120021111112002111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 6 - B",
          notes: "50% chance of this variant",
          data: "11111111111200Q00211120000021112000002111200000211112000021111120021111112002111",
          type: RoomType.SIDE,
        },

        {
          name: "Room 7",
          data: "000000000001wwwwww1011wwwwww11113wwww311113wwww311113wwww31111133331111111111111",
          type: RoomType.SIDE,
        },
        {
          name: "Room 8",
          data: "00000000000000rr0000000rttr00000rrrrrr0000V0000000000000000000000000002000000002",
          type: RoomType.SIDE,
        },
        {
          name: "Idol Room",
          notes: "1/10 chance. Can't spawn on DaR or Rushing Water.",
          data: "01000000100000I0000001BBBBBB10010000001011wwwwww1111wwwwww11113wwww3111111111111",
          type: RoomType.SIDE,
          flags: [RoomFlags.IDOL_ROOM],
        },
        {
          name: "Idol Room - Dead are Restless",
          notes: "Unused Room.",
          data: "ttttttttttttttttttttttp0c00ptt0tt0000tt00400000040ttt0tt0tttttp0000ptt1111111111",
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
  ],
  chunks: {
    door: [
      { data: "009000q1q0q111q" },
      { data: "00900q111q11111" },
      { data: "0090000100q212q" },
    ],
    ground: [
      { data: "000000000022222", notes: "2-3, 2-4 Only. Common." },
      { data: "0000022222q111q", notes: "2-3, 2-4 Only. Common." },
      { data: "0q000q100011122", notes: "2-3, 2-4 Only. Common." },
      { data: "000q00001q22111", notes: "2-3, 2-4 Only. Common." },
      { data: "00020q00201001q", notes: "2-3, 2-4 Only. Common." },
      { data: "000000200102001", notes: "2-3, 2-4 Only. Common." },
      { data: "02000q10q010710", notes: "2-3, 2-4 Only. Common." },
      { data: "000200q01q01701", notes: "2-3, 2-4 Only. Common." },
      { data: "000000000077777", notes: "2-1, 202 Only. Common." },
      { data: "000007777711111", notes: "2-1, 202 Only. Common." },
      { data: "0q000q100011177", notes: "2-1, 202 Only. Common." },
      { data: "000q00001q77111", notes: "2-1, 202 Only. Common." },
      { data: "00020q00201771q", notes: "2-1, 202 Only. Common." },
      { data: "000000200102771", notes: "2-1, 202 Only. Common." },
      { data: "02000q10q010717", notes: "2-1, 202 Only. Common." },
      { data: "000200q01q71701", notes: "2-1, 202 Only. Common." },
      { data: "00000000000T022", notes: "2-3, 2-4 Only. Rare (1/6)." },
      { data: "000000000020T02", notes: "2-3, 2-4 Only. Rare (1/6)." },
      { data: "0000000000220T0", notes: "2-3, 2-4 Only. Rare (1/6)." },
      { data: "00000000000T077", notes: "2-1, 2-2 Only. Rare (1/6)." },
      { data: "000000000070T07", notes: "2-1, 2-2 Only. Rare (1/6)." },
      { data: "0000000000770T0", notes: "2-1, 2-2 Only. Rare (1/6)." },
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
