// The Archive's study tables, one file per zone (study/<zone>.js exports { terms, pairs, triggers }). Format: docs/BRIEF.md § Archive.
import * as design from './design.js';
import * as materials from './materials.js';
import * as strength from './strength.js';
import * as props from './props.js';
import * as iron from './iron.js';
import * as bend from './bend.js';
import * as compound from './compound.js';
import * as cut from './cut.js';
const Z = [design, materials, strength, props, iron, bend, compound, cut];
/** flashcards: { t: term (slide wording), ar: Arabic name, lec: '01'…'05', d: slide definition (English), r: simple Arabic line, rEn: simple English line } */
const seen = new Set();
/** (a term two zones both define appears once: the first zone's card wins, so "known" marks stay unambiguous) */
export const TERMS = Z.flatMap(m => m.terms || []).filter(c => { const k = String(c.t).trim().toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
/** exam traps: [A, A's definition, B, B's definition, Arabic tip, English tip] */
export const PAIRS = Z.flatMap(m => m.pairs || []);
/** trigger words: [words the question uses, the answer they point to, lecture '01'…'05'] */
export const TRIGGERS = Z.flatMap(m => m.triggers || []);
