// Immersive scenes — iron (names and captions: info.js · SCENES_BY_ZONE.iron; what to draw: docs/SCENES.md; how: STYLE.md).
// Lecture 2, the cast irons. Each iron is told by what is inside it (the graphite shape, drawn bright on a dim matrix, like
// a micrograph in light) and by the job it does (a part that keeps working: flywheel, crankshaft, crusher rolls, brake drum…).
import { build, C, k, mix, inside } from './kit.js';

const PI = Math.PI, PL = C.plum;
/* ---------------- local helpers ---------------- */
const fit = (draw, t = .97) => (P, n) => { const pt0 = P.pt; let c = 0; P.pt = () => { c++; }; draw(P, n); P.pt = pt0; draw(P, n * Math.min(4, t * n / Math.max(1, c))); };
function zoom(P, s, ox = 0, oy = 0) { const pt = P.pt; P.pt = (x, y, z, c, g, pv) => pt(x * s + ox, y * s + oy, z * s, c, g, pv ? [pv[0] * s + ox, pv[1] * s + oy, pv[2] * s, pv[3]] : pv); }
function glow(P, n, x, y, r, c, g = 0, sy = 1) { for (let q = 0; q < n; q++) { const a = P.r() * PI * 2, d = Math.pow(P.r(), 1.8) * r; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d * sy, P.g() * .05, mix(c, C.white, Math.max(0, .6 - d / r)), g); } }
function walker(pts) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = L[L.length - 1] || 1e-6;
  const at = d => { d = Math.max(0, Math.min(T, d)); let lo = 0, hi = L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= d) lo = m; else hi = m; } const A = pts[lo], B = pts[hi], l = (L[hi] - L[lo]) || 1e-6, t = (d - L[lo]) / l; return [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, -(B[1] - A[1]) / l, (B[0] - A[0]) / l]; };
  return { at, T };
}
function oline(P, n, pts, c, { z = 0, closed = true, j = .009, g = 0, pv } = {}) {
  const ps = closed ? [...pts, pts[0]] : pts; const { at, T } = walker(ps);
  for (let q = 0; q < n; q++) { const [x, y] = at(P.r() * T); P.pt(x + P.g() * j, y + P.g() * j, z + P.g() * j, c, g, pv); }
}
const DS = { ox: .3, oy: .19, oz: -.5 };
function prism(P, n, pts, c, { D = DS, g = 0, pv, f = .34, fill = .5, back = .34 } = {}) {
  P.poly(Math.round(n * fill), pts, k(c, f), g, pv);
  oline(P, Math.round(n * (1 - fill) * .62), pts, c, { g, pv });
  oline(P, Math.round(n * (1 - fill) * .26), pts.map(([x, y]) => [x + D.ox, y + D.oy]), k(c, back), { z: D.oz, g, pv });
  const m = Math.round(n * (1 - fill) * .12 / pts.length);
  pts.forEach(([x, y]) => { for (let q = 0; q < m; q++) { const t = P.r(); P.pt(x + D.ox * t, y + D.oy * t, D.oz * t, k(c, back), g, pv); } });
}
const rectP = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

/* the inside of an iron: features placed apart inside a region (inR) — drawn bright on a dim matrix */
function spots(P, count, inR, bb, dmin, tries = 400) {
  const out = []; let t = 0;
  while (out.length < count && t++ < tries * count) { const x = bb[0] + P.r() * (bb[2] - bb[0]), y = bb[1] + P.r() * (bb[3] - bb[1]); if (!inR(x, y)) continue; if (out.some(([a, b]) => Math.hypot(a - x, b - y) < dmin)) continue; out.push([x, y]); }
  return out;
}
function matrix(P, n, inR, bb, c, g = 0, pv) { let q = 0, t = 0; while (q < n && t++ < n * 40) { const x = bb[0] + P.r() * (bb[2] - bb[0]), y = bb[1] + P.r() * (bb[3] - bb[1]); if (inR(x, y)) { P.pt(x, y, P.g() * .02, c, g, pv); q++; } } }
/** gray iron: thin curved graphite flakes, some branched */
function flakes(P, n, inR, bb, count, c, { len = [.22, .42], g = 0, pv, sc = 1 } = {}) {
  const sp = spots(P, count, inR, bb, .22 * sc), m = n / Math.max(1, sp.length);
  sp.forEach(([x, y]) => {
    const a = P.r() * PI, L = (len[0] + P.r() * (len[1] - len[0])) * sc, bend = (P.r() - .5) * 2.2;
    for (let q = 0; q < m; q++) { const t = P.r() - .5, aa = a + bend * t, px = x + Math.cos(a) * t * L + Math.cos(aa + PI / 2) * bend * t * t * L * .5, py = y + Math.sin(a) * t * L + Math.sin(aa + PI / 2) * bend * t * t * L * .5; if (inR(px, py)) P.pt(px + P.g() * .006 * sc, py + P.g() * .006 * sc, 0, mix(c, C.white, .2 * (1 - Math.abs(t) * 2)), g, pv); }
    if (P.r() < .45) { const t0 = P.r() - .5, bx = x + Math.cos(a) * t0 * L, by = y + Math.sin(a) * t0 * L, b = a + (P.r() < .5 ? .7 : -.7); for (let q = 0; q < m * .3; q++) { const t = P.r() * .45 * L, px = bx + Math.cos(b) * t, py = by + Math.sin(b) * t; if (inR(px, py)) P.pt(px, py, 0, k(c, .85), g, pv); } }
  });
}
/** ductile iron: round nodules with a bright rim */
function nodules(P, n, inR, bb, count, c, { r = [.05, .085], g = 0, pv, sc = 1 } = {}) {
  const sp = spots(P, count, inR, bb, .2 * sc), m = n / Math.max(1, sp.length);
  sp.forEach(([x, y]) => { const R = (r[0] + P.r() * (r[1] - r[0])) * sc; for (let q = 0; q < m; q++) { const a = P.r() * PI * 2, rim = P.r() < .5, d = rim ? R : Math.sqrt(P.r()) * R; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d, 0, rim ? mix(c, C.white, .35) : k(c, .75), g, pv); } });
}
/** compacted graphite: short thick worms with round ends */
function worms(P, n, inR, bb, count, c, { g = 0, pv, sc = 1 } = {}) {
  const sp = spots(P, count, inR, bb, .2 * sc), m = n / Math.max(1, sp.length);
  sp.forEach(([x, y]) => {
    const pts = [[x, y]]; let a = P.r() * PI * 2; for (let s = 0; s < 4; s++) { a += (P.r() - .5) * 1.6; const [px, py] = pts[pts.length - 1]; pts.push([px + Math.cos(a) * .055 * sc, py + Math.sin(a) * .055 * sc]); }
    const { at, T } = walker(pts);
    for (let q = 0; q < m; q++) { const [px, py] = at(P.r() * T), d = Math.sqrt(P.r()) * .033 * sc, b = P.r() * PI * 2; const X = px + Math.cos(b) * d, Y = py + Math.sin(b) * d; if (inR(X, Y)) P.pt(X, Y, 0, mix(c, C.white, .25 * (1 - d / (.033 * sc))), g, pv); }
  });
}
/** malleable iron: temper-carbon clusters, irregular "popcorn" */
function clusters(P, n, inR, bb, count, c, { g = 0, pv, sc = 1 } = {}) {
  const sp = spots(P, count, inR, bb, .24 * sc), m = n / Math.max(1, sp.length);
  sp.forEach(([x, y]) => { const lobes = Array.from({ length: 5 }, () => [x + P.g() * .04 * sc, y + P.g() * .04 * sc, (.022 + P.r() * .025) * sc]); for (let q = 0; q < m; q++) { const [lx, ly, lr] = lobes[Math.floor(P.r() * lobes.length)], a = P.r() * PI * 2, d = Math.sqrt(P.r()) * lr; P.pt(lx + Math.cos(a) * d, ly + Math.sin(a) * d, 0, mix(c, C.white, .2 * (1 - d / lr)), g, pv); } });
}
/** white iron: bright cementite needles in two or three directions */
function needles(P, n, inR, bb, count, c, { g = 0, pv, sc = 1 } = {}) {
  const sp = spots(P, count, inR, bb, .1 * sc), m = n / Math.max(1, sp.length), dirs = [.3, 1.35, 2.4];
  sp.forEach(([x, y]) => { const a = dirs[Math.floor(P.r() * 3)] + P.g() * .08, L = (.08 + P.r() * .14) * sc; for (let q = 0; q < m; q++) { const t = P.r() - .5, px = x + Math.cos(a) * t * L, py = y + Math.sin(a) * t * L; if (inR(px, py)) P.pt(px + P.g() * .005, py + P.g() * .005, 0, c, g, pv); } });
}
/** a round micrograph "lens" with a rim */
function lens(P, n, cx, cy, R, kind, c, mc, { count, sc = 1 } = {}) {
  const inR = (x, y) => (x - cx) ** 2 + (y - cy) ** 2 < R * R * .96, bb = [cx - R, cy - R, cx + R, cy + R];
  matrix(P, n * .34, inR, bb, mc);
  kind(P, n * .5, inR, bb, count, c, { sc });
  P.ring(Math.round(n * .12), cx, cy, R, mix(c, C.chalk, .4), .012); P.ring(Math.round(n * .04), cx, cy, R + .07, k(C.chalk, .3), .01);
}
/** a crankshaft lying along x, turning about its own axis (group 12). throws: x positions; pins at angle th in the y–z plane */
function crank(P, n, cy, xs, throws, { r = .4, rj = .16, rp = .14, wg = .2, c = C.steel, speed = 1.6, th = -PI / 2, cz = 0 } = {}) {
  const pv = [0, cy, cz, speed], g = 12, py = r * Math.cos(th), pz = r * Math.sin(th), dy = Math.cos(th), dz = Math.sin(th);
  const lit = (cc, a) => k(cc, .5 + .5 * Math.max(0, Math.sin(a)));
  const cyl = (m, xa, xb, R, oy, oz, cc) => { for (let q = 0; q < m; q++) { const a = P.r() * PI * 2, x = xa + P.r() * (xb - xa); P.pt(x, cy + oy + Math.cos(a) * R, cz + oz + Math.sin(a) * R, lit(cc, a), g, pv); } };
  // main journals between the webs
  const edges = [xs[0], ...throws.flatMap(x => [x - wg - .05, x + wg + .05]), xs[1]];
  for (let i = 0; i < edges.length; i += 2) cyl(n * .2 * (edges[i + 1] - edges[i]) / (xs[1] - xs[0]) * 2, edges[i], edges[i + 1], rj, 0, 0, c);
  throws.forEach(x => {
    cyl(n * .06, x - wg + .05, x + wg - .05, rp, py, pz, mix(c, C.orange, .25));
    [x - wg, x + wg].forEach(xw => {
      const tw = .4 * r, ra = .48 * r, rq = .4 * r, rc = .84 * r;
      for (let q = 0; q < n * .07; q++) { const s = -rc + P.r() * (r + rq + rc), t = (P.r() - .5) * 2 * rc; const inWeb = (s >= 0 && s <= r && Math.abs(t) < tw) || Math.hypot(s, t) < ra || Math.hypot(s - r, t) < rq, inCw = s < 0 && Math.hypot(s, t) < rc; if (!inWeb && !inCw) { q--; continue; } const yy = s * dy - t * dz, zz = s * dz + t * dy; P.pt(xw + (P.r() - .5) * wg * .45, cy + yy, cz + zz, k(c, inCw ? .55 : .75), g, pv); }
    });
  });
  // marks that make the turning visible: a bright stripe along each journal
  for (let i = 0; i < edges.length; i += 2) for (let q = 0; q < n * .015; q++) { const x = edges[i] + P.r() * (edges[i + 1] - edges[i]); P.pt(x, cy + Math.cos(.8) * rj, cz + Math.sin(.8) * rj, C.white, g, pv); }
}

/* ---------------- the scenes ---------------- */
export default N => {
  const B = (seed, draw, fill) => () => build(N, seed, fit(draw), fill);
  return {
    /* ★ six irons, six insides, six jobs: ingots with their graphite shape on the face; above each, its job, working */
    irons: B(601, (P, n) => {
      // a 3 × 2 board: each card = an ingot showing its graphite + its job beside it, working
      const cells = [[-2.4, 1.1], [0, 1.1], [2.4, 1.1], [-2.4, -1.2], [0, -1.2], [2.4, -1.2]];
      const kinds = [flakes, nodules, needles, worms, clusters, null], counts = [7, 9, 22, 9, 6, 0];
      const fc = [C.steel, mix(PL, C.white, .3), C.white, mix(C.violet, PL, .35), C.amber, C.ice];
      cells.forEach(([cx, cy], i) => {
        const x = cx - .5, y0 = cy - .78, y1 = cy + .72, face = [[x - .55, y0], [x + .55, y0], [x + .46, y1], [x - .46, y1]];
        const inR = (px, py) => inside(face, px, py), bb = [x - .55, y0, x + .55, y1];
        matrix(P, n * .045, inR, bb, i === 2 ? k(mix(PL, C.white, .5), .32) : k(PL, .26));
        P.outline(n * .02, face, mix(fc[i], C.chalk, .3));
        oline(P, n * .01, [[x - .46, y1], [x - .46 + .2, y1 + .13], [x + .46 + .2, y1 + .13], [x + .46, y1]], k(PL, .65), { closed: false, z: -.2 });
        oline(P, n * .008, [[x + .55, y0], [x + .55 + .2, y0 + .13], [x + .46 + .2, y1 + .13]], k(PL, .5), { closed: false, z: -.2 });
        if (kinds[i]) kinds[i](P, n * .05, inR, bb, counts[i], fc[i], { sc: i === 2 ? 1.1 : 1.15 });
        else [[C.ice, .22], [C.chalk, .2]].forEach(([c, d]) => spots(P, 11, inR, bb, d).forEach(([sx, sy]) => { for (let q = 0; q < n * .0016; q++) { const a = P.r() * PI * 2, dd = Math.sqrt(P.r()) * .045; P.pt(sx + Math.cos(a) * dd, sy + Math.sin(a) * dd, 0, c, 0); } }));
      });
      const J = cells.map(([cx, cy]) => [cx + .8, cy]);
      // gray: a flywheel / gear
      P.gear(n * .07, J[0][0], J[0][1], .5, 12, mix(C.steel, PL, .3), { speed: .55, depth: .1, hub: .11, spokes: 5 });
      // ductile: a crankshaft turning
      crank(P, n * .09, J[1][1], [J[1][0] - .5, J[1][0] + .5], [J[1][0] - .18, J[1][0] + .22], { r: .26, rj: .08, rp: .07, wg: .08, c: mix(C.steel, PL, .3), speed: 1.6 });
      // white: crusher rolls grinding rock
      P.gear(n * .03, J[2][0] - .25, J[2][1], .24, 12, k(C.chalk, .6), { speed: -.9, depth: .06, hub: .06, spokes: 3 });
      P.gear(n * .03, J[2][0] + .25, J[2][1], .24, 12, k(C.chalk, .6), { speed: .9, depth: .06, hub: .06, spokes: 3 });
      for (let q = 0; q < n * .012; q++) P.pt(J[2][0] + P.g() * .12, J[2][1] + .4 + P.r() * .35, 0, k(C.amber, .7), 0);
      // CGI: a brake drum, hot where the shoes rub
      { const [x, y] = J[3], pv = [x, y, 0, .7]; P.ring(n * .03, x, y, .48, mix(C.violet, PL, .4), .012, 6, pv); P.ring(n * .018, x, y, .4, k(C.violet, .7), .01, 6, pv);
        for (let h = 0; h < 5; h++) { const a = h / 5 * PI * 2; P.ring(n * .004, x + Math.cos(a) * .22, y + Math.sin(a) * .22, .035, C.chalk, .006, 6, pv); }
        P.arc(n * .014, x, y, .37, PI * .65, PI * 1.35, C.orange, .015); P.arc(n * .014, x, y, .37, -PI * .35, PI * .35, C.orange, .015); P.sparks(n * .01, x, y + .45, .14, C.orange); }
      // malleable: a bearing turning
      { const [x, y] = J[4], pv = [x, y, 0, .8]; P.ring(n * .025, x, y, .48, C.amber, .012, 6, pv); P.ring(n * .015, x, y, .39, k(C.amber, .7), .01, 6, pv); P.ring(n * .015, x, y, .22, k(C.amber, .7), .01, 6, pv); P.ring(n * .01, x, y, .12, C.amber, .01, 6, pv);
        for (let b = 0; b < 8; b++) { const a = b / 8 * PI * 2; P.disc(n * .004, x + Math.cos(a) * .32, y + Math.sin(a) * .32, .06, C.yellow, 6, pv); } }
      // high-alloy: a shield (oxidation and wear) with its alloy mark
      { const [x, y] = J[5], sh = [[x - .38, y + .46], [x + .38, y + .46], [x + .38, y + .02], [x, y - .5], [x - .38, y + .02]]; P.poly(n * .025, sh, k(C.ice, .22)); P.outline(n * .025, sh, C.ice);
        P.text(n * .018, 'Cr', '800 200px "Big Shoulders Display"', .38, C.chalk, null, false, y + .1, x); }
    }, .66),

    /* cast iron: molten iron and its recipe — at least 2% carbon, 1–3% silicon (specks in the melt) */
    castIron: B(602, (P, n) => {
      const cx = -.75, top = .45, wall = [[cx - 1.45, 1.0], [cx - 1.15, -1.75], [cx + 1.15, -1.75], [cx + 1.45, 1.0], [cx + 1.25, 1.0], [cx + .97, -1.55], [cx - .97, -1.55], [cx - 1.25, 1.0]];
      prism(P, n * .1, wall, C.steel, { f: .3 });
      const inMelt = (x, y) => { if (y > top || y < -1.55) return false; const t = (y + 1.55) / 2.55, hw = .97 + t * (1.25 - .97) * (2.55 / 2.55); return Math.abs(x - cx) < hw - .02; };
      const C1 = spots(P, 22, inMelt, [cx - 1.2, -1.5, cx + 1.2, top - .1], .2), S1 = spots(P, 13, (x, y) => inMelt(x, y) && !C1.some(([a, b]) => Math.hypot(a - x, b - y) < .2), [cx - 1.2, -1.5, cx + 1.2, top - .1], .22);
      const SP = C1.concat(S1), near = (x, y) => SP.some(([a, b]) => (a - x) * (a - x) + (b - y) * (b - y) < .0072);
      let q = 0, tries = 0; while (q < n * .42 && tries++ < n * 20) { const x = cx - 1.3 + P.r() * 2.6, y = -1.56 + P.r() * (top + 1.56); if (!inMelt(x, y) || near(x, y)) continue; const t = (y + 1.55) / (top + 1.55); P.pt(x, y, P.g() * .04, k(mix(C.red, mix(C.orange, C.yellow, Math.max(0, t - .6) * 2.5), t), .55 + .35 * t), 0); q++; }
      for (let q2 = 0; q2 < n * .05; q2++) { const x = cx - 1.22 + P.r() * 2.44; P.pt(x, top + P.g() * .02, P.g() * .03, mix(C.yellow, C.white, .5), 0); }
      C1.forEach(([x, y]) => { for (let w = 0; w < n * .0045; w++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * .05; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d, .05, C.chalk, 0); } });
      S1.forEach(([x, y]) => { for (let w = 0; w < n * .0045; w++) { const a = P.r() * PI * 2, d = Math.sqrt(P.r()) * .05; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d, .05, C.ice, 0); } });
      P.sparks(n * .06, cx, top + .1, .6, C.orange);
      // the recipe, beside it
      const lx = 1.75;
      P.disc(n * .012, lx, .55, .1, C.chalk); P.text(n * .06, '≥2% C', '800 200px "Big Shoulders Display"', 1.35, C.chalk, null, false, .55, lx + .95);
      P.disc(n * .012, lx, -.55, .1, C.ice); P.text(n * .07, '1–3% Si', '800 200px "Big Shoulders Display"', 1.55, C.ice, null, false, -.55, lx + 1.05);
    }, .64),

    /* gray iron: graphite flakes; the flakes swallow a vibration (big wave in, small wave out); its job: a flywheel turning */
    grayIron: B(603, (P, n) => {
      const lx = -1.0, R = 1.35;
      lens(P, n * .42, lx, .05, R, flakes, C.steel, k(PL, .22), { count: 16, sc: 1.3 });
      // the vibration: strong before, almost nothing after
      const wave = (x0, x1, a0, a1, c0, c1, m) => { for (let q = 0; q < m; q++) { const t = P.r(), x = x0 + (x1 - x0) * t, A = a0 + (a1 - a0) * t; P.pt(x, .05 + A * Math.sin((x - x0) * 9) + P.g() * .01, 0, mix(c0, c1, t), 0); } };
      wave(-3.55, lx - R - .05, .55, .4, C.hot, C.orange, n * .09);
      wave(lx + R + .05, 1.15, .07, .02, C.ice, k(C.ice, .5), n * .03);
      // the job: a flywheel (gear) turning
      P.gear(n * .3, 2.45, .05, 1.1, 18, mix(C.steel, PL, .25), { speed: .5, depth: .12, hub: .22, spokes: 6 });
      { const pv = [2.45, .05, 0, .5]; flakes(P, n * .06, (x, y) => { const d = Math.hypot(x - 2.45, y - .05); return d > .28 && d < .8; }, [1.6, -.8, 3.3, .9], 10, k(C.steel, .8), { sc: .8, g: 6, pv }); }
    }, .64),

    /* ductile iron: round nodules (magnesium makes them); its job: a crankshaft */
    ductileIron: B(604, (P, n) => {
      const lx = -2.05, R = 1.3;
      lens(P, n * .42, lx, .1, R, nodules, mix(PL, C.white, .2), k(PL, .2), { count: 16, sc: 1.4 });
      P.text(n * .03, 'Mg', '800 200px "Big Shoulders Display"', .5, C.good, null, false, -1.55, lx + 1.0);
      glow(P, n * .01, lx + .62, -1.55, .2, C.good);
      crank(P, n * .5, .05, [-.2, 3.45], [.6, 1.65, 2.7], { r: .5, rj: .17, rp: .15, wg: .2, c: mix(C.steel, PL, .3), speed: 1.4 });
    }, .64),

    /* white iron: chilled against a cold chill block in the mould (white, needles) while the inside stays gray (flakes);
       its job: crusher rolls grinding */
    whiteIron: B(605, (P, n) => {
      const x0 = -3.0, x1 = -.75, y0 = -1.3, y1 = 1.05;
      // the mould (sand), the chill block on the left
      for (let q = 0; q < n * .08; q++) { const x = x0 - .55 + P.r() * (x1 - x0 + 1.0), y = y0 - .4 + P.r() * (y1 - y0 + .7); if (x > x0 && x < x1 && y > y0 && y < y1) continue; if (x < x0 - .25 && x > x0 - .55) continue; P.pt(x, y, P.g() * .02, k(C.amber, .22), 0); }
      prism(P, n * .06, rectP(x0 - .55, y0 - .2, .3, y1 - y0 + .4), C.ice, { f: .45 });
      // the casting: white where it chilled, gray inside
      const inC = (x, y) => x > x0 && x < x1 && y > y0 && y < y1, w = (x) => Math.max(0, 1 - (x - x0) / .9);
      matrix(P, n * .14, inC, [x0, y0, x1, y1], k(PL, .22));
      matrix(P, n * .08, (x, y) => inC(x, y) && P.r() < w(x), [x0, y0, x1, y1], k(C.white, .4));
      needles(P, n * .1, (x, y) => inC(x, y) && x < x0 + .8, [x0, y0, x0 + .8, y1], 30, C.white, { sc: 1.1 });
      flakes(P, n * .08, (x, y) => inC(x, y) && x > x0 + .9, [x0 + .9, y0, x1, y1], 9, C.steel, { sc: 1 });
      P.box(n * .03, x0, y0, x1 - x0, y1 - y0, mix(PL, C.chalk, .3));
      // the job: two crusher rolls pulling rock into the nip
      const ry = -.35, R = .78, rx1 = 1.05, rx2 = rx1 + 2 * R + .06;
      P.gear(n * .17, rx1, ry, R, 16, mix(C.chalk, C.steel, .3), { speed: -.6, depth: .09, hub: .16, spokes: 5 });
      P.gear(n * .17, rx2, ry, R, 16, mix(C.chalk, C.steel, .3), { speed: .6, depth: .09, hub: .16, spokes: 5 });
      const mid = (rx1 + rx2) / 2;
      [[-.45, 1.05, .22], [.1, 1.25, .2], [.5, .95, .18], [-.1, .75, .16], [.3, .62, .13]].forEach(([dx, y, r]) => { const pts = Array.from({ length: 7 }, (_, q) => { const a = q / 7 * PI * 2 + P.r() * .5; return [mid + dx + Math.cos(a) * r * (.7 + P.r() * .5), y + Math.sin(a) * r * (.7 + P.r() * .5)]; }); P.poly(n * .012, pts, k(C.amber, .45)); P.outline(n * .008, pts, k(C.amber, .8)); });
      for (let q = 0; q < n * .03; q++) P.pt(mid + P.g() * .16, ry - .2 - P.r() * 1.3, P.g() * .05, k(C.amber, .5 + P.r() * .3), 0);
      glow(P, n * .02, mid, ry, .25, C.orange);
    }, .64),

    /* compacted graphite iron: worm-like graphite; its job: a brake drum that runs hot (heat leaves it fast) */
    cgi: B(606, (P, n) => {
      const lx = -1.95, R = 1.35;
      lens(P, n * .42, lx, .05, R, worms, mix(C.violet, PL, .45), k(PL, .2), { count: 22, sc: 1.5 });
      const x = 1.85, y = .05, pv = [x, y, 0, .8], D = mix(C.violet, PL, .5);
      // the drum (it turns): rim, face, hub and lug holes
      P.ring(n * .09, x, y, 1.25, D, .014, 6, pv); P.ring(n * .05, x, y, 1.05, k(D, .8), .012, 6, pv);
      for (let q = 0; q < n * .06; q++) { const a = P.r() * PI * 2, d = 1.05 + P.r() * .2; P.pt(x + Math.cos(a) * d, y + Math.sin(a) * d, P.g() * .02, k(D, .35), 6, pv); }
      P.ring(n * .03, x, y, .32, C.chalk, .01, 6, pv); for (let h = 0; h < 5; h++) { const a = h / 5 * PI * 2; P.ring(n * .006, x + Math.cos(a) * .55, y + Math.sin(a) * .55, .07, C.chalk, .008, 6, pv); }
      // the shoes press from inside (still) and the rubbing glows; heat rises away
      [[PI * .62, PI * 1.38], [-PI * .38, PI * .38]].forEach(([a0, a1]) => { P.arc(n * .03, x, y, .93, a0, a1, C.steel, .03); P.arc(n * .03, x, y, 1.03, a0 + .1, a1 - .1, C.orange, .02); });
      glow(P, n * .03, x - 1.0, y, .35, C.hot); glow(P, n * .03, x + 1.0, y, .35, C.hot);
      P.sparks(n * .05, x, y + 1.0, .5, C.orange);
    }, .64),

    /* malleable iron: white iron goes into the heat-treatment furnace and comes out malleable (a bearing part) */
    malleableIron: B(607, (P, n) => {
      // the furnace
      const fw = [[-1.15, -1.3], [1.15, -1.3], [1.15, 1.25], [.35, 1.25], [.35, 1.9], [-.05, 1.9], [-.05, 1.25], [-1.15, 1.25]];
      prism(P, n * .12, fw, mix(C.steel2, C.amber, .25), { f: .3 });
      P.rect(n * .1, -.85, -1.1, 1.7, 2.1, k(C.hot, .55)); P.box(n * .02, -.85, -1.1, 1.7, 2.1, C.orange);
      P.sparks(n * .05, .15, 1.95, .12, C.orange);
      // the rollers that carry the parts through (they turn)
      for (let r = 0; r < 12; r++) { const x = -3.3 + r * .6; P.ring(n * .006, x, -1.55, .12, k(C.steel, .8), .008, 6, [x, -1.55, 0, -2.5]); P.seg(n * .003, x - .1, -1.55, x + .1, -1.55, C.chalk, .006, 6, [x, -1.55, 0, -2.5]); }
      P.seg(n * .02, -3.5, -1.4, 3.5, -1.4, k(C.steel, .4), .006);
      // a bearing cap: white iron (left, in), glowing (inside), malleable (right, out)
      const cap = (x) => { const arc = Array.from({ length: 14 }, (_, q) => { const a = PI - q / 13 * PI; return [x + Math.cos(a) * .32, -1.38 + Math.sin(a) * .32]; }); return [[x - .7, -1.38], ...arc, [x + .7, -1.38], [x + .7, -.65], [x - .7, -.65]]; };
      const L = cap(-2.45), Rr = cap(2.45), M = cap(0);
      [L, Rr].forEach((pts, i) => { const inR = (x, y) => inside(pts, x, y), bb = [i ? 1.7 : -3.2, -1.4, i ? 3.2 : -1.7, -.6]; matrix(P, n * .05, inR, bb, i ? k(PL, .25) : k(C.white, .3)); P.outline(n * .03, pts, i ? mix(PL, C.chalk, .3) : C.white); if (i) clusters(P, n * .05, inR, bb, 9, C.amber, { sc: .9 }); else needles(P, n * .05, inR, bb, 26, C.white, { sc: .9 }); });
      P.poly(n * .04, M, k(C.yellow, .7)); P.outline(n * .02, M, C.white);
      [[-1.8, -1.2], [1.25, 1.75]].forEach(([a, b]) => P.arrow(n * .015, a, -.3, b, -.3, C.orange, .14));
    }, .64),

    /* high-alloy irons (up to 35% alloy): high-chromium shrugs off oxidation and wear; nickel ignores the magnet and hardly expands */
    alloyIrons: B(608, (P, n) => {
      // the alloy share: a bar filled to 35%
      P.box(n * .02, -2.0, 1.85, 4.0, .22, k(C.chalk, .7)); P.rect(n * .04, -2.0, 1.85, 1.4, .22, k(C.orange, .8));
      P.text(n * .035, '35%', '800 200px "Big Shoulders Display"', .62, C.orange, null, false, 1.55, -1.3);
      // high-chromium: a block under a shield; oxygen held off
      { const x = -1.9, y0 = -1.7, y1 = -.35;
        prism(P, n * .1, rectP(x - .9, y0, 1.8, y1 - y0), C.ice, { f: .3 });
        P.text(n * .06, 'Cr', '800 200px "Big Shoulders Display"', .8, C.chalk, null, false, (y0 + y1) / 2, x);
        P.arc(n * .05, x, y0 + .2, 1.45, .3, PI - .3, C.ice, .015); P.arc(n * .03, x, y0 + .2, 1.38, .3, PI - .3, k(C.ice, .4), .03);
        for (let q = 0; q < 16; q++) { const a = .45 + q / 15 * (PI - .9), d = 1.7 + P.r() * .45; P.disc(n * .003, x + Math.cos(a) * d, y0 + .2 + Math.sin(a) * d, .045, C.red); }
      }
      // nickel: a block the magnet does not pull (its field goes around), and it barely grows when hot
      { const x = 1.9, y0 = -1.7, y1 = -.35;
        prism(P, n * .1, rectP(x - .9, y0, 1.8, y1 - y0), mix(C.steel, PL, .3), { f: .3 });
        P.text(n * .06, 'Ni', '800 200px "Big Shoulders Display"', .8, C.chalk, null, false, (y0 + y1) / 2, x);
        const U = [[x - .55, .35], [x - .55, .85], [x - .2, 1.2], [x + .2, 1.2], [x + .55, .85], [x + .55, .35]];
        for (let q = 0; q < n * .06; q++) { const { at, T } = walker(U), [ux, uy, nx, ny] = at(P.r() * T), h = (P.r() - .5) * .26; P.pt(ux + nx * h, uy + ny * h, 0, uy < .55 ? k(C.steel, .7) : k(C.red, .75), 0); }
        [-1, 1].forEach(sg => { for (let l = 0; l < 3; l++) P.arc(n * .006, x + sg * (.75 + l * .1), .4, .3 + l * .12, sg > 0 ? -PI / 2 : PI / 2, sg > 0 ? PI / 2 : 3 * PI / 2, k(C.chalk, .4), .008); });
        glow(P, n * .03, x, y0 - .15, .7, C.hot, 0, .25);
        oline(P, n * .02, rectP(x - .9, y0, 1.8, y1 - y0), k(C.orange, .45), { z: .05 });
      }
    }, .64),

    /* the crankshaft (ductile iron's job): it turns, the pistons ride it, and it must not twist apart */
    crankshaft: B(609, (P, n) => {
      const cy = -.75, r = .55, w = 1.6, pins = [-.95, .95];
      crank(P, n * .48, cy, [-3.1, 3.1], pins, { r, rj: .2, rp: .17, wg: .26, c: mix(C.steel, PL, .3), speed: w });
      // flywheel (end-on it is a thick disc seen edge-on) and the pulley
      for (let q = 0; q < n * .06; q++) { const a = P.r() * PI * 2, d = .3 + Math.sqrt(P.r()) * .75; P.pt(-3.0 + (P.r() - .5) * .2, cy + Math.cos(a) * d, Math.sin(a) * d, k(mix(C.steel, PL, .3), .4 + .4 * Math.max(0, Math.sin(a))), 12, [0, cy, 0, w]); }
      // pistons and rods ride the pins (bob = r·sin(1.6 t), the same as the pins)
      pins.forEach(x => {
        const L = 1.55, ty = cy + L;
        P.seg(n * .03, x, cy, x, ty, k(C.steel, .8), .03, 5);
        P.rect(n * .05, x - .38, ty - .05, .76, .62, k(mix(C.steel, PL, .3), .45), 5); P.box(n * .02, x - .38, ty - .05, .76, .62, C.chalk, .012, 5);
        [.12, .22].forEach(dy => P.seg(n * .006, x - .38, ty + .57 - dy, x + .38, ty + .57 - dy, k(C.chalk, .6), .006, 5));
        oline(P, n * .02, [[x - .45, ty - .7], [x - .45, ty + 1.25], [x + .45, ty + 1.25], [x + .45, ty - .7]], k(C.steel, .45), { closed: false });
        glow(P, n * .015, x, ty + 1.1, .3, C.orange, 0, .5);
      });
      // torsion: the two ends are turned against each other
      [[-3.35, 1], [3.35, -1]].forEach(([x, sg]) => { for (let q = 0; q < n * .015; q++) { const a = (sg > 0 ? -.4 : PI + .4) + P.r() * (PI - .8) * sg; P.pt(x + Math.cos(a) * .16, cy + Math.sin(a) * .62, 0, C.orange, 0); } const a1 = sg > 0 ? PI - .4 : -.4; const hx = x + Math.cos(a1) * .16, hy = cy + Math.sin(a1) * .62; P.seg(n * .004, hx, hy, hx + .12 * sg, hy - .08, C.orange, .008); P.seg(n * .004, hx, hy, hx - .05 * sg, hy - .14, C.orange, .008); });
    }, .64)
  };
};
