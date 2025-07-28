import type { Express } from "express";

// 👇 Updated Puter local server endpoint
const PUTER_API_URL = "http://puter.localhost:4100/api/chat";

// Teaching behavior for the AI tutor
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

export function registerAITutorRoutes(app: Express) {
  // 💬 AI Tutor Chat Endpoint
  app.post("/api/ai-tutor/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // ⏳ Build conversation with system prompt and recent history
      const messages = [
        { role: "system", content: systemPrompt },
        ...(conversationHistory || []).slice(-5).map((msg: any) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content
        })),
        { role: "user", content: message }
      ];

      const response = await fetch(PUTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) {
        throw new Error(`Puter response error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.reply || "Sorry, I couldn't generate a response. Please try again.";

      res.json({
        response: aiResponse,
        model: "puter",
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("AI Tutor error (Puter):", error.message);
      res.status(500).json({
        error: "Failed to get AI response from Puter",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  });

  // 🧠 Model Info (static, since Puter doesn't expose multiple models)
  app.get("/api/ai-tutor/models", (_req, res) => {
    res.json({
      models: [
        {
          id: "puter",
          object: "model",
          created: Date.now()
        }
      ]
    });
  });

  // ❤️ Health Check Endpoint
  app.get("/api/ai-tutor/health", async (_req, res) => {
    try {
      const response = await fetch(PUTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] })
      });

      const data = await response.json();

      res.json({
        status: "healthy",
        backend: "puter",
        reply: data.reply,
        configured: true
      });
    } catch (error: any) {
      console.error("Health check error:", error.message);
      res.json({
        status: "error",
        message: "Puter server is not reachable",
        error: error.message
      });
    }
  });
}
