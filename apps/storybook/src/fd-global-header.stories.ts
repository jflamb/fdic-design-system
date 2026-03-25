import type {
  FdGlobalHeaderNavigationItem,
  FdGlobalHeaderSearchConfig,
} from "@fdic-ds/components";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import "@fdic-ds/components/register-all";
import fdicnetWordmarkUrl from "./assets/fdicnet-wordmark.svg?url";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  createFdGlobalHeaderPrototypeSearch,
  fdGlobalHeaderPrototypeNavigation,
} from "../../../packages/components/src/components/fd-global-header.prototype.js";

type GlobalHeaderArgs = {
  navigation: FdGlobalHeaderNavigationItem[];
  search: FdGlobalHeaderSearchConfig | null;
};

function createStoryArgs(): GlobalHeaderArgs {
  return {
    navigation: structuredClone(fdGlobalHeaderPrototypeNavigation),
    search: createFdGlobalHeaderPrototypeSearch("/search"),
  };
}

const renderHeader = (
  args: GlobalHeaderArgs,
  options: { mobile?: boolean } = {},
) => html`
  <div
    style=${[
      "padding-bottom: 32rem",
      "background: linear-gradient(180deg, #f7fafc 0%, #eef3f7 100%)",
      options.mobile ? "max-width: 24rem; margin-inline: auto;" : "width: 100%;",
    ].join("; ")}
  >
    <fd-global-header .navigation=${args.navigation} .search=${args.search}>
      <a
        slot="brand"
        href="/"
        aria-label="FDICnet home"
        style="display:inline-flex; align-items:center; color:#ffffff; text-decoration:none; line-height:0;"
      >
        <img
          src=${fdicnetWordmarkUrl}
          alt="FDICnet"
          style="display:block; width:8.75rem; height:auto;"
        />
      </a>
      <a slot="utility" href="#employee-directory" style="color:#ffffff; text-decoration:none;">Employee directory</a>
      <a slot="utility" href="#help" style="color:#ffffff; text-decoration:none;">Help</a>
    </fd-global-header>
  </div>
`;

const meta = {
  title: "Components/Global Header",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Prototype-alignment stories use the exact `fdicnet-main-menu` YAML-derived content fixture. `fd-global-header` owns surface state and focus recovery; the application owns the information architecture and routing.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-global-header"),
    navigation: {
      control: "object",
      description: "Consumer-provided primary navigation tree.",
    },
    search: {
      control: "object",
      description: "Consumer-provided search configuration.",
    },
  },
  args: {
    ...getComponentArgs("fd-global-header"),
    ...createStoryArgs(),
  },
  render: (args: GlobalHeaderArgs) => renderHeader(args),
} satisfies Meta<GlobalHeaderArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PrototypeDesktop: Story = {
  args: createStoryArgs(),
};

PrototypeDesktop.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-header") as HTMLElement | null;

  await waitFor(() => {
    expect(host?.shadowRoot).toBeTruthy();
  });

  const trigger = host?.shadowRoot?.querySelector(
    '[data-panel-trigger="news-events"]',
  ) as HTMLButtonElement | null;

  expect(trigger).toBeTruthy();
  await userEvent.click(trigger!);

  await waitFor(() => {
    const panel = host?.shadowRoot?.querySelector(".mega-menu") as HTMLElement | null;
    expect(panel?.hidden).toBe(false);
  });
};

export const PrototypeSearchOpen: Story = {
  args: createStoryArgs(),
};

PrototypeSearchOpen.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-header") as HTMLElement | null;

  await waitFor(() => {
    expect(host?.shadowRoot).toBeTruthy();
  });

  const searchHost = host?.shadowRoot?.querySelector(
    '[data-search-surface="desktop"]',
  ) as HTMLElement | null;
  const input = searchHost?.shadowRoot?.querySelector(".native") as HTMLInputElement | null;

  expect(input).toBeTruthy();
  await userEvent.click(input!);
  await userEvent.type(input!, "Global Messages");

  await waitFor(() => {
    const panel = searchHost?.shadowRoot?.querySelector(".panel");
    expect(panel).toBeTruthy();
    expect(panel).not.toHaveAttribute("hidden");
  });
};

export const PrototypeMobileDrawer: Story = {
  args: createStoryArgs(),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => renderHeader(args, { mobile: true }),
};

PrototypeMobileDrawer.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-header") as HTMLElement | null;

  await waitFor(() => {
    expect(host?.shadowRoot).toBeTruthy();
  });

  const menuToggle = host?.shadowRoot?.querySelector(
    "[data-mobile-toggle='menu']",
  ) as HTMLButtonElement | null;

  expect(menuToggle).toBeTruthy();
  await userEvent.click(menuToggle!);

  await waitFor(() => {
    const drawer = host?.shadowRoot?.querySelector(".mobile-drawer") as HTMLElement | null;
    expect((drawer as any)?.open).toBe(true);
  });
};

export const PrototypeMobileDrillDown: Story = {
  args: createStoryArgs(),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => renderHeader(args, { mobile: true }),
};

PrototypeMobileDrillDown.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-header") as HTMLElement | null;

  await waitFor(() => {
    expect(host?.shadowRoot).toBeTruthy();
  });

  const menuToggle = host?.shadowRoot?.querySelector(
    "[data-mobile-toggle='menu']",
  ) as HTMLButtonElement | null;

  expect(menuToggle).toBeTruthy();
  await userEvent.click(menuToggle!);

  await waitFor(() => {
    const firstButton = host?.shadowRoot?.querySelector(".mobile-button");
    expect(firstButton).toBeTruthy();
  });

  const firstButton = host?.shadowRoot?.querySelector(".mobile-button") as HTMLButtonElement | null;
  await userEvent.click(firstButton!);

  await waitFor(() => {
    const context = host?.shadowRoot?.querySelector(".mobile-context");
    expect(context?.textContent).toContain("News");
  });
};
