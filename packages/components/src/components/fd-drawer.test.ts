import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-drawer.js";
import { expectNoAxeViolations } from "./test-a11y.js";

const dialogProto = window.HTMLDialogElement?.prototype;
const originalShowModal = dialogProto?.showModal;
const originalClose = dialogProto?.close;

async function nextFrame() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

async function createDrawer() {
  const el = document.createElement("fd-drawer") as HTMLElement & {
    open: boolean;
    modal: boolean;
    label: string;
    updateComplete: Promise<unknown>;
    focus: (options?: FocusOptions) => void;
  };

  el.open = true;
  el.modal = true;
  el.label = "Reference drawer";
  el.innerHTML = `
    <div slot="header">
      <button type="button">Back</button>
    </div>
    <button type="button">First action</button>
    <a href="#second">Second action</a>
  `;

  document.body.appendChild(el);
  await el.updateComplete;
  await nextFrame();
  return el;
}

async function createInlineDrawer() {
  const el = document.createElement("fd-drawer") as HTMLElement & {
    open: boolean;
    modal: boolean;
    label: string;
    updateComplete: Promise<unknown>;
  };

  el.open = true;
  el.modal = false;
  el.label = "Inline drawer";
  el.innerHTML = `
    <div slot="header">
      <button type="button">Close panel</button>
    </div>
    <p>Inline content</p>
  `;

  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("fd-drawer", () => {
  beforeAll(() => {
    if (!dialogProto) {
      return;
    }

    if (typeof dialogProto.showModal !== "function") {
      Object.defineProperty(dialogProto, "showModal", {
        configurable: true,
        value(this: HTMLDialogElement) {
          this.setAttribute("open", "");
        },
      });
    }

    if (typeof dialogProto.close !== "function") {
      Object.defineProperty(dialogProto, "close", {
        configurable: true,
        value(this: HTMLDialogElement) {
          this.removeAttribute("open");
          this.dispatchEvent(new Event("close"));
        },
      });
    }
  });

  afterAll(() => {
    if (!dialogProto) {
      return;
    }

    if (originalShowModal) {
      Object.defineProperty(dialogProto, "showModal", {
        configurable: true,
        value: originalShowModal,
      });
    } else {
      delete (dialogProto as HTMLDialogElement & { showModal?: unknown }).showModal;
    }

    if (originalClose) {
      Object.defineProperty(dialogProto, "close", {
        configurable: true,
        value: originalClose,
      });
    } else {
      delete (dialogProto as HTMLDialogElement & { close?: unknown }).close;
    }
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-drawer", () => {
    expect(customElements.get("fd-drawer")).toBeDefined();
  });

  it("emits a close-request when the modal backdrop is clicked", async () => {
    const el = await createDrawer();
    const closeSpy = vi.fn();
    el.addEventListener("fd-drawer-close-request", closeSpy);

    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;
    dialog?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy.mock.calls[0]?.[0]?.detail).toEqual({ source: "backdrop" });
  });

  it("emits a close-request on native dialog cancel and preserves parent-owned closing", async () => {
    const el = await createDrawer();
    const closeSpy = vi.fn();
    el.addEventListener("fd-drawer-close-request", closeSpy);

    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;
    const cancelEvent = new Event("cancel", { cancelable: true });
    dialog?.dispatchEvent(cancelEvent);

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy.mock.calls[0]?.[0]?.detail).toEqual({ source: "escape" });
    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(dialog?.hasAttribute("open")).toBe(true);
  });

  it("uses a native dialog surface for modal open state", async () => {
    const el = await createDrawer();
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;

    expect(dialog).not.toBeNull();
    expect(dialog?.hasAttribute("open")).toBe(true);
    expect(dialog?.getAttribute("aria-label")).toBe("Reference drawer");
  });

  it("does not render the inline surface while closed", async () => {
    const el = document.createElement("fd-drawer") as HTMLElement & {
      open: boolean;
      modal: boolean;
      updateComplete: Promise<unknown>;
    };

    el.modal = false;
    el.open = false;
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".base--inline")).toBeNull();
  });

  it("renders an inline surface when non-modal and open", async () => {
    const el = await createInlineDrawer();
    const inlineBase = el.shadowRoot?.querySelector(".base--inline") as HTMLElement | null;
    const surface = el.shadowRoot?.querySelector(".surface") as HTMLElement | null;

    expect(inlineBase).not.toBeNull();
    expect(surface?.getAttribute("role")).toBe("region");
    expect(surface?.getAttribute("aria-label")).toBe("Inline drawer");
  });

  it("does not apply region semantics to a closed inline drawer", async () => {
    const el = await createInlineDrawer();
    el.open = false;
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector(".surface")).toBeNull();
  });

  it("focus() targets the dialog surface in modal mode", async () => {
    const el = await createDrawer();
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;

    el.focus();
    expect(el.shadowRoot?.activeElement).toBe(dialog);
  });

  it("focus() targets the inline surface in non-modal mode", async () => {
    const el = await createInlineDrawer();
    const surface = el.shadowRoot?.querySelector(".surface") as HTMLElement | null;

    el.focus();
    expect(el.shadowRoot?.activeElement).toBe(surface);
  });

  it("opens the native dialog when modal open becomes true", async () => {
    const el = document.createElement("fd-drawer") as HTMLElement & {
      open: boolean;
      modal: boolean;
      label: string;
      updateComplete: Promise<unknown>;
    };

    el.modal = true;
    el.open = false;
    el.label = "Reference drawer";
    document.body.appendChild(el);
    await el.updateComplete;

    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;
    expect(dialog?.hasAttribute("open")).toBe(false);

    el.open = true;
    await el.updateComplete;

    expect(dialog?.hasAttribute("open")).toBe(true);
  });

  it("closes the native dialog when modal open becomes false", async () => {
    const el = await createDrawer();
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;

    expect(dialog?.hasAttribute("open")).toBe(true);

    el.open = false;
    await el.updateComplete;

    expect(dialog?.hasAttribute("open")).toBe(false);
  });

  it("saves and restores focus when the modal closes", async () => {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.textContent = "Open drawer";
    document.body.appendChild(trigger);
    trigger.focus();

    const el = await createDrawer();
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;
    expect(document.activeElement).toBe(trigger);
    expect(dialog?.hasAttribute("open")).toBe(true);

    el.open = false;
    await el.updateComplete;

    expect(document.activeElement).toBe(trigger);
  });

  it("clears the saved focus target after modal close", async () => {
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.textContent = "Open drawer";
    document.body.appendChild(trigger);
    trigger.focus();

    const el = await createDrawer();
    el.open = false;
    await el.updateComplete;

    const focusSpy = vi.spyOn(trigger, "focus");
    el.open = false;
    await el.updateComplete;

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("ignores clicks inside the modal surface", async () => {
    const el = await createDrawer();
    const closeSpy = vi.fn();
    el.addEventListener("fd-drawer-close-request", closeSpy);

    const action = el.querySelector("button:not([slot])") as HTMLButtonElement | null;
    action?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("does not emit close-request for inline escape key presses", async () => {
    const el = await createInlineDrawer();
    const closeSpy = vi.fn();
    el.addEventListener("fd-drawer-close-request", closeSpy);

    const surface = el.shadowRoot?.querySelector(".surface") as HTMLElement | null;
    surface?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it("renders the header slot only when provided", async () => {
    const el = document.createElement("fd-drawer") as HTMLElement & {
      open: boolean;
      modal: boolean;
      updateComplete: Promise<unknown>;
    };

    el.open = true;
    el.modal = false;
    el.innerHTML = "<p>Body only</p>";
    document.body.appendChild(el);
    await el.updateComplete;

    const header = el.shadowRoot?.querySelector(".header") as HTMLElement | null;
    expect(header?.hasAttribute("hidden")).toBe(true);
  });

  it("has no detectable axe violations in the open modal state", async () => {
    const el = await createDrawer();
    await expectNoAxeViolations(el.shadowRoot!);
  });

  it("has no detectable axe violations in the open inline state", async () => {
    const el = await createInlineDrawer();
    await expectNoAxeViolations(el.shadowRoot!);
  });
});
