import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-sidebar-nav.js";
import type {
  FdSidebarNavItem,
  FdSidebarNavRoot,
} from "./fd-sidebar-nav.js";
import { expectNoAxeViolations } from "./test-a11y.js";

const root: FdSidebarNavRoot = {
  label: "News & Events",
  href: "/news-events",
};

const items: FdSidebarNavItem[] = [
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

async function createSidebarNav({
  attrs = {},
  navRoot,
  navItems = items,
}: {
  attrs?: Record<string, string>;
  navRoot?: FdSidebarNavRoot;
  navItems?: FdSidebarNavItem[];
} = {}) {
  const el = document.createElement("fd-sidebar-nav") as any;

  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }

  if (navRoot) {
    el.root = navRoot;
  }

  el.items = navItems;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getLinks(el: HTMLElement) {
  return Array.from(
    el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("[part~='link']"),
  );
}

function getLinkTexts(el: HTMLElement) {
  return getLinks(el).map((link) => link.textContent?.trim());
}

describe("fd-sidebar-nav", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-sidebar-nav", () => {
    expect(customElements.get("fd-sidebar-nav")).toBeDefined();
  });

  it("normalizes invalid items out of the rendered tree", async () => {
    const el = await createSidebarNav({
      navItems: [
        { label: "Good", href: "/good" },
        { label: "", href: "/missing-label" },
        { label: "Missing href", href: "" },
        null,
      ] as unknown as FdSidebarNavItem[],
    });

    expect(getLinkTexts(el)).toEqual(["Good"]);
  });

  it("renders a labeled nav with native nested lists and links", async () => {
    const el = await createSidebarNav({
      attrs: { label: "News section", "current-id": "press-releases" },
      navRoot: root,
    });
    const nav = el.shadowRoot!.querySelector("nav");
    const lists = el.shadowRoot!.querySelectorAll("ul");
    const items = el.shadowRoot!.querySelectorAll("li");
    const pressRelease = getLinks(el).find(
      (link) => link.textContent?.trim() === "Press Releases",
    );

    expect(nav?.getAttribute("aria-label")).toBe("News section");
    expect(lists.length).toBeGreaterThan(1);
    expect(items.length).toBeGreaterThan(1);
    expect(pressRelease?.tagName).toBe("A");
    expect(pressRelease?.getAttribute("href")).toBe(
      "/news-events/news/press-releases",
    );
  });

  it("proxies external labelledby text into the shadow DOM", async () => {
    const heading = document.createElement("h2");
    heading.id = "section-heading";
    heading.textContent = "News navigation";
    document.body.appendChild(heading);

    const el = await createSidebarNav({
      attrs: { label: "Fallback label", labelledby: "section-heading" },
    });
    const nav = el.shadowRoot!.querySelector("nav");
    const proxy = el.shadowRoot!.getElementById(
      nav?.getAttribute("aria-labelledby") ?? "",
    );

    expect(nav?.getAttribute("aria-labelledby")).toMatch(
      /^fd-sidebar-nav-label-/,
    );
    expect(nav?.hasAttribute("aria-label")).toBe(false);
    expect(proxy?.textContent).toBe("News navigation");
  });

  it("updates the shadow-local label proxy when the external heading changes", async () => {
    const heading = document.createElement("h2");
    heading.id = "section-heading";
    heading.textContent = "News navigation";
    document.body.appendChild(heading);

    const el = await createSidebarNav({
      attrs: { label: "Fallback label", labelledby: "section-heading" },
    });
    const nav = el.shadowRoot!.querySelector("nav");

    heading.textContent = "Updated navigation";
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;

    const proxy = el.shadowRoot!.getElementById(
      nav?.getAttribute("aria-labelledby") ?? "",
    );
    expect(proxy?.textContent).toBe("Updated navigation");
  });

  it("falls back to label when labelledby cannot be resolved", async () => {
    const el = await createSidebarNav({
      attrs: { label: "Fallback label", labelledby: "missing-heading" },
    });
    const nav = el.shadowRoot!.querySelector("nav");

    expect(nav?.getAttribute("aria-label")).toBe("Fallback label");
    expect(nav?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("renders the root item and divider when root and items are present", async () => {
    const el = await createSidebarNav({ navRoot: root });
    const links = getLinks(el);
    const divider = el.shadowRoot!.querySelector("[part='divider']");

    expect(links[0]?.textContent?.trim()).toBe("News & Events");
    expect(links[0]?.getAttribute("href")).toBe("/news-events");
    expect(divider).toBeTruthy();
  });

  it("does not render a root divider when there are no items", async () => {
    const el = await createSidebarNav({ navRoot: root, navItems: [] });

    expect(getLinkTexts(el)).toEqual(["News & Events"]);
    expect(el.shadowRoot!.querySelector("[part='divider']")).toBeNull();
  });

  it("matches the current page by href", async () => {
    const el = await createSidebarNav({
      attrs: { "current-href": "/news-events/news/press-releases" },
    });
    const current = el.shadowRoot!.querySelector("[aria-current='page']");

    expect(current?.textContent?.trim()).toBe("Press Releases");
  });

  it("matches the current page by id before href", async () => {
    const el = await createSidebarNav({
      attrs: {
        "current-id": "fdic-news",
        "current-href": "/news-events/news/press-releases",
      },
    });
    const current = el.shadowRoot!.querySelector("[aria-current='page']");

    expect(current?.textContent?.trim()).toBe("FDIC News");
  });

  it("renders exactly one aria-current page link", async () => {
    const el = await createSidebarNav({
      attrs: { "current-id": "consumer" },
      navRoot: root,
    });

    expect(el.shadowRoot!.querySelectorAll("[aria-current='page']")).toHaveLength(
      1,
    );
  });

  it("keeps root current state exclusive when an item shares the same href", async () => {
    const el = await createSidebarNav({
      attrs: { "current-href": "/news-events" },
      navRoot: root,
    });
    const currentLinks = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("[aria-current='page']"),
    );

    expect(currentLinks).toHaveLength(1);
    expect(currentLinks[0]?.textContent?.trim()).toBe("News & Events");
  });

  it("marks path ancestors without aria-current", async () => {
    const el = await createSidebarNav({ attrs: { "current-id": "consumer" } });
    const pathLinks = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLAnchorElement>("[data-path='true']"),
    );

    expect(pathLinks.map((link) => link.textContent?.trim())).toEqual([
      "News",
      "FDIC News",
    ]);
    expect(pathLinks.every((link) => !link.hasAttribute("aria-current"))).toBe(
      true,
    );
  });

  it("renders leaf-current sibling context and omits unrelated descendant branches", async () => {
    const el = await createSidebarNav({
      attrs: { "current-id": "press-releases" },
    });

    expect(getLinkTexts(el)).toEqual([
      "Overview",
      "News",
      "Global Messages",
      "FDIC News",
      "Press Releases",
      "Events",
    ]);
    expect(el.shadowRoot!.textContent).not.toContain("Consumer updates");
    expect(el.shadowRoot!.textContent).not.toContain("Webinars");
  });

  it("renders current item children when the current page has children", async () => {
    const el = await createSidebarNav({ attrs: { "current-id": "fdic-news" } });

    expect(getLinkTexts(el)).toEqual([
      "Overview",
      "News",
      "Global Messages",
      "FDIC News",
      "Consumer updates",
      "Banker updates",
      "Press Releases",
      "Events",
    ]);
  });

  it("caps rendered branches at max depth", async () => {
    const el = await createSidebarNav({
      attrs: { "current-id": "consumer", "max-depth": "2" },
    });

    expect(getLinkTexts(el)).toEqual([
      "Overview",
      "News",
      "Global Messages",
      "FDIC News",
      "Press Releases",
      "Events",
    ]);
    expect(el.shadowRoot!.textContent).not.toContain("Consumer updates");
  });

  it("ignores explicit item expansion unless explicitly allowed", async () => {
    const expandedItems = [
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
    ];

    const el = await createSidebarNav({ navItems: expandedItems });

    expect(getLinkTexts(el)).toEqual(["Events"]);
  });

  it("renders explicit expanded branches when allowExplicitExpanded is true", async () => {
    const expandedItems = [
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
    ];

    const el = await createSidebarNav({
      attrs: { "allow-explicit-expanded": "" },
      navItems: expandedItems,
    });

    expect(getLinkTexts(el)).toEqual(["Events", "Webinars"]);
  });

  it("does not render aria-expanded in v1", async () => {
    const el = await createSidebarNav({
      attrs: { "allow-explicit-expanded": "", "current-id": "fdic-news" },
    });

    expect(el.shadowRoot!.querySelector("[aria-expanded]")).toBeNull();
  });

  it("has no axe violations for representative navigation", async () => {
    const el = await createSidebarNav({
      attrs: { label: "News section", "current-id": "consumer" },
      navRoot: root,
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
