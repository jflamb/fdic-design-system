import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));
const shouldCollectTraces = process.env.STORYBOOK_TEST_TRACE === "true";
const traceArtifactsDir = path.resolve(dirname, "../../playwright-report");

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: [".storybook/**/*.test.ts"],
          browser: {
            enabled: false,
          },
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
            trace: shouldCollectTraces
              ? {
                  mode: "retain-on-failure",
                  tracesDir: traceArtifactsDir,
                  screenshots: true,
                  snapshots: true,
                  sources: true,
                }
              : { mode: "off" },
          },
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.test.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
            trace: shouldCollectTraces
              ? {
                  mode: "retain-on-failure",
                  tracesDir: traceArtifactsDir,
                  screenshots: true,
                  snapshots: true,
                  sources: true,
                }
              : { mode: "off" },
          },
        },
      },
    ],
  },
});
