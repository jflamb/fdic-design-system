import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/register-all.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import {
  FdGlobalHeader,
  type FdGlobalHeaderNavigationItem,
} from "./fd-global-header.js";
import {
  createFdGlobalHeaderReferenceSearch,
  fdGlobalHeaderReferenceNavigation,
} from "./fd-global-header.reference.js";

let mobileMatches = false;
let prefersReducedMotionMatches = false;
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
    value: vi.fn().mockImplementation((query: string) => {
      const matches =
        query === "(prefers-reduced-motion: reduce)"
          ? prefersReducedMotionMatches
          : mobileMatches;

      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
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

function setElementHeightMetrics(
  target: HTMLElement,
  getRenderedHeight: () => number,
  getScrollHeight: () => number = getRenderedHeight,
) {
  Object.defineProperty(target, "getBoundingClientRect", {
    configurable: true,
    value: () => {
      const height = getRenderedHeight();
      return {
        width: 0,
        height,
        top: 0,
        right: 0,
        bottom: height,
        left: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
    },
  });

  Object.defineProperty(target, "scrollHeight", {
    configurable: true,
    get: getScrollHeight,
  });
}

async function nextFrame() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

async function wait(ms = 0) {
  await new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function setWindowScrollY(scrollY: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    writable: true,
    value: scrollY,
  });

  Object.defineProperty(window, "pageYOffset", {
    configurable: true,
    writable: true,
    value: scrollY,
  });
}

async function dispatchScroll(scrollY: number) {
  setWindowScrollY(scrollY);
  window.dispatchEvent(new Event("scroll"));
  await nextFrame();
}

async function createHeader({
  mobile = false,
  shy = false,
  shyThreshold,
}: {
  mobile?: boolean;
  shy?: boolean;
  shyThreshold?: number;
} = {}) {
  mobileMatches = mobile;
  installMatchMediaStub();
  installResizeObserverStub();

  const el = document.createElement("fd-global-header") as HTMLElement & {
    navigation: typeof fdGlobalHeaderReferenceNavigation;
    search: ReturnType<typeof createFdGlobalHeaderReferenceSearch>;
    shy: boolean;
    shyThreshold?: number;
    updateComplete: Promise<unknown>;
  };

  el.navigation = structuredClone(fdGlobalHeaderReferenceNavigation);
  el.search = createFdGlobalHeaderReferenceSearch("/search");
  el.shy = shy;
  if (typeof shyThreshold === "number") {
    el.shyThreshold = shyThreshold;
  }
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

function getBase(el: HTMLElement) {
  return el.shadowRoot?.querySelector(".base") as HTMLElement | null;
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

function getDesktopSearchRegion(el: HTMLElement) {
  return el.shadowRoot?.querySelector(
    ".desktop-search-region",
  ) as HTMLElement | null;
}

function getCompactMenuToggle(el: HTMLElement) {
  return el.shadowRoot?.querySelector(
    ".compact-menu-toggle",
  ) as HTMLElement | null;
}

function getMobileSearch(el: HTMLElement) {
  return el.shadowRoot?.querySelector(
    '[data-search-surface="mobile"]',
  ) as HTMLElement | null;
}

function getStyleText(styles: unknown): string {
  if (!styles) {
    return "";
  }

  if (Array.isArray(styles)) {
    return styles.map((entry) => getStyleText(entry)).join("\n");
  }

  if (typeof styles === "object" && styles && "cssText" in styles) {
    const cssText = (styles as { cssText?: unknown }).cssText;
    return typeof cssText === "string" ? cssText : "";
  }

  return "";
}

function getSearchInput(searchHost: HTMLElement | null) {
  return searchHost?.shadowRoot?.querySelector(
    ".native",
  ) as HTMLInputElement | null;
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
    prefersReducedMotionMatches = false;
    resizeCallbacks.clear();
    installMatchMediaStub();
    installResizeObserverStub();
    setWindowScrollY(0);
  });

  it("registers fd-global-header", () => {
    expect(customElements.get("fd-global-header")).toBeDefined();
  });

  it("uses shared semantic glass tokens for mega-menu treatments", () => {
    const styles = getStyleText(FdGlobalHeader.styles);

    expect(styles).toContain("var(--fdic-gradient-glass-sheen)");
    expect(styles).toContain("var(--fdic-color-overlay-scrim-soft)");
    expect(styles).toContain("var(--fdic-color-surface-glass-1)");
    expect(styles).toContain("var(--fdic-color-border-glass-soft)");
  });

  it("keeps dark-mode masthead defaults dark enough for inverted content", () => {
    const styles = getStyleText(FdGlobalHeader.styles);

    expect(styles).toContain("light-dark(#003256, #0d6191)");
    expect(styles).toContain("light-dark(#0b466f, #1278b0)");
    expect(styles).not.toContain("light-dark(#003256, #84dbff)");
    expect(styles).not.toContain("light-dark(#0b466f, #38b6ff)");
  });

  it("uses DS layout tokens for shell width and gutter alignment", () => {
    const styles = getStyleText(FdGlobalHeader.styles);

    expect(styles).toContain("--fdic-layout-shell-max-width");
    expect(styles).toContain("--fdic-layout-content-max-width, 1312px");
    expect(styles).toContain("var(--fdic-layout-gutter, 64px)");
    expect(styles).toContain("var(--fdic-layout-gutter-tablet, 32px)");
  });

  it("suppresses transitions and animations across the component for reduced motion", () => {
    const stylesText = getStyleText(FdGlobalHeader.styles);

    expect(stylesText).toContain("@media (prefers-reduced-motion: reduce)");
    expect(stylesText).toContain("*::before");
    expect(stylesText).toContain("transition: none !important");
    expect(stylesText).toContain("animation: none !important");
  });

  it("keeps the mega-menu shadow on a non-clipping frame during height animations", () => {
    const stylesText = getStyleText(FdGlobalHeader.styles);

    expect(stylesText).toContain(".mega-menu-frame::before");
    expect(stylesText).toContain("box-shadow: 0 8px 16px");
    expect(stylesText).toContain(
      "oklch(from var(--fd-global-header-shadow-floating) l c h / 0.61)",
    );
    expect(stylesText).toContain(
      '.mega-menu-viewport[data-height-animating="true"]',
    );
    expect(stylesText).toContain("overflow: hidden");
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

  it("animates mega-menu height changes when desktop panel content changes", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    const menuViewport = el.shadowRoot?.querySelector(
      ".mega-menu-viewport",
    ) as HTMLElement | null;
    const menuInner = el.shadowRoot?.querySelector(
      ".mega-menu-inner",
    ) as HTMLElement | null;
    const newsButton = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-item-button--l1",
    ) as HTMLButtonElement | null;

    expect(menuViewport).not.toBeNull();
    expect(menuInner).not.toBeNull();

    let renderedHeight = 248;
    let contentHeight = renderedHeight;

    if (!menuViewport || !menuInner) {
      throw new Error("Expected mega-menu viewport and inner surface");
    }

    setElementHeightMetrics(menuViewport, () => renderedHeight);
    setElementHeightMetrics(
      menuInner,
      () => renderedHeight,
      () => contentHeight,
    );

    contentHeight = 396;

    newsButton?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(menuViewport.getAttribute("data-height-animating")).toBe("true");
    expect(menuViewport.style.maxHeight).toBe("396px");

    renderedHeight = 396;
    menuViewport.dispatchEvent(new Event("transitionend"));
    await nextFrame();

    expect(menuViewport.hasAttribute("data-height-animating")).toBe(false);
    expect(menuViewport.style.maxHeight).toBe("");
  });

  it("skips mega-menu height animation when reduced motion is requested", async () => {
    prefersReducedMotionMatches = true;

    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    const menuViewport = el.shadowRoot?.querySelector(
      ".mega-menu-viewport",
    ) as HTMLElement | null;
    const menuInner = el.shadowRoot?.querySelector(
      ".mega-menu-inner",
    ) as HTMLElement | null;
    const newsButton = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-item-button--l1",
    ) as HTMLButtonElement | null;

    if (!menuViewport || !menuInner) {
      throw new Error("Expected mega-menu viewport and inner surface");
    }

    let renderedHeight = 248;
    let contentHeight = renderedHeight;

    setElementHeightMetrics(menuViewport, () => renderedHeight);
    setElementHeightMetrics(
      menuInner,
      () => renderedHeight,
      () => contentHeight,
    );

    contentHeight = 396;

    newsButton?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(menuViewport.hasAttribute("data-height-animating")).toBe(false);
    expect(menuViewport.style.maxHeight).toBe("");
  });

  it("attaches scroll tracking only while shy mode is enabled and cleans it up on disconnect", async () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const el = await createHeader();
    expect(addSpy.mock.calls.some(([type]) => type === "scroll")).toBe(false);

    el.shy = true;
    await el.updateComplete;

    expect(
      addSpy.mock.calls.some(
        ([type, , options]) =>
          type === "scroll" &&
          typeof options === "object" &&
          options != null &&
          "passive" in options &&
          options.passive === true,
      ),
    ).toBe(true);

    el.shy = false;
    await el.updateComplete;

    expect(removeSpy.mock.calls.some(([type]) => type === "scroll")).toBe(true);

    el.shy = true;
    await el.updateComplete;
    el.remove();
    await nextFrame();

    expect(
      removeSpy.mock.calls.filter(([type]) => type === "scroll").length,
    ).toBeGreaterThan(1);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("hides past the shy threshold and reveals on meaningful upward scroll", async () => {
    const el = await createHeader({ shy: true, shyThreshold: 64 });
    const base = getBase(el);

    expect(base?.getAttribute("data-shy-hidden")).toBe("false");

    await dispatchScroll(120);
    await el.updateComplete;

    expect(base?.getAttribute("data-shy-hidden")).toBe("true");
    expect(base?.getAttribute("style")).toContain(
      "--_fd-global-header-shy-duration:300ms",
    );

    await dispatchScroll(117);
    await el.updateComplete;

    expect(base?.getAttribute("data-shy-hidden")).toBe("true");

    await dispatchScroll(110);
    await el.updateComplete;

    expect(base?.getAttribute("data-shy-hidden")).toBe("false");
    expect(base?.getAttribute("style")).toContain(
      "--_fd-global-header-shy-duration:200ms",
    );
  });

  it("uses the rendered header height as the default shy threshold", async () => {
    const el = await createHeader({ shy: true });
    const base = getBase(el);

    if (!base) {
      throw new Error("Expected base surface");
    }

    Object.defineProperty(base, "offsetHeight", {
      configurable: true,
      get: () => 72,
    });

    await dispatchScroll(70);
    await el.updateComplete;
    expect(base.getAttribute("data-shy-hidden")).toBe("false");

    await dispatchScroll(80);
    await el.updateComplete;
    expect(base.getAttribute("data-shy-hidden")).toBe("true");
  });

  it("exposes --fd-global-header-shy-height when shy is enabled and clears it when disabled", async () => {
    const el = await createHeader({ shy: false });
    const base = getBase(el);

    if (!base) {
      throw new Error("Expected base surface");
    }

    Object.defineProperty(base, "offsetHeight", {
      configurable: true,
      get: () => 96,
    });

    el.shy = true;
    await el.updateComplete;

    const value = el.style.getPropertyValue("--fd-global-header-shy-height");
    expect(value).toBe("96px");

    el.shy = false;
    await el.updateComplete;

    expect(el.style.getPropertyValue("--fd-global-header-shy-height")).toBe("");
  });

  it("updates --fd-global-header-shy-height when the header resizes while not compact", async () => {
    const el = await createHeader({ shy: false });
    const base = getBase(el);

    if (!base) {
      throw new Error("Expected base surface");
    }

    let mockHeight = 96;
    Object.defineProperty(base, "offsetHeight", {
      configurable: true,
      get: () => mockHeight,
    });

    el.shy = true;
    await el.updateComplete;
    expect(el.style.getPropertyValue("--fd-global-header-shy-height")).toBe(
      "96px",
    );

    // Simulate a resize while the header is in full (non-compact) state.
    mockHeight = 112;
    triggerResize(el, 1200);
    await wait();
    await nextFrame();
    await el.updateComplete;

    expect(el.style.getPropertyValue("--fd-global-header-shy-height")).toBe(
      "112px",
    );

    // When the header is shy-hidden (compact), resize should NOT update the
    // height — it would capture the compact height instead of the full height.
    await dispatchScroll(200);
    await el.updateComplete;
    expect(base.getAttribute("data-shy-hidden")).toBe("true");

    mockHeight = 48;
    triggerResize(el, 1100);
    await wait();
    await nextFrame();
    await el.updateComplete;

    expect(el.style.getPropertyValue("--fd-global-header-shy-height")).toBe(
      "112px",
    );
  });

  it("switches to a compact sticky desktop state and keeps the desktop mega-menu visible while it is open", async () => {
    const el = await createHeader({ shy: true, shyThreshold: 64 });
    const base = getBase(el);
    const topNav = el.shadowRoot?.querySelector(
      ".top-nav-shell",
    ) as HTMLElement | null;
    const trigger = getPanelTrigger(el, "news-events");

    await dispatchScroll(120);
    await el.updateComplete;
    expect(base?.getAttribute("data-shy-hidden")).toBe("true");
    expect(base?.getAttribute("data-compact-desktop")).toBe("true");
    expect(topNav?.getAttribute("data-compact-nav-visible")).toBe("false");

    trigger?.focus();
    await el.updateComplete;
    await nextFrame();

    expect(base?.getAttribute("data-shy-hidden")).toBe("true");

    const compactMenuToggle = getCompactMenuToggle(el);
    const compactMenuButton = compactMenuToggle?.shadowRoot?.querySelector(
      "button",
    ) as HTMLButtonElement | null;

    compactMenuButton?.click();
    await el.updateComplete;
    await nextFrame();

    expect(topNav?.getAttribute("data-compact-nav-visible")).toBe("true");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(base?.getAttribute("data-shy-hidden")).toBe("true");
    expect(base?.getAttribute("data-compact-desktop")).toBe("true");

    await dispatchScroll(180);
    await el.updateComplete;

    expect(base?.getAttribute("data-shy-hidden")).toBe("true");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(base?.getAttribute("data-shy-hidden")).toBe("true");

    await dispatchScroll(190);
    await el.updateComplete;

    expect(base?.getAttribute("data-shy-hidden")).toBe("true");
  });

  it("expands compact desktop search from the slash shortcut without leaving shy mode", async () => {
    const el = await createHeader({ shy: true, shyThreshold: 64 });
    const base = getBase(el);
    const searchRegion = getDesktopSearchRegion(el);

    await dispatchScroll(120);
    await el.updateComplete;

    expect(base?.getAttribute("data-compact-desktop")).toBe("true");
    expect(searchRegion?.getAttribute("data-search-expanded")).toBe("false");

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "/", bubbles: true }),
    );
    await el.updateComplete;
    await nextFrame();

    const desktopSearch = getDesktopSearch(el);
    const input = getSearchInput(desktopSearch);

    expect(base?.getAttribute("data-shy-hidden")).toBe("true");
    expect(searchRegion?.getAttribute("data-search-expanded")).toBe("true");
    expect(desktopSearch?.shadowRoot?.activeElement).toBe(input);
  });

  it("reveals for mobile drawer and mobile search surfaces and suppresses shy motion under reduced motion", async () => {
    prefersReducedMotionMatches = true;

    const el = await createHeader({
      mobile: true,
      shy: true,
      shyThreshold: 64,
    });
    const base = getBase(el);
    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;
    const searchToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='search']",
    ) as HTMLButtonElement | null;

    await dispatchScroll(120);
    await el.updateComplete;

    expect(base?.getAttribute("data-shy-hidden")).toBe("true");
    expect(base?.getAttribute("style")).toContain(
      "--_fd-global-header-shy-duration:0ms",
    );

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    expect(base?.getAttribute("data-shy-hidden")).toBe("false");
    expect(
      el.shadowRoot?.querySelector(".mobile-drawer")?.getAttribute("data-open"),
    ).toBe("true");

    await dispatchScroll(180);
    await el.updateComplete;

    expect(base?.getAttribute("data-shy-hidden")).toBe("false");

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    await dispatchScroll(190);
    await el.updateComplete;
    expect(base?.getAttribute("data-shy-hidden")).toBe("true");

    searchToggle?.click();
    await el.updateComplete;
    await nextFrame();

    expect(base?.getAttribute("data-shy-hidden")).toBe("false");
    expect(
      el.shadowRoot
        ?.querySelector(".mobile-search-shell")
        ?.getAttribute("data-open"),
    ).toBe("true");
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

    const megaMenu = el.shadowRoot?.querySelector(
      ".mega-menu",
    ) as HTMLElement | null;

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

    const megaMenu = el.shadowRoot?.querySelector(
      ".mega-menu",
    ) as HTMLElement | null;

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

  it("supports ArrowLeft and ArrowRight navigation across desktop menu columns", async () => {
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

    if (!newsButton || !globalMessages || !l3FirstLink) {
      throw new Error("Expected desktop mega-menu items across all columns");
    }

    newsButton.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(globalMessages);

    globalMessages.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(l3FirstLink);

    l3FirstLink.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(globalMessages);

    globalMessages.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(newsButton);
  });

  it("supports Home and End keyboard navigation in the top nav", async () => {
    const el = await createHeader();
    const topNavItems = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLElement>(
        ".top-nav-button, .top-nav-link",
      ) || [],
    );
    const firstItem = topNavItems[0] || null;
    const middleItem = topNavItems[1] || null;
    const lastItem = topNavItems[topNavItems.length - 1] || null;

    if (!firstItem || !middleItem || !lastItem) {
      throw new Error("Expected top nav items");
    }

    middleItem.focus();
    middleItem.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "End",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(lastItem);

    lastItem.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Home",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(firstItem);
  });

  it("marks a current top-level panel trigger without promoting it to the open state", async () => {
    const el = await createHeader();
    const navigation = structuredClone(
      fdGlobalHeaderReferenceNavigation,
    ) as FdGlobalHeaderNavigationItem[];
    const firstItem = navigation[0];

    if (!firstItem || firstItem.kind !== "panel") {
      throw new Error("Expected first navigation item to be a panel");
    }

    firstItem.current = true;
    el.navigation = navigation as typeof fdGlobalHeaderReferenceNavigation;
    await el.updateComplete;
    await nextFrame();

    const trigger = getPanelTrigger(el, firstItem.id);

    expect(trigger?.getAttribute("data-current")).toBe("true");
    expect(trigger?.getAttribute("data-active")).toBe("false");
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  });

  it("moves one shared top-nav active indicator between active tabs", async () => {
    const el = await createHeader();
    const topNavTrack = el.shadowRoot?.querySelector(
      ".top-nav-track",
    ) as HTMLElement | null;
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
    const topNavStyle = topNavTrack?.getAttribute("style") ?? "";

    expect(indicator?.getAttribute("data-visible")).toBe("true");
    expect(topNavStyle).toContain("--top-nav-indicator-offset: 40px");
    expect(topNavStyle).toContain("--top-nav-indicator-width: 206px");

    careerTrigger?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await wait(160);
    await el.updateComplete;
    await nextFrame();

    const updatedTopNavStyle = topNavTrack?.getAttribute("style") ?? "";
    expect(updatedTopNavStyle).toContain("--top-nav-indicator-offset: 246px");
    expect(updatedTopNavStyle).toContain("--top-nav-indicator-width: 338px");
  });

  it("waits for hover intent before switching desktop panels", async () => {
    const el = await createHeader();
    const newsTrigger = getPanelTrigger(el, "news-events");
    const careerTrigger = getPanelTrigger(el, "career-development");

    newsTrigger?.click();
    await el.updateComplete;
    await nextFrame();

    careerTrigger?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    await wait(100);
    await el.updateComplete;
    await nextFrame();

    expect(newsTrigger?.getAttribute("aria-expanded")).toBe("true");
    expect(careerTrigger?.getAttribute("aria-expanded")).toBe("false");

    await wait(60);
    await el.updateComplete;
    await nextFrame();

    expect(newsTrigger?.getAttribute("aria-expanded")).toBe("false");
    expect(careerTrigger?.getAttribute("aria-expanded")).toBe("true");
  });

  it("cancels hover intent when the pointer leaves a top-nav trigger before the delay completes", async () => {
    const el = await createHeader();
    const newsTrigger = getPanelTrigger(el, "news-events");
    const careerTrigger = getPanelTrigger(el, "career-development");

    newsTrigger?.click();
    await el.updateComplete;
    await nextFrame();

    careerTrigger?.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, composed: true }),
    );
    careerTrigger?.dispatchEvent(new PointerEvent("pointerleave"));
    await wait(180);
    await el.updateComplete;
    await nextFrame();

    expect(newsTrigger?.getAttribute("aria-expanded")).toBe("true");
    expect(careerTrigger?.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the desktop mega-menu after focus leaves the header surface", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    const megaMenu = el.shadowRoot?.querySelector(
      ".mega-menu",
    ) as HTMLElement | null;

    document.body.tabIndex = -1;
    document.body.focus();
    megaMenu?.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        composed: true,
        relatedTarget: document.body,
      }),
    );
    await nextFrame();
    await wait(220);
    await el.updateComplete;

    expect(megaMenu?.hidden).toBe(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  });

  it("uses the reference mobile drill-down structure and restores toggle focus on close", async () => {
    const el = await createHeader({ mobile: true });
    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const drawer = el.shadowRoot?.querySelector(
      ".mobile-drawer",
    ) as HTMLDialogElement | null;
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
    expect(drawer?.localName).toBe("dialog");
    expect(drawer?.open).toBe(true);
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
    const mobileLinks = Array.from(
      el.shadowRoot?.querySelectorAll(".mobile-link, .mobile-button") || [],
    ).map((element) => element.textContent?.trim());

    expect(drillBackButton?.textContent?.trim()).toBe("News & Events Overview");
    expect(sectionOverviewLink?.textContent?.trim()).toBe("News Overview");
    expect(sectionOverviewLink?.getAttribute("href")).toBe("#news-overview");
    expect(mobileDescription?.textContent?.trim()).toBe(
      "Start with the full News & Events overview, then jump to the area you need.",
    );
    expect(mobileLinks).not.toContain("View all");
    expect(el.shadowRoot?.querySelector(".mobile-context")).toBeNull();

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    expect(menuToggle).toBe(el.shadowRoot?.activeElement);
  });

  it("restores menu toggle focus and drill path when the drawer close button is used", async () => {
    const el = await createHeader({ mobile: true });
    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const firstSectionButton = el.shadowRoot?.querySelector(
      ".mobile-button",
    ) as HTMLButtonElement | null;

    firstSectionButton?.click();
    await el.updateComplete;
    await nextFrame();

    const closeButton = el.shadowRoot?.querySelector(
      ".mobile-drawer-close",
    ) as HTMLButtonElement | null;

    closeButton?.click();
    await el.updateComplete;
    await nextFrame();

    expect(menuToggle).toBe(el.shadowRoot?.activeElement);

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const sectionOverviewLink = el.shadowRoot?.querySelector(
      ".mobile-overview-link",
    ) as HTMLAnchorElement | null;

    expect(sectionOverviewLink?.textContent?.trim()).toBe("News Overview");
  });

  it("uses native dialog elements for mobile menu and search surfaces", async () => {
    const el = await createHeader({ mobile: true });
    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;
    const searchToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='search']",
    ) as HTMLButtonElement | null;
    const drawer = el.shadowRoot?.querySelector(
      ".mobile-drawer",
    ) as HTMLDialogElement | null;
    const searchShell = el.shadowRoot?.querySelector(
      ".mobile-search-shell",
    ) as HTMLDialogElement | null;

    expect(drawer?.localName).toBe("dialog");
    expect(searchShell?.localName).toBe("dialog");
    expect(drawer?.open).toBe(false);
    expect(searchShell?.open).toBe(false);

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    expect(drawer?.open).toBe(true);
    expect(drawer?.getAttribute("aria-label")).toBe("Navigation menu");

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    expect(drawer?.open).toBe(false);

    searchToggle?.click();
    await el.updateComplete;
    await nextFrame();

    expect(searchShell?.open).toBe(true);
    expect(searchShell?.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("syncs native mobile drawer dismissal back into component state and restores toggle focus", async () => {
    const el = await createHeader({ mobile: true });
    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;

    menuToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const drawer = el.shadowRoot?.querySelector(
      ".mobile-drawer",
    ) as HTMLDialogElement | null;

    drawer?.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(drawer?.open).toBe(false);
    expect(drawer?.getAttribute("data-open")).toBe("false");
    expect(menuToggle).toBe(el.shadowRoot?.activeElement);
  });

  it("switches to the compact mobile layout when the host is narrow even if the viewport stays desktop", async () => {
    const el = await createHeader();

    triggerResize(el, 384);
    await wait();
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
    ) as HTMLDialogElement | null;

    expect(drawer?.getAttribute("data-open")).toBe("true");
    expect(drawer?.open).toBe(true);
  });

  it("coordinates one shared query value between desktop and mobile search surfaces", async () => {
    const el = await createHeader({ mobile: true });
    const desktopSearch = getDesktopSearch(el);
    const desktopInput = getSearchInput(desktopSearch);

    if (!desktopInput) {
      throw new Error("Expected desktop search input");
    }

    desktopInput.value = "Global Messages";
    desktopInput.dispatchEvent(
      new Event("input", { bubbles: true, composed: true }),
    );
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

  it("restores the search toggle when the native mobile search dialog closes", async () => {
    const el = await createHeader({ mobile: true });
    const searchToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='search']",
    ) as HTMLButtonElement | null;

    searchToggle?.click();
    await el.updateComplete;
    await nextFrame();

    const searchDialog = el.shadowRoot?.querySelector(
      ".mobile-search-shell",
    ) as HTMLDialogElement | null;

    searchDialog?.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(searchDialog?.open).toBe(false);
    expect(searchToggle).toBe(el.shadowRoot?.activeElement);
  });

  it("derives the desktop scrim offset from the rendered header geometry", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");
    const topNavShell = el.shadowRoot?.querySelector(
      ".top-nav-shell",
    ) as HTMLElement | null;

    stubElementRect(topNavShell, { left: 0, width: 1024, top: 0, height: 132 });

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    expect(el.style.getPropertyValue("--fd-global-header-overlay-offset")).toBe(
      "132px",
    );

    stubElementRect(topNavShell, { left: 0, width: 1024, top: 0, height: 96 });
    triggerResize(el, 1200);
    await wait();
    await el.updateComplete;
    await nextFrame();

    expect(el.style.getPropertyValue("--fd-global-header-overlay-offset")).toBe(
      "96px",
    );
  });

  it("uses the slash shortcut to focus desktop search outside editable contexts", async () => {
    const el = await createHeader();
    const desktopSearch = getDesktopSearch(el);
    const desktopInput = getSearchInput(desktopSearch);

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "/",
        bubbles: true,
        cancelable: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(el.shadowRoot?.activeElement).toBe(desktopSearch);
    expect(desktopSearch?.shadowRoot?.activeElement).toBe(desktopInput);

    desktopInput?.focus();
    desktopInput?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "/",
        bubbles: true,
        cancelable: true,
      }),
    );
    await el.updateComplete;

    expect(desktopSearch?.shadowRoot?.activeElement).toBe(desktopInput);
  });

  it("keeps aria-controls pointed at an existing desktop mega-menu surface", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");
    const menuId = trigger?.getAttribute("aria-controls");

    expect(menuId).toBeTruthy();
    expect(el.shadowRoot?.querySelector(`#${menuId}`)).not.toBeNull();
  });

  it("does not hijack the slash shortcut from contenteditable targets", async () => {
    const el = await createHeader();
    const desktopSearch = getDesktopSearch(el);
    const editable = document.createElement("div");

    editable.setAttribute("contenteditable", "plaintext-only");
    editable.tabIndex = 0;
    document.body.appendChild(editable);
    editable.focus();

    editable.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "/",
        bubbles: true,
        cancelable: true,
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(document.activeElement).toBe(editable);
    expect(el.shadowRoot?.activeElement).not.toBe(desktopSearch);
  });

  it("normalizes the active panel when navigation changes after initial render", async () => {
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

    expect(el.shadowRoot?.querySelector(".mega-col--l2")).not.toBeNull();

    const updatedNavigation: FdGlobalHeaderNavigationItem[] = [
      {
        kind: "panel",
        id: "updated-panel",
        label: "Updated panel",
        description: "Updated navigation description.",
        sections: [
          {
            id: "updated-overview",
            label: "Updated overview",
            href: "#updated-overview",
            items: [],
          },
          {
            id: "updated-section",
            label: "Updated section",
            href: "#updated-section",
            items: [
              {
                id: "updated-item",
                label: "Updated item",
                href: "#updated-item",
              },
            ],
          },
        ],
      },
      {
        kind: "panel",
        id: "follow-up-panel",
        label: "Follow-up panel",
        sections: [
          {
            id: "follow-up-overview",
            label: "Follow-up overview",
            href: "#follow-up-overview",
            items: [],
          },
        ],
      },
    ];

    el.navigation =
      updatedNavigation as typeof fdGlobalHeaderReferenceNavigation;
    await el.updateComplete;
    await nextFrame();

    const updatedTrigger = getPanelTrigger(el, "updated-panel");
    const panelDescription = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-description--inline",
    ) as HTMLElement | null;

    expect(getPanelTrigger(el, "news-events")).toBeNull();
    expect(updatedTrigger?.getAttribute("aria-expanded")).toBe("true");
    expect(panelDescription?.textContent?.trim()).toBe(
      "Updated navigation description.",
    );
    expect(el.shadowRoot?.querySelector(".mega-col--l2")).toBeNull();
  });

  it("has no detectable axe violations in the default closed state", async () => {
    const el = await createHeader();
    await expectNoAxeViolations(el.shadowRoot!);
  });
});
