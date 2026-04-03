import { describe, expect, it } from "vitest";
import "../register/fd-card.js";
import { expectNoAxeViolations } from "./test-a11y.js";

describe("FdCard", () => {
  it("registers fd-card", () => {
    expect(customElements.get("fd-card")).toBeDefined();
  });

  it("renders a labelled article with a native title link", async () => {
    const el = document.createElement("fd-card") as HTMLElement & {
      updateComplete: Promise<void>;
      category: string;
      title: string;
      href?: string;
      metadata: string;
      imageSrc?: string;
    };
    el.category = "Press release";
    el.title = "Quarterly banking profile";
    el.href = "/news/quarterly-banking-profile";
    el.metadata = "April 3, 2026";
    el.imageSrc = "https://example.com/card.jpg";

    document.body.appendChild(el);
    await el.updateComplete;

    const article = el.shadowRoot?.querySelector("article");
    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
    const media = el.shadowRoot?.querySelector<HTMLImageElement>("[part=media] img");

    expect(article?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(title?.getAttribute("href")).toBe("/news/quarterly-banking-profile");
    expect(title?.textContent).toContain("Quarterly");
    expect(media?.getAttribute("alt")).toBe("");

    el.remove();
  });

  it("renders plain text when href is omitted", async () => {
    const el = document.createElement("fd-card") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    el.title = "Deposit insurance update";

    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".title-link")).toBeNull();
    expect(el.shadowRoot?.querySelector(".title-text")?.textContent).toContain(
      "Deposit insurance update",
    );

    el.remove();
  });

  it("adds noopener noreferrer for _blank links", async () => {
    const el = document.createElement("fd-card") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
      href?: string;
      target?: string;
    };
    el.title = "External news";
    el.href = "https://example.com/news";
    el.target = "_blank";

    document.body.appendChild(el);
    await el.updateComplete;

    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");

    expect(title?.getAttribute("rel")).toBe("noopener noreferrer");

    el.remove();
  });

  it("renders the large layout media above the text content", async () => {
    const el = document.createElement("fd-card") as HTMLElement & {
      updateComplete: Promise<void>;
      size: string;
      title: string;
      imageSrc?: string;
    };
    el.size = "large";
    el.title = "Annual consumer compliance outlook";
    el.imageSrc = "https://example.com/card.jpg";

    document.body.appendChild(el);
    await el.updateComplete;

    const body = el.shadowRoot?.querySelector("[part=body]");
    const firstChild = body?.firstElementChild;

    expect(firstChild?.getAttribute("part")).toBe("media");
    expect(body?.className).toContain("size-large");

    el.remove();
  });

  it("passes an axe audit in linked state", async () => {
    const el = document.createElement("fd-card") as HTMLElement & {
      updateComplete: Promise<void>;
      category: string;
      title: string;
      href?: string;
      metadata: string;
      imageSrc?: string;
    };
    el.category = "News";
    el.title = "Banking conditions update";
    el.href = "/news/banking-conditions-update";
    el.metadata = "April 3, 2026";
    el.imageSrc = "https://example.com/card.jpg";

    document.body.appendChild(el);
    await el.updateComplete;

    await expectNoAxeViolations(el.shadowRoot!);

    el.remove();
  });
});
