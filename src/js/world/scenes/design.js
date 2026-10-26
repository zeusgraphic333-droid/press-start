// Immersive scenes — design (names and captions: info.js · SCENES_BY_ZONE.design; what to draw: docs/SCENES.md; how: STYLE.md).
// Zone colour: straw. Seeds 2xx.
import { build, C, k, mix, inside } from './kit.js';

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
/** corners of a bar from (x1, y1) to (x2, y2), w wide */
const barPts = (x1, y1, x2, y2, w) => { const a = Math.atan2(y2 - y1, x2 - x1), sx = -Math.sin(a) * w / 2, sy = Math.cos(a) * w / 2; return [[x1 + sx, y1 + sy], [x2 + sx, y2 + sy], [x2 - sx, y2 - sy], [x1 - sx, y1 - sy]]; };
const onEll = (cx, cy, rx, ry, rot, a) => [cx + Math.cos(a) * rx * Math.cos(rot) - Math.sin(a) * ry * Math.sin(rot), cy + Math.cos(a) * rx * Math.sin(rot) + Math.sin(a) * ry * Math.cos(rot)];
/** ellipse outline, or an arc of it (a0…a1), turned by rot */
function ell(P, n, cx, cy, rx, ry, c, j = .013, g = 0, a0 = 0, a1 = TAU, rot = 0, pv) { P.curve(n, t => onEll(cx, cy, rx, ry, rot, a0 + (a1 - a0) * t), c, j, g, pv); }
/** filled ellipse */
function ellF(P, n, cx, cy, rx, ry, c, g = 0, pv) { for (let q = 0; q < n; q++) { const a = P.r() * TAU, d = Math.sqrt(P.r()); P.pt(cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, P.g() * .02, c, g, pv); } }
/** a line whose colour runs from c1 to c2 */
function gline(P, n, x1, y1, x2, y2, c1, c2, j = .01, g = 0) { for (let q = 0; q < n; q++) { const t = P.r(); P.pt(x1 + (x2 - x1) * t + P.g() * j, y1 + (y2 - y1) * t + P.g() * j, P.g() * j, mix(c1, c2, t), g); } }
/** dashed line */
function dash(P, n, x1, y1, x2, y2, c, on = .13, off = .09, j = .011, g = 0) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, per = on + off, m = Math.ceil(L / per);
  for (let q = 0; q < n; q++) { let t; do t = (Math.floor(P.r() * m) * per + P.r() * Math.min(on, L)) / L; while (t > 1); P.pt(x1 + (x2 - x1) * t + P.g() * j, y1 + (y2 - y1) * t + P.g() * j, P.g() * j, c, g); }
}
/** a soft glow */
function glow(P, n, x, y, s, c, g = 0, pv) { for (let q = 0; q < n; q++) P.pt(x + P.g() * s, y + P.g() * s, P.g() * s * .5, c, g, pv); }
/** impact flash: streaks bursting from (x, y) between angles a0…a1, white at the root (group 10: only while the ram is down) */
function burst(P, n, x, y, r0, r1, c, rays = 9, a0 = 0, a1 = Math.PI, g = 10) {
  for (let q = 0; q < n; q++) { const kk = Math.floor(P.r() * rays), a = a0 + (a1 - a0) * (kk + .5) / rays, len = r1 * (.55 + .45 * ((kk * .618) % 1)), t = Math.pow(P.r(), 1.5), d = r0 + (len - r0) * t; P.pt(x + Math.cos(a) * d + P.g() * .01, y + Math.sin(a) * d + P.g() * .01, P.g() * .02, mix(C.white, c, t), g); }
}
/** a hand-drafted outline: every edge runs a little past its corners */
function sketchy(P, n, pts, c, over = .1, closed = true, g = 0) {
  const m = closed ? pts.length : pts.length - 1, segs = []; let T = 0;
  for (let a = 0; a < m; a++) { const p = pts[a], q = pts[(a + 1) % pts.length], L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L; segs.push([p[0] - ux * over, p[1] - uy * over, q[0] + ux * over, q[1] + uy * over, L + 2 * over]); T += L + 2 * over; }
  segs.forEach(s => P.seg(Math.round(n * s[4] / T), s[0], s[1], s[2], s[3], c, .009, g));
}
/** a zig-zag spark (an electric discharge) from (x1, y1) to (x2, y2) */
function zap(P, n, x1, y1, x2, y2, c, kinks = 5, amp = .05, g = 0) { const L = Math.hypot(x2 - x1, y2 - y1) || 1, px = -(y2 - y1) / L, py = (x2 - x1) / L, pts = [[x1, y1]]; for (let q = 1; q < kinks; q++) { const t = q / kinks, o = q % 2 ? amp : -amp; pts.push([x1 + (x2 - x1) * t + px * o, y1 + (y2 - y1) * t + py * o]); } pts.push([x2, y2]); P.line(n, pts, c, .008, g); }

/* the colours of this zone */
const S = C.straw, ST = C.steel, W = C.chalk;

export default N => ({
  /* ★ a desk lamp, half drawing and half made; on every stroke of the plant the metal sweeps over the drawing too */
  designer: () => build(N, 201, (P, n) => {
    const B = [-.3, -1.55], E = [-1.55, .45], H = [1.25, 1.45], DESK = -2.05;
    const ua = -1.3, u = [Math.cos(ua), Math.sin(ua)], v = [-u[1], u[0]];
    const sh = (s, t = 0) => [H[0] + u[0] * s + v[0] * t, H[1] + u[1] * s + v[1] * t];
    const shade = [sh(.12, -.16), sh(.12, .16), sh(1.05, .62), sh(1.05, -.62)], mouth = sh(1.05), bulb = sh(.84);
    const base = [[-1.55, -2.02], [.95, -2.02], [.95, -1.86], [.8, -1.72], [-1.4, -1.72], [-1.55, -1.86]];
    const dome = Array.from({ length: 13 }, (_, q) => [B[0] + Math.cos(q / 12 * Math.PI) * .27, -1.72 + Math.sin(q / 12 * Math.PI) * .27]);
    const low = barPts(B[0], B[1], E[0], E[1], .15), up = barPts(E[0], E[1], H[0], H[1], .12);
    const LB = Math.hypot(E[0] - B[0], E[1] - B[1]), d1 = [(E[0] - B[0]) / LB, (E[1] - B[1]) / LB], nr = [d1[1], -d1[0]];
    const spring = Array.from({ length: 19 }, (_, q) => { const s = (.1 + q / 18 * .42) * LB, o = .2 + (q % 2 ? .05 : -.05); return [B[0] + d1[0] * s + nr[0] * o, B[1] + d1[1] * s + nr[1] * o]; });
    // the whole picture, a little larger than drawn (scaled about the seam, x = 0)
    const SC = 1.137, big = (x, y, z) => [x * SC, (y + 1.32) * SC - 1.32, z * SC];
    const Lc = (x, y, z) => x < 0 ? big(x, y, z) : null, Rc = (x, y, z) => x >= 0 ? big(x, y, z) : null;
    const M = C.gold, S1 = k(S, .95), S2 = k(S, .5), CN = k(ST, .55);
    /* the lamp in metal */
    const metal = g => {
      P.poly(n * .06, base, k(M, .4), g); P.outline(n * .028, base, k(W, .75), .011, g);
      P.poly(n * .012, dome, k(M, .5), g); P.line(n * .008, dome, k(W, .7), .01, g);
      P.poly(n * .045, low, k(M, .58), g); P.outline(n * .022, low, k(W, .72), .009, g);
      P.poly(n * .045, up, k(M, .58), g); P.outline(n * .022, up, k(W, .72), .009, g);
      P.line(n * .02, spring, k(C.yellow, .75), .01, g);
      [[B, .13], [E, .16], [H, .15]].forEach(([p, r]) => { P.disc(n * .007, p[0], p[1], r, k(M, .9), g); P.ring(n * .008, p[0], p[1], r, W, .009, g); glow(P, n * .002, p[0], p[1], .025, C.white, g); });
      P.poly(n * .075, shade, k(M, .5), g); P.outline(n * .03, shade, k(W, .82), .011, g);
      P.seg(n * .012, ...sh(.22, .12), ...sh(.98, .52), k(C.white, .6), .014, g);
      ell(P, n * .03, mouth[0], mouth[1], .62, .12, C.yellow, .011, g, 0, TAU, Math.atan2(v[1], v[0]));
      glow(P, n * .02, bulb[0], bulb[1], .09, C.white, g);
    };
    xf(P, Rc, () => metal(0));
    xf(P, Lc, () => metal(10));
    xf(P, big, () => {
      // its light: a warm cone, a pool on the desk, dust drifting in the beam
      const cone = [shade[3], shade[2], [2.95, DESK + .03], [1.22, DESK + .03]];
      P.poly(n * .06, cone, k(C.yellow, .1));
      ellF(P, n * .04, 2.1, DESK + .02, .9, .07, k(C.yellow, .5));
      for (let q = 0; q < n * .03; q++) { const x = 1 + P.r() * 2.1, y = DESK + .3 + P.r() * 2.2; if (inside(cone, x, y)) P.pt(x, y, P.g() * .1, k(C.yellow, .75), 8); }
      // the desk: drawn on the made side, a construction line on the drawing side
      P.seg(n * .03, 0, DESK, 3.1, DESK, k(W, .4), .009);
      dash(P, n * .024, -3.0, DESK, 0, DESK, S2, .16, .1);
    });
    /* the drawing: overshooting strokes, centre lines, the reach of the arm, a dimension, construction dots */
    xf(P, Lc, () => {
      sketchy(P, n * .045, base, S1, .1);
      ell(P, n * .012, B[0], -1.72, .27, .27, S1, .009, 0, 0, Math.PI);
      sketchy(P, n * .045, low, S1, .12); sketchy(P, n * .045, up, S1, .12);
      P.line(n * .018, spring, S1, .009);
      [B, E].forEach(p => { P.ring(n * .016, p[0], p[1], .15, S1, .009); P.ring(n * .016, p[0], p[1], .33, S2, .008); P.seg(n * .007, p[0] - .48, p[1], p[0] + .48, p[1], S2, .007); P.seg(n * .007, p[0], p[1] - .48, p[0], p[1] + .48, S2, .007); });
      dash(P, n * .024, B[0] - d1[0] * .55, B[1] - d1[1] * .55, E[0] + d1[0] * .7, E[1] + d1[1] * .7, CN, .3, .08, .008);
      dash(P, n * .014, E[0], E[1], E[0] - (H[0] - E[0]) * .28, E[1] - (H[1] - E[1]) * .28, CN, .3, .08, .008);
      for (let q = 0; q < n * .03; q++) { const a = 1.72 + P.r() * .9; if ((a * 12) % 1 > .6) continue; P.pt(B[0] + Math.cos(a) * LB + P.g() * .008, B[1] + Math.sin(a) * LB + P.g() * .008, 0, CN); }
      // the elbow's height: a dimension line with arrowheads and an extension line
      const DX = -2.7;
      P.seg(n * .014, E[0] - .2, E[1], DX - .15, E[1], S2, .007);
      P.seg(n * .022, DX, DESK + .02, DX, E[1] - .02, S1, .008);
      [[DESK + .02, 1], [E[1] - .02, -1]].forEach(([y, s]) => [-1, 1].forEach(sd => P.seg(n * .003, DX, y, DX + sd * .07, y + s * .16, S1, .006)));
      P.seg(n * .005, DX - .14, DESK, DX + .14, DESK, S1, .006);
      [...base, B, E, [DX, E[1]], [DX, DESK]].forEach(p => glow(P, n * .0007, p[0], p[1], .02, C.yellow));
    });
    // the seam between drawing and making, and the front where one turns into the other
    xf(P, big, () => {
      dash(P, n * .016, 0, -2.25, 0, 1.9, k(W, .28), .1, .07, .007);
      glow(P, n * .006, 0, -1.87, .035, C.white); glow(P, n * .006, 0, 1.0, .035, C.white);
      P.sparks(n * .006, 0, -1.6, .05, C.yellow); P.sparks(n * .006, 0, 1.25, .05, C.yellow);
    });
  }, .68),

  /* Product Design Sequence (L1·S3): rays enter, three lenses focus them into the steps; the cones of light turn slowly
     about the axis and the product travels along it (conveyor) */
  sequence: () => build(N, 202, (P, n) => {
    const AY = -.25, h = 1.22, LX = [-2.78, -.62, 1.54], FX = [-1.7, .46, 2.62], RAYS = 15, pv = [0, AY, 0, .22];
    const cone = (m, x1, r1, x2, r2, c1, c2) => { for (let q = 0; q < m; q++) { const ph = (Math.floor(P.r() * RAYS) + .5) / RAYS * TAU, t = P.r(), r = r1 + (r2 - r1) * t; P.pt(x1 + (x2 - x1) * t, AY + Math.cos(ph) * r + P.g() * .007, Math.sin(ph) * r + P.g() * .007, mix(c1, c2, t), 12, pv); } };
    const dimS = k(S, .42), hotS = mix(S, C.yellow, .55);
    cone(n * .055, -3.95, h, LX[0], h, k(S, .12), dimS);
    for (let s = 0; s < 3; s++) { cone(n * .064, LX[s], h, FX[s], 0, dimS, hotS); if (s < 2) cone(n * .064, FX[s], 0, LX[s + 1], h, hotS, dimS); }
    cone(n * .06, FX[2], 0, 3.95, 1.5, hotS, k(S, .1));
    // the three lenses (Aesthetics · Analysis · Synthesis): glass discs seen edge-on
    const R = h + .14, prof = [[0, -.19], [.55, -.17], [.95, -.11], [1.25, -.04], [R, 0], [1.25, .04], [.95, .11], [.55, .17], [0, .19]];
    LX.forEach(x => {
      P.lathe(n * .045, prof, k(C.ice, .5), { axis: 'x', cx: x, cy: AY });
      [-1, 1].forEach(sd => P.curve(n * .014, t => { const yy = (t * 2 - 1) * R; return [x + sd * .19 * (1 - (yy / R) ** 2), AY + yy]; }, C.ice, .009));
    });
    // each lens gathers everything into one point: a step of the sequence
    FX.forEach(x => { glow(P, n * .01, x, AY, .045, C.white); glow(P, n * .008, x, AY, .17, k(C.yellow, .45)); });
    // the product travelling the axis
    for (let q = 0; q < n * .04; q++) { const p = Math.floor(P.r() * 11), x = -4.4 + p * .8 + P.r() * .24; P.pt(x, AY + P.g() * .012, P.g() * .01, mix(C.yellow, C.white, P.r()), 9); }
    // the six steps along the top (their names belong to the drawing; here, six marks)
    [LX[0], FX[0], LX[1], FX[1], LX[2], FX[2]].forEach((x, q) => {
      if (q % 2 === 0) P.seg(n * .008, x, AY + R + .12, x, 1.98, k(W, .32), .006); else dash(P, n * .011, x, AY + .2, x, 1.98, k(W, .26), .08, .07, .006);
      glow(P, n * .003, x, 2.02, .022, C.yellow);
      P.seg(n * .005, x + .08, 2.13, x + .52, 2.13, k(S, .5), .007); P.seg(n * .004, x + .08, 1.99, x + .4, 1.99, k(S, .32), .007);
    });
  }, .62),

  /* two kinds of considerations feed one lens: personal (few, warm, loose) and objective (many, cool, in order) */
  considerations: () => build(N, 203, (P, n) => {
    const LY = .25, LR = 2.6, LT = .3, FY = 1.98, w = x => LT * Math.max(0, 1 - (x / LR) ** 2);
    for (let q = 0; q < n * .06; q++) { const x = (P.r() * 2 - 1) * LR, y = LY + (P.r() * 2 - 1) * w(x); P.pt(x, y, P.g() * .02, k(C.ice, .3)); }
    [-1, 1].forEach(s => P.curve(n * .03, t => { const x = (t * 2 - 1) * LR; return [x, LY + s * w(x)]; }, S, .009));
    // the lens focuses them all into one point
    for (let j = 0; j < 13; j++) { const x0 = -2.3 + j * 4.6 / 12; gline(P, n * .012, x0, LY + w(x0), 0, FY, k(x0 < 0 ? C.orange : C.ice, .45), mix(S, C.white, .5), .007); }
    glow(P, n * .014, 0, FY, .05, C.white); glow(P, n * .01, 0, FY, .18, k(C.yellow, .42));
    P.sparks(n * .006, 0, FY + .2, .04, C.yellow);
    // personal and individual: a few warm motes, wandering paths, loose embers
    [[-2.5, -1.45, .24, C.orange], [-1.8, -2.05, .16, C.yellow], [-1.15, -1.2, .29, C.hot], [-.55, -1.95, .14, C.straw], [-2.1, -.72, .13, C.red]].forEach(([x, y, r, c], q) => {
      P.disc(n * .014, x, y, r, c); glow(P, n * .012, x, y, r * 1.3, k(c, .3));
      const top = LY - w(x * .8) - .03, sw = (q % 2 ? 1 : -1) * .26;
      P.curve(n * .018, t => [x + (x * -.2) * t + Math.sin(t * 7 + q * 2) * sw * (1 - t), y + r + (top - y - r) * t], k(c, .36), .011);
      P.sparks(n * .013, x, -1.0, .28, c);
    });
    // objective: many small cool squares in rows, each column a straight ray with embers rising along it
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) P.rect(n * .0032, .5 + c * .38, -2.18 + r * .33, .2, .2, k(C.ice, .72));
    for (let c = 0; c < 6; c++) { const x = .6 + c * .38; P.seg(n * .013, x, -1.06, x, LY - w(x), k(C.ice, .28), .005); for (let q = 0; q < n * .007; q++) P.pt(x + P.g() * .006, -.95 + P.g() * .02, 0, mix(C.ice, C.white, P.r() * .5), 8); }
  }, .6),

  /* Manufacturing methods: forming · cutting · joining · finishing, each one working */
  methods: () => build(N, 204, (P, n) => {
    const XS = [-2.7, -.9, .9, 2.7], TOP = 1.95, line = k(S, .55);
    P.seg(n * .03, -2.7, TOP, 2.7, TOP, line, .008); P.seg(n * .005, 0, TOP, 0, 2.3, line, .008); glow(P, n * .004, 0, 2.3, .03, C.yellow);
    XS.forEach(x => { P.seg(n * .006, x, TOP, x, 1.62, line, .008); glow(P, n * .003, x, TOP, .025, C.yellow); });
    // forming: a punch (the ram) folds a hot sheet into a V-die
    xf(P, shift(XS[0]), () => {
      const die = [[-.7, -1.95], [.7, -1.95], [.7, -1.3], [.35, -1.3], [0, -1.66], [-.35, -1.3], [-.7, -1.3]];
      P.poly(n * .035, die, k(ST, .32)); P.outline(n * .02, die, k(ST, .95), .01);
      P.seg(n * .016, -.68, -1.24, .68, -1.24, C.orange, .022, 11);
      P.line(n * .017, [[-.5, -1.08], [0, -1.58], [.5, -1.08]], C.orange, .022, 10);
      const punch = [[0, -1.53], [.27, -1.26], [.27, .3], [-.27, .3], [-.27, -1.26]];
      P.poly(n * .03, punch, k(ST, .42), 7); P.outline(n * .018, punch, W, .01, 7);
      P.rect(n * .015, -.55, .3, 1.1, .32, k(ST, .35), 7); P.box(n * .01, -.55, .3, 1.1, .32, k(W, .8), .01, 7);
      glow(P, n * .006, 0, -1.55, .06, C.white, 10); burst(P, n * .008, 0, -1.55, .1, .45, C.orange, 6, -.2, Math.PI + .2);
    });
    // cutting: a saw blade spinning through a bar, sparks from the kerf
    xf(P, shift(XS[1]), () => {
      P.rect(n * .03, -.75, -1.85, 1.5, .6, k(S, .3)); P.box(n * .016, -.75, -1.85, 1.5, .6, k(S, .85), .01);
      P.rect(n * .006, -.03, -1.42, .06, .17, C.white);
      P.gear(n * .075, 0, -.72, .66, 18, C.alu, { speed: 1.8, depth: .11, hub: .13, spokes: 0 });
      ell(P, n * .012, 0, -.72, .8, .8, k(ST, .6), .01, 0, .2 * Math.PI, .8 * Math.PI);
      P.sparks(n * .025, .25, -1.0, .1, C.orange); glow(P, n * .004, .02, -1.3, .04, C.white);
    });
    // joining: two plates welded, the arc flickers, sparks rise
    xf(P, shift(XS[2]), () => {
      P.rect(n * .02, -.75, -1.85, .7, .34, k(ST, .38)); P.box(n * .012, -.75, -1.85, .7, .34, k(ST, .95), .009);
      P.rect(n * .02, .05, -1.85, .7, .34, k(ST, .38)); P.box(n * .012, .05, -1.85, .7, .34, k(ST, .95), .009);
      for (let q = 0; q < n * .014; q++) { const a = P.r() * Math.PI, d = Math.sqrt(P.r()); P.pt(Math.cos(a) * .2 * d, -1.51 + Math.sin(a) * .11 * d, 0, mix(C.white, C.orange, d)); }
      P.rect(n * .006, -.05, -1.85, .1, .34, C.orange);
      P.seg(n * .012, .07, -1.36, .5, -.35, k(ST, .9), .02); P.seg(n * .012, .5, -.35, .7, .3, k(ST, .5), .05);
      glow(P, n * .006, .04, -1.42, .05, C.white); glow(P, n * .012, .04, -1.42, .2, mix(C.white, C.ice, .4), 10); glow(P, n * .006, .04, -1.42, .1, C.white, 11);
      P.sparks(n * .025, 0, -1.1, .14, C.yellow);
    });
    // finishing: a spray gun coats the part below it (the mist flickers as it flies)
    xf(P, shift(XS[3]), () => {
      const gun = [[-.1, .45], [.1, .45], [.14, .72], [.5, .76], [.55, 1.02], [-.4, 1.02], [-.4, .76], [-.14, .72]];
      P.poly(n * .02, gun, k(ST, .45)); P.outline(n * .016, gun, k(W, .85), .009);
      P.line(n * .01, [[.3, 1.02], [.42, 1.42]], k(ST, .7), .03);
      const spray = [[0, .42], [.6, -1.3], [-.6, -1.3]];
      P.poly(n * .02, spray, k(S, .12));
      [0, 10, 11].forEach(g => { for (let q = 0; q < n * .012; q++) { const t = Math.sqrt(P.r()), x = (P.r() * 2 - 1) * .6 * t; P.pt(x, .42 - t * 1.72, P.g() * .05, k(mix(S, C.white, P.r() * .5), g ? .95 : .4), g); } });
      P.rect(n * .03, -.62, -1.85, 1.24, .45, k(ST, .3)); P.box(n * .014, -.62, -1.85, 1.24, .45, k(ST, .85), .009);
      P.rect(n * .016, -.62, -1.42, 1.24, .08, C.gold);
    });
  }, .6),

  /* Forming: liquid metal poured into a mould · a hot billet squeezed (plastic) · a cold sheet bent (solid) — hot to cold */
  forming: () => build(N, 205, (P, n) => {
    // the temperature runs down across the three states
    gline(P, n * .02, -3.4, 1.95, 0, 1.95, C.white, C.orange, .01); gline(P, n * .02, 0, 1.95, 3.4, 1.95, C.orange, C.ice, .01);
    [-2.55, 0, 2.55].forEach((x, q) => glow(P, n * .004, x, 1.95, .035, [C.white, C.orange, C.ice][q]));
    // liquid state: a ladle pours into a mould
    xf(P, shift(-2.55), () => {
      P.rect(n * .03, -.85, -2.0, 1.7, 1.25, k(ST, .22)); P.box(n * .018, -.85, -2.0, 1.7, 1.25, k(ST, .9), .01);
      const cav = [[-.17, -.75], [-.03, -.75], [-.03, -1.3], [.15, -1.3], [.15, -1.05], [.65, -1.05], [.65, -1.75], [-.17, -1.75]];
      P.poly(n * .045, cav, mix(C.orange, C.yellow, .3)); P.outline(n * .012, cav, C.white, .009);
      const tilt = place(-.55, .9, -.7), cup = [[-.36, .32], [.36, .32], [.27, -.28], [-.27, -.28]], cupW = cup.map(c => tilt(c[0], c[1], 0));
      xf(P, tilt, () => { P.poly(n * .015, cup, k(ST, .25)); P.outline(n * .022, cup, k(ST, .95), .012); P.seg(n * .012, -.36, .05, -1.0, .22, k(ST, .7), .03); });
      for (let q = 0, t = 0; q < n * .03 && t < n; t++) { const x = -1.0 + P.r() * 1.0, y = .3 + P.r() * .6; if (y < .87 && inside(cupW, x, y)) { P.pt(x, y, 0, mix(C.yellow, C.white, P.r() * .4)); q++; } }
      [0, 10, 11].forEach(g => P.curve(n * .014, t => [-.08 + Math.sin(t * Math.PI) * .04, .88 - t * 1.62], g ? C.white : C.yellow, g ? .012 : .025, g));
      P.sparks(n * .016, -.1, -.4, .16, C.orange); P.sparks(n * .006, -.2, 1.15, .1, C.yellow);
    });
    // plastic state: a press squeezes a hot billet; it barrels out
    xf(P, shift(0), () => {
      P.rect(n * .03, -.85, -2.0, 1.7, .45, k(ST, .32)); P.box(n * .016, -.85, -2.0, 1.7, .45, k(ST, .9), .01);
      P.rect(n * .045, -.38, -1.55, .76, 1.5, k(C.orange, .72), 11); P.box(n * .014, -.38, -1.55, .76, 1.5, C.yellow, .01, 11);
      const side = y => .6 + .22 * Math.sin(Math.PI * (y + 1.55) / .9), barrel = [];
      for (let q = 0; q <= 10; q++) barrel.push([side(-1.55 + q * .09), -1.55 + q * .09]); for (let q = 10; q >= 0; q--) barrel.push([-side(-1.55 + q * .09), -1.55 + q * .09]);
      P.poly(n * .045, barrel, k(C.orange, .72), 10); P.outline(n * .016, barrel, C.yellow, .01, 10);
      glow(P, n * .012, 0, -1.1, .22, k(C.yellow, .6), 10); glow(P, n * .01, 0, -.8, .2, k(C.yellow, .5), 11);
      P.rect(n * .03, -.85, -.65, 1.7, .45, k(ST, .38), 7); P.box(n * .016, -.85, -.65, 1.7, .45, k(W, .85), .01, 7);
      P.rect(n * .016, -.2, -.2, .4, 1.5, k(ST, .3), 7); P.box(n * .01, -.2, -.2, .4, 1.5, k(W, .7), .01, 7);
      [-1, 1].forEach(s => burst(P, n * .006, s * .84, -1.1, .05, .38, C.orange, 4, s > 0 ? -.7 : Math.PI - .7, s > 0 ? .7 : Math.PI + .7));
      P.sparks(n * .012, .7, -.9, .1, C.orange); P.sparks(n * .012, -.7, -.9, .1, C.orange);
    });
    // solid state: a cold sheet bent between two supports
    xf(P, shift(2.55), () => {
      [-.62, .62].forEach(x => { P.rect(n * .008, x - .06, -2.0, .12, .5, k(ST, .35)); P.disc(n * .01, x, -1.5, .14, k(ST, .5)); P.ring(n * .01, x, -1.5, .14, k(ST, 1), .009); });
      P.seg(n * .02, -.85, -1.32, .85, -1.32, C.ice, .022, 11);
      const d = .32, yb = x => Math.abs(x) <= .62 ? -1.32 - d * (1 - (x / .62) ** 2) : -1.32 + 2 * d / .62 * (Math.abs(x) - .62);
      P.curve(n * .022, t => { const x = -.83 + t * 1.66; return [x, yb(x)]; }, C.ice, .022, 10);
      P.rect(n * .02, -.18, -1.42, .36, 1.75, k(ST, .4), 7); P.box(n * .01, -.18, -1.42, .36, 1.75, k(W, .8), .01, 7);
      for (let q = 0; q < n * .008; q++) { const a = Math.PI + P.r() * Math.PI, d2 = Math.sqrt(P.r()) * .18; P.pt(Math.cos(a) * d2, -1.42 + Math.sin(a) * d2, 0, k(ST, .5), 7); }
      ell(P, n * .006, 0, -1.42, .18, .18, k(W, .8), .009, 7, Math.PI, TAU);
      P.rect(n * .012, -.5, .33, 1.0, .25, k(ST, .35), 7);
      glow(P, n * .004, 0, -1.6, .05, C.ice, 10);
    });
  }, .62),

  /* Cutting: sheet cutting (a shear) · chip forming (a tool and a curling chip) · nonchip (an electric spark) · flame/laser */
  cuttingM: () => build(N, 206, (P, n) => {
    // sheet cutting: the upper blade comes down past the bed and the end drops off
    xf(P, shift(-2.7), () => {
      P.rect(n * .03, -.8, -1.9, .78, .7, k(ST, .32)); P.box(n * .016, -.8, -1.9, .78, .7, k(ST, .9), .01);
      P.rect(n * .014, -.8, -1.2, .78, .1, k(S, .7));
      P.rect(n * .014, -.02, -1.2, .74, .1, k(S, .7), 11);
      xf(P, place(-.02, -1.26, -.38), () => P.rect(n * .014, 0, 0, .74, .1, k(S, .7), 10));
      const blade = [[0, -1.34], [.55, -1.22], [.55, .4], [0, .4]];
      P.poly(n * .035, blade, k(C.alu, .38), 7); P.outline(n * .018, blade, W, .01, 7); P.seg(n * .01, 0, -1.34, 0, .4, C.white, .008, 7);
      glow(P, n * .005, 0, -1.15, .04, C.white, 10); burst(P, n * .006, 0, -1.15, .06, .35, C.orange, 5, .2, 1.6);
    });
    // chip forming: a tool peels a layer into a curling chip
    xf(P, shift(-.9), () => {
      P.rect(n * .03, -.8, -1.9, 1.6, .65, k(S, .28)); P.box(n * .016, -.8, -1.9, 1.6, .65, k(S, .85), .01);
      P.rect(n * .012, -.8, -1.25, .86, .12, k(S, .55));
      const tool = [[.06, -1.24], [.2, -.35], [.75, -.35], [.75, -1.12]];
      P.poly(n * .025, tool, k(ST, .45)); P.outline(n * .016, tool, W, .01); glow(P, n * .004, .06, -1.22, .04, C.white);
      const cx = -.2, cy = -.62, pv = [cx, cy, 0, -1.1];
      for (let q = 0; q < n * .03; q++) { const t = Math.sqrt(P.r()), a = -1.15 + t * 1.7 * TAU, r = .05 + .37 * t; P.pt(cx + Math.cos(a) * r + P.g() * .018, cy + Math.sin(a) * r + P.g() * .018, P.g() * .02, mix(C.bronze, C.orange, t), 6, pv); }
      P.line(n * .008, [[.04, -1.14], [.02, -.98]], C.orange, .02);
      P.sparks(n * .006, .05, -.9, .05, C.yellow);
    });
    // nonchip forming: an electrode sparks a cavity into the work under fluid — no chips
    xf(P, shift(.9), () => {
      P.rect(n * .02, -.8, -1.95, 1.6, 1.8, k(C.water, .06)); P.box(n * .014, -.8, -1.95, 1.6, 1.8, k(C.water, .5), .009); P.seg(n * .01, -.8, -.15, .8, -.15, k(C.water, .8), .01);
      const wp = [[-.68, -1.9], [.68, -1.9], [.68, -1.15], [.22, -1.15], [.22, -1.42], [-.22, -1.42], [-.22, -1.15], [-.68, -1.15]];
      P.poly(n * .03, wp, k(S, .3)); P.outline(n * .018, wp, k(S, .85), .009);
      P.rect(n * .03, -.15, -1.26, .3, 1.75, k(C.copper, .45)); P.box(n * .016, -.15, -1.26, .3, 1.75, k(C.copper, 1), .009);
      [[-.1, .04], [.08, -.03]].forEach(([x, o], q) => zap(P, n * .004, x, -1.27, x + o, -1.41, C.white, 4, .03, q ? 11 : 10));
      [[-.02, -.06], [.12, .05]].forEach(([x, o], q) => zap(P, n * .004, x, -1.27, x + o, -1.41, mix(C.ice, C.white, .5), 4, .03, q ? 10 : 11));
      glow(P, n * .006, 0, -1.34, .08, k(C.ice, .8), 10); glow(P, n * .006, 0, -1.34, .06, C.white, 11);
      for (let q = 0; q < n * .016; q++) P.pt((P.r() < .5 ? -1 : 1) * (.2 + P.r() * .3), -.85 + P.g() * .05, 0, k(C.ice, .7), 8);
    });
    // flame / laser: a beam cuts a glowing kerf, sparks fly
    xf(P, shift(2.7), () => {
      P.rect(n * .025, -.8, -1.55, .77, .25, k(S, .32)); P.rect(n * .025, .03, -1.55, .77, .25, k(S, .32));
      P.box(n * .012, -.8, -1.55, 1.6, .25, k(S, .85), .009); P.rect(n * .008, -.03, -1.55, .06, .25, C.orange);
      const head = [[-.25, .95], [.25, .95], [.25, .12], [.09, -.15], [-.09, -.15], [-.25, .12]];
      P.poly(n * .025, head, k(ST, .42)); P.outline(n * .016, head, W, .009);
      P.seg(n * .02, 0, -.15, 0, -1.3, C.hot, .012); P.seg(n * .008, 0, -.15, 0, -1.3, C.white, .005);
      glow(P, n * .01, 0, -1.3, .07, C.white);
      P.sparks(n * .025, 0, -1.0, .1, C.yellow);
      [10, 11].forEach((g, s) => { for (let r = 0; r < 6; r++) { const a = -Math.PI / 2 + (r - 2.5 + s * .5) * .2; P.seg(n * .003, 0, -1.6, Math.cos(a) * .55, -1.6 + Math.sin(a) * .55, C.orange, .01, g); } });
    });
  }, .6),

  /* Joining: solder/braze (a fillet) · weld (a bead and sparks) · adhesive (a glue line pressed) · mechanical (a nut turning on a bolt) */
  joining: () => build(N, 207, (P, n) => { xf(P, (x, y, z) => [x, y * 1.12 + .45, z], () => {
    // solder / braze: a lap joint, a bright fillet, the iron's hot tip
    xf(P, shift(-2.7), () => {
      P.rect(n * .02, -.8, -1.75, 1.15, .18, k(C.copper, .45)); P.box(n * .012, -.8, -1.75, 1.15, .18, C.copper, .009);
      P.rect(n * .02, -.35, -1.57, 1.15, .18, k(C.copper, .45)); P.box(n * .012, -.35, -1.57, 1.15, .18, C.copper, .009);
      for (let q = 0; q < n * .014; q++) { const u = P.r() * .26, v = P.r() * .2; if (v > .2 * (1 - u / .26) ** 2) continue; P.pt(-.35 - u, -1.57 + v, 0, mix(C.white, C.brass, P.r())); }
      for (let q = 0; q < n * .014; q++) { const u = P.r() * .26, v = P.r() * .18; if (v > .18 * (1 - u / .26) ** 2) continue; P.pt(.35 + u, -1.57 - v, 0, mix(C.white, C.brass, P.r())); }
      const iron = [[-.42, -1.45], [-.5, -1.4], [-.66, -.78], [-.56, -.75]];
      P.poly(n * .008, iron, C.orange); P.outline(n * .008, iron, C.yellow, .008);
      const grip = [[-.7, -.76], [-.5, -.72], [-.62, .15], [-.86, .1]];
      P.poly(n * .016, grip, k(ST, .4)); P.outline(n * .012, grip, k(W, .8), .009);
      glow(P, n * .008, -.44, -1.45, .06, C.white); P.sparks(n * .014, -.42, -1.1, .1, k(C.brass, .8));
    });
    // weld: a butt joint, the bead, the arc flickering, sparks
    xf(P, shift(-.9), () => {
      P.rect(n * .025, -.8, -1.85, .74, .36, k(ST, .38)); P.box(n * .014, -.8, -1.85, .74, .36, k(ST, .95), .009);
      P.rect(n * .025, .06, -1.85, .74, .36, k(ST, .38)); P.box(n * .014, .06, -1.85, .74, .36, k(ST, .95), .009);
      for (let q = 0; q < n * .016; q++) { const a = P.r() * Math.PI, d = Math.sqrt(P.r()); P.pt(Math.cos(a) * .22 * d, -1.49 + Math.sin(a) * .12 * d, 0, mix(C.white, C.orange, d)); }
      P.rect(n * .008, -.06, -1.85, .12, .36, C.orange);
      P.seg(n * .014, .06, -1.35, .52, -.3, k(ST, .9), .022); P.seg(n * .014, .52, -.3, .74, .4, k(ST, .5), .055);
      glow(P, n * .007, .03, -1.4, .05, C.white); glow(P, n * .014, .03, -1.4, .22, mix(C.white, C.ice, .4), 10); glow(P, n * .006, .03, -1.4, .11, C.white, 11);
      P.sparks(n * .03, 0, -1.08, .16, C.yellow);
    });
    // adhesive: glue drops on one plate; the other plate presses down and squeezes them into a line
    xf(P, shift(.9), () => {
      P.rect(n * .025, -.8, -1.75, 1.6, .2, k(ST, .38)); P.box(n * .014, -.8, -1.75, 1.6, .2, k(ST, .95), .009);
      for (let q = 0; q < 7; q++) P.disc(n * .003, -.6 + q * .2, -1.49, .055, C.good, 11);
      P.rect(n * .02, -.8, -1.55, 1.6, .05, C.good, 10); [-1, 1].forEach(s => P.disc(n * .004, s * .84, -1.53, .06, C.good, 10));
      P.rect(n * .025, -.8, -1.5, 1.6, .2, k(ST, .45), 7); P.box(n * .014, -.8, -1.5, 1.6, .2, W, .009, 7);
      [-.4, .4].forEach(x => P.arrow(n * .012, x, -.55, x, -1.2, k(C.orange, .9), .14, 7));
    });
    // mechanical: a bolt through two plates; the nut turns (spin about Y) and clamps them
    xf(P, shift(2.7), () => {
      P.rect(n * .02, -.8, -1.45, 1.6, .25, k(ST, .3)); P.box(n * .012, -.8, -1.45, 1.6, .25, k(ST, .9), .009);
      P.rect(n * .02, -.8, -1.2, 1.6, .25, k(C.steel2, .55)); P.box(n * .012, -.8, -1.2, 1.6, .25, k(ST, .9), .009);
      P.rect(n * .016, -.3, -.95, .6, .3, k(C.alu, .5)); P.box(n * .012, -.3, -.95, .6, .3, C.alu, .009); [-.1, .1].forEach(x => P.seg(n * .003, x, -.95, x, -.65, k(C.alu, .7), .006));
      P.rect(n * .008, -.1, -2.05, .2, .32, k(C.alu, .45)); for (let q = 0; q < 5; q++) P.seg(n * .002, -.1, -2.02 + q * .06, .1, -2.0 + q * .06, C.alu, .005);
      const pv = [0, -1.6, 0, 1.4], R = .34, Y0 = -1.75, Y1 = -1.45;
      for (let f = 0; f < 6; f++) { const a0 = f / 6 * TAU, a1 = (f + 1) / 6 * TAU; for (let q = 0; q < n * .004; q++) { const t = P.r(), a = [Math.cos(a0) * R, Math.sin(a0) * R], b = [Math.cos(a1) * R, Math.sin(a1) * R]; const x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t; P.pt(x, Y0 + P.r() * (Y1 - Y0), z, k(C.alu, .4 + .4 * (z / R * .5 + .5)), 0, pv); }
        for (let q = 0; q < n * .0015; q++) { const y = Y0 + P.r() * (Y1 - Y0); P.pt(Math.cos(a0) * R, y, Math.sin(a0) * R, C.alu, 0, pv); }
        [Y0, Y1].forEach(y => { for (let q = 0; q < n * .0012; q++) { const t = P.r(); P.pt(Math.cos(a0) * R * (1 - t) + Math.cos(a1) * R * t, y, Math.sin(a0) * R * (1 - t) + Math.sin(a1) * R * t, k(C.alu, .9), 0, pv); } }); }
    });
  }); }, .6),

  /* Finishing: formed (a textured roll) · abrasive (a grinding wheel throwing sparks) · coatings (a spray) */
  finishing: () => build(N, 208, (P, n) => {
    // formed: a textured roll presses a pattern into the strip passing under it
    xf(P, shift(-2.55), () => {
      P.rect(n * .03, -.9, -1.62, 1.8, .2, k(S, .32)); P.seg(n * .008, -.9, -1.42, 0, -1.42, k(S, .9), .008);
      for (let q = 0; q < 6; q++) { const x = .08 + q * .14; P.curve(n * .003, t => [x + t * .1, -1.42 + Math.sin(t * Math.PI) * .07], k(S, .95), .008); }
      P.box(n * .012, -.9, -1.62, 1.8, .2, k(S, .7), .008);
      P.gear(n * .06, 0, -.97, .45, 24, k(ST, .9), { speed: -.9, depth: .05, hub: .1, spokes: 4 });
      P.gear(n * .04, 0, -1.95, .3, 18, k(ST, .55), { speed: 1.3, depth: .03, hub: .07, spokes: 3 });
    });
    // abrasive: a grinding wheel spinning on the work, sparks thrown off
    xf(P, shift(0), () => {
      const pv = [0, .05, 0, -2.2];
      for (let q = 0; q < n * .07; q++) { const a = P.r() * TAU, d = Math.sqrt(P.r()) * .8; P.pt(Math.cos(a) * d, .05 + Math.sin(a) * d, P.g() * .02, P.r() < .3 ? k(W, .7) : k(ST, .32), 6, pv); }
      P.ring(n * .02, 0, .05, .8, k(W, .7), .01, 6, pv); P.ring(n * .01, 0, .05, .16, W, .01, 6, pv);
      for (let s = 0; s < 3; s++) P.seg(n * .004, 0, .05, Math.cos(s * 2.1) * .7, .05 + Math.sin(s * 2.1) * .7, k(W, .55), .01, 6, pv);
      ell(P, n * .016, 0, .05, .94, .94, k(ST, .8), .012, 0, .05 * Math.PI, .95 * Math.PI);
      P.rect(n * .03, -.85, -1.75, 1.7, .95, k(S, .28)); P.box(n * .016, -.85, -1.75, 1.7, .95, k(S, .85), .01);
      P.seg(n * .01, -.85, -.8, 0, -.8, C.white, .008);
      glow(P, n * .006, 0, -.77, .05, C.white);
      [10, 11].forEach((g, s) => { for (let r = 0; r < 7; r++) { const a = Math.PI + .08 + (r + s * .5) * .13; P.seg(n * .003, -.05, -.78, -.05 + Math.cos(a) * 1.1, -.78 + Math.sin(a) * -.9, mix(C.yellow, C.orange, r / 7), .01, g); } });
      P.sparks(n * .02, -.4, -.5, .2, C.orange);
    });
    // coatings: a spray gun coats the part below
    xf(P, shift(2.55), () => {
      const gun = [[-.1, .45], [.1, .45], [.14, .72], [.55, .76], [.6, 1.05], [-.45, 1.05], [-.45, .76], [-.14, .72]];
      P.poly(n * .025, gun, k(ST, .45)); P.outline(n * .018, gun, k(W, .85), .009);
      P.line(n * .012, [[.32, 1.05], [.46, 1.5]], k(ST, .7), .035);
      P.poly(n * .025, [[0, .42], [.7, -1.3], [-.7, -1.3]], k(S, .1));
      [0, 10, 11].forEach(g => { for (let q = 0; q < n * .015; q++) { const t = Math.sqrt(P.r()), x = (P.r() * 2 - 1) * .7 * t; P.pt(x, .42 - t * 1.72, P.g() * .05, k(mix(S, C.white, P.r() * .5), g ? .95 : .4), g); } });
      P.rect(n * .03, -.8, -1.9, 1.6, .5, k(ST, .3)); P.box(n * .016, -.8, -1.9, 1.6, .5, k(ST, .85), .009);
      P.rect(n * .02, -.8, -1.42, 1.6, .1, C.gold); P.seg(n * .008, -.8, -1.32, .8, -1.32, C.white, .008);
    });
  }, .6),

  /* figure 1-1: materials × the 14 methods as a dot matrix; Ferrous lights up fully, Thermoset shows its empty cells */
  matrix: () => build(N, 209, (P, n) => {
    // ● 3 all · ◕ 2 most · ◒ 1 some · ○ 0 none, read off the slide (rows: ferrous, nonferrous, thermoset, thermoplastics,
    // rubber thermoset, rubber thermoplastics, manufactured carbon, glass, engineered ceramics, refractory hard metals, fibers, wood)
    const M = ['33333333333333', '33333323333333', '30033110033323', '33233110333333', '30031110033311', '33331110333311', '30003100022111', '33031201322311', '32001000032322', '33002223011131', '32333010023111', '11033110033133'];
    const cx = c => -2.95 + c * .45 + (c >= 3 ? .2 : 0) + (c >= 7 ? .2 : 0) + (c >= 11 ? .2 : 0);
    const ry = r => 1.5 - r * .3 - (r >= 2 ? .09 : 0) - (r >= 4 ? .09 : 0) - (r >= 6 ? .09 : 0) - (r >= 10 ? .09 : 0);
    const R = .105;
    // the four families above (Forming · Cutting · Joining · Finishing), the material groups at the left
    [[0, 2], [3, 6], [7, 10], [11, 13]].forEach(([a, b]) => { P.seg(n * .014, cx(a) - .16, 1.86, cx(b) + .16, 1.86, k(S, .65), .008); [a, b].forEach(c => P.seg(n * .002, cx(c) + (c === a ? -.16 : .16), 1.86, cx(c) + (c === a ? -.16 : .16), 1.75, k(S, .65), .006)); glow(P, n * .002, (cx(a) + cx(b)) / 2, 1.97, .03, C.yellow); });
    [[0, 1], [2, 3], [4, 5], [6, 9], [10, 11]].forEach(([a, b]) => P.seg(n * .01, -3.42, ry(a) + .11, -3.42, ry(b) - .11, k(S, .55), .008));
    // the rows to look at: Ferrous (all processes) burns; Thermoset's empty cells go cold
    P.rect(n * .03, cx(0) - .26, ry(0) - .16, cx(13) - cx(0) + .52, .32, k(C.orange, .11));
    P.rect(n * .02, cx(0) - .26, ry(2) - .16, cx(13) - cx(0) + .52, .32, k(C.blue, .1));
    const u = n / 20880, m = x => Math.max(1, Math.round(x * u)); // dot counts were tuned on desktop; scale them for phones
    M.forEach((row, r) => [...row].forEach((ch, c) => {
      const v = +ch, x = cx(c), y = ry(r), hot = r === 0, cold = r === 2 && v === 0;
      if (hot) { P.disc(m(90), x, y, R, C.white); P.ring(m(36), x, y, R, C.yellow, .005); glow(P, m(40), x, y, .1, k(C.yellow, .45)); glow(P, m(40), x, y, .14, k(C.orange, .5), 10); P.sparks(m(14), x, y + .3, .03, C.orange); }
      else if (v === 3) { P.disc(m(46), x, y, R, k(S, .4)); P.ring(m(26), x, y, R, k(S, .62), .005); }
      else if (v === 2) { P.disc(m(22), x, y, R * .95, k(S, .2)); P.ring(m(26), x, y, R, k(S, .55), .005); }
      else if (v === 1) { P.ring(m(26), x, y, R, k(S, .5), .005); for (let q = 0; q < m(22); q++) { const a = Math.PI + P.r() * Math.PI, d = Math.sqrt(P.r()) * R; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d, 0, k(S, .34)); } }
      else if (cold) { P.ring(m(70), x, y, R, C.ice, .005); glow(P, m(30), x, y, .12, k(C.ice, .5), 11); }
      else P.ring(m(22), x, y, R, k(S, .26), .005);
    }));
  }, .58)
});
