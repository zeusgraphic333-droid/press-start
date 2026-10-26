// Question / lesson figures — materials. Each value is () => an <svg> string (use box() and CSS variables). Format: docs/BRIEF.md § Figures.
import { box as frame } from './box.js';
import { l1TreeSVG, metalsSVG, l2TreeSVG, lattice } from '../../content/lessons/_materials-kit.js';
/** every figure draws inside a fill-less group: stroke-only shapes stay open (the shared frame sets no fill) */
const box = (inner, vb, label) => frame(`<g fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`, vb, label);

export default {
  /* L1 · S4 — Materials: four families and their branches */
  'mt-l1tree': () => box(l1TreeSVG(), '0 0 362 222', 'Materials: Metals (Ferrous, Nonferrous), Plastics and Rubber/Elastomers (Thermoset, Thermoplastic), Natural Engineering Materials (Engineering Ceramics, Glass, Manufactured Carbon, Refractory Hard Metals)'),
  /* L1 · S6 = L2 · S3 — the metals chart */
  'mt-metals': () => box(metalsSVG(false), '0 0 320 128', 'Metals chart: Ferrous, Nonferrous, and Powdered Metallurgy on a dashed line'),
  'mt-metals-q': () => box(metalsSVG(true), '0 0 320 128', 'Metals chart with the dashed branch marked with a question mark'),
  /* L2 · S2 — the classification, top levels */
  'mt-l2tree': () => box(l2TreeSVG(), '0 0 340 196', 'Engineering materials: metals (ferrous, non-ferrous) and non-metals (polymers: thermosetting, thermoplastic; ceramics)'),
  'mt-l2tree-q': () => box(l2TreeSVG('polymers'), '0 0 340 196', 'The classification of engineering materials with one box marked with a question mark'),
  /* atoms of two kinds in one lattice */
  'mt-lattice-alloy': () => box(lattice({ alloy: .32, seed: 11, cols: 9, rows: 5, x0: 24, y0: 22, gap: 24 }), '0 0 240 130', 'A lattice of metal atoms: two different kinds of atom mixed together')
};
