import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-media-item.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { clearTestDom, createTestElement, queryShadow } from "./test-utils.js";

async function createMediaItem() {
  return createTestElement<
    HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
      href?: string;
      target?: string;
      rel?: string;
      metadata: string;
      imageSrc?: string;
      imageAlt: string;
    }
  >("fd-media-item");
}

describe("FdMediaItem", () => {
  beforeEach(() => {
    clearTestDom();
  });

  it("registers fd-media-item", () => {
    expect(customElements.get("fd-media-item")).toBeDefined();
  });

  it("renders a labelled article with thumbnail, title link, and metadata", async () => {
    const el = await createMediaItem();
    el.title = "Safeguarding Customer Credit Card Data: PCI Compliance";
    el.href = "/training/pci-compliance";
    el.metadata = "1h 3m  ·  Beginner  ·  2 months ago";
    el.imageSrc = "/images/media/pci.png";
    el.imageAlt = "Illustration of a protected credit card transaction.";
    await el.updateComplete;

    const article = queryShadow(el, "article");
    const image = queryShadow<HTMLImageElement>(el, "[part=image]");
    const link = queryShadow<HTMLAnchorElement>(el, ".title-link");

    expect(article?.getAttribute("aria-labelledby")).toBe(link?.id);
    expect(image?.getAttribute("src")).toBe("/images/media/pci.png");
    expect(image?.getAttribute("alt")).toBe(
      "Illustration of a protected credit card transaction.",
    );
    expect(link?.getAttribute("href")).toBe("/training/pci-compliance");
    expect(link?.textContent?.trim()).toBe(
      "Safeguarding Customer Credit Card Data: PCI Compliance",
    );
    expect(queryShadow(el, "[part=metadata]")?.textContent?.trim()).toBe(
      "1h 3m  ·  Beginner  ·  2 months ago",
    );
  });

  it("renders title text without a link when href is omitted", async () => {
    const el = await createMediaItem();
    el.title = "Examining bank customer data";
    await el.updateComplete;

    expect(queryShadow(el, ".title-link")).toBeNull();
    expect(queryShadow(el, ".title-text")?.textContent).toContain(
      "Examining bank customer data",
    );
  });

  it("trims blank href values and falls back to plain text", async () => {
    const el = await createMediaItem();
    el.title = "FDIC failed bank exercise";
    el.href = "   ";
    await el.updateComplete;

    expect(queryShadow(el, ".title-link")).toBeNull();
    expect(queryShadow(el, ".title-text")?.textContent).toContain(
      "FDIC failed bank exercise",
    );
  });

  it("adds noopener noreferrer for blank-target links", async () => {
    const el = await createMediaItem();
    el.title = "External training";
    el.href = "https://example.com/training";
    el.target = "_blank";
    await el.updateComplete;

    expect(queryShadow<HTMLAnchorElement>(el, ".title-link")?.rel).toBe(
      "noopener noreferrer",
    );
  });

  it("preserves explicit rel tokens while adding blank-target protections", async () => {
    const el = await createMediaItem();
    el.title = "External training";
    el.href = "https://example.com/training";
    el.target = " _blank ";
    el.rel = "external noopener";
    await el.updateComplete;

    expect(queryShadow<HTMLAnchorElement>(el, ".title-link")?.target).toBe(
      "_blank",
    );
    expect(queryShadow<HTMLAnchorElement>(el, ".title-link")?.rel).toBe(
      "external noopener noreferrer",
    );
  });

  it("omits optional image and metadata when values are blank", async () => {
    const el = await createMediaItem();
    el.title = "Plain media item";
    el.metadata = " ";
    await el.updateComplete;

    expect(queryShadow(el, "[part=media]")).toBeNull();
    expect(queryShadow(el, "[part=metadata]")).toBeNull();
  });

  it("omits aria-labelledby when the title is blank", async () => {
    const el = await createMediaItem();
    el.title = "   ";
    await el.updateComplete;

    expect(queryShadow(el, "article")?.hasAttribute("aria-labelledby")).toBe(
      false,
    );
  });

  it("uses visual-aligned token defaults", () => {
    const styles = (
      customElements.get("fd-media-item") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("block-size: var(--fd-media-item-media-height, auto)");
    expect(styles).toContain("aspect-ratio: var(--fd-media-item-media-aspect-ratio, 366 / 201)");
    expect(styles).toContain("--fd-media-item-title-font-size");
    expect(styles).toContain("--fd-media-item-link-underline-thickness-emphasis");
  });

  it("supports a representative linked media item without obvious accessibility violations", async () => {
    const el = await createMediaItem();
    el.title = "Safeguarding Customer Credit Card Data: PCI Compliance";
    el.href = "/training/pci-compliance";
    el.metadata = "1h 3m  ·  Beginner  ·  2 months ago";
    el.imageSrc = "/images/media/pci.png";
    el.imageAlt = "Illustration of a protected credit card transaction.";
    await el.updateComplete;

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
