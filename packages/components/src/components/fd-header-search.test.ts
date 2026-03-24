import { beforeEach, describe, expect, it, vi } from "vitest";
import "../icons/phosphor-regular.js";
import "../register/fd-header-search.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import {
  buildHeaderSearchFallbackHref,
  getHeaderSearchMatches,
} from "./fd-header-search.js";

const SAMPLE_ITEMS = [
  {
    id: "fdicnews",
    title: "FDICNews",
    href: "#fdicnews",
    meta: "News & Events / News",
    description: "Latest FDIC news.",
  },
  {
    id: "global-messages",
    title: "Global Messages",
    href: "#global-messages",
    meta: "News & Events / News",
    description: "Agency-wide announcements.",
  },
  {
    id: "csrr",
    title: "Customer Service & Records Research (CSRR)",
    href: "#csrr",
    meta: "Knowledge Base / Policy Manuals",
    description: "Support and records research.",
  },
] as const;

async function nextFrame() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

async function createSearch({
  surface = "desktop",
  open = false,
}: {
  surface?: "desktop" | "mobile";
  open?: boolean;
} = {}) {
  const el = document.createElement("fd-header-search") as HTMLElement & {
    surface: "desktop" | "mobile";
    items: typeof SAMPLE_ITEMS;
    value: string;
    open: boolean;
    updateComplete: Promise<unknown>;
  };

  el.surface = surface;
  el.items = [...SAMPLE_ITEMS];
  el.open = open;
  document.body.appendChild(el);
  await el.updateComplete;
  await nextFrame();
  return el;
}

function getInput(el: HTMLElement) {
  return el.shadowRoot?.querySelector(".native") as HTMLInputElement | null;
}

describe("fd-header-search", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  it("registers fd-header-search", () => {
    expect(customElements.get("fd-header-search")).toBeDefined();
  });

  it("keeps generated control ids instance-safe", async () => {
    const first = await createSearch();
    const second = await createSearch();

    expect(getInput(first)?.id).toBeTruthy();
    expect(getInput(first)?.id).not.toBe(getInput(second)?.id);
  });

  it("matches aliases and acronyms using the prototype search ranking", () => {
    expect(getHeaderSearchMatches("fdicnews", [...SAMPLE_ITEMS])[0]?.id).toBe(
      "fdicnews",
    );
    expect(getHeaderSearchMatches("csrr", [...SAMPLE_ITEMS])[0]?.id).toBe(
      "csrr",
    );
  });

  it("emits submit details with the first direct match and a fallback href", async () => {
    const el = await createSearch();
    const submitSpy = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener("fd-header-search-submit", submitSpy);

    const input = getInput(el);
    input?.dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    if (input) {
      input.value = "Global Messages";
      input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }

    await new Promise<void>((resolve) => window.setTimeout(resolve, 220));
    await el.updateComplete;

    const form = el.shadowRoot?.querySelector("form") as HTMLFormElement | null;
    form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(submitSpy).toHaveBeenCalledTimes(1);
    const detail = submitSpy.mock.calls[0]?.[0];
    expect(detail?.detail?.query).toBe("Global Messages");
    expect(detail?.detail?.firstMatchHref).toBe("#global-messages");
    expect(detail?.detail?.href).toBe(
      buildHeaderSearchFallbackHref("/search", "q", "Global Messages"),
    );
  });

  it("closes the mobile drawer surface through the shared close-request contract", async () => {
    const el = await createSearch({ surface: "mobile", open: true });
    const openChangeSpy = vi.fn();
    el.addEventListener("fd-header-search-open-change", openChangeSpy);

    const drawer = el.shadowRoot?.querySelector("fd-drawer") as HTMLElement | null;
    drawer?.dispatchEvent(
      new CustomEvent("fd-drawer-close-request", {
        bubbles: true,
        composed: true,
        detail: { source: "escape" },
      }),
    );
    await el.updateComplete;

    expect(el.open).toBe(false);
    expect(openChangeSpy).toHaveBeenCalledTimes(1);
    expect(openChangeSpy.mock.calls[0]?.[0]?.detail).toEqual({
      open: false,
      surface: "mobile",
    });
  });

  it("has no detectable axe violations in the desktop closed state", async () => {
    const el = await createSearch();
    await expectNoAxeViolations(el.shadowRoot!);
  });
});
