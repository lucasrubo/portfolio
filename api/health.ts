import app from "./src/index";

export default async function handler(request: Request) {
  return app.fetch(request);
}