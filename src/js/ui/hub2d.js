// The illustrated hub: a drafting table. Nine sheets (the districts) in the flat file along the bottom; the chosen
// sheet's drawing is plotted big on the 2D stage beside the panel. Select, then dive — the same rhythm as the orbit.
import gsap from 'gsap';
import { ZONES } from '../content/zones.js';
import { ZONE_FORMATION } from '../world/formations.js';
import { GLYPH, ZONE_GLYPH } from './glyphs.js';
import { ICON, marks } from './icons.js';
import { esc } from '../core/util.js';
import { state, levelOf, on, setSetting } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { lessonProgress } from './learn.js';
import { t, L, isEN, isRTL, setLang, lang } from '../core/i18n.js';
import { setMode } from '../core/mode.js';
/** the sheet inks: the zone's marker colour (fill) and its text ink on paper */
const sheetInk = id => (ZONES.find(q => q.id === id) || ZONES[0]).paper;

const reduced = () => document.documentElement.dataset.motion === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const zName = z => L(z.ar, z.en);
const zTag = z => L(z.tag, z.tagEn || z.tag);
const zBlurb = z => L(z.blurb, z.blurbEn || z.blurb);

export function createHub2D(world, { lessons = {}, onEnter, onOpen }) {
  const root = document.getElementById('hud');
  root.classList.add('hud--2d');
  let active = -1, shown = false, diving = false, morphT = 0;
  const offs = [];
  const listen = (target, ev, fn, opt) => { target.addEventListener(ev, fn, opt); offs.push(() => target.removeEventListener(ev, fn, opt)); };

  function render() {
    root.innerHTML = `
      <header class="h2-top">
        <a class="h2-brand" href="#/"><span class="h2-brand__mark">${GLYPH.brand}</span><span class="h2-brand__txt"><b>PRESS START</b><small>${esc(t('title.short'))}</small></span></a>
        <div class="h2-me">
          <button type="button" class="h2-who" data-open="profile" aria-label="${esc(t('h2.profile'))}"><span class="h2-who__s"></span><span class="h2-who__t"><b class="h2-who__n"></b><small class="h2-who__r"></small></span></button>
          <div class="h2-xp" aria-label="${esc(t('h2.xp'))}"><span class="h2-num h2-xp__n"></span><span class="h2-xp__l">XP</span><span class="h2-bar"><i></i></span></div>
          <span class="h2-chip h2-streak" title="${esc(t('h2.streak'))}">${GLYPH.flame}<span class="h2-num"></span></span>
          <button type="button" class="h2-icon h2-sound"></button>
          <button type="button" class="h2-chip h2-pref" data-pref="lang" lang="${isEN() ? 'ar' : 'en'}">${isEN() ? 'العربية' : 'English'}</button>
          <button type="button" class="h2-chip h2-pref" data-pref="mode" title="${esc(t('prefs.toImmersive'))}"><i class="h2-dotsicon" aria-hidden="true"></i><span>${esc(t('setup.immersive'))}</span></button>
          <button type="button" class="h2-chip h2-arch" data-open="archive">${ICON.cards}<span>${esc(t('h2.archive'))}</span></button>
        </div>
      </header>
      <main class="h2-main">
        <section class="h2-panel" aria-live="polite">
          <p class="h2-meta"><span class="h2-num h2-meta__n"></span><span class="h2-meta__lec"></span></p>
          <h1 class="h2-title"></h1>
          <p class="h2-alt"></p>
          <p class="h2-tag"></p>
          <p class="h2-blurb"></p>
          <div class="h2-stats"></div>
          <button type="button" class="h2-go"><span></span>${ICON.next}</button>
        </section>
        <div class="h2-stage" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </main>
      <nav class="h2-plates" role="listbox" aria-label="${esc(t('h2.zones'))}" aria-orientation="horizontal">
        ${ZONES.map((z, i) => { const [c, ink] = sheetInk(z.id); return `<button type="button" role="option" class="h2-plate${z.id === 'boss' ? ' h2-plate--boss' : ''}" data-i="${i}" style="--pc:${c};--pi:${ink}">
          <span class="h2-plate__n h2-num">${String(z.n).padStart(2, '0')}</span>
          <span class="h2-plate__g">${GLYPH[ZONE_GLYPH[z.id]] || GLYPH.brand}</span>
          <b class="h2-plate__t">${esc(zName(z))}</b>
          <span class="h2-plate__p"><i></i></span>
        </button>`; }).join('')}
      </nav>
      <p class="h2-hint">${esc(t('h2.hint'))}</p>`;
    root.querySelectorAll('.h2-plate').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; if (i === active) dive(); else select(i); }));
    root.querySelector('.h2-go').addEventListener('click', () => dive());
    root.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => onOpen?.(b.dataset.open)));
    root.querySelector('.h2-sound').addEventListener('click', () => { setSetting('sound', !state().settings.sound); paintMe(); if (state().settings.sound) sfx('pop'); });
    root.querySelector('[data-pref="lang"]').addEventListener('click', () => { sfx('click'); setLang(isEN() ? 'ar' : 'en'); });
    root.querySelector('[data-pref="mode"]').addEventListener('click', () => { sfx('swoosh'); setMode('immersive'); });
    paintMe(); paintPlates();
    if (active >= 0) paint(ZONES[active], true);
  }

  /* ---------- the stage sits in the panel's neighbour ---------- */
  function placeStage(dur = 1.2) {
    const box = root.querySelector('.h2-stage'); if (!box) return;
    const r = box.getBoundingClientRect(); if (!r.width) return;
    const size = Math.min(r.width, r.height) * 1.02;
    const z = 13.5 * Math.min(innerWidth, innerHeight) * .8 / Math.max(80, size);
    world.setStage({ cx: (r.left + r.width / 2) / innerWidth, cy: (r.top + r.height / 2) / innerHeight, z }, dur);
  }
  listen(window, 'resize', () => { if (shown) placeStage(0); });

  /* ---------- selection ---------- */
  function select(i, { instant = false } = {}) {
    if (i === active) return;
    active = i;
    paint(ZONES[i], instant);
    if (!instant) sfx('swoosh');
    clearTimeout(morphT);
    morphT = setTimeout(() => world.morph(ZONE_FORMATION[ZONES[i].id] || 'nebula', { dur: 1.4 }), instant ? 0 : 120);
  }
  function paint(z, instant) {
    const [c, ink] = sheetInk(z.id);
    root.style.setProperty('--zc', c); root.style.setProperty('--zi', ink);
    const p = root.querySelector('.h2-panel');
    p.querySelector('.h2-meta__n').textContent = String(z.n).padStart(2, '0') + ' / ' + String(ZONES.length).padStart(2, '0');
    p.querySelector('.h2-meta__lec').textContent = z.lec ? t('h2.lecture', { n: z.lec }) : z.id === 'boss' ? 'Boss' : '';
    p.querySelector('.h2-title').textContent = zName(z);
    p.querySelector('.h2-alt').textContent = isEN() ? '' : z.en;
    p.querySelector('.h2-alt').hidden = isEN();
    p.querySelector('.h2-tag').textContent = zTag(z);
    p.querySelector('.h2-blurb').textContent = zBlurb(z);
    p.querySelector('.h2-go span').textContent = z.id === 'boss' ? t('h2.boss') : t('h2.enter');
    stats(z);
    root.querySelectorAll('.h2-plate').forEach((b, k) => { b.setAttribute('aria-selected', String(k === active)); b.classList.toggle('is-active', k === active); });
    if (!instant && !reduced()) {
      gsap.fromTo(p.querySelectorAll('.h2-meta, .h2-title, .h2-alt, .h2-tag, .h2-blurb, .h2-stats, .h2-go'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7, stagger: .04, ease: 'expo.out', overwrite: true });
    }
  }
  function stats(z) {
    const box = root.querySelector('.h2-stats');
    if (z.id === 'boss') { const b = state().boss; box.innerHTML = `<span class="h2-chip">${esc(b.wins ? t('h2.bossWins', { n: b.wins }) : t('h2.bossNone'))}</span>`; return; }
    const p = lessonProgress(lessons[z.id]); const q = state().quiz[z.id];
    box.innerHTML = `<span class="h2-prog"><span class="h2-num">${p.done}/${p.total}</span> ${esc(t('h2.lessons'))}</span><span class="h2-bar"><i style="--p:${p.pct}"></i></span>${marks(q?.stars || 0)}`;
  }
  function paintPlates() {
    root.querySelectorAll('.h2-plate').forEach((b, i) => { const z = ZONES[i]; const p = z.id === 'boss' ? { pct: Math.min(1, (state().boss.wins || 0)) } : lessonProgress(lessons[z.id]); b.querySelector('.h2-plate__p i').style.setProperty('--p', p.pct); });
  }
  const step = d => { const n = ZONES.length; select(((Math.max(0, active) + d) % n + n) % n); root.querySelector('.h2-plate.is-active')?.focus({ preventScroll: true }); root.querySelector('.h2-plate.is-active')?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); };
  listen(window, 'keydown', e => {
    if (!shown || document.getElementById('screens').children.length || e.target.closest('input,textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    const fwd = isRTL() ? 'ArrowLeft' : 'ArrowRight', bwd = isRTL() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === fwd) { e.preventDefault(); step(1); }
    else if (e.key === bwd) { e.preventDefault(); step(-1); }
    else if (e.key === 'Enter' && !e.target.closest('button,a')) { e.preventDefault(); dive(); }
    else { const k = +e.key; if (k >= 1 && k <= ZONES.length) { e.preventDefault(); select(k - 1); } }
  });

  /* ---------- HUD values ---------- */
  function paintMe() {
    const S = state(), lv = levelOf();
    const q = s => root.querySelector(s); if (!q('.h2-who')) return;
    q('.h2-who__s').innerHTML = GLYPH[S.sigil] || GLYPH.circle;
    q('.h2-who__n').textContent = S.name || L('ضيف', 'Guest');
    q('.h2-who__r').textContent = `Lv ${lv.n} · ${L(lv.ar, lv.en)}`;
    q('.h2-xp__n').textContent = S.xp;
    q('.h2-xp .h2-bar i').style.setProperty('--p', lv.pct);
    const st = q('.h2-streak'); st.hidden = !S.streak.days; st.querySelector('.h2-num').textContent = S.streak.days;
    const on_ = S.settings.sound, sb = q('.h2-sound');
    sb.innerHTML = on_ ? ICON.sound : ICON.mute; sb.setAttribute('aria-pressed', String(on_)); sb.title = on_ ? t('h2.soundOn') : t('h2.soundOff'); sb.setAttribute('aria-label', sb.title);
  }
  offs.push(on('xp', paintMe), on('progress', () => { paintMe(); paintPlates(); if (active >= 0) stats(ZONES[active]); }), on('settings', paintMe), on('reset', paintMe));

  /** the first district (lecture order) that still has lessons or marks to earn */
  function recommend() {
    const S = state();
    for (const z of ZONES) {
      if (z.id === 'boss') continue;
      const p = lessonProgress(lessons[z.id]); const q = S.quiz[z.id];
      if (p.done < p.total || !q || q.stars < 2) return z.id;
    }
    return 'boss';
  }

  /* ---------- dive ---------- */
  async function dive() {
    if (diving || active < 0) return; const z = ZONES[active]; diving = true;
    sfx('whoosh'); root.classList.add('is-diving');
    const plate = root.querySelector('.h2-plate.is-active');
    if (plate && !reduced()) gsap.fromTo(plate, { scale: 1 }, { scale: .92, duration: .12, yoyo: true, repeat: 1, ease: 'power2.out' });
    world.scatter(.4);
    await new Promise(r => setTimeout(r, reduced() ? 60 : 420));
    diving = false;
    onEnter?.(z.id);
  }

  render();
  return {
    frame() { },
    show(selectId) {
      shown = true; root.hidden = false; root.classList.remove('is-diving');
      paintMe(); paintPlates();
      const want = selectId || (active < 0 ? recommend() : null);
      const i = want ? Math.max(0, ZONES.findIndex(z => z.id === want)) : active;
      if (i !== active) select(i, { instant: true }); else world.morph(ZONE_FORMATION[ZONES[i].id] || 'nebula', { dur: 1.2 });
      requestAnimationFrame(() => { root.classList.add('is-shown'); placeStage(1.2); });
      if (!reduced()) gsap.fromTo(root.querySelectorAll('.h2-plate'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .045, ease: 'expo.out', clearProps: 'transform,opacity' });
    },
    hide() { shown = false; root.classList.remove('is-shown'); root.hidden = true; },
    /** language switch: re-render every string, keep the selection */
    refresh() { const keep = active; active = -1; render(); if (keep >= 0) select(keep, { instant: true }); if (shown) placeStage(0); },
    destroy() { offs.forEach(f => { try { f(); } catch (e) { } }); clearTimeout(morphT); root.innerHTML = ''; root.classList.remove('hud--2d', 'is-shown'); },
    get active() { return ZONES[active]?.id; },
    paintMe
  };
}
