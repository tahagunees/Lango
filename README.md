# Lango - İngilizce Öğrenme Uygulaması



## Proje Tanıtımı

Lango, İngilizce öğrenmek isteyenler için tasarlanmış kapsamlı bir mobil uygulamadır. Kullanıcı dostu arayüzü ve interaktif öğrenme deneyimi ile İngilizce öğrenme sürecinizi daha eğlenceli ve etkili hale getirir.

## Özellikler

### 🔍 Ana Ekran
- Günlük öğrenme hedefleri ve ilerleme takibi
- Önerilen aktiviteler ve kişiselleştirilmiş içerik
- Kullanıcı aktivite geçmişi ve XP puanları

### 📚 Dersler
- İnteraktif başlangıç, orta ve ileri seviye dersler
- Aşamalı eğitim programı
- İlerleme ve performans takibi

### 🔤 Kelime Pratiği
- Gemini AI ile farklı kategorilerde kelime öğrenimi
- Etkileşimli kelime kartları (çift taraflı)
- Telaffuz, örnek cümleler ve çeviriler
- Kelime kaydetme ve öğrenildi işaretleme özellikleri
- Kategori bazlı kelime listeleri

### 📝 Gramer Quizleri
- İnteraktif soru ve cevap formatı
- Detaylı açıklamalarla öğrenme
- Seviye bazlı ilerleme

### ⚙️ Ayarlar
- Karanlık/açık tema seçeneği
- Bildirim ve ses ayarları
- Uygulama dili seçimi
- Kullanıcı profil yönetimi

### 👤 Kullanıcı Hesabı
- Firebase Authentication entegrasyonu
- Güvenli giriş ve kayıt
- Profil bilgilerinin yönetimi
- Oturum açma ve çıkış işlemleri

## Teknik Özellikler

### Frontend
- **React Native**: Çapraz platform mobil uygulama geliştirme
- **Expo**: Hızlı geliştirme ve dağıtım altyapısı
- **React Navigation**: Sayfa yönlendirme ve navigasyon
- **React Native Reanimated**: Akıcı animasyonlar (kelime kartları için)
- **ThemedView ve ThemedText**: Karanlık/açık tema desteği
- **Context API**: Durum yönetimi (auth, tema vb.)

### Backend
- **Firebase Authentication**: Kullanıcı kimlik doğrulama
- **AsyncStorage**: Yerel veri depolama
- **Gemini AI API**: Yapay zeka destekli içerik üretimi

## Kurulum

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/kullanici/lango.git
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   cd lango
   npm install
   ```

3. Çevresel değişkenleri ayarlayın:
   ```bash
   cp .env.example .env
   ```
   `.env` dosyasını açın ve gerekli API anahtarlarını ekleyin. **API anahtarlarınızı asla repoya pushlamayın!**

4. Uygulamayı başlatın:
   ```bash
   npx expo start
   ```

## Çevresel Değişkenler

Bu uygulama, Firebase Authentication ve Gemini AI API gibi harici servisleri kullanmaktadır. Bu servislerin kullanımı için API anahtarlarına ihtiyaç vardır.

### API Anahtarlarını Ayarlama

1. `.env.example` dosyasını `.env` olarak kopyalayın
2. `.env` dosyasını açın ve placeholder değerleri kendi API anahtarlarınızla değiştirin:

```
# Gemini AI API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Firebase yapılandırması
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Güvenlik Uyarısı ⚠️

- **API anahtarlarınızı asla doğrudan kodun içine yazmayın!** Bunun yerine daima `.env` dosyasını kullanın.
- API anahtarlarınızı github veya başka bir repoya asla pushlamayın.
- `.env` dosyası `.gitignore` içinde listelenmeli ve git tarafından izlenmemelidir.
- Hassas bilgileri kodun içine açık metinde yazmak, bu bilgilerin kazara halka açık repolarda paylaşılmasına ve yetkisiz erişime neden olabilir.

## Uygulamayı Çalıştırma

1. Expo Go uygulamasını mobil cihazınıza yükleyin
2. Terminalde `npx expo start` komutunu çalıştırın
3. QR kodunu Expo Go uygulamasından tarayın (Android) veya Kamera uygulamasından tarayın (iOS)

## Proje Yapısı

```
lango/
├── app/                  # Expo Router sayfa yapılandırması
│   ├── (tabs)/           # Ana sekmeler (ana sayfa, dersler, keşfet)
│   └── auth/             # Kimlik doğrulama ekranları (giriş, kayıt)
├── assets/               # Görseller ve fontlar
├── components/           # UI bileşenleri
│   ├── language/         # Dil öğrenme bileşenleri (LessonCard, VocabularyCard, vs.)
│   └── ui/               # Genel UI bileşenleri (ThemedView, ThemedText, vs.)
├── constants/            # Sabitler (renkler, boyutlar, vs.)
├── context/              # Context API (AuthContext, ThemeContext)
├── hooks/                # Özel React hooks
└── services/             # Firebase ve API entegrasyonları
```

## Yapılacaklar ve Gelecek Özellikler

- [ ] Konuşma pratiği ekranı
- [ ] Dinleme egzersizleri
- [ ] İlerleme grafikleri ve istatistikleri
- [ ] Kelime oyunları ve meydan okumalar
- [ ] Topluluk özellikleri ve arkadaş ekleme
- [ ] Günlük hatırlatıcılar ve bildirimler
- [ ] Gelişmiş AI özelleştirmesi

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

© 2024 Lango. Tüm hakları saklıdır.
