// Immersive scene registry: each zone file default-exports (N) => ({ sceneName: () => build(N, seed, draw) }).
// Names and captions live in info.js (one catalogue for both modes); STYLE.md says how to draw.
import design from './design.js';
import materials from './materials.js';
import strength from './strength.js';
import props from './props.js';
import iron from './iron.js';
import bend from './bend.js';
import compound from './compound.js';
import cut from './cut.js';
import special from './special.js';
export { SCENE_INFO, SCENES_BY_ZONE, SCENE_ZONE } from './info.js';
const GROUPS = [design, materials, strength, props, iron, bend, compound, cut, special];
export function sceneBuilders(N) { return Object.assign({}, ...GROUPS.map(g => g(N))); }
