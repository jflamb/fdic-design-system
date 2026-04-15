import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

type LinkArgs = {
  href: string;
  target: string;
  rel: string;
  variant: "normal" | "visited" | "subtle" | "inverted";
  size: "sm" | "md" | "lg" | "h3";
  label: string;
};

const renderLink = (args: LinkArgs) => {
  const link = html`
    <fd-link
      href=${ifDefined(args.href || undefined)}
      target=${ifDefined(args.target || undefined)}
      rel=${ifDefined(args.rel || undefined)}
      variant=${args.variant}
      size=${args.size}
    >
      ${args.label}
    </fd-link>
  `;

  return html`
    <div
      style=${args.variant === "inverted"
        ? "display: inline-block; padding: 20px; background: #0d6191; border-radius: 4px;"
        : "display: inline-block; padding: 20px;"}
    >
      ${link}
    </div>
  `;
};

const meta = {
  title: "Components/Link",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-link"),
    label: { control: "text" },
  },
  args: {
    ...getComponentArgs("fd-link"),
    href: "/deposit-insurance",
    target: "",
    rel: "",
    label: "Deposit insurance coverage",
  },
  render: (args: LinkArgs) => renderLink(args),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Normal: Story = {};

Normal.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-link") as HTMLElement | null;
  const anchor = host?.shadowRoot?.querySelector("[part=base]") as
    | HTMLAnchorElement
    | undefined;

  host?.focus();

  expect(anchor?.tagName).toBe("A");
  expect(host?.shadowRoot?.activeElement === anchor).toBe(true);
};

export const Visited: Story = {
  args: {
    variant: "visited",
    label: "Review your last filing",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    label: "Read the policy details",
  },
};

export const Inverted: Story = {
  args: {
    variant: "inverted",
    label: "Open emergency guidance",
  },
};

export const ExternalLink: Story = {
  args: {
    href: "https://www.fdic.gov",
    target: "_blank",
    label: "Visit FDIC.gov",
  },
};

export const WithTrailingIcon: Story = {
  render: () => html`
    <div style="display: inline-block; padding: 20px;">
      <fd-link href="/latest" variant="normal" size="sm">
        View all updates
        <fd-icon slot="icon-end" name="caret-right" aria-hidden="true"></fd-icon>
      </fd-link>
    </div>
  `,
};

ExternalLink.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-link") as HTMLElement | null;
  const anchor = host?.shadowRoot?.querySelector("[part=base]") as
    | HTMLAnchorElement
    | undefined;

  expect(anchor?.getAttribute("href")).toBe("https://www.fdic.gov");
  expect(anchor?.getAttribute("target")).toBe("_blank");
  expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: grid; gap: 16px;">
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <fd-link href="/coverage" variant="normal" size="sm">Small normal</fd-link>
        <fd-link href="/coverage" variant="normal" size="md">Medium normal</fd-link>
        <fd-link href="/coverage" variant="normal" size="lg">Large normal</fd-link>
        <fd-link href="/coverage" variant="normal" size="h3">H3 normal</fd-link>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <fd-link href="/history" variant="visited" size="sm">Small visited</fd-link>
        <fd-link href="/history" variant="visited" size="md">Medium visited</fd-link>
        <fd-link href="/history" variant="visited" size="lg">Large visited</fd-link>
        <fd-link href="/history" variant="visited" size="h3">H3 visited</fd-link>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <fd-link href="/policy" variant="subtle" size="sm">Small subtle</fd-link>
        <fd-link href="/policy" variant="subtle" size="md">Medium subtle</fd-link>
        <fd-link href="/policy" variant="subtle" size="lg">Large subtle</fd-link>
        <fd-link href="/policy" variant="subtle" size="h3">H3 subtle</fd-link>
      </div>
      <div
        style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 16px; background: #0d6191; border-radius: 4px;"
      >
        <fd-link href="/emergency" variant="inverted" size="sm">Small inverted</fd-link>
        <fd-link href="/emergency" variant="inverted" size="md">Medium inverted</fd-link>
        <fd-link href="/emergency" variant="inverted" size="lg">Large inverted</fd-link>
        <fd-link href="/emergency" variant="inverted" size="h3">H3 inverted</fd-link>
      </div>
    </div>
  `,
};

export const DocsOverview: Story = {
  render: () => html`
    <div style="display: grid; gap: 20px;">
      <p style="margin: 0; max-width: 48rem; line-height: 1.5;">
        Learn how deposit insurance works in the
        <fd-link href="/deposit-insurance" variant="normal">deposit insurance guide</fd-link>.
        If you already reviewed that section, the visual system can also present a
        <fd-link href="/deposit-insurance/history" variant="visited">visited treatment</fd-link>
        when the product needs that state explicitly.
      </p>
      <p style="margin: 0; max-width: 48rem; line-height: 1.5;">
        Supporting references can stay quieter with the
        <fd-link href="/policy-details" variant="subtle">subtle link treatment</fd-link>,
        while dark promotional or emergency surfaces can use
        <span
          style="display: inline-block; padding: 4px 8px; background: #0d6191; border-radius: 4px;"
        >
          <fd-link href="/emergency-guidance" variant="inverted">inverted links</fd-link>
        </span>.
      </p>
      <p style="margin: 0; max-width: 48rem; line-height: 1.5;">
        Standalone “more” links can add a trailing icon when the destination cue
        helps the surrounding page pattern.
        <fd-link href="/all-updates" variant="normal" size="sm">
          View all updates
          <fd-icon slot="icon-end" name="caret-right" aria-hidden="true"></fd-icon>
        </fd-link>
      </p>
    </div>
  `,
};
