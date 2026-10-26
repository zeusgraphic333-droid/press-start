// Immersive scenes — materials (names and captions: info.js · SCENES_BY_ZONE.materials; what to draw: docs/SCENES.md; how: STYLE.md).
// Zone colour: gold. Seeds 3xx.
import { build, C, k, mix } from './kit.js';

/* ---- local helpers (each zone file keeps its own copy: zone files never import each other) ---- */
const TAU = Math.PI * 2;
/** draw through a mapping f(x, y, z, c) → [x, y, z] | [x, y, z, c] | null (skip): move, bend, view or clip a drawing */
function xf(P, f, draw) {
  const pt = P.pt;
  P.pt = (x, y, z, c, g, pv) => { const q = f(x, y, z, c); if (!q) return; let v = pv; if (pv && pv[3]) { const m = f(pv[0], pv[1], pv[2], c); if (m) v = [m[0], m[1], m[2], pv[3]]; } pt(q[0], q[1], q[2], q[3] || c, g, v); };
  try { draw(); } finally { P.pt = pt; }
}
const shift = (dx, dy = 0) => (x, y, z) => [x + dx, y + dy, z];
/** local drawing turned by a, then placed at (cx, cy) */
const place = (cx, cy, a = 0) => { const c = Math.cos(a), s = Math.sin(a); return (x, y, z) => [cx + x * c - y * s, cy + x * s + y * c, z]; };
/** a fixed 3D view: turn about Y (ay) then X (ax), then place at (dx, dy) */
const view = (ay, ax, dx = 0, dy = 0) => { const ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax); return (x, y, z) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca; return [x1 + dx, y * cb - z1 * sb + dy, y * sb + z1 * cb]; }; };
const onEll = (cx, cy, rx, ry, rot, a) => [cx + Math.cos(a) * rx * Math.cos(rot) - Math.sin(a) * ry * Math.sin(rot), cy + Math.cos(a) * rx * Math.sin(rot) + Math.sin(a) * ry * Math.cos(rot)];
function ell(P, n, cx, cy, rx, ry, c, j = .013, g = 0, a0 = 0, a1 = TAU, rot = 0, pv) { P.curve(n, t => onEll(cx, cy, rx, ry, rot, a0 + (a1 - a0) * t), c, j, g, pv); }
function ellF(P, n, cx, cy, rx, ry, c, g = 0, pv) { for (let q = 0; q < n; q++) { const a = P.r() * TAU, d = Math.sqrt(P.r()); P.pt(cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, P.g() * .02, c, g, pv); } }
function dash(P, n, x1, y1, x2, y2, c, on = .13, off = .09, j = .011, g = 0) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, per = on + off, m = Math.ceil(L / per);
  for (let q = 0; q < n; q++) { let t; do t = (Math.floor(P.r() * m) * per + P.r() * Math.min(on, L)) / L; while (t > 1); P.pt(x1 + (x2 - x1) * t + P.g() * j, y1 + (y2 - y1) * t + P.g() * j, P.g() * j, c, g); }
}
function glow(P, n, x, y, s, c, g = 0, pv) { for (let q = 0; q < n; q++) P.pt(x + P.g() * s, y + P.g() * s, P.g() * s * .5, c, g, pv); }
function burst(P, n, x, y, r0, r1, c, rays = 9, a0 = 0, a1 = Math.PI, g = 10) {
  for (let q = 0; q < n; q++) { const kk = Math.floor(P.r() * rays), a = a0 + (a1 - a0) * (kk + .5) / rays, len = r1 * (.55 + .45 * ((kk * .618) % 1)), t = Math.pow(P.r(), 1.5), d = r0 + (len - r0) * t; P.pt(x + Math.cos(a) * d + P.g() * .01, y + Math.sin(a) * d + P.g() * .01, P.g() * .02, mix(C.white, c, t), g); }
}
/** a 3D straight line and a 3D quad (a → b → c → d) */
function line3(P, n, a, b, c, j = .008, g = 0, pv) { P.curve(n, t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], c, j, g, pv); }
function quad3(P, n, a, b, cc, d, col, g = 0, pv) { for (let q = 0; q < n; q++) { const u = P.r(), v = P.r(), p = [0, 1, 2].map(i => (a[i] * (1 - u) + b[i] * u) * (1 - v) + (d[i] * (1 - u) + cc[i] * u) * v); P.pt(p[0], p[1], p[2], col, g, pv); } }
/** an ingot: a box narrower on top (L long, H high, D deep), its faces shaded and edges drawn; spin turns it about Y */
function ingot(P, n, cx, cy, L, H, D, c, spin = 0, ay = 0, ax = 0) {
  const pv = spin ? [cx, cy, 0, spin] : undefined, vw = view(ay, ax, cx, cy), V = (x, y, z) => vw(x, y, z);
  const bx = L / 2, bz = D / 2, tx = L / 2 - H * .4, tz = D / 2 - H * .28, y0 = -H / 2, y1 = H / 2;
  const B = [V(-bx, y0, -bz), V(bx, y0, -bz), V(bx, y0, bz), V(-bx, y0, bz)], T = [V(-tx, y1, -tz), V(tx, y1, -tz), V(tx, y1, tz), V(-tx, y1, tz)];
  quad3(P, n * .2, T[0], T[1], T[2], T[3], k(c, .78), 0, pv);
  quad3(P, n * .06, B[0], B[1], B[2], B[3], k(c, .28), 0, pv);
  for (let s = 0; s < 4; s++) quad3(P, n * (s % 2 ? .06 : .12), B[s], B[(s + 1) % 4], T[(s + 1) % 4], T[s], k(c, s === 2 ? .58 : .42), 0, pv);
  for (let s = 0; s < 4; s++) { line3(P, n * .02, B[s], B[(s + 1) % 4], c, .007, 0, pv); line3(P, n * .02, T[s], T[(s + 1) % 4], mix(c, C.white, .45), .007, 0, pv); line3(P, n * .014, B[s], T[s], c, .007, 0, pv); }
}
/** a flat shape pushed d deep and seen through a view mapping: faces, side walls and edges */
function extrude(P, n, pts, d, vw, cF, cE, g = 0) {
  xf(P, (x, y, z) => vw(x, y, z + d / 2), () => { P.poly(n * .3, pts, cF, g); P.outline(n * .15, pts, cE, .008, g); });
  xf(P, (x, y, z) => vw(x, y, z - d / 2), () => { P.poly(n * .1, pts, k(cF, .55), g); P.outline(n * .08, pts, k(cE, .55), .008, g); });
  const L = pts.map((p, a) => Math.hypot(pts[(a + 1) % pts.length][0] - p[0], pts[(a + 1) % pts.length][1] - p[1])), T = L.reduce((a, b) => a + b, 0);
  pts.forEach((p, a) => { const q = pts[(a + 1) % pts.length]; quad3(P, n * .25 * L[a] / T, vw(p[0], p[1], d / 2), vw(q[0], q[1], d / 2), vw(q[0], q[1], -d / 2), vw(p[0], p[1], -d / 2), k(cF, .42), g); line3(P, n * .12 / pts.length, vw(p[0], p[1], d / 2), vw(p[0], p[1], -d / 2), k(cE, .7), .007, g); });
}
/** a round atom (top-lit) */
function atom(P, m, x, y, z, R, c, g = 0, pv) { for (let q = 0; q < m; q++) { const u = P.r() * 2 - 1, th = P.r() * TAU, s = Math.sqrt(1 - u * u), rr = R * (P.r() < .85 ? 1 : Math.cbrt(P.r())); P.pt(x + Math.cos(th) * s * rr, y + u * rr, z + Math.sin(th) * s * rr, k(c, .5 + .5 * (u * .5 + .5)), g, pv); } }
/** a band looped round two pegs (x1, y) and (x2, y): a stadium, r round the pegs, stroke w */
function loop(P, n, x1, x2, y, r, c, w = .05, g = 0) {
  const sl = x2 - x1, L = 2 * sl + TAU * r;
  for (let q = 0; q < n; q++) {
    let s = P.r() * L, px, py, nx, ny;
    if (s < sl) { px = x1 + s; py = y + r; nx = 0; ny = 1; }
    else if ((s -= sl) < Math.PI * r) { const a = Math.PI / 2 - s / r; px = x2 + Math.cos(a) * r; py = y + Math.sin(a) * r; nx = Math.cos(a); ny = Math.sin(a); }
    else if ((s -= Math.PI * r) < sl) { px = x2 - s; py = y - r; nx = 0; ny = -1; }
    else { s -= sl; const a = -Math.PI / 2 - s / r; px = x1 + Math.cos(a) * r; py = y + Math.sin(a) * r; nx = Math.cos(a); ny = Math.sin(a); }
    const o = (P.r() - .5) * w; P.pt(px + nx * o, py + ny * o, P.g() * .02, c, g);
  }
}
const gearPts = (cx, cy, R, teeth, depth = .12, steps = 8) => { const out = []; for (let t = 0; t < teeth; t++) for (let s = 0; s < steps; s++) { const u = s / steps, a = (t + u) / teeth * TAU, rr = u < .45 ? R : u < .5 ? R - depth * (u - .45) / .05 : u < .95 ? R - depth : R - depth * (1 - (u - .95) / .05); out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return out; };
/** a node of a chart: a plate with a bright edge */
function plate(P, n, cx, cy, w, h, c, dashed = false) {
  P.rect(n * .55, cx - w / 2, cy - h / 2, w, h, k(c, .3));
  if (!dashed) P.box(n * .45, cx - w / 2, cy - h / 2, w, h, c, .009);
  else [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]].forEach(([a, b]) => dash(P, n * .11, cx + a[0] * w / 2, cy + a[1] * h / 2, cx + b[0] * w / 2, cy + b[1] * h / 2, c, .1, .07, .008));
}

/* the colours of this zone */
const G = C.gold, ST = C.steel, W = C.chalk;
const IRON = mix(C.steel2, C.steel, .45), CLAY = mix(C.copper, C.red, .35), RUBBER = mix(C.plum, C.violet, .2), GLASS = mix(C.ice, C.water, .4);

export default N => ({
  /* ★ Materials (L1·S4): one family, four branches, each ending in a sample — an ingot turning, a moulded bottle, a rubber
     band pulled and let go, a glass pane catching the light */
  materialsTree: () => build(N, 301, (P, n) => {
    const XS = [-2.7, -.9, .9, 2.7], BAR = 1.28, line = k(G, .6);
    plate(P, n * .07, 0, 1.92, 1.7, .44, G);
    glow(P, n * .01, 0, 1.92, .3, k(G, .25));
    P.seg(n * .01, 0, 1.7, 0, BAR, line, .008); P.seg(n * .04, -2.7, BAR, 2.7, BAR, line, .008);
    XS.forEach((x, q) => { P.seg(n * .007, x, BAR, x, 1.0, line, .008); glow(P, n * .003, x, BAR, .03, C.yellow); plate(P, n * .028, x, .84, 1.3, .3, [G, C.ice, RUBBER, GLASS][q]); });
    // metals: a gold ingot turning
    ingot(P, n * .17, -2.7, -.95, 1.55, .66, .8, G, .45);
    glow(P, n * .012, -2.7, -1.45, .3, k(G, .14));
    // plastics: a moulded bottle (shimmering as it turns)
    const prof = [[0, 0], [.34, 0], [.4, .1], [.4, 1.18], [.34, 1.4], [.2, 1.66], [.14, 1.8], [.14, 1.92], [.18, 1.94], [.18, 2.12], [0, 2.12]];
    P.lathe(n * .13, prof, mix(C.ice, C.white, .15), { axis: 'y', cx: -.9, cy: -1.95, tilt: 0, speed: .7 });
    P.seg(n * .01, -1.18, -1.6, -1.18, -.85, k(C.white, .7), .012);
    // rubber / elastomers: a band round two pegs; the lower peg is pulled down with each stroke and the band follows
    xf(P, place(.9, -.68, Math.PI / 2), () => {
      loop(P, n * .05, -1.07, 1.03, 0, .13, RUBBER, .06, 10);
      loop(P, n * .05, -.47, 1.03, 0, .21, RUBBER, .08, 11);
    });
    P.disc(n * .008, .9, .35, .1, k(ST, .9)); P.ring(n * .006, .9, .35, .1, W, .008);
    P.disc(n * .008, .9, -1.75, .1, k(ST, .9), 7); P.ring(n * .006, .9, -1.75, .1, W, .008, 7);
    P.seg(n * .008, .9, -1.85, .9, -2.1, k(ST, .8), .02, 7); P.seg(n * .006, .7, -2.12, 1.1, -2.12, k(ST, .8), .025, 7);
    P.arrow(n * .012, 1.35, -.9, 1.35, -1.75, k(C.orange, .9), .14, 10);
    // natural engineering materials: a glass pane, a glint sliding across it
    const pv = view(-.55, .12, 2.7, -.75);
    for (let q = 0; q < n * .05; q++) { const x = (P.r() - .5) * 1.15, y = (P.r() - .5) * 1.7; P.pt(...pv(x, y, (P.r() - .5) * .06), k(GLASS, .2)); }
    xf(P, (x, y, z) => pv(x, y, z), () => { P.box(n * .03, -.575, -.85, 1.15, 1.7, GLASS, .008); P.box(n * .012, -.53, -.8, 1.06, 1.6, k(GLASS, .5), .006); });
    xf(P, (x, y, z) => pv(x, y, z), () => { P.seg(n * .012, -.35, -.18, .05, .22, C.white, .014, 5); P.seg(n * .007, -.18, -.22, .12, .08, k(C.white, .7), .01, 5); });
    P.rect(n * .012, 2.05, -1.72, 1.3, .1, k(ST, .4));
  }, .64),

  /* Engineering materials (L2·S2): metals (ferrous · non-ferrous) and non-metals (polymers · ceramics), a fork */
  classTree: () => build(N, 302, (P, n) => {
    const lm = k(G, .6), ln = k(C.ice, .5);
    plate(P, n * .05, 0, 2.0, 1.6, .38, W);
    P.seg(n * .006, 0, 1.81, 0, 1.55, k(W, .5), .008); P.seg(n * .016, -1.9, 1.55, 0, 1.55, lm, .008); P.seg(n * .016, 0, 1.55, 1.9, 1.55, ln, .008);
    P.seg(n * .004, -1.9, 1.55, -1.9, 1.3, lm, .008); P.seg(n * .004, 1.9, 1.55, 1.9, 1.3, ln, .008);
    plate(P, n * .035, -1.9, 1.14, 1.3, .32, G); plate(P, n * .035, 1.9, 1.14, 1.3, .32, C.ice);
    P.seg(n * .005, -1.9, .98, -1.9, .78, lm, .008); P.seg(n * .016, -2.85, .78, -.95, .78, lm, .008);
    P.seg(n * .005, 1.9, .98, 1.9, .78, ln, .008); P.seg(n * .016, .95, .78, 2.85, .78, ln, .008);
    [-2.85, -.95].forEach(x => { P.seg(n * .004, x, .78, x, .5, lm, .008); glow(P, n * .003, x, .78, .03, C.yellow); });
    [.95, 2.85].forEach(x => { P.seg(n * .004, x, .78, x, .5, ln, .008); glow(P, n * .003, x, .78, .03, C.ice); });
    // ferrous: an iron I-beam
    const I = [[-.48, -.45], [.48, -.45], [.48, -.3], [.09, -.3], [.09, .3], [.48, .3], [.48, .45], [-.48, .45], [-.48, .3], [-.09, .3], [-.09, -.3], [-.48, -.3]];
    extrude(P, n * .12, I, 1.1, view(.75, .3, -2.85, -.85), k(IRON, 1.1), W);
    // non-ferrous: copper and aluminium ingots
    ingot(P, n * .08, -.95, -1.35, 1.25, .45, .6, C.copper, 0, .45, .25);
    ingot(P, n * .07, -.95, -.72, 1.1, .4, .55, C.alu, 0, -.35, .25);
    // polymers: a chain of linked units, drifting
    const ch = Array.from({ length: 9 }, (_, q) => [.95 - .9 + q * .225, -.85 + (q % 2 ? .18 : -.18)]);
    P.line(n * .025, ch, k(C.violet, .8), .01, 5);
    ch.forEach(([x, y], q) => { P.disc(n * .005, x, y, .07, mix(C.violet, C.white, .25), 5); const s = q % 2 ? 1 : -1; P.seg(n * .002, x, y, x, y + s * .26, k(C.ice, .6), .006, 5); P.disc(n * .002, x, y + s * .3, .04, C.ice, 5); });
    // ceramics: two bricks
    const bv = view(.5, .32, 2.85, -1.25);
    [[0, 0], [0, .5]].forEach(([dx, dy], q) => xf(P, (x, y, z) => bv(x + dx, y + dy, z), () => { P.cuboid(n * .06, 0, 0, 0, 1.2, .42, .55, CLAY); }));
    [[0, 0], [0, .5]].forEach(([dx, dy]) => { const c = [[-.6, -.21, .275], [.6, -.21, .275], [.6, .21, .275], [-.6, .21, .275]].map(p => bv(p[0] + dx, p[1] + dy, p[2])); for (let s = 0; s < 4; s++) line3(P, n * .006, c[s], c[(s + 1) % 4], mix(CLAY, C.white, .4)); });
  }, .62),

  /* Metals (L1·S6): ferrous · nonferrous · and the dashed branch, powder metallurgy — powder pressed into a part */
  metalsChart: () => build(N, 303, (P, n) => {
    const l = k(G, .6);
    plate(P, n * .05, 0, 1.98, 1.5, .38, G);
    P.seg(n * .006, 0, 1.79, 0, 1.5, l, .008); P.seg(n * .02, -2.55, 1.5, 0, 1.5, l, .008); dash(P, n * .02, 0, 1.5, 2.55, 1.5, l, .12, .08, .008);
    P.seg(n * .005, -2.55, 1.5, -2.55, 1.15, l, .008); P.seg(n * .005, 0, 1.5, 0, 1.15, l, .008); dash(P, n * .006, 2.55, 1.5, 2.55, 1.15, l, .08, .06, .008);
    plate(P, n * .03, -2.55, .99, 1.3, .3, ST); plate(P, n * .03, 0, .99, 1.3, .3, C.copper); plate(P, n * .03, 2.55, .99, 1.3, .3, G, true);
    // ferrous: a coil of steel strip, turning as it pays out
    const cx = -2.55, cy = -.65, pv = [cx, cy, 0, -.35];
    for (let q = 0; q < n * .12; q++) { const t = P.r(), a = t * 9 * TAU, r = .22 + t * .58; P.pt(cx + Math.cos(a) * r + P.g() * .008, cy + Math.sin(a) * r + P.g() * .008, P.g() * .02, k(mix(IRON, C.alu, t * .5), .55 + .45 * t), 6, pv); }
    P.ring(n * .02, cx, cy, .82, k(W, .8), .01); P.ring(n * .01, cx, cy, .2, k(W, .6), .01);
    P.seg(n * .02, cx, cy - .82, cx + 1.0, cy - .82, k(IRON, 1.1), .02); P.seg(n * .008, cx - .9, -1.55, cx + 1.0, -1.55, k(ST, .5), .01);
    // nonferrous: ingots of copper, aluminium and brass, stacked
    ingot(P, n * .06, -.42, -1.3, .8, .38, .5, C.copper, 0, .4, .25);
    ingot(P, n * .06, .42, -1.3, .8, .38, .5, C.alu, 0, .4, .25);
    ingot(P, n * .06, 0, -.84, .8, .38, .5, C.brass, 0, .4, .25);
    // powder metallurgy: the punch (the ram) presses loose powder into a solid part; the part made this way, a little gear
    xf(P, shift(2.45), () => {
      [[-.62, -.22], [.22, .62]].forEach(([a, b]) => { P.rect(n * .02, a, -2.0, b - a, 1.1, k(ST, .3)); P.box(n * .012, a, -2.0, b - a, 1.1, k(ST, .9), .008); });
      P.rect(n * .01, -.22, -2.0, .44, .3, k(ST, .4)); P.box(n * .006, -.22, -2.0, .44, .3, k(ST, .9), .008);
      for (let q = 0; q < n * .03; q++) { const x = -.2 + P.r() * .4, y = -1.68 + P.r() * .78; const hp = y > -.9 ? .2 * (1 - (x / .2) ** 2) + -.9 : 9; if (y > hp) continue; P.pt(x, y, P.g() * .02, k(mix(G, C.white, P.r() * .3), .8), 11); }
      for (let q = 0; q < n * .012; q++) { const x = -.2 + P.r() * .4, y = -.9 + P.r() * .15; if (y > -.9 + .15 * (1 - (x / .2) ** 2)) continue; P.pt(x, y, 0, k(G, .8), 11); }
      P.rect(n * .03, -.21, -1.69, .42, .38, mix(G, C.white, .3), 10); P.box(n * .01, -.21, -1.69, .42, .38, C.white, .008, 10);
      P.rect(n * .025, -.19, -1.31, .38, 1.2, k(ST, .4), 7); P.box(n * .014, -.19, -1.31, .38, 1.2, W, .008, 7);
      P.rect(n * .012, -.45, -.11, .9, .26, k(ST, .35), 7); P.box(n * .008, -.45, -.11, .9, .26, k(W, .7), .008, 7);
      glow(P, n * .006, 0, -1.31, .08, C.white, 10); burst(P, n * .006, 0, -1.31, .1, .4, G, 6, .1, Math.PI - .1);
      P.gear(n * .035, .82, .1, .28, 10, G, { speed: .5, depth: .07, hub: .07, spokes: 0 });
    });
  }, .62),

  /* Pure metal: atoms of one kind, one size, in a calm lattice turning slowly */
  atoms: () => build(N, 304, (P, n) => {
    const NX = 5, NY = 4, NZ = 3, S = .74, R = .14, CY = -.15, pv = [0, CY, 0, .16], tilt = view(0, .42, 0, CY);
    const at = (i, j, l) => tilt((i - (NX - 1) / 2) * S, (j - (NY - 1) / 2) * S, (l - (NZ - 1) / 2) * S), bond = k(G, .26);
    for (let j = 0; j < NY; j++) for (let l = 0; l < NZ; l++) line3(P, n * .005, at(0, j, l), at(NX - 1, j, l), bond, .006, 0, pv);
    for (let i = 0; i < NX; i++) for (let l = 0; l < NZ; l++) line3(P, n * .0035, at(i, 0, l), at(i, NY - 1, l), bond, .006, 0, pv);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) line3(P, n * .0025, at(i, j, 0), at(i, j, NZ - 1), bond, .006, 0, pv);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) for (let l = 0; l < NZ; l++) atom(P, n * .0105, ...at(i, j, l), R, G, 0, pv);
  }, .64),

  /* Alloy: the same lattice with a second element in it (bigger copper atoms, small ones in the gaps); the ram pushes, it holds */
  alloy: () => build(N, 305, (P, n) => {
    const NX = 5, NY = 4, NZ = 3, S = .74, vw = view(.5, .42, 0, -.45);
    const big = (i, j, l) => i >= 0 && i < NX && j >= 0 && j < NY && l >= 0 && l < NZ && ((i * 7 + j * 13 + l * 5) % 7 === 0 || (i === 3 && j === 2 && l === 2));
    const at = (i, j, l) => { let p = [(i - (NX - 1) / 2) * S, (j - (NY - 1) / 2) * S, (l - (NZ - 1) / 2) * S]; for (const [a, b, c] of [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]]) if (big(i + a, j + b, l + c)) p = [p[0] - a * .05, p[1] - b * .05, p[2] - c * .05]; return vw(...p); };
    const bond = k(G, .24);
    for (let j = 0; j < NY; j++) for (let l = 0; l < NZ; l++) for (let i = 0; i < NX - 1; i++) line3(P, n * .0014, at(i, j, l), at(i + 1, j, l), bond, .006);
    for (let i = 0; i < NX; i++) for (let l = 0; l < NZ; l++) for (let j = 0; j < NY - 1; j++) line3(P, n * .0014, at(i, j, l), at(i, j + 1, l), bond, .006);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) for (let l = 0; l < NZ - 1; l++) line3(P, n * .0014, at(i, j, l), at(i, j, l + 1), bond, .006);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) for (let l = 0; l < NZ; l++) { const b = big(i, j, l); atom(P, n * (b ? .016 : .0095), ...at(i, j, l), b ? .22 : .13, b ? mix(C.ice, C.blue, .3) : G); }
    for (let i = 0; i < NX - 1; i++) for (let j = 0; j < NY - 1; j++) for (let l = 0; l < NZ - 1; l++) if ((i + 2 * j + 3 * l) % 3 === 0) { const a = at(i, j, l), b = at(i + 1, j + 1, l + 1); atom(P, n * .0035, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, .075, C.orange); }
    // the ram comes down on it; it does not give
    const top = 1.32;
    P.rect(n * .06, -2.1, top, 4.2, .4, k(ST, .38), 7); P.box(n * .024, -2.1, top, 4.2, .4, W, .01, 7);
    P.seg(n * .012, -2.0, top + .2, 2.0, top + .2, k(W, .35), .006, 7);
    glow(P, n * .012, 0, top - .05, .2, k(C.white, .8), 10); burst(P, n * .008, 0, top - .05, .15, .6, C.orange, 7, -.3, -Math.PI + .3);
  }, .64),

  /* Ferrous: the iron family — wrought iron, carbon steel, alloy steel, cast iron — and a magnet drawing them up */
  ferrous: () => build(N, 306, (P, n) => {
    // the magnet (a visual hint only)
    const U = []; for (let q = 0; q <= 16; q++) { const a = q / 16 * Math.PI; U.push([Math.cos(a) * .66, 1.5 + Math.sin(a) * .66]); }
    U.push([-.66, .98], [-.34, .98]); for (let q = 16; q >= 0; q--) { const a = q / 16 * Math.PI; U.push([Math.cos(a) * .34, 1.5 + Math.sin(a) * .34]); } U.push([.34, .98], [.66, .98]);
    P.poly(n * .05, U, k(C.red, .55)); P.outline(n * .025, U, mix(C.red, C.white, .3), .009);
    [-.5, .5].forEach(x => { P.rect(n * .01, x - .16, .98, .32, .18, k(W, .7)); });
    [-1, 1].forEach(s => [0, 1, 2].forEach(q => P.curve(n * .006, t => { const x0 = s * .5, x1 = s * (.6 + q * 1.05); return [x0 + (x1 - x0) * t, .95 - t * 1.0 - Math.sin(t * Math.PI) * .1 * q]; }, k(G, .35), .008)));
    // the four, rising to it together (group 5)
    const Y = -1.15, g = 5, BIG = (x0) => (x, y, z) => [x0 + x * 1.18, Y + y * 1.18, z];
    // wrought iron: a scroll
    xf(P, BIG(-2.7), () => {
      P.curve(n * .04, t => { const a = t * 2.4 * TAU, r = .04 + t * .34; return [-.25 + Math.cos(a) * r, .2 + Math.sin(a) * r]; }, k(IRON, 1.4), .02, g);
      P.curve(n * .04, t => { const a = Math.PI + t * 2.4 * TAU, r = .04 + t * .34; return [.25 + Math.cos(a) * r, -.2 + Math.sin(a) * r]; }, k(IRON, 1.15), .02, g);
      P.seg(n * .01, .09, .2, -.09, -.2, k(IRON, 1.15), .02, g);
    });
    // carbon steel: an I-beam
    xf(P, BIG(-.9), () => { const I = [[-.45, -.5], [.45, -.5], [.45, -.34], [.09, -.34], [.09, .34], [.45, .34], [.45, .5], [-.45, .5], [-.45, .34], [-.09, .34], [-.09, -.34], [-.45, -.34]]; P.poly(n * .04, I, k(IRON, .7), g); P.outline(n * .025, I, W, .008, g); });
    // alloy steel: a gear
    xf(P, BIG(.9), () => { const gp = gearPts(0, 0, .55, 12, .13); P.poly(n * .05, gp, k(mix(IRON, C.ice, .2), .65), g); P.outline(n * .03, gp, W, .008, g); P.ring(n * .01, 0, 0, .14, k(W, .9), .008, g); });
    // cast iron: a pan
    xf(P, BIG(2.55), () => { const pan = [[-.48, -.3], [.48, -.3], [.6, .12], [-.6, .12]]; P.poly(n * .035, pan, k(IRON, .55), g); P.outline(n * .02, pan, W, .008, g); P.seg(n * .012, .58, .08, 1.0, .32, k(IRON, 1.1), .03, g); P.seg(n * .008, -.6, .12, .6, .12, k(W, .9), .01, g); });
  }, .6),

  /* Non-ferrous: aluminium, copper, lead · silver, tin, zinc — six ingots in their own colours, turning */
  nonferrous: () => build(N, 307, (P, n) => {
    const cols = [C.alu, C.copper, k(mix(C.steel2, C.violet, .15), .95), mix(C.chalk, C.white, .3), mix(C.alu, C.straw, .32), mix(C.steel, C.ice, .45)];
    const spin = [.35, -.42, .3, -.38, .46, -.33];
    cols.forEach((c, q) => { const x = -2.4 + (q % 3) * 2.4, y = q < 3 ? .65 : -1.3; ingot(P, n * .14, x, y, 1.5, .52, .72, c, spin[q]); ellF(P, n * .012, x, y - .45, .85, .1, k(c, .16)); });
  }, .64),

  /* Polymers: thermosetting — a rigid cross-linked net · thermoplastic — loose chains that slide past each other */
  polymers: () => build(N, 308, (P, n) => {
    // thermosetting: set once, a net tied in every direction
    const nodes = [], cols = 7, rows = 8;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) nodes.push([-3.35 + c * .47 + (r % 2) * .235 + P.g() * .05, -1.85 + r * .5 + P.g() * .05]);
    const id = (r, c) => r * cols + c;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const a = nodes[id(r, c)];
      const nb = [c < cols - 1 ? id(r, c + 1) : -1, r < rows - 1 ? id(r + 1, c) : -1, r < rows - 1 ? (r % 2 ? (c < cols - 1 ? id(r + 1, c + 1) : -1) : (c > 0 ? id(r + 1, c - 1) : -1)) : -1];
      nb.forEach(j => { if (j >= 0) P.seg(n * .0016, a[0], a[1], nodes[j][0], nodes[j][1], k(G, .42), .006); });
    }
    nodes.forEach(([x, y]) => { P.disc(n * .0016, x, y, .06, mix(G, C.white, .2)); });
    // thermoplastic: long chains, every other one sliding
    for (let c = 0; c < 7; c++) {
      const x0 = .55 + c * .45, ph = c * 1.7, amp = .1 + (c % 3) * .04, g = c % 2 ? 5 : 0, col = c % 2 ? mix(C.ice, C.violet, .35) : C.ice;
      const f = t => [x0 + Math.sin(t * 9 + ph) * amp + Math.sin(t * 3.1 + ph * 2) * .08, -1.7 + t * 3.35];
      P.curve(n * .02, f, k(col, .55), .01, g);
      for (let b = 0; b < 26; b++) { const p = f(b / 25); P.disc(n * .0012, p[0], p[1], .045, col, g); }
    }
    P.seg(n * .01, 0, -1.9, 0, 1.85, k(W, .12), .006);
  }, .62),

  /* Ceramics: refractories (a firebrick in the flame), abrasives (a grit wheel), glass (a pane), cement and concrete (a slab) */
  ceramics: () => build(N, 309, (P, n) => {
    // refractory: a firebrick holding a flame
    const bv = view(.5, .32, -2.7, -1.25);
    xf(P, (x, y, z) => bv(x, y, z), () => P.cuboid(n * .09, 0, 0, 0, 1.25, .5, .6, CLAY));
    const tp = [[-.625, .25, -.3], [.625, .25, -.3], [.625, .25, .3], [-.625, .25, .3]].map(p => bv(...p));
    for (let s = 0; s < 4; s++) line3(P, n * .006, tp[s], tp[(s + 1) % 4], C.orange);
    for (let q = 0; q < n * .03; q++) { const t = P.r(), x = (P.r() - .5) * .9 * (1 - t * .7); P.pt(-2.7 + x, -.95 + t * .75 + P.g() * .02, 0, mix(C.yellow, C.hot, t), 0); }
    P.sparks(n * .03, -2.7, -.5, .22, C.orange);
    // abrasive: a grit wheel, spinning
    const pv = [-.9, -.75, 0, 1.6];
    for (let q = 0; q < n * .07; q++) { const a = P.r() * TAU, d = .18 + Math.sqrt(P.r()) * .55; P.pt(-.9 + Math.cos(a) * d, -.75 + Math.sin(a) * d, P.g() * .02, P.r() < .35 ? k(W, .75) : k(mix(CLAY, ST, .5), .45), 6, pv); }
    P.ring(n * .02, -.9, -.75, .74, k(W, .7), .01, 6, pv); P.ring(n * .012, -.9, -.75, .18, W, .008, 6, pv);
    // glass: a pane with a glint sliding across it
    const gv = view(.6, .1, .9, -.75);
    for (let q = 0; q < n * .04; q++) P.pt(...gv((P.r() - .5) * 1.0, (P.r() - .5) * 1.5, (P.r() - .5) * .05), k(GLASS, .2));
    xf(P, (x, y, z) => gv(x, y, z), () => { P.box(n * .026, -.5, -.75, 1.0, 1.5, GLASS, .008); P.seg(n * .012, -.3, -.15, .05, .2, C.white, .014, 5); P.seg(n * .007, -.15, -.2, .12, .07, k(C.white, .7), .01, 5); });
    // cement and concrete: a slab with stones in it
    const sv = view(-.5, .35, 2.7, -1.2);
    xf(P, (x, y, z) => sv(x, y, z), () => P.cuboid(n * .1, 0, 0, 0, 1.35, .48, .8, mix(W, ST, .5)));
    for (let q = 0; q < 40; q++) { const x = (P.r() - .5) * 1.25, y = (P.r() - .5) * .38; const p = sv(x, y, .4); P.disc(n * .0006, p[0], p[1], .025 + P.r() * .03, k(W, .8)); }
  }, .62),

  /* Rubber and elastomers: a band pulled long and thin with each stroke, then let go — it comes back to its first size */
  elastomers: () => build(N, 310, (P, n) => {
    // the first size, always there to compare against
    xf(P, shift(0, -.2), () => {
      loop(P, n * .02, -1.05, 1.05, 0, .36, k(RUBBER, .3), .015);
      // let go: short and thick
      loop(P, n * .16, -1.05, 1.05, 0, .36, RUBBER, .11, 10);
      [-1.05, 1.05].forEach(x => { P.disc(n * .012, x, 0, .14, k(ST, .85), 10); P.ring(n * .01, x, 0, .14, W, .008, 10); });
      // pulled: long and thin
      loop(P, n * .17, -2.95, 2.95, 0, .2, mix(RUBBER, C.hot, .25), .055, 11);
      [-2.95, 2.95].forEach(x => { P.disc(n * .012, x, 0, .14, k(ST, .85), 11); P.ring(n * .01, x, 0, .14, W, .008, 11); });
      [-1, 1].forEach(s => { P.arrow(n * .02, s * 1.6, .85, s * 2.85, .85, C.orange, .2, 11); P.arrow(n * .02, s * 1.6, -.85, s * 2.85, -.85, C.orange, .2, 11); });
      // its length now vs then
      dash(P, n * .014, -1.41, -1.25, 1.41, -1.25, k(W, .45), .1, .07, .008);
      [-1.41, 1.41].forEach(x => P.seg(n * .002, x, -1.35, x, -1.15, k(W, .45), .006));
      P.seg(n * .02, -3.15, -1.55, 3.15, -1.55, k(C.orange, .7), .008, 11); [-3.15, 3.15].forEach(x => P.seg(n * .003, x, -1.65, x, -1.45, k(C.orange, .7), .006, 11));
    });
  }, .6)
});
