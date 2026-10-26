// One multiple-choice card. Used by quick checks, zone quizzes, the boss and the portal exam.
import { optionsOf, TOPIC_NAME } from '../data/index.js';
import { figureHTML } from '../data/figs/index.js';
import { esc, rich, pick, qtext } from '../core/util.js';
import { ICON } from './icons.js';
import { t, L, isEN } from '../core/i18n.js';

/** praise / consolation lines, in the current language (read at render time) */
export const YAY = () => t('qcard.yay');
export const NAY = () => t('qcard.nay');
const KEYS = ['A', 'B', 'C', 'D', 'E'];
const LV = lv => (lv >= 1 && lv <= 3 ? t('qcard.lv' + lv) : '');

/**
 * mountQ(el, q, { instant=true, label, onAnswer(ok, picked, q), showMeta=true, rnd, opts (fixed order), picked (preselected index) })
 * returns { reveal(), answered(), destroy() }
 */
export function mountQ(el, q, o = {}) {
  const instant = o.instant !== false;
  const opts = o.opts || optionsOf(q, o.rnd);
  const tn = TOPIC_NAME[q.tp] || ['', ''];
  const topic = L(tn[0], tn[1]);
  el.classList.add('qc'); el.dataset.state = 'ask';
  el.innerHTML = `
    ${o.showMeta === false ? '' : `<div class="qc__meta">${o.label ? `<span class="chip chip--ink">${esc(o.label)}</span>` : ''}<span class="chip">${esc(topic)}</span><span class="chip qc__lv" data-lv="${q.lv}">${LV(q.lv)}</span></div>`}
    <p class="qc__q" dir="ltr">${qtext(q.q)}</p>
    ${q.fig ? figureHTML(q.fig) : ''}
    <ol class="qc__opts" dir="ltr" role="list">${opts.map((op, i) => `<li><button type="button" class="opt" data-i="${i}"><span class="opt__k">${KEYS[i]}</span><span class="opt__t">${esc(op.text)}</span><span class="opt__mark" aria-hidden="true"></span></button></li>`).join('')}</ol>
    <div class="qc__fb" hidden></div>`;
  let picked = -1;
  const buttons = [...el.querySelectorAll('.opt')];
  if (o.picked >= 0 && o.picked < buttons.length) { picked = o.picked; buttons[picked].classList.add('is-picked'); }
  function choose(i) {
    if (picked >= 0 && instant) return;
    picked = i;
    buttons.forEach((b, j) => b.classList.toggle('is-picked', j === i));
    const ok = opts[i].ok;
    if (instant) reveal();
    o.onAnswer?.(ok, i, q, buttons[i]);
  }
  function reveal() {
    el.dataset.state = picked < 0 ? 'skip' : opts[picked].ok ? 'right' : 'wrong';
    buttons.forEach((b, j) => { b.disabled = true; if (opts[j].ok) b.classList.add('is-right'); else if (j === picked) b.classList.add('is-wrong'); });
    const ok = picked >= 0 && opts[picked].ok;
    const fb = el.querySelector('.qc__fb'); fb.hidden = false;
    // Arabic: the simple Arabic explanation, then the slide-English one in small print. English: just the English one.
    fb.innerHTML = `<p class="qc__verdict">${ok ? ICON.check : ICON.x}<b>${picked < 0 ? t('qcard.skip') : ok ? pick(YAY()) : pick(NAY())}</b></p>
      ${isEN() ? `<p class="qc__why" dir="ltr">${rich(esc(q.e || ''))}</p>` : `<p class="qc__why">${rich(esc(q.r || ''))}</p>
      <p class="qc__e" dir="ltr">${esc(q.e || '')}</p>`}`;
  }
  buttons.forEach((b, i) => b.addEventListener('click', () => choose(i)));
  const onKey = e => {
    if (!el.isConnected) return document.removeEventListener('keydown', onKey);
    if (!el.contains(document.activeElement) && !el.closest('.qc--focus')) return; // the quiz/boss mark the card's frame, the card is inside it
    const k = e.key.toUpperCase(); const idx = KEYS.indexOf(k) >= 0 ? KEYS.indexOf(k) : '1234'.indexOf(e.key);
    if (idx >= 0 && idx < buttons.length && !buttons[idx].disabled) { e.preventDefault(); buttons[idx].focus(); choose(idx); }
  };
  document.addEventListener('keydown', onKey);
  return { reveal, opts, answered: () => picked >= 0, picked: () => picked, ok: () => picked >= 0 && opts[picked].ok, destroy() { document.removeEventListener('keydown', onKey); } };
}
