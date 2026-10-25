// Dev page for immersive (particle) scenes (node build.mjs --dev --scenes3d → dist/dev-scenes3d.html)
//   #/s/<name>    one scene in the real particle world (←/→ step through the catalogue)
//   #/            the first scene · ?stage=lesson puts it where lessons show it (beside the text) instead of centred
// window.__scenes = every catalogue name; window.__go(name) morphs to it (qa/scenes3d.js uses these for contact sheets).
import gsap from 'gsap';
import { createParticles, canWebGL } from './world/particles.js';
import { SCENE_INFO } from './world/scenes/info.js';
import { titleBuilders } from './world/titles.js';
gsap.ticker.lagSmoothing(0);
document.documentElement.dataset.mode = 'immersive';
const names = [...Object.keys(SCENE_INFO), 'title:ar', 'title:en'];
window.__scenes = names;
const app = document.getElementById('app');
const label = document.createElement('div');
label.style.cssText = 'position:fixed;left:14px;bottom:12px;font:600 14px system-ui;color:#ECE9E2;z-index:9;text-shadow:0 1px 2px #000';
document.body.append(label);
let world = null;
async function boot() {
  await Promise.all(['800 200px Changa', '800 200px "Big Shoulders Display"', '600 40px "Barlow Condensed"', '400 20px "Readex Pro"'].map(f => document.fonts.load(f))).catch(() => { });
  if (!canWebGL()) { label.textContent = 'no WebGL'; return; }
  world = createParticles(document.getElementById('world'));
  titleBuilders(world);
  world.start();
  const lesson = location.search.includes('stage=lesson');
  world.setStage(lesson ? { cx: .775, cy: .5, z: 20.5 } : { cx: .5, cy: .5, z: 13.5 }, 0);
  window.__go = (n, dur = .01) => { label.textContent = `${n} · ${(SCENE_INFO[n] || []).join(' · ')}`; return world.morph(n, { dur, force: true }); };
  go();
}
function go() { const h = location.hash.replace(/^#\/?/, '').split('/'); const n = h[0] === 's' && h[1] ? decodeURIComponent(h[1]) : names[0]; window.__go?.(n, 1.2); }
addEventListener('hashchange', go);
addEventListener('keydown', e => {
  const h = location.hash.replace(/^#\/?/, '').split('/'); const i = Math.max(0, names.indexOf(decodeURIComponent(h[1] || names[0])));
  if (e.key === 'ArrowRight') location.hash = '#/s/' + encodeURIComponent(names[(i + 1) % names.length]);
  if (e.key === 'ArrowLeft') location.hash = '#/s/' + encodeURIComponent(names[(i - 1 + names.length) % names.length]);
});
app.querySelector('#hud')?.remove();
boot();
