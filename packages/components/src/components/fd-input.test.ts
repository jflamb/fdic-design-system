import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-input.js";
import "../register/fd-label.js";
import "../register/fd-message.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createInput(attrs: Record<string, string> = {}) {
  const el = document.createElement("fd-input") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: any): HTMLInputElement | null {
  return el.shadowRoot?.querySelector("[part=native]") ?? null;
}

function getBase(el: any): HTMLElement | null {
  return el.shadowRoot?.querySelector("[part=base]") ?? null;
}

function getCharCount(el: any): HTMLElement | null {
  return el.shadowRoot?.querySelector("[part=char-count]") ?? null;
}

function getSrLiveRegion(el: any): HTMLElement | null {
  return el.shadowRoot?.querySelector("[aria-live=polite]") ?? null;
}

describe("fd-input", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  // --- Registration ---

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-input")).toBeDefined();
  });

  // --- Basic rendering ---

  it("renders a native input element in shadow DOM", async () => {
    const el = await createInput();
    expect(el.shadowRoot).not.toBeNull();
    const input = getInternal(el);
    expect(input).not.toBeNull();
    expect(input!.tagName).toBe("INPUT");
  });

  it("forwards type attribute", async () => {
    const el = await createInput({ type: "email" });
    const input = getInternal(el);
    expect(input!.type).toBe("email");
  });

  it("defaults type to text", async () => {
    const el = await createInput();
    const input = getInternal(el);
    expect(input!.type).toBe("text");
  });

  it("forwards placeholder attribute", async () => {
    const el = await createInput({ placeholder: "e.g. 021000021" });
    const input = getInternal(el);
    expect(input!.placeholder).toBe("e.g. 021000021");
  });

  it("forwards disabled attribute", async () => {
    const el = await createInput({ disabled: "" });
    const input = getInternal(el);
    expect(input!.disabled).toBe(true);
  });

  it("forwards readonly attribute", async () => {
    const el = await createInput({ readonly: "" });
    const input = getInternal(el);
    expect(input!.readOnly).toBe(true);
  });

  it("forwards required attribute", async () => {
    const el = await createInput({ required: "" });
    const input = getInternal(el);
    expect(input!.required).toBe(true);
  });

  it("sets aria-required when required", async () => {
    const el = await createInput({ required: "" });
    const input = getInternal(el);
    expect(input!.getAttribute("aria-required")).toBe("true");
  });

  it("forwards maxlength attribute", async () => {
    const el = await createInput({ maxlength: "100" });
    const input = getInternal(el);
    expect(input!.maxLength).toBe(100);
  });

  // --- Value ---

  it("reflects value property", async () => {
    const el = await createInput({ value: "hello" });
    expect(el.value).toBe("hello");
    const input = getInternal(el);
    expect(input!.value).toBe("hello");
  });

  // --- Form association ---

  it("is form-associated", () => {
    expect((customElements.get("fd-input") as any).formAssociated).toBe(true);
  });

  it("resets value on formResetCallback", async () => {
    const el = await createInput({ value: "test" });
    expect(el.value).toBe("test");
    el.formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  // --- Focus delegation ---

  it("delegates focus() to the native input", async () => {
    const el = await createInput({ id: "focus-test" });
    const input = getInternal(el);
    const focusSpy = vi.spyOn(input!, "focus");
    el.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("delegates blur() to the native input", async () => {
    const el = await createInput({ id: "blur-test" });
    const input = getInternal(el);
    const blurSpy = vi.spyOn(input!, "blur");
    el.blur();
    expect(blurSpy).toHaveBeenCalled();
  });

  it("delegates select() to the native input", async () => {
    const el = await createInput({ id: "select-test", value: "text" });
    const input = getInternal(el);
    const selectSpy = vi.spyOn(input!, "select");
    el.select();
    expect(selectSpy).toHaveBeenCalled();
  });

  // --- Events ---

  it("dispatches input event on user input", async () => {
    const el = await createInput();
    const input = getInternal(el);
    const handler = vi.fn();
    el.addEventListener("input", handler);

    input!.value = "test";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("dispatches change event", async () => {
    const el = await createInput();
    const input = getInternal(el);
    const handler = vi.fn();
    el.addEventListener("change", handler);

    input!.dispatchEvent(new Event("change", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  // --- Sibling discovery: aria-describedby ---

  it("wires aria-describedby from fd-label description", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "test-desc");
    label.setAttribute("label", "Name");
    label.setAttribute("description", "Enter full legal name");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createInput({ id: "test-desc" });
    // Wait for discovery
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const input = getInternal(el);
    const describedBy = input!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain(label.descriptionId);
  });

  it("wires aria-describedby from fd-message", async () => {
    const el = await createInput({ id: "test-msg" });

    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "test-msg");
    msg.setAttribute("state", "error");
    msg.setAttribute("message", "Required field");
    document.body.appendChild(msg);
    await msg.updateComplete;

    // Wait for sibling observer
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const input = getInternal(el);
    const describedBy = input!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain(msg.messageId);
  });

  it("wires aria-describedby from both fd-label and fd-message", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "test-both");
    label.setAttribute("label", "Account");
    label.setAttribute("description", "Enter account number");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createInput({ id: "test-both" });

    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "test-both");
    msg.setAttribute("state", "error");
    msg.setAttribute("message", "Invalid account");
    document.body.appendChild(msg);
    await msg.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const input = getInternal(el);
    const describedBy = input!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain(label.descriptionId);
    expect(describedBy).toContain(msg.messageId);
  });

  // --- Validation visibility contract ---

  it("does not surface invalid state before a visibility boundary", async () => {
    const el = await createInput({ required: "" });

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);

    const input = getInternal(el);
    expect(input!.getAttribute("aria-invalid")).toBeNull();
  });

  it("does not set aria-invalid when fd-message has state=error alone", async () => {
    const el = await createInput({ id: "test-error" });

    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "test-error");
    msg.setAttribute("state", "error");
    msg.setAttribute("message", "Required");
    document.body.appendChild(msg);
    await msg.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const input = getInternal(el);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(input!.getAttribute("aria-invalid")).toBeNull();
  });

  it("does not set aria-invalid for non-error states", async () => {
    const el = await createInput({ id: "test-no-error" });

    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "test-no-error");
    msg.setAttribute("state", "warning");
    msg.setAttribute("message", "Check value");
    document.body.appendChild(msg);
    await msg.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const input = getInternal(el);
    expect(input!.getAttribute("aria-invalid")).toBeNull();
  });

  it("sets visible invalid state on reportValidity when invalid", async () => {
    const el = await createInput({ required: "" });

    expect(el.reportValidity()).toBe(false);
    await el.updateComplete;

    const input = getInternal(el);
    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(input!.getAttribute("aria-invalid")).toBe("true");
  });

  it("sets visible invalid state on blur after user interaction", async () => {
    const el = await createInput({ required: "" });
    const input = getInternal(el);

    input!.value = "";
    input!.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    input!.dispatchEvent(new FocusEvent("blur"));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(input!.getAttribute("aria-invalid")).toBe("true");
  });

  it("clears aria-invalid in the same update cycle when the control becomes valid", async () => {
    const el = await createInput({ required: "" });
    const input = getInternal(el);

    el.reportValidity();
    await el.updateComplete;
    expect(input!.getAttribute("aria-invalid")).toBe("true");

    input!.value = "typed";
    input!.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(input!.getAttribute("aria-invalid")).toBeNull();
  });

  it("reportValidity on a valid control produces no visible effect", async () => {
    const el = await createInput({ required: "", value: "ready" });

    expect(el.reportValidity()).toBe(true);
    await el.updateComplete;

    const input = getInternal(el);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(input!.getAttribute("aria-invalid")).toBeNull();
  });

  it("form reset clears visible invalid state and aria-invalid", async () => {
    const el = await createInput({ required: "" });

    el.reportValidity();
    await el.updateComplete;
    expect(el.hasAttribute("data-user-invalid")).toBe(true);

    el.formResetCallback();
    await el.updateComplete;

    const input = getInternal(el);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(input!.getAttribute("aria-invalid")).toBeNull();
  });

  it("sets data-state attribute on host from fd-message", async () => {
    const el = await createInput({ id: "test-host-state" });

    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "test-host-state");
    msg.setAttribute("state", "error");
    msg.setAttribute("message", "Error!");
    document.body.appendChild(msg);
    await msg.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(el.getAttribute("data-state")).toBe("error");
  });

  it("includes an error-state color rule for decorative suffix icons", async () => {
    const el = await createInput({ id: "test-error-icon" });

    const icon = document.createElement("fd-icon") as HTMLElement;
    icon.setAttribute("slot", "suffix");
    icon.setAttribute("name", "warning-circle");
    icon.setAttribute("aria-hidden", "true");
    el.appendChild(icon);

    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "test-error-icon");
    msg.setAttribute("state", "error");
    msg.setAttribute("message", "Required");
    document.body.appendChild(msg);
    await msg.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const styles = String((customElements.get("fd-input") as any).styles?.cssText ?? "");

    expect(styles).toContain(
      ':host([data-state="error"]) ::slotted(fd-icon[slot="suffix"])',
    );
    expect(styles).toContain("color: var(--fdic-status-error, #d80e3a);");
  });

  // --- Cardinality warning ---

  it("warns when multiple fd-message siblings target the same input", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = await createInput({ id: "test-multi" });

    const msg1 = document.createElement("fd-message") as any;
    msg1.setAttribute("for", "test-multi");
    msg1.setAttribute("message", "First");
    document.body.appendChild(msg1);

    const msg2 = document.createElement("fd-message") as any;
    msg2.setAttribute("for", "test-multi");
    msg2.setAttribute("message", "Second");
    document.body.appendChild(msg2);

    await msg1.updateComplete;
    await msg2.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Multiple fd-message"),
    );
    warnSpy.mockRestore();
  });

  // --- Character count ---

  it("shows character count when maxlength is set", async () => {
    const el = await createInput({ maxlength: "100" });
    const count = getCharCount(el);
    expect(count).not.toBeNull();
    expect(count!.textContent).toContain("0 / 100");
  });

  it("does not show character count without maxlength", async () => {
    const el = await createInput();
    const count = getCharCount(el);
    expect(count).toBeNull();
  });

  it("updates character count on input", async () => {
    const el = await createInput({ maxlength: "50", value: "hello" });
    const count = getCharCount(el);
    expect(count!.textContent).toContain("5 / 50");
  });

  it("has sr-only live region for character count", async () => {
    const el = await createInput({ maxlength: "100" });
    const sr = getSrLiveRegion(el);
    expect(sr).not.toBeNull();
    expect(sr!.getAttribute("aria-live")).toBe("polite");
    expect(sr!.getAttribute("role")).toBe("status");
  });

  it("character count in aria-describedby", async () => {
    const el = await createInput({ id: "cc-test", maxlength: "100" });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const input = getInternal(el);
    const describedBy = input!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain("fdi-cc-");
  });

  // --- Accessibility ---

  // axe-core cannot follow <label for> → form-associated custom element → shadow DOM <input>,
  // so label and region rules are disabled for these tests. The FACE labeling contract is
  // verified by the sibling discovery tests above.
  const axeOverrides = {
    rules: { label: { enabled: false }, region: { enabled: false } },
  };

  it("has no axe violations (basic)", async () => {
    const label = document.createElement("label");
    label.setAttribute("for", "axe-basic");
    label.textContent = "Name";
    document.body.appendChild(label);

    await createInput({ id: "axe-basic" });
    await expectNoAxeViolations(document.body, axeOverrides);
  });

  it("has no axe violations (with fd-label)", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "axe-labeled");
    label.setAttribute("label", "Name");
    document.body.appendChild(label);
    await label.updateComplete;

    await createInput({ id: "axe-labeled" });
    await expectNoAxeViolations(document.body, axeOverrides);
  });

  it("has no axe violations (disabled)", async () => {
    const label = document.createElement("label");
    label.setAttribute("for", "axe-disabled");
    label.textContent = "Name";
    document.body.appendChild(label);

    await createInput({ id: "axe-disabled", disabled: "" });
    await expectNoAxeViolations(document.body, axeOverrides);
  });

  // --- aria-labelledby forwarding ---

  it("wires aria-labelledby from fd-label to the inner input", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "test-labelled");
    label.setAttribute("label", "Full name");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createInput({ id: "test-labelled" });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const input = getInternal(el);
    const labelledBy = input!.getAttribute("aria-labelledby") || "";
    expect(labelledBy).toBe(label.labelId);
  });

  // --- Form validity sync ---

  it("reports valueMissing when required and empty", async () => {
    const el = await createInput({ required: "" });
    expect(el.checkValidity()).toBe(false);
  });

  it("reports valid when required and has value", async () => {
    const el = await createInput({ required: "", value: "hello" });
    expect(el.checkValidity()).toBe(true);
  });

  it("syncs validity on input", async () => {
    const el = await createInput({ required: "" });
    expect(el.checkValidity()).toBe(false);

    const input = getInternal(el);
    input!.value = "typed";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    expect(el.checkValidity()).toBe(true);
  });

  it("resets validity on formResetCallback", async () => {
    const el = await createInput({ required: "", value: "filled" });
    expect(el.checkValidity()).toBe(true);

    el.formResetCallback();
    await el.updateComplete;

    expect(el.checkValidity()).toBe(false);
  });

  // --- Form-associated getters ---

  it("exposes validity, validationMessage, and willValidate on host", async () => {
    const el = await createInput({ required: "" });
    expect(el.validity).toBeDefined();
    expect(el.validity.valueMissing).toBe(true);
    expect(typeof el.validationMessage).toBe("string");
    expect(el.validationMessage.length).toBeGreaterThan(0);
    expect(typeof el.willValidate).toBe("boolean");
  });

  // --- Cardinality: duplicate labels ---

  it("warns when multiple fd-label siblings target the same input", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = await createInput({ id: "test-multi-label" });

    const label1 = document.createElement("fd-label") as any;
    label1.setAttribute("for", "test-multi-label");
    label1.setAttribute("label", "First");
    document.body.appendChild(label1);

    const label2 = document.createElement("fd-label") as any;
    label2.setAttribute("for", "test-multi-label");
    label2.setAttribute("label", "Second");
    document.body.appendChild(label2);

    await label1.updateComplete;
    await label2.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Multiple fd-label"),
    );
    warnSpy.mockRestore();
  });

  // --- No id ---

  it("handles missing id gracefully (no sibling discovery)", async () => {
    const el = await createInput({});
    // No id = no sibling discovery, should not throw
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const input = getInternal(el);
    expect(input!.getAttribute("aria-labelledby")).toBeNull();
    expect(input!.getAttribute("aria-describedby")).toBeNull();
  });

  // --- maxlength=0 ---

  it("handles maxlength=0 without errors", async () => {
    const el = await createInput({ maxlength: "0" });
    const count = getCharCount(el);
    expect(count).not.toBeNull();
    expect(count!.textContent).toContain("0 / 0");
  });

  // --- Rapid message state changes ---

  it("handles rapid fd-message state changes", async () => {
    const el = await createInput({ id: "test-rapid" });

    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "test-rapid");
    msg.setAttribute("message", "Msg");
    msg.setAttribute("state", "error");
    document.body.appendChild(msg);
    await msg.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(el.getAttribute("data-state")).toBe("error");

    // Rapid change to warning
    msg.setAttribute("state", "warning");
    await msg.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(el.getAttribute("data-state")).toBe("warning");

    // Rapid change to default
    msg.setAttribute("state", "default");
    await msg.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(el.getAttribute("data-state")).toBeNull();
  });

  // --- pattern attribute ---

  it("forwards pattern attribute to native input", async () => {
    const el = await createInput({ pattern: "[0-9]{9}" });
    const input = getInternal(el);
    expect(input!.getAttribute("pattern")).toBe("[0-9]{9}");
  });

  it("reflects patternMismatch into ElementInternals validity", async () => {
    const el = await createInput({ pattern: "[0-9]{3}", value: "abc" });
    // Native input with pattern="[0-9]{3}" and value="abc" → patternMismatch
    expect(el.checkValidity()).toBe(false);
  });

  it("reports valid when value matches pattern", async () => {
    const el = await createInput({ pattern: "[0-9]{3}", value: "123" });
    expect(el.checkValidity()).toBe(true);
  });

  it("exposes patternMismatch via host validity getter", async () => {
    const el = await createInput({ pattern: "[0-9]{3}", value: "abc" });
    expect(el.validity.patternMismatch).toBe(true);
  });

  it("host validity.patternMismatch is false when value matches", async () => {
    const el = await createInput({ pattern: "[0-9]{3}", value: "123" });
    expect(el.validity.patternMismatch).toBe(false);
  });

  it("does not set data-state from patternMismatch alone", async () => {
    const el = await createInput({
      id: "pattern-no-visual",
      pattern: "[0-9]{3}",
      value: "abc",
    });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    // Visual state only comes from fd-message, not native validity
    expect(el.getAttribute("data-state")).toBeNull();
  });

  // --- minlength attribute ---

  it("forwards minlength attribute to native input", async () => {
    const el = await createInput({ minlength: "5" });
    const input = getInternal(el);
    expect(input!.getAttribute("minlength")).toBe("5");
  });

  it("valueMissing takes precedence over tooShort for required empty field", async () => {
    const el = await createInput({ required: "", minlength: "5" });
    // Required + empty → valueMissing, not tooShort
    expect(el.checkValidity()).toBe(false);
  });

  it("exposes validity getter on host (form-associated contract)", async () => {
    const el = await createInput({ minlength: "5", value: "abc" });
    // validity getter should be accessible on the host element
    expect(el.validity).toBeDefined();
    expect(typeof el.validity.tooShort).toBe("boolean");
    expect(typeof el.validity.valid).toBe("boolean");
  });

  it("does not set data-state from tooShort alone", async () => {
    const el = await createInput({
      id: "minlen-no-visual",
      minlength: "10",
      value: "abc",
    });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    // Visual state only comes from fd-message
    expect(el.getAttribute("data-state")).toBeNull();
  });

  // --- fd-label skips auto-wiring for fd-input ---

  it("fd-label does not auto-wire aria-describedby on fd-input host", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "test-no-wire");
    label.setAttribute("label", "Name");
    label.setAttribute("description", "Enter your full legal name");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createInput({ id: "test-no-wire" });
    await new Promise((r) => setTimeout(r, 100));
    await el.updateComplete;

    // fd-label should NOT have set aria-describedby on the fd-input host
    expect(el.getAttribute("aria-describedby")).toBeNull();

    // But fd-input's inner input SHOULD have it via its own assembly
    const input = getInternal(el);
    const describedBy = input!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain(label.descriptionId);
  });

  // --- Part contract ---

  it("[part=base] is the visual container div, not the input", async () => {
    const el = await createInput();
    const base = getBase(el);
    expect(base).not.toBeNull();
    expect(base!.tagName).toBe("DIV");
  });

  it("[part=native] is the actual input element", async () => {
    const el = await createInput();
    const input = getInternal(el);
    expect(input).not.toBeNull();
    expect(input!.tagName).toBe("INPUT");
  });

  it("[part=base] contains [part=native]", async () => {
    const el = await createInput();
    const base = getBase(el);
    const input = getInternal(el);
    expect(base!.contains(input)).toBe(true);
  });

  // --- Prefix/suffix slots ---

  it("renders prefix slot content", async () => {
    const el = document.createElement("fd-input") as any;
    const icon = document.createElement("span");
    icon.setAttribute("slot", "prefix");
    icon.textContent = "P";
    el.appendChild(icon);
    document.body.appendChild(el);
    await el.updateComplete;

    const prefixSlot = el.shadowRoot?.querySelector(
      'slot[name="prefix"]',
    ) as HTMLSlotElement | null;
    expect(prefixSlot).not.toBeNull();
    const assigned = prefixSlot!.assignedElements();
    expect(assigned.length).toBe(1);
    expect(assigned[0]).toBe(icon);
  });

  it("renders suffix slot content", async () => {
    const el = document.createElement("fd-input") as any;
    const btn = document.createElement("button");
    btn.setAttribute("slot", "suffix");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", "Clear");
    el.appendChild(btn);
    document.body.appendChild(el);
    await el.updateComplete;

    const suffixSlot = el.shadowRoot?.querySelector(
      'slot[name="suffix"]',
    ) as HTMLSlotElement | null;
    expect(suffixSlot).not.toBeNull();
    const assigned = suffixSlot!.assignedElements();
    expect(assigned.length).toBe(1);
    expect(assigned[0]).toBe(btn);
  });

  it("focus delegation works with prefix/suffix populated", async () => {
    const el = document.createElement("fd-input") as any;
    const icon = document.createElement("span");
    icon.setAttribute("slot", "prefix");
    el.appendChild(icon);
    const btn = document.createElement("button");
    btn.setAttribute("slot", "suffix");
    btn.setAttribute("type", "button");
    el.appendChild(btn);
    document.body.appendChild(el);
    await el.updateComplete;

    const input = getInternal(el);
    const focusSpy = vi.spyOn(input!, "focus");
    el.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("reacts to dynamically added suffix content", async () => {
    const el = await createInput();
    const base = getBase(el);

    // No suffix initially
    expect(base!.classList.contains("fd-input__has-suffix")).toBe(false);

    // Add suffix dynamically
    const btn = document.createElement("button");
    btn.setAttribute("slot", "suffix");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", "Clear");
    el.appendChild(btn);

    // Wait for slotchange + reactive update
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(base!.classList.contains("fd-input__has-suffix")).toBe(true);

    // Remove suffix
    btn.remove();
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(base!.classList.contains("fd-input__has-suffix")).toBe(false);
  });

  it("reacts to dynamically added prefix content", async () => {
    const el = await createInput();
    const base = getBase(el);

    expect(base!.classList.contains("fd-input__has-prefix")).toBe(false);

    const icon = document.createElement("span");
    icon.setAttribute("slot", "prefix");
    el.appendChild(icon);

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(base!.classList.contains("fd-input__has-prefix")).toBe(true);
  });

  it("applies both prefix and suffix classes with error state", async () => {
    // Create and connect the input first
    const el = await createInput({ id: "combo-test" });

    // Add slot content after connection (triggers slotchange)
    const icon = document.createElement("span");
    icon.setAttribute("slot", "prefix");
    el.appendChild(icon);

    const btn = document.createElement("button");
    btn.setAttribute("slot", "suffix");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", "Clear");
    el.appendChild(btn);

    // Wait for slotchange + reactive update
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    // Add error state via fd-message
    const msg = document.createElement("fd-message") as any;
    msg.setAttribute("for", "combo-test");
    msg.setAttribute("state", "error");
    msg.setAttribute("message", "Error!");
    document.body.appendChild(msg);
    await msg.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const base = getBase(el);
    expect(base!.classList.contains("fd-input__has-prefix")).toBe(true);
    expect(base!.classList.contains("fd-input__has-suffix")).toBe(true);
    expect(el.getAttribute("data-state")).toBe("error");
  });

  it("slots are inside [part=base] container", async () => {
    const el = await createInput();
    const base = getBase(el);
    const prefixSlot = base?.querySelector('slot[name="prefix"]');
    const suffixSlot = base?.querySelector('slot[name="suffix"]');
    expect(prefixSlot).not.toBeNull();
    expect(suffixSlot).not.toBeNull();
  });

  it("has no axe violations with prefix icon", async () => {
    const label = document.createElement("label");
    label.setAttribute("for", "axe-prefix");
    label.textContent = "Search";
    document.body.appendChild(label);

    const el = document.createElement("fd-input") as any;
    el.setAttribute("id", "axe-prefix");
    const icon = document.createElement("span");
    icon.setAttribute("slot", "prefix");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "🔍";
    el.appendChild(icon);
    document.body.appendChild(el);
    await el.updateComplete;

    await expectNoAxeViolations(document.body, axeOverrides);
  });

  it("has no axe violations with suffix action button", async () => {
    const label = document.createElement("label");
    label.setAttribute("for", "axe-suffix");
    label.textContent = "Search";
    document.body.appendChild(label);

    const el = document.createElement("fd-input") as any;
    el.setAttribute("id", "axe-suffix");
    const btn = document.createElement("button");
    btn.setAttribute("slot", "suffix");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", "Clear search");
    btn.textContent = "×";
    el.appendChild(btn);
    document.body.appendChild(el);
    await el.updateComplete;

    await expectNoAxeViolations(document.body, axeOverrides);
  });
});
