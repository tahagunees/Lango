import { StyleSheet, ScrollView, Pressable, Image, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';

export default function ExploreScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  const popularLanguages = [
    { id: 1, name: 'İspanyolca', learners: '289M', flag: '🇪🇸' },
    { id: 2, name: 'Fransızca', learners: '132M', flag: '🇫🇷' },
    { id: 3, name: 'Japonca', learners: '123M', flag: '🇯🇵' },
    { id: 4, name: 'Almanca', learners: '98M', flag: '🇩🇪' },
    { id: 5, name: 'Çince', learners: '221M', flag: '🇨🇳' },
    { id: 6, name: 'Korece', learners: '87M', flag: '🇰🇷' },
  ];

  const communities = [
    { id: 1, name: 'Dil Değişimi', members: '12.5K', icon: 'group' },
    { id: 2, name: 'Çalışma Arkadaşları', members: '8.2K', icon: 'school' },
    { id: 3, name: 'Kültür Merkezi', members: '5.7K', icon: 'public' },
    { id: 4, name: 'Gramer Tutkunları', members: '3.9K', icon: 'auto-stories' },
  ];

  const resources = [
    { 
      id: 1, 
      title: 'Dil Öğrenenler için Podcast\'ler', 
      description: 'Bu önerilen podcast\'lerle dinleme becerilerinizi geliştirin',
      icon: 'headset'
    },
    { 
      id: 2, 
      title: 'Dil Öğrenme Filmleri', 
      description: 'Eğlence ve öğrenme bir arada',
      icon: 'movie'
    },
    { 
      id: 3, 
      title: 'Dil Öğrenme İpuçları', 
      description: 'İlerlemenizi hızlandırmak için uzman tavsiyeleri',
      icon: 'lightbulb'
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Dilleri Keşfedin</ThemedText>
          <ThemedText>Bir sonraki dil maceranızı bulun</ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#757575" />
          <ThemedText style={styles.searchPlaceholder}>Dilleri, toplulukları ara...</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="translate" size={24} color="#2196F3" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Popüler Diller</ThemedText>
          </ThemedView>
          <ThemedView style={styles.languageGrid}>
            {popularLanguages.map(language => (
              <Pressable key={language.id} style={styles.languageItem}>
                <ThemedView style={styles.languageCard}>
                  <ThemedText style={styles.flag}>{language.flag}</ThemedText>
                  <ThemedText type="defaultSemiBold">{language.name}</ThemedText>
                  <ThemedText style={styles.learners}>{language.learners} öğrenci</ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="people" size={24} color="#9C27B0" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Topluluklar</ThemedText>
          </ThemedView>
          {communities.map(community => (
            <Pressable key={community.id}>
              <ThemedView style={styles.communityCard}>
                <MaterialIcons name={community.icon} size={36} color="#9C27B0" style={styles.communityIcon} />
                <ThemedView style={styles.communityInfo}>
                  <ThemedText type="defaultSemiBold">{community.name}</ThemedText>
                  <ThemedText>{community.members} üye</ThemedText>
                </ThemedView>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#757575" />
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="library-books" size={24} color="#FF9800" />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Öğrenme Kaynakları</ThemedText>
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
            <ThemedText type="subtitle" style={styles.sectionTitle}>Etkinlikler</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featuredEventCard}>
            <ThemedView style={styles.eventBanner}>
              <MaterialIcons name="celebration" size={40} color="white" />
              <ThemedText style={styles.eventBannerText}>Dil Festivali</ThemedText>
            </ThemedView>
            <ThemedView style={styles.eventContent}>
              <ThemedText type="defaultSemiBold">Sanal Dil Değişim Festivali</ThemedText>
              <ThemedText>Aylık dil değişim etkinliğimizde dünyanın her yerinden konuşmacılara katılın</ThemedText>
              <ThemedText style={styles.eventDate}>15 Nisan 2023 • 15:00</ThemedText>
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
