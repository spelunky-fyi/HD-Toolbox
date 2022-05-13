import mines from "@hdt/pages/level_viewer/levels/mines";
import jungle from "@hdt/pages/level_viewer/levels/jungle";
import worm from "@hdt/pages/level_viewer/levels/worm";
import black_market from "@hdt/pages/level_viewer/levels/black_market";
import haunted_castle from "@hdt/pages/level_viewer/levels/haunted_castle";
import ice_caves from "@hdt/pages/level_viewer/levels/ice_caves";
import wet_fur from "@hdt/pages/level_viewer/levels/wet_fur";
import mothership from "@hdt/pages/level_viewer/levels/mothership";
import temple from "@hdt/pages/level_viewer/levels/temple";
import olmecs_lair from "@hdt/pages/level_viewer/levels/olmecs_lair";
import hell from "@hdt/pages/level_viewer/levels/hell";
import tutorial from "@hdt/pages/level_viewer/levels/tutorial";

export default [
  { name: "Mines", data: mines, bg: "minebg" },
  { name: "Jungle", data: jungle, bg: "lushbg" },
  { name: "Worm", data: worm, bg: "wormbg" },
  { name: "Black Market", data: black_market, bg: "lushbg" },
  { name: "Haunted Castle", data: haunted_castle, bg: "lushbg" },
  { name: "Ice Caves", data: ice_caves, bg: "icebg" },
  { name: "Wet Fur", data: wet_fur, bg: "icebg" },
  { name: "Mothership", data: mothership, bg: "mothershipbg" },
  { name: "Temple / CoG", data: temple, bg: "templebg" },
  { name: "Olmec's Lair", data: olmecs_lair, bg: "templebg" },
  { name: "Hell / Yama", data: hell, bg: "hellbg" },
  { name: "Tutorial", data: tutorial, bg: "minebg" },
];
