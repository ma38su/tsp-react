import { RandomXorshift } from "../RandomXorshift";
import { XY, calculateDistance } from "./Tsp";

const rgen = new RandomXorshift();

type Gene = {
  seq: number[]
  distance: number,
}

function newRandomGene(points: XY[]) {
  const seq = [];
  for (let i = points.length - 1; i >= 0; --i) {
    seq.push(rgen.nextInt(i+1));
  }
  return newGene(points, seq);
}

function newGene(points: XY[], seq: number[]): Gene {
  return {
    seq,
    distance: calculateDistance(points, geneToSeq(seq))
  };
}

function generateGenes(points: XY[], n: number): Gene[] {
  const geneList: Gene[] = [];
  for (let i = 0; i < n; ++i) {
    geneList.push(newRandomGene(points));
  }
  geneList.sort((g1, g2) => g1.distance - g2.distance);
  return geneList;
}

function optGenes(points: XY[], genes: Gene[]): Gene[] {
  const newGenes: Gene[] = [];
  let i = 0;
  const nn = Math.floor(genes.length / 10);
  while (i < genes.length - nn) {
    const gene = genes[i];
    const j = rgen.nextInt(Math.floor(genes.length / 2));
    if (i === j) {
      continue;
    }
    newGenes.push(crossOrder(points, gene, genes[j]));
    i+=1;
  }

  for (let i = 0; i < nn; ++i) {
    const gene = genes[i];
    newGenes.push(mutationChange(points, gene));
  }

  newGenes.sort((g1, g2) => g1.distance - g2.distance);
  return newGenes;
}

function geneToSeq(s: number[]) {
  const newSeq: number[] = [];
  const seq: number[] = s.map((_, i) => i);
  for (const i of s) {
    const j = seq[i];
    seq.splice(i, 1);
    newSeq.push(j);
  }
  return newSeq;
}

function randomPosition2(n: number) {
  const i1 = rgen.nextInt(Math.floor((3 * n) / 4));
  const minRange = Math.floor(n / 4);
  const i2 = i1 + minRange + rgen.nextInt(n - (i1 + minRange));
  return [i1, i2];
}

function crossOrder(points: XY[], gene0: Gene, gene1: Gene) {
  const { seq: s0 } = gene0;
  const { seq: s1 } = gene1;
  const s = [...s0];
  const [i1, i2] = randomPosition2(s0.length);
  for (let i = i1; i < i2; ++i) {
    s[i] = s1[i];
  }
  return newGene(points, s);
}

// 順序表現の2箇所を変更する
function mutationChange(points: XY[], gene: Gene) {
  const { seq: s } = gene;
  const newSeq = [...s];
  for (let i = 0; i < 2; ++i) {
    const xp = rgen.nextInt(s.length);
    const m = rgen.nextInt(s.length - xp);
    newSeq[xp] = m;
  }
  return newGene(points, newSeq);
}

export { generateGenes, optGenes, geneToSeq }
export type { Gene }