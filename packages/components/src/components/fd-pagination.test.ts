import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-pagination.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createPagination(attrs: Record<string, string> = {}) {
  const el = document.createElement("fd-pagination") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getNav(el: any) {
  return el.shadowRoot!.querySelector("[part=nav]") as HTMLElement;
}

function getDesktopControls(el: any) {
  return Array.from(
    el.shadowRoot!.querySelectorAll<HTMLElement>(".desktop [part=control]"),
  );
}

function getDesktopPages(el: any) {
  return Array.from(
    el.shadowRoot!.querySelectorAll<HTMLElement>("[part=list] [part=control]"),
  );
}

function getMobileSelect(el: any) {
  return el.shadowRoot!.querySelector("[part~=mobile-select]") as
    | HTMLSelectElement
    | null;
}

describe("fd-pagination", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-pagination")).toBeDefined();
  });

  it("renders a navigation landmark with a default label", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });

    expect(getNav(el).getAttribute("aria-label")).toBe("Pagination");
  });

  it("forwards the host aria-label to the internal nav", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
      "aria-label": "Search results pages",
    });

    expect(getNav(el).getAttribute("aria-label")).toBe("Search results pages");
  });

  it("renders the supplied first-page desktop window from Figma", async () => {
    const el = await createPagination({
      "current-page": "1",
      "total-pages": "24",
    });

    const labels = getDesktopPages(el).map((control) =>
      control.textContent?.trim(),
    );
    const current = el.shadowRoot!.querySelector(
      "[part=list] [aria-current=page]",
    ) as HTMLElement | null;
    const previous = getDesktopControls(el)[0] as HTMLButtonElement | undefined;

    expect(labels).toEqual(["1", "2", "3", "4", "24"]);
    expect(current?.textContent?.trim()).toBe("1");
    expect(previous?.disabled).toBe(true);
  });

  it("renders the supplied middle-page desktop window from Figma", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });

    const pageLabels = getDesktopPages(el).map((control) =>
      control.textContent?.trim(),
    );
    const ellipses = Array.from(
      el.shadowRoot!.querySelectorAll("[part=ellipsis]"),
    );

    expect(pageLabels).toEqual(["1", "6", "7", "8", "24"]);
    expect(ellipses).toHaveLength(2);
  });

  it("renders the supplied last-page desktop window from Figma", async () => {
    const el = await createPagination({
      "current-page": "24",
      "total-pages": "24",
    });

    const labels = getDesktopPages(el).map((control) =>
      control.textContent?.trim(),
    );
    const next = getDesktopControls(el).at(-1) as HTMLButtonElement | undefined;

    expect(labels).toEqual(["1", "21", "22", "23", "24"]);
    expect(next?.disabled).toBe(true);
  });

  it("renders anchors with generated hrefs when href-template is present", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
      "href-template": "/results?page={page}",
    });

    const current = el.shadowRoot!.querySelector(
      "[part=list] [aria-current=page]",
    ) as HTMLAnchorElement | null;
    const first = getDesktopPages(el)[0] as HTMLAnchorElement | undefined;

    expect(current?.tagName).toBe("A");
    expect(current?.getAttribute("href")).toBe("/results?page=7");
    expect(first?.getAttribute("href")).toBe("/results?page=1");
  });

  it("labels the current and last pages explicitly", async () => {
    const el = await createPagination({
      "current-page": "24",
      "total-pages": "24",
    });

    const current = el.shadowRoot!.querySelector(
      "[part=list] [aria-current=page]",
    ) as HTMLElement | null;
    const lastPage = getDesktopPages(el).at(-1) as HTMLElement | undefined;

    expect(current?.getAttribute("aria-label")).toBe("Last page, page 24");
    expect(lastPage?.getAttribute("aria-label")).toBe("Last page, page 24");
  });

  it("dispatches fd-page-request when a non-current page is activated", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });
    const requested = vi.fn();
    const pageSix = getDesktopPages(el).find(
      (control) => control.textContent?.trim() === "6",
    ) as HTMLButtonElement | undefined;

    el.addEventListener("fd-page-request", requested);
    pageSix?.click();

    expect(requested).toHaveBeenCalledTimes(1);
    expect(requested.mock.calls[0][0].detail).toEqual({
      page: 6,
      href: undefined,
    });
  });

  it("does not dispatch fd-page-request when the current page button is reactivated in button mode", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });
    const requested = vi.fn();
    const current = el.shadowRoot!.querySelector(
      "[part=list] [aria-current=page]",
    ) as HTMLButtonElement | null;

    el.addEventListener("fd-page-request", requested);
    current?.click();

    expect(requested).not.toHaveBeenCalled();
  });

  it("collapses to the mobile layout below the configured threshold", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });

    Object.defineProperty(el, "clientWidth", {
      configurable: true,
      value: 320,
    });

    (el as any)._updateMobileMode();
    await el.updateComplete;

    const select = getMobileSelect(el);
    const summary = el.shadowRoot!.querySelector("[part=mobile-summary]");

    expect(el.mobile).toBe(true);
    expect(select?.value).toBe("7");
    expect(summary?.textContent?.trim()).toBe("of 24");
  });

  it("dispatches fd-page-request from the mobile select", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });
    const requested = vi.fn();

    Object.defineProperty(el, "clientWidth", {
      configurable: true,
      value: 320,
    });

    (el as any)._updateMobileMode();
    await el.updateComplete;

    const select = getMobileSelect(el);
    el.addEventListener("fd-page-request", requested);

    if (!select) {
      throw new Error("Expected mobile select to be present");
    }

    select.value = "8";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(requested).toHaveBeenCalledTimes(1);
    expect(requested.mock.calls[0][0].detail).toEqual({
      page: 8,
      href: undefined,
    });
  });

  it("delegates focus() to the current page control in desktop mode", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });
    const current = el.shadowRoot!.querySelector(
      "[part=list] [aria-current=page]",
    ) as HTMLButtonElement | null;
    const focusSpy = current ? vi.spyOn(current, "focus") : null;

    el.focus();

    expect(focusSpy).not.toBeNull();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("delegates focus() to the mobile select in mobile mode", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });

    Object.defineProperty(el, "clientWidth", {
      configurable: true,
      value: 320,
    });

    (el as any)._updateMobileMode();
    await el.updateComplete;

    const select = getMobileSelect(el);
    const focusSpy = select ? vi.spyOn(select, "focus") : null;

    el.focus();

    expect(focusSpy).not.toBeNull();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("has no axe violations in desktop mode", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });

    await expectNoAxeViolations(el.shadowRoot!);
  });

  it("has no axe violations in mobile mode", async () => {
    const el = await createPagination({
      "current-page": "7",
      "total-pages": "24",
    });

    Object.defineProperty(el, "clientWidth", {
      configurable: true,
      value: 320,
    });

    (el as any)._updateMobileMode();
    await el.updateComplete;

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
