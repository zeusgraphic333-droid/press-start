// Lesson registry: Arabic (<zone>.js) and English (<zone>.en.js) editions. Use lessonFor() from content/index.js.
import design from './design.js';
import materials from './materials.js';
import strength from './strength.js';
import props from './props.js';
import iron from './iron.js';
import bend from './bend.js';
import compound from './compound.js';
import cut from './cut.js';
import designEn from './design.en.js';
import materialsEn from './materials.en.js';
import strengthEn from './strength.en.js';
import propsEn from './props.en.js';
import ironEn from './iron.en.js';
import bendEn from './bend.en.js';
import compoundEn from './compound.en.js';
import cutEn from './cut.en.js';
export const LESSONS = { design, materials, strength, props, iron, bend, compound, cut };
export const LESSONS_EN = { design: designEn, materials: materialsEn, strength: strengthEn, props: propsEn, iron: ironEn, bend: bendEn, compound: compoundEn, cut: cutEn };
