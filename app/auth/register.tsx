import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function RegisterScreen() {
  const router = useRouter();
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

    setError('');
    setLoading(true);

    try {
      // Firebase auth eklendiğinde burada gerçek kayıt işlemleri yapılacak
      // Şimdilik doğrudan ana sayfaya yönlendiriyoruz
      setTimeout(() => {
        setLoading(false);
        router.replace('/(tabs)');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Kayıt başarısız. Lütfen tekrar deneyin.');
    }
  };

  const handleSocialRegister = (provider: string) => {
    // Sosyal medya kayıt (ileride Firebase ile entegre edilecek)
    console.log(`${provider} ile kayıt yapılıyor`);
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
                <ThemedText style={styles.registerButtonText}>Kayıt yapılıyor...</ThemedText>
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
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialRegister('Google')}
              >
                <MaterialIcons name="android" size={24} color="#4285F4" />
                <ThemedText style={styles.socialButtonText}>Google</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialRegister('Facebook')}
              >
                <MaterialIcons name="facebook" size={24} color="#3b5998" />
                <ThemedText style={styles.socialButtonText}>Facebook</ThemedText>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
}); 