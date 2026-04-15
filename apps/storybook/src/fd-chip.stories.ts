import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, userEvent } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

type ChipArgs = {
  type: "neutral" | "cool" | "warm" | "positive" | "alert";
  removeLabel: string;
  label: string;
};

const renderChip = (args: ChipArgs) => html`
  <fd-chip
    type=${args.type}
    remove-label=${ifDefined(args.removeLabel || undefined)}
  >
    ${args.label}
  </fd-chip>
`;

const meta = {
  title: "Components/Chip",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A dismissible pill with a visible label and a real internal remove button. `fd-chip` does not remove itself; the host application owns collection state.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-chip"),
    label: {
      control: "text",
      description: "Visible chip label rendered through the default slot.",
    },
  },
  args: {
    ...getComponentArgs("fd-chip"),
    type: "neutral",
    removeLabel: "",
    label: "Pending review",
  },
  render: (args: ChipArgs) => renderChip(args),
} satisfies Meta<ChipArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-chip") as HTMLElement | null;
  const button = host?.shadowRoot?.querySelector("[part=remove-button]") as
    | HTMLButtonElement
    | null;
  let removeCount = 0;

  host?.addEventListener("fd-chip-remove", () => {
    removeCount += 1;
  });

  expect(button?.tagName).toBe("BUTTON");
  await userEvent.click(button!);
  expect(removeCount).toBe(1);
};

export const Tones: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
      <fd-chip type="neutral">Pending review</fd-chip>
      <fd-chip type="cool">Information added</fd-chip>
      <fd-chip type="warm">Needs follow-up</fd-chip>
      <fd-chip type="positive">Approved</fd-chip>
      <fd-chip type="alert">Past due</fd-chip>
    </div>
  `,
};

export const FocusVisible: Story = {
  render: () => html`<fd-chip>Pending review</fd-chip>`,
};

FocusVisible.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-chip") as HTMLElement | null;
  const button = host?.shadowRoot?.querySelector("[part=remove-button]") as
    | HTMLButtonElement
    | null;

  host?.focus();
  expect(host?.shadowRoot?.activeElement).toBe(button);
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Default removable chips</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          <fd-chip>Pending review</fd-chip>
          <fd-chip type="cool">Information added</fd-chip>
          <fd-chip type="positive">Approved</fd-chip>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Status tones</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          <fd-chip type="neutral">Neutral</fd-chip>
          <fd-chip type="cool">Cool</fd-chip>
          <fd-chip type="warm">Warm</fd-chip>
          <fd-chip type="positive">Positive</fd-chip>
          <fd-chip type="alert">Alert</fd-chip>
        </div>
      </section>
    </div>
  `,
};
