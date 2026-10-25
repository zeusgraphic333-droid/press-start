// The question bank, one file per zone (bank/<zone>.js default-exports an array). Format: docs/BRIEF.md § Questions.
import design from './design.js';
import materials from './materials.js';
import strength from './strength.js';
import props from './props.js';
import iron from './iron.js';
import bend from './bend.js';
import compound from './compound.js';
import cut from './cut.js';
export const BANKS = { design, materials, strength, props, iron, bend, compound, cut };
export const QUESTIONS = Object.values(BANKS).flat();
