import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

// Eşleşecek kelimeler
export interface MatchPair {
  id: string;
  english: string;
  turkish: string;
}

interface WordMatchProps {
  pairs: MatchPair[];
  onComplete: (score: number, timeSpent: number) => void;
}

export const WordMatch: React.FC<WordMatchProps> = ({ pairs, onComplete }) => {
  const { theme } = useTheme();
  const [cards, setCards] = useState<Array<{
    id: string;
    text: string;
    type: 'english' | 'turkish';
    pairId: string;
    isFlipped: boolean;
    isMatched: boolean;
  }>>([]);
  
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [secondCard, setSecondCard] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(0);
  
  // Oyunu başlat ve kartları karıştır
  useEffect(() => {
    if (pairs.length > 0) {
      const newCards = pairs.flatMap(pair => [
        {
          id: `${pair.id}-eng`,
          text: pair.english,
          type: 'english' as const,
          pairId: pair.id,
          isFlipped: false,
          isMatched: false
        },
        {
          id: `${pair.id}-tr`,
          text: pair.turkish,
          type: 'turkish' as const,
          pairId: pair.id,
          isFlipped: false,
          isMatched: false
        }
      ]);
      
      // Kartları karıştır
      newCards.sort(() => Math.random() - 0.5);
      setCards(newCards);
    }
  }, [pairs]);
  
  // Oyuna başla
  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  };
  
  // Bir kart seçildiğinde
  const handleCardPress = (index: number) => {
    if (!gameStarted) {
      startGame();
    }
    
    // Zaten eşleşmiş veya çevrilmiş kartı seçemezsin
    if (isLocked || cards[index].isMatched || cards[index].isFlipped) {
      return;
    }
    
    // İlk kart seçildiğinde
    if (firstCard === null) {
      const updatedCards = [...cards];
      updatedCards[index].isFlipped = true;
      setCards(updatedCards);
      setFirstCard(index);
      return;
    }
    
    // İkinci kart seçildiğinde
    if (secondCard === null) {
      const updatedCards = [...cards];
      updatedCards[index].isFlipped = true;
      setCards(updatedCards);
      setSecondCard(index);
      setIsLocked(true);
      
      // Hamle sayısını artır
      setMoves(moves + 1);
      
      // Eşleşme kontrolü
      if (cards[firstCard].pairId === cards[index].pairId) {
        // Eşleşme var
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstCard].isMatched = true;
          matchedCards[index].isMatched = true;
          setCards(matchedCards);
          setFirstCard(null);
          setSecondCard(null);
          setIsLocked(false);
          
          // Skoru artır
          setScore(score + 10);
          
          // Oyun bitti mi?
          if (matchedCards.every(card => card.isMatched)) {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            onComplete(score + 10, timeSpent);
          }
        }, 1000);
      } else {
        // Eşleşme yok
        setTimeout(() => {
          const unmatchedCards = [...cards];
          unmatchedCards[firstCard].isFlipped = false;
          unmatchedCards[index].isFlipped = false;
          setCards(unmatchedCards);
          setFirstCard(null);
          setSecondCard(null);
          setIsLocked(false);
        }, 1000);
      }
    }
  };
  
  const getCardBackgroundColor = (card: typeof cards[0], index: number) => {
    const baseColor = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
    const matchedColor = '#E8F5E9';
    const flippedEnglishColor = '#E3F2FD';
    const flippedTurkishColor = '#FFF3E0';
    
    if (card.isMatched) {
      return matchedColor;
    }
    
    if (card.isFlipped) {
      return card.type === 'english' ? flippedEnglishColor : flippedTurkishColor;
    }
    
    return baseColor;
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Kelime Eşleştirme</ThemedText>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.stat}>
            <MaterialIcons name="stars" size={16} color="#FFC107" />
            <ThemedText>{score}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stat}>
            <MaterialIcons name="touch-app" size={16} color="#2196F3" />
            <ThemedText>{moves}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedText style={styles.instructions}>
        İngilizce ve Türkçe kelime kartlarını eşleştirin.
      </ThemedText>
      
      <ThemedView style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { backgroundColor: getCardBackgroundColor(card, index) },
              card.isFlipped && card.type === 'english' && styles.englishCard,
              card.isFlipped && card.type === 'turkish' && styles.turkishCard,
              card.isMatched && styles.matchedCard
            ]}
            onPress={() => handleCardPress(index)}
            disabled={card.isMatched || isLocked}
          >
            <ThemedText style={[
              styles.cardText,
              card.isFlipped && styles.flippedCardText,
              card.isMatched && styles.matchedCardText
            ]}>
              {card.isFlipped || card.isMatched ? card.text : '?'}
            </ThemedText>
            {card.isMatched && (
              <MaterialIcons name="check-circle" size={16} color="#4CAF50" style={styles.matchedIcon} />
            )}
          </TouchableOpacity>
        ))}
      </ThemedView>
      
      {!gameStarted && (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <ThemedText style={styles.startButtonText}>Oyunu Başlat</ThemedText>
          <MaterialIcons name="play-arrow" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
  statsContainer: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  instructions: {
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    height: 80,
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  englishCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  turkishCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  matchedCard: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardText: {
    textAlign: 'center',
    fontSize: 16,
  },
  flippedCardText: {
    fontWeight: 'bold',
  },
  matchedCardText: {
    color: '#4CAF50',
  },
  matchedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
    alignSelf: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 