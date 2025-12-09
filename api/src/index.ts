import { Hono } from "hono";
import { cors } from "hono/cors";
import { apiReference } from "@scalar/hono-api-reference";
import { chatRoute } from "./routes/chat";

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

// OpenAPI Schema
const openApiSchema = {
  openapi: "3.0.0",
  info: {
    title: "Aprix API",
    version: "1.0.0",
    description: "API do assistente Aprix para o portfolio de Lucas Rubo",
  },
  servers: [
    {
      url: "https://lucasrubo.vercel.app",
      description: "Produção",
    },
    {
      url: "http://localhost:3000",
      description: "Desenvolvimento",
    },
  ],
  paths: {
    "/api/chat": {
      post: {
        summary: "Enviar mensagem para o Aprix",
        description:
          "Envia uma mensagem para o assistente e recebe uma resposta",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: {
                    type: "string",
                    description: "Mensagem do usuário",
                    example: "Quem é o Lucas?",
                  },
                  history: {
                    type: "array",
                    description: "Histórico de mensagens anteriores",
                    items: {
                      type: "object",
                      properties: {
                        role: {
                          type: "string",
                          enum: ["user", "assistant"],
                        },
                        content: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Resposta do assistente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    response: {
                      type: "string",
                      description: "Resposta do Aprix",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Requisição inválida",
          },
          "500": {
            description: "Erro interno do servidor",
          },
        },
      },
    },
    "/health": {
      get: {
        summary: "Health Check",
        description: "Verifica se a API está funcionando",
        responses: {
          "200": {
            description: "API funcionando",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "ok",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Documentação Scalar
app.get(
  "/docs",
  apiReference({
    content: openApiSchema,
    theme: "purple",
  })
);

// OpenAPI JSON
app.get("/openapi.json", (c) => c.json(openApiSchema));

// Health check
app.get("/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
);

// Rotas da API
app.route("/api", chatRoute);

// Root
app.get("/", (c) =>
  c.json({
    name: "Aprix API",
    version: "1.0.0",
    docs: "/docs",
  })
);

export default app;
