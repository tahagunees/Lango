import { ScrollView, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { WordMatch, MatchPair } from '@/components/games/WordMatch';
import { WordScramble, ScrambleWord } from '@/components/games/WordScramble';

export default function GamesScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  
  // Kelime Eşleştirme Oyunu için örnek veri
  const matchPairs: MatchPair[] = [
    { id: '1', english: 'Hello', turkish: 'Merhaba' },
    { id: '2', english: 'Goodbye', turkish: 'Hoşçakal' },
    { id: '3', english: 'Thank you', turkish: 'Teşekkürler' },
    { id: '4', english: 'Please', turkish: 'Lütfen' },
    { id: '5', english: 'Sorry', turkish: 'Özür dilerim' },
  ];
  
  // Karışık Harfli Kelime Oyunu için örnek veri
  const scrambleWords: ScrambleWord[] = [
    { id: '1', word: 'Dog', translation: 'Köpek', hint: 'Evcil bir hayvan' },
    { id: '2', word: 'Cat', translation: 'Kedi', hint: 'Miyavlayan bir hayvan' },
    { id: '3', word: 'Book', translation: 'Kitap', hint: 'Okumak için kullanılır' },
    { id: '4', word: 'Food', translation: 'Yemek', hint: 'Yediğimiz şey' },
    { id: '5', word: 'Water', translation: 'Su', hint: 'İçecek' }
  ];
  
  // Oyun listesi
  const gamesList = [
    { 
      id: 'word-match', 
      title: 'Kelime Eşleştirme', 
      description: 'İngilizce ve Türkçe kelime kartlarını eşleştir', 
      icon: 'extension', 
      color: '#2196F3',
      difficulty: 'Kolay'
    },
    { 
      id: 'word-scramble', 
      title: 'Karışık Harfler', 
      description: 'Karışık harfli İngilizce kelimeleri bul', 
      icon: 'sync-alt', 
      color: '#FF9800',
      difficulty: 'Orta'
    },
    // Gelecekte eklenecek oyunlar buraya eklenebilir
  ];
  
  // Oyun tamamlandığında
  const handleGameComplete = (score: number, timeSpent: number) => {
    setGameScore(score);
    Alert.alert(
      'Tebrikler!',
      `Oyunu tamamladınız!\nPuanınız: ${score}\nGeçen süre: ${timeSpent} saniye`,
      [{ text: 'Ana Menüye Dön', onPress: () => setActiveGame(null) }]
    );
  };
  
  // Oyunu başlat
  const startGame = (gameId: string) => {
    setActiveGame(gameId);
    setGameScore(0);
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: true, title: 'Oyunlar' }} />
      <ScrollView style={[styles.container, { backgroundColor }]}>
        
        {activeGame === null ? (
          <>
            <ThemedView style={styles.header}>
              <ThemedText type="title">Kelime Oyunları</ThemedText>
              <ThemedText>Eğlenerek İngilizce kelimeleri öğrenin!</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.gamesList}>
              {gamesList.map(game => (
                <Pressable 
                  key={game.id} 
                  style={styles.gameItem}
                  onPress={() => startGame(game.id)}
                >
                  <ThemedView style={[styles.gameCard, { borderLeftColor: game.color }]}>
                    <ThemedView style={[styles.gameIconContainer, { backgroundColor: game.color }]}>
                      <MaterialIcons name={game.icon} size={28} color="#FFFFFF" />
                    </ThemedView>
                    
                    <ThemedView style={styles.gameDetails}>
                      <ThemedText type="defaultSemiBold">{game.title}</ThemedText>
                      <ThemedText style={styles.gameDescription}>
                        {game.description}
                      </ThemedText>
                      
                      <ThemedView style={styles.gameMeta}>
                        <ThemedView style={styles.difficultyBadge}>
                          <ThemedText style={styles.difficultyText}>{game.difficulty}</ThemedText>
                        </ThemedView>
                      </ThemedView>
                    </ThemedView>
                    
                    <MaterialIcons name="chevron-right" size={24} color={iconColor} />
                  </ThemedView>
                </Pressable>
              ))}
            </ThemedView>
            
            <ThemedView style={styles.statsContainer}>
              <ThemedText type="subtitle">İstatistikler</ThemedText>
              <ThemedView style={[styles.statsCard, { backgroundColor: cardBackgroundColor }]}>
                <ThemedView style={styles.statItem}>
                  <MaterialIcons name="emoji-events" size={24} color="#FFC107" />
                  <ThemedView>
                    <ThemedText type="defaultSemiBold">En Yüksek Puanınız</ThemedText>
                    <ThemedText style={styles.statValue}>{gameScore}</ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView style={styles.statItem}>
                  <MaterialIcons name="timer" size={24} color="#4CAF50" />
                  <ThemedView>
                    <ThemedText type="defaultSemiBold">Oyun Süresi</ThemedText>
                    <ThemedText style={styles.statValue}>0 dakika</ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedView style={styles.statItem}>
                  <MaterialIcons name="trending-up" size={24} color="#2196F3" />
                  <ThemedView>
                    <ThemedText type="defaultSemiBold">Öğrenilen Kelimeler</ThemedText>
                    <ThemedText style={styles.statValue}>0</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </>
        ) : activeGame === 'word-match' ? (
          <WordMatch 
            pairs={matchPairs}
            onComplete={handleGameComplete}
          />
        ) : activeGame === 'word-scramble' ? (
          <WordScramble 
            words={scrambleWords}
            onComplete={handleGameComplete}
          />
        ) : null}
        
        {activeGame && (
          <ThemedView style={styles.backButtonContainer}>
            <Pressable 
              style={styles.backButton}
              onPress={() => {
                Alert.alert(
                  'Oyundan Çık',
                  'Oyundan çıkmak istediğinize emin misiniz?',
                  [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Çık', onPress: () => setActiveGame(null) }
                  ]
                );
              }}
            >
              <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
              <ThemedText style={styles.backButtonText}>Ana Menüye Dön</ThemedText>
            </Pressable>
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
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  gamesList: {
    marginBottom: 24,
  },
  gameItem: {
    marginBottom: 12,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gameIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gameDetails: {
    flex: 1,
  },
  gameDescription: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  gameMeta: {
    flexDirection: 'row',
    marginTop: 8,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#757575',
    marginTop: 2,
  },
  backButtonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757575',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: 'bold',
  },
}); 