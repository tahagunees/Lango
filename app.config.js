import 'dotenv/config';

// Hata ayıklama için konsola çıktı vermeyin - bu güvenlik riski oluşturabilir
// console.log('Environment variable reading:', process.env.GEMINI_API_KEY);

export default {
  "expo": {
    "name": "Lango",
    "slug": "Lango",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/web-app-manifest-512x512.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "icon": "./assets/images/web-app-manifest-512x512.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/web-app-manifest-192x192.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.ico"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/apple-touch-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "GEMINI_API_KEY": process.env.GEMINI_API_KEY,
      "FIREBASE_API_KEY": process.env.FIREBASE_API_KEY,
      "FIREBASE_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN,
      "FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
      "FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
      "FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID,
      "FIREBASE_APP_ID": process.env.FIREBASE_APP_ID
    }
  }
}; 