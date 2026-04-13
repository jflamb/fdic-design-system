import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-review-list.js";
import type { ReviewListItem } from "./fd-review-list.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createList(items?: ReviewListItem[]) {
  const el = document.createElement("fd-review-list") as any;
  el.heading = "Review the information before you submit";
  el.items =
    items ??
    [
      {
        label: "Institution name",
        value: "First Community Bank",
        href: "#institution-name",
        changeLabel: "Change institution name",
      },
      {
        label: "Contact method",
        value: "Secure message",
      },
    ];
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdReviewList", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-review-list", () => {
    expect(customElements.get("fd-review-list")).toBeDefined();
  });

  it("renders review rows as a description list", async () => {
    const el = await createList();

    const heading = el.shadowRoot?.querySelector('[part="heading"]');
    const list = el.shadowRoot?.querySelector('[part="list"]');
    const terms = el.shadowRoot?.querySelectorAll('[part="term"]');
    const link = el.shadowRoot?.querySelector('[part="change-link"]');

    expect(heading?.textContent?.trim()).toBe(
      "Review the information before you submit",
    );
    expect(list?.tagName).toBe("DL");
    expect(terms).toHaveLength(2);
    expect(link?.getAttribute("href")).toBe("#institution-name");
    expect(link?.textContent?.trim()).toBe("Change institution name");
  });

  it("uses empty text when a value is missing", async () => {
    const el = await createList([
      {
        label: "Supporting document",
        emptyText: "Not uploaded",
      },
    ]);

    const value = el.shadowRoot?.querySelector('[part~="value-empty"]');
    expect(value?.textContent?.trim()).toBe("Not uploaded");
  });

  it("has no axe violations", async () => {
    const region = document.createElement("main");
    document.body.appendChild(region);
    const el = document.createElement("fd-review-list") as any;
    el.heading = "Review the information before you submit";
    el.items = [
      {
        label: "Institution name",
        value: "First Community Bank",
        href: "#institution-name",
      },
    ];
    region.appendChild(el);
    await el.updateComplete;

    await expectNoAxeViolations(region);
  });
});
