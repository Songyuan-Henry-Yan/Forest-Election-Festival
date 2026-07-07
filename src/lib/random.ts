// Deterministic seeded random helpers (mulberry32).

export type Rng = () => number;

/** Hash a string seed into a 32-bit integer (xmur3). */
export function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

/** mulberry32 PRNG. Same seed -> same sequence. */
export function mulberry32(a: number): Rng {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFromSeed(seed: string): Rng {
  return mulberry32(hashSeed(seed));
}

export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick<T>(rng: Rng, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/** Fisher-Yates shuffle (returns a new array). */
export function shuffle<T>(rng: Rng, items: T[]): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Roughly normal noise in [-scale, +scale] (average of 3 uniforms). */
export function noise(rng: Rng, scale: number): number {
  return ((rng() + rng() + rng()) / 3 - 0.5) * 2 * scale;
}

const SEED_WORDS_A = [
  'maple', 'berry', 'acorn', 'willow', 'clover', 'pebble', 'sunny', 'mossy',
  'breezy', 'tulip', 'cedar', 'honey', 'fern', 'daisy', 'brook', 'pine',
];
const SEED_WORDS_B = [
  'meadow', 'bridge', 'lantern', 'basket', 'ribbon', 'whistle', 'garden',
  'stump', 'burrow', 'canopy', 'puddle', 'trail', 'nest', 'grove', 'song',
];

/** Friendly random seed like "maple-bridge-42". */
export function randomSeed(): string {
  const r = mulberry32((Date.now() ^ (Math.random() * 0xffffffff)) >>> 0);
  const a = SEED_WORDS_A[Math.floor(r() * SEED_WORDS_A.length)];
  const b = SEED_WORDS_B[Math.floor(r() * SEED_WORDS_B.length)];
  return `${a}-${b}-${Math.floor(r() * 90 + 10)}`;
}
