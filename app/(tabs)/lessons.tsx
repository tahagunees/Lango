import { ScrollView, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function LessonsScreen() {
  const languages = [
    { id: 1, name: 'Spanish', progress: 45, lessons: 24, icon: 'spa' },
    { id: 2, name: 'French', progress: 20, lessons: 18, icon: 'local-cafe' },
    { id: 3, name: 'German', progress: 10, lessons: 15, icon: 'engineering' },
    { id: 4, name: 'Italian', progress: 5, lessons: 12, icon: 'local-pizza' },
  ];

  const categories = [
    { id: 1, name: 'Beginner', color: '#4CAF50', icon: 'star-outline' },
    { id: 2, name: 'Intermediate', color: '#2196F3', icon: 'star-half' },
    { id: 3, name: 'Advanced', color: '#9C27B0', icon: 'star' },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Lessons' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Your Languages</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageList}>
            {languages.map(language => (
              <Pressable key={language.id}>
                <ThemedView style={styles.languageCard}>
                  <MaterialIcons name={language.icon} size={32} color="#2196F3" style={styles.languageIcon} />
                  <ThemedText type="defaultSemiBold">{language.name}</ThemedText>
                  <ThemedText>{language.lessons} lessons</ThemedText>
                  <ThemedView style={styles.progressContainer}>
                    <ThemedView style={styles.progressBar}>
                      <ThemedView 
                        style={[styles.progress, { width: `${language.progress}%` }]} 
                      />
                    </ThemedView>
                    <ThemedText>{language.progress}%</ThemedText>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Categories</ThemedText>
          {categories.map(category => (
            <Pressable key={category.id}>
              <ThemedView 
                style={[styles.categoryCard, { borderLeftColor: category.color }]}
              >
                <ThemedView style={styles.categoryHeader}>
                  <ThemedText type="defaultSemiBold">{category.name}</ThemedText>
                  <MaterialIcons name={category.icon} size={24} color={category.color} />
                </ThemedView>
                <ThemedText>Tap to view lessons</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Featured Course</ThemedText>
          <Pressable>
            <ThemedView style={styles.featuredCard}>
              <MaterialIcons name="flight" size={32} color="#FF9800" style={styles.featuredIcon} />
              <ThemedView style={styles.featuredContent}>
                <ThemedText type="defaultSemiBold">Spanish for Travelers</ThemedText>
                <ThemedText>Learn essential phrases for your next trip</ThemedText>
                <ThemedText>12 lessons - 3 hours</ThemedText>
              </ThemedView>
            </ThemedView>
          </Pressable>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  languageList: {
    marginTop: 12,
    marginBottom: 8,
  },
  languageCard: {
    width: 160,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginRight: 12,
  },
  languageIcon: {
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  categoryCard: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  featuredCard: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredIcon: {
    marginRight: 16,
  },
  featuredContent: {
    flex: 1,
  },
}); 