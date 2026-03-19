import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components";

const meta = {
  title: "Components/Placeholder",
  tags: ["autodocs"],
  render: () => html`<fd-placeholder></fd-placeholder>`
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
