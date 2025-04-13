import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path, Circle } from 'react-native-svg';

export interface LanguageProgress {
  language: string;
  level: string;
  currentXP: number;
  levelXP: number;
  streak: number;
  wordsLearned: number;
  grammarPoints: number;
  lessonsCompleted: number;
  totalLessons: number;
  skills: { name: string; progress: number }[];
}

interface ProgressTrackerProps {
  progress: LanguageProgress;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 48;
const chartHeight = 170;

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  const xpPercentage = (progress.currentXP / progress.levelXP) * 100;
  
  // Öğrenilen kelime verilerini 4 haftalık grafik için hazırla (örnek)
  const weeklyData = [15, 28, 22, 35];
  const maxWeeklyValue = Math.max(...weeklyData);
  
  // Grafik için path oluştur
  const createPath = () => {
    const maxHeight = chartHeight - 40;
    const segmentWidth = chartWidth / (weeklyData.length - 1);
    
    let path = `M0,${maxHeight - (weeklyData[0] / maxWeeklyValue) * maxHeight}`;
    
    for (let i = 1; i < weeklyData.length; i++) {
      const x = i * segmentWidth;
      const y = maxHeight - (weeklyData[i] / maxWeeklyValue) * maxHeight;
      path += ` L${x},${y}`;
    }
    
    return path;
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">{progress.language} - {progress.level}</ThemedText>
          <ThemedView style={styles.streakBadge}>
            <MaterialIcons name="local-fire-department" size={16} color="#FF9800" />
            <ThemedText style={styles.streakText}>{progress.streak} gün</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.xpProgress}>
          <ThemedView style={styles.xpInfoContainer}>
            <ThemedText type="defaultSemiBold">{progress.currentXP} XP</ThemedText>
            <ThemedText style={styles.xpTarget}>/ {progress.levelXP} XP</ThemedText>
          </ThemedView>
          <ThemedView style={styles.progressBarContainer}>
            <ThemedView 
              style={[styles.progressBar, { width: `${xpPercentage}%` }]} 
            />
          </ThemedView>
          <ThemedText style={styles.xpToLevel}>
            Sonraki seviye için {progress.levelXP - progress.currentXP} XP daha kazanın
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">İlerleme İstatistikleri</ThemedText>
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <MaterialIcons name="text-fields" size={24} color="#2196F3" />
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {progress.wordsLearned}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Kelime</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statItem}>
            <MaterialIcons name="school" size={24} color="#9C27B0" />
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {progress.grammarPoints}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Gramer</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.statItem}>
            <MaterialIcons name="auto-stories" size={24} color="#4CAF50" />
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {progress.lessonsCompleted}/{progress.totalLessons}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Dersler</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Haftalık Kelime Öğrenme</ThemedText>
        <ThemedView style={styles.chartContainer}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Grafik Çizgisi */}
            <Path
              d={createPath()}
              stroke="#2196F3"
              strokeWidth={3}
              fill="none"
            />
            
            {/* Nokta İşaretleri */}
            {weeklyData.map((value, index) => {
              const segmentWidth = chartWidth / (weeklyData.length - 1);
              const x = index * segmentWidth;
              const y = chartHeight - 40 - (value / maxWeeklyValue) * (chartHeight - 40);
              return (
                <Circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={5}
                  fill="#2196F3"
                />
              );
            })}
          </Svg>
          
          <ThemedView style={styles.chartLabels}>
            <ThemedText style={styles.chartLabel}>1. Hafta</ThemedText>
            <ThemedText style={styles.chartLabel}>2. Hafta</ThemedText>
            <ThemedText style={styles.chartLabel}>3. Hafta</ThemedText>
            <ThemedText style={styles.chartLabel}>4. Hafta</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Beceri Gelişimi</ThemedText>
        <ThemedView style={styles.skillsContainer}>
          {progress.skills.map((skill, index) => (
            <ThemedView key={index} style={styles.skillItem}>
              <ThemedView style={styles.skillHeader}>
                <ThemedText type="defaultSemiBold">{skill.name}</ThemedText>
                <ThemedText style={styles.skillPercentage}>
                  {skill.progress}%
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.skillProgressContainer}>
                <ThemedView 
                  style={[styles.skillProgress, { width: `${skill.progress}%` }]} 
                />
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  streakText: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  xpProgress: {
    marginBottom: 8,
  },
  xpInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpTarget: {
    color: '#757575',
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  xpToLevel: {
    fontSize: 12,
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  chartContainer: {
    marginTop: 16,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  skillsContainer: {
    marginTop: 16,
  },
  skillItem: {
    marginBottom: 12,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillPercentage: {
    color: '#757575',
  },
  skillProgressContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillProgress: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
}); 