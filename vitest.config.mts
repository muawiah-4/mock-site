import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirrors tsconfig `paths: { "@/*": ["./*"] }`.
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  // tsconfig uses `jsx: "preserve"` for Next; tests need Vite (oxc) to compile JSX itself.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
