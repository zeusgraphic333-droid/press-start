// Language: 'en' (English, LTR; the default) or 'ar' (Egyptian Arabic, RTL). Saved in settings.lang.
// Content files come in pairs (mind.js + mind.en.js); UI strings live in strings.js and go through t().
// Switching emits 'lang' — the router re-renders the current screen.
import { state, save, emit } from './state.js';
import { STR as UI } from './strings.js';
import { STR as ENTRY } from './strings-entry.js';
const STR = { ar: { ...ENTRY.ar, ...UI.ar }, en: { ...ENTRY.en, ...UI.en } };

export const lang = () => (state().settings.lang === 'ar' ? 'ar' : 'en');
export const isEN = () => lang() === 'en';
export const isRTL = () => !isEN();
export const dir = () => (isEN() ? 'ltr' : 'rtl');

/** put lang/dir on <html> (call once at boot, and after every switch) */
export function applyLang() {
  const h = document.documentElement;
  h.lang = lang(); h.dir = dir(); h.dataset.lang = lang();
}
export function setLang(l) {
  if (l !== 'ar' && l !== 'en') return;
  const changed = lang() !== l;
  state().settings.lang = l; save(); applyLang();
  if (changed) emit('lang', l);
}

/**
 * L({ ar, en }) → the value for the current language (falls back to ar).
 * L('عربي', 'English') → same thing, two-argument form.
 */
export function L(a, b) {
  if (a && typeof a === 'object' && !Array.isArray(a) && ('ar' in a || 'en' in a)) return a[lang()] ?? a.ar ?? a.en;
  return isEN() && b !== undefined ? b : a;
}

/** t('key', { n: 3 }) → UI string with {var} substitution. Missing English falls back to Arabic; a missing key returns the key. */
export function t(key, vars) {
  let s = STR[lang()]?.[key];
  if (s === undefined) s = STR.ar[key];
  if (s === undefined) return key;
  if (typeof s === 'function') return s(vars || {});
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
  return s;
}

/** numbers: both languages use Latin digits (the HUD face is Latin) */
export const num = n => String(n);
