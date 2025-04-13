import { StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const secondaryBackgroundColor = theme === 'dark' ? '#2C2C2C' : '#F5F5F5';
  const { user, userProfile } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(10); // Günlük hedef dakika
  const [dailyProgress, setDailyProgress] = useState(4); // Bugün çalışılan dakika
  const [streak, setStreak] = useState(7); // Gün bazında çalışma serisi

  // Kullanıcının günlük hedefi tamamlama yüzdesi
  const dailyProgressPercentage = Math.min(100, (dailyProgress / dailyGoal) * 100);

  // Örnek aktivite verisi
  const recentActivities = [
    { id: 1, type: 'lesson', title: 'Temel İngilizce Tanışma', date: 'Bugün', xp: 10 },
    { id: 2, type: 'word', title: '5 Yeni Kelime Öğrenildi', date: 'Dün', xp: 5 },
    { id: 3, type: 'quiz', title: 'Gramer Quiz Tamamlandı', date: '2 gün önce', xp: 15 },
  ];

  // Örnek öneri verileri
  const suggestions = [
    { 
      id: 1, 
      title: 'Günlük Kelime Pratiği', 
      description: '5 dakikada 10 yeni kelime',
      icon: 'text-fields',
      color: '#2196F3',
      action: () => router.push('/(tabs)/lessons?section=vocabulary')
    },
    { 
      id: 2, 
      title: 'Gramer Testi', 
      description: 'İngilizce zamanları pekiştirin',
      icon: 'school',
      color: '#9C27B0',
      action: () => router.push('/(tabs)/lessons?section=grammar')
    },
    { 
      id: 3, 
      title: 'Konuşma Pratiği', 
      description: 'Cafe diyaloğunu tamamlayın',
      icon: 'record-voice-over',
      color: '#FF9800',
      action: () => router.push('/(tabs)/explore?section=speaking')
    },
  ];

  // Günlük hedef süresini rastgele ilerletme (gerçek uygulamada kullanıcı aktivitelerine göre değişecek)
  useEffect(() => {
    const timer = setInterval(() => {
      setDailyProgress(prev => {
        if (prev < dailyGoal) {
          return prev + 1;
        }
        return prev;
      });
    }, 10000); // Her 10 saniyede bir ilerlet (demo amaçlı)

    return () => clearInterval(timer);
  }, []);

  const handleActivityPress = (activityId: number) => {
    console.log(`Aktivite seçildi: ${activityId}`);
    router.push('/(tabs)/lessons');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Merhaba, {userProfile?.fullName || 'Dil Öğrenen'}</ThemedText>
          <ThemedText>Bugün dil öğrenmeye devam edelim!</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.dailyGoalCard, { backgroundColor: cardBackgroundColor }]}>
          <ThemedView style={[styles.dailyGoalHeader, { backgroundColor: cardBackgroundColor }]}>
            <ThemedText type="subtitle">Günlük Hedef</ThemedText>
            <ThemedView style={styles.streakContainer}>
              <MaterialIcons name="local-fire-department" size={20} color="#FF9800" />
              <ThemedText style={styles.streakText}>{streak} gün</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={[styles.progressContainer, { backgroundColor: cardBackgroundColor }]}>
            <ThemedView style={styles.progressBarContainer}>
              <ThemedView 
                style={[styles.progressBar, { width: `${dailyProgressPercentage}%` }]} 
              />
            </ThemedView>
            <ThemedText style={styles.progressText}>
              {dailyProgress} / {dailyGoal} dakika
            </ThemedText>
          </ThemedView>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/(tabs)/lessons')}
          >
            <ThemedText style={styles.continueButtonText}>
              {dailyProgress >= dailyGoal ? 'Ekstra Pratik' : 'Devam Et'}
            </ThemedText>
            <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Önerilen Aktiviteler</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
            {suggestions.map(suggestion => (
              <TouchableOpacity 
                key={suggestion.id} 
                style={[styles.suggestionCard, { backgroundColor: cardBackgroundColor }]}
                onPress={suggestion.action}
              >
                <ThemedView 
                  style={[styles.suggestionIconContainer, { backgroundColor: `${suggestion.color}20` }]}
                >
                  <MaterialIcons name={suggestion.icon} size={24} color={suggestion.color} />
                </ThemedView>
                <ThemedText type="defaultSemiBold" style={styles.suggestionTitle}>
                  {suggestion.title}
                </ThemedText>
                <ThemedText style={styles.suggestionDescription}>
                  {suggestion.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Yakın Zamanda</ThemedText>
          {recentActivities.map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              style={[styles.activityCard, { backgroundColor: cardBackgroundColor }]}
              onPress={() => handleActivityPress(activity.id)}
            >
              <ThemedView style={[styles.activityIconContainer, { backgroundColor: secondaryBackgroundColor }]}>
                {activity.type === 'lesson' && (
                  <MaterialIcons name="menu-book" size={24} color="#4CAF50" />
                )}
                {activity.type === 'word' && (
                  <MaterialIcons name="text-fields" size={24} color="#2196F3" />
                )}
                {activity.type === 'quiz' && (
                  <MaterialIcons name="school" size={24} color="#9C27B0" />
                )}
              </ThemedView>
              <ThemedView style={styles.activityContent}>
                <ThemedText type="defaultSemiBold">{activity.title}</ThemedText>
                <ThemedText style={styles.activityDate}>{activity.date}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.activityXP}>
                <ThemedText style={styles.activityXPText}>+{activity.xp} XP</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Dil Öğrenme İpucu</ThemedText>
          <ThemedView style={[styles.tipCard, { backgroundColor: cardBackgroundColor }]}>
            <ThemedView style={styles.tipHeader}>
              <MaterialIcons name="lightbulb" size={24} color="#FFC107" />
              <ThemedText type="defaultSemiBold" style={styles.tipTitle}>
                Düzenli Tekrar
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.tipContent}>
              Dil öğrenmede düzenli tekrar yapmak, öğrenilen bilgilerin kalıcı hafızaya yerleşmesini sağlar. 
              Her gün kısa süreli pratikler yapmaya çalışın.
            </ThemedText>
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
  },
  dailyGoalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dailyGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  streakText: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#757575',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 24,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  section: {
    marginBottom: 24,
  },
  suggestionsContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  suggestionCard: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionTitle: {
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 12,
    color: '#757575',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDate: {
    fontSize: 12,
    color: '#757575',
  },
  activityXP: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activityXPText: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    marginLeft: 8,
  },
  tipContent: {
    lineHeight: 20,
  },
});
