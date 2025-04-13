import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('E-posta ve şifre zorunludur');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Giriş başarısız. Lütfen tekrar deneyin.');
    }
  };

  const handleGoogleLogin = async () => {
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
        setError('Google hesabı ile giriş yapılamadı. Lütfen e-posta/şifre ile giriş yapın.');
      } else {
        setError('Google ile giriş başarısız. Lütfen tekrar deneyin.');
      }
      console.error('Google login error:', err);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      handleGoogleLogin();
    } else {
      // Diğer sosyal medya seçenekleri için (ileride eklenebilir)
      console.log(`${provider} ile giriş yapılıyor`);
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
            <ThemedText type="subtitle" style={styles.subtitle}>Giriş Yap</ThemedText>
            
            {error ? (
              <ThemedView style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color="#F44336" />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </ThemedView>
            ) : null}

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

            <TouchableOpacity onPress={() => router.push("/auth/forgot-password")} style={styles.forgotPasswordContainer}>
              <ThemedText style={styles.forgotPasswordText}>Şifremi Unuttum</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ThemedView style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <ThemedText style={styles.loginButtonText}> Giriş yapılıyor...</ThemedText>
                </ThemedView>
              ) : (
                <ThemedText style={styles.loginButtonText}>Giriş Yap</ThemedText>
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
                onPress={() => handleSocialLogin('Google')}
              >
                <MaterialIcons name="android" size={24} color="#4285F4" />
                <ThemedText style={styles.socialButtonText}>Google ile Giriş Yap</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.registerContainer}>
              <ThemedText>Hesabınız yok mu? </ThemedText>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <ThemedText style={styles.registerText}>Kayıt Ol</ThemedText>
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4285F4',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5D6A7', // Daha açık yeşil
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
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
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#4285F4',
    fontWeight: 'bold',
  }
}); 