// Trials — bend (English edition). Same ids as bend.js. Engines: games/_bend-kit.js · contract: docs/BRIEF.md § Trials.
import { springTrial, flatTrial, spotTrial, ART } from './_bend-kit.js';

const COMMON = { start: 'Start', orPress: 'or press', result: 'Your score', again: 'Play again', back: 'All trials', finish: 'See the score' };

const spring = springTrial({
  ...COMMON,
  title: 'Beat the springback', en: 'Overbend so it springs back on target',
  how: 'The sheet opens a little after the punch lifts. Pick the right tool angle so the part springs back exactly onto the target angle. 6 parts.',
  intro: {
    title: 'Bend it further… so it ends up right',
    text: 'The customer wants a set angle. The sheet has other plans: the moment the punch lifts, its included angle opens a little (springback). Your job is to pick a tool angle (αb′) a bit tighter, so the part opens and lands on the target.',
    rules: ['The dashed green line is the target angle.', 'Change the tool angle with the buttons, the slider or the arrow keys (Shift = 5°). Enter = bend.', 'Parts 1–3 come with a test result. Parts 4–6: your first bend is a free trial, the second one counts.', 'Within ¾° = 3 points. Within 2° = 2. Within 4° = 1.']
  },
  round: 'Part', score: 'Points', target: 'Target angle', tool: 'Tool angle αb′', bend: 'Bend', bendAgain: 'Bend for real', next: 'Next part',
  test: (t, p) => `<b>Test result:</b> a ${t}° tool made a ${p}° part. So this sheet opens ${p - t}° at this angle.`,
  trial: '<b>No test data this time.</b> Your first bend is free: bend, see how much it opens, then correct.',
  shot1: (part, opened) => `<b>Trial:</b> the part came out at ${part}°, so it opened ${opened}°. Close the tool by about that much and bend again.`,
  scored: (part, err, p) => `<b class="${p >= 2 ? 'bnd-ok' : 'bnd-no'}">${['Missed.', 'Close.', 'Nice.', 'Spot on!'][p]}</b> The part is ${part}°, ${err}° off the target: +${p}.`,
  best: tool => `The best tool angle was ${tool}°.`,
  lines: [['Bending master.', 'The sheet now stops exactly where you want it.'], ['Good hands.', 'A little more care and it’s perfect. Remember: a smaller bend springs back less.'], ['The sheet won this one.', 'Go back to the Springback chapter, then overbend by as much as it opens.']]
});

const flat = flatTrial({
  ...COMMON,
  title: 'Flat length', en: 'Lt with BA or BD, and K = t / T',
  how: 'Read the drawing: where are A and B measured to? Pick the formula, then do the sum. A few K = t / T rounds too. 8 rounds, no timer.',
  intro: {
    title: 'Cut the blank right the first time',
    text: 'Every round shows a part. First name the formula from the drawing, then work out the number. Some rounds are K = t / T.',
    rules: ['A and B stop where the bend starts = Lt = A + B + BA.', 'A and B run to the outside corner = Lt = A + B − BD.', 'Click, or press 1–4. Enter = next.']
  },
  round: 'Round', score: 'Points', next: 'Next',
  pickFormula: 'From the drawing: which formula?',
  why: { ba: 'A and B stop where the bend starts, so the bend itself is missing: + BA.', bd: 'A and B run to the outside corner, so that bit got counted twice: − BD.' },
  askLt: 'Total flat length Lt = ?', askBA: 'BA = ?', askBD: 'BD = ?', askK: 'K-factor = ?', askT: 't = ?',
  right: 'Right.', wrong: 'Not quite.',
  lines: [['The shears are yours.', 'Both formulas and the K-factor are easy for you now.'], ['Nearly.', 'Look hard at the drawing: where do A and B stop?'], ['Not yet.', 'Go back to the Flat length chapter, play with the demo, then come back.']]
});

const GAUGE = (x, k) => ({ prompt: `${x} thick: foil, sheet or plate?`, layout: 'row', fix: true, choices: [{ html: 'Foil', ok: k === 0 }, { html: 'Sheet metal', ok: k === 1 }, { html: 'Plate', ok: k === 2 }], explain: 'The limits: 0.15 mm and 6.35 mm.' });
const VE = (p, v) => ({ prompt: p, layout: 'yn', choices: [{ html: 'V-bending', ok: v }, { html: 'Edge bending', ok: !v }], explain: v ? 'V: low production, press brake, simple and inexpensive dies.' : 'Edge: high production, pressure pad, more complicated and costly dies.' });
const OP = (k, name, others, why) => ({ prompt: 'Which bending operation is this?', art: () => ART['bd-op-' + k](), choices: [{ html: name, ok: true }, ...others.map(o => ({ html: o }))], explain: why });
const TREE = (x, k) => ({ prompt: `${x}: which branch?`, layout: 'row', fix: true, choices: [{ html: 'Simple Bending', ok: k === 0 }, { html: 'Compound Bending', ok: k === 1 }, { html: 'Form and Cut (Stamping)', ok: k === 2 }], explain: 'Simple: bend, roll, continuous. Compound: spinning, hydro, drawing. Stamping: progressive, transfer, multiple action.' });
const spot = spotTrial({
  title: 'Right process, right word', en: 'Quick-fire across the whole lecture',
  how: 'One quick question after another: foil, sheet or plate? V or edge? Which operation is in the drawing? 12 questions, 10 seconds each.',
  intro: { title: 'The foreman asks fast', text: 'Question after question from the whole lecture. Pick the right word before the time runs out.', rules: ['Click the answer, or press its number.', 'Right answers in a row build a combo.', 'The names are in English, like the exam.'] },
  wins: [[1, 'Not one mistake.', 'The workshop is yours.'], [.8, 'Strong.', 'A little more focus and it’s perfect.'], [.5, 'Not bad.', 'Review the parts you slipped on and try again.'], [0, 'Not yet.', 'The lesson is waiting for you. Then the trial.']],
  rounds: [
    GAUGE('0.08 mm', 0), GAUGE('1.5 mm', 1), GAUGE('5 mm', 1), GAUGE('9 mm', 2), GAUGE('0.5 in', 2), GAUGE('0.12 mm', 0),
    VE('A prototype: 20 parts on a press brake.', true), VE('A production line: thousands of parts a day, with a pressure pad.', false),
    VE('You want a simple, cheap die.', true), VE('The dies are more complicated and costly, but the quantity is huge.', false),
    { prompt: 'The punch stopped here. What is this called?', art: () => ART['bd-air-q'](), choices: [{ html: 'Air bending', ok: true }, { html: 'Bottoming' }, { html: 'Edge bending' }], layout: 'row', explain: 'Air under the sheet: the punch never reached the bottom.' },
    OP('hem', 'Hemming', ['Curling', 'Seaming', 'Straight flanging'], 'The edge is folded flat onto itself.'),
    OP('curl', 'Curling', ['Hemming', 'Seaming', 'Shrink flanging'], 'The edge is rolled round.'),
    OP('seam', 'Seaming', ['Hemming', 'Curling', 'Stretch flanging'], 'Two sheets locked into each other.'),
    OP('shrink', 'Shrink flanging', ['Stretch flanging', 'Straight flanging', 'Hemming'], 'A flange along an edge that bulges out.'),
    OP('straight', 'Straight flanging', ['Stretch flanging', 'Shrink flanging', 'Seaming'], 'A flange along a straight line.'),
    TREE('Spinning', 1), TREE('Progressive dies', 2), TREE('Continuous Roll Forming', 0), TREE('Drawing', 1),
    { prompt: 'A small model shop needs one cylinder, rolled by hand.', layout: 'yn', choices: [{ html: 'Roll forming sheet', ok: true }, { html: 'Continuous roll forming' }], explain: 'Three hand-turned rolls: cheap, for model shops.' },
    { prompt: 'Kilometres of the same channel, in large quantities.', layout: 'yn', choices: [{ html: 'Continuous roll forming', ok: true }, { html: 'Roll forming sheet' }], explain: 'Constant profile + long lengths + large quantities = continuous roll forming.' },
    { prompt: 'A thin tube collapses as you bend it. You need:', choices: [{ html: 'A mandrel', ok: true }, { html: 'A pressure pad' }, { html: 'Annealing' }, { html: 'A V-die' }], explain: 'A mandrel is an internal support that prevents buckling.' },
    { prompt: 'The tool is 90°; the part came out at 93°. This is:', choices: [{ html: 'Springback', ok: true }, { html: 'Air bending' }, { html: 'Bend deduction' }, { html: 'Bottoming' }], explain: 'The included angle grew after the tool was removed.' },
    { prompt: 'The relief type in the circle:', art: () => ART['bd-relief-q'](), layout: 'row', choices: [{ html: 'Obround', ok: true }, { html: 'Tear-rip' }, { html: 'Rectangle' }], explain: 'A slot with a rounded end.' },
    { prompt: '“machine tool that performs most sheet metal operations”', layout: 'row', choices: [{ html: 'Stamping press', ok: true }, { html: 'Stampings' }, { html: 'Punch-and-die' }], explain: 'The press is the machine; stampings are the products; punch-and-die is the tooling.' }
  ]
});

export default [spring, flat, spot];
