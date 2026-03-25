import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

type ButtonArgs = {
  variant:
    | "primary"
    | "neutral"
    | "subtle"
    | "subtle-inverted"
    | "outline"
    | "destructive";
  label: string;
  disabled: boolean;
  loading: boolean;
  loadingLabel: string;
  iconStart: string;
  iconEnd: string;
  href: string;
  target: string;
  rel: string;
};

const meta = {
  title: "Components/Button",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-button"),
    label: { control: "text" },
    loadingLabel: { control: "text" },
    iconStart: {
      control: "select",
      options: ["", "star", "download", "trash", "pencil", "plus"],
    },
    iconEnd: {
      control: "select",
      options: ["", "caret-down", "arrow-square-out", "caret-right"],
    },
  },
  args: {
    ...getComponentArgs("fd-button"),
    label: "Submit application",
    loadingLabel: "",
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
      ?loading=${args.loading}
      loading-label=${ifDefined(args.loadingLabel || undefined)}
      href=${ifDefined(args.href || undefined)}
      target=${ifDefined(args.target || undefined)}
      rel=${ifDefined(args.rel || undefined)}
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

export const Playground: Story = {};

export const Primary: Story = {};

Primary.play = async ({ canvasElement, userEvent }) => {
  const host = canvasElement.querySelector("fd-button") as HTMLElement | null;
  const control = host?.shadowRoot?.querySelector("[part=base]") as
    | HTMLButtonElement
    | undefined;
  let clickCount = 0;

  host?.addEventListener("click", () => {
    clickCount += 1;
  });

  control?.focus();
  await userEvent.keyboard("{Enter}");

  expect(control).toBeDefined();
  expect(host?.shadowRoot?.activeElement === control).toBe(true);
  expect(clickCount).toBe(1);
};

export const Neutral: Story = {
  args: { variant: "neutral", label: "Save as draft" },
};

export const Subtle: Story = {
  args: { variant: "subtle", label: "Learn more" },
};

export const SubtleInverted: Story = {
  args: { variant: "subtle-inverted", label: "Header action" },
  render: (args: ButtonArgs) => html`
    <div
      style="display:inline-flex; padding:12px; background:#003256; border-radius:4px;"
    >
      <fd-button
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?loading=${args.loading}
        loading-label=${ifDefined(args.loadingLabel || undefined)}
        href=${ifDefined(args.href || undefined)}
        target=${ifDefined(args.target || undefined)}
        rel=${ifDefined(args.rel || undefined)}
      >
        ${args.iconStart
          ? html`<fd-icon slot="icon-start" name=${args.iconStart}></fd-icon>`
          : ""}
        ${args.label}
        ${args.iconEnd
          ? html`<fd-icon slot="icon-end" name=${args.iconEnd}></fd-icon>`
          : ""}
      </fd-button>
    </div>
  `,
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

IconOnly.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-button") as HTMLElement | null;
  const control = host?.shadowRoot?.querySelector("[part=base]") as
    | HTMLButtonElement
    | undefined;
  control?.focus();

  expect(control).toBeDefined();
  expect(control?.getAttribute("aria-label")).toBe("Close dialog");
  expect(host?.shadowRoot?.activeElement === control).toBe(true);
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

AsLink.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-button") as HTMLElement | null;
  const control = host?.shadowRoot?.querySelector("[part=base]") as
    | HTMLAnchorElement
    | undefined;

  expect(control?.tagName).toBe("A");
  expect(control?.getAttribute("href")).toBe("https://www.fdic.gov");
  expect(control?.getAttribute("target")).toBe("_blank");
  expect(control?.getAttribute("rel")).toBe("noopener noreferrer");
};

export const Disabled: Story = {
  args: { disabled: true, label: "Not available" },
};

Disabled.play = async ({ canvasElement, userEvent }) => {
  const host = canvasElement.querySelector("fd-button") as HTMLElement | null;
  const control = host?.shadowRoot?.querySelector("[part=base]") as
    | HTMLButtonElement
    | undefined;
  let clickCount = 0;

  host?.addEventListener("click", () => {
    clickCount += 1;
  });

  control?.click();

  expect(control?.disabled).toBe(true);
  expect(clickCount).toBe(0);
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
      <div
        style="display:inline-flex; padding:8px; background:#003256; border-radius:4px;"
      >
        <fd-button variant="subtle-inverted">Subtle inverted</fd-button>
      </div>
      <fd-button variant="outline">Outline</fd-button>
      <fd-button variant="destructive">Destructive</fd-button>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-button variant="primary">
        <fd-icon slot="icon-start" name="download"></fd-icon>
        Download report
      </fd-button>
      <fd-button variant="subtle" aria-label="Close dialog">
        <fd-icon slot="icon-start" name="x"></fd-icon>
      </fd-button>
      <fd-button variant="outline" href="https://www.fdic.gov" target="_blank">
        Visit FDIC.gov
        <fd-icon slot="icon-end" name="arrow-square-out"></fd-icon>
      </fd-button>
      <fd-button variant="primary" loading loading-label="Submitting…">
        Submit application
      </fd-button>
    </div>
  `,
};

export const AllVariantsDisabled: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-button variant="primary" disabled>Primary</fd-button>
      <fd-button variant="neutral" disabled>Neutral</fd-button>
      <fd-button variant="subtle" disabled>Subtle</fd-button>
      <div
        style="display:inline-flex; padding:8px; background:#003256; border-radius:4px;"
      >
        <fd-button variant="subtle-inverted" disabled>
          Subtle inverted
        </fd-button>
      </div>
      <fd-button variant="outline" disabled>Outline</fd-button>
      <fd-button variant="destructive" disabled>Destructive</fd-button>
    </div>
  `,
};

export const Loading: Story = {
  args: { loading: true, label: "Submit application" },
};

export const LoadingWithLabel: Story = {
  args: {
    loading: true,
    label: "Submit application",
    loadingLabel: "Submitting…",
  },
};

export const LoadingIconOnly: Story = {
  render: () => html`
    <fd-button variant="subtle" loading aria-label="Close dialog">
      <fd-icon slot="icon-start" name="x"></fd-icon>
    </fd-button>
  `,
};

export const LoadingLink: Story = {
  args: {
    variant: "outline",
    label: "Download report",
    loading: true,
    href: "https://www.fdic.gov",
    iconEnd: "arrow-square-out",
  },
};

export const LoadingDisabled: Story = {
  args: {
    loading: true,
    disabled: true,
    label: "Submit application",
  },
};

export const AllVariantsLoading: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <fd-button variant="primary" loading>Primary</fd-button>
      <fd-button variant="neutral" loading>Neutral</fd-button>
      <fd-button variant="subtle" loading>Subtle</fd-button>
      <fd-button variant="outline" loading>Outline</fd-button>
      <fd-button variant="destructive" loading>Destructive</fd-button>
    </div>
  `,
};
