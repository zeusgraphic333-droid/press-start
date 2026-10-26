// A district: Learn (chapters; each can drive a particle scene) · Play (trials) · Test (zone quiz with marks).
import { ZONE, ZONES } from '../content/zones.js';
import { openScreen, capOf } from './screen.js';
import { renderLesson, lessonProgress } from './learn.js';
import { GLYPH, ZONE_GLYPH } from './glyphs.js';
import { ICON, marks } from './icons.js';
import { esc, rich } from '../core/util.js';
import { state, visit, award, emit, on } from '../core/state.js';
import api from '../core/api.js';
import { mountZoneQuiz } from './quiz.js';
import { sfx } from '../core/sfx.js';
import { SCENE_INFO } from '../world/scenes/info.js';
import { ZONE_FORMATION } from '../world/formations.js';
import { t, L, isEN } from '../core/i18n.js';

const TABS = () => [{ id: 'learn', label: t('zone.tab.learn'), icon: 'book' }, { id: 'play', label: t('zone.tab.play'), icon: 'play' }, { id: 'quiz', label: t('zone.tab.quiz'), icon: 'target' }];
const lecOf = z => z.lec ? 'Lecture ' + z.lec : '';

/** content = { lesson, games } */
export function openZone(id, tab = 'learn', origin, content = {}) {
  const z = ZONE[id]; if (!z) return null;
  visit(id);
  if (ZONES.filter(q => q.id !== 'boss').every(q => state().visits[q.id])) award('explorer');
  const lesson = content.lesson || { chapters: [] };
  const games = content.games || [];
  const tabs = TABS();
  const scr = openScreen({
    id: 'zone-' + id, title: L(z.ar, z.en), en: isEN() ? lecOf(z) : z.en + (z.lec ? ' · Lecture ' + z.lec : ''), glyph: ZONE_GLYPH[id],
    color: z.color, dark: z.dark, tabs,
    onTab(tb, pane, first) {
      if (tb === 'learn') { if (first) mountLearn(pane, z, lesson, scr); else scr._sceneNow?.(); }
      if (tb !== 'learn') { emit('scene', { name: ZONE_FORMATION[z.id] }); scr.setCaption(0, ...capOf(SCENE_INFO[ZONE_FORMATION[z.id]])); }
      if (tb === 'play') mountPlay(pane, z, games, first);
      if (tb === 'quiz') mountZoneQuiz(pane, z, first);
      history.replaceState(null, '', `#/z/${id}/${tb}`);
    }
  });
  scr.setCaption(0, ...capOf(SCENE_INFO[ZONE_FORMATION[id]]));
  // a trial can change the scene (api.scene): the caption follows it while the Play tab is showing
  const off = on('scene', ({ name } = {}) => {
    if (!scr.el.isConnected) return off();
    if (name && SCENE_INFO[name] && scr.panes?.play && !scr.panes.play.hidden) scr.setCaption(0, ...capOf(SCENE_INFO[name]));
  });
  scr.setTab(tabs.some(x => x.id === tab) ? tab : 'learn');
  return scr;
}

/** reading time from the words actually on the page (≈ 180 Arabic or 230 English words a minute), plus a little per check/demo */
function readMinutes(lesson) {
  let words = 0, extra = 0;
  const SKIP = new Set(['t', 'id', 'html', 'art', 'svg', 'mount', 'scene', 'ref', 'glyph', 'kind', 'tone', 'color', 'q', 'fig', 'page', 'slide', 'cols', 'who']);
  const add = v => { if (typeof v === 'string') words += v.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; else if (Array.isArray(v)) v.forEach(add); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { if (!SKIP.has(k)) add(x); }); };
  (lesson.chapters || []).forEach(ch => (ch.blocks || []).forEach(b => { if (b.t === 'check') extra += .25; else if (b.t === 'demo') extra += .5; else add(b); }));
  return Math.max(3, Math.round(words / L(180, 230) + extra));
}
function heroHTML(z, lesson) {
  const p = lessonProgress(lesson); const q = state().quiz[z.id];
  const h = lesson.hero || {};
  return `<section class="zhero">
    <p class="zhero__meta"><span class="hud-num">${String(z.n).padStart(2, '0')}</span><span>${lecOf(z)}</span><span class="zhero__tag">${esc(L(z.tag, z.tagEn))}</span></p>
    <h1 class="zhero__title"><span class="mask"><span>${esc(L(z.ar, z.en))}</span></span></h1>
    ${isEN() ? '' : `<p class="zhero__en" dir="ltr">${esc(z.en)}</p>`}
    <p class="zhero__say">${rich(h.say || L(z.blurb, z.blurbEn))}</p>
    <div class="zhero__stats">
      <div class="zstat"><span class="label">${t('zone.lessons')}</span><span class="hud-num zstat__v" data-k="done">${p.done}/${p.total}</span><div class="bar"><i style="--p:${p.pct}"></i></div></div>
      <div class="zstat"><span class="label">${t('zone.quiz')}</span><span class="zstat__v">${marks(q?.stars || 0)}</span><small>${q ? t('zone.best', { n: Math.round(q.best * 100) }) : t('common.notYet')}</small></div>
      <div class="zstat"><span class="label">${t('zone.studyTime')}</span><span class="zstat__v"><span class="hud-num">${readMinutes(lesson)}</span> <small>${t('zone.minutes')}</small></span></div>
    </div>
  </section>`;
}

function mountLearn(pane, z, lesson, scr) {
  pane.innerHTML = `<div class="wrap">${heroHTML(z, lesson)}<div class="learn"></div><div class="learn__end"></div></div>`;
  requestAnimationFrame(() => pane.querySelector('.zhero')?.classList.add('in'));
  const root = pane.querySelector('.learn');
  if (!lesson.chapters?.length) { root.innerHTML = `<div class="card empty">${t('zone.empty')}</div>`; return; }
  const refresh = () => {
    const p = lessonProgress(lesson);
    const v = pane.querySelector('[data-k="done"]'); if (v) { v.textContent = `${p.done}/${p.total}`; v.parentElement.querySelector('.bar i').style.setProperty('--p', p.pct); }
    const end = pane.querySelector('.learn__end');
    end.innerHTML = p.done === p.total ? `<section class="learn__done"><span class="glyph">${GLYPH.star}</span><div><h3>${t('zone.doneTitle', { zone: esc(L(z.ar, z.en)) })}</h3><p>${t('zone.doneText')}</p><div class="learn__acts"><button class="btn btn--zone" data-go="play">${ICON.play} ${t('zone.tab.play')}</button><button class="btn" data-go="quiz">${ICON.target} ${t('zone.tab.quiz')}</button></div></div></section>` : '';
    end.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => pane.closest('.screen').querySelector(`#tab-${b.dataset.go}`)?.click()));
  };
  const clean = renderLesson(root, lesson, z, { onProgress: refresh });
  refresh();
  // each chapter can ask the stage for a scene, and so can a block inside it (`scene: 'name'` on the block):
  // the last waypoint above 35% of the view wins
  const chs = lesson.chapters;
  const steps = [...root.querySelectorAll('.path__step')];
  const marks = [...root.querySelectorAll('.path__step, .path__step [data-scene]')];
  let cur = -1;
  const pick = () => {
    if (pane.hidden) return; // other tabs share the scroller; only the visible lesson drives the stage
    const top = scr.body.getBoundingClientRect().top + scr.body.clientHeight * .35;
    let idx = -1; marks.forEach((s, i) => { if (s.getBoundingClientRect().top < top) idx = i; });
    if (idx === cur) return; cur = idx;
    const m = marks[idx], step = m?.closest('.path__step'), ci = step ? steps.indexOf(step) : -1;
    const ch = ci < 0 ? null : chs[ci];
    const own = m && m !== step ? m.dataset.scene : '';
    const name = own || ch?.scene || ZONE_FORMATION[z.id];
    emit('scene', { name });
    const [title, line] = capOf((own ? SCENE_INFO[own] : ch?.cap || SCENE_INFO[name]) || []);
    scr.setCaption(ci + 1, title, line);
  };
  let tick = 0;
  const onScroll = () => { if (tick) return; tick = requestAnimationFrame(() => { tick = 0; pick(); }); };
  scr.body.addEventListener('scroll', onScroll, { passive: true });
  scr._sceneNow = () => { cur = -2; pick(); };
  pane._cleanup = () => { clean(); scr.body.removeEventListener('scroll', onScroll); };
}

function mountPlay(pane, z, games, first) {
  if (!first && pane._playing) return;
  if (!games.length) { pane.innerHTML = `<div class="wrap"><div class="card empty">${t('zone.noGames')}</div></div>`; return; }
  const list = () => {
    pane._stop?.(); pane._stop = null; pane._playing = false;
    pane.innerHTML = `<div class="wrap"><header class="pane__head"><p class="label"><b>${String(games.length).padStart(2, '0')}</b> ${t('zone.trials', { n: games.length })}</p><h2>${t('zone.playTitle')}</h2><p>${t('zone.playText')}</p></header>
      <div class="gamelist">${games.map((g, i) => { const s = state().games[g.id]; return `<button type="button" class="gamecard" data-i="${i}">
        <span class="gamecard__n hud-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="gamecard__txt"><b>${esc(g.title)}</b>${g.en ? `<bdi class="en" dir="ltr">${esc(g.en)}</bdi>` : ''}<span class="gamecard__how">${rich(g.how || '')}</span></span>
        <span class="gamecard__meta">${s ? marks(s.stars) + `<small>${t('zone.bestScore')} <span class="hud-num">${s.best}</span></small>` : `<span class="chip chip--zone">${t('common.new')}</span>`}</span>
        <span class="gamecard__go">${ICON.next}</span>
      </button>`; }).join('')}</div></div>`;
    pane.querySelectorAll('.gamecard').forEach(b => b.addEventListener('click', () => { sfx('pop'); play(games[+b.dataset.i]); }));
  };
  const play = g => {
    try { pane._stop?.(); } catch (e) { } pane._stop = null;
    pane._playing = true;
    pane.innerHTML = `<div class="wrap gamestage"><div class="gamestage__bar"><button type="button" class="btn btn--sm gamestage__back">${ICON.back} ${t('zone.allTrials')}</button><b>${esc(g.title)}</b></div><div class="gamestage__in"></div></div>`;
    pane.querySelector('.gamestage__back').addEventListener('click', list);
    const st = pane.querySelector('.gamestage__in');
    try { const stop = g.mount(st, api, { zone: z, again: () => play(g), back: list }); pane._stop = typeof stop === 'function' ? stop : null; }
    catch (e) { console.error('game', g.id, e); st.innerHTML = `<p>${t('zone.gameCrash')}</p>`; }
    // phones: the particle band sits above the content, so bring the trial up to the top
    if (matchMedia('(max-width: 980px)').matches) requestAnimationFrame(() => pane.querySelector('.gamestage__bar')?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce' ? 'auto' : 'smooth' }));
  };
  list();
}
