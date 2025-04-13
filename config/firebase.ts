import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyD8x0MR1OFGUvVUr0K4QaaaAw06GJMe1Rs",
  authDomain: "lango-52392.firebaseapp.com",
  projectId: "lango-52392",
  storageBucket: "lango-52392.firebasestorage.app",
  messagingSenderId: "447697438339",
  appId: "1:447697438339:android:eeb5e7ea0572bb6393bdb6"
};

// Firebase uygulamasını başlat
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Firebase Auth nesnesini dışa aktar
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Firestore veritabanı nesnesini dışa aktar
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export default FIREBASE_AUTH; 