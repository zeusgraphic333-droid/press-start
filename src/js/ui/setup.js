// The threshold after the Erebus ident: pick a language, pick an experience, walk in (with or without sound).
// Choosing a language re-renders this screen in that language; choosing an experience flips the whole room
// (dark plant floor of particles ↔ drafting room on paper) behind it, live. Returning players see their saved choices.
import gsap from 'gsap';
import { t, lang, setLang } from '../core/i18n.js';
import { mode } from '../core/mode.js';
import { state, save, setSetting } from '../core/state.js';
import { unlockAudio, sfx } from '../core/sfx.js';
import { esc } from '../core/util.js';

const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/** tiny live previews of the two experiences */
const PREVIEW = {
  /* sparks in the dark: a gear of points with embers rising off it */
  immersive: () => {
    let s = ''; let seed = 11; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 84; i++) { const a = i / 84 * 6.283; const tooth = (Math.floor(a / 6.283 * 12 * 2) % 2) ? 1 : 0; const d = 22 + tooth * 5 + (r() - .5) * 1.6; s += `<circle cx="${(50 + Math.cos(a) * d).toFixed(1)}" cy="${(54 + Math.sin(a) * d).toFixed(1)}" r="${(.5 + r() * .7).toFixed(2)}" fill="${i % 9 === 0 ? '#E39B3C' : '#ECE9E2'}" opacity="${(.45 + r() * .5).toFixed(2)}"/>`; }
    for (let i = 0; i < 26; i++) s += `<circle class="pv-d" cx="${(38 + r() * 24).toFixed(1)}" cy="${(30 + r() * 20).toFixed(1)}" r="${(.5 + r() * .9).toFixed(2)}" fill="${i % 3 ? '#FF8A2B' : '#FFD27A'}" style="--d:${(r() * 3).toFixed(2)}s"/>`;
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><g class="pv-spin">${s}</g><circle cx="50" cy="54" r="7" fill="none" stroke="#ECE9E2" stroke-width=".9" stroke-dasharray="1 1.4"/></svg>`;
  },
  /* a drawing on drafting film: a bent bracket, its dimension and the bend angle in red pencil */
  illustrated: () => `<svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M0 20H100M0 40H100M0 60H100M0 80H100M20 0V100M40 0V100M60 0V100M80 0V100" stroke="#8FB8E8" stroke-width=".4" opacity=".8"/>
      <path class="pv-a" d="M18 70H58a8 8 0 0 0 8-8V26" fill="none" stroke="#1B2630" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M18 70H58a8 8 0 0 0 8-8V26" fill="none" stroke="#46545E" stroke-width=".7" stroke-dasharray="5 1.5 1 1.5" transform="translate(-2 -2)"/>
      <path class="pv-b" d="M18 80H66" stroke="#1B2630" stroke-width=".8"/><path d="M18 77v6M66 77v6" stroke="#1B2630" stroke-width=".6"/>
      <path class="pv-c" d="M58 52a12 12 0 0 1 12 6" fill="none" stroke="#D7263D" stroke-width="1.2"/>
      <rect x="70" y="30" width="12" height="7" fill="#F05A1E" class="pv-b"/>
    </svg>`
};

/**
 * openSetup({ onMode, onLang }) → Promise<{ sound }>
 * onMode(m) is awaited when the player flips the experience (so the world behind can switch); onLang(l) likewise.
 */
export function openSetup({ onMode = async () => { }, onLang = async () => { } } = {}) {
  return new Promise(resolve => {
    const el = document.createElement('div');
    el.className = 'setup';
    document.body.appendChild(el);
    const back = !!state().name && !!state().settings.lang;
    let busy = false, pending = Promise.resolve();

    const render = () => {
      const m = mode(), l = lang();
      el.dataset.look = m;
      el.innerHTML = `
        <div class="setup__in">
          <p class="setup__kicker">${esc(t('setup.kicker'))}</p>
          <h1 class="setup__title">${esc(t('title.main'))}</h1>
          <p class="setup__sub">${back ? esc(t('setup.back', { name: state().name })) : t(m === 'illustrated' ? 'setup.sub.il' : 'setup.sub')}</p>
          <div class="setup__rows">
            <div class="setup__row" role="radiogroup" aria-label="${esc(t('setup.lang'))}">
              <span class="setup__label">${esc(t('setup.lang'))}</span>
              <div class="seg">
                <button type="button" role="radio" class="seg__b" data-lang="en" lang="en" dir="ltr" aria-checked="${l === 'en'}">English</button>
                <button type="button" role="radio" class="seg__b" data-lang="ar" lang="ar" dir="rtl" aria-checked="${l === 'ar'}">العربية</button>
              </div>
            </div>
            <div class="setup__row" role="radiogroup" aria-label="${esc(t('setup.mode'))}">
              <span class="setup__label">${esc(t('setup.mode'))}</span>
              <div class="modes">
                ${['illustrated', 'immersive'].map(k => `<button type="button" role="radio" class="mode-card mode-card--${k}" data-mode="${k}" aria-checked="${m === k}">
                  <span class="mode-card__pv">${PREVIEW[k]()}</span>
                  <span class="mode-card__t"><b>${esc(t('setup.' + k))}</b><small>${esc(t('setup.' + k + '.sub'))}</small></span>
                </button>`).join('')}
              </div>
            </div>
          </div>
          <div class="setup__acts">
            <button type="button" class="btn btn--solid btn--lg setup__go" data-sound="1"><span>${esc(t(back ? 'setup.continueSound' : 'setup.enterSound'))}</span></button>
            <button type="button" class="btn btn--lg setup__go" data-sound="0"><span>${esc(t('setup.enterSilent'))}</span></button>
          </div>
          ${m === 'immersive' ? `<p class="setup__note">${esc(t('setup.note'))}</p>` : ''}
        </div>`;
      bind();
    };
    const swapIn = () => { if (!reduced()) gsap.from(el.querySelectorAll('.setup__in > *'), { opacity: 0, y: 14, duration: .7, stagger: .05, ease: 'expo.out' }); };

    const bind = () => {
      el.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
        if (busy || b.dataset.lang === lang()) return; busy = true;
        pending = (async () => {
          await gsap.to(el.querySelector('.setup__in'), { opacity: 0, duration: reduced() ? 0 : .22 });
          setLang(b.dataset.lang); await onLang(b.dataset.lang);
          render(); swapIn(); busy = false;
          el.querySelector(`[data-lang="${lang()}"]`)?.focus();
        })();
      }));
      el.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
        if (busy || b.dataset.mode === mode()) return; busy = true;
        el.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-checked', String(x === b)));
        el.dataset.look = b.dataset.mode; // the room flips colour first (CSS transition), the world follows
        pending = (async () => {
          await onMode(b.dataset.mode);
          render(); busy = false;
          el.querySelector(`[data-mode="${mode()}"]`)?.focus();
        })();
      }));
      // walking in mid-switch waits for the switch to land (so the title is printed in the language you picked)
      el.querySelectorAll('.setup__go').forEach(b => b.addEventListener('click', async () => {
        if (el.classList.contains('is-out')) return;
        el.classList.add('is-out');
        const sound = b.dataset.sound === '1';
        setSetting('sound', sound); unlockAudio(); if (sound) sfx('whoosh'); // inside the gesture
        await pending;
        if (!state().settings.lang) state().settings.lang = lang();
        if (!state().settings.mode) state().settings.mode = mode();
        save();
        gsap.to(el.querySelector('.setup__in'), { opacity: 0, y: -10, duration: reduced() ? 0 : .5, ease: 'power2.in', onComplete: () => { el.remove(); } });
        resolve({ sound });
      }));
    };

    render();
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: reduced() ? 0 : .9, ease: 'power2.out' });
    swapIn();
    setTimeout(() => el.querySelector('.setup__go')?.focus({ preventScroll: true }), 400);
  });
}
