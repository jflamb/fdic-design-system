import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.ts"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  async viteFinal(existingConfig) {
    existingConfig.resolve ??= {};
    const alias = existingConfig.resolve.alias;
    const componentSource = resolve(
      import.meta.dirname,
      "../../../packages/components/src/index.ts"
    );

    if (Array.isArray(alias)) {
      alias.push({
        find: "@fdic-ds/components",
        replacement: componentSource
      });
    } else {
      existingConfig.resolve.alias = {
        ...(alias ?? {}),
        "@fdic-ds/components": componentSource
      };
    }

    return existingConfig;
  }
};

export default config;
