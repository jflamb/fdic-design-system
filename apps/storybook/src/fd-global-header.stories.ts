import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, userEvent, waitFor, within } from "storybook/test";
import "@fdic-ds/components/register-all";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";

type GlobalHeaderArgs = {
  navigation: Array<Record<string, unknown>>;
  search: Record<string, unknown> | null;
};

const sampleNavigation = [
  {
    kind: "link",
    label: "Dashboard",
    href: "/dashboard",
    current: true,
    description: "Overview",
  },
  {
    kind: "panel",
    id: "banking",
    label: "Banking",
    href: "/banking",
    description: "Manage accounts and support resources.",
    sections: [
      {
        label: "Accounts",
        href: "/banking/accounts",
        description: "Open and monitor accounts.",
        items: [
          {
            label: "Checking",
            href: "/banking/accounts/checking",
            description: "Everyday account services.",
            children: [
              {
                label: "Routing numbers",
                href: "/banking/accounts/checking/routing",
              },
            ],
          },
          {
            label: "Savings",
            href: "/banking/accounts/savings",
            description: "Savings products.",
          },
        ],
      },
      {
        label: "Support",
        href: "/banking/support",
        description: "Contact and service requests.",
        items: [
          {
            label: "Contact",
            href: "/banking/support/contact",
          },
        ],
      },
    ],
  },
  {
    kind: "panel",
    id: "policy",
    label: "Policy",
    href: "/policy",
    description: "Guidance, filings, and supervision resources.",
    sections: [
      {
        label: "Filings",
        href: "/policy/filings",
        items: [
          {
            label: "Submit filing",
            href: "/policy/filings/submit",
          },
        ],
      },
    ],
  },
] satisfies GlobalHeaderArgs["navigation"];

const sampleSearch = {
  action: "/search",
  label: "Search FDIC",
  placeholder: "Search FDIC",
  submitLabel: "Search all FDIC",
} satisfies NonNullable<GlobalHeaderArgs["search"]>;

const renderHeader = (
  args: GlobalHeaderArgs,
  options: { mobile?: boolean; condensed?: boolean } = {},
) => html`
  <div
    style=${[
      "padding-bottom: 28rem",
      options.mobile ? "max-width: 23rem; margin-inline: auto;" : "width: 100%;",
      options.condensed ? "max-width: 68rem; margin-inline: auto;" : "",
    ].join(" ")}
  >
    <fd-global-header
      .navigation=${args.navigation}
      .search=${args.search}
      style=${options.mobile ? "display:block;" : ""}
    >
      <a
        slot="brand"
        href="/"
        aria-label="FDIC home"
        style="font-weight:700; font-size:1.125rem;"
      >
        FDIC
      </a>
      <a slot="utility" href="/profile">Profile</a>
      <a slot="utility" href="/help">Help</a>
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
          "Public contract: provide navigation and search data as JS properties and supply brand/utility content through slots. `fd-global-header` intentionally does not reuse `fd-menu` because the header family needs navigation semantics, not action-menu semantics.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-global-header"),
    navigation: {
      control: "object",
      description: "Consumer-provided primary navigation data.",
    },
    search: {
      control: "object",
      description: "Consumer-provided search configuration.",
    },
  },
  args: {
    ...getComponentArgs("fd-global-header"),
    navigation: sampleNavigation,
    search: sampleSearch,
  },
  render: (args: GlobalHeaderArgs) => renderHeader(args),
} satisfies Meta<GlobalHeaderArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DesktopMegaMenu: Story = {
  render: (args) => renderHeader(args, { condensed: true }),
};

DesktopMegaMenu.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-header") as HTMLElement | null;

  await waitFor(() => {
    expect(host?.shadowRoot).toBeTruthy();
  });

  const bankingTrigger = host?.shadowRoot?.querySelector(
    "[data-panel-trigger='banking']",
  ) as HTMLButtonElement | null;

  expect(bankingTrigger).toBeTruthy();
  await userEvent.click(bankingTrigger!);

  await waitFor(() => {
    const panel = host?.shadowRoot?.querySelector(".desktop-panel");
    expect(panel).toBeTruthy();
    expect(panel).not.toHaveAttribute("hidden");
  });

  expect(host?.shadowRoot?.textContent).toContain("Accounts");
  expect(host?.shadowRoot?.textContent).toContain("Checking");
};

export const MobileDrawer: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => renderHeader(args, { mobile: true }),
};

MobileDrawer.play = async ({ canvasElement }) => {
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
    const drawer = host?.shadowRoot?.querySelector(".mobile-surface");
    expect(drawer).toBeTruthy();
    expect(drawer).not.toHaveAttribute("hidden");
  });
};

export const DocsOverview: Story = {
  render: (args) => html`
    <div
      style="
        padding: 1.5rem;
        background: #f5f5f7;
      "
    >
      <section
        style="
          background: #fff;
          border: 1px solid #d6d6d8;
          border-radius: 12px;
          overflow: hidden;
        "
      >
        ${renderHeader(args, { condensed: true })}
      </section>
    </div>
  `,
};
