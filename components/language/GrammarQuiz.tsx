import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

interface GrammarQuizProps {
  question: QuizQuestion;
  onAnswer: (questionId: string, answerId: string, isCorrect: boolean) => void;
  onNext: () => void;
}

export const GrammarQuiz: React.FC<GrammarQuizProps> = ({ question, onAnswer, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption) return; // Cevap zaten verilmiş
    
    setSelectedOption(optionId);
    const option = question.options.find(o => o.id === optionId);
    if (option) {
      onAnswer(question.id, optionId, option.isCorrect);
      setShowExplanation(true);
    }
  };

  const isCorrectAnswer = (optionId: string): boolean => {
    return question.options.find(o => o.id === optionId)?.isCorrect || false;
  };

  const getOptionStyle = (optionId: string) => {
    if (!selectedOption) return styles.option;
    
    if (optionId === selectedOption) {
      return isCorrectAnswer(optionId) 
        ? [styles.option, styles.correctOption]
        : [styles.option, styles.incorrectOption];
    }
    
    if (isCorrectAnswer(optionId)) {
      return [styles.option, styles.correctOption];
    }
    
    return styles.option;
  };

  const getOptionIconName = (optionId: string) => {
    if (!selectedOption) return null;
    
    if (isCorrectAnswer(optionId)) {
      return 'check-circle';
    }
    
    if (optionId === selectedOption && !isCorrectAnswer(optionId)) {
      return 'cancel';
    }
    
    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.question}>
        {question.question}
      </ThemedText>
      
      <ThemedView style={styles.optionsContainer}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={getOptionStyle(option.id)}
            onPress={() => handleOptionSelect(option.id)}
            disabled={selectedOption !== null}
          >
            <ThemedText style={styles.optionText}>
              {option.text}
            </ThemedText>
            
            {getOptionIconName(option.id) && (
              <MaterialIcons 
                name={getOptionIconName(option.id) || ''} 
                size={24} 
                color={isCorrectAnswer(option.id) ? '#4CAF50' : '#F44336'} 
              />
            )}
          </TouchableOpacity>
        ))}
      </ThemedView>
      
      {showExplanation && (
        <ThemedView style={styles.explanationContainer}>
          <ThemedText type="defaultSemiBold" style={styles.explanationTitle}>
            Açıklama
          </ThemedText>
          <ThemedText style={styles.explanation}>
            {question.explanation}
          </ThemedText>
        </ThemedView>
      )}
      
      {selectedOption && (
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <ThemedText style={styles.nextButtonText}>Sonraki Soru</ThemedText>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  question: {
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336',
    borderWidth: 1,
  },
  optionText: {
    flex: 1,
  },
  explanationContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  explanationTitle: {
    marginBottom: 8,
  },
  explanation: {
    lineHeight: 20,
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
}); 