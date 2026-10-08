// Renders Etsy listing photos (2000x1600) and ad creatives from the real PDF pages.
// Run after build.mjs and after rendering src/_pages/pNN.png.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'output', 'etsy-images');
mkdirSync(OUT, { recursive: true });

const pg = (n, rot = 0, w = 300, extra = '') =>
  `<img class="pg" src="_pages/p${String(n).padStart(2, '0')}.png" style="width:${w}px;transform:rotate(${rot}deg);${extra}">`;
const check = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#F07F2E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>`;
const cross = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C7E99" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const badge = (t) => `<span class="badge">${t}</span>`;

const CSS = `
@font-face{font-family:Fredoka;src:url(../fonts/Fredoka.woff2);font-weight:300 700}
@font-face{font-family:'DM Sans';src:url(../fonts/DMSans.woff2);font-weight:100 1000}
@font-face{font-family:Creepster;src:url(../fonts/Creepster.woff2)}
*{box-sizing:border-box}html,body{margin:0}
.c{position:relative;overflow:hidden;background:#24172F;color:#F6EFE2;font-family:'DM Sans',sans-serif}
.pg{display:block;box-shadow:0 18px 40px rgba(0,0,0,.45);border-radius:4px;background:#fff}
.badge{display:inline-block;white-space:nowrap;background:#F07F2E;color:#1E1824;font-weight:800;letter-spacing:.08em;font-size:20px;padding:9px 16px;border-radius:9px}
.ob{display:inline-block;white-space:nowrap;border:3px solid #F6EFE2;font-weight:800;letter-spacing:.08em;font-size:18px;padding:6px 13px;border-radius:9px}
h1,h2{font-family:Fredoka;font-weight:700;margin:0;line-height:1}
.k{font-weight:800;letter-spacing:.2em;color:#F07F2E;font-size:20px;text-transform:uppercase}
.abs{position:absolute}
.row{display:flex;gap:16px;align-items:center}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(240,127,46,.35),rgba(240,127,46,0) 70%)}
`;

const W = 1000, H = 800;
const shots = {
  // 1 — hero / thumbnail: must read at tiny search-result size
  '01-hero': `<div class="c" style="width:${W}px;height:${H}px">
    <div class="glow" style="width:900px;height:900px;right:-300px;top:-200px"></div>
    <div class="abs" style="left:56px;top:56px;width:470px;display:flex;flex-direction:column;gap:18px">
      <div class="row">${badge('INSTANT DOWNLOAD')}</div>
      <div style="font-family:Creepster;font-size:230px;line-height:.8;color:#F07F2E">15</div>
      <h1 style="font-size:72px">Halloween<br>Party Games</h1>
      <div style="font-size:24px;color:#DCCFE6;line-height:1.35">Print in 5 minutes. Play all night.<br>Bingo · Trivia · Charades · Awards</div>
    </div>
    <div class="abs" style="left:705px;top:40px">${pg(6, 8, 270)}</div>
    <div class="abs" style="left:715px;top:400px">${pg(37, 5, 260)}</div>
    <div class="abs" style="left:575px;top:180px">${pg(1, -6, 300)}</div>
    <div class="abs" style="left:56px;bottom:46px;font-family:Fredoka;font-weight:600;font-size:22px;color:#F6EFE2">50 pages · US Letter + A4</div>
  </div>`,
  // 2 — what's inside
  '02-inside': `<div class="c" style="width:${W}px;height:${H}px;padding:48px 56px;display:flex;flex-direction:column;gap:22px">
    <div class="row" style="justify-content:space-between"><h2 style="font-size:54px">What's inside</h2>${badge('50 PAGES')}</div>
    <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px 16px">
      ${[[5, 'Picture Bingo'], [21, 'Trivia'], [24, 'Would You Rather'], [27, 'Charades'], [29, 'Categories'], [30, 'Word Scramble'], [32, 'Word Search'], [33, 'Draw & Guess'], [35, 'Story Fill-ins'], [37, 'Who Am I?'], [39, 'This or That'], [40, 'Two Truths'], [41, 'Roll a Monster'], [42, 'Candy Jar'], [44, 'Costume Awards']]
        .map(([p, t], i) => `<div style="display:flex;flex-direction:column;gap:6px;align-items:center">${pg(p, 0, 150, 'box-shadow:0 8px 18px rgba(0,0,0,.4)')}<div style="font-family:Fredoka;font-weight:600;font-size:17px;text-align:center"><span style="color:#F07F2E">${i + 1}.</span> ${t}</div></div>`).join('')}
    </div>
    <div style="margin-top:auto;font-size:20px;color:#DCCFE6;text-align:center">+ Party Plans · Checklist · Answer Keys · Scoreboard · Certificates</div>
  </div>`,
  // 3 — why ours (fills competitor gaps)
  '03-why': `<div class="c" style="width:${W}px;height:${H}px;padding:52px 64px;display:flex;flex-direction:column;gap:26px">
    <h2 style="font-size:52px">Why hosts choose this bundle</h2>
    <div style="display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr);border-radius:18px;overflow:hidden;font-size:21px">
      <div style="padding:16px 22px;background:#33243F;font-weight:700"></div>
      <div style="padding:16px 22px;background:#F07F2E;color:#1E1824;font-weight:800;text-align:center">This bundle</div>
      <div style="padding:16px 22px;background:#33243F;color:#B9AEC2;font-weight:700;text-align:center">Typical listing</div>
      ${[['15 games in one download', 1], ['Picture bingo for kids who can\'t read yet', 1], ['30 unique bingo cards', 1], ['Kids AND grown-up versions', 1], ['Ready-made party plans with timings', 1], ['Answer keys included', 1], ['US Letter + A4, ink-saving pages', 1], ['Costume contest certificates', 1]]
        .map(([t], i) => `<div style="padding:13px 22px;background:${i % 2 ? '#2B1E36' : '#24172F'}">${t}</div><div style="padding:13px 22px;background:${i % 2 ? '#2B1E36' : '#24172F'};display:flex;justify-content:center">${check}</div><div style="padding:13px 22px;background:${i % 2 ? '#2B1E36' : '#24172F'};display:flex;justify-content:center">${i < 1 ? '<span style="color:#B9AEC2">1 game</span>' : cross}</div>`).join('')}
    </div>
  </div>`,
  // 4 — bingo
  '04-bingo': `<div class="c" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:56px;top:64px;width:400px;display:flex;flex-direction:column;gap:20px">
      <div class="k">Game 01</div><h2 style="font-size:64px">Spooky Picture Bingo</h2>
      <div style="font-size:24px;line-height:1.45;color:#DCCFE6">30 unique cards with pictures AND words, so 3-year-olds can play with grandparents.</div>
      <div style="font-family:Fredoka;font-weight:600;font-size:24px">Caller tiles included<br>Play 5 ways: line, corners, X, blackout</div>
    </div>
    <div class="abs" style="left:470px;top:60px">${pg(8, 4, 430)}</div>
    <div class="abs" style="left:430px;top:420px">${pg(5, -5, 260)}</div>
  </div>`,
  // 5 — party plans
  '05-plans': `<div class="c" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:540px;top:64px;width:400px;display:flex;flex-direction:column;gap:20px">
      <div class="k">No planning needed</div><h2 style="font-size:60px">4 ready-made party plans</h2>
      <div style="font-size:24px;line-height:1.5;color:#DCCFE6">Kids party · Office party · Classroom · Family game night. Exactly which games, in what order, minute by minute.</div>
    </div>
    <div class="abs" style="left:70px;top:50px">${pg(3, -3, 430)}</div>
  </div>`,
  // 6 — trivia
  '06-trivia': `<div class="c" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:56px;top:64px;width:380px;display:flex;flex-direction:column;gap:20px">
      <div class="k">Game 02</div><h2 style="font-size:62px">Halloween Trivia</h2>
      <div style="font-size:24px;line-height:1.5;color:#DCCFE6">A Kids Round and a Grown-Ups Round. Team answer sheets and answer keys included.</div>
    </div>
    <div class="abs" style="left:440px;top:80px">${pg(21, -5, 300)}</div>
    <div class="abs" style="left:640px;top:140px">${pg(22, 4, 300)}</div>
    <div class="abs" style="left:110px;top:430px">${pg(47, -2, 260)}</div>
  </div>`,
  // 7 — cards
  '07-cards': `<div class="c" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:56px;top:56px;right:56px;display:flex;justify-content:space-between;align-items:flex-end">
      <h2 style="font-size:56px">108 cut-out game cards</h2><div style="font-size:22px;color:#DCCFE6">Charades · Would You Rather · Who Am I · Draw &amp; Guess</div>
    </div>
    <div class="abs" style="left:60px;top:190px">${pg(27, -4, 260)}</div>
    <div class="abs" style="left:280px;top:170px">${pg(24, 3, 260)}</div>
    <div class="abs" style="left:500px;top:190px">${pg(37, -2, 260)}</div>
    <div class="abs" style="left:720px;top:170px">${pg(33, 4, 240)}</div>
  </div>`,
  // 8 — kids activities
  '08-kids': `<div class="c" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:540px;top:64px;width:400px;display:flex;flex-direction:column;gap:20px">
      <div class="k">Quiet-time favorites</div><h2 style="font-size:58px">Roll a Monster, Word Search &amp; Silly Stories</h2>
      <div style="font-size:24px;line-height:1.5;color:#DCCFE6">Perfect for classrooms and the "I'm bored" moment between games.</div>
    </div>
    <div class="abs" style="left:50px;top:70px">${pg(41, -4, 280)}</div>
    <div class="abs" style="left:250px;top:330px">${pg(31, 5, 270)}</div>
  </div>`,
  // 9 — awards
  '09-awards': `<div class="c" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:56px;top:64px;width:400px;display:flex;flex-direction:column;gap:20px">
      <div class="k">Game 15</div><h2 style="font-size:60px">Costume Contest Ballots &amp; Awards</h2>
      <div style="font-size:24px;line-height:1.5;color:#DCCFE6">6 award certificates: Scariest, Funniest, Most Creative, Best Group, Best DIY, Best Pumpkin.</div>
    </div>
    <div class="abs" style="left:480px;top:70px">${pg(44, 3, 420)}</div>
    <div class="abs" style="left:440px;top:440px">${pg(43, -6, 230)}</div>
  </div>`,
  // 10 — how it works
  '10-how': `<div class="c" style="width:${W}px;height:${H}px;padding:64px;display:flex;flex-direction:column;gap:40px;align-items:center;justify-content:center;text-align:center">
    <h2 style="font-size:58px">Party-ready in 5 minutes</h2>
    <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px;width:100%">
      ${[['1', 'Buy', 'Checkout on Etsy'], ['2', 'Download', 'Instant PDF, Letter + A4'], ['3', 'Print', 'Home printer is fine'], ['4', 'Play', 'Follow a party plan']]
        .map(([n, t, s]) => `<div style="background:#33243F;border-radius:18px;padding:28px 18px;display:flex;flex-direction:column;gap:10px;align-items:center"><div style="font-family:Creepster;font-size:72px;color:#F07F2E;line-height:1">${n}</div><div style="font-family:Fredoka;font-weight:700;font-size:32px">${t}</div><div style="font-size:19px;color:#DCCFE6">${s}</div></div>`).join('')}
    </div>
    <div style="font-size:20px;color:#B9AEC2">Digital file only. Nothing will be shipped. For personal, classroom and private party use.</div>
  </div>`,
};

const ads = {
  // Pinterest pin 1000x1500
  'ad-pinterest-pin': [1000, 1500, `<div class="c" style="width:1000px;height:1500px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:70px 60px;gap:26px">
    <div class="glow" style="width:1200px;height:1200px;left:-100px;top:500px"></div>
    ${badge('PRINTABLE · INSTANT DOWNLOAD')}
    <div style="font-family:Creepster;font-size:240px;line-height:.8;color:#F07F2E">15</div>
    <h1 style="font-size:96px">Halloween Party Games</h1>
    <div style="font-size:32px;color:#DCCFE6">for kids, teens &amp; adults</div>
    <div style="position:relative;width:880px;height:640px;margin-top:20px">
      <div class="abs" style="left:40px;top:40px">${pg(6, -8, 380)}</div>
      <div class="abs" style="left:460px;top:20px">${pg(37, 7, 380)}</div>
      <div class="abs" style="left:250px;top:120px">${pg(1, 0, 380)}</div>
    </div>
    <div style="font-family:Fredoka;font-weight:600;font-size:34px;margin-top:auto">Bingo · Trivia · Charades · Awards</div>
  </div>`],
  // Instagram / TikTok story 1080x1920
  'ad-story-1080x1920': [1080, 1920, `<div class="c" style="width:1080px;height:1920px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:180px 70px 220px;gap:34px">
    <div style="font-family:Fredoka;font-weight:700;font-size:64px;line-height:1.1">Halloween party<br>in 3 days?</div>
    <div style="font-size:38px;color:#DCCFE6">Don't panic. Print this.</div>
    <div style="position:relative;width:940px;height:860px;margin-top:20px">
      <div class="abs" style="left:20px;top:60px">${pg(8, -8, 440)}</div>
      <div class="abs" style="left:480px;top:40px">${pg(3, 7, 440)}</div>
      <div class="abs" style="left:250px;top:200px">${pg(1, 0, 440)}</div>
    </div>
    <div style="font-family:Creepster;font-size:110px;color:#F07F2E;line-height:1">15 games</div>
    <div style="font-size:36px">Kids · Office · Classroom · Family</div>
    ${badge('LINK IN BIO · INSTANT DOWNLOAD')}
  </div>`],
};

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
async function shoot(name, w, h, body) {
  const file = join(ROOT, 'src', `_shot.html`);
  writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`);
  await page.setViewportSize({ width: w, height: h });
  await page.goto('file://' + file);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(OUT, `${name}.png`), clip: { x: 0, y: 0, width: w, height: h } });
  console.log('wrote', name);
}
for (const [name, body] of Object.entries(shots)) await shoot(name, W, H, body);
for (const [name, [w, h, body]] of Object.entries(ads)) await shoot(name, w, h, body);
await browser.close();
