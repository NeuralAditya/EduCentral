import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface VideoAssessmentResult {
  score: number;
  maxScore: number;
  feedback: string;
  criteria: {
    speechClarity: number;
    contentAccuracy: number;
    useOfExamples: number;
    presentationQuality: number;
  };
}

export interface PhotoAssessmentResult {
  score: number;
  maxScore: number;
  feedback: string;
  criteria: {
    diagramAccuracy: number;
    properLabeling: number;
    clarity: number;
    completeness: number;
  };
}

export interface TextAssessmentResult {
  score: number;
  maxScore: number;
  feedback: string;
  keyPoints: string[];
}

export async function assessVideoResponse(
  transcription: string,
  question: string,
  maxScore: number = 10
): Promise<VideoAssessmentResult> {
  try {
    const prompt = `
    You are an expert educational assessor. Evaluate this student's video response to the given question.
    
    Question: ${question}
    Student's Response (transcription): ${transcription}
    Maximum Score: ${maxScore}
    
    Assess the response based on these criteria (each out of 10):
    1. Speech Clarity - How clear and articulate was the student
    2. Content Accuracy - How accurate and correct was the content
    3. Use of Examples - How well did the student use examples
    4. Presentation Quality - Overall quality of presentation
    
    Provide your assessment in JSON format with:
    - overall_score (out of maxScore)
    - feedback (detailed feedback for improvement)
    - speech_clarity (1-10)
    - content_accuracy (1-10)
    - use_of_examples (1-10)
    - presentation_quality (1-10)
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational assessor. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      score: Math.min(maxScore, Math.max(0, result.overall_score || 0)),
      maxScore,
      feedback: result.feedback || "No feedback available",
      criteria: {
        speechClarity: Math.min(10, Math.max(1, result.speech_clarity || 5)),
        contentAccuracy: Math.min(10, Math.max(1, result.content_accuracy || 5)),
        useOfExamples: Math.min(10, Math.max(1, result.use_of_examples || 5)),
        presentationQuality: Math.min(10, Math.max(1, result.presentation_quality || 5)),
      }
    };
  } catch (error) {
    throw new Error("Failed to assess video response: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function assessPhotoSubmission(
  base64Image: string,
  question: string,
  maxScore: number = 10
): Promise<PhotoAssessmentResult> {
  try {
    const prompt = `
    You are an expert educational assessor. Evaluate this student's photo submission for the given question.
    
    Question: ${question}
    Maximum Score: ${maxScore}
    
    Assess the photo based on these criteria (each out of 10):
    1. Diagram Accuracy - How accurate is the diagram/content
    2. Proper Labeling - Are labels clear and correct
    3. Clarity - How clear and legible is the submission
    4. Completeness - How complete is the answer
    
    Provide your assessment in JSON format with:
    - overall_score (out of maxScore)
    - feedback (detailed feedback for improvement)
    - diagram_accuracy (1-10)
    - proper_labeling (1-10)
    - clarity (1-10)
    - completeness (1-10)
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational assessor. Respond only with valid JSON."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      score: Math.min(maxScore, Math.max(0, result.overall_score || 0)),
      maxScore,
      feedback: result.feedback || "No feedback available",
      criteria: {
        diagramAccuracy: Math.min(10, Math.max(1, result.diagram_accuracy || 5)),
        properLabeling: Math.min(10, Math.max(1, result.proper_labeling || 5)),
        clarity: Math.min(10, Math.max(1, result.clarity || 5)),
        completeness: Math.min(10, Math.max(1, result.completeness || 5)),
      }
    };
  } catch (error) {
    throw new Error("Failed to assess photo submission: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function assessTextResponse(
  answer: string,
  question: string,
  correctAnswer?: string,
  maxScore: number = 10
): Promise<TextAssessmentResult> {
  try {
    const prompt = `
    You are an expert educational assessor. Evaluate this student's text response.
    
    Question: ${question}
    Student's Answer: ${answer}
    ${correctAnswer ? `Correct Answer: ${correctAnswer}` : ''}
    Maximum Score: ${maxScore}
    
    Provide your assessment in JSON format with:
    - score (out of maxScore)
    - feedback (detailed feedback for improvement)
    - key_points (array of key points the student mentioned correctly)
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational assessor. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      score: Math.min(maxScore, Math.max(0, result.score || 0)),
      maxScore,
      feedback: result.feedback || "No feedback available",
      keyPoints: result.key_points || [],
    };
  } catch (error) {
    throw new Error("Failed to assess text response: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Convert buffer to a format OpenAI can accept
    const audioFile = new File([audioBuffer], "audio.wav", { type: "audio/wav" });
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    throw new Error("Failed to transcribe audio: " + (error instanceof Error ? error.message : String(error)));
  }
}
