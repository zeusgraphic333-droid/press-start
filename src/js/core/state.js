// The player's save file (localStorage, best-effort) + levels, badges and the event bus.
import { today } from './util.js';

const KEY = 'pressstart.save.v1';
const fresh = () => ({
  v: 1, name: '', sigil: 'gear', created: Date.now(),
  xp: 0, seen: {}, checks: {}, games: {}, quiz: {}, boss: { wins: 0, tries: 0, best: 0 },
  exams: [], wrong: {}, fixed: {}, badges: {}, visits: {}, flags: {},
  streak: { last: '', days: 0, best: 0 }, combo: 0, bestCombo: 0,
  settings: { sound: false, motion: 'auto', lang: '', mode: '' } // lang/mode '' = not chosen yet (setup screen asks)
});
let S = fresh();
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* private mode: play without saving */ }
S.settings = Object.assign(fresh().settings, S.settings || {});

let saveT = 0;
export function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }, 120); }
export const state = () => S;
export function resetAll() { S = fresh(); try { localStorage.removeItem(KEY); } catch (e) { } emit('reset'); }

/* ---------- tiny event bus ---------- */
const subs = {};
export function on(ev, fn) { (subs[ev] ||= []).push(fn); return () => subs[ev] = subs[ev].filter(f => f !== fn); }
export function emit(ev, data) { (subs[ev] || []).forEach(f => { try { f(data); } catch (e) { console.error(e); } }); }

/* ---------- levels ---------- */
export const LEVELS = [
  { xp: 0, ar: 'واقف على الباب', en: 'At the Gate' },
  { xp: 120, ar: 'صبي ورشة', en: 'Apprentice' },
  { xp: 300, ar: 'مساعد أسطى', en: 'Helper' },
  { xp: 550, ar: 'أسطى', en: 'Craftsman' },
  { xp: 850, ar: 'فني تشغيل', en: 'Machinist' },
  { xp: 1200, ar: 'ملاحظ وردية', en: 'Shift Foreman' },
  { xp: 1650, ar: 'مهندس إنتاج', en: 'Production Engineer' },
  { xp: 2200, ar: 'مهندس تصميم', en: 'Design Engineer' },
  { xp: 2900, ar: 'كبير المهندسين', en: 'Chief Engineer' },
  { xp: 3800, ar: 'صاحب المصنع', en: 'Owns the Plant' }
];
export function levelOf(xp = S.xp) {
  let i = 0; while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].xp) i++;
  const cur = LEVELS[i], next = LEVELS[i + 1];
  return { n: i + 1, ...cur, next: next?.xp ?? null, pct: next ? (xp - cur.xp) / (next.xp - cur.xp) : 1 };
}

/* ---------- XP ---------- */
export function addXP(n, why = '') {
  if (!n) return;
  const before = levelOf().n;
  S.xp = Math.max(0, S.xp + n); save();
  emit('xp', { n, why, total: S.xp });
  const after = levelOf().n;
  if (after > before) emit('levelup', levelOf());
}
/** true only the first time a key is seen (for one-off rewards) */
export function once(key) { if (S.flags[key]) return false; S.flags[key] = 1; save(); return true; }

/* ---------- streak (days in a row) ---------- */
export function touchStreak() {
  const t = today(); const st = S.streak;
  if (st.last === t) return;
  const y = new Date(Date.now() - 864e5); const ys = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
  st.days = st.last === ys ? st.days + 1 : 1; st.last = t; st.best = Math.max(st.best, st.days); save();
  if (st.days >= 3) award('streak3');
}

/* ---------- badges (ar/en: name · d/dEn: what you did) ---------- */
export const BADGES = {
  hello: { ar: 'بدأت الوردية', en: 'Shift started', d: 'دخلت المصنع لأول مرة.', dEn: 'You walked onto the plant floor for the first time.', icon: 'gear' },
  explorer: { ar: 'لفّيت المصنع', en: 'Plant tour', d: 'زرت كل مناطق المنهج.', dEn: 'Visited every district of the course.', icon: 'wrench' },
  reader: { ar: 'قريت الكتالوج', en: 'Read the manual', d: 'خلّصت كل دروس منطقة واحدة.', dEn: 'Finished every lesson in one district.', icon: 'letter' },
  scholar: { ar: 'المنهج كله', en: 'Scholar', d: 'خلّصت كل الدروس في المنهج.', dEn: 'Finished every lesson in the course.', icon: 'lattice' },
  combo10: { ar: 'كومبو ١٠', en: 'Combo ×10', d: '١٠ إجابات صح ورا بعض.', dEn: '10 right answers in a row.', icon: 'bolt' },
  perfect: { ar: 'صفر عيوب', en: 'Zero defects', d: 'قفلت كويز منطقة من غير ولا غلطة.', dEn: 'Finished a district quiz without a single mistake.', icon: 'star' },
  gamer: { ar: 'إيدك تتلف في حرير', en: 'Skilled hands', d: 'خلّصت ٣ تحديات مختلفة.', dEn: 'Completed 3 different trials.', icon: 'target' },
  boss: { ar: 'كسرت المكبس', en: 'Press breaker', d: 'هزمت المكبس في المعركة.', dEn: 'Beat the Press in the boss fight.', icon: 'monolith' },
  portal: { ar: 'جاهز للبورتال', en: 'Portal ready', d: 'جبت ٨٠٪ أو أكتر في امتحان البورتال.', dEn: 'Scored 80% or more on the Portal exam.', icon: 'square' },
  revenge: { ar: 'خدت تارك', en: 'Revenge', d: 'صلّحت ١٠ غلطات قديمة.', dEn: 'Fixed 10 old mistakes.', icon: 'infinity' },
  streak3: { ar: 'نَفَس طويل', en: 'Streak', d: 'ذاكرت ٣ أيام ورا بعض.', dEn: 'Studied 3 days in a row.', icon: 'flame' },
  owl: { ar: 'وردية الليل', en: 'Night shift', d: 'ذاكرت بعد نص الليل. نام بقى.', dEn: 'Studied after midnight. Go to sleep.', icon: 'moon' },
  allstars: { ar: 'كل العلامات', en: 'All marks', d: 'جبت ٣ علامات في كل كويزات المناطق.', dEn: 'Earned 3 marks on every district quiz.', icon: 'crown' }
};
export function award(id) {
  if (!BADGES[id] || S.badges[id]) return false;
  S.badges[id] = Date.now(); save(); emit('badge', { id, ...BADGES[id] });
  return true;
}

/* ---------- progress helpers ---------- */
export function markSeen(chapId) { if (S.seen[chapId]) return false; S.seen[chapId] = Date.now(); save(); emit('progress'); return true; }
export function visit(zone) { if (!S.visits[zone]) { S.visits[zone] = Date.now(); save(); } }
export function recordAnswer(qid, ok) {
  if (ok) {
    S.combo++; S.bestCombo = Math.max(S.bestCombo, S.combo); if (S.combo >= 10) award('combo10');
    if (S.wrong[qid]) { S.wrong[qid]--; if (S.wrong[qid] <= 0) { delete S.wrong[qid]; S.fixed[qid] = Date.now(); if (Object.keys(S.fixed).length >= 10) award('revenge'); } }
  } else { S.combo = 0; S.wrong[qid] = Math.min(3, (S.wrong[qid] || 0) + 1); }
  const h = new Date().getHours(); if (h >= 0 && h < 4) award('owl');
  save();
}
export function setQuizResult(zone, pct) {
  const stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
  const q = S.quiz[zone] || { best: 0, stars: 0, tries: 0 };
  q.tries++; q.best = Math.max(q.best, pct); q.stars = Math.max(q.stars, stars); S.quiz[zone] = q; save();
  if (pct === 1) award('perfect');
  emit('progress');
  return stars;
}
export function setGameResult(id, score, max) {
  const pct = max ? score / max : 0;
  const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct > 0 ? 1 : 0;
  const g = S.games[id] || { best: 0, stars: 0, plays: 0 };
  g.plays++; g.best = Math.max(g.best, score); g.stars = Math.max(g.stars, stars); S.games[id] = g; save();
  if (Object.keys(S.games).length >= 3) award('gamer');
  emit('progress');
  return stars;
}
export function setSetting(k, v) { S.settings[k] = v; save(); emit('settings', S.settings); }
