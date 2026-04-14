import { describe, expect, it } from "vitest";
import "../register/fd-tile.js";
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

  it("darkens the nested visual with Figma hover tones on the primary link", () => {
    const styles = (
      customElements.get("fd-tile") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("--fd-tile-visual-bg-neutral");
    expect(styles).toContain("var(--fdic-color-overlay-hover)");
    expect(styles).toContain("--fd-tile-visual-bg-cool");
    expect(styles).toContain("var(--fdic-color-primary-200)");
    expect(styles).toContain("--fd-tile-visual-bg-warm");
    expect(styles).toContain("var(--fdic-color-secondary-300)");
    expect(styles).toContain("--fd-tile-visual-bg-cool-emphasis");
    expect(styles).toContain("var(--fdic-color-primary-500)");
    expect(styles).toContain("--fd-tile-visual-bg-neutral-emphasis");
    expect(styles).toContain("var(--fdic-color-icon-primary)");
    expect(styles).toContain("--fd-tile-visual-bg-warm-emphasis");
    expect(styles).toContain("var(--fdic-color-secondary-800)");
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
