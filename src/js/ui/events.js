// Moments: rank-ups get a modal, achievements get a toast. One at a time.
import { on, levelOf, BADGES } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { GLYPH } from './glyphs.js';
import { esc } from '../core/util.js';
import { burstAt } from '../core/fx.js';
import { t, L, isEN } from '../core/i18n.js';

const queue = []; let busy = false;
function next() {
  if (busy || !queue.length) return; busy = true;
  const job = queue.shift(); job(() => { busy = false; setTimeout(next, 250); });
}
export function modal({ glyph = 'brand', kicker = '', title = '', body = '', acts = [{ label: t('common.ok'), primary: true }] }, done) {
  const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', title);
  m.innerHTML = `<div class="modal__card"><span class="glyph glyph-xl">${GLYPH[glyph] || GLYPH.brand}</span>${kicker ? `<p class="label">${kicker}</p>` : ''}<h2>${title}</h2>${body ? `<p>${body}</p>` : ''}<div class="modal__acts">${acts.map((a, i) => `<button type="button" class="btn ${a.primary ? 'btn--solid' : ''}" data-i="${i}">${esc(a.label)}</button>`).join('')}</div></div>`;
  document.getElementById('modals').appendChild(m);
  const close = i => { m.classList.add('is-out'); setTimeout(() => m.remove(), 250); acts[i]?.run?.(); done?.(); };
  m.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => close(+b.dataset.i)));
  m.addEventListener('keydown', e => { if (e.key === 'Escape') close(-1); });
  setTimeout(() => m.querySelector('[data-i="0"]')?.focus(), 60);
  return m;
}
export function toast(html, glyph = 'star', ms = 3600) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<span class="glyph">${GLYPH[glyph] || GLYPH.star}</span><div>${html}</div>`;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 320); }, ms);
}
export function mountEvents() {
  // Arabic shows the Arabic name with the English one beside it; English shows the English name alone
  on('levelup', lv => queue.push(done => { sfx('level'); const m = modal({ glyph: 'gear', kicker: `<b>Lv ${lv.n}</b> ${t('toast.newRank')}`, title: esc(L(lv.ar, lv.en)), body: `${isEN() ? '' : `<span dir="ltr">${esc(lv.en)}</span><br>`}${t('toast.rankBody')}`, acts: [{ label: t('toast.keepGoing'), primary: true }] }, done); burstAt(m.querySelector('.glyph-xl'), '#FFB347', 22); }) && next());
  on('badge', b => { sfx('badge'); toast(isEN() ? `<b>${esc(b.en)}</b><br><small>${esc(b.dEn || b.d)}</small>` : `<b>${esc(b.ar)}</b> <span class="label">${esc(b.en)}</span><br><small>${esc(b.d)}</small>`, b.icon); });
}
