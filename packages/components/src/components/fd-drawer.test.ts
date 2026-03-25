import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-drawer.js";
import { expectNoAxeViolations } from "./test-a11y.js";

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

    const backdrop = el.shadowRoot?.querySelector(".backdrop") as HTMLElement | null;
    backdrop?.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy.mock.calls[0]?.[0]?.detail).toEqual({ source: "backdrop" });
  });

  it("emits a close-request on Escape when focus is inside the drawer", async () => {
    const el = await createDrawer();
    const closeSpy = vi.fn();
    el.addEventListener("fd-drawer-close-request", closeSpy);

    const slottedButton = el.querySelector("button:not([slot])") as HTMLButtonElement | null;
    slottedButton?.focus();
    slottedButton?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }),
    );

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy.mock.calls[0]?.[0]?.detail).toEqual({ source: "escape" });
  });

  it("moves focus to the first focusable slotted control", async () => {
    const el = await createDrawer();
    const slottedButton = el.querySelector("button:not([slot])") as HTMLButtonElement | null;

    el.focus();
    expect(document.activeElement).toBe(slottedButton);
  });

  it("has no detectable axe violations in the open modal state", async () => {
    const el = await createDrawer();
    await expectNoAxeViolations(el.shadowRoot!);
  });
});
