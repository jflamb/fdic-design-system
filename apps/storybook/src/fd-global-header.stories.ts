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
  createFdGlobalHeaderReferenceSearch,
  fdGlobalHeaderReferenceNavigation,
} from "@fdic-ds/components/fd-global-header-reference";
import { createFdGlobalHeaderContentFromDrupal } from "@fdic-ds/components/fd-global-header-drupal";

type GlobalHeaderArgs = {
  navigation: FdGlobalHeaderNavigationItem[];
  search: FdGlobalHeaderSearchConfig | null;
  shy?: boolean;
  shyThreshold?: number;
};

function waitForSettledFrame(canvasElement: Element) {
  const view = canvasElement.ownerDocument.defaultView;

  if (!view) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    view.requestAnimationFrame(() => {
      view.requestAnimationFrame(() => {
        view.setTimeout(resolve, 260);
      });
    });
  });
}

function createStoryArgs(): GlobalHeaderArgs {
  return {
    navigation: structuredClone(fdGlobalHeaderReferenceNavigation),
    search: createFdGlobalHeaderReferenceSearch("/search"),
  };
}

function createDrupalStoryArgs(): GlobalHeaderArgs {
  const content = createFdGlobalHeaderContentFromDrupal({
    items: [
      {
        title: "News & Events",
        url: "#news-and-events-overview",
        description:
          "Stay current with FDIC announcements, upcoming events, and multimedia content.",
        below: [
          {
            title: "News",
            url: "#news-overview",
            below: [
              {
                title: "FDICNews",
                url: "#fdicnews",
              },
              {
                title: "Global Messages",
                url: "#global-messages",
                below: [
                  {
                    title: "Global Digest FAQ",
                    url: "#global-digest-faq",
                  },
                ],
              },
            ],
          },
          {
            title: "Events",
            url: "#events-overview",
            below: [
              {
                title: "Corporate Calendar of Events",
                url: "#corporate-calendar-of-events",
              },
            ],
          },
        ],
      },
      {
        title: "Benefits",
        url: "#benefits",
      },
    ],
    search: {
      action: "/search",
      label: "Search FDICnet",
      placeholder: "Search FDICnet",
      submitLabel: "Open first matching result",
      searchAllLabel: "Search all FDICnet",
    },
  });

  return {
    navigation: content.navigation,
    search: content.search ?? null,
  };
}

const renderBackdropContent = (mobile = false, longScroll = false) => html`
  <main
    style=${[
      `min-height: calc(${longScroll ? "220vh" : "100vh"} - 131px)`,
      mobile ? "max-height: calc(100vh - 131px)" : "",
      "background: var(--fdic-color-bg-container, #f5f8fb)",
      "color: var(--fdic-color-text-primary, #212123)",
      "position: relative",
      "overflow: hidden",
    ].join("; ")}
  >
    <div
      aria-hidden="true"
      style=${[
        "position:absolute",
        "inset:0",
        "background:",
        "radial-gradient(circle at 12% 18%, rgba(56,182,255,0.2) 0, rgba(56,182,255,0) 26%),",
        "radial-gradient(circle at 82% 24%, rgba(14,76,117,0.14) 0, rgba(14,76,117,0) 24%),",
        "linear-gradient(90deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.18) 100%)",
      ].join("; ")}
    ></div>
    <div
      style=${[
        "position:relative",
        "padding:" + (mobile ? "1.25rem 1rem 2rem" : "2.5rem 2.5rem 4rem"),
        "display:grid",
        "gap:" + (mobile ? "1rem" : "1.5rem"),
      ].join("; ")}
    >
      <section
        style=${[
          "display:grid",
          "gap:" + (mobile ? "0.75rem" : "1rem"),
          "grid-template-columns:" + (mobile ? "1fr" : "minmax(0, 1.35fr) minmax(15rem, 0.9fr)"),
          "align-items:stretch",
        ].join("; ")}
      >
        <article
          style=${[
            "background:var(--fdic-color-bg-surface, #ffffff)",
            "border:1px solid var(--fdic-color-border-divider, rgba(9,53,84,0.08))",
            "box-shadow:0 12px 28px var(--fdic-color-effect-shadow, rgba(9,53,84,0.08))",
            "padding:" + (mobile ? "1rem" : "1.5rem"),
            "display:grid",
            "gap:0.875rem",
          ].join("; ")}
        >
          <div
            style="width:7.5rem; height:0.75rem; background:currentColor; opacity:0.15;"
          ></div>
          <div
            style="width:60%; height:2rem; background:currentColor; opacity:0.1;"
          ></div>
          <div style="display:grid; gap:0.625rem;">
            <div style="height:0.875rem; background:currentColor; opacity:0.1;"></div>
            <div style="height:0.875rem; background:currentColor; opacity:0.08;"></div>
            <div style="width:84%; height:0.875rem; background:currentColor; opacity:0.08;"></div>
          </div>
          <div
            style=${[
              "display:grid",
              "grid-template-columns:repeat(3, minmax(0, 1fr))",
              "gap:0.75rem",
              "padding-top:0.375rem",
            ].join("; ")}
          >
            <div style="height:5.75rem; background:currentColor; opacity:0.06;"></div>
            <div style="height:5.75rem; background:currentColor; opacity:0.04;"></div>
            <div style="height:5.75rem; background:currentColor; opacity:0.05;"></div>
          </div>
        </article>
        <div
          style=${[
            "background:linear-gradient(180deg, rgba(14,76,117,0.9) 0%, rgba(10,57,88,0.86) 100%)",
            "color:#ffffff",
            "padding:" + (mobile ? "1rem" : "1.5rem"),
            "display:grid",
            "gap:0.875rem",
            "box-shadow:0 12px 28px var(--fdic-color-effect-shadow, rgba(9,53,84,0.14))",
          ].join("; ")}
        >
          <div style="width:6rem; height:0.6875rem; background:rgba(255,255,255,0.28);"></div>
          <div style="width:72%; height:1.5rem; background:rgba(255,255,255,0.2);"></div>
          <div style="display:grid; gap:0.625rem;">
            <div style="height:0.75rem; background:rgba(255,255,255,0.16);"></div>
            <div style="height:0.75rem; background:rgba(255,255,255,0.12);"></div>
            <div style="width:82%; height:0.75rem; background:rgba(255,255,255,0.12);"></div>
          </div>
        </div>
      </section>
      <section
        style=${[
          "display:grid",
          "grid-template-columns:" + (mobile ? "1fr" : "repeat(4, minmax(0, 1fr))"),
          "gap:" + (mobile ? "0.75rem" : "1rem"),
        ].join("; ")}
      >
        ${Array.from({ length: mobile ? 1 : 4 }).map(
          (_, index) => html`
            <article
              style=${[
                "background:var(--fdic-color-bg-surface, rgba(255,255,255,0.68))",
                "border:1px solid var(--fdic-color-border-divider, rgba(9,53,84,0.06))",
                "padding:" + (mobile ? "0.875rem" : "1rem"),
                "display:grid",
                "gap:0.75rem",
              ].join("; ")}
            >
              <div
                style=${[
                  "height:4rem",
                  index % 2 === 0
                    ? "background:currentColor; opacity:0.06"
                    : "background:currentColor; opacity:0.04",
                ].join("; ")}
              ></div>
              <div style="width:68%; height:0.875rem; background:currentColor; opacity:0.14;"></div>
              <div style="height:0.75rem; background:currentColor; opacity:0.08;"></div>
              <div style="width:86%; height:0.75rem; background:currentColor; opacity:0.08;"></div>
            </article>
          `,
        )}
      </section>
    </div>
  </main>
`;

const renderHeader = (
  args: GlobalHeaderArgs,
  options: { mobile?: boolean; longScroll?: boolean } = {},
) => html`
  <div
    style=${[
      "min-height: 100vh",
      "background: var(--fdic-color-bg-base, #ffffff)",
      "position: relative",
      options.mobile
        ? [
            "max-width: 24rem",
            "margin-inline: auto",
            "isolation: isolate",
          ].join("; ")
        : "width: 100%; isolation: isolate",
    ].join("; ")}
  >
    <fd-global-header
      style="display:block;"
      .navigation=${args.navigation}
      .search=${args.search}
      .shy=${Boolean(args.shy)}
      .shyThreshold=${args.shyThreshold}
    >
      <a
        slot="brand"
        href="/"
        aria-label="FDICnet home"
        style="display:inline-flex; align-items:center; height:35px; color:#ffffff; text-decoration:none; border-radius:0; overflow:visible;"
      >
        <img
          src=${fdicnetWordmarkUrl}
          alt="FDICnet"
          width="140"
          height="35"
          style="display:block; width:8.75rem; height:auto; border-radius:0; overflow:visible;"
        />
      </a>
      <fd-button
        slot="utility"
        variant="subtle-inverted"
        aria-label="Apps"
      >
        <fd-icon
          slot="icon-start"
          name="squares-four"
          aria-hidden="true"
          style="--fd-icon-size:1.75rem;"
        ></fd-icon>
      </fd-button>
      <fd-button
        slot="utility"
        variant="subtle-inverted"
        aria-label="Profile"
      >
        <fd-icon
          slot="icon-start"
          name="user-circle"
          aria-hidden="true"
          style="--fd-icon-size:1.75rem;"
        ></fd-icon>
      </fd-button>
    </fd-global-header>
    ${renderBackdropContent(
      Boolean(options.mobile),
      Boolean(options.longScroll),
    )}
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
          "Reference-alignment stories use the exact `fdicnet-main-menu` YAML-derived content fixture. `fd-global-header` owns surface state and focus recovery; the application owns the information architecture and routing.",
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

export const Desktop: Story = {
  args: createStoryArgs(),
};

Desktop.play = async ({ canvasElement }) => {
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

export const SearchOpen: Story = {
  args: createStoryArgs(),
};

SearchOpen.play = async ({ canvasElement }) => {
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

export const MobileDrawer: Story = {
  args: createStoryArgs(),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => renderHeader(args, { mobile: true }),
};

export const ShyHeader: Story = {
  args: {
    ...createStoryArgs(),
    shy: true,
    shyThreshold: 64,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the opt-in shy-header mode with enough scrollable page content to verify the condensed sticky desktop state, compact menu toggle, and reveal-on-scroll-up behavior in the preview frame. The story reserves the fixed header space with a matching content offset.",
      },
    },
  },
  render: (args) => html`
    <style>
      .shy-header-story {
        min-width: 80rem;
      }

      .shy-header-wrapper {
        min-height: 100vh;
        width: 100%;
        background: var(--fdic-color-bg-base, #ffffff);
        isolation: isolate;
      }

      .shy-header-wrapper > fd-global-header[shy] {
        width: 80rem;
        max-width: none;
        left: 50%;
        right: auto;
        transform: translateX(-50%);
      }

      .shy-header-content {
        position: relative;
        z-index: 0;
        padding-top: 120px;
      }
    </style>
    <div class="shy-header-story">
      <div class="shy-header-wrapper">
        <fd-global-header
          style="display:block;"
          .navigation=${args.navigation}
          .search=${args.search}
          .shy=${Boolean(args.shy)}
          .shyThreshold=${args.shyThreshold}
        >
          <a
            slot="brand"
            href="/"
            aria-label="FDICnet home"
            style="display:inline-flex; align-items:center; height:35px; color:#ffffff; text-decoration:none; border-radius:0; overflow:visible;"
          >
            <img
              src=${fdicnetWordmarkUrl}
              alt="FDICnet"
              width="140"
              height="35"
              style="display:block; width:8.75rem; height:auto; border-radius:0; overflow:visible;"
            />
          </a>
          <fd-button
            slot="utility"
            variant="subtle-inverted"
            aria-label="Apps"
          >
            <fd-icon
              slot="icon-start"
              name="squares-four"
              aria-hidden="true"
              style="--fd-icon-size:1.75rem;"
            ></fd-icon>
          </fd-button>
          <fd-button
            slot="utility"
            variant="subtle-inverted"
            aria-label="Profile"
          >
            <fd-icon
              slot="icon-start"
              name="user-circle"
              aria-hidden="true"
              style="--fd-icon-size:1.75rem;"
            ></fd-icon>
          </fd-button>
        </fd-global-header>
        <div class="shy-header-content">${renderBackdropContent(false, true)}</div>
      </div>
    </div>
  `,
};

ShyHeader.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-header") as HTMLElement | null;
  const previewWindow = canvasElement.ownerDocument.defaultView;

  await waitFor(() => {
    expect(host?.shadowRoot).toBeTruthy();
  });

  const base = host?.shadowRoot?.querySelector(".base") as HTMLElement | null;
  expect(base).toBeTruthy();

  previewWindow?.scrollTo(0, 140);
  await waitFor(() => {
    expect(base?.getAttribute("data-shy-hidden")).toBe("true");
    expect(base?.getAttribute("data-compact-desktop")).toBe("true");
    expect(Math.round(base?.getBoundingClientRect().top ?? -1)).toBe(0);
  });

  const compactMenuToggle = host?.shadowRoot?.querySelector(
    ".compact-menu-toggle",
  ) as HTMLElement | null;
  const compactMenuButton = compactMenuToggle?.shadowRoot?.querySelector(
    "button",
  ) as HTMLButtonElement | null;

  expect(compactMenuButton).toBeTruthy();
  await userEvent.click(compactMenuButton!);

  await waitFor(() => {
    const topNav = host?.shadowRoot?.querySelector(".top-nav-shell");
    expect(topNav?.getAttribute("data-compact-nav-visible")).toBe("true");
  });

  previewWindow?.scrollTo(0, 32);
  await waitFor(() => {
    expect(base?.getAttribute("data-shy-hidden")).toBe("false");
    expect(base?.getAttribute("data-compact-desktop")).toBe("false");
  });

  previewWindow?.scrollTo(0, 0);
};

export const MobileDefault: Story = {
  args: createStoryArgs(),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => renderHeader(args, { mobile: true }),
};

export const DrupalAdapter: Story = {
  args: createDrupalStoryArgs(),
  parameters: {
    docs: {
      description: {
        story:
          "Shows a Drupal-style structural menu payload normalized through the dedicated `fd-global-header-drupal` helper before assigning `navigation` and `search` to the component.",
      },
    },
  },
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
    const drawer = host?.shadowRoot?.querySelector(".mobile-drawer") as HTMLElement | null;
    expect(drawer?.getAttribute("data-open")).toBe("true");
  });

  await waitFor(() => {
    const drawer = host?.shadowRoot?.querySelector(".mobile-drawer") as HTMLElement | null;
    expect(drawer).toBeTruthy();
    expect(getComputedStyle(drawer!).opacity).toBe("1");
  });

  await waitForSettledFrame(canvasElement);
};

export const MobileDrillDown: Story = {
  args: createStoryArgs(),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => renderHeader(args, { mobile: true }),
};

MobileDrillDown.play = async ({ canvasElement }) => {
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
    expect(drawer?.getAttribute("data-open")).toBe("true");
    expect(drawer).toBeTruthy();
    expect(getComputedStyle(drawer!).opacity).toBe("1");
  });

  const firstButton = host?.shadowRoot?.querySelector(".mobile-button") as HTMLButtonElement | null;
  await userEvent.click(firstButton!);

  await waitFor(() => {
    const drawer = host?.shadowRoot?.querySelector(".mobile-drawer") as HTMLElement | null;
    const backButton = host?.shadowRoot?.querySelector(".mobile-back");
    const overviewLink = host?.shadowRoot?.querySelector(".mobile-overview-link");
    expect(drawer).toBeTruthy();
    expect(getComputedStyle(drawer!).opacity).toBe("1");
    expect(backButton?.textContent).toContain("News & Events Overview");
    expect(overviewLink?.textContent).toContain("News");
  });

  await waitForSettledFrame(canvasElement);
};

export const MobileSearchOpen: Story = {
  args: createStoryArgs(),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: (args) => renderHeader(args, { mobile: true }),
};

MobileSearchOpen.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-global-header") as HTMLElement | null;

  await waitFor(() => {
    expect(host?.shadowRoot).toBeTruthy();
  });

  const searchToggle = host?.shadowRoot?.querySelector(
    "[data-mobile-toggle='search']",
  ) as HTMLButtonElement | null;

  expect(searchToggle).toBeTruthy();
  await userEvent.click(searchToggle!);

  await waitFor(() => {
    const shell = host?.shadowRoot?.querySelector(".mobile-search-shell") as HTMLElement | null;
    expect(shell?.getAttribute("data-open")).toBe("true");
  });

  await waitForSettledFrame(canvasElement);
};
