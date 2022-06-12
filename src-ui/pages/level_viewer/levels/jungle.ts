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
          data: "60000600000000000000000000000050000500000000000000000000000011111111111111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 4",
          data: "60000600000000000000000000000000000000000000000000000111110000111111001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 5",
          data: "2222222222000000000000000000000000tt000000r0220r0000t0tt0t000rtrttrtr01111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 6 - A",
          data: "0L000000001L111111110L222222200L000000000002002000011122111011200002111111111111",
          type: RoomType.PATH,
        },
        {
          name: "Room 6 - B",
          data: "00000000L011111111L102222222L000000000L00002002000011122111011200002111111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 7",
          data: "1111111111V0000V000000000000000000000000000000000010000000011ssssssss11111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 8",
          notes: "Also used for PATH_NOTOP",
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 9",
          notes: "Also used for PATH_NOTOP",
          data: "00000000000000&0000000000000000q3wwww3q0013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH,
        },

        {
          name: "Room 10",
          data: "0060000000000000000000000000000000&000000q3wwww3q0113wwww31111133331111111111111",
          type: RoomType.PATH,
        },

        {
          name: "Tiki Village - Room 1 - A",
          notes:
            "Tiki Village Rooms are always used for PATH on the top 3 rows in Tiki Village level feeling.",
          data: "0000:0000000ddddd00000d000d0000G00:00Gd0dPd===dPd0dG00000Gd00G00:00G00d=======d1",
          type: RoomType.PATH,
          flags: [RoomFlags.TIKI_VILLAGE],
        },
        {
          name: "Tiki Village - Room 1 - B",
          notes:
            "Tiki Village Rooms are always used for PATH on the top 3 rows in Tiki Village level feeling.",
          data: "00000:0000000ddddd00000d000d000dG00:00G00dPd===dPd0dG00000Gd00G00:00G01d=======d",
          type: RoomType.PATH,
          flags: [RoomFlags.TIKI_VILLAGE],
        },

        {
          name: "Tiki Village - Room 2",
          notes:
            "Tiki Village Rooms are always used for PATH on the top 3 rows in Tiki Village level feeling.",
          data: "00000000000000:0000000dddd000000d+0d00000dd0dd0000000:0100001dd=d110T01111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.TIKI_VILLAGE],
        },

        {
          name: "Tiki Village - Room 3",
          notes:
            "Tiki Village Rooms are always used for PATH on the top 3 rows in Tiki Village level feeling.",
          data: "000000000000000:00000000dddd000000d0+d000000dd0dd0000010:0000T011d=dd11111111111",
          type: RoomType.PATH,
          flags: [RoomFlags.TIKI_VILLAGE],
        },
      ],
    },
    {
      name: "Path - Drop",
      rooms: [
        {
          name: "Room 1",
          data: "00000000000000000000000000000000000000000000000000000000002200000002111112002111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 2",
          data: "000000000000000000000000000000000000000000000000002200000000112T0000001111001111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 3",
          data: "00000000006000000000000000000000000000000000000000000000000000000000001000000001",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 4",
          data: "00000000000000000000000000000000000000000000000000000000000020000222221000011111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 5",
          data: "00000000000000000000000000000000000000000000000000000000000022222000021111100001",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 6",
          data: "11111111111111111111120000002100000000000000000000022000022021120021121111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 7",
          notes: "Tiki Village. 40% Chance non-tiki room will be chosen.",
          data: "12000000001d0dddd0001d00+0d0001dd:G000001d==P==0001112G000001120G010001111G01111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 8",
          notes: "Tiki Village. 40% Chance non-tiki room will be chosen.",
          data: "0000000021000dddddd1000d0+00d100000G:dd1000d=P===100000G211100010G021101110G1111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 9",
          notes: "Tiki Village. 40% Chance non-tiki room will be chosen.",
          data: "111111111111d1111d1112d0000d210000:0000000d====d0000000000002q120021121111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 10",
          notes: "Tiki Village. 40% Chance non-tiki room will be chosen.",
          data: "111111111111d1111d1112d0000d210000:0000000d====d00000000000021120021q21111001111",
          type: RoomType.PATH_DROP,
        },
        {
          name: "Room 11",
          notes: "Tiki Village. 40% Chance non-tiki room will be chosen.",
          data: "000000000000dddddd0000d0+00d000000G:000000d=P==d0000d0G00d002qd2G02d121111G01111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
        },
        {
          name: "Room 12",
          notes: "Tiki Village. 40% Chance non-tiki room will be chosen.",
          data: "000000000000dddddd0000d00+0d000000:G000000d==P=d0000d00G0d002qd20G2d1211110G1111",
          type: RoomType.PATH_DROP,
          flags: [RoomFlags.NO_TOP],
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
          notes: "Also used in PATH",
          data: "00000000000000000000000000000000000000005000050000000000000000000000001111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 3 - A",
          data: "0000000000000000000000000000000000500000000000000000T000000011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 3 - B",
          data: "000000000000000000000000000000050000000000000000000000000T0011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 4 - A",
          data: "00000000000000000000000000000000000000000002222220001111111011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 4 - B",
          data: "00000000000000000000000000000000000000000222222000011111110011111111111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 5 - A",
          data: "00000000000000000000000000000000000000000000000220000002211100002211111111111111",
          type: RoomType.PATH_NOTOP,
        },
        {
          name: "Room 5 - B",
          data: "00000000000000000000000000000000000000000220000000111220000011112200001111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 6",
          notes: "Also used in PATH",
          data: "00000000000000&0000000000000000q3wwww3q0013wwww310113wwww31111133331111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Room 7",
          data: "00000000000060000000000000000000000000000q3wwww3q0113wwww31111133331111111111111",
          type: RoomType.PATH_NOTOP,
        },

        {
          name: "Tiki Village - Left Wall",
          notes: "If Tiki Village and 80% chance and rows 2 or 3",
          data: "1200000000ddddd00000d000dd0000d0:00000001===ddd00011++00d00011110:00001111==d111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.TIKI_VILLAGE],
        },

        {
          name: "Tiki Village - Right Wall",
          notes: "If Tiki Village and 80% chance and rows 2 or 3",
          data: "000000002100000ddddd0000dd000d0000000:0d000dd====1000d00++110000:01111111d==1111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.TIKI_VILLAGE],
        },

        {
          name: "Tiki Village - Room 1",
          notes:
            "If Tiki Village and not left/right wall of rows 2 or 3. 80% chance to replace normal PATH_NOTOP",
          data: "00000000000000000000000000t0t00dddddt0t00d0000t0t000:00000t00d====tit01111111111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.TIKI_VILLAGE],
        },

        {
          name: "Tiki Village - Room 2",
          notes:
            "If Tiki Village and not left/right wall of rows 2 or 3. 80% chance to replace normal PATH_NOTOP",
          data: "000000000000000000000t0t0000000t0tddddd00t0t0000d00t00000:000tit====d01111111111",
          type: RoomType.PATH_NOTOP,
          flags: [RoomFlags.TIKI_VILLAGE],
        },
      ],
    },
    {
      name: "Coffin",
      rooms: [
        {
          name: "Coffin",
          notes: "Same as COFFIN_NOTOP",
          data: "0000000000000tttt00000tttttt0000t0000t0000t0000t000000g0000001trrrrt101111111111",
          type: RoomType.COFFIN,
        },
        {
          name: "Coffin - No Top",
          notes: "Same as COFFIN",
          data: "0000000000000tttt00000tttttt0000t0000t0000t0000t000000g0000001trrrrt101111111111",
          type: RoomType.COFFIN_NOTOP,
        },
        {
          name: "Coffin - Exit Right",
          data: "ttttt11111t000000000tg0t000000ttttI0000000ttttt000ttttttt000rrrrrrrr001111111111",
          type: RoomType.COFFIN_EXIT_RIGHT,
        },
        {
          name: "Coffin - Exit Left",
          data: "11111ttttt000000000t000000tg0t00000Itttt000ttttt00000ttttttt00rrrrrrrr1111111111",
          type: RoomType.COFFIN_EXIT_LEFT,
        },
        {
          name: "Coffin Drop - Round Boy - A",
          notes: "Not used on Daily Challenge",

          data: "11110011111111001111d00d00d00d0g00000::0d==d00d==d002100120000210012001111001111",
          type: RoomType.COFFIN_DROP,
        },
        {
          name: "Coffin Drop - Round Boy - B",
          notes: "Not used on Daily Challenge",

          data: "11110011111111001111d00d00d00d0::0000g00d==d00d==d002100120000210012001111001111",
          type: RoomType.COFFIN_DROP,
        },
        {
          name: "Coffin Drop",
          data: "000000000000000000000000g00000000tttt00000tt00tt00000000000001tt00tt1011rr00rr11",
          type: RoomType.COFFIN_DROP,
        },
      ],
    },
    {
      name: "Rushing Water Islands",
      rooms: [
        {
          name: "Room 1",
          notes: "Used when above is PATH_DROP",
          data: "000000000000000000000001111000w,,vvvv,,wwwww,,wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },
        {
          name: "Room 2",
          notes: "Used when above is PATH_DROP",
          data: "000000000000000000001200000000vvwwwwwwww,wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },
        {
          name: "Room 3",
          notes: "Used when above is PATH_DROP",
          data: "000000000000000000000000000021wwwwwwwwvvwwwwwwwww,wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },
        {
          name: "Room 4",
          notes: "Used when above is PATH_DROP",
          data: "000000000000000000000000000000wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },
        {
          name: "Room 5",
          notes: "Used when above is PATH_DROP",
          data: "000000000000000000000001111000w,,vvvv,,wwww,vv,wwwwwwwvvwwwwwwww,,wwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },
        {
          name: "Room 6",
          notes: "Not used when above is PATH_DROP.",
          data: "000022000000021120000001111000w,,vvvv,,wwww,vv,wwwwwwwvvwwwwwwww,,wwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },

        {
          name: "Room 7",
          notes: "Not used when above is PATH_DROP.",
          data: "600006000000000000000000000000wwwvvvvwwwwwww,,wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },

        {
          name: "Room 8",
          notes: "Not used when above is PATH_DROP.",
          data: "000022000000021120000221111220www,,,,wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_ISLANDS,
        },
      ],
    },
    {
      name: "Rushing Water Lakes",
      rooms: [
        {
          name: "Old Bitey",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwJwwwwwwwwwwwwwwwwwwwwwwwwww,,,,,,,,,,",
          type: RoomType.RUSHING_WATER_LAKE_BITEY,
        },
        {
          name: "Viking Coffin - Column 1",
          notes: "Not used on Daily Challenge",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwww,wwwwwwwwwww,,wwwwwwwww,,wwwwwwww,,,,,,,,,ww,,,,,,,",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Viking Coffin - Column 2",
          notes: "Not used on Daily Challenge",
          data: "wwwwwwwwww,wwwwwwwww,,wwwwwwww,wwwwwwwww,wwwwwww,w,gwEEEw,,w,,,,,,,,,w,,,,,,,,ww",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 1",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 2",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww,,EE,,EE,,",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 3",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww,,wwwwww,,wwwwwwwwwwwwwwwwwwww,,EE,,EE,,",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 4",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww,v,wwwwwwwww,,wwwwwwwE,,vvvvww,,,,,,,,vv",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 5",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww,v,wwwwww,vwwwwwwww,v,ww,,,,,,v,,",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 6",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwvvwwwwwwwv,,vwwwwww,,,,wwwwwwE,,Ewwwvwv,,,,vwv,E,,,,,,E,",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 7",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww,,,,wwwww,,v,,,www,,vwvv,,wwvwwwwE,,,,,vvvv,,,,",
          type: RoomType.RUSHING_WATER_LAKE,
        },
        {
          name: "Room 8",
          data: "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww,,,,wwwww,,,v,,www,,vvwv,,w,,,Ewwwwvw,,,,vvvv,,",
          type: RoomType.RUSHING_WATER_LAKE,
        },
      ],
    },
    {
      name: "Dead are Restless",
      rooms: [
        {
          name: "Castle Entrace - A",
          data: "000000000000000000000000h00000021t1t1200211t0t112011rtttr11011r101r11111rr0rr111",
          type: RoomType.DAR_CASTLE_ENTRANCE,
        },
        {
          name: "Castle Entrace - B",
          data: "0000000000000000000000000h00000021t1t1200211t0t112011rtttr11111r101r11111rr0rr11",
          type: RoomType.DAR_CASTLE_ENTRANCE,
        },
        {
          name: "Crystal Idol",
          data: "ttttttttttttttttttttttp0c00ptt0tt0tt0tt00400000040ttt0tt0tttttp0000ptt1111111111",
          type: RoomType.DAR_CRYSTAL_IDOL,
        },
      ],
    },
    {
      name: "Beehive - Left/Right Open",
      rooms: [
        {
          name: "Room 1",
          notes: "Left is Crystal Idol, SIDE, or PATH. Right is BEEHIVE.",
          data: "11eeeeeeeeeeezzzzzzzeez000000000000000000000000000eez0000000eeezzzzzzz11eeeeeeee",
          type: RoomType.BEEHIVE_LEFT_RIGHT_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 2",
          notes:
            "Left is Crystal Idol, SIDE, or PATH. Right is not BEEHIVE, Crystal Idol, SIDE, or PATH.",
          data: "11eeeeeee1eeezzzzzeeeez00000ze00000000ze00000000zeeez00000zeeeezzzzzee11eeeeeee1",
          type: RoomType.BEEHIVE_LEFT_RIGHT_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 3",
          notes:
            "Left is Crystal Idol, SIDE, or PATH. Right is Crystal Idol, SIDE, or PATH.",
          data: "11eeeeee11eeezzzzeeeeez0000zee00000000000000000000eez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_LEFT_RIGHT_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 4",
          notes: "Right is Crystal Idol, SIDE, or PATH. Left is BEEHIVE.",
          data: "eeeeeeee11zzzzzzzeee0000000zee000000000000000000000000000zeezzzzzzzeeeeeeeeeee11",
          type: RoomType.BEEHIVE_LEFT_RIGHT_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 5",
          notes:
            "Right is Crystal Idol, SIDE, or PATH. Left is not BEEHIVE, Crystal Idol, SIDE, or PATH.",
          data: "1eeeeeee11eezzzzzeeeez00000zeeez00000000ez00000000ez00000zeeeezzzzzeee1eeeeeee11",
          type: RoomType.BEEHIVE_LEFT_RIGHT_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 6",
          notes: "Left is BEEHIVE",
          data: "eeeeeeee11zzzzzzzeee0000000zee000000000000000000000000000zeezzzzzzzeeeeeeeeeee11",
          type: RoomType.BEEHIVE_LEFT_RIGHT_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 7",
          notes: "Right is BEEHIVE",
          data: "11eeeeeeeeeeezzzzzzzeez000000000000000000000000000eez0000000eeezzzzzzz11eeeeeeee",
          type: RoomType.BEEHIVE_LEFT_RIGHT_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
      ],
    },
    {
      name: "Beehive - Side / Up Open",
      rooms: [
        {
          name: "Room 1",
          notes:
            "Left is not Crystal Idol, SIDE, or PATH. Right is not Crystal Idol, SIDE, or PATH. No Top.",
          data: "11ee00ee11eeez00zeeeeez0000zeeez000000zeez000000zeeez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 2",
          notes:
            "Left is not Crystal Idol, SIDE, or PATH. Right is not Crystal Idol, SIDE, or PATH.",
          data: "ez000000zeez00zz00zeez00zz00zeez000000zeez000000zeeez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 3",
          notes: "Left BEEHIVE. No Top.",
          data: "eeee00ee11zzzz00zeee0000000zee000000000000000000000000000zeezzzzzzzeeeeeeeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 4",
          notes: "Left is not Crystal Idol, SIDE, or PATH. No Top.",
          data: "11ee00ee11eeez00zeeeeez0000zeeez00000000ez00000000eez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 5",
          notes: "Left is not Crystal Idol, SIDE, or PATH",
          data: "ez000000zeez00zz00zeez00zz00zeez00000000ez00000000eez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 6",
          notes:
            "Right is not Crystal Idol, SIDE, or PATH. Right is BEEHIVE. No Top.",
          data: "11ee00eeeeeeez00zzzzeez000000000000000000000000000eez0000000eeezzzzzzz11eeeeeeee",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 7",
          notes: "Right is not Crystal Idol, SIDE, or PATH. No Top.",
          data: "11ee00ee11eeez00zeeeeez0000zee00000000ze00000000zeeez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 8",
          notes: "Right is not Crystal Idol, SIDE, or PATH.",
          data: "ez000000zeez00zz00zeez00zz00ze00000000ze00000000zeeez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 9",
          notes: "Right is not Crystal Idol, SIDE, or PATH. No Top.",
          data: "11ee00ee11eeez00zeeeeez0000zee00000000000000000000eez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 10",
          data: "ez000000zeez00zz00zeez00zz00ze00000000000000000000eez0000zeeeeezzzzeee11eeeeee11",
          type: RoomType.BEEHIVE_SIDE_UP_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
      ],
    },
    {
      name: "Beehive - Side / Down Open - Path No Top",
      rooms: [
        {
          name: "Room 1",
          notes: "Below not BEEHIVE. Left is BEEHIVE.",
          data: "11ee00ee11eeez00zeee0000000zee00000000ze00000000ze00000000zeeeez00zzee11ee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE, RoomFlags.NO_TOP],
        },
        {
          name: "Room 2",
          notes: "Below not BEEHIVE. Right is BEEHIVE.",
          data: "11ee00ee11eeez00zeeeeez0000000ez00000000ez00000000ez00000000eezz00zeeeeeee00ee11",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE, RoomFlags.NO_TOP],
        },
        {
          name: "Room 3",
          notes: "Below not BEEHIVE.",
          data: "11ee00ee11eeez00zeeeeez0000zeeez000000zeez000000zeez000000zeeezz00zzeeeeee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE, RoomFlags.NO_TOP],
        },
        {
          name: "Room 4",
          notes:
            "Left is not Crystal Idol, SIDE, or PATH. Right is not Crystal Idol, SIDE, or PATH.",
          data: "11ee00ee11eeez00zeeeeez0000zeeez000000zeez000000zeez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE, RoomFlags.NO_TOP],
        },

        {
          name: "Room 5",
          notes: "Left is not Crystal Idol, SIDE, or PATH.",
          data: "11ee00ee11eeez00zeeeeez0000zeeez00000000ez00000000ez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE, RoomFlags.NO_TOP],
        },

        {
          name: "Room 6",
          data: "11ee00ee11eeez00zeeeeez0000zee00000000ze00000000zeez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE, RoomFlags.NO_TOP],
        },
      ],
    },
    {
      name: "Beehive - Side / Down Open",
      rooms: [
        {
          name: "Room 1",
          notes: "BEEHIVE Above. BEEHIVE not Below.",
          data: "ez000000zeez00zz00zeez00zz00ze00000000000000000000ez000000zeeezz00zzeeeeee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 2",
          notes: "BEEHIVE Above.",
          data: "ez000000zeez00zz00zeez00zz00ze00000000000000000000ez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 3",
          notes:
            "Left is not Crystal Idol, SIDE, or PATH. Right is not Crystal Idol, SIDE, or PATH. Below not BEEHIVE",
          data: "11eeeeee11eeezzzzeeeeez0000zeeez000000zeez000000zeez000000zeeezz00zzeeeeee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 4",
          notes:
            "Left is not Crystal Idol, SIDE, or PATH. Right is not Crystal Idol, SIDE, or PATH.",
          data: "11eeeeee11eeezzzzeeeeez0000zeeez000000zeez000000zeez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 5",
          notes: "Left is BEEHIVE. Below not BEEHIVE.",
          data: "eeeeeeee11zzzzzzzeee0000000zee000000000000000000000000000zeezzzz00zeeeeeee00ee11",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 6",
          notes: "Left is not Crystal Idol, SIDE, or PATH. Below not BEEHIVE.",
          data: "1eeeeeee11eezzzzzeeeez00000zeeez00000000ez00000000ez000000zeeezz00zzeeeeee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 7",
          notes: "Left is not Crystal Idol, SIDE, or PATH.",
          data: "1eeeeeee11eezzzzzeeeez00000zeeez00000000ez00000000ez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 8",
          notes: "Right is BEEHIVE. Below not BEEHIVE.",
          data: "11eeeeeeeeeeezzzzzzzeez000000000000000000000000000ez00000000eezz00zzzzeeee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 9",
          notes: "Right is not Crystal Idol, SIDE, or PATH. Below not BEEHIVE.",
          data: "11eeeeeee1eeezzzzzeeeez00000ze00000000ze00000000zeez000000zeeezz00zzeeeeee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 10",
          notes: "Right is not Crystal Idol, SIDE, or PATH",
          data: "11eeeeeee1eeezzzzzeeeez00000ze00000000ze00000000zeez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 11",
          notes: "Below is BEEHIVE",
          data: "11eeeeee11eeezzzzeeeeez0000zee00000000000000000000ez00zz00zeez00zz00zeez000000ze",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
        },
        {
          name: "Room 12",
          data: "11eeeeee11eeezzzzeeeeez0000zee00000000000000000000ez000000zeeezz00zzeeeeee00eeee",
          type: RoomType.BEEHIVE_SIDE_DOWN_OPEN,
          flags: [RoomFlags.BEEHIVE],
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
