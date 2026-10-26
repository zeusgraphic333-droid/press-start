// Question / lesson figures — props. Each value is () => an <svg> string (box() + CSS variables). Format: docs/BRIEF.md § Figures.
// No answer words on the drawings: the question asks for them.
import { box } from './box.js';
import { V, lab, arrow, hatchRect } from '../../content/lessons/_strength-kit.js';

/** box() draws a bare <svg>: wrap the drawing so unfilled paths stay unfilled and labels anchor left-to-right on Arabic pages */
const G = inner => `<g fill="none" stroke-linecap="round" stroke-linejoin="round" direction="ltr">${inner}</g>`;
const steel = (o = .26) => `fill="var(--fig-steel)" fill-opacity="${o}" stroke="${V.ink}" stroke-width="2"`;

export default {
  /** a beam bent by a load: A on the outside of the bend, B on the inside */
  'pr-beam': () => box(G(
    `<path d="M30 78Q160 128 290 78L290 98Q160 148 30 98Z" ${steel(.24)}/>` +
    `<path d="M38 99l-10 18h20zM282 99l-10 18h20z" ${steel(.4)}/><path d="M18 117H58M262 117H302" stroke="${V.ink}" stroke-width="2"/>` +
    arrow(160, 24, 160, 98) +
    `<circle cx="160" cy="124" r="4" fill="${V.zt}"/><circle cx="208" cy="99" r="4" fill="${V.zt}"/>` +
    lab(160, 152, 'A', { size: 20, c: V.ink, w: 700 }) + `<path d="M160 136V128" stroke="${V.ink}" stroke-width="1.2"/>` +
    lab(226, 76, 'B', { size: 20, c: V.ink, w: 700 }) + `<path d="M220 82L210 95" stroke="${V.ink}" stroke-width="1.2"/>` +
    lab(160, 182, 'A: outside of the bend · B: inside of the bend', { size: 12.5, c: V.ink3, w: 500 })),
    '0 0 320 192', 'A beam bent by a load from above, with point A on the outside of the bend and point B on the inside'),
  /** domains: scattered on the left, lined up on the right */
  'pr-domains': () => {
    const rand = [2.1, 4.6, .4, 5.5, 1.3, 3.4, 2.8, 5.9, .9];
    const cell = (x, y, a, c) => { const r = 11, dx = Math.cos(a) * r, dy = Math.sin(a) * r; return `<rect x="${x - 17}" y="${y - 17}" width="34" height="34" stroke="${V.ink3}" stroke-width="1"/>` + arrow(x - dx, y - dy, x + dx, y + dy, { c, w: 2, h: 7 }); };
    let g = '';
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) { g += cell(42 + k * 34, 56 + r * 34, rand[r * 3 + k], V.ink2) + cell(210 + k * 34, 56 + r * 34, 0, V.hot); }
    return box(G(g + arrow(140, 90, 180, 90, { c: V.ink3, w: 1.6, h: 8 }) + lab(76, 24, 'before', { size: 14, c: V.ink2 }) + lab(244, 24, 'after', { size: 14, c: V.ink2 })), '0 0 320 170', 'Small domains inside a metal: first pointing every way, then all pointing the same way');
  },
  /** two bars, same length, heated the same: A grows more than B */
  'pr-expand': () => box(G(
    `<path d="M40 20V172" stroke="${V.ink}" stroke-width="3"/>` + hatchRect(26, 20, 14, 152, 7) +
    `<path d="M220 26V166" stroke="${V.ink3}" stroke-width="1.1" stroke-dasharray="4 5"/>` +
    `<rect x="40" y="48" width="230" height="24" ${steel(.3)}/><rect x="220" y="48" width="50" height="24" fill="${V.zc}" fill-opacity=".45" stroke="none"/>` +
    `<rect x="40" y="112" width="196" height="24" ${steel(.3)}/><rect x="220" y="112" width="16" height="24" fill="${V.zc}" fill-opacity=".45" stroke="none"/>` +
    lab(56, 42, 'A', { size: 18, c: V.ink, w: 700 }) + lab(56, 106, 'B', { size: 18, c: V.ink, w: 700 }) +
    lab(220, 186, 'starting length (both)', { size: 12.5, c: V.ink3, w: 500 }) + lab(296, 66, 'heated', { size: 12.5, c: V.hot, w: 600 }) + lab(296, 130, 'heated', { size: 12.5, c: V.hot, w: 600 })),
    '0 0 320 196', 'Two bars, A and B, that started at the same length: after the same heating, A grew much more than B')
};
