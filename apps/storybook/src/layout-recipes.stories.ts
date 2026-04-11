import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "@fdic-ds/components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_META_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";

const PAGE_STYLE = [
  "display: grid",
  "gap: 0",
  "width: 100%",
  "background: var(--ds-color-bg-base, #ffffff)",
  "--fdic-layout-shell-max: 1440px",
  "--fdic-layout-shell-gutter: 64px",
  "--fdic-layout-shell-gutter-mobile: 16px",
  "--fdic-layout-content-max: calc(var(--fdic-layout-shell-max) - (2 * var(--fdic-layout-shell-gutter)))",
].join("; ");

const SECTION_SHELL_STYLE = [
  "display: block",
  "width: 100%",
].join("; ");

const SECTION_CONTENT_STYLE = [
  "box-sizing: border-box",
  "width: min(100%, var(--fdic-layout-shell-max))",
  "margin-inline: auto",
  "padding-inline: var(--fdic-layout-shell-gutter)",
  "padding-block: 32px",
].join("; ");

const SECTION_CONTENT_TIGHT_STYLE = [
  "box-sizing: border-box",
  "width: min(100%, var(--fdic-layout-shell-max))",
  "margin-inline: auto",
  "padding-inline: var(--fdic-layout-shell-gutter)",
  "padding-block: 24px",
].join("; ");

const SECTION_RULE_STYLE =
  "border-block: 1px solid var(--ds-color-border-subtle, #dfe1e2);";

const COOL_SECTION_STYLE = [
  SECTION_SHELL_STYLE,
  "background: var(--ds-color-primary-050, #e7f6fd)",
  "border-block: 1px solid var(--ds-color-primary-200, #9bd8f2)",
].join("; ");

const WARM_SECTION_STYLE = [
  SECTION_SHELL_STYLE,
  "background: var(--ds-color-secondary-050, #fbf4df)",
  "border-block: 1px solid var(--ds-color-secondary-300, #e0c875)",
].join("; ");

const NEUTRAL_SECTION_STYLE = [
  SECTION_SHELL_STYLE,
  SECTION_RULE_STYLE,
].join("; ");

const QUICK_LINKS = [
  {
    iconName: "speedometer",
    title: "Performance Management",
    href: "#performance-management",
    description: "Employee performance management program",
  },
  {
    iconName: "tree-view",
    title: "Divisions & Offices",
    href: "#divisions-and-offices",
    description: "Browse all FDIC divisions and offices",
  },
  {
    iconName: "check-circle",
    title: "Approved Directives",
    href: "#approved-directives",
    description: "View official, current FDIC directives and policy issuances",
  },
  {
    iconName: "file-text",
    title: "RD Memos",
    href: "#rd-memos",
    description: "Access memoranda issued by Regional Directors",
  },
  {
    iconName: "airplane-tilt",
    title: "Travel & Expense",
    href: "#travel-and-expense",
    description:
      "Submit and manage travel authorizations and expense reimbursements",
  },
  {
    iconName: "fork-knife",
    title: "Cafeteria Menus",
    href: "#cafeteria-menus",
    description: "Food and beverage choices for a better work day",
  },
];

const EVENTS = [
  {
    month: "FEB",
    day: "19",
    title: "Eileen Vidrine on the Human Component of AI",
    href: "#event-1",
    metadata: ["FDIC-Wide", "CIOO, DIT", "Webinar"],
  },
  {
    month: "FEB",
    day: "20",
    title: "Planned eFOS+ Outage",
    href: "#event-2",
    metadata: ["FDIC-Wide"],
  },
  {
    month: "FEB",
    day: "24",
    title: "Section 508 Document Remediation Session (PPT/Excel)",
    href: "#event-3",
    metadata: ["FDIC-Wide", "Training"],
  },
];

const GLOBAL_HEADER_SOURCE = {
  items: [
    { title: "News & Events", url: "#news", current: true },
    { title: "Learning", url: "#learning" },
    { title: "Knowledge Base", url: "#knowledge-base" },
    { title: "Benefits", url: "#benefits" },
    { title: "Support", url: "#support" },
    { title: "About", url: "#about" },
  ],
  search: {
    action: "#search",
    paramName: "keys",
    label: "Search FDICnet",
    placeholder: "Search FDICnet",
    searchAllLabel: "Search all FDICnet",
  },
};

const renderQuickLinks = () => html`
  <fd-tile-list
    columns="3"
    label="Featured links"
    tone="cool"
    style=${[
      "--fd-tile-list-col-3-max: 405.333px",
      "--fd-tile-list-col-3-gap: 48px",
      "--fd-tile-list-col-3-min: 320px",
      "--fd-tile-title-font-weight: 600",
      "--fd-tile-description-font-size: 18px",
      "--fd-tile-link-color: var(--ds-color-text-primary, #212123)",
    ].join("; ")}
  >
    ${QUICK_LINKS.map(
      (item) => html`
        <fd-tile
          icon-name=${item.iconName}
          title=${item.title}
          href=${item.href}
          description=${item.description}
        ></fd-tile>
      `,
    )}
  </fd-tile-list>
`;

const renderEvents = () => html`
  <fd-event-list
    columns="3"
    label="Upcoming events"
    tone="warm"
    style=${[
      "--fd-event-list-col-3-max: 405.333px",
      "--fd-event-list-col-3-gap: 48px",
      "--fd-event-list-col-3-min: 320px",
      "--fd-event-link-color: var(--ds-color-text-primary, #212123)",
      "--fd-event-title-color: var(--ds-color-text-primary, #212123)",
    ].join("; ")}
  >
    ${EVENTS.map(
      (item) => html`
        <fd-event
          month=${item.month}
          day=${item.day}
          title=${item.title}
          href=${item.href}
          .metadata=${item.metadata}
        ></fd-event>
      `,
    )}
  </fd-event-list>
`;

const renderRecipe = () => html`
  <style>
    @media (max-width: 640px) {
      .fdic-layout-recipe-content {
        padding-inline: var(--fdic-layout-shell-gutter-mobile) !important;
        padding-block: 24px !important;
      }
    }
  </style>
  <div style=${PAGE_STYLE}>
    <fd-global-header
      .navigation=${GLOBAL_HEADER_SOURCE.items}
      .search=${GLOBAL_HEADER_SOURCE.search}
      style=${[
        "--fd-global-header-shell-max-width: var(--fdic-layout-content-max)",
        "--fd-global-header-shell-inline-gutter: calc(2 * var(--fdic-layout-shell-gutter))",
        "--fd-global-header-shell-inline-gutter-tablet: 4rem",
        "--fd-global-header-panel-inline-gutter: 5rem",
      ].join("; ")}
    >
      <a
        slot="brand"
        href="#home"
        style="display:inline-flex; align-items:center; color:inherit; text-decoration:none; font-size:2.25rem; font-weight:700; line-height:1;"
      >
        FDICnet
      </a>
    </fd-global-header>

    <fd-page-header
      heading="FDICnet"
      kicker="Employee resources, updates, and tools"
      breadcrumb-label="Breadcrumbs"
      .breadcrumbs=${[{ label: "Home", href: "#" }]}
      style=${[
        "--fd-page-header-max-width: var(--fdic-layout-content-max)",
        "--fd-page-header-padding-inline: var(--fdic-layout-shell-gutter)",
        "--fd-page-header-padding-inline-mobile: var(--fdic-layout-shell-gutter-mobile)",
        "--fd-page-header-padding-block: 32px",
      ].join("; ")}
    ></fd-page-header>

    <section style=${COOL_SECTION_STYLE}>
      <div class="fdic-layout-recipe-content" style=${SECTION_CONTENT_STYLE}>
        <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
          <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Full-bleed cool section with constrained tile list</strong>
          <p class=${DOCS_OVERVIEW_META_CLASS}>
            Use a full-width background on the outer section, then keep interactive content inside a
            centered shell that tops out at 1440px. The shell owns the 64px desktop gutters and 16px
            mobile gutters, while DS components with their own padding use the derived 1312px content
            column so their edges line up with the page sections.
          </p>
          ${renderQuickLinks()}
        </div>
      </div>
    </section>

    <section style=${WARM_SECTION_STYLE}>
      <div class="fdic-layout-recipe-content" style=${SECTION_CONTENT_TIGHT_STYLE}>
        <div style=${DOCS_OVERVIEW_SECTION_STYLE}>
          <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Warm event section using the same shell</strong>
          <p class=${DOCS_OVERVIEW_META_CLASS}>
            Keep borders and fills on the full-bleed wrapper. Let <code>fd-event-list</code> handle the
            internal column math while the shared container controls page rhythm.
          </p>
          ${renderEvents()}
        </div>
      </div>
    </section>

    <section style=${NEUTRAL_SECTION_STYLE}>
      <div class="fdic-layout-recipe-content" style=${SECTION_CONTENT_TIGHT_STYLE}>
        <fd-page-feedback
          survey-href="https://www.fdic.gov"
          style=${[
            "--fd-page-feedback-inline-padding: 0",
            "--fd-page-feedback-inline-padding-mobile: 0",
            "--fd-page-feedback-block-padding: 0",
          ].join("; ")}
        ></fd-page-feedback>
      </div>
    </section>

    <fd-global-footer
      agency-name="Federal Deposit Insurance Corporation"
      agency-href="/"
      updated-text="Updated August 7, 2024"
      .utilityLinks=${[{ label: "Accessibility", href: "/accessibility" }]}
      .socialLinks=${[
        { icon: "facebook", label: "Follow the FDIC on Facebook", href: "#" },
        { icon: "x", label: "Follow the FDIC on X", href: "#" },
        { icon: "instagram", label: "Follow the FDIC on Instagram", href: "#" },
        { icon: "youtube", label: "Follow the FDIC on YouTube", href: "#" },
        { icon: "linkedin", label: "Follow the FDIC on LinkedIn", href: "#" },
      ]}
      style=${[
        "--fd-global-footer-max-width: var(--fdic-layout-content-max)",
        "--fd-global-footer-padding-inline: var(--fdic-layout-shell-gutter)",
        "--fd-global-footer-padding-inline-mobile: var(--fdic-layout-shell-gutter-mobile)",
      ].join("; ")}
    ></fd-global-footer>
  </div>
`;

const meta = {
  title: "Patterns/Layout Recipes",
  tags: ["autodocs"],
  parameters: {
    a11y: {
      test: "error",
    },
  },
  render: renderRecipe,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomepageBands: Story = {};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Homepage section shell</strong>
        <p class=${DOCS_OVERVIEW_META_CLASS}>
          Recipe: full-bleed section backgrounds and borders on the outside, a 1440px outer shell with
          64px desktop gutters and 16px mobile gutters, and a derived 1312px inner content column for
          DS chrome components that already manage their own internal padding.
        </p>
        ${renderRecipe()}
      </section>
    </div>
  `,
};
