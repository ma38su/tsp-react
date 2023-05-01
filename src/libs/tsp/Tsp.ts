type XY = [number, number];

function distanceSq(p1: XY, p2: XY) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function reverseArray<T>(route: T[], s: number, t: number) {
  const length = route.length;
  for (let i = Math.floor((t - s) / 2); i >= 0; --i) {
    const tmp = route[(s + i) % length];
    route[(s + i) % length] = route[(t - i) % length];
    route[(t - i) % length] = tmp;
  }
}

function calculateDistance(pts: readonly XY[]) {
  let p0 = pts[pts.length - 1];
  let distSq = 0;
  for (let i = 0; i < pts.length; ++i) {
    const p1 = pts[i];
    const [x1, y1] = p1;
    const [x0, y0] = p0;
    const dx = x1 - x0;
    const dy = y1 - y0;
    distSq += dx * dx + dy * dy;
    p0 = p1;
  }
  return Math.sqrt(distSq);
}

export type { XY };
export { calculateDistance, distanceSq, reverseArray }