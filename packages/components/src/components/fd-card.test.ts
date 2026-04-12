import { describe, expect, it } from "vitest";
import "../register/fd-card.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createCard(
  props: Partial<HTMLElement & {
    category: string;
    title: string;
    href?: string;
    target?: string;
    rel?: string;
    metadata: string;
    imageSrc?: string;
    size: string;
  }> = {},
) {
  const el = document.createElement("fd-card") as HTMLElement & {
    updateComplete: Promise<void>;
    category: string;
    title: string;
    href?: string;
    target?: string;
    rel?: string;
    metadata: string;
    imageSrc?: string;
    size: string;
  };

  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdCard", () => {
  it("registers fd-card", () => {
    expect(customElements.get("fd-card")).toBeDefined();
  });

  it("renders a labelled article with a native title link", async () => {
    const el = await createCard({
      category: "Press release",
      title: "Quarterly banking profile",
      href: "/news/quarterly-banking-profile",
      metadata: "April 3, 2026",
      imageSrc: "https://example.com/card.jpg",
    });

    const article = el.shadowRoot?.querySelector("article");
    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
    const media = el.shadowRoot?.querySelector<HTMLImageElement>("[part=media] img");

    expect(article?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(title?.getAttribute("href")).toBe("/news/quarterly-banking-profile");
    expect(title?.textContent).toContain("Quarterly");
    expect(media?.getAttribute("alt")).toBe("");
  });

  it("renders plain text when href is omitted", async () => {
    const el = await createCard({ title: "Deposit insurance update" });

    expect(el.shadowRoot?.querySelector(".title-link")).toBeNull();
    expect(el.shadowRoot?.querySelector(".title-text")?.textContent).toContain(
      "Deposit insurance update",
    );
  });

  it("adds noopener noreferrer for _blank links", async () => {
    const el = await createCard({
      title: "External news",
      href: "https://example.com/news",
      target: "_blank",
    });

    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");

    expect(title?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders the large layout media above the text content", async () => {
    const el = await createCard({
      size: "large",
      title: "Annual consumer compliance outlook",
      imageSrc: "https://example.com/card.jpg",
    });

    const body = el.shadowRoot?.querySelector("[part=body]");
    const firstChild = body?.firstElementChild;

    expect(firstChild?.getAttribute("part")).toBe("media");
    expect(body?.className).toContain("size-large");
  });

  it("passes an axe audit in linked state", async () => {
    const el = await createCard({
      category: "News",
      title: "Banking conditions update",
      href: "/news/banking-conditions-update",
      metadata: "April 3, 2026",
      imageSrc: "https://example.com/card.jpg",
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });

  it("omits aria-labelledby when no title is provided", async () => {
    const el = await createCard({ category: "News" });
    expect(el.shadowRoot?.querySelector("article")?.hasAttribute("aria-labelledby")).toBe(
      false,
    );
  });

  it("omits the category block when category is blank", async () => {
    const el = await createCard({ title: "Quarterly profile" });
    expect(el.shadowRoot?.querySelector("[part=category]")).toBeNull();
  });

  it("renders category text when provided", async () => {
    const el = await createCard({ title: "Quarterly profile", category: "News" });
    expect(el.shadowRoot?.querySelector("[part=category]")?.textContent).toContain("News");
  });

  it("omits metadata content when metadata is blank", async () => {
    const el = await createCard({ title: "Quarterly profile" });
    expect(el.shadowRoot?.querySelector("[part=metadata]")).toBeNull();
  });

  it("renders metadata text when provided", async () => {
    const el = await createCard({ title: "Quarterly profile", metadata: "April 3, 2026" });
    expect(el.shadowRoot?.querySelector("[part=metadata]")?.textContent).toContain(
      "April 3, 2026",
    );
  });

  it("omits the media block when no image is provided", async () => {
    const el = await createCard({ title: "Quarterly profile" });
    expect(el.shadowRoot?.querySelector("[part=media]")).toBeNull();
  });

  it("normalizes invalid sizes back to the medium layout", async () => {
    const el = await createCard({ title: "Quarterly profile", size: "xl" });

    expect(el.shadowRoot?.querySelector("[part=body]")?.className).toContain("size-medium");
    expect(el.getAttribute("size")).toBe("xl");
  });

  it("preserves rel for same-tab links", async () => {
    const el = await createCard({
      title: "Quarterly profile",
      href: "/news/profile",
      rel: "author",
    });

    expect(el.shadowRoot?.querySelector(".title-link")?.getAttribute("rel")).toBe("author");
  });

  it("merges noopener and noreferrer with existing rel tokens for new-tab links", async () => {
    const el = await createCard({
      title: "Quarterly profile",
      href: "https://example.com/news",
      target: "_blank",
      rel: "author",
    });
    const rel = el.shadowRoot?.querySelector(".title-link")?.getAttribute("rel") ?? "";

    expect(rel).toContain("author");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("renders large cards without media when imageSrc is blank", async () => {
    const el = await createCard({ title: "Quarterly profile", size: "large" });

    expect(el.shadowRoot?.querySelector("[part=media]")).toBeNull();
    expect(el.shadowRoot?.querySelector("[part=body]")?.className).toContain("size-large");
  });

  it("exposes the footer wrapper even when metadata is absent", async () => {
    const el = await createCard({ title: "Quarterly profile" });

    expect(el.shadowRoot?.querySelector("[part=footer]")).not.toBeNull();
  });
});
