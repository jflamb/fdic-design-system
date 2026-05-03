import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { expect, waitFor } from "storybook/test";
import "@jflamb/fdic-ds-components/register-all";

import articleHero from "./assets/media-item/failed-bank-exercise.png";
import relatedOne from "./assets/media-item/customer-data.png";
import relatedTwo from "./assets/media-item/pci-compliance.png";

const SIDEBAR_LINKS = [
  { href: "#news-events", label: "News & Events" },
  { href: "#overview", label: "Overview", level: 1 },
  { href: "#news", label: "News", level: 1 },
  { href: "#fdic-news", label: "FDIC News", level: 2, current: true },
  { href: "#global-messages", label: "Global Messages", level: 2 },
  { href: "#divisional-news", label: "Divisional News", level: 2 },
  { href: "#newsroom", label: "Newsroom", level: 2 },
  { href: "#events", label: "Events", level: 1 },
];

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

const renderSidebarNav = () => html`
  <nav aria-label="News section">
    <ul class="fdic-section-nav">
      ${SIDEBAR_LINKS.map(
        (link) => html`
          <li>
            <a
              href=${link.href}
              data-level=${link.level ?? 0}
              aria-current=${link.current ? "page" : nothing}
            >
              ${link.label}
            </a>
          </li>
        `,
      )}
    </ul>
  </nav>
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
        <div class="fdic-page-band__content fdic-content-layout">
          <div class="fdic-content-layout__sidebar">
            ${renderSidebarNav()}
          </div>

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
        <div class="fdic-page-band__content fdic-content-layout">
          <div class="fdic-content-layout__sidebar">
            ${renderSidebarNav()}
          </div>

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
        </div>
      </section>
    </main>
    <div class="fdic-page__chrome-end">
      <fd-page-feedback></fd-page-feedback>
      <fd-global-footer agency-name="Federal Deposit Insurance Corporation"></fd-global-footer>
    </div>
  </div>
`;

const meta = {
  title: "Patterns/Content Page Recipes",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      test: "error",
    },
  },
} satisfies Meta;

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
    const current = canvasElement.querySelector('.fdic-section-nav [aria-current="page"]');
    const image = canvasElement.querySelector(".fdic-article-media img") as HTMLImageElement | null;
    const related = canvasElement.querySelectorAll(".fdic-related-story");

    expect(layout).toBeTruthy();
    expect(sidebar?.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(article?.getBoundingClientRect().width).toBeLessThanOrEqual(800);
    expect(current?.textContent?.trim()).toBe("FDIC News");
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
