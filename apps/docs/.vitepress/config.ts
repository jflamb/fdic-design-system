import { defineConfig } from "vitepress";
import {
  componentSidebarGroups,
} from "./generated/component-navigation";

export default defineConfig({
  title: "FDIC Design System",
  description: "FDIC Design System documentation",
  base: process.env.VITEPRESS_BASE || "/fdic-design-system/",
  head: [
    [
      "script",
      {},
      `(()=>{const e=localStorage.getItem("vitepress-theme-appearance")||"auto",a=window.matchMedia("(prefers-color-scheme: dark)").matches,d=(!e||e==="auto")?a:e==="dark";!d&&document.documentElement.classList.add("light")})();`,
    ],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;1,400;1,600&display=swap",
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "Foundations", link: "/guide/foundations/" },
      { text: "Components", link: "/components/" }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Overview", link: "/guide/" },
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Browser Support", link: "/guide/browser-support" },
          { text: "Using Tokens", link: "/guide/using-tokens" },
          { text: "CMS Integration", link: "/guide/cms-integration" },
          { text: "Choosing a Component", link: "/guide/choosing-a-component" },
          { text: "Accessibility", link: "/guide/accessibility" },
          { text: "Form Workflows", link: "/guide/form-workflows" },
          {
            text: "Downstream References",
            collapsed: true,
            items: [
              { text: "CMS Filing", link: "/guide/cms-filing-reference" },
              { text: "Navigation Shell", link: "/guide/navigation-shell-reference" },
            ]
          }
        ]
      },
      {
        text: "Foundations",
        items: [
          { text: "Overview", link: "/guide/foundations/" },
          { text: "Colors", link: "/guide/foundations/colors" },
          { text: "Customization", link: "/guide/foundations/customization" },
          { text: "Typography", link: "/guide/foundations/typography" },
          { text: "Spacing and Layout", link: "/guide/foundations/spacing-layout" },
          { text: "Surfaces and Effects", link: "/guide/foundations/surfaces-effects" },
          { text: "Modes and Responsiveness", link: "/guide/foundations/modes" },
          { text: "Trust Patterns", link: "/guide/foundations/trust-patterns" }
        ]
      },
      {
        text: "Components",
        items: [
          { text: "Overview", link: "/components/" },
          ...componentSidebarGroups,
          {
            text: "Prose",
            items: [
              { text: "Overview", link: "/components/prose" },
              { text: "Callouts", link: "/components/callouts" },
              { text: "Tables", link: "/components/tables" },
              { text: "Code Blocks", link: "/components/code-blocks" },
              { text: "Details / Accordion", link: "/components/details" },
              { text: "Aside / Pull Quote", link: "/components/aside" },
              { text: "Table of Contents", link: "/components/table-of-contents" },
              { text: "Footnotes", link: "/components/footnotes" },
              { text: "Progress and Meter", link: "/components/progress-meter" }
            ]
          }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/jflamb/fdic-design-system" }
    ]
  }
});
