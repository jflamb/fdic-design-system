import type { Preview } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../docs/.vitepress/theme/prose.css";
import "../../docs/.vitepress/theme/docs-utilities.css";

const preview: Preview = {
  decorators: [
    (story) => html`<div class="prose">${story()}</div>`
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
