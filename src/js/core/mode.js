// Experience mode: 'illustrated' (the drafting room: light paper, 2D SVG stage; the default) or 'immersive' (the night shift: dark particle world, WebGL).
// Saved in settings.mode and mirrored on <html data-mode>. Switching emits 'mode'.
import { state, save, emit } from './state.js';

export const MODES = ['immersive', 'illustrated'];
export const mode = () => (state().settings.mode === 'immersive' ? 'immersive' : 'illustrated');
export const isIllustrated = () => mode() === 'illustrated';

export function applyMode() { document.documentElement.dataset.mode = mode(); }
export function setMode(m) {
  if (!MODES.includes(m)) return;
  const changed = mode() !== m;
  state().settings.mode = m; save(); applyMode();
  if (changed) emit('mode', m);
}

/** QA / sharing: ?lang=en and ?mode=illustrated in the URL win over the saved choice (and are saved) */
export function readUrlPrefs() {
  const q = new URLSearchParams(location.search);
  const l = q.get('lang'), m = q.get('mode');
  let any = false;
  if (l === 'ar' || l === 'en') { state().settings.lang = l; any = true; }
  if (MODES.includes(m)) { state().settings.mode = m; any = true; }
  if (any) save();
  return any;
}
