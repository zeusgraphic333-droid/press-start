// First visit: name + sigil (the sigil is the player's signature — and the first lesson: every shape has a personality).
// The loader and the gate now live in ident.js (Erebus) and setup.js (language · experience · sound).
import { state, award, save } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { GLYPH, SIGILS } from './glyphs.js';
import { esc } from '../core/util.js';
import { t } from '../core/i18n.js';

/** first visit: name + sigil */
export function onboarding() {
  return new Promise(res => {
    const S = state(); let pick = S.sigil || 'circle';
    const el = document.createElement('div'); el.className = 'onb';
    el.innerHTML = `<form class="onb__card" autocomplete="off">
      <p class="label"><b>01</b> ${esc(t('onb.kicker'))}</p>
      <h2>${esc(t('onb.name'))}</h2>
      <input class="onb__name" name="n" maxlength="18" placeholder="${esc(t('onb.placeholder'))}" aria-label="${esc(t('onb.name'))}" value="${esc(S.name || '')}">
      <h3><span class="label"><b>02</b></span> ${esc(t('onb.sigil'))}</h3>
      <div class="sigils" role="radiogroup" aria-label="${esc(t('onb.sigil'))}">${SIGILS.map(s => `<button type="button" role="radio" class="sigil" data-k="${s.k}" aria-checked="${s.k === pick}"><span class="sigil__g">${GLYPH[s.k]}</span><b>${esc(t('sigil.' + s.k))}</b><small>${esc(t('sigil.' + s.k + '.d'))}</small></button>`).join('')}</div>
      <p class="onb__read" aria-live="polite"><b>${esc(t('sigil.' + pick))}</b> ${esc(t('sigil.' + pick + '.d'))}</p>
      <p class="onb__note">${esc(t('onb.note'))}</p>
      <button type="submit" class="btn btn--solid btn--lg btn--block">${esc(t('onb.go'))}</button>
    </form>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    const input = el.querySelector('.onb__name'); setTimeout(() => input.focus(), 600);
    // phones show the chosen shape's reading under the grid (the cards drop their small print there)
    const read = el.querySelector('.onb__read');
    el.querySelectorAll('.sigil').forEach(b => b.addEventListener('click', () => { pick = b.dataset.k; el.querySelectorAll('.sigil').forEach(x => x.setAttribute('aria-checked', String(x === b))); read.innerHTML = `<b>${esc(t('sigil.' + pick))}</b> ${esc(t('sigil.' + pick + '.d'))}`; sfx('pop'); }));
    el.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      S.name = (input.value || '').trim().slice(0, 18) || t('onb.guest'); S.sigil = pick; save();
      award('hello'); sfx('level');
      el.classList.remove('in'); el.classList.add('is-out'); setTimeout(() => el.remove(), 700);
      res();
    });
  });
}
