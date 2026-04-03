import { describe, expect, it } from "vitest";
import "../register/fd-event.js";

describe("FdEvent", () => {
  it("registers fd-event", () => {
    expect(customElements.get("fd-event")).toBeDefined();
  });

  it("renders a labelled article with a primary link and metadata list", async () => {
    const el = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      month: string;
      day: string;
      title: string;
      href?: string;
      metadata: string[];
    };
    el.month = "SEP";
    el.day = "18";
    el.title = "FFIEC International Banking Conference";
    el.href = "/events/ffiec";
    el.metadata = ["FDIC-wide", "Conference"];

    document.body.appendChild(el);
    await el.updateComplete;

    const article = el.shadowRoot?.querySelector("article");
    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");
    const metadata = Array.from(
      el.shadowRoot?.querySelectorAll("[part=metadata-item]") ?? [],
    );

    expect(article?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(title?.getAttribute("href")).toBe("/events/ffiec");
    expect(title?.textContent).toContain("FFIEC");
    expect(metadata.map((item) => item.textContent?.trim())).toEqual([
      "FDIC-wide",
      "Conference",
    ]);

    el.remove();
  });

  it("renders plain text when href is omitted", async () => {
    const el = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    el.title = "Board Meeting";

    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".title-link")).toBeNull();
    expect(el.shadowRoot?.querySelector(".title-text")?.textContent).toContain(
      "Board Meeting",
    );

    el.remove();
  });

  it("adds noopener noreferrer for _blank links", async () => {
    const el = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
      href?: string;
      target?: string;
    };
    el.title = "External event";
    el.href = "https://example.com/events";
    el.target = "_blank";

    document.body.appendChild(el);
    await el.updateComplete;

    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".title-link");

    expect(title?.getAttribute("rel")).toBe("noopener noreferrer");

    el.remove();
  });

  it("filters empty metadata entries", async () => {
    const el = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      metadata: string[];
    };
    el.metadata = ["FDIC-wide", " ", "", "Conference"];

    document.body.appendChild(el);
    await el.updateComplete;

    const metadata = Array.from(
      el.shadowRoot?.querySelectorAll("[part=metadata-item]") ?? [],
    );

    expect(metadata).toHaveLength(2);

    el.remove();
  });
});
