import { describe, expect, it } from "vitest";
import "../register/fd-social-media-item.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createSocialMediaItem(
  props: Partial<HTMLElement & {
    timestamp: string;
    imageSrc?: string;
    imageAlt: string;
    platforms: string[];
  }> = {},
  body = "Did you know that unbanked households can face higher risks when relying on cash?",
) {
  const el = document.createElement("fd-social-media-item") as HTMLElement & {
    updateComplete: Promise<void>;
    timestamp: string;
    imageSrc?: string;
    imageAlt: string;
    platforms: string[];
  };

  Object.assign(el, props);
  el.innerHTML = body;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdSocialMediaItem", () => {
  it("registers fd-social-media-item", () => {
    expect(customElements.get("fd-social-media-item")).toBeDefined();
  });

  it("renders social post content with a meaningful image and timestamp", async () => {
    const el = await createSocialMediaItem({
      timestamp: "Aug. 26, 2024 · 9:25 AM",
      imageSrc: "https://example.com/social.png",
      imageAlt:
        "Graphic stating that 75 percent of unbanked Hispanic households rely on cash.",
      platforms: ["facebook", "youtube", "linkedin"],
    });

    const article = el.shadowRoot?.querySelector("article");
    const image = el.shadowRoot?.querySelector<HTMLImageElement>("[part=image]");
    const timestamp = el.shadowRoot?.querySelector("[part=timestamp]");
    const platforms = el.shadowRoot?.querySelectorAll("[part=platform-item]");

    expect(article).not.toBeNull();
    expect(image?.getAttribute("alt")).toContain("75 percent");
    expect(timestamp?.textContent).toContain("Aug. 26");
    expect(platforms).toHaveLength(3);
  });

  it("preserves native links authored in the default slot", async () => {
    const el = await createSocialMediaItem(
      {},
      'Read the latest research at <a href="https://example.com/research">fdic.gov</a>.',
    );

    const slottedLink = el.querySelector("a");
    const slot = el.shadowRoot?.querySelector<HTMLSlotElement>("slot");

    expect(slottedLink?.getAttribute("href")).toBe("https://example.com/research");
    expect(slot?.assignedElements()).toContain(slottedLink);
  });

  it("parses the platforms attribute and ignores unsupported tokens", async () => {
    const el = document.createElement("fd-social-media-item") as HTMLElement & {
      updateComplete: Promise<void>;
      platforms: string[];
    };

    el.setAttribute("platforms", "facebook unknown x facebook threads");
    document.body.appendChild(el);
    await el.updateComplete;

    const labels = [...(el.shadowRoot?.querySelectorAll(".visually-hidden") ?? [])].map(
      (node) => node.textContent,
    );

    expect(el.getAttribute("platforms")).toBe("facebook x threads");
    expect(labels).toEqual(["Facebook", "X", "Threads"]);
  });

  it("omits image and platform regions when corresponding data is absent", async () => {
    const el = await createSocialMediaItem();

    expect(el.shadowRoot?.querySelector("[part=media]")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part=platforms]")).toBeNull();
  });

  it("renders platform icons as decorative with accessible text labels", async () => {
    const el = await createSocialMediaItem({ platforms: ["reddit", "threads"] });

    const icons = el.shadowRoot?.querySelectorAll("[part=platform-icon]");
    const labels = [...(el.shadowRoot?.querySelectorAll(".visually-hidden") ?? [])].map(
      (node) => node.textContent,
    );

    expect(icons?.[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(labels).toEqual(["Reddit", "Threads"]);
  });

  it("passes an axe audit in a representative state", async () => {
    const el = await createSocialMediaItem(
      {
        timestamp: "Aug. 26, 2024 · 9:25 AM",
        imageSrc: "https://example.com/social.png",
        imageAlt:
          "Graphic stating that 75 percent of unbanked Hispanic households rely on cash.",
        platforms: ["facebook", "youtube", "instagram", "x", "reddit", "linkedin", "threads"],
      },
      'Did you know that unbanked Hispanic households were more likely to rely on cash? <a href="https://example.com/research">Read the research</a>.',
    );

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
