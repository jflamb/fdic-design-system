import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-checkbox-group.js";
import "../register/fd-checkbox.js";
import "../register/fd-icon.js";
import "../icons/phosphor-regular.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createCheckboxGroup(
  attrs: Record<string, string> = {},
  innerHTML = `
    <span slot="legend">Communication preferences</span>
    <fd-checkbox name="contact" value="email">Email</fd-checkbox>
    <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
  `,
) {
  const el = document.createElement("fd-checkbox-group") as any;
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

function getCheckboxes(el: any): any[] {
  return Array.from(el.querySelectorAll("fd-checkbox"));
}

describe("fd-checkbox-group", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-checkbox-group")).toBeDefined();
  });

  it("renders native fieldset and legend elements", async () => {
    const el = await createCheckboxGroup();

    expect(getFieldset(el).tagName).toBe("FIELDSET");
    expect(getLegend(el).tagName).toBe("LEGEND");
  });

  it("falls back to the label attribute when no legend slot is provided", async () => {
    const el = await createCheckboxGroup(
      { label: "Fallback legend" },
      `
        <fd-checkbox name="contact" value="email">Email</fd-checkbox>
      `,
    );

    expect(getLegend(el).textContent?.trim()).toBe("Fallback legend");
  });

  it("omits aria-describedby when description and error slots are empty", async () => {
    const el = await createCheckboxGroup();

    expect(getFieldset(el).hasAttribute("aria-describedby")).toBe(false);
  });

  it("conditionally wires description and error ids into aria-describedby", async () => {
    const el = await createCheckboxGroup(
      { required: "" },
      `
        <span slot="legend">Communication preferences</span>
        <span slot="description">Select at least one option.</span>
        <fd-checkbox name="contact" value="email">Email</fd-checkbox>
        <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
        <span slot="error">Please select at least one option.</span>
      `,
    );

    expect(getFieldset(el).getAttribute("aria-describedby")).toBe("desc");

    el.reportValidity();
    await el.updateComplete;

    expect(getFieldset(el).getAttribute("aria-describedby")).toBe("desc error-msg");
  });

  it("participates in at-least-one validation when required", async () => {
    const el = await createCheckboxGroup({ required: "" });

    expect(el.checkValidity()).toBe(false);
    expect(el.validationMessage).toBe("Please select at least one option.");
  });

  it("uses the first non-disabled checkbox as the validation anchor", async () => {
    const el = await createCheckboxGroup({ required: "" });
    getCheckboxes(el)[0].disabled = true;
    await getCheckboxes(el)[0].updateComplete;

    const anchor = (el as any)._getValidationAnchor();
    expect(anchor).toBe(getCheckboxes(el)[1]);
  });

  it("sets data-user-invalid on invalid report without moving focus manually", async () => {
    const el = await createCheckboxGroup({ required: "" });
    const activeBefore = el.shadowRoot?.activeElement ?? document.activeElement;

    expect(el.reportValidity()).toBe(false);
    await el.updateComplete;
    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBe("true");
    expect(el.shadowRoot?.activeElement ?? document.activeElement).toBe(activeBefore);
  });

  it("reveals invalid state on an invalid event from a submit attempt", async () => {
    const el = await createCheckboxGroup({ required: "" });

    expect(el.checkValidity()).toBe(false);
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("does not surface invalid state before a visibility boundary", async () => {
    const el = await createCheckboxGroup({ required: "" });

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("reveals invalid state when focus leaves the group after interaction", async () => {
    const el = await createCheckboxGroup(
      { required: "" },
      `
        <span slot="legend">Communication preferences</span>
        <fd-checkbox name="contact" value="email" checked>Email</fd-checkbox>
        <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
      `,
    );

    const input = getCheckboxes(el)[0].shadowRoot!.querySelector("input") as HTMLInputElement;
    input.click();
    await el.updateComplete;

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);

    input.dispatchEvent(
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

  it("fires fd-checkbox-group-change with normalized value and values", async () => {
    const el = await createCheckboxGroup();
    const spy = vi.fn();
    el.addEventListener("fd-checkbox-group-change", spy);

    const first = getCheckboxes(el)[0];
    first.shadowRoot!.querySelector("input").click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.value).toBe("email");
    expect(spy.mock.calls[0][0].detail.values).toEqual(["email"]);
  });

  it("continues to fire deprecated fd-group-change with checkedValues", async () => {
    const el = await createCheckboxGroup();
    const spy = vi.fn();
    el.addEventListener("fd-group-change", spy);

    const first = getCheckboxes(el)[0];
    first.shadowRoot!.querySelector("input").click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.checkedValues).toEqual(["email"]);
  });

  it("disables and re-enables only children it owns in the simplified cascade", async () => {
    const el = await createCheckboxGroup({ disabled: "" });
    const [first, second] = getCheckboxes(el);
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
    const el = await createCheckboxGroup({ disabled: "" });
    const child = document.createElement("fd-checkbox") as any;
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
    const el = await createCheckboxGroup({ required: "" });
    el.reportValidity();
    expect(el.hasAttribute("data-user-invalid")).toBe(true);

    el.formResetCallback();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("clears aria-invalid in the same update cycle when the group becomes valid", async () => {
    const el = await createCheckboxGroup({ required: "" });
    const first = getCheckboxes(el)[0];
    const input = first.shadowRoot!.querySelector("input") as HTMLInputElement;

    el.reportValidity();
    await el.updateComplete;
    expect(getFieldset(el).getAttribute("aria-invalid")).toBe("true");

    input.click();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getFieldset(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("has no obvious accessibility violations", async () => {
    const el = await createCheckboxGroup(
      {},
      `
        <span slot="legend">Communication preferences</span>
        <span slot="description">Select how you would like to be contacted.</span>
        <fd-checkbox name="contact" value="email" checked>Email</fd-checkbox>
        <fd-checkbox name="contact" value="phone">Phone</fd-checkbox>
      `,
    );

    await expectNoAxeViolations(el);
  });
});
