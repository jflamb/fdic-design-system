import { html } from "lit";

import compositionHero from "./assets/hero/neutral.webp";

export const COMPOSITION_PATTERNS_TEST_ID = "composition-patterns-canonical";

const QUICK_ACTIONS = [
  {
    href: "#contact-support",
    label: "Contact support",
  },
  {
    href: "#policy-library",
    label: "Policy library",
  },
  {
    href: "#training-calendar",
    label: "Training calendar",
  },
];

const RESOURCE_COLUMNS = [
  {
    id: "services",
    title: "Services",
    links: [
      { href: "#benefits", label: "Benefits overview" },
      { href: "#leave", label: "Leave and time off" },
    ],
  },
  {
    id: "technology",
    title: "Technology",
    links: [
      { href: "#hardware", label: "Hardware requests" },
      { href: "#access", label: "Account access" },
    ],
  },
  {
    id: "help",
    title: "Help",
    links: [
      { href: "#contact", label: "Contact the service desk" },
      { href: "#status", label: "View service status" },
    ],
  },
];

const RELATED_RESOURCES = [
  {
    href: "#policy-updates",
    iconLabel: "Policy update",
    title: "Policy update",
    description: "Read the latest changes before routing employee questions.",
  },
  {
    href: "#retirement-guide",
    iconLabel: "Retirement guide",
    title: "Retirement guide",
    description: "Use the official summary when employees ask about eligibility.",
  },
  {
    href: "#travel-help",
    iconLabel: "Travel help",
    title: "Travel help",
    description: "Find the current expense and reimbursement instructions.",
  },
];

export const renderCompositionPatternsFixture = () => html`
  <main
    data-testid=${COMPOSITION_PATTERNS_TEST_ID}
    style="display:grid; gap:0; width:100%; max-width:none;"
  >
    <section
      class="fdic-composition-section fdic-composition-section--highlight"
      aria-labelledby="composition-patterns-intro"
    >
      <div class="fdic-composition-section__inner">
        <p class="fdic-eyebrow">Canonical example</p>
        <h1 id="composition-patterns-intro">Composition patterns with semantic HTML</h1>
        <p>
          These classes shape layout only. Keep headings, landmarks, lists, and links in the authored
          HTML so the page stays understandable without the CSS contract.
        </p>
      </div>
    </section>

    <section
      class="fdic-composition-section"
      aria-labelledby="featured-story-title"
    >
      <div class="fdic-composition-section__inner fdic-composition-feature-rail">
        <article aria-labelledby="featured-story-title">
          <div class="fdic-composition-story">
            <figure class="fdic-composition-story__media" style="margin:0;">
              <img
                src=${compositionHero}
                alt="FDIC staff reviewing guidance on a laptop"
                style="display:block; width:100%; height:auto;"
              />
            </figure>
            <div class="fdic-composition-story__body">
              <p class="fdic-eyebrow">Featured update</p>
              <h2 id="featured-story-title">Deposit insurance update for employees</h2>
              <p>
                Share the summary before sending questions to the policy owner or support desk.
              </p>
              <p><a href="#deposit-insurance-update">Review the update</a></p>
            </div>
          </div>
        </article>

        <section aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title">Quick actions</h2>
          <ul style="margin:0; padding-inline-start:1.25rem;">
            ${QUICK_ACTIONS.map(
              (item) => html`<li><a href=${item.href}>${item.label}</a></li>`,
            )}
          </ul>
        </section>
      </div>
    </section>

    <nav class="fdic-composition-section fdic-composition-section--warm" aria-labelledby="resources-title">
      <div class="fdic-composition-section__inner">
        <h2 id="resources-title">Grouped resources</h2>
        <div class="fdic-composition-link-columns">
          ${RESOURCE_COLUMNS.map(
            (column) => html`
              <section class="fdic-composition-link-column" aria-labelledby=${`${column.id}-title`}>
                <h3 id=${`${column.id}-title`} class="fdic-composition-link-column__title">
                  ${column.title}
                </h3>
                <ul class="fdic-composition-link-column__list">
                  ${column.links.map(
                    (link) => html`<li><a href=${link.href}>${link.label}</a></li>`,
                  )}
                </ul>
              </section>
            `,
          )}
        </div>
      </div>
    </nav>

    <section class="fdic-composition-section" aria-labelledby="related-resources-title">
      <div class="fdic-composition-section__inner">
        <h2 id="related-resources-title">Related resources</h2>
        <ul
          class="fdic-composition-link-grid"
          aria-label="Related resources"
          style="list-style:none; margin:0; padding:0;"
        >
          ${RELATED_RESOURCES.map(
            (item) => html`
              <li>
                <article class="fdic-composition-link-card">
                  <span class="fdic-composition-link-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32" focusable="false" aria-hidden="true">
                      <circle cx="16" cy="16" r="12"></circle>
                      <path d="M10 16h12" fill="none" stroke="currentColor" stroke-width="2"></path>
                    </svg>
                  </span>
                  <div class="fdic-composition-link-card__body">
                    <h3><a href=${item.href}>${item.title}</a></h3>
                    <p>${item.description}</p>
                  </div>
                </article>
              </li>
            `,
          )}
        </ul>
      </div>
    </section>

    <section class="fdic-composition-section" aria-labelledby="supporting-panels-title">
      <div class="fdic-composition-section__inner">
        <h2 id="supporting-panels-title">Supporting panels</h2>
        <div class="fdic-composition-dual">
          <article class="fdic-composition-dual__panel" aria-labelledby="policy-notice-title">
            <p class="fdic-eyebrow">Policy notice</p>
            <h3 id="policy-notice-title">Review current policy before publishing</h3>
            <p>
              Use the current source of truth and keep the supporting panel short enough for a quick scan.
            </p>
          </article>
          <article class="fdic-composition-dual__panel" aria-labelledby="service-notice-title">
            <p class="fdic-eyebrow">Service notice</p>
            <h3 id="service-notice-title">Check service status before escalating</h3>
            <p>
              This panel stays equal-weight with the policy panel on desktop and collapses naturally on mobile.
            </p>
          </article>
        </div>
      </div>
    </section>
  </main>
`;
