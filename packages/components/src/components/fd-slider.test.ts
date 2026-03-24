import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-slider.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createSlider(attrs: Record<string, string | boolean> = {}) {
  const el = document.createElement("fd-slider") as any;
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === "boolean") {
      if (value) {
        el.setAttribute(key, "");
      }
      continue;
    }

    el.setAttribute(key, value);
  }

  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getRange(el: any): HTMLInputElement | null {
  return el.shadowRoot?.querySelector("[part=range]") ?? null;
}

function getNumberInput(el: any): HTMLInputElement | null {
  return el.shadowRoot?.querySelector("[part=input]") ?? null;
}

function getBubble(el: any): HTMLOutputElement | null {
  return el.shadowRoot?.querySelector("[part=value-bubble]") ?? null;
}

describe("fd-slider", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-slider")).toBeDefined();
  });

  it("is form-associated", () => {
    expect((customElements.get("fd-slider") as any).formAssociated).toBe(true);
  });

  it("renders a native range input", async () => {
    const el = await createSlider({ label: "Field name" });
    expect(getRange(el)?.tagName).toBe("INPUT");
    expect(getRange(el)?.type).toBe("range");
  });

  it("defaults to the midpoint when no value is supplied", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
    });

    expect(el.value).toBe(13);
    expect(getRange(el)?.value).toBe("13");
  });

  it("respects an explicit value", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      value: "10",
    });

    expect(el.value).toBe(10);
    expect(getRange(el)?.value).toBe("10");
  });

  it("does not render the inline number input by default", async () => {
    const el = await createSlider({ label: "Field name" });
    expect(getNumberInput(el)).toBeNull();
  });

  it("renders the inline number input when show-input is set", async () => {
    const el = await createSlider({
      label: "Field name",
      "show-input": true,
      value: "25",
    });

    expect(getNumberInput(el)?.type).toBe("number");
    expect(getNumberInput(el)?.value).toBe("25");
  });

  it("assembles the grouped accessibility contract when show-input is enabled", async () => {
    const el = await createSlider({
      label: "Field name",
      hint: "Choose a value between 0 and 25.",
      "show-input": true,
    });

    const range = getRange(el)!;
    const input = getNumberInput(el)!;
    const group = el.shadowRoot?.querySelector('[part="control"]') as HTMLElement;

    expect(group.getAttribute("role")).toBe("group");
    expect(group.getAttribute("aria-labelledby")).toContain("fd-slider-label-");
    expect(group.getAttribute("aria-describedby")).toContain("fd-slider-hint-");
    expect(range.getAttribute("aria-labelledby")).toContain("fd-slider-label-");
    expect(range.getAttribute("aria-describedby")).toContain("fd-slider-hint-");
    expect(input.getAttribute("aria-label")).toBe("Field name value");
    expect(input.getAttribute("aria-describedby")).toContain("fd-slider-hint-");
  });

  it("submits the current value through FACE", async () => {
    const el = await createSlider({
      label: "Field name",
      name: "term",
      value: "15",
    });

    const controller = (el as any)._formController;
    expect(controller.internals.getFormValue()).toBe("15");
  });

  it("clears the submitted value when name is missing", async () => {
    const el = await createSlider({
      label: "Field name",
      value: "15",
    });

    const controller = (el as any)._formController;
    expect(controller.internals.getFormValue()).toBeNull();
  });

  it("delegates focus() to the internal range input", async () => {
    const el = await createSlider({ label: "Field name" });
    const range = getRange(el)!;
    const focusSpy = vi.spyOn(range, "focus");

    el.focus();

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it("supports stepUp() and stepDown()", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      step: "5",
      value: "10",
    });

    el.stepUp();
    await el.updateComplete;
    expect(el.value).toBe(15);

    el.stepDown(2);
    await el.updateComplete;
    expect(el.value).toBe(5);
  });

  it("re-emits input and change from the range input", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      value: "10",
    });
    const range = getRange(el)!;
    const onInput = vi.fn();
    const onChange = vi.fn();

    el.addEventListener("input", onInput);
    el.addEventListener("change", onChange);

    range.value = "15";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    range.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    expect(el.value).toBe(15);
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("shows the value bubble on hover and focus", async () => {
    const el = await createSlider({
      label: "Field name",
      value: "25",
    });
    const range = getRange(el)!;

    expect(getBubble(el)?.hidden).toBe(true);

    range.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    await el.updateComplete;
    expect(getBubble(el)?.hidden).toBe(false);

    range.dispatchEvent(new FocusEvent("focus"));
    await el.updateComplete;
    expect(getBubble(el)?.hidden).toBe(false);

    range.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    range.dispatchEvent(new FocusEvent("blur"));
    await el.updateComplete;
    expect(getBubble(el)?.hidden).toBe(true);
  });

  it("keeps the bubble hidden when disabled", async () => {
    const el = await createSlider({
      label: "Field name",
      disabled: true,
      value: "25",
    });
    const range = getRange(el)!;

    range.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    range.dispatchEvent(new FocusEvent("focus"));
    await el.updateComplete;

    expect(getBubble(el)?.hidden).toBe(true);
  });

  it("syncs the inline input when a valid step-aligned integer is typed", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      step: "5",
      value: "10",
      "show-input": true,
    });
    const input = getNumberInput(el)!;
    const onInput = vi.fn();
    el.addEventListener("input", onInput);

    input.value = "15";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    expect(el.value).toBe(15);
    expect(getRange(el)?.value).toBe("15");
    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it("does not change the committed value for temporary invalid helper-input text", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      step: "5",
      value: "10",
      "show-input": true,
    });
    const input = getNumberInput(el)!;

    input.value = "12";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    expect(el.value).toBe(10);
    expect(input.value).toBe("12");
  });

  it("clamps the helper input to the nearest valid value on blur", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      step: "5",
      value: "10",
      "show-input": true,
    });
    const input = getNumberInput(el)!;
    const onInput = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("input", onInput);
    el.addEventListener("change", onChange);

    input.value = "26";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new FocusEvent("blur"));
    await el.updateComplete;

    expect(el.value).toBe(25);
    expect(input.value).toBe("25");
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("restores the last committed value on Escape in the helper input", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      step: "5",
      value: "10",
      "show-input": true,
    });
    const input = getNumberInput(el)!;

    input.value = "17";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.value).toBe(10);
    expect(input.value).toBe("10");
  });

  it("resets to the initial committed value", async () => {
    const el = await createSlider({
      label: "Field name",
      min: "0",
      max: "25",
      value: "5",
      "show-input": true,
    });
    const range = getRange(el)!;

    range.value = "15";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe(15);

    el.formResetCallback();
    await el.updateComplete;

    expect(el.value).toBe(5);
    expect(getNumberInput(el)?.value).toBe("5");
  });

  it("normalizes invalid authored constraints and warns once per issue", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = await createSlider({
      label: "Field name",
      min: "20.4",
      max: "10.2",
      step: "0.2",
      value: "11.6",
    });
    const range = getRange(el)!;

    expect(range.min).toBe("10");
    expect(range.max).toBe("20");
    expect(range.step).toBe("1");
    expect(el.value).toBe(12);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("is always valid in v1", async () => {
    const el = await createSlider({ label: "Field name" });
    expect(el.checkValidity()).toBe(true);
    expect(el.reportValidity()).toBe(true);
  });

  it("has no axe violations in the representative show-input state", async () => {
    const el = await createSlider({
      label: "Field name",
      hint: "Choose a value between 0 and 25.",
      min: "0",
      max: "25",
      value: "10",
      "show-input": true,
    });

    await expectNoAxeViolations(el, {
      rules: {
        region: { enabled: false },
      },
    });
  });
});
