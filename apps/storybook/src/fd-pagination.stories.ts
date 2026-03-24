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

type PaginationArgs = {
  currentPage: number;
  totalPages: number;
  hrefTemplate: string;
  ariaLabel: string;
  previewWidth: string;
};

const renderPagination = (args: PaginationArgs) => html`
  <div style=${`max-width: ${args.previewWidth};`}>
    <fd-pagination
      current-page=${String(args.currentPage)}
      total-pages=${String(args.totalPages)}
      href-template=${ifDefined(args.hrefTemplate || undefined)}
      aria-label=${ifDefined(args.ariaLabel || undefined)}
    ></fd-pagination>
  </div>
`;

const meta = {
  title: "Components/Pagination",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    ...getComponentArgTypes("fd-pagination"),
    ariaLabel: { control: "text" },
    previewWidth: { control: "text" },
  },
  args: {
    ...getComponentArgs("fd-pagination"),
    currentPage: 7,
    totalPages: 24,
    hrefTemplate: "",
    ariaLabel: "Search results pages",
    previewWidth: "100%",
  },
  render: renderPagination,
} satisfies Meta<PaginationArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

Playground.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-pagination") as HTMLElement | null;
  const nav = host?.shadowRoot?.querySelector("[part=nav]") as HTMLElement | null;
  const current = host?.shadowRoot?.querySelector(
    "[part=list] [aria-current=page]",
  ) as HTMLElement | null;

  expect(nav?.getAttribute("aria-label")).toBe("Search results pages");
  expect(current?.textContent?.trim()).toBe("7");
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
  },
};

export const MiddlePage: Story = {};

export const LastPage: Story = {
  args: {
    currentPage: 24,
  },
};

export const LinkMode: Story = {
  args: {
    hrefTemplate: "/results?page={page}",
  },
};

LinkMode.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-pagination") as HTMLElement | null;
  const current = host?.shadowRoot?.querySelector(
    "[part=list] [aria-current=page]",
  ) as HTMLAnchorElement | null;

  expect(current?.tagName).toBe("A");
  expect(current?.getAttribute("href")).toBe("/results?page=7");
};

export const MobileCollapsed: Story = {
  args: {
    previewWidth: "342px",
  },
};

MobileCollapsed.play = async ({ canvasElement }) => {
  const host = canvasElement.querySelector("fd-pagination") as any;
  const select = host?.shadowRoot?.querySelector(
    "[part~=mobile-select]",
  ) as HTMLSelectElement | null;

  expect(host?.mobile).toBe(true);
  expect(select?.value).toBe("7");
};

export const SmallSet: Story = {
  args: {
    currentPage: 2,
    totalPages: 4,
  },
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Bounded desktop pagination</strong>
        <fd-pagination
          current-page="7"
          total-pages="24"
          aria-label="Search results pages, middle state"
        ></fd-pagination>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>First and last edge states stay visible</strong>
        <div style="display: grid; gap: 16px;">
          <fd-pagination
            current-page="1"
            total-pages="24"
            aria-label="Article pages, first state"
          ></fd-pagination>
          <fd-pagination
            current-page="24"
            total-pages="24"
            aria-label="Article pages, last state"
          ></fd-pagination>
        </div>
      </section>

      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Mobile collapse with page picker</strong>
        <div style="max-width: 342px;">
          <fd-pagination
            current-page="7"
            total-pages="24"
            aria-label="Search results pages, mobile state"
          ></fd-pagination>
        </div>
      </section>
    </div>
  `,
};
