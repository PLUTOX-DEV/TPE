import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // polyfill global
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // polyfill Buffer
          process: true, // also polyfill process if needed
        }),
      ],
    },
  },
  resolve: {
    alias: {
      buffer: "buffer/", // polyfill Buffer imports
      process: "process/browser", // optional if process needed
    },
  },
  define: {
    global: "globalThis",
  },
});
