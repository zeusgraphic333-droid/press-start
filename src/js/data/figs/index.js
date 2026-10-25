// Figures for questions (q.fig) and lessons ({ t: 'fig', id }): figs/<zone>.js default-exports { 'id': () => '<svg …>' }.
// Draw with CSS variables (var(--ink), var(--ink-2), var(--zc), var(--hot), var(--steel)…) so a figure reads in both modes.
import { esc } from '../../core/util.js';
import design from './design.js';
import materials from './materials.js';
import strength from './strength.js';
import props from './props.js';
import iron from './iron.js';
import bend from './bend.js';
import compound from './compound.js';
import cut from './cut.js';
export const FIG = Object.assign({}, design, materials, strength, props, iron, bend, compound, cut);
export function figureHTML(key) {
  const f = FIG[key]; if (!f) return '';
  try { return `<div class="qfig" data-fig="${esc(key)}">${typeof f === 'function' ? f() : f}</div>`; } catch (e) { console.warn('figure', key, e); return ''; }
}
export { box } from './box.js';
