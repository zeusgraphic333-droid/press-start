// Question / lesson figures — iron. Each value is () => an <svg> string (box() + CSS variables only). Format: docs/BRIEF.md § Figures.
// The drawings themselves live in content/lessons/_iron-art.js (shared with the lesson and the trials).
import { box } from './box.js';
import { crankArt, rollsArt, chainArt } from '../../content/lessons/_iron-art.js';

/** re-frame a lesson drawing as a figure: same inner drawing, the shared figure frame */
const asFig = (s, label) => box(`<g direction="ltr" fill="none" stroke-linecap="round" stroke-linejoin="round">${s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</g>`, (s.match(/viewBox="([^"]+)"/) || [])[1], label);

export default {
  'ir-crank': () => asFig(crankArt('', { name: false }), 'A crankshaft: main journals on the axis, crank pins offset on webs'),
  'ir-rolls': () => asFig(rollsArt('', { name: false }), 'Two rolls squeezing a slab thinner, like rolling-mill rolls'),
  'ir-chain': () => asFig(chainArt('', { hide: true }), 'Gray or ductile iron, chilled in the mold, becomes white iron; one hidden step turns white iron into malleable iron')
};
