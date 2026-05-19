import { describe, expect, it } from "vitest";
import "../register/fd-tile.js";
import { FdTile } from "./fd-tile.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createTile(
  props: Partial<HTMLElement & {
    title: string;
    href?: string;
    description?: string;
    links: Array<{ label: string; href: string; target?: string; rel?: string }>;
    target?: string;
    rel?: string;
    tone: string;
    visualType?: string;
    visualPosition?: string;
    iconName?: string;
  }> = {},
) {
  const el = document.createElement("fd-tile") as HTMLElement & {
    updateComplete: Promise<void>;
    title: string;
    href?: string;
    description?: string;
    links: Array<{ label: string; href: string; target?: string; rel?: string }>;
    target?: string;
    rel?: string;
    tone: string;
    visualType?: string;
    visualPosition?: string;
    iconName?: string;
  };
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdTile", () => {
  it("registers fd-tile", () => {
    expect(customElements.get("fd-tile")).toBeDefined();
  });

  it("renders a labelled article with a primary link", async () => {
    const el = await createTile({
      title: "Benefits",
      href: "/benefits",
      description: "Review insurance, leave, and retirement resources.",
    });

    const article = el.shadowRoot?.querySelector("article");
    const primaryLink = el.shadowRoot?.querySelector<HTMLAnchorElement>(
      '[part="primary-link"]',
    );
    const title = el.shadowRoot?.querySelector<HTMLElement>(".title-link");
    const description = el.shadowRoot?.querySelector("[part=description]");

    expect(article?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(primaryLink?.getAttribute("href")).toBe("/benefits");
    expect(title?.textContent).toContain("Benefits");
    expect(description?.textContent).toContain("Review insurance");
  });

  it("renders supporting links from the links property and limits them to four", async () => {
    const el = await createTile({
      title: "Benefits",
      links: [
        { label: "Health", href: "/health" },
        { label: "Vision", href: "/vision" },
        { label: "Dental", href: "/dental" },
        { label: "Life", href: "/life" },
        { label: "Deferred", href: "/deferred" },
      ],
    });

    const links = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".support-link") ?? [],
    );

    expect(links).toHaveLength(4);
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "Health",
      "Vision",
      "Dental",
      "Life",
    ]);
  });

  it("renders supporting links from slotted anchors when links property is empty", async () => {
    const el = await createTile({ title: "Benefits" });
    const firstLink = document.createElement("a");
    firstLink.slot = "supporting-link";
    firstLink.setAttribute("href", "/benefits/overview");
    firstLink.textContent = "Plan overview";

    const secondLink = document.createElement("a");
    secondLink.slot = "supporting-link";
    secondLink.setAttribute("href", "/benefits/deadlines");
    secondLink.target = "_blank";
    secondLink.textContent = "Enrollment deadlines";

    el.append(firstLink, secondLink);
    el.shadowRoot
      ?.querySelector<HTMLSlotElement>('slot[name="supporting-link"]')
      ?.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const links = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".support-link") ?? [],
    );

    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "Plan overview",
      "Enrollment deadlines",
    ]);
    expect(links[0]?.getAttribute("href")).toBe("/benefits/overview");
    expect(links[1]?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("filters invalid slotted anchors, ignores non-anchors, and limits slotted links to four", async () => {
    const el = await createTile({ title: "Benefits" });
    const sourceLinks = [
      ["Plan overview", "/benefits/overview"],
      ["   ", "/benefits/blank-label"],
      ["Missing href", ""],
      ["Enrollment deadlines", "/benefits/deadlines"],
      ["Eligibility", "/benefits/eligibility"],
      ["Support contacts", "/benefits/support"],
      ["Deferred", "/benefits/deferred"],
    ] as const;
    const sourceElements = sourceLinks.map(([label, href]) => {
      const anchor = document.createElement("a");
      anchor.slot = "supporting-link";
      anchor.textContent = label;
      if (href) {
        anchor.setAttribute("href", href);
      }
      return anchor;
    });
    const nonAnchor = document.createElement("div");
    nonAnchor.slot = "supporting-link";
    nonAnchor.textContent = "Not a link";

    el.append(nonAnchor, ...sourceElements);
    el.shadowRoot
      ?.querySelector<HTMLSlotElement>('slot[name="supporting-link"]')
      ?.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const links = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".support-link") ?? [],
    );

    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "Plan overview",
      "Enrollment deadlines",
      "Eligibility",
      "Support contacts",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/benefits/overview",
      "/benefits/deadlines",
      "/benefits/eligibility",
      "/benefits/support",
    ]);
  });

  it("prefers property links over slotted supporting links", async () => {
    const el = await createTile({
      title: "Benefits",
      links: [{ label: "Property link", href: "/property" }],
    });
    const slottedLink = document.createElement("a");
    slottedLink.slot = "supporting-link";
    slottedLink.setAttribute("href", "/slotted");
    slottedLink.textContent = "Slotted link";

    el.append(slottedLink);
    el.shadowRoot
      ?.querySelector<HTMLSlotElement>('slot[name="supporting-link"]')
      ?.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const links = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".support-link") ?? [],
    );

    expect(links).toHaveLength(1);
    expect(links[0]?.textContent?.trim()).toBe("Property link");
  });

  it("keeps the supporting-link source slot hidden and passes an axe audit", async () => {
    const el = await createTile({ title: "Benefits" });
    const slottedLink = document.createElement("a");
    slottedLink.slot = "supporting-link";
    slottedLink.setAttribute("href", "/benefits/overview");
    slottedLink.textContent = "Plan overview";

    el.append(slottedLink);
    el.shadowRoot
      ?.querySelector<HTMLSlotElement>('slot[name="supporting-link"]')
      ?.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const slot = el.shadowRoot?.querySelector<HTMLSlotElement>(
      'slot[name="supporting-link"]',
    );

    expect(slot?.hasAttribute("hidden")).toBe(true);
    await expectNoAxeViolations(el);
  });

  it("aligns supporting links with the text column", () => {
    const styles = FdTile.styles.cssText;

    expect(styles).toContain("margin-inline-start: calc(");
    expect(styles).toContain("var(--fd-tile-visual-track-size, 46px)");
    expect(styles).toContain("var(--fd-tile-gap, var(--fdic-spacing-sm, 12px))");
    expect(styles).toContain("var(--fd-tile-visual-track-size-expanded, 48px)");
    expect(styles).toContain("var(--fd-tile-visual-track-size-large, 60px)");
    expect(styles).toContain("var(--fd-tile-gap-large, var(--fdic-spacing-md, 16px))");
  });

  it("defaults the decorative visual to the left of the link content", async () => {
    const el = await createTile({ title: "Benefits" });

    expect(el.getAttribute("visual-position")).toBe("left");
  });

  it("supports placing the decorative visual above the link content", async () => {
    const el = await createTile({ title: "Benefits", visualPosition: "top" });
    const styles = FdTile.styles.cssText;

    expect(el.getAttribute("visual-position")).toBe("top");
    expect(styles).toContain(':host([visual-position="top"]) [part="primary-link"]');
    expect(styles).toContain("flex-direction: column");
    expect(styles).toContain("gap: var(--fd-tile-visual-top-gap, var(--fdic-spacing-xs, 8px))");
    expect(styles).toContain(':host([visual-position="top"]) [part="links"]');
    expect(styles).toContain("margin-inline-start: 0");
  });

  it("adds noopener noreferrer for _blank links", async () => {
    const el = await createTile({
      title: "Benefits",
      href: "https://example.com/benefits",
      target: "_blank",
      links: [
        { label: "External", href: "https://example.com/help", target: "_blank" },
      ],
    });

    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(
      '[part="primary-link"]',
    );
    const support = el.shadowRoot?.querySelector<HTMLAnchorElement>(".support-link");

    expect(title?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(support?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders plain text when href is omitted", async () => {
    const el = await createTile({ title: "Benefits" });

    expect(el.shadowRoot?.querySelector('[part="primary-link"]')?.tagName).toBe("DIV");
    expect(el.shadowRoot?.querySelector(".title-link")).toBeNull();
    expect(el.shadowRoot?.querySelector(".title-text")?.textContent).toContain(
      "Benefits",
    );
  });

  it("omits aria-labelledby when no title is provided", async () => {
    const el = await createTile();
    expect(el.shadowRoot?.querySelector("article")?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("renders in compact mode when description and links are absent", async () => {
    const el = await createTile({ title: "Benefits" });
    expect(el.shadowRoot?.querySelector('[part="primary-link"]')?.className).toContain("compact");
  });

  it("defines the default title and description scale on the tile itself", () => {
    const styles = FdTile.styles.cssText;

    expect(styles).toContain("--fd-tile-title-font-weight: 600");
    expect(styles).toContain("--fd-tile-description-font-size: var(--fdic-font-size-body, 18px)");
  });

  it("omits the description block when description is blank", async () => {
    const el = await createTile({ title: "Benefits", description: "   " });
    expect(el.shadowRoot?.querySelector("[part=description]")).toBeNull();
  });

  it("filters invalid supporting links before rendering", async () => {
    const el = await createTile({
      title: "Benefits",
      links: [
        { label: "Health", href: "/health" },
        { label: "", href: "/missing-label" },
        { label: "Missing href", href: "" },
      ],
    });

    expect(el.shadowRoot?.querySelectorAll(".support-link")).toHaveLength(1);
  });

  it("renders the decorative icon when iconName is provided", async () => {
    const el = await createTile({ title: "Benefits", iconName: "bank" });
    const icon = el.shadowRoot?.querySelector('fd-icon');

    expect(icon).not.toBeNull();
    expect(icon?.getAttribute("name")).toBe("bank");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("omits the decorative icon when iconName is blank", async () => {
    const el = await createTile({ title: "Benefits" });
    expect(el.shadowRoot?.querySelector("fd-icon")).toBeNull();
  });

  it("normalizes invalid tones back to neutral on the visual", async () => {
    const el = await createTile({ title: "Benefits", tone: "unsupported" });
    expect(el.shadowRoot?.querySelector("fd-visual")?.getAttribute("type")).toBe("neutral");
  });

  it("allows an explicit visual type that differs from the tile tone", async () => {
    const el = await createTile({
      title: "Spotlight",
      tone: "neutral",
      visualType: "avatar",
    });

    expect(el.shadowRoot?.querySelector("fd-visual")?.getAttribute("type")).toBe("avatar");
  });

  it("preserves rel values for same-tab links", async () => {
    const el = await createTile({
      title: "Benefits",
      href: "/benefits",
      rel: "author",
      links: [{ label: "Support", href: "/support", rel: "help" }],
    });

    expect(
      el.shadowRoot?.querySelector('[part="primary-link"]')?.getAttribute("rel"),
    ).toBe("author");
    expect(el.shadowRoot?.querySelector(".support-link")?.getAttribute("rel")).toBe("help");
  });

  it("uses the primary link as the shared hit area for the visual and title", async () => {
    const el = await createTile({
      title: "Benefits",
      href: "/benefits",
      description: "Review insurance, leave, and retirement resources.",
      iconName: "bank",
    });

    const primaryLink = el.shadowRoot?.querySelector('[part="primary-link"]');
    expect(primaryLink?.querySelector('[part="visual"] fd-visual')).not.toBeNull();
    expect(primaryLink?.querySelector(".title-link")?.textContent).toContain("Benefits");
  });

  it("uses the standard hyperlink color for linked titles and support links by default", () => {
    const styles = (
      customElements.get("fd-tile") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("color: var(--fd-tile-link-color, var(--fdic-color-text-link))");
  });

  it("uses fd-visual variables for linked visual hover emphasis", () => {
    const styles = (
      customElements.get("fd-tile") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";
    const visualRule = styles.match(/\[part="visual"\] fd-visual \{[^}]+}/)?.[0] ?? "";

    expect(visualRule).toContain("--fd-visual-size");
    expect(visualRule).toContain("--fd-visual-padding");
    expect(visualRule).toContain("--fd-visual-content-size");
    expect(styles).toContain("--fd-tile-visual-size-expanded");
    expect(styles).toContain("--fd-tile-visual-size-large");
    expect(styles).toContain("--fd-tile-visual-track-size-large");
    expect(styles).toContain("--fd-tile-visual-content-size-large");
    expect(styles).toContain("--fd-visual-bg-neutral: var(");
    expect(styles).toContain("--fd-tile-visual-bg-neutral-emphasis");
    expect(styles).toContain("--fd-tile-visual-bg-cool-emphasis");
    expect(styles).toContain("--fd-tile-visual-bg-warm-emphasis");
    expect(styles).toContain("--fdic-color-primary-500");
    expect(styles).toContain("--fdic-color-secondary-800");
  });

  it("passes an axe audit in linked mode", async () => {
    const el = await createTile({
      title: "Benefits",
      href: "/benefits",
      description: "Review insurance, leave, and retirement resources.",
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });

  it("renders no title content when title is blank", async () => {
    const el = await createTile({ description: "Review insurance options." });
    expect(el.shadowRoot?.querySelector(".title-link")).toBeNull();
    expect(el.shadowRoot?.querySelector(".title-text")).toBeNull();
  });
});
