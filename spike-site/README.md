# SPIKE – yeni site prototipi

Statik site, kurulum gerektirmez. Çalıştırmak için: `cd spike-site && python3 -m http.server` → http://localhost:8000

- `index.html` – ana sayfa: 3D giriş, gerçek ürün fotoğraflı kartlar, kategoriler, hakkımızda, SSS, mağaza/harita
- `product.html?p=<slug>` – ürün sayfası: mağazanın gerçek fotoğrafı, kaydırdıkça hafifçe yakınlaşır
- `js/models.js` – (artık kullanılmıyor, eski 3D denemesi)
- `js/products.js` – ürün listesi. **Fiyatlar ve renkler örnek, kontrol edilmeli**
- SEO: düzeltilmiş ShoeStore schema, FAQPage schema, Product schema, hreflang, robots.txt, sitemap.xml, llms.txt

## Eksik bilgiler (TODO)
`index.html` içinde `TODO_` geçen yerler: adres, telefon, enlem/boylam, çalışma saatleri ve Google Maps embed.
