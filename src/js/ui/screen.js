// A full-screen level: [content column | stage]. The content column has a bar row (back · title · tabs · XP)
// and scrolls under it, never under anything fixed. The stage side is transparent: the particle world shows through.
import { esc } from '../core/util.js';
import { ICON } from './icons.js';
import { GLYPH } from './glyphs.js';
import { levelOf, state, on, emit } from '../core/state.js';
import { sfx } from '../core/sfx.js';
import { t, L, isEN, isRTL } from '../core/i18n.js';

let current = null;
export const currentScreen = () => current;
/** a stage caption [English title, Arabic line, English line] → the two lines to show in the current language */
export const capOf = (info = []) => isEN() ? [info[0], info[2] ?? (/[\u0600-\u06FF]/.test(info[1] || '') ? '' : info[1])] : [info[0], info[1]];

function lum(hex) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255; const f = c => c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); }
export function zoneVars(color, dark) {
  const on = lum(color) > 0.3 ? '#0A0C0F' : '#FFFFFF';
  return `--zc:${color};--zd:${dark};--zon:${on};--zglow:${color}59;`;
}

/**
 * openScreen({ id, title, en, glyph, color, dark, tabs:[{id,label,icon}], onBack, onTab, stage:true })
 * returns { el, body, panes, setTab(id), setCaption(n, title, line), close() }  (callers pass strings already in the current language; capOf() helps)
 */
export function openScreen(o) {
  closeScreen(true);
  const el = document.createElement('section');
  el.className = 'screen is-entering' + (o.stage === false ? ' screen--full' : '');
  el.dataset.screen = o.id;
  el.setAttribute('role', 'region'); el.setAttribute('aria-label', o.title);
  el.style.cssText = zoneVars(o.color || '#E39B3C', o.dark || '#9C6118');
  document.documentElement.style.setProperty('--zc', o.color || '#E39B3C');
  const lv = levelOf();
  el.innerHTML = `
    <div class="screen__main">
      <header class="screen__bar">
        <button type="button" class="btn btn--icon screen__back" aria-label="${esc(t('screen.back'))}" title="${esc(t('screen.backTitle'))}">${ICON.back}</button>
        <div class="screen__title"><span class="glyph screen__glyph">${GLYPH[o.glyph] || GLYPH.brand}</span><div><h2>${esc(o.title)}</h2>${o.en ? `<small dir="ltr">${esc(o.en)}</small>` : ''}</div></div>
        <div class="screen__xp"><span class="chip chip--lvl">Lv ${lv.n} · ${esc(L(lv.ar, lv.en))}</span><span class="chip" data-xp>${ICON.bolt}<span class="hud-num">${state().xp}</span></span></div>
        ${o.tabs ? `<nav class="tabs" role="tablist" aria-label="${esc(t('screen.sections'))}">${o.tabs.map((t, i) => `<button type="button" class="tab" role="tab" id="tab-${t.id}" aria-controls="pane-${t.id}" aria-selected="false" tabindex="-1" data-tab="${t.id}"><span class="tab__n hud-num">${String(i + 1).padStart(2, '0')}</span><span>${esc(t.label)}</span></button>`).join('')}<i class="tabs__ink" aria-hidden="true"></i></nav>` : ''}
      </header>
      <div class="screen__body" tabindex="-1">${o.tabs ? o.tabs.map(t => `<div class="pane" role="tabpanel" id="pane-${t.id}" aria-labelledby="tab-${t.id}" hidden></div>`).join('') : '<div class="pane" id="pane-main"></div>'}</div>
    </div>
    ${o.stage === false ? '' : `<aside class="screen__stage" aria-hidden="true"><div class="stage__cap"><span class="hud-num stage__n">FIG. 00</span><span class="stage__en"></span><span class="stage__ar"></span></div><div class="stage__frame"><i></i><i></i><i></i><i></i></div></aside>`}`;
  document.getElementById('screens').appendChild(el);
  const body = el.querySelector('.screen__body');
  const panes = Object.fromEntries([...el.querySelectorAll('.pane')].map(p => [p.id.replace('pane-', ''), p]));
  const api = { el, body, panes, tab: null, opened: {}, cleanups: [] };
  const ink = el.querySelector('.tabs__ink'), nav = el.querySelector('.tabs');
  /** tabs that can't fit their row (longer English labels on a phone) drop their numbers */
  const fitTabs = () => { if (!nav) return; nav.classList.remove('tabs--tight'); if (nav.scrollWidth > nav.clientWidth + 1) nav.classList.add('tabs--tight'); };
  const moveInk = () => { const t = el.querySelector('.tab[aria-selected="true"]'); if (!t || !ink) return; const nav = t.parentElement.getBoundingClientRect(), r = t.getBoundingClientRect(); ink.style.width = r.width + 'px'; ink.style.transform = `translateX(${r.left - nav.left}px)`; };
  api.setTab = (id, focus) => {
    if (!panes[id]) return;
    api.tab = id;
    el.querySelectorAll('.tab').forEach(t => { const on = t.dataset.tab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    Object.entries(panes).forEach(([k, p]) => p.hidden = k !== id);
    body.scrollTop = 0; moveInk();
    const first = !api.opened[id]; api.opened[id] = true;
    o.onTab?.(id, panes[id], first);
    if (focus) el.querySelector(`#tab-${id}`)?.focus();
  };
  api.setCaption = (n, en, ar) => {
    const c = el.querySelector('.stage__cap'); if (!c) return;
    c.classList.remove('in'); void c.offsetWidth;
    c.querySelector('.stage__n').textContent = 'FIG. ' + String(n).padStart(2, '0');
    c.querySelector('.stage__en').textContent = en || ''; c.querySelector('.stage__ar').textContent = ar || '';
    c.classList.add('in');
  };
  el.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { sfx('click'); api.setTab(t.dataset.tab); }));
  el.querySelector('.tabs')?.addEventListener('keydown', e => {
    const tabs = [...el.querySelectorAll('.tab')]; const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const fwd = isRTL() ? 'ArrowLeft' : 'ArrowRight', bwd = isRTL() ? 'ArrowRight' : 'ArrowLeft'; // tabs run in reading order
    const d = e.key === fwd ? 1 : e.key === bwd ? -1 : 0;
    if (d) { e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.click(); n.focus(); }
  });
  el.querySelector('.screen__back').addEventListener('click', () => { sfx('swoosh'); o.onBack ? o.onBack() : (location.hash = '#/'); });
  const onKey = e => { if (e.key === 'Escape' && !document.querySelector('.modal')) { e.preventDefault(); el.querySelector('.screen__back').click(); } };
  document.addEventListener('keydown', onKey); api.cleanups.push(() => document.removeEventListener('keydown', onKey));
  const offXP = on('xp', () => { const x = el.querySelector('[data-xp] .hud-num'); if (x) x.textContent = state().xp; const l = levelOf(); const c = el.querySelector('.chip--lvl'); if (c) c.textContent = `Lv ${l.n} · ${L(l.ar, l.en)}`; });
  api.cleanups.push(offXP);
  const ro = new ResizeObserver(() => { fitTabs(); moveInk(); }); ro.observe(el); api.cleanups.push(() => ro.disconnect());
  fitTabs();
  // phones: tell the world whether its band at the top is still in view (so it can rest when covered)
  let bandOn = true;
  const onScroll = () => { const on = body.scrollTop < innerHeight * .45; if (on !== bandOn) { bandOn = on; emit('band', on); } };
  body.addEventListener('scroll', onScroll, { passive: true }); api.cleanups.push(() => body.removeEventListener('scroll', onScroll));
  setTimeout(() => el.classList.remove('is-entering'), 900);
  api.close = (instant) => {
    api.cleanups.forEach(f => { try { f(); } catch (e) { } });
    Object.values(panes).forEach(p => { try { p._cleanup?.(); p._stop?.(); } catch (e) { } });
    if (instant) { el.remove(); return; }
    el.classList.add('is-leaving'); setTimeout(() => el.remove(), 600);
  };
  current = api;
  setTimeout(() => body.focus({ preventScroll: true }), 60);
  return api;
}
export function closeScreen(instant) { if (current) { current.close(instant); current = null; } }
