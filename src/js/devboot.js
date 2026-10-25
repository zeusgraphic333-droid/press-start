// Dev harness for one zone (node build.mjs --dev --zone <zone> [--lang en]). Routes: #/dev/learn · #/dev/game/<n> · #/dev/quiz
// Builds the stage too, so chapter scenes can be checked: particles by default, the 2D stage with ?mode=illustrated.
// ?noworld skips the stage. ?lang=en|ar overrides the language (an --lang en build defaults to English).
import { openZone } from './ui/zone.js';
import { touchStreak, on, state } from './core/state.js';
import { createParticles, canWebGL } from './world/particles.js';
import { createStage2D } from './world/stage2d.js';
import { ZONE_FORMATION } from './world/formations.js';
import { applyLang } from './core/i18n.js';
import { applyMode, isIllustrated, readUrlPrefs } from './core/mode.js';
import gsap from 'gsap';
// headless QA renders slowly; keep tweens on wall-clock time
gsap.ticker.lagSmoothing(0);
export function devBoot(zone, lesson, games, buildLang = '') {
  document.documentElement.classList.add('is-dev');
  // dev pages keep their old defaults (the zone's own language, the dark world); ?lang= / ?mode= still win
  state().settings.lang = buildLang || 'ar';
  if (!state().settings.mode) state().settings.mode = 'immersive';
  readUrlPrefs();
  applyLang(); applyMode();
  touchStreak();
  let world = null;
  const ltr = document.documentElement.dir === 'ltr';
  const stage = innerWidth > 980 ? { cx: ltr ? .775 : .225, cy: .5, z: 20.5 } : { cx: .5, cy: .2, z: 19 };
  if (!location.search.includes('noworld')) {
    if (isIllustrated()) {
      const host = document.getElementById('stage2d'); host.hidden = false; document.getElementById('world').hidden = true;
      world = createStage2D(host); world.set(ZONE_FORMATION[zone] || 'nebula'); world.setStage(stage, 0); window.__mg = { world };
    } else if (canWebGL()) {
      try { world = createParticles(document.getElementById('world')); world.set(ZONE_FORMATION[zone] || 'nebula'); world.start(); world.setStage(stage, 0); window.__mg = { world }; } catch (e) { console.warn(e); }
    }
  }
  on('scene', ({ name }) => { if (world && name) world.morph(name, { dur: .9 }); });
  const go = () => {
    const [, kind = 'learn', n = '0'] = location.hash.replace(/^#\/?/, '').split('/');
    const tab = kind === 'game' ? 'play' : kind;
    const scr = openZone(zone, tab, null, { lesson, games });
    if (kind === 'game') setTimeout(() => scr?.panes.play.querySelectorAll('.gamecard')[+n]?.click(), 30);
  };
  window.addEventListener('hashchange', go);
  go();
}
