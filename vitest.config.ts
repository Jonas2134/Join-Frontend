import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "happy-dom",
      include: ["src/**/__tests__/**/*.test.ts"],
      setupFiles: ["./tests/helpers/setup.ts"],
      coverage: {
        provider: "v8",
        include: ["src/**/*.ts"],
        exclude: [
          "src/**/*.config.ts",
          "src/**/__tests__/**",
          "src/css/**",
          "src/main.ts",
        ],
      },
    },
  }),
);
