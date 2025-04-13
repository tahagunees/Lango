import { StyleSheet, ScrollView, TouchableOpacity, Pressable, Image, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';
import { ProgressTracker, LanguageProgress } from '@/components/language/ProgressTracker';
import { SpeakingPractice, Conversation } from '@/components/language/SpeakingPractice';

export default function ExploreScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const [activeSection, setActiveSection] = useState<'languages' | 'progress' | 'speaking'>('languages');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('İngilizce');

  // Örnek dil verileri
  const popularLanguages = [
    { id: 1, name: 'İngilizce', learners: '289M', flag: '🇬🇧' },
    { id: 2, name: 'İspanyolca', learners: '120M', flag: '🇪🇸' },
    { id: 3, name: 'Fransızca', learners: '132M', flag: '🇫🇷' },
    { id: 4, name: 'Almanca', learners: '98M', flag: '🇩🇪' },
    { id: 5, name: 'İtalyanca', learners: '85M', flag: '🇮🇹' },
    { id: 6, name: 'Japonca', learners: '123M', flag: '🇯🇵' },
    { id: 7, name: 'Çince', learners: '221M', flag: '🇨🇳' },
    { id: 8, name: 'Rusça', learners: '94M', flag: '🇷🇺' },
  ];

  // Örnek ilerleme verileri
  const progressData: LanguageProgress = {
    language: selectedLanguage,
    level: 'A1 Başlangıç',
    currentXP: 350,
    levelXP: 500,
    streak: 7,
    wordsLearned: 124,
    grammarPoints: 42,
    lessonsCompleted: 8,
    totalLessons: 25,
    skills: [
      { name: 'Konuşma', progress: 65 },
      { name: 'Dinleme', progress: 45 },
      { name: 'Okuma', progress: 80 },
      { name: 'Yazma', progress: 35 },
      { name: 'Kelime Bilgisi', progress: 60 },
      { name: 'Gramer', progress: 50 },
    ]
  };

  // Örnek konuşma pratiği verileri
  const conversationData: Conversation = {
    id: 'conv1',
    title: 'Cafe\'de Sipariş Verme',
    description: 'Bu diyalogda bir kafede sipariş vermeyi pratik edeceksiniz.',
    phrases: [
      {
        id: 'p1',
        text: 'Good morning! What can I get for you today?',
        translation: 'Günaydın! Bugün size ne getirebilirim?',
        isUserTurn: false
      },
      {
        id: 'p2',
        text: 'I would like a coffee, please.',
        translation: 'Bir kahve istiyorum, lütfen.',
        isUserTurn: true
      },
      {
        id: 'p3',
        text: 'Sure! Would you like it black or with milk?',
        translation: 'Tabi! Sade mi sütlü mü olsun?',
        isUserTurn: false
      },
      {
        id: 'p4',
        text: 'With milk, please. And a croissant.',
        translation: 'Sütlü olsun lütfen. Ve bir kruvasan.',
        isUserTurn: true
      },
      {
        id: 'p5',
        text: 'Great choice! That will be $5.50.',
        translation: 'Harika seçim! 5.50 dolar tuttu.',
        isUserTurn: false
      },
      {
        id: 'p6',
        text: 'Here you are. Thank you.',
        translation: 'Buyurun. Teşekkür ederim.',
        isUserTurn: true
      }
    ]
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setActiveSection('progress');
  };

  const handleConversationComplete = (convId: string, score: number) => {
    console.log(`Conversation ${convId} completed with score: ${score}`);
    // Burada konuşma pratiği sonuçlarını kaydedebilirsiniz
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Dilleri Keşfedin</ThemedText>
          <ThemedText>Dil öğrenme yolculuğunuza başlayın</ThemedText>
        </ThemedView>

        <ThemedView style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'languages' && styles.activeTab]}
            onPress={() => setActiveSection('languages')}
          >
            <MaterialIcons 
              name="translate" 
              size={24} 
              color={activeSection === 'languages' ? '#2196F3' : '#757575'} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                activeSection === 'languages' && styles.activeTabText
              ]}
            >
              Diller
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'progress' && styles.activeTab]}
            onPress={() => setActiveSection('progress')}
          >
            <MaterialIcons 
              name="insights" 
              size={24} 
              color={activeSection === 'progress' ? '#4CAF50' : '#757575'} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                activeSection === 'progress' && styles.activeTabText
              ]}
            >
              İlerleme
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'speaking' && styles.activeTab]}
            onPress={() => setActiveSection('speaking')}
          >
            <MaterialIcons 
              name="record-voice-over" 
              size={24} 
              color={activeSection === 'speaking' ? '#FF9800' : '#757575'} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                activeSection === 'speaking' && styles.activeTabText
              ]}
            >
              Konuşma
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {activeSection === 'languages' && (
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle">Öğrenebileceğiniz Diller</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              İlginizi çeken bir dil seçerek öğrenmeye başlayın
            </ThemedText>

            <ThemedView style={styles.languageGrid}>
              {popularLanguages.map(language => (
                <TouchableOpacity 
                  key={language.id} 
                  style={styles.languageCard}
                  onPress={() => handleLanguageSelect(language.name)}
                >
                  <ThemedText style={styles.languageFlag}>{language.flag}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.languageName}>
                    {language.name}
                  </ThemedText>
                  <ThemedText style={styles.languageLearners}>
                    {language.learners} öğrenci
                  </ThemedText>

                  <ThemedView style={styles.languageStartButton}>
                    <ThemedText style={styles.languageStartText}>
                      {selectedLanguage === language.name ? 'Devam Et' : 'Başla'}
                    </ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {activeSection === 'progress' && (
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle">Dil İlerlemeniz</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Öğrenme yolculuğunuzu takip edin ve becerilerinizi görün
            </ThemedText>

            <ProgressTracker progress={progressData} />
          </ThemedView>
        )}

        {activeSection === 'speaking' && (
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle">Konuşma Pratiği</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Gerçek dünya senaryolarında {selectedLanguage} konuşma pratiği yapın
            </ThemedText>

            <SpeakingPractice 
              conversation={conversationData}
              onComplete={handleConversationComplete}
            />
          </ThemedView>
        )}

        <ThemedView style={styles.featuredSection}>
          <ThemedText type="subtitle">Dil Öğrenme İpuçları</ThemedText>
          <ThemedView style={styles.featuredCard}>
            <MaterialIcons name="lightbulb" size={36} color="#FFC107" style={styles.featuredIcon} />
            <ThemedView style={styles.featuredContent}>
              <ThemedText type="defaultSemiBold">Günlük Pratik</ThemedText>
              <ThemedText>Dil öğrenmenin en etkili yolu, her gün düzenli olarak pratik yapmaktır. Kısa süreli ama tutarlı çalışmalar, uzun süreli düzensiz çalışmalardan daha etkilidir.</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.featuredCard}>
            <MaterialIcons name="headset" size={36} color="#9C27B0" style={styles.featuredIcon} />
            <ThemedView style={styles.featuredContent}>
              <ThemedText type="defaultSemiBold">Dinleme Becerileri</ThemedText>
              <ThemedText>Dile maruz kalmak dinleme becerilerinizi geliştirir. Filmler, diziler ve müzikler dinleyerek telaffuzunuzu ve anlama yeteneğinizi iyileştirebilirsiniz.</ThemedText>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#757575',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionDescription: {
    color: '#757575',
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageFlag: {
    fontSize: 36,
    marginBottom: 8,
  },
  languageName: {
    marginBottom: 4,
    textAlign: 'center',
  },
  languageLearners: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  languageStartButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  languageStartText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredSection: {
    marginBottom: 24,
  },
  featuredCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuredIcon: {
    marginRight: 16,
  },
  featuredContent: {
    flex: 1,
  },
});
