import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/register-all.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import {
  createFdGlobalHeaderPrototypeSearch,
  fdGlobalHeaderPrototypeNavigation,
} from "./fd-global-header.prototype.js";

let mobileMatches = false;

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

async function nextFrame() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

async function wait(ms = 0) {
  await new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

async function createHeader({ mobile = false } = {}) {
  mobileMatches = mobile;
  installMatchMediaStub();

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

describe("fd-global-header", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mobileMatches = false;
    installMatchMediaStub();
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

  it("restores the prototype desktop description treatment and l3 preview content", async () => {
    const el = await createHeader();
    const trigger = getPanelTrigger(el, "news-events");

    trigger?.click();
    await el.updateComplete;
    await nextFrame();

    const l1Description = el.shadowRoot?.querySelector(
      ".mega-col--l1 .menu-description--inline",
    ) as HTMLElement | null;
    const l2Overview = el.shadowRoot?.querySelector(
      ".mega-col--l2 .menu-item-link--overview",
    ) as HTMLElement | null;
    const l2Description = el.shadowRoot?.querySelector(
      ".mega-col--l2 .menu-description--inline",
    ) as HTMLElement | null;

    expect(l1Description?.textContent?.trim()).toBe(
      "Stay current with FDIC announcements, upcoming events, and multimedia content.",
    );
    expect(l2Overview?.textContent).toContain("News Overview");
    expect(l2Description?.textContent?.trim()).toBe(
      "Explore News services, guidance, and related resources.",
    );

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
    const l3Description = el.shadowRoot?.querySelector(
      ".mega-col--l3 .menu-description--l3",
    ) as HTMLElement | null;

    expect(l3FirstLink?.textContent).toContain("Global Digest FAQ");
    expect(l3Description?.textContent?.trim()).toBe(
      "View updates, schedules, and related materials for Global Messages in News.",
    );
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
    const drawerTitle = el.shadowRoot?.querySelector(
      ".mobile-title",
    ) as HTMLElement | null;
    const firstSectionButton = el.shadowRoot?.querySelector(
      ".mobile-button",
    ) as HTMLButtonElement | null;

    expect(drawer?.open).toBe(true);
    expect(drawerTitle?.textContent?.trim()).toBe("News & Events");
    expect(firstSectionButton?.textContent).toContain("News");

    firstSectionButton?.click();
    await el.updateComplete;
    await nextFrame();

    const mobileContext = el.shadowRoot?.querySelector(
      ".mobile-context",
    ) as HTMLElement | null;
    const mobileDescription = el.shadowRoot?.querySelector(
      ".mobile-item-meta",
    ) as HTMLElement | null;

    expect(mobileContext?.textContent).toContain("News & Events");
    expect(mobileContext?.textContent).toContain("News");
    expect(mobileDescription?.textContent?.trim()).toBe(
      "Explore News services, guidance, and related resources.",
    );

    drawer?.dispatchEvent(
      new CustomEvent("fd-drawer-close-request", {
        bubbles: true,
        composed: true,
        detail: { source: "escape" },
      }),
    );
    await el.updateComplete;
    await nextFrame();

    expect(menuToggle).toBe(el.shadowRoot?.activeElement);
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

  it("has no detectable axe violations in the default closed state", async () => {
    const el = await createHeader();
    await expectNoAxeViolations(el.shadowRoot!);
  });
});
