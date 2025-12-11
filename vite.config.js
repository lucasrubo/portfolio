import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/lucasrubo",
  server: {
    host: "::",
    port: 8080,
    ...(mode === "development" && {
      proxy: {
        "/api": {
          target: "https://aprix-five.vercel.app",
          changeOrigin: true,
          secure: true,
        },
        "/health": {
          target: "https://aprix-five.vercel.app",
          changeOrigin: true,
          secure: true,
        },
      },
    }),
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
