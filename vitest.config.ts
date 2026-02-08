/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  // @ts-expect-error This is proper Vitest configuration as per official documentation
  test: {
    include: ["tests/unit/**/*.{test,spec}.{ts,js}"],
    exclude: ["tests/e2e/**/*"],
    environment: "node",
  },
});
