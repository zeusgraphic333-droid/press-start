// One place to reach the question bank and the study tables.
import { QUESTIONS as ALL } from './bank/index.js';
import { ZONES } from '../content/zones.js';
export { TERMS, PAIRS, TRIGGERS } from './study/index.js';

export const QUESTIONS = ALL;
export const QBY = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
/** topic → zone (every zone owns the topics listed in its `tp`) */
export const TOPIC_ZONE = Object.fromEntries(ZONES.flatMap(z => z.tp.map(tp => [tp, z.id])));
/** topic → [Arabic, English] name (pick with L() at render time) */
export const TOPIC_NAME = Object.fromEntries(ZONES.flatMap(z => z.tp.map(tp => [tp, [z.ar, z.enShort || z.en]])));
export const qFor = topics => QUESTIONS.filter(q => topics.includes(q.tp));
/** options in display order: fixed items keep their order, the rest are shuffled; returns [{text, ok}] */
export function optionsOf(q, rnd = Math.random) {
  const right = q.a ?? 0;
  const list = q.o.map((t, i) => ({ text: t, ok: i === right }));
  if (q.fx) return list;
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  return list;
}
export const answerOf = q => q.o[q.a ?? 0];
