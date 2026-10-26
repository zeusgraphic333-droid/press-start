// Iron zone (L2 · S16–S21) — original line drawings shared by the lesson (both editions), the figures and the trials.
// Coloured ONLY with CSS variables, so every drawing reads on the night shift and on the drafting film.
// Pure functions: no DOM, no randomness without a seed. Labels inside drawings are the exam's English words.
export const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)', steel: 'var(--fig-steel)', hatch: 'var(--fig-hatch)', good: 'var(--good)', bad: 'var(--bad)' };
const r1 = n => Math.round(n * 10) / 10;
const rnd = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const escA = s => String(s).replace(/"/g, '&quot;');

/** a lesson drawing: <svg class="irn-art"> (the class caps its width on wide screens) */
export const svg = (vb, inner, label = '', cls = 'irn-art') => `<svg class="${cls}" viewBox="${vb}" direction="ltr" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escA(label)}">${inner}</svg>`;
/** a label: Barlow Condensed by default */
export const tx = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-family="${o.f || 'Barlow Condensed'}" font-size="${o.s || 14}" font-weight="${o.w || 600}" fill="${o.c || V.ink2}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
/** 45° section hatching clipped to a rectangle (no <pattern>, so nothing depends on an id) */
export function hatchRect(x, y, w, h, gap = 7, col = V.hatch, sw = 1) {
  // lines x + y = k·gap in drawing coordinates, so two touching rectangles hatch as one surface
  let d = '';
  for (let c = gap - ((x + y) % gap + gap) % gap; c < w + h; c += gap) { if (c <= 0) continue; d += `M${r1(x + Math.max(0, c - h))} ${r1(y + Math.min(c, h))}L${r1(x + Math.min(c, w))} ${r1(y + Math.max(0, c - w))}`; }
  return `<path d="${d}" stroke="${col}" stroke-width="${sw}"/>`;
}
/** a leader line with a dot on the part and a label at the free end */
const lead = (x1, y1, x2, y2, s, a = 'middle', dy = -6, c = V.ink2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${V.ink3}" stroke-width="1.1"/><circle cx="${x1}" cy="${y1}" r="2.4" fill="${V.ink3}"/>${tx(x2, y2 + dy, s, { a, c, s: 14 })}`;
/** a small arrowhead at (x, y) pointing along angle a (degrees) */
const head = (x, y, a, col, s = 7) => { const t = a * Math.PI / 180, l = t + 2.6, r = t - 2.6; return `<path d="M${r1(x + Math.cos(l) * s)} ${r1(y + Math.sin(l) * s)}L${x} ${y}L${r1(x + Math.cos(r) * s)} ${r1(y + Math.sin(r) * s)}" stroke="${col}" stroke-width="2"/>`; };
const arrow = (x1, y1, x2, y2, col = V.hot, w = 2.6) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${col}" stroke-width="${w}"/>${head(x2, y2, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, col)}`;
const part = (x, y, w, h, rx = 2, op = .22) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${V.steel}" fill-opacity="${op}" stroke="${V.ink}" stroke-width="2"/>`;

/* ---------- 48 × 48 glyphs (currentColor) for grid cards, chips and tickets ---------- */
const S48 = inner => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
function gearPath(cx, cy, r1_, r2, teeth) {
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i / teeth * Math.PI * 2, w = Math.PI / teeth;
    const p = (r, t) => `${r1(cx + Math.cos(t) * r)} ${r1(cy + Math.sin(t) * r)}`;
    d += `${i ? 'L' : 'M'}${p(r1_, a - w * .55)}L${p(r2, a - w * .3)}L${p(r2, a + w * .3)}L${p(r1_, a + w * .55)}`;
  }
  return d + 'Z';
}
const ticks = (cx, cy, ra, rb, n) => { let d = ''; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; d += `M${r1(cx + Math.cos(a) * ra)} ${r1(cy + Math.sin(a) * ra)}L${r1(cx + Math.cos(a) * rb)} ${r1(cy + Math.sin(a) * rb)}`; } return `<path d="${d}" stroke-width="1.3"/>`; };
const SQ = '<rect x="5" y="5" width="38" height="38" rx="2"/>';
const dots = (pts, r = 2.6) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`).join('');

/** the inside of each iron, as the drafting room would sketch it (a visual hint only — the slides don't show these) */
export const MICRO = {
  gray: S48(SQ + '<path d="M10 14q4-3 9-1M25 11q4 2 9 0M12 25q5 2 9-2M28 23q4-4 9-2M9 35q4-2 8 1M21 37q5 1 9-3M34 33q2 3 5 2" stroke-width="2.2"/>'),
  ductile: S48(SQ + dots([[13, 13], [26, 11], [36, 18], [12, 26], [24, 24], [35, 30], [15, 37], [28, 36]])),
  white: S48('<rect x="5" y="5" width="38" height="38" rx="2" fill="currentColor" fill-opacity=".16"/><path d="M11 33l7-10 6 7 5-11 8 12" stroke-width="1.3" opacity=".75"/><path d="M33 9l1.6 3.4L38 14l-3.4 1.6L33 19l-1.6-3.4L28 14l3.4-1.6z" fill="currentColor" stroke="none"/>'),
  cgi: S48(SQ + '<path d="M10 13c2-3 4 1 6-1s3 2 5 0M27 11c2 2 4-1 6 1s2-2 4 0M11 25c2-2 3 2 5 0s3 1 5-1M27 24c1 3 4 0 5 2s3-1 5 1M10 36c2-2 4 1 6-1M24 36c2-3 3 1 5-1s3 2 5 0" stroke-width="2.1"/>'),
  malleable: S48(SQ + [[14, 14], [32, 16], [17, 32], [33, 33]].map(([x, y]) => dots([[x, y], [x + 3.4, y - 1.4], [x - 2.6, y - 2.6], [x - 1, y + 3.2], [x + 2.8, y + 2.4]], 1.4)).join('')),
  alloy: S48(SQ + `<text x="17" y="23" font-family="Barlow Condensed" font-weight="700" font-size="14" fill="currentColor" stroke="none" text-anchor="middle">Cr</text><text x="31" y="37" font-family="Barlow Condensed" font-weight="700" font-size="14" fill="currentColor" stroke="none" text-anchor="middle">Ni</text>`)
};

/** application glyphs (what the irons become) */
export const GLY = {
  engine: S48('<rect x="5" y="17" width="38" height="21" rx="2"/><path d="M9 17v-5h30v5M5 23h38"/><circle cx="13" cy="31" r="3.4"/><circle cx="24" cy="31" r="3.4"/><circle cx="35" cy="31" r="3.4"/><path d="M10 38v4M38 38v4"/>'),
  gear: S48(`<path d="${gearPath(24, 24, 13, 18, 10)}"/><circle cx="24" cy="24" r="5"/>`),
  flywheel: S48('<circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="10" opacity=".6"/><circle cx="24" cy="24" r="3.5"/>' + ticks(24, 24, 16, 20, 28)),
  brake: S48('<circle cx="21" cy="27" r="15"/><circle cx="21" cy="27" r="5"/><path d="M21 15v1M21 38v1M9 27h1M32 27h1" stroke-width="2.4"/><path d="M29 6h12v16H29z" fill="currentColor" fill-opacity=".22"/>'),
  base: S48('<path d="M4 42h40l-5-9H9z"/><path d="M15 33V8h9v25M24 12h15v7H24"/><path d="M33 19v6M30 25h6"/>'),
  crank: S48('<path d="M3 24h6V11h12v13h6v13h12V24h6" stroke-width="3"/>'),
  crusher: S48('<circle cx="15" cy="31" r="10"/><circle cx="34" cy="31" r="10"/><circle cx="15" cy="31" r="2"/><circle cx="34" cy="31" r="2"/><path d="M19 6l5 2-1 5-5-1zM27 9l4 1 0 4-4 0z" fill="currentColor" fill-opacity=".5"/><path d="M11 22a9 9 0 0 1 8 0M30 22a9 9 0 0 1 8 0" opacity=".5"/>'),
  nozzle: S48('<path d="M5 14h20l14 8v4l-14 8H5z"/><path d="M5 20h20M5 28h20" opacity=".45"/><path d="M42 24h4" stroke-dasharray="1.5 2.5"/>'),
  shoe: S48('<circle cx="19" cy="26" r="15"/><circle cx="19" cy="26" r="3"/><path d="M38 9a22 22 0 0 1 0 34" stroke-width="5"/><path d="M4 41h30" opacity=".5"/>'),
  rolls: S48('<circle cx="24" cy="13" r="9"/><circle cx="24" cy="35" r="9"/><path d="M2 20h13l7 3M26 24h20" stroke-width="2.2"/>'),
  manifold: S48('<path d="M7 6v12c0 6 4 9 10 9h24M19 6v10c0 4 3 6 7 6h15M31 6v8c0 2 1 3 3 3h7"/><path d="M41 15v16" opacity=".55"/>'),
  pump: S48(`<rect x="3" y="10" width="42" height="28" rx="13"/><path d="${gearPath(17, 24, 6, 8.6, 8)}"/><path d="${gearPath(31, 24, 6, 8.6, 8)}"/>`),
  bearing: S48('<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="8"/>' + dots(Array.from({ length: 8 }, (_, i) => [r1(24 + Math.cos(i * Math.PI / 4) * 13), r1(24 + Math.sin(i * Math.PI / 4) * 13)]), 2.6)),
  tractor: S48('<circle cx="14" cy="33" r="9"/><circle cx="14" cy="33" r="3"/><circle cx="38" cy="37" r="5"/><path d="M14 24V11h13l4 13h9v9M23 33h10"/>'),
  digger: S48('<path d="M3 41h24v-9H3z"/><path d="M13 32v-6h8l13-14 8 8-4 4"/><path d="M38 24l5 6-7 3"/>'),
  shield: S48('<path d="M24 5l15 5v12c0 10-7 17-15 21C16 39 9 32 9 22V10z"/><path d="M17 23l5 5 9-10"/>'),
  magnet: S48('<path d="M12 8v15a12 12 0 0 0 24 0V8h-7v15a5 5 0 0 1-10 0V8z"/><path d="M6 42L42 6" stroke-width="2.4"/>'),
  thermo: S48('<path d="M21 8a3 3 0 0 1 6 0v21a7 7 0 1 1-6 0z"/><path d="M24 33V18"/><path d="M33 14h8M33 20h6" opacity=".5"/>'),
  heat: S48('<rect x="5" y="20" width="38" height="8" rx="2"/><path d="M10 14c2-3 0-5 2-8M20 14c2-3 0-5 2-8M30 14c2-3 0-5 2-8" opacity=".75"/><path d="M8 34h32" stroke-dasharray="2 3"/><path d="M36 30l4 4-4 4"/>'),
  cutter: S48('<path d="M6 40h36"/><rect x="8" y="30" width="30" height="10" rx="1"/><path d="M30 8l8 8-12 12-6-6z"/><path d="M22 28c-4-1-8 0-9-4s3-6 6-4" stroke-width="1.5"/>'),
  scale: S48('<path d="M24 8v32M10 40h28M8 16h32"/><path d="M8 16l-5 10h10zM40 16l-5 10h10z"/>'),
  ladle: S48('<path d="M8 14l26-6 4 18c-6 8-20 10-26 4z"/><path d="M8 14L3 11"/><path d="M38 12c4 3 5 9 5 15" stroke-dasharray="2 3"/>')
};

/* ---------- lesson drawings ---------- */
/** cast: molten iron poured from a ladle into a mold */
export const castArt = (label = 'Cast: molten iron poured into a mold') => svg('0 0 240 150', `
  <path d="M74 98h146v46H74z" fill="${V.steel}" fill-opacity=".12"/>
  ${[[74, 98, 22, 46], [200, 98, 20, 46], [96, 132, 104, 12], [96, 98, 16, 8], [126, 98, 74, 8]].map(([x, y, w, h]) => hatchRect(x, y, w, h, 8)).join('')}
  <rect x="96" y="106" width="104" height="26" fill="${V.zc}" fill-opacity=".38" stroke="${V.ink}" stroke-width="1.6"/>
  <rect x="112" y="98" width="14" height="9" fill="${V.zc}" fill-opacity=".38" stroke="none"/>
  <path d="M112 98H74V144H220V98H126" stroke="${V.ink}" stroke-width="2"/>
  <path d="M24 36L86 20l12 44c-12 18-46 24-58 12z" fill="${V.steel}" fill-opacity=".25" stroke="${V.ink}" stroke-width="2.2"/>
  <path d="M30 40l52-13" stroke="${V.zc}" stroke-width="3.5"/>
  <path d="M24 36L8 28" stroke="${V.ink}" stroke-width="4"/>
  <path d="M90 24c14 6 26 30 28 78" stroke="${V.zc}" stroke-width="5"/>
  ${tx(40, 106, 'ladle', { c: V.ink3, s: 15 })}${tx(178, 90, 'mold', { c: V.ink3, s: 15 })}`, label);

/** wrought: a bar worked on the anvil */
export const wroughtArt = (label = 'Wrought: iron worked into shape') => svg('0 0 240 150', `
  <path d="M58 92h94c0 8 10 14 26 14v8h-30l-12 10v10h12v6H72v-6h12v-10l-12-10H58z" fill="${V.steel}" fill-opacity=".25" stroke="${V.ink}" stroke-width="2.2"/>
  <rect x="68" y="80" width="98" height="12" rx="2" fill="${V.zc}" fill-opacity=".38" stroke="${V.ink}" stroke-width="1.8"/>
  <path d="M128 44L194 12" stroke="${V.ink}" stroke-width="5"/>
  <rect x="104" y="40" width="44" height="22" rx="3" fill="${V.steel}" fill-opacity=".4" stroke="${V.ink}" stroke-width="2.2" transform="rotate(-8 126 51)"/>
  <path d="M106 74l-9-7M126 72v-8M146 74l9-7" stroke="${V.hot}" stroke-width="2.4"/>
  ${tx(66, 46, 'hammer', { c: V.ink3, s: 15 })}${tx(30, 122, 'anvil', { c: V.ink3, s: 15 })}`, label);

/** tension vs compression for gray iron */
export const tensionArt = (label = 'Gray iron pulled apart: poor tensile strength') => svg('0 0 240 120', `
  <rect x="58" y="46" width="124" height="28" rx="2" fill="${V.steel}" fill-opacity=".25" stroke="${V.ink}" stroke-width="2"/>
  <path d="M121 46l-5 8 7 6-6 6 4 8" stroke="${V.bad}" stroke-width="2.4"/>
  ${arrow(54, 60, 12, 60)}${arrow(186, 60, 228, 60)}
  ${tx(120, 106, 'poor tensile strength', { c: V.bad, s: 14 })}`, label);
export const compressionArt = (label = 'Gray iron pushed together: high compressive strength') => svg('0 0 240 120', `
  <rect x="84" y="30" width="72" height="56" rx="2" fill="${V.steel}" fill-opacity=".25" stroke="${V.ink}" stroke-width="2"/>${hatchRect(84, 30, 72, 56, 9)}
  ${arrow(16, 58, 78, 58)}${arrow(224, 58, 162, 58)}
  ${tx(120, 106, 'high compressive strength', { c: V.good, s: 14 })}`, label);

/** a crankshaft (side view) — ductile iron's job */
export function crankArt(label = 'A crankshaft', { name = true } = {}) {
  const webs = [[74, 36], [118, 36], [162, 82], [206, 82]].map(([x, y]) => part(x, y, 14, 82, 6, .3)).join('');
  return svg('0 0 320 200', `
    <path d="M4 100h312" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="14 4 3 4"/>
    ${part(14, 92, 30, 16, 3)}${part(44, 84, 30, 32)}${part(132, 84, 30, 32)}${part(220, 84, 30, 32)}
    ${part(88, 40, 30, 28)}${part(176, 132, 30, 28)}${webs}
    ${part(250, 56, 16, 88, 4, .3)}${part(266, 92, 34, 16, 3)}
    <path d="M14 80c8-14 26-14 34-2" stroke="${V.hot}" stroke-width="2.4"/>${head(48, 78, 60, V.hot)}
    ${name ? tx(160, 194, 'crankshaft', { c: V.ink3, s: 14 }) : ''}`, label);
}

/** rolling-mill rolls squeezing a slab — white iron's job */
export function rollsArt(label = 'Rolling-mill rolls', { name = true } = {}) {
  const roll = cy => `<circle cx="160" cy="${cy}" r="46" fill="${V.steel}" fill-opacity=".22" stroke="${V.ink}" stroke-width="2.2"/><circle cx="160" cy="${cy}" r="30" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="3 4"/><circle cx="160" cy="${cy}" r="8" fill="${V.steel}" fill-opacity=".5" stroke="${V.ink}" stroke-width="1.8"/>`;
  return svg('0 0 320 212', `
    <path d="M10 92h112l36 10v8l-36 10H10z" fill="${V.zc}" fill-opacity=".32" stroke="${V.ink}" stroke-width="2"/>
    <path d="M160 102h150v8H160z" fill="${V.zc}" fill-opacity=".32" stroke="${V.ink}" stroke-width="2"/>
    ${roll(56)}${roll(156)}
    <path d="M197 19A52 52 0 0 0 138 9" stroke="${V.hot}" stroke-width="2.4"/>${head(138, 9, 155, V.hot)}
    <path d="M197 193A52 52 0 0 1 138 203" stroke="${V.hot}" stroke-width="2.4"/>${head(138, 203, 205, V.hot)}
    ${arrow(262, 88, 304, 88, V.ink3, 1.8)}
    ${name ? tx(258, 140, 'rolling-mill rolls', { c: V.ink3, s: 14 }) : ''}`, label);
}

/** chilling selected areas in the mold turns them white */
export function chillArt(label = 'A chill in the mold makes part of the casting white iron') {
  const r = rnd(5); let sand = '';
  for (let i = 0; i < 150; i++) {
    const x = 34 + r() * 292, y = 34 + r() * 160;
    if (x > 64 && x < 296 && y > 72 && y < 182) continue;
    sand += `<circle cx="${r1(x)}" cy="${r1(y)}" r="1.1"/>`;
  }
  return svg('0 0 360 226', `
    <rect x="30" y="30" width="300" height="168" rx="3" stroke="${V.ink}" stroke-width="2"/>
    <g fill="${V.ink3}" opacity=".7">${sand}</g>
    <rect x="70" y="78" width="220" height="72" fill="${V.steel}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>
    <rect x="122" y="126" width="116" height="24" fill="${V.zc}" fill-opacity=".55"/>
    <path d="M122 126h116" stroke="${V.zc}" stroke-width="1.4" stroke-dasharray="4 3"/>
    <rect x="122" y="150" width="116" height="26" fill="${V.steel}" fill-opacity=".5" stroke="${V.ink}" stroke-width="2"/>${hatchRect(122, 150, 116, 26, 7)}
    <path d="M150 158v12M180 158v12M210 158v12" stroke="${V.ink}" stroke-width="1.6"/>${head(150, 171, 90, V.ink, 5)}${head(180, 171, 90, V.ink, 5)}${head(210, 171, 90, V.ink, 5)}
    ${lead(96, 96, 44, 20, 'gray (or ductile) iron', 'start', 0)}
    ${lead(312, 52, 318, 20, 'mold', 'end', 0)}
    ${lead(140, 138, 40, 218, 'chilled → white iron', 'start', 0, V.zt)}
    ${lead(232, 170, 318, 218, 'chill', 'end', 0)}`, label);
}

/** the family line: gray / ductile → chill → white → heat-treatment → malleable */
export function chainArt(label = 'Gray or ductile iron, chilled in the mold, gives white iron; heat-treated white iron gives malleable iron', { hide = false } = {}) {
  const bx = (x, y, w, s, op = 0) => `<rect x="${x}" y="${y}" width="${w}" height="36" rx="3" fill="${V.zc}" fill-opacity="${op}" stroke="${V.ink}" stroke-width="1.8"/>${tx(x + w / 2, y + 24, s, { c: V.ink, s: 17, w: 700 })}`;
  const step2 = hide
    ? `<rect x="192" y="160" width="46" height="30" rx="3" fill="${V.hot}" fill-opacity=".14" stroke="${V.hot}" stroke-width="1.8" stroke-dasharray="4 3"/>${tx(215, 182, '?', { c: V.hot, s: 22, w: 700 })}`
    : tx(192, 181, 'heat-treatment process', { a: 'start', c: V.zt, s: 14 });
  return svg('0 0 360 268', `
    ${bx(20, 14, 140, 'Gray iron')}${bx(200, 14, 140, 'Ductile iron')}
    <path d="M90 50v18h180V50M180 68v38" stroke="${V.ink}" stroke-width="1.8"/>${head(180, 108, 90, V.ink)}
    ${tx(192, 86, 'chill selected areas', { a: 'start', c: V.zt, s: 14 })}${tx(192, 102, 'in the mold', { a: 'start', c: V.zt, s: 14 })}
    ${bx(110, 112, 140, 'White iron', .14)}
    <path d="M180 148v48" stroke="${V.ink}" stroke-width="1.8"/>${head(180, 198, 90, V.ink)}
    ${step2}
    ${bx(110, 202, 140, 'Malleable iron', .28)}
    ${tx(180, 258, 'malleable and easily machined', { c: V.ink3, s: 13 })}`, label);
}

/** high-alloy irons: gray / ductile / white + up to 35% alloy → high-chromium · nickel */
export function alloyArt(label = 'Gray, ductile or white iron with up to 35 percent alloy: high-chromium and nickel irons') {
  const bx = (x, y, w, s, op = 0, sz = 15) => `<rect x="${x}" y="${y}" width="${w}" height="32" rx="3" fill="${V.zc}" fill-opacity="${op}" stroke="${V.ink}" stroke-width="1.8"/>${tx(x + w / 2, y + 21, s, { c: V.ink, s: sz, w: 700 })}`;
  return svg('0 0 360 262', `
    ${bx(14, 12, 100, 'Gray')}${bx(130, 12, 100, 'Ductile')}${bx(246, 12, 100, 'White', .14)}
    <path d="M64 44v16h232V44M180 44v52" stroke="${V.ink}" stroke-width="1.8"/>${head(180, 98, 90, V.ink)}
    ${tx(192, 82, '+ up to 35% alloy', { a: 'start', c: V.zt, s: 16 })}
    ${bx(96, 102, 168, 'High-alloy irons', .2, 16)}
    <path d="M180 134v14M90 148h180M90 148v16M270 148v16" stroke="${V.ink}" stroke-width="1.8"/>
    ${bx(18, 166, 144, 'High-chromium', .1)}${bx(198, 166, 144, 'Nickel', .1)}
    ${tx(90, 220, 'oxidation + wear resistant', { c: V.ink2, s: 13 })}
    ${tx(270, 218, 'nonmagnetic · corrosion', { c: V.ink2, s: 13 })}${tx(270, 236, 'extremely low expansion', { c: V.ink2, s: 13 })}`, label);
}

/** the recipe in the pot: carbon (zone colour) and silicon (ink) specks in a crucible */
export function potArt(c, si, label = 'A crucible of molten iron') {
  const r = rnd(11); let specks = '';
  const nc = Math.round(c * 7), ns = Math.round(si * 7);
  const spot = () => { const x = 70 + r() * 140, y = 70 + r() * 70; return [r1(x), r1(y)]; };
  const P = Array.from({ length: 70 }, spot);
  for (let i = 0; i < nc; i++) { const [x, y] = P[i]; specks += `<circle cx="${x}" cy="${y}" r="3.4" fill="${V.zc}"/>`; }
  for (let i = 0; i < ns; i++) { const [x, y] = P[69 - i]; specks += `<rect x="${x - 2.6}" y="${y - 2.6}" width="5.2" height="5.2" fill="${V.ink2}" transform="rotate(45 ${x} ${y})"/>`; }
  return svg('0 0 280 190', `
    <path d="M52 44h176l-16 118c-2 12-10 18-22 18H90c-12 0-20-6-22-18z" fill="${V.steel}" fill-opacity=".18" stroke="${V.ink}" stroke-width="2.4"/>
    <path d="M58 60h164" stroke="${V.zc}" stroke-width="2" stroke-dasharray="6 5"/>
    ${specks}
    <path d="M40 44h200" stroke="${V.ink}" stroke-width="3"/>
    <circle cx="24" cy="20" r="6" fill="${V.zc}"/>${tx(36, 27, 'C', { a: 'start', c: V.ink2, s: 20 })}
    <rect x="73" y="14" width="11" height="11" fill="${V.ink2}" transform="rotate(45 78.5 19.5)"/>${tx(90, 27, 'Si', { a: 'start', c: V.ink2, s: 20 })}`, label, 'irn-pot');
}

/** a flywheel (front view) — gray iron's job */
export function flywheelArt(label = 'A flywheel') {
  return svg('0 0 220 200', `
    <circle cx="110" cy="100" r="84" fill="${V.steel}" fill-opacity=".2" stroke="${V.ink}" stroke-width="2.4"/>
    <path d="${(() => { let d = ''; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; d += `M${r1(110 + Math.cos(a) * 84)} ${r1(100 + Math.sin(a) * 84)}L${r1(110 + Math.cos(a) * 92)} ${r1(100 + Math.sin(a) * 92)}`; } return d; })()}" stroke="${V.ink}" stroke-width="2"/>
    <circle cx="110" cy="100" r="62" stroke="${V.ink3}" stroke-width="1.4"/>
    <circle cx="110" cy="100" r="22" fill="${V.steel}" fill-opacity=".35" stroke="${V.ink}" stroke-width="2"/>
    ${Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2; return `<circle cx="${r1(110 + Math.cos(a) * 40)}" cy="${r1(100 + Math.sin(a) * 40)}" r="5" stroke="${V.ink}" stroke-width="1.6"/>`; }).join('')}
    <path d="M110 92v16M102 100h16" stroke="${V.ink3}" stroke-width="1"/>`, label);
}
