import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@/context/ThemeContext';
import Animated, { useAnimatedStyle, withTiming, interpolate, useSharedValue } from 'react-native-reanimated';

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  imageUrl?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface VocabularyCardProps {
  word: VocabularyWord;
  onMarkLearned: (wordId: string) => void;
  onBookmark: (wordId: string, isBookmarked: boolean) => void;
  isBookmarked: boolean;
}

const { width } = Dimensions.get('window');

export const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, onMarkLearned, onBookmark, isBookmarked }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = useSharedValue(0);
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'dark' ? '#1E1E1E' : '#F5F5F5';
  const textSecondaryColor = theme === 'dark' ? '#AAAAAA' : '#757575';

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    flip.value = withTiming(isFlipped ? 0 : 1, { duration: 300 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(flip.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateValue}deg` },
      ],
      backfaceVisibility: 'hidden',
      opacity: flip.value > 0.5 ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(flip.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateValue}deg` },
      ],
      backfaceVisibility: 'hidden',
      opacity: flip.value > 0.5 ? 1 : 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'hard': return '#F44336';
      default: return '#4CAF50';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={handleFlip} style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontAnimatedStyle, { backgroundColor: cardBackgroundColor }]}>
          <ThemedView style={styles.difficultyBadge}>
            <ThemedView 
              style={[
                styles.difficultyIndicator, 
                { backgroundColor: getDifficultyColor(word.difficulty) }
              ]} 
            />
            <ThemedText style={[styles.difficultyText, { color: textSecondaryColor }]}>
              {word.difficulty === 'easy' ? 'Kolay' : 
               word.difficulty === 'medium' ? 'Orta' : 'Zor'}
            </ThemedText>
          </ThemedView>
          
          <ThemedText type="title" style={styles.word}>
            {word.word}
          </ThemedText>
          
          <ThemedText style={[styles.pronunciation, { color: textSecondaryColor }]}>
            {word.pronunciation}
          </ThemedText>
          
          <ThemedView style={styles.tagsContainer}>
            {word.tags.map((tag, index) => (
              <ThemedView key={index} style={[styles.tag, { backgroundColor: theme === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)' }]}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
          
          <ThemedView style={styles.hint}>
            <MaterialIcons name="touch-app" size={20} color={iconColor} />
            <ThemedText style={[styles.hintText, { color: textSecondaryColor }]}>Çeviri için dokun</ThemedText>
          </ThemedView>
        </Animated.View>
        
        <Animated.View style={[styles.card, backAnimatedStyle, { backgroundColor }]}>
          <ThemedText type="subtitle" style={styles.translation}>
            {word.translation}
          </ThemedText>
          
          <ThemedView style={styles.exampleContainer}>
            <ThemedText style={[styles.exampleTitle, { color: textSecondaryColor }]}>Örnek:</ThemedText>
            <ThemedText style={styles.example}>{word.example}</ThemedText>
            <ThemedText style={[styles.exampleTranslation, { color: textSecondaryColor }]}>
              {word.exampleTranslation}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.hint}>
            <MaterialIcons name="touch-app" size={20} color={iconColor} />
            <ThemedText style={[styles.hintText, { color: textSecondaryColor }]}>Kelimeyi görmek için dokun</ThemedText>
          </ThemedView>
        </Animated.View>
      </TouchableOpacity>
      
      <ThemedView style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onBookmark(word.id, !isBookmarked)}
        >
          <MaterialIcons 
            name={isBookmarked ? "bookmark" : "bookmark-border"} 
            size={24} 
            color={isBookmarked ? "#FFC107" : iconColor} 
          />
          <ThemedText style={styles.actionText}>
            {isBookmarked ? 'Kaydedildi' : 'Kaydet'}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onMarkLearned(word.id)}
        >
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <ThemedText style={styles.actionText}>Öğrendim</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  cardContainer: {
    width: width - 48,
    height: 280,
    perspective: '1000' as any,
  },
  card: {
    width: '100%',
    height: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  difficultyText: {
    fontSize: 12,
  },
  word: {
    marginBottom: 8,
    fontSize: 32,
    textAlign: 'center',
  },
  pronunciation: {
    marginBottom: 16,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    margin: 4,
  },
  tagText: {
    color: '#2196F3',
    fontSize: 12,
  },
  hint: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    marginLeft: 4,
    fontSize: 12,
  },
  translation: {
    marginBottom: 24,
    fontSize: 28,
    textAlign: 'center',
  },
  exampleContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  exampleTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  example: {
    marginBottom: 8,
    fontStyle: 'italic',
  },
  exampleTranslation: {
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  actionText: {
    marginLeft: 4,
  },
}); 