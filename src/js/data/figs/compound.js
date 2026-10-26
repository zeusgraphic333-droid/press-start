// Question / lesson figures — compound. Each value is () => an <svg> string (box() + CSS variables only). Format: docs/BRIEF.md § Figures.
// The drawings themselves live in content/lessons/_compound-art.js (shared with the lesson and the trials).
import { box } from './box.js';
import { latheArt, tubeArt, drawDieArt, PROFILES, V } from '../../content/lessons/_compound-art.js';

/** re-frame a lesson drawing as a figure: same inner drawing, the shared figure frame */
const asFig = (s, label) => box(`<g direction="ltr" fill="none" stroke-linecap="round" stroke-linejoin="round">${s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</g>`, (s.match(/viewBox="([^"]+)"/) || [])[1], label);
const trumpet = PROFILES.find(p => p[0] === 'Trumpet')[1];

export default {
  'cp-lathe-n': () => asFig(latheArt('numbers', ''), 'A spinning lathe with seven numbered parts'),
  'cp-tube-e': () => asFig(tubeArt(4, '', { letter: false }), 'Tube hydroforming: the tube inside the closed die, axial forces at both ends and pressure P inside'),
  'cp-drawdie': () => asFig(drawDieArt(.45, 'letters', ''), 'A deep drawing die with parts lettered A to D and force arrows'),
  'cp-prof-trumpet': () => box(`<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${trumpet}" transform="translate(110 40) scale(1)" stroke="${V.ink}" stroke-width="2.6" fill="${V.zc}" fill-opacity=".12"/><path d="M160 30V112" stroke="${V.ink3}" stroke-width="1" stroke-dasharray="8 4 2 4"/></g>`, '90 20 140 100', 'A spun profile: a narrow neck on top flaring out to a wide base')
};
