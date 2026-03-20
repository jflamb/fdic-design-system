import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

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
  color: var(--fdic-text-primary, #212123);
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
