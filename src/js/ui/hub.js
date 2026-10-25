// The hub: an orbit of districts around the plant floor. Level-select: rotate the orbit, preview a district, dive in.
// Reading direction matters here: the panel takes the start side and the stage leans to the other; the orbit runs in
// reading order (the next district waits on the left in Arabic, on the right in English), and so do the arrow keys.
import gsap from 'gsap';
import { ZONES } from '../content/zones.js';
import { ringPoint, ZONE_FORMATION } from '../world/formations.js';
import { GLYPH } from './glyphs.js';
import { ICON, marks } from './icons.js';
import { esc } from '../core/util.js';
import { state, levelOf, on, setSetting } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { lessonProgress } from './learn.js';
import { t, L, isEN, isRTL, setLang, lang } from '../core/i18n.js';
import { setMode } from '../core/mode.js';
import * as THREE from 'three';

const STEP = Math.PI * 2 / ZONES.length;

export const hubStage = () => innerWidth > 1100 ? { cx: isRTL() ? .42 : .58, cy: .5, z: 13.5 } : innerWidth > 760 ? { cx: .5, cy: .44, z: 14.5 } : { cx: .5, cy: .36, z: 12.5 };
export function createHub(world, { lessons = {}, onEnter, onOpen }) {
  const root = document.getElementById('hud');
  const offs = []; // every listener / subscription this hub adds, so destroy() can take them all back
  const listen = (target, ev, fn, opt) => { target.addEventListener(ev, fn, opt); offs.push(() => target.removeEventListener(ev, fn, opt)); };
  const mod = k => ((k % ZONES.length) + ZONES.length) % ZONES.length;
  const side = () => (isRTL() ? 1 : -1); // +1: the next district sits to the left (Arabic) · −1: to the right (English)
  const sel = { v: 0 };
  let nodes = [], active = -1, diving = false, morphT = 0, shown = false, dead = false, renderedLang = '';

  function render() {
    const en = isEN(); renderedLang = lang();
    root.innerHTML = `
    <header class="hud__top">
      <a class="brand" href="#/" aria-label="${esc(t('hub.home'))}"><span class="brand__mark">${GLYPH.brand}</span><span class="brand__txt"><b>PRESS START</b><small>${esc(t('title.short'))}</small></span></a>
      <div class="hud__me">
        <button type="button" class="me" data-open="profile" aria-label="${esc(t('hub.profile'))}"><span class="me__sigil"></span><span class="me__txt"><b class="me__name"></b><small class="me__rank"></small></span></button>
        <div class="xp" aria-label="${esc(t('hub.xp'))}"><span class="xp__n hud-num"></span><span class="xp__l">XP</span><div class="bar xp__bar"><i></i></div></div>
        <span class="streak chip" title="${esc(t('hub.streak'))}">${GLYPH.flame}<span class="hud-num"></span></span>
        <button type="button" class="btn btn--icon btn--ghost hud__sound" aria-label="${esc(t('hub.sound'))}"></button>
        <button type="button" class="btn btn--sm btn--ghost hud__lang" data-pref="lang" lang="${en ? 'ar' : 'en'}" dir="${en ? 'rtl' : 'ltr'}">${esc(t(en ? 'prefs.toAR' : 'prefs.toEN'))}</button>
        <button type="button" class="btn btn--sm btn--ghost hud__mode" data-pref="mode" title="${esc(t('prefs.toIllustrated'))}" aria-label="${esc(t('prefs.toIllustrated'))}">${ICON.print}<span>${esc(t('setup.illustrated'))}</span></button>
        <button type="button" class="btn btn--sm hud__archive" data-open="archive">${ICON.cards}<span>${esc(t('hub.archive'))}</span></button>
      </div>
    </header>
    <div class="nodes" role="listbox" aria-label="${esc(t('hub.zones'))}" aria-orientation="horizontal"></div>
    <section class="sel" aria-live="polite">
      <div class="sel__meta"><span class="hud-num sel__n" dir="ltr"></span><span class="sel__lec"></span><span class="sel__tag"></span></div>
      <h1 class="sel__title"></h1>
      <p class="sel__en" dir="ltr"></p>
      <p class="sel__blurb"></p>
      <div class="sel__row"><button type="button" class="btn btn--zone btn--lg sel__go"><span>${esc(t('hub.enter'))}</span>${ICON.next.replace('<svg', '<svg class="arrow"')}</button><div class="sel__stats"></div></div>
    </section>
    <nav class="hud__nav" aria-label="${esc(t('hub.orbit'))}">
      <button type="button" class="btn btn--icon" data-step="-1" aria-label="${esc(t('hub.prev'))}">${ICON.back}</button>
      <span class="hud__hint">${esc(t('hub.hint'))}</span>
      <button type="button" class="btn btn--icon" data-step="1" aria-label="${esc(t('hub.next'))}">${ICON.next}</button>
    </nav>`;
    const nodesEl = root.querySelector('.nodes');
    nodes = ZONES.map((z, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'node' + (z.id === 'boss' ? ' node--boss' : '');
      b.setAttribute('role', 'option'); b.dataset.zone = z.id; b.style.setProperty('--zc', z.color);
      b.innerHTML = `<span class="node__dot"></span><span class="node__txt"><span class="node__n hud-num">${String(z.n).padStart(2, '0')}</span><span class="node__ar">${esc(L(z.ar, z.enShort || z.en))}</span></span>`;
      b.addEventListener('click', () => { if (Math.round(sel.v) % ZONES.length === i || mod(Math.round(sel.v)) === i) dive(); else go(i); });
      nodesEl.appendChild(b);
      return b;
    });
    root.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => step(+b.dataset.step)));
    root.querySelector('.sel__go').addEventListener('click', () => dive());
    root.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => onOpen?.(b.dataset.open)));
    root.querySelector('.hud__sound').addEventListener('click', () => { setSetting('sound', !state().settings.sound); paintSound(); if (state().settings.sound) sfx('pop'); });
    root.querySelector('.hud__lang').addEventListener('click', () => { sfx('click'); setLang(isEN() ? 'ar' : 'en'); });
    root.querySelector('.hud__mode').addEventListener('click', () => { sfx('swoosh'); setMode('illustrated'); });
    boxT = 0; selBox = null;
    paintMe();
  }

  /* ---------- selection ---------- */
  function go(i, instant) {
    const target = Math.round(sel.v) + shortest(mod(Math.round(sel.v)), i);
    gsap.to(sel, { v: target, duration: instant ? 0 : .9, ease: 'power3.out', onUpdate: settle });
    sfx('swoosh');
  }
  const shortest = (from, to) => { let d = to - from; if (d > ZONES.length / 2) d -= ZONES.length; if (d < -ZONES.length / 2) d += ZONES.length; return d; };
  function step(d) { gsap.killTweensOf(sel); go(mod(Math.round(sel.v) + d)); }
  function settle() {
    const i = mod(Math.round(sel.v));
    if (i !== active) { active = i; paint(ZONES[i]); clearTimeout(morphT); morphT = setTimeout(() => world.morph(ZONE_FORMATION[ZONES[i].id] || 'nebula', { dur: 2 }), 260); }
  }
  function paint(z) {
    root.style.setProperty('--zc', z.color); root.style.setProperty('--zglow', z.color + '55');
    const s = root.querySelector('.sel'); if (!s) return;
    s.style.setProperty('--zc', z.color);
    s.querySelector('.sel__n').textContent = String(z.n).padStart(2, '0') + ' / ' + String(ZONES.length).padStart(2, '0');
    s.querySelector('.sel__lec').textContent = z.lec ? 'Lecture ' + z.lec : 'Boss';
    s.querySelector('.sel__tag').textContent = L(z.tag, z.tagEn);
    s.querySelector('.sel__title').innerHTML = `<span class="mask"><span>${esc(L(z.ar, z.en))}</span></span>`;
    const sub = s.querySelector('.sel__en'); sub.textContent = isEN() ? '' : z.en; sub.hidden = isEN(); // English: the title already is the English name
    s.querySelector('.sel__blurb').textContent = L(z.blurb, z.blurbEn);
    s.querySelector('.sel__go span').textContent = z.id === 'boss' ? t('hub.faceBoss') : t('hub.enter');
    stats(z);
    s.classList.remove('in'); void s.offsetWidth; s.classList.add('in');
    nodes.forEach((n, k) => { n.setAttribute('aria-selected', String(k === active)); n.classList.toggle('is-active', k === active); });
  }
  function stats(z) {
    const box = root.querySelector('.sel__stats'); if (!box) return;
    if (z.id === 'boss') { const b = state().boss; box.innerHTML = `<span class="chip">${b.wins ? t('hub.beaten', { n: b.wins }) : t('hub.unbeaten')}</span>`; return; }
    const p = lessonProgress(lessons[z.id]); const q = state().quiz[z.id];
    box.innerHTML = `<span class="sel__prog"><span class="hud-num">${p.done}/${p.total}</span> ${t('hub.lessons')}</span><div class="bar"><i style="--p:${p.pct}"></i></div>${marks(q?.stars || 0)}`;
  }

  /* ---------- drag / wheel / keys ---------- */
  let drag = null;
  const canvas = world.renderer.domElement;
  listen(canvas, 'pointerdown', e => { if (!shown) return; drag = { x: e.clientX, v: sel.v, moved: false }; gsap.killTweensOf(sel); });
  // the nodes follow the finger: in English the ring runs the other way, so the drag does too
  listen(window, 'pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true; sel.v = drag.v + side() * dx / (world.mobile ? 120 : 200); settle(); });
  listen(window, 'pointerup', () => { if (!drag) return; const moved = drag.moved; drag = null; if (moved) go(mod(Math.round(sel.v))); });
  let wheelT = 0;
  listen(window, 'wheel', e => { if (!shown || document.getElementById('screens').children.length) return; const now = performance.now(); if (now - wheelT < 380) return; wheelT = now; step((e.deltaY || e.deltaX) > 0 ? 1 : -1); }, { passive: true });
  listen(window, 'keydown', e => {
    if (!shown || document.getElementById('screens').children.length || e.target.closest('input,textarea')) return;
    const fwd = isRTL() ? 'ArrowLeft' : 'ArrowRight', bwd = isRTL() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === fwd) { e.preventDefault(); step(1); }
    if (e.key === bwd) { e.preventDefault(); step(-1); }
    if (e.key === 'Enter' && !e.target.closest('button,a')) { e.preventDefault(); dive(); }
  });
  const paintSound = () => {
    const btn = root.querySelector('.hud__sound'); if (!btn) return;
    const on_ = state().settings.sound; btn.innerHTML = on_ ? ICON.sound : ICON.mute; btn.setAttribute('aria-pressed', String(on_)); btn.title = on_ ? t('hub.mute') : t('hub.unmute');
  };

  /** the first district (in lecture order) that still has lessons or marks to earn */
  function recommend() {
    const S = state();
    for (const z of ZONES) {
      if (z.id === 'boss') continue;
      const p = lessonProgress(lessons[z.id]); const q = S.quiz[z.id];
      if (p.done < p.total || !q || q.stars < 2) return z.id;
    }
    return 'boss';
  }
  listen(window, 'keydown', e => {
    if (!shown || document.getElementById('screens').children.length || e.target.closest('input,textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = +e.key; if (k >= 1 && k <= ZONES.length) { e.preventDefault(); gsap.killTweensOf(sel); go(k - 1); }
  });

  /* ---------- per-frame: place nodes on the orbit ---------- */
  const p3 = new THREE.Vector3();
  let selBox = null, boxT = 0;
  function frame() {
    if (!shown) return;
    if (++boxT % 20 === 1) { const r = root.querySelector('.sel')?.getBoundingClientRect(); selBox = r ? { left: r.left, right: r.right, top: r.top + 40, bottom: r.bottom } : null; }
    const w = innerWidth, h = innerHeight, dir = side();
    nodes.forEach((n, i) => {
      const a = Math.PI / 2 + (i - sel.v) * STEP * dir;
      const [x, y, z] = ringPoint(a); p3.set(x, y, z);
      const s = world.project(p3);
      const depth = (z / 4.9 + 1) / 2; // 0 back … 1 front
      const front = depth > .97;
      n.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) scale(${(.72 + depth * .38).toFixed(3)})`;
      const under = selBox && s.x > selBox.left - 20 && s.x < selBox.right + 20 && s.y > selBox.top - 30 && s.y < selBox.bottom + 10;
      n.style.opacity = s.x < -60 || s.x > w + 60 ? 0 : under ? .12 : (.28 + depth * .72).toFixed(2);
      n.style.pointerEvents = under ? 'none' : '';
      n.style.zIndex = String(Math.round(depth * 100));
      n.classList.toggle('is-back', depth < .45);
      n.classList.toggle('is-front', front);
    });
  }

  /* ---------- HUD values ---------- */
  function paintMe() {
    const S = state(), lv = levelOf();
    if (!root.querySelector('.me__name')) return;
    root.querySelector('.me__sigil').innerHTML = GLYPH[S.sigil] || GLYPH.circle;
    root.querySelector('.me__name').textContent = S.name || t('common.guest');
    root.querySelector('.me__rank').textContent = `Lv ${lv.n} · ${L(lv.ar, lv.en)}`;
    root.querySelector('.xp__n').textContent = S.xp;
    root.querySelector('.xp__bar i').style.setProperty('--p', lv.pct);
    const st = root.querySelector('.streak'); st.hidden = !S.streak.days; st.querySelector('.hud-num').textContent = S.streak.days;
    paintSound();
  }
  offs.push(on('xp', paintMe), on('progress', () => { paintMe(); if (active >= 0) stats(ZONES[active]); }), on('settings', paintSound), on('reset', paintMe));
  // the hub is built before the setup screen, where the language can change while the router isn't listening yet
  offs.push(on('lang', () => { if (renderedLang !== lang()) api.refresh(); }));

  /* ---------- dive ---------- */
  async function dive() {
    if (diving) return; const z = ZONES[mod(Math.round(sel.v))]; diving = true;
    sfx('whoosh'); root.classList.add('is-diving');
    world.flash(z.color, .18);
    if (world.current !== (ZONE_FORMATION[z.id] || 'nebula')) world.morph(ZONE_FORMATION[z.id], { dur: 1.2 });
    world.setStage({ z: 7.2 }, 1.0);
    world.scatter(.35, { out: .5, back: 1.2 });
    await new Promise(r => setTimeout(r, 650));
    diving = false;
    if (!dead) onEnter?.(z.id);
  }

  /** phones: the eye and its orbit sit in the free band between the top bar and the poster (never under the text) */
  const phoneStage = () => {
    const top = root.querySelector('.hud__top')?.getBoundingClientRect().bottom || innerHeight * .15;
    const selEl = root.querySelector('.sel');
    const selTop = selEl ? selEl.getBoundingClientRect().top - (root.classList.contains('is-shown') ? 0 : 16) : innerHeight * .6;
    const band = Math.max(110, selTop - top);
    return { cx: .5, cy: (top + band / 2) / innerHeight, z: Math.min(26, Math.max(12.5, 12.5 * 230 / band)) };
  };
  const stageNow = () => (innerWidth > 760 ? hubStage() : phoneStage());
  listen(window, 'resize', () => { if (shown && innerWidth <= 760) world.setStage(phoneStage(), 0); });

  render();
  const api = {
    frame,
    show(selectId) {
      shown = true; root.hidden = false; root.classList.remove('is-diving');
      if (innerWidth > 760) world.setStage(hubStage(), 1.6);
      world.showRing?.(true, 1.6);
      paintMe();
      const want = selectId || (active < 0 ? recommend() : null);
      const i = want ? Math.max(0, ZONES.findIndex(z => z.id === want)) : active;
      if (active < 0) { sel.v = i; settle(); } else if (i !== active) go(i); else { paint(ZONES[i]); world.morph(ZONE_FORMATION[ZONES[i].id] || 'nebula', { dur: 1.6 }); }
      requestAnimationFrame(() => { if (innerWidth <= 760) world.setStage(phoneStage(), 1.6); root.classList.add('is-shown'); });
    },
    hide() { shown = false; root.classList.remove('is-shown'); root.hidden = true; world.showRing?.(false, .5); },
    /** language switch: re-render every string in place, keep the selection (and move the eye to its side) */
    refresh() {
      if (dead) return;
      render();
      if (active >= 0) paint(ZONES[active]);
      if (shown) { world.setStage(stageNow(), 1.2); frame(); }
    },
    /** experience switch: take back every listener, subscription and timer, and leave #hud empty */
    destroy() {
      dead = true; shown = false; drag = null;
      offs.forEach(f => { try { f(); } catch (e) { } }); offs.length = 0;
      clearTimeout(morphT); gsap.killTweensOf(sel);
      world.showRing?.(false, .4);
      nodes = [];
      root.innerHTML = ''; root.classList.remove('is-shown', 'is-diving'); root.style.removeProperty('--zc'); root.style.removeProperty('--zglow');
    },
    get active() { return ZONES[active]?.id; },
    paintMe
  };
  return api;
}
