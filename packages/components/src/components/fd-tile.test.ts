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
    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
    const description = el.shadowRoot?.querySelector("[part=description]");

    expect(article?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(title?.textContent).toContain("Benefits");
    expect(title?.getAttribute("href")).toBe("/benefits");
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

    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
    const support = el.shadowRoot?.querySelector<HTMLAnchorElement>(".support-link");

    expect(title?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(support?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders plain text when href is omitted", async () => {
    const el = await createTile({ title: "Benefits" });

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
    expect(el.shadowRoot?.querySelector("[part=base]")?.className).toContain("compact");
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

    expect(el.shadowRoot?.querySelector(".title-link")?.getAttribute("rel")).toBe("author");
    expect(el.shadowRoot?.querySelector(".support-link")?.getAttribute("rel")).toBe("help");
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
