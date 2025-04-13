import { ScrollView, StyleSheet, Pressable, TouchableOpacity, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';
import { LessonCard, Lesson } from '@/components/language/LessonCard';
import { GrammarQuiz, QuizQuestion } from '@/components/language/GrammarQuiz';
import { VocabularyCard, VocabularyWord } from '@/components/language/VocabularyCard';

export default function LessonsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const [activeSection, setActiveSection] = useState<'lessons' | 'vocabulary' | 'grammar'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [bookmarkedWords, setBookmarkedWords] = useState<string[]>([]);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  // Örnek ders verileri
  const lessonData: Lesson[] = [
    {
      id: '1',
      title: 'Temel İngilizce Tanışma',
      description: 'Başlangıç seviyesi. İngilizce selamlama ve kişisel bilgiler.',
      level: 'beginner',
      duration: 15,
      progress: 0,
      xpPoints: 10,
      wordCount: 12,
      isLocked: false
    },
    {
      id: '2',
      title: 'İngilizce Yiyecek ve İçecekler',
      description: 'Restoranda sipariş verme ve yemek tercihleri hakkında konuşma.',
      level: 'beginner',
      duration: 20,
      progress: 0,
      xpPoints: 15,
      wordCount: 18,
      isLocked: false
    },
    {
      id: '3',
      title: 'İngilizce Yön Tarifi',
      description: 'Yol sorma, tarif etme ve konum bulma ifadeleri.',
      level: 'intermediate',
      duration: 25,
      progress: 0,
      xpPoints: 20,
      wordCount: 24,
      isLocked: true
    },
  ];

  // Örnek kelime verileri
  const vocabularyData: VocabularyWord[] = [
    {
      id: 'word1',
      word: 'Hello',
      translation: 'Merhaba',
      pronunciation: '/həˈloʊ/',
      example: 'Hello, how are you today?',
      exampleTranslation: 'Merhaba, bugün nasılsın?',
      tags: ['Selamlama', 'Günlük Konuşma'],
      difficulty: 'easy'
    },
    {
      id: 'word2',
      word: 'Opportunity',
      translation: 'Fırsat',
      pronunciation: '/ˌɑː.pɚˈtuː.nə.t̬i/',
      example: 'This is a great opportunity for you to learn English.',
      exampleTranslation: 'Bu, İngilizce öğrenmek için harika bir fırsat.',
      tags: ['İş', 'Eğitim'],
      difficulty: 'medium'
    },
    {
      id: 'word3',
      word: 'Sophisticated',
      translation: 'Sofistike, Karmaşık',
      pronunciation: '/səˈfɪs.tɪ.keɪ.t̬ɪd/',
      example: 'She has a sophisticated taste in art.',
      exampleTranslation: 'Sanatta sofistike bir zevki var.',
      tags: ['Kültür', 'Görünüm'],
      difficulty: 'hard'
    }
  ];

  // Örnek gramer soruları
  const grammarQuizData: QuizQuestion[] = [
    {
      id: 'q1',
      question: '"She ____ to the store yesterday." cümlesindeki boşluğa aşağıdakilerden hangisi gelmelidir?',
      options: [
        { id: 'a', text: 'go', isCorrect: false },
        { id: 'b', text: 'goes', isCorrect: false },
        { id: 'c', text: 'went', isCorrect: true },
        { id: 'd', text: 'going', isCorrect: false }
      ],
      explanation: 'Geçmiş zamanda (past simple) düzenli fiillerin sonuna "-ed" eklenir ya da düzensiz fiillerin geçmiş formu kullanılır. "Go" fiilinin geçmiş formu "went" olur.'
    },
    {
      id: 'q2',
      question: '"I have ____ studying English for two years." cümlesindeki boşluğa ne gelmelidir?',
      options: [
        { id: 'a', text: 'been', isCorrect: true },
        { id: 'b', text: 'be', isCorrect: false },
        { id: 'c', text: 'being', isCorrect: false },
        { id: 'd', text: 'is', isCorrect: false }
      ],
      explanation: 'Present Perfect Continuous zamanını oluşturmak için "have/has been + -ing" yapısı kullanılır. Doğru yanıt "been" olmalıdır.'
    }
  ];

  const handleLessonPress = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setSelectedLesson(lesson);
  };

  const handleNextQuiz = () => {
    if (selectedQuizIndex < grammarQuizData.length - 1) {
      setSelectedQuizIndex(selectedQuizIndex + 1);
    } else {
      setSelectedQuizIndex(0);
    }
  };

  const handleQuizAnswer = (questionId: string, answerId: string, isCorrect: boolean) => {
    console.log(`Question ${questionId}, Answer ${answerId}, Correct: ${isCorrect}`);
    // Burada quiz sonuçlarını kaydedebilirsiniz
  };

  const handleMarkLearned = (wordId: string) => {
    if (learnedWords.includes(wordId)) {
      setLearnedWords(learnedWords.filter(id => id !== wordId));
    } else {
      setLearnedWords([...learnedWords, wordId]);
    }
  };

  const handleBookmark = (wordId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      setBookmarkedWords([...bookmarkedWords, wordId]);
    } else {
      setBookmarkedWords(bookmarkedWords.filter(id => id !== wordId));
    }
  };

  const handleNextWord = () => {
    if (selectedWordIndex < vocabularyData.length - 1) {
      setSelectedWordIndex(selectedWordIndex + 1);
    } else {
      setSelectedWordIndex(0);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'lessons' && styles.activeTab]}
            onPress={() => setActiveSection('lessons')}
          >
            <MaterialIcons 
              name="menu-book" 
              size={24} 
              color={activeSection === 'lessons' ? '#4CAF50' : iconColor} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                activeSection === 'lessons' && styles.activeTabText
              ]}
            >
              Dersler
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'vocabulary' && styles.activeTab]}
            onPress={() => setActiveSection('vocabulary')}
          >
            <MaterialIcons 
              name="text-fields" 
              size={24} 
              color={activeSection === 'vocabulary' ? '#2196F3' : iconColor} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                activeSection === 'vocabulary' && styles.activeTabText
              ]}
            >
              Kelimeler
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'grammar' && styles.activeTab]}
            onPress={() => setActiveSection('grammar')}
          >
            <MaterialIcons 
              name="school" 
              size={24} 
              color={activeSection === 'grammar' ? '#9C27B0' : iconColor} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                activeSection === 'grammar' && styles.activeTabText
              ]}
            >
              Gramer
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {activeSection === 'lessons' && (
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle">Dersler</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              İngilizce öğrenmek için interaktif dersler ve alıştırmalar
            </ThemedText>
            
            <ThemedView style={styles.lessonList}>
              {lessonData.map(lesson => (
                <LessonCard 
                  key={lesson.id}
                  lesson={lesson}
                  onPress={handleLessonPress}
                />
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {activeSection === 'vocabulary' && (
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle">Kelime Pratiği</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              Günlük hayatta sık kullanılan İngilizce kelimeler ve ifadeler
            </ThemedText>
            
            <VocabularyCard 
              word={vocabularyData[selectedWordIndex]}
              onMarkLearned={handleMarkLearned}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedWords.includes(vocabularyData[selectedWordIndex].id)}
            />
            
            <TouchableOpacity 
              style={styles.nextWordButton}
              onPress={handleNextWord}
            >
              <ThemedText style={styles.nextWordButtonText}>Sonraki Kelime</ThemedText>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </ThemedView>
        )}

        {activeSection === 'grammar' && (
          <ThemedView style={styles.sectionContainer}>
            <ThemedText type="subtitle">Gramer Testleri</ThemedText>
            <ThemedText style={styles.sectionDescription}>
              İngilizce gramer bilginizi test edin ve geliştirin
            </ThemedText>
            
            <GrammarQuiz 
              question={grammarQuizData[selectedQuizIndex]}
              onAnswer={handleQuizAnswer}
              onNext={handleNextQuiz}
            />
          </ThemedView>
        )}
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
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionDescription: {
    color: '#757575',
    marginBottom: 16,
  },
  lessonList: {
    marginTop: 8,
  },
  nextWordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  nextWordButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 