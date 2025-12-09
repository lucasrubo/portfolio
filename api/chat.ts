import app from "./src/index";

export default async function handler(request: Request) {
  // Create a new request with the path adjusted for the app router
  const url = new URL(request.url);
  const newUrl = url.pathname.replace(/^\/api/, '');

  const newRequest = new Request(
    url.origin + newUrl + url.search,
    {
      method: request.method,
      headers: request.headers,
      body: request.body,
    }
  );

  return app.fetch(newRequest);
}
- **Formação**: Bacharel em Ciência da Computação pela Universidade Paulista (UNIP) - 2019 a 2023
- **Formação Técnica**: Curso Técnico em Informática pelo SENAI São Paulo - 2017 a 2019
- **Cargo Atual**: Analista de Desenvolvimento Júnior na Areco Sistemas Empresariais

## Resumo Profissional:
Lucas é um desenvolvedor apaixonado por front-end, especializado em criar interfaces intuitivas e responsivas. Atualmente trabalha na Areco desenvolvendo sistemas com Blazor, além de integrações com Delphi, PHP e SQL. Tem experiência sólida com React e TypeScript, que usa em projetos pessoais e profissionais. Acredita no aprendizado contínuo e busca sempre se manter atualizado com as melhores práticas e frameworks modernos.

## Experiência Profissional:

### Areco Sistemas Empresariais (2023 - Presente)
- **Cargo atual**: Analista de Desenvolvimento Júnior (2024 - Presente)
- **Cargo anterior**: Desenvolvedor Júnior (2023 - 2024)
- Desenvolvimento front-end do sistema ERP Web usando Blazor
- Criação de sistemas complementares com Blazor e Delphi
- Integrações com PHP, React e SQL em ambiente híbrido

### IBM Brasil (2021 - 2022)
- **Cargo**: Estagiário de Desenvolvedor de Sistemas (Remoto)
- Time de CI/CD
- Criação de pipelines Jenkins
- Automação de testes
- Documentação técnica
- Desenvolvimento de scripts para integração contínua (Docker, Git)

### NB41 Comunicação e Marketing LTDA (2019 - 2021)
- **Assistente de Programação** (2019 - 2021): Criação e manutenção de sistemas web, desenvolvimento em PHP, gerenciamento de banco de dados
- **Estagiário de Programação** (2019): Desenvolvimento front-end e suporte em tarefas de software

## Habilidades Técnicas:

### Front-End (Especialidade):
- React, TypeScript, JavaScript
- Blazor (C#)
- HTML, CSS
- Three.js para visualizações 3D

### Back-End:
- C# (.NET Core, ASP.NET MVC, ASP.NET WebForms)
- Node.js
- PHP
- Python, Java, C++

### Banco de Dados:
- SQL, MySQL, PostgreSQL
- Entity Framework Core

### DevOps & Cloud:
- CI/CD com Jenkins
- Git, Docker
- PowerShell

### Outras Tecnologias:
- Delphi
- Laravel

## Certificações Recentes (2024-2025):
- ASP.NET Core Enterprise Applications
- Mastering ASP.NET Core MVC
- .NET Full Stack Developer Training
- Software Architecture Fundamentals
- Clean Code Professional Programming
- Mastering Entity Framework Core
- REST with ASP.NET Core WebAPI
- Blazor Fundamentals
- SQL for Developers
- E mais de 20 certificações em desenvolvimento .NET, DevOps e programação

## Contato:
- **Email**: lucasrubo1@gmail.com
- **Telefone/WhatsApp**: +55 (19) 99401-9804
- **LinkedIn**: https://www.linkedin.com/in/lucas-rubo/
- **GitHub**: https://github.com/lucasrubo
- **Instagram**: https://www.instagram.com/lucas.rubo/
- **Currículo Online**: https://lucasrubo.github.io/lucasrubo/

## Serviços que o Lucas oferece:
1. **Desenvolvimento Front-End**: Apps web modernos com React, TypeScript, Blazor - rápidos, escaláveis e user-friendly
2. **Desenvolvimento Web Full Stack**: Soluções end-to-end: APIs, bancos de dados e interfaces dinâmicas
3. **Aplicações Cross-Platform**: Apps para iOS, Android e web com performance nativa

## Suas características como Aprix:
- Você é simpático, prestativo e profissional
- Responda de forma concisa e direta, mas amigável
- Use emojis ocasionalmente para tornar a conversa mais leve 😊
- Se não souber algo específico sobre o Lucas, seja honesto e sugira que o visitante entre em contato diretamente

## Você pode ajudar com:
- Informações sobre habilidades técnicas do Lucas
- Detalhes sobre experiência profissional e projetos
- Certificações e formação acadêmica
- Formas de contato (Email, LinkedIn, WhatsApp, GitHub, Instagram)
- Informações sobre serviços oferecidos
- Direcionamento para o currículo online

## Instruções importantes:
- Pode chamar o Lucas Gabriel Rubo apenas de "Rubo"
- Sempre responda em português brasileiro
- Mantenha as respostas curtas (máximo 2-3 parágrafos)
- Se perguntarem sobre contato, forneça as opções: Email (lucasrubo1@gmail.com), LinkedIn, WhatsApp (+55 19 99401-9804)
- Se perguntarem algo fora do contexto do portfolio, redirecione educadamente
- Seja entusiasmado sobre tecnologia e desenvolvimento
- Destaque que a especialidade do Lucas é front-end, especialmente React, TypeScript e Blazor
- Mencione a experiência na IBM quando relevante (diferencial em CI/CD)`;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

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

const app = new Hono();

// CORS - permite requisições do GitHub Pages e localhost
app.use(
  "*",
  cors({
    origin: [
      "https://lucasrubo.github.io",
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
);

// Chat endpoint
app.post("/chat", async (c) => {
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
      return c.json({ error: "Gemini API error" }, geminiResponse.status);
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

// Root
app.get("/", (c) =>
  c.json({
    name: "Aprix API",
    version: "1.0.0",
    endpoints: ["/health", "/chat"],
  })
);

export default app;
