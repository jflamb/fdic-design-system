import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import type {
  FdSidebarMenuItem,
  FdSidebarMenuRoot,
} from "@jflamb/fdic-ds-components";
import {
  getComponentArgs,
  getComponentArgTypes,
} from "./generated/component-arg-types";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_SECTION_CLASS,
  DOCS_OVERVIEW_SPACIOUS_STACK_CLASS,
} from "./docs-overview";

type SidebarMenuArgs = {
  label: string;
  labelledby: string;
  root?: FdSidebarMenuRoot;
  items: FdSidebarMenuItem[];
  currentHref: string;
  currentId: string;
  maxDepth: 1 | 2 | 3 | 4;
};

const newsRoot: FdSidebarMenuRoot = {
  label: "News & Events",
  href: "/news-events",
};

const newsItems: FdSidebarMenuItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/news-events",
  },
  {
    id: "news",
    label: "News",
    href: "/news-events/news",
    items: [
      {
        id: "global-messages",
        label: "Global Messages",
        href: "/news-events/news/global-messages",
      },
      {
        id: "fdic-news",
        label: "FDIC News",
        href: "/news-events/news/fdic-news",
        items: [
          {
            id: "consumer-news",
            label: "Consumer News",
            href: "/news-events/news/fdic-news/consumer-news",
          },
          {
            id: "industry-news",
            label: "Industry News",
            href: "/news-events/news/fdic-news/industry-news",
          },
        ],
      },
      {
        id: "division-office-news",
        label: "Division and Office News",
        href: "/news-events/news/division-office-news",
      },
      {
        id: "speeches",
        label: "Speeches and Testimony",
        href: "/news-events/news/speeches",
      },
      {
        id: "fils",
        label: "Financial Institution Letters (FILs)",
        href: "/news-events/news/financial-institution-letters",
      },
      {
        id: "press-releases",
        label: "Press Releases",
        href: "/news-events/news/press-releases",
      },
    ],
  },
  {
    id: "events",
    label: "Events",
    href: "/news-events/events",
    expanded: true,
    items: [
      {
        id: "webinars",
        label: "Webinars",
        href: "/news-events/events/webinars",
      },
      {
        id: "board-meetings",
        label: "Board Meetings",
        href: "/news-events/events/board-meetings",
      },
    ],
  },
];

const renderSidebarMenu = (args: SidebarMenuArgs) => html`
  <div style="inline-size:min(100%, 20rem);">
    ${args.labelledby
      ? html`<h2 id=${args.labelledby} style="font-size:1.125rem;margin:0 0 0.75rem;">
          ${args.label}
        </h2>`
      : ""}
    <fd-sidebar-menu
      label=${args.label}
      labelledby=${ifDefined(args.labelledby || undefined)}
      current-href=${ifDefined(args.currentHref || undefined)}
      current-id=${ifDefined(args.currentId || undefined)}
      max-depth=${args.maxDepth}
      .root=${args.root}
      .items=${args.items}
    ></fd-sidebar-menu>
  </div>
`;

const meta = {
  title: "Components/Sidebar Menu",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "Disclosure-style sidebar navigation with native links and separate caret buttons for expanding child branches.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-sidebar-menu"),
  },
  args: {
    ...getComponentArgs("fd-sidebar-menu"),
    label: "News section",
    labelledby: "",
    root: newsRoot,
    items: newsItems,
    currentHref: "/news-events/news/press-releases",
    currentId: "",
    maxDepth: 4,
  },
  render: renderSidebarMenu,
} satisfies Meta<SidebarMenuArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement, userEvent }) => {
  const sidebar = canvasElement.querySelector("fd-sidebar-menu");
  const links = Array.from(
    sidebar?.shadowRoot?.querySelectorAll<HTMLAnchorElement>("[part~='link']") ??
      [],
  );
  const buttons = Array.from(
    sidebar?.shadowRoot?.querySelectorAll<HTMLButtonElement>("[part~='toggle']") ??
      [],
  );
  let activatedHref = "";

  sidebar?.addEventListener("click", (event) => {
    const target = event.composedPath()[0] as HTMLElement | undefined;
    if (target instanceof HTMLAnchorElement) {
      event.preventDefault();
      activatedHref = target.getAttribute("href") ?? "";
    }
  });

  expect(links.map((link) => link.getAttribute("tabindex"))).toEqual(
    links.map(() => null),
  );
  expect(buttons.every((button) => button.type === "button")).toBe(true);
  expect(buttons.some((button) => button.getAttribute("aria-expanded") === "true"))
    .toBe(true);
  expect(buttons.some((button) => button.getAttribute("aria-expanded") === "false"))
    .toBe(true);

  const newsButton = buttons.find((button) =>
    button.getAttribute("aria-label")?.includes("News"),
  );
  newsButton?.focus();
  expect(sidebar?.shadowRoot?.activeElement).toBe(newsButton);

  await userEvent.keyboard("{Enter}");
  expect(newsButton?.getAttribute("aria-expanded")).toBe("false");
  expect(activatedHref).toBe("");

  links[0]?.focus();
  await userEvent.keyboard("{Enter}");
  expect(activatedHref).toBe("/news-events");
};

export const CollapsedBranch: Story = {
  args: {
    currentHref: "",
    items: newsItems.map((item) =>
      item.id === "events" ? { ...item, expanded: false } : item,
    ),
  },
};

export const DocsOverview: Story = {
  args: {
    label: "News section",
    root: newsRoot,
    items: newsItems,
    currentHref: "/news-events/news/press-releases",
  },
  parameters: {
    controls: { disable: true },
    docs: {
      disable: true,
    },
  },
  render: (args) => html`
    <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
      <h2 class=${DOCS_OVERVIEW_HEADING_CLASS}>Sidebar menu</h2>
      <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
        ${renderSidebarMenu(args)}
      </div>
    </section>
  `,
};
