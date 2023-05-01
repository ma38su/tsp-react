import { XY, distanceSq } from "./Tsp";


function opt2(route: XY[], seq: number[]) {
  if (route.length !== seq.length) {
    return;
  }

  const length = seq.length;
  for (let i = 1; i < length - 1; ++i) {
    const s1 = route[seq[i - 1]];
    const t1 = route[seq[i % length]];
    const d1 = distanceSq(s1, t1);
    for (let j = i + 2; j <= length; j++) {
      const s2 = route[seq[j - 1]];
      const t2 = route[seq[j % length]];
      const before = d1 + distanceSq(s2, t2);
      const after = distanceSq(s1, s2) + distanceSq(t1, t2);
      if (before > after) {
        for (let k = 0; k < (j - i) / 2; k++) {
          const tmp = seq[(k + i) % length];
          seq[(k + i) % length] = seq[(j - k - 1) % length];
          seq[(j - k - 1) % length] = tmp;
        }
        return true;
      }
    }
  }
  return false;
}

export { opt2 }