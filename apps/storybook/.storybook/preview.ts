import type { Preview } from "@storybook/web-components-vite";
import { html } from "lit";
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
  body.classList.toggle("dark", isDark);

  root.style.colorScheme = isDark ? "dark" : "light";
  body.style.colorScheme = isDark ? "dark" : "light";
};

if (typeof window !== "undefined") {
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
      // Enable the accessibility panel by default without turning findings into
      // CI blockers yet. Contributor guidance defines the human review bar.
      test: "todo",
    }
  }
};

export default preview;
