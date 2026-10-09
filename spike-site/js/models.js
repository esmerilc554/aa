// Procedural 3D models (no external model files needed).
import * as THREE from '../vendor/three.module.min.js';

function extrude(points, depth, bevel = 0.06) {
  const s = new THREE.Shape();
  s.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 12,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

function smoothShape(pts, segs = 6) {
  // Catmull-Rom closed curve -> points
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], 0)), true);
  return curve.getPoints(pts.length * segs).map(v => [v.x, v.y]);
}

export function createSneaker({ upper = 0xf2f2f2, accent = 0xd62828, sole = 0xffffff, lace = 0x222222 } = {}) {
  const g = new THREE.Group();
  const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.05 });

  // Midsole
  const soleGeo = extrude(smoothShape([[-1.6, 0], [1.7, 0], [1.85, 0.12], [1.7, 0.28], [-1.55, 0.3], [-1.72, 0.15]]), 0.96, 0.05);
  const soleMesh = new THREE.Mesh(soleGeo, mat(sole)); g.add(soleMesh);
  // Outsole (darker)
  const out = new THREE.Mesh(extrude(smoothShape([[-1.6, -0.06], [1.72, -0.06], [1.86, 0.04], [-1.72, 0.04]]), 0.94, 0.04), mat(0x3a3a3a));
  out.position.y = -0.02; g.add(out);
  // Upper
  const upperPts = smoothShape([[-1.55, 0.3], [1.6, 0.3], [1.75, 0.45], [1.3, 0.75], [0.4, 1.0], [-0.5, 1.45], [-1.35, 1.55], [-1.65, 1.1], [-1.7, 0.6]]);
  const up = new THREE.Mesh(extrude(upperPts, 0.8, 0.06), mat(upper)); g.add(up);
  // Toe cap
  const toe = new THREE.Mesh(extrude(smoothShape([[0.9, 0.3], [1.62, 0.3], [1.76, 0.45], [1.3, 0.72], [0.9, 0.78]]), 0.84, 0.06), mat(accent));
  g.add(toe);
  // Heel counter
  const heel = new THREE.Mesh(extrude(smoothShape([[-1.7, 0.3], [-1.0, 0.3], [-1.05, 1.1], [-1.4, 1.5], [-1.68, 1.1]]), 0.84, 0.06), mat(accent));
  g.add(heel);
  // Side stripe (both sides)
  const stripeGeo = extrude(smoothShape([[-0.9, 0.5], [0.6, 0.45], [0.95, 0.62], [-0.2, 0.95], [-0.95, 0.85]]), 0.02, 0.01);
  for (const z of [0.475, -0.475]) { const s = new THREE.Mesh(stripeGeo, mat(accent)); s.position.z = z; g.add(s); }
  // Laces
  for (let i = 0; i < 5; i++) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.56), mat(lace));
    const x = 0.55 - i * 0.24;
    l.position.set(x, 0.98 + i * 0.1, 0); l.rotation.z = 0.45; g.add(l);
  }
  // Tongue
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.42), mat(upper));
  tongue.position.set(-0.05, 1.22, 0); tongue.rotation.z = 0.5; g.add(tongue);
  // Collar padding
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.08, 12, 32), mat(lace));
  collar.position.set(-1.0, 1.42, 0); collar.rotation.x = Math.PI / 2; collar.scale.set(1.3, 0.9, 1); g.add(collar);

  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.position.y = -0.7;
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
}

export function createGarment(type = 'hoodie', color = 0x222222) {
  const shapes = {
    tshirt: [[-0.6, -1], [0.6, -1], [0.6, 0.35], [1.05, 0.15], [1.25, 0.55], [0.55, 1], [0.2, 0.92], [-0.2, 0.92], [-0.55, 1], [-1.25, 0.55], [-1.05, 0.15], [-0.6, 0.35]],
    hoodie: [[-0.7, -1.1], [0.7, -1.1], [0.7, 0.3], [0.95, -0.9], [1.25, -0.85], [1.05, 0.75], [0.5, 1], [0.35, 1.5], [0, 1.65], [-0.35, 1.5], [-0.5, 1], [-1.05, 0.75], [-1.25, -0.85], [-0.95, -0.9], [-0.7, 0.3]],
    cap: [[-0.8, 0], [1.4, 0], [1.4, 0.08], [0.8, 0.1], [0.7, 0.55], [0, 0.8], [-0.7, 0.55]],
  };
  const m = new THREE.Mesh(extrude(shapes[type], 0.25, 0.1),
    new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
  m.castShadow = true;
  return m;
}

export function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.shadowMap.enabled = true;
  return r;
}

export function addLights(scene) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444455, 1.1));
  const d = new THREE.DirectionalLight(0xffffff, 1.6);
  d.position.set(3, 6, 4); d.castShadow = true; scene.add(d);
  const rim = new THREE.DirectionalLight(0xff5544, 0.6); rim.position.set(-4, 2, -3); scene.add(rim);
}

export function fit(renderer, camera, canvas) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.floor(w * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
}

export { THREE };
