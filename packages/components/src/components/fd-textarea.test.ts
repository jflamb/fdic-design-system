import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-textarea.js";
import "../register/fd-label.js";
import "../register/fd-message.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createTextarea(attrs: Record<string, string> = {}) {
  const el = document.createElement("fd-textarea") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: any): HTMLTextAreaElement | null {
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

describe("fd-textarea", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-textarea")).toBeDefined();
  });

  it("renders a native textarea element in shadow DOM", async () => {
    const el = await createTextarea();
    const textarea = getInternal(el);
    expect(textarea).not.toBeNull();
    expect(textarea!.tagName).toBe("TEXTAREA");
  });

  it("defaults rows to 5", async () => {
    const el = await createTextarea();
    const textarea = getInternal(el);
    expect(textarea!.getAttribute("rows")).toBe("5");
  });

  it("forwards rows attribute", async () => {
    const el = await createTextarea({ rows: "8" });
    const textarea = getInternal(el);
    expect(textarea!.getAttribute("rows")).toBe("8");
  });

  it("forwards placeholder attribute", async () => {
    const el = await createTextarea({ placeholder: "Describe your concern" });
    const textarea = getInternal(el);
    expect(textarea!.placeholder).toBe("Describe your concern");
  });

  it("forwards disabled attribute", async () => {
    const el = await createTextarea({ disabled: "" });
    const textarea = getInternal(el);
    expect(textarea!.disabled).toBe(true);
  });

  it("forwards readonly attribute", async () => {
    const el = await createTextarea({ readonly: "" });
    const textarea = getInternal(el);
    expect(textarea!.readOnly).toBe(true);
  });

  it("forwards required attribute", async () => {
    const el = await createTextarea({ required: "" });
    const textarea = getInternal(el);
    expect(textarea!.required).toBe(true);
    expect(textarea!.getAttribute("aria-required")).toBe("true");
  });

  it("forwards maxlength and minlength attributes", async () => {
    const el = await createTextarea({ maxlength: "250", minlength: "10" });
    const textarea = getInternal(el);
    expect(textarea!.maxLength).toBe(250);
    expect(textarea!.minLength).toBe(10);
  });

  it("forwards autocomplete attribute", async () => {
    const el = await createTextarea({ autocomplete: "street-address" });
    const textarea = getInternal(el);
    expect(textarea!.getAttribute("autocomplete")).toBe("street-address");
  });

  it("reflects value property", async () => {
    const el = await createTextarea({ value: "Line one\nLine two" });
    const textarea = getInternal(el);
    expect(el.value).toBe("Line one\nLine two");
    expect(textarea!.value).toBe("Line one\nLine two");
  });

  it("is form-associated", () => {
    expect((customElements.get("fd-textarea") as any).formAssociated).toBe(
      true,
    );
  });

  it("resets value on formResetCallback", async () => {
    const el = await createTextarea({ value: "Reset me" });
    el.formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("delegates focus() to the native textarea", async () => {
    const el = await createTextarea();
    const textarea = getInternal(el);
    const focusSpy = vi.spyOn(textarea!, "focus");
    el.focus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("delegates blur() to the native textarea", async () => {
    const el = await createTextarea();
    const textarea = getInternal(el);
    const blurSpy = vi.spyOn(textarea!, "blur");
    el.blur();
    expect(blurSpy).toHaveBeenCalled();
  });

  it("dispatches input and change events", async () => {
    const el = await createTextarea();
    const textarea = getInternal(el);
    const inputHandler = vi.fn();
    const changeHandler = vi.fn();
    el.addEventListener("input", inputHandler);
    el.addEventListener("change", changeHandler);

    textarea!.value = "Typed";
    textarea!.dispatchEvent(new Event("input", { bubbles: true }));
    textarea!.dispatchEvent(new Event("change", { bubbles: true }));

    expect(inputHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler).toHaveBeenCalledTimes(1);
  });

  it("wires aria-describedby from fd-label description", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "textarea-desc");
    label.setAttribute("label", "Case details");
    label.setAttribute("description", "Include dates and reference numbers");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createTextarea({ id: "textarea-desc" });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const textarea = getInternal(el);
    const describedBy = textarea!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain(label.descriptionId);
  });

  it("wires aria-describedby from fd-message", async () => {
    const el = await createTextarea({ id: "textarea-msg" });

    const message = document.createElement("fd-message") as any;
    message.setAttribute("for", "textarea-msg");
    message.setAttribute("state", "error");
    message.setAttribute("message", "Enter more detail");
    document.body.appendChild(message);
    await message.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const textarea = getInternal(el);
    const describedBy = textarea!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain(message.messageId);
  });

  it("wires aria-describedby from both fd-label and fd-message", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "textarea-both");
    label.setAttribute("label", "Additional comments");
    label.setAttribute("description", "Tell us anything else we should know");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createTextarea({ id: "textarea-both" });

    const message = document.createElement("fd-message") as any;
    message.setAttribute("for", "textarea-both");
    message.setAttribute("state", "error");
    message.setAttribute("message", "Provide at least 10 characters");
    document.body.appendChild(message);
    await message.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    const textarea = getInternal(el);
    const describedBy = textarea!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain(label.descriptionId);
    expect(describedBy).toContain(message.messageId);
  });

  it("does not surface invalid state before a visibility boundary", async () => {
    const el = await createTextarea({ required: "" });
    const textarea = getInternal(el);

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(textarea!.getAttribute("aria-invalid")).toBeNull();
  });

  it("sets visible invalid state on reportValidity when invalid", async () => {
    const el = await createTextarea({ required: "" });
    const textarea = getInternal(el);

    expect(el.reportValidity()).toBe(false);
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(textarea!.getAttribute("aria-invalid")).toBe("true");
  });

  it("reveals invalid state on an invalid event from a submit attempt", async () => {
    const el = await createTextarea({ required: "" });
    const textarea = getInternal(el);

    el.checkValidity();
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(textarea!.getAttribute("aria-invalid")).toBe("true");
  });

  it("sets visible invalid state on blur after user interaction", async () => {
    const el = await createTextarea({ required: "" });
    const textarea = getInternal(el);

    textarea!.value = "";
    textarea!.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    textarea!.dispatchEvent(new FocusEvent("blur"));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(textarea!.getAttribute("aria-invalid")).toBe("true");
  });

  it("clears aria-invalid in the same update cycle when the control becomes valid", async () => {
    const el = await createTextarea({ required: "" });
    const textarea = getInternal(el);

    el.reportValidity();
    await el.updateComplete;
    expect(textarea!.getAttribute("aria-invalid")).toBe("true");

    textarea!.value = "More than empty";
    textarea!.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(textarea!.getAttribute("aria-invalid")).toBeNull();
  });

  it("form reset clears visible invalid state and aria-invalid", async () => {
    const el = await createTextarea({ required: "" });
    const textarea = getInternal(el);

    el.reportValidity();
    await el.updateComplete;
    expect(el.hasAttribute("data-user-invalid")).toBe(true);

    el.formResetCallback();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(textarea!.getAttribute("aria-invalid")).toBeNull();
  });

  it("sets data-state attribute on host from fd-message", async () => {
    const el = await createTextarea({ id: "textarea-state" });

    const message = document.createElement("fd-message") as any;
    message.setAttribute("for", "textarea-state");
    message.setAttribute("state", "warning");
    message.setAttribute("message", "Review this response");
    document.body.appendChild(message);
    await message.updateComplete;

    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(el.getAttribute("data-state")).toBe("warning");
  });

  it("warns when multiple fd-message siblings target the same textarea", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = await createTextarea({ id: "textarea-multi-message" });

    const first = document.createElement("fd-message") as any;
    first.setAttribute("for", "textarea-multi-message");
    first.setAttribute("message", "First");
    document.body.appendChild(first);

    const second = document.createElement("fd-message") as any;
    second.setAttribute("for", "textarea-multi-message");
    second.setAttribute("message", "Second");
    document.body.appendChild(second);

    await first.updateComplete;
    await second.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Multiple fd-message"),
    );
    warnSpy.mockRestore();
  });

  it("warns when multiple fd-label siblings target the same textarea", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = await createTextarea({ id: "textarea-multi-label" });

    const first = document.createElement("fd-label") as any;
    first.setAttribute("for", "textarea-multi-label");
    first.setAttribute("label", "First");
    document.body.appendChild(first);

    const second = document.createElement("fd-label") as any;
    second.setAttribute("for", "textarea-multi-label");
    second.setAttribute("label", "Second");
    document.body.appendChild(second);

    await first.updateComplete;
    await second.updateComplete;
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Multiple fd-label"),
    );
    warnSpy.mockRestore();
  });

  it("shows character count when maxlength is set", async () => {
    const el = await createTextarea({ maxlength: "100" });
    const count = getCharCount(el);
    expect(count).not.toBeNull();
    expect(count!.textContent).toContain("0 / 100");
  });

  it("updates character count on input", async () => {
    const el = await createTextarea({
      maxlength: "50",
      value: "hello world",
    });
    const count = getCharCount(el);
    expect(count!.textContent).toContain("11 / 50");
  });

  it("has sr-only live region for character count", async () => {
    const el = await createTextarea({ maxlength: "100" });
    const sr = getSrLiveRegion(el);
    expect(sr).not.toBeNull();
    expect(sr!.getAttribute("aria-live")).toBe("polite");
    expect(sr!.getAttribute("role")).toBe("status");
  });

  it("includes character count in aria-describedby", async () => {
    const el = await createTextarea({ id: "textarea-cc", maxlength: "100" });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const textarea = getInternal(el);
    const describedBy = textarea!.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain("fdt-cc-");
  });

  it("includes a vertical resize rule in the component styles", () => {
    const styles = String(
      (customElements.get("fd-textarea") as any).styles?.cssText ?? "",
    );
    expect(styles).toContain("resize: vertical;");
  });

  const axeOverrides = {
    rules: { label: { enabled: false }, region: { enabled: false } },
  };

  it("has no axe violations (basic)", async () => {
    const label = document.createElement("label");
    label.setAttribute("for", "textarea-axe-basic");
    label.textContent = "Case details";
    document.body.appendChild(label);

    await createTextarea({ id: "textarea-axe-basic" });
    await expectNoAxeViolations(document.body, axeOverrides);
  });

  it("has no axe violations (with fd-label)", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "textarea-axe-label");
    label.setAttribute("label", "Case details");
    document.body.appendChild(label);
    await label.updateComplete;

    await createTextarea({ id: "textarea-axe-label" });
    await expectNoAxeViolations(document.body, axeOverrides);
  });

  it("mirrors sibling fd-label text into aria-label on the inner textarea", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "textarea-label");
    label.setAttribute("label", "Additional comments");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createTextarea({ id: "textarea-label" });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const textarea = getInternal(el);
    expect(textarea!.getAttribute("aria-label")).toBe("Additional comments");
    expect(textarea!.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("prefers an authored aria-label on the host over sibling label text", async () => {
    const label = document.createElement("fd-label") as any;
    label.setAttribute("for", "textarea-authored-label");
    label.setAttribute("label", "Comments");
    document.body.appendChild(label);
    await label.updateComplete;

    const el = await createTextarea({
      id: "textarea-authored-label",
      "aria-label": "Case reviewer comments",
    });
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const textarea = getInternal(el);
    expect(textarea!.getAttribute("aria-label")).toBe("Case reviewer comments");
  });

  it("reports valueMissing when required and empty", async () => {
    const el = await createTextarea({ required: "" });
    expect(el.checkValidity()).toBe(false);
  });

  it("reports valid when required and has value", async () => {
    const el = await createTextarea({ required: "", value: "Ready" });
    expect(el.checkValidity()).toBe(true);
  });

  it("exposes validity, validationMessage, and willValidate on host", async () => {
    const el = await createTextarea({ required: "" });
    expect(el.validity.valueMissing).toBe(true);
    expect(typeof el.validationMessage).toBe("string");
    expect(typeof el.willValidate).toBe("boolean");
  });

  it("handles missing id gracefully", async () => {
    const el = await createTextarea();
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const textarea = getInternal(el);
    expect(textarea!.getAttribute("aria-describedby")).toBeNull();
  });

  it("handles maxlength=0 without errors", async () => {
    const el = await createTextarea({ maxlength: "0" });
    const count = getCharCount(el);
    expect(count).not.toBeNull();
    expect(count!.textContent).toContain("0 / 0");
  });

  it("forwards minlength attribute and reflects tooShort validity", async () => {
    const el = await createTextarea({ minlength: "10", value: "short" });
    const textarea = getInternal(el);
    expect(textarea!.getAttribute("minlength")).toBe("10");
    expect(el.checkValidity()).toBe(false);
    expect(typeof el.validity.tooShort).toBe("boolean");
  });

  it("[part=base] is the visual container div and [part=native] is the textarea", async () => {
    const el = await createTextarea();
    const base = getBase(el);
    const textarea = getInternal(el);
    expect(base!.tagName).toBe("DIV");
    expect(textarea!.tagName).toBe("TEXTAREA");
    expect(base!.contains(textarea)).toBe(true);
  });
});
