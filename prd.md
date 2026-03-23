# 📝 Ürün Gereksinim Belgesi (PRD) - Akıllı Çilek Asistanı

## 1. Ürün Vizyonu ve Kapsam
Akıllı Çilek Asistanı; kullanıcıyı yormayan, karmaşık ziraat terimlerinden uzak, günlük ve "Emoji Tabanlı" görevler sunan bir tarım asistanıdır. Google Gemini API gücünü kullanarak kişisel bir Ziraat Mühendisi gibi çalışır.

## 2. Temel Özellikler (MVP)

### A. Karşılama ve Ortam Seçimi (Onboarding)
- Kullanıcıdan **Şehir/İlçe** bilgisi alınır (Örn: Niğde).
- Yetiştirme Tipi Seçimi: **🪴 Saksı (Hobi)** veya **🚜 Tarla (Profesyonel)**.
- *Kritik Mantık:* Saksı seçilirse AI don uyarılarını görmezden gelir ve su miktarını "ml" cinsinden verir. Tarla seçilirse don, UV ve yağış uyarıları merkeze alınır.

### B. Dinamik Takvim ve Emoji Standardı
Aylık görünümde her güne sadece bir ana görev atanır:
- 💧 Su, 🌱 Ekim, 🧪 Besin, ⛏️ Çapa, ✂️ Budama, 🌞 Işık, 🧤 Hasat, ❄️ Koruma.

### C. Görüntü İşleme (Computer Vision)
- Kullanıcı "📷 Kamera" butonuna tıklayıp sorunlu çileğin fotoğrafını yükler.
- Gemini Vision modeli fotoğrafı analiz eder, hastalık/zararlı teşhisi koyar ve 3 maddelik acil çözüm planı sunar.

## 3. UI/UX Tasarım Kuralları
- **Sabit Üst Bar (Header):** Temadan bağımsızdır. Canlı pembeden hafif pembeye gradyan (`linear-gradient(to right, #FF4D4D, #FFC0CB)`). İkonlar yaprak yeşili (`#4CAF50`), yazılar beyaz. "📍 Şehir | 🪴 Tip" bilgisi dinamik değişir. Üst barda arayüzü sıfırlayan bir "🔙 Geri" butonu bulunur.
- **Dinamik Tema:** Alt kısımlar değişir. Karanlık Mod (Arka Plan `#121212`, Yazı `#E0E0E0`). Aydınlık Mod (Arka Plan `#F9FBF9`, Yazı `#2D3436`).
