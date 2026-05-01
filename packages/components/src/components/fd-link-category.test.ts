import { describe, expect, it } from "vitest";
import "../register/fd-link-category.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createLinkCategory(
  props: Partial<HTMLElement & {
    size: string;
    tone: string;
    iconName?: string;
    category: string;
    overview?: string;
    showVisual: boolean;
    showStripe: boolean;
    links: Array<{ label: string; href: string; target?: string; rel?: string }>;
  }> = {},
) {
  const el = document.createElement("fd-link-category") as HTMLElement & {
    updateComplete: Promise<void>;
    size: string;
    tone: string;
    iconName?: string;
    category: string;
    overview?: string;
    showVisual: boolean;
    showStripe: boolean;
    links: Array<{ label: string; href: string; target?: string; rel?: string }>;
  };
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdLinkCategory", () => {
  it("registers fd-link-category", () => {
    expect(customElements.get("fd-link-category")).toBeDefined();
  });

  it("renders a labelled static article with category text and overview", async () => {
    const el = await createLinkCategory({
      category: "Benefits",
      overview: "Find benefit programs, enrollment steps, and support contacts.",
    });

    const article = el.shadowRoot?.querySelector("article");
    const category = el.shadowRoot?.querySelector("[part=category]");
    const overview = el.shadowRoot?.querySelector("[part=overview]");

    expect(article?.getAttribute("aria-labelledby")).toBe(category?.id);
    expect(category?.textContent).toBe("Benefits");
    expect(overview?.textContent).toContain("Find benefit programs");
    expect(el.getAttribute("tabindex")).toBeNull();
  });

  it("renders native links from the links property and limits them to six", async () => {
    const el = await createLinkCategory({
      category: "Resources",
      links: [
        { label: "Plan overview", href: "/overview" },
        { label: "Enrollment", href: "/enrollment" },
        { label: "Eligibility", href: "/eligibility" },
        { label: "Deadlines", href: "/deadlines" },
        { label: "Support", href: "/support" },
        { label: "Contacts", href: "/contacts" },
        { label: "Deferred", href: "/deferred" },
      ],
    });

    const links = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLAnchorElement>('[part="link"]') ?? [],
    );

    expect(links).toHaveLength(6);
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      "Plan overview",
      "Enrollment",
      "Eligibility",
      "Deadlines",
      "Support",
      "Contacts",
    ]);
    expect(links[0]?.getAttribute("href")).toBe("/overview");
  });

  it("filters invalid supporting links before rendering", async () => {
    const el = await createLinkCategory({
      category: "Resources",
      links: [
        { label: "Plan overview", href: "/overview" },
        { label: "", href: "/missing-label" },
        { label: "Missing href", href: "" },
      ],
    });

    expect(el.shadowRoot?.querySelectorAll('[part="link"]')).toHaveLength(1);
  });

  it("adds noopener noreferrer for _blank links", async () => {
    const el = await createLinkCategory({
      category: "Resources",
      links: [
        { label: "External resource", href: "https://example.com", target: "_blank" },
      ],
    });

    const link = el.shadowRoot?.querySelector<HTMLAnchorElement>('[part="link"]');
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("preserves rel values for same-tab links", async () => {
    const el = await createLinkCategory({
      category: "Resources",
      links: [{ label: "Help", href: "/help", rel: "help" }],
    });

    expect(
      el.shadowRoot?.querySelector<HTMLAnchorElement>('[part="link"]')?.getAttribute("rel"),
    ).toBe("help");
  });

  it("renders decorative visual and stripe by default", async () => {
    const el = await createLinkCategory({ category: "Resources", tone: "cool" });

    const visual = el.shadowRoot?.querySelector("fd-visual");
    const stripe = el.shadowRoot?.querySelector("fd-stripe");

    expect(visual?.getAttribute("type")).toBe("cool");
    expect(stripe?.getAttribute("type")).toBe("cool");
  });

  it("inherits visual colors from fd-visual instead of patching them locally", () => {
    const styles = (
      customElements.get("fd-link-category") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";
    const visualRule = styles.match(/\[part="visual"\] fd-visual \{[^}]+}/)?.[0] ?? "";

    expect(visualRule).toContain("--fd-visual-size");
    expect(visualRule).not.toContain("--fd-link-category-visual-bg");
    expect(visualRule).not.toContain("--fd-link-category-visual-fg");
    expect(visualRule).not.toContain("var(--fdic-color-primary-400)");
    expect(visualRule).not.toContain("var(--fdic-color-secondary-300)");
    expect(visualRule).not.toContain("var(--fdic-color-icon-warm)");
    expect(visualRule).not.toContain("var(--fdic-color-icon-inverted)");
  });

  it("uses the standard hyperlink color for category links by default", () => {
    const styles = (
      customElements.get("fd-link-category") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("color: var(--fd-link-category-link-color, var(--fdic-color-text-link))");
  });

  it("omits decorative visual and stripe when disabled", async () => {
    const el = await createLinkCategory({
      category: "Resources",
      showVisual: false,
      showStripe: false,
    });

    expect(el.shadowRoot?.querySelector("fd-visual")).toBeNull();
    expect(el.shadowRoot?.querySelector("fd-stripe")).toBeNull();
  });

  it("renders an optional decorative icon inside the visual", async () => {
    const el = await createLinkCategory({
      category: "Resources",
      iconName: "download",
    });

    const icon = el.shadowRoot?.querySelector("fd-icon");
    expect(icon?.getAttribute("name")).toBe("download");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("normalizes invalid size and tone values", async () => {
    const el = await createLinkCategory({
      category: "Resources",
      size: "unsupported",
      tone: "unsupported",
    });

    const article = el.shadowRoot?.querySelector("article");
    const visual = el.shadowRoot?.querySelector("fd-visual");

    expect(article?.className).toContain("size-medium");
    expect(article?.className).toContain("tone-neutral");
    expect(visual?.getAttribute("type")).toBe("neutral");
  });

  it("uses large size styling when requested", async () => {
    const el = await createLinkCategory({ category: "Resources", size: "large" });
    expect(el.shadowRoot?.querySelector("article")?.className).toContain("size-large");
  });

  it("omits aria-labelledby when category is blank", async () => {
    const el = await createLinkCategory({ overview: "Helpful links." });
    expect(el.shadowRoot?.querySelector("article")?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("accepts show-visual and show-stripe false attribute values", async () => {
    const el = document.createElement("fd-link-category") as HTMLElement & {
      updateComplete: Promise<void>;
      category: string;
    };
    el.category = "Resources";
    el.setAttribute("show-visual", "false");
    el.setAttribute("show-stripe", "false");
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector("fd-visual")).toBeNull();
    expect(el.shadowRoot?.querySelector("fd-stripe")).toBeNull();
  });

  it("passes an axe audit with visible content and links", async () => {
    const el = await createLinkCategory({
      category: "Benefits",
      overview: "Find benefit programs, enrollment steps, and support contacts.",
      links: [
        { label: "Plan overview", href: "/overview" },
        { label: "Enrollment deadlines", href: "/deadlines" },
      ],
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
