import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <MaterialIcons name="translate" size={48} color={iconColor} style={styles.headerIcon} />
          <ThemedText type="title">Lango'ya Hoş Geldiniz!</ThemedText>
          <ThemedText>Kişisel dil öğrenme asistanınız</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="flag" size={24} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Günlük Hedef</ThemedText>
          </ThemedView>
          <ThemedView style={styles.goalContainer}>
            <ThemedView style={styles.progressBar}>
              <ThemedView style={[styles.progress, { width: '65%' }]} />
            </ThemedView>
            <ThemedText>Bugün 13/20 dakika</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="play-circle-filled" size={24} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Öğrenmeye Devam Et</ThemedText>
          </ThemedView>
          <ThemedView style={styles.lessonCard}>
            <ThemedView style={styles.lessonCardHeader}>
              <MaterialIcons name="chat" size={24} color={iconColor} />
              <ThemedView style={styles.lessonInfo}>
                <ThemedText type="defaultSemiBold">Temel İfadeler</ThemedText>
                <ThemedText>10 Dersin 3.'sü</ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.lessonProgress}>
              <ThemedView style={[styles.lessonProgressBar, { width: '30%' }]} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="history" size={24} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Son Aktiviteler</ThemedText>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <MaterialIcons name="spellcheck" size={24} color="#607D8B" style={styles.activityIcon} />
            <ThemedView style={styles.activityInfo}>
              <ThemedText type="defaultSemiBold">Kelime Çalışması</ThemedText>
              <ThemedText>25 kelime gözden geçirildi</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <MaterialIcons name="mic" size={24} color="#9C27B0" style={styles.activityIcon} />
            <ThemedView style={styles.activityInfo}>
              <ThemedText type="defaultSemiBold">Telaffuz Egzersizi</ThemedText>
              <ThemedText>15 dakika pratik</ThemedText>
            </ThemedView>
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
  headerIcon: {
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  goalContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  lessonCard: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 8,
  },
  lessonCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  lessonInfo: {
    marginLeft: 12,
  },
  lessonProgress: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 8,
  },
  lessonProgressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  activityItem: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
});
