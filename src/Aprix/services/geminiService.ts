import type { ChatMessage } from "../types";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt";

// URL da API - projeto no Vercel
const VERCEL_API_URL =
  import.meta.env.VITE_VERCEL_API_URL ||
  "https://lucasrubo.vercel.app/api/chat";

// URL relativa - usada apenas em desenvolvimento local
const LOCAL_API_URL = "http://localhost:3000/api/chat";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

// Configuração de Rate Limiting
// gemini-2.5-flash: 5 RPM (requisições por minuto)
const RATE_LIMIT = {
  maxRequestsPerMinute: 5,
  minIntervalMs: 12000, // 60s / 5 = 12s entre requisições
  retryDelayMs: 60000, // 60s de espera se receber 429
};

interface ApiResponse {
  response?: string;
  error?: string;
}

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

/**
 * Serviço para comunicação com a API do Aprix (proxy para Gemini)
 * Inclui rate limiting e sistema de fila para respeitar limites da API
 */
class GeminiService {
  private apiKey: string;
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => void> = [];
  private isProcessingQueue: boolean = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  }

  /**
   * Retorna a URL da API correta baseado no ambiente
   */
  private getApiUrl(): string {
    if (typeof window === "undefined") return LOCAL_API_URL;

    const hostname = window.location.hostname;

    // Se está rodando no Vercel, usa URL relativa
    if (hostname.includes("vercel.app")) {
      return LOCAL_API_URL;
    }

    // Em qualquer outro lugar (GitHub Pages, etc), usa a URL completa do Vercel
    return VERCEL_API_URL;
  }

  /**
   * Verifica se deve usar a API do Vercel (sempre em produção, nunca em localhost sem env)
   */
  private shouldUseVercelApi(): boolean {
    if (typeof window === "undefined") return false;

    const hostname = window.location.hostname;

    // Em localhost, só usa Vercel API se tiver a env configurada
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return Boolean(import.meta.env.VITE_VERCEL_API_URL);
    }

    // Em produção (GitHub Pages, Vercel, etc), sempre usa a API do Vercel
    return true;
  }

  /**
   * Verifica se a API key está configurada (para desenvolvimento local)
   */
  private hasApiKey(): boolean {
    const hasKey = Boolean(this.apiKey && this.apiKey !== "your_api_key_here");
    return hasKey;
  }

  /**
   * Aguarda o tempo necessário para respeitar o rate limit
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const waitTime = RATE_LIMIT.minIntervalMs - timeSinceLastRequest;

    if (waitTime > 0) {
      console.log(
        `⏳ [RateLimit] Aguardando ${Math.ceil(
          waitTime / 1000
        )}s para próxima requisição...`
      );
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Utilitário para sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Converte mensagens do chat para formato do Gemini
   */
  private chatToGeminiMessages(messages: ChatMessage[]): GeminiMessage[] {
    return messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
  }

  /**
   * Reseta o histórico da conversa
   */
  resetHistory(): void {
    // Histórico é gerenciado pelo contexto, não pelo serviço
  }

  /**
   * Envia mensagem para a API e retorna a resposta
   */
  async sendMessage(
    userMessage: string,
    previousMessages: ChatMessage[] = []
  ): Promise<string> {
    // Em produção (GitHub Pages, Vercel), usa a API do Vercel
    if (this.shouldUseVercelApi()) {
      return this.callVercelApi(userMessage, previousMessages);
    }

    // Em desenvolvimento local, usa a API do Gemini diretamente se a chave estiver configurada
    if (this.hasApiKey()) {
      return this.callGeminiDirect(userMessage, previousMessages);
    }

    // Sem chave configurada, usa mock
    console.log("⚠️ [GeminiService] Sem API key! Usando resposta MOCK");
    console.log("⚠️ [GeminiService] Configure VITE_GEMINI_API_KEY no .env");
    return this.getMockResponse(userMessage);
  }

  /**
   * Chama a API route do Vercel (produção)
   */
  private async callVercelApi(
    userMessage: string,
    previousMessages: ChatMessage[]
  ): Promise<string> {
    const apiUrl = this.getApiUrl();

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: previousMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.response) {
        return data.response;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error calling Vercel API:", error);
      return this.getErrorResponse();
    }
  }

  /**
   * Chama o Gemini diretamente (desenvolvimento local)
   * Com rate limiting e retry automático em caso de 429
   */
  private async callGeminiDirect(
    userMessage: string,
    previousMessages: ChatMessage[],
    retryCount: number = 0
  ): Promise<string> {
    const MAX_RETRIES = 3;

    // Aguardar rate limit antes de fazer a requisição
    await this.waitForRateLimit();

    try {
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
        ...this.chatToGeminiMessages(previousMessages),
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ];

      const url = `${GEMINI_API_URL}/gemini-2.5-flash-lite:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
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
      });

      // Tratamento especial para 429 (Too Many Requests)
      if (response.status === 429) {
        if (retryCount < MAX_RETRIES) {
          const errorData = await response.json();
          // Extrair tempo de espera da mensagem de erro, ou usar padrão
          const retryMatch =
            errorData?.error?.message?.match(/retry in ([\d.]+)s/i);
          const waitSeconds = retryMatch ? parseFloat(retryMatch[1]) : 60;
          const waitMs = Math.ceil(waitSeconds * 1000) + 1000; // +1s de margem

          console.log(
            `⏳ [RateLimit] 429 recebido. Aguardando ${waitSeconds}s antes de retry ${
              retryCount + 1
            }/${MAX_RETRIES}...`
          );
          await this.sleep(waitMs);

          return this.callGeminiDirect(
            userMessage,
            previousMessages,
            retryCount + 1
          );
        } else {
          console.error("❌ [GeminiService] Max retries atingido para 429");
          return "Estou um pouco ocupado no momento. 😅 Por favor, aguarde alguns segundos e tente novamente!";
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ [GeminiService] Gemini API Error:", errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text;
        return responseText;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("❌ [GeminiService] Error calling Gemini API:", error);
      return this.getErrorResponse();
    }
  }

  /**
   * Resposta mock para desenvolvimento sem API
   */
  private getMockResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("olá") || lowerMessage.includes("oi")) {
      return "Olá! 👋 Sou o Aprix, assistente virtual do Lucas. Como posso ajudar você hoje?";
    }

    if (
      lowerMessage.includes("contato") ||
      lowerMessage.includes("email") ||
      lowerMessage.includes("linkedin")
    ) {
      return "Você pode entrar em contato com o Lucas através do LinkedIn ou enviando um email. Fique à vontade para explorar o portfolio! 📧";
    }

    if (
      lowerMessage.includes("habilidade") ||
      lowerMessage.includes("tecnologia") ||
      lowerMessage.includes("skill")
    ) {
      return "O Lucas trabalha com React, TypeScript, Node.js, Python e várias outras tecnologias modernas. Ele também tem experiência com Three.js para visualizações 3D, como você pode ver neste portfolio! 🚀";
    }

    if (
      lowerMessage.includes("projeto") ||
      lowerMessage.includes("trabalho") ||
      lowerMessage.includes("experiência")
    ) {
      return "O Lucas tem diversos projetos interessantes no portfolio. Navegue pela página para descobrir mais sobre cada um deles! 💼";
    }

    return `Interessante! 🤔 Ainda estou em desenvolvimento, mas em breve poderei responder melhor sobre isso. Por enquanto, você disse: "${userMessage}"`;
  }

  /**
   * Resposta de erro genérica
   */
  private getErrorResponse(): string {
    return "Ops! Tive um pequeno problema ao processar sua mensagem. 😅 Pode tentar novamente?";
  }
}

// Exportar instância única do serviço
export const geminiService = new GeminiService();
export default geminiService;
