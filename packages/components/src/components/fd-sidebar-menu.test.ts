import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-icon.js";
import "../register/fd-sidebar-menu.js";
import { FdSidebarMenu } from "./fd-sidebar-menu.js";
import type {
  FdSidebarMenuItem,
  FdSidebarMenuRoot,
} from "./fd-sidebar-menu.js";
import { expectNoAxeViolations } from "./test-a11y.js";

const root: FdSidebarMenuRoot = {
  label: "News & Events",
  href: "/news-events",
};

const items: FdSidebarMenuItem[] = [
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
            id: "consumer",
            label: "Consumer updates",
            href: "/news-events/news/fdic-news/consumer",
          },
          {
            id: "banker",
            label: "Banker updates",
            href: "/news-events/news/fdic-news/banker",
          },
        ],
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
    ],
  },
];

async function createSidebarMenu({
  attrs = {},
  menuRoot,
  menuItems = items,
}: {
  attrs?: Record<string, string>;
  menuRoot?: FdSidebarMenuRoot;
  menuItems?: FdSidebarMenuItem[];
} = {}) {
  const el = document.createElement("fd-sidebar-menu") as any;

  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }

  if (menuRoot) {
    el.root = menuRoot;
  }

  el.items = menuItems;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getLinks(el: HTMLElement) {
  return Array.from(
    el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("[part~='link']"),
  );
}

function getVisibleLinks(el: HTMLElement) {
  return getLinks(el).filter((link) => !link.closest("[hidden]"));
}

function getVisibleLinkTexts(el: HTMLElement) {
  return getVisibleLinks(el).map((link) => link.textContent?.trim());
}

function getToggle(el: HTMLElement, label: string) {
  return Array.from(
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>("[part~='toggle']"),
  ).find((toggle) => toggle.getAttribute("aria-label")?.includes(label));
}

function nextAnimationFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

describe("fd-sidebar-menu", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-sidebar-menu", () => {
    expect(customElements.get("fd-sidebar-menu")).toBeDefined();
  });

  it("normalizes invalid items out of the rendered tree", async () => {
    const el = await createSidebarMenu({
      menuItems: [
        { label: "Good", href: "/good" },
        { label: "", href: "/missing-label" },
        { label: "Missing href", href: "" },
        null,
      ] as unknown as FdSidebarMenuItem[],
    });

    expect(getVisibleLinkTexts(el)).toEqual(["Good"]);
  });

  it("renders a labeled nav with native nested lists, links, and toggle buttons", async () => {
    const el = await createSidebarMenu({
      attrs: { label: "News section", "current-id": "press-releases" },
      menuRoot: root,
    });
    const nav = el.shadowRoot!.querySelector("nav");
    const lists = el.shadowRoot!.querySelectorAll("ul");
    const items = el.shadowRoot!.querySelectorAll("li");
    const newsToggle = getToggle(el, "News");
    const pressRelease = getVisibleLinks(el).find(
      (link) => link.textContent?.trim() === "Press Releases",
    );

    expect(nav?.getAttribute("aria-label")).toBe("News section");
    expect(lists.length).toBeGreaterThan(1);
    expect(items.length).toBeGreaterThan(1);
    expect(newsToggle?.getAttribute("aria-expanded")).toBe("true");
    expect(pressRelease?.tagName).toBe("A");
    expect(pressRelease?.getAttribute("href")).toBe(
      "/news-events/news/press-releases",
    );
  });

  it("proxies external labelledby text into the shadow DOM", async () => {
    const heading = document.createElement("h2");
    heading.id = "section-heading";
    heading.textContent = "News menu";
    document.body.appendChild(heading);

    const el = await createSidebarMenu({
      attrs: { label: "Fallback label", labelledby: "section-heading" },
    });
    const nav = el.shadowRoot!.querySelector("nav");
    const proxy = el.shadowRoot!.getElementById(
      nav?.getAttribute("aria-labelledby") ?? "",
    );

    expect(nav?.getAttribute("aria-labelledby")).toMatch(
      /^fd-sidebar-menu-label-/,
    );
    expect(nav?.hasAttribute("aria-label")).toBe(false);
    expect(proxy?.textContent).toBe("News menu");
  });

  it("falls back to label when labelledby cannot be resolved", async () => {
    const el = await createSidebarMenu({
      attrs: { label: "Fallback label", labelledby: "missing-heading" },
    });
    const nav = el.shadowRoot!.querySelector("nav");

    expect(nav?.getAttribute("aria-label")).toBe("Fallback label");
    expect(nav?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("renders the root item and divider when root and items are present", async () => {
    const el = await createSidebarMenu({ menuRoot: root });
    const links = getVisibleLinks(el);
    const divider = el.shadowRoot!.querySelector("[part='divider']");

    expect(links[0]?.textContent?.trim()).toBe("News & Events");
    expect(links[0]?.getAttribute("href")).toBe("/news-events");
    expect(divider).toBeTruthy();
  });

  it("marks the current page by id before href", async () => {
    const el = await createSidebarMenu({
      attrs: {
        "current-id": "fdic-news",
        "current-href": "/news-events/news/press-releases",
      },
    });
    const current = el.shadowRoot!.querySelector("[aria-current='page']");

    expect(current?.textContent?.trim()).toBe("FDIC News");
  });

  it("renders exactly one aria-current page link", async () => {
    const el = await createSidebarMenu({
      attrs: { "current-id": "consumer" },
      menuRoot: root,
    });

    expect(el.shadowRoot!.querySelectorAll("[aria-current='page']")).toHaveLength(
      1,
    );
  });

  it("expands the current path by default", async () => {
    const el = await createSidebarMenu({ attrs: { "current-id": "consumer" } });

    expect(getVisibleLinkTexts(el)).toEqual([
      "Overview",
      "News",
      "Global Messages",
      "FDIC News",
      "Consumer updates",
      "Banker updates",
      "Press Releases",
      "Events",
    ]);
    expect(getToggle(el, "News")?.getAttribute("aria-expanded")).toBe("true");
    expect(getToggle(el, "FDIC News")?.getAttribute("aria-expanded")).toBe(
      "true",
    );
    expect(getToggle(el, "Events")?.getAttribute("aria-expanded")).toBe("false");
  });

  it("lets the caret button expand and collapse a branch", async () => {
    const el = await createSidebarMenu();
    const eventsToggle = getToggle(el, "Events");
    const eventsSublist = eventsToggle?.closest("li")?.querySelector("ul");

    expect(getVisibleLinkTexts(el)).toEqual(["Overview", "News", "Events"]);
    expect(eventsToggle?.getAttribute("aria-expanded")).toBe("false");
    expect(eventsSublist?.hasAttribute("hidden")).toBe(true);

    eventsToggle?.click();
    await el.updateComplete;

    expect(getVisibleLinkTexts(el)).toEqual([
      "Overview",
      "News",
      "Events",
      "Webinars",
    ]);
    expect(getToggle(el, "Events")?.getAttribute("aria-expanded")).toBe("true");
    expect(eventsSublist?.hasAttribute("hidden")).toBe(false);
    expect(eventsSublist?.getAttribute("data-expanded")).toBe("false");

    await nextAnimationFrame();
    await el.updateComplete;

    expect(eventsSublist?.getAttribute("data-expanded")).toBe("true");

    getToggle(el, "Events")?.click();
    await el.updateComplete;

    expect(getToggle(el, "Events")?.getAttribute("aria-expanded")).toBe("false");
    expect(eventsSublist?.hasAttribute("hidden")).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 180));
    await el.updateComplete;

    expect(getVisibleLinkTexts(el)).toEqual(["Overview", "News", "Events"]);
    expect(eventsSublist?.hasAttribute("hidden")).toBe(true);
  });

  it("preserves native hidden behavior for collapsed sublists", () => {
    const styles = FdSidebarMenu.styles.cssText;

    expect(styles).toContain('[part~="sublist"][hidden]');
    expect(styles).toContain("display: none;");
  });

  it("animates branch disclosure and suppresses motion when requested", () => {
    const styles = FdSidebarMenu.styles.cssText;

    expect(styles).toContain("--fd-sidebar-menu-transition-duration");
    expect(styles).toContain("interpolate-size: allow-keywords;");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain("transition: none !important;");
  });

  it("keeps the link and caret as separate click targets", async () => {
    const el = await createSidebarMenu();
    let clickedHref = "";

    el.addEventListener("click", (event) => {
      const target = event.composedPath()[0] as HTMLElement | undefined;
      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        clickedHref = target.getAttribute("href") ?? "";
      }
    });

    getToggle(el, "News")?.click();
    await el.updateComplete;

    expect(clickedHref).toBe("");

    getVisibleLinks(el)
      .find((link) => link.textContent?.trim() === "News")
      ?.click();

    expect(clickedHref).toBe("/news-events/news");
  });

  it("respects item-level expanded branches", async () => {
    const el = await createSidebarMenu({
      menuItems: [
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
          ],
        },
      ],
    });

    expect(getVisibleLinkTexts(el)).toEqual(["Events", "Webinars"]);
    expect(getToggle(el, "Events")?.getAttribute("aria-expanded")).toBe("true");
  });

  it("caps expandable branches at max depth", async () => {
    const el = await createSidebarMenu({
      attrs: { "current-id": "consumer", "max-depth": "2" },
    });

    expect(getVisibleLinkTexts(el)).toEqual([
      "Overview",
      "News",
      "Global Messages",
      "FDIC News",
      "Press Releases",
      "Events",
    ]);
    expect(getToggle(el, "FDIC News")).toBeUndefined();
    expect(el.shadowRoot!.textContent).not.toContain("Consumer updates");
  });

  it("has no axe violations for representative navigation", async () => {
    const el = await createSidebarMenu({
      attrs: { label: "News section", "current-id": "consumer" },
      menuRoot: root,
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
