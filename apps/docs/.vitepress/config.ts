import { defineConfig } from "vitepress";

export default defineConfig({
  title: "FDIC Design System",
  description: "Placeholder documentation site for the FDIC design system.",
  base: "/fdic-design-system/",
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
          { text: "Accessibility", link: "/guide/accessibility" }
        ]
      },
      {
        text: "Foundations",
        items: [
          { text: "Overview", link: "/guide/foundations/" },
          { text: "Colors", link: "/guide/foundations/colors" },
          { text: "Typography", link: "/guide/foundations/typography" },
          { text: "Spacing and Layout", link: "/guide/foundations/spacing-layout" },
          { text: "Surfaces and Effects", link: "/guide/foundations/surfaces-effects" },
          { text: "Modes and Responsiveness", link: "/guide/foundations/modes" }
        ]
      },
      {
        text: "Components",
        items: [
          { text: "Overview", link: "/components/" },
          { text: "Icon", link: "/components/icon" },
          { text: "Button", link: "/components/button" },
          { text: "Button Group", link: "/components/button-group" },
          { text: "Checkbox", link: "/components/checkbox" },
          { text: "Checkbox Group", link: "/components/checkbox-group" },
          { text: "Radio", link: "/components/radio" },
          { text: "Radio Group", link: "/components/radio-group" },
          { text: "Label", link: "/components/label" },
          { text: "Selector", link: "/components/selector" },
          { text: "Split Button", link: "/components/split-button" },
          { text: "Menu", link: "/components/menu" },
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
