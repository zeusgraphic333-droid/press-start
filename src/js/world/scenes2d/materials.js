// Illustrated scenes — materials (L1 + L2 · Engineering Materials). Contract and look: STYLE.md · names and captions:
// world/scenes/info.js · what to draw: docs/SCENES.md. Zone marker: INK.gold. In this zone the section hatch IS the
// content: every sample is cut and hatched in its material's ANSI pattern (iron · steel · bronze for copper ·
// plastic for plastics and rubber · refractory · glass · lead · alu); thin rubber sections are blacked in.

const f1 = v => +(+v).toFixed(1);
const RAD = Math.PI / 180;
const D = pts => 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join('L');
const DZ = pts => D(pts) + 'Z';
const box = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const sel = svg => [s => svg.querySelector(s), s => [...svg.querySelectorAll(s)]];
const seeded = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
/** a part cut in section: hatch (.h) under its outline (.o). flip = hatch the other way (two touching parts) */
function sec(k, pts, mat, { cls = '', flip = false, tint = '', w } = {}) {
  let hp = pts, tr = '';
  if (flip) { const xs = pts.map(p => p[0]), c2 = Math.min(...xs) + Math.max(...xs); hp = pts.map(([x, y]) => [c2 - x, y]); tr = ` transform="matrix(-1 0 0 1 ${f1(c2)} 0)"`; }
  return `<g${cls ? ` class="${cls}"` : ''}>${tint ? `<path class="h" d="${DZ(pts)}" fill="${tint}"/>` : ''}<path class="h" d="${DZ(hp)}" fill="${k.hatch(mat)}"${tr}/><path class="o" d="${DZ(pts)}" fill="none" stroke="${k.INK.graphite}" stroke-width="${w || k.W.thick}" stroke-linejoin="round"/></g>`;
}
const solid = (k, pts, fill, cls = '') => `<g${cls ? ` class="${cls}"` : ''}><path class="h" d="${DZ(pts)}" fill="${fill}"/><path class="o" d="${DZ(pts)}" fill="none" stroke="${k.INK.graphite}" stroke-width="${k.W.thick}" stroke-linejoin="round"/></g>`;
const thinPath = (k, d, cls = 'o', w) => `<path class="${cls}" d="${d}" fill="none" stroke="${k.INK.graphite}" stroke-width="${w || k.W.thin}" stroke-linecap="round" stroke-linejoin="round"/>`;
const CL = 'line[stroke-dasharray="22 4 3 4"]'; // the kit's centre lines (chain), to ink them in after the outlines
function primeStroke(el) { let L = 0; try { L = Math.ceil(el.getTotalLength()) + 2; } catch (e) { L = 400; } el.style.strokeDasharray = `${L} ${L}`; el.style.strokeDashoffset = L; return L; }
/** an ingot cut across: a trapezoid, wider at the foot */
const ingot = (cx, by, wb, wt, h) => [[cx - wb / 2, by], [cx - wt / 2, by - h], [cx + wt / 2, by - h], [cx + wb / 2, by]];
/** a tree node: a box with one to three centred lines */
function node(k, cx, y, w, h, lines, { size = 15, cls = 'tr-n', dashed = false, family = 'dim', weight = 700, spacing = 1 } = {}) {
  const { INK, W } = k; const L = [].concat(lines);
  const tx = L.map((s, i) => k.text(cx, y + h / 2 + (i - (L.length - 1) / 2) * size * 1.08 + size * .36, s, { size, weight, family, spacing })).join('');
  return `<g class="${cls}"><rect class="tr-fill" x="${f1(cx - w / 2)}" y="${y}" width="${w}" height="${h}" fill="${INK.gold}" opacity="0"/><rect class="tr-box" x="${f1(cx - w / 2)}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"${dashed ? ' stroke-dasharray="9 5"' : ''}/>${tx}</g>`;
}
/** a tree connector (orthogonal polyline) + its gold twin for the loop */
const wire = (k, pts, { dashed = false } = {}) => `<path class="tr-w" d="${D(pts)}" fill="none" stroke="${k.INK.graphite}" stroke-width="${k.W.med}"${dashed ? ' stroke-dasharray="9 6"' : ''}/>`;
const goldWire = (k, pts) => `<path class="tr-g" d="${D(pts)}" fill="none" stroke="${k.INK.gold}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`;

/* ======================================================================================================
   materialsTree ★ — the L1·S4 tree as a drawing: Materials → Metals · Plastics · Rubber/Elastomers · Natural
   Engineering Materials, each branch ending in a sample cut in section — two ingots (iron · bronze hatch), a
   moulded cup (plastic hatch), an O-ring (blacked in, as thin rubber sections are drawn), a glass pane and a
   firebrick. Loop: the branch lights gold and a cutting plane passes through its sample, revealing the material.
   ====================================================================================================== */
const MT = { cx: [105, 235, 365, 495], y: 136, hy: 54, sy: 246, k: 1.15 }; // k: samples drawn 15% up about their centres
const MT_HEAD = [['METALS'], ['PLASTICS'], ['RUBBER /', 'ELASTOMERS'], ['NATURAL', 'ENGINEERING', 'MATERIALS']];
const MT_SUB = [['Ferrous', 'Nonferrous'], ['Thermoset', 'Thermoplastic'], ['Thermoset', 'Thermoplastic'], ['Engineering Ceramics', 'Glass', 'Manufactured Carbon', 'Refractory Hard Metals']];
const MT_SPAN = [[52, 160], [184, 286], [316, 414], [448, 548]]; // sample extents (x) for the cutting plane
function mtSamples(k) {
  const { INK, W } = k; const [c0, c1, c2, c3] = MT.cx, y = MT.sy;
  const cup = [[-48, 0], [48, 0], [48, 9], [41, 9], [36, 92], [-36, 92], [-41, 9], [-48, 9]].map(([x, yy]) => [c1 + x, y + 6 + yy]);
  const cupIn = [[-29, 9], [29, 9], [26, 80], [-26, 80]].map(([x, yy]) => [c1 + x, y + 6 + yy]);
  const ring = (r1, r2, cx, cy) => `M${cx - r1} ${cy}A${r1} ${r1} 0 1 0 ${cx + r1} ${cy}A${r1} ${r1} 0 1 0 ${cx - r1} ${cy}ZM${cx - r2} ${cy}A${r2} ${r2} 0 1 1 ${cx + r2} ${cy}A${r2} ${r2} 0 1 1 ${cx - r2} ${cy}Z`;
  const oc = [c2, y + 52];
  return [
    // metals: a ferrous ingot and a non-ferrous ingot
    { hatch: `<path d="${DZ(ingot(c0 - 27, y + 100, 50, 38, 78))}" fill="${k.hatch('iron')}"/><path d="${DZ(ingot(c0 + 27, y + 100, 50, 38, 78))}" fill="${k.hatch('bronze')}"/>`,
      line: `<path class="o" d="${DZ(ingot(c0 - 27, y + 100, 50, 38, 78))}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><path class="o" d="${DZ(ingot(c0 + 27, y + 100, 50, 38, 78))}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>` },
    // plastics: a moulded cup, cut through its axis
    { hatch: `<path d="${DZ(cup)}" fill="${k.hatch('plastic')}"/><path d="${DZ(cupIn)}" fill="#fff"/>`,
      line: `<path class="o" d="${DZ(cup)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/><path class="o" d="${DZ(cupIn)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/>${k.center(c1, y - 4, c1, y + 108)}` },
    // rubber: an O-ring, blacked in
    { hatch: `<path class="mt-oring" d="${ring(48, 30, ...oc)}" fill="${INK.rubber}" fill-rule="evenodd"/>`,
      line: `<path class="o mt-oring" d="${ring(48, 30, ...oc)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>${k.center(oc[0] - 60, oc[1], oc[0] + 60, oc[1])}${k.center(oc[0], oc[1] - 60, oc[0], oc[1] + 60)}` },
    // natural engineering materials: a glass pane and a firebrick
    { hatch: `<path d="${DZ(box(c3 - 46, y - 2, 18, 104))}" fill="${k.hatch('glass')}"/><path d="${DZ(box(c3 - 18, y + 46, 70, 56))}" fill="${k.hatch('refractory')}"/>`,
      line: `<path class="o" d="${DZ(box(c3 - 46, y - 2, 18, 104))}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/><path class="o" d="${DZ(box(c3 - 18, y + 46, 70, 56))}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>` }
  ];
}
function materialsTreeDraw(k) {
  const { INK, W } = k; const { cx, y, hy, sy } = MT;
  const busY = 117, rootB = 98;
  let s = `<g class="mt-root"><rect x="200" y="50" width="200" height="${rootB - 50}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/><rect x="200" y="${rootB - 7}" width="200" height="7" fill="${INK.gold}"/>${k.text(300, 84, 'MATERIALS', { size: 30, family: 'display', weight: 800, spacing: 2.5 })}</g>`;
  s += wire(k, [[300, rootB], [300, busY]]) + wire(k, [[cx[0], y], [cx[0], busY], [cx[3], busY], [cx[3], y]]) + [1, 2].map(i => wire(k, [[cx[i], busY], [cx[i], y]])).join('');
  s += cx.map(c => goldWire(k, [[300, rootB], [300, busY], [c, busY], [c, y]]) + goldWire(k, [[c, y + hy], [c, sy - 14]])).join('');
  s += MT_HEAD.map((h, i) => node(k, cx[i], y, 118, hy, h, { size: h.length > 2 ? 13 : 15, cls: 'tr-n mt-n' })).join('');
  s += cx.map(c => wire(k, [[c, y + hy], [c, sy - 14]])).join('');
  const smp = mtSamples(k);
  s += smp.map((p, i) => `<clipPath id="materialsTree-c${i}"><rect class="mt-clip" x="${MT_SPAN[i][0] - 6}" y="${sy - 20}" width="${MT_SPAN[i][1] - MT_SPAN[i][0] + 12}" height="150"/></clipPath>
    <g class="mt-s" transform="translate(${cx[i]} ${sy + 50}) scale(${MT.k}) translate(${-cx[i]} ${-(sy + 50)})"><g class="mt-hatch" clip-path="url(#materialsTree-c${i})"><rect width="1" height="1" fill="#fff"/>${p.hatch}</g>${p.line}
    <g class="mt-cut" opacity="0" transform="translate(${MT_SPAN[i][0] - 6} 0)"><path d="M0 ${sy - 18}V${sy + 128}" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-dasharray="26 5 4 5"/><path d="M-9 ${sy - 18}H0M-9 ${sy + 128}H0" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g></g>`).join('');
  s += MT_SUB.map((L, i) => `<g class="mt-sub">${L.map((t, j) => k.text(cx[i], 418 + j * 21, t, { size: 14, weight: 500, fill: INK.graphite2 })).join('')}</g>`).join('');
  s += `<g class="mt-tb">${k.titleBlock(352, 518, { title: 'ENGINEERING MATERIALS', no: 'SH 02', scale: 'NTS', w: 196 })}</g>`;
  return s;
}
function materialsTreePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(q('.mt-root'), { opacity: 0, scale: .9, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(2)' }, 0);
  k.plot(t, qa('.tr-w'), { at: .3, stagger: .06, dur: .5 });
  k.plot(t, qa('.mt-n .tr-box'), { at: .55, stagger: .08, dur: .5 });
  k.ink(t, qa('.mt-n text'), { at: .75, stagger: .04 });
  k.plot(t, qa('.mt-s .o'), { at: .9, stagger: .06, dur: .6 });
  k.ink(t, qa('.mt-hatch'), { at: 1.3, stagger: .12 });
  k.ink(t, qa(CL), { at: 1.3 });
  k.ink(t, qa('.mt-sub'), { at: 1.5, stagger: .1 });
  t.from(q('.mt-tb'), { opacity: 0, y: 8, duration: .5 }, 1.7);
  if (k.reduced()) return t;
  const gw = qa('.tr-g'), nodes = qa('.mt-n .tr-fill'), clips = qa('.mt-clip'), cuts = qa('.mt-cut'), hatches = qa('.mt-hatch');
  const Lg = gw.map(primeStroke); gsap.set(gw, { opacity: 1 });
  const L = gsap.timeline({ repeat: -1, delay: 2.6, repeatDelay: .6 });
  MT.cx.forEach((c, i) => {
    const at = i * 1.9, [x0, x1] = MT_SPAN[i], w = x1 - x0 + 12;
    L.fromTo(gw[i * 2], { strokeDashoffset: Lg[i * 2] }, { strokeDashoffset: 0, duration: .55, ease: 'power1.inOut', immediateRender: false }, at)
      .fromTo(gw[i * 2 + 1], { strokeDashoffset: Lg[i * 2 + 1] }, { strokeDashoffset: 0, duration: .2, ease: 'none', immediateRender: false }, at + .55)
      .to(nodes[i], { opacity: .3, duration: .3 }, at + .4)
      // the cut: the section empties, the cutting plane passes, the material shows behind it
      .to(hatches[i], { opacity: 0, duration: .25 }, at + .5)
      .set(clips[i], { attr: { width: 0 } }, at + .76).set(hatches[i], { opacity: 1 }, at + .77)
      .to(cuts[i], { opacity: 1, duration: .2 }, at + .7)
      .to(cuts[i], { x: x1 + 6, duration: .9, ease: 'power1.inOut' }, at + .8)
      .to(clips[i], { attr: { width: w }, duration: .9, ease: 'power1.inOut' }, at + .8)
      .to(cuts[i], { opacity: 0, duration: .25 }, at + 1.7)
      .set(cuts[i], { x: x0 - 6 }, at + 1.96);
    if (i === 2) L.to(qa('.mt-oring'), { scaleX: 1.22, scaleY: .8, svgOrigin: `${c} ${MT.sy + 52}`, duration: .35, ease: 'power2.out' }, at + 1.75)
      .to(qa('.mt-oring'), { scaleX: 1, scaleY: 1, svgOrigin: `${c} ${MT.sy + 52}`, duration: .9, ease: 'elastic.out(1, .4)' }, at + 2.1);
    L.to([gw[i * 2], gw[i * 2 + 1], nodes[i]], { opacity: 0, duration: .5 }, at + 1.95)
      .set([gw[i * 2], gw[i * 2 + 1]], { opacity: 1, strokeDashoffset: j => Lg[i * 2 + j] }, at + 2.5);
  });
  return t;
}

/* ======================================================================================================
   classTree — the L2·S2 fork: engineering materials split into metals (ferrous: contains iron · non-ferrous:
   contains no iron) and non-metals (polymers · ceramics); each leaf with a sample cut in its hatch and the slide's
   examples. Loop: the fork is traced in gold to each leaf in turn.
   ====================================================================================================== */
const CT = { lx: [95, 235, 365, 505] };
const CT_EX = [['wrought iron', 'carbon steels', 'alloy steels', 'cast irons'], ['aluminium', 'copper', 'lead', 'silver', 'tin', 'zinc, etc.'], ['thermosetting', 'thermoplastic'], ['refractories', 'abrasives', 'glass', 'cement', 'concrete']];
function classTreeDraw(k) {
  const { INK, W } = k; const lx = CT.lx;
  const P = [165, 435], L2 = 122, L3 = 194;
  let s = node(k, 300, 48, 250, 40, 'ENGINEERING MATERIALS', { size: 17, cls: 'tr-n ct-root', spacing: 1.2 });
  s += wire(k, [[300, 88], [300, 106]]) + wire(k, [[P[0], L2], [P[0], 106], [P[1], 106], [P[1], L2]]);
  s += node(k, P[0], L2, 132, 38, 'METALS', { cls: 'tr-n ct-l2' }) + node(k, P[1], L2, 132, 38, 'NON-METALS', { cls: 'tr-n ct-l2' });
  s += [0, 1].map(j => wire(k, [[P[j], L2 + 38], [P[j], 176]]) + wire(k, [[lx[j * 2], L3], [lx[j * 2], 176], [lx[j * 2 + 1], 176], [lx[j * 2 + 1], L3]])).join('');
  s += lx.map((x, i) => { const p = P[i >> 1]; return goldWire(k, [[300, 88], [300, 106], [p, 106], [p, L2]]) + goldWire(k, [[p, L2 + 38], [p, 176], [x, 176], [x, L3]]); }).join('');
  s += ['FERROUS', 'NON-FERROUS', 'POLYMERS', 'CERAMICS'].map((t, i) => node(k, lx[i], L3, 124, 36, t, { cls: 'tr-n ct-leaf' })).join('');
  s += `<g class="ct-red">${k.text(lx[0], 250, 'CONTAINS IRON', { size: 13, weight: 700, spacing: 1, fill: INK.red })}${k.text(lx[1], 250, 'CONTAINS NO IRON', { size: 13, weight: 700, spacing: 1, fill: INK.red })}</g>`;
  const sy = 330;
  const cup = [[-44, 0], [44, 0], [38, 58], [-38, 58]].map(([x, y]) => [lx[2] + x, sy - 58 + y]), cupIn = [[-28, 0], [28, 0], [24, 46], [-24, 46]].map(([x, y]) => [lx[2] + x, sy - 58 + y]);
  s += `<g class="ct-s">${sec(k, ingot(lx[0], sy, 92, 72, 58), 'iron')}</g><g class="ct-s">${sec(k, ingot(lx[1], sy, 92, 72, 58), 'bronze')}</g>
    <g class="ct-s">${sec(k, cup, 'plastic')}<path d="${DZ(cupIn)}" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round"/></g>
    <g class="ct-s">${sec(k, box(lx[3] - 46, sy - 50, 92, 50), 'refractory')}</g>`;
  s += CT_EX.map((L, i) => `<g class="ct-ex">${L.map((t, j) => k.text(lx[i], 364 + j * 20, t, { size: 14, weight: 500, fill: INK.graphite2 })).join('')}</g>`).join('');
  return s;
}
function classTreePlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.ct-root .tr-box'), { dur: .5 });
  k.ink(t, qa('.ct-root text'), { at: .2 });
  k.plot(t, qa('.tr-w'), { at: .35, stagger: .07, dur: .45 });
  k.plot(t, qa('.ct-l2 .tr-box, .ct-leaf .tr-box'), { at: .5, stagger: .07, dur: .45 });
  k.ink(t, qa('.ct-l2 text, .ct-leaf text'), { at: .7, stagger: .05 });
  k.plot(t, qa('.ct-s .o'), { at: .9, stagger: .08, dur: .55 });
  k.ink(t, qa('.ct-s .h'), { at: 1.25, stagger: .08 });
  k.stamp(t, q('.ct-red'), { at: 1.3 });
  k.ink(t, qa('.ct-ex'), { at: 1.4, stagger: .1 });
  if (k.reduced()) return t;
  const gw = qa('.tr-g'), fills = qa('.ct-leaf .tr-fill'), l2 = qa('.ct-l2 .tr-fill'), smp = qa('.ct-s');
  const Lg = gw.map(primeStroke); gsap.set(gw, { opacity: 1 });
  const L = gsap.timeline({ repeat: -1, delay: 2.4, repeatDelay: .6 });
  CT.lx.forEach((x, i) => {
    const at = i * 1.6, a = gw[i * 2], b = gw[i * 2 + 1];
    L.fromTo(a, { strokeDashoffset: Lg[i * 2] }, { strokeDashoffset: 0, duration: .4, ease: 'power1.in', immediateRender: false }, at)
      .to(l2[i >> 1], { opacity: .3, duration: .25 }, at + .3)
      .fromTo(b, { strokeDashoffset: Lg[i * 2 + 1] }, { strokeDashoffset: 0, duration: .35, ease: 'power1.out', immediateRender: false }, at + .4)
      .to(fills[i], { opacity: .35, duration: .25 }, at + .7)
      .to(smp[i], { scale: 1.07, transformOrigin: '50% 100%', duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' }, at + .75)
      .to([a, b, fills[i], l2[i >> 1]], { opacity: 0, duration: .45 }, at + 1.35)
      .set([a, b], { opacity: 1, strokeDashoffset: j => Lg[i * 2 + j] }, at + 1.82);
  });
  return t;
}

/* ======================================================================================================
   metalsChart — Metals → Ferrous · Nonferrous · and, on the slide's dashed branch, Powdered Metallurgy. Ferrous
   and nonferrous are stacks of ingots in their hatches; powder metallurgy is a compaction press that runs: the feed
   shoe fills the die with powder, the punch presses it into a part, the lower punch ejects it.
   ====================================================================================================== */
const PM = { cx: 480, dt: 330, db: 390, cw: 56 };
function metalsChartDraw(k) {
  const { INK, W } = k; const { cx, dt, db, cw } = PM; const c0 = cx - cw / 2, c1 = cx + cw / 2;
  let s = `<g class="mc-root"><rect x="225" y="50" width="150" height="48" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.thick}"/><rect x="225" y="91" width="150" height="7" fill="${INK.gold}"/>${k.text(300, 84, 'METALS', { size: 30, family: 'display', weight: 800, spacing: 2.5 })}</g>`;
  s += wire(k, [[300, 98], [300, 146]]) + wire(k, [[110, 146], [110, 122], [300, 122]]) + wire(k, [[300, 122], [cx, 122], [cx, 146]], { dashed: true });
  s += node(k, 110, 146, 140, 40, 'FERROUS', { cls: 'tr-n mc-n' }) + node(k, 300, 146, 140, 40, 'NONFERROUS', { cls: 'tr-n mc-n' });
  s += node(k, cx, 146, 150, 48, ['POWDERED', 'METALLURGY'], { size: 14, cls: 'tr-n mc-n', dashed: true });
  // ingot stacks (two below, one on top)
  const stack = (x, mat) => `<g class="mc-stack" transform="translate(${x} 392) scale(1.3) translate(${-x} -392)">${sec(k, ingot(x - 33, 392, 62, 48, 40), mat)}${sec(k, ingot(x + 33, 392, 62, 48, 40), mat, { flip: true })}${sec(k, ingot(x, 352, 62, 48, 40), mat)}</g>`;
  s += wire(k, [[110, 186], [110, 260]]) + wire(k, [[300, 186], [300, 260]]);
  s += stack(110, 'iron') + stack(300, 'bronze');
  s += [[110, 'irons · steels'], [300, 'Al · Cu · Pb · Ag · Sn · Zn']].map(([x, t]) => `<g class="mc-note">${k.text(x, 426, t, { size: 14, weight: 600, fill: INK.graphite2 })}</g>`).join('');
  // the compaction press: a die block with its cavity, punches on ram plates, the feed shoe on the die top
  s += `<line class="tr-w" x1="${cx}" y1="194" x2="${cx}" y2="226" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-dasharray="9 6"/>
    <g class="mc-pow"><path class="mc-pw" d="${DZ(box(c0, dt, cw, db - dt))}" fill="${INK.steel2}" opacity=".7"/><path class="mc-pw" d="${DZ(box(c0, dt, cw, db - dt))}" fill="${k.hatch('stipple')}"/>
      <path class="mc-comp" d="${DZ(box(c0, dt, cw, db - dt))}" fill="${INK.steel}" opacity="0"/><path d="${DZ(box(c0, dt, cw, db - dt))}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/></g>
    ${sec(k, box(cx - 76, dt, 76 - cw / 2, 70), 'steel', { cls: 'mc-die' })}${sec(k, box(c1, dt, 76 - cw / 2, 70), 'steel', { cls: 'mc-die', flip: true })}
    <g class="mc-lo">${sec(k, box(c0 + 2, db, cw - 4, 56), 'steel', { flip: true })}${sec(k, box(cx - 50, db + 56, 100, 14), 'steel')}</g>
    <g class="mc-up">${sec(k, box(cx - 50, 226, 100, 14), 'steel', { flip: true })}${sec(k, box(c0 + 2, 240, cw - 4, 60), 'steel')}</g>
    <g class="mc-shoe">${solid(k, [[c1 + 2, dt - 28], [c1 + 46, dt - 28], [c1 + 46, dt], [c1 + 2, dt]], '#fff')}<path d="${DZ(box(c1 + 7, dt - 22, 34, 18))}" fill="${k.hatch('stipple')}"/></g>
    <line class="o" x1="${cx - 76}" y1="484" x2="${cx + 76}" y2="484" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/><rect class="h" x="${cx - 76}" y="484" width="152" height="8" fill="${k.hatch('iron')}"/>`;
  return s;
}
function metalsChartPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  t.from(q('.mc-root'), { opacity: 0, scale: .9, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(2)' }, 0);
  k.plot(t, qa('.tr-w:not([stroke-dasharray])'), { at: .3, stagger: .08, dur: .5 });
  k.ink(t, qa('.tr-w[stroke-dasharray], .mc-n .tr-box[stroke-dasharray]'), { at: .5, stagger: .1 });
  k.plot(t, qa('.mc-n .tr-box:not([stroke-dasharray])'), { at: .5, stagger: .1, dur: .5 });
  k.ink(t, qa('.mc-n text'), { at: .7, stagger: .05 });
  k.plot(t, qa('.mc-stack .o, .mc-die .o, .mc-lo .o, .mc-up .o, .mc-shoe .o, line.o'), { at: .9, stagger: .04, dur: .55 });
  k.ink(t, qa('.mc-stack .h, .mc-die .h, .mc-lo .h, .mc-up .h, .mc-shoe .h, .mc-shoe path, rect.h'), { at: 1.3, stagger: .03 });
  k.ink(t, qa('.mc-pow, .mc-note'), { at: 1.5, stagger: .1 });
  if (k.reduced()) return t;
  const { cx, dt, db } = PM;
  const pow = q('.mc-pow'), pw = qa('.mc-pw'), comp = q('.mc-comp'), up = q('.mc-up'), lo = q('.mc-lo'), shoe = q('.mc-shoe');
  const bot = `${cx} ${db}`, H = db - dt;
  const L = gsap.timeline({ repeat: -1, delay: 2.4, repeatDelay: .3 });
  // compact: the punch comes down and presses the powder to half its height
  L.to(up, { y: 30, duration: .45, ease: 'power2.in' }, 0)
    .to(up, { y: 30 + H / 2, duration: .7, ease: 'power1.out' }, .45)
    .to(pow, { scaleY: .5, svgOrigin: bot, duration: .7, ease: 'power1.out' }, .45)
    .to(pw, { opacity: 0, duration: .5 }, .7).to(comp, { opacity: 1, duration: .5 }, .7)
    .to(up, { y: 0, duration: .8, ease: 'power2.inOut' }, 1.4)
    // eject: the lower punch lifts the part out of the die; the shoe pushes it off
    .to(lo, { y: -H, duration: .7, ease: 'power2.inOut' }, 1.9)
    .to(pow, { y: -H, duration: .7, ease: 'power2.inOut' }, 1.9)
    .to(shoe, { x: -PM.cw - 4, duration: .6, ease: 'power2.inOut' }, 2.7)
    .to(pow, { x: -70, opacity: 0, duration: .6, ease: 'power2.in' }, 2.75)
    .to(lo, { y: 0, duration: .6, ease: 'power2.inOut' }, 3.3)
    // fill: the shoe, over the open die, drops a new charge of powder in; then it goes back
    .set(pow, { x: 0, y: 0, scaleY: 0, svgOrigin: bot, opacity: 1 }, 3.4).set(pw, { opacity: 1 }, 3.4).set(comp, { opacity: 0 }, 3.4)
    .to(pow, { scaleY: 1, svgOrigin: bot, duration: .7, ease: 'power1.out' }, 3.9)
    .to(shoe, { x: 0, duration: .6, ease: 'power2.inOut' }, 4.65);
  return t;
}


/* ======================================================================================================
   atoms / alloy — DETAIL A of a metal bar at ten million to one: a close-packed lattice in a detail circle.
   Pure metal: every atom the same (one size, one colour, every balloon says 1). A shear push makes the top half
   slip one atom along — easily, and the picture after is the same. Alloy: a second element mixed in (bigger, grey,
   balloon 2) bends the rows around it; the same push and the slip jams on it and springs back: stronger.
   ====================================================================================================== */
const LT = { cx: 318, cy: 262, R: 188, d: 46 };
function latticeAtoms(alloy) {
  const { cx, cy, R, d } = LT, dy = d * Math.sqrt(3) / 2, A = [];
  for (let j = -6; j <= 5; j++) {
    const y = cy + (j + .5) * dy, top = y < cy;
    for (let i = -7; i <= 6; i++) {
      const x = cx + i * d + (Math.abs(j) % 2 ? d / 2 : 0);
      const inside = Math.hypot(x - cx, y - cy) < R + 26, slidesIn = top && Math.hypot(x + d - cx, y - cy) < R + 26;
      if (inside || slidesIn) A.push({ x, y, top, i, j, b: false });
    }
  }
  if (!alloy) return A;
  // the second element: a few sites, one of them right on the slip plane near the middle (the one that jams it)
  const pick = [[0, -1], [-3, -4], [3, -3], [-2, 2], [2, 1], [-4, 0], [4, 3], [-1, 4], [1, -5]];
  pick.forEach(([i, j]) => { const a = A.find(p => p.i === i && p.j === j); if (a) a.b = true; });
  const B = A.filter(p => p.b);
  A.forEach(p => { if (p.b) return; B.forEach(b => { const dx = p.x - b.x, dy2 = p.y - b.y, r = Math.hypot(dx, dy2); if (r < d * 1.15) { p.x += dx / r * 3.2; p.y += dy2 / r * 3.2; } }); });
  return A;
}
function latticeDraw(k, name, alloy) {
  const { INK, W } = k; const { cx, cy, R, d } = LT;
  const A = latticeAtoms(alloy);
  const atom = p => p.b ? `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="27" fill="${INK.steel}" stroke="${INK.graphite}" stroke-width="${W.med}"/>`
    : `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="21" fill="${INK.gold}" fill-opacity=".42" stroke="${INK.graphite}" stroke-width="1.6"/>`;
  const near = (x, y, b = false) => A.filter(p => p.b === b && Math.hypot(p.x - cx, p.y - cy) < R - 24).sort((p, q) => Math.hypot(p.x - x, p.y - y) - Math.hypot(q.x - x, q.y - y))[0];
  const balloon = (bx, by, n, p) => { const a = Math.atan2(p.y - by, p.x - bx); return `<g class="lt-bal"><line x1="${f1(bx + Math.cos(a) * 13)}" y1="${f1(by + Math.sin(a) * 13)}" x2="${f1(p.x)}" y2="${f1(p.y)}" stroke="${INK.graphite}" stroke-width="${W.thin}" marker-end="url(#dot)"/>${k.balloon(bx, by, n)}</g>`; };
  const bals = alloy ? [balloon(548, 150, 1, near(470, 175)), balloon(548, 360, 2, near(450, 330, true)), balloon(78, 150, 2, near(220, 175, true))]
    : [balloon(548, 150, 1, near(470, 175)), balloon(552, 262, 1, near(484, 262)), balloon(548, 374, 1, near(452, 352))];
  const blocker = A.find(p => p.b && p.i === 0 && p.j === -1);
  return `
    <clipPath id="${name}-clip"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
    <g clip-path="url(#${name}-clip)"><rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="#fff"/>
      <g class="lt-bot">${A.filter(p => !p.top).map(atom).join('')}</g>
      <g class="lt-top">${A.filter(p => p.top).map(atom).join('')}</g>
      <line class="lt-slip" x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="${INK.red}" stroke-width="${W.med}" stroke-dasharray="12 7" opacity="0"/>
      ${blocker ? `<circle class="lt-block" cx="${f1(blocker.x)}" cy="${f1(blocker.y)}" r="35" fill="none" stroke="${INK.red}" stroke-width="${W.med}" opacity="0"/>` : ''}
    </g>
    <circle class="lt-ring" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
    <g class="lt-push" opacity="0">${k.arrow(cx - 80, cy - R - 22, cx + 80, cy - R - 22)}${k.arrow(cx + 80, cy + R + 22, cx - 80, cy + R + 22)}</g>
    ${bals.join('')}
    <g class="lt-lab">${k.text(cx, 506, 'DETAIL A', { size: 18, weight: 700, spacing: 1.6 })}${k.text(cx, 524, 'SCALE 10 000 000 : 1', { size: 12.5, weight: 600, spacing: 1, fill: INK.graphite3 })}</g>
    <g class="lt-bar"><path d="${DZ(box(44, 518, 150, 30))}" fill="${alloy ? INK.steel : INK.gold}" fill-opacity="${alloy ? .55 : .42}" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
      <circle cx="150" cy="533" r="11" fill="none" stroke="${INK.graphite}" stroke-width="${W.thin}"/>${k.text(170, 516, 'A', { size: 15, weight: 700 })}</g>`;
}
function latticePlay(svg, k, alloy) {
  const { gsap } = k; const [q, qa] = sel(svg); const { d } = LT;
  const t = k.tl();
  k.plot(t, q('.lt-ring'), { dur: .8 });
  t.from(qa('.lt-bot circle, .lt-top circle'), { scale: 0, opacity: 0, transformOrigin: '50% 50%', duration: .4, ease: 'back.out(2)', stagger: { each: .006, from: 'center' } }, .2);
  k.stamp(t, qa('.lt-bal'), { at: 1.2, stagger: .1 });
  t.from(qa('.lt-lab, .lt-bar'), { opacity: 0, y: 8, duration: .5, stagger: .1 }, 1.1);
  if (k.reduced()) return t;
  const top = q('.lt-top'), push = q('.lt-push'), slip = q('.lt-slip');
  const L = gsap.timeline({ repeat: -1, delay: 2.4, repeatDelay: 1.1 });
  L.to(push, { opacity: 1, duration: .35 }, 0).to(slip, { opacity: 1, duration: .35 }, .1);
  if (!alloy) {
    // the same atoms all through: the top half slides one atom along, and nothing has changed
    L.to(top, { x: d, duration: 1.5, ease: 'power2.inOut' }, .45)
      .to([push, slip], { opacity: 0, duration: .4 }, 2.2)
      .set(top, { x: 0 }, 3);
  } else {
    // the bigger atoms bend the rows: the slip jams on one and springs back
    L.to(top, { x: 8, duration: .9, ease: 'power2.out' }, .45)
      .to(q('.lt-block'), { opacity: 1, duration: .3 }, 1)
      .to(top, { x: 0, duration: 1.2, ease: 'elastic.out(1, .4)' }, 1.6)
      .to([push, slip, q('.lt-block')], { opacity: 0, duration: .4 }, 2.4)
      .to({}, { duration: .3 }, 2.8);
  }
  return t;
}

/* ======================================================================================================
   ferrous / nonferrous — the same overhead crane with a lifting magnet sweeps over the floor. Ferrous (contains
   iron): a wrought-iron bar, a carbon-steel I-beam, an alloy-steel gear, a cast-iron pulley, each cut in its hatch —
   each one jumps toward the magnet as it passes. Non-ferrous (no iron inside): six ingots in their own colours —
   aluminium, copper, lead, silver, tin, zinc — and nothing moves. (The magnet is a visual hint only.)
   ====================================================================================================== */
function rigDraw(k, name, mx) {
  const { INK, W } = k;
  const field = [26, 46, 66].map(r => `<path d="M${mx - r} 318A${r} ${r * .85} 0 0 0 ${mx + r} 318" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="6 5"/>`).join('');
  return `<g class="rg-rail">${solid(k, box(40, 96, 520, 12), INK.steel2)}</g>
    <g class="rg-mag">
      <g class="rg-field" opacity="0">${field}</g>
      ${solid(k, box(mx - 22, 110, 44, 16), INK.steel2)}<circle cx="${mx - 12}" cy="108" r="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/><circle cx="${mx + 12}" cy="108" r="6" fill="#fff" stroke="${INK.graphite}" stroke-width="${W.med}"/>
      <line class="o" x1="${mx}" y1="126" x2="${mx}" y2="262" stroke="${INK.graphite}" stroke-width="${W.med}"/>
      ${solid(k, box(mx - 8, 260, 16, 12), INK.steel)}
      ${solid(k, [[mx - 56, 272], [mx + 56, 272], [mx + 56, 304], [mx + 50, 310], [mx - 50, 310], [mx - 56, 304]], INK.steel2)}
      ${k.hazard(mx - 56, 278, 112, 10, `${name}-mg`)}<path d="M${mx - 56} 278H${mx + 56}M${mx - 56} 288H${mx + 56}" stroke="${INK.graphite}" stroke-width="${W.thin}"/>
    </g>
    <line class="o" x1="40" y1="470" x2="560" y2="470" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/><rect class="h" x="40" y="470" width="520" height="8" fill="${k.hatch('iron')}"/>`;
}
const FE = { cx: [105, 235, 365, 495] };
function gearPts(cx, cy, ro, ri, n) {
  const P = [];
  for (let i = 0; i < n; i++) { const a = i * 360 / n * RAD, s = 360 / n * RAD; [[ri, 0], [ro, .18], [ro, .44], [ri, .62]].forEach(([r, f]) => P.push([cx + r * Math.cos(a + s * f), cy + r * Math.sin(a + s * f)])); }
  return P;
}
function ferrousDraw(k) {
  const { INK, W } = k; const [c0, c1, c2, c3] = FE.cx;
  const beam = [[c1 - 42, 390], [c1 + 42, 390], [c1 + 42, 403], [c1 + 7, 403], [c1 + 7, 457], [c1 + 42, 457], [c1 + 42, 470], [c1 - 42, 470], [c1 - 42, 457], [c1 - 7, 457], [c1 - 7, 403], [c1 - 42, 403]];
  const gear = DZ(gearPts(c2, 428, 42, 34, 14)) + `M${c2 + 11} 428A11 11 0 1 0 ${c2 - 11} 428A11 11 0 1 0 ${c2 + 11} 428Z`;
  const circ = (r, cx, cy, ccw) => `M${f1(cx + r)} ${cy}A${r} ${r} 0 1 ${ccw ? 0 : 1} ${f1(cx - r)} ${cy}A${r} ${r} 0 1 ${ccw ? 0 : 1} ${f1(cx + r)} ${cy}Z`;
  const fy = 428, spokes = [0, 72, 144, 216, 288].map(a => { const u = [Math.cos((a - 90) * RAD), Math.sin((a - 90) * RAD)], n = [-u[1], u[0]]; const p = (r, w) => [c3 + u[0] * r + n[0] * w, fy + u[1] * r + n[1] * w]; return [p(12, -4.5), p(34, -4.5), p(34, 4.5), p(12, 4.5)]; });
  const spokeEdges = spokes.map(q => D([q[0], q[1]]) + D([q[3], q[2]])).join('');
  const samples = [
    `<path class="h" d="M${c0 + 36} 434A36 36 0 1 0 ${c0 - 36} 434A36 36 0 1 0 ${c0 + 36} 434Z" fill="${k.hatch('iron')}"/><circle class="o" cx="${c0}" cy="434" r="36" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.center(c0 - 46, 434, c0 + 46, 434)}${k.center(c0, 388, c0, 480)}`,
    sec(k, beam, 'steel'),
    `<path class="h" d="${gear}" fill="${k.hatch('steel')}" fill-rule="evenodd"/><path class="o" d="${gear}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linejoin="round"/>${k.center(c2 - 52, 428, c2 + 52, 428)}`,
    `<path class="h" d="${circ(42, c3, fy) + circ(33, c3, fy, 1)}" fill="${k.hatch('iron')}" fill-rule="evenodd"/><path class="h" d="${spokes.map(DZ).join('')}" fill="${k.hatch('iron')}"/><path class="h" d="${circ(13, c3, fy) + circ(6, c3, fy, 1)}" fill="${k.hatch('iron')}" fill-rule="evenodd"/>
     <path class="o" d="${circ(42, c3, fy) + circ(33, c3, fy) + circ(13, c3, fy) + circ(6, c3, fy)}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/><path class="o" d="${spokeEdges}" fill="none" stroke="${INK.graphite}" stroke-width="${W.med}"/>`
  ];
  return `${rigDraw(k, 'ferrous', c0)}
    ${samples.map((s, i) => `<g class="fe-s"><g transform="translate(${FE.cx[i]} 470) scale(1.3) translate(${-FE.cx[i]} -470)">${s}</g></g>`).join('')}
    ${['WROUGHT IRON', 'CARBON STEELS', 'ALLOY STEELS', 'CAST IRONS'].map((s, i) => `<g class="fe-lab">${k.text(FE.cx[i], 506, s, { size: 16, weight: 700, spacing: 1 })}</g>`).join('')}`;
}
function rigPlay(svg, k, n, jump) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.rg-rail .o, .rg-mag .o, line.o'), { stagger: .05, dur: .55 });
  k.ink(t, qa('.rg-rail .h, .rg-mag .h, rect.h'), { at: .4 });
  k.plot(t, qa('.fe-s .o, .nf-s .o'), { at: .5, stagger: .06, dur: .55 });
  k.ink(t, qa('.fe-s .h, .nf-s .h'), { at: .9, stagger: .05 });
  k.ink(t, qa(`${CL}, .nf-s text`), { at: 1 });
  k.stamp(t, qa('.fe-lab, .nf-lab'), { at: 1.1, stagger: .06 });
  if (k.reduced()) return t;
  const mag = q('.rg-mag'), field = q('.rg-field'), smp = qa('.fe-s, .nf-s'), xs = smp.map(s => { const b = s.getBBox(); return b.x + b.width / 2; });
  const dx = xs[n - 1] - xs[0], run = 4.4;
  const L = gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: .5 });
  L.to(field, { opacity: 1, duration: .4 }, 0).to(mag, { x: dx, duration: run, ease: 'none' }, .3);
  if (jump) xs.forEach((x, i) => { const at = .3 + (x - xs[0]) / dx * run; L.to(smp[i], { y: -26, duration: .4, ease: 'power2.out' }, Math.max(.05, at - .25)).to(smp[i], { y: 0, duration: .75, ease: 'bounce.out' }, at + .45); });
  L.to(field, { opacity: 0, duration: .4 }, run + .4).to(mag, { x: 0, duration: 1.7, ease: 'power2.inOut' }, run + .7);
  return t;
}
const NF = [['Al', 'ALUMINIUM', '#C8CFD6', '#E3E7EB', '#A9B2BB'], ['Cu', 'COPPER', '#C77B4A', '#E0A57F', '#A5603A'], ['Pb', 'LEAD', '#8E98A2', '#B5BCC3', '#76808A'],
  ['Ag', 'SILVER', '#DADFE4', '#F0F2F4', '#BCC4CB'], ['Sn', 'TIN', '#BEC2BB', '#DADDD7', '#A2A7A0'], ['Zn', 'ZINC', '#A6B5C2', '#C9D3DC', '#8B9AA8']];
function nonferrousDraw(k) {
  const { INK, W } = k;
  const ing = (cx, [sym, nm, c, ct, cs]) => {
    const front = [[cx - 36, 470], [cx - 28, 404], [cx + 28, 404], [cx + 36, 470]], topF = [[cx - 28, 404], [cx + 28, 404], [cx + 38, 394], [cx - 18, 394]], side = [[cx + 28, 404], [cx + 38, 394], [cx + 46, 460], [cx + 36, 470]];
    return `<g class="nf-s">${solid(k, side, cs)}${solid(k, topF, ct)}${solid(k, front, c)}${k.text(cx, 448, sym, { size: 27, family: 'stencil', weight: 800, fill: INK.graphite })}</g><g class="nf-lab">${k.text(cx, 500, nm, { size: 14, weight: 700, spacing: .8 })}</g>`;
  };
  return `${rigDraw(k, 'nonferrous', 80)}${NF.map((m, i) => ing(80 + i * 86, m)).join('')}`;
}

/* ======================================================================================================
   polymers — thermosetting vs thermoplastic. In each detail circle the molecules: a net of chains tied by
   cross-links (gold) · loose chains with nothing tying them. Below, the same strip of each (Bakelite · PVC) held in
   a clamp over heat: the thermoplastic chains slide and its strip droops; the cross-linked net holds and its strip
   stays straight. (The slides name the two families; the heat test is background, as in standard texts.)
   ====================================================================================================== */
const PO = { cx: [165, 435], cy: 214, R: 102 };
function zigzag(pts) { // a smooth line drawn as a chain: alternate offsets across it
  const out = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, o = i % 2 ? 3.6 : -3.6; return [p[0] - dy / L * o, p[1] + dx / L * o]; });
  return D(out);
}
function polymersDraw(k) {
  const { INK, W } = k; const { cx, cy, R } = PO;
  const chainStroke = `fill="none" stroke="${INK.graphite}" stroke-width="${W.med}" stroke-linejoin="round" stroke-linecap="round"`;
  // thermosetting: chains in a net, tied by cross-links
  const c = cx[0], net = [], links = [], rn = seeded(41);
  const yAt = (j, x) => cy - 84 + j * 42 + 7 * Math.sin((x - c) / 24 + j * 1.7);
  for (let j = 0; j < 5; j++) { const pts = []; for (let x = c - 120; x <= c + 120; x += 8) pts.push([x, yAt(j, x)]); net.push(`<path d="${zigzag(pts)}" ${chainStroke}/>`); }
  for (let j = 0; j < 4; j++) for (let m = 0; m < 3; m++) { const x = c - 70 + m * 66 + (rn() - .5) * 30; links.push(`<g class="po-link"><line x1="${f1(x)}" y1="${f1(yAt(j, x))}" x2="${f1(x)}" y2="${f1(yAt(j + 1, x))}" stroke="${INK.gold}" stroke-width="${W.thick}" stroke-linecap="round"/><circle cx="${f1(x)}" cy="${f1(yAt(j, x))}" r="3.6" fill="${INK.gold}"/><circle cx="${f1(x)}" cy="${f1(yAt(j + 1, x))}" r="3.6" fill="${INK.gold}"/></g>`); }
  // thermoplastic: long loose chains, nothing between them
  const c2 = cx[1], rp = seeded(7), loose = [];
  for (let n = 0; n < 6; n++) {
    let x = c2 - 110 + rp() * 40, y = cy - 80 + n * 32 + rp() * 12, a = (rp() - .5) * .9; const pts = [[x, y]];
    for (let s = 0; s < 30; s++) { a += (rp() - .5) * .75; a = Math.max(-1.1, Math.min(1.1, a)); x += 8 * Math.cos(a); y += 8 * Math.sin(a); pts.push([x, y]); }
    loose.push(`<g class="po-ch"><path d="${zigzag(pts)}" ${chainStroke}/></g>`);
  }
  const strip = (x, id) => `<g class="po-test">
      ${sec(k, box(x - 112, 380, 34, 30), 'steel')}${sec(k, box(x - 112, 428, 34, 30), 'steel', { flip: true })}
      <path class="h" d="${DZ(box(x - 112, 410, 34, 18))}" fill="${k.hatch('plastic')}"/>${thinPath(k, `M${x - 78} 410H${x - 112}V428H${x - 78}`, 'o', W.thick)}
      <g class="po-strip"><path class="h" d="${DZ(box(x - 78, 410, 182, 18))}" fill="${k.hatch('plastic')}"/>${thinPath(k, `M${x - 78} 410H${x + 104}V428H${x - 78}`, 'o', W.thick)}</g>
      <g class="po-heat" opacity="0">${[-28, 8, 44].map(dx => `<path d="M${x + dx} 486q-6 -6 0 -12t0 -12t0 -12" fill="none" stroke="${INK.hot}" stroke-width="${W.med}" stroke-linecap="round"/>`).join('')}</g></g>`;
  const panel = (i, head, ex, body) => `
    ${k.text(cx[i], 62, head, { size: 19, weight: 700, spacing: 1.3 })}${k.text(cx[i], 86, ex, { size: 16, weight: 500, family: 'text', fill: INK.graphite2 })}
    <clipPath id="polymers-c${i}"><circle cx="${cx[i]}" cy="${cy}" r="${R}"/></clipPath>
    <g clip-path="url(#polymers-c${i})"><rect x="${cx[i] - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="#fff"/>${body}</g>
    <circle class="po-ring" cx="${cx[i]}" cy="${cy}" r="${R}" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>`;
  return `<line x1="300" y1="44" x2="300" y2="520" stroke="${INK.graphite3}" stroke-width="${W.hair}" stroke-dasharray="2 5"/>
    ${panel(0, 'THERMOSETTING', 'Bakelite', `<g class="po-net">${net.join('')}${links.join('')}</g>`)}
    ${panel(1, 'THERMOPLASTIC', 'PVC', loose.join(''))}
    ${strip(cx[0])}${strip(cx[1])}`;
}
function polymersPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.po-ring'), { dur: .7, stagger: .15 });
  k.plot(t, qa('.po-net path, .po-ch path'), { at: .2, stagger: .05, dur: .9 });
  k.stamp(t, qa('.po-link'), { at: 1, stagger: .03 });
  k.plot(t, qa('.po-test .o'), { at: .6, stagger: .05, dur: .5 });
  k.ink(t, qa('.po-test .h'), { at: 1, stagger: .05 });
  t.from(qa('svg > text, text'), { opacity: 0, duration: .5, stagger: .05 }, .1);
  if (k.reduced()) return t;
  const heat = qa('.po-heat'), strips = qa('.po-strip'), ch = qa('.po-ch'), rr = seeded(3), drift = ch.map(() => [6 + rr() * 10, (rr() - .5) * 12, (rr() - .5) * 8]);
  const piv = `${PO.cx[1] - 78} 419`;
  const L = gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: .6 });
  L.to(heat, { opacity: 1, duration: .5 }, 0).fromTo(heat, { y: 0 }, { y: -8, duration: .6, repeat: 3, yoyo: true, ease: 'sine.inOut', immediateRender: false }, 0)
    // heat: the loose chains slide past each other and the PVC strip droops; the net holds
    .to(ch, { x: i => drift[i][0], y: i => drift[i][1], rotation: i => drift[i][2], transformOrigin: '50% 50%', duration: 1.6, ease: 'power1.inOut' }, .4)
    .to(strips[1], { rotation: 13, svgOrigin: piv, duration: 1.6, ease: 'power2.inOut' }, .5)
    .to(qa('.po-link line'), { opacity: .45, duration: .3, yoyo: true, repeat: 3 }, .5)
    .to(heat, { opacity: 0, duration: .5 }, 2.4)
    .to(strips[1], { opacity: 0, duration: .4 }, 3.4).set(strips[1], { rotation: 0, svgOrigin: piv }, 3.82).to(strips[1], { opacity: 1, duration: .4 }, 3.86)
    .to(ch, { x: 0, y: 0, rotation: 0, duration: 1.2, ease: 'power2.inOut' }, 3.4);
  return t;
}

/* ======================================================================================================
   ceramics — the slide's five: a refractory firebrick facing a flame (it holds), an abrasive wheel grinding (grit
   in stipple, sparks), a glass pane letting a light ray through (glass hatch), cement as a heap of powder, concrete
   as a column carrying a load (concrete hatch: stones in stipple). Each does its job in turn.
   ====================================================================================================== */
function ceramicsDraw(k) {
  const { INK, W } = k;
  const conc = `<pattern id="ceramics-conc" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="4" cy="6" r="1" fill="${INK.graphite}"/><circle cx="20" cy="4" r=".8" fill="${INK.graphite}"/><circle cx="13" cy="17" r="1" fill="${INK.graphite}"/><circle cx="26" cy="23" r=".8" fill="${INK.graphite}"/><circle cx="6" cy="26" r=".9" fill="${INK.graphite}"/><path d="M8 11l6 -2l-2 6z" fill="none" stroke="${INK.graphite}" stroke-width=".9"/><path d="M19 24l7 1l-4 4z" fill="none" stroke="${INK.graphite}" stroke-width=".9"/></pattern>`;
  const lab = (x, y, s) => `<g class="ce-lab">${k.text(x, y, s, { size: 16, weight: 700, spacing: 1.2 })}<rect class="ce-ul" x="${f1(x - s.length * 5)}" y="${y + 7}" width="${f1(s.length * 10)}" height="4" fill="${INK.gold}" opacity="0"/></g>`;
  const sparks = [160, 172, 184, 196, 208].map((a, i) => { const r = [30, 42, 26, 36, 22][i]; return `<line x1="298" y1="252" x2="${f1(298 + Math.cos(a * RAD) * r)}" y2="${f1(252 + Math.sin(a * RAD) * r)}" stroke="${INK.hot}" stroke-width="2.2" stroke-linecap="round"/>`; }).join('');
  const ray = 'M402 160L470 182L492 188L558 210';
  return `<defs>${conc}</defs>
    <g class="ce-cell">
      <g class="ce-flame"><path d="M40 196C54 174 82 184 98 196C82 208 54 218 40 196Z" fill="${INK.hot}" fill-opacity=".28" stroke="${INK.hot}" stroke-width="${W.med}"/><path d="M52 196C62 186 78 190 88 196C78 202 62 206 52 196Z" fill="${INK.hot}"/></g>
      <rect class="ce-glow" x="98" y="150" width="12" height="94" fill="${INK.hot}" opacity="0"/>
      ${sec(k, box(98, 150, 96, 45), 'refractory')}${sec(k, box(98, 199, 96, 45), 'refractory', { flip: true })}
      ${lab(120, 300, 'REFRACTORIES')}</g>
    <g class="ce-cell">
      ${sec(k, box(268, 254, 96, 20), 'steel')}
      <g class="ce-sp" opacity="0">${sparks}</g>
      <g class="ce-wheel"><circle cx="300" cy="196" r="58" fill="#fff"/><circle class="h" cx="300" cy="196" r="58" fill="${k.hatch('stipple')}"/><circle class="o" cx="300" cy="196" r="58" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
        <circle cx="300" cy="196" r="20" fill="${INK.steel2}" stroke="${INK.graphite}" stroke-width="${W.med}"/><circle cx="300" cy="196" r="6" fill="${INK.graphite}"/>${k.center(266, 196, 334, 196)}${k.center(300, 162, 300, 230)}</g>
      ${lab(300, 300, 'ABRASIVES')}</g>
    <g class="ce-cell">
      ${k.center(444, 182, 470, 182)}${k.center(492, 188, 518, 188)}
      <path class="ce-ray" d="${ray}" fill="none" stroke="${INK.gold}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
      <path class="ce-rayp" d="${ray}" fill="none" stroke="${INK.gold}" stroke-width="7" stroke-linecap="round" opacity="0"/>
      ${sec(k, box(470, 128, 22, 148), 'glass')}
      ${lab(480, 300, 'GLASS')}</g>
    <g class="ce-cell">
      <line class="ce-pour" x1="180" y1="330" x2="180" y2="402" stroke="${INK.graphite2}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" opacity="0"/>
      <path class="h" d="M96 488C130 470 150 404 180 400C210 404 230 470 264 488Z" fill="${INK.steel2}"/><path class="h" d="M96 488C130 470 150 404 180 400C210 404 230 470 264 488Z" fill="${k.hatch('stipple')}"/>
      <path class="o" d="M96 488C130 470 150 404 180 400C210 404 230 470 264 488" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>
      ${lab(180, 526, 'CEMENT')}</g>
    <g class="ce-cell">
      <g class="ce-load"><g class="fx">${k.arrow(420, 318, 420, 368)}</g>${solid(k, box(382, 370, 76, 9), INK.steel)}</g>
      ${sec(k, box(390, 379, 60, 109), 'stipple', { tint: '#fff' }).replace(k.hatch('stipple'), 'url(#ceramics-conc)')}
      ${lab(420, 526, 'CONCRETE')}</g>
    <line class="o" x1="60" y1="488" x2="540" y2="488" stroke="${INK.graphite}" stroke-width="${W.thick}" stroke-linecap="round"/><rect class="h" x="60" y="488" width="480" height="8" fill="${k.hatch('iron')}"/>`;
}
function ceramicsPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.plot(t, qa('.o'), { stagger: .04, dur: .6 });
  k.ink(t, qa('.h'), { at: .45, stagger: .03 });
  k.ink(t, qa(`.ce-flame, .fx, .ce-wheel > circle:not(.o), .ce-ray, ${CL}`), { at: .7 });
  k.stamp(t, qa('.ce-lab'), { at: 1, stagger: .08 });
  if (k.reduced()) return t;
  const cells = qa('.ce-cell'), uls = qa('.ce-ul'), rayp = q('.ce-rayp'), pour = q('.ce-pour');
  const Lr = Math.ceil(rayp.getTotalLength()) + 2; gsap.set(rayp, { strokeDasharray: `34 ${Lr + 40}`, strokeDashoffset: 34, opacity: 1 });
  gsap.set(uls, { transformOrigin: '50% 50%' }); // set once, before any scale: changing it mid-transform leaves an offset
  const L = gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: .4 });
  const on = (i, at, d) => L.fromTo(uls[i], { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: .3, immediateRender: false }, at).to(uls[i], { opacity: 0, duration: .35 }, at + d);
  // refractories: the flame flares, the brick face glows — and holds
  on(0, 0, 1.7);
  L.to(q('.ce-flame'), { scaleX: 1.25, scaleY: 1.12, svgOrigin: '40 196', duration: .35, repeat: 3, yoyo: true, ease: 'sine.inOut' }, .1)
    .to(q('.ce-glow'), { opacity: .45, duration: .5 }, .2).to(q('.ce-glow'), { opacity: 0, duration: .6 }, 1.2);
  // abrasives: the wheel spins and grinds
  on(1, 1.8, 1.9);
  L.to(q('.ce-wheel'), { rotation: 720, svgOrigin: '300 196', duration: 1.9, ease: 'power1.inOut' }, 1.8)
    .to(q('.ce-sp'), { opacity: 1, duration: .25 }, 2.1).to(q('.ce-sp'), { opacity: .35, duration: .3, repeat: 2, yoyo: true }, 2.35).to(q('.ce-sp'), { opacity: 0, duration: .25 }, 3.4);
  // glass: light passes through
  on(2, 3.8, 1.4);
  L.fromTo(rayp, { strokeDashoffset: 34 }, { strokeDashoffset: -Lr, duration: 1.3, ease: 'none', immediateRender: false }, 3.9);
  // cement: a powder, poured
  on(3, 5.3, 1.4);
  L.to(pour, { opacity: 1, duration: .25 }, 5.35).fromTo(pour, { strokeDashoffset: 0 }, { strokeDashoffset: -36, duration: 1, ease: 'none', immediateRender: false }, 5.35).to(pour, { opacity: 0, duration: .25 }, 6.3);
  // concrete: it carries the load
  on(4, 6.8, 1.4);
  L.to(q('.ce-load'), { y: 6, duration: .45, ease: 'power2.in' }, 6.9).to(q('.ce-load'), { y: 0, duration: .6, ease: 'power2.out' }, 7.5);
  return t;
}

/* ======================================================================================================
   elastomers — a rubber band on two pins, seen from above, with its section A–A (rubber hatch). The right pin
   is pulled along its slot: the band stretches to twice its length and thins (the section shrinks); let go, it
   comes back to L0.
   ====================================================================================================== */
function elastomersDraw(k) {
  const { INK, W } = k; const R = INK.rubber;
  const peg = x => `<g class="el-peg"><circle class="h" cx="${x}" cy="250" r="18" fill="${k.hatch('steel')}"/><circle class="o" cx="${x}" cy="250" r="18" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/>${k.center(x - 26, 250, x + 26, 250)}${k.center(x, 224, x, 276)}</g>`;
  const l0 = 'L<tspan font-size="11" dy="4">0</tspan>';
  return `<g transform="matrix(1.2 0 0 1.2 -100 -96)">
    <path class="el-slot" d="M330 230H514A20 20 0 0 1 514 270H330A20 20 0 0 1 330 230Z" fill="none" stroke="${INK.blue}" stroke-width="${W.thin}" stroke-dasharray="8 5" opacity=".8"/>
    <g class="el-band">
      <path d="M150 218A32 32 0 0 0 150 282L150 268A18 18 0 0 1 150 232Z" fill="${R}"/>
      <rect class="el-ts" x="149.5" y="218" width="181" height="14" fill="${R}"/><rect class="el-bs" x="149.5" y="268" width="181" height="14" fill="${R}"/>
    </g>
    ${peg(150)}
    <g class="el-rg"><path d="M330 218A32 32 0 0 1 330 282L330 268A18 18 0 0 0 330 232Z" fill="${R}"/>${peg(330)}<g class="el-pull">${k.arrow(372, 250, 428, 250)}</g></g>
    <g class="el-d0">${k.dim(150, 250, 330, 250, l0, { off: -76 })}</g>
    <g class="el-dl" opacity="0">${k.dim(150, 250, 510, 250, 'L', { off: 64, color: INK.red })}</g>
    <g class="el-sec">${k.section(240, 204, 240, 244, 'A')}</g>
    <g class="el-sv"><rect x="258" y="404" width="84" height="34" rx="7" fill="${k.hatch('plastic')}"/><rect x="258" y="404" width="84" height="34" rx="7" fill="none" stroke="${INK.graphite}" stroke-width="${W.thick}"/></g>
    <g class="el-svl">${k.text(300, 474, 'A–A', { size: 18, weight: 700, spacing: 1.5 })}</g></g>`;
}
function elastomersPlay(svg, k) {
  const { gsap } = k; const [q, qa] = sel(svg);
  const t = k.tl();
  k.ink(t, q('.el-slot'), { dur: .6 });
  t.from(q('.el-band'), { opacity: 0, duration: .6 }, .1).from(q('.el-rg path'), { opacity: 0, duration: .6 }, .1);
  k.plot(t, qa('.el-peg .o'), { at: .2, stagger: .1, dur: .5 });
  k.ink(t, qa(`.el-peg .h, ${CL}, .el-pull`), { at: .55 });
  k.plot(t, qa('.el-d0 line'), { at: .8, stagger: .05, dur: .4 });
  k.ink(t, qa('.el-d0 text, .el-sec, .el-svl'), { at: 1, stagger: .1 });
  t.from(q('.el-sv'), { opacity: 0, scale: .6, transformOrigin: '50% 50%', duration: .5, ease: 'back.out(2)' }, 1.1);
  if (k.reduced()) return t;
  const E = 'power2.inOut', back = 'elastic.out(1, .42)';
  const L = gsap.timeline({ repeat: -1, delay: 2.2, repeatDelay: 1.1 });
  L.to(q('.el-rg'), { x: 180, duration: 1.3, ease: E }, 0)
    .to(q('.el-ts'), { scaleX: 2, scaleY: .7, svgOrigin: '150 225', duration: 1.3, ease: E }, 0)
    .to(q('.el-bs'), { scaleX: 2, scaleY: .7, svgOrigin: '150 275', duration: 1.3, ease: E }, 0)
    .to(q('.el-sv'), { scale: .74, svgOrigin: '300 421', duration: 1.3, ease: E }, 0)
    .to(q('.el-dl'), { opacity: 1, duration: .35 }, 1.1)
    // let go
    .to(q('.el-pull'), { opacity: 0, duration: .25 }, 1.9)
    .to(q('.el-rg'), { x: 0, duration: 1.2, ease: back }, 2)
    .to(q('.el-ts'), { scaleX: 1, scaleY: 1, svgOrigin: '150 225', duration: 1.2, ease: back }, 2)
    .to(q('.el-bs'), { scaleX: 1, scaleY: 1, svgOrigin: '150 275', duration: 1.2, ease: back }, 2)
    .to(q('.el-sv'), { scale: 1, svgOrigin: '300 421', duration: 1.2, ease: back }, 2)
    .to(q('.el-dl'), { opacity: 0, duration: .3 }, 2)
    .to(q('.el-pull'), { opacity: 1, duration: .3 }, 3.3);
  return t;
}

export default {
  materialsTree: { draw: materialsTreeDraw, play: materialsTreePlay },
  classTree: { draw: classTreeDraw, play: classTreePlay },
  metalsChart: { draw: metalsChartDraw, play: metalsChartPlay },
  atoms: { draw: k => latticeDraw(k, 'atoms', false), play: (svg, k) => latticePlay(svg, k, false) },
  alloy: { draw: k => latticeDraw(k, 'alloy', true), play: (svg, k) => latticePlay(svg, k, true) },
  ferrous: { draw: ferrousDraw, play: (svg, k) => rigPlay(svg, k, 4, true) },
  nonferrous: { draw: nonferrousDraw, play: (svg, k) => rigPlay(svg, k, 6, false) },
  polymers: { draw: polymersDraw, play: polymersPlay },
  ceramics: { draw: ceramicsDraw, play: ceramicsPlay },
  elastomers: { draw: elastomersDraw, play: elastomersPlay }
};
