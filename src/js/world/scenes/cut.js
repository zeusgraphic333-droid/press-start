// Immersive scenes — cut (names and captions: info.js · SCENES_BY_ZONE.cut; what to draw: docs/SCENES.md; how: STYLE.md).
// Lecture 5: cutting. Press cuts are performed with the ram clock: 7 = punch / blade, 10 = what the stroke leaves (ram down),
// 11 = the sheet before (ram up). Where holes and shapes must be seen, the work is shown from above in a tilted 3D view.
import { build, C, k, mix, inside } from './kit.js';

const PI = Math.PI, IC = C.ice;
/* ---------------- local helpers ---------------- */
const fit = (draw, t = .97) => (P, n) => { const pt0 = P.pt; let c = 0; P.pt = () => { c++; }; draw(P, n); P.pt = pt0; draw(P, n * Math.min(4, t * n / Math.max(1, c))); };
function zoom(P, s, ox = 0, oy = 0) { const pt = P.pt; P.pt = (x, y, z, c, g, pv) => pt(x * s + ox, y * s + oy, z * s, c, g, pv ? [pv[0] * s + ox, pv[1] * s + oy, pv[2] * s, pv[3]] : pv); }
function glow(P, n, x, y, r, c, g = 0, sy = 1, z = 0) { for (let q = 0; q < n; q++) { const a = P.r() * PI * 2, d = Math.pow(P.r(), 1.8) * r; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d * sy, z + P.g() * .05, mix(c, C.white, Math.max(0, .6 - d / r)), g); } }
function path(x, y, a, cmds, step = .03) {
  const pts = [[x, y]];
  for (const [kind, p, q] of cmds) {
    if (kind === 'L') { const m = Math.max(1, Math.ceil(p / step)); for (let i = 1; i <= m; i++) pts.push([x + Math.cos(a) * p * i / m, y + Math.sin(a) * p * i / m]); x += Math.cos(a) * p; y += Math.sin(a) * p; }
    else { const sg = Math.sign(q) || 1, cx = x + Math.cos(a + sg * PI / 2) * p, cy = y + Math.sin(a + sg * PI / 2) * p, a0 = Math.atan2(y - cy, x - cx), m = Math.max(2, Math.ceil(Math.abs(q) * p / step)); for (let i = 1; i <= m; i++) { const t = a0 + q * i / m; pts.push([cx + Math.cos(t) * p, cy + Math.sin(t) * p]); } x = cx + Math.cos(a0 + q) * p; y = cy + Math.sin(a0 + q) * p; a += q; }
  }
  return pts;
}
function walker(pts) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1] || 1e-6;
  const at = d => { d = Math.max(0, Math.min(T, d)); let lo = 0, hi = L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= d) lo = m; else hi = m; } const A = pts[lo], B = pts[hi], l = (L[hi] - L[lo]) || 1e-6, t = (d - L[lo]) / l; return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, -(B[1] - A[1]) / l, (B[0] - A[0]) / l]; };
  return { at, T };
}
function band(P, n, pts, th, col, { g = 0, pv, edge = .45, j = .007 } = {}) {
  const { at, T } = walker(pts); const cf = typeof col === 'function' ? col : (s, u, e) => e ? mix(col, C.white, .12) : k(col, .55);
  for (let q = 0; q < n; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), e = P.r() < edge, s = e ? (P.r() < .5 ? -1 : 1) : P.r() * 2 - 1, h = s * th / 2; P.pt(x + nx * h + P.g() * j, y + ny * h + P.g() * j, P.g() * j, cf(s, d / T, e), g, pv); }
}
const DS = { ox: .3, oy: .19, oz: -.5 };
function face(P, n, pts, th, side, c, { D = DS, g = 0, pv, edge = .3 } = {}) {
  const { at, T } = walker(pts);
  for (let q = 0; q < n; q++) { const d = P.r() * T, [x, y, nx, ny] = at(d), e = P.r() < edge, w = e ? 1 : P.r(), h = side * th / 2; P.pt(x + nx * h + D.ox * w + P.g() * .006, y + ny * h + D.oy * w + P.g() * .006, D.oz * w, e ? k(c, .7) : k(c, .3), g, pv); }
}
function sheet(P, n, pts, th, col, o = {}) { const { side = 1, f = .3 } = o; band(P, n * (1 - f), pts, th, col, o); face(P, n * f, pts, th, side, col, o); }
function dash(P, n, pts, c, { on = .1, per = .17, j = .009, g = 0, pv, z = 0 } = {}) {
  const { at, T } = walker(pts); let q = 0, tries = 0;
  while (q < n && tries++ < n * 8) { const d = P.r() * T; if (d % per > on) continue; const [x, y] = at(d); P.pt(x + P.g() * j, y + P.g() * j, z + P.g() * j, c, g, pv); q++; }
}
function oline(P, n, pts, c, { z = 0, closed = true, j = .009, g = 0, pv } = {}) {
  const ps = closed ? [...pts, pts[0]] : pts; const { at, T } = walker(ps);
  for (let q = 0; q < n; q++) { const [x, y] = at(P.r() * T); P.pt(x + P.g() * j, y + P.g() * j, z + P.g() * j, c, g, pv); }
}
function prism(P, n, pts, c, { D = DS, g = 0, pv, f = .34, fill = .5, back = .34 } = {}) {
  P.poly(Math.round(n * fill), pts, k(c, f), g, pv);
  oline(P, Math.round(n * (1 - fill) * .62), pts, c, { g, pv });
  oline(P, Math.round(n * (1 - fill) * .26), pts.map(([x, y]) => [x + D.ox, y + D.oy]), k(c, back), { z: D.oz, g, pv });
  const m = Math.round(n * (1 - fill) * .12 / pts.length);
  pts.forEach(([x, y]) => { for (let q = 0; q < m; q++) { const t = P.r(); P.pt(x + D.ox * t, y + D.oy * t, D.oz * t, k(c, back), g, pv); } });
}
const rectP = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const arrowDown = (P, n, x, y1, y2, c, g = 0) => P.arrow(n, x, y1, x, y2, c, .2, g);
const circP = (cx, cy, r, m = 40, sx = 1) => Array.from({ length: m }, (_, q) => [cx + Math.cos(q / m * PI * 2) * r * sx, cy + Math.sin(q / m * PI * 2) * r]);

/* ---- a tilted 3D view (looking down at the work from the front): object X right, Y up, Z toward the viewer ---- */
function view(a = .42, ox = 0, oy = 0) { const ca = Math.cos(a), sa = Math.sin(a); return (X, Y, Z) => [X + ox, Y * ca - Z * sa + oy, Y * sa + Z * ca]; }
/** a horizontal plate (top at Y, thickness t) whose outline in the X–Z plane is `poly`, minus holes (hole(X, Z) → true) */
function plate(P, n, v, poly, Y, t, c, { g = 0, hole, edgeC, fill = .45 } = {}) {
  const [x0, z0, x1, z1] = poly.reduce(([a, b, cc, d], [x, z]) => [Math.min(a, x), Math.min(b, z), Math.max(cc, x), Math.max(d, z)], [1e9, 1e9, -1e9, -1e9]);
  let q = 0, tr = 0; while (q < n * fill && tr++ < n * 40) { const X = x0 + P.r() * (x1 - x0), Z = z0 + P.r() * (z1 - z0); if (!inside(poly, X, Z) || (hole && hole(X, Z))) continue; const [x, y, z] = v(X, Y, Z); P.pt(x, y, z, k(c, .26 + .14 * (Z - z0) / (z1 - z0 || 1)), g); q++; }
  const { at, T } = walker([...poly, poly[0]]); const ec = edgeC || c;
  for (let w = 0; w < n * (1 - fill) * .7; w++) { const [X, Z] = at(P.r() * T); const [x, y, z] = v(X, Y, Z); P.pt(x + P.g() * .007, y + P.g() * .007, z, ec, g); }
  for (let w = 0, tr2 = 0; w < n * (1 - fill) * .3 && tr2++ < n * 20; ) { const [X, Z] = at(P.r() * T); if (Z > z1 - .03) { const [x, y, z] = v(X, Y - P.r() * t, Z); P.pt(x, y, z, k(ec, .55), g); w++; } }
}
/** a vertical cylinder in the tilted view: axis at (X, Z), radius r, from Y0 to Y1 */
function cyl3(P, n, v, X, Z, r, Y0, Y1, c, { g = 0, cap = true, top = true, sil = false, rimC } = {}) {
  for (let q = 0; q < n * .55; q++) { const a = P.r() * PI * 2, Y = Y0 + P.r() * (Y1 - Y0), [x, y, z] = v(X + Math.cos(a) * r, Y, Z + Math.sin(a) * r); P.pt(x, y, z, k(c, .3 + .45 * Math.max(0, Math.sin(a))), g); }
  (top ? [Y0, Y1] : [Y0]).forEach((Y, i) => { for (let q = 0; q < n * .17; q++) { const a = P.r() * PI * 2, [x, y, z] = v(X + Math.cos(a) * r, Y, Z + Math.sin(a) * r); P.pt(x, y, z, i === 0 && rimC ? rimC : c, g); } });
  if (cap && top) for (let q = 0; q < n * .11; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * r, [x, y, z] = v(X + Math.cos(a) * d, Y1, Z + Math.sin(a) * d); P.pt(x, y, z, k(c, .3), g); }
  if (sil) [-1, 1].forEach(sg => { for (let q = 0; q < n * .08; q++) { const [x, y, z] = v(X + sg * r, Y0 + P.r() * (Y1 - Y0), Z); P.pt(x + P.g() * .006, y, z, c, g); } });
}
/** a box in the tilted view (visible faces lit, all edges drawn) */
function box3(P, n, v, x0, x1, y0, y1, z0, z1, c, { g = 0, topHole } = {}) {
  const put = (X, Y, Z, cc) => { const [x, y, z] = v(X, Y, Z); P.pt(x, y, z, cc, g); };
  for (let q = 0; q < n * .3; q++) { const X = x0 + P.r() * (x1 - x0), Z = z0 + P.r() * (z1 - z0); if (topHole && topHole(X, Z)) continue; put(X, y1, Z, k(c, .3)); }
  for (let q = 0; q < n * .25; q++) put(x0 + P.r() * (x1 - x0), y0 + P.r() * (y1 - y0), z1, k(c, .24));
  const E = [[[x0, y1, z1], [x1, y1, z1]], [[x0, y0, z1], [x1, y0, z1]], [[x0, y0, z1], [x0, y1, z1]], [[x1, y0, z1], [x1, y1, z1]], [[x0, y1, z0], [x1, y1, z0]], [[x0, y1, z0], [x0, y1, z1]], [[x1, y1, z0], [x1, y1, z1]], [[x1, y0, z0], [x1, y1, z0]], [[x0, y0, z0], [x0, y1, z0]], [[x0, y0, z0], [x1, y0, z0]], [[x0, y0, z0], [x0, y0, z1]], [[x1, y0, z0], [x1, y0, z1]]];
  E.forEach(([a, b], i) => { const cc = i < 7 ? c : k(c, .35); for (let q = 0; q < n * .45 / 12; q++) { const t = P.r(); put(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, cc); } });
}

/* ---------------- the scenes ---------------- */
export default N => {
  const B = (seed, draw, fill) => () => build(N, seed, fit(draw), fill);
  return {
    /* the four families: punching & shearing · chip forming · nonchip forming · thermal (flame) cutting, each working */
    cutTree: B(902, (P, n) => {
      P.rect(n * .03, -1.0, 1.75, 2.0, .46, k(IC, .22)); P.box(n * .025, -1.0, 1.75, 2.0, .46, C.chalk);
      P.seg(n * .008, 0, 1.75, 0, 1.42, k(C.chalk, .7)); P.seg(n * .03, -2.7, 1.42, 2.7, 1.42, k(C.chalk, .7));
      const X = [-2.7, -.9, .9, 2.7]; X.forEach(x => P.seg(n * .006, x, 1.42, x, 1.05, k(C.chalk, .7)));
      // punching & shearing
      { const x = X[0]; prism(P, n * .05, [[x - .7, -1.9], [x - .2, -1.9], [x - .2, -1.0], [x - .7, -1.0]], C.steel); prism(P, n * .05, [[x + .2, -1.9], [x + .7, -1.9], [x + .7, -1.0], [x + .2, -1.0]], C.steel);
        sheet(P, n * .02, path(x - .75, -.97, 0, [['L', .55]]), .06, IC); sheet(P, n * .02, path(x + .2, -.97, 0, [['L', .55]]), .06, IC); sheet(P, n * .008, path(x - .2, -.97, 0, [['L', .4]]), .06, IC, { g: 11 });
        prism(P, n * .04, rectP(x - .18, -1.0, .36, 1.6), C.alu, { g: 7 }); P.rect(n * .012, x - .18, -1.25, .36, .06, C.yellow, 10); glow(P, n * .01, x, -.97, .3, C.orange, 10, .4); }
      // chip forming: a cutter turning, chips flying
      { const x = X[1]; P.gear(n * .09, x, -.35, .55, 12, C.steel, { speed: 1.2, depth: .12, hub: .12, spokes: 4 }); prism(P, n * .05, rectP(x - .75, -1.9, 1.5, .98), mix(IC, C.steel, .4)); P.sparks(n * .03, x + .35, -.9, .12, C.orange); glow(P, n * .01, x + .3, -.9, .15, C.yellow); }
      // nonchip: a part in a chemical bath, bubbles rising
      { const x = X[2]; oline(P, n * .03, [[x - .7, -.2], [x - .7, -1.9], [x + .7, -1.9], [x + .7, -.2]], C.chalk, { closed: false }); P.rect(n * .05, x - .68, -1.88, 1.36, 1.3, k(C.good, .2)); P.seg(n * .01, x - .68, -.58, x + .68, -.58, k(C.good, .8), .01);
        prism(P, n * .03, rectP(x - .4, -1.6, .8, .55), C.steel); for (let q = 0; q < n * .03; q++) P.pt(x + (P.r() - .5) * .8, -1.55 + P.g() * .05, P.g() * .1, mix(C.good, C.white, .4), 8); }
      // thermal: a torch, a flame, the kerf glowing, sparks
      { const x = X[3]; prism(P, n * .04, [[x - .16, .3], [x + .16, .3], [x + .1, -.5], [x - .1, -.5]], C.steel); P.poly(n * .03, [[x - .07, -.52], [x + .07, -.52], [x, -.98]], k(C.water, .8)); P.poly(n * .02, [[x - .04, -.52], [x + .04, -.52], [x, -.8]], C.white);
        prism(P, n * .04, rectP(x - .75, -1.25, .7, .25), mix(IC, C.steel, .4)); prism(P, n * .04, rectP(x + .05, -1.25, .7, .25), mix(IC, C.steel, .4)); glow(P, n * .02, x, -1.12, .2, C.yellow, 0, 1.5); P.sparks(n * .03, x, -1.0, .1, C.orange); }
    }),

    /* machining: a milling cutter turning takes one precise cut (the finished face is lower and true); chips fly */
    machining: B(903, (P, n) => {
      const cx = .2, cy = .55, R = 1.35, y1 = -.65, y2 = -.95;
      P.gear(n * .36, cx, cy, R, 16, mix(C.steel, IC, .25), { speed: -1.4, depth: .2, hub: .25, spokes: 6 });
      P.ring(n * .03, cx, cy, .1, C.chalk, .008);
      // the work: uncut on the left (higher), finished on the right (lower and true)
      const work = [[-3.4, -2.0], [3.4, -2.0], [3.4, y2], [cx + .4, y2], [cx - .05, y1 + .02], [-3.4, y1]];
      prism(P, n * .18, work, mix(C.steel, IC, .5), { f: .3 });
      for (let q = 0; q < n * .04; q++) P.pt(-3.4 + P.r() * 3.5, y1 + .015 * Math.sin(P.r() * 40), 0, k(C.chalk, .6), 0);
      P.seg(n * .04, cx + .4, y2, 3.4, y2, C.white, .006); P.seg(n * .015, cx + .4, y2 - .1, 3.4, y2 - .1, k(C.good, .6), .004);
      // chips and heat at the cut
      glow(P, n * .04, cx - .1, y1 + .05, .3, C.yellow);
      P.sparks(n * .07, cx - .3, y1 + .15, .2, C.orange);
      P.arrow(n * .015, 2.6, -1.45, 1.6, -1.45, k(C.chalk, .7), .14);
    }, .64),

    /* thermal cutting: gas · laser · plasma heads, each with its own beam, each leaving a glowing kerf and sparks */
    thermal: B(904, (P, n) => {
      const yt = -.75, yb = -1.15, X = [-2.4, 0, 2.4];
      // the plate, cut through under each head
      let x0 = -3.5; X.forEach(x => { prism(P, n * .06, rectP(x0, yb, x - .06 - x0, yt - yb), mix(C.steel, IC, .45)); x0 = x + .06; }); prism(P, n * .06, rectP(x0, yb, 3.5 - x0, yt - yb), mix(C.steel, IC, .45));
      X.forEach(x => { P.seg(n * .015, x - .06, yt, x - .06, yb, C.yellow, .01); P.seg(n * .015, x + .06, yt, x + .06, yb, C.yellow, .01); glow(P, n * .02, x, yt, .25, C.orange, 0, .6); P.sparks(n * .045, x, yt + .05, .14, C.orange); for (let q = 0; q < n * .01; q++) P.pt(x + P.g() * .04, yb - P.r() * .5, 0, mix(C.orange, C.red, P.r()), 0); });
      // gas: a torch nozzle and its flame (blue cone, orange tip)
      { const x = X[0]; prism(P, n * .06, [[x - .3, 1.6], [x + .3, 1.6], [x + .3, .55], [x + .14, .1], [x - .14, .1], [x - .3, .55]], C.steel);
        P.poly(n * .04, [[x - .11, .08], [x + .11, .08], [x, yt + .05]], k(C.water, .75)); P.poly(n * .02, [[x - .05, .08], [x + .05, .08], [x, -.2]], C.white); }
      // laser: a head and a thin, intense beam
      { const x = X[1]; prism(P, n * .06, rectP(x - .32, .5, .64, 1.1), C.alu); P.poly(n * .02, [[x - .2, .5], [x + .2, .5], [x, .25]], k(C.alu, .8));
        P.seg(n * .05, x, .25, x, yt, C.white, .008); P.seg(n * .03, x, .25, x, yt, C.red, .03); }
      // plasma: a torch and a wavering arc
      { const x = X[2]; prism(P, n * .06, [[x - .3, 1.6], [x + .3, 1.6], [x + .3, .5], [x + .18, .15], [x - .18, .15], [x - .3, .5]], mix(C.steel, C.violet, .3));
        P.curve(n * .05, t => [x + .05 * Math.sin(t * 19), .15 + (yt - .15) * t], mix(C.violet, C.white, .5), .02); P.curve(n * .02, t => [x + .12 * Math.sin(t * 11 + 1), .15 + (yt - .15) * t], k(C.violet, .8), .03); }
    }, .64),

    /* shearing: the upper blade comes down past the lower blade and cuts the sheet to size (10 cut · 11 whole) */
    shearing: B(905, (P, n) => {
      const ys = -.4, th = .1;
      prism(P, n * .14, [[-3.2, -1.7], [0, -1.7], [0, ys - .35], [-.4, ys - .35], [-.4, ys], [-3.2, ys]], mix(C.steel2, IC, .2));
      prism(P, n * .05, rectP(-.4, ys - .35, .4, .35), C.alu, { f: .45 });
      sheet(P, n * .08, path(-3.1, ys + th / 2, 0, [['L', 3.1]]), th, IC);
      sheet(P, n * .05, path(0, ys + th / 2, 0, [['L', 1.5]]), th, IC, { g: 11 });
      sheet(P, n * .05, path(.04, ys - .2, -.16, [['L', 1.5]]), th, mix(IC, C.orange, .2), { g: 10 });
      // the hold-down clamps the sheet; the upper blade (with its rake) is drawn at the bottom of its stroke
      prism(P, n * .06, rectP(-1.8, ys + th, 1.1, .7), mix(C.steel, IC, .3));
      prism(P, n * .12, [[.03, ys - .12], [.9, ys + .05], [.9, 2.0], [.03, 2.0]], C.alu, { g: 7, f: .42 });
      arrowDown(P, n * .025, .5, 2.6, 2.1, C.orange, 7);
      glow(P, n * .03, .02, ys + .03, .25, C.yellow, 10); P.sparks(n * .03, .05, ys + .05, .1, C.orange);
    }, .64),

    /* clearance: the same punch, three gaps — too small (the cracks miss: double burnish, more force) · right (they meet) ·
       too large (the metal is pinched and bent into the gap) */
    clearance: B(906, (P, n) => {
      const th = .32, top = -.3, bot = top - th, pw = .45;
      [[-2.45, .025, 1.4], [0, .14, 1.0], [2.45, .42, 1.0]].forEach(([x, c, force], i) => {
        const dl = x - pw - c, dr = x + pw + c;
        prism(P, n * .06, rectP(x - 1.15, -1.7, dl - (x - 1.15), bot + 1.7), C.steel); prism(P, n * .06, rectP(dr, -1.7, x + 1.15 - dr, bot + 1.7), C.steel);
        // the sheet: whole (11) · being cut (10)
        P.rect(n * .05, x - 1.15, bot, 2.3, th, k(IC, .45), 11); P.box(n * .015, x - 1.15, bot, 2.3, th, IC, .01, 11);
        P.rect(n * .05, x - 1.15, bot, 2.3, th, k(IC, .4), 10); P.box(n * .012, x - 1.15, bot, 2.3, th, IC, .01, 10);
        const crackC = i === 1 ? C.good : C.hot;
        if (i === 0) { [-1, 1].forEach(sg => { P.seg(n * .008, x + sg * pw, top, x + sg * (pw + .01), top - th * .75, crackC, .006, 10); P.seg(n * .008, x + sg * (pw + c), bot, x + sg * (pw + c - .01), bot + th * .75, crackC, .006, 10); }); }
        if (i === 1) [-1, 1].forEach(sg => P.seg(n * .014, x + sg * pw, top, x + sg * (pw + c), bot, crackC, .006, 10));
        if (i === 2) [-1, 1].forEach(sg => { const pts = Array.from({ length: 20 }, (_, q) => { const t = q / 19; return [x + sg * (pw + c * t), top - th * .5 - .22 * Math.sin(t * PI) * (1 - t * .3)]; }); P.line(n * .014, pts, C.orange, .02, 10); P.seg(n * .006, x + sg * (pw + c * .6), bot - .18, x + sg * (pw + c), bot, crackC, .006, 10); });
        // the punch (7), a little into the sheet at the bottom of its stroke
        prism(P, n * .07, rectP(x - pw, top - .1, 2 * pw, 2.1), C.alu, { g: 7, f: .42 });
        P.arrow(n * .012 * force, x, 2.55, x, 2.05, C.orange, .14 + .06 * (force - 1), 7);
        if (i === 0) { P.arrow(n * .012, x - .14, 2.55, x - .14, 2.05, C.orange, .14, 7); P.arrow(n * .012, x + .14, 2.55, x + .14, 2.05, C.orange, .14, 7); }
        glow(P, n * .01, x - pw, top, .14, C.yellow, 10); glow(P, n * .01, x + pw, top, .14, C.yellow, 10);
        // the gap, marked under the die edge
        P.seg(n * .006, dl, -1.85, dl, -2.05, k(C.chalk, .7), .005); P.seg(n * .006, x - pw, -1.85, x - pw, -2.05, k(C.chalk, .7), .005); P.seg(n * .004, x - pw, -1.95, dl, -1.95, C.yellow, .005);
      });
    }, .64),

    /* ★ punch & die: the punch (convex, male) drives through the sheet into the die (concave, female); the slug drops out */
    punchDie: B(901, (P, n) => {
      const v = view(.42, 0, -.15), R = .62, Rh = .68, st = .13, Ys = -.35;
      // the die: a block with a hole through it (female), its top face and the hole's wall
      box3(P, n * .2, v, -2.5, 2.5, -1.45, Ys, -1.3, 1.3, mix(C.steel, C.alu, .3), { topHole: (X, Z) => X * X + Z * Z < Rh * Rh });
      for (let q = 0; q < n * .04; q++) { const a = P.r() * PI * 2, Y = Ys - P.r() * 1.1, [x, y, z] = v(Math.cos(a) * Rh, Y, Math.sin(a) * Rh); P.pt(x, y, z, k(C.steel, .2 + .3 * Math.max(0, -Math.sin(a))), 0); }
      for (let q = 0; q < n * .025; q++) { const a = P.r() * PI * 2, [x, y, z] = v(Math.cos(a) * Rh, Ys + .002, Math.sin(a) * Rh); P.pt(x, y, z, C.alu, 0); }
      // the sheet on the die, the hole in it — and while the punch is up, the disc that is still there
      plate(P, n * .24, v, [[-3.2, -1.7], [3.2, -1.7], [3.2, 1.7], [-3.2, 1.7]], Ys + st, st, mix(IC, C.white, .15), { hole: (X, Z) => X * X + Z * Z < R * R, edgeC: mix(IC, C.white, .3), fill: .55 });
      plate(P, n * .035, v, circP(0, 0, R, 48), Ys + st, st, mix(IC, C.white, .15), { g: 11, edgeC: mix(IC, C.white, .3) });
      // the punch (male, convex) — drawn at the bottom of its stroke, its cutting edge white-hot
      cyl3(P, n * .3, v, 0, 0, R - .02, Ys - .05, 2.0, mix(C.alu, C.steel, .3), { g: 7, rimC: C.white, top: false, sil: true });
      box3(P, n * .1, v, -1.15, 1.15, 2.0, 2.5, -.85, .85, C.steel, { g: 7 });
      { const [x, y, z] = v(0, 3.05, 0); P.arrow(n * .02, x, y, x, y - .5, C.orange, .2, 7); void z; }
      // the slug: pushed into the die (10) · a moment later falling out underneath (11); the earlier ones in the bin
      const slug = (Y, g, c) => { for (let q = 0; q < n * .03; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * (R - .03), rim = P.r() < .35, [x, y, z] = v(Math.cos(a) * (rim ? R - .03 : d), Y - (rim ? P.r() * st : 0), Math.sin(a) * (rim ? R - .03 : d)); P.pt(x, y, z, rim ? C.white : c, g); } };
      slug(Ys - .1, 10, mix(C.yellow, C.orange, .4)); slug(-1.8, 11, k(C.orange, .8));
      for (let s = 0; s < 4; s++) { for (let q = 0; q < n * .006; q++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * .55, [x, y, z] = v(-.6 + s * .4 + Math.cos(a) * d, -2.1 + (s % 2) * .05, .5 + Math.sin(a) * d * .5); P.pt(x, y, z, k(C.orange, .5), 0); } }
      // the cut: a white ring of contact while it is down, and sparks
      for (let q = 0; q < n * .04; q++) { const a = P.r() * PI * 2, [x, y, z] = v(Math.cos(a) * R, Ys + st * .5, Math.sin(a) * R); P.pt(x + P.g() * .015, y + P.g() * .015, z, mix(C.yellow, C.white, P.r()), 10); }
      for (let q = 0; q < n * .06; q++) { const a = (P.r() < .5 ? 0 : PI) + P.g() * .35, d = R + .08 + Math.abs(P.g()) * .4, [x, y, z] = v(Math.cos(a) * d, Ys + st, Math.sin(a) * d); P.pt(x, y + P.g() * .03, z, mix(C.orange, C.white, P.r() * .5), 8); }
    }, .68),

    /* punching vs blanking: the same cut, two answers — punching keeps the sheet with the hole (the slug is waste);
       blanking keeps the blank (the sheet is waste). 11 whole · 10 cut apart */
    punchVsBlank: B(907, (P, n) => {
      const fin = (cx, cy, s = 1) => Array.from({ length: 48 }, (_, q) => { const t = q / 48 * PI * 2; const r = .55 + .22 * Math.cos(t * 1) + .12 * Math.sin(2 * t); return [cx + Math.cos(t) * r * 1.25 * s, cy + Math.sin(t) * r * .8 * s + .25 * Math.cos(t) * s]; });
      const KEEP = mix(IC, C.good, .35), WASTE = mix(C.bad, C.red, .3);
      [[-1.85, 'punch'], [1.85, 'blank']].forEach(([x, kind]) => {
        const sh = rectP(x - 1.45, -.05, 2.9, 1.95), f = fin(x, .93), fd = fin(x, -1.45);
        const sheetC = kind === 'punch' ? KEEP : WASTE, pieceC = kind === 'punch' ? WASTE : KEEP;
        // whole (11): the sheet and the shape in it, the cut line dashed
        P.poly(n * .08, sh, k(IC, .3), 11); P.outline(n * .025, sh, IC, .012, 11); dash(P, n * .02, [...f, f[0]], C.chalk, { on: .06, per: .12, g: 11 });
        // cut (10): the sheet with its hole, the piece dropped below; what you keep glows, the waste is dull red
        let q = 0, t = 0; while (q < n * .08 && t++ < n * 30) { const px = x - 1.45 + P.r() * 2.9, py = -.05 + P.r() * 1.95; if (inside(f, px, py)) continue; P.pt(px, py, 0, k(sheetC, kind === 'punch' ? .4 : .22), 10); q++; }
        P.outline(n * .03, sh, kind === 'punch' ? C.white : k(WASTE, .8), .012, 10); P.outline(n * .03, f, kind === 'punch' ? C.white : k(WASTE, .8), .012, 10);
        P.poly(n * .05, fd, k(pieceC, kind === 'blank' ? .5 : .25), 10); P.outline(n * .025, fd, kind === 'blank' ? C.white : k(WASTE, .8), .012, 10);
        glow(P, n * .03, x, kind === 'punch' ? .93 : -1.45, 1.0, kind === 'punch' ? C.good : C.good, 10, .7);
      });
      P.seg(n * .015, 0, -2.0, 0, 2.0, k(C.chalk, .25), .006);
    }, .64),

    /* fine blanking: an ejector pushes up from below, opposite the punch; the blank is held flat and comes out with a smooth edge */
    fineBlank: B(908, (P, n) => {
      const S = C.steel, yt = -.15, yb = -.55, hw = .78;
      prism(P, n * .1, rectP(-2.6, -2.0, 2.6 - hw - .02, yb + 2.0), S); prism(P, n * .1, rectP(hw + .02, -2.0, 2.6 - hw - .02, yb + 2.0), S);
      // the strip (with the hole where the blank was)
      P.rect(n * .05, -2.6, yb, 2.6 - hw, yt - yb, k(IC, .45)); P.box(n * .015, -2.6, yb, 2.6 - hw, yt - yb, IC); P.rect(n * .05, hw, yb, 2.6 - hw, yt - yb, k(IC, .45)); P.box(n * .015, hw, yb, 2.6 - hw, yt - yb, IC);
      // guide plate with the impingement ring (V-ring) pressing in; holding force
      prism(P, n * .07, rectP(-2.4, yt, 2.4 - hw - .06, .6), mix(S, IC, .3)); prism(P, n * .07, rectP(hw + .06, yt, 2.4 - hw - .06, .6), mix(S, IC, .3));
      [-1.25, 1.25].forEach(x => { P.poly(n * .008, [[x - .1, yt], [x + .1, yt], [x, yt - .14]], C.yellow); P.arrow(n * .014, x, yt + 1.25, x, yt + .68, C.orange, .14); });
      // punch (down), blank, ejector (up): they move together on the stroke
      prism(P, n * .1, rectP(-hw + .02, yb, 2 * hw - .04, 2.4), C.alu, { g: 7, f: .42 });
      P.rect(n * .05, -hw + .02, yb - (yt - yb), 2 * hw - .04, yt - yb, k(mix(IC, C.white, .4), .6), 7);
      P.seg(n * .02, -hw + .02, yb - (yt - yb), -hw + .02, yb, C.white, .006, 7); P.seg(n * .02, hw - .02, yb - (yt - yb), hw - .02, yb, C.white, .006, 7);
      prism(P, n * .08, rectP(-hw + .04, -1.95, 2 * hw - .08, 1.0), mix(S, C.orange, .25), { g: 7 });
      arrowDown(P, n * .022, 0, 2.55, 1.95, C.orange, 7);
      P.arrow(n * .022, 0, -2.45, 0, -1.98, C.orange, .2, 7);
      glow(P, n * .012, -hw, yb, .16, C.yellow, 10); glow(P, n * .012, hw, yb, .16, C.yellow, 10);
    }, .64),

    /* the cutting operations as a sheet of fourteen samples (and a press that does them all) */
    cutOps: B(909, (P, n) => {
      const cols = [-2.9, -1.45, 0, 1.45, 2.9], rows = [1.5, 0, -1.5], w = 1.12, h = 1.12, m = n * .062;
      const cell = (i) => [cols[i % 5], rows[Math.floor(i / 5)]];
      const swatch = (cx, cy, hole) => { const r = rectP(cx - w / 2, cy - h / 2, w, h); let q = 0, t = 0; while (q < m * .45 && t++ < m * 30) { const x = cx - w / 2 + P.r() * w, y = cy - h / 2 + P.r() * h; if (hole && hole(x, y)) continue; P.pt(x, y, 0, k(IC, .2), 0); q++; } P.outline(m * .15, r, k(IC, .75)); };
      const hot = (pts, mm, i, closed = true) => { const g = i % 2 ? 10 : 11; P.line(mm, closed ? [...pts, pts[0]] : pts, C.white, .008); P.line(mm * .6, closed ? [...pts, pts[0]] : pts, C.orange, .02, g); };
      const ops = [
        // 1 punching: a round hole
        (cx, cy, i) => { const c = circP(cx, cy, .3); swatch(cx, cy, (x, y) => inside(c, x, y)); hot(c, m * .25, i); },
        // 2 blanking: the blank lifted out of its sheet
        (cx, cy, i) => { const c = circP(cx, cy, .3); swatch(cx, cy, (x, y) => inside(c, x, y)); P.outline(m * .1, c, k(IC, .5)); const b = circP(cx + .12, cy + .1, .3); P.poly(m * .2, b, k(C.chalk, .5)); hot(b, m * .2, i); },
        // 3 fine blanking: a blank with a clean, doubled edge
        (cx, cy, i) => { swatch(cx, cy); const b = circP(cx, cy, .32); P.poly(m * .2, b, k(C.chalk, .45)); hot(b, m * .2, i); P.ring(m * .1, cx, cy, .36, C.white, .006); },
        // 4 notching: a bite out of the edge
        (cx, cy, i) => { const nt = rectP(cx - .18, cy + .2, .36, .36); swatch(cx, cy, (x, y) => inside(nt, x, y)); hot([[cx - .18, cy + h / 2], [cx - .18, cy + .2], [cx + .18, cy + .2], [cx + .18, cy + h / 2]], m * .2, i, false); },
        // 5 perforating: many holes at once
        (cx, cy, i) => { const hs = []; for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) hs.push([cx - .33 + a * .22, cy - .33 + b * .22]); swatch(cx, cy, (x, y) => hs.some(([u, v]) => (x - u) ** 2 + (y - v) ** 2 < .006)); hs.forEach(([u, v]) => P.ring(m * .02, u, v, .075, i % 2 ? C.orange : C.white, .006)); },
        // 6 slotting: rectangular holes
        (cx, cy, i) => { const sl = [-.25, 0, .25].map(dy => rectP(cx - .32, cy + dy - .05, .64, .1)); swatch(cx, cy, (x, y) => sl.some(s => inside(s, x, y))); sl.forEach(s => hot(s, m * .08, i)); },
        // 7 slitting: one straight cut, the two halves part
        (cx, cy, i) => { swatch(cx, cy, (x, y) => Math.abs(x - cx) < .025); hot([[cx, cy - h / 2], [cx, cy + h / 2]], m * .2, i, false); },
        // 8 lancing: a tab cut on three sides and bent, nothing removed
        (cx, cy, i) => { const tab = [[cx - .25, cy - .05], [cx - .25, cy + .3], [cx + .25, cy + .3], [cx + .25, cy - .05]]; swatch(cx, cy, (x, y) => inside(rectP(cx - .25, cy - .05, .5, .35), x, y)); hot(tab, m * .2, i, false); P.poly(m * .12, [[cx - .25, cy - .05], [cx + .25, cy - .05], [cx + .2, cy - .3], [cx - .2, cy - .3]], k(C.chalk, .55)); },
        // 9 parting: two parts with a scrap piece between
        (cx, cy, i) => { swatch(cx, cy, (x, y) => Math.abs(x - cx) < .14); P.poly(m * .12, rectP(cx - .1, cy - h / 2, .2, h), k(C.bad, .45)); hot([[cx - .14, cy - h / 2], [cx - .14, cy + h / 2]], m * .1, i, false); hot([[cx + .14, cy - h / 2], [cx + .14, cy + h / 2]], m * .1, i, false); },
        // 10 cutoff: one curved cut line, no scrap
        (cx, cy, i) => { swatch(cx, cy); hot(Array.from({ length: 20 }, (_, q) => { const t = q / 19; return [cx + .12 * Math.sin(t * PI * 2), cy - h / 2 + t * h]; }), m * .2, i, false); },
        // 11 shaving: a thin ring shaved off a hole's edge
        (cx, cy, i) => { const c = circP(cx, cy, .3); swatch(cx, cy, (x, y) => inside(c, x, y)); P.ring(m * .08, cx, cy, .3, k(IC, .6), .006); hot(circP(cx, cy, .25), m * .15, i); },
        // 12 trimming: the flange ring cut off a drawn cup (seen from above)
        (cx, cy, i) => { swatch(cx, cy); P.ring(m * .12, cx, cy, .25, C.chalk, .008); P.disc(m * .08, cx, cy, .24, k(C.chalk, .3)); hot(circP(cx, cy, .27), m * .1, i); dash(P, m * .08, [...circP(cx, cy, .45), [cx + .45, cy]], k(C.bad, .8), { on: .05, per: .1 }); },
        // 13 embossing: raised ribs
        (cx, cy, i) => { swatch(cx, cy); [-.2, 0, .2].forEach(dx => { P.seg(m * .08, cx + dx, cy - .32, cx + dx, cy + .32, C.white, .02); P.seg(m * .04, cx + dx + .04, cy - .32, cx + dx + .04, cy + .32, k(IC, .5), .01, i % 2 ? 10 : 11); }); },
        // 14 coining: a coin struck on both faces
        (cx, cy, i) => { swatch(cx, cy); P.ring(m * .12, cx, cy, .4, C.yellow, .01); P.ring(m * .05, cx, cy, .33, k(C.yellow, .6), .008); for (let s = 0; s < 6; s++) { const a = s / 6 * PI * 2; P.seg(m * .02, cx, cy, cx + Math.cos(a) * .22, cy + Math.sin(a) * .22, C.white, .008); } P.ring(m * .04, cx, cy, .4, C.orange, .02, i % 2 ? 10 : 11); }
      ];
      ops.forEach((op, i) => { const [cx, cy] = cell(i); op(cx, cy, i); });
      // the last cell: a little press that does them
      { const [cx, cy] = cell(14); prism(P, m * .4, rectP(cx - .5, cy - .55, 1.0, .3), C.steel); P.rect(m * .1, cx - .55, cy - .25, 1.1, .05, k(IC, .6)); prism(P, m * .35, rectP(cx - .14, cy - .2, .28, .75), C.alu, { g: 7 }); glow(P, m * .1, cx, cy - .22, .2, C.yellow, 10); }
    }, .66),

    /* notching (a bite out of the edge) · perforating (many holes in one hit) · slotting (rectangular holes); the punches
       come down, the slugs drop (10), before the hit the sheet is whole (11) */
    perforating: B(910, (P, n) => {
      const v = view(.62, 0, -.55), Ys = 0;
      [[-2.35, 'notch'], [0, 'perf'], [2.35, 'slot']].forEach(([X0, kind]) => {
        const sh = [[X0 - .95, -.9], [X0 + .95, -.9], [X0 + .95, .9], [X0 - .95, .9]];
        let holes;
        if (kind === 'notch') holes = [rectP(X0 - .3, .45, .6, .46)];
        if (kind === 'perf') { holes = []; for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) holes.push(circP(X0 - .51 + a * .34, -.51 + b * .34, .1, 16)); }
        if (kind === 'slot') holes = [-.45, 0, .45].map(dz => rectP(X0 - .5, dz - .09, 1.0, .18));
        const inH = (X, Z) => holes.some(h => inside(h, X, Z));
        plate(P, n * .14, v, sh, Ys, .08, IC, { hole: inH, edgeC: mix(IC, C.white, .2) });
        holes.forEach(h => plate(P, n * .06 / holes.length, v, h, Ys, .08, IC, { g: 11, fill: .5 }));
        holes.forEach(h => { const { at, T } = walker([...h, h[0]]); for (let q = 0; q < n * .03 / holes.length; q++) { const [X, Z] = at(P.r() * T), [x, y, z] = v(X, Ys, Z); P.pt(x, y, z, C.yellow, 10); } });
        // the punch: one tool, as many points as holes, drawn at the bottom of its stroke
        const pdY = Ys - .05, top = 1.6;
        holes.forEach(h => { const [cx, cz] = h.reduce(([a, b], [x, z]) => [a + x / h.length, b + z / h.length], [0, 0]); const r = kind === 'perf' ? .09 : 0;
          if (kind === 'perf') cyl3(P, n * .012, v, cx, cz, r, pdY, .9, C.alu, { g: 7, cap: false });
          else { const w = Math.max(...h.map(p => p[0])) - Math.min(...h.map(p => p[0])), d = Math.max(...h.map(p => p[1])) - Math.min(...h.map(p => p[1])); box3(P, n * .05 / holes.length, v, cx - w / 2 + .02, cx + w / 2 - .02, pdY, .9, cz - d / 2 + .02, cz + d / 2 - .02, C.alu, { g: 7 }); } });
        box3(P, n * .05, v, X0 - .85, X0 + .85, .9, top, -.75, .75, C.steel, { g: 7 });
        // the slugs below
        holes.forEach(h => { const [cx, cz] = h.reduce(([a, b], [x, z]) => [a + x / h.length, b + z / h.length], [0, 0]); for (let q = 0; q < n * .02 / holes.length; q++) { const [X, Z] = h[Math.floor(P.r() * h.length)], t = P.r(), [x, y, z] = v(cx + (X - cx) * t, Ys - .4, cz + (Z - cz) * t); P.pt(x, y, z, mix(C.orange, C.yellow, P.r()), 10); } });
      });
    }, .64),

    /* lancing (top): three cuts and a bend make a louver — nothing is removed. Slitting (bottom): two rotary knives slit the
       strip as it runs through; no scrap */
    lancing: B(911, (P, n) => {
      // lancing: a sheet with louvers, the middle one being made
      { const v = view(.6, 0, 1.05), sh = [[-3.0, -.75], [3.0, -.75], [3.0, .75], [-3.0, .75]], tabs = [-1.9, 0, 1.9];
        const inT = (X, Z) => tabs.some(x => Math.abs(X - x) < .55 && Z > -.3 && Z < .3);
        plate(P, n * .14, v, sh, 0, .06, IC, { hole: inT, edgeC: mix(IC, C.white, .2) });
        tabs.forEach((x, i) => {
          const cut = [[x - .55, -.3], [x - .55, .3], [x + .55, .3], [x + .55, -.3]];
          // flat tab (11) — or bent down into a louver, hinged along its back edge (10, and always for the made ones)
          const bentG = i === 1 ? 10 : 0;
          for (let q = 0; q < n * .03; q++) { const X = x - .55 + P.r() * 1.1, s = P.r(), [px, py, pz] = v(X, -s * .6 * .84, -.3 + s * .6 * .55); P.pt(px, py, pz, k(IC, .45 + .3 * s), bentG); }
          const ln = [[x - .55, -.3], [x - .55, .3], [x + .55, .3], [x + .55, -.3]].map(([X, Z]) => v(X, 0, Z));
          if (i === 1) { for (let q = 0; q < n * .02; q++) { const X = x - .55 + P.r() * 1.1, Z = -.3 + P.r() * .6, [px, py, pz] = v(X, 0, Z); P.pt(px, py, pz, k(IC, .4), 11); } }
          const { at, T } = walker(ln.map(([a, b]) => [a, b])); for (let q = 0; q < n * .015; q++) { const [px, py] = at(P.r() * T); P.pt(px, py, 0, i === 1 ? C.yellow : C.white, i === 1 ? 10 : 0); }
          void cut;
        });
        cyl3(P, n * .05, v, 0, 0, .3, -.05, 1.2, C.alu, { g: 7 }); }
      // slitting: the strip runs (conveyor) between two rotary knives; the slit runs on from the knives
      { const y = -1.35;
        for (let q = 0; q < n * .14; q++) { const x = -4.4 + P.r() * 8.8, s = P.r(), e = s < .25; P.pt(x, y - .25 + (e ? (P.r() < .5 ? 0 : .5) : P.r() * .5), (s - .5) * .3, e ? IC : k(IC, .35), 9); }
        for (let m = 0; m < 30; m++) for (let q = 0; q < n * .0012; q++) P.pt(-4.4 + m * .3, y - .25 + P.r() * .5, 0, k(C.chalk, .7), 9);
        P.seg(n * .04, .05, y, 3.6, y, C.white, .008); glow(P, n * .03, .05, y, .2, C.yellow);
        [[.0, y + .62, -1.6], [.0, y - .62, 1.6]].forEach(([x, cy, sp]) => { P.ring(n * .05, x, cy, .62, C.alu, .012, 6, [x, cy, 0, sp]); P.ring(n * .02, x, cy, .5, k(C.alu, .6), .01, 6, [x, cy, 0, sp]); P.ring(n * .01, x, cy, .12, C.chalk, .008, 6, [x, cy, 0, sp]); for (let s = 0; s < 3; s++) { const a = s / 3 * PI * 2; P.seg(n * .006, x + Math.cos(a) * .12, cy + Math.sin(a) * .12, x + Math.cos(a) * .5, cy + Math.sin(a) * .5, k(C.alu, .8), .01, 6, [x, cy, 0, sp]); } }); }
    }, .64),

    /* cutoff (top: one cut line between parts, no scrap) vs parting (bottom: two edges, a scrap piece falls out between parts) */
    cutoffParting: B(912, (P, n) => {
      const cut = (x0, y0, h) => Array.from({ length: 24 }, (_, q) => { const t = q / 23; return [x0 + .22 * Math.sin(t * PI), y0 - h / 2 + t * h]; });
      // cutoff: parts nest, one cut each; the newest cut flashes
      { const y = 1.0, h = 1.15;
        const xs = [-1.9, -.1, 1.7];
        P.rect(n * .14, -3.4, y - h / 2, 6.8, h, k(IC, .3)); P.seg(n * .03, -3.4, y - h / 2, 3.4, y - h / 2, IC); P.seg(n * .03, -3.4, y + h / 2, 3.4, y + h / 2, IC);
        xs.forEach((x, i) => P.line(n * .025, cut(x, y, h), i === 1 ? C.yellow : C.white, .008, i === 1 ? 10 : 0));
        glow(P, n * .02, -.1 + .11, y, .4, C.orange, 10, 1.4); }
      // parting: a scrap web between parts, punched out and dropping (10), in place before (11)
      { const y = -1.1, h = 1.15, xs = [-1.9, -.1, 1.7], wd = .32;
        let q = 0, t = 0; while (q < n * .14 && t++ < n * 30) { const x = -3.4 + P.r() * 6.8, yy = y - h / 2 + P.r() * h; if (xs.some(c => Math.abs(x - c) < wd / 2)) continue; P.pt(x, yy, 0, k(IC, .3), 0); q++; }
        P.seg(n * .03, -3.4, y - h / 2, 3.4, y - h / 2, IC); P.seg(n * .03, -3.4, y + h / 2, 3.4, y + h / 2, IC);
        xs.forEach((x, i) => { [-1, 1].forEach(sg => P.seg(n * .012, x + sg * wd / 2, y - h / 2, x + sg * wd / 2, y + h / 2, i === 1 ? C.yellow : C.white, .008, i === 1 ? 10 : 0));
          const sc = rectP(x - wd / 2 + .02, y - h / 2, wd - .04, h);
          if (i === 1) { P.poly(n * .025, sc, k(C.bad, .55), 11); P.poly(n * .025, sc.map(([a, b]) => [a + .05, b - 1.05]), k(C.bad, .6), 10); P.outline(n * .01, sc.map(([a, b]) => [a + .05, b - 1.05]), C.bad, .01, 10); }
          else if (i === 2) P.poly(n * .015, sc, k(C.bad, .35), 0); });
        glow(P, n * .02, -.1, y, .45, C.orange, 10, 1.3); }
    }, .64),

    /* trimming (left): the flange is cut off a drawn cup (the ring drops away). Shaving (right): the punch passes a hair's
       breadth from an edge and peels a thin sliver off (±0.025 mm) */
    trimShave: B(913, (P, n) => {
      // trimming: a cup with its flange; a ring-shaped trimming tool comes down
      { const x = -1.9, y = -.5, tl = .5;
        P.lathe(n * .18, [[0, -.9], [.55, -.9], [.6, -.85], [.6, .25]], IC, { cx: x, cy: y, tilt: tl });
        const ring = (yy, g, c) => P.lathe(n * .07, [[.62, .27], [1.05, .27]], c, { cx: x, cy: yy, tilt: tl, g });
        ring(y, 11, mix(IC, C.chalk, .2)); ring(y - .75, 10, mix(C.bad, C.orange, .3));
        P.lathe(n * .07, [[.66, .4], [1.0, .4], [1.0, 1.5], [.66, 1.5]], k(C.alu, .6), { cx: x, cy: y - .02, tilt: tl, g: 7 });
        for (let q = 0; q < n * .03; q++) { const a = P.r() * PI * 2; const r = .63; P.pt(x + Math.cos(a) * r, y + .27 * Math.cos(tl) - Math.sin(a) * r * Math.sin(tl), .27 * Math.sin(tl) + Math.sin(a) * r * Math.cos(tl), mix(C.yellow, C.white, .4), 10); }
      }
      // shaving: a part's edge; the shaving punch slides down past it and peels a sliver
      { const x0 = 1.0, ye = .5;
        prism(P, n * .14, [[x0 - .9, -1.8], [x0 + .7, -1.8], [x0 + .7, ye], [x0 - .9, ye]], mix(C.steel, IC, .4));
        P.rect(n * .03, x0 + .7, -1.8, .045, ye + 1.8, k(C.yellow, .8), 11);
        P.curve(n * .03, t => [x0 + .74 + .2 * Math.sin(t * 2.6) * t, -1.85 - .5 * t + .2 * (1 - Math.cos(t * 2.6)) * t], C.orange, .01, 10);
        P.seg(n * .03, x0 + .745, -1.8, x0 + .745, ye, C.white, .004, 10);
        prism(P, n * .1, rectP(x0 + .76, -1.85, .75, 3.6), C.alu, { g: 7, f: .42 });
        P.text(n * .03, '±0.025', '800 200px "Big Shoulders Display"', .95, C.yellow, null, false, 1.2, x0 - .1);
        glow(P, n * .015, x0 + .74, -1.82, .2, C.yellow, 10); }
    }, .64),

    /* nibbling: a small punch takes overlapping bites along a curved path; the cut grows behind it */
    nibbling: B(914, (P, n) => {
      const v = view(.62, 0, -.35), Ys = 0;
      const curve = t => [-2.6 + t * 5.2, .55 * Math.sin(t * PI * 1.6 - .4)];
      const bites = Array.from({ length: 30 }, (_, q) => curve(q / 29 * .62));
      const r = .17, inB = (X, Z) => bites.some(([a, b]) => (X - a) ** 2 + (Z - b) ** 2 < r * r);
      plate(P, n * .3, v, [[-3.2, -1.3], [3.2, -1.3], [3.2, 1.3], [-3.2, 1.3]], Ys, .08, IC, { hole: inB, edgeC: mix(IC, C.white, .2) });
      // the scalloped edge of the cut so far, and the path still to go
      for (let q = 0; q < n * .08; q++) { const [a, b] = bites[Math.floor(P.r() * bites.length)], th = P.r() * PI * 2, X = a + Math.cos(th) * r, Z = b + Math.sin(th) * r; if (inB(X + Math.cos(th) * .01, Z + Math.sin(th) * .01) && bites.some(([c, d]) => (X - c) ** 2 + (Z - d) ** 2 < (r - .01) ** 2)) continue; const [x, y, z] = v(X, Ys, Z); P.pt(x, y, z, C.white, 0); }
      { const pts = Array.from({ length: 40 }, (_, q) => { const [X, Z] = curve(.62 + q / 39 * .38), [x, y] = v(X, Ys, Z); return [x, y]; }); dash(P, n * .03, pts, k(C.chalk, .6), { on: .06, per: .13 }); }
      // the punch at the head of the cut, its bite flashing, the little slug dropping
      const [hx, hz] = curve(.62);
      cyl3(P, n * .1, v, hx, hz, r - .01, Ys - .05, 1.5, C.alu, { g: 7, rimC: C.white });
      box3(P, n * .05, v, hx - .45, hx + .45, 1.5, 1.9, hz - .35, hz + .35, C.steel, { g: 7 });
      for (let q = 0; q < n * .03; q++) { const th = P.r() * PI * 2, [x, y, z] = v(hx + Math.cos(th) * r, Ys, hz + Math.sin(th) * r); P.pt(x, y, z, C.yellow, 10); }
      for (let q = 0; q < n * .015; q++) { const th = P.r() * PI * 2, d = Math.sqrt(P.r()) * r, [x, y, z] = v(hx + Math.cos(th) * d, Ys - .5, hz + Math.sin(th) * d); P.pt(x, y, z, C.orange, 10); }
      for (let q = 0; q < n * .015; q++) { const th = P.r() * PI * 2, d = Math.sqrt(P.r()) * r, [x, y, z] = v(hx + Math.cos(th) * d, Ys, hz + Math.sin(th) * d); P.pt(x, y, z, k(IC, .45), 11); }
    }, .64),

    /* embossing: punch and die with the same contour in opposite directions (male above, female below); the sheet takes it */
    emboss: B(915, (P, n) => {
      const th = .1, f = x => { const u = Math.abs(x); if (u > 2.2) return 0; const s = Math.sin(x * PI / .8); return .3 * Math.max(0, Math.sign(s)) * Math.min(1, Math.abs(s) * 2.5) * (u < 2.0 ? 1 : (2.2 - u) / .2); };
      const xs = Array.from({ length: 161 }, (_, q) => -3.0 + q / 160 * 6.0);
      // the female die (recesses down), the male punch (ribs down), same contour
      prism(P, n * .16, [[-3.0, -1.9], [3.0, -1.9], ...xs.slice().reverse().map(x => [x, -.5 - f(x)])], C.steel);
      prism(P, n * .16, [[-3.0, 1.7], ...xs.map(x => [x, -.5 + th - f(x)]), [3.0, 1.7]], C.alu, { g: 7, f: .4 });
      sheet(P, n * .08, xs.map(x => [x, -.5 + th / 2]), th, IC, { g: 11 });
      sheet(P, n * .1, xs.map(x => [x, -.5 + th / 2 - f(x)]), th, mix(IC, C.yellow, .2), { g: 10 });
      arrowDown(P, n * .02, 0, 2.3, 1.8, C.orange, 7);
      for (let q = 0; q < n * .03; q++) { const x = xs[Math.floor(P.r() * xs.length)]; if (f(x) <= .05) { q--; continue; } P.pt(x, -.5 + th / 2 - f(x) + P.g() * .02, 0, C.yellow, 10); }
    }, .64),

    /* coining: a blank struck between two dies with different reliefs — both faces come out impressed (10), plain before (11) */
    coining: B(916, (P, n) => {
      const x0 = -1.55, th = .16, yb = -.3, relief = (x, s) => { const u = (x - x0) / .95; return Math.abs(u) > 1 ? 0 : .05 * (Math.sin(u * 7 + s) > .3 ? 1 : 0); };
      const xs = Array.from({ length: 121 }, (_, q) => x0 - .95 + q / 120 * 1.9);
      prism(P, n * .12, [[x0 - 1.15, -1.9], [x0 + 1.15, -1.9], [x0 + 1.15, yb], ...xs.slice().reverse().map(x => [x, yb + relief(x, 1)]), [x0 - 1.15, yb]], C.steel);
      prism(P, n * .12, [[x0 - 1.15, 1.7], [x0 - 1.15, yb + th], ...xs.map(x => [x, yb + th - relief(x, 0)]), [x0 + 1.15, yb + th], [x0 + 1.15, 1.7]], C.alu, { g: 7, f: .4 });
      P.rect(n * .04, x0 - .95, yb + .052, 1.9, th - .052, k(C.yellow, .55), 11); P.box(n * .015, x0 - .95, yb + .052, 1.9, th - .052, C.yellow, .01, 11);
      for (let q = 0; q < n * .06; q++) { const x = x0 - .95 + P.r() * 1.9, lo = yb + relief(x, 1), hi = yb + th - relief(x, 0); P.pt(x, lo + P.r() * (hi - lo), 0, k(C.yellow, .7), 10); }
      for (let q = 0; q < n * .03; q++) { const x = x0 - .95 + P.r() * 1.9, s = P.r() < .5; P.pt(x, s ? yb + relief(x, 1) : yb + th - relief(x, 0), 0, C.white, 10); }
      arrowDown(P, n * .02, x0, 2.3, 1.8, C.orange, 7); glow(P, n * .02, x0, yb + th / 2, .8, C.orange, 10, .2);
      // the two faces of the struck coin: plain (11) · impressed (10)
      [[1.25, 0], [2.75, 1]].forEach(([cx, side]) => {
        const cy = .1, R = .62; P.ring(n * .04, cx, cy, R, C.yellow, .012); P.disc(n * .05, cx, cy, R, k(C.yellow, .22));
        for (let q = 0; q < n * .015; q++) { const a = P.r() * PI * 2; P.pt(cx + Math.cos(a) * (R - .08), cy + Math.sin(a) * (R - .08), 0, k(C.yellow, .55), 10); }
        if (side === 0) { const gp = Array.from({ length: 32 }, (_, q) => { const a = q / 32 * PI * 2, d = (q % 4 < 2) ? .36 : .28; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; }); P.outline(n * .05, gp, C.white, .01, 10); P.ring(n * .015, cx, cy, .1, C.white, .008, 10); }
        else { const st = Array.from({ length: 10 }, (_, q) => { const a = -PI / 2 + q * PI / 5, d = q % 2 ? .14 : .34; return [cx + Math.cos(a) * d, cy + Math.sin(a) * d]; }); P.outline(n * .05, st, C.white, .01, 10); }
        glow(P, n * .01, cx, cy, .5, C.yellow, 10);
      });
      P.seg(n * .01, 1.95, -.6, 2.05, .8, k(C.chalk, .2), .005);
    }, .64)
  };
};
