// Quick-fire round engine for the Color / Type / Express trials.
// quickfire(el, api, ctx, cfg) → cleanup
//   cfg = { id, intro:{ title, text, rules:[…] }, rounds:[{ prompt, sub?, art?, choices:[{ html, ok, label? }], explain? }],
//           time: seconds per round (0 = no clock), layout: 'grid' | 'row' | 'yn' | 'swatch', wins:[[pct, title, line]…] }
// The trial passes its own words (intro, rounds, wins) in its language; the engine's own words follow the page language,
// read while rendering (api.lang, else <html lang>), never at module load.
import { marks } from '../ui/icons.js';

const KEYS = ['1', '2', '3', '4', '5', '6'];
const reduced = () => { const m = document.documentElement.dataset.motion; return m === 'reduce' || (m !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches); };

/* the engine's own words */
const WORDS = {
  ar: {
    rounds: 'جولات', perRound: 'ثواني للجولة', start: 'ابدأ', orPress: 'أو اضغط', combo: 'كومبو', score: 'سكور',
    timeUp: 'الوقت خلص.', right: 'صح.', wrong: 'لأ.', result: 'النتيجة', best: 'أطول كومبو:', again: 'العب تاني', back: 'كل التحديات',
    wins: [[1, 'ولا غلطة.', 'كده الامتحان هيخاف منك.'], [.8, 'جامد.', 'شوية تركيز وتبقى كاملة.'], [.5, 'مش بطال.', 'ارجع للدرس ثانية وجرب تاني.'], [0, 'لسه.', 'الدرس مستنيك، وبعدين التحدي.']]
  },
  en: {
    rounds: 'rounds', perRound: 'seconds per round', start: 'Start', orPress: 'or press', combo: 'Combo', score: 'Score',
    timeUp: 'Time’s up.', right: 'Right.', wrong: 'Nope.', result: 'Your score', best: 'Longest combo:', again: 'Play again', back: 'All trials',
    wins: [[1, 'Not one mistake.', 'Now the exam should be scared of you.'], [.8, 'Strong.', 'A little more focus and it’s a perfect score.'], [.5, 'Not bad.', 'Go back to the lesson for a minute, then try again.'], [0, 'Not yet.', 'The lesson is waiting for you. Then the trial.']]
  }
};

export function quickfire(el, api, ctx, cfg) {
  const isEN = () => ((typeof api?.lang === 'string' && api.lang) || document.documentElement.lang) === 'en';
  const w = () => WORDS[isEN() ? 'en' : 'ar'];
  const timers = new Set(); let raf = 0; let alive = true;
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); if (alive) fn(); }, ms); timers.add(t); return t; };
  let onKey = null;
  const setKeys = fn => { if (onKey) document.removeEventListener('keydown', onKey); onKey = fn; if (fn) document.addEventListener('keydown', fn); };
  const N = cfg.rounds.length;
  let i = 0, score = 0, streak = 0, best = 0, locked = false;

  function intro() {
    const s = w();
    el.innerHTML = `<div class="g-card cte-intro">
      <p class="cte-meta"><span class="chip"><span class="hud-num">${N}</span> ${s.rounds}</span>${cfg.time ? `<span class="chip"><span class="hud-num">${cfg.time}</span> ${s.perRound}</span>` : ''}</p>
      <h3 class="cte-intro__t">${cfg.intro.title}</h3>
      <p class="cte-intro__p">${cfg.intro.text}</p>
      ${cfg.intro.rules ? `<ul class="cte-rules">${cfg.intro.rules.map((r, k) => `<li><span class="hud-num">${String(k + 1).padStart(2, '0')}</span><span>${r}</span></li>`).join('')}</ul>` : ''}
      <div class="g-acts" style="justify-content:flex-start"><button type="button" class="btn btn--zone btn--lg cte-go">${s.start}</button><span class="cte-kbd">${s.orPress} <kbd>Enter</kbd></span></div>
    </div>`;
    const go = () => { api.sfx('pop'); round(); };
    el.querySelector('.cte-go').addEventListener('click', go);
    setKeys(e => { if (e.key === 'Enter' && !e.target.closest('button')) { e.preventDefault(); go(); } });
    setTimeout(() => el.querySelector('.cte-go')?.focus({ preventScroll: true }), 30);
  }

  function round() {
    locked = false;
    const R = cfg.rounds[i];
    const lay = R.layout || cfg.layout || 'grid';
    const s = w();
    el.innerHTML = `<div class="g-card cte-round cte-round--${lay}">
      <div class="g-hud"><span class="chip" dir="ltr"><span class="hud-num">${String(i + 1).padStart(2, '0')}</span>/${String(N).padStart(2, '0')}</span>
        <span class="cte-hud-r"><span class="chip cte-streak" ${streak >= 2 ? '' : 'hidden'}>${s.combo} <span class="hud-num">×${streak}</span></span><span class="chip chip--zone">${s.score} <span class="hud-num cte-score">${score}</span></span></span></div>
      ${cfg.time ? '<div class="g-timer"><i style="--t:1"></i></div>' : ''}
      ${R.art ? `<div class="cte-art">${R.art}</div>` : ''}
      <p class="g-prompt">${R.prompt}</p>${R.sub ? `<p class="cte-sub">${R.sub}</p>` : ''}
      <div class="g-choices cte-choices">${R.choices.map((c, k) => `<button type="button" class="g-choice" data-k="${k}"${c.label ? ` aria-label="${c.label}"` : ''}>${c.html}<span class="cte-key" aria-hidden="true">${KEYS[k]}</span></button>`).join('')}</div>
      <p class="cte-fb" aria-live="polite"></p>
    </div>`;
    if (i === 0) el.querySelector('.cte-round')?.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
    const btns = [...el.querySelectorAll('.g-choice')];
    btns.forEach((b, k) => b.addEventListener('click', () => pick(k)));
    setKeys(e => { const k = KEYS.indexOf(e.key); if (k >= 0 && k < btns.length) { e.preventDefault(); pick(k); } });
    // clock
    if (cfg.time) {
      const bar = el.querySelector('.g-timer i'); const t0 = performance.now(); const T = cfg.time * 1000;
      const tick = now => { if (!alive || locked) return; const left = 1 - (now - t0) / T; bar.style.setProperty('--t', Math.max(0, left)); if (left <= 0) { pick(-1); return; } raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    function pick(k) {
      if (locked) return; locked = true; cancelAnimationFrame(raf);
      const okIdx = R.choices.findIndex(c => c.ok);
      const ok = k >= 0 && R.choices[k].ok;
      btns.forEach((b, j) => { b.disabled = true; if (j === okIdx) b.classList.add('is-right'); else if (j === k) b.classList.add('is-wrong'); });
      const fb = el.querySelector('.cte-fb');
      if (ok) { score++; streak++; best = Math.max(best, streak); api.sfx('good'); api.burst(btns[k], '#46E3A0', 10); el.querySelector('.cte-score').textContent = score; }
      else { streak = 0; api.sfx('bad'); api.shake(el.querySelector('.cte-round')); }
      const st = el.querySelector('.cte-streak'); if (st) { st.hidden = streak < 2; st.querySelector('.hud-num').textContent = '×' + streak; }
      fb.innerHTML = `<b class="${ok ? 'cte-ok' : 'cte-no'}">${k < 0 ? s.timeUp : ok ? s.right : s.wrong}</b> ${R.explain || ''}`;
      later(() => { i++; if (i < N) round(); else end(); }, ok ? (reduced() ? 900 : 1150) : 2300);
    }
  }

  function end() {
    setKeys(null);
    const pct = score / N;
    const s = w();
    const win = (cfg.wins || s.wins).find(([p]) => pct >= p);
    el.innerHTML = `<div class="g-card g-end cte-end">
      <p class="label">${s.result}</p>
      <div class="cte-end__score" dir="ltr"><span class="hud-num">${score}</span><span class="hud-num cte-end__of">/${N}</span></div>
      <div class="cte-end__marks"></div>
      <h3>${win[1]}</h3><p>${win[2]}</p>
      <p class="cte-end__meta">${s.best} <span class="hud-num">${best}</span></p>
      <div class="g-acts"><button type="button" class="btn btn--zone cte-again">${s.again}</button><button type="button" class="btn cte-back">${s.back}</button></div>
    </div>`;
    const btn = el.querySelector('.cte-again');
    const r = api.finishGame(cfg.id, score, N, el.querySelector('.cte-end__score'));
    el.querySelector('.cte-end__marks').innerHTML = marks(r.stars, 3, 'marks--big') + `<span class="chip chip--zone" dir="ltr">+${r.xp} XP</span>`;
    btn.addEventListener('click', () => ctx.again());
    el.querySelector('.cte-back').addEventListener('click', () => ctx.back());
    setTimeout(() => btn.focus({ preventScroll: true }), 30);
  }

  intro();
  return () => { alive = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers.clear(); setKeys(null); };
}

/** pick n items from arr (seeded by Math.random) */
export function sample(arr, n) { const a = arr.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a.slice(0, n); }
export function shuffleIn(arr) { return sample(arr, arr.length); }
