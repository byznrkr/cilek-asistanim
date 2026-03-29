# Akıllı Çilek Asistanı

Akilli Cilek Asistani; sehir ve yetistirme tipine gore 1 aylik emoji tabanli gorev takvimi olusturan, fotograf analizi ve AI ile hastalik/zararli icin acil aksiyon onerileri sunan bir web uygulamasidir.

## Problem
Çilek yetiştirmek keyifli bir uğraş olsa da, bitki hastalıklarına anında ve doğru tanıyı koymak, aynı zamanda konuma ve yetiştirme tipine uygun günlük bakımı planlamak hobi yetiştiricileri için oldukça zordur. Yanlış müdahaleler veya düzensiz bakım döngüleri maalesef bitki kayıplarına yol açmaktadır.

## Çözüm
Akıllı Çilek Asistanı, kullanıcının bulunduğu şehir ve yetiştirme tipine (Saksı/Tarla) göre 30 günlük, anlaşılır emojilerle desteklenen kişiselleştirilmiş bir bakım takvimi sunar. Çevrimdışı durumlarda bile çalışan akıllı bir yedekleme sistemine sahiptir. 

Projenin kalbinde güçlü bir Yapay Zeka entegrasyonu yatar. Sohbet paneli içerisine entegre edilen "Acil Çilek Doktoru" (n8n otomasyonu) sayesinde, kullanıcılar bitkilerindeki sorunu forma yazıp gönderdiklerinde, sistem arka planda Gemini yapay zeka modelini çalıştırır. Saniyeler içinde analiz edilen sorun, kullanıcının e-posta adresine detaylı bir teşhis ve 3 maddelik acil çözüm reçetesi olarak otomatik iletilir.

## Canlı Demo
- **Yayın Linki:** [https://cilek-asistanim.netlify.app/](https://cilek-asistanim.netlify.app/)
- **Demo Video:** [https://www.loom.com/share/a4caad54b65149a59b065a28b203bdbe](https://www.loom.com/share/a4caad54b65149a59b065a28b203bdbe)
  
## Kullanılan Teknolojiler
- HTML, CSS, JavaScript (Kullanıcı Arayüzü)
- Google Gemini API (Yapay Zeka Analiz Modeli)
- n8n (Sıfır-Kod AI Otomasyonu ve Gmail Entegrasyonu)
- Netlify (Canlı Yayınlama / Deployment)
- Node.js (Yerel Sunucu Ortamı)
- Cursor, Google AI Studio, ChatGPT (Geliştirme ve Kodlama Destek Araçları)
- Loom (Demo Video)
## Ozellikler

- Onboarding: `Sehir/Ilce` + `Saksi` / `Tarla` secimi
- Sabit pembe gradient header + dinamik alt tema (Aydinlik/Karanlik)
- Gemini destekli 30 gunluk emoji gorev takvimi + gunun puf noktasi
- Foto yukleme ile Gemini Vision analiz (olasi teshis + acil cozum adimlari)
- Mobil uyumlu arayuz ve API cagrilarinda yukleniyor animasyonu

## Nasıl Çalıştırılır?
Projeyi kendi bilgisayarınızda yerel olarak çalıştırmak için şu adımları izleyebilirsiniz:

**Gereksinimler:**

- Node.js `18+` (Node `18+` ile global `fetch` destegi gerekir)
- Gemini API anahtari

**Kurulum ve Çalıştırma Adımları:**

1. Proje dosyalarını bilgisayarınıza indirin ve terminalden (komut satırı) proje klasörüne girin:
   - `cd cilek-asistanim-main`
2. `.env` dosyasini duzenle:
   - `GEMINI_API_KEY=your_real_api_key`
3. Sunucuyu baslat:
   - `node server.js`
4. Tarayicida ac:
   - [http://localhost:3000](http://localhost:3000)
  
## Kullanim Akisi

1. Sehir/Ilce gir ve yetistirme tipi sec.
2. `Takvimi Olustur` ile aylik takvimi getir.
3. `⚙️ Ayarlar` içerisinden ` ☀ aydınlık ` `🌙 karanlık ` ` 📱sistem ` ile tema degistir.
4. Yine `⚙️ Ayarlar` içerisinden emoji rehberini görebilir ve bize yazından mail atılabilir.
5. `🍓Sohbet balonu ` `Acil Çilek Doktoru` ile hastalik analizi al.
6. `BİLGİLERİ SİFİRLA` ile uygulamayi sifirla ve onboarding ekranina don.

## Proje Dosyalari

- `index.html`: Arayuz yapisi
- `styles.css`: Tema, mobil uyum ve animasyon stilleri
- `app.js`: Frontend etkileşimleri ve API cagrilari
- `server.js`: Statik dosya sunumu + `/api/calendar` + `/api/vision`
- `.env.example`: Ortam degiskeni ornegi

## Notlar

- `.env` dosyasi gizli tutulmalidir, repoya eklenmemelidir.
- API anahtari yoksa veya servis gecici erisilemezse uygulama fallback icerik gosterir.

##  🌟 Yeni Özellik: Çilek Acil Durum Hattı (AI Otomasyonu)
- Projeye n8n kullanılarak sıfır-kod (no-code) bir yapay zeka otomasyonu entegre edildi. Kullanıcılar form üzerinden bitkilerindeki sorunu iletiyor, sistem arka planda en güncel Gemini modeliyle bunu analiz edip saniyeler içinde kullanıcıya özel 3 maddelik acil çözüm reçetesini otomatik e-posta olarak gönderiyor!  
