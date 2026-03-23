import { resolve } from "node:path";
import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.ts"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  async viteFinal(existingConfig) {
    existingConfig.resolve ??= {};
    const alias = existingConfig.resolve.alias;
    const componentIndexSource = resolve(
      import.meta.dirname,
      "../../../packages/components/src/index.ts"
    );
    const componentRootSource = resolve(
      import.meta.dirname,
      "../../../packages/components/src"
    );
    const registerAllSource = resolve(
      import.meta.dirname,
      "../../../packages/components/src/register/register-all.ts"
    );
    const componentAliases = [
      {
        find: /^@fdic-ds\/components$/,
        replacement: componentIndexSource,
      },
      {
        find: /^@fdic-ds\/components\/register-all$/,
        replacement: registerAllSource,
      },
      {
        find: /^@fdic-ds\/components\/(.*)$/,
        replacement: `${componentRootSource}/$1`,
      },
    ];

    if (Array.isArray(alias)) {
      alias.push(...componentAliases);
    } else {
      existingConfig.resolve.alias = [
        ...componentAliases,
        ...(alias ? Object.entries(alias).map(([find, replacement]) => ({
          find,
          replacement,
        })) : []),
      ];
    }

    return existingConfig;
  },
  addons: ["@storybook/addon-vitest"],
};

export default config;
