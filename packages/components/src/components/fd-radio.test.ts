import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-radio.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createRadio(
  attrs: Record<string, string> = {},
  innerHTML = "Option",
) {
  const el = document.createElement("fd-radio") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: any): HTMLInputElement {
  return el.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
}

describe("fd-radio", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-radio")).toBeDefined();
  });

  it("renders a real radio input in shadow DOM", async () => {
    const el = await createRadio();
    const input = getInternal(el);

    expect(input).not.toBeNull();
    expect(input.type).toBe("radio");
    expect(input.closest("label")).not.toBeNull();
  });

  it("hydrates host properties to the internal input", async () => {
    const el = await createRadio({
      checked: "",
      disabled: "",
      required: "",
      name: "contact",
      value: "email",
    });
    const input = getInternal(el);

    expect(input.checked).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(input.name).toBe("contact");
    expect(input.value).toBe("email");
  });

  it("omits aria-describedby when the description slot is empty", async () => {
    const el = await createRadio();
    expect(getInternal(el).hasAttribute("aria-describedby")).toBe(false);
  });

  it("wires aria-describedby when the description slot has content", async () => {
    const el = await createRadio(
      {},
      'Email<span slot="description">We will only use this for account notices.</span>',
    );

    expect(getInternal(el).getAttribute("aria-describedby")).toBe("description");
  });

  it("re-dispatches composed input and change events for user interaction", async () => {
    const el = await createRadio();
    const inputSpy = vi.fn();
    const changeSpy = vi.fn();
    el.addEventListener("input", inputSpy);
    el.addEventListener("change", changeSpy);

    getInternal(el).click();

    expect(el.checked).toBe(true);
    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  it("does not fire input or change for programmatic checked updates", async () => {
    const el = await createRadio();
    const inputSpy = vi.fn();
    const changeSpy = vi.fn();
    el.addEventListener("input", inputSpy);
    el.addEventListener("change", changeSpy);

    el.checked = true;
    await el.updateComplete;

    expect(inputSpy).not.toHaveBeenCalled();
    expect(changeSpy).not.toHaveBeenCalled();
  });

  it("reveals invalid state on an invalid event from a submit attempt", async () => {
    const el = await createRadio({ required: "", name: "contact" }, "Email");

    expect(el.checkValidity()).toBe(false);
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getInternal(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("delegates blur handling to the shared validation boundary", async () => {
    const el = await createRadio(
      { checked: "", required: "", name: "contact" },
      "Email",
    );
    const controller = (el as any)._formController;
    const revealSpy = vi.spyOn(controller, "revealIfInteractedAndInvalid");

    (el as any)._onBlur();

    expect(revealSpy).toHaveBeenCalledTimes(1);
  });

  it("clears aria-invalid when the radio becomes valid", async () => {
    const el = await createRadio({ required: "", name: "contact" }, "Email");
    const input = getInternal(el);

    el.reportValidity();
    await el.updateComplete;
    expect(input.getAttribute("aria-invalid")).toBe("true");

    input.click();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("unchecks sibling radios in the same named group", async () => {
    const first = await createRadio({
      name: "contact",
      value: "email",
      checked: "",
    }, "Email");
    const second = await createRadio({
      name: "contact",
      value: "phone",
    }, "Phone");

    getInternal(second).click();
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checked).toBe(false);
    expect(second.checked).toBe(true);
  });

  it("supports arrow-key movement within the same named group", async () => {
    const first = await createRadio({
      name: "contact",
      value: "email",
      checked: "",
    }, "Email");
    const second = await createRadio({
      name: "contact",
      value: "phone",
    }, "Phone");

    getInternal(first).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checked).toBe(false);
    expect(second.checked).toBe(true);
  });

  it("re-dispatches input and change events on arrow-key navigation", async () => {
    const first = await createRadio({
      name: "contact",
      value: "email",
      checked: "",
    }, "Email");
    const second = await createRadio({
      name: "contact",
      value: "phone",
    }, "Phone");
    const inputSpy = vi.fn();
    const changeSpy = vi.fn();
    second.addEventListener("input", inputSpy);
    second.addEventListener("change", changeSpy);

    getInternal(first).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await first.updateComplete;
    await second.updateComplete;

    expect(second.checked).toBe(true);
    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledTimes(1);
  });

  it("wraps arrow-key movement from the last radio to the first", async () => {
    const first = await createRadio({
      name: "contact",
      value: "email",
    }, "Email");
    const second = await createRadio({
      name: "contact",
      value: "phone",
      checked: "",
    }, "Phone");

    getInternal(second).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checked).toBe(true);
    expect(second.checked).toBe(false);
  });

  it("skips disabled radios during arrow-key navigation", async () => {
    const first = await createRadio({
      name: "contact",
      value: "email",
      checked: "",
    }, "Email");
    const second = await createRadio({
      name: "contact",
      value: "phone",
      disabled: "",
    }, "Phone");
    const third = await createRadio({
      name: "contact",
      value: "mail",
    }, "Mail");

    getInternal(first).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await first.updateComplete;
    await second.updateComplete;
    await third.updateComplete;

    expect(first.checked).toBe(false);
    expect(second.checked).toBe(false);
    expect(third.checked).toBe(true);
  });

  it("treats unnamed radios as isolated controls", async () => {
    const first = await createRadio({ checked: "" }, "Email");
    const second = await createRadio({}, "Phone");

    getInternal(second).click();
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checked).toBe(true);
    expect(second.checked).toBe(true);
  });

  it("keeps same-named radios in different forms independent", async () => {
    document.body.innerHTML = `
      <form id="one">
        <fd-radio name="contact" value="email" checked>Email</fd-radio>
      </form>
      <form id="two">
        <fd-radio name="contact" value="phone">Phone</fd-radio>
      </form>
    `;

    const first = document.querySelector("#one fd-radio") as any;
    const second = document.querySelector("#two fd-radio") as any;
    await first.updateComplete;
    await second.updateComplete;

    getInternal(second).click();
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checked).toBe(true);
    expect(second.checked).toBe(true);
  });

  it("participates in required validation", async () => {
    const el = await createRadio({ required: "", name: "contact" });

    expect(el.checkValidity()).toBe(false);
    expect(el.validationMessage).toBe("Please select an option.");
  });

  it("clears required validity when another radio in the group is checked", async () => {
    const first = await createRadio({
      required: "",
      name: "contact",
      value: "email",
    }, "Email");
    const second = await createRadio({
      name: "contact",
      value: "phone",
    }, "Phone");

    getInternal(second).click();
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checkValidity()).toBe(true);
    expect(second.checkValidity()).toBe(true);
  });

  it("marks itself user-invalid on invalid report", async () => {
    const el = await createRadio({ required: "", name: "contact" });

    expect(el.reportValidity()).toBe(false);
    await el.updateComplete;
    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getInternal(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("does not surface invalid state before a visibility boundary", async () => {
    const el = await createRadio({ required: "", name: "contact" });

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getInternal(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("reportValidity on a valid radio has no visible effect", async () => {
    const el = await createRadio({
      required: "",
      name: "contact",
      checked: "",
      value: "email",
    }, "Email");

    expect(el.reportValidity()).toBe(true);
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getInternal(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("restores default checked state and clears validation state on reset", async () => {
    const el = await createRadio({ checked: "", required: "", name: "contact" });
    el.checked = false;
    el.setAttribute("data-user-invalid", "");
    await el.updateComplete;

    el.formResetCallback();
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getInternal(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("restores the default checked radio in a group on reset", async () => {
    const first = await createRadio({
      name: "contact",
      value: "email",
      checked: "",
    }, "Email");
    const second = await createRadio({
      name: "contact",
      value: "phone",
    }, "Phone");

    getInternal(second).click();
    await first.updateComplete;
    await second.updateComplete;

    first.formResetCallback();
    second.formResetCallback();
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checked).toBe(true);
    expect(second.checked).toBe(false);
  });

  it("forwards host focus to the internal input", async () => {
    const el = await createRadio();
    const input = getInternal(el);

    el.focus();

    expect(el.shadowRoot?.activeElement).toBe(input);
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createRadio(
      { name: "contact" },
      'Email<span slot="description">We will only use this for account notices.</span>',
    );

    await expectNoAxeViolations(el);
  });
});
