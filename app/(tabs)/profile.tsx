import { ScrollView, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const router = useRouter();

  const stats = [
    { id: 1, title: 'Total XP', value: '2,540', icon: '🏆' },
    { id: 2, title: 'Learning', value: '3 Languages', icon: '🌎' },
    { id: 3, title: 'Daily Streak', value: '5 Days', icon: '🔥' },
    { id: 4, title: 'Words Learned', value: '346', icon: '📚' },
  ];

  const settings = [
    { id: 1, title: 'Account Settings', icon: 'person' },
    { id: 2, title: 'Notifications', icon: 'notifications' },
    { id: 3, title: 'Language Preferences', icon: 'language' },
    { id: 4, title: 'Daily Goal', icon: 'bar-chart' },
    { id: 5, title: 'Appearance', icon: 'palette' },
    { id: 6, title: 'Help & Support', icon: 'help' },
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Practice 7 days in a row', progress: 71 },
    { id: 2, title: 'Vocabulary Master', description: 'Learn 500 words', progress: 69 },
    { id: 3, title: 'Grammar Expert', description: 'Complete all grammar lessons', progress: 45 },
  ];

  const handleLogout = () => {
    // Burada Firebase Auth çıkış işlemi eklenebilir
    // Şimdilik doğrudan login sayfasına yönlendiriyoruz
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: true, title: 'Profile' }} />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.profilePicture}>
            <ThemedText style={styles.profileInitials}>JD</ThemedText>
          </ThemedView>
          <ThemedText type="title">John Doe</ThemedText>
          <ThemedText>Joined June 2023</ThemedText>
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
          <ThemedText type="subtitle">Achievements</ThemedText>
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
          <ThemedText type="subtitle">Settings</ThemedText>
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
            <ThemedText style={styles.logoutText}>Logout</ThemedText>
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