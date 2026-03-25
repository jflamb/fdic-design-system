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

  it("focus() targets the dialog surface in modal mode", async () => {
    const el = await createDrawer();
    const dialog = el.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;

    el.focus();
    expect(el.shadowRoot?.activeElement).toBe(dialog);
  });

  it("has no detectable axe violations in the open modal state", async () => {
    const el = await createDrawer();
    await expectNoAxeViolations(el.shadowRoot!);
  });
});
