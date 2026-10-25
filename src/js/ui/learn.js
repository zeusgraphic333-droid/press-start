// Renders a zone's lesson (chapters made of blocks). Content lives in content/lessons/<zone>.js.
import { esc, rich } from '../core/util.js';
import { state, markSeen, recordAnswer, award, emit } from '../core/state.js';
import api from '../core/api.js';
import { GLYPH } from './glyphs.js';
import { mountQ } from './qcard.js';
import { ICON } from './icons.js';
import { QBY } from '../data/index.js';
import { confettiAt, burst } from '../core/fx.js';
import { t, isEN } from '../core/i18n.js';

/** who's talking in a `say` block: a named voice, or any GLYPH key (gear, anvil, spring…). 'tint:#hex' colours it. */
const WHO = { usta: 'wrench', boss: 'monolith', press: 'monolith', designer: 'caliper', engineer: 'caliper' };
function voiceGlyph(who = '') { const [w, tint] = who.split('|'); const c = tint ? ` style="color:${tint}"` : ''; return `<span class="glyph"${c}>${GLYPH[WHO[w] || w] || GLYPH.brand}</span>`; }
import { sfx } from '../core/sfx.js';

const T = s => rich(s); // content is trusted, authored in the repo
const hasAR = s => /[\u0600-\u06FF]/.test(s || '');
/** English pages: let each text block find its own direction, so a verbatim Arabic passage still reads right to left (Arabic pages: unchanged) */
const D = () => (isEN() ? ' dir="auto"' : '');

/* ---------- block renderers: each returns HTML; `after` hooks run once mounted ---------- */
const R = {
  say: b => `<div class="blk blk-say">${voiceGlyph(b.who)}<p class="blk-say__txt"${D()}>${T(b.text)}</p></div>`,
  p: b => `<p class="blk blk-p${b.big ? ' blk-p--big' : ''}"${D()}>${T(b.text)}</p>`,
  h: b => `<h4 class="blk blk-h">${T(b.text)}${b.en ? ` <bdi class="en" dir="ltr">${esc(b.en)}</bdi>` : ''}</h4>`,
  quote: b => `<figure class="blk blk-quote" dir="ltr"><figcaption><span class="blk-quote__tag">${ICON.book}<span dir="${isEN() ? 'ltr' : 'rtl'}">${t('learn.fromSlide')}</span></span>${b.ref ? `<span class="blk-quote__ref">${esc(b.ref)}</span>` : ''}</figcaption><blockquote${hasAR(b.text) ? ' dir="rtl" lang="ar"' : ''}>${T(b.text)}</blockquote>${b.ar ? `<p class="blk-quote__ar" dir="${hasAR(b.ar) ? 'rtl' : 'ltr'}">${T(b.ar)}</p>` : ''}</figure>`,
  list: b => `<${b.style === 'num' ? 'ol' : 'ul'} class="blk blk-list blk-list--${b.style || 'dot'}">${(b.items || []).map(i => `<li${D()}>${T(i)}</li>`).join('')}</${b.style === 'num' ? 'ol' : 'ul'}>`,
  example: b => `<div class="blk blk-ex"><span class="blk-tag blk-tag--ex">${GLYPH.target}${t('learn.example')}</span>${b.art ? `<div class="blk-ex__art">${b.art}</div>` : ''}<div class="blk-ex__body">${b.title ? `<h5>${T(b.title)}</h5>` : ''}<p${D()}>${T(b.text)}</p></div></div>`,
  why: b => `<div class="blk blk-why"><span class="blk-tag blk-tag--why">${GLYPH.gear}${t('learn.why')}</span><p${D()}>${T(b.text)}</p></div>`,
  trap: b => `<div class="blk blk-trap"><span class="blk-tag blk-tag--trap">${GLYPH.triangle}${t('learn.trap')}</span><p${D()}>${T(b.text)}</p>${b.wrong || b.right ? `<div class="blk-trap__ab">${b.wrong ? `<div class="blk-trap__w">${ICON.x}<span>${T(b.wrong)}</span></div>` : ''}${b.right ? `<div class="blk-trap__r">${ICON.check}<span>${T(b.right)}</span></div>` : ''}</div>` : ''}</div>`,
  tip: b => `<div class="blk blk-tip"><span class="blk-tag blk-tag--tip">${GLYPH.bolt}${t('learn.tip')}</span><p${D()}>${T(b.text)}</p></div>`,
  art: b => `<figure class="blk blk-art${b.wide ? ' blk-art--wide' : ''}${b.bg === false ? ' blk-art--bare' : ''}">${b.html}${b.caption ? `<figcaption>${T(b.caption)}</figcaption>` : ''}</figure>`,
  compare: b => `<div class="blk blk-cmp">${['left', 'right'].map(k => { const s = b[k] || {}; return `<div class="blk-cmp__side blk-cmp__side--${k}">${s.art ? `<div class="blk-cmp__art">${s.art}</div>` : ''}<h5>${T(s.title || '')}${s.en ? ` <bdi class="en" dir="ltr">${esc(s.en)}</bdi>` : ''}</h5><p${D()}>${T(s.text || '')}</p></div>`; }).join('<div class="blk-cmp__vs" aria-hidden="true">VS</div>')}${b.note ? `<p class="blk-cmp__note">${T(b.note)}</p>` : ''}</div>`,
  grid: b => `<div class="blk blk-grid${b.flip ? ' blk-grid--flip' : ''}" style="--cols:${b.cols || 3}">${(b.items || []).map((it, i) => b.flip
    ? `<button type="button" class="gcard gcard--flip" style="--gc:${it.color || 'var(--zc)'}" aria-pressed="false"><span class="gcard__in"><span class="gcard__front">${it.art ? `<span class="gcard__art">${it.art}</span>` : ''}<b>${T(it.title)}</b>${it.en ? `<bdi class="en" dir="ltr">${esc(it.en)}</bdi>` : ''}<span class="gcard__hint">${ICON.refresh} ${t('learn.flip')}</span></span><span class="gcard__back"><span class="gcard__txt">${T(it.text)}</span></span></span></button>`
    : `<div class="gcard" style="--gc:${it.color || 'var(--zc)'}">${it.art ? `<div class="gcard__art">${it.art}</div>` : ''}<b>${T(it.title)}</b>${it.en ? `<bdi class="en" dir="ltr">${esc(it.en)}</bdi>` : ''}${it.text ? `<p>${T(it.text)}</p>` : ''}</div>`).join('')}</div>`,
  table: b => `<div class="blk blk-table"><table${b.dir ? ` dir="${b.dir}"` : ''}><thead><tr>${b.head.map(h => `<th scope="col">${T(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${T(c)}</td>` : `<th scope="row">${T(c)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`,
  demo: b => `<div class="blk blk-demo"><div class="blk-demo__head"><span class="blk-tag blk-tag--demo">${ICON.play}${t('learn.demo')}</span>${b.title ? `<h5>${T(b.title)}</h5>` : ''}</div><div class="blk-demo__stage" data-demo="${esc(b.id || '')}"></div>${b.caption ? `<p class="blk-demo__cap">${T(b.caption)}</p>` : ''}</div>`,
  check: b => QBY[b.q] ? `<div class="blk blk-check"><div class="blk-check__card" data-q="${esc(b.q)}"></div></div>` : `<!-- missing question ${esc(b.q)} -->`,
  fig: b => `<figure class="blk blk-art">${api.fig(b.id)}${b.caption ? `<figcaption>${T(b.caption)}</figcaption>` : ''}</figure>`,
  divider: () => `<hr class="blk blk-hr">`
};

export function chapterDone(ch) { return !!state().seen[ch.id]; }
export function lessonProgress(lesson) { const n = lesson?.chapters?.length || 0; const d = (lesson?.chapters || []).filter(chapterDone).length; return { done: d, total: n, pct: n ? d / n : 0 }; }

/** mounts all chapters; returns cleanup */
export function renderLesson(root, lesson, zone, { onProgress } = {}) {
  const cleanups = [];
  const chs = lesson.chapters || [];
  root.innerHTML = `<ol class="path" role="list">${chs.map((ch, i) => `
    <li class="path__step ${chapterDone(ch) ? 'is-done' : ''}" id="ch-${esc(ch.id)}">
      <div class="path__node" aria-hidden="true" data-done="${esc(t('learn.doneMark'))}"><span class="hud-num">${String(i + 1).padStart(2, '0')}</span></div>
      <article class="chap" aria-labelledby="h-${esc(ch.id)}">
        <header class="chap__head">
          <div><h3 id="h-${esc(ch.id)}">${T(ch.title)}</h3>${ch.en ? `<p class="chap__en" dir="ltr">${esc(ch.en)}</p>` : ''}</div>
          ${ch.ref ? `<span class="chip chap__ref" dir="ltr">${esc(ch.ref)}</span>` : ''}
        </header>
        <div class="chap__body">${(ch.blocks || []).map(b => (R[b.t] || (() => ''))(b)).join('')}</div>
        <footer class="chap__foot">
          <button type="button" class="btn btn--good chap__done" ${chapterDone(ch) ? 'disabled' : ''}>${chapterDone(ch) ? `${ICON.check} ${t('learn.done')}` : `${t('learn.next')} <span class="xp" dir="ltr">+20 XP</span>`}</button>
        </footer>
      </article>
    </li>`).join('')}</ol>`;

  // flip cards
  root.querySelectorAll('.gcard--flip').forEach(c => c.addEventListener('click', () => { const on = c.classList.toggle('is-flipped'); c.setAttribute('aria-pressed', on); sfx('flip'); }));
  // demos
  chs.forEach(ch => (ch.blocks || []).forEach(b => {
    if (b.t !== 'demo' || typeof b.mount !== 'function') return;
    const st = root.querySelector(`#ch-${CSS.escape(ch.id)} .blk-demo__stage[data-demo="${CSS.escape(b.id || '')}"]`);
    if (!st) return;
    try { const c = b.mount(st, api); if (typeof c === 'function') cleanups.push(c); } catch (e) { console.error('demo', b.id, e); st.innerHTML = `<p>${t('learn.demoCrash')}</p>`; }
  }));
  // quick checks
  root.querySelectorAll('.blk-check__card').forEach(card => {
    const q = QBY[card.dataset.q];
    const h = mountQ(card, q, {
      label: t('learn.check'),
      onAnswer(ok, i, qq, btn) {
        const first = !(q.id in state().checks);
        if (first) { state().checks[q.id] = ok ? 1 : 0; }
        recordAnswer(q.id, ok);
        if (ok) { sfx('good'); burst(btn, '#2BD49A'); if (first) api.award(15, { from: btn, why: 'check' }); }
        else sfx('bad');
        emit('progress');
      }
    });
    cleanups.push(h.destroy);
  });
  // chapter done
  root.querySelectorAll('.chap__done').forEach((btn, i) => btn.addEventListener('click', () => {
    const ch = chs[i];
    if (markSeen(ch.id)) {
      api.award(20, { from: btn, why: 'chapter' }); confettiAt(btn, 30);
      btn.disabled = true; btn.innerHTML = `${ICON.check} ${t('learn.done')}`;
      btn.closest('.path__step').classList.add('is-done');
      if (chs.every(chapterDone)) { award('reader'); }
      onProgress?.();
    }
    const next = root.querySelectorAll('.path__step')[i + 1];
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  return () => cleanups.forEach(f => { try { f(); } catch (e) { } });
}
