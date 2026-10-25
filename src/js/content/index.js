// One door to the content in the current language (English editions fall back to Arabic until they exist).
import { LESSONS, LESSONS_EN } from './lessons/index.js';
import { GAMES, GAMES_EN } from '../games/index.js';
import { isEN } from '../core/i18n.js';
export const lessonFor = id => (isEN() && LESSONS_EN[id]) || LESSONS[id];
export const gamesFor = id => (isEN() && GAMES_EN[id]) || GAMES[id] || [];
/** every lesson in the current language, keyed by zone id */
export const allLessons = () => Object.fromEntries(Object.keys(LESSONS).map(k => [k, lessonFor(k)]));
