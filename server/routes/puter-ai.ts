import type { Express } from "express";

export function registerPuterAIRoutes(app: Express) {
  // Puter.js AI chat endpoint (proxy for client-side calls)
  app.post("/api/puter-ai/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Since Puter.js works client-side, we return a success response
      // The actual AI call will be made from the frontend using Puter.js
      res.json({ 
        success: true,
        message: "Puter.js AI integration ready",
        timestamp: new Date().toISOString(),
        note: "AI processing will be handled client-side with Puter.js"
      });

    } catch (error: any) {
      console.error("Puter AI proxy error:", error);
      res.status(500).json({ 
        error: "Puter AI proxy error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Health check for Puter.js integration
  app.get("/api/puter-ai/health", async (req, res) => {
    try {
      res.json({
        status: "healthy",
        message: "Puter.js AI integration is ready",
        integration: "client-side",
        features: [
          "Free OpenAI GPT-4o access",
          "No API keys required",
          "Image generation with DALL-E",
          "Text-to-speech capabilities",
          "400+ AI models available"
        ],
        documentation: "https://developer.puter.com/tutorials/free-unlimited-openai-api/"
      });
    } catch (error) {
      console.error("Puter health check error:", error);
      res.status(500).json({ 
        error: "Health check failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get available models endpoint
  app.get("/api/puter-ai/models", async (req, res) => {
    try {
      const availableModels = [
        {
          id: "gpt-4o",
          name: "GPT-4o",
          description: "Most capable OpenAI model",
          provider: "OpenAI"
        },
        {
          id: "gpt-4.1-nano",
          name: "GPT-4.1 Nano",
          description: "Fast and efficient model",
          provider: "OpenAI"
        },
        {
          id: "gpt-4.1-mini",
          name: "GPT-4.1 Mini",
          description: "Balanced performance model",
          provider: "OpenAI"
        },
        {
          id: "o1",
          name: "OpenAI o1",
          description: "Advanced reasoning model",
          provider: "OpenAI"
        },
        {
          id: "o1-mini",
          name: "OpenAI o1 Mini",
          description: "Efficient reasoning model",
          provider: "OpenAI"
        },
        {
          id: "claude-3-sonnet",
          name: "Claude 3 Sonnet",
          description: "Anthropic's balanced model",
          provider: "Anthropic",
          openrouter: "openrouter:anthropic/claude-3-sonnet"
        },
        {
          id: "llama-3.1-8b",
          name: "Llama 3.1 8B",
          description: "Meta's open-source model",
          provider: "Meta",
          openrouter: "openrouter:meta-llama/llama-3.1-8b-instruct"
        }
      ];

      res.json({ models: availableModels });
    } catch (error) {
      console.error("Error fetching Puter models:", error);
      res.status(500).json({ error: "Failed to fetch available models" });
    }
  });
}