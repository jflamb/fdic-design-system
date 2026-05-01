import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, waitFor } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";
import {
  DOCS_OVERVIEW_HEADING_CLASS,
  DOCS_OVERVIEW_META_CLASS,
  DOCS_OVERVIEW_SECTION_STYLE,
  DOCS_OVERVIEW_SPACIOUS_STACK_STYLE,
} from "./docs-overview";
import {
  createFdGlobalHeaderReferenceSearch,
  fdGlobalHeaderReferenceNavigation,
} from "@jflamb/fdic-ds-components/fd-global-header-reference";

const PAGE_STYLE = [
  "display: flex",
  "flex-direction: column",
  "min-height: 100vh",
  "gap: 0",
  "width: 100%",
  "background: var(--fdic-color-bg-base, #ffffff)",
].join("; ");

const PAGE_MAIN_STYLE = [
  "display: block",
  "flex: 1 0 auto",
].join("; ");

const PAGE_CHROME_END_STYLE = [
  "display: block",
  "margin-block-start: auto",
].join("; ");

const SECTION_SHELL_STYLE = [
  "display: block",
  "width: 100%",
].join("; ");

const PAGE_SHELL_INLINE_SIZE =
  "min(var(--fdic-layout-shell-max-width, 1312px), calc(100% - 2 * var(--fdic-layout-gutter, 64px)))";

const PAGE_SHELL_INLINE_SIZE_TABLET =
  "min(var(--fdic-layout-shell-max-width, 1312px), calc(100% - 2 * var(--fdic-layout-gutter-tablet, 32px)))";

const PAGE_SHELL_INLINE_SIZE_MOBILE =
  "calc(100% - 2 * var(--fdic-layout-gutter-mobile, 16px))";

const PAGE_HEADER_SHELL_STYLE = [
  "--fd-page-header-max-width: var(--fdic-layout-shell-max-width, 1312px)",
  "--fd-page-header-padding-inline: var(--fdic-layout-gutter, 64px)",
  "--fd-page-header-padding-inline-tablet: var(--fdic-layout-gutter-tablet, 32px)",
  "--fd-page-header-padding-inline-mobile: var(--fdic-layout-gutter-mobile, 16px)",
  "--fd-page-header-padding-block: var(--fdic-layout-section-block-padding, 48px)",
].join("; ");

const PAGE_FEEDBACK_SHELL_STYLE = [
  "--fd-page-feedback-max-width: var(--fdic-layout-shell-max-width, 1312px)",
  "--fd-page-feedback-inline-padding: var(--fdic-layout-gutter, 64px)",
  "--fd-page-feedback-inline-padding-tablet: var(--fdic-layout-gutter-tablet, 32px)",
  "--fd-page-feedback-inline-padding-mobile: var(--fdic-layout-gutter-mobile, 16px)",
].join("; ");

const FOOTER_SHELL_STYLE = [
  "--fd-global-footer-max-width: var(--fdic-layout-shell-max-width, 1312px)",
  "--fd-global-footer-padding-inline: var(--fdic-layout-gutter, 64px)",
  "--fd-global-footer-padding-inline-tablet: var(--fdic-layout-gutter-tablet, 32px)",
  "--fd-global-footer-padding-inline-mobile: var(--fdic-layout-gutter-mobile, 16px)",
].join("; ");

const COOL_SECTION_STYLE = [
  SECTION_SHELL_STYLE,
  "background: var(--fdic-color-primary-050, #e7f6fd)",
  "border-block: 1px solid var(--fdic-color-primary-200, #9bd8f2)",
].join("; ");

const WARM_SECTION_STYLE = [
  SECTION_SHELL_STYLE,
  "background: var(--fdic-color-secondary-050, #fbf4df)",
  "border-block: 1px solid var(--fdic-color-secondary-300, #e0c875)",
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
  items: structuredClone(fdGlobalHeaderReferenceNavigation),
  search: {
    ...createFdGlobalHeaderReferenceSearch("#search"),
    paramName: "keys",
  },
};

const renderQuickLinks = () => html`
  <fd-tile-list
    columns="3"
    label="Featured links"
    tone="cool"
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
    .fdic-layout-recipe-content {
      box-sizing: border-box;
      width: ${PAGE_SHELL_INLINE_SIZE};
      margin-inline: auto;
      padding-block: var(--fdic-layout-section-block-padding-compact, 24px);
    }

    .fdic-layout-recipe-band-stack {
      display: grid;
      gap: var(--fdic-spacing-xl, 24px);
    }

    @media (max-width: 640px) {
      .fdic-layout-recipe-content {
        width: ${PAGE_SHELL_INLINE_SIZE_MOBILE};
      }
    }

    @media (min-width: 640.001px) and (max-width: 1023.999px) {
      .fdic-layout-recipe-content {
        width: ${PAGE_SHELL_INLINE_SIZE_TABLET};
      }
    }
  </style>
  <div style=${PAGE_STYLE}>
    <fd-global-header
      .navigation=${GLOBAL_HEADER_SOURCE.items}
      .search=${GLOBAL_HEADER_SOURCE.search}
    >
      <a
        slot="brand"
        href="#home"
        style="display:inline-flex; align-items:center; color:inherit; text-decoration:none; font-size:2.25rem; font-weight:700; line-height:1;"
      >
        FDICnet
      </a>
    </fd-global-header>

    <main style=${PAGE_MAIN_STYLE}>
      <fd-page-header
        heading="Employee Resources"
        kicker="Find commonly used FDICnet tools, events, and support information."
        breadcrumb-label="Breadcrumbs"
        .breadcrumbs=${[{ label: "Home", href: "#" }]}
        style=${PAGE_HEADER_SHELL_STYLE}
      ></fd-page-header>

      <section style=${COOL_SECTION_STYLE}>
        <div class="fdic-layout-recipe-content">
          <div class="fdic-layout-recipe-band-stack">
            <div class="fdic-section-header">
              <h2>Featured tools</h2>
              <p>
                Quickly open the FDICnet resources employees use most often.
              </p>
            </div>
            ${renderQuickLinks()}
          </div>
        </div>
      </section>

      <section style=${WARM_SECTION_STYLE}>
        <div class="fdic-layout-recipe-content">
          <div class="fdic-layout-recipe-band-stack">
            <div class="fdic-section-header">
              <h2>Upcoming events</h2>
              <p>
                Review upcoming FDIC-wide training, meetings, and announcements.
              </p>
            </div>
            ${renderEvents()}
          </div>
        </div>
      </section>
    </main>

    <div style=${PAGE_CHROME_END_STYLE}>
      <fd-page-feedback
        survey-href="https://www.fdic.gov"
        style=${PAGE_FEEDBACK_SHELL_STYLE}
      ></fd-page-feedback>

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
        style=${FOOTER_SHELL_STYLE}
      ></fd-global-footer>
    </div>
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

HomepageBands.play = async ({ canvasElement }) => {
  const globalHeader = canvasElement.querySelector("fd-global-header") as HTMLElement | null;
  const pageHeader = canvasElement.querySelector("fd-page-header") as HTMLElement | null;
  const feedback = canvasElement.querySelector("fd-page-feedback") as HTMLElement | null;
  const contentShell = canvasElement.querySelector(".fdic-layout-recipe-content") as HTMLElement | null;
  const warmSection = canvasElement.querySelector("main section:last-of-type") as HTMLElement | null;
  const tileList = canvasElement.querySelector("fd-tile-list") as HTMLElement | null;
  const eventList = canvasElement.querySelector("fd-event-list") as HTMLElement | null;
  const footer = canvasElement.querySelector("fd-global-footer") as HTMLElement | null;
  const headerShell = globalHeader?.shadowRoot?.querySelector(".shell") as HTMLElement | null;
  const pageHeaderContent = pageHeader?.shadowRoot?.querySelector(".content") as HTMLElement | null;
  const base = feedback?.shadowRoot?.querySelector("[part=base]") as HTMLElement | null;
  const prompt = feedback?.shadowRoot?.querySelector("[part=prompt]") as HTMLElement | null;
  const feedbackPanel = feedback?.shadowRoot?.querySelector(".panel") as HTMLElement | null;
  const footerContent = footer?.shadowRoot?.querySelector(".content") as HTMLElement | null;

  await waitFor(() => {
    const shellRect = contentShell?.getBoundingClientRect();
    const warmRect = warmSection?.getBoundingClientRect();
    const footerRect = footer?.getBoundingClientRect();
    const baseRect = base?.getBoundingClientRect();
    const promptRect = prompt?.getBoundingClientRect();
    const alignedRects = [
      headerShell?.getBoundingClientRect(),
      pageHeaderContent?.getBoundingClientRect(),
      tileList?.getBoundingClientRect(),
      eventList?.getBoundingClientRect(),
      feedbackPanel?.getBoundingClientRect(),
      footerContent?.getBoundingClientRect(),
    ];
    const shellLeft = Math.round(shellRect?.left ?? -1);
    const shellWidth = Math.round(shellRect?.width ?? -1);

    expect(Math.round(baseRect?.left ?? -1)).toBe(Math.round(warmRect?.left ?? 0));
    expect(Math.round(baseRect?.width ?? 0)).toBe(Math.round(warmRect?.width ?? 0));
    expect(Math.round(baseRect?.top ?? 0)).toBe(Math.round(warmRect?.bottom ?? 0));
    expect(Math.round(footerRect?.top ?? 0)).toBe(Math.round(baseRect?.bottom ?? 0));
    for (const rect of alignedRects) {
      expect(Math.round(rect?.left ?? -1)).toBe(shellLeft);
      expect(Math.round(rect?.width ?? -1)).toBe(shellWidth);
    }
    expect(Math.round(promptRect?.left ?? 0)).toBe(shellLeft);
    expect((promptRect?.top ?? 0) - (baseRect?.top ?? 0)).toBeGreaterThan(16);
  });
};

export const DocsOverview: Story = {
  render: () => html`
    <div style=${DOCS_OVERVIEW_SPACIOUS_STACK_STYLE}>
      <section style=${DOCS_OVERVIEW_SECTION_STYLE}>
        <strong class=${DOCS_OVERVIEW_HEADING_CLASS}>Homepage section shell</strong>
        <p class=${DOCS_OVERVIEW_META_CLASS}>
          Recipe: full-bleed section backgrounds and borders on the outside, with every top-level content
          region aligned to the shared 1312px page shell and the same desktop, tablet, and mobile gutter
          tokens.
        </p>
        ${renderRecipe()}
      </section>
    </div>
  `,
};
