import { HfInference } from '@huggingface/inference';

// Initialize HuggingFace client (using free inference API)
const hf = new HfInference();

export interface EmotionAnalysisResult {
  emotion: string;
  confidence: number;
  facial_score: number;
  emotions: Array<{
    label: string;
    score: number;
  }>;
}

export interface SpeechAnalysisResult {
  transcript: string;
  sentiment: string;
  confidence: number;
  tone_analysis: {
    tone: string;
    confidence: number;
  };
  speech_quality: {
    clarity: number;
    pace: string;
    volume: string;
  };
}

export interface ContentAssessmentResult {
  content_score: number;
  accuracy: number;
  completeness: number;
  relevance: number;
  technical_depth: number;
  feedback: string;
  suggestions: string[];
}

/**
 * Analyze emotions from text transcription using HuggingFace
 */
export async function analyzeEmotionFromText(text: string): Promise<EmotionAnalysisResult> {
  try {
    const result = await hf.textClassification({
      model: 'j-hartmann/emotion-english-distilroberta-base',
      inputs: text
    });

    const topEmotion = result[0];
    
    return {
      emotion: topEmotion.label.toLowerCase(),
      confidence: topEmotion.score,
      facial_score: topEmotion.score * 100,
      emotions: result.map(r => ({
        label: r.label.toLowerCase(),
        score: r.score
      }))
    };
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    // Return default analysis on error
    return {
      emotion: 'neutral',
      confidence: 0.5,
      facial_score: 50,
      emotions: [{ label: 'neutral', score: 0.5 }]
    };
  }
}

/**
 * Analyze sentiment and speech quality from transcript
 */
export async function analyzeSpeechQuality(transcript: string, duration: number): Promise<SpeechAnalysisResult> {
  try {
    // Sentiment analysis
    const sentimentResult = await hf.textClassification({
      model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      inputs: transcript
    });

    const sentiment = sentimentResult[0];
    const wordCount = transcript.split(' ').length;
    const wordsPerMinute = Math.round((wordCount / duration) * 60);
    
    // Determine pace and volume based on transcript analysis
    const pace = wordsPerMinute < 120 ? 'slow' : wordsPerMinute > 180 ? 'fast' : 'normal';
    const clarity = transcript.length > 50 ? 0.8 : 0.6; // Simple heuristic
    
    return {
      transcript,
      sentiment: sentiment.label.toLowerCase(),
      confidence: sentiment.score,
      tone_analysis: {
        tone: sentiment.label.toLowerCase() === 'positive' ? 'confident' : 
              sentiment.label.toLowerCase() === 'negative' ? 'uncertain' : 'neutral',
        confidence: sentiment.score
      },
      speech_quality: {
        clarity,
        pace,
        volume: 'normal' // Default since we can't analyze volume from transcript
      }
    };
  } catch (error) {
    console.error('Error analyzing speech quality:', error);
    return {
      transcript,
      sentiment: 'neutral',
      confidence: 0.5,
      tone_analysis: { tone: 'neutral', confidence: 0.5 },
      speech_quality: { clarity: 0.5, pace: 'normal', volume: 'normal' }
    };
  }
}

/**
 * Assess content quality and accuracy using HuggingFace models
 */
export async function assessContentQuality(
  question: string, 
  answer: string, 
  expectedAnswer?: string
): Promise<ContentAssessmentResult> {
  try {
    // Use question-answering model to evaluate answer quality
    const qaResult = await hf.questionAnswering({
      model: 'deepset/roberta-base-squad2',
      inputs: {
        question: `How well does this answer address the question: "${question}"?`,
        context: answer
      }
    });

    // Calculate relevance score based on answer length and keyword matching
    const relevanceScore = calculateRelevanceScore(question, answer);
    const completenessScore = Math.min(answer.length / 100, 1); // Simple completeness metric
    const accuracyScore = expectedAnswer ? 
      calculateSimilarity(answer, expectedAnswer) : qaResult.score;

    const contentScore = Math.round(
      (relevanceScore * 0.3 + completenessScore * 0.3 + accuracyScore * 0.4) * 100
    );

    // Generate feedback using text generation
    const feedback = await generateFeedback(question, answer, contentScore);

    return {
      content_score: contentScore,
      accuracy: Math.round(accuracyScore * 100),
      completeness: Math.round(completenessScore * 100),
      relevance: Math.round(relevanceScore * 100),
      technical_depth: Math.round(assessTechnicalDepth(answer) * 100),
      feedback,
      suggestions: generateSuggestions(contentScore, answer)
    };
  } catch (error) {
    console.error('Error assessing content quality:', error);
    return {
      content_score: 70,
      accuracy: 70,
      completeness: 70,
      relevance: 70,
      technical_depth: 60,
      feedback: "Unable to perform detailed analysis. Please ensure your answer is clear and comprehensive.",
      suggestions: ["Provide more specific details", "Include examples", "Structure your answer clearly"]
    };
  }
}

/**
 * Generate personalized feedback using text generation
 */
async function generateFeedback(question: string, answer: string, score: number): Promise<string> {
  try {
    const prompt = `
Question: "${question}"
Answer: "${answer}"
Score: ${score}/100

Provide constructive feedback on this answer focusing on:
1. Content accuracy and relevance
2. Clarity and structure  
3. Areas for improvement
4. Positive aspects

Feedback:`;

    const result = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7
      }
    });

    return result.generated_text.replace(prompt, '').trim() || 
           `Your answer scores ${score}/100. Focus on providing more specific details and clear explanations.`;
  } catch (error) {
    console.error('Error generating feedback:', error);
    return `Your answer scores ${score}/100. Focus on providing more specific details and clear explanations.`;
  }
}

/**
 * Calculate relevance score between question and answer
 */
function calculateRelevanceScore(question: string, answer: string): number {
  const questionWords = question.toLowerCase().split(' ').filter(w => w.length > 3);
  const answerWords = answer.toLowerCase().split(' ');
  
  let matches = 0;
  questionWords.forEach(qWord => {
    if (answerWords.some(aWord => aWord.includes(qWord) || qWord.includes(aWord))) {
      matches++;
    }
  });
  
  return Math.min(matches / questionWords.length, 1);
}

/**
 * Calculate similarity between two texts (simple implementation)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(' ');
  const words2 = text2.toLowerCase().split(' ');
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
}

/**
 * Assess technical depth of an answer
 */
function assessTechnicalDepth(answer: string): number {
  const technicalTerms = [
    'algorithm', 'complexity', 'implementation', 'optimization', 'data structure',
    'function', 'method', 'class', 'object', 'variable', 'loop', 'condition',
    'database', 'query', 'server', 'client', 'API', 'framework', 'library'
  ];
  
  const answerWords = answer.toLowerCase().split(' ');
  const technicalWordCount = answerWords.filter(word => 
    technicalTerms.some(term => word.includes(term))
  ).length;
  
  return Math.min(technicalWordCount / 5, 1); // Normalize to 0-1 scale
}

/**
 * Generate improvement suggestions based on score and content
 */
function generateSuggestions(score: number, answer: string): string[] {
  const suggestions: string[] = [];
  
  if (score < 60) {
    suggestions.push("Provide more detailed explanations");
    suggestions.push("Include specific examples or use cases");
    suggestions.push("Address all parts of the question");
  } else if (score < 80) {
    suggestions.push("Add more technical depth to your answer");
    suggestions.push("Include relevant examples");
    suggestions.push("Improve the structure and flow");
  } else {
    suggestions.push("Excellent answer! Consider adding edge cases");
    suggestions.push("Great work on clarity and completeness");
  }
  
  if (answer.length < 50) {
    suggestions.push("Expand your answer with more details");
  }
  
  if (!answer.includes('example') && !answer.includes('for instance')) {
    suggestions.push("Include practical examples to illustrate your points");
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
}