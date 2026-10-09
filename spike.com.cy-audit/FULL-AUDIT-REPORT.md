# SPIKE (spike.com.cy) — Ana Sayfa SEO Denetimi

**Kaynak:** Kullanıcının kaydettiği ana sayfa HTML'i (2026-10-09). Canlı site, robots.txt, site haritası ve hız ölçümü bu ortamdan erişilemediği için incelenemedi.
**Önemli not:** Sayfa kaydedilirken Chrome'un otomatik çevirisi açıkmış (`class="translated-ltr"`); Türkçe başlıklar çeviri ürünüdür, sitenin asıl dili İngilizce.
**İşletme türü:** E-ticaret + fiziksel mağaza (Lefkoşa'da sneaker / sokak giyimi mağazası). Altyapı: WordPress 7.1 + WooCommerce + Elementor + Rank Math, Bunny CDN.

## Tahmini Sağlık Puanı: 58 / 100
(Tek sayfaya dayalı tahmin; teknik ve hız kategorileri eksik veriyle puanlandı.)

| Kategori | Puan |
|---|---|
| Teknik SEO | 60 |
| İçerik kalitesi | 55 |
| Sayfa içi SEO | 65 |
| Yapılandırılmış veri (Schema) | 40 |
| Performans | 45 (tahmini) |
| Yapay zekâ aramaya hazırlık | 55 |
| Görseller | 70 |

## İyi olanlar
- Title (50 karakter) ve meta description (139 karakter) uygun uzunlukta, "Cyprus" ve "sneaker" geçiyor.
- Canonical doğru (`https://spike.com.cy/`), robots `index, follow`.
- Open Graph + Twitter kartı eksiksiz (1200×630 görsel).
- Tek H1 var. 53 görselin 46'sında alt metni var; WebP kullanılıyor, CDN var.
- WebSite + SearchAction şeması mevcut.

## Bulgular

### Kritik / Yüksek
1. **Schema'da hatalı işletme bilgisi (Yüksek).** `legalName: "Admin"`; adres, telefon, konum (geo), fiyat aralığı yok. Bu yerel aramada (Google Haritalar, "near me") görünürlüğü zayıflatır.
   → `ShoeStore` bloğuna gerçek `legalName`, `address` (Lefkoşa), `telephone`, `geo`, `priceRange`, `sameAs` (Instagram, Facebook, Google Business Profile) ekleyin.
2. **Ana sayfa "Article" olarak işaretlenmiş, yazar "admin" (Yüksek).** Rank Math varsayılanı. Ayrıca `twitter:data1 = admin`, "6 minutes" okuma süresi. Ana sayfa bir mağaza; güven sinyalini düşürür.
   → Rank Math'te ana sayfa schema türünü "None/WebPage" yapın; yazar etiketlerini kaldırın.
3. **Çalışma saatleri şüpheli (Yüksek).** Schema'da her gün 09:00–17:00. Gerçek saatlerle ve Google Business Profile ile aynı olmalı.
4. **Aynı paragraf H2 olarak kullanılmış (Orta-Yüksek).** "Starting out in 2003…" uzun paragrafı H2 etiketinde ve sayfada tekrar ediyor. Menü/Shop/Account gibi menü başlıkları da H2. Başlık hiyerarşisi bozuk, hiç H3 yok.
   → Paragrafı `<p>` yapın; menü başlıklarını H2 olmaktan çıkarın; kategorilere H2, alt başlıklara H3 verin.

### Orta
5. **Çok dilli yapı belirsiz.** WPML izleri var ama `hreflang` etiketi yok. Türkçe/Yunanca sürüm hedefleniyorsa her dil için ayrı URL + hreflang gerekir; Kuzey Kıbrıs müşterisi Türkçe arıyor.
6. **Ağır sayfa.** 139 script (72 harici), 54 CSS dosyası, sadece 2 görselde lazy-load. LCP/INP büyük ihtimalle zayıf.
   → Kullanılmayan eklentileri kaldırın, CSS/JS birleştirme ve geciktirme (WP Rocket / LiteSpeed), ekranın altındaki görsellere lazy-load.
7. **Ana sayfada çok az ürün/kategori metni.** Ürün linkleri 12 adet; "Nicosia sneakers", "Nike/Adidas Cyprus" gibi aramalara yönelik açıklayıcı metin yok.
   → Kategori bloklarına 1–2 cümlelik açıklama, marka listesi ve SSS bölümü (kargo, iade, orijinallik) ekleyin.
8. **İletişim bilgisi görünür değil.** Sadece Info@spike.com.cy bulundu; telefon ve açık adres sayfada net değil.
   → Footer'a tam adres, telefon, harita linki ekleyin (schema ile birebir aynı).

### Düşük
9. 7 görselde alt metni yok (ikonlar ve şablon görselleri; dekoratifse `alt=""` uygundur).
10. Organization `logo` ile OG görseli farklı alan adlarında (spike.com.cy vs CDN); sorun değil ama tutarlılık için tek kaynak önerilir.
11. Çerez banner'ı metni çok uzun ve HTML'in başında; ilk içerikli metin çerez metni oluyor.

## Eylem Planı
- **1. hafta:** Schema düzeltmeleri (1, 2, 3), başlık yapısı (4), iletişim bilgisi (8).
- **2–3. hafta:** Hız optimizasyonu (6), Google Business Profile ile tutarlılık kontrolü.
- **2. ay:** Ana sayfa ve kategori metinleri (7), Türkçe sürüm + hreflang kararı (5).
- **Sürekli:** Search Console'da indekslenme ve sorguları takip.

## İncelenemeyenler
robots.txt, sitemap.xml, diğer sayfalar (500 sayfalık tarama), gerçek Core Web Vitals, backlink profili. Ağ erişimi açılırsa tam denetim yapılabilir.
