// Immersive scenes — special: monolith (the boss: The Press) · nebula (raw stock, between things; also the fallback scene).
import { build, C, k, mix } from './kit.js';

const PI = Math.PI;
/* local helpers (this file is loaded by every build: keep it self-contained) */
const fit = (draw, t = .97) => (P, n) => { const pt0 = P.pt; let c = 0; P.pt = () => { c++; }; draw(P, n); P.pt = pt0; draw(P, n * Math.min(4, t * n / Math.max(1, c))); };
const D = { ox: .42, oy: .26, oz: -.8 };
function oline(P, n, pts, c, { z = 0, j = .01, g = 0 } = {}) {
  const ps = [...pts, pts[0]], L = [0]; for (let i = 1; i < ps.length; i++) L.push(L[i - 1] + Math.hypot(ps[i][0] - ps[i - 1][0], ps[i][1] - ps[i - 1][1]));
  const T = L[L.length - 1];
  for (let q = 0; q < n; q++) { const d = P.r() * T; let i = 1; while (i < L.length - 1 && L[i] < d) i++; const t = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); P.pt(ps[i - 1][0] + (ps[i][0] - ps[i - 1][0]) * t + P.g() * j, ps[i - 1][1] + (ps[i][1] - ps[i - 1][1]) * t + P.g() * j, z + P.g() * j, c, g); }
}
/** a heavy block: dim front fill, bright outline, its depth drawn back */
function block(P, n, pts, c, { g = 0, f = .2, fill = .45, back = .3 } = {}) {
  P.poly(Math.round(n * fill), pts, k(c, f), g);
  oline(P, Math.round(n * (1 - fill) * .6), pts, c, { g });
  oline(P, Math.round(n * (1 - fill) * .25), pts.map(([x, y]) => [x + D.ox, y + D.oy]), k(c, back), { z: D.oz, g });
  const m = Math.round(n * (1 - fill) * .15 / pts.length);
  pts.forEach(([x, y]) => { for (let q = 0; q < m; q++) { const t = P.r(); P.pt(x + D.ox * t, y + D.oy * t, D.oz * t, k(c, back), g); } });
}
const R = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
function glow(P, n, x, y, r, c, g = 0, sy = 1) { for (let q = 0; q < n; q++) { const a = P.r() * PI * 2, d = Math.pow(P.r(), 1.8) * r; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d * sy, P.g() * .05, mix(c, C.white, Math.max(0, .6 - d / r)), g); } }

export default N => ({
  /* The Press: a massive H-frame press. The ram slams down on a red-hot blank and forms it (10), lifts and leaves the next
     blank flat (11); the gauges on the crown swing to red, sparks burst from the die. Heavy, rhythmic, a little threatening. */
  monolith: () => build(N, 101, fit((P, n) => {
    const S = mix(C.steel, C.alu, .15), H = C.hot;
    // the frame: bed, two columns, crown with its cylinders
    block(P, n * .1, R(-3.4, -2.5, 6.8, .72), S);
    block(P, n * .09, R(-3.05, -1.78, .78, 3.45), S); block(P, n * .09, R(2.27, -1.78, .78, 3.45), S);
    block(P, n * .1, R(-3.4, 1.67, 6.8, .78), S);
    [-1.25, 1.25].forEach(x => block(P, n * .03, R(x - .42, 2.45, .84, .3), S));
    // bolts along the crown and the bed
    for (let b = 0; b < 12; b++) [[-3.15 + b * .573, 2.25], [-3.15 + b * .573, -1.95]].forEach(([x, y]) => P.ring(n * .002, x, y, .045, k(C.chalk, .7), .006));
    // tie rods inside the columns
    [-2.66, 2.66].forEach(x => P.seg(n * .015, x, -1.75, x, 1.65, k(C.steel, .55), .012));
    // the gauges on the crown: needles low (11) · in the red (10) — the press looks back at you
    [-2.0, 2.0].forEach(x => { const y = 2.06; P.ring(n * .012, x, y, .26, C.chalk, .008); P.arc(n * .008, x, y, .2, -.2, .9, C.red, .02);
      P.seg(n * .004, x, y, x + Math.cos(2.5) * .2, y + Math.sin(2.5) * .2, C.chalk, .006, 11); P.seg(n * .005, x, y, x + Math.cos(.15) * .21, y + Math.sin(.15) * .21, C.red, .008, 10); glow(P, n * .006, x, y, .3, C.red, 10); });
    // the ram (7): piston rods up into the crown, the slide with hazard stripes, the upper die with its dome
    [-1.25, 1.25].forEach(x => { P.rect(n * .02, x - .16, .9, .32, .8, k(C.alu, .55), 7); P.seg(n * .006, x - .16, .9, x - .16, 1.7, C.alu, .008, 7); P.seg(n * .006, x + .16, .9, x + .16, 1.7, C.alu, .008, 7); });
    block(P, n * .1, R(-2.15, -.2, 4.3, 1.1), mix(S, H, .3), { g: 7, f: .16 });
    for (let s = 0; s < 9; s++) { const x0 = -2.05 + s * .48; P.poly(n * .014, [[x0, -.15], [x0 + .2, -.15], [x0 + .5, .85], [x0 + .3, .85]].map(([x, y]) => [Math.max(-2.12, Math.min(2.12, x)), y]), s % 2 ? C.orange : H, 7); }
    const dome = Array.from({ length: 25 }, (_, q) => { const u = -1 + q / 12; return [u * .95, -1.0 - .38 * Math.cos(u * PI / 2)]; });
    block(P, n * .08, [[-1.0, -.2], [-1.0, -1.0], ...dome.slice(1, -1), [1.0, -1.0], [1.0, -.2]], C.alu, { g: 7, f: .36 });
    for (let q = 0; q < n * .02; q++) { const [x, y] = dome[Math.floor(P.r() * dome.length)]; P.pt(x + P.g() * .03, y + P.g() * .01, 0, mix(C.orange, C.yellow, P.r()), 7); }
    // the lower die on the bed, its cavity, and the hot pit glow under it
    const cav = Array.from({ length: 25 }, (_, q) => { const u = 1 - q / 12; return [u * 1.05, -1.1 - .38 * Math.cos(u * PI / 2)]; });
    block(P, n * .08, [[-1.5, -1.78], [1.5, -1.78], [1.5, -1.1], ...cav, [-1.5, -1.1]], C.steel, { f: .32 });
    glow(P, n * .04, 0, -1.9, 2.0, C.red, 0, .25);
    // the furnace light from below catches the inner edges of the columns
    [-2.27, 2.27].forEach(x => { for (let q = 0; q < n * .02; q++) { const y = -1.78 + Math.pow(P.r(), 1.6) * 2.6; P.pt(x + P.g() * .01, y, 0, mix(C.orange, C.red, (y + 1.78) / 2.6), 0); } });
    // the blank: flat and red-hot on the die (11) · formed into the dish, white where it was struck (10)
    for (let q = 0; q < n * .05; q++) { const x = -1.35 + P.r() * 2.7, y = -1.1 + P.r() * .1; P.pt(x, y, P.g() * .03, mix(C.hot, C.orange, P.r()), 11); }
    for (let q = 0; q < n * .015; q++) { const x = -1.35 + P.r() * 2.7; P.pt(x, -1.0, 0, C.yellow, 11); }
    for (let q = 0; q < n * .06; q++) { const u = -1.3 + P.r() * 2.6, y0 = Math.abs(u) < 1.0 ? -1.1 - .38 * Math.cos(u / 1.05 * PI / 2) : -1.1; P.pt(u, y0 + P.r() * .1, P.g() * .03, mix(C.yellow, C.white, Math.max(0, 1 - Math.abs(u))), 10); }
    // the blow: a flash along the contact, shock lines out to the columns, sparks bursting
    for (let q = 0; q < n * .03; q++) { const sg = P.r() < .5 ? -1 : 1, x = sg * (1.2 + P.r() * 1.0), y = -1.05 + P.g() * .05; P.pt(x, y, 0, mix(C.white, C.yellow, P.r()), 10); }
    for (let l = 0; l < 4; l++) { const y = -1.3 + l * .12; [-1, 1].forEach(sg => P.seg(n * .004, sg * 1.25, y, sg * (1.6 + l * .15), y + (l - 1.5) * .05, k(C.yellow, .8), .006, 10)); }
    glow(P, n * .03, 0, -1.05, 1.3, C.yellow, 10, .3);
    P.sparks(n * .08, 0, -1.0, .6, C.orange);
    // the warning lamp on top: on while the ram is down
    glow(P, n * .01, 0, 2.62, .25, C.red, 10); P.ring(n * .004, 0, 2.62, .1, k(C.red, .6), .006);
  }), .66),

  /* raw stock: a slow vortex of embers — a hot core cooling through the temper colours to blue at the rim; a few bars and
     sheets of stock drift in its arms; a few embers rise */
  nebula: () => build(N, 102, fit((P, n) => {
    const pv = [0, 0, 0, .05], temper = [C.white, C.yellow, C.orange, C.hot, C.plum, C.violet, C.blue, C.ice];
    { const pt = P.pt; P.pt = (x, y, z, c, g, p) => pt(x * .84, y * .84, z, c, g, p); }
    const tc = r => { const u = Math.min(.999, r / 3.1) * (temper.length - 1), i = Math.floor(u); return mix(temper[i], temper[i + 1], u - i); };
    // three arms (log spirals) and the haze between them
    for (let q = 0; q < n * .55; q++) {
      const arm = Math.floor(P.r() * 3), r = .15 + Math.pow(P.r(), .8) * 3.0, th = arm * PI * 2 / 3 + Math.log(r / .15) / .32 + P.g() * (.18 + .1 * r);
      P.pt(Math.cos(th) * r + P.g() * .05 * r, Math.sin(th) * r + P.g() * .05 * r, P.g() * (.12 + .1 * r), k(tc(r), .28 + .35 * (1 - r / 3.2) + .1 * P.r()), 6, pv);
    }
    for (let q = 0; q < n * .28; q++) { const r = Math.pow(P.r(), .6) * 3.3, th = P.r() * PI * 2; P.pt(Math.cos(th) * r, Math.sin(th) * r, P.g() * .3, k(tc(r), .12 + .12 * P.r()), 6, pv); }
    // the core
    for (let q = 0; q < n * .08; q++) { const r = Math.abs(P.g()) * .22, th = P.r() * PI * 2; P.pt(Math.cos(th) * r, Math.sin(th) * r * .85, P.g() * .05, mix(C.white, C.yellow, r * 4), 6, pv); }
    // raw stock drifting in the arms: short bars and plates (dim outlines)
    for (let b = 0; b < 11; b++) { const r = .9 + b * .2, th = (b % 3) * PI * 2 / 3 + Math.log(r / .15) / .32 + .25, cx = Math.cos(th) * r, cy = Math.sin(th) * r, a = th + PI / 2 + (b % 2) * .4, w = b % 3 ? .34 : .22, h = b % 3 ? .07 : .16;
      for (let q = 0; q < n * .004; q++) { const t = P.r() * 2 * (w + h); let u, v; if (t < w) { u = t; v = 0; } else if (t < w + h) { u = w; v = t - w; } else if (t < 2 * w + h) { u = 2 * w + h - t; v = h; } else { u = 0; v = 2 * (w + h) - t; } u -= w / 2; v -= h / 2; P.pt(cx + u * Math.cos(a) - v * Math.sin(a), cy + u * Math.sin(a) + v * Math.cos(a), 0, k(C.chalk, .45), 6, pv); } }
    // embers rising off it
    P.sparks(n * .04, 0, -.2, 1.0, C.orange);
  }), .56)
});
