import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Tüm alanları doldurunuz');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    // Şifre güvenliği kontrolü
    if (password.length < 6) {
      setError('Şifre en az 6 karakter uzunluğunda olmalıdır');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Firebase Auth ile kayıt
      await register(email, password, fullName);
      
      // Başarılı kayıt, ana sayfaya yönlendir 
      router.replace('/(tabs)');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Google ile giriş
      const result = await googleLogin();
      
      // Sonuç undefined ise, işlem başarılı olmadı demektir (mobilden iptal edilmiş olabilir)
      if (!result) {
        setLoading(false);
        return;
      }
      
      // Başarılı giriş, ana sayfaya yönlendir
      router.replace('/(tabs)');
    } catch (err: any) {
      setLoading(false);
      if (err.code === 'auth/invalid-credential') {
        setError('Google hesabı ile giriş yapılamadı. Lütfen e-posta/şifre ile kayıt olun.');
      } else {
        setError('Google ile giriş başarısız. Lütfen tekrar deneyin.');
      }
      console.error('Google login error:', err);
    }
  };

  const handleSocialRegister = (provider: string) => {
    if (provider === 'Google') {
      handleGoogleRegister();
    } else {
      // Diğer sosyal medya seçenekleri için (ileride eklenebilir)
      console.log(`${provider} ile kayıt yapılıyor`);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={[styles.container, { backgroundColor }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedView style={styles.logoContainer}>
            <MaterialIcons name="translate" size={80} color={iconColor} />
            <ThemedText type="title" style={styles.title}>Lango</ThemedText>
          </ThemedView>

          <ThemedView style={styles.formContainer}>
            <ThemedText type="subtitle" style={styles.subtitle}>Kayıt Ol</ThemedText>
            
            {error ? (
              <ThemedView style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color="#F44336" />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </ThemedView>
            ) : null}

            <ThemedView style={styles.inputContainer}>
              <MaterialIcons name="person" size={22} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                value={fullName}
                onChangeText={setFullName}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <MaterialIcons name="email" size={22} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <MaterialIcons name="lock" size={22} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={22} 
                  color={iconColor} 
                />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <MaterialIcons name="lock" size={22} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre Tekrar"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </ThemedView>

            <ThemedView style={styles.termsContainer}>
              <ThemedText style={styles.termsText}>
                Kayıt olarak, <ThemedText style={styles.termsLink}>Kullanım Şartları</ThemedText> ve{' '}
                <ThemedText style={styles.termsLink}>Gizlilik Politikası</ThemedText>'nı kabul etmiş olursunuz.
              </ThemedText>
            </ThemedView>

            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ThemedView style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <ThemedText style={styles.registerButtonText}> Kayıt yapılıyor...</ThemedText>
                </ThemedView>
              ) : (
                <ThemedText style={styles.registerButtonText}>Kayıt Ol</ThemedText>
              )}
            </TouchableOpacity>

            <ThemedView style={styles.dividerContainer}>
              <ThemedView style={styles.divider} />
              <ThemedText style={styles.dividerText}>veya</ThemedText>
              <ThemedView style={styles.divider} />
            </ThemedView>

            <ThemedView style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialRegister('Google')}
              >
                <MaterialIcons name="android" size={24} color="#4285F4" />
                <ThemedText style={styles.socialButtonText}>Google ile Kayıt Ol</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.loginContainer}>
              <ThemedText>Zaten hesabınız var mı? </ThemedText>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <ThemedText style={styles.loginText}>Giriş Yap</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    marginTop: 10,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#F44336',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#757575',
    lineHeight: 18,
  },
  termsLink: {
    color: '#2196F3',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#757575',
  },
  socialButtonsContainer: {
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  googleButton: {
    backgroundColor: '#FFF',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 