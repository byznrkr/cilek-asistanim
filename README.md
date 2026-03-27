# Akilli Cilek Asistani

Akilli Cilek Asistani; sehir ve yetistirme tipine gore 1 aylik emoji tabanli gorev takvimi olusturan, fotograf analizi ile hastalik/zararli icin acil aksiyon onerileri sunan bir web uygulamasidir.

## Ozellikler

- Onboarding: `Sehir/Ilce` + `Saksi` / `Tarla` secimi
- Sabit pembe gradient header + dinamik alt tema (Aydinlik/Karanlik)
- Gemini destekli 30 gunluk emoji gorev takvimi + gunun puf noktasi
- Foto yukleme ile Gemini Vision analiz (olasi teshis + acil cozum adimlari)
- Mobil uyumlu arayuz ve API cagrilarinda yukleniyor animasyonu

## Gereksinimler

- Node.js `18+` (Node `18+` ile global `fetch` destegi gerekir)
- Gemini API anahtari

## Kurulum

1. Proje klasorune gir:
   - `cd cilek-asistanim-main`
2. `.env` dosyasini duzenle:
   - `GEMINI_API_KEY=your_real_api_key`
3. Sunucuyu baslat:
   - `node server.js`
4. Tarayicida ac:
   - [http://localhost:3000](http://localhost:3000)

## Kullanim Akisi

1. Sehir/Ilce gir ve yetistirme tipi sec.
2. `Olustur` ile aylik takvimi getir.
3. `⚙️ Ayarlar` ile tema degistir.
4. `📷 Fotograf Yukle` + `Analiz Et` ile hastalik analizi al.
5. `🔙 Geri` ile uygulamayi sifirla ve onboarding ekranina don.

## Proje Dosyalari

- `index.html`: Arayuz yapisi
- `styles.css`: Tema, mobil uyum ve animasyon stilleri
- `app.js`: Frontend etkileşimleri ve API cagrilari
- `server.js`: Statik dosya sunumu + `/api/calendar` + `/api/vision`
- `.env.example`: Ortam degiskeni ornegi

## Notlar

- `.env` dosyasi gizli tutulmalidir, repoya eklenmemelidir.
- API anahtari yoksa veya servis gecici erisilemezse uygulama fallback icerik gosterir.

##🌟 Yeni Özellik: Çilek Acil Durum Hattı (AI Otomasyonu)
- Projeye n8n kullanılarak sıfır-kod (no-code) bir yapay zeka otomasyonu entegre edildi. Kullanıcılar form üzerinden bitkilerindeki sorunu iletiyor, sistem arka planda en güncel Gemini modeliyle bunu analiz edip saniyeler içinde kullanıcıya özel 3 maddelik acil çözüm reçetesini otomatik e-posta olarak gönderiyor!  
