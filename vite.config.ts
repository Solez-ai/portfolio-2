import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      "/api/github-contributions": {
        target: "https://github-contributions.vercel.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/github-contributions/, "/api/v1"),
      },
    },
  },
});
