import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const reactPath = fileURLToPath(
  new URL("../node_modules/react", import.meta.url),
);
const reactDomPath = fileURLToPath(
  new URL("../node_modules/react-dom", import.meta.url),
);

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: reactPath,
      "react-dom": reactDomPath,
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: "./index.html",
    },
  },
});
