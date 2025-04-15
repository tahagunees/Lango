import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Kelime verileri
export interface ScrambleWord {
  id: string;
  word: string;
  translation: string;
  hint?: string;
}

interface WordScrambleProps {
  words: ScrambleWord[];
  onComplete: (score: number, timeSpent: number) => void;
}

export const WordScramble: React.FC<WordScrambleProps> = ({ words, onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  
  // Oyunu başlat
  useEffect(() => {
    if (words.length > 0) {
      scrambleCurrentWord();
      setStartTime(Date.now());
    }
  }, [words, currentWordIndex]);
  
  // Kelimeyi karıştır
  const scrambleCurrentWord = () => {
    if (words.length === 0) return;
    
    const currentWord = words[currentWordIndex].word;
    const letters = currentWord.split('');
    
    // Harfleri karıştır
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    
    // Aynı çıkarsa yeniden karıştır
    if (shuffled.join('') === currentWord) {
      return scrambleCurrentWord();
    }
    
    setScrambledWord(shuffled.join(''));
    setAvailableLetters(shuffled);
    setUserAnswer([]);
    setIsCorrect(null);
    setShowHint(false);
    setHintUsed(false);
  };
  
  // Harf seçildiğinde
  const handleLetterSelect = (letter: string, index: number) => {
    // Zaten seçilmiş harfi tekrar seçme
    const newAvailable = [...availableLetters];
    newAvailable[index] = '';
    setAvailableLetters(newAvailable);
    
    // Kullanıcının cevabına ekle
    const newAnswer = [...userAnswer, letter];
    setUserAnswer(newAnswer);
    
    // Cevap tamamlandı mı kontrol et
    if (newAnswer.length === words[currentWordIndex].word.length) {
      checkAnswer(newAnswer.join(''));
    }
  };
  
  // Seçilmiş harfi kaldır
  const handleRemoveLetter = (index: number) => {
    const letter = userAnswer[index];
    
    // Kullanıcının cevabından kaldır
    const newAnswer = [...userAnswer];
    newAnswer.splice(index, 1);
    setUserAnswer(newAnswer);
    
    // Kullanılabilir harflere geri ekle
    const firstEmptyIndex = availableLetters.indexOf('');
    if (firstEmptyIndex !== -1) {
      const newAvailable = [...availableLetters];
      newAvailable[firstEmptyIndex] = letter;
      setAvailableLetters(newAvailable);
    }
  };
  
  // Cevabı kontrol et
  const checkAnswer = (answer: string) => {
    const isAnswerCorrect = answer.toLowerCase() === words[currentWordIndex].word.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    
    // Skor hesapla
    let points = 0;
    if (isAnswerCorrect) {
      points = hintUsed ? 5 : 10; // İpucu kullanıldıysa daha az puan
      setScore(score + points);
    }
    
    // Sonraki kelimeye geç veya oyunu bitir
    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        // Oyun bitti
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onComplete(score + points, timeSpent);
      }
    }, 2000);
  };
  
  // İpucu göster
  const handleShowHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };
  
  // Cevabı temizle
  const handleReset = () => {
    // Tüm harfleri geri al
    const currentWord = words[currentWordIndex].word;
    const letters = scrambledWord.split('');
    setAvailableLetters(letters);
    setUserAnswer([]);
    setIsCorrect(null);
  };
  
  // Geçerli kelime için ipucu varsa göster
  const currentHint = words[currentWordIndex]?.hint || words[currentWordIndex]?.translation;
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Kelime Bulmaca</ThemedText>
        <ThemedView style={styles.scoreContainer}>
          <MaterialIcons name="stars" size={16} color="#FFC107" />
          <ThemedText style={styles.scoreText}>{score}</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.progressContainer}>
        <ThemedText style={styles.progressText}>
          {currentWordIndex + 1}/{words.length}
        </ThemedText>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentWordIndex) / words.length) * 100}%` }
            ]} 
          />
        </View>
      </ThemedView>
      
      {showHint && (
        <ThemedView style={styles.hintContainer}>
          <MaterialIcons name="lightbulb" size={20} color="#FFC107" />
          <ThemedText style={styles.hintText}>{currentHint}</ThemedText>
        </ThemedView>
      )}
      
      <ThemedView style={styles.answerContainer}>
        {Array(words[currentWordIndex]?.word.length || 0).fill(0).map((_, index) => (
          <TouchableOpacity 
            key={`answer-${index}`}
            style={[
              styles.letterBox, 
              userAnswer[index] ? styles.filledLetterBox : {},
              isCorrect === true ? styles.correctLetterBox : 
              isCorrect === false ? styles.wrongLetterBox : {}
            ]}
            onPress={() => userAnswer[index] && handleRemoveLetter(index)}
            disabled={isCorrect !== null}
          >
            <ThemedText style={[
              styles.letterText, 
              isCorrect === true ? styles.correctLetterText : 
              isCorrect === false ? styles.wrongLetterText : {}
            ]}>
              {userAnswer[index] || ''}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
      
      {isCorrect === true && (
        <ThemedView style={styles.feedbackContainer}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <ThemedText style={styles.correctFeedback}>Doğru!</ThemedText>
        </ThemedView>
      )}
      
      {isCorrect === false && (
        <ThemedView style={styles.feedbackContainer}>
          <MaterialIcons name="error" size={24} color="#F44336" />
          <ThemedText style={styles.wrongFeedback}>
            Yanlış! Doğru cevap: {words[currentWordIndex].word}
          </ThemedText>
        </ThemedView>
      )}
      
      <ThemedView style={styles.lettersContainer}>
        {availableLetters.map((letter, index) => (
          <TouchableOpacity 
            key={`letter-${index}`}
            style={[styles.letterOption, !letter && styles.usedLetterOption]}
            onPress={() => letter && handleLetterSelect(letter, index)}
            disabled={!letter || isCorrect !== null}
          >
            <ThemedText style={styles.letterOptionText}>{letter}</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
      
      <ThemedView style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleReset}
          disabled={userAnswer.length === 0 || isCorrect !== null}
        >
          <MaterialIcons name="refresh" size={24} color="#757575" />
          <ThemedText style={styles.actionButtonText}>Temizle</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShowHint}
          disabled={showHint || isCorrect !== null}
        >
          <MaterialIcons name="lightbulb" size={24} color="#FFC107" />
          <ThemedText style={styles.actionButtonText}>İpucu</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: {
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    textAlign: 'right',
    marginBottom: 4,
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  hintText: {
    marginLeft: 8,
    fontStyle: 'italic',
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  letterBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  filledLetterBox: {
    borderColor: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  correctLetterBox: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  wrongLetterBox: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  letterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctLetterText: {
    color: '#4CAF50',
  },
  wrongLetterText: {
    color: '#F44336',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  correctFeedback: {
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  wrongFeedback: {
    color: '#F44336',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  letterOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  usedLetterOption: {
    backgroundColor: 'transparent',
  },
  letterOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 4,
  },
}); 