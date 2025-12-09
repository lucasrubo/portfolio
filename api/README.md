# Aprix API

API do assistente virtual Aprix para o portfolio de Lucas Rubo.

## Tecnologias

- **Hono** - Framework web leve e rápido
- **Scalar** - Documentação OpenAPI interativa
- **TypeScript** - Tipagem estática

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`
Documentação em `http://localhost:3000/docs`

## Deploy no Vercel

1. Faça push do código para o GitHub
2. Importe o projeto no Vercel (selecione a pasta `api`)
3. Configure a variável de ambiente:
   - `GEMINI_API_KEY`: Sua chave da API do Gemini
4. Deploy!

## Endpoints

### POST /api/chat

Envia uma mensagem para o assistente Aprix.

**Request:**

```json
{
  "message": "Quem é o Lucas?",
  "history": []
}
```

**Response:**

```json
{
  "response": "Lucas Gabriel Rubo é um desenvolvedor..."
}
```

### GET /health

Health check da API.

### GET /docs

Documentação interativa (Scalar).

### GET /openapi.json

Schema OpenAPI em JSON.
