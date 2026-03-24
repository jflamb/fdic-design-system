import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-radio-group.js";
import "../register/fd-radio.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createRadioGroup(
  attrs: Record<string, string> = {},
  innerHTML = `
    <span slot="legend">Preferred contact method</span>
    <fd-radio name="contact" value="email">Email</fd-radio>
    <fd-radio name="contact" value="phone">Phone</fd-radio>
  `,
) {
  const el = document.createElement("fd-radio-group") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getFieldset(el: any): HTMLFieldSetElement {
  return el.shadowRoot!.querySelector("fieldset") as HTMLFieldSetElement;
}

function getLegend(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("legend") as HTMLElement;
}

function getRadios(el: any): any[] {
  return Array.from(el.querySelectorAll("fd-radio"));
}

function getInternalInput(radio: any): HTMLInputElement {
  return radio.shadowRoot!.querySelector('input[type="radio"]') as HTMLInputElement;
}

describe("fd-radio-group", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-radio-group")).toBeDefined();
  });

  it("renders native fieldset and legend elements", async () => {
    const el = await createRadioGroup();

    expect(getFieldset(el).tagName).toBe("FIELDSET");
    expect(getLegend(el).tagName).toBe("LEGEND");
  });

  it("does not add role='radiogroup' to the fieldset", async () => {
    const el = await createRadioGroup();

    expect(getFieldset(el).hasAttribute("role")).toBe(false);
  });

  it("falls back to the label attribute when no legend slot is provided", async () => {
    const el = await createRadioGroup(
      { label: "Fallback legend" },
      `
        <fd-radio name="contact" value="email">Email</fd-radio>
      `,
    );

    expect(getLegend(el).textContent?.trim()).toBe("Fallback legend");
  });

  it("omits aria-describedby when description and error slots are empty", async () => {
    const el = await createRadioGroup();

    expect(getFieldset(el).hasAttribute("aria-describedby")).toBe(false);
  });

  it("conditionally wires description and error ids into aria-describedby", async () => {
    const el = await createRadioGroup(
      { required: "" },
      `
        <span slot="legend">Preferred contact method</span>
        <span slot="description">Select one option.</span>
        <fd-radio name="contact" value="email">Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
        <span slot="error">Please select a contact method.</span>
      `,
    );

    expect(getFieldset(el).getAttribute("aria-describedby")).toBe("desc");

    el.reportValidity();
    await el.updateComplete;

    expect(getFieldset(el).getAttribute("aria-describedby")).toBe("desc error-msg");
  });

  it("participates in required validation", async () => {
    const el = await createRadioGroup({ required: "" });

    expect(el.checkValidity()).toBe(false);
    expect(el.validationMessage).toBe("Please select an option.");
  });

  it("uses the first non-disabled radio as the validation anchor", async () => {
    const el = await createRadioGroup({ required: "" });
    getRadios(el)[0].disabled = true;
    await getRadios(el)[0].updateComplete;

    const anchor = (el as any)._getValidationAnchor();
    expect(anchor).toBe(getRadios(el)[1]);
  });

  it("sets data-user-invalid on invalid report", async () => {
    const el = await createRadioGroup({ required: "" });

    expect(el.reportValidity()).toBe(false);
    await el.updateComplete;
    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("reveals invalid state on an invalid event from a submit attempt", async () => {
    const el = await createRadioGroup({ required: "" });

    expect(el.checkValidity()).toBe(false);
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("does not surface invalid state before a visibility boundary", async () => {
    const el = await createRadioGroup({ required: "" });

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("reveals invalid state when focus leaves the group after interaction", async () => {
    const el = await createRadioGroup(
      { required: "" },
      `
        <span slot="legend">Preferred contact method</span>
        <fd-radio name="contact" value="email" checked>Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
      `,
    );

    const secondRadio = getRadios(el)[1];
    getInternalInput(secondRadio).click();
    await secondRadio.updateComplete;
    await el.updateComplete;

    secondRadio.checked = false;
    await secondRadio.updateComplete;
    await el.updateComplete;

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);

    getInternalInput(secondRadio).dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        composed: true,
        relatedTarget: document.body,
      }),
    );
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("clears data-user-invalid when a radio is selected", async () => {
    const el = await createRadioGroup({ required: "" });
    el.reportValidity();
    expect(el.hasAttribute("data-user-invalid")).toBe(true);

    const radios = getRadios(el);
    getInternalInput(radios[0]).click();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
  });

  it("clears aria-invalid in the same update cycle when the group becomes valid", async () => {
    const el = await createRadioGroup({ required: "" });

    el.reportValidity();
    await el.updateComplete;
    expect(getFieldset(el).getAttribute("aria-invalid")).toBe("true");

    getInternalInput(getRadios(el)[0]).click();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("reportValidity on a valid group has no visible effect", async () => {
    const el = await createRadioGroup({ required: "" });
    getInternalInput(getRadios(el)[0]).click();
    await el.updateComplete;

    expect(el.reportValidity()).toBe(true);
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("fires fd-radio-group-change with normalized value", async () => {
    const el = await createRadioGroup();
    const spy = vi.fn();
    el.addEventListener("fd-radio-group-change", spy);

    const radios = getRadios(el);
    getInternalInput(radios[0]).click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.value).toBe("email");
  });

  it("fires fd-radio-group-change with updated value when selection changes", async () => {
    const el = await createRadioGroup();
    const spy = vi.fn();
    el.addEventListener("fd-radio-group-change", spy);

    const radios = getRadios(el);
    getInternalInput(radios[0]).click();
    getInternalInput(radios[1]).click();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0].detail.value).toBe("phone");
  });

  it("continues to fire deprecated fd-group-change with selectedValue", async () => {
    const el = await createRadioGroup();
    const spy = vi.fn();
    el.addEventListener("fd-group-change", spy);

    const radios = getRadios(el);
    getInternalInput(radios[0]).click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.selectedValue).toBe("email");
  });

  it("disables and re-enables only children it owns in the simplified cascade", async () => {
    const el = await createRadioGroup({ disabled: "" });
    const [first, second] = getRadios(el);
    second.disabled = true;
    second.removeAttribute("data-group-disabled");

    (el as any)._applyDisabledState();
    await el.updateComplete;

    expect(first.disabled).toBe(true);
    expect(first.hasAttribute("data-group-disabled")).toBe(true);
    expect(second.disabled).toBe(true);
    expect(second.hasAttribute("data-group-disabled")).toBe(false);

    el.disabled = false;
    await el.updateComplete;

    expect(first.disabled).toBe(false);
    expect(first.hasAttribute("data-group-disabled")).toBe(false);
    expect(second.disabled).toBe(true);
  });

  it("applies disabled state to newly slotted children when the group is disabled", async () => {
    const el = await createRadioGroup({ disabled: "" });
    const child = document.createElement("fd-radio") as any;
    child.textContent = "Mail";
    child.setAttribute("name", "contact");
    child.setAttribute("value", "mail");
    el.appendChild(child);
    await child.updateComplete;
    (el as any)._onSlotChange();
    await el.updateComplete;

    expect(child.disabled).toBe(true);
    expect(child.hasAttribute("data-group-disabled")).toBe(true);
  });

  it("clears dirty invalid state on reset", async () => {
    const el = await createRadioGroup({ required: "" });
    el.reportValidity();
    expect(el.hasAttribute("data-user-invalid")).toBe(true);

    el.formResetCallback();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("restores the default radio selection regardless of group and child reset order", async () => {
    async function runReset(order: "group-first" | "children-first") {
      const el = await createRadioGroup(
        { required: "" },
        `
          <span slot="legend">Preferred contact method</span>
          <fd-radio name="contact" value="email" checked>Email</fd-radio>
          <fd-radio name="contact" value="phone">Phone</fd-radio>
        `,
      );

      const [first, second] = getRadios(el);
      getInternalInput(second).click();
      await first.updateComplete;
      await second.updateComplete;
      await el.updateComplete;

      const callbacks =
        order === "group-first"
          ? [
              () => el.formResetCallback(),
              () => first.formResetCallback(),
              () => second.formResetCallback(),
            ]
          : [
              () => first.formResetCallback(),
              () => second.formResetCallback(),
              () => el.formResetCallback(),
            ];

      for (const callback of callbacks) {
        callback();
      }

      await first.updateComplete;
      await second.updateComplete;
      await el.updateComplete;

      expect(first.checked).toBe(true);
      expect(second.checked).toBe(false);
      expect(el.checkValidity()).toBe(true);
      expect(el.hasAttribute("data-user-invalid")).toBe(false);
    }

    await runReset("group-first");
    document.body.innerHTML = "";
    await runReset("children-first");
  });

  it("skips validation when the group is both required and disabled", async () => {
    const el = await createRadioGroup({ required: "", disabled: "" });

    expect(el.checkValidity()).toBe(true);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
  });

  it("does not fire fd-radio-group-change for programmatic checked updates", async () => {
    const el = await createRadioGroup();
    const spy = vi.fn();
    el.addEventListener("fd-radio-group-change", spy);

    const radios = getRadios(el);
    radios[0].checked = true;
    await radios[0].updateComplete;

    expect(spy).not.toHaveBeenCalled();
  });

  it("warns when child radios have mismatched names", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await createRadioGroup(
      {},
      `
        <span slot="legend">Contact</span>
        <fd-radio name="contact" value="email">Email</fd-radio>
        <fd-radio name="delivery" value="phone">Phone</fd-radio>
      `,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("mismatched name attributes"),
    );

    warnSpy.mockRestore();
  });

  it("warns when child radios have empty names", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await createRadioGroup(
      {},
      `
        <span slot="legend">Contact</span>
        <fd-radio value="email">Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
      `,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("empty or missing name"),
    );

    warnSpy.mockRestore();
  });

  it("does not warn when all child radios share the same non-empty name", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await createRadioGroup(
      {},
      `
        <span slot="legend">Contact</span>
        <fd-radio name="contact" value="email">Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
      `,
    );

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createRadioGroup(
      {},
      `
        <span slot="legend">Preferred contact method</span>
        <span slot="description">Select how you would like to be contacted.</span>
        <fd-radio name="contact" value="email" checked>Email</fd-radio>
        <fd-radio name="contact" value="phone">Phone</fd-radio>
      `,
    );

    await expectNoAxeViolations(el);
  });
});
