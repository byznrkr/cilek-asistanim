# Changelog

Bu dosya projedeki onemli degisiklikleri takip etmek icin tutulur.

## [1.0.0] - 2026-03-23

### Eklendi

- Temel proje iskeleti (`index.html`, `styles.css`, `app.js`)
- PRD uyumlu sabit ust header:
  - Pembe gradyan arka plan
  - `⚙️ Ayarlar`, `📍 Sehir Secilmedi`, `🔙 Geri`
- Onboarding formu:
  - Sehir/Ilce alani
  - `Saksi` / `Tarla` secimi
  - `Olustur` ile takvim ekranina gecis
- Tema degistirici:
  - Aydinlik/Karanlik mod
  - Tema tercihini localStorage'da saklama
- Uygulama sifirlama:
  - `🔙 Geri` ile forma donus
  - Local state temizligi
- Gemini takvim entegrasyonu:
  - `POST /api/calendar`
  - 30 gunluk emoji tabanli plan
  - Gunun puf noktasi
- Gemini Vision entegrasyonu:
  - `POST /api/vision`
  - Fotograf analizi (olasi teshis + acil cozum adimlari)
- Yukleniyor animasyonu:
  - Takvim olusturma ve fotograf analizinde overlay + spinner
- Mobil uyumluluk:
  - Kucuk ekranlar icin responsive header, kartlar ve butonlar
- Dokumantasyon:
  - Kapsamli `README.md`
  - `.env.example` ve `.env` kullanimi

### Degistirildi

- Header sabit kalacak sekilde tema sistemi alt bolumlere sinirlandi.
- Takvim karti, puf noktasi ve analiz kutusu ile genisletildi.

### Guvenlik

- `.env` dosyasi `.gitignore` icine eklendi.

