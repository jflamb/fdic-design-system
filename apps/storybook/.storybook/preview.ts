import "../src/storybook-test-runtime";
import type { Preview } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../../packages/components/styles.css";
import "../../docs/.vitepress/theme/tokens.css";
import "../../docs/.vitepress/theme/prose.css";
import "../../docs/.vitepress/theme/docs-utilities.css";
import "./preview-theme.css";

type StorybookTheme = "dark" | "light";

const EMBED_THEME_QUERY_PARAM = "fdic-theme";
const STORYBOOK_THEME_GLOBAL = "theme";
const STORYBOOK_THEME_MESSAGE_TYPE = "fdic-theme-change";

const isStorybookTheme = (value: unknown): value is StorybookTheme =>
  value === "dark" || value === "light";

const getGlobalsTheme = (): StorybookTheme | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const globals = new URLSearchParams(window.location.search).get("globals");

  if (!globals) {
    return null;
  }

  for (const globalItem of globals.split(";")) {
    const [key, value] = globalItem.split(":");

    if (key === STORYBOOK_THEME_GLOBAL && isStorybookTheme(value)) {
      return value;
    }
  }

  return null;
};

const getRequestedEmbedTheme = (): StorybookTheme | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const theme = new URLSearchParams(window.location.search).get(EMBED_THEME_QUERY_PARAM);

  if (isStorybookTheme(theme)) {
    return theme;
  }

  return getGlobalsTheme();
};

const applyEmbedTheme = (theme: StorybookTheme = "light"): void => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
  body.classList.toggle("dark", isDark);
  body.classList.toggle("light", !isDark);

  root.style.colorScheme = isDark ? "dark" : "light";
  body.style.colorScheme = isDark ? "dark" : "light";
};

if (typeof window !== "undefined") {
  const isVitestBrowserRun = Boolean(
    (globalThis as { __vitest_worker__?: { ctx?: { pool?: unknown } } }).__vitest_worker__?.ctx
      ?.pool,
  );
  const _originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : String(args[0] ?? "");
    _originalWarn.apply(console, args);

    if (isVitestBrowserRun) {
      throw new Error(`Unexpected console.warn during Storybook browser test: ${msg}`);
    }
  };

  const _originalError = console.error;
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : String(args[0] ?? "");
    _originalError.apply(console, args);

    if (isVitestBrowserRun) {
      throw new Error(`Unexpected console.error during Storybook browser test: ${msg}`);
    }
  };

  window.addEventListener("message", (event: MessageEvent<unknown>) => {
    const data = event.data;

    if (
      typeof data !== "object" ||
      data === null ||
      !("type" in data) ||
      !("theme" in data) ||
      data.type !== STORYBOOK_THEME_MESSAGE_TYPE ||
      !isStorybookTheme(data.theme)
    ) {
      return;
    }

    applyEmbedTheme(data.theme);
  });
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme for embedded docs examples",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: getRequestedEmbedTheme() ?? "light",
  },
  decorators: [
    (story, context) => {
      const activeTheme = isStorybookTheme(context.globals.theme)
        ? context.globals.theme
        : getRequestedEmbedTheme() ?? "light";

      applyEmbedTheme(activeTheme);
      return html`<div class="prose">${story()}</div>`;
    }
  ],
  parameters: {
    options: {
      storySort: {
        order: ["Prose", "Components", "Supporting Primitives"]
      }
    },
    a11y: {
      // Stories opt into browser accessibility audits explicitly so the repo
      // can validate coverage file-by-file without depending on a fragile
      // global addon-vitest default.
      test: "todo",
    }
  }
};

export default preview;
