// The particle kit for immersive scenes ("night shift": metal glowing in a dark plant).
// A scene is a builder: () => build(N, seed, (P, n) => { …place up to n points with P.* … }). Whatever you don't
// place becomes faint background dust. Coordinates: x ≈ −4.5…4.5, y ≈ −2.6…2.6, z toward the viewer (keep |z| < 2).
// Read STYLE.md next to this file before drawing.
//
// Motion groups (the `g` argument). The GPU animates these for free, every frame:
//   0  static (default)                     4  background dust (the kit adds it; don't use)
//   5  bob: drifts up and down (±0.55)
//   6  spin about Z around a pivot — pass pv = [px, py, pz, speed rad/s] (gears, rolls, wheels, rollers)
//   7  press ram: draw it AT CONTACT; it rises 0.6 and slams back down (2.6 s cycle)
//   8  embers: rise ~2.4 and wrap, fading in and out (sparks, heat, steam)
//   9  conveyor: slides along +x and wraps across the whole stage (x −4.4…4.4), fading at the ends (strips, sheet)
//   10 shows only while the ram (group 7) is down        11 shows only while the ram is up
//   12 spin about X around a pivot — pv = [px, py, pz, speed] (work turning on a lathe; P.lathe({ axis: 'x' }) sets it)
// Spin about Y (3D solids turning in place): groups 0/5, pv = [px, py, pz, speed].
import { textPoints } from '../formations.js';

export function rng(seed = 1) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000003) / 1000003; }; }
export const gauss = r => { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
export function hex(h) { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }
/** scale a colour's brightness (additive blending: dimmer = further back / less important) */
export const k = (c, f) => [c[0] * f, c[1] * f, c[2] * f];
export const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** the night-shift palette. Temper colours (straw → blue) are the zones; hot colours are heat; steel is cold metal. */
export const C = {
  chalk: hex('#ECE9E2'), dim: hex('#6C7178'), steel: hex('#9AA9B8'), steel2: hex('#5E7186'), alu: hex('#C9D3DC'),
  white: hex('#FFF4E0'), yellow: hex('#FFD27A'), orange: hex('#FF8A2B'), hot: hex('#FF5A1F'), red: hex('#E8432B'),
  straw: hex('#F2E2A0'), gold: hex('#E8C368'), amber: hex('#E39B3C'), bronze: hex('#C97A43'), plum: hex('#B9668A'),
  violet: hex('#9468D2'), blue: hex('#4F7FE6'), ice: hex('#86BDF0'),
  copper: hex('#D9824B'), brass: hex('#D8B45A'), water: hex('#4FC3F7'), good: hex('#46E3A0'), bad: hex('#FF4D5E')
};

/** builder: draw(P, n) places points with P.*; `fill` = share of the cloud you get (the rest is dust) */
export function build(N, seed, draw, fill = .62) {
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), grp = new Float32Array(N), piv = new Float32Array(N * 4);
  const r = rng(seed); let i = 0;
  const g_ = () => gauss(r);
  const P = {
    r, g: g_,
    /** one point. c = [r,g,b] 0..1 · g = motion group · pv = [px,py,pz,speed] */
    pt(x, y, z, c, g = 0, pv) { if (i >= N) return; pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; const f = .78 + r() * .4; col[i * 3] = c[0] * f; col[i * 3 + 1] = c[1] * f; col[i * 3 + 2] = c[2] * f; grp[i] = g; if (pv) piv.set(pv, i * 4); i++; },
    /** straight stroke from (x1,y1) to (x2,y2); j = jitter (line softness) */
    seg(n, x1, y1, x2, y2, c, j = .02, g = 0, pv) { for (let q = 0; q < n; q++) { const t = r(); P.pt(x1 + (x2 - x1) * t + g_() * j, y1 + (y2 - y1) * t + g_() * j, g_() * j, c, g, pv); } },
    /** open polyline through pts [[x,y],…] (points spread by length) */
    line(n, pts, c, j = .02, g = 0, pv) { const L = []; let T = 0; for (let a = 0; a < pts.length - 1; a++) { const l = Math.hypot(pts[a + 1][0] - pts[a][0], pts[a + 1][1] - pts[a][1]); L.push(l); T += l; } pts.slice(0, -1).forEach((p, a) => P.seg(Math.round(n * L[a] / (T || 1)), p[0], p[1], pts[a + 1][0], pts[a + 1][1], c, j, g, pv)); },
    /** closed outline */
    outline(n, pts, c, j = .018, g = 0, pv) { P.line(n, [...pts, pts[0]], c, j, g, pv); },
    /** any parametric curve: f(t) → [x, y] or [x, y, z], t ∈ 0…1 */
    curve(n, f, c, j = .02, g = 0, pv) { for (let q = 0; q < n; q++) { const p = f(r()); P.pt(p[0] + g_() * j, p[1] + g_() * j, (p[2] || 0) + g_() * j, c, g, pv); } },
    arc(n, cx, cy, rad, a0, a1, c, j = .02, g = 0, pv) { for (let q = 0; q < n; q++) { const a = a0 + (a1 - a0) * r(); P.pt(cx + Math.cos(a) * rad + g_() * j, cy + Math.sin(a) * rad + g_() * j, g_() * j, c, g, pv); } },
    ring(n, cx, cy, rad, c, j = .02, g = 0, pv) { P.arc(n, cx, cy, rad, 0, Math.PI * 2, c, j, g, pv); },
    disc(n, cx, cy, rad, c, g = 0, pv) { for (let q = 0; q < n; q++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad; P.pt(cx + Math.cos(a) * d, cy + Math.sin(a) * d, g_() * .03, c, g, pv); } },
    rect(n, x, y, w, h, c, g = 0, pv) { for (let q = 0; q < n; q++) P.pt(x + r() * w, y + r() * h, g_() * .02, c, g, pv); },
    /** rectangle outline (x, y = bottom-left corner) */
    box(n, x, y, w, h, c, j = .015, g = 0, pv) { P.outline(n, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], c, j, g, pv); },
    /** fill any polygon (convex or not) */
    poly(n, pts, c, g = 0, pv) {
      const [x0, y0, x1, y1] = bounds(pts);
      let tries = 0; for (let q = 0; q < n && tries < n * 30; tries++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); if (inside(pts, x, y)) { P.pt(x, y, g_() * .02, c, g, pv); q++; } }
    },
    /** section hatching inside a polygon: parallel lines at `ang` degrees, `gap` apart (the drafting-room look, in light) */
    hatch(n, pts, c, ang = 45, gap = .18, g = 0, pv) {
      const [x0, y0, x1, y1] = bounds(pts); const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      let tries = 0; for (let q = 0; q < n && tries < n * 60; tries++) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); const d = -x * sa + y * ca; const m = ((d % gap) + gap) % gap; if (Math.min(m, gap - m) < .012 && inside(pts, x, y)) { P.pt(x, y, 0, c, g, pv); q++; } }
    },
    /** an arrow (a force): shaft + head at (x2,y2) */
    arrow(n, x1, y1, x2, y2, c, head = .28, g = 0, pv) {
      const a = Math.atan2(y2 - y1, x2 - x1); P.seg(Math.round(n * .7), x1, y1, x2, y2, c, .02, g, pv);
      [a + 2.6, a - 2.6].forEach(b => P.seg(Math.round(n * .15), x2, y2, x2 + Math.cos(b) * head, y2 + Math.sin(b) * head, c, .015, g, pv));
    },
    /** a gear that spins about Z: R = outer radius (tips), `teeth` count; set speed 0 for a still gear */
    gear(n, cx, cy, R, teeth, c, { speed = .45, depth = .2, hub = .3, spokes = 5, z = 0 } = {}) {
      const pv = speed ? [cx, cy, z, speed] : null, g = speed ? 6 : 0;
      const rim = th => { const u = (th / (Math.PI * 2) * teeth) % 1; const tooth = u < .45 ? 1 : u < .5 ? 1 - (u - .45) / .05 : u < .95 ? 0 : (u - .95) / .05; return R - depth * (1 - tooth); };
      for (let q = 0; q < n * .55; q++) { const th = r() * Math.PI * 2, rr = rim(th) - Math.abs(g_()) * .03; P.pt(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, z + g_() * .02, c, g, pv); }
      for (let q = 0; q < n * .15; q++) { const th = r() * Math.PI * 2, rr = R - depth - .12 + g_() * .015; P.pt(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, z, k(c, .7), g, pv); }
      for (let s = 0; s < spokes; s++) { const th = s / spokes * Math.PI * 2; for (let q = 0; q < n * .2 / spokes; q++) { const t = hub + r() * (R - depth - .12 - hub); P.pt(cx + Math.cos(th) * t + g_() * .02, cy + Math.sin(th) * t + g_() * .02, z, k(c, .8), g, pv); } }
      for (let q = 0; q < n * .1; q++) { const th = r() * Math.PI * 2; P.pt(cx + Math.cos(th) * hub, cy + Math.sin(th) * hub, z, c, g, pv); }
    },
    /** a surface of revolution: profile [[radius, along], …] — cups, cans, cones, domes, spun parts, tubes.
     *  axis 'y': stands upright (along = height); tilt (rad) leans it toward the viewer so the rim reads as an ellipse;
     *            speed ≠ 0 turns it about Y, but only when tilt = 0.
     *  axis 'x': lies along x, like work on a lathe (along = x offset); speed ≠ 0 spins it about its own axis (group 12). */
    lathe(n, prof, c, { axis = 'y', cx = 0, cy = 0, cz = 0, speed = 0, tilt = axis === 'y' ? .35 : 0, g = 0, shade = true } = {}) {
      const L = []; let T = 0; for (let a = 0; a < prof.length - 1; a++) { const l = Math.hypot(prof[a + 1][0] - prof[a][0], prof[a + 1][1] - prof[a][1]) * (prof[a][0] + prof[a + 1][0] + .2); L.push(l); T += l; }
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const spinX = axis === 'x' && speed, spinY = axis === 'y' && speed && !tilt;
      const pv = spinX || spinY ? [cx, cy, cz, speed] : null, gg = spinX ? 12 : g;
      for (let q = 0; q < n; q++) {
        let u = r() * T, a = 0; while (a < L.length - 1 && u > L[a]) { u -= L[a]; a++; } const t = L[a] ? u / L[a] : 0;
        const rad = prof[a][0] + (prof[a + 1][0] - prof[a][0]) * t, al = prof[a][1] + (prof[a + 1][1] - prof[a][1]) * t, th = r() * Math.PI * 2;
        const s1 = Math.cos(th) * rad, s2 = Math.sin(th) * rad; const lit = shade ? k(c, .55 + .45 * (s2 / (rad || 1) * .5 + .5)) : c;
        if (axis === 'x') P.pt(cx + al, cy + s1, cz + s2, lit, gg, pv);
        else { const yy = al * ct - s2 * st, zz = al * st + s2 * ct; P.pt(cx + s1, cy + yy, cz + zz, lit, gg, pv); }
      }
    },
    /** the surface of a 3D box (x, y, z = centre) */
    cuboid(n, x, y, z, w, h, d, c, g = 0, pv) {
      for (let q = 0; q < n; q++) { const f = Math.floor(r() * 6); let a = r() - .5, b = r() - .5, p; if (f < 2) p = [f ? .5 : -.5, a, b]; else if (f < 4) p = [a, f === 2 ? .5 : -.5, b]; else p = [a, b, f === 4 ? .5 : -.5]; P.pt(x + p[0] * w, y + p[1] * h, z + p[2] * d, k(c, .7 + (f === 4 ? .3 : f === 2 ? .2 : 0)), g, pv); }
    },
    /** text sampled from a canvas (fonts must be loaded): width = ink width in world units */
    text(n, str, font, width, c, c2, rtl = false, cy = 0, cx = 0, g = 0) { const T = textPoints(str, { font, width, rtl }); const m = T.length / 2; if (!m) return; for (let q = 0; q < n; q++) { const p = Math.floor(r() * m); const x = T[p * 2] + (r() - .5) * T.step, y = T[p * 2 + 1] + (r() - .5) * T.step; const t = c2 ? Math.min(1, Math.max(0, x / width + .5)) : 0; P.pt(x + cx, y + cy, g_() * .05, c2 ? mix(c, c2, t) : c, g); } },
    /** sparks: embers rising from (x, y) */
    sparks(n, x, y, spread, c = C.orange) { for (let q = 0; q < n; q++) P.pt(x + g_() * spread, y + g_() * spread * .4, g_() * .2, mix(c, C.white, r() * .5), 8); },
    get i() { return i; }
  };
  draw(P, Math.floor(N * fill));
  // dust: a deep faint shell (embers far away)
  for (; i < N; i++) { const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 7 + Math.pow(r(), .6) * 16, s = Math.sqrt(1 - u * u), f = .08 + r() * .2; pos[i * 3] = Math.cos(th) * s * rad; pos[i * 3 + 1] = u * rad * .62; pos[i * 3 + 2] = Math.min(1.5, Math.sin(th) * s * rad * .7 - 9); col[i * 3] = .86 * f; col[i * 3 + 1] = .74 * f; col[i * 3 + 2] = .66 * f; grp[i] = 4; }
  // shuffle, so particles travel varied paths between scenes
  const idx = Array.from({ length: N }, (_, q) => q); const rr = rng(seed + 99); for (let q = N - 1; q > 0; q--) { const j = Math.floor(rr() * (q + 1)); [idx[q], idx[j]] = [idx[j], idx[q]]; }
  const out = { N, pos: new Float32Array(N * 3), col: new Float32Array(N * 3), grp: new Float32Array(N), piv: new Float32Array(N * 4) };
  idx.forEach((s, d) => { out.pos.set(pos.subarray(s * 3, s * 3 + 3), d * 3); out.col.set(col.subarray(s * 3, s * 3 + 3), d * 3); out.grp[d] = grp[s]; out.piv.set(piv.subarray(s * 4, s * 4 + 4), d * 4); });
  return out;
}
function bounds(pts) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }); return [x0, y0, x1, y1]; }
export function inside(pts, x, y) { let o = false; for (let a = 0, b = pts.length - 1; a < pts.length; b = a++) { const [xa, ya] = pts[a], [xb, yb] = pts[b]; if ((ya > y) !== (yb > y) && x < (xb - xa) * (y - ya) / (yb - ya) + xa) o = !o; } return o; }
/** regular polygon / star points */
export const reg = (sides, rad, rot = -Math.PI / 2, cx = 0, cy = 0) => Array.from({ length: sides }, (_, q) => [cx + Math.cos(rot + q * Math.PI * 2 / sides) * rad, cy + Math.sin(rot + q * Math.PI * 2 / sides) * rad]);
export const starPts = (R, rr, n = 5, cx = 0, cy = 0) => Array.from({ length: n * 2 }, (_, q) => { const a = -Math.PI / 2 + q * Math.PI / n, d = q % 2 ? rr : R; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; });
export default { build, C, hex, k, mix, rng, gauss, inside, reg, starPts };
