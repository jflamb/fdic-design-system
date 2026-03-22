import { beforeEach, describe, expect, it, vi } from "vitest";
import "./fd-checkbox.js";
import "./fd-icon.js";
import "../icons/phosphor-regular.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createCheckbox(
  attrs: Record<string, string> = {},
  innerHTML = "Option",
) {
  const el = document.createElement("fd-checkbox") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInput(el: any): HTMLInputElement {
  return el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;
}

describe("fd-checkbox", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-checkbox")).toBeDefined();
  });

  it("renders a real checkbox input in shadow DOM", async () => {
    const el = await createCheckbox();
    const input = getInput(el);

    expect(input).not.toBeNull();
    expect(input.type).toBe("checkbox");
    expect(input.closest("label")).not.toBeNull();
  });

  it("hydrates host properties to the internal input", async () => {
    const el = await createCheckbox({
      checked: "",
      disabled: "",
      required: "",
      name: "terms",
      value: "agree",
    });
    const input = getInput(el);

    expect(input.checked).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(input.name).toBe("terms");
    expect(input.value).toBe("agree");
  });

  it("omits aria-describedby when the description slot is empty", async () => {
    const el = await createCheckbox();
    expect(getInput(el).hasAttribute("aria-describedby")).toBe(false);
  });

  it("wires aria-describedby when the description slot has content", async () => {
    const el = await createCheckbox(
      {},
      'Option<span slot="description">Additional help text</span>',
    );

    expect(getInput(el).getAttribute("aria-describedby")).toBe("description");
  });

  it("re-dispatches composed input and change events for user interaction", async () => {
    const el = await createCheckbox();
    const inputSpy = vi.fn();
    const changeSpy = vi.fn();
    el.addEventListener("input", inputSpy);
    el.addEventListener("change", changeSpy);

    getInput(el).click();

    expect(el.checked).toBe(true);
    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  it("does not fire input or change for programmatic checked updates", async () => {
    const el = await createCheckbox();
    const inputSpy = vi.fn();
    const changeSpy = vi.fn();
    el.addEventListener("input", inputSpy);
    el.addEventListener("change", changeSpy);

    el.checked = true;
    await el.updateComplete;

    expect(inputSpy).not.toHaveBeenCalled();
    expect(changeSpy).not.toHaveBeenCalled();
  });

  it("clears indeterminate on user interaction", async () => {
    const el = await createCheckbox({ indeterminate: "" });

    getInput(el).click();

    expect(el.indeterminate).toBe(false);
    expect(getInput(el).indeterminate).toBe(false);
  });

  it("participates in required validation", async () => {
    const el = await createCheckbox({ required: "" });

    expect(el.checkValidity()).toBe(false);
    expect(el.validationMessage).toBe("This checkbox is required.");
  });

  it("marks itself user-invalid on invalid report", async () => {
    const el = await createCheckbox({ required: "" });

    expect(el.reportValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(true);
  });

  it("restores default checked state and clears validation state on reset", async () => {
    const el = await createCheckbox({ checked: "", required: "" });
    el.checked = false;
    el.indeterminate = true;
    el.setAttribute("data-user-invalid", "");
    await el.updateComplete;

    el.formResetCallback();
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(el.indeterminate).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
  });

  it("forwards host focus to the internal input", async () => {
    const el = await createCheckbox();
    const input = getInput(el);

    el.focus();

    expect(el.shadowRoot?.activeElement).toBe(input);
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createCheckbox(
      {},
      'Allow email updates<span slot="description">You can unsubscribe later.</span>',
    );

    await expectNoAxeViolations(el);
  });
});
