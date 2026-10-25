// PRESS START — boot, the stage (GPU particles or the drafting-room 2D stage), and the router.
// Entry: Erebus Studios ident (the loader) → setup (language · experience · sound) → the title → name → the hub.
import gsap from 'gsap';
import { state, on, touchStreak, addXP, award } from './core/state.js';
import { sleep } from './core/util.js';
import { sfx, ambient } from './core/sfx.js';
import { openZone } from './ui/zone.js';
import { closeScreen, currentScreen } from './ui/screen.js';
import { ZONE } from './content/zones.js';
import { lessonFor, gamesFor, allLessons } from './content/index.js';
import { createParticles, canWebGL } from './world/particles.js';
import { createStage2D } from './world/stage2d.js';
import { titleBuilders } from './world/titles.js';
import { ZONE_FORMATION } from './world/formations.js';
import { createHub } from './ui/hub.js';
import { createHub2D } from './ui/hub2d.js';
import { onboarding } from './ui/intro.js';
import { mountIdent } from './ui/ident.js';
import { openSetup } from './ui/setup.js';
import { mountEvents } from './ui/events.js';
import { mountCursor } from './ui/cursor.js';
import { applyLang, isEN, isRTL, t, L } from './core/i18n.js';
import { applyMode, isIllustrated, setMode, mode, readUrlPrefs } from './core/mode.js';

const Q = location.search;
// QA renders at a few frames a second; don't let GSAP's lag smoothing stretch every tween
if (Q.includes('hq')) gsap.ticker.lagSmoothing(0);
let particles = null, stage2d = null, world = null, hub = null, hubMode = '', ready = false;
const wide = () => innerWidth > 980;
const content = id => ({ lesson: lessonFor(id), games: gamesFor(id) });
const titleName = () => 'title:' + (isEN() ? 'en' : 'ar');
/** the first district's machine: warmed up early, it's what the hub shows first */
const firstScene = () => ZONE_FORMATION.design;

function loadFonts() {
  const faces = ['800 120px Changa', '600 120px Changa', '800 120px "Big Shoulders Display"', '400 20px "Readex Pro"', '600 20px "Readex Pro"', '600 20px "Barlow Condensed"'];
  if (isIllustrated()) faces.push('800 60px "Big Shoulders Stencil Display"');
  return Promise.all(faces.map(f => document.fonts.load(f))).catch(() => { });
}

/* ---------- the stage: whichever the experience needs, created once, kept warm ---------- */
async function ensureWorld() {
  const W = document.getElementById('world'), S2 = document.getElementById('stage2d');
  if (isIllustrated()) {
    if (!stage2d) stage2d = createStage2D(S2);
    particles?.stop();
    W.hidden = true; S2.hidden = false;
    world = stage2d;
    world.start();
  } else {
    if (!particles && canWebGL() && !Q.includes('noworld')) {
      try {
        performance.mark?.('mg:w0');
        particles = createParticles(W, { onFrame: () => hub?.frame?.(), shouldRun: () => !currentScreen() || wide() || (currentScreen()?.body.scrollTop || 0) < innerHeight * .45 });
        particles.real = true;
        titleBuilders(particles);
        particles.set('nebula'); particles.uniforms.uOpacity.value = 0; particles.start();
        gsap.to(particles.uniforms.uOpacity, { value: .7, duration: 2.5, ease: 'power2.out' });
        performance.mark?.('mg:w1');
      } catch (e) { console.warn('world failed, using the flat map', e); particles = null; }
    }
    S2.hidden = true; W.hidden = false;
    world = particles || flatWorld();
    world.start();
  }
  return world;
}

/** the heavy formations (the title, the first machine) are sampled in idle slices, never on top of an animation */
let warmQ = [], warmT = 0;
function warmUp(names) {
  if (!particles) return;
  warmQ.push(...names.filter(n => !warmQ.includes(n)));
  if (warmT) return;
  const idle = window.requestIdleCallback || (f => setTimeout(() => f({ timeRemaining: () => 50 }), 120));
  const step = () => { warmT = 0; const n = warmQ.shift(); if (!n || !particles) return; particles.get(n); performance.mark?.('mg:warm:' + n); if (warmQ.length) warmT = idle(step, { timeout: 2500 }); };
  warmT = idle(step, { timeout: 2500 });
}

function buildHub() {
  try { hub?.destroy?.(); } catch (e) { }
  const opts = { lessons: allLessons(), onEnter: id => { location.hash = id === 'boss' ? '#/boss' : `#/z/${id}/learn`; }, onOpen: what => { location.hash = '#/' + what; } };
  hub = isIllustrated() ? createHub2D(world, opts) : createHub(world, opts);
  hubMode = mode();
}

async function boot() {
  const skip = Q.includes('skipintro');
  // until the ident has covered the screen, the page stays dark (no paper flash in the illustrated experience)
  if (!skip) document.documentElement.classList.add('booting');
  readUrlPrefs(); applyLang(); applyMode();
  touchStreak();
  mountCursor();
  if (state().settings.motion === 'reduce') document.documentElement.dataset.motion = 'reduce';
  mountEvents();
  let ident = null, fontsReady = null;
  if (!skip) {
    // the ident's two faces first (nothing competes with them for the wire), then the site's
    await Promise.race([Promise.all([document.fonts.load('400 100px Italiana'), document.fonts.load('500 16px Archivo')]).catch(() => { }), sleep(900)]);
    fontsReady = Promise.race([loadFonts(), sleep(3500)]);
    // the world's one heavy moment (GPU setup + the first formation) happens on the black frame, before the ident moves
    await ensureWorld();
    ident = mountIdent({ minMs: state().name ? 2700 : 3600 });
    ident.progress(30);
  }
  await (fontsReady ||= Promise.race([loadFonts(), sleep(3500)]));
  ident?.progress(70);
  if (skip) await ensureWorld();
  buildHub(); hub.hide();
  ident?.progress(100);
  window.__mg = { get world() { return world; }, get hub() { return hub; }, setMode, ...(Q.includes('qa') ? { addXP, award } : {}) };

  let sound = !!state().settings.sound;
  if (ident) {
    const removeIdent = await ident.finish();
    document.documentElement.classList.remove('booting');
    world.setStage?.({ cx: .5, cy: .5, z: 13.5 }, 0);
    world.set?.('nebula');
    const picked = openSetup({
      onMode: async m => { setMode(m); await ensureWorld(); world.set('nebula'); world.setStage({ cx: .5, cy: .5, z: 13.5 }, 0); warmUp([titleName(), firstScene()]); },
      onLang: async () => { warmUp([titleName()]); }
    });
    gsap.to(ident.el, { opacity: 0, duration: .9, ease: 'power2.out', onComplete: () => removeIdent?.() });
    setTimeout(() => warmUp([titleName(), firstScene()]), 1200);
    ({ sound } = await picked);
    // the hub was built before the setup screen: catch it up with what was picked there
    if (hubMode !== mode()) { buildHub(); hub.hide(); } else hub.refresh?.();
    // the title assembles: from points in the dark, or printed on paper
    if (isIllustrated()) { await world.morph(titleName(), { dur: 2.2 }); await sleep(1300); }
    else if (particles) { gsap.to(particles.uniforms.uOpacity, { value: 1, duration: .8 }); await particles.morph(titleName(), { dur: 2.1, swirl: 1.6 }); await sleep(900); }
  }
  if (skip) warmUp([firstScene()]);
  ambient(sound);
  on('settings', st => ambient(!!st.sound));
  if (!state().name) { world.morph('nebula', { dur: 2.2 }); await onboarding(); }
  ready = true;
  route();
  window.addEventListener('hashchange', route);
}

function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [a, b, c] = h.split('/');
  const site = t('site.name');
  document.title = a === 'z' && ZONE[b] ? `${L(ZONE[b].ar, ZONE[b].en)} · ${site}` : a === 'boss' ? `${L('الامتحان', 'The Exam')} · ${site}` : a === 'archive' || a === 'profile' ? `${L('الأرشيف', 'The Archive')} · ${site}` : site;
  if (a === 'z' && ZONE[b]) return toZone(b, c || 'learn');
  if (a === 'boss') return import('./ui/boss.js').then(m => { hub.hide(); m.openBoss(b, world); stageFor('boss'); }).catch(e => { console.error(e); location.hash = '#/'; });
  if (a === 'archive' || a === 'profile') return import('./ui/archive.js').then(m => { hub.hide(); m.openArchive(a === 'profile' ? 'me' : b, world); stageFor(null); }).catch(e => { console.error(e); location.hash = '#/'; });
  toHub();
}
function toHub() {
  const was = currentScreen();
  closeScreen();
  world.start();
  hub.show(was?.el?.dataset.screen?.replace('zone-', ''));
}
/** the level layout puts the stage beside the content column (left in Arabic, right in English) or in a band on phones */
function stageFor() {
  if (!world.real) return;
  world.start();
  if (wide()) world.setStage({ cx: isRTL() ? .225 : .775, cy: .5, z: 20.5 }, 1.6);
  else world.setStage(bandStage(), 1.4);
}
/** phones: the figure sits in the band between the screen's bar and the content (which starts 30vh down) */
function bandStage() {
  const bar = document.querySelector('.screen:not(.is-leaving) .screen__bar');
  const top = bar ? bar.getBoundingClientRect().bottom : innerHeight * .14;
  const band = innerHeight * .3, cy = (top + band / 2) / innerHeight;
  if (!isIllustrated()) return { cx: .5, cy, z: 19 };
  const size = Math.max(110, Math.min(innerWidth * .74, band * .92));
  return { cx: .5, cy, z: 13.5 * Math.min(innerWidth, innerHeight) * .8 / size };
}
addEventListener('resize', () => { if (ready && !wide() && currentScreen()) world?.setStage?.(bandStage(), 0); });
/* phones: rest the stage while the content covers its band */
on('band', visible => { if (!world?.real || wide() || !currentScreen()) return; visible ? world.start() : world.stop(); });
function toZone(id, tab) {
  const scr = currentScreen();
  if (scr?.el.dataset.screen === 'zone-' + id) { scr.setTab(tab); return; }
  hub.hide();
  openZone(id, tab, null, content(id));
  if (world.real && world.current !== ZONE_FORMATION[id]) world.morph(ZONE_FORMATION[id], { dur: 1.8 });
  stageFor(id);
  sfx('swoosh');
}

/* switching language or experience re-opens what you were looking at, in the new one */
function reopen() { closeScreen(true); route(); }
on('lang', () => {
  if (!ready) return; // the setup screen handles its own re-render
  if (hub?.refresh) hub.refresh(); else { buildHub(); if (currentScreen() || location.hash.length > 2) hub.hide(); }
  if (location.hash.replace(/^#\/?/, '')) reopen(); else route();
});
on('mode', async () => {
  if (!ready) return;
  await ensureWorld();
  buildHub();
  if (location.hash.replace(/^#\/?/, '')) { hub.hide(); reopen(); } else route();
});

/* big wins make the stage breathe out */
on('celebrate', o => { if (world?.real) world.scatter(o?.big ? .9 : .45, { out: .4, back: 1.8 }); });
/* lesson chapters ask for scenes */
on('scene', ({ name }) => { if (world?.real && name) world.morph(name, { dur: wide() ? 2 : 1.4 }); });

/** when WebGL is missing: same API, no particles (the hub still works) */
function flatWorld() {
  document.getElementById('world').classList.add('world--flat');
  const noop = () => Promise.resolve();
  return { real: false, mobile: innerWidth < 760, renderer: { domElement: document.getElementById('world') }, uniforms: {}, start() { }, stop() { }, morph: noop, set() { }, scatter: noop, flash() { }, setStage() { }, get() { }, builders: {}, current: '', project: () => ({ x: -999, y: -999, z: 0 }) };
}

boot();
