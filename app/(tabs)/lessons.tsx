import { ScrollView, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';

export default function LessonsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  const languages = [
    { id: 1, name: 'İspanyolca', progress: 45, lessons: 24, icon: 'spa' },
    { id: 2, name: 'Fransızca', progress: 20, lessons: 18, icon: 'local-cafe' },
    { id: 3, name: 'Almanca', progress: 10, lessons: 15, icon: 'engineering' },
    { id: 4, name: 'İtalyanca', progress: 5, lessons: 12, icon: 'local-pizza' },
  ];

  const categories = [
    { id: 1, name: 'Başlangıç', color: '#4CAF50', icon: 'star-outline' },
    { id: 2, name: 'Orta Seviye', color: '#2196F3', icon: 'star-half' },
    { id: 3, name: 'İleri Seviye', color: '#9C27B0', icon: 'star' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Dilleriniz</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageList}>
            {languages.map(language => (
              <Pressable key={language.id}>
                <ThemedView style={styles.languageCard}>
                  <MaterialIcons name={language.icon} size={32} color={iconColor} style={styles.languageIcon} />
                  <ThemedText type="defaultSemiBold">{language.name}</ThemedText>
                  <ThemedText>{language.lessons} ders</ThemedText>
                  <ThemedView style={styles.progressContainer}>
                    <ThemedView style={styles.progressBar}>
                      <ThemedView 
                        style={[styles.progress, { width: `${language.progress}%` }]} 
                      />
                    </ThemedView>
                    <ThemedText>%{language.progress}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Kategoriler</ThemedText>
          {categories.map(category => (
            <Pressable key={category.id}>
              <ThemedView 
                style={[styles.categoryCard, { borderLeftColor: category.color }]}
              >
                <ThemedView style={styles.categoryHeader}>
                  <ThemedText type="defaultSemiBold">{category.name}</ThemedText>
                  <MaterialIcons name={category.icon} size={24} color={category.color} />
                </ThemedView>
                <ThemedText>Dersleri görmek için dokunun</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Öne Çıkan Kurs</ThemedText>
          <Pressable>
            <ThemedView style={styles.featuredCard}>
              <MaterialIcons name="flight" size={32} color="#FF9800" style={styles.featuredIcon} />
              <ThemedView style={styles.featuredContent}>
                <ThemedText type="defaultSemiBold">Gezginler için İspanyolca</ThemedText>
                <ThemedText>Bir sonraki seyahatiniz için temel ifadeleri öğrenin</ThemedText>
                <ThemedText>12 ders - 3 saat</ThemedText>
              </ThemedView>
            </ThemedView>
          </Pressable>
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