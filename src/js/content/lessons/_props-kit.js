// Props zone kit — the drawings and the three demos, shared by props.js (Arabic) and props.en.js (English), the trials
// (games/_props-kit.js) and the question figures (data/figs/props.js). Drawing helpers come from the strength kit.
// Drawings carry English exam labels only. Colours: CSS variables only. Demos take their words from the lesson (S).
import { V, f1, poly, svg, lab, arrow, arcArrow, hatchRect, reduced } from './_strength-kit.js';
export { V, svg, lab, arrow, arcArrow, hatchRect };

const steel = (o = .26) => `fill="var(--fig-steel)" fill-opacity="${o}" stroke="${V.ink}" stroke-width="2"`;
const hotFill = (o = .45) => `fill="${V.hot}" fill-opacity="${o}" stroke="${V.ink}" stroke-width="1.8"`;
/** a zigzag spring between yTop and yBot */
export function spring(x, yTop, yBot, w = 30, n = 6) {
  const pts = [[x, yTop]], step = (yBot - yTop) / (n * 2 + 2);
  pts.push([x, yTop + step]);
  for (let i = 0; i < n * 2; i++) pts.push([x + (i % 2 ? -w / 2 : w / 2), yTop + step * (i + 1.5)]);
  pts.push([x, yBot - step], [x, yBot]);
  return `<path d="${poly(pts)}" stroke="${V.ink}" stroke-width="2.4"/>`;
}

/* ---------- lesson art ---------- */
export const hardnessArt = () => svg('0 0 560 226',
  `<path d="M40 130H150L170 148L190 130H520V190H40Z" ${steel(.22)}/>` + hatchRect(40, 152, 480, 38, 10) +
  `<rect x="150" y="12" width="40" height="28" ${steel(.4)}/><path d="M150 40H190L170 146Z" fill="${V.zc}" fill-opacity=".35" stroke="${V.ink}" stroke-width="2"/>` +
  arrow(216, 22, 216, 92) +
  `<path d="M292 133H398" stroke="${V.ink}" stroke-width="1.4"/><path d="M292 137H398" stroke="${V.ink3}" stroke-width="1.2"/>` +
  `<path d="M436 34L402 126" stroke="${V.ink}" stroke-width="7"/><path d="M402 126l-4 6 8-1z" fill="${V.ink}"/>` +
  arrow(420, 96, 486, 96) +
  lab(170, 214, 'PENETRATION', { c: V.zt, size: 15 }) + lab(370, 214, 'SCRATCHING', { c: V.zt, size: 15 }),
  'An indenter pressing into a surface and a hard tip scratching it: hardness resists both');
/** pulled: a ductile bar becomes a fine wire */
export const ductileArt = () => svg('0 0 260 196',
  `<rect x="80" y="26" width="100" height="22" ${steel(.3)}/>` + arrow(78, 37, 30, 37, { w: 2.4 }) + arrow(182, 37, 230, 37, { w: 2.4 }) +
  arrow(130, 62, 130, 98, { c: V.ink3, w: 1.4, h: 8 }) +
  `<path d="M14 132H210" stroke="${V.ink}" stroke-width="2.2"/><path d="M210 132c14 0 22 8 22 18s-10 16-20 16-18-8-18-16 8-14 18-14 26 6 26 22" stroke="${V.ink}" stroke-width="2"/>` +
  lab(130, 186, 'FINE WIRE · no fracture', { c: V.zt, size: 14 }) + lab(130, 18, 'TENSILE LOAD', { c: V.hot, size: 12 }),
  'A ductile bar under a tensile load is drawn into a fine wire without breaking');
/** pulled: cast iron snaps with no stretch */
export const brittleArt = () => svg('0 0 260 196',
  `<rect x="80" y="26" width="100" height="22" ${steel(.3)}/>` + arrow(78, 37, 30, 37, { w: 2.4 }) + arrow(182, 37, 230, 37, { w: 2.4 }) +
  arrow(130, 62, 130, 98, { c: V.ink3, w: 1.4, h: 8 }) +
  `<path d="M64 120H126L120 126L128 132L121 138L126 142H64Z" ${steel(.3)}/><path d="M196 120H138L132 126L139 132L133 138L138 142H196Z" ${steel(.3)}/>` +
  `<path d="M126 156l6 8-9 2zM140 154l7 5-6 6zM116 160l-5 9 8-1z" fill="var(--fig-steel)" fill-opacity=".5" stroke="${V.ink}" stroke-width="1.2"/>` +
  lab(130, 186, 'CAST IRON · snaps, no stretch', { c: V.zt, size: 14 }) + lab(130, 18, 'TENSILE LOAD', { c: V.hot, size: 12 }),
  'A cast iron bar under the same load snaps in two with no stretch');
/** a beam bent under a load: outside fibers stretched, inside fibers squeezed */
export const beamArt = () => svg('0 0 560 236',
  `<path d="M60 108Q280 168 500 108L500 134Q280 194 60 134Z" ${steel(.24)}/>` +
  `<path d="M60 121Q280 181 500 121" stroke="${V.ink3}" stroke-width="1.2" stroke-dasharray="8 5"/>` +
  `<path d="M70 135l-14 24h28zM490 135l-14 24h28z" ${steel(.4)}/><path d="M40 160H110M450 160H520" stroke="${V.ink}" stroke-width="2"/>` +
  arrow(280, 52, 280, 132) +
  arrow(248, 166, 206, 160, { c: V.hot, w: 2.2, h: 8 }) + arrow(312, 166, 354, 160, { c: V.hot, w: 2.2, h: 8 }) +
  arrow(196, 126, 236, 134, { c: V.zc, w: 2.2, h: 8 }) + arrow(364, 126, 324, 134, { c: V.zc, w: 2.2, h: 8 }) +
  lab(150, 88, 'INSIDE · COMPRESSION', { c: V.zt, size: 15 }) + `<path d="M150 94L206 124" stroke="${V.zt}" stroke-width="1"/>` +
  lab(280, 222, 'OUTSIDE · TENSION', { c: V.hot, size: 15 }) + lab(300, 44, 'load', { a: 'start', size: 13, c: V.ink3, w: 500 }),
  'A beam bent by a load: the outside fibers are stretched (tension), the inside fibers are squeezed (compression)');
/** a hammer blow: the tough plate dents but does not break */
export const toughArt = () => svg('0 0 560 214',
  `<path d="M150 150H262Q280 160 298 150H410V172H150Z" ${steel(.26)}/><path d="M170 172h30v24h-30zM360 172h30v24h-30z" ${steel(.36)}/><path d="M130 196H430" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(130, 196, 300, 10, 9) +
  `<rect x="242" y="86" width="76" height="44" rx="4" ${steel(.42)}/><rect x="314" y="100" width="170" height="16" rx="5" fill="${V.zc}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>` +
  `<path d="M232 142l-14-6M330 142l14-6M244 134l-10-12M316 134l10-12" stroke="${V.hot}" stroke-width="2"/>` + arrow(280, 40, 280, 80) +
  lab(280, 30, 'IMPACT LOAD · hammer blow', { c: V.hot, size: 14 }) + lab(500, 160, 'dents', { a: 'end', size: 14, c: V.zt }) + lab(500, 176, 'no fracture', { a: 'end', size: 14, c: V.zt }),
  'A hammer blow on a tough plate: it dents but does not fracture');
/** rolled between two rolls, or hammered: a slab becomes a sheet */
export const malleableArt = () => svg('0 0 560 222',
  `<rect x="24" y="88" width="104" height="44" ${steel(.3)}/><rect x="196" y="104" width="120" height="12" ${steel(.3)}/>` +
  `<circle cx="162" cy="62" r="40" ${steel(.2)}/><circle cx="162" cy="158" r="40" ${steel(.2)}/><circle cx="162" cy="62" r="4" fill="${V.ink}"/><circle cx="162" cy="158" r="4" fill="${V.ink}"/>` +
  arcArrow(162, 62, 28, 28, 120, 30, { c: V.zc, w: 2 }) + arcArrow(162, 158, 28, 28, 240, 330, { c: V.zc, w: 2 }) + arrow(332, 110, 356, 110, { c: V.ink3, w: 1.6, h: 8 }) +
  `<rect x="388" y="158" width="150" height="10" ${steel(.3)}/><path d="M372 168H550" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(372, 168, 178, 26, 9) +
  `<rect x="436" y="86" width="56" height="40" rx="4" ${steel(.42)}/><rect x="488" y="99" width="64" height="14" rx="4" fill="${V.zc}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>` + arrow(464, 132, 464, 152) +
  lab(162, 214, 'ROLLED', { c: V.zt, size: 15 }) + lab(462, 214, 'HAMMERED', { c: V.zt, size: 15 }) + lab(256, 92, 'sheet', { size: 13, c: V.ink3, w: 500 }),
  'A slab rolled between two rolls, and a plate hammered on an anvil: both become sheet');
/** molten metal poured from a ladle into a mould */
export const castArt = () => svg('0 0 560 230',
  `<path d="M84 26L176 26L168 92L94 92Z" ${steel(.36)}/><path d="M92 44H170" stroke="${V.hot}" stroke-width="3"/><path d="M176 30q22 4 30 20" stroke="${V.ink}" stroke-width="2"/>` +
  `<path d="M206 50Q232 66 262 100" stroke="${V.hot}" stroke-width="7"/>` +
  `<rect x="230" y="100" width="260" height="104" ${steel(.18)}/>` + hatchRect(230, 100, 260, 104, 10) +
  `<path d="M254 100h16v26h70v22h40v-34h50v58h-140v-18h-36z" ${hotFill(.55)}/>` +
  lab(130, 118, 'MOLTEN METAL', { c: V.hot, size: 14 }) + lab(360, 222, 'MOULD · different shapes', { c: V.zt, size: 14 }),
  'Molten metal poured from a ladle fills the cavity of a mould');
/** a weight lands on a spring: it absorbs the energy and springs back */
export const resilienceArt = () => {
  const base = x => `<path d="M${x - 40} 178H${x + 40}" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(x - 40, 178, 80, 9, 8);
  return svg('0 0 560 226',
    base(100) + spring(100, 104, 178) + `<rect x="74" y="44" width="52" height="34" ${steel(.42)}/>` + arrow(100, 82, 100, 100, { w: 2.2, h: 8 }) +
    base(280) + spring(280, 132, 178, 34, 6) + `<rect x="254" y="98" width="52" height="34" ${steel(.42)}/><path d="M240 112l-12-4M320 112l12-4" stroke="${V.hot}" stroke-width="2"/>` +
    base(460) + spring(460, 104, 178) + `<rect x="434" y="40" width="52" height="34" ${steel(.42)}/>` + arrow(460, 98, 460, 80, { c: V.zc, w: 2.2, h: 8 }) +
    lab(100, 30, 'shock', { size: 14, c: V.hot }) + lab(280, 82, 'absorbs energy', { size: 14, c: V.zt }) + lab(460, 30, 'springs back', { size: 14, c: V.zt }) +
    lab(280, 214, 'within the elastic limit', { size: 13, c: V.ink3, w: 500 }),
    'A weight hits a spring; the spring absorbs the energy and springs back to its shape');
};
/** a cutting tool on a turning bar, chips curling off */
export const machineArt = () => svg('0 0 260 176',
  `<rect x="8" y="48" width="26" height="64" ${steel(.42)}/><rect x="34" y="62" width="186" height="36" rx="3" ${steel(.24)}/>` +
  arcArrow(220, 80, 10, 28, 300, 60, { c: V.zc, w: 2 }) +
  `<path d="M140 132L158 98L176 132Z" fill="${V.zc}" fill-opacity=".35" stroke="${V.ink}" stroke-width="2"/><rect x="138" y="132" width="40" height="30" ${steel(.4)}/>` +
  `<path d="M164 98c8-6 18-4 20 4s-6 12-12 10-6-10 2-12 16 2 18 12" stroke="${V.hot}" stroke-width="1.8"/>` +
  lab(80, 150, 'CUTTING TOOL', { c: V.zt, size: 13 }) + `<path d="M118 146L140 140" stroke="${V.zt}" stroke-width="1"/>`,
  'A cutting tool shaping a turning bar, with chips curling off');
/** two plates joined by a weld bead */
export const weldArt = () => svg('0 0 260 176',
  `<rect x="14" y="112" width="112" height="22" ${steel(.28)}/><rect x="134" y="112" width="112" height="22" ${steel(.28)}/>` +
  `<path d="M112 112Q130 92 148 112Z" fill="${V.zc}" fill-opacity=".5" stroke="${V.ink}" stroke-width="2"/>` +
  `<path d="M178 18L142 82" stroke="${V.ink}" stroke-width="9"/><path d="M142 82l-6 10" stroke="${V.ink}" stroke-width="4"/>` +
  `<path d="M134 94q-4 6 0 12M126 92l-10-6M148 92l12-4M124 102l-12 2" stroke="${V.hot}" stroke-width="2"/>` +
  lab(130, 160, 'WELD', { c: V.zt, size: 14 }),
  'Two plates joined by a weld bead under a welding torch');
/** physical properties as small icons (currentColor) */
const I = inner => svg('0 0 48 48', inner);
export const PHYS_ICON = {
  opacity: I('<rect x="21" y="8" width="6" height="32" stroke="currentColor" stroke-width="1.8"/><path d="M4 16h15M4 24h15M4 32h15" stroke="currentColor" stroke-width="1.6"/><path d="M29 16h15M29 24h15M29 32h15" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 3"/>'),
  color: I('<path d="M4 40H44" stroke="currentColor" stroke-width="2"/><path d="M6 10q3-4 6 0t6 0 6 0l2 4" stroke="currentColor" stroke-width="1.6"/><path d="M24 38L14 14M24 38l10-24" stroke="currentColor" stroke-width="1.6"/><path d="M30 12l4 2 1-4" stroke="currentColor" stroke-width="1.6"/>'),
  density: I('<path d="M10 18l14-8 14 8v16l-14 8-14-8z" stroke="currentColor" stroke-width="1.8"/><path d="M10 18l14 8 14-8M24 26v16" stroke="currentColor" stroke-width="1.6"/>'),
  electric: I('<rect x="4" y="19" width="40" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M26 6l-8 14h7l-5 22 12-18h-8l6-18z" fill="currentColor" stroke="none"/>'),
  thermal: I('<rect x="14" y="19" width="30" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 36c-4-4-2-8 0-10 0 3 2 4 3 4 0-4 2-7 4-8 0 4 3 6 3 9 0 4-3 6-6 6s-4 0-4-1z" stroke="currentColor" stroke-width="1.6"/><path d="M20 12q2-3 0-6M28 12q2-3 0-6M36 12q2-3 0-6" stroke="currentColor" stroke-width="1.6"/>'),
  expansion: I('<rect x="8" y="20" width="22" height="8" stroke="currentColor" stroke-width="1.8"/><path d="M30 24h10M36 20l4 4-4 4" stroke="currentColor" stroke-width="1.8"/>'),
  magnet: I('<path d="M12 8v18a12 12 0 0 0 24 0V8h-8v18a4 4 0 0 1-8 0V8z" stroke="currentColor" stroke-width="1.8"/><path d="M12 14h8M28 14h8" stroke="currentColor" stroke-width="1.6"/>'),
  melting: I('<path d="M12 10h24v12q-2 6-6 6t-6 6-6-6-6-6z" stroke="currentColor" stroke-width="1.8"/><path d="M8 40c4-3 8-3 12 0s8 3 12 0 6-3 8 0" stroke="currentColor" stroke-width="1.8"/>'),
  corrosion: I('<rect x="6" y="22" width="36" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="29" r="2.4" fill="currentColor"/><circle cx="27" cy="27" r="1.6" fill="currentColor"/><circle cx="34" cy="31" r="2.6" fill="currentColor"/><path d="M14 16q2-4 0-8M24 16q2-4 0-8M34 16q2-4 0-8" stroke="currentColor" stroke-width="1.4"/>')
};
/** domains: scattered, then lined up */
export function domainsArt() {
  const cell = (x, y, a, c) => { const r = 15, dx = Math.cos(a) * r, dy = Math.sin(a) * r; return `<rect x="${x - 24}" y="${y - 22}" width="48" height="44" fill="${V.zc}" fill-opacity=".08" stroke="${V.ink3}" stroke-width="1"/>` + arrow(x - dx, y - dy, x + dx, y + dy, { c, w: 2.2, h: 8 }); };
  const rand = [2.1, 4.6, .4, 5.5, 1.3, 3.4, 2.8, 5.9, .9, 4.1, 1.8, 3.9];
  let a = '', b = '';
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { a += cell(52 + k * 48, 58 + r * 44, rand[r * 4 + k], V.ink2); b += cell(340 + k * 48, 58 + r * 44, 0, V.hot); }
  return svg('0 0 560 214', a + b + arrow(262, 102, 300, 102, { c: V.ink3, w: 1.6, h: 8 }) +
    lab(124, 26, 'domains scattered', { size: 14, c: V.ink2 }) + lab(412, 26, 'domains aligned', { size: 14, c: V.hot }) +
    lab(280, 204, 'iron · nickel · cobalt', { size: 15, c: V.zt }),
    'Small domains inside iron, nickel or cobalt: first pointing every way, then all lined up');
}
/** metal attacked by oxygen and chemicals; plastic degraded by sunlight and moisture */
export const rustArt = () => svg('0 0 260 170',
  `<rect x="20" y="90" width="220" height="30" rx="3" ${steel(.28)}/>` +
  [[48, 100, 6], [80, 108, 4], [118, 98, 7], [150, 110, 3.5], [186, 101, 5.5], [214, 109, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${V.hot}" fill-opacity=".55" stroke="none"/>`).join('') +
  `<path d="M60 70q4-10 0-20M120 70q4-10 0-20M180 70q4-10 0-20" stroke="${V.ink3}" stroke-width="1.6"/>` +
  lab(130, 40, 'oxygen · chemicals', { size: 13, c: V.ink2 }) + lab(130, 152, 'surface deterioration', { size: 13, c: V.zt }),
  'A metal bar with rust pits on its surface, attacked by oxygen and chemicals');
export const uvArt = () => svg('0 0 260 170',
  `<circle cx="210" cy="36" r="14" stroke="${V.hot}" stroke-width="2"/><path d="M210 12v-6M210 66v-6M186 36h-6M240 36h-6M193 19l-4-4M227 53l4 4M227 19l4-4" stroke="${V.hot}" stroke-width="2"/>` +
  `<path d="M190 52L150 84M200 60L170 96" stroke="${V.hot}" stroke-width="1.4" stroke-dasharray="5 4"/>` +
  `<path d="M60 70h70v12H60zM60 82l-6 54M130 82l6 54M60 70l-10-46h14l8 46" fill="${V.zc}" fill-opacity=".2" stroke="${V.ink}" stroke-width="2"/>` +
  `<path d="M70 76l6-4M90 78l5-5M108 76l6-4" stroke="${V.ink3}" stroke-width="1.2"/><path d="M30 140h200" stroke="${V.ink3}" stroke-width="1.4"/>` +
  lab(130, 160, 'plastics: UV light · moisture', { size: 13, c: V.zt }),
  'A plastic chair in the sun: ultraviolet light and moisture degrade plastics');

/* ---------- demos ---------- */
/** "Wire or sheet?": pull or roll a ductile, malleable metal, or cast iron. S = { aria, mats: {soft:[name,sub], cast:[name,sub]}, acts: {pull:[name,sub], roll:[name,sub]}, out: {soft_pull, soft_roll, cast_pull, cast_roll: [b, small]}, idle } */
export function wireSheet(S) {
  return (el, api) => {
    let mat = 'soft', act = null, raf = 0; const seen = new Set();
    el.innerHTML = `<div class="prp-ws"><div class="prp-ws__fig"></div><div class="prp-ws__side">
      <p class="label">${S.matLabel}</p><div class="prp-seg" role="radiogroup" aria-label="${S.matLabel}">${['soft', 'cast'].map(k => `<button type="button" role="radio" aria-checked="${k === mat}" data-m="${k}">${S.mats[k][0]}<small>${S.mats[k][1]}</small></button>`).join('')}</div>
      <p class="label">${S.actLabel}</p><div class="prp-seg" role="radiogroup" aria-label="${S.actLabel}">${['pull', 'roll'].map(k => `<button type="button" role="radio" aria-checked="false" data-a="${k}">${S.acts[k][0]}<small>${S.acts[k][1]}</small></button>`).join('')}</div>
      <p class="prp-read" aria-live="polite"><b>${S.idle}</b><small></small></p></div></div>`;
    const fig = el.querySelector('.prp-ws__fig'), read = el.querySelector('.prp-read');
    const draw = t => {
      const k = 1 - Math.pow(1 - t, 3); let g = '';
      if (!act) g = `<rect x="120" y="70" width="120" height="40" ${steel(.3)}/>`;
      else if (act === 'pull' && mat === 'soft') { const L = 120 + 200 * k, h = 40 - 34 * k; g = `<rect x="${f1(180 - L / 2)}" y="${f1(90 - h / 2)}" width="${f1(L)}" height="${f1(h)}" rx="${f1(h / 2)}" ${steel(.3)}/>` + arrow(180 - L / 2 - 4, 90, 180 - L / 2 - 30, 90, { w: 2.2 }) + arrow(180 + L / 2 + 4, 90, 180 + L / 2 + 30, 90, { w: 2.2 }) + (t >= 1 ? lab(180, 140, 'FINE WIRE', { size: 15, c: V.zt }) : ''); }
      else if (act === 'roll' && mat === 'soft') { const L = 120 + 170 * k, h = 40 - 30 * k; g = `<rect x="${f1(180 - L / 2)}" y="${f1(110 - h)}" width="${f1(L)}" height="${f1(h)}" ${steel(.3)}/><rect x="${f1(150 - 16)}" y="${f1(110 - h - 46)}" width="40" height="30" rx="4" ${steel(.42)}/>` + `<path d="M40 110H320" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(40, 110, 280, 14, 9) + (t >= 1 ? lab(180, 150, 'SHEET', { size: 15, c: V.zt }) : ''); }
      else if (act === 'pull') { const gap = 14 * k; g = `<path d="M${f1(120 - gap)} 70H${f1(178 - gap)}L${f1(172 - gap)} 80L${f1(180 - gap)} 90L${f1(173 - gap)} 100L${f1(178 - gap)} 110H${f1(120 - gap)}Z" ${steel(.3)}/><path d="M${f1(240 + gap)} 70H${f1(182 + gap)}L${f1(176 + gap)} 80L${f1(184 + gap)} 90L${f1(177 + gap)} 100L${f1(182 + gap)} 110H${f1(240 + gap)}Z" ${steel(.3)}/>` + arrow(116 - gap, 90, 84 - gap, 90, { w: 2.2 }) + arrow(244 + gap, 90, 276 + gap, 90, { w: 2.2 }) + (t >= 1 ? lab(180, 150, 'SNAPS · no stretch', { size: 15, c: V.hot }) : ''); }
      else { const d = 10 * k; g = `<path d="M120 70H176L170 82L178 92L171 110H120Z" ${steel(.3)} transform="translate(${f1(-d)} ${f1(d * .4)}) rotate(${f1(-4 * k)} 150 90)"/><path d="M240 70H184L178 84L186 96L180 110H240Z" ${steel(.3)} transform="translate(${f1(d)} ${f1(d * .4)}) rotate(${f1(4 * k)} 210 90)"/><rect x="156" y="${f1(22 + 8 * k)}" width="48" height="30" rx="4" ${steel(.42)}/>` + `<path d="M40 114H320" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(40, 114, 280, 14, 9) + (t >= 1 ? lab(180, 150, 'CRACKS', { size: 15, c: V.hot }) : ''); }
      fig.innerHTML = svg('0 0 360 160', g, S.aria);
    };
    const run = () => {
      if (!act) return;
      const key = mat + '_' + act, [b, s] = S.out[key];
      read.querySelector('b').innerHTML = b; read.querySelector('small').innerHTML = s;
      api.scene(mat === 'cast' ? 'brittle' : act === 'pull' ? 'ductile' : 'malleable'); api.sfx(mat === 'cast' ? 'bad' : 'swoosh');
      cancelAnimationFrame(raf);
      if (reduced()) draw(1); else { const t0 = performance.now(); const step = now => { const t = Math.min(1, (now - t0) / 800); draw(t); if (t < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
      seen.add(key); if (seen.size === 4) api.award(5, { from: read, key: 'demo:pr-wire' });
    };
    el.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { mat = b.dataset.m; el.querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-checked', String(x === b))); api.sfx('click'); if (act) run(); else draw(0); }));
    el.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => { act = b.dataset.a; el.querySelectorAll('[data-a]').forEach(x => x.setAttribute('aria-checked', String(x === b))); run(); }));
    draw(0);
    return () => cancelAnimationFrame(raf);
  };
}

/** "Change it": work-harden or heat-treat a bar; mechanical properties change, physical ones stay. S = { aria, mech:[…], phys:[…], mechT, physT, work:[b,small], heat:[b,small], changed, same, idle } */
export function changeIt(S) {
  return (el, api) => {
    const did = new Set(); let raf = 0;
    el.innerHTML = `<div class="prp-ch"><div class="prp-ch__fig"></div><div class="prp-ch__btns"><button type="button" class="btn btn--zone btn--sm" data-d="work">${S.work[0]}</button><button type="button" class="btn btn--zone btn--sm" data-d="heat">${S.heat[0]}</button></div>
      <div class="prp-ch__cols"><div class="prp-ch__col prp-ch__col--m"><p class="label">${S.mechT}</p><ul>${S.mech.map(m => `<li><span>${m}</span><i class="prp-ch__tag"></i></li>`).join('')}</ul></div><div class="prp-ch__col prp-ch__col--p"><p class="label">${S.physT}</p><ul>${S.phys.map(m => `<li><span>${m}</span><i class="prp-ch__tag"></i></li>`).join('')}</ul></div></div>
      <p class="prp-read" aria-live="polite"><b>${S.idle}</b><small></small></p></div>`;
    const fig = el.querySelector('.prp-ch__fig'), read = el.querySelector('.prp-read');
    const draw = (kind, t) => {
      let g = `<rect x="110" y="70" width="140" height="26" ${steel(.3)}/>`;
      if (kind === 'work') { const y = 20 + 22 * Math.sin(Math.PI * Math.min(1, t * 2)); g += `<rect x="156" y="${f1(y)}" width="48" height="28" rx="4" ${steel(.42)}/><rect x="200" y="${f1(y + 8)}" width="70" height="12" rx="4" fill="${V.zc}" fill-opacity=".3" stroke="${V.ink}" stroke-width="2"/>` + `<path d="M90 96H270" stroke="${V.ink}" stroke-width="2"/>` + hatchRect(90, 96, 180, 12, 8); }
      if (kind === 'heat') { g += `<rect x="96" y="44" width="168" height="74" rx="6" fill="none" stroke="${V.ink}" stroke-width="2"/><rect x="110" y="70" width="140" height="26" fill="${V.hot}" fill-opacity="${f1(.15 + .4 * Math.sin(Math.PI * t))}" stroke="none"/>` + [130, 160, 190, 220].map(x => `<path d="M${x} 132c-6-6-2-12 0-14 0 4 3 5 4 6 0-5 3-8 5-9 0 5 3 7 3 10 0 5-4 8-8 8" stroke="${V.hot}" stroke-width="1.6"/>`).join(''); }
      fig.innerHTML = svg('0 0 360 150', g, S.aria);
    };
    const go = kind => {
      cancelAnimationFrame(raf);
      el.querySelectorAll('.prp-ch__col--m li').forEach((li, i) => { li.classList.remove('is-changed'); void li.offsetWidth; li.classList.add('is-changed'); li.querySelector('i').textContent = S.changed; li.style.setProperty('--d', (i * 90) + 'ms'); });
      el.querySelectorAll('.prp-ch__col--p li').forEach(li => { li.classList.add('is-same'); li.querySelector('i').textContent = S.same; });
      const [b, s] = S[kind]; read.querySelector('b').innerHTML = b; read.querySelector('small').innerHTML = s;
      api.sfx(kind === 'work' ? 'pop' : 'swoosh'); api.scene(kind === 'work' ? 'anvil' : 'physical');
      if (reduced()) draw(kind, 1); else { const t0 = performance.now(); const step = now => { const t = Math.min(1, (now - t0) / 900); draw(kind, t); if (t < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
      did.add(kind); if (did.size === 2) api.award(5, { from: read, key: 'demo:pr-change' });
    };
    el.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => go(b.dataset.d)));
    draw(null, 0);
    return () => cancelAnimationFrame(raf);
  };
}

/** "Heat two bars": the lower-melting one grows more, then melts. S = { aria, heat, low, high, read: {cold, warm, hot, melt}, unit, steel } */
export function heatBars(S) {
  return (el, api) => {
    let h = 0, melted = false, scene = '';
    el.innerHTML = `<div class="prp-hb"><div class="prp-hb__fig"></div><div class="prp-hb__side">
      <label class="prp-range"><span class="label">${S.heat}</span><span class="hud-num prp-hb__v">0%</span><input type="range" min="0" max="100" value="0" aria-label="${S.heat}"></label>
      <div class="prp-hb__chips"><span class="chip" dir="ltr">${S.unit}</span><span class="chip chip--zone">${S.steel}</span></div>
      <p class="prp-read" aria-live="polite"><b></b><small></small></p></div></div>`;
    const fig = el.querySelector('.prp-hb__fig'), read = el.querySelector('.prp-read'), range = el.querySelector('input');
    const MELT = 78;
    const draw = () => {
      const t = h / 100, x0 = 40, L = 220;
      const gl = Math.min(t, MELT / 100) * 64, gh = t * 20; // the low-melting bar grows ~3× more (drawn exaggerated)
      const glow = o => `fill="${V.hot}" fill-opacity="${f1(o)}"`;
      let g = `<path d="M${x0} 18V178" stroke="${V.ink}" stroke-width="3"/>` + hatchRect(x0 - 16, 18, 16, 160, 7) + `<path d="M${x0 + L} 30V166" stroke="${V.ink3}" stroke-width="1.1" stroke-dasharray="4 5"/>`;
      if (!melted) g += `<rect x="${x0}" y="44" width="${f1(L + gl)}" height="26" ${steel(.3)}/><rect x="${x0}" y="44" width="${f1(L + gl)}" height="26" ${glow(.08 + .5 * t)} stroke="none"/>` + (gl > 1 ? `<rect x="${x0 + L}" y="44" width="${f1(gl)}" height="26" fill="${V.zc}" fill-opacity=".45" stroke="none"/>` : '');
      else g += `<rect x="${x0}" y="44" width="${f1(L * .35)}" height="26" ${steel(.3)}/><path d="M${x0 + L * .35} 44q40 6 50 30t60 6q40-2 70 6H${x0 + L * .35}z" ${hotFill(.5)}/>`;
      g += `<rect x="${x0}" y="118" width="${f1(L + gh)}" height="26" ${steel(.3)}/><rect x="${x0}" y="118" width="${f1(L + gh)}" height="26" ${glow(.06 + .45 * t)} stroke="none"/>` + (gh > 1 ? `<rect x="${x0 + L}" y="118" width="${f1(gh)}" height="26" fill="${V.zc}" fill-opacity=".45" stroke="none"/>` : '');
      g += lab(x0 + 8, 36, S.low, { a: 'start', size: 13, c: V.ink2, f: 'Readex Pro', w: 500, ls: '0', extra: `direction="${S.dir || 'ltr'}"` }) + lab(x0 + 8, 110, S.high, { a: 'start', size: 13, c: V.ink2, f: 'Readex Pro', w: 500, ls: '0', extra: `direction="${S.dir || 'ltr'}"` });
      fig.innerHTML = svg('0 0 360 186', g, S.aria);
      el.querySelector('.prp-hb__v').textContent = h + '%';
      const [b, s] = melted ? S.read.melt : h < 8 ? S.read.cold : h < 50 ? S.read.warm : S.read.hot;
      read.querySelector('b').innerHTML = b; read.querySelector('small').innerHTML = s;
      const sc = melted ? 'melting' : 'expansion'; if (sc !== scene) { scene = sc; api.scene(sc); }
    };
    range.addEventListener('input', () => {
      h = +range.value; const was = melted; melted = h >= MELT; draw();
      if (melted && !was) { api.sfx('swoosh'); api.award(5, { from: read, key: 'demo:pr-heat' }); }
    });
    draw();
  };
}
