import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { DOCS_OVERVIEW_STACK_STYLE } from "./docs-overview";

type CodeBlockArgs = {
  code: string;
  language: string;
  showCopyButton: boolean;
};

const meta = {
  title: "Prose/Code Block",
  tags: ["autodocs"],
  argTypes: {
    code: { control: "text" },
    language: { control: "text" },
    showCopyButton: { control: "boolean" }
  },
  args: {
    code: `.prose {
  max-width: var(--prose-max-width, 65ch);
  line-height: var(--fdic-line-height-body, 1.5);
  color: var(--fdic-color-text-primary, #212123);
}`,
    language: "css",
    showCopyButton: false
  },
  render: (args: CodeBlockArgs) => html`
    <pre style=${args.showCopyButton ? "position: relative;" : ""}><code
        class=${`language-${args.language}`}
      >${args.code}</code>${args.showCopyButton
        ? html`<button
            class="prose-copy-btn"
            type="button"
            aria-label="Copy code to clipboard"
          >Copy</button>`
        : ""}</pre>
  `
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCopy: Story = {
  args: {
    showCopyButton: true
  }
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_STACK_STYLE}>
      <pre><code class="language-css">.prose {
  max-width: var(--prose-max-width, 65ch);
  line-height: var(--fdic-line-height-body, 1.5);
  color: var(--fdic-color-text-primary, #212123);
}</code></pre>

      <pre style="position: relative;"><code class="language-bash">npm run build
npm run test:components
npm run build:docs</code><button
          class="prose-copy-btn"
          type="button"
          aria-label="Copy code to clipboard"
        >Copy</button></pre>
    </div>
  `
};
