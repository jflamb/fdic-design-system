import type {
  FdHeaderSearchItem,
  HeaderSearchSurface,
} from "@fdic-ds/components";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import { fdGlobalHeaderPrototypeSearch } from "../../../packages/components/src/components/fd-global-header.prototype.js";

type HeaderSearchArgs = {
  surface: HeaderSearchSurface;
  action: string;
  items: FdHeaderSearchItem[];
  value: string;
  open: boolean;
};

const storyArgs = {
  surface: "desktop" as const,
  action: fdGlobalHeaderPrototypeSearch.action,
  items: structuredClone(fdGlobalHeaderPrototypeSearch.items || []),
  value: "",
  open: false,
};

const meta = {
  title: "Supporting Primitives/Header Search",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    layout: "fullscreen",
  },
  argTypes: {
    ...getComponentArgTypes("fd-header-search"),
  },
  args: {
    ...getComponentArgs("fd-header-search"),
    ...storyArgs,
  },
  render: (args: HeaderSearchArgs) => html`
    <div
      style=${[
        "padding: 2rem",
        "background: linear-gradient(180deg, #003256 0%, #003256 6rem, #eef3f7 6rem, #eef3f7 100%)",
        args.surface === "mobile"
          ? "max-width: 24rem; margin-inline: auto;"
          : "display:flex; justify-content:flex-end;",
      ].join("; ")}
    >
      <fd-header-search
        .surface=${args.surface}
        .action=${args.action}
        .items=${args.items}
        .value=${args.value}
        .open=${args.open}
        label="Search FDICnet"
        placeholder="Search FDICnet"
        submit-label="Open first matching result"
        search-all-label="Search all FDICnet"
      ></fd-header-search>
    </div>
  `,
} satisfies Meta<HeaderSearchArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopSuggestions: Story = {};

DesktopSuggestions.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-header-search") as HTMLElement | null;
  const input = host?.shadowRoot?.querySelector(".native") as HTMLInputElement | null;

  expect(input).toBeTruthy();
  await userEvent.click(input!);
  await userEvent.type(input!, "Global Messages");

  await waitFor(() => {
    const panel = host?.shadowRoot?.querySelector(".panel");
    expect(panel).toBeTruthy();
    expect(panel).not.toHaveAttribute("hidden");
  });
};

export const MobileSuggestions: Story = {
  args: {
    ...storyArgs,
    surface: "mobile",
    open: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

MobileSuggestions.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-header-search") as HTMLElement | null;
  const input = host?.shadowRoot?.querySelector(".native") as HTMLInputElement | null;

  expect(input).toBeTruthy();
  await userEvent.type(input!, "CSRR");

  await waitFor(() => {
    const results = host?.shadowRoot?.querySelector(".results");
    expect(results?.textContent).toContain("Customer Service & Records Research");
  });
};
