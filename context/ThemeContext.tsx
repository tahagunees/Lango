import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: ThemeType;
  currentTheme: 'light' | 'dark'; // Gerçek uygulanacak tema (system seçildiyse cihaz temasına göre)
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_STORAGE_KEY = '@lango_theme_preference';

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceTheme = useDeviceColorScheme() || 'light';
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  // Tema tercihini AsyncStorage'dan yükle
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Tema tercihi yüklenirken hata oluştu:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Tema değiştirme fonksiyonu
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Tema tercihi kaydedilirken hata oluştu:', error);
    }
  };
  
  // Gerçek uygulanan tema (eğer sistem seçildiyse, cihaz temasını kullan)
  const currentTheme = theme === 'system' ? deviceTheme : theme;
  
  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme hook must be used within a ThemeProvider');
  }
  return context;
}; 