import { THREE, createSneaker, createGarment, makeRenderer, addLights, fit } from './models.js';
import { products } from './products.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero: big sneaker + floating garments
{
  const canvas = document.getElementById('hero3d');
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  cam.position.set(0, 0.6, 8);
  addLights(scene);
  const shoe = createSneaker({ upper: 0xf4f4f4, accent: 0xe3262f });
  shoe.scale.setScalar(0.95);
  scene.add(shoe);
  const items = [
    ['hoodie', 0x2c2c34, 4.4, 2.0], ['tshirt', 0xe3262f, 3.6, 1.6], ['cap', 0xf4f4f4, 3.2, -1.6], ['tshirt', 0x3a3a44, 0.6, -2.4],
  ].map(([t, c, x, y], i) => {
    const m = createGarment(t, c); m.position.set(x, y, -1.5 - i * 0.4); m.scale.setScalar(0.7); scene.add(m); return m;
  });
  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; });
  const clock = new THREE.Clock();
  (function loop() {
    const t = clock.getElapsedTime();
    fit(renderer, cam, canvas);
    const wide = canvas.clientWidth > 800;
    shoe.position.set(wide ? 2.7 : 0, wide ? -0.3 : -1.8, 0);
    shoe.rotation.y = (reduce ? 0.6 : t * 0.5) + mouse.x * 0.8;
    shoe.rotation.x = 0.15 + mouse.y * 0.3;
    shoe.position.y += Math.sin(t * 1.5) * 0.08;
    items.forEach((m, i) => { m.rotation.y = t * (0.3 + i * 0.1); m.rotation.z = Math.sin(t + i) * 0.2; m.position.y += Math.sin(t * 1.2 + i) * 0.003; });
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  })();
}

// Apparel showcase
{
  const canvas = document.getElementById('apparel3d');
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100); cam.position.set(0, 0, 7);
  addLights(scene);
  const set = [['hoodie', 0xe3262f, -1.6], ['tshirt', 0xf4f4f4, 0.4], ['cap', 0x222228, 2.0]].map(([t, c, x]) => {
    const m = createGarment(t, c); m.position.x = x; scene.add(m); return m;
  });
  const clock = new THREE.Clock();
  (function loop() {
    const t = clock.getElapsedTime(); fit(renderer, cam, canvas);
    set.forEach((m, i) => { m.rotation.y = t * 0.8 + i; m.position.y = Math.sin(t * 2 + i) * 0.2; });
    renderer.render(scene, cam); requestAnimationFrame(loop);
  })();
}

// Product cards: one shared renderer drawing into each card's 2D canvas would be ideal;
// for 6 items, a small renderer per card is fine.
const grid = document.getElementById('productGrid');
for (const p of products) {
  const a = document.createElement('a');
  a.className = 'card'; a.href = `product.html?p=${p.slug}`;
  a.innerHTML = `<canvas aria-hidden="true"></canvas><div class="info"><div class="brand">${p.brand}</div><h3>${p.name}</h3><div class="price">€${p.price.toFixed(2)}</div></div>`;
  grid.appendChild(a);
  const canvas = a.querySelector('canvas');
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene(); addLights(scene);
  const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50); cam.position.set(0, 0.8, 6.5); cam.lookAt(0, 0, 0);
  const shoe = createSneaker(p.colors); scene.add(shoe);
  let hover = false; a.onpointerenter = () => hover = true; a.onpointerleave = () => hover = false;
  let rot = 0.6;
  (function loop() {
    fit(renderer, cam, canvas);
    rot += hover ? 0.04 : 0.006; shoe.rotation.y = rot;
    renderer.render(scene, cam); requestAnimationFrame(loop);
  })();
}
