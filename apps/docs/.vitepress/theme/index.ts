import DefaultTheme from "vitepress/theme";
import "@fdic-ds/components";
import "./tokens.css";
import "./prose.css";
import "./custom.css";

import type { Theme } from "vitepress";

const theme: Theme = {
  ...DefaultTheme
};

export default theme;
