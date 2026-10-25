// The Archive: flashcards · exam traps · trigger words · exam intel · you (rank, achievements, settings).
import { TERMS, PAIRS, TRIGGERS } from '../data/index.js';
import { openScreen } from './screen.js';
import { ICON, marks } from './icons.js';
import { GLYPH } from './glyphs.js';
import { esc, shuffle } from '../core/util.js';
import { state, save, levelOf, LEVELS, BADGES, setSetting, resetAll, emit } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { modal } from './events.js';
import { ZONES } from '../content/zones.js';
import { t, L, isEN, isRTL, lang, setLang } from '../core/i18n.js';
import { mode, setMode } from '../core/mode.js';

const TABS = () => ['cards', 'traps', 'words', 'intel', 'me'].map(id => ({ id, label: t('archive.tab.' + id) }));
/** the stage caption: an English title in both languages, then a line in the current one */
const CAP = { cards: 'Flashcards', traps: 'Exam traps', words: 'Trigger words', intel: 'Exam intel', me: 'You' };
/** set before a language/experience switch from Settings, so the reopened page lands back on Settings */
let backToSettings = false;

export function openArchive(section, world) {
  if (world?.real) world.morph('nebula', { dur: 1.8 });
  const tabs = TABS();
  const scr = openScreen({
    id: 'archive', title: t('archive.title'), en: t('archive.sub'), glyph: 'caliper', color: '#ECE9E2', dark: '#9A9890', tabs,
    onTab(tb, pane, first) {
      history.replaceState(null, '', '#/archive/' + tb);
      scr.setCaption(tabs.findIndex(x => x.id === tb) + 1, CAP[tb], t('archive.cap.' + tb));
      if (tb === 'cards') cards(pane, first);
      if (tb === 'traps' && first) traps(pane);
      if (tb === 'words' && first) words(pane);
      if (tb === 'intel' && first) intel(pane);
      if (tb === 'me') me(pane);
    }
  });
  scr.setTab(tabs.some(x => x.id === section) ? section : 'cards');
  return scr;
}
const head = (n, title, sub) => `<header class="pane__head"><p class="label"><b>${n}</b> ${sub || ''}</p><h2>${title}</h2></header>`;

/* ---------------- flashcards ---------------- */
function cards(pane, first) {
  if (!first && pane._deck) return;
  const S = state(); S.known ||= {};
  let filter = 'all', deck = [], i = 0, flipped = false;
  const LEC = Object.fromEntries(['all', '01', '02', '03', '04', '05'].map(k => [k, t('archive.lec.' + k)]));
  pane.innerHTML = `<div class="wrap">${head(String(TERMS.length), t('archive.cards.title'), t('archive.cards.unit'))}
    <p class="arc__lead">${t('archive.cards.lead')}</p>
    <div class="arc__filters" role="radiogroup">${Object.entries(LEC).map(([k, v]) => `<button type="button" class="chip arc__f" role="radio" data-f="${k}" aria-checked="${k === 'all'}">${v}</button>`).join('')}<button type="button" class="chip arc__f" data-shuffle>${ICON.shuffle} ${t('archive.shuffle')}</button></div>
    <div class="fc" tabindex="0" aria-live="polite"><div class="fc__in"><div class="fc__face fc__front"></div><div class="fc__face fc__back"></div></div></div>
    <div class="fc__bar"><button type="button" class="btn btn--icon" data-a="prev" aria-label="${t('common.prev')}">${ICON.back}</button><span class="hud-num fc__n"></span><button type="button" class="btn btn--icon" data-a="next" aria-label="${t('common.next')}">${ICON.next}</button></div>
    <div class="fc__acts"><button type="button" class="btn" data-a="again">${t('common.notYet')}</button><button type="button" class="btn btn--good" data-a="know">${ICON.check} ${t('archive.know')}</button></div>
    <div class="fc__prog"><span class="label">${t('archive.known')}</span> <b class="hud-num fc__known"></b><div class="bar bar--good"><i></i></div></div>
  </div>`;
  const $ = s => pane.querySelector(s);
  const build = () => { deck = TERMS.filter(x => filter === 'all' || x.lec === filter); deck.sort((a, b) => (S.known[a.t] ? 1 : 0) - (S.known[b.t] ? 1 : 0)); i = 0; draw(); };
  const draw = () => {
    const c = deck[i]; if (!c) return; flipped = false; $('.fc').classList.remove('is-flipped');
    // Arabic: the term + its Arabic name; the back has the slide wording + a simple Arabic line. English: the term; slide wording + a short English line.
    $('.fc__front').innerHTML = `<span class="label">${LEC[c.lec] || ''}</span><b dir="ltr">${esc(c.t)}</b>${isEN() ? '' : `<span class="fc__ar">${esc(c.ar)}</span>`}<span class="fc__hint">${ICON.refresh} ${t('archive.flipHint')}</span>${S.known[c.t] ? `<span class="chip chip--good fc__k">${t('archive.know')}</span>` : ''}`;
    $('.fc__back').innerHTML = `<p dir="ltr">${esc(c.d)}</p><p class="fc__r">${esc(L(c.r, c.rEn))}</p>`;
    $('.fc__n').textContent = `${i + 1}/${deck.length}`;
    const k = TERMS.filter(x => S.known[x.t]).length; $('.fc__known').textContent = `${k}/${TERMS.length}`; $('.fc__prog .bar i').style.setProperty('--p', k / TERMS.length);
  };
  const flip = () => { flipped = !flipped; $('.fc').classList.toggle('is-flipped', flipped); sfx('flip'); };
  $('.fc').addEventListener('click', flip);
  // arrows follow the reading direction: the next card is to the left in Arabic, to the right in English
  $('.fc').addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    const fwd = isRTL() ? 'ArrowLeft' : 'ArrowRight', bwd = isRTL() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === fwd) { i = (i + 1) % deck.length; draw(); }
    if (e.key === bwd) { i = (i - 1 + deck.length) % deck.length; draw(); }
  });
  pane.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a; const c = deck[i];
    if (a === 'next') i = (i + 1) % deck.length;
    if (a === 'prev') i = (i - 1 + deck.length) % deck.length;
    if (a === 'know') { S.known[c.t] = 1; save(); sfx('good'); i = (i + 1) % deck.length; }
    if (a === 'again') { delete S.known[c.t]; save(); sfx('click'); i = (i + 1) % deck.length; }
    draw();
  }));
  pane.querySelectorAll('[data-f]').forEach(b => b.addEventListener('click', () => { filter = b.dataset.f; pane.querySelectorAll('[data-f]').forEach(x => x.setAttribute('aria-checked', String(x === b))); build(); sfx('click'); }));
  $('[data-shuffle]').addEventListener('click', () => { deck = shuffle(deck); i = 0; draw(); sfx('swoosh'); });
  pane._deck = true; build();
}

/* ---------------- traps ---------------- */
function traps(pane) {
  pane.innerHTML = `<div class="wrap">${head(String(PAIRS.length), t('archive.traps.title'), t('archive.traps.unit'))}
    <p class="arc__lead">${t('archive.traps.lead')}</p>
    <div class="traps">${PAIRS.map(([a, ad, b, bd, tip, tipEn], k) => `<article class="trap">
      <span class="hud-num trap__n">${String(k + 1).padStart(2, '0')}</span>
      <div class="trap__ab"><div><b dir="ltr">${esc(a)}</b><p dir="ltr">${esc(ad)}</p></div><span class="trap__vs">vs</span><div><b dir="ltr">${esc(b)}</b><p dir="ltr">${esc(bd)}</p></div></div>
      <p class="trap__tip">${GLYPH.bolt}<span>${esc(L(tip, tipEn))}</span></p></article>`).join('')}</div></div>`;
}

/* ---------------- trigger words ---------------- */
function words(pane) {
  pane.innerHTML = `<div class="wrap">${head(String(TRIGGERS.length), t('archive.words.title'), t('archive.words.unit'))}
    <p class="arc__lead">${t('archive.words.lead')}</p>
    <input class="arc__search" type="search" placeholder="${esc(t('archive.words.ph'))}" aria-label="${esc(t('archive.words.aria'))}">
    <div class="blk-table arc__tbl"><table dir="ltr"><thead><tr><th>If the question says</th><th>Think</th><th>Lec</th></tr></thead><tbody>${TRIGGERS.map(([w, a, l]) => `<tr><td>“${esc(w)}”</td><td><b>${esc(a)}</b></td><td class="hud-num">${l}</td></tr>`).join('')}</tbody></table></div></div>`;
  const rows = [...pane.querySelectorAll('tbody tr')];
  pane.querySelector('.arc__search').addEventListener('input', e => { const v = e.target.value.trim().toLowerCase(); rows.forEach(r => r.hidden = v && !r.textContent.toLowerCase().includes(v)); });
}

/* ---------------- exam intel ---------------- */
function intel(pane) {
  const src = [
    ['BUC · School of Applied Arts programme page (Product Design: PRD003 row)', 'https://buc.edu.eg/new-undergraduate/applied-arts-new-2/'],
    ['BUC Applied Arts student guide, 2021 (assessment rules, grade scale)', 'https://buc.edu.eg/wp-content/uploads/2022/10/12-Students-guide-2021_compressed.pdf'],
    ['BUC teaching, learning and evaluation strategy (quizzes as assessment)', 'https://buc.edu.eg/wp-content/uploads/2022/10/05-Strategy-of-Teaching-Learning-and-Evaluation.pdf'],
    ['BUC Exam Portal (mElimu)', 'https://buc-exam.melimu.com'],
    ['Moodle docs · quiz settings (timer, navigation, review)', 'https://docs.moodle.org/405/en/Quiz_settings']
  ];
  const li = key => t(key).map(x => `<li>${x}</li>`).join('');
  pane.innerHTML = `<div class="wrap intel">${head('2026', t('archive.intel.title'), t('archive.intel.sub'))}
    <section class="intel__sec"><h3><span class="hud-num">01</span> ${t('archive.intel.h1')}</h3><ul class="blk-list blk-list--dot">${li('archive.intel.known')}</ul></section>
    <section class="intel__sec"><h3><span class="hud-num">02</span> ${t('archive.intel.h2')}</h3><ul class="blk-list blk-list--dot">${li('archive.intel.unknown')}</ul></section>
    <section class="intel__sec"><h3><span class="hud-num">03</span> ${t('archive.intel.h3')}</h3><ol class="blk-list blk-list--num">${li('archive.intel.habits')}</ol></section>
    <section class="intel__sec"><h3><span class="hud-num">04</span> ${t('archive.intel.h4')}</h3><ul class="intel__src">${src.map(([s, u]) => `<li><a href="${u}" target="_blank" rel="noopener" dir="ltr">${esc(s)}</a></li>`).join('')}<li dir="ltr">Course slides: Production Engineering, Lectures 1–5 (Prof. Dr. M. Mohamed Ryead), Product Design Dept., 2026–2027.</li></ul></section>
    <a class="btn btn--zone btn--lg" href="#/boss/portal">${t('archive.intel.cta')} ${ICON.next}</a>
  </div>`;
}

/* ---------------- you ---------------- */
function me(pane) {
  const S = state(), lv = levelOf();
  const ex = S.exams; const acc = ex.length ? Math.round(ex.reduce((a, e) => a + e.pct, 0) / ex.length * 100) : null;
  const quiz = ZONES.filter(z => z.tp.length).map(z => ({ z, q: S.quiz[z.id] }));
  const seg = (k, opts, cur) => `<div class="set__seg" role="radiogroup" aria-label="${esc(t('prefs.' + k))}">${opts.map(([v, label, l]) => `<button type="button" class="chip set__opt" role="radio" data-pref="${k}" data-v="${v}" aria-checked="${v === cur}"${l ? ` lang="${l}" dir="${l === 'ar' ? 'rtl' : 'ltr'}"` : ''}>${esc(label)}</button>`).join('')}</div>`;
  pane.innerHTML = `<div class="wrap mep-page">
    <section class="mep__hero"><span class="mep__big">${GLYPH[S.sigil] || GLYPH.circle}</span><div><p class="label">${isEN() ? `Level ${lv.n}` : `Lv ${lv.n} · ${esc(lv.en)}`}</p><h2>${esc(S.name || t('common.guest'))}</h2><p class="mep__rank">${esc(L(lv.ar, lv.en))}</p>
      <div class="mep__xp"><span class="hud-num">${S.xp}</span><span class="label">XP</span><div class="bar"><i style="--p:${lv.pct}"></i></div><span class="label">${lv.next ? t('archive.me.toNext', { n: `<span class="hud-num">${lv.next - S.xp}</span>` }) : t('archive.me.top')}</span></div></div></section>
    <div class="result__stats"><div><span class="label">${t('archive.me.streak')}</span><b class="hud-num">${S.streak.days}</b></div><div><span class="label">${t('archive.me.bestStreak')}</span><b class="hud-num">${S.streak.best}</b></div><div><span class="label">${t('archive.me.exams')}</span><b class="hud-num">${ex.length}</b></div><div><span class="label">${t('archive.me.avg')}</span><b class="hud-num">${acc == null ? '—' : acc + '%'}</b></div></div>
    <section class="mep__sec"><h3>${t('archive.me.ranks')}</h3><ol class="ranks">${LEVELS.map((R, k) => `<li class="${k + 1 < lv.n ? 'is-done' : k + 1 === lv.n ? 'is-now' : ''}"><span class="hud-num">${String(k + 1).padStart(2, '0')}</span><b>${esc(L(R.ar, R.en))}</b>${isEN() ? '' : `<small dir="ltr">${esc(R.en)}</small>`}<span class="hud-num ranks__xp">${R.xp}</span></li>`).join('')}</ol></section>
    <section class="mep__sec"><h3>${t('archive.me.quizMarks')}</h3><div class="mep__quiz">${quiz.map(({ z, q }) => `<a class="mq" href="#/z/${z.id}/quiz" style="--zc:${z.color}"><b>${esc(L(z.ar, z.en))}</b>${marks(q?.stars || 0)}<span class="hud-num">${q ? Math.round(q.best * 100) + '%' : '—'}</span></a>`).join('')}</div></section>
    <section class="mep__sec"><h3>${t('archive.me.badges')} <span class="label"><span class="hud-num">${Object.keys(S.badges).length}/${Object.keys(BADGES).length}</span></span></h3><div class="badges">${Object.entries(BADGES).map(([id, b]) => `<div class="badge ${S.badges[id] ? 'is-on' : ''}"><span class="badge__g">${GLYPH[b.icon] || GLYPH.star}</span><b>${esc(L(b.ar, b.en))}</b><small>${esc(L(b.d, b.dEn))}</small></div>`).join('')}</div></section>
    <section class="mep__sec mep__sec--set"><h3>${t('archive.me.settings')}</h3>
      <div class="set set--pref"><span><b>${t('prefs.lang')}</b><small>${t('archive.set.lang.d')}</small></span>${seg('lang', [['ar', t('prefs.toAR'), 'ar'], ['en', t('prefs.toEN'), 'en']], lang())}</div>
      <div class="set set--pref"><span><b>${t('prefs.mode')}</b><small>${t('archive.set.mode.d')}</small></span>${seg('mode', [['immersive', t('setup.immersive')], ['illustrated', t('setup.illustrated')]], mode())}</div>
      <label class="set"><span><b>${t('archive.set.sound')}</b><small>${t('archive.set.sound.d')}</small></span><input type="checkbox" data-s="sound" ${S.settings.sound ? 'checked' : ''}></label>
      <label class="set"><span><b>${t('archive.set.motion')}</b><small>${t('archive.set.motion.d')}</small></span><input type="checkbox" data-s="motion" ${S.settings.motion === 'reduce' ? 'checked' : ''}></label>
      <div class="set set--danger"><span><b>${t('archive.set.reset')}</b><small>${t('archive.set.reset.d')}</small></span><button type="button" class="btn btn--sm" data-reset>${t('archive.set.resetBtn')}</button></div>
    </section></div>`;
  pane.querySelectorAll('[data-s]').forEach(i => i.addEventListener('change', () => {
    const k = i.dataset.s;
    if (k === 'motion') { setSetting('motion', i.checked ? 'reduce' : 'auto'); document.documentElement.dataset.motion = i.checked ? 'reduce' : ''; }
    else setSetting(k, i.checked);
    sfx('click');
  }));
  // language / experience: the router reopens this page in the new one; land back on Settings
  pane.querySelectorAll('[data-pref]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.v; if (b.getAttribute('aria-checked') === 'true') return;
    sfx('click'); backToSettings = true;
    if (b.dataset.pref === 'lang') setLang(v); else setMode(v);
  }));
  pane.querySelector('[data-reset]').addEventListener('click', () => modal({ glyph: 'infinity', kicker: t('common.confirm'), title: t('archive.reset.title'), body: t('archive.reset.body'), acts: [{ label: t('archive.reset.yes'), primary: true, run: () => { resetAll(); location.hash = '#/'; location.reload(); } }, { label: t('archive.reset.no') }] }));
  if (backToSettings) { backToSettings = false; requestAnimationFrame(() => pane.querySelector('.mep__sec--set')?.scrollIntoView({ block: 'start' })); }
}
