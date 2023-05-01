import { XY, distanceSq } from "./Tsp";


function opt2(route: XY[]) {
  const length = route.length;
  for (let i = 1; i < length - 1; ++i) {
    const s1 = route[i - 1];
    const t1 = route[i % length];
    const d1 = distanceSq(s1, t1);
    for (let j = i + 2; j <= length; j++) {
      const s2 = route[j - 1];
      const t2 = route[j % length];
      const before = d1 + distanceSq(s2, t2);
      const after = distanceSq(s1, s2) + distanceSq(t1, t2);
      if (before > after) {
        for (let k = 0; k < (j - i) / 2; k++) {
          const tmp = route[(k + i) % length];
          route[(k + i) % length] = route[(j - k - 1) % length];
          route[(j - k - 1) % length] = tmp;
        }
        return true;
      }
    }
  }
  return false;
}

export { opt2 }