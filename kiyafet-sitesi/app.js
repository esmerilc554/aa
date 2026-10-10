const ICONS = {
  elbise: 'M9 2h6l1 5-2 3 3 12H7l3-12-2-3z',
  gomlek: 'M8 3l4 2 4-2 5 4-3 4-2-1v11H8V10l-2 1-3-4z',
  pantolon: 'M7 2h10l1 20h-5l-1-10-1 10H6z',
  ceket: 'M8 2l4 3 4-3 5 5-3 4-2-1v12H8V10l-2 1-3-4z',
  triko: 'M8 3h8l5 5-3 4-2-1v10H8V11l-2 1-3-4z',
  canta: 'M6 8h12l2 13H4zM9 8a3 3 0 016 0',
  atki: 'M4 5h16v5H4zM7 10v11h4V10zM13 10v9h4v-9z',
};
const PRODUCTS = [
  { id: 1, name: 'Keten Elbise', cat: 'kadin', price: 1290, icon: 'elbise', a: '#e9c9c0', b: '#b5543a', tag: 'Yeni' },
  { id: 2, name: 'Oversize Gömlek', cat: 'kadin', price: 890, icon: 'gomlek', a: '#cfd6e4', b: '#6a7ca3' },
  { id: 3, name: 'Yün Triko', cat: 'kadin', price: 1090, icon: 'triko', a: '#d9cfb8', b: '#9b8660', tag: 'Çok satan' },
  { id: 4, name: 'Slim Pantolon', cat: 'erkek', price: 990, icon: 'pantolon', a: '#c5d1c4', b: '#4f6b55' },
  { id: 5, name: 'Pamuklu Gömlek', cat: 'erkek', price: 790, icon: 'gomlek', a: '#e6d3c0', b: '#a8744b' },
  { id: 6, name: 'Blazer Ceket', cat: 'erkek', price: 2190, icon: 'ceket', a: '#b9c0cc', b: '#3c4658', tag: 'Yeni' },
  { id: 7, name: 'Deri Çanta', cat: 'aksesuar', price: 1590, icon: 'canta', a: '#e3c4a8', b: '#7a4a2b' },
  { id: 8, name: 'İpek Atkı', cat: 'aksesuar', price: 450, icon: 'atki', a: '#ecc7cf', b: '#b4546a' },
];
const fmt = n => '₺' + n.toLocaleString('tr-TR');
const $ = s => document.querySelector(s);
let cart = [];
try { cart = JSON.parse(localStorage.getItem('luna-cart')) || []; } catch (e) {}

const save = () => { try { localStorage.setItem('luna-cart', JSON.stringify(cart)); } catch (e) {} };

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 1800);
}

function renderGrid(filter = 'hepsi') {
  $('#grid').innerHTML = PRODUCTS.filter(p => filter === 'hepsi' || p.cat === filter).map((p, i) => `
    <article class="product" style="animation-delay:${i * 70}ms">
      <div class="thumb" style="--a:${p.a};--b:${p.b}">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[p.icon]}"/></svg>
      </div>
      <div class="info">
        <div><h3>${p.name}</h3><p>${fmt(p.price)}</p></div>
        <button class="add" data-id="${p.id}" aria-label="${p.name} sepete ekle">+</button>
      </div>
    </article>`).join('');
}

function setFilter(f) {
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.filter === f));
  renderGrid(f);
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * PRODUCTS.find(p => p.id === i.id).price, 0);
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = fmt(total);
  $('#cartList').innerHTML = cart.length ? cart.map(i => {
    const p = PRODUCTS.find(p => p.id === i.id);
    return `<li><div>${p.name}<small>${fmt(p.price)}</small></div>
      <div class="qty"><button data-dec="${p.id}" aria-label="Azalt">−</button><span>${i.qty}</span><button data-inc="${p.id}" aria-label="Artır">+</button></div></li>`;
  }).join('') : '<p class="empty">Sepetin şu an boş.</p>';
  save();
}

function change(id, d) {
  const it = cart.find(i => i.id === id);
  if (!it) cart.push({ id, qty: 1 });
  else { it.qty += d; if (it.qty <= 0) cart = cart.filter(i => i.id !== id); }
  renderCart();
}

function drawer(open) {
  $('#drawer').classList.toggle('on', open);
  $('#overlay').classList.toggle('on', open);
  $('#drawer').setAttribute('aria-hidden', String(!open));
}

$('#grid').addEventListener('click', e => {
  const b = e.target.closest('.add'); if (!b) return;
  change(+b.dataset.id, 1);
  const btn = $('#cartBtn'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
  toast('Sepete eklendi ✓');
});
$('#cartList').addEventListener('click', e => {
  const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
  if (inc) change(+inc.dataset.inc, 1); if (dec) change(+dec.dataset.dec, -1);
});
$('#filters').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) setFilter(c.dataset.filter); });
document.querySelectorAll('.cat').forEach(c => c.addEventListener('click', () => setFilter(c.dataset.filter)));
$('#cartBtn').onclick = () => drawer(true);
$('#closeCart').onclick = $('#overlay').onclick = () => drawer(false);
document.addEventListener('keydown', e => e.key === 'Escape' && drawer(false));
$('#checkout').onclick = () => {
  if (!cart.length) return toast('Sepet boş');
  cart = []; renderCart(); drawer(false); toast('Siparişin alındı (demo) 🎉');
};
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault(); $('#newsNote').textContent = 'Teşekkürler! Yeni koleksiyonlardan ilk sen haberdar olacaksın.'; e.target.reset();
});
$('#burger').onclick = e => {
  const o = $('#menu').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o);
};
$('#menu').addEventListener('click', () => { $('#menu').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); });
addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 10), { passive: true });

const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

renderGrid(); renderCart();
