import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => {
  return {
    build: {
      outDir: "build",
      sourcemap: true,
      rollupOptions: {
        output: {
          sourcemapExcludeSources: true, // Ignore sources in node_modules
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    plugins: [
      react(),
      nodePolyfills({
        globals: {
          Buffer: mode === "production",
        },
      }),
    ],
    define:
      mode === "development"
        ? {
            global: {},
          }
        : undefined,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
