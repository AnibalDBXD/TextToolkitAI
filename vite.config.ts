import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import manifest from "./manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  // compile src/service-worker.ts to dist/service-worker.js
  build: {
    rollupOptions: {
      input: {
        serviceWorker: "src/service-worker.ts",
      },
      output: {
        entryFileNames: "service-worker.js",
      },
      external: ["/src/main.tsx"],
    },
  },
  plugins: [react(), crx({ manifest })],
  server: {
    port: 3000,
  },
});