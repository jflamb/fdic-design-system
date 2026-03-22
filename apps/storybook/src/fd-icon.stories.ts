import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect } from "storybook/test";
import "@fdic-ds/components";

type IconArgs = {
  name: string;
  label: string;
  size: string;
};

const iconNames = [
  "star", "caret-down", "caret-up", "caret-right", "caret-left",
  "plus", "minus", "x", "check", "info", "warning", "warning-octagon",
  "arrow-square-out", "download", "upload", "trash", "pencil",
  "eye", "eye-slash", "magnifying-glass",
];

const meta = {
  title: "Components/Icon",
  tags: ["autodocs"],
  argTypes: {
    name: { control: "select", options: iconNames },
    label: { control: "text" },
    size: { control: "text" },
  },
  args: {
    name: "star",
    label: "",
    size: "18",
  },
  render: (args: IconArgs) => html`
    <fd-icon
      name=${args.name}
      label=${args.label || ""}
      style=${args.size !== "18" ? `--fd-icon-size: ${args.size}px` : ""}
    ></fd-icon>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Semantic: Story = {
  args: { name: "warning", label: "Warning" },
};

Semantic.play = async ({ canvasElement }) => {
  const icon = canvasElement.querySelector("fd-icon");
  const svg = icon?.shadowRoot?.querySelector("svg");

  expect(icon?.getAttribute("role")).toBe("img");
  expect(icon?.getAttribute("aria-label")).toBe("Warning");
  expect(svg?.tagName.toLowerCase()).toBe("svg");
};

export const CustomSize: Story = {
  args: { name: "star", size: "32" },
};

export const AllIcons: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
      ${iconNames.map(
        (name) => html`
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; width: 80px;">
            <fd-icon name=${name} style="--fd-icon-size: 24px;"></fd-icon>
            <span style="font-size: 11px; color: #595961;">${name}</span>
          </div>
        `
      )}
    </div>
  `,
};
