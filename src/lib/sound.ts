// Forest festival sounds — everything is synthesized live with the Web
// Audio API. No audio files, no downloads, no copyrighted material.
// Browsers only allow audio after a user gesture, so init() is called from
// the first pointer/key event (wired up in App.tsx).

import { loadJSON, saveJSON } from './storage';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let musicStep = 0;
let nextNoteTime = 0;

let sfxOn = loadJSON<boolean>('sfx', true);
let musicOn = loadJSON<boolean>('music', true);

export function isSfxOn(): boolean {
  return sfxOn;
}

export function isMusicOn(): boolean {
  return musicOn;
}

export function setSfx(on: boolean): void {
  sfxOn = on;
  saveJSON('sfx', on);
}

export function setMusic(on: boolean): void {
  musicOn = on;
  saveJSON('music', on);
  if (on) startMusic();
  else stopMusic();
}

/** Create/resume the audio context. Must be called from a user gesture. */
export function initAudio(): void {
  if (typeof window === 'undefined') return;
  const AC: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  if (musicOn) startMusic();
}

function now(): number {
  return ctx ? ctx.currentTime : 0;
}

interface ToneOpts {
  freq: number;
  endFreq?: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  when?: number;
  toMusicBus?: boolean;
}

function tone({ freq, endFreq, dur, type = 'sine', gain = 0.2, when = 0, toMusicBus = false }: ToneOpts): void {
  if (!ctx || !master) return;
  const t = now() + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(toMusicBus && musicGain ? musicGain : master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Short filtered-noise burst (page flips, whooshes). */
function swish(dur = 0.14, from = 900, to = 2400, gain = 0.12): void {
  if (!ctx || !master) return;
  const t = now();
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(t);
}

function ready(): boolean {
  return sfxOn && ctx !== null;
}

// ---------------- Sound effects ----------------

/** Soft wooden tap for ordinary buttons. */
export function playClick(): void {
  if (!ready()) return;
  tone({ freq: 660, endFreq: 440, dur: 0.06, type: 'triangle', gain: 0.1 });
}

/** Leaf/promise card flipping open. */
export function playFlip(): void {
  if (!ready()) return;
  swish(0.16, 800, 2600, 0.1);
  tone({ freq: 520, endFreq: 720, dur: 0.1, type: 'triangle', gain: 0.06, when: 0.03 });
}

/** Smile sticker or focus leaf placed. */
export function playSticker(): void {
  if (!ready()) return;
  tone({ freq: 1175, dur: 0.09, type: 'triangle', gain: 0.12 });
  tone({ freq: 1568, dur: 0.14, type: 'triangle', gain: 0.1, when: 0.06 });
}

/** Acorn dropping into a basket. */
export function playAcorn(): void {
  if (!ready()) return;
  tone({ freq: 300, endFreq: 130, dur: 0.12, type: 'sine', gain: 0.18 });
  tone({ freq: 900, dur: 0.03, type: 'square', gain: 0.03, when: 0.005 });
}

/** Counting machine switched on/off. */
export function playToggle(on: boolean): void {
  if (!ready()) return;
  if (on) {
    tone({ freq: 392, dur: 0.07, type: 'triangle', gain: 0.1 });
    tone({ freq: 587, dur: 0.1, type: 'triangle', gain: 0.1, when: 0.07 });
  } else {
    tone({ freq: 587, dur: 0.07, type: 'triangle', gain: 0.08 });
    tone({ freq: 392, dur: 0.1, type: 'triangle', gain: 0.08, when: 0.07 });
  }
}

/** One counting step in a demo or accordion. */
export function playTick(): void {
  if (!ready()) return;
  tone({ freq: 987, dur: 0.05, type: 'triangle', gain: 0.08 });
}

/** Star rating pressed. */
export function playStar(): void {
  if (!ready()) return;
  tone({ freq: 1319, dur: 0.08, type: 'triangle', gain: 0.1 });
  tone({ freq: 1760, dur: 0.1, type: 'sine', gain: 0.07, when: 0.05 });
}

/** Ballot sealed / submitted. */
export function playSeal(): void {
  if (!ready()) return;
  swish(0.12, 1200, 500, 0.08);
  tone({ freq: 523, dur: 0.1, type: 'triangle', gain: 0.12, when: 0.08 });
  tone({ freq: 784, dur: 0.16, type: 'triangle', gain: 0.12, when: 0.16 });
}

/** Passport sticker earned. */
export function playChime(): void {
  if (!ready()) return;
  const notes = [880, 1109, 1319];
  notes.forEach((f, i) =>
    tone({ freq: f, dur: 0.22, type: 'sine', gain: 0.09, when: i * 0.07 }),
  );
}

/** News card drawn from the stack. */
export function playNews(): void {
  if (!ready()) return;
  swish(0.2, 600, 2000, 0.11);
  tone({ freq: 740, dur: 0.08, type: 'triangle', gain: 0.08, when: 0.1 });
}

/** Winner ribbons in the Counting Theater. */
export function playFanfare(): void {
  if (!ready()) return;
  const melody: [number, number][] = [
    [523.25, 0], [659.25, 0.11], [783.99, 0.22], [1046.5, 0.34], [783.99, 0.5], [1046.5, 0.62],
  ];
  for (const [f, w] of melody) {
    tone({ freq: f, dur: 0.28, type: 'triangle', gain: 0.11, when: w });
  }
}

// ---------------- Background music ----------------
// A gentle, loopable forest music box: soft pad chords, sparse pentatonic
// plucks, and an occasional bird chirp. Nothing loud, nothing sudden.

const CHORDS: number[][] = [
  [130.81, 196.0, 261.63], // C
  [110.0, 164.81, 220.0], // Am
  [87.31, 174.61, 220.0], // F
  [98.0, 146.83, 196.0], // G
];
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
const STEP_DUR = 0.42; // seconds per melody step (~71 bpm eighth notes)
const STEPS_PER_CHORD = 8;

function scheduleMusicChunk(): void {
  if (!ctx || !musicGain) return;
  const horizon = now() + 1.2;
  while (nextNoteTime < horizon) {
    const chord = CHORDS[Math.floor(musicStep / STEPS_PER_CHORD) % CHORDS.length];
    // Pad chord at the start of each bar.
    if (musicStep % STEPS_PER_CHORD === 0) {
      for (const f of chord) {
        padTone(f, STEP_DUR * STEPS_PER_CHORD * 1.05, nextNoteTime);
      }
    }
    // Sparse music-box pluck.
    if (Math.random() < 0.55) {
      const note = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
      pluck(note, nextNoteTime);
    }
    // Rare, quiet bird chirp.
    if (Math.random() < 0.045) {
      chirp(nextNoteTime + Math.random() * 0.2);
    }
    nextNoteTime += STEP_DUR;
    musicStep += 1;
  }
}

function padTone(freq: number, dur: number, when: number): void {
  if (!ctx || !musicGain) return;
  for (const detune of [-4, 4]) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(0.028, when + dur * 0.3);
    g.gain.linearRampToValueAtTime(0.0001, when + dur);
    osc.connect(g);
    g.connect(musicGain);
    osc.start(when);
    osc.stop(when + dur + 0.1);
  }
}

function pluck(freq: number, when: number): void {
  if (!ctx || !musicGain) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.05, when + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.6);
  osc.connect(g);
  g.connect(musicGain);
  osc.start(when);
  osc.stop(when + 0.7);
  // A faint octave shimmer.
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2;
  g2.gain.setValueAtTime(0.0001, when);
  g2.gain.exponentialRampToValueAtTime(0.014, when + 0.015);
  g2.gain.exponentialRampToValueAtTime(0.0001, when + 0.35);
  osc2.connect(g2);
  g2.connect(musicGain);
  osc2.start(when);
  osc2.stop(when + 0.45);
}

function chirp(when: number): void {
  if (!ctx || !musicGain) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2300, when);
  osc.frequency.exponentialRampToValueAtTime(3100, when + 0.07);
  osc.frequency.exponentialRampToValueAtTime(2500, when + 0.13);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.02, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);
  osc.connect(g);
  g.connect(musicGain);
  osc.start(when);
  osc.stop(when + 0.2);
}

export function startMusic(): void {
  if (!ctx || !master || musicTimer !== null) return;
  if (!musicGain) {
    musicGain = ctx.createGain();
    musicGain.gain.value = 1;
    musicGain.connect(master);
  }
  nextNoteTime = now() + 0.1;
  scheduleMusicChunk();
  musicTimer = window.setInterval(scheduleMusicChunk, 300);
}

export function stopMusic(): void {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
  if (musicGain && ctx) {
    // Fade out gently instead of cutting.
    musicGain.gain.setTargetAtTime(0.0001, now(), 0.4);
    const old = musicGain;
    window.setTimeout(() => {
      old.disconnect();
    }, 1500);
    musicGain = null;
  }
}
