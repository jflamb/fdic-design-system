import { addons } from "storybook/manager-api";
import { themes } from "storybook/theming";

type StorybookTheme = "dark" | "light"

const STORYBOOK_THEME_QUERY_PARAM = "fdic-theme";
const STORYBOOK_THEME_GLOBAL = "theme";

const isStorybookTheme = (value: string | null): value is StorybookTheme =>
  value === "dark" || value === "light";

const getGlobalsTheme = (searchParams: URLSearchParams): StorybookTheme | null => {
  const globals = searchParams.get("globals");

  if (!globals) {
    return null;
  }

  for (const globalItem of globals.split(";")) {
    const [key, value] = globalItem.split(":");

    if (key === STORYBOOK_THEME_GLOBAL && isStorybookTheme(value ?? null)) {
      return value;
    }
  }

  return null;
};

const getRequestedTheme = (): StorybookTheme => {
  const searchParams = new URLSearchParams(window.location.search);
  const explicitTheme = searchParams.get(STORYBOOK_THEME_QUERY_PARAM);

  if (isStorybookTheme(explicitTheme)) {
    return explicitTheme;
  }

  return getGlobalsTheme(searchParams) ?? "light";
};

addons.setConfig({
  theme: getRequestedTheme() === "dark" ? themes.dark : themes.light,
});
