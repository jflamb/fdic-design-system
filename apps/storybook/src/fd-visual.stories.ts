import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

const SAMPLE_AVATAR_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#9fd6f4" />
        <stop offset="100%" stop-color="#1a5d84" />
      </linearGradient>
    </defs>
    <rect width="72" height="72" fill="url(#bg)" />
    <circle cx="36" cy="26" r="13" fill="#f8f4ec" />
    <path d="M14 72C16.5 55 25 45 36 45C47 45 55.5 55 58 72Z" fill="#f8f4ec" />
  </svg>
`);

const SAMPLE_AVATAR_SRC = `data:image/svg+xml;charset=utf-8,${SAMPLE_AVATAR_SVG}`;

type VisualArgs = {
  type: "neutral" | "cool" | "warm" | "avatar";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  contentMode: "fallback" | "icon" | "avatar";
  iconName: string;
};

function renderVisual(args: VisualArgs) {
  const effectiveType = args.contentMode === "avatar" ? "avatar" : args.type;
  const content =
    args.contentMode === "icon"
      ? html`<fd-icon
          name=${ifDefined(args.iconName || undefined)}
          aria-hidden="true"
        ></fd-icon>`
      : args.contentMode === "avatar"
        ? html`<img alt="" src=${SAMPLE_AVATAR_SRC} />`
        : html``;

  return html`
    <fd-visual type=${effectiveType} size=${args.size}>${content}</fd-visual>
  `;
}

const meta = {
  title: "Supporting Primitives/Visual",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "A static circular visual primitive for decorative icon and avatar cues. `fd-visual` is intentionally non-interactive and decorative-only in v1.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-visual"),
    contentMode: {
      control: "radio",
      options: ["fallback", "icon", "avatar"],
      description:
        "Story-only composition helper for previewing fallback, slotted icon, or slotted avatar content.",
    },
    iconName: {
      control: "text",
      description: "Registry icon name used when `contentMode` is `icon`.",
    },
  },
  args: {
    ...getComponentArgs("fd-visual"),
    type: "neutral",
    size: "md",
    contentMode: "fallback",
    iconName: "download",
  },
  render: (args: VisualArgs) => renderVisual(args),
} satisfies Meta<VisualArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-visual");
  expect(host?.getAttribute("aria-hidden")).toBe("true");
  expect(host?.shadowRoot?.querySelector("button")).toBeNull();
};

export const Tones: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <fd-visual type="cool" size="lg"></fd-visual>
      <fd-visual type="neutral" size="lg"></fd-visual>
      <fd-visual type="warm" size="lg"></fd-visual>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: end; gap: 12px;">
      <fd-visual type="cool" size="xs"></fd-visual>
      <fd-visual type="cool" size="sm"></fd-visual>
      <fd-visual type="cool" size="md"></fd-visual>
      <fd-visual type="cool" size="lg"></fd-visual>
      <fd-visual type="cool" size="xl"></fd-visual>
      <fd-visual type="cool" size="2xl"></fd-visual>
    </div>
  `,
};

export const SlottedIcon: Story = {
  args: {
    type: "cool",
    size: "lg",
    contentMode: "icon",
    iconName: "download",
  },
};

SlottedIcon.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-visual");
  expect(host?.shadowRoot?.querySelector("[part=fallback]")).toBeNull();
};

export const AvatarImage: Story = {
  args: {
    type: "avatar",
    size: "xl",
    contentMode: "avatar",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Decorative icon surfaces</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          <fd-visual type="cool" size="lg"></fd-visual>
          <fd-visual type="neutral" size="lg"></fd-visual>
          <fd-visual type="warm" size="lg"></fd-visual>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Size scale</strong>
        <div style="display: flex; flex-wrap: wrap; align-items: end; gap: 12px;">
          <fd-visual type="cool" size="xs"></fd-visual>
          <fd-visual type="cool" size="sm"></fd-visual>
          <fd-visual type="cool" size="md"></fd-visual>
          <fd-visual type="cool" size="lg"></fd-visual>
          <fd-visual type="cool" size="xl"></fd-visual>
          <fd-visual type="cool" size="2xl"></fd-visual>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Avatar composition</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <fd-visual type="avatar" size="md"></fd-visual>
          <fd-visual type="avatar" size="lg"></fd-visual>
          <fd-visual type="avatar" size="xl">
            <img alt="" src=${SAMPLE_AVATAR_SRC} />
          </fd-visual>
          <fd-visual type="avatar" size="2xl">
            <img alt="" src=${SAMPLE_AVATAR_SRC} />
          </fd-visual>
        </div>
      </section>
    </div>
  `,
};
