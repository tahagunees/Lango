import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import FIREBASE_AUTH, { FIRESTORE_DB } from '@/config/firebase';

// Context'in taşıyacağı tipleri tanımla
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential | undefined>;
  register: (email: string, password: string, fullName: string) => Promise<UserCredential | undefined>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<UserCredential | undefined>;
}

// Kullanıcı profili tipi
interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string;
  createdAt: number;
  lastLogin: number;
}

// Varsayılan değerlerle Context'i oluştur
const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: false,
  login: async () => undefined,
  register: async () => undefined,
  logout: async () => {},
  googleLogin: async () => undefined,
});

// Custom hook oluştur
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider bileşeni
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Kullanıcı profil bilgilerini Firestore'dan al
  const getUserProfile = async (uid: string) => {
    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setUserProfile(userData);
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('Profil bilgileri alınamadı:', error);
      return null;
    }
  };

  // Kullanıcı oturum durumunu izle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Kullanıcı oturum açmışsa, profil bilgilerini al
        await getUserProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Giriş fonksiyonu
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      
      // Kullanıcı son giriş zamanını güncelle
      if (userCredential.user) {
        const userDocRef = doc(FIRESTORE_DB, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          lastLogin: Date.now()
        }, { merge: true });
        
        await getUserProfile(userCredential.user.uid);
      }
      
      return userCredential;
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'Giriş yapılırken bir hata oluştu.';
      
      // Detaylı hata ayıklama için konsola yazdır
      console.error("Firebase Auth Error:", error);
      console.error("Error code:", errorCode);
      
      if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (errorCode === 'auth/user-disabled') {
        errorMessage = 'Bu kullanıcı hesabı devre dışı bırakılmış.';
      } else if (errorCode === 'auth/user-not-found') {
        errorMessage = 'Bu e-posta adresine ait bir kullanıcı bulunamadı.';
      } else if (errorCode === 'auth/wrong-password') {
        errorMessage = 'Hatalı şifre girdiniz.';
      } else if (errorCode === 'auth/network-request-failed') {
        errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
      }
      
      Alert.alert('Giriş Hatası', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Kayıt fonksiyonu
  const register = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      
      // Kullanıcı profil bilgilerini Firestore'a kaydet
      if (userCredential.user) {
        const { uid } = userCredential.user;
        const userProfile: UserProfile = {
          uid,
          fullName,
          email,
          photoURL: userCredential.user.photoURL || '',
          createdAt: Date.now(),
          lastLogin: Date.now()
        };
        
        const userDocRef = doc(FIRESTORE_DB, 'users', uid);
        await setDoc(userDocRef, userProfile);
        
        setUserProfile(userProfile);
      }
      
      return userCredential;
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'Kayıt olurken bir hata oluştu.';
      
      // Detaylı hata ayıklama için konsola yazdır
      console.error("Firebase Auth Error:", error);
      console.error("Error code:", errorCode);
      console.error("Error message:", error.message);
      
      if (errorCode === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanımda.';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (errorCode === 'auth/weak-password') {
        errorMessage = 'Şifre çok zayıf.';
      } else if (errorCode === 'auth/operation-not-allowed') {
        errorMessage = 'Bu işleme izin verilmiyor.';
      } else if (errorCode === 'auth/network-request-failed') {
        errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
      } else if (errorCode === 'auth/internal-error') {
        errorMessage = 'Firebase kimlik doğrulama hizmeti sorunu. Lütfen tekrar deneyin.';
      } else {
        // Belirli hata kodu eşleşmezse, Firebase'den gelen mesajı kullan
        errorMessage = error.message || 'Kayıt başarısız. Lütfen tekrar deneyin.';
      }
      
      Alert.alert('Kayıt Hatası', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google ile giriş fonksiyonu
  const googleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      
      let userCredential;
      
      if (Platform.OS === 'web') {
        // Web platformunda popup ile giriş
        userCredential = await signInWithPopup(FIREBASE_AUTH, provider);
      } else {
        // Mobil platformlarda doğrudan signInWithRedirect kullanmak yerine
        // Önerilen çözüm: Expo AuthSession veya react-native-google-signin kullanın
        console.log('Mobil platformda Google girişi denemesi');
        Alert.alert(
          'Google Giriş Bilgisi',
          'Mobil platformlarda Google girişi için Firebase kullanıyorsanız, Expo AuthSession veya react-native-google-signin paketi kullanmalısınız. Şu an için lütfen e-posta/şifre ile giriş yapın.',
          [{ text: 'Tamam', style: 'cancel' }]
        );
        setLoading(false);
        return undefined;
      }
      
      // Kullanıcı profil bilgilerini Firestore'a kaydet veya güncelle
      if (userCredential && userCredential.user) {
        const { uid, displayName, email, photoURL } = userCredential.user;
        
        const userDocRef = doc(FIRESTORE_DB, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Yeni kullanıcı ise profil oluştur
          const userProfile: UserProfile = {
            uid,
            fullName: displayName || 'Google Kullanıcısı',
            email: email || '',
            photoURL: photoURL || '',
            createdAt: Date.now(),
            lastLogin: Date.now()
          };
          
          await setDoc(userDocRef, userProfile);
          setUserProfile(userProfile);
        } else {
          // Mevcut kullanıcı ise son giriş zamanını güncelle
          await setDoc(userDocRef, {
            lastLogin: Date.now()
          }, { merge: true });
          
          await getUserProfile(uid);
        }
      }
      
      return userCredential;
    } catch (error: any) {
      console.error('Google ile giriş hatası:', error);
      Alert.alert('Google Giriş Hatası', 'Google ile giriş yapılırken bir hata oluştu.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış fonksiyonu
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(FIREBASE_AUTH);
      setUserProfile(null);
      Alert.alert('Başarılı', 'Başarıyla çıkış yaptınız.');
    } catch (error: any) {
      Alert.alert('Çıkış Hatası', 'Çıkış yapılırken bir hata oluştu.');
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    googleLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 