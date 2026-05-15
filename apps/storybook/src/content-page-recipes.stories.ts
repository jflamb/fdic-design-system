import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { expect, waitFor } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";

import articleHero from "./assets/media-item/failed-bank-exercise.png";
import relatedOne from "./assets/media-item/customer-data.png";
import relatedTwo from "./assets/media-item/pci-compliance.png";

const NEWS_EVENTS_SIDEBAR_ROOT = {
  label: "News & Events",
  href: "/news-events",
};

const NEWS_EVENTS_SIDEBAR_ITEMS = [
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
        id: "fdic-news",
        label: "FDIC News",
        href: "/news-events/news/fdic-news",
      },
      {
        id: "global-messages",
        label: "Global Messages",
        href: "/news-events/news/global-messages",
      },
      {
        id: "divisional-news",
        label: "Divisional News",
        href: "/news-events/news/divisional-news",
      },
      {
        id: "newsroom",
        label: "Newsroom",
        href: "/news-events/news/newsroom",
      },
    ],
  },
  {
    id: "events",
    label: "Events",
    href: "/news-events/events",
    items: [
      {
        id: "training",
        label: "Training",
        href: "/news-events/events/training",
      },
      {
        id: "board-meetings",
        label: "Board Meetings",
        href: "/news-events/events/board-meetings",
      },
    ],
  },
  {
    id: "podcasts-media",
    label: "Podcasts & Media",
    href: "/news-events/podcasts-media",
  },
];

type EventDetailArgs = {
  eventFormat: "virtual" | "in-person" | "hybrid";
  eventLocation: string;
  eventAudience: "FDIC-Wide" | "Public" | "Bankers" | "Internal";
  eventRegistration: "required" | "not-required" | "waitlist" | "closed";
  eventDate: string;
  eventTime: string;
};

const REGISTRATION_BUTTON_LABELS: Record<EventDetailArgs["eventRegistration"], string> = {
  required: "Register for the course",
  "not-required": "Join the event",
  waitlist: "Join the waitlist",
  closed: "Registration closed",
};

const REGISTRATION_NOTES: Record<EventDetailArgs["eventRegistration"], string> = {
  required: "Microsoft Teams link sent after registration.",
  "not-required": "No registration is required.",
  waitlist: "Waitlist confirmation sent by email.",
  closed: "Registration is closed for this event.",
};

const FORMAT_LABELS: Record<EventDetailArgs["eventFormat"], string> = {
  virtual: "Virtual",
  "in-person": "In person",
  hybrid: "Hybrid",
};

const HEADLINES = [
  {
    title: "Economic Analyst Sees Connection in Running",
    href: "#story-1",
    metadata: ["June 18, 2025", "FDIC News", "DIR", "People"],
  },
  {
    title: "FDIC Attorney's Legacy: The Chairmen's Baseball",
    href: "#story-2",
    metadata: ["May 30, 2025", "FDIC News", "Legal", "History"],
  },
  {
    title: "Fourth of July Celebration",
    href: "#story-3",
    metadata: ["July 11, 2025", "FDIC News", "Employee event"],
  },
  {
    title: "Document remediation sessions open for registration",
    href: "#story-4",
    metadata: ["May 9, 2025", "Global Messages", "Training"],
  },
];

const renderStandardSidebarNav = (currentHref: string) => html`
  <fd-sidebar-nav
    label="News and Events section"
    current-href=${ifDefined(currentHref)}
    .root=${NEWS_EVENTS_SIDEBAR_ROOT}
    .items=${NEWS_EVENTS_SIDEBAR_ITEMS}
  ></fd-sidebar-nav>
`;

const renderResponsiveSidebarNav = (currentHref: string, disclosureLabel = "More in News & Events") => html`
  <div class="fdic-content-layout__sidebar-panel">
    ${renderStandardSidebarNav(currentHref)}
  </div>
  <details class="fdic-content-layout__sidebar-disclosure">
    <summary>${disclosureLabel}</summary>
    <div class="fdic-content-layout__sidebar-disclosure-body">
      ${renderStandardSidebarNav(currentHref)}
    </div>
  </details>
`;

const renderHeadlineList = () => html`
  <ol class="fdic-headline-list">
    ${HEADLINES.map(
      (item) => html`
        <li class="fdic-headline-list__item">
          <h3 class="fdic-headline-list__title">
            <a href=${item.href}>${item.title}</a>
          </h3>
          <div class="fdic-headline-list__meta">
            ${item.metadata.join(" | ")}
          </div>
        </li>
      `,
    )}
  </ol>
`;

const renderArticle = () => html`
  <div class="fdic-page" style="--fdic-layout-shell-max-width: 1312px;">
    <fd-global-header></fd-global-header>
    <main class="fdic-page__main">
      <fd-page-header
        heading="Economic Analyst Sees Connection in Running"
        breadcrumb-label="Breadcrumbs"
        .breadcrumbs=${[
          { label: "Home", href: "#" },
          { label: "News & Events", href: "#" },
          { label: "News", href: "#" },
        ]}
      ></fd-page-header>

      <section class="fdic-page-band" aria-label="Article content">
        <div class="fdic-page-band__content fdic-content-layout fdic-content-layout--detail-priority">
          <article class="fdic-content-layout__main prose" aria-label="Economic Analyst Sees Connection in Running">
            <p class="fdic-composition-meta">
              By <a href="mailto:communications@example.gov">Sonya Weakley</a>, Office of
              Communications | June 18, 2025
            </p>
            <figure class="fdic-article-media">
              <img
                src=${articleHero}
                alt="FDIC employees gathered for an emergency preparedness exercise"
              />
              <figcaption>
                Cover images appear above article content, use a 16:9 ratio, and include a useful
                caption when the image conveys story context.
              </figcaption>
            </figure>
            <h2>Staying focused</h2>
            <p>
              Article pages keep the main content in a readable rail while the sidebar supports
              orientation. The sidebar should help readers understand where they are; it should not
              become the primary way to complete the task.
            </p>
            <p>
              The article body stays in normal semantic HTML. Headings inside the article start at
              <code>h2</code>, links use descriptive text, and images are either described or marked
              decorative.
            </p>
            <fd-chip-group label="Topics">
              <fd-chip>DIR</fd-chip>
              <fd-chip>People</fd-chip>
            </fd-chip-group>

            <h2>More FDIC News</h2>
            <ul class="fdic-related-stories">
              <li class="fdic-related-story">
                <img src=${relatedOne} alt="" />
                <h3><a href="#related-1">Fourth of July Celebration</a></h3>
                <p class="fdic-composition-meta">July 11, 2025</p>
              </li>
              <li class="fdic-related-story">
                <img src=${relatedTwo} alt="" />
                <h3><a href="#related-2">FDIC Attorney's Legacy</a></h3>
                <p class="fdic-composition-meta">May 30, 2025</p>
              </li>
            </ul>
          </article>

          <div class="fdic-content-layout__sidebar">
            ${renderResponsiveSidebarNav("/news-events/news/fdic-news")}
          </div>
        </div>
      </section>
    </main>
    <div class="fdic-page__chrome-end">
      <fd-page-feedback></fd-page-feedback>
      <fd-global-footer agency-name="Federal Deposit Insurance Corporation"></fd-global-footer>
    </div>
  </div>
`;

const renderNewsIndex = () => html`
  <div class="fdic-page" style="--fdic-layout-shell-max-width: 1312px;">
    <fd-global-header></fd-global-header>
    <main class="fdic-page__main">
      <fd-page-header
        heading="FDIC News"
        kicker="Employee news, global messages, and divisional updates."
        breadcrumb-label="Breadcrumbs"
        .breadcrumbs=${[{ label: "Home", href: "#" }, { label: "News & Events", href: "#" }]}
      ></fd-page-header>

      <section class="fdic-page-band" aria-label="News list">
        <div class="fdic-page-band__content fdic-content-layout fdic-content-layout--detail-priority">
          <div class="fdic-content-layout__main">
            <div class="prose">
              <p>
                Use filters when the list is long enough that readers need to narrow by keyword,
                category, date, or office. Keep the results as a real list so counts, sorting, and
                empty states can be announced clearly.
              </p>
              <h2 id="filter-news">Filter news</h2>
            </div>

            <form class="fdic-content-filter" aria-labelledby="filter-news">
              <div class="fdic-content-filter__criteria">
                <fd-field>
                  <fd-label for="news-keyword" label="Keyword"></fd-label>
                  <fd-input id="news-keyword" name="keyword" type="search"></fd-input>
                </fd-field>
                <fd-selector label="Topic" placeholder="All topics" variant="single">
                  <fd-option value="all">All topics</fd-option>
                  <fd-option value="fdic-news">FDIC News</fd-option>
                  <fd-option value="global-messages">Global Messages</fd-option>
                  <fd-option value="divisional-news">Divisional News</fd-option>
                </fd-selector>
                <fd-selector label="Office" placeholder="All offices" variant="single">
                  <fd-option value="all">All offices</fd-option>
                  <fd-option value="dir">DIR</fd-option>
                  <fd-option value="legal">Legal</fd-option>
                  <fd-option value="oc">Office of Communications</fd-option>
                </fd-selector>
                <fd-selector label="Year" placeholder="Any year" variant="single">
                  <fd-option value="2026">2026</fd-option>
                  <fd-option value="2025">2025</fd-option>
                  <fd-option value="2024">2024</fd-option>
                </fd-selector>
              </div>
              <div class="fdic-content-filter__actions">
                <fd-button type="submit" variant="primary">Apply filters</fd-button>
                <fd-button type="reset" variant="subtle">Clear filters</fd-button>
              </div>
            </form>

            <section class="prose" aria-labelledby="results-heading">
              <h2 id="results-heading">Recent FDIC News</h2>
              ${renderHeadlineList()}
            </section>
          </div>

          <div class="fdic-content-layout__sidebar">
            ${renderResponsiveSidebarNav("/news-events/news/fdic-news")}
          </div>
        </div>
      </section>
    </main>
    <div class="fdic-page__chrome-end">
      <fd-page-feedback></fd-page-feedback>
      <fd-global-footer agency-name="Federal Deposit Insurance Corporation"></fd-global-footer>
    </div>
  </div>
`;

const renderEventDetail = (args: EventDetailArgs) => {
  const formatLabel = FORMAT_LABELS[args.eventFormat];
  const locationText =
    args.eventFormat === "virtual" || !args.eventLocation.trim()
      ? `${args.eventAudience} | ${formatLabel}`
      : `${args.eventAudience} | ${formatLabel} | ${args.eventLocation.trim()}`;
  const registrationLabel = REGISTRATION_BUTTON_LABELS[args.eventRegistration];
  const isRegistrationClosed = args.eventRegistration === "closed";

  return html`
  <div class="fdic-page" style="--fdic-layout-shell-max-width: 1312px;">
    <fd-global-header></fd-global-header>
    <main class="fdic-page__main">
      <fd-page-header
        heading="Building Better Documents with Microsoft Word Tables"
        breadcrumb-label="Breadcrumbs"
        .breadcrumbs=${[
          { label: "Home", href: "#" },
          { label: "News & Events", href: "#" },
          { label: "Events", href: "#" },
        ]}
      ></fd-page-header>

      <section class="fdic-page-band" aria-label="Event details">
        <div class="fdic-page-band__content fdic-content-layout fdic-content-layout--detail-priority">
          <article
            class="fdic-content-layout__main prose"
            aria-labelledby="event-detail-title"
          >
            <section class="fdic-event-detail-summary" aria-label="Key event details">
              <p class="fdic-event-detail-summary__date">${args.eventDate}</p>
              <p class="fdic-event-detail-summary__time">${args.eventTime}</p>
              <p class="fdic-event-detail-summary__location">${locationText}</p>

              <div class="fdic-event-detail-summary__actions">
                <fd-button
                  href=${isRegistrationClosed ? "" : "/learning/word-tables/register"}
                  variant="primary"
                  ?disabled=${isRegistrationClosed}
                >
                  ${registrationLabel}
                </fd-button>
                <fd-button href="/events/word-tables.ics" variant="outline">
                  <fd-icon slot="icon-start" name="microsoft-outlook-logo"></fd-icon>
                  Add to Outlook
                </fd-button>
              </div>

              <p>
                Participants will learn how to use Microsoft Word tables to present information in a
                clear, organized, and professional manner. They will explore how tables help structure
                content so it is easier to read, compare, and understand while applying formatting
                techniques that enhance clarity and design.
              </p>

              <p class="fdic-event-detail-summary__note">
                ${REGISTRATION_NOTES[args.eventRegistration]}
              </p>
            </section>

            <h2>What participants will practice</h2>
            <ul>
              <li>Choosing when a table is the clearest format for information.</li>
              <li>Setting up simple header rows and readable column structure.</li>
              <li>Checking tables for accessibility before sharing documents.</li>
            </ul>
          </article>

          <div class="fdic-content-layout__sidebar">
            ${renderResponsiveSidebarNav("/news-events/events/training")}
          </div>
        </div>
      </section>
    </main>
    <div class="fdic-page__chrome-end">
      <fd-page-feedback></fd-page-feedback>
      <fd-global-footer agency-name="Federal Deposit Insurance Corporation"></fd-global-footer>
    </div>
  </div>
`;
};

const meta = {
  title: "Patterns/Content Page Recipes",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      test: "error",
    },
  },
  argTypes: {
    eventFormat: {
      control: "radio",
      options: ["virtual", "in-person", "hybrid"],
      description: "Event Detail story-only control for attendance format.",
      table: { category: "Event Detail controls" },
    },
    eventLocation: {
      control: "text",
      description: "Shown for in-person and hybrid events; hidden for virtual events.",
      table: { category: "Event Detail controls" },
    },
    eventAudience: {
      control: "select",
      options: ["FDIC-Wide", "Public", "Bankers", "Internal"],
      description: "Event Detail story-only control for audience metadata.",
      table: { category: "Event Detail controls" },
    },
    eventRegistration: {
      control: "radio",
      options: ["required", "not-required", "waitlist", "closed"],
      description: "Event Detail story-only control for registration action state.",
      table: { category: "Event Detail controls" },
    },
    eventDate: {
      control: "text",
      description: "Event Detail story-only control for the displayed date.",
      table: { category: "Event Detail controls" },
    },
    eventTime: {
      control: "text",
      description: "Event Detail story-only control for the displayed time.",
      table: { category: "Event Detail controls" },
    },
  },
  args: {
    eventFormat: "virtual",
    eventLocation: "Washington, DC",
    eventAudience: "FDIC-Wide",
    eventRegistration: "required",
    eventDate: "Wednesday, May 20, 2026",
    eventTime: "11 a.m.–Noon ET",
  },
} satisfies Meta<EventDetailArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewsArticleWithSidebar: Story = {
  render: renderArticle,
};

NewsArticleWithSidebar.play = async ({ canvasElement }) => {
  await waitFor(() => {
    const layout = canvasElement.querySelector(".fdic-content-layout") as HTMLElement | null;
    const sidebar = canvasElement.querySelector(".fdic-content-layout__sidebar") as HTMLElement | null;
    const article = canvasElement.querySelector("article.prose") as HTMLElement | null;
    const sidebarNav = canvasElement.querySelector(".fdic-content-layout__sidebar-panel fd-sidebar-nav");
    const current = sidebarNav?.shadowRoot?.querySelector('a[aria-current="page"]');
    const disclosure = canvasElement.querySelector(".fdic-content-layout__sidebar-disclosure");
    const image = canvasElement.querySelector(".fdic-article-media img") as HTMLImageElement | null;
    const related = canvasElement.querySelectorAll(".fdic-related-story");

    expect(layout).toBeTruthy();
    expect(sidebar?.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(article?.getBoundingClientRect().width).toBeLessThanOrEqual(800);
    expect(current?.textContent?.trim()).toBe("FDIC News");
    expect(disclosure?.textContent).toContain("More in News & Events");
    expect(canvasElement.querySelector(".fdic-section-nav")).toBeFalsy();
    expect(image?.getAttribute("alt")).toContain("FDIC employees");
    expect(related).toHaveLength(2);
  });
};

export const NewsStoriesWithFilters: Story = {
  render: renderNewsIndex,
};

NewsStoriesWithFilters.play = async ({ canvasElement }) => {
  await waitFor(() => {
    const form = canvasElement.querySelector("form.fdic-content-filter");
    const criteria = canvasElement.querySelectorAll(".fdic-content-filter__criteria > *");
    const headlines = canvasElement.querySelectorAll(".fdic-headline-list__item");
    const submit = canvasElement.querySelector('fd-button[type="submit"]');

    expect(form?.getAttribute("aria-labelledby")).toBe("filter-news");
    expect(criteria).toHaveLength(4);
    expect(headlines).toHaveLength(4);
    expect(submit?.textContent?.trim()).toBe("Apply filters");
  });
};

export const EventDetail: Story = {
  render: renderEventDetail,
};

EventDetail.play = async ({ canvasElement }) => {
  await waitFor(() => {
    const summary = canvasElement.querySelector(".fdic-event-detail-summary");
    const actions = canvasElement.querySelectorAll(".fdic-event-detail-summary__actions fd-button");
    const sidebar = canvasElement.querySelector(".fdic-content-layout__sidebar-panel fd-sidebar-nav");
    const sidebarDisclosure = canvasElement.querySelector(".fdic-content-layout__sidebar-disclosure");

    expect(summary).toBeTruthy();
    expect(actions).toHaveLength(2);
    expect(summary?.textContent).toContain("11 a.m.–Noon ET");
    expect(summary?.textContent).toContain("FDIC-Wide | Virtual");
    expect(summary?.textContent).toContain("Register for the course");
    expect(summary?.textContent).toContain("Add to Outlook");
    expect(summary?.textContent).toContain("Teams link sent after registration");
    expect(summary?.textContent).toContain("Participants will learn");
    expect(summary?.querySelector('fd-icon[name="microsoft-outlook-logo"]')).toBeTruthy();
    expect(sidebar).toBeTruthy();
    expect(sidebarDisclosure?.textContent).toContain("More in News & Events");
  });
};
