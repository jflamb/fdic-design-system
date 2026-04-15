import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type MessageArgs = {
  state: "default" | "error" | "warning" | "success";
  message: string;
  live: "polite" | "off" | "";
  forId: string;
};

const renderMessage = (args: MessageArgs) => html`
  <div style="display: grid; gap: 0.5rem; max-width: 24rem;">
    <fd-label for=${args.forId} label="Routing number"></fd-label>
    <fd-input id=${args.forId} value="12345"></fd-input>
    <fd-message
      for=${args.forId}
      state=${args.state}
      message=${args.message}
      live=${ifDefined(args.live || undefined)}
    ></fd-message>
  </div>
`;

const meta = {
  title: "Supporting Primitives/Message",
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["default", "error", "warning", "success"],
    },
    message: { control: "text" },
    live: {
      control: "select",
      options: ["", "polite", "off"],
    },
    forId: { control: "text" },
  },
  args: {
    state: "default",
    message: "We may contact you if we need to verify this number.",
    live: "",
    forId: "message-story-input",
  },
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "`fd-message` is a supporting standalone primitive for helper, validation, warning, and success text. It renders in light DOM so sibling controls can discover its message ID for described-by wiring.",
      },
    },
  },
  render: renderMessage,
} satisfies Meta<MessageArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HelperText: Story = {
  args: {
    state: "default",
    message: "We may call this number if we need to verify your filing.",
    forId: "message-helper-input",
  },
};

export const ErrorState: Story = {
  args: {
    state: "error",
    message: "Enter a valid 9-digit routing number.",
    forId: "message-error-input",
  },
};

ErrorState.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-message") as HTMLElement | null;
  const input = canvasElement.querySelector("fd-input") as HTMLElement | null;
  const message = host?.querySelector('[part="message"]') as HTMLElement | null;

  expect(input?.getAttribute("id")).toBe("message-error-input");
  expect(host?.getAttribute("for")).toBe("message-error-input");
  expect(message?.getAttribute("role")).toBe("alert");
  expect(message?.textContent).toContain("Enter a valid 9-digit routing number.");
};

export const WarningState: Story = {
  args: {
    state: "warning",
    message: "Transfers over $10,000 require additional verification.",
    forId: "message-warning-input",
  },
};

export const SuccessState: Story = {
  args: {
    state: "success",
    message: "Routing number verified.",
    forId: "message-success-input",
  },
};

export const LiveModes: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Default error behavior</p>
        <fd-message
          state="error"
          message="Enter a valid routing number."
        ></fd-message>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Forced polite announcements</p>
        <fd-message
          state="error"
          live="polite"
          message="This warning updates frequently and should not interrupt."
        ></fd-message>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Announcements off</p>
        <fd-message
          state="warning"
          live="off"
          message="Visible support text without live-region announcements."
        ></fd-message>
      </div>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Helper text</p>
        <fd-message message="We'll use this address for filing follow-up."></fd-message>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Error state</p>
        <fd-message
          state="error"
          message="Enter a valid 9-digit routing number."
        ></fd-message>
      </div>

      <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <p class=${DOCS_OVERVIEW_HEADING_CLASS}>Warning and success states</p>
        <div style="display: grid; gap: 0.5rem;">
          <fd-message
            state="warning"
            message="Transfers over $10,000 require additional verification."
          ></fd-message>
          <fd-message
            state="success"
            message="Routing number verified."
          ></fd-message>
        </div>
      </div>
    </div>
  `,
};
