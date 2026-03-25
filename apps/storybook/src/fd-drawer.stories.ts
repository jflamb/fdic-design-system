import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

const meta = {
  title: "Supporting Primitives/Drawer",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    layout: "fullscreen",
  },
  argTypes: {
    ...getComponentArgTypes("fd-drawer"),
  },
  args: {
    ...getComponentArgs("fd-drawer"),
    open: true,
    modal: true,
    label: "Main menu",
  },
  render: () => html`
    <div style="min-height: 32rem; background: linear-gradient(180deg, #003256 0%, #003256 5rem, #eef3f7 5rem, #eef3f7 100%);">
      <fd-drawer open modal label="Main menu">
        <div
          slot="header"
          style="display:flex; align-items:center; justify-content:space-between; padding:1rem; border-bottom:1px solid rgba(9, 53, 84, 0.08);"
        >
          <button type="button" style="border:0; background:transparent; color:#0b466f; font-weight:700; padding:0;">Back</button>
          <h2 style="margin:0; font-size:1.125rem;">News &amp; Events</h2>
        </div>
        <ul style="list-style:none; margin:0; padding:0.5rem 1rem 1rem; display:grid; gap:0.25rem;">
          <li><a href="#news" style="display:flex; justify-content:space-between; gap:0.75rem; padding:0.875rem; border-radius:0.75rem; color:inherit; text-decoration:none;">News</a></li>
          <li><a href="#events" style="display:flex; justify-content:space-between; gap:0.75rem; padding:0.875rem; border-radius:0.75rem; color:inherit; text-decoration:none;">Events</a></li>
          <li><a href="#podcasts" style="display:flex; justify-content:space-between; gap:0.75rem; padding:0.875rem; border-radius:0.75rem; color:inherit; text-decoration:none;">Podcasts &amp; Media</a></li>
        </ul>
      </fd-drawer>
    </div>
  `,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReferenceMenuSurface: Story = {};
