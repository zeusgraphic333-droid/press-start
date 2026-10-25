// The Exam: a boss fight, a timed portal-style exam (20/20 · 40/40), and revenge on your own mistakes.
import gsap from 'gsap';
import { QUESTIONS, QBY, TOPIC_NAME, TOPIC_ZONE, optionsOf } from '../data/index.js';
import { ZONE, ZONES } from '../content/zones.js';
import { openScreen, currentScreen, capOf } from './screen.js';
import { mountQ } from './qcard.js';
import { ICON, marks } from './icons.js';
import { GLYPH } from './glyphs.js';
import { esc, shuffle, mmss, sleep, pick, qtext } from '../core/util.js';
import { state, recordAnswer, addXP, award, save, emit, levelOf } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { confetti, burst, floatFrom, shake } from '../core/fx.js';
import { modal } from './events.js';
import { t, L, isEN } from '../core/i18n.js';
import { SCENE_INFO } from '../world/scenes/info.js';

const RED = '#FF3B30';
/** the exam covers every topic of every zone that has questions */
const inScope = () => ZONES.flatMap(z => z.tp).filter(tp => QUESTIONS.some(q => q.tp === tp));

/** a balanced paper: topic quotas ∝ bank size, difficulty ≈ 40/40/20, ordered easy → hard */
export function buildExam(n) {
  const topics = inScope(); const S = state();
  const pools = topics.map(tp => QUESTIONS.filter(q => q.tp === tp));
  const total = pools.reduce((a, p) => a + p.length, 0);
  const raw = pools.map(p => n * p.length / total);
  const quota = raw.map(v => Math.max(1, Math.floor(v)));
  let left = n - quota.reduce((a, b) => a + b, 0);
  raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { quota[i]++; left--; } });
  while (left < 0) { const i = quota.indexOf(Math.max(...quota)); quota[i]--; left++; }
  const weight = q => (S.wrong[q.id] ? 2 : 0) + Math.random() * 2;
  const out = [];
  pools.forEach((p, i) => {
    const want = quota[i]; const by = lv => shuffle(p.filter(q => q.lv === lv)).sort((a, b) => weight(b) - weight(a));
    const k1 = Math.round(want * .4), k3 = Math.round(want * .2), k2 = want - k1 - k3;
    let picked = [...by(1).slice(0, k1), ...by(2).slice(0, k2), ...by(3).slice(0, k3)];
    if (picked.length < want) picked.push(...shuffle(p.filter(q => !picked.includes(q))).slice(0, want - picked.length));
    out.push(...picked);
  });
  return out.sort((a, b) => a.lv - b.lv || Math.random() - .5);
}
/** BUC grade scale (2021 student guide) */
export function grade(pct) { const s = pct * 100; return s >= 95 ? 'A' : s >= 90 ? 'A−' : s >= 87 ? 'B+' : s >= 80 ? 'B' : s >= 76 ? 'B−' : s >= 73 ? 'C+' : s >= 70 ? 'C' : s >= 67 ? 'C−' : s >= 64 ? 'D+' : s >= 60 ? 'D' : 'F'; }

let worldRef = null;
export function openBoss(mode, world) {
  worldRef = world;
  const scr = openScreen({ id: 'boss', title: t('boss.title'), en: t('boss.sub'), glyph: 'monolith', color: RED, dark: '#B3201A' });
  scr.setCaption(0, ...capOf(SCENE_INFO.monolith));
  if (world?.real && world.current !== 'monolith') world.morph('monolith', { dur: 1.6 });
  const pane = scr.panes.main;
  const go = m => { location.hash = m ? '#/boss/' + m : '#/boss'; };
  if (mode === 'fight') return bossFight(pane, scr, go);
  if (mode === 'portal') return portal(pane, scr, 20, go);
  if (mode === 'full') return portal(pane, scr, 40, go);
  if (mode === 'revenge') return revenge(pane, scr, go);
  return menu(pane, go);
}

/* ---------------- menu ---------------- */
function menu(pane, go) {
  const S = state(); const wrongN = Object.keys(S.wrong).length; const last = S.exams[S.exams.length - 1];
  const mode = (k, n, meta) => ({ k, n, t: t('boss.' + k), en: t(`boss.${k}.en`), d: t(`boss.${k}.d`), meta });
  const modes = [
    mode('fight', '01', S.boss.wins ? t('boss.beaten', { n: S.boss.wins }) : t('boss.unbeaten')),
    mode('portal', '02', last ? t('boss.lastTry', { n: Math.round(last.pct * 100) }) : t('common.new')),
    mode('full', '03', ''),
    mode('revenge', '04', wrongN ? t('boss.wrongWaiting', { n: wrongN }) : t('boss.noWrong'))
  ];
  pane.innerHTML = `<div class="wrap">
    <section class="zhero in">
      <p class="zhero__meta"><span class="hud-num">${String(ZONE.boss.n).padStart(2, '0')}</span><span>${t('boss.place')}</span><span class="zhero__tag">${t('boss.tag')}</span></p>
      <h1 class="zhero__title"><span class="mask"><span>${t('boss.title')}</span></span></h1>
      ${isEN() ? '' : `<p class="zhero__en" dir="ltr">${ZONE.boss.en}</p>`}
      <p class="zhero__say">${t('boss.say')}</p>
      <div class="zhero__stats">
        <div class="zstat"><span class="label">${t('boss.wins')}</span><span class="hud-num zstat__v">${S.boss.wins}</span></div>
        <div class="zstat"><span class="label">${t('boss.bestExam')}</span><span class="hud-num zstat__v">${S.exams.length ? Math.round(Math.max(...S.exams.map(e => e.pct)) * 100) + '%' : '—'}</span></div>
        <div class="zstat"><span class="label">${t('boss.openMistakes')}</span><span class="hud-num zstat__v">${wrongN}</span></div>
      </div>
    </section>
    <div class="gamelist">${modes.map(m => `<button type="button" class="gamecard" data-k="${m.k}">
      <span class="gamecard__n hud-num">${m.n}</span>
      <span class="gamecard__txt"><b>${m.t}</b><bdi class="en" dir="ltr">${m.en}</bdi><span class="gamecard__how">${m.d}</span></span>
      <span class="gamecard__meta"><small>${m.meta}</small></span><span class="gamecard__go">${ICON.next}</span></button>`).join('')}</div>
  </div>`;
  pane.querySelectorAll('.gamecard').forEach(b => b.addEventListener('click', () => { sfx('pop'); go(b.dataset.k); }));
}

/* ---------------- boss fight ---------------- */
/** the exam talks back (lines live in strings.js: boss.taunt.start · hit · low · miss) */
const TAUNT = k => t('boss.taunt.' + k);
function bossFight(pane, scr, go) {
  const S = state(); S.boss.tries++; save();
  const pool = QUESTIONS.filter(q => inScope().includes(q.tp));
  const weight = q => (S.wrong[q.id] ? 2.5 : 0) + (q.id in S.checks ? 0 : .8) + Math.random() * 2;
  const deck = [...shuffle(pool.filter(q => q.lv < 3)).sort((a, b) => weight(b) - weight(a)).slice(0, 8), ...shuffle(pool.filter(q => q.lv >= 2)).sort((a, b) => weight(b) - weight(a)).slice(0, 22)];
  const seen = new Set(); const qs = deck.filter(q => !seen.has(q.id) && seen.add(q.id));
  let hp = 100, lives = 3, combo = 0, i = 0, hits = 0, misses = 0, timer = null, tLeft = 30, over = false; const t0 = Date.now(); const missed = [];
  pane.innerHTML = `<div class="wrap fight">
    <div class="fight__top">
      <div class="fight__boss"><span class="glyph fight__glyph">${GLYPH.monolith}</span><div class="fight__hp"><div class="fight__hpl"><b>${t('boss.title')}</b><span class="hud-num fight__hpn">100</span></div><div class="fight__bar"><i style="--p:1"></i><i class="fight__ghost" style="--p:1"></i></div></div></div>
      <div class="fight__me"><span class="fight__lives" aria-label="${t('boss.lives')}">${'<i></i>'.repeat(3)}</span><span class="fight__combo" hidden>${GLYPH.flame}<b class="hud-num">0</b></span></div>
    </div>
    <p class="fight__taunt">${pick(TAUNT('start'))}</p>
    <div class="g-timer fight__timer"><i style="--t:1"></i></div>
    <div class="qrun__card fight__card"></div>
    <div class="qrun__acts"><button type="button" class="btn btn--zone fight__next" hidden>${t('common.next')} ${ICON.next}</button></div>
  </div>`;
  const $ = s => pane.querySelector(s);
  const card = $('.fight__card'), next = $('.fight__next'); let h = null;
  const taunt = arr => { const t = $('.fight__taunt'); t.textContent = pick(arr); t.classList.remove('in'); void t.offsetWidth; t.classList.add('in'); };
  const setTimer = () => { clearInterval(timer); tLeft = 30; $('.fight__timer i').style.setProperty('--t', 1); timer = setInterval(() => { tLeft -= .1; $('.fight__timer i').style.setProperty('--t', Math.max(0, tLeft / 30)); if (tLeft <= 5 && Math.abs(tLeft - Math.round(tLeft)) < .05) sfx('tick'); if (tLeft <= 0) { clearInterval(timer); timeout(); } }, 100); };
  const timeout = () => { if (h && !h.answered()) { h.reveal(); resolve(false, card); } };
  function show() {
    if (over) return;
    if (i >= qs.length) return end(hp <= 0);
    h?.destroy(); next.hidden = true;
    card.innerHTML = '<div></div>'; card.classList.add('qc--focus');
    h = mountQ(card.firstChild, qs[i], { label: t('boss.strike', { n: i + 1 }), onAnswer: (ok, idx, q, btn) => resolve(ok, btn) });
    setTimer();
  }
  function resolve(ok, btn) {
    clearInterval(timer); const q = qs[i]; recordAnswer(q.id, ok);
    if (ok) {
      hits++; combo++; const dmg = 9 + Math.min(combo - 1, 5) * 2; hp = Math.max(0, hp - dmg);
      sfx('hit'); burst(btn, '#FF3B30', 16); floatFrom($('.fight__hpn'), '−' + dmg, 'fx-float--bad');
      worldRef?.scatter?.(.22, { out: .14, back: .9 }); worldRef?.flash?.('#FF3B30', .12);
      $('.fight__bar i').style.setProperty('--p', hp / 100); setTimeout(() => $('.fight__bar .fight__ghost')?.style.setProperty('--p', hp / 100), 450);
      $('.fight__hpn').textContent = hp; taunt(TAUNT(hp < 35 ? 'low' : 'hit'));
      const c = $('.fight__combo'); c.hidden = combo < 2; c.querySelector('b').textContent = '×' + combo;
      if (hp <= 0) { over = true; return setTimeout(() => end(true), 900); }
      next.hidden = false; setTimeout(() => { if (!over && h?.answered()) { i++; show(); } }, 1600);
    } else {
      misses++; combo = 0; lives--; missed.push(q); $('.fight__combo').hidden = true;
      sfx('roar'); shake(card); worldRef?.flash?.('#FF3B30', .32);
      const L = [...pane.querySelectorAll('.fight__lives i')]; L[lives]?.classList.add('is-lost');
      taunt(TAUNT('miss'));
      if (lives <= 0) { over = true; next.hidden = false; next.innerHTML = `${t('common.results')} ${ICON.next}`; next.onclick = () => end(false); return; }
      next.hidden = false;
    }
    next.innerHTML = `${t('common.next')} ${ICON.next}`; next.onclick = () => { i++; show(); };
    setTimeout(() => next.focus({ preventScroll: true }), 40);
  }
  function end(won) {
    clearInterval(timer); h?.destroy(); over = true;
    const secs = Math.round((Date.now() - t0) / 1000);
    let xp = hits * 6;
    if (won) { S.boss.wins++; S.boss.best = Math.max(S.boss.best, hits); xp += 150; award('boss'); }
    save(); addXP(xp, 'boss');
    if (won) { sfx('win'); confetti({ big: true }); worldRef?.scatter?.(1.4, { out: .7, back: 2.6 }); } else { sfx('lose'); }
    pane.innerHTML = `<div class="wrap"><section class="result ${won ? 'is-win' : 'is-lose'}">
      <p class="label">${t(won ? 'boss.win' : 'boss.lose')} · ${t('boss.fight')}</p>
      <h1 class="result__big">${t(won ? 'boss.winBig' : 'boss.loseBig')}</h1>
      <p class="result__line">${t(won ? 'boss.winLine' : 'boss.loseLine')}</p>
      <div class="result__stats"><div><span class="label">${t('boss.hits')}</span><b class="hud-num">${hits}</b></div><div><span class="label">${t('boss.misses')}</span><b class="hud-num">${misses}</b></div><div><span class="label">${t('boss.time')}</span><b class="hud-num">${mmss(secs)}</b></div><div><span class="label">XP</span><b class="hud-num">+${xp}</b></div></div>
      <div class="result__acts"><button type="button" class="btn btn--zone" data-a="again">${ICON.refresh} ${t('boss.again')}</button><button type="button" class="btn" data-a="menu">${t('boss.allModes')}</button>${missed.length ? `<button type="button" class="btn" data-a="revenge">${GLYPH.infinity.replace('<svg', '<svg width="20" height="20"')} ${t('boss.takeRevenge')}</button>` : ''}</div>
      ${reviewHTML(missed)}
    </section></div>`;
    pane.querySelector('[data-a="again"]').onclick = () => bossFight(pane, scr, go);
    pane.querySelector('[data-a="menu"]').onclick = () => go('');
    pane.querySelector('[data-a="revenge"]')?.addEventListener('click', () => go('revenge'));
    if (worldRef?.real) setTimeout(() => worldRef.morph(won ? 'nebula' : 'monolith', { dur: 2.4 }), won ? 1800 : 0);
    emit('progress');
  }
  show();
  scr.cleanups.push(() => { clearInterval(timer); h?.destroy(); over = true; });
}

/* ---------------- portal exam ---------------- */
const portalActs = () => `<div class="portal__acts"><button type="button" class="btn btn--sm" data-a="prev">${ICON.back} ${t('boss.prevQ')}</button><button type="button" class="btn btn--sm portal__flag" data-a="flag">${ICON.flag} ${t('boss.flag')}</button><button type="button" class="btn btn--zone" data-a="next">${t('boss.nextQ')} ${ICON.next}</button></div>`;
function portal(pane, scr, n, go) {
  const qs = buildExam(n); const opts = qs.map(q => optionsOf(q));
  const ans = new Array(qs.length).fill(-1), flag = new Array(qs.length).fill(false);
  const limit = n * 60; let left = limit, cur = 0, timer = null, h = null, done = false; const t0 = Date.now();
  pane.innerHTML = `<div class="wrap wrap--wide portal">
    <div class="portal__head">
      <div><p class="label">${t(n === 20 ? 'boss.portal' : 'boss.full')} · ${t('boss.nQ', { n })}</p><h2 class="portal__qn">${t('boss.qOf', { i: '<span class="hud-num">1</span>', n: `<span class="hud-num">${n}</span>` })}</h2></div>
      <div class="portal__clock"><span class="label">${t('boss.timeLeft')}</span><b class="hud-num portal__time">${mmss(left)}</b></div>
    </div>
    <div class="portal__grid">
      <div class="portal__main"><div class="qrun__card portal__card"></div>
        ${portalActs()}</div>
      <aside class="portal__nav"><p class="label">${t('boss.questions')}</p><div class="portal__dots">${qs.map((_, k) => `<button type="button" class="pdot" data-k="${k}" aria-label="${t('boss.q', { n: k + 1 })}"><span class="hud-num">${k + 1}</span></button>`).join('')}</div>
        <p class="portal__legend"><span><i class="pdot is-ans"></i> ${t('boss.answered')}</span><span><i class="pdot is-flag"></i> ${t('boss.flagged')}</span></p>
        <button type="button" class="btn btn--block" data-a="summary">${t('boss.finish')}</button></aside>
    </div></div>`;
  const $ = s => pane.querySelector(s);
  const paintNav = () => pane.querySelectorAll('.pdot[data-k]').forEach((d, k) => { d.classList.toggle('is-ans', ans[k] >= 0); d.classList.toggle('is-flag', flag[k]); d.classList.toggle('is-cur', k === cur); });
  function show(k) {
    cur = Math.max(0, Math.min(qs.length - 1, k)); h?.destroy();
    const card = $('.portal__card'); card.innerHTML = '<div></div>'; card.classList.add('qc--focus');
    h = mountQ(card.firstChild, qs[cur], { instant: false, opts: opts[cur], picked: ans[cur], label: t('boss.q', { n: cur + 1 }), onAnswer: (ok, idx) => { ans[cur] = idx; paintNav(); sfx('click'); } });
    $('.portal__qn .hud-num').textContent = cur + 1;
    $('.portal__flag').classList.toggle('is-on', flag[cur]);
    $('[data-a="next"]').innerHTML = cur === qs.length - 1 ? `${t('boss.reviewPage')} ${ICON.next}` : `${t('boss.nextQ')} ${ICON.next}`;
    paintNav(); scr.body.scrollTop = 0;
  }
  pane.addEventListener('click', e => {
    const b = e.target.closest('[data-a], .pdot[data-k]'); if (!b || done) return;
    if (b.dataset.k) return show(+b.dataset.k);
    const a = b.dataset.a;
    if (a === 'prev') show(cur - 1);
    if (a === 'next') { if (cur === qs.length - 1) summary(); else show(cur + 1); }
    if (a === 'flag') { flag[cur] = !flag[cur]; b.classList.toggle('is-on', flag[cur]); paintNav(); sfx('flip'); }
    if (a === 'summary') summary();
  });
  function summary() {
    h?.destroy(); const unanswered = ans.filter(a => a < 0).length;
    $('.portal__main').innerHTML = `<div class="portal__sum"><h3>${t('boss.summary')}</h3><p>${unanswered ? `<b class="bad">${t('boss.unanswered', { n: unanswered })}</b> ${t('boss.unansweredNote')}` : t('boss.allAnswered')}</p>
      <table class="portal__tbl"><thead><tr><th>${t('boss.thQ')}</th><th>${t('boss.thStatus')}</th></tr></thead><tbody>${qs.map((q, k) => `<tr><td><button type="button" class="linkish" data-go="${k}">${t('boss.q', { n: `<span class="hud-num">${k + 1}</span>` })}</button></td><td>${ans[k] >= 0 ? t('boss.answered') : `<b class="bad">${t('boss.notAnswered')}</b>`}${flag[k] ? ` · <span class="flagged">${t('boss.flagged')}</span>` : ''}</td></tr>`).join('')}</tbody></table>
      <div class="portal__acts"><button type="button" class="btn" data-back>${t('boss.backToQs')}</button><button type="button" class="btn btn--zone" data-submit>${t('boss.submitAll')}</button></div></div>`;
    $('.portal__main').querySelectorAll('[data-go]').forEach(b => b.onclick = () => { restore(); show(+b.dataset.go); });
    $('[data-back]').onclick = () => { restore(); show(cur); };
    $('[data-submit]').onclick = () => modal({ glyph: 'monolith', kicker: t('common.confirm'), title: t('boss.confirmTitle'), body: t('boss.confirmBody'), acts: [{ label: t('boss.submit'), primary: true, run: () => submit() }, { label: t('common.notYet') }] });
  }
  function restore() {
    $('.portal__main').innerHTML = `<div class="qrun__card portal__card"></div>${portalActs()}`;
  }
  timer = setInterval(() => { left--; const t = $('.portal__time'); if (t) { t.textContent = mmss(left); t.classList.toggle('is-low', left <= 120); } if (left <= 0) { clearInterval(timer); submit(true); } }, 1000);
  scr.cleanups.push(() => { clearInterval(timer); h?.destroy(); });
  function submit(timeUp) {
    if (done) return; done = true; clearInterval(timer); h?.destroy();
    const secs = Math.min(limit, Math.round((Date.now() - t0) / 1000));
    const res = qs.map((q, k) => ({ q, ok: ans[k] >= 0 && opts[k][ans[k]].ok, picked: ans[k] >= 0 ? opts[k][ans[k]].text : null }));
    res.forEach(r => recordAnswer(r.q.id, r.ok));
    const score = res.filter(r => r.ok).length, pct = score / qs.length;
    const byTp = {}; res.forEach(r => { const t = byTp[r.q.tp] ||= { ok: 0, n: 0 }; t.n++; if (r.ok) t.ok++; });
    const S = state(); S.exams.push({ mode: n === 20 ? 'portal' : 'full', at: Date.now(), n, score, pct, secs, byTp }); if (S.exams.length > 30) S.exams.shift(); save();
    if (pct >= .8) award('portal');
    const xp = score * 4 + (pct >= .9 ? 60 : pct >= .8 ? 40 : pct >= .6 ? 20 : 0); addXP(xp, 'exam');
    results(pane, { res, score, pct, secs, byTp, n, timeUp, xp }, go);
    emit('progress');
  }
  show(0);
}

/* ---------------- results ("wrapped") ---------------- */
function results(pane, r, go) {
  const g = grade(r.pct); const lv = levelOf();
  const tps = Object.entries(r.byTp).map(([tp, v]) => ({ tp, ...v, pct: v.ok / v.n })).sort((a, b) => b.pct - a.pct || b.n - a.n);
  const best = tps[0], worst = tps[tps.length - 1];
  const verdict = t(r.pct >= .9 ? 'boss.v.90' : r.pct >= .75 ? 'boss.v.75' : r.pct >= .6 ? 'boss.v.60' : 'boss.v.low');
  const tpName = tp => L(TOPIC_NAME[tp]?.[0], TOPIC_NAME[tp]?.[1]);
  const wrong = r.res.filter(x => !x.ok);
  pane.innerHTML = `<div class="wrap result">
    ${r.timeUp ? `<p class="chip chip--bad">${t('boss.timeUp')}</p>` : ''}
    <p class="label">${t('common.results')} · ${t(r.n === 20 ? 'boss.portal' : 'boss.full')}</p>
    <div class="result__hero"><div class="result__pct"><span class="hud-num">${Math.round(r.pct * 100)}</span><span class="hud-num result__pc">%</span></div><div class="result__grade"><span class="label">${t('boss.grade')}</span><b class="hud-num" dir="ltr">${g}</b></div></div>
    <p class="result__line">${verdict}</p>
    <div class="result__stats"><div><span class="label">${t('boss.correct')}</span><b class="hud-num">${r.score}/${r.n}</b></div><div><span class="label">${t('boss.time')}</span><b class="hud-num">${mmss(r.secs)}</b></div><div><span class="label">${t('boss.perQ')}</span><b class="hud-num">${Math.round(r.secs / r.n)}s</b></div><div><span class="label">XP</span><b class="hud-num">+${r.xp}</b></div></div>
    <div class="result__tps"><h3>${t('boss.inside')}</h3>${tps.map(x => `<div class="tprow"><span class="tprow__n">${esc(tpName(x.tp) || x.tp)}</span><div class="bar"><i style="--p:${x.pct}"></i></div><span class="hud-num">${x.ok}/${x.n}</span></div>`).join('')}</div>
    <div class="result__cards">
      <div class="rcard"><span class="label">${t('boss.strong')}</span><b>${esc(tpName(best.tp) || '')}</b><span class="hud-num">${Math.round(best.pct * 100)}%</span></div>
      <div class="rcard rcard--weak"><span class="label">${t('boss.weak')}</span><b>${esc(tpName(worst.tp) || '')}</b><span class="hud-num">${Math.round(worst.pct * 100)}%</span>${worst.pct < 1 ? `<a class="btn btn--sm" href="#/z/${TOPIC_ZONE[worst.tp]}/learn">${t('boss.goReview')} ${ICON.next}</a>` : ''}</div>
      <div class="rcard"><span class="label">${t('boss.rankNow')}</span><b>${esc(L(lv.ar, lv.en))}</b><span class="hud-num">Lv ${lv.n}</span></div>
    </div>
    <div class="result__acts"><button type="button" class="btn btn--zone" data-a="again">${ICON.refresh} ${t('boss.newExam')}</button>${wrong.length ? `<button type="button" class="btn" data-a="revenge">${t('boss.takeRevenge')}</button>` : ''}<button type="button" class="btn" data-a="menu">${t('boss.allModes')}</button></div>
    ${reviewHTML(wrong.map(x => x.q), wrong.map(x => x.picked))}
  </div>`;
  if (r.pct >= .8) { sfx('win'); confetti({ big: r.pct >= .9 }); } else sfx('boop');
  pane.querySelector('[data-a="again"]').onclick = () => { location.hash = '#/boss'; setTimeout(() => location.hash = r.n === 20 ? '#/boss/portal' : '#/boss/full', 30); };
  pane.querySelector('[data-a="menu"]').onclick = () => go('');
  pane.querySelector('[data-a="revenge"]')?.addEventListener('click', () => go('revenge'));
  pane.closest('.screen__body').scrollTop = 0;
}
function reviewHTML(qs, picks = []) {
  if (!qs.length) return '';
  // Arabic: the Arabic explanation, then the slide-English one in small print. English: just the English one.
  const why = q => isEN() ? `<p>${esc(q.e || '')}</p>` : `<p>${esc(q.r || '')}</p><p class="rev__e" dir="ltr">${esc(q.e || '')}</p>`;
  return `<div class="qend__review"><h4>${t('boss.reviewMistakes')} <span class="label">${t('boss.nQ', { n: qs.length })}</span></h4>${qs.map((q, k) => `<details class="rev"><summary dir="ltr">${qtext(q.q)}</summary>${picks[k] ? `<p dir="ltr" class="rev__x">✕ ${esc(picks[k])}</p>` : ''}<p dir="ltr" class="rev__a">✓ ${esc(q.o[q.a ?? 0])}</p>${why(q)}</details>`).join('')}</div>`;
}

/* ---------------- revenge ---------------- */
function revenge(pane, scr, go) {
  const ids = Object.keys(state().wrong).filter(id => QBY[id]);
  if (!ids.length) {
    pane.innerHTML = `<div class="wrap"><section class="result"><p class="label">${t('boss.revenge')}</p><h1 class="result__big">${t('boss.noMistakes')}</h1><p class="result__line">${t('boss.noMistakesLine')}</p><div class="result__acts"><button type="button" class="btn btn--zone" data-a="portal">${t('boss.portal')}</button><button type="button" class="btn" data-a="menu">${t('boss.allModes')}</button></div></section></div>`;
    pane.querySelector('[data-a="portal"]').onclick = () => go('portal'); pane.querySelector('[data-a="menu"]').onclick = () => go('');
    return;
  }
  const qs = shuffle(ids.map(id => QBY[id])); let i = 0, fixed = 0, h = null;
  pane.innerHTML = `<div class="wrap qrun"><div class="qrun__top"><span class="qrun__n hud-num">1/${qs.length}</span><div class="bar"><i style="--p:0"></i></div><span class="label">${t('boss.fixed')} <b class="hud-num rv__f">0</b></span></div><div class="qrun__card"></div><div class="qrun__acts"><button type="button" class="btn btn--zone qrun__next" hidden>${t('common.next')} ${ICON.next}</button></div></div>`;
  const card = pane.querySelector('.qrun__card'), next = pane.querySelector('.qrun__next');
  const show = () => {
    h?.destroy(); next.hidden = true;
    if (i >= qs.length) return finish();
    pane.querySelector('.qrun__n').textContent = `${i + 1}/${qs.length}`; pane.querySelector('.qrun .bar i').style.setProperty('--p', i / qs.length);
    card.innerHTML = '<div></div>'; card.classList.add('qc--focus');
    h = mountQ(card.firstChild, qs[i], { label: t('boss.revengeLabel'), onAnswer(ok, idx, q, btn) {
      recordAnswer(q.id, ok);
      if (ok) { sfx('good'); burst(btn, '#46E3A0'); if (!state().wrong[q.id]) { fixed++; addXP(10, 'revenge'); floatFrom(btn, '+10 XP', 'fx-float--good'); pane.querySelector('.rv__f').textContent = fixed; } }
      else { sfx('bad'); shake(card); }
      next.hidden = false; setTimeout(() => next.focus({ preventScroll: true }), 40);
    } });
  };
  next.onclick = () => { i++; show(); };
  function finish() {
    const leftN = Object.keys(state().wrong).length;
    pane.innerHTML = `<div class="wrap"><section class="result"><p class="label">${t('boss.revenge')}</p><h1 class="result__big">${fixed ? t('boss.fixedN', { n: fixed }) : t('boss.notYetBig')}</h1><p class="result__line">${leftN ? t('boss.leftN', { n: leftN }) : t('boss.allFixed')}</p><div class="result__acts"><button type="button" class="btn btn--zone" data-a="again">${t('boss.again')}</button><button type="button" class="btn" data-a="menu">${t('boss.allModes')}</button></div></section></div>`;
    pane.querySelector('[data-a="again"]').onclick = () => revenge(pane, scr, go); pane.querySelector('[data-a="menu"]').onclick = () => go('');
    if (!leftN) { sfx('win'); confetti({}); }
    emit('progress');
  }
  show();
  scr.cleanups.push(() => h?.destroy());
}
