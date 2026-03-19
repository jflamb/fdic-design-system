import { defineConfig } from "vitepress";

export default defineConfig({
  title: "FDIC Design System",
  description: "Placeholder documentation site for the FDIC design system.",
  base: "/fdic-design-system/",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "Components", link: "/components/" }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Overview", link: "/guide/" },
          { text: "Getting Started", link: "/guide/getting-started" }
        ]
      },
      {
        text: "Components",
        items: [
          { text: "Placeholder", link: "/components/placeholder" }
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/jflamb/fdic-design-system" }
    ]
  }
});

