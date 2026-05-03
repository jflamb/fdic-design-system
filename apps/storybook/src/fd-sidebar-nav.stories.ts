import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import type {
  FdSidebarNavItem,
  FdSidebarNavRoot,
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

type SidebarNavArgs = {
  label: string;
  labelledby: string;
  root?: FdSidebarNavRoot;
  items: FdSidebarNavItem[];
  currentHref: string;
  currentId: string;
  maxDepth: 1 | 2 | 3 | 4;
  allowExplicitExpanded: boolean;
};

const newsRoot: FdSidebarNavRoot = {
  label: "News & Events",
  href: "/news-events",
};

const newsItems: FdSidebarNavItem[] = [
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

const policyItems: FdSidebarNavItem[] = [
  {
    id: "policy-overview",
    label: "Policy overview",
    href: "/policy",
  },
  {
    id: "rules",
    label: "Rules and regulations",
    href: "/policy/rules",
    items: [
      {
        id: "proposed-rules",
        label: "Proposed rules",
        href: "/policy/rules/proposed",
      },
      {
        id: "final-rules",
        label: "Final rules",
        href: "/policy/rules/final",
      },
    ],
  },
  {
    id: "guidance",
    label: "Guidance",
    href: "/policy/guidance",
  },
];

const renderSidebarNav = (args: SidebarNavArgs) => html`
  <div style="inline-size:min(100%, 20rem);">
    ${args.labelledby
      ? html`<h2 id=${args.labelledby} style="font-size:1.125rem;margin:0 0 0.75rem;">
          ${args.label}
        </h2>`
      : ""}
    <fd-sidebar-nav
      label=${args.label}
      labelledby=${ifDefined(args.labelledby || undefined)}
      current-href=${ifDefined(args.currentHref || undefined)}
      current-id=${ifDefined(args.currentId || undefined)}
      max-depth=${args.maxDepth}
      ?allow-explicit-expanded=${args.allowExplicitExpanded}
      .root=${args.root}
      .items=${args.items}
    ></fd-sidebar-nav>
  </div>
`;

const meta = {
  title: "Components/Sidebar Nav",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      description: {
        component:
          "Local sidebar navigation for content-heavy sections, built from structured data and rendered as native lists and links.",
      },
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-sidebar-nav"),
  },
  args: {
    ...getComponentArgs("fd-sidebar-nav"),
    label: "News section",
    labelledby: "",
    root: newsRoot,
    items: newsItems,
    currentHref: "/news-events/news/press-releases",
    currentId: "",
    maxDepth: 4,
    allowExplicitExpanded: false,
  },
  render: renderSidebarNav,
} satisfies Meta<SidebarNavArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement, userEvent }) => {
  const sidebar = canvasElement.querySelector("fd-sidebar-nav");
  const links = Array.from(
    sidebar?.shadowRoot?.querySelectorAll<HTMLAnchorElement>("[part~='link']") ??
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

  expect(sidebar?.shadowRoot?.querySelector("[aria-expanded]")).toBeNull();
  expect(links.map((link) => link.getAttribute("tabindex"))).toEqual(
    links.map(() => null),
  );

  links[0]?.focus();
  expect(sidebar?.shadowRoot?.activeElement).toBe(links[0]);

  await userEvent.keyboard("{Enter}");
  expect(activatedHref).toBe("/news-events");
};

export const RootItem: Story = {
  args: {
    root: newsRoot,
    items: newsItems,
    currentHref: "/news-events",
  },
};

export const NestedCurrentLeaf: Story = {
  args: {
    root: newsRoot,
    items: newsItems,
    currentId: "press-releases",
  },
};

export const ParentCurrentWithChildren: Story = {
  args: {
    root: newsRoot,
    items: newsItems,
    currentId: "news",
  },
};

export const MaxDepthBehavior: Story = {
  args: {
    root: newsRoot,
    items: newsItems,
    currentId: "consumer-news",
    maxDepth: 2,
  },
};

export const FocusHoverCurrentStates: Story = {
  render: () => html`
    <div style="display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));">
      ${renderSidebarNav({
        label: "Current page",
        labelledby: "",
        root: newsRoot,
        items: newsItems,
        currentHref: "",
        currentId: "press-releases",
        maxDepth: 4,
        allowExplicitExpanded: false,
      })}
      ${renderSidebarNav({
        label: "Parent current",
        labelledby: "",
        root: newsRoot,
        items: newsItems,
        currentHref: "",
        currentId: "news",
        maxDepth: 4,
        allowExplicitExpanded: false,
      })}
    </div>
  `,
};

export const RealisticNewsSectionTree: Story = {
  args: {
    label: "News section",
    root: newsRoot,
    items: newsItems,
    currentId: "press-releases",
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div class=${DOCS_OVERVIEW_SPACIOUS_STACK_CLASS}>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Current section path</strong>
        ${renderSidebarNav({
          label: "News section",
          labelledby: "",
          root: newsRoot,
          items: newsItems,
          currentHref: "",
          currentId: "press-releases",
          maxDepth: 4,
          allowExplicitExpanded: false,
        })}
      </section>
      <section class=${DOCS_OVERVIEW_SECTION_CLASS}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Without a web-area root</strong>
        ${renderSidebarNav({
          label: "Policy section",
          labelledby: "",
          items: policyItems,
          currentHref: "",
          currentId: "final-rules",
          maxDepth: 4,
          allowExplicitExpanded: false,
        })}
      </section>
    </div>
  `,
};
