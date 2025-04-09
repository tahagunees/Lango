import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: true, title: 'Lango' }} />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <MaterialIcons name="translate" size={48} color={iconColor} style={styles.headerIcon} />
          <ThemedText type="title">Welcome to Lango!</ThemedText>
          <ThemedText>Your personal language learning assistant</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="flag" size={24} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Daily Goal</ThemedText>
          </ThemedView>
          <ThemedView style={styles.goalContainer}>
            <ThemedView style={styles.progressBar}>
              <ThemedView style={[styles.progress, { width: '65%' }]} />
            </ThemedView>
            <ThemedText>13/20 minutes today</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="play-circle-filled" size={24} color={iconColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Continue Learning</ThemedText>
          </ThemedView>
          <ThemedView style={styles.lessonCard}>
            <ThemedView style={styles.lessonCardHeader}>
              <MaterialIcons name="chat" size={24} color={iconColor} />
              <ThemedView style={styles.lessonInfo}>
                <ThemedText type="defaultSemiBold">Basic Phrases</ThemedText>
                <ThemedText>Lesson 3 of 10</ThemedText>
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
            <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <MaterialIcons name="spellcheck" size={24} color="#607D8B" style={styles.activityIcon} />
            <ThemedView style={styles.activityInfo}>
              <ThemedText type="defaultSemiBold">Vocabulary Practice</ThemedText>
              <ThemedText>25 words reviewed</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.activityItem}>
            <MaterialIcons name="mic" size={24} color="#9C27B0" style={styles.activityIcon} />
            <ThemedView style={styles.activityInfo}>
              <ThemedText type="defaultSemiBold">Pronunciation Exercise</ThemedText>
              <ThemedText>15 minutes practice</ThemedText>
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
