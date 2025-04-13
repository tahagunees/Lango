import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider as LangoThemeProvider, useTheme } from '@/context/ThemeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Navigation() {
  const { currentTheme } = useTheme();
  
  return (
    <ThemeProvider value={currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="+not-found" options={{ headerShown: true }} />
      </Stack>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LangoThemeProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </LangoThemeProvider>
  );
}
