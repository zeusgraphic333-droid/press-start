// Compound zone (L4) — original line drawings shared by the lesson (both editions), the figures and the trials.
// Coloured ONLY with CSS variables (the zone colour is blue: it also plays the water). Pure functions, no DOM.
// The spinning lathe, the tube hydroforming die and the drawing die are parametric, so demos and trials redraw them.
export const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)', steel: 'var(--fig-steel)', hatch: 'var(--fig-hatch)', good: 'var(--good)', bad: 'var(--bad)' };
const r1 = n => Math.round(n * 10) / 10;
const escA = s => String(s).replace(/"/g, '&quot;');

export const svg = (vb, inner, label = '', cls = 'cmp-art') => `<svg class="${cls}" viewBox="${vb}" direction="ltr" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escA(label)}">${inner}</svg>`;
export const tx = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-family="${o.f || 'Barlow Condensed'}" font-size="${o.s || 14}" font-weight="${o.w || 600}" fill="${o.c || V.ink2}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
export function hatchRect(x, y, w, h, gap = 7, col = V.hatch, sw = 1) {
  let d = '';
  for (let c = gap - ((x + y) % gap + gap) % gap; c < w + h; c += gap) { if (c <= 0) continue; d += `M${r1(x + Math.max(0, c - h))} ${r1(y + Math.min(c, h))}L${r1(x + Math.min(c, w))} ${r1(y + Math.max(0, c - w))}`; }
  return `<path d="${d}" stroke="${col}" stroke-width="${sw}"/>`;
}
export const head = (x, y, a, col, s = 7) => { const t = a * Math.PI / 180, l = t + 2.6, r = t - 2.6; return `<path d="M${r1(x + Math.cos(l) * s)} ${r1(y + Math.sin(l) * s)}L${r1(x)} ${r1(y)}L${r1(x + Math.cos(r) * s)} ${r1(y + Math.sin(r) * s)}" stroke="${col}" stroke-width="2"/>`; };
export const arrow = (x1, y1, x2, y2, col = V.hot, w = 2.6) => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" stroke="${col}" stroke-width="${w}"/>${head(x2, y2, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, col)}`;
const lead = (x1, y1, x2, y2, s, a = 'middle', dy = -5, c = V.ink2, size = 14) => `<path d="M${r1(x1)} ${r1(y1)}L${x2} ${y2}" stroke="${V.ink3}" stroke-width="1.1"/><circle cx="${r1(x1)}" cy="${r1(y1)}" r="2.4" fill="${V.ink3}"/>${tx(x2, y2 + dy, s, { a, c, s: size })}`;
const balloon = (x, y, n) => `<circle cx="${x}" cy="${y}" r="11" fill="${V.zc}" fill-opacity=".16" stroke="${V.ink}" stroke-width="1.6"/>${tx(x, y + 5, n, { c: V.ink, s: 15, w: 700 })}`;
const blead = (x1, y1, x2, y2, n) => `<path d="M${r1(x1)} ${r1(y1)}L${x2} ${y2}" stroke="${V.ink3}" stroke-width="1.1"/><circle cx="${r1(x1)}" cy="${r1(y1)}" r="2.4" fill="${V.ink3}"/>${balloon(x2, y2, n)}`;

/* ---------- 48 × 48 glyphs (currentColor) ---------- */
const S48 = (inner, vb = '0 0 48 48') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
export const SHAPES = {
  hemi: S48('<path d="M6 32a18 18 0 0 1 36 0"/><ellipse cx="24" cy="32" rx="18" ry="4.5"/><path d="M14 20a14 14 0 0 1 8-5" opacity=".5"/>'),
  cone: S48('<path d="M24 7L42 37M24 7L6 37"/><ellipse cx="24" cy="37" rx="18" ry="4.5"/>'),
  cyl: S48('<ellipse cx="24" cy="12" rx="15" ry="4"/><path d="M9 12v24M39 12v24M9 36a15 4 0 0 0 30 0"/>')
};
export const PROC = {
  spin: S48('<path d="M6 24h6M36 24h6"/><rect x="12" y="15" width="10" height="18" rx="2"/><path d="M22 12c6 2 9 6 9 12s-3 10-9 12"/><circle cx="34" cy="38" r="4"/><path d="M6 13a14 14 0 0 1 6-5" /><path d="M10 6l3 2-2 3"/>'),
  hydro: S48('<path d="M24 5c-6 8-10 13-10 18a10 10 0 0 0 20 0c0-5-4-10-10-18z"/><path d="M6 40h36M10 40v-6M38 40v-6M24 36v4" opacity=".6"/>'),
  draw: S48('<rect x="17" y="4" width="14" height="22" rx="2"/><path d="M4 26h11v18M33 26h11M33 26v18"/><path d="M17 26v10h14V26" stroke-dasharray="2.5 2.5"/>')
};

/** spinning products (S5 picks) and the other two processes' products, as side silhouettes (80 × 56, currentColor) */
const P = inner => S48(inner, '0 0 80 56');
export const PRODUCTS = {
  bowl: P('<path d="M8 16h64c0 22-14 34-32 34S8 38 8 16z"/><path d="M8 16h64"/>'),
  cone: P('<path d="M40 6l30 44H10z"/><ellipse cx="40" cy="50" rx="30" ry="3.5" opacity=".5"/>'),
  hopper: P('<path d="M10 8h60v10L44 50h-8L10 18z"/><path d="M10 18h60"/>'),
  venturi: P('<path d="M6 12l24 12h20l24-12M6 44l24-12h20l24 12M6 12v32M74 12v32"/>'),
  tankhead: P('<path d="M8 48V34C8 14 72 14 72 34v14z"/><path d="M8 40h64" opacity=".5"/>'),
  trumpet: P('<path d="M10 8h60v5H10z"/><path d="M37 13c0 18-4 28-17 37h40C47 41 43 31 43 13"/>'),
  lid: P('<path d="M8 32h64v9H8z"/><path d="M34 32v-7h12v7"/>'),
  urn: P('<path d="M28 6h24v6c10 6 12 18 6 28l-4 10H26l-4-10c-6-10-4-22 6-28z"/><path d="M28 12h24" opacity=".5"/>'),
  light: P('<path d="M4 14h72v5H4z"/><path d="M18 19v27h44V19"/><path d="M26 46c4 4 24 4 28 0" opacity=".5"/>'),
  flashing: P('<path d="M4 44h72v5H4z"/><path d="M31 44l3-34h12l3 34"/>'),
  ferrule: P('<ellipse cx="40" cy="12" rx="15" ry="4"/><path d="M25 12v32M55 12v32M25 44a15 4 0 0 0 30 0"/>'),
  housing: P('<path d="M6 48h68M14 48v-6h52v6M22 42V10h36v32"/>'),
  can: P('<path d="M26 7h28l3 5v32l-3 5H26l-3-5V12z"/><path d="M23 14h34M23 42h34" opacity=".55"/>'),
  panel: P('<path d="M6 46V22L20 8h44l10 14v24z"/><path d="M24 12h36l6 10H24z"/><path d="M58 32h8" stroke-width="2.6"/>'),
  sink: P('<path d="M3 12h74v6H3z"/><path d="M9 18v24h27V18M44 18v24h27V18"/><circle cx="22" cy="38" r="1.8"/><circle cx="57" cy="38" r="1.8"/>'),
  tray: P('<path d="M6 14l9 34h50l9-34z"/><path d="M6 14h68"/>'),
  cup: P('<path d="M18 10h4v36h36V10h4"/><path d="M22 16h36" opacity=".45"/>'),
  domecap: P('<path d="M8 46h64M10 46a30 30 0 0 1 60 0"/><circle cx="30" cy="30" r="2"/><circle cx="42" cy="24" r="2"/><circle cx="52" cy="34" r="2"/><circle cx="36" cy="40" r="1.6"/>'),
  rail: P('<path d="M3 34h22l14-16h38M3 46h24l14-16h36M3 34v12M77 18v12"/><path d="M3 34l4-4h21l13-15h36" opacity=".45"/>'),
  bulge: P('<path d="M3 20h20c7 0 7-9 17-9s10 9 17 9h20M3 36h20c7 0 7 9 17 9s10-9 17-9h20M3 20v16M77 20v16"/>')
};

/* ---------- 1 · the family tree (L4 · S2, with the L3 · S6 siblings dashed) ---------- */
export function treeArt(label = 'Solid state forming: simple bending, compound bending (spinning, hydroforming, drawing), form and cut') {
  const box = (x, y, w, h, a, b, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${V.zc}" fill-opacity="${o.op || 0}" stroke="${o.dash ? V.ink3 : V.ink}" stroke-width="${o.dash ? 1.3 : 1.9}"${o.dash ? ' stroke-dasharray="5 4"' : ''}/>`
    + tx(x + w / 2, b ? y + 18 : y + h / 2 + 5, a, { c: o.dash ? V.ink3 : V.ink, s: o.big ? 16 : 14, w: 700 }) + (b ? tx(x + w / 2, y + 35, b, { c: o.dash ? V.ink3 : V.zt, s: 12.5 }) : '');
  return svg('0 0 400 244', `
    ${box(116, 6, 168, 32, 'Solid State Forming', '', { big: true })}
    <path d="M200 38v18M66 56h268M66 56v16M200 56v16M334 56v16" stroke="${V.ink3}" stroke-width="1.5"/>
    ${box(6, 72, 120, 44, 'Simple Bending', 'Low to Moderate Cost', { dash: true })}
    ${box(134, 72, 132, 44, 'Compound Bending', 'Moderate to High Cost', { op: .16 })}
    ${box(274, 72, 120, 44, 'Form and Cut', 'High Cost', { dash: true })}
    <path d="M200 116v18M80 134h240M80 134v16M200 134v16M320 134v16" stroke="${V.ink}" stroke-width="1.8"/>
    ${box(30, 150, 100, 36, 'Spinning', '', { op: .3 })}${box(150, 150, 100, 36, 'Hydro-forming', '', { op: .3 })}${box(270, 150, 100, 36, 'Drawing', '', { op: .3 })}
    ${arrow(30, 214, 372, 214, V.ink3, 1.6)}${tx(200, 236, 'cost rises →', { c: V.ink3, s: 13 })}`, label);
}

/* ---------- 2 · the spinning lathe (S3–S4): a parametric section, p = 0 (flat blank) … 1 (formed) ---------- */
const AX = 110, FACE = 196;
/** the mandrel's outline (both halves) and its forming profile (top half, from the clamp outward) */
export function mandrelOf(shape) {
  const pts = [[FACE, AX]];
  let outline;
  if (shape === 'hemi') {
    for (let a = 5; a <= 90; a += 5) { const t = a * Math.PI / 180; pts.push([140 + 56 * Math.cos(t), AX - 56 * Math.sin(t)]); }
    outline = `M92 54H140A56 56 0 0 1 140 166H92Z`;
  } else if (shape === 'cone') {
    pts.push([FACE, 98], [116, 60]);
    outline = `M92 60H116L196 98V122L116 160H92Z`;
  } else { // cylindrical shell
    pts.push([FACE, 76]);
    for (let a = 15; a <= 90; a += 15) { const t = a * Math.PI / 180; pts.push([190 + 6 * Math.cos(t), 76 - 6 * Math.sin(t)]); }
    pts.push([140, 70]);
    outline = `M92 70H190Q196 70 196 76V144Q196 150 190 150H92Z`;
  }
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, len, L: len[len.length - 1], outline, faceLen: shape === 'hemi' ? 0 : shape === 'cone' ? 12 : 34 };
}
/** where the sheet is at progress p: formed points, the free flange, and the roller (bottom half, like S4) */
export function spinGeom(p, shape) {
  // the disc's centre already lies flat on the mandrel's face: forming starts where the face ends
  const m = mandrelOf(shape), Lf = m.faceLen + Math.max(0, Math.min(1, p)) * (m.L - m.faceLen);
  const at = sv => { let i = 1; while (i < m.pts.length - 1 && m.len[i] < sv) i++; const [ax, ay] = m.pts[i - 1], [bx, by] = m.pts[i], seg = m.len[i] - m.len[i - 1] || 1, u = Math.min(1, Math.max(0, (sv - m.len[i - 1]) / seg)); return { i, P: [ax + (bx - ax) * u, ay + (by - ay) * u], T: [(bx - ax) / seg, (by - ay) / seg] }; };
  const w = at(Lf), W = w.P, T = w.T;
  const formed = m.pts.slice(0, w.i).concat([W]);
  const dx = .55 * T[0], dy = -.45 + .55 * T[1], dn = Math.hypot(dx, dy) || 1, free = m.L - Lf;
  const F = [W[0] + dx / dn * free, W[1] + dy / dn * free];
  // the roller rides on the sheet, but never closer to the axis than the clamp
  const r = at(Math.max(Lf, 26)), N = [-r.T[1], r.T[0]];
  const roller = [r.P[0] + N[0] * 14, 2 * AX - (r.P[1] + N[1] * 14)];
  return { m, formed, W, F, roller, Lf };
}
/** the lathe without the sheet: head stock, spindle, mandrel, clamp, tail stock */
export function spinStatic(shape, { spin = false } = {}) {
  const m = mandrelOf(shape);
  return `<rect x="8" y="40" width="48" height="140" rx="3" fill="${V.steel}" fill-opacity=".18" stroke="${V.ink}" stroke-width="2"/>
    <rect x="56" y="100" width="36" height="20" fill="${V.steel}" fill-opacity=".35" stroke="${V.ink}" stroke-width="1.8"/>
    <path d="${m.outline}" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>
    <g class="${spin ? 'cmp-spin__d' : ''}" stroke="${V.ink3}" stroke-width="1.2" stroke-dasharray="6 6"><path d="M96 92H${shape === 'cone' ? 150 : 186}M96 128H${shape === 'cone' ? 150 : 186}"/></g>
    <rect x="198" y="96" width="16" height="28" rx="2" fill="${V.steel}" fill-opacity=".55" stroke="${V.ink}" stroke-width="1.8"/>
    <rect x="214" y="104" width="86" height="12" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="1.6"/>
    <rect x="300" y="76" width="52" height="68" rx="3" fill="${V.steel}" fill-opacity=".18" stroke="${V.ink}" stroke-width="2"/>
    <path d="M2 ${AX}H358" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="14 4 3 4"/>
    <path d="M66 86a18 18 0 0 1 20 0" stroke="${V.hot}" stroke-width="2.4"/>${head(86, 86, 30, V.hot)}`;
}
/** the sheet at progress p (both halves) and the roller tool on the bottom half */
export function spinSheet(p, shape) {
  const g = spinGeom(p, shape), mir = ([x, y]) => [x, 2 * AX - y];
  let out = '';
  for (const half of [0, 1]) {
    const tf = half ? mir : (q => q);
    for (let k = 1; k < g.formed.length; k++) {
      const a = tf(g.formed[k - 1]), b = tf(g.formed[k]);
      const sMid = (g.m.len[Math.min(k, g.m.len.length - 1)] || g.Lf);
      const w = sMid <= g.m.faceLen + .5 ? 4 : r1(4 - 1.5 * Math.min(1, (sMid - g.m.faceLen) / Math.max(1, g.m.L - g.m.faceLen)));
      out += `<path d="M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}" stroke="${V.zc}" stroke-width="${w}"/>`;
    }
    const w0 = tf(g.W), f0 = tf(g.F);
    if (g.Lf < g.m.L - .5) out += `<path d="M${r1(w0[0])} ${r1(w0[1])}L${r1(f0[0])} ${r1(f0[1])}" stroke="${V.zc}" stroke-width="4"/>`;
  }
  const [cx, cy] = g.roller;
  out += `<path d="M${r1(cx)} ${r1(cy)}l26 34" stroke="${V.ink}" stroke-width="7"/><circle cx="${r1(cx)}" cy="${r1(cy)}" r="11" fill="${V.hot}" fill-opacity=".35" stroke="${V.ink}" stroke-width="2"/><circle cx="${r1(cx)}" cy="${r1(cy)}" r="2.5" fill="${V.ink}"/>`;
  return out;
}
export const spinArt = (p, shape, label = 'A blank spinning onto a mandrel') => svg('0 0 360 220', spinStatic(shape) + `<g class="cmp-spin__sheet">${spinSheet(p, shape)}</g>`, label, 'cmp-art cmp-spinart');

/** the spinning forming process, labelled like L4 · S4 (mode 'names') or numbered 1–7 for questions (mode 'numbers') */
/** where each labelled part sits in latheArt's 400 × 262 frame (the label trial puts its pins here) */
export function latheAnchors() {
  const g = spinGeom(.6, 'hemi'), at = (x, y) => [r1(x + 20), r1(y + 24)], mid = g.formed[Math.floor(g.formed.length / 2)];
  return { head: at(32, 60), spindle: at(74, 116), mandrel: at(118, 80), sheet: at(mid[0], mid[1]), clamp: at(206, 104), tail: at(326, 90), roller: at(g.roller[0] + 9, g.roller[1] + 12) };
}
export function latheArt(mode = 'names', label = 'The spinning lathe: head stock, spindle, mandrel, sheet metal, clamp, tail stock, roller tool') {
  const P0 = .6, SH = 'hemi', ox = 20, oy = 24, A = latheAnchors();
  // [part, label end x, label end y, words, number]; labels under the drawing sit below their leader's end
  const T = [['head', 44, 20, 'Head stock', '1'], ['spindle', 94, 236, 'Spindle', '2'], ['mandrel', 138, 20, 'Mandrel', '3'], ['sheet', 252, 20, 'Sheet metal', '4'], ['clamp', 292, 66, 'Clamp', '5'], ['tail', 362, 64, 'Tail stock', '6'], ['roller', 300, 236, 'Roller tool', '7']];
  const L = mode === 'none' ? '' : T.map(([k, x, y, w, n]) => {
    const [ax, ay] = A[k], below = y > 200;
    if (mode === 'numbers') { const d = Math.hypot(x - ax, y - ay) || 1, ex = x - (x - ax) / d * 11, ey = y - (y - ay) / d * 11; return `<path d="M${r1(ax)} ${r1(ay)}L${r1(ex)} ${r1(ey)}" stroke="${V.ink3}" stroke-width="1.1"/><circle cx="${r1(ax)}" cy="${r1(ay)}" r="2.4" fill="${V.ink3}"/>${balloon(x, below ? y + 6 : y - 4, n)}`; }
    return `<path d="M${r1(ax)} ${r1(ay)}L${x} ${y}" stroke="${V.ink3}" stroke-width="1.1"/><circle cx="${r1(ax)}" cy="${r1(ay)}" r="2.4" fill="${V.ink3}"/>${tx(x, below ? y + 16 : y - 4, w, { s: 14 })}`;
  }).join('');
  return svg('0 0 400 262', `<g transform="translate(${ox} ${oy})">${spinStatic(SH)}<g>${spinSheet(P0, SH)}</g></g>${L}`, label);
}

/* ---------- 3 · spun profiles (L4 · S6) ---------- */
export const PROFILES = [
  ['Dished', 'M8 48H92M8 48Q50 20 92 48'],
  ['Domed', 'M12 52V36Q50 4 88 36V52Z'],
  ['Domed with flange', 'M4 46H24C32 46 36 30 50 30S68 46 76 46H96'],
  ['Flanged', 'M14 34H86V42H14Z'],
  ['Flanged and flued', 'M6 40Q6 50 16 50H30Q38 50 38 42V24M62 24V42Q62 50 70 50H84Q94 50 94 40'],
  ['Flanged, dished and flued', 'M6 52H94M6 52Q24 50 32 40Q38 32 38 20M62 20Q62 32 68 40Q76 50 94 52'],
  ['Flanged and dished', 'M8 52V44Q50 22 92 44V52Z'],
  ['Hemisphere', 'M10 52A40 40 0 0 1 90 52Z'],
  ['Semi-elliptical', 'M8 52V38C8 14 92 14 92 38V52Z'],
  ['Tube cap', 'M26 52V12H74V52Z'],
  ['Trumpet', 'M6 54C28 52 40 40 42 18H45V10H55V18H58C60 40 72 52 94 54Z']
];
export const profileSvg = (d, label = '') => `<svg viewBox="0 0 100 60" direction="ltr" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escA(label)}"><path d="${d}" stroke="${V.ink}" stroke-width="2.4" fill="${/Z$/.test(d) ? V.zc : 'none'}" fill-opacity=".1"/><path d="M50 4V58" stroke="${V.ink3}" stroke-width=".8" stroke-dasharray="6 3 1.5 3"/></svg>`;
/** an HTML sheet of the eleven profiles (an `art` block may start with a div) */
export const profilesArt = () => `<div class="cmp-profiles">${PROFILES.map(([n, d]) => `<figure class="cmp-prof">${profileSvg(d, n)}<figcaption dir="ltr">${n}</figcaption></figure>`).join('')}</div>`;
/** a strip of products: [[key, name], …] */
export const productsArt = items => `<div class="cmp-products">${items.map(([k, n]) => `<figure class="cmp-prod"><span class="cmp-prod__g">${PRODUCTS[k]}</span><figcaption>${n}</figcaption></figure>`).join('')}</div>`;

/* ---------- 4 · hydroforming (S8): solid die vs water pressure ---------- */
const CAV = 'M90 70C80 80 72 90 76 104Q80 120 120 120Q160 120 164 104C168 90 160 80 150 70';
const CAV_R = 'C160 80 168 90 164 104Q160 120 120 120Q80 120 76 104C72 90 80 80 90 70';
const dieBody = `<path d="M30 70H90${CAV.slice(CAV.indexOf('C'))}H210V140H30Z" fill="${V.steel}" fill-opacity=".28" stroke="${V.ink}" stroke-width="2"/>`;
export const solidArt = (label = 'A solid punch cannot fill the concavity') => svg('0 0 240 150', `
  ${dieBody}
  <rect x="96" y="12" width="48" height="96" rx="3" fill="${V.steel}" fill-opacity=".45" stroke="${V.ink}" stroke-width="2"/>
  <path d="M30 67H88L93 74V111H147V74L152 67H210" stroke="${V.zc}" stroke-width="3"/>
  <path d="M80 92l8 8M88 92l-8 8M152 92l8 8M160 92l-8 8" stroke="${V.bad}" stroke-width="2.2"/>
  ${arrow(120, 4, 120, 10, V.hot)}${tx(120, 136, 'solid die: corners stay empty', { c: V.bad, s: 13 })}`, label);
export const waterArt = (label = 'Water pressure pushes the sheet into every concavity') => svg('0 0 240 150', `
  <path d="M30 18H210V70H150${CAV_R}H30Z" fill="${V.zc}" fill-opacity=".3"/>
  ${dieBody}
  <path d="M30 68H88${'C78 78 70 90 74 104Q78 122 120 122Q162 122 166 104C170 90 162 78 152 68'}H210" stroke="${V.ink}" stroke-width="3"/>
  ${[60, 120, 180].map(x => arrow(x, 26, x, 52, V.ink2, 1.8)).join('')}${arrow(96, 84, 84, 98, V.ink2, 1.6)}${arrow(144, 84, 156, 98, V.ink2, 1.6)}
  ${tx(120, 140, 'water: every corner filled', { c: V.good, s: 13 })}`, label);

/* ---------- 5 · tube hydroforming (S9): step 0…5 = (a)…(f) ---------- */
export function tubeArt(step = 0, label = '', { letter = true, names = true } = {}) {
  const k = Math.max(0, Math.min(5, step)), open = k === 0 || k === 5, bulged = k >= 4;
  const lift = open ? -24 : 0, ins = k === 0 || k === 5 ? -18 : k === 4 ? 9 : 4;
  const fluid = k >= 2 && k <= 4;
  const upper = `<path d="M72 22H248V69H196C186 69 184 51 160 51S134 69 124 69H72Z" transform="translate(0 ${lift})" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>`;
  const lower = `<path d="M72 148H248V101H196C186 101 184 119 160 119S134 101 124 101H72Z" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>`;
  const tubeY = k === 5 ? -14 : 0;
  const wallT = bulged ? 'M56 69H124C134 69 136 51 160 51S186 69 196 69H264V73H196C188 73 186 55 160 55S132 73 124 73H56Z' : 'M56 69H264V73H56Z';
  const wallB = bulged ? 'M56 101H124C134 101 136 119 160 119S186 101 196 101H264V97H196C188 97 186 115 160 115S132 97 124 97H56Z' : 'M56 101H264V97H56Z';
  const inner = bulged ? 'M62 73H124C132 73 134 55 160 55S188 73 196 73H258V97H196C188 97 186 115 160 115S132 97 124 97H62Z' : 'M62 73H258V97H62Z';
  const fillW = k === 2 ? 'M62 73H160V97H62Z' : inner;
  const punch = side => { const s = side ? -1 : 1, x0 = side ? 320 : 0; const X = x => x0 + s * x; const end = 62 + ins;
    return `<rect x="${Math.min(X(20), X(34))}" y="60" width="14" height="50" rx="2" fill="${V.steel}" fill-opacity=".5" stroke="${V.ink}" stroke-width="1.8"/><rect x="${Math.min(X(34), X(end))}" y="75" width="${end - 34}" height="20" fill="${V.steel}" fill-opacity=".4" stroke="${V.ink}" stroke-width="1.6"/>${fluid ? `<path d="M${X(24)} 85H${X(end)}" stroke="${V.zc}" stroke-width="4"/>` : `<path d="M${X(24)} 85H${X(end)}" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="3 3"/>`}`; };
  let extra = '';
  if (k === 4) {
    extra = `${arrow(2, 85, 16, 85)}${arrow(318, 85, 304, 85)}${names ? tx(14, 52, 'F', { s: 15, c: V.hot, w: 700 }) + tx(26, 56, 'axial', { s: 10, c: V.hot, a: 'start' }) + tx(282, 52, 'F', { s: 15, c: V.hot, w: 700 }) + tx(294, 56, 'axial', { s: 10, c: V.hot, a: 'start' }) : ''}`
      + `${tx(160, 92, 'P', { s: 18, c: V.ink, w: 700 })}${[[-1, -1], [0, -1], [1, -1], [-1, 1], [0, 1], [1, 1]].map(([dx, dy]) => arrow(160 + dx * 8, 85 + dy * 8, 160 + dx * 20, 85 + dy * 22, V.ink, 1.4)).join('')}`;
  }
  if (k === 5) extra = `<path d="M206 46C232 30 252 26 276 28" stroke="${V.ink2}" stroke-width="1.8"/>${head(276, 28, 0, V.ink2)}`;
  const lt = 'abcdef'[k];
  return svg('0 0 320 170', `${lower}${upper}
    <g transform="translate(0 ${tubeY})">${fluid ? `<path d="${fillW}" fill="${V.zc}" fill-opacity=".38"/>` : ''}<path d="${wallT}" fill="${V.steel}" fill-opacity=".5" stroke="${V.ink}" stroke-width="1.5"/><path d="${wallB}" fill="${V.steel}" fill-opacity=".5" stroke="${V.ink}" stroke-width="1.5"/></g>
    ${punch(0)}${punch(1)}${extra}
    ${letter ? `<circle cx="18" cy="18" r="13" stroke="${V.ink}" stroke-width="1.6"/>${tx(18, 23, lt, { s: 16, c: V.ink, w: 700, f: 'Readex Pro' })}` : ''}`, label || `Tube hydroforming, step ${lt}`);
}

/** S11: the car frame rail — a bent tube, the die with water, a box-section rail */
export function railArt(label = 'Step 1 a tube is bent, step 2 it is closed in the die with water inside, step 3 it comes out as a box-section rail') {
  return svg('0 0 420 196', `
    ${tx(10, 18, 'Step 1', { a: 'start', c: V.hot, s: 15, w: 700 })}
    <path d="M14 54H128M14 66H128M14 54V66M128 54V66" stroke="${V.ink}" stroke-width="2"/>
    <path d="M14 116H48L72 96H128M14 128H52L76 108H128M14 116V128M128 96V108" stroke="${V.ink}" stroke-width="2"/>
    ${arrow(70, 74, 70, 90, V.ink3, 1.5)}
    ${tx(150, 18, 'Step 2', { a: 'start', c: V.ink2, s: 15, w: 700 })}
    <rect x="152" y="112" width="116" height="44" fill="${V.steel}" fill-opacity=".25" stroke="${V.ink}" stroke-width="2"/>${hatchRect(152, 112, 116, 44, 9)}
    <rect x="152" y="62" width="116" height="40" fill="${V.steel}" fill-opacity=".25" stroke="${V.ink}" stroke-width="2"/>
    <path d="M152 106H184L200 102H268" stroke="${V.ink}" stroke-width="7"/><path d="M152 106H184L200 102H268" stroke="${V.zc}" stroke-width="3.5"/>
    ${arrow(214, 30, 214, 56)}${tx(220, 40, 'DIE FORCE', { a: 'start', c: V.hot, s: 11 })}
    ${arrow(134, 106, 150, 106, V.zc, 2.4)}${tx(150, 176, 'WATER', { c: V.zt, s: 12 })}
    ${tx(292, 18, 'Step 3', { a: 'start', c: V.ink2, s: 15, w: 700 })}
    <path d="M300 108H330L350 86H410M300 124H334L354 102H410" stroke="${V.ink}" stroke-width="2"/>
    <path d="M300 108h0" stroke="${V.ink}"/><rect x="292" y="108" width="16" height="16" fill="${V.zc}" fill-opacity=".25" stroke="${V.ink}" stroke-width="2"/>
    <path d="M308 108L316 100H338L358 78H414V94" stroke="${V.ink}" stroke-width="1.4" opacity=".6"/>
    ${tx(352, 150, 'frame rail', { c: V.zt, s: 14 })}${tx(352, 168, '(Fig. Final Product)', { c: V.ink3, s: 11 })}`, label);
}

/* ---------- 6 · sheet hydroforming (S10) ---------- */
export const femaleArt = (label = 'Water under pressure forces the sheet into a female cavity') => svg('0 0 240 150', `
  <rect x="30" y="26" width="180" height="56" fill="${V.zc}" fill-opacity=".3"/>
  <path d="M30 84H80V118Q80 126 88 126H152Q160 126 160 118V84H210V142H30Z" fill="${V.steel}" fill-opacity=".28" stroke="${V.ink}" stroke-width="2"/>
  <path d="M30 26H210" stroke="${V.ink}" stroke-width="2"/>
  <path d="M30 82H76Q84 82 84 90V116Q84 122 90 122H150Q156 122 156 116V90Q156 82 164 82H210" stroke="${V.ink}" stroke-width="3"/>
  ${[70, 120, 170].map(x => arrow(x, 34, x, 62, V.ink2, 1.8)).join('')}${arrow(120, 76, 120, 108, V.ink2, 1.6)}
  <rect x="4" y="6" width="34" height="16" rx="2" stroke="${V.ink}" stroke-width="1.4"/>${tx(21, 18, 'pump', { s: 11, c: V.ink2 })}<path d="M30 22v4" stroke="${V.ink}" stroke-width="1.4"/>
  ${tx(195, 134, 'female cavity', { s: 12, c: V.ink3, a: 'end' })}${tx(206, 20, 'water', { s: 12, c: V.zt, a: 'end' })}`, label);
export const maleArt = (label = 'A male punch deforms the sheet against fluid under pressure') => svg('0 0 240 150', `
  <path d="M30 82H88Q94 82 96 90L98 104Q98 112 106 112H134Q142 112 142 104L144 90Q146 82 152 82H210V142H30Z" fill="${V.zc}" fill-opacity=".3"/>
  <path d="M30 82V142H210V82" stroke="${V.ink}" stroke-width="2"/>
  <rect x="100" y="8" width="40" height="100" rx="3" fill="${V.steel}" fill-opacity=".45" stroke="${V.ink}" stroke-width="2"/>
  <path d="M30 80H86Q92 80 94 88L96 104Q96 114 106 114H134Q144 114 144 104L146 88Q148 80 154 80H210" stroke="${V.ink}" stroke-width="3"/>
  ${arrow(120, 0, 120, 6, V.hot)}${[52, 188].map(x => arrow(x, 132, x, 96, V.ink2, 1.8)).join('')}
  ${tx(150, 26, 'male punch', { s: 12, c: V.ink3, a: 'start' })}${tx(120, 136, 'fluid under pressure', { s: 12, c: V.zt })}`, label);

/* ---------- 7 · drawing (S14–S16): the die at stroke s = 0 … 1 ---------- */
export function drawGeom(s) {
  const d = Math.max(0, Math.min(1, s)) * 85, yb = 154 + d, f = Math.max(0, 85 - d);
  return { d, yb, f };
}
export function drawDieInner(s, mode = 'names') {
  const { d, yb, f } = drawGeom(s), c = 180, wx = 45;
  const dieL = `M36 158H124Q132 158 132 166V250H36Z`, dieR = `M324 158H236Q228 158 228 166V250H324Z`;
  const blank = `M${r1(c - wx - f)} 156H${c - wx}V${r1(156 + d)}H${c + wx}V156H${r1(c + wx + f)}`;
  const forces = `${arrow(180, yb - 134, 180, yb - 104)}${arrow(85, 94, 85, 122)}${arrow(275, 94, 275, 122)}`;
  let labels = '';
  if (mode === 'names') {
    labels = tx(190, yb - 124, 'Drawing force', { a: 'start', c: V.hot, s: 13 }) + tx(6, 100, 'Holding force', { a: 'start', c: V.hot, s: 13 }) + tx(354, 100, 'Holding force', { a: 'end', c: V.hot, s: 13 })
      + tx(180, yb - 56, 'Punch', { c: V.ink, s: 15, w: 700 }) + tx(275, 145, 'Blank holder', { c: V.ink, s: 13, w: 700 }) + tx(276, 212, 'Die', { c: V.ink, s: 15, w: 700 })
      + `<path d="M36 150L${r1(Math.max(c - wx - f + 4, 40))} ${f > 2 ? 156 : 162}" stroke="${V.ink3}" stroke-width="1.1"/>${tx(30, 146, 'Blank', { a: 'end', c: V.zt, s: 13 })}`;
  } else if (mode === 'letters') {
    labels = balloon(180, yb - 56, 'A') + balloon(275, 140, 'B') + `<path d="M24 136L${r1(Math.max(c - wx - f + 4, 40))} ${f > 2 ? 156 : 162}" stroke="${V.ink3}" stroke-width="1.1"/>` + balloon(20, 128, 'C') + balloon(276, 206, 'D');
  }
  return `<path d="${dieL}" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/><path d="${dieR}" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>
    ${hatchRect(40, 174, 84, 72, 10)}${hatchRect(236, 174, 84, 72, 10)}
    <rect x="40" y="126" width="90" height="28" rx="2" fill="${V.zc}" fill-opacity=".16" stroke="${V.ink}" stroke-width="2"/><rect x="230" y="126" width="90" height="28" rx="2" fill="${V.zc}" fill-opacity=".16" stroke="${V.ink}" stroke-width="2"/>
    <path d="M138 ${r1(yb - 100)}H222V${r1(yb - 6)}Q222 ${r1(yb)} 216 ${r1(yb)}H144Q138 ${r1(yb)} 138 ${r1(yb - 6)}Z" fill="${V.steel}" fill-opacity=".5" stroke="${V.ink}" stroke-width="2"/>
    <path d="${blank}" stroke="${V.zc}" stroke-width="4.5"/>
    ${mode === 'none' ? '' : forces}${labels}`;
}
/** where each labelled part sits in drawDieArt's 360 × 262 frame at stroke s */
export function drawAnchors(s = .45) {
  const { d, yb } = drawGeom(s);
  return { punch: [180, r1(yb - 56)], holder: [275, 140], blank: [200, r1(158 + d)], die: [276, 212], dforce: [180, r1(yb - 122)], hforce: [85, 106] };
}
export const drawDieArt = (s = .45, mode = 'names', label = 'Deep drawing: the punch pushes the blank into the die while the blank holder holds it') => svg('0 0 360 262', drawDieInner(s, mode), label, 'cmp-art cmp-drawart');
/** S16: three stages, side by side (an HTML strip of three small drawings) */
export const stagesArt = (caps = ['1', '2', '3']) => `<div class="cmp-stages">${[0, .5, 1].map((s, i) => `<figure class="cmp-stage">${svg('20 70 320 192', drawDieInner(s, 'none'), caps[i], 'cmp-art')}<figcaption>${caps[i]}</figcaption></figure>`).join('')}</div>`;
/** blank → drawn part */
export const blankCupArt = (label = 'A flat blank becomes a drawn part') => svg('0 0 360 150', `
  <ellipse cx="82" cy="92" rx="64" ry="17" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/><path d="M18 92v5c0 9 29 17 64 17s64-8 64-17v-5" stroke="${V.ink}" stroke-width="2"/>
  ${arrow(160, 84, 204, 84, V.hot)}
  <path d="M232 46v62c0 7 19 13 42 13s42-6 42-13V46" fill="${V.steel}" fill-opacity=".22" stroke="${V.ink}" stroke-width="2"/>
  <ellipse cx="274" cy="46" rx="42" ry="11" fill="${V.steel}" fill-opacity=".12" stroke="${V.ink}" stroke-width="2"/><ellipse cx="274" cy="47" rx="37" ry="8.5" stroke="${V.ink3}" stroke-width="1.2"/>
  ${tx(82, 140, 'Blank', { c: V.zt, s: 15, w: 700 })}${tx(274, 142, 'Drawn part', { c: V.zt, s: 15, w: 700 })}`, label);
