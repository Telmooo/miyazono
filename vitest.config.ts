/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/unit/**/*.{test,spec}.{ts,js}"],
    exclude: ["tests/e2e/**/*"],
    environment: "node",
  },
});
