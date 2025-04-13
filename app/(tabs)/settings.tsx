import { StyleSheet, ScrollView, SafeAreaView, View, Switch, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const { theme, setTheme } = useTheme();
  
  // Ayarlar için state değişkenleri
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  
  // Tema değişimini yönet
  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  // Ayarlar bölümleri
  const generalSettings = [
    {
      id: 'darkMode',
      title: 'Karanlık Mod',
      icon: 'dark-mode',
      value: theme === 'dark',
      onToggle: handleThemeChange,
    },
    {
      id: 'notifications',
      title: 'Bildirimler',
      icon: 'notifications',
      value: notifications,
      onToggle: () => setNotifications(!notifications),
    },
    {
      id: 'soundEffects',
      title: 'Ses Efektleri',
      icon: 'volume-up',
      value: soundEffects,
      onToggle: () => setSoundEffects(!soundEffects),
    },
  ];
  
  const learningSettings = [
    {
      id: 'dailyReminder',
      title: 'Günlük Hatırlatıcı',
      icon: 'alarm',
      value: dailyReminder,
      onToggle: () => setDailyReminder(!dailyReminder),
    },
    {
      id: 'autoPlay',
      title: 'Otomatik Oynatma',
      icon: 'play-circle-filled',
      value: autoPlay,
      onToggle: () => setAutoPlay(!autoPlay),
    },
  ];
  
  // Hesap ayarları - sadece gösterge amaçlı
  const accountSettings = [
    { id: 'profile', title: 'Profil Bilgileri', icon: 'person' },
    { id: 'password', title: 'Şifre Değiştir', icon: 'lock' },
    { id: 'language', title: 'Uygulama Dili', icon: 'language' },
    { id: 'delete', title: 'Hesabı Sil', icon: 'delete-forever', color: '#F44336' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Ayarlar</ThemedText>
          <ThemedText>Uygulama tercihlerinizi özelleştirin</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Genel</ThemedText>
          
          {generalSettings.map(setting => (
            <ThemedView key={setting.id} style={[styles.settingItem, { backgroundColor: theme === 'dark' ? '#2C2C2C' : '#F5F5F5' }]}>
              <View style={styles.settingLeft}>
                <MaterialIcons name={setting.icon} size={24} color={iconColor} style={styles.settingIcon} />
                <ThemedText>{setting.title}</ThemedText>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onToggle}
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor="#f4f3f4"
              />
            </ThemedView>
          ))}
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Öğrenme</ThemedText>
          
          {learningSettings.map(setting => (
            <ThemedView key={setting.id} style={[styles.settingItem, { backgroundColor: theme === 'dark' ? '#2C2C2C' : '#F5F5F5' }]}>
              <View style={styles.settingLeft}>
                <MaterialIcons name={setting.icon} size={24} color={iconColor} style={styles.settingIcon} />
                <ThemedText>{setting.title}</ThemedText>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onToggle}
                trackColor={{ false: "#767577", true: "#2196F3" }}
                thumbColor="#f4f3f4"
              />
            </ThemedView>
          ))}
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Hesap</ThemedText>
          
          {accountSettings.map(setting => (
            <TouchableOpacity key={setting.id} activeOpacity={0.7}>
              <ThemedView style={[styles.settingItem, { backgroundColor: theme === 'dark' ? '#2C2C2C' : '#F5F5F5' }]}>
                <View style={styles.settingLeft}>
                  <MaterialIcons 
                    name={setting.icon} 
                    size={24} 
                    color={setting.color || iconColor} 
                    style={styles.settingIcon} 
                  />
                  <ThemedText style={{ color: setting.color || textColor }}>
                    {setting.title}
                  </ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#757575" />
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Hakkında</ThemedText>
          
          <ThemedView style={[styles.aboutContainer, { backgroundColor: theme === 'dark' ? '#2C2C2C' : '#F5F5F5' }]}>
            <MaterialIcons name="translate" size={48} color={iconColor} style={styles.logoIcon} />
            <ThemedText type="defaultSemiBold" style={styles.appName}>Lango</ThemedText>
            <ThemedText>Sürüm 1.0.0</ThemedText>
            <ThemedText style={styles.copyright}>© 2023 Lango Dil Öğrenme</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80, // DrawerToggleButton için alan bırak
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
  },
  aboutContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
  },
  logoIcon: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    marginBottom: 4,
  },
  copyright: {
    marginTop: 16,
    color: '#757575',
    fontSize: 12,
  },
}); 