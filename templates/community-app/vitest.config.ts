import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["ui/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.mjs"],
    // Strato ships ESM with .css imports: let Vite process them instead of Node.
    server: { deps: { inline: [/@dynatrace/] } },
  },
});
