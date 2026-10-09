import { THREE, createSneaker, makeRenderer, addLights, fit } from './models.js';
import { products } from './products.js';

const slug = new URLSearchParams(location.search).get('p');
const p = products.find(x => x.slug === slug) || products[0];

document.title = `${p.name} | ${p.brand} | SPIKE Lefkoşa`;
document.getElementById('brand').textContent = p.brand;
document.getElementById('name').textContent = p.name;
document.getElementById('price').textContent = `€${p.price.toFixed(2)}`;

// Product structured data
const ld = document.createElement('script'); ld.type = 'application/ld+json';
ld.textContent = JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Product', name: p.name,
  brand: { '@type': 'Brand', name: p.brand }, category: p.cat,
  url: `https://spike.com.cy/product/${p.slug}/`,
  offers: { '@type': 'Offer', price: p.price.toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock',
    seller: { '@id': 'https://spike.com.cy/#store' } },
});
document.head.appendChild(ld);

// Sizes
let size = null;
const sizes = document.getElementById('sizes');
for (const s of [38, 39, 40, 41, 42, 43, 44, 45]) {
  const b = document.createElement('button'); b.textContent = s;
  b.onclick = () => { size = s; sizes.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); };
  sizes.appendChild(b);
}
document.getElementById('order').onclick = () => {
  if (!size) { alert('Lütfen numara seçin.'); return; }
  // TODO: replace with WooCommerce add-to-cart or WhatsApp link once the number is known
  location.href = `mailto:info@spike.com.cy?subject=${encodeURIComponent(`Sipariş: ${p.name} – ${size}`)}`;
};

// 3D stage, scroll-driven rotation
const canvas = document.getElementById('product3d');
const renderer = makeRenderer(canvas);
const scene = new THREE.Scene(); addLights(scene);
const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50); cam.position.set(0, 0.6, 7.5); cam.lookAt(0, 0, 0);
const shoe = createSneaker(p.colors); scene.add(shoe);
const floor = new THREE.Mesh(new THREE.CircleGeometry(3, 48), new THREE.ShadowMaterial({ opacity: 0.35 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -0.85; floor.receiveShadow = true; scene.add(floor);

const stage = document.getElementById('stage');
const view = document.getElementById('view');
const bar = document.getElementById('bar');
const labels = [[0.12, 'Yan görünüm'], [0.3, 'Ön görünüm'], [0.5, 'Arka görünüm'], [0.72, 'Diğer yan'], [1.01, 'Taban']];
let target = 0, cur = 0, drag = 0;

function progress() {
  const r = stage.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
}
addEventListener('scroll', () => { target = progress(); }, { passive: true });

// Also allow drag-to-rotate
let down = null;
canvas.addEventListener('pointerdown', e => { down = e.clientX; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => { if (down !== null) { drag += (e.clientX - down) * 0.01; down = e.clientX; } });
canvas.addEventListener('pointerup', () => { down = null; });

(function loop() {
  fit(renderer, cam, canvas);
  cur += (target - cur) * 0.08;
  const turn = Math.min(cur / 0.8, 1);          // 0–80%: full 360° turn
  const tilt = Math.max(0, (cur - 0.8) / 0.2);  // 80–100%: tilt to show sole
  shoe.rotation.y = turn * Math.PI * 2 + drag;
  shoe.rotation.x = -tilt * (Math.PI / 2.1);
  shoe.position.y = tilt * 0.6;
  view.textContent = labels.find(([v]) => cur < v)[1];
  bar.style.width = `${cur * 100}%`;
  renderer.render(scene, cam);
  requestAnimationFrame(loop);
})();
