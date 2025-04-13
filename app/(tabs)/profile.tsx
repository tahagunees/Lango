import { ScrollView, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();

  // Kullanıcı adı veya e-posta adından baş harfler
  const getInitials = () => {
    if (userProfile?.fullName) {
      return userProfile.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Katılma tarihi formatı
  const getJoinedDate = () => {
    if (userProfile?.createdAt) {
      const date = new Date(userProfile.createdAt);
      const month = date.toLocaleString('tr-TR', { month: 'long' });
      const year = date.getFullYear();
      return `${month} ${year} tarihinde katıldı`;
    }
    return 'Yeni Kullanıcı';
  };

  const stats = [
    { id: 1, title: 'Toplam XP', value: '2,540', icon: '🏆' },
    { id: 2, title: 'Öğrenilen', value: '3 Dil', icon: '🌎' },
    { id: 3, title: 'Günlük Seri', value: '5 Gün', icon: '🔥' },
    { id: 4, title: 'Kelimeler', value: '346', icon: '📚' },
  ];

  const settings = [
    { id: 1, title: 'Hesap Ayarları', icon: 'person' },
    { id: 2, title: 'Bildirimler', icon: 'notifications' },
    { id: 3, title: 'Dil Tercihleri', icon: 'language' },
    { id: 4, title: 'Günlük Hedef', icon: 'bar-chart' },
    { id: 5, title: 'Görünüm', icon: 'palette' },
    { id: 6, title: 'Yardım ve Destek', icon: 'help' },
  ];

  const achievements = [
    { id: 1, title: '7 Günlük Seri', description: 'Arka arkaya 7 gün pratik yapın', progress: 71 },
    { id: 2, title: 'Kelime Ustası', description: '500 kelime öğrenin', progress: 69 },
    { id: 3, title: 'Gramer Uzmanı', description: 'Tüm gramer derslerini tamamlayın', progress: 45 },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: true, title: 'Profil' }} />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.profilePicture}>
            <ThemedText style={styles.profileInitials}>{getInitials()}</ThemedText>
          </ThemedView>
          <ThemedText type="title">{userProfile?.fullName || user?.email?.split('@')[0] || 'Kullanıcı'}</ThemedText>
          <ThemedText>{getJoinedDate()}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          {stats.map(stat => (
            <ThemedView key={stat.id} style={styles.statItem}>
              <ThemedText style={styles.statIcon}>{stat.icon}</ThemedText>
              <ThemedText type="defaultSemiBold">{stat.value}</ThemedText>
              <ThemedText style={styles.statTitle}>{stat.title}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Başarılar</ThemedText>
          {achievements.map(achievement => (
            <ThemedView key={achievement.id} style={styles.achievementCard}>
              <ThemedView style={styles.achievementInfo}>
                <ThemedText type="defaultSemiBold">{achievement.title}</ThemedText>
                <ThemedText>{achievement.description}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.achievementProgress}>
                <ThemedView style={styles.progressBar}>
                  <ThemedView 
                    style={[styles.progress, { width: `${achievement.progress}%` }]} 
                  />
                </ThemedView>
                <ThemedText>{achievement.progress}%</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Ayarlar</ThemedText>
          {settings.map(setting => (
            <Pressable key={setting.id}>
              <ThemedView style={styles.settingItem}>
                <ThemedView style={styles.settingIcon}>
                  <MaterialIcons name={setting.icon} size={24} color={iconColor} />
                </ThemedView>
                <ThemedText>{setting.title}</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        <Pressable onPress={handleLogout}>
          <ThemedView style={styles.logoutButton}>
            <MaterialIcons name="exit-to-app" size={20} color="white" style={styles.logoutIcon} />
            <ThemedText style={styles.logoutText}>Çıkış Yap</ThemedText>
          </ThemedView>
        </Pressable>
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
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitials: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#757575',
  },
  section: {
    marginBottom: 24,
  },
  achievementCard: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 12,
  },
  achievementInfo: {
    marginBottom: 8,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 8,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F44336',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 36,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoutIcon: {
    marginRight: 4,
  },
}); 