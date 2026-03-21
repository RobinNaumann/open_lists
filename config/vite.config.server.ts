// filepath: vite.config.server.ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const reactPath = fileURLToPath(
  new URL("../node_modules/react", import.meta.url),
);
const reactDomPath = fileURLToPath(
  new URL("../node_modules/react-dom", import.meta.url),
);

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: reactPath,
      "react-dom": reactDomPath,
    },
  },
  build: {
    outDir: "dist/server",
    ssr: true,
    target: "node16",
    rollupOptions: {
      input: "./src/app.server.ts",
    },
  },
});
