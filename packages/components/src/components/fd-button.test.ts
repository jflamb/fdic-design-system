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

  it("keeps the rendered control as type='button' even when submit is requested", async () => {
    const el = await createButton({ type: "submit" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("type")).toBe("button");
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

  it("does not submit a light-DOM form when host type='submit' is set", async () => {
    const form = document.createElement("form");
    const submitSpy = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener("submit", submitSpy);
    form.innerHTML = '<fd-button type="submit">Submit filing</fd-button>';
    document.body.appendChild(form);

    const el = form.querySelector("fd-button") as any;
    await el.updateComplete;

    const inner = getInternal(el);
    inner.click();

    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("type")).toBe("button");
    expect(submitSpy).not.toHaveBeenCalled();
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

  it("forwards aria-label to the rendered native control", async () => {
    const el = await createButton({ "aria-label": "Close dialog" }, "");
    const inner = getInternal(el);

    expect(inner.getAttribute("aria-label")).toBe("Close dialog");
  });

  it("forwards aria-labelledby to the rendered native control", async () => {
    const label = document.createElement("span");
    label.id = "button-label";
    label.textContent = "Close dialog";
    document.body.appendChild(label);

    const el = await createButton({ "aria-labelledby": "button-label" }, "");
    const inner = getInternal(el);

    expect(inner.getAttribute("aria-labelledby")).toBe("button-label");
  });

  it("adds noopener and noreferrer for _blank links by default", async () => {
    const el = await createButton({
      href: "https://example.com",
      target: "_blank",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("preserves explicit rel tokens while adding missing _blank protections", async () => {
    const el = await createButton({
      href: "https://example.com",
      target: "_blank",
      rel: "external noopener",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("external noopener noreferrer");
  });

  it("does not duplicate noopener/noreferrer when already present", async () => {
    const el = await createButton({
      href: "https://example.com",
      target: "_blank",
      rel: "noreferrer noopener",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("noreferrer noopener");
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
