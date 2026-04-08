import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-hero.js";
import { FdHero } from "./fd-hero.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createHero(
  attrs: Record<string, string> = {},
  innerHTML = `
    <h2 slot="heading">Benefits</h2>
    <p slot="lede">
      Your compensation at FDIC includes competitive pay, clear policies, and
      structured performance management.
    </p>
    <p slot="body">
      Access the Federal Employee Health Benefits Program and more.
    </p>
  `,
) {
  const el = document.createElement("fd-hero") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getBase(el: any): HTMLElement | null {
  return el.shadowRoot?.querySelector("[part=base]") ?? null;
}

describe("FdHero", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-hero", () => {
    expect(customElements.get("fd-hero")).toBeDefined();
  });

  it("defaults to the cool tone", async () => {
    const el = await createHero();
    const base = getBase(el);

    expect(el.tone).toBe("cool");
    expect(base?.className).toContain("tone-cool");
  });

  it("normalizes unsupported tones to cool", async () => {
    const el = await createHero({ tone: "unknown" });

    expect(getBase(el)?.className).toContain("tone-cool");
  });

  it("wires aria-labelledby to the slotted heading element", async () => {
    const el = await createHero();
    const heading = el.querySelector('[slot="heading"]') as HTMLElement | null;

    expect(heading?.id).toMatch(/^fd-hero-heading-/);
    expect(getBase(el)?.getAttribute("aria-labelledby")).toBe(heading?.id);
  });

  it("styles slotted copy with the inverted text token", async () => {
    const stylesheet = Array.isArray(FdHero.styles)
      ? FdHero.styles.map((style) => style.cssText).join("\n")
      : FdHero.styles.cssText;

    expect(stylesheet).toContain("::slotted([slot=\"heading\"])");
    expect(stylesheet).toContain(
      "color: var(--ds-color-text-inverted, light-dark(#ffffff, #000000)) !important;",
    );
  });

  it("uses semantic gradient tokens for hero overlays", () => {
    const stylesheet = Array.isArray(FdHero.styles)
      ? FdHero.styles.map((style) => style.cssText).join("\n")
      : FdHero.styles.cssText;

    expect(stylesheet).toContain("var(--ds-gradient-hero-overlay-cool)");
    expect(stylesheet).toContain("var(--ds-gradient-hero-overlay-warm)");
    expect(stylesheet).toContain("var(--ds-gradient-hero-overlay-neutral)");
  });

  it("preserves an authored heading id", async () => {
    const el = await createHero(
      {},
      `
        <h2 slot="heading" id="hero-heading">Benefits</h2>
      `,
    );

    expect(getBase(el)?.getAttribute("aria-labelledby")).toBe("hero-heading");
  });

  it("renders no aria-labelledby when no heading element is assigned", async () => {
    const el = await createHero({}, '<p slot="body">Supporting content</p>');

    expect(getBase(el)?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("renders the decorative stripe only when both lede and body are present", async () => {
    const el = await createHero();
    const stripe = el.shadowRoot?.querySelector("[part=stripe]");

    expect(stripe).toBeTruthy();

    const withoutBody = await createHero(
      {},
      `
        <h2 slot="heading">Benefits</h2>
        <p slot="lede">Introductory copy only.</p>
      `,
    );

    expect(withoutBody.shadowRoot?.querySelector("[part=stripe]")).toBeNull();
  });

  it("renders the CTA only when both action-label and action-href are present", async () => {
    const withoutAction = await createHero({ "action-label": "Explore benefits" });
    const withAction = await createHero({
      "action-label": "Explore benefits",
      "action-href": "/benefits",
    });

    expect(withoutAction.shadowRoot?.querySelector("[part=action]")).toBeNull();
    expect(
      (
        withAction.shadowRoot?.querySelector("[part=action]") as HTMLAnchorElement
      )?.getAttribute("href"),
    ).toBe("/benefits");
  });

  it("normalizes rel tokens for blank CTA targets", async () => {
    const el = await createHero({
      "action-label": "Explore benefits",
      "action-href": "https://www.fdic.gov",
      "action-target": "_blank",
      "action-rel": "external noopener",
    });
    const action = el.shadowRoot?.querySelector("[part=action]") as
      | HTMLAnchorElement
      | null;

    expect(action?.getAttribute("rel")).toBe("external noopener noreferrer");
  });

  it("applies the decorative background image through a CSS custom property", async () => {
    const el = await createHero({ "image-src": "/hero.jpg" });

    expect(getBase(el)?.style.getPropertyValue("--_fd-hero-image")).toContain(
      "/hero.jpg",
    );
  });

  it("has no obvious accessibility violations in a representative state", async () => {
    const el = await createHero({
      tone: "neutral",
      "action-label": "Explore benefits",
      "action-href": "/benefits",
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
