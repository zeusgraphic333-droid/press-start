// Question / lesson figures — design. Each value is () => an <svg> string (use box() and CSS variables). Format: docs/BRIEF.md § Figures.
import { box as frame } from './box.js';
import { FAMILIES, MX_LEGEND, seqSVG, symAt } from '../../content/lessons/_design-kit.js';
/** every figure draws inside a fill-less group: stroke-only shapes stay open (the shared frame sets no fill) */
const box = (inner, vb, label) => frame(`<g fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`, vb, label);

const V = { ink: 'var(--ink)', ink2: 'var(--ink-2)', ink3: 'var(--ink-3)', zc: 'var(--zc)', zt: 'var(--zt)', hot: 'var(--hot)' };
const T = (x, y, s, { c = V.ink, size = 12, weight = 600, anchor = 'middle' } = {}) => `<text x="${x}" y="${y}" text-anchor="${anchor}" direction="ltr" font-family="Barlow Condensed" font-weight="${weight}" font-size="${size}" fill="${c}">${s}</text>`;

/** L1 · S7 — the Manufacturing Methods tree (hide = index of a family whose name becomes "?") */
function tree(hide = -1) {
  const cx = [46, 136, 226, 316];
  let g = `<rect x="104" y="6" width="152" height="24" rx="3" fill="${V.zc}" fill-opacity=".3" stroke="${V.zt}" stroke-width="1.4"/>${T(180, 22.5, 'Manufacturing Methods', { size: 13.5, weight: 700 })}
    <path d="M180 30v10M${cx[0]} 40H${cx[3]}${cx.map(x => `M${x} 40v10`).join('')}" stroke="${V.ink3}" stroke-width="1.2" fill="none"/>`;
  FAMILIES.forEach((f, i) => {
    const x = cx[i];
    g += `<rect x="${x - 40}" y="50" width="80" height="24" rx="3" fill="${V.zc}" fill-opacity=".14" stroke="${hide === i ? V.hot : V.zt}" stroke-width="1.4"/>${T(x, 66.5, hide === i ? '?' : f.en, { size: hide === i ? 17 : 13, weight: 700, c: hide === i ? V.hot : V.ink })}`;
    const last = 88 + (f.br.length - 1) * 26 + 10;
    g += `<path d="M${x - 37} 74V${last}" stroke="${V.ink3}" stroke-width="1.1" fill="none"/>`;
    f.br.forEach((b, j) => { const y = 88 + j * 26; g += `<path d="M${x - 37} ${y + 10}h5" stroke="${V.ink3}" stroke-width="1.1"/><rect x="${x - 32}" y="${y}" width="76" height="20" rx="2" fill="none" stroke="${V.ink3}" stroke-width="1"/>${T(x + 6, y + 14, b.en, { size: 11, weight: 600, c: V.ink2 })}`; });
  });
  return g;
}

export default {
  'dg-tree': () => box(tree(), '0 0 362 196', 'Manufacturing Methods: Forming, Cutting, Joining, Finishing and their fourteen branches'),
  'dg-tree-q': () => box(tree(1), '0 0 362 196', 'The Manufacturing Methods tree with one family name hidden'),
  'dg-seq-q': () => box(seqSVG({ marked: 1 }), '0 0 640 250', 'The Product Design Sequence with the middle lens marked with a question mark'),
  /* figure 1-1, the Forming columns of the thermoset (plastics) row */
  'dg-mx-q': () => box(`
    <rect x="96" y="8" width="216" height="22" fill="${V.zc}" fill-opacity=".14" stroke="${V.ink3}" stroke-width="1"/>${T(204, 23, 'Forming', { weight: 700, size: 13 })}
    ${['Liquid State', 'Plastic State', 'Solid State'].map((s, i) => `<rect x="${96 + i * 72}" y="30" width="72" height="26" fill="none" stroke="${V.ink3}" stroke-width="1"/>${T(132 + i * 72, 47, s, { size: 11.5, c: V.ink2 })}`).join('')}
    <rect x="8" y="56" width="88" height="40" fill="none" stroke="${V.ink3}" stroke-width="1"/>${T(14, 72, 'Plastics', { anchor: 'start', weight: 700, size: 12 })}${T(14, 88, 'Thermoset', { anchor: 'start', size: 12, c: V.ink2 })}
    ${[3, 0, 0].map((v, i) => `<rect x="${96 + i * 72}" y="56" width="72" height="40" fill="none" stroke="${V.ink3}" stroke-width="1"/>${symAt(v, 132 + i * 72, 76, 9)}`).join('')}
    ${[3, 2, 1, 0].map((v, i) => `${symAt(v, 22 + i * 78, 122, 6)}${T(32 + i * 78, 126, MX_LEGEND[v].en, { anchor: 'start', size: 10.5, c: V.ink2, weight: 500 })}`).join('')}`,
    '0 0 320 138', 'Figure 1-1, thermoset plastics: Liquid State all processes, Plastic State and Solid State no processes'),
  /* one symbol from the legend of figure 1-1: the empty circle */
  'dg-mx-none': () => box(`${symAt(0, 160, 50, 26)}${T(160, 104, 'figure 1-1 · materials and manufacturing', { size: 12, c: V.ink3, weight: 500 })}`, '0 0 320 116', 'An empty circle from the legend of figure 1-1')
};
