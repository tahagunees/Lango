import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ExploreScreen() {
  const popularLanguages = [
    { id: 1, name: 'Spanish', learners: '289M', flag: '🇪🇸' },
    { id: 2, name: 'French', learners: '132M', flag: '🇫🇷' },
    { id: 3, name: 'Japanese', learners: '123M', flag: '🇯🇵' },
    { id: 4, name: 'German', learners: '98M', flag: '🇩🇪' },
    { id: 5, name: 'Chinese', learners: '221M', flag: '🇨🇳' },
    { id: 6, name: 'Korean', learners: '87M', flag: '🇰🇷' },
  ];

  const communities = [
    { id: 1, name: 'Language Exchange', members: '12.5K', icon: 'group' },
    { id: 2, name: 'Study Buddies', members: '8.2K', icon: 'school' },
    { id: 3, name: 'Cultural Hub', members: '5.7K', icon: 'public' },
    { id: 4, name: 'Grammar Geeks', members: '3.9K', icon: 'auto-stories' },
  ];

  const resources = [
    { 
      id: 1, 
      title: 'Best Podcasts for Learners', 
      description: 'Improve your listening skills with these recommended podcasts',
      icon: 'headset'
    },
    { 
      id: 2, 
      title: 'Top Language Learning Movies', 
      description: 'Entertainment and learning combined',
      icon: 'movie'
    },
    { 
      id: 3, 
      title: 'Language Learning Tips', 
      description: 'Expert advice to accelerate your progress',
      icon: 'lightbulb'
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Explore' }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Discover Languages</ThemedText>
          <ThemedText>Find your next language adventure</ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#757575" />
          <ThemedText style={styles.searchPlaceholder}>Search languages, communities...</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="translate" size={24} color="#2196F3" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Popular Languages</ThemedText>
          </ThemedView>
          <ThemedView style={styles.languageGrid}>
            {popularLanguages.map(language => (
              <Pressable key={language.id} style={styles.languageItem}>
                <ThemedView style={styles.languageCard}>
                  <ThemedText style={styles.flag}>{language.flag}</ThemedText>
                  <ThemedText type="defaultSemiBold">{language.name}</ThemedText>
                  <ThemedText style={styles.learners}>{language.learners} learners</ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="people" size={24} color="#9C27B0" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Communities</ThemedText>
          </ThemedView>
          {communities.map(community => (
            <Pressable key={community.id}>
              <ThemedView style={styles.communityCard}>
                <MaterialIcons name={community.icon} size={36} color="#9C27B0" style={styles.communityIcon} />
                <ThemedView style={styles.communityInfo}>
                  <ThemedText type="defaultSemiBold">{community.name}</ThemedText>
                  <ThemedText>{community.members} members</ThemedText>
                </ThemedView>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#757575" />
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="library-books" size={24} color="#FF9800" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Learning Resources</ThemedText>
          </ThemedView>
          {resources.map(resource => (
            <Pressable key={resource.id}>
              <ThemedView style={styles.resourceCard}>
                <ThemedView style={styles.resourceIconContainer}>
                  <MaterialIcons name={resource.icon} size={24} color="#FF9800" />
                </ThemedView>
                <ThemedView style={styles.resourceInfo}>
                  <ThemedText type="defaultSemiBold">{resource.title}</ThemedText>
                  <ThemedText>{resource.description}</ThemedText>
                </ThemedView>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="event" size={24} color="#4CAF50" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Events</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featuredEventCard}>
            <ThemedView style={styles.eventBanner}>
              <MaterialIcons name="celebration" size={40} color="white" />
              <ThemedText style={styles.eventBannerText}>Language Festival</ThemedText>
            </ThemedView>
            <ThemedView style={styles.eventContent}>
              <ThemedText type="defaultSemiBold">Virtual Language Exchange Festival</ThemedText>
              <ThemedText>Join speakers from around the world in our monthly language exchange event</ThemedText>
              <ThemedText style={styles.eventDate}>April 15, 2023 • 3:00 PM</ThemedText>
            </ThemedView>
          </ThemedView>
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
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#757575',
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
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageItem: {
    width: '30%',
    marginBottom: 12,
  },
  languageCard: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  flag: {
    fontSize: 28,
    marginBottom: 4,
  },
  learners: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  communityIcon: {
    marginRight: 16,
  },
  communityInfo: {
    flex: 1,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  resourceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceInfo: {
    flex: 1,
  },
  featuredEventCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  eventBanner: {
    backgroundColor: '#4CAF50',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBannerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
  eventContent: {
    padding: 16,
  },
  eventDate: {
    marginTop: 8,
    color: '#757575',
  },
});
