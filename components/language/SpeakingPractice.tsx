import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Speech from 'expo-speech';

export interface ConversationPhrase {
  id: string;
  text: string;
  translation: string;
  audioUrl?: string;
  isUserTurn: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  phrases: ConversationPhrase[];
}

interface SpeakingPracticeProps {
  conversation: Conversation;
  onComplete: (conversationId: string, score: number) => void;
}

export const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({ conversation, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState(0);
  const [completedPhrases, setCompletedPhrases] = useState<string[]>([]);
  
  const currentPhrase = conversation.phrases[currentIndex];
  const isLastPhrase = currentIndex === conversation.phrases.length - 1;
  
  const handleNext = () => {
    if (isLastPhrase) {
      onComplete(conversation.id, score);
      return;
    }
    
    setCurrentIndex(currentIndex + 1);
  };
  
  const handleSpeak = () => {
    if (currentPhrase.audioUrl) {
      // Audio dosyasından ses çalma işlevi (örnek)
      console.log('Playing audio from URL:', currentPhrase.audioUrl);
      Alert.alert('Ses çalınıyor', 'Gerçek uygulamada ses dosyası çalınacak.');
    } else {
      // Text-to-speech kullanarak konuşma
      Speech.speak(currentPhrase.text, {
        language: 'en-US', // Dil kodu, uygulamanızın kullandığı dile göre değişir
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };
  
  const handleListen = () => {
    // Konuşma tanıma işlevi (gerçek uygulamada Speech Recognition API kullanılır)
    setListening(true);
    
    // Burada gerçek konuşma tanıma yapılacak, şimdilik simüle ediyoruz
    setTimeout(() => {
      setListening(false);
      
      // Rastgele başarı (gerçek uygulamada konuşma tanıma başarısına göre puan verilir)
      const success = Math.random() > 0.3;
      
      if (success) {
        const newScore = score + 10;
        setScore(newScore);
        setCompletedPhrases([...completedPhrases, currentPhrase.id]);
        
        // Başarılı mesajı
        Alert.alert('Harika!', 'Telaffuzunuz doğru.');
        
        // Otomatik olarak bir sonraki cümleye geç
        if (!isLastPhrase) {
          setTimeout(() => {
            setCurrentIndex(currentIndex + 1);
          }, 1000);
        } else {
          onComplete(conversation.id, newScore);
        }
      } else {
        // Başarısız mesajı
        Alert.alert('Tekrar deneyin', 'Telaffuzunuz anlaşılamadı. Tekrar deneyin.');
      }
    }, 2000);
  };
  
  const isCompleted = (phraseId: string) => {
    return completedPhrases.includes(phraseId);
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">{conversation.title}</ThemedText>
        <ThemedText style={styles.score}>Puan: {score}</ThemedText>
      </ThemedView>
      
      <ThemedText style={styles.description}>{conversation.description}</ThemedText>
      
      <ThemedView style={styles.phraseContainer}>
        <ThemedView style={styles.translationContainer}>
          <ThemedText style={styles.translation}>{currentPhrase.translation}</ThemedText>
        </ThemedView>
        
        <ThemedView 
          style={[
            styles.phraseCard,
            currentPhrase.isUserTurn ? styles.userPhraseCard : styles.botPhraseCard
          ]}
        >
          <ThemedView style={styles.phraseHeader}>
            <ThemedView 
              style={[
                styles.speakerBadge, 
                currentPhrase.isUserTurn ? styles.userBadge : styles.botBadge
              ]}
            >
              <MaterialIcons 
                name={currentPhrase.isUserTurn ? "person" : "android"} 
                size={16} 
                color="#FFFFFF" 
              />
              <ThemedText style={styles.speakerText}>
                {currentPhrase.isUserTurn ? "Siz" : "Uygulama"}
              </ThemedText>
            </ThemedView>
            
            {isCompleted(currentPhrase.id) && (
              <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            )}
          </ThemedView>
          
          <ThemedText style={styles.phraseText}>{currentPhrase.text}</ThemedText>
          
          <ThemedView style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSpeak}
            >
              <MaterialIcons name="volume-up" size={24} color="#2196F3" />
              <ThemedText style={styles.actionText}>Dinle</ThemedText>
            </TouchableOpacity>
            
            {currentPhrase.isUserTurn && (
              <TouchableOpacity 
                style={[styles.actionButton, listening && styles.listeningButton]}
                onPress={handleListen}
                disabled={listening}
              >
                <MaterialIcons 
                  name={listening ? "mic" : "mic-none"} 
                  size={24} 
                  color={listening ? "#FFFFFF" : "#4CAF50"} 
                />
                <ThemedText 
                  style={[styles.actionText, listening && styles.listeningText]}
                >
                  {listening ? "Dinleniyor..." : "Konuş"}
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <ThemedText style={styles.nextButtonText}>
            {isLastPhrase ? "Tamamla" : "Sonraki"}
          </ThemedText>
          <MaterialIcons 
            name={isLastPhrase ? "check" : "arrow-forward"} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  score: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
  description: {
    marginBottom: 16,
    color: '#757575',
  },
  phraseContainer: {
    marginBottom: 24,
  },
  translationContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  translation: {
    fontStyle: 'italic',
    color: '#757575',
  },
  phraseCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userPhraseCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  botPhraseCard: {
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#9E9E9E',
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  speakerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadge: {
    backgroundColor: '#2196F3',
  },
  botBadge: {
    backgroundColor: '#9E9E9E',
  },
  speakerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  phraseText: {
    fontSize: 16,
    marginBottom: 16,
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
  actionText: {
    marginLeft: 8,
  },
  listeningButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  listeningText: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 