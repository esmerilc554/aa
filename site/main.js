const PRODUCTS = [
  {id:1,cat:'saat',name:'Meridyen 40',desc:'Otomatik mekanik · safir cam · 40 mm',price:18900,tone:'#2f3b36',img:'images/saat-meridyen.jpg',tag:'Yeni'},
  {id:2,cat:'canta',name:'Sera Omuz Çantası',desc:'Tam tahıllı İtalyan derisi · el dikişi',price:9450,tone:'#b4553a',img:'images/canta-sera.jpg',tag:'Çok satan'},
  {id:3,cat:'ayakkabi',name:'Derby Klasik',desc:'Goodyear kaynaklı · buzağı derisi',price:7800,tone:'#c9b79c',img:'images/ayakkabi-derby.jpg'},
  {id:4,cat:'saat',name:'Atlas Chrono',desc:'Kronograf · çelik kordon · 100 m su geçirmez',price:24500,tone:'#4a4f57',img:'images/saat-atlas.jpg'},
  {id:5,cat:'canta',name:'Lale Sırt Çantası',desc:'Yağlı nubuk · kilitli ana bölme',price:11200,tone:'#6e4b34',img:'images/canta-lale.jpg',tag:'Sınırlı'},
  {id:6,cat:'ayakkabi',name:'Loafer Nar',desc:'El dikimi · deri astar · kauçuk taban',price:6900,tone:'#7a2e2a',img:'images/ayakkabi-loafer.jpg'}
];
const LABEL={saat:'Saat',canta:'Çanta',ayakkabi:'Ayakkabı'};
const tl=n=>'₺'+n.toLocaleString('tr-TR');
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* render products */
$('#grid').innerHTML = PRODUCTS.map(p=>`
<article class="card fade" data-cat="${p.cat}">
  <figure class="card__img ph clip" data-name="${p.name}" data-tone="${p.tone}">
    ${p.tag?`<span class="card__tag">${p.tag}</span>`:''}
    <img src="${p.img}" alt="${p.name}" loading="lazy">
    <button class="card__quick" data-add="${p.id}">Sepete ekle</button>
  </figure>
  <div class="card__info"><div><h3>${p.name}</h3><p>${LABEL[p.cat]} · ${p.desc}</p></div><b>${tl(p.price)}</b></div>
</article>`).join('');

/* missing image fallback */
$$('.ph').forEach(f=>{
  f.style.setProperty('--tone',f.dataset.tone);
  const img=$('img',f);
  const miss=()=>f.classList.add('missing');
  img.addEventListener('error',miss);
  if(img.complete&&!img.naturalWidth)miss();
});

/* intro */
const curtain=$('.curtain'), cnt=$('#count');
let n=0;
const tick=setInterval(()=>{n=Math.min(100,n+Math.ceil(Math.random()*9));cnt.textContent=n;if(n>=100){clearInterval(tick);setTimeout(start,350)}},45);
function start(){
  curtain.classList.add('out');
  document.body.classList.remove('is-loading');
  setTimeout(()=>{curtain.classList.add('done');$$('.hero .in-hero, .hero .split, .hero .reveal-line, .hero .clip').forEach((e,i)=>setTimeout(()=>e.classList.add('in'),i*90))},650);
}

/* scroll reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  $$('.clip',e.target).forEach(c=>c.classList.add('in'));
  io.unobserve(e.target);
}),{threshold:.15});
$$('.fade,.split,.clip').forEach(el=>{if(!el.closest('.hero'))io.observe(el)});

/* count up */
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target,end=+el.dataset.n,s=el.dataset.s||'';let t0;
  const f=t=>{t0??=t;const k=Math.min(1,(t-t0)/1600);el.textContent=Math.round(end*(1-Math.pow(1-k,3)))+s;if(k<1)requestAnimationFrame(f)};
  requestAnimationFrame(f);co.unobserve(el);
}),{threshold:.6});
$$('[data-n]').forEach(el=>co.observe(el));

/* filters */
$$('.filters button').forEach(b=>b.addEventListener('click',()=>{
  $$('.filters button').forEach(x=>x.classList.toggle('on',x===b));
  $$('.card').forEach(c=>{
    const show=b.dataset.f==='all'||c.dataset.cat===b.dataset.f;
    c.classList.toggle('hide',!show);
    if(show){c.style.animation='none';c.offsetHeight;c.style.animation='in .7s var(--ease)'}
  });
}));

/* cart */
let cart=[];
try{cart=JSON.parse(localStorage.getItem('ora-cart')||'[]')}catch{}
const drawer=$('#drawer');
function renderCart(){
  try{localStorage.setItem('ora-cart',JSON.stringify(cart))}catch{}
  $('#cartCount').textContent=cart.reduce((a,c)=>a+c.q,0);
  $('#cartList').innerHTML=cart.length?cart.map(c=>{const p=PRODUCTS.find(x=>x.id===c.id);return `<li><div class="t ph missing" data-name="" style="--tone:${p.tone}"></div><div><b>${p.name}</b><small>${c.q} × ${tl(p.price)}</small></div><button class="rm" data-rm="${p.id}">Kaldır</button></li>`}).join(''):'<li class="empty">Sepetin boş.</li>';
  $('#cartTotal').textContent=tl(cart.reduce((a,c)=>a+c.q*PRODUCTS.find(x=>x.id===c.id).price,0));
}
const setDrawer=o=>{drawer.classList.toggle('open',o);drawer.setAttribute('aria-hidden',!o)};
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]'),rm=e.target.closest('[data-rm]');
  if(add){const id=+add.dataset.add,i=cart.find(c=>c.id===id);i?i.q++:cart.push({id,q:1});renderCart();setDrawer(true)}
  if(rm){cart=cart.filter(c=>c.id!==+rm.dataset.rm);renderCart()}
});
$('#cartBtn').onclick=()=>setDrawer(true);
$('#drawerClose').onclick=$('#drawerBg').onclick=()=>setDrawer(false);
document.addEventListener('keydown',e=>e.key==='Escape'&&setDrawer(false));
$('#checkout').onclick=()=>alert('Bu bir demo sitesidir; ödeme altyapısı henüz bağlı değil.');
renderCart();

/* newsletter */
$('#news').addEventListener('submit',e=>{e.preventDefault();$('#newsMsg').textContent='Teşekkürler! Listeye eklendin.';e.target.reset()});

/* parallax on hero images (flat, 2D translate only) */
addEventListener('scroll',()=>{const y=scrollY;$$('.hero__media figure').forEach((f,i)=>f.style.translate=`0 ${-y*(.04+i*.03)}px`)},{passive:true});
