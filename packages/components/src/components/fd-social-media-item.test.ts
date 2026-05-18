import { describe, expect, it } from "vitest";
import "../register/fd-social-media-item.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createSocialMediaItem(
  props: Partial<HTMLElement & {
    timestamp: string;
    datetime?: string;
    imageSrc?: string;
    imageAlt: string;
    platforms: string[];
    facebookHref?: string;
    youtubeHref?: string;
    instagramHref?: string;
    xHref?: string;
    redditHref?: string;
    linkedinHref?: string;
    threadsHref?: string;
  }> = {},
  body = "Did you know that unbanked households can face higher risks when relying on cash?",
) {
  const el = document.createElement("fd-social-media-item") as HTMLElement & {
    updateComplete: Promise<void>;
    timestamp: string;
    datetime?: string;
    imageSrc?: string;
    imageAlt: string;
    platforms: string[];
    facebookHref?: string;
    youtubeHref?: string;
    instagramHref?: string;
    xHref?: string;
    redditHref?: string;
    linkedinHref?: string;
    threadsHref?: string;
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
      facebookHref: "https://www.facebook.com/fdic/posts/1",
      youtubeHref: "https://www.youtube.com/watch?v=fdic",
      linkedinHref: "https://www.linkedin.com/company/fdic/posts/1",
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

  it("renders the visible timestamp as time when datetime is provided", async () => {
    const el = await createSocialMediaItem({
      timestamp: "Aug. 26, 2024 · 9:25 AM",
      datetime: "2024-08-26T09:25:00-04:00",
    });

    const timestamp = el.shadowRoot?.querySelector<HTMLTimeElement>("[part=timestamp]");

    expect(timestamp?.tagName.toLowerCase()).toBe("time");
    expect(timestamp?.getAttribute("datetime")).toBe("2024-08-26T09:25:00-04:00");
    expect(timestamp?.textContent).toBe("Aug. 26, 2024 · 9:25 AM");
  });

  it("keeps the visible timestamp as authored text when datetime is blank", async () => {
    const el = await createSocialMediaItem({
      timestamp: "Aug. 26, 2024 · 9:25 AM",
      datetime: " ",
    });

    const timestamp = el.shadowRoot?.querySelector("[part=timestamp]");

    expect(timestamp?.tagName.toLowerCase()).toBe("p");
    expect(timestamp?.hasAttribute("datetime")).toBe(false);
    expect(timestamp?.textContent).toBe("Aug. 26, 2024 · 9:25 AM");
  });

  it("keeps the visible timestamp as authored text when datetime is omitted", async () => {
    const el = await createSocialMediaItem({
      timestamp: "Aug. 26, 2024 · 9:25 AM",
    });

    const timestamp = el.shadowRoot?.querySelector("[part=timestamp]");

    expect(timestamp?.tagName.toLowerCase()).toBe("p");
    expect(timestamp?.hasAttribute("datetime")).toBe(false);
    expect(timestamp?.textContent).toBe("Aug. 26, 2024 · 9:25 AM");
  });

  it("omits the timestamp when datetime is provided without visible text", async () => {
    const el = await createSocialMediaItem({
      datetime: "2024-08-26T09:25:00-04:00",
    });

    expect(el.shadowRoot?.querySelector("[part=timestamp]")).toBeNull();
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

    expect(el.getAttribute("platforms")).toBe("facebook x threads");
  });

  it("omits image and platform regions when corresponding data is absent", async () => {
    const el = await createSocialMediaItem();

    expect(el.shadowRoot?.querySelector("[part=media]")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part=platforms]")).toBeNull();
  });

  it("omits the platform region when no platform links are available", async () => {
    const el = await createSocialMediaItem({ platforms: ["reddit", "threads"] });

    expect(el.shadowRoot?.querySelector("[part=platforms]")).toBeNull();
  });

  it("renders platform icons as subtle link buttons with accessible labels", async () => {
    const el = await createSocialMediaItem({
      platforms: ["reddit", "threads"],
      redditHref: "https://www.reddit.com/r/fdic/comments/example",
      threadsHref: "https://www.threads.net/@fdic/post/example",
    });

    const icons = el.shadowRoot?.querySelectorAll("[part=platform-icon]");
    const links = el.shadowRoot?.querySelectorAll("fd-button[part=platform-link]");

    expect(icons?.[0]?.getAttribute("aria-hidden")).toBe("true");
    expect(links).toHaveLength(2);
    expect(links?.[0]?.getAttribute("variant")).toBe("subtle");
    expect(links?.[0]?.getAttribute("href")).toBe(
      "https://www.reddit.com/r/fdic/comments/example",
    );
    expect(links?.[0]?.getAttribute("aria-label")).toBe("View post on Reddit");
  });

  it("uses href attributes as the default platform order when platforms is absent", async () => {
    const el = await createSocialMediaItem({
      linkedinHref: "https://www.linkedin.com/company/fdic/posts/1",
      facebookHref: "https://www.facebook.com/fdic/posts/1",
    });

    const links = [...(el.shadowRoot?.querySelectorAll("fd-button[part=platform-link]") ?? [])];

    expect(links.map((link) => link.getAttribute("aria-label"))).toEqual([
      "View post on Facebook",
      "View post on LinkedIn",
    ]);
  });

  it("updates the platform label while a platform link is hovered", async () => {
    const el = await createSocialMediaItem({
      platforms: ["facebook", "linkedin"],
      facebookHref: "https://www.facebook.com/fdic/posts/1",
      linkedinHref: "https://www.linkedin.com/company/fdic/posts/1",
    });

    const label = el.shadowRoot?.querySelector("[part=platform-label]");
    const links = el.shadowRoot?.querySelectorAll("fd-button[part=platform-link]");

    expect(label?.textContent).toBe("Posted on");

    links?.[0]?.dispatchEvent(new PointerEvent("pointerenter"));
    await el.updateComplete;

    expect(label?.textContent).toBe("Posted on Facebook");

    links?.[0]?.dispatchEvent(new PointerEvent("pointerleave"));
    await el.updateComplete;

    expect(label?.textContent).toBe("Posted on");
  });

  it("updates the platform label while a platform link has keyboard focus", async () => {
    const el = await createSocialMediaItem({
      platforms: ["facebook", "linkedin"],
      facebookHref: "https://www.facebook.com/fdic/posts/1",
      linkedinHref: "https://www.linkedin.com/company/fdic/posts/1",
    });

    const label = el.shadowRoot?.querySelector("[part=platform-label]");
    const links = el.shadowRoot?.querySelectorAll("fd-button[part=platform-link]");

    links?.[1]?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await el.updateComplete;

    expect(label?.textContent).toBe("Posted on LinkedIn");

    links?.[1]?.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await el.updateComplete;

    expect(label?.textContent).toBe("Posted on");
  });

  it("keeps the focused platform label after pointer leaves the focused link", async () => {
    const el = await createSocialMediaItem({
      platforms: ["facebook", "linkedin"],
      facebookHref: "https://www.facebook.com/fdic/posts/1",
      linkedinHref: "https://www.linkedin.com/company/fdic/posts/1",
    });

    const label = el.shadowRoot?.querySelector("[part=platform-label]");
    const links = el.shadowRoot?.querySelectorAll("fd-button[part=platform-link]");

    links?.[0]?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    links?.[0]?.dispatchEvent(new PointerEvent("pointerenter"));
    await el.updateComplete;

    expect(label?.textContent).toBe("Posted on Facebook");

    links?.[0]?.dispatchEvent(new PointerEvent("pointerleave"));
    await el.updateComplete;

    expect(label?.textContent).toBe("Posted on Facebook");

    links?.[0]?.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await el.updateComplete;

    expect(label?.textContent).toBe("Posted on");
  });

  it("passes an axe audit in a representative state", async () => {
    const el = await createSocialMediaItem(
      {
        timestamp: "Aug. 26, 2024 · 9:25 AM",
        imageSrc: "https://example.com/social.png",
        imageAlt:
          "Graphic stating that 75 percent of unbanked Hispanic households rely on cash.",
        platforms: ["facebook", "youtube", "instagram", "x", "reddit", "linkedin", "threads"],
        facebookHref: "https://www.facebook.com/fdic/posts/1",
        youtubeHref: "https://www.youtube.com/watch?v=fdic",
        instagramHref: "https://www.instagram.com/fdic/p/example",
        xHref: "https://x.com/FDICgov/status/example",
        redditHref: "https://www.reddit.com/r/fdic/comments/example",
        linkedinHref: "https://www.linkedin.com/company/fdic/posts/1",
        threadsHref: "https://www.threads.net/@fdic/post/example",
      },
      '<p>Did you know that unbanked Hispanic households were more likely to rely on cash?</p><p><a href="https://example.com/research">Read the research</a>.</p>',
    );

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
