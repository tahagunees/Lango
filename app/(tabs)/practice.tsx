import { ScrollView, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function PracticeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const practiceActivities = [
    { id: 1, title: 'Flashcards', description: 'Review vocabulary with flashcards', icon: 'style', color: '#FF9800' },
    { id: 2, title: 'Listening', description: 'Improve your listening skills', icon: 'headset', color: '#2196F3' },
    { id: 3, title: 'Speaking', description: 'Practice pronunciation', icon: 'mic', color: '#9C27B0' },
    { id: 4, title: 'Reading', description: 'Read and comprehend texts', icon: 'menu-book', color: '#4CAF50' },
    { id: 5, title: 'Writing', description: 'Practice writing sentences', icon: 'create', color: '#F44336' },
    { id: 6, title: 'Quizzes', description: 'Test your knowledge', icon: 'quiz', color: '#607D8B' },
  ];

  const dailyChallenges = [
    { id: 1, title: 'Vocabulary Challenge', description: 'Learn 5 new words', completed: true, icon: 'spellcheck' },
    { id: 2, title: 'Listening Exercise', description: 'Complete a 5-minute audio', completed: false, icon: 'hearing' },
    { id: 3, title: 'Grammar Quiz', description: 'Practice verb conjugations', completed: false, icon: 'rule' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: true, title: 'Practice' }} />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Practice Makes Perfect!</ThemedText>
          <ThemedText>Choose an activity to improve your skills</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Practice Activities</ThemedText>
          <ThemedView style={styles.activitiesGrid}>
            {practiceActivities.map(activity => (
              <Pressable key={activity.id} style={styles.activityItem}>
                <ThemedView 
                  style={[styles.activityCard, { borderLeftColor: activity.color }]}
                >
                  <MaterialIcons name={activity.icon} size={30} color={activity.color} style={styles.activityIcon} />
                  <ThemedText type="defaultSemiBold">{activity.title}</ThemedText>
                  <ThemedText style={styles.activityDescription}>
                    {activity.description}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Daily Challenges</ThemedText>
          {dailyChallenges.map(challenge => (
            <ThemedView key={challenge.id} style={styles.challengeCard}>
              <ThemedView style={styles.challengeHeader}>
                <ThemedView style={styles.challengeTitleRow}>
                  <MaterialIcons name={challenge.icon} size={24} color={iconColor} style={styles.challengeIcon} />
                  <ThemedText type="defaultSemiBold">{challenge.title}</ThemedText>
                </ThemedView>
                <ThemedText style={[
                  styles.challengeStatus, 
                  { color: challenge.completed ? '#4CAF50' : '#757575' }
                ]}>
                  {challenge.completed ? 
                    <MaterialIcons name="check-circle" size={16} color="#4CAF50" /> : 
                    <MaterialIcons name="schedule" size={16} color="#757575" />
                  } {challenge.completed ? 'Completed' : 'Pending'}
                </ThemedText>
              </ThemedView>
              <ThemedText>{challenge.description}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Weekly Streak</ThemedText>
          <ThemedView style={styles.streakCard}>
            <MaterialIcons name="local-fire-department" size={40} color="#FF9800" style={styles.streakIcon} />
            <ThemedText type="title" style={styles.streakCount}>5</ThemedText>
            <ThemedText>days in a row!</ThemedText>
            <ThemedText>Keep practicing to maintain your streak</ThemedText>
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
  section: {
    marginBottom: 24,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  activityItem: {
    width: '48%',
    marginBottom: 16,
  },
  activityCard: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderLeftWidth: 5,
    height: 120,
    justifyContent: 'center',
  },
  activityIcon: {
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  challengeCard: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  challengeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeIcon: {
    marginRight: 8,
  },
  challengeStatus: {
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakCard: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  streakIcon: {
    marginBottom: 8,
  },
  streakCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9800',
  },
}); 