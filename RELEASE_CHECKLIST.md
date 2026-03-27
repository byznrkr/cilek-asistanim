# Release Checklist

Bu kontrol listesi `1.0.0` surumunu yayinlamadan once hizli dogrulama icin hazirlandi.

## 1) Ortam ve Konfigurasyon

- [ ] `Node.js 18+` kurulu
- [ ] `.env` dosyasi mevcut
- [ ] `GEMINI_API_KEY` gecerli bir anahtar ile ayarlandi
- [ ] `.env` dosyasi repoya dahil edilmedi

## 2) Uygulama Calisma Testi

- [ ] `node server.js` ile uygulama hatasiz aciliyor
- [ ] `http://localhost:3000` ulasilabilir
- [ ] Konsolda kritik hata yok

## 3) Onboarding ve Takvim

- [ ] Sehir + yetistirme tipi secimi zorunlu calisiyor
- [ ] `Olustur` ile onboarding gizlenip takvim alani aciliyor
- [ ] Header'da `📍 Sehir | Tip` bilgisi guncelleniyor
- [ ] `POST /api/calendar` yanitinda 30 gunluk liste gosteriliyor
- [ ] `Gunun puf noktasi` alani doluyor
- [ ] API hatasinda fallback mesaj/icerik gorunuyor

## 4) Fotograf Analizi

- [ ] Fotograf secilmeden `Analiz Et` basildiginda uyari veriliyor
- [ ] Gecerli fotografla `POST /api/vision` calisiyor
- [ ] Sonuc kirmizi uyari kutusunda gorunuyor
- [ ] API hatasinda fallback analiz metni gorunuyor

## 5) Tema ve Durum Yonetimi

- [ ] `⚙️ Ayarlar` ile aydinlik/karanlik gecisi calisiyor
- [ ] Header tasarimi tema degisiminde sabit kaliyor
- [ ] Tema tercihi yenilemede korunuyor (`localStorage`)
- [ ] `🔙 Geri` ile uygulama onboarding ekranina donuyor
- [ ] `🔙 Geri` sonrası takvim/fotograf/load durumlari temizleniyor

## 6) Responsive ve UX

- [ ] 820px altinda kart/padding yapisi duzgun
- [ ] 640px altinda header ve butonlar tasma yapmiyor
- [ ] Mobilde ana butonlar dokunma dostu
- [ ] Takvim ve fotograf analizi esnasinda loading overlay gorunuyor
- [ ] Islem bitince loading overlay kayboluyor

## 7) Dokumantasyon

- [ ] `README.md` kurulum ve kullanim adimlari guncel
- [ ] `CHANGELOG.md` surum notlari guncel
- [ ] Bu checklist son durumla uyumlu

## 8) Yayin Oncesi Son Adimlar

- [ ] Son manuel smoke test tamamlandi
- [ ] Gerekli dosyalar commit edildi
- [ ] (Opsiyonel) Netlify/Lovable deploy testi yapildi

