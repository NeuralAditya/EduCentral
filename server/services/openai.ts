import fetch from "node-fetch";

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

const PUTER_CHAT_URL = "http://puter.localhost:4100/api/chat"; // or a real endpoint if provided

async function puterChat(prompt: string): Promise<string> {
  const response = await fetch(PUTER_CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt, model: "gpt-4.1-nano" })
  });

  const data = await response.json();
  return data.response || data.text || "No response";
}

export async function assessVideoResponse(
  transcription: string,
  question: string,
  maxScore: number = 10
): Promise<VideoAssessmentResult> {
  const prompt = `
You are an expert educational assessor. Evaluate this student's **video response** to the question.

Question: ${question}
Student Response: ${transcription}
Max Score: ${maxScore}

Assess on:
- Speech Clarity (1–10)
- Content Accuracy (1–10)
- Use of Examples (1–10)
- Presentation Quality (1–10)

Respond ONLY in JSON:
{
  "overall_score": number,
  "feedback": string,
  "speech_clarity": number,
  "content_accuracy": number,
  "use_of_examples": number,
  "presentation_quality": number
}
`;

  const raw = await puterChat(prompt);
  const result = JSON.parse(raw);

  return {
    score: Math.min(maxScore, Math.max(0, result.overall_score || 0)),
    maxScore,
    feedback: result.feedback || "No feedback",
    criteria: {
      speechClarity: result.speech_clarity || 5,
      contentAccuracy: result.content_accuracy || 5,
      useOfExamples: result.use_of_examples || 5,
      presentationQuality: result.presentation_quality || 5,
    }
  };
}

export async function assessPhotoSubmission(
  base64Image: string,
  question: string,
  maxScore: number = 10
): Promise<PhotoAssessmentResult> {
  const prompt = `
You are an expert educational assessor. Evaluate this student's **photo submission**.

Question: ${question}
Image (base64, not shown here for brevity): [REDACTED]

Max Score: ${maxScore}

Assess on:
- Diagram Accuracy
- Proper Labeling
- Clarity
- Completeness

Respond ONLY in JSON:
{
  "overall_score": number,
  "feedback": string,
  "diagram_accuracy": number,
  "proper_labeling": number,
  "clarity": number,
  "completeness": number
}
`;

  const raw = await puterChat(prompt); // Note: image not sent yet; feature may not exist in Puter
  const result = JSON.parse(raw);

  return {
    score: Math.min(maxScore, Math.max(0, result.overall_score || 0)),
    maxScore,
    feedback: result.feedback || "No feedback",
    criteria: {
      diagramAccuracy: result.diagram_accuracy || 5,
      properLabeling: result.proper_labeling || 5,
      clarity: result.clarity || 5,
      completeness: result.completeness || 5,
    }
  };
}

export async function assessTextResponse(
  answer: string,
  question: string,
  correctAnswer?: string,
  maxScore: number = 10
): Promise<TextAssessmentResult> {
  const prompt = `
You are an expert educational assessor. Evaluate this student's **text response**.

Question: ${question}
Student Answer: ${answer}
${correctAnswer ? `Correct Answer: ${correctAnswer}` : ''}
Max Score: ${maxScore}

Respond ONLY in JSON:
{
  "score": number,
  "feedback": string,
  "key_points": [array of key points covered]
}
`;

  const raw = await puterChat(prompt);
  const result = JSON.parse(raw);

  return {
    score: Math.min(maxScore, Math.max(0, result.score || 0)),
    maxScore,
    feedback: result.feedback || "No feedback",
    keyPoints: result.key_points || [],
  };
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  // Not supported in Puter yet — if needed, use Whisper.js or HuggingFace
  return "Transcription not supported yet via Puter. Use another service.";
}
