import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/register-all.js";
import { expectNoAxeViolations } from "./test-a11y.js";

const SAMPLE_NAVIGATION = [
  {
    kind: "link",
    label: "Dashboard",
    href: "/dashboard",
    current: true,
    description: "Overview",
  },
  {
    kind: "panel",
    id: "banking",
    label: "Banking",
    href: "/banking",
    description: "Manage accounts and support resources.",
    sections: [
      {
        label: "Accounts",
        href: "/banking/accounts",
        description: "Open and monitor accounts.",
        items: [
          {
            label: "Checking",
            href: "/banking/accounts/checking",
            description: "Everyday account services.",
            children: [
              {
                label: "Routing numbers",
                href: "/banking/accounts/checking/routing",
              },
            ],
          },
          {
            label: "Savings",
            href: "/banking/accounts/savings",
            description: "Savings products.",
          },
        ],
      },
      {
        label: "Support",
        href: "/banking/support",
        items: [
          {
            label: "Contact",
            href: "/banking/support/contact",
          },
        ],
      },
    ],
  },
] as const;

const SEARCH_CONFIG = {
  action: "/search",
  label: "Search FDIC",
  placeholder: "Search FDIC",
} as const;

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

async function createHeader({ mobile = false } = {}) {
  mobileMatches = mobile;
  installMatchMediaStub();

  const el = document.createElement("fd-global-header") as any;
  el.navigation = structuredClone(SAMPLE_NAVIGATION);
  el.search = { ...SEARCH_CONFIG };
  el.innerHTML = `
    <a slot="brand" href="/" aria-label="FDIC home">FDIC</a>
    <a slot="utility" href="/profile">Profile</a>
  `;
  document.body.appendChild(el);
  await el.updateComplete;
  await nextFrame();
  return el;
}

function getDesktopPanelTrigger(el: any): HTMLButtonElement | null {
  return el.shadowRoot?.querySelector(
    "[data-panel-trigger='banking']",
  ) as HTMLButtonElement | null;
}

function getDesktopPanel(el: any): HTMLElement | null {
  return el.shadowRoot?.querySelector(".desktop-panel") as HTMLElement | null;
}

function getDesktopSearchInput(el: any): HTMLElement & { value?: string } {
  return el.shadowRoot?.querySelector(
    ".desktop-search fd-input",
  ) as HTMLElement & { value?: string };
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

  it("renders a primary navigation landmark with links and disclosure buttons", async () => {
    const el = await createHeader();
    const nav = el.shadowRoot?.querySelector("nav[aria-label='Primary']");
    const directLink = el.shadowRoot?.querySelector(
      ".primary-link[href='/dashboard']",
    );
    const panelTrigger = getDesktopPanelTrigger(el);

    expect(nav).not.toBeNull();
    expect(directLink?.getAttribute("aria-current")).toBe("page");
    expect(panelTrigger?.getAttribute("aria-expanded")).toBe("false");
  });

  it("generates instance-safe control ids for multiple headers", async () => {
    const first = await createHeader();
    const second = await createHeader();

    const firstTrigger = getDesktopPanelTrigger(first);
    const secondTrigger = getDesktopPanelTrigger(second);

    expect(firstTrigger?.id).toBeTruthy();
    expect(secondTrigger?.id).toBeTruthy();
    expect(firstTrigger?.id).not.toBe(secondTrigger?.id);
    expect(firstTrigger?.getAttribute("aria-controls")).not.toBe(
      secondTrigger?.getAttribute("aria-controls"),
    );
  });

  it("ArrowDown opens the desktop panel and moves focus into the panel", async () => {
    const el = await createHeader();
    const trigger = getDesktopPanelTrigger(el);

    trigger?.focus();
    trigger?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );

    await el.updateComplete;
    await nextFrame();
    await nextFrame();
    await nextFrame();

    const panel = getDesktopPanel(el);
    const firstFocusable = el.shadowRoot?.querySelector(
      "[data-panel-focusable='true']",
    ) as HTMLElement | null;

    expect(panel?.hidden).toBe(false);
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    expect(el.shadowRoot?.activeElement).toBe(firstFocusable);
  });

  it("Escape closes the desktop panel and returns focus to the trigger", async () => {
    const el = await createHeader();
    const trigger = getDesktopPanelTrigger(el);

    trigger?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await el.updateComplete;
    await nextFrame();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;

    const panel = getDesktopPanel(el);

    expect(panel?.hidden).toBe(true);
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(el.shadowRoot?.activeElement).toBe(trigger);
  });

  it("opens the mobile drawer and drills into grouped navigation", async () => {
    const el = await createHeader({ mobile: true });
    const menuToggle = el.shadowRoot?.querySelector(
      "[data-mobile-toggle='menu']",
    ) as HTMLButtonElement | null;

    menuToggle?.click();
    await el.updateComplete;

    const drawer = el.shadowRoot?.querySelector(".mobile-surface") as
      | HTMLElement
      | null;
    const firstPanelButton = drawer?.querySelector(
      ".mobile-button",
    ) as HTMLButtonElement | null;

    expect(drawer?.hidden).toBe(false);
    expect(menuToggle?.getAttribute("aria-expanded")).toBe("true");

    firstPanelButton?.click();
    await el.updateComplete;

    const heading = drawer?.querySelector(".mobile-heading");
    expect(heading?.textContent).toContain("Banking");
  });

  it("renders search suggestions from the supplied navigation data", async () => {
    const el = await createHeader();
    const searchInput = getDesktopSearchInput(el);

    searchInput.value = "checking";
    searchInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    const resultLink = el.shadowRoot?.querySelector(
      ".search-result-link[href='/banking/accounts/checking']",
    );

    expect(resultLink).not.toBeNull();
  });

  it("dispatches a cancelable search-submit event with first-match and fallback hrefs", async () => {
    const el = await createHeader();
    const searchInput = getDesktopSearchInput(el);
    const spy = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener("fd-global-header-search-submit", spy);

    searchInput.value = "checking";
    searchInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    const form = el.shadowRoot?.querySelector(
      ".desktop-search form",
    ) as HTMLFormElement | null;
    form?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    const submitEvent = spy.mock.calls[0][0] as CustomEvent;

    expect(spy).toHaveBeenCalledOnce();
    expect(submitEvent.detail.query).toBe("checking");
    expect(submitEvent.detail.firstMatchHref).toBe(
      "/banking/accounts/checking",
    );
    expect(submitEvent.detail.href).toContain("/search?q=checking");
    expect(submitEvent.detail.surface).toBe("desktop");
  });

  it("reports fallback search submission details when no direct match exists", async () => {
    const el = await createHeader();
    const searchInput = getDesktopSearchInput(el);
    const spy = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener("fd-global-header-search-submit", spy);

    searchInput.value = "unmatched phrase";
    searchInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    const form = el.shadowRoot?.querySelector(
      ".desktop-search form",
    ) as HTMLFormElement | null;
    form?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    const submitEvent = spy.mock.calls[0][0] as CustomEvent;

    expect(spy).toHaveBeenCalledOnce();
    expect(submitEvent.detail.firstMatchHref).toBeUndefined();
    expect(submitEvent.detail.href).toContain("/search?q=unmatched+phrase");
  });

  it("has no obvious accessibility violations in the default desktop state", async () => {
    const el = await createHeader();
    await expectNoAxeViolations(el);
  });
});
