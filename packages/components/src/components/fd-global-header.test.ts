import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/register-all.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import {
  createFdGlobalHeaderPrototypeSearch,
  fdGlobalHeaderPrototypeNavigation,
} from "./fd-global-header.prototype.js";

let mobileMatches = false;
const resizeCallbacks = new Map<Element, ResizeObserverCallback>();

class ResizeObserverMock {
  private readonly _callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this._callback = callback;
  }

  observe = vi.fn((target: Element) => {
    resizeCallbacks.set(target, this._callback);
  });

  unobserve = vi.fn((target: Element) => {
    resizeCallbacks.delete(target);
  });

  disconnect = vi.fn(() => {
    for (const [target, callback] of resizeCallbacks.entries()) {
      if (callback === this._callback) {
        resizeCallbacks.delete(target);
      }
    }
  });
}

function installMatchMediaStub() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: mobileMatches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function installResizeObserverStub() {
  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: ResizeObserverMock,
  });
}

function setElementWidth(target: Element, width: number) {
  Object.defineProperty(target, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      width,
      height: 0,
      top: 0,
      right: width,
      bottom: 0,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
}

function triggerResize(target: Element, width: number) {
  setElementWidth(target, width);

  const callback = resizeCallbacks.get(target);
  if (!callback) {
    throw new Error("Expected ResizeObserver callback for target");
  }

  callback(
    [
      {
        target,
        contentRect: {
          width,
          height: 0,
          top: 0,
          right: width,
          bottom: 0,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        },
      } as ResizeObserverEntry,
    ],
    {} as ResizeObserver,
  );
}

async function nextFrame() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

async function wait(ms = 0) {
  await new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

async function createHeader({ mobile = false } = {}) {
  mobileMatches = mobile;
  installMatchMediaStub();
  installResizeObserverStub();

  const el = document.createElement("fd-global-header") as HTMLElement & {
    navigation: typeof fdGlobalHeaderPrototypeNavigation;
    search: ReturnType<typeof createFdGlobalHeaderPrototypeSearch>;
    updateComplete: Promise<unknown>;
  };

  el.navigation = structuredClone(fdGlobalHeaderPrototypeNavigation);
  el.search = createFdGlobalHeaderPrototypeSearch("/search");
  el.innerHTML = `
    <a slot="brand" href="/" aria-label="FDICnet home">FDICnet</a>
    <a slot="utility" href="#employee-directory">Employee directory</a>
    <a slot="utility" href="#help">Help</a>
  `;

  document.body.appendChild(el);
  await el.updateComplete;
  await nextFrame();
  return el;
}

function getPanelTrigger(el: HTMLElement, panelId: string) {
  return el.shadowRoot?.querySelector(
    `[data-panel-trigger="${panelId}"]`,
  ) as HTMLButtonElement | null;
}

function getDesktopSearch(el: HTMLElement) {
  return el.shadowRoot?.querySelector(
    '[data-search-surface="desktop"]',
  ) as HTMLElement | null;
}

function getMobileSearch(el: HTMLElement) {
  return el.shadowRoot?.querySelector(
    '[data-search-surface="mobile"]',
  ) as HTMLElement | null;
}

function getSearchInput(searchHost: HTMLElement | null) {
  return searchHost?.shadowRoot?.querySelector(".native") as HTMLInputElement | null;
}

function stubElementRect(
  element: Element | null,
  rect: { left: number; width: number; top?: number; height?: number },
) {
  if (!element) {
    throw new Error("Expected element to stub");
  }

  const top = rect.top ?? 0;
  const height = rect.height ?? 48;

  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      x: rect.left,
      y: top,
      left: rect.left,
      top,
      width: rect.width,
      height,
      right: rect.left + rect.width,
      bottom: top + height,
      toJSON: () => ({}),
    }),
  });
}

describe("fd-global-header", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mobileMatches = false;
    resizeCallbacks.clear();
    installMatchMediaStub();
    installResizeObserverStub();
  });

  it("registers fd-global-header", () => {
    expect(customElements.get("fd-global-header")).toBeDefined();
  });

  it("generates instance-safe trigger and search control ids", async () => {
    const first = await createHeader();
    const second = await createHeader();

    const firstTrigger = getPanelTrigger(first, "news-events");
    const secondTrigger = getPanelTrigger(second, "news-events");
    const firstSearchInput = getSearchInput(getDesktopSearch(first));
    const secondSearchInput = getSearchInput(getDesktopSearch(second));

    expect(firstTrigger?.id).toBeTruthy();
    expect(secondTrigger?.id).toBeTruthy();
    expect(firstTrigger?.id).not.toBe(secondTrigger?.id);
    expect(firstTrigger?.getAttribute("aria-controls")).not.toBe(
      secondTrigger?.getAttribute("aria-controls"),
    );
    expect(firstSearchInput?.id).toBeTruthy();
    expect(firstSearchInput?.id).not.toBe(secondSearchInput?.id);
  });

  it("opens the desktop mega-menu without auto-selecting l1, then restores preview content on interaction", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    const l1Description = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-description--inline",
    ) as HTMLElement | null;
    const selectedL1 = el.shadowRoot?.querySelector(
      ".mega-col--l1 [data-selected='true']",
    ) as HTMLElement | null;
    const l2Overview = el.shadowRoot?.querySelector(
      ".mega-col--l2 .menu-item-link--overview",
    ) as HTMLElement | null;
    const l2Description = el.shadowRoot?.querySelector(
      ".mega-col--l2 .menu-description--inline",
    ) as HTMLElement | null;
    const l2Column = el.shadowRoot?.querySelector(
      ".mega-col--l2",
    ) as HTMLElement | null;
    const l3Column = el.shadowRoot?.querySelector(
      ".mega-col--l3",
    ) as HTMLElement | null;

    expect(l1Description?.textContent?.trim()).toBe(
      "Stay current with FDIC announcements, upcoming events, and multimedia content.",
    );
    expect(selectedL1).toBeNull();
    expect(l2Column).toBeNull();
    expect(l3Column).toBeNull();
    expect(l2Overview).toBeNull();
    expect(l2Description).toBeNull();

    const newsButton = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-item-button--l1",
    ) as HTMLButtonElement | null;

    newsButton?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    const l2OverviewAfterHover = el.shadowRoot?.querySelector(
      ".mega-col--l2 .menu-item-link--overview",
    ) as HTMLElement | null;
    const l2DescriptionAfterHover = el.shadowRoot?.querySelector(
      ".mega-col--l2 .menu-description--inline",
    ) as HTMLElement | null;
    const l3ColumnBeforePreview = el.shadowRoot?.querySelector(
      ".mega-col--l3",
    ) as HTMLElement | null;

    expect(l2OverviewAfterHover?.textContent).toContain("News Overview");
    expect(l2DescriptionAfterHover?.textContent?.trim()).toBe(
      "Explore News services, guidance, and related resources.",
    );
    expect(l3ColumnBeforePreview).toBeNull();

    const overviewLink = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-item-link--overview",
    ) as HTMLAnchorElement | null;

    overviewLink?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    const selectedOverview = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-item-link--overview[data-selected='true']",
    ) as HTMLAnchorElement | null;
    const selectedNewsButton = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-item-button--l1[data-selected='true']",
    ) as HTMLButtonElement | null;

    expect(selectedOverview).not.toBeNull();
    expect(selectedNewsButton).toBeNull();

    newsButton?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    const globalMessages = el.shadowRoot?.querySelector(
      '.mega-col--l2 a[href="#global-messages"]',
    ) as HTMLAnchorElement | null;

    globalMessages?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    const l3FirstLink = el.shadowRoot?.querySelector(
      '.mega-col--l3 .menu-item-link[href="#global-digest-faq"]',
    ) as HTMLAnchorElement | null;
    const activeL3Item = el.shadowRoot?.querySelector(
      ".mega-col--l3 .menu-item-link[data-active='true']",
    ) as HTMLAnchorElement | null;
    const l3Description = el.shadowRoot?.querySelector(
      ".mega-col--l3 .menu-description--l3",
    ) as HTMLElement | null;
    const l3List = el.shadowRoot?.querySelector(
      ".mega-col--l3 .menu-list",
    ) as HTMLElement | null;

    expect(l3FirstLink?.textContent).toContain("Global Digest FAQ");
    expect(activeL3Item).toBeNull();
    expect(l3Description?.textContent?.trim()).toBe(
      "View updates, schedules, and related materials for Global Messages in News.",
    );
    expect(l3Description?.compareDocumentPosition(l3List || null)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );

    l3FirstLink?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    const activeL3AfterHover = el.shadowRoot?.querySelector(
      '.mega-col--l3 .menu-item-link[href="#global-digest-faq"][data-active="true"]',
    ) as HTMLAnchorElement | null;

    expect(activeL3AfterHover).not.toBeNull();
  });

  it("Escape closes the desktop mega-menu and returns focus to the active trigger", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.focus();
    trigger?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await el.updateComplete;
    await nextFrame();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    await nextFrame();

    const megaMenu = el.shadowRoot?.querySelector(".mega-menu") as HTMLElement | null;

    expect(megaMenu?.hidden).toBe(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(el.shadowRoot?.activeElement).toBe(trigger);
  });

  it("dismisses the desktop mega-menu when the wrapper area outside the panel is clicked", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    const megaMenu = el.shadowRoot?.querySelector(".mega-menu") as HTMLElement | null;

    megaMenu?.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(megaMenu?.hidden).toBe(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  });

  it("ArrowUp from the first mega-menu item returns focus to the active trigger", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    const newsButton = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-item-button--l1",
    ) as HTMLButtonElement | null;

    newsButton?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    const l2Overview = el.shadowRoot?.querySelector(
      ".mega-col--l2 .menu-item-link--overview",
    ) as HTMLAnchorElement | null;

    l2Overview?.focus();
    l2Overview?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowUp",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(trigger);
    expect(trigger?.getAttribute("data-manual-focus-visible")).toBe("true");
  });

  it("moves one shared top-nav active indicator between active tabs", async () => {
    const el = await createHeader();
    const topNavTrack = el.shadowRoot?.querySelector(".top-nav-track") as HTMLElement | null;
    const newsTrigger = getPanelTrigger(el, "news-events");
    const careerTrigger = getPanelTrigger(el, "career-development");

    stubElementRect(topNavTrack, { left: 100, width: 900 });
    stubElementRect(newsTrigger, { left: 140, width: 206 });
    stubElementRect(careerTrigger, { left: 346, width: 338 });

    newsTrigger?.click();
    await el.updateComplete;
    await nextFrame();

    const indicator = el.shadowRoot?.querySelector(
      ".top-nav-active-indicator",
    ) as HTMLElement | null;

    expect(indicator?.getAttribute("data-visible")).toBe("true");
    expect(topNavTrack?.getAttribute("style")).toContain("--top-nav-indicator-offset:40px");
    expect(topNavTrack?.getAttribute("style")).toContain("--top-nav-indicator-width:206px");

    careerTrigger?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await wait(160);
    await el.updateComplete;
    await nextFrame();

    expect(topNavTrack?.getAttribute("style")).toContain("--top-nav-indicator-offset:246px");
    expect(topNavTrack?.getAttribute("style")).toContain("--top-nav-indicator-width:338px");
  });

  it("uses the prototype mobile drill-down structure and restores toggle focus on close", async () => {
    const el = await createHeader({ mobile: true });
    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const drawer = el.shadowRoot?.querySelector(
      ".mobile-drawer",
    ) as HTMLElement | null;
    const backButton = el.shadowRoot?.querySelector(
      ".mobile-back",
    ) as HTMLButtonElement | null;
    const overviewLink = el.shadowRoot?.querySelector(
      ".mobile-overview-link",
    ) as HTMLAnchorElement | null;
    const introCopy = el.shadowRoot?.querySelector(
      ".mobile-intro",
    ) as HTMLElement | null;
    const firstSectionButton = el.shadowRoot?.querySelector(
      ".mobile-button",
    ) as HTMLButtonElement | null;

    expect(drawer?.getAttribute("data-open")).toBe("true");
    expect(backButton?.textContent?.trim()).toBe("Main menu");
    expect(overviewLink?.textContent?.trim()).toBe("News & Events");
    expect(introCopy?.textContent?.trim()).toBe(
      "Stay current with FDIC announcements, upcoming events, and multimedia content.",
    );
    expect(firstSectionButton?.textContent).toContain("News");

    firstSectionButton?.click();
    await el.updateComplete;
    await nextFrame();

    const drillBackButton = el.shadowRoot?.querySelector(
      ".mobile-back",
    ) as HTMLButtonElement | null;
    const sectionOverviewLink = el.shadowRoot?.querySelector(
      ".mobile-overview-link",
    ) as HTMLAnchorElement | null;
    const mobileDescription = el.shadowRoot?.querySelector(
      ".mobile-intro",
    ) as HTMLElement | null;

    expect(drillBackButton?.textContent?.trim()).toBe("News & Events Overview");
    expect(sectionOverviewLink?.textContent?.trim()).toBe("News");
    expect(mobileDescription?.textContent?.trim()).toBe(
      "Explore News services, guidance, and related resources.",
    );
    expect(el.shadowRoot?.querySelector(".mobile-context")).toBeNull();

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    expect(menuToggle).toBe(el.shadowRoot?.activeElement);
  });

  it("switches to the compact mobile layout when the host is narrow even if the viewport stays desktop", async () => {
    const el = await createHeader();

    triggerResize(el, 384);
    await el.updateComplete;
    await nextFrame();

    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;

    expect(el.hasAttribute("mobile-layout")).toBe(true);
    expect(el.hasAttribute("compact-mobile-layout")).toBe(true);

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const drawer = el.shadowRoot?.querySelector(
      ".mobile-drawer",
    ) as HTMLElement | null;

    expect(drawer?.getAttribute("data-open")).toBe("true");
  });

  it("coordinates one shared query value between desktop and mobile search surfaces", async () => {
    const el = await createHeader({ mobile: true });
    const desktopSearch = getDesktopSearch(el);
    const desktopInput = getSearchInput(desktopSearch);

    if (!desktopInput) {
      throw new Error("Expected desktop search input");
    }

    desktopInput.value = "Global Messages";
    desktopInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await wait(220);
    await el.updateComplete;

    const searchToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='search']",
    ) as HTMLButtonElement | null;
    searchToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const mobileInput = getSearchInput(getMobileSearch(el));
    expect(mobileInput?.value).toBe("Global Messages");
  });

  it("uses the slash shortcut to focus desktop search outside editable contexts", async () => {
    const el = await createHeader();
    const desktopSearch = getDesktopSearch(el);
    const desktopInput = getSearchInput(desktopSearch);

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "/", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(desktopSearch);
    expect(desktopSearch?.shadowRoot?.activeElement).toBe(desktopInput);

    desktopInput?.focus();
    desktopInput?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "/", bubbles: true, cancelable: true }),
    );
    await el.updateComplete;

    expect(desktopSearch?.shadowRoot?.activeElement).toBe(desktopInput);
  });

  it("has no detectable axe violations in the default closed state", async () => {
    const el = await createHeader();
    await expectNoAxeViolations(el.shadowRoot!);
  });
});
