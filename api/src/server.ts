import { config } from "dotenv";
import { serve } from "@hono/node-server";
import app from "./index";

// Load environment variables
config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`🚀 Aprix API rodando em http://localhost:${port}`);
console.log(`📚 Documentação em http://localhost:${port}/docs`);

serve({
  fetch: app.fetch,
  port,
});
