import { defineConfig, Plugin
 } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import manifest from "./manifest.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const viteManifestHackIssue846: Plugin & { renderCrxManifest: (manifest: any, bundle: any) => void } = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: 'manifestHackIssue846',
  renderCrxManifest(_manifest, bundle) {
      bundle['manifest.json'] = bundle['.vite/manifest.json']
      bundle['manifest.json'].fileName = 'manifest.json'
      delete bundle['.vite/manifest.json']
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  // compile src/service-worker.ts to dist/service-worker.js
  build: {
    minify: false,
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

  plugins: [react(), viteManifestHackIssue846, crx({ manifest })],
  server: {
    port: 3000,
  },
});