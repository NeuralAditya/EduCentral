import OpenAI from "openai";
import type { Express } from "express";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function registerAITutorRoutes(app: Express) {
  // AI Tutor chat endpoint
  app.post("/api/ai-tutor/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          error: "OpenAI API key not configured. Please add your OPENAI_API_KEY to the environment variables." 
        });
      }

      // Build conversation context
      const systemPrompt = `You are an expert AI programming tutor for EduCentral, specializing in:
- Data Structures and Algorithms (DSA)
- Programming languages (Python, Java, JavaScript)
- Software engineering concepts
- System design principles
- Code optimization and best practices

Your teaching style:
- Be encouraging and supportive
- Provide clear, step-by-step explanations
- Use examples and analogies when helpful
- Ask follow-up questions to gauge understanding
- Suggest practice problems when appropriate
- Keep responses concise but thorough
- Always focus on helping students learn and improve

If asked about non-programming topics, politely redirect to programming education.`;

      const messages = [
        { role: "system", content: systemPrompt },
        // Add recent conversation history for context
        ...(conversationHistory || []).slice(-5).map((msg: any) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

      res.json({ 
        response: aiResponse,
        model: "gpt-4o",
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("AI Tutor error:", error);
      
      if (error.code === 'insufficient_quota') {
        return res.status(429).json({ 
          error: "OpenAI API quota exceeded. Please check your OpenAI account billing." 
        });
      }
      
      if (error.code === 'invalid_api_key') {
        return res.status(401).json({ 
          error: "Invalid OpenAI API key. Please check your OPENAI_API_KEY configuration." 
        });
      }

      res.status(500).json({ 
        error: "Failed to get AI response. Please ensure OpenAI API key is properly configured.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Get available AI models endpoint
  app.get("/api/ai-tutor/models", async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          error: "OpenAI API key not configured" 
        });
      }

      const models = await openai.models.list();
      const availableModels = models.data
        .filter(model => model.id.includes('gpt'))
        .map(model => ({
          id: model.id,
          created: model.created,
          object: model.object
        }));

      res.json({ models: availableModels });
    } catch (error) {
      console.error("Error fetching models:", error);
      res.status(500).json({ error: "Failed to fetch available models" });
    }
  });

  // AI Tutor health check
  app.get("/api/ai-tutor/health", async (req, res) => {
    try {
      const hasApiKey = !!process.env.OPENAI_API_KEY;
      
      if (!hasApiKey) {
        return res.json({
          status: "error",
          message: "OpenAI API key not configured",
          configured: false
        });
      }

      // Test API connection with a simple request
      const testResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5,
      });

      res.json({
        status: "healthy",
        message: "AI Tutor is ready",
        configured: true,
        model: "gpt-4o",
        testResponse: testResponse.choices[0]?.message?.content
      });

    } catch (error: any) {
      console.error("Health check error:", error);
      res.json({
        status: "error",
        message: "OpenAI API connection failed",
        configured: true,
        error: error.message
      });
    }
  });
}