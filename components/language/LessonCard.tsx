import React from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@/context/ThemeContext';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // dakika cinsinden
  progress: number; // 0-100 arası
  imageUrl?: string;
  isLocked: boolean;
  xpPoints: number;
  wordCount: number;
}

interface LessonCardProps {
  lesson: Lesson;
  onPress: (lesson: Lesson) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onPress }) => {
  const iconColor = useThemeColor({}, 'icon');
  const { theme } = useTheme();
  const cardBackgroundColor = theme === 'dark' ? 'rgba(25, 25, 25, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const itemBackgroundColor = theme === 'dark' ? 'rgba(40, 40, 40, 0.6)' : 'rgba(255, 255, 255, 0.6)';
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#4CAF50'; // yeşil
      case 'intermediate': return '#2196F3'; // mavi
      case 'advanced': return '#9C27B0'; // mor
      default: return '#4CAF50';
    }
  };
  
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return 'star-outline';
      case 'intermediate': return 'star-half';
      case 'advanced': return 'star';
      default: return 'star-outline';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(lesson)}
      disabled={lesson.isLocked}
    >
      <ImageBackground
        source={lesson.imageUrl ? { uri: lesson.imageUrl } : require('@/assets/images/lesson-default.jpg')}
        style={styles.cardBg}
        imageStyle={styles.cardBgImage}
      >
        <ThemedView style={[styles.cardContent, { backgroundColor: cardBackgroundColor }]}>
          <ThemedView style={styles.header}>
            <ThemedView style={[styles.levelBadge, { backgroundColor: getLevelColor(lesson.level) }]}>
              <MaterialIcons name={getLevelIcon(lesson.level)} size={12} color="#FFF" />
              <ThemedText style={styles.levelText}>
                {lesson.level === 'beginner' ? 'Başlangıç' : 
                 lesson.level === 'intermediate' ? 'Orta' : 'İleri'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.points}>
              <ThemedText style={styles.pointsText}>+{lesson.xpPoints} XP</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.body}>
            <ThemedText type="title" style={styles.title}>{lesson.title}</ThemedText>
            <ThemedText style={styles.description}>{lesson.description}</ThemedText>
            
            <ThemedView style={styles.details}>
              <ThemedView style={styles.detailItem}>
                <MaterialIcons name="access-time" size={16} color={iconColor} />
                <ThemedText style={styles.detailText}>{lesson.duration} dk</ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.detailItem}>
                <MaterialIcons name="text-fields" size={16} color={iconColor} />
                <ThemedText style={styles.detailText}>{lesson.wordCount} kelime</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          
          {lesson.progress > 0 && (
            <ThemedView style={styles.progressContainer}>
              <ThemedView style={[styles.progressBar, { backgroundColor: theme === 'dark' ? '#444' : '#E0E0E0' }]}>
                <ThemedView style={[styles.progress, { width: `${lesson.progress}%` }]} />
              </ThemedView>
              <ThemedText style={styles.progressText}>%{lesson.progress}</ThemedText>
            </ThemedView>
          )}
          
          {lesson.isLocked && (
            <ThemedView style={styles.lockedOverlay}>
              <MaterialIcons name="lock" size={24} color="#FFF" />
              <ThemedText style={styles.lockedText}>Bu dersi açmak için önceki dersleri tamamlayın</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardBg: {
    overflow: 'hidden',
  },
  cardBgImage: {
    borderRadius: 12,
  },
  cardContent: {
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  points: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  body: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    color: '#757575',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 4,
    fontSize: 12,
    color: '#757575',
    alignSelf: 'flex-end',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  lockedText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 8,
  },
}); 