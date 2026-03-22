import { describe, it, expect, beforeEach, vi } from "vitest";
import "./fd-button.js";

async function createButton(
  attrs: Record<string, string> = {},
  innerHTML = "Click me",
) {
  const el = document.createElement("fd-button") as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=base]") as HTMLElement;
}

describe("fd-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-button")).toBeDefined();
  });

  it("renders native <button> by default with type='button'", async () => {
    const el = await createButton();
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("type")).toBe("button");
  });

  it("renders <a> when href is set", async () => {
    const el = await createButton({ href: "https://example.com" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("A");
    expect(inner.getAttribute("href")).toBe("https://example.com");
  });

  it("does NOT add role='button' to <a>", async () => {
    const el = await createButton({ href: "https://example.com" });
    const inner = getInternal(el);
    expect(inner.getAttribute("role")).toBeNull();
  });

  it("reflects type attribute on <button>", async () => {
    const el = await createButton({ type: "submit" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("type")).toBe("submit");
  });

  it("ignores type when href is set", async () => {
    const el = await createButton({
      href: "https://example.com",
      type: "submit",
    });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("A");
    expect(inner.hasAttribute("type")).toBe(false);
  });

  it("applies native disabled on <button>", async () => {
    const el = await createButton({ disabled: "" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("applies aria-disabled and tabindex=-1 on disabled <a>, no href", async () => {
    const el = await createButton({
      href: "https://example.com",
      disabled: "",
    });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("A");
    expect(inner.getAttribute("aria-disabled")).toBe("true");
    expect(inner.getAttribute("tabindex")).toBe("-1");
    expect(inner.hasAttribute("href")).toBe(false);
  });

  it("suppresses click on disabled <a>", async () => {
    const el = await createButton({
      href: "https://example.com",
      disabled: "",
    });
    const inner = getInternal(el);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    inner.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("defaults to primary variant", async () => {
    const el = await createButton();
    const inner = getInternal(el);
    expect(inner.classList.contains("primary")).toBe(true);
  });

  it("applies variant class for destructive", async () => {
    const el = await createButton({ variant: "destructive" });
    const inner = getInternal(el);
    expect(inner.classList.contains("destructive")).toBe(true);
  });

  it("has default slot, icon-start slot, and icon-end slot", async () => {
    const el = await createButton(
      {},
      '<span slot="icon-start">S</span>Label<span slot="icon-end">E</span>',
    );
    const slots = el.shadowRoot!.querySelectorAll("slot");
    const slotNames = Array.from(slots).map(
      (s: any) => s.getAttribute("name") || "default",
    );
    expect(slotNames).toContain("default");
    expect(slotNames).toContain("icon-start");
    expect(slotNames).toContain("icon-end");
  });
});
