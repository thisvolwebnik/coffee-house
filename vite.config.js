import { defineConfig } from "vite";
import { resolve } from "path";
import * as path from "node:path";

export default defineConfig({
  root: "src",
  base: "/coffee-house/",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@fonts": path.resolve(__dirname, "./src/assets/fonts"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    open: true,
  },
});
