// Tiny synthesized sound effects (no audio files). Muted when the player turns sound off.
import { state } from './state.js';

let ctx = null, master = null;
function ac() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.32; master.connect(ctx.destination);
  return ctx;
}
export function unlockAudio() { const c = ac(); if (c && c.state === 'suspended') c.resume(); }
window.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
window.addEventListener('keydown', unlockAudio, { once: true, capture: true });

function tone(f0, f1, dur, { type = 'sine', vol = 0.6, at = 0, attack = 0.005 } = {}) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + at;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, { vol = 0.4, at = 0, from = 2000, to = 400, q = 1 } = {}) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + at;
  const len = Math.floor(c.sampleRate * dur); const buf = c.createBuffer(1, len, c.sampleRate); const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q; f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t + dur);
}
const N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, D6: 1174.7, E6: 1318.5, G6: 1568, B6: 1975.5 };
/* refined palette: sine glass, soft noise, low thuds — nothing chiptune */
const BANK = {
  pop: () => tone(740, 1110, 0.07, { vol: 0.22 }),
  click: () => noise(0.035, { vol: 0.16, from: 3200, to: 2400, q: 3 }),
  hover: () => tone(1480, 1480, 0.03, { vol: 0.05 }),
  good: () => { tone(N.E6, N.E6, 0.22, { vol: 0.2 }); tone(N.B6, N.B6, 0.32, { vol: 0.14, at: 0.07 }); },
  bad: () => { tone(150, 70, 0.28, { vol: 0.5 }); noise(0.12, { vol: 0.12, from: 500, to: 180, q: 1 }); },
  coin: () => { tone(1760, 1760, 0.09, { vol: 0.12 }); tone(2637, 2637, 0.22, { vol: 0.09, at: 0.05 }); },
  level: () => [N.C5, N.G5, N.D6, N.G6].forEach((f, i) => tone(f, f, 0.6, { vol: 0.16, at: i * 0.11, attack: 0.02 })),
  badge: () => [N.G5, N.D6, N.G6].forEach((f, i) => tone(f, f, 0.5, { vol: 0.14, at: i * 0.09, attack: 0.015 })),
  whoosh: () => noise(0.7, { vol: 0.22, from: 300, to: 2600, q: 0.6 }),
  swoosh: () => noise(0.32, { vol: 0.14, from: 2400, to: 500, q: 0.6 }),
  hit: () => { noise(0.16, { vol: 0.35, from: 1600, to: 160, q: 0.7 }); tone(110, 46, 0.32, { vol: 0.6 }); },
  roar: () => { tone(72, 48, 0.9, { type: 'triangle', vol: 0.32 }); noise(0.7, { vol: 0.12, from: 420, to: 90, q: 2 }); },
  tick: () => tone(2200, 2200, 0.02, { vol: 0.05 }),
  flip: () => noise(0.14, { vol: 0.12, from: 1800, to: 900, q: 1.2 }),
  win: () => [N.C5, N.E5, N.G5, N.C6, N.E6].forEach((f, i) => tone(f, f, 0.9, { vol: 0.13, at: i * 0.1, attack: 0.02 })),
  lose: () => [N.E5, N.C5, 392, 330].forEach((f, i) => tone(f, f * 0.98, 0.5, { vol: 0.13, at: i * 0.16, attack: 0.02 })),
  boop: () => tone(520, 390, 0.16, { vol: 0.18 })
};
export function sfx(name) {
  if (!state().settings.sound) return;
  try { const f = BANK[name]; if (f) f(); } catch (e) { /* audio is optional */ }
}

/* a slow, low ambient bed (only when sound is on) */
let amb = null;
export function ambient(on) {
  const c = ac(); if (!c) return;
  if (on && state().settings.sound) {
    if (amb) return;
    const g = c.createGain(); g.gain.value = 0.0001; g.connect(master);
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420; f.Q.value = .7; f.connect(g);
    const oscs = [55, 82.41, 110.3, 164.8].map((hz, i) => { const o = c.createOscillator(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = hz; o.detune.value = (i - 1.5) * 4; const og = c.createGain(); og.gain.value = [.5, .28, .18, .08][i]; o.connect(og); og.connect(f); o.start(); return o; });
    const lfo = c.createOscillator(); lfo.frequency.value = .05; const lg = c.createGain(); lg.gain.value = 180; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    g.gain.exponentialRampToValueAtTime(.05, c.currentTime + 4);
    amb = { g, oscs, lfo };
  } else if (amb) {
    const a = amb; amb = null; a.g.gain.cancelScheduledValues(c.currentTime); a.g.gain.setValueAtTime(Math.max(.0001, a.g.gain.value), c.currentTime); a.g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + 1.2);
    setTimeout(() => { a.oscs.forEach(o => o.stop()); a.lfo.stop(); a.g.disconnect(); }, 1400);
  }
}
