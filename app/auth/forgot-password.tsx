import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const handleResetPassword = async () => {
    if (!email) {
      setError('E-posta adresinizi giriniz');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Firebase auth eklendiğinde burada gerçek şifre sıfırlama işlemleri yapılacak
      // Şimdilik başarılı mesajı gösteriyoruz
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('Şifre sıfırlama başarısız. Lütfen tekrar deneyin.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={[styles.container, { backgroundColor }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>

          <ThemedView style={styles.logoContainer}>
            <MaterialIcons name="lock-reset" size={80} color={iconColor} />
            <ThemedText type="title" style={styles.title}>Şifre Sıfırlama</ThemedText>
          </ThemedView>

          {success ? (
            <ThemedView style={styles.successContainer}>
              <MaterialIcons name="check-circle" size={60} color={iconColor} style={styles.successIcon} />
              <ThemedText type="subtitle">Şifre sıfırlama bağlantısı gönderildi!</ThemedText>
              <ThemedText style={styles.successMessage}>
                E-posta adresinize şifre sıfırlama bağlantısı gönderdik. Lütfen e-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
              </ThemedText>
              <TouchableOpacity 
                style={styles.backToLoginButton}
                onPress={() => router.push("/auth/login")}
              >
                <ThemedText style={styles.backToLoginText}>Giriş Sayfasına Dön</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <ThemedView style={styles.formContainer}>
              <ThemedText style={styles.instructions}>
                Şifrenizi sıfırlamak için e-posta adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz.
              </ThemedText>
              
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

              <TouchableOpacity 
                style={[styles.resetButton, loading && styles.resetButtonDisabled]} 
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ThemedText style={styles.resetButtonText}>İşleniyor...</ThemedText>
                ) : (
                  <ThemedText style={styles.resetButtonText}>Şifremi Sıfırla</ThemedText>
                )}
              </TouchableOpacity>

              <ThemedView style={styles.loginContainer}>
                <ThemedText>Şifrenizi hatırladınız mı? </ThemedText>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                  <ThemedText style={styles.loginText}>Giriş Yap</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    marginTop: 10,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
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
    marginBottom: 20,
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
  resetButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successMessage: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 22,
  },
  backToLoginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  backToLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 