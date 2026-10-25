// Dev sheet for illustrated scenes (node build.mjs --dev --scenes2d → dist/dev-scenes2d.html)
//   #/            contact sheet of every scene in world/scenes/info.js (missing ones show the fallback, labelled MISSING)
//   #/z/<zone>    the contact sheet of one zone (design · materials · … · special)
//   #/s/<name>    one scene on the real 2D stage (←/→ step through, R replays)
import gsap from 'gsap';
import kit, { installDefs } from './world/scenes2d/kit.js';
import { SCENES2D, sceneFor } from './world/scenes2d/index.js';
import { SCENE_INFO, SCENES_BY_ZONE } from './world/scenes/info.js';
import { createStage2D } from './world/stage2d.js';
gsap.ticker.lagSmoothing(0);
document.documentElement.dataset.mode = 'illustrated';
document.body.style.cssText = 'margin:0;overflow:auto;font-family:system-ui';
installDefs();
const all = [...new Set([...Object.keys(SCENE_INFO), 'title:ar', 'title:en', ...Object.keys(SCENES2D)])];
const app = document.getElementById('app'); app.innerHTML = '';
let stage = null;
const ok = n => !!SCENES2D[n];
function sheet(zone) {
  const names = zone ? [...Object.keys(SCENES_BY_ZONE[zone] || {}), ...(zone === 'special' ? ['title:ar', 'title:en'] : [])] : all;
  app.innerHTML = `<div style="padding:10px 14px 0;font:600 13px system-ui;color:#1B2630">${zone || 'all'} · ${names.filter(ok).length}/${names.length} drawn</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;padding:14px">${names.map(n => `<figure data-n="${n}" style="margin:0;background:#fff;border:1px solid #C9D6CE;border-radius:8px;overflow:hidden"><div class="cell" style="position:relative;aspect-ratio:1;background:#EDF1EE"></div><figcaption style="font:600 12px/1.25 system-ui;padding:6px 8px;display:flex;justify-content:space-between;gap:6px"><span>${n}<br><small style="font-weight:400;color:#46545E">${(SCENE_INFO[n] || [''])[0]}</small></span><span style="color:${ok(n) ? '#16A05D' : '#D7263D'}">${ok(n) ? 'ok' : 'MISSING'}</span></figcaption></figure>`).join('')}</div>`;
  app.querySelectorAll('figure').forEach(f => {
    const n = f.dataset.n, sc = sceneFor(n), cell = f.querySelector('.cell');
    try { cell.innerHTML = `<svg viewBox="${sc.view || '0 0 600 600'}" style="position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:multiply">${sc.draw(kit, n)}</svg>`; gsap.context(() => sc.play?.(cell.firstElementChild, kit, n), cell); }
    catch (e) { cell.innerHTML = `<pre style="color:#D7263D;font-size:11px;white-space:pre-wrap;padding:8px">${e.message}</pre>`; console.error(n, e); }
  });
}
function single(name) {
  app.innerHTML = `<div id="stage2d" class="stage2d"></div><div style="position:fixed;left:14px;bottom:12px;font:600 14px system-ui;color:#1B2630">${name} · ${(SCENE_INFO[name] || []).join(' · ')} ${ok(name) ? '' : '<b style="color:#D7263D">MISSING</b>'}</div>`;
  stage = createStage2D(document.getElementById('stage2d'));
  stage.setStage({ cx: .5, cy: .48, z: 13.5 }, 0);
  stage.morph(name, { dur: 1 });
}
function go() {
  const h = location.hash.replace(/^#\/?/, '').split('/');
  if (h[0] === 's' && h[1]) single(decodeURIComponent(h.slice(1).join('/'))); else sheet(h[0] === 'z' ? h[1] : '');
}
addEventListener('keydown', e => {
  const h = location.hash.replace(/^#\/?/, '').split('/'); if (h[0] !== 's') return;
  const i = all.indexOf(decodeURIComponent(h.slice(1).join('/')));
  if (e.key === 'ArrowRight') location.hash = '#/s/' + encodeURIComponent(all[(i + 1) % all.length]);
  if (e.key === 'ArrowLeft') location.hash = '#/s/' + encodeURIComponent(all[(i - 1 + all.length) % all.length]);
  if (e.key === 'r') single(all[i]);
});
addEventListener('hashchange', go);
document.fonts.ready.then(go);
