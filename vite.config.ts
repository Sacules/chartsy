import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: resolve(__dirname, "./src/components"),
      },
      {
        find: "@contexts",
        replacement: resolve(__dirname, "./src/contexts"),
      },
      {
        find: "@entities",
        replacement: resolve(__dirname, "./src/entities"),
      },
      {
        find: "@services",
        replacement: resolve(__dirname, "./src/services"),
      },
    ],
  },
});
