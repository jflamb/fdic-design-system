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
    existingConfig.optimizeDeps ??= {};
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
    const globalHeaderReferenceSource = resolve(
      import.meta.dirname,
      "../../../packages/components/src/components/fd-global-header.reference.ts"
    );
    const componentAliases = [
      {
        find: /^@fdic-ds\/components$/,
        replacement: componentIndexSource,
      },
      {
        find: /^@fdic-ds\/components\/fd-global-header-reference$/,
        replacement: globalHeaderReferenceSource,
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

    const optimizeDepsInclude = new Set(
      existingConfig.optimizeDeps.include ?? [],
    );
    optimizeDepsInclude.add("axe-core");
    optimizeDepsInclude.add("lit/directives/style-map.js");
    optimizeDepsInclude.add("lit/directives/repeat.js");
    existingConfig.optimizeDeps.include = [...optimizeDepsInclude];

    return existingConfig;
  },
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
};

export default config;
