// Immersive scenes — strength (names and captions: info.js · SCENES_BY_ZONE.strength; what to draw: docs/SCENES.md; how: STYLE.md).
// Zone colour: amber. Tension runs hot, compression blue (the slides' convention). Seeds 4xx.
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
/** a fixed 3D view: turn about Y (ay) then X (ax), then place at (dx, dy) */
const view = (ay, ax, dx = 0, dy = 0) => { const ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax); return (x, y, z) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca; return [x1 + dx, y * cb - z1 * sb + dy, y * sb + z1 * cb]; }; };
const onEll = (cx, cy, rx, ry, rot, a) => [cx + Math.cos(a) * rx * Math.cos(rot) - Math.sin(a) * ry * Math.sin(rot), cy + Math.cos(a) * rx * Math.sin(rot) + Math.sin(a) * ry * Math.cos(rot)];
function ell(P, n, cx, cy, rx, ry, c, j = .013, g = 0, a0 = 0, a1 = TAU, rot = 0, pv) { P.curve(n, t => onEll(cx, cy, rx, ry, rot, a0 + (a1 - a0) * t), c, j, g, pv); }
function gline(P, n, x1, y1, x2, y2, c1, c2, j = .01, g = 0) { for (let q = 0; q < n; q++) { const t = P.r(); P.pt(x1 + (x2 - x1) * t + P.g() * j, y1 + (y2 - y1) * t + P.g() * j, P.g() * j, mix(c1, c2, t), g); } }
function dash(P, n, x1, y1, x2, y2, c, on = .13, off = .09, j = .011, g = 0) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, per = on + off, m = Math.ceil(L / per);
  for (let q = 0; q < n; q++) { let t; do t = (Math.floor(P.r() * m) * per + P.r() * Math.min(on, L)) / L; while (t > 1); P.pt(x1 + (x2 - x1) * t + P.g() * j, y1 + (y2 - y1) * t + P.g() * j, P.g() * j, c, g); }
}
function glow(P, n, x, y, s, c, g = 0, pv) { for (let q = 0; q < n; q++) P.pt(x + P.g() * s, y + P.g() * s, P.g() * s * .5, c, g, pv); }
function burst(P, n, x, y, r0, r1, c, rays = 9, a0 = 0, a1 = Math.PI, g = 10) {
  for (let q = 0; q < n; q++) { const kk = Math.floor(P.r() * rays), a = a0 + (a1 - a0) * (kk + .5) / rays, len = r1 * (.55 + .45 * ((kk * .618) % 1)), t = Math.pow(P.r(), 1.5), d = r0 + (len - r0) * t; P.pt(x + Math.cos(a) * d + P.g() * .01, y + Math.sin(a) * d + P.g() * .01, P.g() * .02, mix(C.white, c, t), g); }
}
/** a curved arrow along an ellipse arc (head at a1) */
function carrow(P, n, cx, cy, rx, ry, a0, a1, c, head = .18, g = 0) {
  ell(P, Math.round(n * .76), cx, cy, rx, ry, c, .012, g, a0, a1);
  const e = onEll(cx, cy, rx, ry, 0, a1), e2 = onEll(cx, cy, rx, ry, 0, a1 - Math.sign(a1 - a0) * .06), d = Math.atan2(e[1] - e2[1], e[0] - e2[0]);
  [d + 2.55, d - 2.55].forEach(b => P.seg(Math.round(n * .12), e[0], e[1], e[0] + Math.cos(b) * head, e[1] + Math.sin(b) * head, c, .011, g));
}
/** a double-headed dimension arrow */
function dim(P, n, x1, y1, x2, y2, c, g = 0, head = .1) {
  P.seg(Math.round(n * .7), x1, y1, x2, y2, c, .007, g); const a = Math.atan2(y2 - y1, x2 - x1);
  [[x1, y1, a], [x2, y2, a + Math.PI]].forEach(([x, y, b]) => [b + .5, b - .5].forEach(d => P.seg(Math.round(n * .075), x, y, x + Math.cos(d) * head, y + Math.sin(d) * head, c, .006, g)));
}
function line3(P, n, a, b, c, j = .008, g = 0, pv) { P.curve(n, t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], c, j, g, pv); }
/** a symmetric bar along y: half-width w(y) from y0 to y1 — filled, with its two edges drawn */
function profile(P, n, cx, y0, y1, w, cF, cE, g = 0) {
  for (let q = 0; q < n * .7; q++) { const y = y0 + P.r() * (y1 - y0), h = w(y); P.pt(cx + (P.r() * 2 - 1) * h, y, P.g() * .02, typeof cF === 'function' ? cF(y) : cF, g); }
  for (let q = 0; q < n * .3; q++) { const y = y0 + P.r() * (y1 - y0), h = w(y); P.pt(cx + (P.r() < .5 ? -h : h) + P.g() * .007, y, 0, cE, g); }
}
/** a coil spring along y from y0 to y1 (side view of a helix, shaded by depth) */
function coil(P, n, cx, y0, y1, r, turns, c, g = 0, w = .025) { for (let q = 0; q < n; q++) { const t = P.r(), a = t * turns * TAU, z = Math.cos(a) * r; P.pt(cx + Math.sin(a) * r + P.g() * w, y0 + (y1 - y0) * t + P.g() * w, z, k(c, .45 + .55 * (z / r * .5 + .5)), g); } }
/** hatching under a fixed support */
function hatch(P, n, x0, x1, y, c, down = true, step = .14) { for (let x = x0; x < x1; x += step) P.seg(Math.max(1, Math.round(n * step / (x1 - x0))), x, y, x + .1, y + (down ? -.12 : .12), c, .005); }

/* the colours of this zone */
const AM = C.amber, ST = C.steel, W = C.chalk, HOT = C.hot, BLUE = C.blue;

export default N => ({
  /* ★ The stress–strain curve (L2·S8–9): elastic line, yield, the rise to ultimate tensile strength, necking, fracture —
     and the specimen beside it, necking and snapping in time with the plant */
  curve: () => build(N, 409, (P, n) => {
    const X = s => -3.45 + 4.0 * s, Y = v => -2.0 + 3.5 * v;
    const sig = s => s <= .25 ? 2.32 * s : s <= .55 ? .92 - .34 * ((.55 - s) / .3) ** 2 : .92 - .37 * ((s - .55) / .45) ** 2;
    const heat = s => s < .25 ? mix(C.straw, C.gold, s / .25) : s < .55 ? mix(C.gold, C.orange, (s - .25) / .3) : mix(C.orange, C.red, (s - .55) / .45);
    // axes: stress up, strain along
    P.arrow(n * .03, -3.45, -2.0, -3.45, 1.85, k(W, .7), .14); P.arrow(n * .03, -3.45, -2.0, 1.0, -2.0, k(W, .7), .14);
    // the curve, hot as it goes
    for (let q = 0; q < n * .2; q++) { const s = Math.pow(P.r(), .9), v = sig(s); P.pt(X(s) + P.g() * .012, Y(v) + P.g() * .012, P.g() * .01, heat(s)); }
    // guides: elastic | plastic above · yield strength, ultimate tensile strength · uniform elongation | necking
    dash(P, n * .016, -3.45, Y(.58), X(.25), Y(.58), k(C.gold, .55), .1, .07, .007);
    dash(P, n * .02, -3.45, Y(.92), X(.55), Y(.92), k(C.orange, .55), .1, .07, .007);
    dash(P, n * .02, X(.02), -2.0, X(.27), Y(.58), k(C.straw, .4), .1, .07, .007);
    [[.25, Y(.58)], [.55, -.62], [1.0, -2.0]].forEach(([s, y]) => dash(P, n * .016, X(s), 1.62, X(s), y, k(W, .3), .08, .07, .006));
    dim(P, n * .012, -3.45, 1.62, X(.25), 1.62, k(C.straw, .8)); dim(P, n * .02, X(.25), 1.62, X(1.0), 1.62, k(C.orange, .8));
    dim(P, n * .02, -3.45, -.62, X(.55), -.62, k(C.gold, .7)); dim(P, n * .016, X(.55), -.62, X(1.0), -.62, k(C.red, .8));
    // the points: yield, the top (UTS), fracture
    glow(P, n * .006, X(.25), Y(.58), .045, C.yellow); glow(P, n * .008, X(.55), Y(.92), .05, C.white); glow(P, n * .01, X(.55), Y(.92), .15, k(C.orange, .4));
    glow(P, n * .01, X(1.0), Y(.55), .05, C.white); P.sparks(n * .012, X(1.0), Y(.55) + .3, .06, C.orange);
    // where the specimen is on the curve: necking while the halves are together (stroke down), fracture once they part
    glow(P, n * .012, X(.84), Y(sig(.84)), .07, C.white, 10); glow(P, n * .01, X(.84), Y(sig(.84)), .2, k(C.orange, .5), 10);
    glow(P, n * .012, X(1.0), Y(.55), .1, C.white, 11); glow(P, n * .01, X(1.0), Y(.55), .25, k(C.red, .5), 11);
    // the specimen in its machine
    const SX = 2.45, NK = -.3;
    [1.6, 3.3].forEach(x => { P.seg(n * .02, x, -2.2, x, 2.15, k(ST, .45), .02); });
    P.rect(n * .02, 1.45, -2.25, 2.0, .2, k(ST, .35));
    P.rect(n * .02, SX - .45, -2.05, .9, .5, k(ST, .4)); P.box(n * .01, SX - .45, -2.05, .9, .5, k(W, .75), .008);
    P.rect(n * .02, SX - .45, 1.0, .9, .5, k(ST, .4), 7); P.box(n * .01, SX - .45, 1.0, .9, .5, k(W, .75), .008, 7);
    P.rect(n * .02, 1.5, 1.5, 1.9, .22, k(ST, .35), 7); P.box(n * .01, 1.5, 1.5, 1.9, .22, k(W, .6), .008, 7);
    const half = u => u < .5 ? .1 + .13 * Math.sin(u / .5 * Math.PI / 2) : u < .95 ? .23 : u < 1.1 ? .23 + .12 * ((u - .95) / .15) : .35;
    const col = u => mix(k(HOT, .8), k(AM, .5), Math.min(1, u / .6));
    profile(P, n * .06, SX, -1.55, NK, y => half(NK - y), y => col(NK - y), mix(AM, C.white, .35));
    profile(P, n * .06, SX, NK, 1.0, y => half(y - NK), y => col(y - NK), mix(AM, C.white, .35), 7);
    dash(P, n * .008, SX - .23, -1.0, SX - .23, .4, k(W, .3), .06, .05, .005); dash(P, n * .008, SX + .23, -1.0, SX + .23, .4, k(W, .3), .06, .05, .005);
    glow(P, n * .012, SX, NK, .09, C.white, 10); glow(P, n * .01, SX, NK, .25, k(C.orange, .45), 10);
    burst(P, n * .01, SX, NK + .02, .05, .45, C.orange, 8, 0, TAU, 11);
    P.sparks(n * .012, SX, NK + .25, .05, C.orange);
  }, .64),

  /* Stress: a bar pulled from outside; cut it anywhere and the inside answers — arrows meeting arrows */
  stress: () => build(N, 401, (P, n) => {
    const Y0 = -.1, H = 1.15, L = 2.5, G2 = .1;
    [-1, 1].forEach(s => { const x0 = s < 0 ? -L : G2, w = L - G2; P.rect(n * .08, x0, Y0 - H / 2, w, H, k(AM, .28)); P.box(n * .035, x0, Y0 - H / 2, w, H, k(W, .8), .01); P.rect(n * .03, x0, Y0 - H / 2, w, H, k(C.orange, .22), 10); });
    dash(P, n * .014, 0, Y0 - H / 2 - .45, 0, Y0 + H / 2 + .45, k(W, .4), .08, .06);
    // the outside force, pulling both ends
    [-1, 1].forEach(s => { P.rect(n * .012, s > 0 ? L : -L - .22, Y0 - .32, .22, .64, k(ST, .45)); P.arrow(n * .05, s * (L + .25), Y0, s * (L + 1.15), Y0, HOT, .3); P.arrow(n * .03, s * (L + .25), Y0, s * (L + 1.25), Y0, C.white, .32, 10); });
    // the inside: the resistance, on both faces of the cut, pointing at each other
    for (let r = 0; r < 5; r++) { const y = Y0 - .42 + r * .21; [-1, 1].forEach(s => { P.arrow(n * .009, s * 1.0, y, s * .14, y, k(C.yellow, .55), .1); P.arrow(n * .006, s * 1.0, y, s * .14, y, C.white, .1, 10); }); }
    glow(P, n * .012, 0, Y0, .3, k(C.yellow, .3), 10);
  }, .6),

  /* Four loads (L2·S4): tension · compression · shear · torsion — four blocks that change shape with each stroke */
  fourLoads: () => build(N, 402, (P, n) => {
    const w = 1.02, h = 1.48, d = .74, vw = (x0) => view(.5, .32, x0, -.4);
    const E = []; for (const a of [-1, 1]) for (const b of [-1, 1]) { E.push([[-1, a, b], [1, a, b]], [[a, -1, b], [a, 1, b]], [[a, b, -1], [a, b, 1]]); }
    const box = (x0, f, cF, cE, g) => {
      const V = vw(x0), M = (x, y, z) => V(...f(x, y, z));
      xf(P, M, () => P.cuboid(n * .055, 0, 0, 0, w, h, d, cF, g));
      E.forEach(([a, b]) => line3(P, n * .0028, M(a[0] * w / 2, a[1] * h / 2, a[2] * d / 2), M(b[0] * w / 2, b[1] * h / 2, b[2] * d / 2), cE, .007, g));
    };
    const same = (x, y, z) => [x, y, z], v = y => 1 - (2 * y / h) ** 2;
    const loads = [
      [-2.7, (x, y, z) => [x * (1 - .28 * v(y)), y * 1.3, z * (1 - .28 * v(y))], C.orange],
      [-.9, (x, y, z) => [x * (1 + .32 * v(y)), y * .7, z * (1 + .32 * v(y))], BLUE],
      [.9, (x, y, z) => [x + (y > 0 ? .3 : -.05), y, z], AM],
      [2.7, (x, y, z) => { const a = .9 * y / (h / 2); return [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)]; }, C.yellow]
    ];
    loads.forEach(([x0, f, c]) => { box(x0, same, k(c, .3), k(c, .55), 10); box(x0, f, k(c, .45), mix(c, C.white, .35), 11); });
    // the loads, shown while they act
    [-1, 1].forEach(s => P.arrow(n * .014, -2.7, -.4 + s * 1.12, -2.7, -.4 + s * 1.8, C.orange, .18, 11));
    [-1, 1].forEach(s => P.arrow(n * .014, -.9, -.4 + s * 1.62, -.9, -.4 + s * .82, BLUE, .18, 11));
    P.arrow(n * .014, .3, .62, 1.3, .62, AM, .17, 11); P.arrow(n * .014, 1.5, -1.45, .5, -1.45, AM, .17, 11);
    carrow(P, n * .022, 2.7, .66, .7, .18, Math.PI + .3, TAU + .9, C.yellow, .16, 11); carrow(P, n * .022, 2.7, -1.46, .7, .18, -.3, -Math.PI - .9, C.yellow, .16, 11);
  }, .6),

  /* Tension: the grips pull the bar apart — it gets longer and thinner */
  tension: () => build(N, 403, (P, n) => {
    const Y0 = -1.6, top0 = .7, top1 = 1.3;
    // grips: the lower one fixed, the upper one is the moving crosshead (ram)
    P.rect(n * .03, -.6, -2.2, 1.2, .6, k(ST, .35)); P.box(n * .015, -.6, -2.2, 1.2, .6, k(W, .8), .009);
    for (let q = 0; q < 4; q++) { P.seg(n * .002, -.6, -2.08 + q * .12, .6, -2.08 + q * .12, k(ST, .5), .005); P.seg(n * .002, -.6, top0 + .12 + q * .12, .6, top0 + .12 + q * .12, k(ST, .5), .005, 7); }
    P.rect(n * .03, -.6, top0, 1.2, .6, k(ST, .35), 7); P.box(n * .015, -.6, top0, 1.2, .6, k(W, .8), .009, 7);
    P.rect(n * .02, -1.4, top0 + .6, 2.8, .25, k(ST, .3), 7); P.box(n * .01, -1.4, top0 + .6, 2.8, .25, k(W, .6), .009, 7);
    P.arrow(n * .02, 0, top0 + .9, 0, top0 + 1.18, HOT, .16, 7);
    // the bar: as it was (stroke down) and pulled (ram up) — longer, thinner, hot
    const dog = (y0, y1, gw) => y => { const t = y - y0, u = y1 - y; if (t < .25 || u < .25) return .36; const e = Math.min(t, u) - .25; return e < .25 ? .36 - (.36 - gw) * Math.sin(e / .25 * Math.PI / 2) : gw; };
    profile(P, n * .12, 0, Y0, top0, dog(Y0, top0, .22), k(AM, .55), mix(AM, C.white, .4), 10);
    profile(P, n * .12, 0, Y0, top1, dog(Y0, top1, .16), y => mix(k(AM, .55), k(HOT, .75), Math.max(0, 1 - Math.abs(y - (Y0 + top1) / 2) / 1.0)), mix(HOT, C.white, .4), 11);
    // what it was: a ghost of the first width
    dash(P, n * .01, -.22, -1.1, -.22, .2, k(W, .35), .08, .06, .006); dash(P, n * .01, .22, -1.1, .22, .2, k(W, .35), .08, .06, .006);
    // longer: the length bracket · thinner: the section
    dim(P, n * .03, -1.15, Y0, -1.15, top0, k(AM, .9), 10); dim(P, n * .03, -1.15, Y0, -1.15, top1, HOT, 11);
    P.disc(n * .03, 1.55, -.35, .34, k(AM, .5), 10); P.ring(n * .015, 1.55, -.35, .34, mix(AM, C.white, .4), .008, 10);
    P.disc(n * .022, 1.55, -.35, .25, k(HOT, .6), 11); P.ring(n * .015, 1.55, -.35, .25, mix(HOT, C.white, .4), .008, 11);
    ell(P, n * .012, 1.55, -.35, .34, .34, k(W, .3), .008);
    [-1, 1].forEach(s => P.arrow(n * .008, 1.55 + s * .62, -.35, 1.55 + s * .3, -.35, k(HOT, .9), .08, 11));
  }, .6),

  /* Compression: the ram squashes the block — it gets shorter and bulges */
  compression: () => build(N, 404, (P, n) => {
    P.rect(n * .03, -1.35, -2.15, 2.7, .4, k(ST, .35)); P.box(n * .016, -1.35, -2.15, 2.7, .4, k(W, .8), .009); hatch(P, n * .01, -1.3, 1.3, -2.15, k(ST, .5));
    // the block, before (ram up) and squashed (stroke down)
    P.rect(n * .1, -.72, -1.75, 1.44, 1.9, k(BLUE, .45), 11); P.box(n * .03, -.72, -1.75, 1.44, 1.9, mix(BLUE, C.white, .5), .009, 11);
    const side = y => .72 + .34 * Math.sin(Math.PI * (y + 1.75) / 1.3);
    profile(P, n * .14, 0, -1.75, -.45, side, k(BLUE, .55), mix(BLUE, C.white, .55), 10);
    P.seg(n * .01, -.72, -.45, .72, -.45, mix(BLUE, C.white, .5), .008, 10); P.seg(n * .01, -.72, -1.75, .72, -1.75, mix(BLUE, C.white, .5), .008, 10);
    for (let q = 0; q < n * .03; q++) { const t = P.r(); if ((t * 16) % 1 > .5) continue; const y = -1.75 + t * 1.3; P.pt((q % 2 ? 1 : -1) * side(y) + P.g() * .006, y, 0, k(C.ice, .45)); }
    [-1, 1].forEach(s => { burst(P, n * .008, s * 1.08, -1.1, .05, .45, C.ice, 5, s > 0 ? -.7 : Math.PI - .7, s > 0 ? .7 : Math.PI + .7); P.arrow(n * .008, s * 1.12, -1.1, s * 1.5, -1.1, C.ice, .09, 10); });
    // the ram
    P.rect(n * .04, -1.35, -.45, 2.7, .42, k(ST, .4), 7); P.box(n * .018, -1.35, -.45, 2.7, .42, W, .009, 7);
    P.rect(n * .02, -.3, -.03, .6, 1.3, k(ST, .3), 7); P.box(n * .01, -.3, -.03, .6, 1.3, k(W, .7), .009, 7);
    [-.9, .9].forEach(x => P.arrow(n * .015, x, .85, x, -.0, BLUE, .18, 7));
    // shorter: the height bracket · fatter: the section from above
    P.seg(n * .01, -1.75, .15, -1.05, .15, k(W, .25), .006); dim(P, n * .03, -1.85, -1.75, -1.85, .15, k(BLUE, .9), 11); dim(P, n * .03, -1.85, -1.75, -1.85, -.45, mix(BLUE, C.white, .4), 10);
    P.disc(n * .025, 2.35, -.9, .34, k(BLUE, .5), 11); P.ring(n * .014, 2.35, -.9, .34, mix(BLUE, C.white, .4), .008, 11);
    P.disc(n * .035, 2.35, -.9, .5, k(BLUE, .5), 10); P.ring(n * .016, 2.35, -.9, .5, mix(BLUE, C.white, .4), .008, 10);
    ell(P, n * .01, 2.35, -.9, .34, .34, k(W, .3), .008);
  }, .6),

  /* Shear: two blocks slide past each other along one plane — the rivet through them is cut there */
  shearStress: () => build(N, 405, (P, n) => {
    P.rect(n * .1, -2.0, -1.15, 1.98, 1.8, k(AM, .3)); P.box(n * .03, -2.0, -1.15, 1.98, 1.8, k(W, .8), .009);
    P.rect(n * .1, .02, -1.75, 1.98, 1.8, k(AM, .3), 7); P.box(n * .03, .02, -1.75, 1.98, 1.8, k(W, .8), .009, 7);
    // the shear plane
    dash(P, n * .02, 0, -2.2, 0, 1.0, mix(AM, C.white, .5), .1, .06, .008);
    // the rivet: one half in each block
    P.rect(n * .03, -.95, -.42, .95, .3, k(ST, .65)); P.box(n * .012, -.95, -.42, .95, .3, C.white, .007);
    P.rect(n * .03, 0, -1.02, .95, .3, k(ST, .65), 7); P.box(n * .012, 0, -1.02, .95, .3, C.white, .007, 7);
    ell(P, n * .01, -.95, -.27, .14, .24, k(ST, .9), .01, 0, Math.PI / 2, Math.PI * 1.5); ell(P, n * .01, .95, -.87, .14, .24, k(ST, .9), .01, 7, -Math.PI / 2, Math.PI / 2);
    // the forces: one block pushed up, the other down
    P.arrow(n * .03, -1.0, -2.1, -1.0, -1.25, AM, .22); P.arrow(n * .03, 1.0, 1.35, 1.0, .15, AM, .22, 7);
    // the cut faces flare as the plane gives
    glow(P, n * .01, 0, -.42, .1, C.white, 10); burst(P, n * .01, 0, -.6, .05, .5, C.orange, 7, -Math.PI / 2 - 1.2, -Math.PI / 2 + 1.2);
    P.sparks(n * .012, 0, -.3, .05, C.orange);
  }, .6),

  /* Torsion: one end held, the other turned — the shaft twists about its long axis (straight lines become helices) */
  torsion: () => build(N, 406, (P, n) => {
    const R = .5, Hh = 3.0, CY = -1.65, tl = .35, ct = Math.cos(tl), st = Math.sin(tl), PH = 1.15;
    const cyl = (th, rad, al) => [Math.cos(th) * rad, CY + al * ct - Math.sin(th) * rad * st, al * st + Math.sin(th) * rad * ct];
    P.lathe(n * .12, [[R, 0], [R, Hh]], k(AM, .45), { axis: 'y', cx: 0, cy: CY, tilt: tl });
    P.curve(n * .03, t => cyl(t * TAU, R, Hh), mix(AM, C.white, .4), .009);
    // the fixed end: a flange on a hatched base
    P.curve(n * .03, t => cyl(t * TAU, 1.0, 0), k(ST, .8), .01); for (let q = 0; q < n * .03; q++) { const a = P.r() * TAU, d = .5 + Math.sqrt(P.r()) * .5; P.pt(...cyl(a, d, 0), k(ST, .3)); }
    P.seg(n * .03, -1.3, CY - .45, 1.3, CY - .45, k(ST, .8), .009); hatch(P, n * .012, -1.3, 1.3, CY - .45, k(ST, .5));
    P.seg(n * .006, -1.0, CY, -1.0, CY - .45, k(ST, .5), .006); P.seg(n * .006, 1.0, CY, 1.0, CY - .45, k(ST, .5), .006);
    // lines on the surface: straight while it rests (ram up), helices while it is twisted (stroke down)
    for (let l = 0; l < 7; l++) { const th0 = l / 7 * TAU + .3, front = Math.sin(th0) > -.2;
      [[10, 0], [11, PH]].forEach(([g, ph]) => P.curve(n * (front ? .012 : .006), t => cyl(th0 + ph * t, R, t * Hh), k(g === 11 ? C.yellow : W, front ? .85 : .3), .008, g)); }
    // the handle on top, and how far it turned
    [[10, 0], [11, PH]].forEach(([g, ph]) => { P.curve(n * .03, t => cyl(ph, (t * 2 - 1) * 1.15, Hh + .05), k(ST, .9), .02, g); [-1.15, 1.15].forEach(s => { const p = cyl(ph, s, Hh + .05); P.disc(n * .006, p[0], p[1], .09, W, g); }); });
    for (let q = 0; q < n * .012; q++) { const t = P.r(); P.pt(...cyl(PH * t, R * .9, Hh), k(C.yellow, .8), 11); }
    // the turning: a torque arrow round the top, the reaction round the bottom
    const top = cyl(0, 0, Hh); carrow(P, n * .03, top[0], top[1], 1.45, .5, -.6, 1.6, C.orange, .17, 11);
    carrow(P, n * .02, 0, CY - .05, 1.3, .45, 3.7, 1.8, k(C.orange, .5), .15, 11);
  }, .6),

  /* Elasticity: load on — the spring stretches; load off — it comes back to its original length */
  elastic: () => build(N, 407, (P, n) => {
    const TOP = 1.85, Y11 = .15, Y10 = -.45;
    P.rect(n * .025, -1.1, TOP, 2.2, .22, k(ST, .45)); P.box(n * .012, -1.1, TOP, 2.2, .22, k(W, .8), .008); hatch(P, n * .012, -1.1, 1.1, TOP + .22, k(ST, .5), false);
    coil(P, n * .14, 0, Y11 + .12, TOP, .34, 9, AM, 11);
    coil(P, n * .14, 0, Y10 + .12, TOP, .3, 9, mix(AM, HOT, .45), 10);
    [[Y11, 11], [Y10, 10]].forEach(([y, g]) => P.curve(n * .008, t => [Math.sin(t * Math.PI * 1.5) * .12, y + .12 - t * .12], k(W, .8), .008, g));
    // the load: a weight that comes down with the stroke and is taken up again
    P.rect(n * .06, -.55, Y10 - .82, 1.1, .82, k(ST, .4), 7); P.box(n * .025, -.55, Y10 - .82, 1.1, .82, W, .009, 7);
    P.arrow(n * .02, 0, Y10 - .2, 0, Y10 - .62, HOT, .14, 7);
    // its length: the original (always) and the stretch (only under load)
    P.seg(n * .006, .5, TOP, 1.4, TOP, k(W, .3), .005); P.seg(n * .006, .5, Y11 + .12, 1.4, Y11 + .12, k(W, .3), .005);
    dim(P, n * .04, 1.25, TOP, 1.25, Y11 + .12, k(AM, .9));
    dim(P, n * .02, 1.25, Y11 + .12, 1.25, Y10 + .12, HOT, 10); P.seg(n * .006, .4, Y10 + .12, 1.4, Y10 + .12, k(HOT, .6), .005, 10);
    // and it comes back: the same length again once the load goes
    glow(P, n * .008, 1.25, Y11 + .12, .06, C.good, 11);
  }, .6),

  /* Plasticity: the ram presses a dent into the block — the load goes, the dent stays */
  plastic: () => build(N, 408, (P, n) => {
    const r = .51, cyc = -.609, dent = x => cyc - Math.sqrt(Math.max(0, r * r - x * x));
    const top = [[-1.7, -.9], [-.6, -.9], [-.52, -.84], [-.44, -.86]]; for (let q = 0; q <= 16; q++) { const x = -.42 + q / 16 * .84; top.push([x, dent(x)]); } top.push([.44, -.86], [.52, -.84], [.6, -.9], [1.7, -.9]);
    const block = [[-1.7, -2.05], [1.7, -2.05], ...top.slice().reverse()];
    P.poly(n * .16, block, k(AM, .32)); P.outline(n * .05, block, k(W, .8), .009);
    // where the surface was: a ghost line across the dent
    dash(P, n * .012, -.7, -.9, .7, -.9, k(W, .4), .07, .05, .006);
    // the dent glows while the ram is in it; once the ram lifts it is still there
    P.curve(n * .03, t => { const x = -.42 + t * .84; return [x, dent(x)]; }, C.yellow, .012, 11);
    for (let q = 0; q < n * .03; q++) { const x = (P.r() * 2 - 1) * .5, y = dent(Math.min(.42, Math.abs(x))) - P.r() * .35; P.pt(x, y, 0, mix(C.orange, C.yellow, P.r()), 10); }
    burst(P, n * .012, 0, -.95, .3, 1.0, C.orange, 9, .15, Math.PI - .15);
    // the ram with a round nose
    const nose = []; for (let q = 0; q <= 16; q++) { const a = Math.PI + q / 16 * Math.PI; nose.push([Math.cos(a) * .42, -.62 + Math.sin(a) * .5]); }
    const ram = [...nose, [.42, 1.0], [-.42, 1.0]];
    P.poly(n * .06, ram, k(ST, .42), 7); P.outline(n * .025, ram, W, .009, 7);
    P.rect(n * .025, -1.1, 1.0, 2.2, .35, k(ST, .35), 7); P.box(n * .012, -1.1, 1.0, 2.2, .35, k(W, .75), .009, 7);
    P.arrow(n * .015, 0, 1.95, 0, 1.42, HOT, .16, 7);
  }, .6),

  /* Yield strength: one marker line. Bent less than that, the bar springs back; bent past it, it stays bent */
  yield: () => build(N, 410, (P, n) => {
    const LIM = .1, Y0 = .6, Lb = 2.2, v = xi => xi * xi * (3 - xi) / 2;
    const rig = (x0, dmax, set, ok) => {
      P.rect(n * .03, x0 - .32, -.45, .32, 1.95, k(ST, .35)); P.box(n * .014, x0 - .32, -.45, .32, 1.95, k(W, .7), .008);
      for (let q = 0; q < 8; q++) P.seg(n * .002, x0 - .32, -.4 + q * .24, x0 - .2, -.28 + q * .24, k(ST, .55), .005);
      const bar = (d, g, c) => { for (let q = 0; q < n * .05; q++) { const xi = P.r(), x = x0 + xi * Lb, y = Y0 - d * v(xi) + (P.r() * 2 - 1) * .08; P.pt(x, y, P.g() * .01, c, g); } P.curve(n * .02, t => [x0 + t * Lb, Y0 - d * v(t) + .08], mix(c, C.white, .35), .007, g); P.curve(n * .02, t => [x0 + t * Lb, Y0 - d * v(t) - .08], mix(c, C.white, .35), .007, g); };
      bar(0, 11, k(AM, .6));
      if (!ok) bar(set, 11, mix(AM, HOT, .6));
      bar(dmax, 10, mix(AM, HOT, ok ? .2 : .7));
      if (!ok) P.curve(n * .012, t => [x0 + t * Lb, Y0 - 0 * t], k(W, .3), .008, 11);
      const xr = x0 + Lb - .2, yr = Y0 - dmax * v((Lb - .2) / Lb) + .08;
      P.rect(n * .03, xr - .2, yr, .4, 1.05, k(ST, .42), 7); P.box(n * .014, xr - .2, yr, .4, 1.05, W, .008, 7);
      P.arrow(n * .01, xr, yr + 1.5, xr, yr + 1.1, HOT, .12, 7);
      glow(P, n * .008, xr, yr, .06, C.white, 10);
    };
    rig(-3.15, .38, 0, true);
    rig(.55, 1.0, .45, false);
    // the yield limit: past this line the change is permanent
    dash(P, n * .05, -3.3, LIM, 3.1, LIM, C.red, .16, .08, .008);
    glow(P, n * .008, -3.3, LIM, .04, C.red); glow(P, n * .008, 3.1, LIM, .04, C.red);
    // springs back · stays bent
    glow(P, n * .01, -.95, Y0, .07, C.good, 11);
    glow(P, n * .01, 2.75, Y0 - .5, .08, HOT, 11);
  }, .6),

  /* Necking: the specimen thins in one place, then snaps in two */
  necking: () => build(N, 411, (P, n) => { xf(P, (x, y, z) => [x * .88, (y + .2) * .88 - .2, z * .88], () => {
    const NK = -.05;
    [-1.7, 1.7].forEach(x => P.seg(n * .03, x, -2.2, x, 2.25, k(ST, .45), .025));
    P.rect(n * .025, -1.9, -2.25, 3.8, .25, k(ST, .35)); P.box(n * .012, -1.9, -2.25, 3.8, .25, k(W, .6), .008);
    P.rect(n * .03, -.75, -2.0, 1.5, .62, k(ST, .4)); P.box(n * .015, -.75, -2.0, 1.5, .62, k(W, .75), .008);
    P.rect(n * .03, -.75, 1.27, 1.5, .62, k(ST, .4), 7); P.box(n * .015, -.75, 1.27, 1.5, .62, k(W, .75), .008, 7);
    P.rect(n * .025, -1.95, 1.89, 3.9, .26, k(ST, .35), 7); P.box(n * .012, -1.95, 1.89, 3.9, .26, k(W, .6), .008, 7);
    const half = u => u < .62 ? .12 + .2 * Math.sin(u / .62 * Math.PI / 2) : u < 1.0 ? .32 : u < 1.18 ? .32 + .2 * ((u - 1.0) / .18) : .52;
    const col = u => mix(mix(C.white, HOT, .3), k(AM, .45), Math.min(1, u / .75));
    profile(P, n * .14, 0, -1.38, NK, y => half(NK - y), y => col(NK - y), mix(AM, C.white, .4));
    profile(P, n * .14, 0, NK, 1.32, y => half(y - NK), y => col(y - NK), mix(AM, C.white, .4), 7);
    // how wide it was: the ghost of the first width
    [-1, 1].forEach(s => dash(P, n * .012, s * .32, -1.0, s * .32, .9, k(W, .35), .07, .05, .006));
    // thinning: hot at the neck while it holds · snapped: sparks at both ends once it parts
    glow(P, n * .014, 0, NK, .1, C.white, 10); glow(P, n * .012, 0, NK, .3, k(C.orange, .4), 10);
    [-1, 1].forEach(s => P.arrow(n * .008, s * .75, NK, s * .3, NK, k(HOT, .9), .1, 10));
    burst(P, n * .012, 0, NK, .06, .6, C.orange, 9, Math.PI + .3, TAU - .3, 11); burst(P, n * .012, 0, NK + .6, .06, .6, C.orange, 9, .3, Math.PI - .3, 11);
    P.sparks(n * .018, 0, NK + .3, .06, C.orange);
  }); }, .6),

  /* Strain and elongation: the original length L0 and how much longer it got (ΔL); strain is the change */
  elongation: () => build(N, 412, (P, n) => {
    P.rect(n * .03, -3.55, -1.5, .3, 2.95, k(ST, .35)); P.box(n * .014, -3.55, -1.5, .3, 2.95, k(W, .7), .008);
    for (let q = 0; q < 11; q++) P.seg(n * .002, -3.55, -1.45 + q * .27, -3.42, -1.32 + q * .27, k(ST, .55), .005);
    const L0 = 4.0, X0 = -3.25, DL = 1.2;
    // the original (a reference bar, always)
    P.rect(n * .05, X0, .55, L0, .32, k(W, .14)); P.box(n * .02, X0, .55, L0, .32, k(W, .55), .008);
    dim(P, n * .03, X0, 1.15, X0 + L0, 1.15, k(W, .7)); [X0, X0 + L0].forEach(x => P.seg(n * .003, x, .9, x, 1.25, k(W, .4), .005));
    // the test bar: as long as the original (ram up), and pulled longer (stroke down)
    P.rect(n * .07, X0, -.75, L0, .32, k(AM, .45), 10); P.box(n * .02, X0, -.75, L0, .32, mix(AM, C.white, .4), .008, 10);
    P.rect(n * .07, X0, -.72, L0, .26, k(AM, .45), 11); P.rect(n * .03, X0 + L0, -.72, DL, .26, k(HOT, .7), 11);
    P.box(n * .024, X0, -.72, L0 + DL, .26, mix(AM, C.white, .4), .008, 11);
    P.arrow(n * .02, X0 + L0 + DL + .1, -.59, X0 + L0 + DL + .85, -.59, HOT, .2, 11);
    for (let q = 0; q < 5; q++) { const x = X0 + .4 + q * .8; P.seg(n * .002, x, -.75, x, -.43, k(W, .6), .005, 10); const x2 = X0 + .4 + q * .8 * (L0 + DL) / L0; P.seg(n * .002, x2, -.72, x2, -.46, k(W, .6), .005, 11); }
    // where the original ended, carried down · L0 under the bar · ΔL, the change
    dash(P, n * .012, X0 + L0, .55, X0 + L0, -1.3, k(W, .35), .07, .05, .006);
    dim(P, n * .03, X0, -1.15, X0 + L0, -1.15, k(AM, .8));
    dim(P, n * .015, X0 + L0, -1.15, X0 + L0 + DL, -1.15, HOT, 11);
    // strain = ΔL / L0, as a fraction of two bars
    P.rect(n * .02, 2.0, 1.72, DL * .75, .16, k(HOT, .85), 11); P.seg(n * .01, 1.45, 1.5, 3.45, 1.5, k(W, .75), .006, 11); P.rect(n * .03, 1.5, 1.12, L0 * .48, .16, k(AM, .65), 11);
  }, .6)
});
