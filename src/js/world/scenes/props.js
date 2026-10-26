// Immersive scenes — props (names and captions: info.js · SCENES_BY_ZONE.props; what to draw: docs/SCENES.md; how: STYLE.md).
// Zone colour: bronze. Seeds 5xx.
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
function gline(P, n, x1, y1, x2, y2, c1, c2, j = .01, g = 0) { for (let q = 0; q < n; q++) { const t = P.r(); P.pt(x1 + (x2 - x1) * t + P.g() * j, y1 + (y2 - y1) * t + P.g() * j, P.g() * j, mix(c1, c2, t), g); } }
function dash(P, n, x1, y1, x2, y2, c, on = .13, off = .09, j = .011, g = 0) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, per = on + off, m = Math.ceil(L / per);
  for (let q = 0; q < n; q++) { let t; do t = (Math.floor(P.r() * m) * per + P.r() * Math.min(on, L)) / L; while (t > 1); P.pt(x1 + (x2 - x1) * t + P.g() * j, y1 + (y2 - y1) * t + P.g() * j, P.g() * j, c, g); }
}
function glow(P, n, x, y, s, c, g = 0, pv) { for (let q = 0; q < n; q++) P.pt(x + P.g() * s, y + P.g() * s, P.g() * s * .5, c, g, pv); }
function burst(P, n, x, y, r0, r1, c, rays = 9, a0 = 0, a1 = Math.PI, g = 10) {
  for (let q = 0; q < n; q++) { const kk = Math.floor(P.r() * rays), a = a0 + (a1 - a0) * (kk + .5) / rays, len = r1 * (.55 + .45 * ((kk * .618) % 1)), t = Math.pow(P.r(), 1.5), d = r0 + (len - r0) * t; P.pt(x + Math.cos(a) * d + P.g() * .01, y + Math.sin(a) * d + P.g() * .01, P.g() * .02, mix(C.white, c, t), g); }
}
function dim(P, n, x1, y1, x2, y2, c, g = 0, head = .1) {
  P.seg(Math.round(n * .7), x1, y1, x2, y2, c, .007, g); const a = Math.atan2(y2 - y1, x2 - x1);
  [[x1, y1, a], [x2, y2, a + Math.PI]].forEach(([x, y, b]) => [b + .5, b - .5].forEach(d => P.seg(Math.round(n * .075), x, y, x + Math.cos(d) * head, y + Math.sin(d) * head, c, .006, g)));
}
function line3(P, n, a, b, c, j = .008, g = 0, pv) { P.curve(n, t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], c, j, g, pv); }
/** corners of a bar from (x1, y1) to (x2, y2), w wide */
const barPts = (x1, y1, x2, y2, w) => { const a = Math.atan2(y2 - y1, x2 - x1), sx = -Math.sin(a) * w / 2, sy = Math.cos(a) * w / 2; return [[x1 + sx, y1 + sy], [x2 + sx, y2 + sy], [x2 - sx, y2 - sy], [x1 - sx, y1 - sy]]; };
/** a coil spring along y from y0 to y1 (side view of a helix, shaded by depth) */
function coil(P, n, cx, y0, y1, r, turns, c, g = 0, w = .025) { for (let q = 0; q < n; q++) { const t = P.r(), a = t * turns * TAU, z = Math.cos(a) * r; P.pt(cx + Math.sin(a) * r + P.g() * w, y0 + (y1 - y0) * t + P.g() * w, z, k(c, .45 + .55 * (z / r * .5 + .5)), g); } }
function hatch(P, n, x0, x1, y, c, down = true, step = .14) { for (let x = x0; x < x1; x += step) P.seg(Math.max(1, Math.round(n * step / (x1 - x0))), x, y, x + .1, y + (down ? -.12 : .12), c, .005); }
/** a little flame (static), base at (x, y) */
function flame(P, n, x, y, h, w, g = 0) { for (let q = 0; q < n; q++) { const t = Math.pow(P.r(), .8), half = w * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (1 - t * .6); P.pt(x + (P.r() * 2 - 1) * half, y + t * h, P.g() * .02, mix(mix(C.white, C.yellow, Math.min(1, t * 2)), C.hot, Math.max(0, t - .4) / .6), g); } }

/* the colours of this zone */
const BR = C.bronze, ST = C.steel, W = C.chalk, HOT = C.hot;
const IRON = mix(C.steel2, C.steel, .4), RUST = mix(C.red, C.bronze, .45);

export default N => ({
  /* ★ Properties of metals: an anvil, a hot bar on it, the hammer coming down — hard enough to take it, tough enough not to
     break; every blow throws sparks, embers keep rising */
  anvil: () => build(N, 501, (P, n) => {
    const anvil = [[-2.75, -.36], [-2.3, -.27], [-1.8, -.22], [-1.25, -.2], [1.55, -.2], [1.55, -.55], [1.2, -.82], [.85, -.95], [.6, -1.25], [.58, -1.55], [.8, -1.8], [1.4, -1.88], [1.45, -2.1], [-1.35, -2.1], [-1.3, -1.88], [-.75, -1.8], [-.55, -1.55], [-.57, -1.25], [-.8, -.95], [-1.1, -.78], [-1.5, -.62], [-2.0, -.5], [-2.45, -.42]];
    ellF(P, n * .05, .15, .05, 2.2, 1.3, k(C.orange, .05));
    P.poly(n * .17, anvil, k(mix(IRON, BR, .2), .42)); P.outline(n * .07, anvil, k(W, .82), .01);
    P.curve(n * .02, t => { const y = -.8 - t * 1.0; return [-.8 + (t < .5 ? t * .5 : .25 - (t - .5) * .5) - .02, y]; }, k(BR, .7), .01);
    gline(P, n * .03, -1.25, -.2, 1.55, -.2, k(W, .8), C.white, .008);
    P.curve(n * .015, t => [-2.75 + t * 1.5, -.36 + Math.sin(t * Math.PI / 2) * .16], k(W, .9), .008);
    P.rect(n * .004, 1.12, -.34, .18, .12, k(ST, .2));
    P.seg(n * .02, -1.4, -2.1, 1.5, -2.1, k(BR, .6), .01);
    // the hot bar, its glow on the face, the tongs holding it
    P.rect(n * .06, -.8, -.2, 1.8, .26, mix(C.orange, C.yellow, .25)); P.box(n * .02, -.8, -.2, 1.8, .26, C.yellow, .008);
    glow(P, n * .02, .1, -.08, .35, k(C.orange, .35)); ellF(P, n * .02, .1, -.22, 1.3, .06, k(C.orange, .35));
    P.line(n * .015, [[-.75, -.02], [-1.6, .45], [-2.5, .7]], k(ST, .8), .016); P.line(n * .015, [[-.75, -.14], [-1.62, .3], [-2.55, .5]], k(ST, .8), .016);
    // the hammer (the ram): it comes down on the bar
    const head = [[-.08, .06], [.78, .06], [.84, .15], [.84, 1.0], [-.14, 1.0], [-.14, .15]];
    P.poly(n * .06, head, k(ST, .45), 7); P.outline(n * .03, head, W, .009, 7); P.seg(n * .012, -.08, .07, .78, .07, C.white, .008, 7);
    const handle = barPts(.84, .58, 2.95, 1.12, .15);
    P.poly(n * .03, handle, k(BR, .55), 7); P.outline(n * .016, handle, mix(BR, C.white, .4), .008, 7);
    // the blow: a flash at the contact, sparks thrown out in arcs to either side
    glow(P, n * .02, .35, .06, .1, C.white, 10); glow(P, n * .02, .35, .06, .32, k(C.yellow, .5), 10);
    for (let j = 0; j < 26; j++) { const side = j % 2 ? 1 : -1, a = .15 + P.r() * .95, v = 1.9 + P.r() * 1.5, T = .5 + P.r() * .35, vx = side * Math.cos(a) * v, vy = Math.sin(a) * v;
      for (let q = 0; q < n * .0036; q++) { const t = P.r(), tt = t * T; P.pt(.35 + side * .32 + vx * tt, .08 + vy * tt - 2.4 * tt * tt, P.g() * .05, mix(C.white, mix(C.orange, C.red, t), Math.min(1, t * 1.3)), 10); } }
    // embers rising from the hot bar, always
    for (let q = 0; q < n * .06; q++) P.pt(-.75 + P.r() * 1.7, .35 + P.g() * .06, P.g() * .25, mix(mix(C.orange, C.yellow, P.r()), C.white, P.r() * .3), 8);
  }, .66),

  /* Hardness: a diamond pressed into the surface leaves only a small mark · a scratch line drawn across it */
  hardness: () => build(N, 502, (P, n) => {
    const vw = view(0, .55, 0, -1.25), top = .35;
    xf(P, (x, y, z) => vw(x, y, z), () => P.cuboid(n * .16, 0, 0, 0, 5.8, .7, 2.0, k(mix(BR, ST, .45), .9)));
    const E = [[[-2.9, top, -1], [2.9, top, -1]], [[2.9, top, -1], [2.9, top, 1]], [[2.9, top, 1], [-2.9, top, 1]], [[-2.9, top, 1], [-2.9, top, -1]], [[-2.9, -top, 1], [2.9, -top, 1]], [[-2.9, top, 1], [-2.9, -top, 1]], [[2.9, top, 1], [2.9, -top, 1]]];
    E.forEach(([a, b]) => line3(P, n * .012, vw(...a), vw(...b), k(W, .7), .007));
    // the indent: a small diamond-shaped mark (Vickers), lit while the point is in it
    const IX = -1.3, IZ = .1, d = .3, pts = [[IX - d, IZ], [IX, IZ - d], [IX + d, IZ], [IX, IZ + d]].map(([x, z]) => vw(x, top, z));
    for (let s = 0; s < 4; s++) line3(P, n * .006, pts[s], pts[(s + 1) % 4], C.white, .006);
    line3(P, n * .005, pts[0], pts[2], k(W, .7), .005); line3(P, n * .005, pts[1], pts[3], k(W, .7), .005);
    const c0 = vw(IX, top, IZ);
    glow(P, n * .012, c0[0], c0[1], .1, C.white, 10); burst(P, n * .01, c0[0], c0[1], .1, .6, C.ice, 8, .15, Math.PI - .15);
    // the indenter (the ram): a diamond point on a holder
    const tip = [[c0[0], c0[1] - .02], [c0[0] + .26, c0[1] + .42], [c0[0] - .26, c0[1] + .42]];
    P.poly(n * .025, tip, mix(C.ice, C.white, .4), 7); P.outline(n * .015, tip, C.white, .007, 7);
    P.rect(n * .035, c0[0] - .3, c0[1] + .42, .6, 1.35, k(ST, .38), 7); P.box(n * .016, c0[0] - .3, c0[1] + .42, .6, 1.35, W, .008, 7);
    // the scratch: a stylus has drawn a bright line across the surface
    const s0 = vw(.2, top, .55), s1 = vw(2.4, top, -.35);
    for (let q = 0; q < n * .03; q++) { const t = P.r(); P.pt(s0[0] + (s1[0] - s0[0]) * t + P.g() * .01, s0[1] + (s1[1] - s0[1]) * t + P.g() * .01, 0, mix(k(W, .5), C.white, t)); }
    for (let q = 0; q < 6; q++) { const t = .15 + q * .15; glow(P, n * .002, s0[0] + (s1[0] - s0[0]) * t, s0[1] + (s1[1] - s0[1]) * t, .02, C.white); }
    P.line(n * .02, [[s1[0], s1[1]], [s1[0] + .35, s1[1] + .9], [s1[0] + .5, s1[1] + 1.6]], k(ST, .9), .02);
    glow(P, n * .006, s1[0], s1[1], .04, C.white); P.sparks(n * .006, s1[0], s1[1] + .25, .04, C.yellow);
  }, .62),

  /* Ductility: a rod drawn through a die comes out as fine wire, wound onto a turning drum */
  ductile: () => build(N, 503, (P, n) => {
    P.rect(n * .1, -3.6, -.32, 2.7, .64, k(BR, .42)); P.seg(n * .02, -3.6, .32, -.9, .32, mix(BR, C.white, .4), .008); P.seg(n * .02, -3.6, -.32, -.9, -.32, mix(BR, C.white, .3), .008);
    P.seg(n * .012, -3.6, .18, -.9, .18, k(C.white, .35), .01);
    P.poly(n * .02, [[-.9, .32], [-.2, .06], [-.2, -.06], [-.9, -.32]], k(BR, .5));
    // the die: a block with a hole that narrows
    const up = [[-1.1, 1.05], [.15, 1.05], [.15, .07], [-.2, .07], [-.9, .36], [-1.1, .36]], dn = up.map(([x, y]) => [x, -y]);
    [up, dn].forEach(p => { P.poly(n * .05, p, k(ST, .38)); P.outline(n * .025, p, k(W, .8), .009); });
    glow(P, n * .008, .15, 0, .05, C.white);
    // the fine wire: a thin line that keeps running out of the die (conveyor marks) …
    P.seg(n * .03, .15, 0, 3.0, 0, k(BR, .75), .008);
    for (let q = 0; q < n * .05; q++) { const p = Math.floor(P.r() * 22), x = -4.4 + p * .4 + P.r() * .2; P.pt(x, P.g() * .012, 0, mix(BR, C.white, .55), 9); }
    // … onto a drum that turns with it
    const DX = 3.0, DY = -.6, R = .6, pv = [DX, DY, 0, -.92];
    for (let r = 0; r < 6; r++) P.ring(n * .012, DX, DY, .38 + r * .043, k(mix(BR, C.yellow, r / 6), .8), .006, 6, pv);
    P.ring(n * .02, DX, DY, .72, k(ST, .9), .01, 6, pv); P.ring(n * .01, DX, DY, .12, W, .008, 6, pv);
    for (let s = 0; s < 4; s++) P.seg(n * .006, DX, DY, DX + Math.cos(s * TAU / 4) * .34, DY + Math.sin(s * TAU / 4) * .34, k(W, .7), .01, 6, pv);
    P.seg(n * .015, DX, DY, DX - .2, -2.0, k(ST, .5), .02); P.seg(n * .015, DX, DY, DX + .2, -2.0, k(ST, .5), .02);
  }, .62),

  /* Brittleness: cast iron, struck, snaps in two — no stretching, just shards */
  brittle: () => build(N, 504, (P, n) => {
    [-2.0, 2.0].forEach(x => { const t = [[x, -.3], [x + .28, -.78], [x - .28, -.78]]; P.poly(n * .015, t, k(ST, .4)); P.outline(n * .012, t, W, .008); P.rect(n * .012, x - .55, -1.0, 1.1, .22, k(ST, .3)); });
    // intact while the ram is up
    P.rect(n * .1, -2.6, -.3, 5.2, .42, k(IRON, .55), 11); P.box(n * .03, -2.6, -.3, 5.2, .42, mix(IRON, C.white, .45), .008, 11);
    // snapped on the stroke: two straight halves, a jagged break, shards flying
    const jag = [[-.03, .12], [.04, .03], [-.05, -.06], [.03, -.15], [-.04, -.22], [.02, -.3]];
    [[-1, -2.0, -.12], [1, 2.0, .12]].forEach(([s, px, a]) => xf(P, (x, y, z) => { const c = Math.cos(a), sn = Math.sin(a), dx = x - px, dy = y + .3; return [px + dx * c - dy * sn, -.3 + dx * sn + dy * c, z]; }, () => {
      const half = s < 0 ? [[-2.6, -.3], ...jag.map(([x, y]) => [x - .03, y]).reverse(), [-2.6, .12]] : [[2.6, -.3], [2.6, .12], ...jag.map(([x, y]) => [x + .03, y])];
      P.poly(n * .05, half, k(IRON, .55), 10); P.outline(n * .025, half, mix(IRON, C.white, .45), .008, 10);
      P.line(n * .01, jag.map(([x, y]) => [x + s * .03, y]), C.white, .006, 10);
    }));
    for (let q = 0; q < 14; q++) { const a = -.3 + P.r() * (Math.PI + .6), d = .35 + P.r() * .9, x = Math.cos(a) * d, y = -.15 + Math.sin(a) * d * .8, sz = .05 + P.r() * .07; const tri = [[x, y + sz], [x + sz, y - sz * .6], [x - sz * .8, y - sz * .4]]; P.poly(n * .002, tri, mix(C.ice, C.white, .5), 10); }
    glow(P, n * .012, 0, -.1, .1, C.white, 10); burst(P, n * .015, 0, -.1, .1, 1.1, C.ice, 11, -.4, Math.PI + .4);
    P.sparks(n * .01, 0, .2, .1, k(C.ice, .6));
    // the ram with a round nose
    const nose = []; for (let q = 0; q <= 12; q++) { const a = Math.PI + q / 12 * Math.PI; nose.push([Math.cos(a) * .3, .18 + Math.sin(a) * .3]); }
    const ram = [...nose, [.3, 1.5], [-.3, 1.5]];
    P.poly(n * .035, ram, k(ST, .42), 7); P.outline(n * .018, ram, W, .008, 7);
    P.rect(n * .015, -.8, 1.5, 1.6, .3, k(ST, .35), 7);
  }, .6),

  /* Toughness: the hammer blow is taken — the bar bends and dents, the shock spreads through it, nothing breaks */
  tough: () => build(N, 505, (P, n) => {
    [-2.0, 2.0].forEach(x => { const t = [[x, -.3], [x + .28, -.78], [x - .28, -.78]]; P.poly(n * .015, t, k(ST, .4)); P.outline(n * .012, t, W, .008); P.rect(n * .012, x - .55, -1.0, 1.1, .22, k(ST, .3)); });
    const bent = d => x => -d * Math.max(0, 1 - (x / 2.0) ** 2) - (Math.abs(x) > 2.0 ? (Math.abs(x) - 2.0) * d * .9 : 0);
    const bar = (d, g, c, ce) => { const f = bent(d); for (let q = 0; q < n * .1; q++) { const x = -2.6 + P.r() * 5.2, y = f(x) - .3 + P.r() * .42; P.pt(x, y, P.g() * .01, c, g); } [-.3, .12].forEach(o => P.curve(n * .025, t => { const x = -2.6 + t * 5.2; return [x, f(x) + o]; }, ce, .007, g)); };
    bar(.08, 11, k(BR, .5), mix(BR, C.white, .4));
    bar(.35, 10, k(mix(BR, HOT, .35), .6), mix(HOT, C.white, .4));
    // the dent it keeps
    ell(P, n * .01, 0, .12 - .08, .3, .07, C.yellow, .008, 11, Math.PI, TAU);
    // the shock spreading through the bar, taken in
    [.35, .7, 1.1, 1.5].forEach((r, q) => ell(P, n * .012, 0, -.09 - .35, r, .12 + q * .02, k(mix(C.yellow, HOT, q / 3), 1 - q * .18), .008, 10, Math.PI + .25, TAU - .25));
    [.35, .7, 1.1, 1.5].forEach((r, q) => ell(P, n * .008, 0, -.09 - .35, r, .12 + q * .02, k(mix(C.yellow, HOT, q / 3), .7 - q * .12), .008, 10, .25, Math.PI - .25));
    glow(P, n * .012, 0, -.23, .1, C.white, 10);
    // the hammer (the ram)
    const head = [[-.36, -.22], [.36, -.22], [.4, -.14], [.4, .55], [-.4, .55], [-.4, -.14]];
    P.poly(n * .04, head, k(ST, .45), 7); P.outline(n * .02, head, W, .008, 7);
    P.line(n * .025, [[.4, .25], [1.4, .55], [2.6, .95]], k(BR, .9), .035, 7);
  }, .6),

  /* Malleability: a hot slab rolled into thin sheet between two turning rolls */
  malleable: () => build(N, 506, (P, n) => {
    const R = .9, CY = .98, bite = x => CY - Math.sqrt(Math.max(0, R * R - x * x));
    const slab = [[-3.6, .3], [-.59, .3]]; for (let q = 1; q <= 10; q++) { const x = -.59 + q * .059; slab.push([x, Math.max(.04, bite(x))]); }
    const slabB = slab.map(([x, y]) => [x, -y]).reverse(), poly = [...slab, ...slabB];
    P.poly(n * .12, poly, mix(C.orange, BR, .45)); P.outline(n * .03, poly, C.yellow, .008);
    glow(P, n * .02, -2.0, 0, .4, k(C.orange, .3));
    P.sparks(n * .03, -2.0, .55, .7, C.orange);
    // the sheet: thin, running out to the right (conveyor marks)
    P.seg(n * .04, 0, .03, 3.6, .03, k(BR, .8), .006); P.seg(n * .04, 0, -.03, 3.6, -.03, k(BR, .8), .006);
    for (let q = 0; q < n * .05; q++) { const p = Math.floor(P.r() * 16), x = -4.4 + p * .55 + P.r() * .3; P.pt(x, P.g() * .02, 0, mix(BR, C.yellow, .5), 9); }
    // the rolls: the top turns one way, the bottom the other, their rims moving with the sheet
    [[CY, -.61], [-CY, .61]].forEach(([cy, sp]) => {
      const pv = [0, cy, 0, sp];
      for (let q = 0; q < n * .05; q++) { const a = P.r() * TAU, d = Math.sqrt(P.r()) * R; P.pt(Math.cos(a) * d, cy + Math.sin(a) * d, P.g() * .02, k(ST, .22), 6, pv); }
      P.ring(n * .03, 0, cy, R, k(W, .8), .009, 6, pv); P.ring(n * .012, 0, cy, .2, W, .008, 6, pv);
      for (let s = 0; s < 6; s++) { const a = s / 6 * TAU; P.seg(n * .006, Math.cos(a) * .2, cy + Math.sin(a) * .2, Math.cos(a) * .78, cy + Math.sin(a) * .78, k(W, .5), .01, 6, pv); }
      for (let s = 0; s < 3; s++) { const a = s / 3 * TAU + .5; glow(P, n * .002, Math.cos(a) * .84, cy + Math.sin(a) * .84, .02, C.white, 6, pv); }
    });
    [-1.2, 1.2].forEach(x => { P.seg(n * .02, x, -2.15, x, 2.15, k(ST, .4), .03); });
    P.seg(n * .015, -1.35, 2.15, 1.35, 2.15, k(ST, .4), .03); P.seg(n * .015, -1.35, -2.15, 1.35, -2.15, k(ST, .4), .03);
  }, .62),

  /* Castability: molten metal poured from a ladle runs through the mould and fills the cavity (a wheel) */
  castable: () => build(N, 507, (P, n) => {
    // the mould: two halves of sand in a frame, a parting line
    P.rect(n * .06, -.7, -2.1, 3.9, 1.75, k(mix(BR, W, .3), .14)); P.box(n * .03, -.7, -2.1, 3.9, 1.75, k(ST, .85), .009);
    dash(P, n * .015, -.7, -1.2, 3.2, -1.2, k(ST, .6), .14, .08, .007);
    // the channels and the cavity
    const metal = mix(C.orange, C.yellow, .35);
    P.poly(n * .015, [[-.4, -.35], [.4, -.35], [.14, -.62], [-.14, -.62]], metal);
    P.rect(n * .02, -.12, -1.62, .24, 1.0, metal); P.rect(n * .02, -.12, -1.62, 1.4, .2, metal);
    const WX = 1.95, WY = -1.22, wheel = (lo) => { for (let q = 0; q < n * .09; q++) { const a = P.r() * TAU, d = Math.sqrt(P.r()) * .66, x = WX + Math.cos(a) * d, y = WY + Math.sin(a) * d; const rim = d > .5, hub = d < .2 && d > .07, spoke = d <= .5 && d >= .2 && [0, 1, 2, 3].some(s => Math.abs(((a - s * Math.PI / 2 + TAU + Math.PI / 4) % (Math.PI / 2)) - Math.PI / 4) * d < .06); if (!(rim || hub || spoke)) continue; if (lo ? y > WY : y <= WY) continue; P.pt(x, y, P.g() * .02, metal, lo ? 0 : 10); } };
    wheel(true); wheel(false);
    P.ring(n * .02, WX, WY, .66, C.yellow, .008); P.ring(n * .01, WX, WY, .5, k(C.yellow, .6), .007);
    P.rect(n * .01, WX - .1, -.56, .2, .21, metal, 10);
    // the ladle pours
    const tilt = place(-1.5, .85, -.62), cup = [[-.45, .38], [.45, .38], [.34, -.36], [-.34, -.36]];
    xf(P, tilt, () => { P.poly(n * .02, cup, k(ST, .3)); P.outline(n * .03, cup, k(W, .9), .01); P.seg(n * .02, -.45, .1, -1.3, .3, k(ST, .75), .04); });
    const cupW = cup.map(c => tilt(c[0], c[1], 0)), lip = tilt(.45, .38, 0);
    for (let q = 0, t = 0; q < n * .04 && t < n; t++) { const x = -2.3 + P.r() * 1.3, y = .1 + P.r() * .9; let inside = false; for (let a = 0, b = cupW.length - 1; a < cupW.length; b = a++) { const [xa, ya] = cupW[a], [xb, yb] = cupW[b]; if ((ya > y) !== (yb > y) && x < (xb - xa) * (y - ya) / (yb - ya) + xa) inside = !inside; } if (inside && y < lip[1] - .02) { P.pt(x, y, 0, mix(C.yellow, C.white, P.r() * .4)); q++; } }
    [0, 10, 11].forEach(g => P.curve(n * .02, t => [lip[0] + .05 + t * (-lip[0] - .05) + Math.sin(t * Math.PI) * .12, lip[1] - t * (lip[1] + .35)], g ? C.white : C.yellow, g ? .012 : .028, g));
    P.sparks(n * .02, 0, -.1, .2, C.orange); P.sparks(n * .01, WX, -.25, .1, C.orange);
  }, .62),

  /* Resilience: a weight drops on a spring — the spring takes the shock and gives it back */
  resilience: () => build(N, 508, (P, n) => {
    P.rect(n * .03, -1.3, -2.15, 2.6, .25, k(ST, .4)); P.box(n * .014, -1.3, -2.15, 2.6, .25, k(W, .75), .008);
    coil(P, n * .16, 0, -1.9, -.3, .5, 7, BR, 11);
    coil(P, n * .16, 0, -1.9, -.9, .52, 7, mix(BR, HOT, .55), 10);
    glow(P, n * .02, 0, -1.4, .3, k(C.orange, .35), 10);
    // the cap and the weight (the ram): it lands, the spring shortens, then it is thrown back up
    P.rect(n * .03, -.75, -.9, 1.5, .18, k(ST, .5), 7); P.box(n * .012, -.75, -.9, 1.5, .18, W, .008, 7);
    P.rect(n * .07, -.65, -.72, 1.3, 1.05, k(ST, .35), 7); P.box(n * .025, -.65, -.72, 1.3, 1.05, W, .009, 7);
    P.arrow(n * .015, 0, .7, 0, .45, k(HOT, .9), .14, 7);
    [-1, 1].forEach(s => burst(P, n * .008, s * .78, -.85, .05, .5, C.orange, 4, s > 0 ? -.4 : Math.PI - .4, s > 0 ? .4 : Math.PI + .4));
    // and it springs back: the up-arrows once it is released
    [-1.25, 1.25].forEach(x => P.arrow(n * .015, x, -1.4, x, -.2, k(BR, .95), .16, 11));
    dim(P, n * .02, 1.75, -1.9, 1.75, -.3, k(BR, .7), 11); dim(P, n * .02, 1.75, -1.9, 1.75, -.9, k(HOT, .9), 10);
  }, .6),

  /* Machinability: a bar turning in the lathe, the tool taking a cut, the chip curling away in temper colours */
  machinable: () => build(N, 509, (P, n) => {
    P.lathe(n * .07, [[.9, -.35], [.9, .35]], k(ST, .7), { axis: 'x', cx: -2.65, cy: .1, speed: 2.0 });
    for (let s = 0; s < 3; s++) { const a = s / 3 * TAU; for (let q = 0; q < n * .006; q++) { const x = -2.6 + P.r() * .35, r = .62 + P.r() * .28; P.pt(x, .1 + Math.cos(a) * r, Math.sin(a) * r, k(W, .9), 12, [0, .1, 0, 2.0]); } }
    P.lathe(n * .16, [[.55, -2.3], [.55, .3], [.45, .34], [.45, 2.6]], mix(BR, C.white, .1), { axis: 'x', cx: 0, cy: .1, speed: 2.0 });
    for (let s = 0; s < 4; s++) { const a = s / 4 * TAU; for (let q = 0; q < n * .006; q++) { const x = -2.3 + P.r() * 2.6; P.pt(x, .1 + Math.cos(a) * .555, Math.sin(a) * .555, k(C.white, .7), 12, [0, .1, 0, 2.0]); } }
    for (let q = 0; q < n * .02; q++) { const x = .34 + P.r() * 2.26, a = x * 18; P.pt(x, .1 + Math.cos(a) * .455, Math.sin(a) * .455, k(C.white, .55), 12, [0, .1, 0, 2.0]); }
    P.poly(n * .015, [[2.6, .4], [3.2, .1], [2.6, -.2]], k(ST, .5)); P.rect(n * .02, 3.2, -.25, .4, .7, k(ST, .35));
    // the tool, under the bar at the step
    const tool = [[.27, -.38], [.48, -.6], [.75, -.6], [.75, -2.0], [.2, -2.0], [.2, -.6]];
    P.poly(n * .03, tool, k(ST, .45)); P.outline(n * .018, tool, W, .008); glow(P, n * .008, .3, -.4, .05, C.white);
    // the chip: a coil leaving the tool, turning as it goes, in the colours heat gives steel
    const TEMPER = [C.straw, C.gold, C.amber, C.bronze, C.plum, C.violet, C.blue];
    P.curve(n * .012, t => [.32 + t * .3, -.45 - t * .45], C.straw, .02);
    for (let q = 0; q < n * .08; q++) { const t = P.r(), x = .6 + t * 2.0, a = t * 7 * TAU, r = .26 - t * .05, i = Math.min(TEMPER.length - 1.001, t * (TEMPER.length - 1)), c = mix(TEMPER[Math.floor(i)], TEMPER[Math.floor(i) + 1], i % 1); P.pt(x + P.g() * .01, -1.12 + Math.cos(a) * r, Math.sin(a) * r, c, 12, [0, -1.12, 0, 2.6]); }
  }, .62),

  /* Weldability: two plates joined by a bead; the torch moves on, the bead cools behind it */
  weldable: () => build(N, 510, (P, n) => {
    const vw = view(0, .95, 0, -.75), TX = 1.2;
    const plate = (z0, z1) => { const pts = [[-3.1, z0], [3.1, z0], [3.1, z1], [-3.1, z1]].map(([x, z]) => vw(x, 0, z)); for (let q = 0; q < n * .1; q++) { const x = -3.1 + P.r() * 6.2, z = z0 + P.r() * (z1 - z0); P.pt(...vw(x, 0, z), k(ST, .25)); } for (let s = 0; s < 4; s++) line3(P, n * .012, pts[s], pts[(s + 1) % 4], k(W, .6), .007); };
    plate(.07, 1.45); plate(-1.45, -.07);
    // the bead: ripples laid down behind the torch, white-hot at the torch, cooling back to dark metal
    const heat = x => x > TX - .3 ? mix(C.yellow, C.white, (x - TX + .3) / .3) : x > TX - 1.4 ? mix(C.orange, C.yellow, (x - TX + 1.4) / 1.1) : x > TX - 2.8 ? mix(k(BR, .8), C.orange, (x - TX + 2.8) / 1.4) : mix(k(ST, .55), k(BR, .8), (x + 3.1) / (TX - 2.8 + 3.1));
    for (let q = 0; q < n * .12; q++) { const x = -3.1 + P.r() * (TX + 3.1), z = (P.r() * 2 - 1) * .2; P.pt(...vw(x, .04, z), heat(x)); }
    for (let x = -3.0; x < TX; x += .12) P.curve(n * .003, t => { const a = (t - .5) * 2.4; return vw(x - .06 + Math.cos(a) * -.08 + .08, .05, Math.sin(a) * .2); }, mix(heat(x), C.white, .3), .006);
    // the open seam ahead
    line3(P, n * .02, vw(TX + .1, 0, .07), vw(3.1, 0, .07), k(W, .5), .006); line3(P, n * .02, vw(TX + .1, 0, -.07), vw(3.1, 0, -.07), k(W, .5), .006);
    // the torch and its arc
    const A = vw(TX, .05, 0);
    P.line(n * .03, [[A[0] + .05, A[1] + .12], [A[0] + .55, A[1] + 1.3], [A[0] + .9, A[1] + 2.4]], k(ST, .8), .04);
    glow(P, n * .015, A[0], A[1], .07, C.white); glow(P, n * .025, A[0], A[1], .35, mix(C.white, C.ice, .4), 10); glow(P, n * .012, A[0], A[1], .18, C.white, 11);
    P.sparks(n * .04, A[0], A[1] + .3, .2, C.yellow);
  }, .62),

  /* Physical properties: a quiet board of eight — opacity, colour, density, conductivity, expansion, magnetism, melting,
     corrosion. They are hard to change, so nothing here moves much */
  physical: () => build(N, 511, (P, n) => {
    const XS = [-2.7, -.9, .9, 2.7], YS = [.95, -1.15], frame = k(BR, .45);
    const cell = (q, draw) => { const x = XS[q % 4], y = YS[q > 3 ? 1 : 0]; P.box(n * .012, x - .82, y - .88, 1.64, 1.76, frame, .007); xf(P, shift(x, y), draw); };
    // opacity / transparency: light goes through a clear pane
    cell(0, () => { gline(P, n * .015, -.75, .3, -.05, .02, k(C.yellow, .6), C.yellow, .01); gline(P, n * .012, .05, -.02, .72, -.3, k(C.yellow, .8), k(C.yellow, .3), .01); P.box(n * .015, -.08, -.55, .16, 1.1, C.ice, .007); P.rect(n * .01, -.08, -.55, .16, 1.1, k(C.ice, .2)); });
    // colour: the light it gives back
    cell(1, () => { P.seg(n * .012, -.65, -.45, .65, -.45, k(W, .8), .008); P.curve(n * .015, t => [-.6 + t * .6, .4 - t * .82 + Math.sin(t * 30) * .04], k(W, .9), .008); P.curve(n * .015, t => [t * .6, -.42 + t * .82 + Math.sin(t * 22) * .05], C.copper, .008); P.rect(n * .015, -.65, -.62, 1.3, .14, k(C.copper, .5)); });
    // density: weight packed into a volume
    cell(2, () => { const c = [[-.45, -.5], [.3, -.5], [.3, .25], [-.45, .25]]; P.outline(n * .015, c, W, .007); [[.3, -.5], [.3, .25], [-.45, .25]].forEach(([x, y]) => P.seg(n * .004, x, y, x + .2, y + .18, k(W, .7), .006)); P.seg(n * .006, -.25, .43, .5, .43, k(W, .7), .006); P.seg(n * .006, .5, .43, .5, -.32, k(W, .7), .006); for (let q = 0; q < 60; q++) P.disc(n * .00025, -.4 + P.r() * .65, -.45 + P.r() * .65, .025, C.yellow); P.arrow(n * .01, -.075, -.55, -.075, -.85, BR, .1); });
    // conductivity: current and heat run through it
    cell(3, () => { P.rect(n * .02, -.7, -.2, 1.4, .3, k(C.copper, .45)); gline(P, n * .015, -.7, -.05, .7, -.05, C.yellow, k(C.orange, .3), .03); P.line(n * .012, [[-.15, .7], [.05, .38], [-.08, .38], [.12, .1]], C.ice, .01); P.arrow(n * .01, -.5, -.45, .5, -.45, k(C.ice, .9), .1); });
    // expansion: it grows when heated
    cell(4, () => { P.rect(n * .02, -.5, -.15, 1.0, .3, k(BR, .5)); P.box(n * .01, -.5, -.15, 1.0, .3, BR, .007); [-1, 1].forEach(s => P.arrow(n * .01, s * .52, 0, s * .78, 0, C.orange, .09)); flame(P, n * .012, 0, -.65, .4, .2); });
    // magnetism: iron, nickel, cobalt line up
    cell(5, () => { const U = []; for (let q = 0; q <= 12; q++) { const a = q / 12 * Math.PI; U.push([Math.cos(a) * .45, .05 + Math.sin(a) * .45]); } P.line(n * .02, U, k(C.red, .9), .03); [-1, 1].forEach(s => P.seg(n * .006, s * .45, .05, s * .45, -.25, k(W, .8), .03)); [0, 1].forEach(q => ell(P, n * .01, 0, -.25, .45 + q * .2, .3 + q * .15, k(BR, .5), .007, 0, Math.PI, TAU)); });
    // melting point: solid to liquid
    cell(6, () => { P.box(n * .012, -.3, -.05, .5, .5, k(W, .8), .007); P.curve(n * .015, t => { const a = t * TAU; return [-.05 + Math.sin(a) * .16 * (1 - Math.cos(a) * .2), -.4 - Math.cos(a) * .18 - (Math.cos(a) > 0 ? 0 : 0)]; }, C.orange, .008); P.disc(n * .01, -.05, -.42, .14, k(C.orange, .5)); flame(P, n * .01, -.05, -.85, .25, .15); });
    // corrosion resistance: oxygen and chemicals eat the surface
    cell(7, () => { P.rect(n * .02, -.65, -.45, 1.3, .3, k(ST, .45)); for (let q = 0; q < 7; q++) P.disc(n * .003, -.55 + q * .18 + P.g() * .03, -.18 + P.g() * .04, .05 + P.r() * .05, RUST); for (let q = 0; q < 3; q++) { const x = -.4 + q * .4; P.disc(n * .002, x, .35, .05, C.ice); P.disc(n * .002, x + .1, .35, .05, C.ice); } });
  }, .6),

  /* Conductivity: electric current (top) and heat (bottom) travelling along a bar */
  conductivity: () => build(N, 512, (P, n) => {
    // electrical: a copper bar between two terminals, charge drifting along it
    P.rect(n * .08, -3.3, .5, 6.6, .5, k(C.copper, .3)); P.box(n * .03, -3.3, .5, 6.6, .5, mix(C.copper, C.white, .35), .008);
    P.rect(n * .02, -3.55, .4, .25, .7, k(C.red, .7)); P.rect(n * .02, 3.3, .4, .25, .7, k(C.blue, .7));
    P.seg(n * .004, -3.5, 1.25, -3.3, 1.25, C.red, .01); P.seg(n * .004, -3.4, 1.15, -3.4, 1.35, C.red, .01); P.seg(n * .004, 3.33, 1.25, 3.53, 1.25, C.blue, .01);
    for (let q = 0; q < n * .1; q++) P.pt(-4.4 + P.r() * 8.8, .58 + P.r() * .34, P.g() * .03, mix(mix(C.ice, C.water, .5), C.white, P.r() * .45), 9);
    P.line(n * .015, [[-.2, 1.85], [.15, 1.35], [-.1, 1.35], [.25, .95]], C.ice, .012);
    // thermal: a bar heated at one end; the heat runs along it (hot to cold), pulses moving with it
    for (let q = 0; q < n * .12; q++) { const x = -3.3 + P.r() * 6.6, t = (x + 3.3) / 6.6; P.pt(x, -1.3 + P.r() * .5, P.g() * .02, t < .25 ? mix(C.white, C.yellow, t / .25) : t < .55 ? mix(C.yellow, C.orange, (t - .25) / .3) : mix(k(C.orange, .8), k(BR, .35), (t - .55) / .45)); }
    P.box(n * .03, -3.3, -1.3, 6.6, .5, k(W, .55), .008);
    for (let q = 0; q < n * .04; q++) P.pt(-4.4 + P.r() * 8.8, -1.05 + P.g() * .08, 0, k(C.yellow, .6), 9);
    flame(P, n * .04, -2.9, -2.2, .85, .3); P.sparks(n * .02, -2.9, -1.6, .15, C.orange);
  }, .62),

  /* Thermal expansion: heated, a bar grows. The one that melts low grows a lot; the one that melts high grows little */
  expansion: () => build(N, 513, (P, n) => {
    P.rect(n * .03, -3.25, -1.6, .3, 3.2, k(ST, .35)); P.box(n * .014, -3.25, -1.6, .3, 3.2, k(W, .7), .008);
    const rig = (y, c, grow, melt) => {
      P.rect(n * .06, -2.95, y - .2, 4.4, .4, k(c, .45), 10); P.box(n * .02, -2.95, y - .2, 4.4, .4, mix(c, C.white, .35), .008, 10);
      P.rect(n * .06, -2.95, y - .2, 4.4 + grow, .4, mix(k(c, .45), k(C.orange, .7), .6), 11); P.box(n * .02, -2.95, y - .2, 4.4 + grow, .4, mix(C.orange, C.white, .3), .008, 11);
      dash(P, n * .01, 1.45, y - .45, 1.45, y + .45, k(W, .4), .06, .05, .006);
      dim(P, n * .015, 1.45, y + .38, 1.45 + grow, y + .38, C.orange, 11, .07);
      [-2.2, -1.1, 0, 1.0].forEach(x => flame(P, n * .008, x, y - .75, .45, .14, 11));
      // its melting point: a gauge, low or high
      P.box(n * .012, 2.55, y - .55, .22, 1.1, k(W, .7), .007); P.disc(n * .006, 2.66, y - .62, .14, C.red); P.rect(n * .02, 2.58, y - .55, .16, 1.1 * melt, C.red);
    };
    rig(.95, BR, .75, .32);
    rig(-.95, mix(C.ice, C.violet, .25), .16, .9);
    P.sparks(n * .015, -.5, .5, .9, C.orange); P.sparks(n * .015, -.5, -1.4, .9, C.orange);
  }, .6),

  /* Ferromagnetism: in iron, nickel and cobalt the little domains point every way — then they line up */
  magnet: () => build(N, 514, (P, n) => {
    const cols = [mix(C.steel2, C.steel, .5), mix(C.alu, C.chalk, .3), mix(C.blue, C.ice, .35)];
    [-2.45, 0, 2.45].forEach((cx, s) => {
      const cy = -.3, w = 2.0, h = 1.35, c = cols[s];
      P.rect(n * .02, cx - w / 2, cy - h / 2, w, h, k(c, .12)); P.box(n * .02, cx - w / 2, cy - h / 2, w, h, k(c, .9), .008);
      for (let i = 1; i < 4; i++) P.seg(n * .003, cx - w / 2 + i * w / 4, cy - h / 2, cx - w / 2 + i * w / 4, cy + h / 2, k(c, .25), .005);
      P.seg(n * .006, cx - w / 2, cy, cx + w / 2, cy, k(c, .25), .005);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
        const x = cx - w / 2 + (i + .5) * w / 4, y = cy - h / 2 + (j + .5) * h / 2, a = P.r() * TAU;
        P.arrow(n * .006, x - Math.cos(a) * .17, y - Math.sin(a) * .17, x + Math.cos(a) * .17, y + Math.sin(a) * .17, k(BR, .9), .08, 10);
        P.arrow(n * .006, x - .17, y, x + .17, y, C.yellow, .08, 11);
      }
      // lined up, the piece is a magnet: poles and its field
      glow(P, n * .006, cx + w / 2, cy, .12, C.red, 11); glow(P, n * .006, cx - w / 2, cy, .12, C.blue, 11);
      [.5, .85].forEach(r => { ell(P, n * .008, cx, cy + h / 2 - .05, w / 2 + .05, r * .8, k(C.yellow, .4), .007, 11, 0, Math.PI); ell(P, n * .008, cx, cy - h / 2 + .05, w / 2 + .05, r * .8, k(C.yellow, .4), .007, 11, Math.PI, TAU); });
    });
  }, .6),

  /* Melting point: enough heat and the ordered solid lets go — the block slumps into a pool, its atoms loose */
  melting: () => build(N, 515, (P, n) => {
    P.rect(n * .03, -2.1, -2.0, 4.2, .25, k(ST, .4)); P.box(n * .014, -2.1, -2.0, 4.2, .25, k(W, .7), .008);
    [-1.5, -.75, 0, .75, 1.5].forEach(x => flame(P, n * .008, x, -2.35, .32, .12));
    const vw = view(.55, .32, 0, -.95), s = .62;
    const E = []; for (const a of [-1, 1]) for (const b of [-1, 1]) E.push([[-s, a * s, b * s], [s, a * s, b * s]], [[a * s, -s, b * s], [a * s, s, b * s]], [[a * s, b * s, -s], [a * s, b * s, s]]);
    // the solid: a block with its atoms in order
    E.forEach(([a, b]) => line3(P, n * .006, vw(...a), vw(...b), C.gold, .007, 10));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let l = 0; l < 3; l++) { const p = vw(-.42 + i * .42, -.42 + j * .42, -.42 + l * .42); P.disc(n * .0016, p[0], p[1], .06, mix(C.gold, C.white, .3), 10); }
    // where it was (always)
    E.forEach(([a, b]) => { const A = vw(...a), B = vw(...b); dash(P, n * .003, A[0], A[1], B[0], B[1], k(W, .25), .06, .05, .005); });
    // the liquid: a pool, the same atoms loose
    ellF(P, n * .08, 0, -1.6, 1.75, .22, mix(C.orange, C.yellow, .3), 11); ell(P, n * .02, 0, -1.6, 1.75, .22, C.yellow, .008, 11);
    for (let q = 0; q < 27; q++) { const a = P.r() * TAU, d = Math.sqrt(P.r()); P.disc(n * .0016, Math.cos(a) * 1.55 * d, -1.6 + Math.sin(a) * .17 * d, .05, C.white, 11); }
    P.sparks(n * .03, 0, -1.2, .6, C.orange);
  }, .6),

  /* Corrosion resistance: oxygen and chemicals eat into a bare plate (rust spreading); the protected plate stays clean */
  corrosion: () => build(N, 516, (P, n) => {
    // bare: pitted along its top, rust spots that spread with each stroke
    const pit = [[-3.3, -1.55], [-.5, -1.55]]; for (let q = 0; q <= 28; q++) { const x = -.5 - q * .1; pit.push([x, -.85 - (q % 3 === 1 ? .08 : 0) - (q % 5 === 2 ? .06 : 0)]); }
    P.poly(n * .1, pit, k(ST, .35)); P.outline(n * .03, pit, k(W, .6), .008);
    const spots = [[-3.0, -1.0], [-2.45, -.93], [-1.9, -1.1], [-1.4, -.95], [-.9, -1.05], [-2.7, -1.3], [-1.6, -1.35], [-1.1, -1.28]];
    spots.forEach(([x, y]) => { P.disc(n * .005, x, y, .08, RUST); P.disc(n * .008, x, y, .17, k(RUST, .8), 10); });
    P.seg(n * .02, -3.3, -.86, -.5, -.86, k(RUST, .9), .015);
    // protected: a coat over it, clean and bright
    P.rect(n * .1, .5, -1.55, 2.8, .7, k(ST, .35)); P.box(n * .03, .5, -1.55, 2.8, .7, k(W, .7), .008);
    P.rect(n * .03, .45, -.85, 2.9, .1, k(C.good, .55)); P.seg(n * .02, .45, -.75, 3.35, -.75, C.good, .008);
    gline(P, n * .015, .7, -1.2, 3.0, -1.2, k(C.white, .2), k(C.white, .6), .01);
    // oxygen: pairs of atoms drifting down onto both
    for (let q = 0; q < 16; q++) { const x = -3.2 + (q % 8) * .4 + (q > 7 ? 3.7 : 0) + P.g() * .05, y = .1 + (q * 7 % 5) * .32, a = P.r() * Math.PI; [-1, 1].forEach(s => P.disc(n * .0022, x + s * Math.cos(a) * .07, y + s * Math.sin(a) * .07, .065, mix(C.ice, C.white, .3), 5)); }
    // on the bare plate they bite in
    [-2.45, -1.4, -.9].forEach(x => glow(P, n * .006, x, -.8, .08, k(RUST, .9), 10));
  }, .6)
});
