import { describe, expect, it, beforeEach } from "vitest";
import "../register/fd-global-footer.js";
import type {
  FdGlobalFooterLink,
  FdGlobalFooterSocialLink,
} from "./fd-global-footer.js";
import { expectNoAxeViolations } from "./test-a11y.js";

describe("FdGlobalFooter", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-global-footer", () => {
    expect(customElements.get("fd-global-footer")).toBeDefined();
  });

  async function createFooter({
    agencyName = "Federal Deposit Insurance Corporation",
    agencyHref = "/",
    updatedText = "Updated August 7, 2024",
    utilityLinks = [{ label: "Accessibility", href: "/accessibility" }],
    socialLinks = [
      { icon: "facebook", label: "Follow the FDIC on Facebook", href: "https://facebook.com/fdicgov" },
      { icon: "x", label: "Follow the FDIC on X", href: "https://x.com/fdicgov" },
    ],
  }: {
    agencyName?: string;
    agencyHref?: string;
    updatedText?: string;
    utilityLinks?: FdGlobalFooterLink[];
    socialLinks?: FdGlobalFooterSocialLink[];
  } = {}) {
    const el = document.createElement("fd-global-footer") as any;
    el.agencyName = agencyName;
    el.agencyHref = agencyHref;
    el.updatedText = updatedText;
    el.utilityLinks = utilityLinks;
    el.socialLinks = socialLinks;
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  }

  it("renders the footer landmark, agency link, utility links, and updated text", async () => {
    const el = await createFooter();
    const footer = el.shadowRoot?.querySelector("footer");
    const agency = el.shadowRoot?.querySelector("[part=agency] a");
    const utilityLinks = el.shadowRoot?.querySelectorAll("[part=utility-links] a");
    const updated = el.shadowRoot?.querySelector("[part=updated]");
    const seal = el.shadowRoot?.querySelector("[part=seal] svg");

    expect(footer).toBeTruthy();
    expect(seal).toBeTruthy();
    expect(agency?.textContent?.trim()).toBe(
      "Federal Deposit Insurance Corporation",
    );
    expect(utilityLinks?.length).toBe(1);
    expect(updated?.textContent?.trim()).toBe("Updated August 7, 2024");
  });

  it("omits optional groups when no utility, social, or updated content is supplied", async () => {
    const el = await createFooter({
      agencyHref: "",
      utilityLinks: [],
      socialLinks: [],
      updatedText: "",
    });

    expect(el.shadowRoot?.querySelector("[part=utility-links]")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part=social-links]")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part=updated]")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part=agency] .agency-text")).toBeTruthy();
  });

  it("renders icon-only social links with accessible names", async () => {
    const el = await createFooter();
    const links = [...(el.shadowRoot?.querySelectorAll(".social-link") ?? [])];

    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute("aria-label")).toBe(
      "Follow the FDIC on Facebook",
    );
    expect(links[1]?.getAttribute("aria-label")).toBe(
      "Follow the FDIC on X",
    );
  });

  it("renders the seal variants for normal and forced-color contexts", async () => {
    const el = await createFooter();

    expect(el.shadowRoot?.querySelector(".seal-light svg")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".seal-dark svg")).not.toBeNull();
  });

  it("normalizes rel tokens for external links that open in a new tab", async () => {
    const el = await createFooter({
      utilityLinks: [
        {
          label: "Accessibility",
          href: "/accessibility",
          target: "_blank",
        },
      ],
    });

    const link = el.shadowRoot?.querySelector(
      "[part=utility-links] a",
    ) as HTMLAnchorElement | null;

    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(link?.getAttribute("rel")).toContain("noreferrer");
  });

  it("preserves rel values for same-tab utility links", async () => {
    const el = await createFooter({
      utilityLinks: [{ label: "Accessibility", href: "/accessibility", rel: "author" }],
    });

    expect(
      el.shadowRoot?.querySelector("[part=utility-links] a")?.getAttribute("rel"),
    ).toBe("author");
  });

  it("filters invalid utility and social links", async () => {
    const el = await createFooter({
      utilityLinks: [
        { label: "Accessibility", href: "/accessibility" },
        { label: "", href: "/missing-label" },
      ],
      socialLinks: [
        {
          icon: "linkedin",
          label: "LinkedIn",
          href: "https://linkedin.com/company/fdic",
        },
        {
          icon: "invalid" as any,
          label: "Broken icon",
          href: "https://example.com",
        },
      ],
    });

    expect(el.shadowRoot?.querySelectorAll("[part=utility-links] a")).toHaveLength(1);
    expect(el.shadowRoot?.querySelectorAll(".social-link")).toHaveLength(1);
  });

  it("renders social link rel tokens for external new-tab links", async () => {
    const el = await createFooter({
      socialLinks: [
        {
          icon: "linkedin",
          label: "LinkedIn",
          href: "https://linkedin.com/company/fdic",
          target: "_blank",
        },
      ],
    });

    const link = el.shadowRoot?.querySelector(".social-link");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(link?.getAttribute("rel")).toContain("noreferrer");
  });

  it("omits the agency block when no agency name is provided", async () => {
    const el = await createFooter({ agencyName: "" });
    expect(el.shadowRoot?.querySelector("[part=agency]")).toBeNull();
  });

  it("uses plain text instead of a link when agencyHref is blank", async () => {
    const el = await createFooter({ agencyHref: "   " });
    expect(el.shadowRoot?.querySelector("[part=agency] .agency-text")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("[part=agency] .agency-link")).toBeNull();
  });

  it("renders social icons as decorative SVG content", async () => {
    const el = await createFooter();
    expect(el.shadowRoot?.querySelector(".social-icon svg")).not.toBeNull();
  });

  it("uses container queries for the narrow layout so constrained embeds render correctly", () => {
    const styles = (
      customElements.get("fd-global-footer") as typeof HTMLElement & {
        styles?: { cssText?: string } | Array<{ cssText?: string }>;
      }
    ).styles;
    const cssText = Array.isArray(styles)
      ? styles.map((value) => value?.cssText ?? "").join("\n")
      : styles?.cssText ?? "";

    expect(cssText).toContain("container-type: inline-size");
    expect(cssText).toContain("@container (max-width: 640px)");
    expect(cssText).toContain("var(--ds-layout-shell-max-width, var(--ds-layout-content-max-width, 1312px))");
    expect(cssText).toContain("var(--ds-layout-section-block-padding, var(--ds-spacing-3xl, 48px))");
    expect(cssText).toContain("var(--ds-layout-content-gap, var(--ds-spacing-xl, 24px))");
  });

  it("keeps the mobile agency block centered without collapsing it to min-content width", () => {
    const styles = (
      customElements.get("fd-global-footer") as typeof HTMLElement & {
        styles?: { cssText?: string } | Array<{ cssText?: string }>;
      }
    ).styles;
    const cssText = Array.isArray(styles)
      ? styles.map((value) => value?.cssText ?? "").join("\n")
      : styles?.cssText ?? "";

    expect(cssText).toContain(".brand-block,\n      .bottom-row {\n        text-align: center;");
    expect(cssText).not.toContain(".brand-block,\n      .bottom-row {\n        justify-items: center;");
  });

  it("passes an axe audit with the default footer content", async () => {
    const el = await createFooter();
    await expectNoAxeViolations(el.shadowRoot!);
  });

  it("always renders the footer landmark wrapper", async () => {
    const el = await createFooter();
    expect(el.shadowRoot?.querySelector("footer")).not.toBeNull();
  });
});
