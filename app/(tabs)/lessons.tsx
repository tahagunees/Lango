import { ScrollView, StyleSheet, Pressable, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect, useCallback } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';
import { LessonCard, Lesson } from '@/components/language/LessonCard';
import { GrammarQuiz, QuizQuestion } from '@/components/language/GrammarQuiz';
import { VocabularyCard, VocabularyWord } from '@/components/language/VocabularyCard';
import Constants from 'expo-constants';

// VocabularyWord tipini burada tanımlayalım (component içindeki ile aynı olmalı)
type Difficulty = 'easy' | 'medium' | 'hard';
type WordData = {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  tags: string[];
  difficulty: Difficulty;
};

// Kategori seçenekleri
const VOCABULARY_CATEGORIES = [
  { id: 'daily', name: 'Günlük Yaşam', icon: 'today' },
  { id: 'business', name: 'İş Dünyası', icon: 'business' },
  { id: 'travel', name: 'Seyahat', icon: 'flight' },
  { id: 'food', name: 'Yemek', icon: 'restaurant' },
  { id: 'technology', name: 'Teknoloji', icon: 'computer' },
  { id: 'health', name: 'Sağlık', icon: 'healing' },
];

// Gemini API için bilgiler
// .env dosyasından API anahtarını al ya da doğrudan ekle
const GEMINI_API_KEY = "AIzaSyBEiYOhkNeU6aQbZz0VGFb06dB4k-vgPiw"; // İşlemleri hızlandırmak için doğrudan ekledik
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

// Kategori bazlı örnek veri
const MOCK_VOCABULARY_DATA: Record<string, WordData[]> = {
  daily: [
    {
      id: 'word1',
      word: 'Breakfast',
      translation: 'Kahvaltı',
      pronunciation: '/ˈbrek.fəst/',
      example: 'I usually have breakfast at 8 AM.',
      exampleTranslation: 'Genellikle sabah 8\'de kahvaltı yaparım.',
      tags: ['Günlük Yaşam', 'Yemek'],
      difficulty: 'easy'
    },
    {
      id: 'word2',
      word: 'Appointment',
      translation: 'Randevu',
      pronunciation: '/əˈpɔɪnt.mənt/',
      example: 'I have a doctor\'s appointment tomorrow morning.',
      exampleTranslation: 'Yarın sabah doktor randevum var.',
      tags: ['Günlük Yaşam', 'Sağlık'],
      difficulty: 'medium'
    },
    {
      id: 'word3',
      word: 'Commute',
      translation: 'İşe gidiş-geliş',
      pronunciation: '/kəˈmjuːt/',
      example: 'My daily commute takes about one hour.',
      exampleTranslation: 'Günlük işe gidiş-gelişim yaklaşık bir saat sürüyor.',
      tags: ['Günlük Yaşam', 'İş'],
      difficulty: 'medium'
    }
  ],
  business: [
    {
      id: 'word1',
      word: 'Deadline',
      translation: 'Son Teslim Tarihi',
      pronunciation: '/ˈded.laɪn/',
      example: 'We need to meet the deadline for this project.',
      exampleTranslation: 'Bu proje için son teslim tarihine uymamız gerekiyor.',
      tags: ['İş Dünyası', 'Zaman Yönetimi'],
      difficulty: 'easy'
    },
    {
      id: 'word2',
      word: 'Negotiation',
      translation: 'Müzakere',
      pronunciation: '/nɪˌɡoʊ.ʃiˈeɪ.ʃən/',
      example: 'The contract negotiation lasted for three hours.',
      exampleTranslation: 'Sözleşme müzakeresi üç saat sürdü.',
      tags: ['İş Dünyası', 'İletişim'],
      difficulty: 'hard'
    }
  ],
  travel: [
    {
      id: 'word1',
      word: 'Passport',
      translation: 'Pasaport',
      pronunciation: '/ˈpæs.pɔːrt/',
      example: 'Don\'t forget to bring your passport for international travel.',
      exampleTranslation: 'Uluslararası seyahat için pasaportunuzu getirmeyi unutmayın.',
      tags: ['Seyahat', 'Belgeler'],
      difficulty: 'easy'
    },
    {
      id: 'word2',
      word: 'Itinerary',
      translation: 'Seyahat Planı',
      pronunciation: '/aɪˈtɪn.ə.rer.i/',
      example: 'The travel agent prepared a detailed itinerary for our trip.',
      exampleTranslation: 'Seyahat acentesi, gezimiz için ayrıntılı bir seyahat planı hazırladı.',
      tags: ['Seyahat', 'Planlama'],
      difficulty: 'hard'
    }
  ],
  food: [
    {
      id: 'word1', 
      word: 'Cuisine',
      translation: 'Mutfak',
      pronunciation: '/kwɪˈziːn/',
      example: 'Italian cuisine is famous for its pasta dishes.',
      exampleTranslation: 'İtalyan mutfağı makarna yemekleriyle ünlüdür.',
      tags: ['Yemek', 'Kültür'],
      difficulty: 'medium'
    },
    {
      id: 'word2',
      word: 'Ingredient',
      translation: 'Malzeme',
      pronunciation: '/ɪnˈɡriː.di.ənt/',
      example: 'The recipe requires five main ingredients.',
      exampleTranslation: 'Tarif beş ana malzeme gerektiriyor.',
      tags: ['Yemek', 'Pişirme'],
      difficulty: 'medium'
    }
  ],
  technology: [
    {
      id: 'word1',
      word: 'Software',
      translation: 'Yazılım',
      pronunciation: '/ˈsɔːft.wer/',
      example: 'The company develops software for mobile devices.',
      exampleTranslation: 'Şirket, mobil cihazlar için yazılım geliştiriyor.',
      tags: ['Teknoloji', 'Bilgisayar'],
      difficulty: 'easy'
    },
    {
      id: 'word2',
      word: 'Artificial Intelligence',
      translation: 'Yapay Zeka',
      pronunciation: '/ˌɑːr.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns/',
      example: 'Artificial intelligence is transforming many industries.',
      exampleTranslation: 'Yapay zeka birçok sektörü dönüştürüyor.',
      tags: ['Teknoloji', 'Bilim'],
      difficulty: 'hard'
    }
  ],
  health: [
    {
      id: 'word1',
      word: 'Exercise',
      translation: 'Egzersiz',
      pronunciation: '/ˈek.sər.saɪz/',
      example: 'Regular exercise is important for maintaining good health.',
      exampleTranslation: 'Düzenli egzersiz, iyi sağlığı korumak için önemlidir.',
      tags: ['Sağlık', 'Fitness'],
      difficulty: 'easy'
    },
    {
      id: 'word2',
      word: 'Nutrition',
      translation: 'Beslenme',
      pronunciation: '/nuːˈtrɪʃ.ən/',
      example: 'Proper nutrition is essential for growth and development.',
      exampleTranslation: 'Uygun beslenme, büyüme ve gelişme için gereklidir.',
      tags: ['Sağlık', 'Yemek'],
      difficulty: 'medium'
    }
  ]
};

export default function LessonsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const [activeSection, setActiveSection] = useState<'lessons' | 'vocabulary' | 'grammar'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0);
  const [bookmarkedWords, setBookmarkedWords] = useState<string[]>([]);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);
  const [vocabularyData, setVocabularyData] = useState<VocabularyWord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('daily');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Gemini API'den kelimeler almak için fonksiyon
  const fetchWordsFromGemini = useCallback(async (category: string) => {
    setIsLoading(true);
    try {
      // API entegrasyonu
      
      // Kategori adını al
      const categoryName = VOCABULARY_CATEGORIES.find(c => c.id === category)?.name || 'Günlük Yaşam';
      console.log('API isteği kategori:', categoryName);
      
      try {
        // Gemini API'ye gönderilecek istek
        const prompt = `
          Generate 5 English words with their Turkish translations related to "${categoryName}" category.
          Format the response as a valid JSON array with each item having these properties:
          id (string like "word1"), word (English), translation (Turkish), pronunciation (pronunciation in IPA format),
          example (an example sentence in English), exampleTranslation (translation of the example in Turkish),
          tags (array of strings - relevant categories), difficulty (one of: "easy", "medium", "hard").
          Use proper Turkish translations and make the examples useful for language learning.
        `;
        
        // API isteği
        console.log('API endpoint:', GEMINI_API_ENDPOINT);
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
            },
          }),
        });
        
        const data = await response.json();
        console.log('API yanıtı:', JSON.stringify(data).substring(0, 200) + '...');
        
        // API yanıtından kelime verilerini çıkar
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const content = data.candidates[0].content.parts[0].text;
          console.log('API içerik:', content.substring(0, 200) + '...');
          
          // JSON yanıtını çıkar
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const wordsArray = JSON.parse(jsonMatch[0]);
            console.log('Çıkarılan kelimeler:', JSON.stringify(wordsArray).substring(0, 200) + '...');
            setVocabularyData(wordsArray);
            setSelectedWordIndex(0);
            return; // Başarılı durumda geri dön
          }
        }
        
        // Buraya ulaşıldıysa yanıtta sorun var demektir
        throw new Error('API geçerli yanıt döndürmedi');
        
      } catch (apiError) {
        console.error('API hatası:', apiError);
        // API hatası durumunda sessizce mock verilere geç - kullanıcıya hata gösterme
        throw apiError; // Üst catch bloğuna ilet
      }
      
    } catch (error) {
      console.log('Mock verilere geçiliyor');
      // Hata durumunda örnek kelimelerle devam et, kullanıcıya hata gösterme
      const mockData = MOCK_VOCABULARY_DATA[selectedCategory as keyof typeof MOCK_VOCABULARY_DATA] || MOCK_VOCABULARY_DATA.daily;
      setVocabularyData(mockData);
      setSelectedWordIndex(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // Kategori değiştiğinde yeni kelimeler al
  useEffect(() => {
    fetchWordsFromGemini(selectedCategory);
  }, [selectedCategory, fetchWordsFromGemini]);

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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              {VOCABULARY_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.selectedCategoryButton
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <MaterialIcons 
                    name={category.icon} 
                    size={18} 
                    color={selectedCategory === category.id ? '#FFFFFF' : '#2196F3'} 
                  />
                  <ThemedText 
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.selectedCategoryText
                    ]}
                  >
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {isLoading ? (
              <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <ThemedText style={styles.loadingText}>
                  Gemini AI kelimeler oluşturuluyor...
                </ThemedText>
              </ThemedView>
            ) : vocabularyData.length > 0 ? (
              <>
                <VocabularyCard 
                  word={vocabularyData[selectedWordIndex]}
                  onMarkLearned={handleMarkLearned}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarkedWords.includes(vocabularyData[selectedWordIndex].id)}
                />
                
                <ThemedView style={styles.wordIndicator}>
                  {vocabularyData.map((_, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.indicator,
                        index === selectedWordIndex && styles.activeIndicator
                      ]}
                    />
                  ))}
                </ThemedView>
                
                <TouchableOpacity 
                  style={styles.nextWordButton}
                  onPress={handleNextWord}
                >
                  <ThemedText style={styles.nextWordButtonText}>Sonraki Kelime</ThemedText>
                  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              <ThemedView style={styles.noWordsContainer}>
                <MaterialIcons name="error-outline" size={48} color="#757575" />
                <ThemedText style={styles.noWordsText}>
                  Kelimeler yüklenemedi. Lütfen tekrar deneyin.
                </ThemedText>
              </ThemedView>
            )}
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
  categoriesContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    marginLeft: 6,
    color: '#2196F3',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
  },
  noWordsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
  },
  noWordsText: {
    marginTop: 16,
    color: '#757575',
    textAlign: 'center',
  },
  wordIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#2196F3',
    width: 12,
    height: 12,
    borderRadius: 6,
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