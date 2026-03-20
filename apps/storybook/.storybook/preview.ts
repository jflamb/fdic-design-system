import type { Preview } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../docs/.vitepress/theme/prose.css";

const preview: Preview = {
  decorators: [
    (story) => html`<div class="prose">${story()}</div>`
  ],
  parameters: {
    options: {
      storySort: {
        order: ["Prose", "Components"]
      }
    }
  }
};

export default preview;
