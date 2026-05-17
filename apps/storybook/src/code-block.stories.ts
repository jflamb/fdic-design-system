import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import { DOCS_OVERVIEW_STACK_CLASS } from "./docs-overview";

type CodeBlockArgs = {
  code: string;
  language: string;
  showCopyButton: boolean;
};

const copyResetDelay = 1800;

async function copyCodeBlock(event: Event) {
  const button = event.currentTarget as HTMLButtonElement;
  const pre = button.closest("pre");
  const code = pre?.querySelector("code");
  const status = pre?.querySelector<HTMLElement>("[data-copy-status]");
  const text = code?.textContent ?? "";

  if (!text) return;

  try {
    if (typeof navigator.clipboard?.writeText !== "function") {
      throw new Error("Clipboard API unavailable");
    }

    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.insetBlockStart = "-9999px";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  button.textContent = "Copied";
  button.classList.add("prose-copy-btn-success");
  button.setAttribute("aria-label", "Code copied to clipboard");

  if (status) {
    status.textContent = "Code copied to clipboard.";
  }

  const resetTimer = Number(button.dataset.copyResetTimer);
  if (resetTimer) {
    window.clearTimeout(resetTimer);
  }

  button.dataset.copyResetTimer = String(
    window.setTimeout(() => {
      button.textContent = "Copy";
      button.classList.remove("prose-copy-btn-success");
      button.setAttribute("aria-label", "Copy code to clipboard");

      if (status) {
        status.textContent = "";
      }

      delete button.dataset.copyResetTimer;
    }, copyResetDelay),
  );
}

function copyButtonTemplate() {
  return html`<button
      class="prose-copy-btn"
      type="button"
      aria-label="Copy code to clipboard"
      @click=${copyCodeBlock}
    >Copy</button>
    <span
      data-copy-status
      aria-live="polite"
      style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;"
    ></span>`;
}

const meta = {
  title: "Prose/Code Block",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
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
        ? copyButtonTemplate()
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
    <div class=${DOCS_OVERVIEW_STACK_CLASS}>
      <pre><code class="language-css">.prose {
  max-width: var(--prose-max-width, 65ch);
  line-height: var(--fdic-line-height-body, 1.5);
  color: var(--fdic-color-text-primary, #212123);
}</code></pre>

      <pre style="position: relative;"><code class="language-bash">npm run build
npm run test:components
npm run build:docs</code>${copyButtonTemplate()}</pre>
    </div>
  `
};

DocsOverview.play = async ({ canvasElement, userEvent }) => {
  const copyButton = canvasElement.querySelector<HTMLButtonElement>(
    ".prose-copy-btn",
  );
  const status = canvasElement.querySelector<HTMLElement>("[data-copy-status]");
  const code = canvasElement.querySelectorAll("code")[1];
  let copiedText = "";

  expect(copyButton).not.toBeNull();
  expect(status).not.toBeNull();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (value: string) => {
        copiedText = value;
      },
    },
  });

  await userEvent.click(copyButton!);

  await waitFor(() => {
    expect(copyButton?.textContent?.trim()).toBe("Copied");
    expect(copyButton?.getAttribute("aria-label")).toBe(
      "Code copied to clipboard",
    );
    expect(status?.textContent).toBe("Code copied to clipboard.");
  });

  expect(code?.textContent).toContain("npm run build");
  expect(copiedText).toBe(code?.textContent);
};
