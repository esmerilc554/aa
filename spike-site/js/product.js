import { products } from './products.js';

const slug = new URLSearchParams(location.search).get('p');
const p = products.find(x => x.slug === slug) || products[0];

document.title = `${p.name} | ${p.brand} | SPIKE Lefkoşa`;
document.getElementById('brand').textContent = p.brand;
document.getElementById('name').textContent = p.name;
document.getElementById('price').textContent = `€${p.price.toFixed(2)}`;
const photo = document.getElementById('photo');
photo.src = p.img; photo.alt = `${p.name} – ${p.brand}, SPIKE Lefkoşa`;

const ld = document.createElement('script'); ld.type = 'application/ld+json';
ld.textContent = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Product', name: p.name, image: p.img,
  brand: { '@type': 'Brand', name: p.brand }, category: p.cat,
  url: `https://spike.com.cy/product/${p.slug}/`,
  offers: { '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock',
    seller: { '@id': 'https://spike.com.cy/#store' } },
});
document.head.appendChild(ld);

let size = null;
const sizes = document.getElementById('sizes');
for (const s of [38, 39, 40, 41, 42, 43, 44, 45]) {
  const b = document.createElement('button'); b.textContent = s;
  b.onclick = () => { size = s; sizes.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); };
  sizes.appendChild(b);
}
document.getElementById('order').onclick = () => {
  if (!size) { alert('Lütfen numara seçin.'); return; }
  location.href = `mailto:info@spike.com.cy?subject=${encodeURIComponent(`Sipariş: ${p.name} – ${size}`)}`;
};

// Scroll: photo slowly zooms in as you scroll through the section
const stage = document.getElementById('stage');
function update() {
  const r = stage.getBoundingClientRect();
  const f = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  photo.style.transform = `scale(${1 + f * 0.35})`;
}
addEventListener('scroll', update, { passive: true }); update();
