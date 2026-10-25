// Preview of the Erebus ident (node build.mjs --dev --ident → dist/dev-ident.html). ?slow simulates a slow network; R replays.
import gsap from 'gsap';
import { mountIdent } from './ui/ident.js';
if (location.search.includes('hq')) gsap.ticker.lagSmoothing(0);
document.getElementById('app').innerHTML = '';
document.body.style.background = '#000';
async function run() {
  const id = mountIdent();
  const slow = location.search.includes('slow');
  for (const [p, ms] of [[12, 300], [38, slow ? 1400 : 500], [60, slow ? 1200 : 300], [86, slow ? 900 : 300], [100, 200]]) { await new Promise(r => setTimeout(r, ms)); id.progress(p); }
  const cleanup = await id.finish();
  const after = document.createElement('div');
  after.style.cssText = 'position:fixed;inset:0;display:grid;place-items:center;background:#07070B;color:#EDEBE6;font:600 22px Archivo,sans-serif;opacity:0;z-index:2100';
  after.innerHTML = '<button style="font:500 13px Archivo,sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#E8C77F;background:none;border:1px solid rgba(232,199,127,.4);border-radius:99px;padding:14px 26px;cursor:pointer">Replay</button>';
  after.querySelector('button').onclick = () => location.reload();
  document.body.appendChild(after);
  gsap.to(after, { opacity: 1, duration: .8, onComplete: () => cleanup?.() });
}
addEventListener('keydown', e => { if (e.key === 'r') location.reload(); });
document.fonts.load('400 120px Italiana').then(() => document.fonts.load('500 20px Archivo')).catch(() => { }).then(run);
