// Question / lesson figures — cut. Each value is () => an <svg> string (use box() and CSS variables). Format: docs/BRIEF.md § Figures.
// The drawings themselves live in content/lessons/_cut-art.js (shared with the lesson and the trials).
import { box } from './box.js';
import { artParts } from '../../content/lessons/_cut-art.js';

// box() leaves the root's fill at its default (black): the drawings expect fill="none" on the root, so wrap them
const fig = (name, o) => () => { const [vb, inner, label] = artParts(name, o); return box(`<g fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`, vb, label); };

export default {
  'ct-clr': fig('clr'),                // L5 · S7: P between the die halves D, C/2 each side, d1 and d
  'ct-press': fig('press'),            // L5 · S10: punching force, punch, sheet metal, clearance, scrap / slug, die
  'ct-press-x': fig('press', { x: true }), // the same, with the slug marked X (question ct25)
  'ct-pb': fig('pbQ'),                 // L5 · S13: one cut, the discarded sheet marked (question ct31: blanking)
  'ct-fine': fig('fine'),              // L5 · S14: fine blanking in section
  'ct-strip': fig('strip', { q: true }), // L5 · S18: the same strip, A (cutoff) and B (parting)
  'ct-emb': fig('emboss', { small: true }) // L5 · S21: male and female, same contour, opposite direction
};
