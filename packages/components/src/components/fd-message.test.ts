import { beforeEach, describe, expect, it } from "vitest";
import "./fd-message.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createMessage(attrs: Record<string, string> = {}) {
  const el = document.createElement("fd-message") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getMessageSpan(el: any): HTMLElement | null {
  return el.querySelector("[part=message]");
}

function getMessageText(el: any): HTMLElement | null {
  return el.querySelector("[part=message-text]");
}

function getIcon(el: any): SVGElement | null {
  return el.querySelector(".fd-message__icon");
}

describe("fd-message", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  // --- Registration ---

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-message")).toBeDefined();
  });

  // --- Basic rendering ---

  it("renders message text", async () => {
    const el = await createMessage({
      message: "Enter a valid routing number",
    });
    const text = getMessageText(el);
    expect(text).not.toBeNull();
    expect(text!.textContent).toBe("Enter a valid routing number");
  });

  it("renders nothing when message is empty", async () => {
    const el = await createMessage({ message: "" });
    const span = getMessageSpan(el);
    expect(span).toBeNull();
  });

  it("renders nothing when message is whitespace-only", async () => {
    const el = await createMessage({ message: "   " });
    const span = getMessageSpan(el);
    expect(span).toBeNull();
  });

  // --- messageId getter ---

  it("exposes a stable messageId getter", async () => {
    const el = await createMessage({ message: "Some message" });
    expect(el.messageId).toBeTruthy();
    expect(typeof el.messageId).toBe("string");
    expect(el.messageId).toMatch(/^fdm-\d+$/);
  });

  it("messageId matches the rendered element ID", async () => {
    const el = await createMessage({ message: "Test" });
    const span = getMessageSpan(el);
    expect(span).not.toBeNull();
    expect(span!.id).toBe(el.messageId);
  });

  // --- State rendering ---

  it("renders with default state (no icon)", async () => {
    const el = await createMessage({
      message: "Helper text",
      state: "default",
    });
    const icon = getIcon(el);
    expect(icon).toBeNull();
  });

  it("renders error state with icon", async () => {
    const el = await createMessage({
      message: "This field is required",
      state: "error",
    });
    const icon = getIcon(el);
    expect(icon).not.toBeNull();
    expect(icon!.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders warning state with icon", async () => {
    const el = await createMessage({
      message: "Check this value",
      state: "warning",
    });
    const icon = getIcon(el);
    expect(icon).not.toBeNull();
  });

  it("renders success state with icon", async () => {
    const el = await createMessage({
      message: "Looks good",
      state: "success",
    });
    const icon = getIcon(el);
    expect(icon).not.toBeNull();
  });

  // --- ARIA ---

  it("uses role=alert for error state", async () => {
    const el = await createMessage({
      message: "Required field",
      state: "error",
    });
    const span = getMessageSpan(el);
    expect(span!.getAttribute("role")).toBe("alert");
    expect(span!.getAttribute("aria-live")).toBeNull();
  });

  it("uses aria-live=polite for non-error states", async () => {
    const el = await createMessage({
      message: "Helper text",
      state: "default",
    });
    const span = getMessageSpan(el);
    expect(span!.getAttribute("role")).toBeNull();
    expect(span!.getAttribute("aria-live")).toBe("polite");
  });

  it("uses aria-live=polite for warning state", async () => {
    const el = await createMessage({
      message: "Warning",
      state: "warning",
    });
    const span = getMessageSpan(el);
    expect(span!.getAttribute("aria-live")).toBe("polite");
  });

  // --- State property ---

  it("reflects state attribute", async () => {
    const el = await createMessage({
      message: "Test",
      state: "error",
    });
    expect(el.state).toBe("error");
    expect(el.getAttribute("state")).toBe("error");
  });

  // --- for attribute ---

  it("reflects for attribute", async () => {
    const el = await createMessage({ for: "my-input", message: "Test" });
    expect(el.for).toBe("my-input");
    expect(el.getAttribute("for")).toBe("my-input");
  });

  // --- Accessibility ---

  it("has no axe violations (error state)", async () => {
    await createMessage({
      message: "This field is required",
      state: "error",
    });
    await expectNoAxeViolations(document.body);
  });

  it("has no axe violations (default state)", async () => {
    await createMessage({ message: "Helper text" });
    await expectNoAxeViolations(document.body);
  });
});
