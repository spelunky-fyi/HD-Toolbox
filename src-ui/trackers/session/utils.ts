const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function msToTime(s, showMs?: boolean) {
  function pad(n, z) {
    z = z || 2;
    return ("00" + n).slice(-z);
  }

  let ms = s % 1000;
  s = (s - ms) / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  let hrs = (s - mins) / 60;

  let out = "";
  if (showMs ?? true) {
    out = "." + pad(ms, 3);
  }
  out = pad(secs, 2) + out;
  if (mins !== 0 || hrs !== 0) {
    out = pad(mins, 2) + ":" + out;
  }

  if (hrs !== 0) {
    out = pad(hrs, 2) + ":" + out;
  }

  return out;
}

function getBiome(areaIdx, levelIdx, level) {
  if (areaIdx == 0) {
    return "mines";
  }
  if (areaIdx == 1) {
    if (levelIdx == 1 && level && level.is_worm) {
      return "worm";
    }
    return "jungle";
  }
  if (areaIdx == 2) {
    if (levelIdx == 1 && level && level.is_worm) {
      return "worm";
    }
    if (levelIdx == 4) {
      return "mothership";
    }
    return "icecaves";
  }
  if (areaIdx == 3) {
    return "temple";
  }
  if (areaIdx == 4) {
    return "hell";
  }
}

export { getBiome, msToTime, currencyFormatter };
