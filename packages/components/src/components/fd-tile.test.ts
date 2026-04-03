import { describe, expect, it } from "vitest";
import "../register/fd-tile.js";

describe("FdTile", () => {
  it("registers fd-tile", () => {
    expect(customElements.get("fd-tile")).toBeDefined();
  });

  it("renders a labelled article with a primary link", async () => {
    const el = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
      href?: string;
      description?: string;
      links: Array<{ label: string; href: string; target?: string }>;
      target?: string;
    };
    el.title = "Benefits";
    el.href = "/benefits";
    el.description = "Review insurance, leave, and retirement resources.";

    document.body.appendChild(el);
    await el.updateComplete;

    const article = el.shadowRoot?.querySelector("article");
    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
    const description = el.shadowRoot?.querySelector("[part=description]");

    expect(article?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(title?.textContent).toContain("Benefits");
    expect(title?.getAttribute("href")).toBe("/benefits");
    expect(description?.textContent).toContain("Review insurance");

    el.remove();
  });

  it("renders supporting links from the links property and limits them to four", async () => {
    const el = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
      links: Array<{ label: string; href: string; target?: string }>;
    };
    el.title = "Benefits";
    el.links = [
      { label: "Health", href: "/health" },
      { label: "Vision", href: "/vision" },
      { label: "Dental", href: "/dental" },
      { label: "Life", href: "/life" },
      { label: "Deferred", href: "/deferred" },
    ];

    document.body.appendChild(el);
    await el.updateComplete;

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

    el.remove();
  });

  it("adds noopener noreferrer for _blank links", async () => {
    const el = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
      href?: string;
      target?: string;
      links: Array<{ label: string; href: string; target?: string }>;
    };
    el.title = "Benefits";
    el.href = "https://example.com/benefits";
    el.target = "_blank";
    el.links = [
      { label: "External", href: "https://example.com/help", target: "_blank" },
    ];

    document.body.appendChild(el);
    await el.updateComplete;

    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
    const support = el.shadowRoot?.querySelector<HTMLAnchorElement>(".support-link");

    expect(title?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(support?.getAttribute("rel")).toBe("noopener noreferrer");

    el.remove();
  });

  it("renders plain text when href is omitted", async () => {
    const el = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    el.title = "Benefits";

    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".title-link")).toBeNull();
    expect(el.shadowRoot?.querySelector(".title-text")?.textContent).toContain(
      "Benefits",
    );

    el.remove();
  });
});
