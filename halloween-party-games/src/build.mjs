// Builds "15 Halloween Party Games" as print-ready PDFs (US Letter + A4).
// Usage: node src/build.mjs
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ICONS, icon } from './icons.mjs';
import * as C from './content.mjs';
import { GAMES_META } from './games-meta.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'output');
mkdirSync(OUT, { recursive: true });

// ---------- deterministic randomness ----------
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, r) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- page chrome ----------
const AGE = { K: 'Kids', T: 'Teens', A: 'Adults' };
const pills = (ages) => ages.split('').map((a) => `<span class="pill pill-${a}">${AGE[a]}</span>`).join('');

const pages = [];   // { html, game }
const games = [];   // { n, title, ages, page }

let current = null;
function page(body, { game = current, cls = '' } = {}) {
  pages.push({ body, game, cls });
}
function header(n, title, ages, sub = '') {
  return `<header class="gh">
    <div class="gh-l"><div class="gnum">${n ? `Game ${String(n).padStart(2, '0')}` : 'Party Host Kit'}</div>
    <h1>${esc(title)}</h1>${sub ? `<div class="gsub">${sub}</div>` : ''}</div>
    <div class="gh-r">${ages ? pills(ages) : ''}</div>
  </header>`;
}
function rules(steps) {
  return `<div class="rules"><div class="rules-t">How to play</div><ol>${steps.map((s) => `<li>${s}</li>`).join('')}</ol></div>`;
}
function startGame(title, ages) {
  const n = games.length + 1;
  games.push({ n, title, ages, page: null, idx: pages.length });
  current = n;
  return n;
}

// ---------- 1. Spooky Picture Bingo ----------
{
  const n = startGame('Spooky Picture Bingo', 'KTA');
  const names = Object.keys(ICONS);
  const r = rng(31);
  page(`${header(n, 'Spooky Picture Bingo', 'KTA', '30 different cards · pictures + words, so even little ones who can\'t read yet can play')}
    ${rules([
      'Give every player a card and a handful of candy corn or wrapped candies as markers.',
      'Cut out the caller tiles below, fold them and put them in a bowl or hat.',
      'Draw one tile at a time and call it out. Players cover that picture if it is on their card.',
      'The center GHOST square is free. First to cover 5 in a row (across, down or diagonal) shouts "BOO!" and wins.',
      'Next rounds: play "four corners", "letter X" or "blackout" (cover the whole card).',
    ])}
    <div class="sec-t">Caller tiles <span class="cut">cut along the dashed lines</span></div>
    <div class="grid g6 cutgrid caller">${names.map((k) => `<div class="cell">${icon(k, 40)}<div>${esc(k)}</div></div>`).join('')}</div>`);
  const cards = [];
  for (let i = 0; i < 30; i++) {
    const pick = shuffle(names, r).slice(0, 24);
    pick.splice(12, 0, null);
    cards.push(pick);
  }
  for (let p = 0; p < 15; p++) {
    const two = cards.slice(p * 2, p * 2 + 2).map((card, k) => `
      <div class="bingo">
        <div class="bingo-h">${'GHOST'.split('').map((l) => `<div>${l}</div>`).join('')}</div>
        <div class="bingo-g">${card.map((c) => c
          ? `<div class="bc">${icon(c, 46)}<div>${esc(c)}</div></div>`
          : `<div class="bc free">${icon('Ghost', 46)}<div>FREE</div></div>`).join('')}</div>
        <div class="bingo-f">Card ${p * 2 + k + 1} of 30</div>
      </div>`).join('<div class="cutline"></div>');
    page(`<div class="bingo-wrap">${two}</div>`, { game: n });
  }
}

// ---------- 2. Halloween Trivia ----------
{
  const n = startGame('Halloween Trivia', 'KA');
  const list = (qs) => `<ol class="qlist">${qs.map(([q]) => `<li>${esc(q)}</li>`).join('')}</ol>`;
  page(`${header(n, 'Halloween Trivia · Kids Round', 'K', '15 questions · answers on the Answer Key pages')}
    ${rules(['Split into teams and hand each team an answer sheet.', 'The host reads each question out loud. Teams write their answer.', '1 point per correct answer. Most points wins the round!'])}
    ${list(C.TRIVIA_KIDS)}`, { game: n });
  page(`${header(n, 'Halloween Trivia · Grown-Ups Round', 'TA', '15 questions for teens, adults and office parties')}
    ${list(C.TRIVIA_ADULTS)}
    <div class="tip">Tie-breaker idea: ask "How many pieces of candy are in this bowl?" The closest guess wins.</div>`, { game: n });
  page(`${header(n, 'Trivia Answer Sheet', '', 'Print one per team')}
    <div class="ansheet">${[0, 1].map(() => `<div class="ans-col"><div class="field">Team name: <span class="line"></span></div>
      ${Array.from({ length: 15 }, (_, i) => `<div class="ans-row"><b>${i + 1}.</b><span class="line"></span></div>`).join('')}
      <div class="field total">Total: <span class="box"></span> / 15</div></div>`).join('<div class="vcut"></div>')}</div>`, { game: n });
}

// ---------- 3. Would You Rather ----------
{
  const n = startGame('Would You Rather? Halloween Edition', 'KTA');
  for (let p = 0; p < 3; p++) {
    const qs = C.WOULD_YOU_RATHER.slice(p * 12, p * 12 + 12);
    page(`${header(n, 'Would You Rather?', 'KTA', p === 0 ? '36 spooky questions · cut into cards' : `Cards ${p * 12 + 1}–${p * 12 + 12}`)}
      ${p === 0 ? rules(['Shuffle the cards and read one out loud.', 'Everyone picks a side of the room: left for the first choice, right for the second.', 'Each side gets 30 seconds to argue. Anyone who switches sides scores a point for the other team!']) : ''}
      <div class="grid g3 cutgrid wyr">${qs.map((q) => {
        const [a, b] = q.replace(/\?$/, '').split(' OR ');
        return `<div class="cell"><div class="wyr-t">Would you rather…</div><div class="wyr-a">${esc(a)}</div><div class="or">or</div><div class="wyr-a">${esc(b)}?</div></div>`;
      }).join('')}</div>`, { game: n });
  }
}

// ---------- 4. Monster Charades ----------
{
  const n = startGame('Monster Charades', 'KTA');
  for (let p = 0; p < 2; p++) {
    const cs = C.CHARADES.slice(p * 18, p * 18 + 18);
    page(`${header(n, 'Monster Charades', 'KTA', p === 0 ? '36 act-it-out cards · kid-easy to grown-up silly' : 'Cards 19–36 · the funny grown-up deck')}
      ${p === 0 ? rules(['Cut out the cards and place them face down.', 'A player picks a card and acts it out with no talking, no sounds!', 'Their team has 60 seconds to guess. 1 point per correct guess.']) : ''}
      <div class="grid g3 cutgrid char">${cs.map(([t, a]) => `<div class="cell"><span class="pill pill-${a}">${AGE[a]}</span><div class="char-t">${esc(t)}</div></div>`).join('')}</div>`, { game: n });
  }
}

// ---------- 5. Spooky Categories ----------
{
  const n = startGame('Spooky Categories', 'TA');
  page(`${header(n, 'Spooky Categories', 'TA', 'The fast "think of a word" game · print one sheet per player')}
    ${rules(['Pick a letter from the strip below. Start a 2-minute timer.', 'Write one answer for each category that starts with that letter.', 'Read answers out loud. Only answers nobody else wrote score 1 point. Play 3 rounds.'])}
    <table class="cat">
      <thead><tr><th>Category</th><th>Round 1<br><span class="lt">Letter: ___</span></th><th>Round 2<br><span class="lt">Letter: ___</span></th><th>Round 3<br><span class="lt">Letter: ___</span></th></tr></thead>
      <tbody>${C.CATEGORIES.map((c, i) => `<tr><td><b>${i + 1}.</b> ${esc(c)}</td><td></td><td></td><td></td></tr>`).join('')}
      <tr class="tot"><td>Score</td><td></td><td></td><td></td></tr></tbody>
    </table>
    <div class="sec-t">Letter strip <span class="cut">cut out and pick from a hat</span></div>
    <div class="letters cutgrid">${C.CATEGORY_LETTERS.map((l) => `<div class="cell">${l}</div>`).join('')}</div>`, { game: n });
}

// ---------- 6. Word Scramble ----------
const scrambled = [];
{
  const n = startGame('Monster Word Scramble', 'KT');
  const r = rng(7);
  for (const w of C.SCRAMBLE_WORDS) {
    let s = w;
    while (s === w) s = shuffle(w.split(''), r).join('');
    scrambled.push([s, w]);
  }
  page(`${header(n, 'Monster Word Scramble', 'KT', '20 jumbled spooky words · answer key at the back')}
    ${rules(['Unscramble each word and write it on the line.', 'Race against the clock: 5 minutes for the whole page!'])}
    <div class="scr">${scrambled.map(([s], i) => `<div class="scr-r"><b>${i + 1}.</b><span class="scr-w">${s.split('').join(' ')}</span><span class="line"></span></div>`).join('')}</div>`, { game: n });
}

// ---------- 7. Word Search ----------
const searches = [];
function makeSearch(words, size, dirs, seed) {
  for (let attempt = 0; attempt < 500; attempt++) {
    const r = rng(seed + attempt);
    const g = Array.from({ length: size }, () => Array(size).fill(''));
    const hits = new Set();
    let ok = true;
    for (const w of [...words].sort((a, b) => b.length - a.length)) {
      let placed = false;
      for (let t = 0; t < 300 && !placed; t++) {
        const [dx, dy] = dirs[Math.floor(r() * dirs.length)];
        const x0 = Math.floor(r() * size), y0 = Math.floor(r() * size);
        const x1 = x0 + dx * (w.length - 1), y1 = y0 + dy * (w.length - 1);
        if (x1 < 0 || x1 >= size || y1 < 0 || y1 >= size) continue;
        let fits = true;
        for (let i = 0; i < w.length; i++) { const c = g[y0 + dy * i][x0 + dx * i]; if (c && c !== w[i]) { fits = false; break; } }
        if (!fits) continue;
        for (let i = 0; i < w.length; i++) { g[y0 + dy * i][x0 + dx * i] = w[i]; hits.add(`${x0 + dx * i},${y0 + dy * i}`); }
        placed = true;
      }
      if (!placed) { ok = false; break; }
    }
    if (!ok) continue;
    const A = 'ABCDEFGHIJKLMNOPRSTUVWY';
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!g[y][x]) g[y][x] = A[Math.floor(r() * A.length)];
    return { g, hits };
  }
  throw new Error('word search failed');
}
function searchGrid(s, key = false) {
  const size = s.g.length;
  return `<div class="ws" style="grid-template-columns: repeat(${size}, minmax(0, 1fr))">${s.g.map((row, y) => row.map((c, x) =>
    `<div class="${key && s.hits.has(`${x},${y}`) ? 'hit' : ''}">${c}</div>`).join('')).join('')}</div>`;
}
{
  const n = startGame('Haunted Word Search (2 levels)', 'KT');
  const easy = makeSearch(C.WORDSEARCH_EASY, 9, [[1, 0], [0, 1]], 100);
  const hard = makeSearch(C.WORDSEARCH_HARD, 15, [[1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]], 200);
  searches.push(['Level 1', easy, 9], ['Level 2', hard, 15]);
  page(`${header(n, 'Haunted Word Search · Level 1', 'K', 'Little monsters · words go across and down')}
    <div class="ws-wrap ws-easy">${searchGrid(easy)}</div>
    <div class="wordbank">${C.WORDSEARCH_EASY.map((w) => `<span>${w}</span>`).join('')}</div>`, { game: n });
  page(`${header(n, 'Haunted Word Search · Level 2', 'TA', 'Brave souls only · words hide in all 8 directions, even backwards')}
    <div class="ws-wrap">${searchGrid(hard)}</div>
    <div class="wordbank">${C.WORDSEARCH_HARD.map((w) => `<span>${w}</span>`).join('')}</div>`, { game: n });
}

// ---------- 8. Pumpkin Draw & Guess ----------
{
  const n = startGame('Pumpkin Draw & Guess', 'KTA');
  page(`${header(n, 'Pumpkin Draw & Guess', 'KTA', 'Easy deck · 20 cards for younger artists')}
    ${rules(['Players take turns picking a card and drawing it on paper or a whiteboard. No letters or numbers allowed!', 'Their team has 60 seconds to guess.', 'Easy card = 1 point, Hard card = 2 points.'])}
    <div class="grid g4 cutgrid draw">${C.DRAW_EASY.map((w) => `<div class="cell"><span class="pill pill-K">Easy · 1 pt</span><div class="draw-t">${esc(w)}</div></div>`).join('')}</div>`, { game: n });
  page(`${header(n, 'Pumpkin Draw & Guess', 'KTA', 'Hard deck · 20 cards for bold artists')}
    <div class="grid g4 cutgrid draw draw-h">${C.DRAW_HARD.map((w) => `<div class="cell"><span class="pill pill-A">Hard · 2 pts</span><div class="draw-t">${esc(w)}</div></div>`).join('')}</div>`, { game: n });
}

// ---------- 9. Spooky Story Fill-ins ----------
{
  const n = startGame('Spooky Story Fill-ins', 'KTA');
  C.STORIES.forEach((s, si) => {
    const text = esc(s.text).replace(/\[(\d+)\]/g, (_, d) => `<span class="blank"><span class="bn">${d}</span></span>`);
    page(`${header(n, `Story ${si + 1}: ${s.title}`, 'KTA', 'Ask for the words FIRST, then read the silly story out loud')}
      <div class="story">
        <div class="ask"><div class="sec-t">Ask your friends for…</div>${s.blanks.map((b, i) => `<div class="ask-r"><b>${i + 1}</b><span class="line"></span><span class="hint">${esc(b)}</span></div>`).join('')}</div>
        <div class="story-t"><div class="sec-t">Now read it!</div><p>${text}</p></div>
      </div>`, { game: n });
  });
}

// ---------- 10. Who Am I? ----------
{
  const n = startGame('Who Am I? Guessing Cards', 'KTA');
  const iconFor = (w) => ({ Witch: 'Witch Hat', 'Full Moon': 'Moon', "Jack-o'-lantern": 'Pumpkin', Broomstick: 'Broom', 'Trick-or-Treater': 'Candy Bucket', Skeleton: 'Skull' })[w] || (ICONS[w] ? w : null);
  for (let p = 0; p < 2; p++) {
    const ws = C.WHO_AM_I.slice(p * 12, p * 12 + 12);
    page(`${header(n, 'Who Am I?', 'KTA', p === 0 ? '24 guessing cards · tape one to each guest\'s back or forehead' : 'Cards 13–24')}
      ${p === 0 ? rules(['Without peeking, each guest gets a card taped to their back (or held on their forehead).', 'Ask yes/no questions only: "Can I fly?" "Am I scary?"', 'First to guess who they are wins. Keep playing until everyone knows!']) : ''}
      <div class="grid g3 cutgrid who">${ws.map((w) => { const ic = iconFor(w); return `<div class="cell">${ic ? icon(ic, 54) : ''}<div class="who-t">${esc(w)}</div></div>`; }).join('')}</div>`, { game: n });
  }
}

// ---------- 11. This or That ----------
{
  const n = startGame('This or That? Run-Around Game', 'KTA');
  page(`${header(n, 'This or That?', 'KTA', 'The run-around game · zero prep, perfect warm-up')}
    ${rules(['Mark a LEFT side and a RIGHT side of the room.', 'The host calls out both choices. Everyone runs to the side they prefer.', 'Play fast! For a challenge: the smallest group each round sits out.'])}
    <div class="tot-list">${C.THIS_OR_THAT.map(([a, b], i) => `<div class="tot-r"><b>${i + 1}</b><span class="tot-a">${esc(a)}</span><span class="or">or</span><span class="tot-b">${esc(b)}</span></div>`).join('')}</div>`, { game: n });
}

// ---------- 12. Two Truths & a Lie ----------
{
  const n = startGame('Two Truths & a Spooky Lie', 'TA');
  page(`${header(n, 'Two Truths & a Spooky Lie', 'TA', 'Great icebreaker for office and grown-up parties')}
    ${rules(['Each guest fills a card with 2 true Halloween stories and 1 made-up one.', 'Take turns reading all 3 out loud. Everyone votes on the lie.', 'Fool the room = 2 points. Spot the lie = 1 point.'])}
    <div class="grid g2 cutgrid ttl">${C.TWO_TRUTHS_PROMPTS.map((p) => `<div class="cell"><div class="field">Name: <span class="line"></span></div><div class="hint">Idea: ${esc(p)}</div>
      ${[1, 2, 3].map((i) => `<div class="ttl-r"><b>${i}</b><span class="line"></span></div>`).join('')}</div>`).join('')}</div>`, { game: n });
}

// ---------- 13. Roll a Monster ----------
{
  const n = startGame('Roll a Monster Drawing Game', 'K');
  const pip = { 1: [[12, 12]], 2: [[6, 6], [18, 18]], 3: [[6, 6], [12, 12], [18, 18]], 4: [[6, 6], [18, 6], [6, 18], [18, 18]], 5: [[6, 6], [18, 6], [12, 12], [6, 18], [18, 18]], 6: [[6, 5], [18, 5], [6, 12], [18, 12], [6, 19], [18, 19]] };
  const die = (v) => `<svg width="22" height="22" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="5" fill="#fff" stroke="currentColor" stroke-width="1.6"/>${pip[v].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="currentColor"/>`).join('')}</svg>`;
  page(`${header(n, 'Roll a Monster', 'K', 'Roll a die 6 times and draw the monster the dice create!')}
    <table class="roll"><thead><tr><th></th>${[1, 2, 3, 4, 5, 6].map((v) => `<th>${die(v)}</th>`).join('')}</tr></thead>
    <tbody>${C.ROLL_A_MONSTER.map(([part, opts]) => `<tr><th>${part}</th>${opts.map((o) => `<td>${esc(o)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    <div class="drawbox"><div class="field">My monster's name: <span class="line"></span></div></div>`, { game: n });
}

// ---------- 14. Guess the Candy Jar ----------
{
  const n = startGame('Guess the Candy Jar', 'KTA');
  page(`${header(n, 'Guess the Candy Jar', 'KTA', 'Fill a jar with candy, set out this sign and the guess slips')}
    <div class="jar-sign">${icon('Candy Bucket', 90)}<div class="jar-h">How many candies<br>are in the jar?</div><div class="jar-s">Write your guess on a slip. Closest guess wins the whole jar!</div></div>
    <div class="sec-t">Guess slips <span class="cut">cut along the dashed lines</span></div>
    <div class="grid g2 cutgrid slips">${Array.from({ length: 10 }, () => `<div class="cell"><div class="field">Name: <span class="line"></span></div><div class="field">My guess: <span class="line"></span></div></div>`).join('')}</div>`, { game: n });
}

// ---------- 15. Costume Contest ----------
{
  const n = startGame('Costume Contest Ballots & Awards', 'KTA');
  page(`${header(n, 'Costume Contest Ballots', 'KTA', '8 ballots per page · print as many as you need')}
    <div class="grid g2 cutgrid ballots">${Array.from({ length: 8 }, () => `<div class="cell"><div class="ballot-h">${icon('Mask', 30)} Cast your vote!</div>
      ${C.BALLOT_AWARDS.slice(0, 4).map((a) => `<div class="field sm">${a}: <span class="line"></span></div>`).join('')}</div>`).join('')}</div>`, { game: n });
  for (let p = 0; p < 3; p++) {
    page(`<div class="certs">${C.BALLOT_AWARDS.slice(p * 2, p * 2 + 2).map((a) => `<div class="cert">
      <div class="cert-in"><div class="cert-k">Official Halloween Award</div>${icon('Star', 56)}<div class="cert-a">${a}</div>
      <div class="cert-p">proudly presented to</div><div class="cert-line"></div>
      <div class="cert-f"><div><span class="line"></span><div>Date</div></div><div><span class="line"></span><div>Signed by the Head Ghoul</div></div></div></div></div>`).join('<div class="cutline"></div>')}</div>`, { game: n });
  }
}

// ---------- Answer keys ----------
current = null;
const keyTrivia = `<div><div class="sec-t">Trivia · Kids Round</div><ol class="klist">${C.TRIVIA_KIDS.map(([, a]) => `<li>${esc(a)}</li>`).join('')}</ol></div>
    <div><div class="sec-t">Trivia · Grown-Ups Round</div><ol class="klist">${C.TRIVIA_ADULTS.map(([, a]) => `<li>${esc(a)}</li>`).join('')}</ol></div>`;
const keyScramble = `<div><div class="sec-t">Word Scramble</div><ol class="klist">${scrambled.map(([, w]) => `<li>${w}</li>`).join('')}</ol></div>`;
const keySearch = `${header(0, 'Answer Keys', '', 'Haunted Word Search')}
  <div class="keys2">${searches.map(([t, s, size]) => `<div><div class="sec-t">${t}</div><div class="ws-wrap ${size === 9 ? 'ws-key-easy' : 'ws-key'}">${searchGrid(s, true)}</div></div>`).join('')}</div>`;
// Answer-key pages used by the single-game editions, keyed by game number.
const SINGLE_KEYS = {
  2: [`${header(0, 'Answer Key', '', 'Halloween Trivia')}<div class="keys" style="grid-template-columns:repeat(2,minmax(0,1fr))">${keyTrivia}</div>`],
  6: [`${header(0, 'Answer Key', '', 'Monster Word Scramble')}<div class="keys" style="grid-template-columns:minmax(0,1fr)">${keyScramble}</div>`],
  7: [keySearch],
};
const keyStart = pages.length;
page(`${header(0, 'Answer Keys', '', 'Trivia · Word Scramble')}
  <div class="keys">${keyTrivia}${keyScramble}</div>`);
page(keySearch);

// ---------- Scoreboard + thank you ----------
page(`${header(0, 'Monster Scoreboard', '', 'Keep score across all games · the team with the most points wins the night')}
  <table class="score"><thead><tr><th>Game</th>${[1, 2, 3, 4].map((t) => `<th>Team ${t}<br><span class="line"></span></th>`).join('')}</tr></thead>
  <tbody>${games.map((g) => `<tr><td>${g.n}. ${esc(g.title)}</td><td></td><td></td><td></td><td></td></tr>`).join('')}
  <tr class="tot"><td>TOTAL</td><td></td><td></td><td></td><td></td></tr></tbody></table>`);
const teamScore = `${header(0, 'Team Scoreboard', '', 'Up to 4 teams · the team with the most points wins')}
  <table class="score"><thead><tr><th>Round</th>${[1, 2, 3, 4].map((t) => `<th>Team ${t}<br><span class="line"></span></th>`).join('')}</tr></thead>
  <tbody>${Array.from({ length: 18 }, (_, i) => `<tr><td>Round ${i + 1}</td><td></td><td></td><td></td><td></td></tr>`).join('')}
  <tr class="tot"><td>TOTAL</td><td></td><td></td><td></td><td></td></tr></tbody></table>`;
const SINGLE_SCORE = new Set([4, 8]);

function thanksPage(single) {
  const more = single
    ? `<div class="more"><div class="sec-t">More Halloween party games in our shop</div>
      <div class="grid g3 mgrid">${games.filter((g) => g.n !== single).map((g) => `<div class="mcard"><b>${esc(GAMES_META[g.n].name)}</b></div>`).join('')}</div>
      <div class="mcard" style="text-align:center;margin-top:2mm"><b>Want them all? Get the 15 Halloween Party Games Bundle</b><span>Hollow Lantern Studio · [YOUR ETSY SHOP LINK]</span></div></div>`
    : `<div class="more"><div class="sec-t">Find more Halloween printables in our Etsy shop</div>
      <div class="mcard" style="text-align:center"><b>Hollow Lantern Studio</b><span>[YOUR ETSY SHOP LINK]</span></div></div>`;
  return `<div class="thanks">${icon('Pumpkin', single ? 80 : 110)}
  <h1>Thank you for partying with us!</h1>
  <p>We hope your guests laughed, screamed and ate way too much candy.</p>
  <div class="coupon"><div>Your next order</div><div class="cpn">20% OFF</div><div>Use code <b>THANKYOU20</b> at checkout</div></div>
  ${more}
  <p class="small">Loved it? A quick review on Etsy helps our small shop more than you know.<br>
  © Hollow Lantern Studio. For personal, classroom and private party use. Please do not share or resell the files.</p></div>`;
}
const thanksIdx = pages.length;
page(thanksPage(null));

// ---------- Front matter (built last so page numbers are known) ----------
const FRONT = 4; // cover, welcome, host guide, quick-start
for (const g of games) g.page = g.idx + FRONT + 1;

const cover = `<div class="cover">
  <div class="cv-top"><span>INSTANT DOWNLOAD</span><span>US Letter &amp; A4</span></div>
  <div class="cv-num">15</div>
  <div class="cv-t">Halloween<br>Party Games</div>
  <div class="cv-s">One printable bundle for kids, teens, grown-ups, classrooms &amp; office parties</div>
  <div class="cv-icons">${['Pumpkin', 'Ghost', 'Bat', 'Witch Hat', 'Candy Corn', 'Black Cat', 'Skull'].map((k) => icon(k, 64)).join('')}</div>
  <div class="cv-f">Hollow Lantern Studio</div>
</div>`;

const welcome = `${header(0, 'Welcome to the party!', '', 'Everything you need to host a Halloween party everyone remembers')}
  <div class="toc">${games.map((g) => `<div class="toc-r"><b>${String(g.n).padStart(2, '0')}</b><span class="toc-t">${esc(g.title)}</span><span class="toc-a">${pills(g.ages)}</span><span class="toc-p">p.${g.page}</span></div>`).join('')}
  <div class="toc-r extra"><b>+</b><span class="toc-t">Answer Keys · Monster Scoreboard · Award Certificates</span><span class="toc-a"></span><span class="toc-p">p.${keyStart + FRONT + 1}</span></div></div>
  <div class="grid g3 tips">
    <div class="tipc"><b>Print smart</b><span>Pages are mostly white to save ink. Print only the games you need. Card stock makes cards last for years.</span></div>
    <div class="tipc"><b>Pick your size</b><span>Use the US Letter file in the US/Canada and the A4 file everywhere else. Choose "Fit to page" if your printer asks.</span></div>
    <div class="tipc"><b>Short on time?</b><span>Turn the page: the Party Plans tell you exactly which games to play, in what order, for how long.</span></div>
  </div>`;

const plan = (title, aud, rows) => `<div class="plan"><div class="plan-h"><b>${title}</b><span>${aud}</span></div>${rows.map(([t, g]) => `<div class="plan-r"><span class="pt">${t}</span><span>${g}</span></div>`).join('')}</div>`;
const host = `${header(0, 'Ready-Made Party Plans', '', 'No planning needed: follow a plan, print only those pages')}
  <div class="grid g2 plans">
    ${plan('Kids Party', '60 minutes · ages 4–10', [['0:00', 'This or That? warm-up'], ['0:10', 'Spooky Picture Bingo (2 rounds)'], ['0:25', 'Monster Charades (Kids cards)'], ['0:40', 'Roll a Monster drawing'], ['0:50', 'Costume parade + awards']])}
    ${plan('Grown-Up / Office Party', '90 minutes · teens & adults', [['0:00', 'Two Truths & a Spooky Lie'], ['0:15', 'Halloween Trivia (Grown-Ups)'], ['0:35', 'Spooky Categories (3 rounds)'], ['0:55', 'Monster Charades (Adult cards)'], ['1:10', 'Costume Contest ballots + awards']])}
    ${plan('Classroom Party', '45 minutes · one teacher, 25 kids', [['0:00', 'Word Scramble or Word Search at desks'], ['0:10', 'Picture Bingo (whole class)'], ['0:25', 'Would You Rather? (left/right of room)'], ['0:35', 'Guess the Candy Jar winner']])}
    ${plan('Family Game Night', 'any length · all ages', [['Start', 'Who Am I? cards on foreheads'], ['Then', 'Pumpkin Draw & Guess, kids vs grown-ups'], ['Then', 'Spooky Story Fill-ins read aloud'], ['End', 'Trivia: Kids Round, everyone plays']])}
  </div>
  <div class="supplies"><b>Handy supplies:</b> scissors · candy corn or wrapped candy (bingo markers) · pens · a timer (phone works) · a bowl or hat · small prizes</div>`;

const quick = `${header(0, 'Quick-Start Checklist', '', 'Tick it off the night before')}
  <div class="check">${['Choose a party plan (previous page)', 'Print the pages for those games (card stock for cards)', 'Cut out cards, tiles and slips', 'Fill the candy jar and count it (write the number here: ______ )', 'Put bingo markers in small cups', 'Print 1 trivia answer sheet per team', 'Print 1 Spooky Categories sheet per player', 'Print award certificates and fill in the winners on the night', 'Set a timer and have fun!'].map((t) => `<div class="ck"><span class="box"></span>${esc(t)}</div>`).join('')}</div>
  <div class="tip">Tip: laminate the bingo cards or slip them in sheet protectors and use dry-erase markers to play again next year.</div>`;

const front = [
  { body: cover, cls: 'p-cover' },
  { body: welcome }, { body: host }, { body: quick },
];
const all = [...front, ...pages];

// ---------- CSS ----------
const css = `
@font-face{font-family:Fredoka;src:url(../fonts/Fredoka.woff2) format('woff2');font-weight:300 700}
@font-face{font-family:'DM Sans';src:url(../fonts/DMSans.woff2) format('woff2');font-weight:100 1000}
@font-face{font-family:Creepster;src:url(../fonts/Creepster.woff2) format('woff2')}
:root{--ink:#1E1824;--muted:#5E5468;--orange:#E2620F;--orange-soft:#FBD3B4;--purple:#4F2E7E;--purple-soft:#DDCDF1;--green-soft:#CBE6B2;--yellow:#F2B705;--yellow-soft:#FCE7A2;--red:#C0392B;--red-soft:#F6C6C0;--line:#B7ACC2}
*{box-sizing:border-box}
html,body{margin:0;padding:0;color:var(--ink);font-family:'DM Sans',sans-serif;font-size:10.5pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:var(--pw);height:var(--ph);padding:13mm 14mm 11mm;display:flex;flex-direction:column;gap:4.5mm;page-break-after:always;overflow:hidden;position:relative}
.page:last-child{page-break-after:auto}
.foot{margin-top:auto;display:flex;justify-content:space-between;font-size:8pt;color:var(--muted);border-top:1px solid #E6E0EC;padding-top:2mm}
h1{font-family:Fredoka;font-weight:700;font-size:25pt;margin:0;line-height:1.05}
.gh{display:flex;justify-content:space-between;align-items:flex-start;gap:6mm;border-bottom:2.5px solid var(--ink);padding-bottom:3mm}
.gnum{font-family:Fredoka;font-weight:600;color:var(--orange);letter-spacing:.14em;text-transform:uppercase;font-size:10pt}
.gsub{color:var(--muted);margin-top:1mm}
.gh-r{display:flex;gap:1.5mm;flex-wrap:wrap;justify-content:flex-end;padding-top:1mm}
.pill{display:inline-block;font-size:7.5pt;font-weight:700;padding:.6mm 2.4mm;border-radius:99px;border:1.2px solid currentColor;white-space:nowrap}
.pill-K{color:#2E7D32}.pill-T{color:var(--purple)}.pill-A{color:var(--orange)}
.rules{background:#F6F2F9;border-radius:3mm;padding:3mm 5mm}
.rules-t{font-family:Fredoka;font-weight:600;font-size:11.5pt;color:var(--purple)}
.rules ol{margin:1mm 0 0;padding-left:5mm}.rules li{margin:.6mm 0}
.sec-t{font-family:Fredoka;font-weight:600;font-size:12pt;color:var(--purple);display:flex;gap:3mm;align-items:baseline}
.cut{font-family:'DM Sans';font-weight:400;font-size:8pt;color:var(--muted)}
.grid{display:grid;gap:0}.g2{grid-template-columns:repeat(2,minmax(0,1fr))}.g3{grid-template-columns:repeat(3,minmax(0,1fr))}.g4{grid-template-columns:repeat(4,minmax(0,1fr))}.g6{grid-template-columns:repeat(6,minmax(0,1fr))}
.cutgrid{border-top:1.2px dashed var(--line);border-left:1.2px dashed var(--line)}
.cutgrid>.cell{border-right:1.2px dashed var(--line);border-bottom:1.2px dashed var(--line);padding:3mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:1.2mm}
.caller .cell{font-size:8pt;font-weight:700;padding:1.6mm}
.bingo-wrap{display:flex;flex-direction:column;flex:1;justify-content:space-between}
.cutline{border-top:1.4px dashed var(--line);margin:2mm 0}
.bingo{border:2.5px solid var(--ink);border-radius:4mm;overflow:hidden}
.bingo-h{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));background:var(--purple);color:#fff;font-family:Creepster;font-size:28pt;text-align:center;line-height:1.25;letter-spacing:.05em}
.bingo-g{display:grid;grid-template-columns:repeat(5,minmax(0,1fr))}
.bc{height:20.5mm;border-right:1.2px solid var(--ink);border-top:1.2px solid var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:7.5pt;font-weight:700;text-align:center;gap:.5mm}
.bc:nth-child(5n){border-right:0}
.bc .ico{width:12mm;height:12mm}
.bc.free{background:var(--orange-soft);font-family:Fredoka;font-size:10pt}
.bingo-f{text-align:right;font-size:7pt;color:var(--muted);padding:1mm 3mm;border-top:1.2px solid var(--ink)}
.qlist{margin:0;padding-left:8mm;display:flex;flex-direction:column;justify-content:space-evenly;flex:1;font-size:13.5pt}
.qlist li::marker{font-family:Fredoka;font-weight:700;color:var(--orange)}
.tip{background:var(--yellow-soft);border-radius:3mm;padding:3mm 5mm;font-size:10pt}
.ansheet{display:flex;flex:1;gap:6mm}.ans-col{flex:1;display:flex;flex-direction:column;gap:3.4mm}.vcut{border-left:1.4px dashed var(--line)}
.ans-row,.field{display:flex;align-items:flex-end;gap:2mm}
.line{flex:1;border-bottom:1.2px solid var(--ink);min-width:10mm;height:5mm;display:inline-block}
.box{display:inline-block;width:12mm;height:7mm;border:1.4px solid var(--ink);border-radius:1.5mm}
.field.total{margin-top:auto;font-family:Fredoka;font-weight:600;font-size:13pt;align-items:center}
.wyr{flex:1;grid-auto-rows:1fr}.wyr .cell{gap:1.6mm}
.wyr-t{font-size:8pt;color:var(--muted);text-transform:uppercase;letter-spacing:.12em}
.wyr-a{font-family:Fredoka;font-weight:600;font-size:11.5pt;line-height:1.15}
.or{font-family:Creepster;color:var(--orange);font-size:14pt}
.char,.draw,.who{flex:1;grid-auto-rows:1fr}
.char-t,.draw-t{font-family:Fredoka;font-weight:600;font-size:13pt;line-height:1.15}
.who-t{font-family:Fredoka;font-weight:700;font-size:16pt}
.who .ico{width:17mm;height:17mm}
table{border-collapse:collapse;width:100%}
.cat th,.cat td{border:1.2px solid var(--ink);padding:2mm;text-align:left;vertical-align:middle}
.cat th{background:#F6F2F9;font-family:Fredoka;font-weight:600}
.cat td{height:10.4mm}.cat td:first-child{width:38%}
.cat .lt{font-family:'DM Sans';font-weight:400;font-size:8.5pt}
.cat .tot td,.score .tot td{font-family:Fredoka;font-weight:700;background:var(--orange-soft)}
.letters{display:grid;grid-template-columns:repeat(15,minmax(0,1fr))}
.letters .cell{font-family:Creepster;font-size:20pt;padding:2mm;color:var(--purple)}
.scr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5mm 10mm;flex:1;align-content:space-evenly}
.scr-r{display:flex;align-items:flex-end;gap:2.5mm;font-size:11pt}
.scr-w{font-family:Fredoka;font-weight:600;font-size:13pt;color:var(--purple);min-width:44mm;letter-spacing:.06em}
.ws-wrap{display:flex;justify-content:center;flex:1;align-items:center}
.ws{display:grid;border:2.5px solid var(--ink);border-radius:3mm;width:170mm;aspect-ratio:1;font-family:Fredoka;font-weight:600;font-size:15pt;padding:2mm}
.ws>div{display:flex;align-items:center;justify-content:center;border-radius:2mm}
.ws-easy .ws{width:135mm;font-size:28pt}
.ws-key .ws{width:118mm;font-size:10.5pt}.ws-key-easy .ws{width:80mm;font-size:15pt}
.ws .hit{background:var(--orange-soft);color:var(--ink)}
.wordbank{display:flex;flex-wrap:wrap;gap:2mm 3mm;justify-content:center}
.wordbank span{font-family:Fredoka;font-weight:600;border:1.4px solid var(--ink);border-radius:99px;padding:.8mm 3.5mm}
.story{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:8mm;flex:1}
.ask{display:flex;flex-direction:column;gap:3.4mm}
.ask-r{display:grid;grid-template-columns:5mm minmax(0,1fr);align-items:end;column-gap:2mm}
.ask-r .hint{grid-column:2;font-size:8pt;color:var(--muted)}
.story-t p{font-size:13.5pt;line-height:2.15;margin:2mm 0}
.blank{display:inline-block;width:27mm;border-bottom:1.4px solid var(--ink);position:relative;height:5mm}
.bn{position:absolute;left:0;bottom:-4mm;font-size:7pt;color:var(--orange);font-weight:700}
.tot-list{display:flex;flex-direction:column;gap:1mm;flex:1;justify-content:space-evenly}
.tot-r{display:grid;grid-template-columns:8mm minmax(0,1fr) 14mm minmax(0,1fr);align-items:center;font-family:Fredoka;font-weight:600;font-size:12pt;border-bottom:1px solid #E6E0EC;padding-bottom:1.2mm}
.tot-r b{color:var(--orange)}.tot-a{text-align:right}.tot-r .or{text-align:center}
.ttl{flex:1;grid-auto-rows:1fr}.ttl .cell{align-items:stretch;text-align:left;justify-content:space-evenly}
.ttl .hint{font-size:8.5pt;color:var(--muted)}
.ttl-r{display:flex;align-items:flex-end;gap:2mm}
.roll th,.roll td{border:1.2px solid var(--ink);padding:2.4mm;text-align:center;font-size:9.5pt}
.roll thead th{background:#F6F2F9}.roll tbody th{font-family:Fredoka;font-weight:600;background:var(--orange-soft);width:18mm}
.drawbox{flex:1;border:2.5px dashed var(--ink);border-radius:4mm;padding:4mm;display:flex;flex-direction:column;justify-content:flex-end}
.jar-sign{border:3px solid var(--ink);border-radius:5mm;padding:7mm;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3mm}
.jar-h{font-family:Fredoka;font-weight:700;font-size:28pt;line-height:1.05}
.jar-s{font-size:12pt;color:var(--muted)}
.slips{flex:1;grid-auto-rows:1fr}.slips .cell{align-items:stretch;gap:3mm}
.ballots{flex:1;grid-auto-rows:1fr}.ballots .cell{align-items:stretch;gap:2.2mm}
.ballot-h{display:flex;align-items:center;gap:2mm;font-family:Fredoka;font-weight:700;font-size:13pt}
.field.sm{font-size:9.5pt}
.certs{display:flex;flex-direction:column;flex:1;justify-content:space-between}
.cert{height:118mm;border:3px solid var(--purple);border-radius:5mm;padding:2.5mm}
.cert-in{height:100%;border:1.2px solid var(--purple);border-radius:3.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2mm;text-align:center;padding:5mm}
.cert-k{letter-spacing:.24em;text-transform:uppercase;font-size:9pt;color:var(--purple);font-weight:700}
.cert-a{font-family:Creepster;font-size:34pt;color:var(--orange);line-height:1}
.cert-p{color:var(--muted)}.cert-line{width:110mm;border-bottom:1.4px solid var(--ink);height:10mm}
.cert-f{display:flex;gap:16mm;width:130mm;margin-top:4mm;font-size:8pt;color:var(--muted)}.cert-f>div{flex:1;display:flex;flex-direction:column;gap:1mm}.cert-f .line{flex:none;width:100%}
.keys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7mm}
.klist{margin:2mm 0 0;padding-left:6mm;display:flex;flex-direction:column;gap:1.8mm;font-size:10pt}
.keys2{display:flex;flex-direction:column;gap:5mm;flex:1}
.score th,.score td{border:1.2px solid var(--ink);padding:1.6mm 2.4mm;text-align:left;font-size:9.5pt}
.score th{background:#F6F2F9;font-family:Fredoka;font-weight:600;width:16%}.score th:first-child{width:auto}
.score th .line{display:block;width:100%;margin-top:1mm}
.score td{height:9.6mm}
.toc{display:flex;flex-direction:column}
.toc-r{display:grid;grid-template-columns:10mm minmax(0,1fr) 52mm 12mm;align-items:center;gap:2mm;padding:1.7mm 0;border-bottom:1px solid #E6E0EC}
.toc-r b{font-family:Fredoka;color:var(--orange);font-size:12pt}.toc-t{font-family:Fredoka;font-weight:600;font-size:11.5pt}
.toc-a{display:flex;gap:1mm;justify-content:flex-end}.toc-p{text-align:right;color:var(--muted)}
.tips{gap:4mm}.tipc{background:#F6F2F9;border-radius:3mm;padding:3.5mm;display:flex;flex-direction:column;gap:1mm;font-size:9pt}.tipc b{font-family:Fredoka;font-size:11pt;color:var(--purple)}
.plans{gap:5mm;flex:1}
.plan{border:2px solid var(--ink);border-radius:4mm;overflow:hidden;display:flex;flex-direction:column}
.plan-h{background:var(--purple);color:#fff;padding:3mm 4mm;display:flex;flex-direction:column}.plan-h b{font-family:Fredoka;font-size:15pt}.plan-h span{font-size:9pt;opacity:.9}
.plan-r{display:flex;gap:3mm;padding:2.6mm 4mm;border-top:1px solid #E6E0EC;font-size:10.5pt}.pt{font-family:Fredoka;font-weight:600;color:var(--orange);width:11mm;flex:none}
.supplies{background:var(--yellow-soft);border-radius:3mm;padding:3mm 5mm}
.check{display:flex;flex-direction:column;gap:5mm;font-size:13pt;flex:1;justify-content:center}
.ck{display:flex;align-items:center;gap:4mm}.ck .box{width:7mm;height:7mm;flex:none}
.p-cover{padding:0}
.cover{flex:1;background:#2B1B3D;color:#F6EFE2;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6mm;padding:16mm;position:relative}
.cv-top{position:absolute;top:12mm;left:14mm;right:14mm;display:flex;justify-content:space-between;font-weight:700;letter-spacing:.16em;font-size:9pt}
.cv-top span:first-child{background:#F07F2E;color:#1E1824;padding:1.5mm 3mm;border-radius:1.5mm}
.cv-num{font-family:Creepster;font-size:150pt;line-height:.8;color:#F07F2E}
.cv-t{font-family:Fredoka;font-weight:700;font-size:50pt;line-height:.95}
.cv-s{font-size:14pt;max-width:140mm;color:#DCCFE6}
.cv-icons{display:flex;gap:4mm;color:#F6EFE2;margin-top:6mm}
.cv-icons .ico{--orange-soft:#F07F2E;--purple-soft:#7C55B5;--yellow-soft:#F5C84A}
.cv-f{position:absolute;bottom:12mm;font-family:Fredoka;letter-spacing:.2em;text-transform:uppercase;font-size:10pt;color:#B9AEC2}
.thanks{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;gap:4mm;justify-content:center}
.thanks h1{font-size:30pt}.thanks p{font-size:12pt;margin:0}
.coupon{border:3px dashed var(--orange);border-radius:5mm;padding:5mm 14mm;display:flex;flex-direction:column;gap:1mm}
.cpn{font-family:Creepster;font-size:44pt;color:var(--orange);line-height:1}
.more{width:100%;display:flex;flex-direction:column;gap:2mm;align-items:center}.more .grid{gap:3mm;width:100%}
.mcard{border:1.4px solid var(--line);border-radius:3mm;padding:3mm;display:flex;flex-direction:column;font-size:9pt;text-align:left}.mcard b{font-family:Fredoka;font-size:11pt}
.small{font-size:8.5pt !important;color:var(--muted)}
.cv-big .ico{width:62mm;height:62mm}
.cv-k{font-weight:700;letter-spacing:.24em;text-transform:uppercase;font-size:14pt;color:#F07F2E}
.cv-t-s{font-size:48pt;max-width:180mm}
.cover .cv-s{font-size:16pt}
.cv-pills{display:flex;gap:2.5mm;flex-wrap:wrap;justify-content:center}.cv-pills span{border:1.5px solid #F6EFE2;border-radius:99px;padding:1.4mm 5mm;font-weight:700;font-size:13pt}
.cv-inc{display:flex;flex-direction:column;gap:2.5mm;font-size:14pt;color:#DCCFE6;max-width:170mm;margin-top:4mm}
.mgrid{gap:2mm !important}.mgrid .mcard{padding:2mm 3mm}
`;

function html(docPages, size, product) {
  const dims = size === 'letter' ? ['215.9mm', '279.4mm'] : ['210mm', '297mm'];
  let pn = 0;
  const body = docPages.map((p) => {
    pn++;
    const foot = p.cls === 'p-cover' ? '' : `<div class="foot"><span>Hollow Lantern Studio · ${esc(product)}</span><span>${pn}</span></div>`;
    return `<section class="page ${p.cls || ''}">${p.body}${foot}</section>`;
  }).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(product)}</title>
<style>@page{size:${size === 'letter' ? 'letter' : 'A4'};margin:0}:root{--pw:${dims[0]};--ph:${dims[1]}}${css}</style></head><body>${body}</body></html>`;
}

// ---------- Single-game editions ----------
function gameCover(g, m, pageCount) {
  return `<div class="cover">
  <div class="cv-top"><span>INSTANT DOWNLOAD</span><span>US Letter &amp; A4</span></div>
  <div class="cv-icons cv-big">${icon(m.icon, 150)}</div>
  <div class="cv-k">Printable Halloween Game</div>
  <div class="cv-t cv-t-s">${esc(m.name)}</div>
  <div class="cv-s">${esc(m.hook)}</div>
  <div class="cv-pills">${g.ages.split('').map((a) => `<span>${AGE[a]}</span>`).join('')}<span>${pageCount} pages</span></div>
  <div class="cv-inc">${m.includes.map((t) => `<div>${esc(t)}</div>`).join('')}</div>
  <div class="cv-f">Hollow Lantern Studio</div>
</div>`;
}

function singleDoc(g) {
  const m = GAMES_META[g.n];
  const body = pages.filter((p) => p.game === g.n).map((p) => ({
    ...p, body: p.body.replace(/<div class="gnum">Game \d+<\/div>/, '<div class="gnum">Printable Halloween Game</div>'),
  }));
  const extra = [...(SINGLE_KEYS[g.n] || []), ...(SINGLE_SCORE.has(g.n) ? [teamScore] : [])].map((b) => ({ body: b }));
  const count = 1 + body.length + extra.length + 1;
  return { m, pages: [{ body: gameCover(g, m, count), cls: 'p-cover' }, ...body, ...extra, { body: thanksPage(g.n) }] };
}

function listingMd(g, m, count) {
  return `# ${m.name}: Etsy listing

**Price:** $${m.price} · **Pages:** ${count} · **Files to upload:** \`${m.slug}-US-Letter.pdf\` + \`${m.slug}-A4.pdf\`
**Photos (in this order):** \`etsy-images/01-hero.jpg\`, \`02-inside.jpg\`, \`03-size.jpg\`, \`04-how.jpg\`

## Title
\`\`\`
${m.title}
\`\`\`

## Tags
\`\`\`
${m.tags.join(', ')}
\`\`\`

## Description
\`\`\`
${m.hook}

━━━━━━━━━━━━━━━━━━
WHAT'S INCLUDED (${count} pages)
━━━━━━━━━━━━━━━━━━
${m.includes.map((t) => `✔ ${t}`).join('\n')}
✔ Easy "How to play" rules on the page
✔ US Letter AND A4 files

Ages: ${g.ages.split('').map((a) => AGE[a]).join(', ')}

━━━━━━━━━━━━━━━━━━
HOW IT WORKS
━━━━━━━━━━━━━━━━━━
1. Purchase
2. Download the PDF instantly (Etsy > Purchases and reviews)
3. Print at home or at a print shop. Every page prints full size on US Letter or A4 paper.
4. Cut out the cards (if any) and play!

⚠ This is a DIGITAL product. Nothing will be shipped.

━━━━━━━━━━━━━━━━━━
WANT MORE GAMES?
━━━━━━━━━━━━━━━━━━
This game is part of our 15 Halloween Party Games Bundle. Get all 15 games for one low price in our shop!

━━━━━━━━━━━━━━━━━━
TERMS OF USE
━━━━━━━━━━━━━━━━━━
For personal, classroom and private party use. Print as many copies as you need for your own event.
Please do not share, resell or redistribute the files.
Because this is a digital download, refunds are not available, but if anything goes wrong, message us and we'll fix it fast!

© Hollow Lantern Studio
\`\`\`
`;
}

async function render(browser, docPages, product, outBase) {
  for (const size of ['letter', 'a4']) {
    const file = join(ROOT, 'src', `_render-${size}.html`);
    writeFileSync(file, html(docPages, size, product));
    const pg = await browser.newPage();
    await pg.goto('file://' + file);
    await pg.evaluate(() => document.fonts.ready);
    const out = `${outBase}-${size === 'letter' ? 'US-Letter' : 'A4'}.pdf`;
    await pg.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
    await pg.close();
  }
  console.log('wrote', outBase, docPages.length, 'pages');
}

const browser = await chromium.launch();
await render(browser, all, '15 Halloween Party Games', join(OUT, '15-Halloween-Party-Games'));
for (const g of games) {
  const { m, pages: doc } = singleDoc(g);
  const dir = join(OUT, 'games', `${String(g.n).padStart(2, '0')}-${m.slug}`);
  mkdirSync(dir, { recursive: true });
  await render(browser, doc, m.name, join(dir, m.slug));
  writeFileSync(join(dir, 'listing.md'), listingMd(g, m, doc.length));
  writeFileSync(join(dir, 'info.json'), JSON.stringify({ n: g.n, ages: g.ages, pages: doc.length, ...m }, null, 2));
}
await browser.close();
