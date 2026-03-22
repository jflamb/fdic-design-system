import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components";

type ButtonArgs = {
  variant: "primary" | "neutral" | "subtle" | "outline" | "destructive";
  label: string;
  disabled: boolean;
  iconStart: string;
  iconEnd: string;
  href: string;
  target: string;
  rel: string;
};

const meta = {
  title: "Components/Button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "neutral", "subtle", "outline", "destructive"],
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
    iconStart: {
      control: "select",
      options: ["", "star", "download", "trash", "pencil", "plus"],
    },
    iconEnd: {
      control: "select",
      options: ["", "caret-down", "arrow-square-out", "caret-right"],
    },
    href: { control: "text" },
    target: { control: "text" },
    rel: { control: "text" },
  },
  args: {
    variant: "primary",
    label: "Submit application",
    disabled: false,
    iconStart: "",
    iconEnd: "",
    href: "",
    target: "",
    rel: "",
  },
  render: (args: ButtonArgs) => html`
    <fd-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      href=${args.href || undefined}
      target=${args.target || undefined}
      rel=${args.rel || undefined}
    >
      ${args.iconStart
        ? html`<fd-icon slot="icon-start" name=${args.iconStart}></fd-icon>`
        : ""}
      ${args.label}
      ${args.iconEnd
        ? html`<fd-icon slot="icon-end" name=${args.iconEnd}></fd-icon>`
        : ""}
    </fd-button>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Neutral: Story = {
  args: { variant: "neutral", label: "Save as draft" },
};

export const Subtle: Story = {
  args: { variant: "subtle", label: "Learn more" },
};

export const Outline: Story = {
  args: { variant: "outline", label: "View details" },
};

export const Destructive: Story = {
  args: { variant: "destructive", label: "Delete account" },
};

export const WithIcons: Story = {
  args: {
    variant: "primary",
    label: "Download report",
    iconStart: "download",
    iconEnd: "caret-down",
  },
};

export const IconOnly: Story = {
  render: () => html`
    <fd-button variant="subtle" aria-label="Close dialog">
      <fd-icon slot="icon-start" name="x"></fd-icon>
    </fd-button>
  `,
};

export const AsLink: Story = {
  args: {
    variant: "outline",
    label: "Visit FDIC.gov",
    href: "https://www.fdic.gov",
    target: "_blank",
    iconEnd: "arrow-square-out",
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Not available" },
};

export const DisabledLink: Story = {
  args: {
    variant: "outline",
    label: "Unavailable",
    href: "/unavailable",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-button variant="primary">Primary</fd-button>
      <fd-button variant="neutral">Neutral</fd-button>
      <fd-button variant="subtle">Subtle</fd-button>
      <fd-button variant="outline">Outline</fd-button>
      <fd-button variant="destructive">Destructive</fd-button>
    </div>
  `,
};

export const AllVariantsDisabled: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-button variant="primary" disabled>Primary</fd-button>
      <fd-button variant="neutral" disabled>Neutral</fd-button>
      <fd-button variant="subtle" disabled>Subtle</fd-button>
      <fd-button variant="outline" disabled>Outline</fd-button>
      <fd-button variant="destructive" disabled>Destructive</fd-button>
    </div>
  `,
};
