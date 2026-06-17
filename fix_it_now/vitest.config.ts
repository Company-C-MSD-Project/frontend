import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Standalone Vitest config — intentionally does NOT load the TanStack Start /
// Cloudflare dev plugins from vite.config.ts, so unit tests run in a fast, plain
// jsdom environment with just React + the "@/" path alias.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Keep the maps key empty so the AddressAutocomplete fallback path is testable
    // without loading the Google Maps SDK.
    env: {
      VITE_GOOGLE_MAPS_API_KEY: "",
    },
  },
});
