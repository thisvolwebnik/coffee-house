import { defineConfig } from "vite";
import { resolve } from "path";
import * as path from "node:path";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        // eslint-disable-next-line no-undef
        main: resolve(__dirname, "src/index.html"),
      },
    },
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
      // eslint-disable-next-line no-undef
      "@fonts": path.resolve(__dirname, "./src/assets/fonts"),
      // eslint-disable-next-line no-undef
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
