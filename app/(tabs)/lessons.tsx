import { ScrollView, StyleSheet, Pressable, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect, useCallback } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerToggleButton } from '@/components/DrawerToggleButton';
import { LessonCard, Lesson as LessonType } from '@/components/language/LessonCard';
import { GrammarQuiz, QuizQuestion } from '@/components/language/GrammarQuiz';
import { VocabularyCard, VocabularyWord as VocabularyWordType } from '@/components/language/VocabularyCard';
import Constants from 'expo-constants';
import { useTheme } from '@/context/ThemeContext';
import * as Progress from 'react-native-progress';

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
// .env dosyasından API anahtarını al
const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
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

// Update type VocabularyWord to match the type in LessonCard.tsx
export type VocabularyWord = VocabularyWordType;

// Update type Lesson to match the interface in LessonCard.tsx
export type Lesson = LessonType;

// Update type Category to match the usage
type Category = string;

export default function LessonsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
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
      isLocked: false,
      image: 'https://placehold.co/400x225/2196F3/FFFFFF/png?text=Lesson+Image'
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
      isLocked: false,
      image: 'https://placehold.co/400x225/2196F3/FFFFFF/png?text=Lesson+Image'
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
      isLocked: true,
      image: 'https://placehold.co/400x225/2196F3/FFFFFF/png?text=Lesson+Image'
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
    console.log('Ders seçildi:', lesson.title);
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

  // Dersin içeriğini göstermek için bir bileşen
  const LessonContent = ({ lesson }: { lesson: Lesson }) => {
    const [lessonStarted, setLessonStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [contentCompleted, setContentCompleted] = useState(false);
    
    // Get image source for lesson
    const getLessonImageSource = () => {
      if (lesson.image) {
        return { uri: lesson.image };
      } else if (lesson.imageUrl) {
        return { uri: lesson.imageUrl };
      }
      return require('@/assets/images/lesson-default.jpg');
    };
    
    // Örnek ders adımları - TS türleri düzeltildi
    type IntroductionStep = {
      type: 'introduction';
      title: string;
      content: string;
      icon: string;
    }
    
    type VocabularyItem = {
      english: string;
      turkish: string;
      pronunciation: string;
    }
    
    type VocabularyStep = {
      type: 'vocabulary';
      title: string;
      content: VocabularyItem[];
      icon: string;
    }
    
    type DialogueItem = {
      speaker: string;
      text: string;
      translation: string;
    }
    
    type DialogueStep = {
      type: 'dialogue';
      title: string;
      content: DialogueItem[];
      icon: string;
    }
    
    type ExerciseItem = {
      question: string;
      options: string[];
      correctAnswer: string;
    }
    
    type ExerciseStep = {
      type: 'exercise';
      title: string;
      content: ExerciseItem[];
      icon: string;
    }
    
    type CompletionStep = {
      type: 'completion';
      title: string;
      content: string;
      icon: string;
    }
    
    type LessonStep = IntroductionStep | VocabularyStep | DialogueStep | ExerciseStep | CompletionStep;
    
    const lessonSteps: LessonStep[] = [
      {
        type: 'introduction',
        title: 'Giriş',
        content: 'Bu derste temel İngilizce selamlama ve tanışma ifadelerini öğreneceksiniz.',
        icon: 'info'
      },
      {
        type: 'vocabulary',
        title: 'Kelimeler',
        content: [
          { english: 'Hello', turkish: 'Merhaba', pronunciation: '/həˈloʊ/' },
          { english: 'Hi', turkish: 'Selam', pronunciation: '/haɪ/' },
          { english: 'Good morning', turkish: 'Günaydın', pronunciation: '/ɡʊd ˈmɔːrnɪŋ/' },
          { english: 'Good afternoon', turkish: 'İyi günler', pronunciation: '/ɡʊd ˌæftərˈnuːn/' },
          { english: 'Good evening', turkish: 'İyi akşamlar', pronunciation: '/ɡʊd ˈiːvnɪŋ/' },
          { english: 'Goodbye', turkish: 'Hoşçakal', pronunciation: '/ˌɡʊdˈbaɪ/' },
        ],
        icon: 'text-fields'
      },
      {
        type: 'dialogue',
        title: 'Diyalog',
        content: [
          { speaker: 'Person A', text: 'Hello! My name is John. What is your name?', translation: 'Merhaba! Benim adım John. Senin adın ne?' },
          { speaker: 'Person B', text: 'Hi! Nice to meet you. My name is Sarah.', translation: 'Selam! Tanıştığıma memnun oldum. Benim adım Sarah.' },
          { speaker: 'Person A', text: 'How are you today?', translation: 'Bugün nasılsın?' },
          { speaker: 'Person B', text: 'I am fine, thank you. And you?', translation: 'İyiyim, teşekkür ederim. Ya sen?' },
          { speaker: 'Person A', text: 'I am good too. Where are you from?', translation: 'Ben de iyiyim. Nerelisin?' },
          { speaker: 'Person B', text: 'I am from Turkey. How about you?', translation: 'Ben Türkiye\'denim. Ya sen?' },
        ],
        icon: 'forum'
      },
      {
        type: 'exercise',
        title: 'Alıştırmalar',
        content: [
          { 
            question: 'What is the English greeting for "Merhaba"?', 
            options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
            correctAnswer: 'Hello'
          },
          { 
            question: 'How would you say "İyi günler" in English?', 
            options: ['Good morning', 'Good night', 'Good afternoon', 'Good day'],
            correctAnswer: 'Good afternoon'
          },
          { 
            question: 'Complete the dialogue: "Hi! My name is John. What is _____ name?"', 
            options: ['your', 'you', 'yours', 'my'],
            correctAnswer: 'your'
          },
        ],
        icon: 'assignment'
      },
      {
        type: 'completion',
        title: 'Ders Tamamlandı',
        content: 'Tebrikler! Bu dersi başarıyla tamamladınız. Öğrendiklerinizi pekiştirmek için alıştırmaları tekrar edebilirsiniz.',
        icon: 'check-circle'
      }
    ];
    
    // Mevcut adımı göster
    const renderCurrentStep = () => {
      const step = lessonSteps[currentStep];
      
      if (!step) return null;
      
      switch (step.type) {
        case 'introduction':
          return (
            <ThemedView style={styles.stepContainer}>
              <MaterialIcons name={step.icon} size={32} color="#4CAF50" />
              <ThemedText type="subtitle">{step.title}</ThemedText>
              <ThemedText style={styles.introText}>{step.content}</ThemedText>
            </ThemedView>
          );
          
        case 'vocabulary':
          return (
            <ThemedView style={styles.stepContainer}>
              <ThemedView style={styles.stepHeaderRow}>
                <MaterialIcons name={step.icon} size={32} color="#2196F3" />
                <ThemedText type="subtitle">{step.title}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.vocabularyList}>
                {step.content.map((word, index) => (
                  <ThemedView key={index} style={styles.vocabularyItem}>
                    <ThemedView style={styles.wordHeader}>
                      <ThemedText type="defaultSemiBold" style={styles.englishWord}>{word.english}</ThemedText>
                      <ThemedText style={styles.pronunciation}>{word.pronunciation}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.translation}>{word.turkish}</ThemedText>
                    <TouchableOpacity style={styles.speakButton}>
                      <MaterialIcons name="volume-up" size={20} color="#2196F3" />
                    </TouchableOpacity>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          );
          
        case 'dialogue':
          return (
            <ThemedView style={styles.stepContainer}>
              <ThemedView style={styles.stepHeaderRow}>
                <MaterialIcons name={step.icon} size={32} color="#9C27B0" />
                <ThemedText type="subtitle">{step.title}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.dialogueContainer}>
                {step.content.map((line, index) => (
                  <ThemedView 
                    key={index} 
                    style={[
                      styles.dialogueBubble,
                      line.speaker === 'Person A' ? styles.leftBubble : styles.rightBubble
                    ]}
                  >
                    <ThemedText type="defaultSemiBold">{line.text}</ThemedText>
                    <ThemedText style={styles.translation}>{line.translation}</ThemedText>
                    <TouchableOpacity style={styles.speakButton}>
                      <MaterialIcons name="volume-up" size={20} color={line.speaker === 'Person A' ? "#2196F3" : "#9C27B0"} />
                    </TouchableOpacity>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          );
          
        case 'exercise':
          return (
            <ThemedView style={styles.stepContainer}>
              <ThemedView style={styles.stepHeaderRow}>
                <MaterialIcons name={step.icon} size={32} color="#FF9800" />
                <ThemedText type="subtitle">{step.title}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.exercisesContainer}>
                {step.content.map((exercise, index) => (
                  <ThemedView key={index} style={styles.exerciseItem}>
                    <ThemedText type="defaultSemiBold" style={styles.exerciseQuestion}>
                      {index + 1}. {exercise.question}
                    </ThemedText>
                    <ThemedView style={styles.optionsContainer}>
                      {exercise.options.map((option, optionIndex) => (
                        <TouchableOpacity 
                          key={optionIndex} 
                          style={[
                            styles.optionButton,
                            option === exercise.correctAnswer && styles.correctOption
                          ]}
                        >
                          <ThemedText style={styles.optionText}>{option}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          );
          
        case 'completion':
          return (
            <ThemedView style={styles.stepContainer}>
              <MaterialIcons name={step.icon} size={64} color="#4CAF50" />
              <ThemedText type="title" style={styles.completionTitle}>{step.title}</ThemedText>
              <ThemedText style={styles.completionText}>{step.content}</ThemedText>
              <TouchableOpacity 
                style={styles.returnButton}
                onPress={() => {
                  setContentCompleted(true);
                  setCurrentStep(0);
                  setLessonStarted(false);
                }}
              >
                <ThemedText style={styles.returnButtonText}>Derslere Dön</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          );
          
        default:
          return null;
      }
    };
    
    // Ders başlat
    const startLesson = () => {
      setLessonStarted(true);
      setCurrentStep(0);
    };
    
    // Sonraki adıma geç
    const goToNextStep = () => {
      if (currentStep < lessonSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    };
    
    // Önceki adıma dön
    const goToPreviousStep = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };
    
    // Ders başlatılmadıysa ders bilgilerini göster, başlatıldıysa adımları göster
    return (
      <ThemedView style={styles.lessonContentContainer}>
        {!lessonStarted ? (
          // Ders Bilgileri
          <ThemedView style={styles.lessonDetails}>
            <Image 
              source={getLessonImageSource()}
              style={styles.lessonImage}
            />
            <ThemedText type="title" style={styles.lessonTitle}>{lesson.title}</ThemedText>
            <ThemedText style={styles.lessonDescription}>{lesson.description}</ThemedText>
            
            <ThemedView style={styles.lessonInfo}>
              <ThemedView style={styles.infoItem}>
                <MaterialIcons name="access-time" size={20} color="#2196F3" />
                <ThemedText style={styles.infoText}>{lesson.duration} dakika</ThemedText>
              </ThemedView>
              <ThemedView style={styles.infoItem}>
                <MaterialIcons name="school" size={20} color="#2196F3" />
                <ThemedText style={styles.infoText}>{lesson.level}</ThemedText>
              </ThemedView>
            </ThemedView>
            
            {contentCompleted ? (
              <TouchableOpacity 
                style={[styles.startButton, { backgroundColor: '#4CAF50' }]}
                onPress={startLesson}
              >
                <ThemedText style={styles.startButtonText}>Tekrar Başlat</ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startLesson}
              >
                <ThemedText style={styles.startButtonText}>Derse Başla</ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        ) : (
          // Ders Adımları
          <ThemedView style={styles.lessonStepContainer}>
            <ThemedView style={styles.stepProgress}>
              <ThemedText style={styles.stepText}>
                Adım {currentStep + 1}/{lessonSteps.length}
              </ThemedText>
              <Progress.Bar 
                progress={(currentStep + 1) / lessonSteps.length} 
                width={200} 
                color="#2196F3" 
                unfilledColor="#E0E0E0" 
                borderWidth={0}
              />
            </ThemedView>
            
            {renderCurrentStep()}
            
            <ThemedView style={styles.navigationButtons}>
              {currentStep > 0 && (
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={goToPreviousStep}
                >
                  <MaterialIcons name="arrow-back" size={24} color="#2196F3" />
                  <ThemedText style={styles.navButtonText}>Önceki</ThemedText>
                </TouchableOpacity>
              )}
              
              {currentStep < lessonSteps.length - 1 ? (
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={goToNextStep}
                >
                  <ThemedText style={styles.navButtonText}>Sonraki</ThemedText>
                  <MaterialIcons name="arrow-forward" size={24} color="#2196F3" />
                </TouchableOpacity>
              ) : null}
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <DrawerToggleButton />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={[styles.tabsContainer, { backgroundColor: cardBackgroundColor }]}>
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
            {selectedLesson ? (
              <LessonContent lesson={selectedLesson} />
            ) : (
              <>
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
              </>
            )}
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

                <ThemedView style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                  <TouchableOpacity 
                    style={[styles.nextWordButton, { zIndex: 100 }]}
                    onPress={handleNextWord}
                  >
                    <ThemedText style={styles.nextWordButtonText}>Sonraki Kelime</ThemedText>
                    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </ThemedView>
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
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 16,
    alignSelf: 'center',
    width: '80%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextWordButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  // Ders İçeriği Stilleri
  lessonContentContainer: {
    padding: 8,
  },
  lessonDetails: {
    padding: 16,
    alignItems: 'center',
  },
  lessonImage: {
    width: 400,
    height: 225,
    borderRadius: 8,
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  lessonDescription: {
    marginBottom: 24,
    lineHeight: 22,
    color: '#757575',
  },
  lessonInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lessonStepContainer: {
    flex: 1,
    paddingBottom: 60, // Navigasyon düğmelerinin yüksekliği kadar alan bırak
  },
  stepProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepText: {
    marginRight: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    zIndex: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navButtonText: {
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  stepContainer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  introText: {
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  stepHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  vocabularyList: {
    width: '100%',
  },
  vocabularyItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordHeader: {
    flex: 1,
  },
  englishWord: {
    fontSize: 16,
  },
  pronunciation: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  translation: {
    color: '#757575',
    flex: 1,
  },
  speakButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogueContainer: {
    width: '100%',
    marginTop: 0,
    paddingBottom: 70, // Navigasyon düğmelerinin altında fazladan boşluk
  },
  dialogueBubble: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    maxWidth: '85%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    borderRightWidth: 4,
    borderRightColor: '#9C27B0',
  },
  exercisesContainer: {
    width: '100%',
  },
  exerciseItem: {
    marginBottom: 24,
  },
  exerciseQuestion: {
    marginBottom: 12,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  optionText: {
    fontSize: 14,
  },
  completionTitle: {
    marginTop: 16,
    textAlign: 'center',
    color: '#4CAF50',
  },
  completionText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  returnButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
  },
  returnButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    marginTop: 20,
  },
}); 