import { derived, writable } from "svelte/store";

export const imagesLoaded = writable(false);

let imageCount = 0;
const imageSrcs = [
  { name: "minebg", src: "/images/backgrounds/minebg.jpg" },
  { name: "cogbg", src: "/images/backgrounds/cogbg.png" },
  { name: "hellbg", src: "/images/backgrounds/hellbg.jpg" },
  { name: "icebg", src: "/images/backgrounds/icebg.png" },
  { name: "lushbg", src: "/images/backgrounds/lushbg.jpg" },
  { name: "mothershipbg", src: "/images/backgrounds/mothershipbg.jpg" },
  { name: "wormbg", src: "/images/backgrounds/wormbg.png" },
  { name: "templebg", src: "/images/backgrounds/templebg.jpg" },
  { name: "alltiles", src: "/images/tiles/alltiles.png" },
  { name: "items", src: "/images/tiles/items.png" },
  { name: "monsters", src: "/images/tiles/monsters.png" },
  { name: "monsters2", src: "/images/tiles/monsters2.png" },
  { name: "monsters3", src: "/images/tiles/monsters3.png" },
  { name: "monsters4", src: "/images/tiles/monsters4.png" },
  { name: "monsters5", src: "/images/tiles/monsters5.png" },
  { name: "monstersbig", src: "/images/tiles/monstersbig.png" },
  { name: "monstersbig2", src: "/images/tiles/monstersbig2.png" },
  { name: "monstersbig3", src: "/images/tiles/monstersbig3.png" },
  { name: "monstersbig4", src: "/images/tiles/monstersbig4.png" },
  { name: "monstersbig5", src: "/images/tiles/monstersbig5.png" },
  { name: "icesmallbg", src: "/images/tiles/icesmallbg.png" },
  { name: "coffin", src: "/images/tiles/coffin.png" },
  { name: "doors", src: "/images/tiles/doors.png" },
  { name: "water", src: "/images/tiles/water.png" },
  { name: "leaderpics", src: "/images/leaderpics.png" },
  { name: "olmec-smile", src: "/images/olmec-smile.png" },
  { name: "journal", src: "/images/journal.png" },
  { name: "hedjet", src: "/images/hedjet.png" },
];
export const images = {};

imageSrcs.forEach((imageSrc) => {
  const image = new Image();
  image.src = imageSrc.src;
  image.onload = () => {
    imageCount += 1;
    if (imageCount === imageSrcs.length) {
      imagesLoaded.set(true);
    }
  };
  images[imageSrc.name] = image;
});
