// Writes the complete Etsy listing sheet for all 16 listings (bundle + 15 singles):
//   output/ETSY-LISTINGS.html  (copy buttons, open in any browser)
//   output/ETSY-LISTINGS.md
//   output/games/<nn-slug>/listing.md  (one per single game)
// Run after build.mjs. Buyer-facing copy is English; field labels/notes are Turkish for the shop owner.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GAMES_META } from './games-meta.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'output');
const SHOP = 'CemEsmeroglo';
const AGE = { K: 'Kids', T: 'Teens', A: 'Adults' };

// USD list price -> GBP list price (for a shop that lists in GBP).
const GBP = { '9.99': '7.99', '3.99': '2.99', '2.99': '2.49', '2.49': '1.99', '1.99': '1.49' };
const pct = (p, off) => (Math.round(Number(p) * (100 - off)) / 100).toFixed(2);

const COMMON = {
  type: 'Digital (Dijital dosyalar)',
  whoMade: 'I did',
  whatIsIt: 'A finished product',
  whenMade: 'En yeni aralık (2020–2026)',
  holiday: 'Halloween',
  quantity: '999',
  renewal: 'Automatic',
  section: 'Halloween Party Games',
  personalization: 'Kapalı',
  variations: 'Yok',
  shipping: 'Yok (dijital ürün)',
  materials: 'digital PDF, US Letter, A4, printable',
};

const FOOTER = `━━━━━━━━━━━━━━━━━━
HOW IT WORKS
━━━━━━━━━━━━━━━━━━
1. Purchase
2. Download the PDF instantly (Etsy > Purchases and reviews)
3. Print at home or at a print shop. Every page prints full size on US Letter or A4 paper.
4. Cut out the cards (if any) and play!

⚠ This is a DIGITAL product. Nothing will be shipped.

━━━━━━━━━━━━━━━━━━
TERMS OF USE
━━━━━━━━━━━━━━━━━━
For personal, classroom and private party use. Print as many copies as you need for your own event.
Please do not share, resell or redistribute the files.
Because this is a digital download, refunds are not available, but if anything goes wrong, message me and I'll fix it fast!

© ${SHOP}`;

function categoryHint(n) {
  if ([6, 7, 9, 13].includes(n)) return 'Kategori kutusuna "activity sheets" ya da "worksheets" yaz, çıkan öneriden Halloween/çocuk aktivitesine en yakını seç; yoksa "party games".';
  if (n === 14) return 'Kategori kutusuna "party games" yaz, ilk öneriyi seç.';
  if (n === 15) return 'Kategori kutusuna "party games" yaz; uygun değilse "certificates".';
  return 'Kategori kutusuna "party games" yaz, ilk öneriyi seç.';
}

// ---------- the 15 singles ----------
const listings = [];
for (const dir of readdirSync(join(OUT, 'games')).filter((d) => /^\d\d-/.test(d)).sort()) {
  const info = JSON.parse(readFileSync(join(OUT, 'games', dir, 'info.json'), 'utf8'));
  const m = GAMES_META[info.n];
  const ages = info.ages.split('').map((a) => AGE[a]).join(', ');
  const desc = `${m.hook}

━━━━━━━━━━━━━━━━━━
WHAT'S INCLUDED (${info.pages} pages)
━━━━━━━━━━━━━━━━━━
${m.includes.map((t) => `✔ ${t}`).join('\n')}
✔ Easy "How to play" rules on the page
✔ US Letter AND A4 files

Ages: ${ages}

${FOOTER.replace('© ', `━━━━━━━━━━━━━━━━━━
WANT MORE GAMES?
━━━━━━━━━━━━━━━━━━
This game is part of my 15 Halloween Party Games Bundle. Get all 15 games for one low price in my shop: ${SHOP}

© `)}`;
  const files = [`${m.slug}-US-Letter.pdf`, `${m.slug}-A4.pdf`];
  listings.push({
    no: String(info.n).padStart(2, '0'), dir, name: m.name, title: m.title, tags: m.tags, desc,
    usd: m.price, gbp: GBP[m.price], sku: `HW26-${String(info.n).padStart(2, '0')}`, pages: info.pages,
    files, fileSizes: files.map((f) => statSync(join(OUT, 'games', dir, f)).size),
    category: categoryHint(info.n),
    photos: [
      ['01-hero.jpg', `${m.name} printable Halloween game cover with sample pages`],
      ['02-inside.jpg', `What's included in ${m.name}: ${m.includes.join('; ')}`.slice(0, 250)],
      ['03-size.jpg', `${m.name} page printed full size on US Letter and A4 paper`],
      ['04-how.jpg', 'How the instant download works: buy, download, print and play'],
    ],
  });
}

// ---------- the bundle ----------
const bundleDesc = `🎃 HALLOWEEN PARTY IN A FEW DAYS? PRINT THIS TONIGHT.

15 printable Halloween party games in ONE instant download, for kids, teens, grown-ups, classrooms and office parties. No planning needed: just follow one of the 4 ready-made party plans.

━━━━━━━━━━━━━━━━━━
WHAT'S INSIDE (50 pages)
━━━━━━━━━━━━━━━━━━
1. Spooky Picture Bingo: 30 unique cards with PICTURES + words (little ones who can't read yet can play!) + caller tiles
2. Halloween Trivia: Kids Round + Grown-Ups Round, team answer sheets, answer key
3. Would You Rather? Halloween Edition: 36 cards
4. Monster Charades: 36 cards (easy kids deck + funny grown-up deck)
5. Spooky Categories: the quick "think of a word" game, 3 rounds
6. Monster Word Scramble: 20 words + answer key
7. Haunted Word Search: 2 levels (easy & hard) + answer keys
8. Pumpkin Draw & Guess: 40 cards (easy & hard)
9. Spooky Story Fill-ins: 2 silly fill-in-the-blank stories
10. Who Am I? Guessing Cards: 24 cards
11. This or That? Run-Around Game: 20 rounds, zero prep
12. Two Truths & a Spooky Lie: perfect office icebreaker
13. Roll a Monster: dice drawing game
14. Guess the Candy Jar: sign + guess slips
15. Costume Contest: ballots + 6 award certificates

BONUS: 4 Ready-Made Party Plans (Kids / Office / Classroom / Family) · Quick-Start Checklist · Monster Scoreboard

━━━━━━━━━━━━━━━━━━
WHY YOU'LL LOVE IT
━━━━━━━━━━━━━━━━━━
✔ 15 games for the price of 3 (bought separately they cost $36.85)
✔ Works for ages 3 to 99
✔ Ink-saving white pages: prints great on any home printer
✔ US Letter AND A4 files included
✔ Answer keys included, so the host never gets stuck

${FOOTER}`;
const bundleFiles = ['15-Halloween-Party-Games-US-Letter.pdf', '15-Halloween-Party-Games-A4.pdf'];
listings.unshift({
  no: '★', dir: '.', name: '15 Halloween Party Games Bundle',
  title: '15 Halloween Party Games Bundle, Printable Picture Bingo, Trivia, Charades for Kids & Adults, Office Classroom Family Game, Instant Download',
  tags: ['halloween games', 'halloween bingo', 'halloween trivia', 'party games bundle', 'office party games', 'kids party games', 'halloween charades', 'classroom party', 'family game night', 'printable games', 'picture bingo', 'would you rather', 'adult party games'],
  desc: bundleDesc, usd: '9.99', gbp: GBP['9.99'], sku: 'HW26-00', pages: 50,
  files: bundleFiles, fileSizes: bundleFiles.map((f) => statSync(join(OUT, f)).size),
  category: 'Kategori kutusuna "party games" yaz, ilk öneriyi seç.',
  photos: [
    ['etsy-images/01-hero.png', '15 Halloween Party Games printable bundle cover with bingo and guessing cards'],
    ['etsy-images/02-inside.png', 'All 15 Halloween party games included in the printable bundle'],
    ['etsy-images/03-why.png', 'Comparison: 15 games, picture bingo, kids and adult versions, party plans, answer keys'],
    ['etsy-images/04-bingo.png', 'Spooky Picture Bingo cards with pictures and words for kids'],
    ['etsy-images/05-plans.png', 'Ready-made Halloween party plans for kids, office, classroom and family'],
    ['etsy-images/06-trivia.png', 'Halloween trivia for kids and adults with answer key'],
    ['etsy-images/07-cards.png', 'Printable charades, would you rather, who am I and drawing game cards'],
    ['etsy-images/08-kids.png', 'Roll a Monster drawing game and Halloween word search for kids'],
    ['etsy-images/09-awards.png', 'Halloween costume contest ballots and award certificates'],
    ['etsy-images/10-how.png', 'How the instant download works: buy, download, print and play'],
  ],
});

for (const l of listings) {
  // Etsy limits: title 140, 13 tags of 20 chars, alt text 250, digital file 20 MB.
  if (l.title.length > 140 || l.tags.length !== 13 || l.tags.some((t) => t.length > 20)) throw new Error(`limits: ${l.name}`);
  if (l.photos.some(([, a]) => a.length > 250) || l.fileSizes.some((s) => s > 20e6)) throw new Error(`limits2: ${l.name}`);
}

// ---------- markdown ----------
const sale = (p) => `%30 lansman (9–28 Ekim): $${pct(p, 30)} · %40 son 3 gün (29–31 Ekim): $${pct(p, 40)}`;
function md(l) {
  return `## ${l.no} · ${l.name}

| Alan | Değer |
|---|---|
| Fiyat | **$${l.usd}** (mağaza GBP ise **£${l.gbp}**) |
| İndirim | ${sale(l.usd)} |
| SKU | ${l.sku} |
| Kategori | ${l.category} |
| Holiday | ${COMMON.holiday} |
| Type | ${COMMON.type} |
| Who made / What / When | ${COMMON.whoMade} / ${COMMON.whatIsIt} / ${COMMON.whenMade} |
| Digital files | ${l.files.map((f) => `\`${f}\``).join(' + ')} |
| Quantity | ${COMMON.quantity} |
| Shop section | ${COMMON.section} |
| Materials | ${COMMON.materials} |
| Renewal | ${COMMON.renewal} |
| Personalization / Variations / Shipping | ${COMMON.personalization} / ${COMMON.variations} / ${COMMON.shipping} |

**Title**
\`\`\`
${l.title}
\`\`\`
**Tags**
\`\`\`
${l.tags.join(', ')}
\`\`\`
**Description**
\`\`\`
${l.desc}
\`\`\`
**Photos (bu sırayla) + alt text**
${l.photos.map(([f, a], i) => `${i + 1}. \`${f}\`: ${a}`).join('\n')}
`;
}
const intro = `# Etsy listing sheet: 16 Halloween listings (${SHOP})

Etsy'deki her alan için değerler. Müşterinin gördüğü her şey İngilizce; tablo başlıkları ve notlar senin için Türkçe.

## Listelemeden önce (bir kez)
1. **Shop Manager › Listings › Sections:** yeni bölüm aç: \`${COMMON.section}\`
2. **Marketing › Sales and discounts › Create coupon:** kod \`THANKYOU20\`, %20, süresiz. Her PDF'in son sayfasında bu kod yazıyor.
3. **Marketing › Sales and discounts › Run a sale:** 9–28 Ekim %30 (tüm Halloween bölümü), 29–31 Ekim %40.
4. **Featured listings (öne çıkan 4 ürün):** Bundle, Picture Bingo, Trivia, Charades.
5. **Etsy Ads:** günlük $3 ile başla. Bundle + Bingo + Trivia + Charades.

Not: Her listing için Etsy $0.20 listeleme ücreti alır (16 listing = $3.20).
`;
writeFileSync(join(OUT, 'ETSY-LISTINGS.md'), intro + '\n' + listings.map(md).join('\n---\n\n'));
for (const l of listings.slice(1)) writeFileSync(join(OUT, 'games', l.dir, 'listing.md'), `# Etsy listing (${SHOP})\n\n` + md(l));

// ---------- html with copy buttons ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let id = 0;
const copyBox = (label, text, rows = 2) => {
  id++;
  return `<div class="f"><div class="fl"><span>${label}</span><button type="button" data-t="t${id}">Copy</button></div><textarea id="t${id}" rows="${rows}" readonly>${esc(text)}</textarea></div>`;
};
const card = (l) => `<section class="card" id="l${l.sku}">
  <header><span class="no">${l.no}</span><h2>${esc(l.name)}</h2><span class="price">$${l.usd} · £${l.gbp}</span></header>
  <dl>
    <dt>İndirim</dt><dd>${sale(l.usd)}</dd>
    <dt>SKU</dt><dd>${l.sku}</dd>
    <dt>Kategori</dt><dd>${esc(l.category)}</dd>
    <dt>Holiday</dt><dd>${COMMON.holiday}</dd>
    <dt>Type</dt><dd>${COMMON.type}</dd>
    <dt>About</dt><dd>${COMMON.whoMade} · ${COMMON.whatIsIt} · ${COMMON.whenMade}</dd>
    <dt>Dosyalar</dt><dd>${l.files.map((f, i) => `<code>${f}</code> (${(l.fileSizes[i] / 1e6).toFixed(1)} MB)`).join('<br>')}</dd>
    <dt>Quantity</dt><dd>${COMMON.quantity}</dd>
    <dt>Section</dt><dd>${COMMON.section}</dd>
    <dt>Renewal</dt><dd>${COMMON.renewal}</dd>
    <dt>Diğer</dt><dd>Personalization ${COMMON.personalization} · Variations ${COMMON.variations} · Shipping ${COMMON.shipping}</dd>
  </dl>
  ${copyBox(`Title (${l.title.length}/140)`, l.title, 3)}
  ${copyBox('Tags (13)', l.tags.join(', '), 3)}
  ${copyBox('Materials', COMMON.materials, 1)}
  ${copyBox('Description', l.desc, 14)}
  <div class="f"><div class="fl"><span>Fotoğraflar (sırayla) + alt text</span></div><ol class="ph">${l.photos.map(([f, a]) => { id++; return `<li><code>${f}</code><div class="alt"><span id="t${id}">${esc(a)}</span><button type="button" data-t="t${id}">Copy</button></div></li>`; }).join('')}</ol></div>
</section>`;
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Etsy Listing Sheet</title>
<style>
:root{--bg:#F5EFE4;--card:#FFFDF8;--ink:#3A3A3A;--muted:#6B6B6B;--accent:#2F4A3A;--line:#E2D9C8;--btn:#2F4A3A;--btnt:#fff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1C211E;--card:#252B27;--ink:#ECE7DD;--muted:#A8A9A2;--accent:#8FA68E;--line:#39413B;--btn:#8FA68E;--btnt:#1C211E}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:980px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:26px;margin:0 0 4px}.sub{color:var(--muted);margin:0 0 20px}
.setup,.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px;margin:0 0 18px}
.setup ol{margin:6px 0 0;padding-left:20px}
nav{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 18px}nav a{color:var(--accent);border:1px solid var(--line);border-radius:99px;padding:4px 10px;text-decoration:none;font-size:13px}
header{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:10px}header h2{margin:0;font-size:20px;flex:1}
.no{font-weight:700;color:var(--accent)}.price{font-weight:700}
dl{display:grid;grid-template-columns:110px minmax(0,1fr);gap:4px 12px;margin:0 0 12px;font-size:14px}dt{color:var(--muted)}dd{margin:0}
.f{margin:10px 0}.fl{display:flex;justify-content:space-between;align-items:center;font-weight:600;margin-bottom:4px}
textarea{width:100%;font:13px/1.45 ui-monospace,Menlo,Consolas,monospace;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px;resize:vertical}
button{background:var(--btn);color:var(--btnt);border:0;border-radius:8px;padding:6px 14px;min-height:36px;font-weight:600;cursor:pointer}
.ph{margin:0;padding-left:20px}.ph li{margin:6px 0}.alt{display:flex;gap:8px;align-items:center;justify-content:space-between;font-size:14px}
code{font-size:13px}
</style></head><body><main>
<h1>Etsy listing sheet: 16 Halloween listings</h1>
<p class="sub">${SHOP} · Müşterinin gördüğü her şey İngilizce. Her kutunun yanındaki Copy düğmesiyle kopyala, Etsy'deki alana yapıştır.</p>
<div class="setup"><b>Listelemeden önce (bir kez)</b><ol>
<li>Shop Manager › Listings › Sections: yeni bölüm <code>${COMMON.section}</code></li>
<li>Marketing › Sales and discounts › Create coupon: <code>THANKYOU20</code>, %20, süresiz (PDF'lerin son sayfasında yazıyor)</li>
<li>Run a sale: 9–28 Ekim %30, 29–31 Ekim %40 (Halloween bölümü)</li>
<li>Öne çıkan 4 ürün: Bundle, Picture Bingo, Trivia, Charades</li>
<li>Etsy Ads: günlük $3 ile başla (Bundle, Bingo, Trivia, Charades)</li>
<li>Her listing için Etsy $0.20 listeleme ücreti alır (16 listing = $3.20)</li>
</ol></div>
<nav>${listings.map((l) => `<a href="#l${l.sku}">${l.no} ${esc(l.name)}</a>`).join('')}</nav>
${listings.map(card).join('\n')}
</main>
<script>
document.addEventListener('click', function (e) {
  var b = e.target.closest('button[data-t]'); if (!b) return;
  var el = document.getElementById(b.dataset.t); var txt = el.value !== undefined ? el.value : el.textContent;
  function done() { var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1200); }
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { if (el.select) { el.select(); document.execCommand('copy'); done(); } });
  else if (el.select) { el.select(); document.execCommand('copy'); done(); }
});
</script></body></html>`;
writeFileSync(join(OUT, 'ETSY-LISTINGS.html'), html);
console.log('wrote sheet for', listings.length, 'listings');
