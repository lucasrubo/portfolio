import { Hono } from "hono";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt";

const chatRoute = new Hono();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

function chatToGeminiMessages(messages: ChatMessage[]): GeminiMessage[] {
  return messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));
}

chatRoute.post("/chat", async (c) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY not configured");
    return c.json({ error: "API not configured" }, 500);
  }

  try {
    const body = await c.req.json<ChatRequest>();
    const { message, history = [] } = body;

    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    // Construir histórico com system prompt
    const contents: GeminiMessage[] = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Entendido! Sou o Aprix, assistente do Lucas Rubo. Estou pronto para ajudar os visitantes do portfolio. 😊",
          },
        ],
      },
      ...chatToGeminiMessages(history),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const geminiResponse = await fetch(
      `${GEMINI_API_URL}/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Gemini API Error:", errorData);
      return c.json({ error: "Gemini API error" }, 500);
    }

    const data = await geminiResponse.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return c.json({
        response: data.candidates[0].content.parts[0].text,
      });
    }

    return c.json({ error: "Invalid response format" }, 500);
  } catch (error) {
    console.error("Error in chat API:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export { chatRoute };
