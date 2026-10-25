// Formations: the shared bits of the particle world — sizes, the hub's orbit, and text sampled from a canvas.
// Scenes themselves live in world/scenes/<zone>.js (built with world/scenes/kit.js). Each formation is
// { pos, col, grp, piv } (Float32Arrays): grp = motion group (see scenes/kit.js), piv = spin pivot xyz + speed.
import { ZONES } from '../content/zones.js';

export const N_DESKTOP = 36000, N_MOBILE = 15000;

function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000003) / 1000003; }; }
const gauss = r => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
export function hex(h) { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function make(N) { return { N, pos: new Float32Array(N * 3), col: new Float32Array(N * 3), grp: new Float32Array(N), piv: new Float32Array(N * 4) }; }
function put(F, i, x, y, z, c, g = 0) { F.pos[i * 3] = x; F.pos[i * 3 + 1] = y; F.pos[i * 3 + 2] = z; F.col[i * 3] = c[0]; F.col[i * 3 + 1] = c[1]; F.col[i * 3 + 2] = c[2]; F.grp[i] = g; }

/** background dust: a deep shell of faint warm specks (always some, so the dark has depth) */
function dust(F, from, r, tint = [0.86, 0.74, 0.66]) {
  for (let i = from; i < F.N; i++) {
    const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 7 + Math.pow(r(), .6) * 16;
    const s = Math.sqrt(1 - u * u);
    const k = 0.08 + r() * 0.2;
    put(F, i, Math.cos(th) * s * rad, u * rad * 0.62, Math.min(1.5, Math.sin(th) * s * rad * .7 - 9), [tint[0] * k, tint[1] * k, tint[2] * k], 4);
  }
}
/** random order so particles travel varied paths between formations */
function shuffled(F, seed) {
  const r = rng(seed), N = F.N, idx = new Uint32Array(N);
  for (let i = 0; i < N; i++) idx[i] = i;
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  const G = make(N);
  for (let i = 0; i < N; i++) { const s = idx[i]; G.pos.set(F.pos.subarray(s * 3, s * 3 + 3), i * 3); G.col.set(F.col.subarray(s * 3, s * 3 + 3), i * 3); G.grp[i] = F.grp[s]; G.piv.set(F.piv.subarray(s * 4, s * 4 + 4), i * 4); }
  return G;
}

/** the orbit around the centre that the districts ride on (tilted toward the viewer) */
export const RING = { R: 4.9, tilt: 0.3 };
export function ringPoint(a, R = RING.R) { return [Math.cos(a) * R, -Math.sin(a) * R * Math.sin(RING.tilt) - .15, Math.sin(a) * R * Math.cos(RING.tilt)]; }

/* ---------------- text (sampled from a canvas) ---------------- */
const textCache = new Map();
/** sample the filled pixels of some text → [x0,y0,x1,y1,…] centred, scaled so the ink is `width` wide */
export function textPoints(str, { font = '800 220px Changa', width = 8.5, rtl = true, lines = null } = {}) {
  const key = [str, font, width, rtl, lines && lines.join('|')].join('§');
  if (textCache.has(key)) return textCache.get(key);
  const cv = document.createElement('canvas'); const W = 1600, H = 560; cv.width = W; cv.height = H;
  const x = cv.getContext('2d', { willReadFrequently: true });
  x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.direction = rtl ? 'rtl' : 'ltr'; x.font = font;
  const ls = lines || [str]; const fs = parseFloat((font.match(/(\d+)px/) || [0, 200])[1]);
  // shrink to fit the canvas
  let scale = 1; ls.forEach(l => { const w = x.measureText(l).width; if (w > W * .94) scale = Math.min(scale, W * .94 / w); });
  if (scale < 1) x.font = font.replace(/(\d+)px/, Math.floor(fs * scale) + 'px');
  ls.forEach((l, k) => x.fillText(l, W / 2, H / 2 + (k - (ls.length - 1) / 2) * fs * scale * 1.05));
  const d = x.getImageData(0, 0, W, H).data; const pts = [];
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let yy = 0; yy < H; yy += 2) for (let xx = 0; xx < W; xx += 2) if (d[(yy * W + xx) * 4] > 140) { pts.push(xx, yy); if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; if (yy < minY) minY = yy; if (yy > maxY) maxY = yy; }
  const sc = width / Math.max(1, maxX - minX); const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const out = new Float32Array(pts.length);
  for (let i = 0; i < pts.length; i += 2) { out[i] = (pts[i] - cx) * sc; out[i + 1] = -(pts[i + 1] - cy) * sc; }
  out.step = 2 * sc; // size of one sample cell in world units
  textCache.set(key, out);
  return out;
}
/** text as a formation; `colors` = a list of hex stops spread across the width (in reading order) */
export function text(N, str, { font = '800 220px Changa', width = 8.5, colors = ['#ECE9E2'], seed = 5, fill = .62, rtl = true, lines = null, embers = 0 } = {}) {
  const F = make(N), r = rng(seed);
  const T = textPoints(str, { font, width, rtl, lines }); const n = T.length / 2; const nT = Math.floor(N * fill); let i = 0;
  const stops = colors.map(hex);
  const at = t => { if (stops.length < 2) return stops[0]; const u = t * (stops.length - 1), a = Math.min(stops.length - 2, Math.floor(u)); return mixc(stops[a], stops[a + 1], u - a); };
  for (; i < nT && n; i++) {
    const p = Math.floor(r() * n); const px = T[p * 2] + (r() - .5) * T.step, py = T[p * 2 + 1] + (r() - .5) * T.step;
    const t = Math.min(1, Math.max(0, px / width + .5));
    const ember = r() < embers;
    put(F, i, px, py, gauss(r) * .06, at(rtl ? 1 - t : t).map(v => v * (.8 + r() * .35)), ember ? 8 : 0);
  }
  dust(F, i, r);
  return shuffled(F, seed + 11);
}

/** zone → the formation its hub selection and its level background show */
export const ZONE_FORMATION = Object.fromEntries(ZONES.map(z => [z.id, z.scene || 'nebula']));
