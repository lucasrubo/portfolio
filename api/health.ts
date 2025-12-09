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