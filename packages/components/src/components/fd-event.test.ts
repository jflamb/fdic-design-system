import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-event.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { clearTestDom, createTestElement, queryShadow } from "./test-utils.js";

async function createEvent() {
  return createTestElement<
    HTMLElement & {
      updateComplete: Promise<void>;
      month: string;
      day: string;
      title: string;
      href?: string;
      target?: string;
      rel?: string;
      metadata: string[];
      tone: string;
    }
  >("fd-event");
}

describe("FdEvent", () => {
  beforeEach(() => {
    clearTestDom();
  });

  it("registers fd-event", () => {
    expect(customElements.get("fd-event")).toBeDefined();
  });

  it("renders a labelled article with a full-item link and metadata list", async () => {
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
    const link = el.shadowRoot?.querySelector<HTMLAnchorElement>(".event-link");
    const title = el.shadowRoot?.querySelector<HTMLElement>(".title-link");
    const metadata = Array.from(
      el.shadowRoot?.querySelectorAll("[part=metadata-item]") ?? [],
    );

    expect(article?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("/events/ffiec");
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

    const title = el.shadowRoot?.querySelector<HTMLAnchorElement>(".event-link");

    expect(title?.getAttribute("rel")).toBe("noopener noreferrer");

    el.remove();
  });

  it("filters empty metadata entries", async () => {
    const el = await createEvent();
    el.metadata = ["FDIC-wide", " ", "", "Conference"];
    await el.updateComplete;

    const metadata = Array.from(
      el.shadowRoot?.querySelectorAll("[part=metadata-item]") ?? [],
    );

    expect(metadata).toHaveLength(2);

    el.remove();
  });

  it("trims blank href values and falls back to plain text", async () => {
    const el = await createEvent();
    el.title = "Local information session";
    el.href = "   ";
    await el.updateComplete;

    expect(queryShadow(el, ".title-link")).toBeNull();
    expect(queryShadow(el, ".title-text")?.textContent).toContain(
      "Local information session",
    );
  });

  it("omits aria-labelledby when the title is blank", async () => {
    const el = await createEvent();
    el.title = "   ";
    await el.updateComplete;

    expect(queryShadow(el, "article")?.hasAttribute("aria-labelledby")).toBe(
      false,
    );
  });

  it("forwards trimmed target values to the native link", async () => {
    const el = await createEvent();
    el.title = "External workshop";
    el.href = "https://example.com/events";
    el.target = " _blank ";
    await el.updateComplete;

    expect(queryShadow<HTMLAnchorElement>(el, ".event-link")?.target).toBe(
      "_blank",
    );
  });

  it("preserves explicit rel tokens while adding blank-target protections", async () => {
    const el = await createEvent();
    el.title = "External workshop";
    el.href = "https://example.com/events";
    el.target = "_blank";
    el.rel = "external noopener";
    await el.updateComplete;

    expect(queryShadow<HTMLAnchorElement>(el, ".event-link")?.rel).toBe(
      "external noopener noreferrer",
    );
  });

  it("renders no metadata list when all entries are blank", async () => {
    const el = await createEvent();
    el.metadata = [" ", ""];
    await el.updateComplete;

    expect(queryShadow(el, "[part=metadata]")).toBeNull();
  });

  it("renders the trimmed month and day values", async () => {
    const el = await createEvent();
    el.month = " SEP ";
    el.day = " 18 ";
    await el.updateComplete;

    expect(queryShadow(el, "[part=month]")?.textContent).toBe("SEP");
    expect(queryShadow(el, "[part=day]")?.textContent).toBe("18");
  });

  it("uses the Figma date-chip token defaults", () => {
    const styles = (
      customElements.get("fd-event") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("var(--fdic-color-primary-200)");
    expect(styles).toContain("var(--fdic-color-secondary-300)");
    expect(styles).toContain("var(--fdic-color-primary-500)");
    expect(styles).toContain("var(--fdic-color-secondary-800)");
    expect(styles).toContain("gap: var(--fd-event-date-gap, 3px)");
    expect(styles).toContain("line-height: var(--fd-event-month-line-height, 1)");
    expect(styles).toContain("margin-block: var(--fd-event-month-leading-trim, -0.06em)");
    expect(styles).toContain("line-height: var(--fd-event-day-line-height, 1)");
    expect(styles).toContain("margin-block: var(--fd-event-day-leading-trim, -0.15em)");
  });

  it("assigns a stable generated title id when rendering a link", async () => {
    const el = await createEvent();
    el.title = "Regional outreach event";
    el.href = "/events/outreach";
    await el.updateComplete;

    const title = queryShadow<HTMLElement>(el, ".title-link");

    expect(title?.id).toMatch(/^fd-event-title-\d+$/);
    expect(queryShadow(el, "article")?.getAttribute("aria-labelledby")).toBe(
      title?.id,
    );
  });

  it("preserves explicit rel tokens for non-blank links", async () => {
    const el = await createEvent();
    el.title = "Regional outreach event";
    el.href = "/events/outreach";
    el.rel = "external";
    await el.updateComplete;

    expect(queryShadow<HTMLAnchorElement>(el, ".event-link")?.rel).toBe(
      "external",
    );
  });

  it("assigns unique generated title ids per instance", async () => {
    const first = await createEvent();
    const second = await createEvent();
    first.title = "First event";
    first.href = "/events/first";
    second.title = "Second event";
    second.href = "/events/second";
    await first.updateComplete;
    await second.updateComplete;

    expect(queryShadow<HTMLElement>(first, ".title-link")?.id).not.toBe(
      queryShadow<HTMLElement>(second, ".title-link")?.id,
    );
  });

  it("supports a representative linked event without obvious accessibility violations", async () => {
    const el = await createEvent();
    el.month = "SEP";
    el.day = "18";
    el.title = "Regional outreach event";
    el.href = "/events/outreach";
    el.metadata = ["FDIC-wide", "Conference"];
    await el.updateComplete;

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
