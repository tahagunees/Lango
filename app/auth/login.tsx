import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email ve şifre gereklidir');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Firebase auth eklendiğinde burada gerçek giriş işlemleri yapılacak
      // Şimdilik doğrudan ana sayfaya yönlendiriyoruz
      setTimeout(() => {
        setLoading(false);
        router.replace('/(tabs)');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Sosyal medya girişi (ileride Firebase ile entegre edilecek)
    console.log(`${provider} ile giriş yapılıyor`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={[styles.container, { backgroundColor }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedView style={styles.logoContainer}>
            <MaterialIcons name="translate" size={80} color="#4CAF50" />
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
              <MaterialIcons name="email" size={22} color="#757575" style={styles.inputIcon} />
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
              <MaterialIcons name="lock" size={22} color="#757575" style={styles.inputIcon} />
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
                  color="#757575" 
                />
              </TouchableOpacity>
            </ThemedView>

            <TouchableOpacity 
              style={styles.forgotPasswordContainer} 
              onPress={() => router.push("/auth/forgot-password")}
            >
              <ThemedText style={styles.forgotPasswordText}>Şifremi unuttum</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ThemedText style={styles.loginButtonText}>Giriş yapılıyor...</ThemedText>
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
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('Google')}
              >
                <MaterialIcons name="android" size={24} color="#4285F4" />
                <ThemedText style={styles.socialButtonText}>Google</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <MaterialIcons name="facebook" size={24} color="#3b5998" />
                <ThemedText style={styles.socialButtonText}>Facebook</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.signupContainer}>
              <ThemedText>Hesabınız yok mu? </ThemedText>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <ThemedText style={styles.signupText}>Kayıt Ol</ThemedText>
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
    color: '#2196F3',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  loginButtonText: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    width: '48%',
    borderWidth: 1,
  },
  googleButton: {
    borderColor: '#4285F4',
  },
  facebookButton: {
    borderColor: '#3b5998',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
}); 