# SPIKE – yeni site prototipi

Statik site, kurulum gerektirmez. Çalıştırmak için: `cd spike-site && python3 -m http.server` → http://localhost:8000

- `index.html` – ana sayfa: 3D dönen ayakkabı + uçuşan kıyafetler, ürün kartları (her kartta 3D model), kategoriler, hakkımızda, SSS, mağaza/harita
- `product.html?p=<slug>` – ürün sayfası: aşağı kaydırdıkça ayakkabı döner (yan → ön → arka → diğer yan → taban); fareyle sürükleyerek de döner
- `js/models.js` – 3D modeller kodla üretiliyor (geçici). Gerçek ürün modelleri (.glb) gelince burası değişecek
- `js/products.js` – ürün listesi. **Fiyatlar ve renkler örnek, kontrol edilmeli**
- SEO: düzeltilmiş ShoeStore schema, FAQPage schema, Product schema, hreflang, robots.txt, sitemap.xml, llms.txt

## Eksik bilgiler (TODO)
`index.html` içinde `TODO_` geçen yerler: adres, telefon, enlem/boylam, çalışma saatleri ve Google Maps embed.
