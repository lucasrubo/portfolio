import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SYSTEM_PROMPT } from "../src/Aprix/prompts/systemPrompt";
import crypto from "crypto";

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

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

function decrypt(encrypted: string, key: string, iv: string): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function chatToGeminiMessages(messages: ChatMessage[]): GeminiMessage[] {
  return messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptionIv = process.env.ENCRYPTION_IV;
  const encryptedApiKey = process.env.GEMINI_API_KEY_ENCRYPTED;

  if (!encryptionKey || !encryptionIv || !encryptedApiKey) {
    console.error("Encryption config not configured");
    return response.status(500).json({ error: "Encryption config missing" });
  }

  const apiKey = decrypt(encryptedApiKey, encryptionKey, encryptionIv);

  try {
    const { message, history = [] } = request.body as RequestBody;

    if (!message) {
      return response.status(400).json({ error: "Message is required" });
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
      `${GEMINI_API_URL}/gemini-2.5-flash-lite:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
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
      return response
        .status(geminiResponse.status)
        .json({ error: "Gemini API error" });
    }

    const data = await geminiResponse.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return response.status(200).json({
        response: data.candidates[0].content.parts[0].text,
      });
    }

    return response.status(500).json({ error: "Invalid response format" });
  } catch (error) {
    console.error("Error in chat API:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
