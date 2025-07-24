import type { Express } from "express";
import multer from "multer";
import { analyzeEmotionFromText, analyzeSpeechQuality, assessContentQuality } from "../services/huggingface";

// Configure multer for video/audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for video files
  },
});

export function registerEnhancedAssessmentRoutes(app: Express) {
  // Enhanced video analysis endpoint
  app.post("/api/enhanced-assessment/analyze-video", upload.single('video'), async (req, res) => {
    try {
      const { questionId, transcript, emotionData, facialData, duration } = req.body;
      const videoFile = req.file;

      if (!videoFile || !transcript) {
        return res.status(400).json({ error: "Video file and transcript are required" });
      }

      // Analyze emotion from transcript
      const emotionAnalysis = await analyzeEmotionFromText(transcript);

      // Analyze speech quality
      const speechAnalysis = await analyzeSpeechQuality(transcript, parseFloat(duration) || 60);

      // Get question details for content assessment
      const question = req.body.question || "General assessment";
      const contentAssessment = await assessContentQuality(question, transcript);

      // Combine all analyses for final score
      const finalScore = calculateEnhancedScore({
        contentScore: contentAssessment.content_score,
        emotionConfidence: emotionAnalysis.confidence * 100,
        speechClarity: speechAnalysis.speech_quality.clarity * 100,
        facialConfidence: emotionData?.facial_score || 70
      });

      const result = {
        overall_score: finalScore,
        content_analysis: contentAssessment,
        emotion_analysis: emotionAnalysis,
        speech_analysis: speechAnalysis,
        facial_analysis: {
          emotion: emotionData?.emotion || 'neutral',
          confidence: emotionData?.confidence || 0.7,
          facial_score: emotionData?.facial_score || 70
        },
        video_metadata: {
          duration: parseFloat(duration) || 60,
          file_size: videoFile.size,
          format: videoFile.mimetype
        },
        assessment_timestamp: new Date().toISOString(),
        feedback: generateEnhancedFeedback(finalScore, {
          content: contentAssessment,
          emotion: emotionAnalysis,
          speech: speechAnalysis
        })
      };

      res.json(result);
    } catch (error) {
      console.error('Error in enhanced video analysis:', error);
      res.status(500).json({ error: "Failed to analyze video response" });
    }
  });

  // Real-time emotion analysis endpoint
  app.post("/api/enhanced-assessment/analyze-emotion", async (req, res) => {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: "Text is required for emotion analysis" });
      }

      const emotionAnalysis = await analyzeEmotionFromText(text);
      res.json(emotionAnalysis);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      res.status(500).json({ error: "Failed to analyze emotion" });
    }
  });

  // Speech quality analysis endpoint
  app.post("/api/enhanced-assessment/analyze-speech", async (req, res) => {
    try {
      const { transcript, duration } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
      }

      const speechAnalysis = await analyzeSpeechQuality(transcript, parseFloat(duration) || 60);
      res.json(speechAnalysis);
    } catch (error) {
      console.error('Error analyzing speech:', error);
      res.status(500).json({ error: "Failed to analyze speech quality" });
    }
  });

  // Content assessment endpoint
  app.post("/api/enhanced-assessment/assess-content", async (req, res) => {
    try {
      const { question, answer, expectedAnswer } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ error: "Question and answer are required" });
      }

      const contentAssessment = await assessContentQuality(question, answer, expectedAnswer);
      res.json(contentAssessment);
    } catch (error) {
      console.error('Error assessing content:', error);
      res.status(500).json({ error: "Failed to assess content quality" });
    }
  });

  // Get assessment summary
  app.get("/api/enhanced-assessment/summary/:attemptId", async (req, res) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      
      // This would fetch the complete assessment data from database
      // For now, return a mock summary structure
      const summary = {
        attempt_id: attemptId,
        overall_performance: {
          total_score: 85,
          content_score: 80,
          delivery_score: 88,
          confidence_score: 87
        },
        detailed_analysis: {
          strengths: [
            "Clear and articulate speech delivery",
            "Good technical understanding demonstrated",
            "Confident body language and facial expressions"
          ],
          areas_for_improvement: [
            "Include more specific examples",
            "Improve pacing - slightly fast delivery",
            "Add more technical depth to explanations"
          ]
        },
        emotional_analysis: {
          dominant_emotion: "confident",
          emotion_consistency: 0.82,
          stress_indicators: "low"
        },
        speech_analysis: {
          clarity: 88,
          pace: "slightly_fast",
          volume: "appropriate",
          filler_words: 3
        },
        recommendations: [
          "Practice with more technical examples",
          "Focus on slower, more deliberate delivery",
          "Continue building on strong foundational knowledge"
        ],
        generated_at: new Date().toISOString()
      };

      res.json(summary);
    } catch (error) {
      console.error('Error generating assessment summary:', error);
      res.status(500).json({ error: "Failed to generate assessment summary" });
    }
  });
}

// Helper function to calculate enhanced score
function calculateEnhancedScore(metrics: {
  contentScore: number;
  emotionConfidence: number;
  speechClarity: number;
  facialConfidence: number;
}): number {
  const weights = {
    content: 0.5,      // 50% content
    emotion: 0.15,     // 15% emotion confidence
    speech: 0.20,      // 20% speech clarity
    facial: 0.15       // 15% facial confidence
  };

  const weightedScore = 
    (metrics.contentScore * weights.content) +
    (metrics.emotionConfidence * weights.emotion) +
    (metrics.speechClarity * weights.speech) +
    (metrics.facialConfidence * weights.facial);

  return Math.round(Math.min(Math.max(weightedScore, 0), 100));
}

// Helper function to generate comprehensive feedback
function generateEnhancedFeedback(score: number, analyses: any): string {
  const { content, emotion, speech } = analyses;
  
  let feedback = `Overall Performance: ${score}/100\n\n`;
  
  if (score >= 90) {
    feedback += "Exceptional performance! ";
  } else if (score >= 80) {
    feedback += "Strong performance with room for minor improvements. ";
  } else if (score >= 70) {
    feedback += "Good foundation with several areas for development. ";
  } else {
    feedback += "Significant room for improvement. ";
  }

  feedback += `\n\nContent Quality: ${content.feedback}\n`;
  feedback += `Emotional Presentation: You appeared ${emotion.emotion} with ${Math.round(emotion.confidence * 100)}% confidence.\n`;
  feedback += `Speech Delivery: Your tone was ${speech.tone_analysis.tone} with ${Math.round(speech.speech_quality.clarity * 100)}% clarity.\n`;

  if (content.suggestions.length > 0) {
    feedback += `\nKey Suggestions:\n${content.suggestions.map(s => `• ${s}`).join('\n')}`;
  }

  return feedback;
}