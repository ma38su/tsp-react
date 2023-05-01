import { XY, distanceSq, reverseArray } from "./Tsp";

function opt3(route: XY[], seq: number[]) {
  if (route.length !== seq.length) {
    return;
  }

  const length = seq.length;
  for (let i = 1; i < length - 1; i++) {
    const s1 = route[seq[i - 1]];
    const t1 = route[seq[i]];
    const d1 = distanceSq(s1, t1);
    for (let j = i + 1; j < length; j++) {
      const s2 = route[seq[j - 1]];
      const t2 = route[seq[j]];
      const d2 = distanceSq(s2, t2);
      for (let k = j + 1; k <= length; k++) {
        if ((k + 2) % length == j || (j + 2) % length == i || i + 2 == k) {
          continue;
        }
        const s3 = route[seq[k - 1]];
        const t3 = route[seq[k % length]];
        const before = d1 + d2 + distanceSq(s3, t3);
        {
          const after1 = distanceSq(s1, t2) + distanceSq(s3, t1) + distanceSq(s2, t3);
          if (before > after1) {
            // リストの回転を行います。
            reverseArray(seq, i, j - 1);
            reverseArray(seq, j, k - 1);
            reverseArray(seq, i, k - 1);
            return true;
          }
        }
        {
          const after2 = distanceSq(s1, t2) + distanceSq(s3, s2) + distanceSq(t1, t3);
          if (before > after2) {
            reverseArray(seq, j, k - 1);
            reverseArray(seq, i, k - 1);
            return true;
          }
        }
        {
          const after3 = distanceSq(s1, s3) + distanceSq(t2, t1) + distanceSq(s2, t3);
          if (before > after3) {
            reverseArray(seq, i, j - 1);
            reverseArray(seq, i, k - 1);
            return true;
          }
        }
        {
          const after4 = distanceSq(s1, s2) + distanceSq(t1, s3) + distanceSq(t2, t3);
          if (before > after4) {
            reverseArray(seq, i, j - 1);
            reverseArray(seq, j, k - 1);
            return true;
          }
        }
      }
    }
  }
  return false;
}

export { opt3 }
