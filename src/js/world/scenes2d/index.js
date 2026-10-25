// Scene registry for the illustrated stage. Each zone file default-exports { sceneName: { view?, draw(k, name), play?(svg, k, name) } }.
// Names match world/scenes/info.js (one catalogue for both modes), so a chapter's `scene` works in either mode.
import design from './design.js';
import materials from './materials.js';
import strength from './strength.js';
import props from './props.js';
import iron from './iron.js';
import bend from './bend.js';
import compound from './compound.js';
import cut from './cut.js';
import special from './special.js';
import title from './title.js';
import { INK } from './kit.js';

export const SCENES2D = { ...design, ...materials, ...strength, ...props, ...iron, ...bend, ...compound, ...cut, ...special, ...title };

/** shown for a name nobody has drawn yet: blank stock waiting on the drafting table (construction lines only) */
export const FALLBACK = {
  draw: () => {
    let s = ''; let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 9; i++) { const x = 90 + (i % 3) * 150 + r() * 20, y = 110 + Math.floor(i / 3) * 140 + r() * 20, w = 90 + r() * 40, h = 14 + r() * 50; s += `<rect class="fb-s" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="${INK.blue}" stroke-width="1.3" opacity=".7"/>`; }
    return s + `<line class="fb-s" x1="60" y1="520" x2="540" y2="520" stroke="${INK.graphite3}" stroke-width="1.3" stroke-dasharray="22 4 3 4"/>`;
  },
  play: (svg, k) => { const t = k.tl(); k.plot(t, svg.querySelectorAll('.fb-s'), { stagger: .06, dur: .6 }); }
};
export function sceneFor(name = '') { return SCENES2D[name] || FALLBACK; }
export const SCENE_NAMES = () => Object.keys(SCENES2D);
