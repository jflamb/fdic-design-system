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
  <div class="fdic-page">
    <fd-global-header
      .navigation=${GLOBAL_HEADER_SOURCE.items}
      .search=${GLOBAL_HEADER_SOURCE.search}
    ></fd-global-header>

    <main class="fdic-page__main">
      <fd-page-header
        heading="Employee Resources"
        kicker="Find commonly used FDICnet tools, events, and support information."
        breadcrumb-label="Breadcrumbs"
        .breadcrumbs=${[{ label: "Home", href: "#" }]}
      ></fd-page-header>

      <section class="fdic-page-band fdic-page-band--cool">
        <div class="fdic-page-band__content">
          <div class="fdic-page-band__stack">
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

      <section class="fdic-page-band fdic-page-band--warm">
        <div class="fdic-page-band__content">
          <div class="fdic-page-band__stack">
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

    <div class="fdic-page__chrome-end">
      <fd-page-feedback
        survey-href="https://www.fdic.gov"
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
  const contentShell = canvasElement.querySelector(".fdic-page-band__content") as HTMLElement | null;
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
