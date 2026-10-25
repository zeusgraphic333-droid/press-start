// The small toolbox lessons, demos and mini-games use. Keep it stable: content files depend on it.
import { state, addXP, once as onceFlag, setGameResult, emit, on } from './state.js';
import { sfx } from './sfx.js';
import { confetti, confettiAt, floatFrom, shake, burst, ring, pulse } from './fx.js';
import { GLYPH, glyph } from '../ui/glyphs.js';
import { QBY, optionsOf } from '../data/index.js';
import { figureHTML } from '../data/figs/index.js';
import { esc, rich, shuffle, seeded, sleep, pick } from './util.js';
import { lang, L, t } from './i18n.js';
import { mode } from './mode.js';

export const api = {
  /** give XP with a floating sticker from `fromEl`; `key` makes it a one-time reward */
  award(xp, { from = null, key = null, why = '' } = {}) {
    if (key && !onceFlag(key)) return false;
    addXP(xp, why);
    if (from) floatFrom(from, '+' + xp + ' XP', 'fx-float--xp');
    sfx('coin');
    return true;
  },
  once: onceFlag,
  sfx, confetti, confettiAt, burst, ring, shake, pulse,
  /** call when a mini-game round set ends; returns stars 0–3 and pays XP (first clear pays more) */
  finishGame(id, score, max, from = null) {
    const before = state().games[id]?.stars || 0;
    const stars = setGameResult(id, score, max);
    const xp = Math.round(10 + 40 * (max ? score / max : 0)) + (stars > before ? (stars - before) * 15 : 0);
    addXP(xp, 'game:' + id);
    if (from) floatFrom(from, '+' + xp + ' XP', 'fx-float--xp');
    if (stars >= 2) { sfx('win'); confetti({ big: stars === 3 }); } else sfx('boop');
    return { stars, xp };
  },
  state, emit, on,
  /* drawing helpers */
  glyph, GLYPH, fig: figureHTML,
  /** ask the stage to show a scene (see world/scenes/info.js) */
  scene(name) { emit('scene', { name }); },
  /* text + random helpers */
  esc, rich, shuffle, seeded, sleep, pick,
  q: id => QBY[id], optionsOf,
  /* language + mode (read at render time, never at module load) */
  get lang() { return lang(); }, get mode() { return mode(); }, L, t
};
export default api;
