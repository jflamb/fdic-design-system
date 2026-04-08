import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-selector.js";
import { expectNoAxeViolations } from "./test-a11y.js";

const DEFAULT_OPTIONS = `
  <fd-option value="checking">Checking</fd-option>
  <fd-option value="savings">Savings</fd-option>
  <fd-option value="cd">Certificate of Deposit</fd-option>
`;

async function createSelector(
  attrs: Record<string, string> = {},
  innerHTML = DEFAULT_OPTIONS,
) {
  const el = document.createElement("fd-selector") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  // Wait for firstUpdated to assign option IDs
  await new Promise((r) => requestAnimationFrame(r));
  await el.updateComplete;
  return el;
}

function getTrigger(el: any): HTMLButtonElement {
  return el.shadowRoot!.querySelector("[part=trigger]") as HTMLButtonElement;
}

function getListbox(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=listbox]") as HTMLElement;
}

function getOptions(el: any): any[] {
  return Array.from(el.querySelectorAll("fd-option"));
}

function getLabelEl(el: any): HTMLElement | null {
  return el.shadowRoot!.querySelector("[part=label]");
}

function getErrorEl(el: any): HTMLElement | null {
  return el.shadowRoot!.querySelector("[part=error]");
}

function getValueDisplay(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=value-display]") as HTMLElement;
}

describe("fd-selector", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  // --- Registration ---

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-selector")).toBeDefined();
  });

  it("fd-option is defined as a custom element", () => {
    expect(customElements.get("fd-option")).toBeDefined();
  });

  // --- Basic rendering ---

  it("renders a trigger button and hidden listbox", async () => {
    const el = await createSelector({ label: "Account" });
    const trigger = getTrigger(el);
    const listbox = getListbox(el);

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.getAttribute("type")).toBe("button");
    expect(listbox.getAttribute("role")).toBe("listbox");
    expect(listbox.hidden).toBe(true);
  });

  it("renders the label text", async () => {
    const el = await createSelector({ label: "Account type" });
    const label = getLabelEl(el);

    expect(label?.textContent).toContain("Account type");
  });

  it("renders the required marker when required", async () => {
    const el = await createSelector({ label: "Account", required: "true" });
    const marker = el.shadowRoot!.querySelector("[part=required-marker]");

    expect(marker?.textContent).toBe("*");
  });

  it("shows placeholder text when no option is selected", async () => {
    const el = await createSelector({ label: "Account" });
    const display = getValueDisplay(el);

    expect(display.textContent?.trim()).toBe("Select\u2026");
    expect(display.classList.contains("placeholder")).toBe(true);
  });

  it("uses custom placeholder text", async () => {
    const el = await createSelector({
      label: "Account",
      placeholder: "Choose one",
    });
    const display = getValueDisplay(el);

    expect(display.textContent?.trim()).toBe("Choose one");
  });

  // --- Label behavior ---

  it("renders label as a <label> element", async () => {
    const el = await createSelector({ label: "Account" });
    const label = getLabelEl(el);

    expect(label?.tagName).toBe("LABEL");
  });

  it("clicking the label focuses the trigger", async () => {
    const el = await createSelector({ label: "Account" });
    const label = getLabelEl(el);
    const trigger = getTrigger(el);

    label?.click();
    await el.updateComplete;

    expect(el.shadowRoot!.activeElement).toBe(trigger);
  });

  // --- ARIA on trigger ---

  it("sets aria-haspopup='listbox' on trigger", async () => {
    const el = await createSelector({ label: "Account" });

    expect(getTrigger(el).getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("sets aria-expanded='false' when closed", async () => {
    const el = await createSelector({ label: "Account" });

    expect(getTrigger(el).getAttribute("aria-expanded")).toBe("false");
  });

  it("sets aria-controls pointing to the listbox id", async () => {
    const el = await createSelector({ label: "Account" });
    const trigger = getTrigger(el);
    const listbox = getListbox(el);

    expect(trigger.getAttribute("aria-controls")).toBe(listbox.id);
  });

  it("does not put aria-required on the trigger when required", async () => {
    const el = await createSelector({ label: "Account", required: "true" });

    expect(getTrigger(el).hasAttribute("aria-required")).toBe(false);
  });

  it("sets aria-labelledby pointing to label", async () => {
    const el = await createSelector({ label: "Account" });
    const labelEl = getLabelEl(el);

    expect(getTrigger(el).getAttribute("aria-labelledby")).toBe(labelEl?.id);
  });

  it("uses an accessible disabled label color fallback", async () => {
    await createSelector({ label: "Account", disabled: "" });

    const styles = String(
      (customElements.get("fd-selector") as any).styles?.cssText ?? "",
    );
    expect(styles).toContain(":host([disabled]) [part=\"label-text\"]");
    expect(styles).toContain("var(--ds-color-text-secondary, #595961)");
  });

  // --- ARIA on listbox ---

  it("listbox has role='listbox'", async () => {
    const el = await createSelector({ label: "Account" });

    expect(getListbox(el).getAttribute("role")).toBe("listbox");
  });

  it("listbox has aria-multiselectable only for multiple variant", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });

    expect(getListbox(el).getAttribute("aria-multiselectable")).toBe("true");
  });

  it("listbox does NOT have aria-multiselectable for simple variant", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });

    expect(getListbox(el).hasAttribute("aria-multiselectable")).toBe(false);
  });

  // --- ARIA on options ---

  it("options have role='option'", async () => {
    const el = await createSelector({ label: "Account" });
    const opts = getOptions(el);

    for (const opt of opts) {
      expect(opt.getAttribute("role")).toBe("option");
    }
  });

  it("options have aria-selected", async () => {
    const el = await createSelector({ label: "Account" });
    const opts = getOptions(el);

    for (const opt of opts) {
      expect(opt.getAttribute("aria-selected")).toBe("false");
    }
  });

  it("options get unique IDs", async () => {
    const el = await createSelector({ label: "Account" });
    const opts = getOptions(el);
    const ids = opts.map((o: any) => o.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toBeTruthy();
    }
  });

  // --- Variants ---

  it("simple variant renders no indicators", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });
    const opts = getOptions(el);

    for (const opt of opts) {
      const indicator = opt.shadowRoot!.querySelector("[part=indicator]");
      expect(indicator).toBeNull();
    }
  });

  it("single variant renders radio indicators", async () => {
    const el = await createSelector({ label: "Account", variant: "single" });
    const opts = getOptions(el);

    for (const opt of opts) {
      const indicator = opt.shadowRoot!.querySelector("[part=indicator]");
      expect(indicator).not.toBeNull();
      expect(indicator!.querySelector(".radio-outer")).not.toBeNull();
    }
  });

  it("multiple variant renders checkbox indicators", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    const opts = getOptions(el);

    for (const opt of opts) {
      const indicator = opt.shadowRoot!.querySelector("[part=indicator]");
      expect(indicator).not.toBeNull();
      expect(indicator!.querySelector(".checkbox-outer")).not.toBeNull();
    }
  });

  // --- Open/close ---

  it("opens when trigger is clicked", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;

    expect(el.open).toBe(true);
    expect(getListbox(el).hidden).toBe(false);
    expect(getTrigger(el).getAttribute("aria-expanded")).toBe("true");
  });

  it("closes when trigger is clicked again", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    getTrigger(el).click();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it("fires fd-selector-open-change event on open", async () => {
    const el = await createSelector({ label: "Account" });
    const handler = vi.fn();
    el.addEventListener("fd-selector-open-change", handler);

    getTrigger(el).click();
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail.open).toBe(true);
  });

  it("continues to fire deprecated fd-selector-open on open", async () => {
    const el = await createSelector({ label: "Account" });
    const handler = vi.fn();
    el.addEventListener("fd-selector-open", handler);

    getTrigger(el).click();
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("fires fd-selector-open-change event on close", async () => {
    const el = await createSelector({ label: "Account" });
    const handler = vi.fn();
    el.addEventListener("fd-selector-open-change", handler);

    getTrigger(el).click();
    await el.updateComplete;
    getTrigger(el).click();
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler.mock.calls[1][0].detail.open).toBe(false);
  });

  it("continues to fire deprecated fd-selector-close on close", async () => {
    const el = await createSelector({ label: "Account" });
    const handler = vi.fn();
    el.addEventListener("fd-selector-close", handler);

    getTrigger(el).click();
    await el.updateComplete;
    getTrigger(el).click();
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  // --- Selection: simple variant ---

  it("simple: clicking an option selects it and closes", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });
    getTrigger(el).click();
    await el.updateComplete;

    const opts = getOptions(el);
    opts[1].click();
    await el.updateComplete;

    expect(el.value).toBe("savings");
    expect(opts[1].selected).toBe(true);
    expect(opts[0].selected).toBe(false);
    expect(el.open).toBe(false);
  });

  it("simple: displays selected option text in trigger", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[0].click();
    await el.updateComplete;

    expect(getValueDisplay(el).textContent?.trim()).toBe("Checking");
  });

  // --- Selection: single variant ---

  it("single: clicking an option selects it and closes", async () => {
    const el = await createSelector({ label: "Account", variant: "single" });
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[2].click();
    await el.updateComplete;

    expect(el.value).toBe("cd");
    expect(el.open).toBe(false);
  });

  it("single: selecting a new option deselects the previous", async () => {
    const el = await createSelector({ label: "Account", variant: "single" });

    // Select first
    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;

    // Select second
    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[1].click();
    await el.updateComplete;

    const opts = getOptions(el);
    expect(opts[0].selected).toBe(false);
    expect(opts[1].selected).toBe(true);
    expect(el.value).toBe("savings");
  });

  // --- Selection: multiple variant ---

  it("multiple: clicking an option toggles it and keeps popup open", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[0].click();
    await el.updateComplete;

    expect(el.open).toBe(true);
    expect(getOptions(el)[0].selected).toBe(true);
    expect(el.values).toEqual(["checking"]);
  });

  it("multiple: toggling an option off removes it from values", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;

    const opts = getOptions(el);
    opts[0].click();
    await el.updateComplete;
    opts[0].click();
    await el.updateComplete;

    expect(opts[0].selected).toBe(false);
    expect(el.values).toEqual([]);
  });

  it("multiple: displays comma-separated values in trigger", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[0].click();
    await el.updateComplete;
    getOptions(el)[2].click();
    await el.updateComplete;

    expect(getValueDisplay(el).textContent?.trim()).toBe(
      "Checking, Certificate of Deposit",
    );
  });

  it("multiple: values property returns array of selected values", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[0].click();
    await el.updateComplete;
    getOptions(el)[1].click();
    await el.updateComplete;

    expect(el.values).toEqual(["checking", "savings"]);
  });

  it("multiple: setting values property updates selection", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });

    el.values = ["savings", "cd"];
    await el.updateComplete;

    const opts = getOptions(el);
    expect(opts[0].selected).toBe(false);
    expect(opts[1].selected).toBe(true);
    expect(opts[2].selected).toBe(true);
  });

  // --- Events ---

  it("fires input, change, and fd-selector-change on selection", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });
    const inputHandler = vi.fn();
    const changeHandler = vi.fn();
    const selectorChangeHandler = vi.fn();

    el.addEventListener("input", inputHandler);
    el.addEventListener("change", changeHandler);
    el.addEventListener("fd-selector-change", selectorChangeHandler);

    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[1].click();
    await el.updateComplete;

    expect(inputHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(selectorChangeHandler).toHaveBeenCalledTimes(1);

    const detail = selectorChangeHandler.mock.calls[0][0].detail;
    expect(detail.value).toBe("savings");
    expect(detail.values).toEqual(["savings"]);
  });

  // --- Disabled ---

  it("does not open when disabled", async () => {
    const el = await createSelector({ label: "Account", disabled: "" });
    getTrigger(el).click();
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it("disabled options cannot be selected", async () => {
    const el = await createSelector(
      { label: "Account", variant: "simple" },
      `
        <fd-option value="a">Option A</fd-option>
        <fd-option value="b" disabled>Option B</fd-option>
      `,
    );
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[1].click();
    await el.updateComplete;

    expect(el.value).toBe("");
  });

  // --- Option description ---

  it("renders option description when set", async () => {
    const el = await createSelector(
      { label: "Account" },
      `<fd-option value="cd" description="Fixed-term deposit">Certificate of Deposit</fd-option>`,
    );
    const opt = getOptions(el)[0];
    const desc = opt.shadowRoot!.querySelector("[part=option-description]");

    expect(desc?.textContent).toBe("Fixed-term deposit");
  });

  it("does not render description when not set", async () => {
    const el = await createSelector(
      { label: "Account" },
      `<fd-option value="cd">Certificate of Deposit</fd-option>`,
    );
    const opt = getOptions(el)[0];
    const desc = opt.shadowRoot!.querySelector("[part=option-description]");

    expect(desc).toBeNull();
  });

  // --- Description and error slots ---

  it("shows description slot content", async () => {
    const el = await createSelector(
      { label: "Account" },
      `
        <span slot="description">Choose your account type</span>
        <fd-option value="a">A</fd-option>
      `,
    );
    const desc = el.shadowRoot!.querySelector("[part=description]");

    expect(desc?.hidden).toBe(false);
  });

  it("hides description when slot is empty", async () => {
    const el = await createSelector({ label: "Account" });
    const desc = el.shadowRoot!.querySelector("[part=description]");

    expect(desc?.hidden).toBe(true);
  });

  it("shows error slot content", async () => {
    const el = await createSelector(
      { label: "Account" },
      `
        <span slot="error">Selection required</span>
        <fd-option value="a">A</fd-option>
      `,
    );
    const error = getErrorEl(el);

    expect(error?.hidden).toBe(false);
  });

  // --- Keyboard: trigger ---

  it("Enter on trigger opens the listbox", async () => {
    const el = await createSelector({ label: "Account" });
    const trigger = getTrigger(el);
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  it("Space on trigger opens the listbox", async () => {
    const el = await createSelector({ label: "Account" });
    const trigger = getTrigger(el);
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  it("ArrowDown on trigger opens the listbox", async () => {
    const el = await createSelector({ label: "Account" });
    const trigger = getTrigger(el);
    trigger.focus();
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.open).toBe(true);
  });

  // --- Keyboard: listbox navigation ---

  it("ArrowDown moves focus to next option", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const listbox = getListbox(el);
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await el.updateComplete;

    const opts = getOptions(el);
    expect(opts[1].hasAttribute("data-focused")).toBe(true);
  });

  it("ArrowUp moves focus to previous option", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    // Move down first
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    // Then back up
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );
    await el.updateComplete;

    expect(getOptions(el)[0].hasAttribute("data-focused")).toBe(true);
  });

  it("Home moves focus to first option", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
    );
    await el.updateComplete;

    expect(getOptions(el)[0].hasAttribute("data-focused")).toBe(true);
  });

  it("End moves focus to last option", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true }),
    );
    await el.updateComplete;

    expect(getOptions(el)[2].hasAttribute("data-focused")).toBe(true);
  });

  it("Escape closes the listbox", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it("Enter on focused option selects it (simple)", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.value).toBe("savings");
    expect(el.open).toBe(false);
  });

  it("Space on focused option toggles it (multiple)", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    // Focus is on first option by default
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );
    await el.updateComplete;

    expect(getOptions(el)[0].selected).toBe(true);
    expect(el.open).toBe(true); // stays open in multi
  });

  // --- Stops at bounds (does not wrap) ---

  it("ArrowUp at first option does not wrap", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );
    await el.updateComplete;

    // Should still be on first option (or no change)
    expect(getOptions(el)[0].hasAttribute("data-focused")).toBe(true);
  });

  // --- Form integration ---

  it("participates in form submission with value (single)", async () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <fd-selector label="Account" name="account" variant="simple">
        <fd-option value="checking">Checking</fd-option>
        <fd-option value="savings">Savings</fd-option>
      </fd-selector>
    `;
    document.body.appendChild(form);

    const el = form.querySelector("fd-selector") as any;
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    // Select an option
    getTrigger(el).click();
    await el.updateComplete;
    el.querySelectorAll("fd-option")[0].click();
    await el.updateComplete;

    // Value should be set
    expect(el.value).toBe("checking");
  });

  it("associates with the containing form in multiple mode", async () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <fd-selector label="Account" name="account" variant="multiple">
        <fd-option value="checking">Checking</fd-option>
        <fd-option value="savings">Savings</fd-option>
        <fd-option value="cd">Certificate of Deposit</fd-option>
      </fd-selector>
    `;
    document.body.appendChild(form);

    const el = form.querySelector("fd-selector") as any;
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;
    getOptions(el)[1].click();
    await el.updateComplete;

    expect(el.form?.tagName).toBe("FORM");
    expect(el.values).toEqual(["checking", "savings"]);
    expect(el.value).toBe("checking");
  });

  it("validates required on reportValidity", async () => {
    const el = await createSelector({ label: "Account", required: "" });

    const valid = el.reportValidity();
    await el.updateComplete;

    expect(valid).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getTrigger(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("reveals invalid state on an invalid event from a submit attempt", async () => {
    const el = await createSelector({ label: "Account", required: "" });

    expect(el.checkValidity()).toBe(false);
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getTrigger(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("does not surface invalid state before a visibility boundary", async () => {
    const el = await createSelector({ label: "Account", required: "" });

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getTrigger(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("clears invalid state after valid selection", async () => {
    const el = await createSelector({
      label: "Account",
      required: "",
      variant: "simple",
    });

    el.reportValidity();
    expect(el.hasAttribute("data-user-invalid")).toBe(true);

    // Make a valid selection
    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
  });

  it("clears aria-invalid in the same update cycle when the selector becomes valid", async () => {
    const el = await createSelector({
      label: "Account",
      required: "",
      variant: "simple",
    });

    el.reportValidity();
    await el.updateComplete;
    expect(getTrigger(el).getAttribute("aria-invalid")).toBe("true");

    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getTrigger(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("reveals invalid state when a multiple selector closes after invalid interaction", async () => {
    const el = await createSelector(
      { label: "Account", required: "", variant: "multiple" },
      `
        <span slot="error">Select at least one account.</span>
        <fd-option value="checking" selected>Checking</fd-option>
        <fd-option value="savings">Savings</fd-option>
      `,
    );

    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);

    getTrigger(el).click();
    await el.updateComplete;
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(getTrigger(el).getAttribute("aria-invalid")).toBe("true");
  });

  it("reveals invalid state when focus leaves the closed widget after invalid interaction", async () => {
    const el = await createSelector({
      label: "Account",
      required: "",
      variant: "multiple",
    });
    const trigger = getTrigger(el);

    trigger.click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;
    trigger.click();
    await el.updateComplete;

    el.values = [];
    await el.updateComplete;

    expect(el.checkValidity()).toBe(false);
    expect(el.hasAttribute("data-user-invalid")).toBe(false);

    trigger.dispatchEvent(
      new FocusEvent("blur", {
        relatedTarget: document.body,
      }),
    );
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(true);
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
  });

  it("reportValidity on a valid selector has no visible effect", async () => {
    const el = await createSelector({ label: "Account", required: "", value: "checking" });
    await el.updateComplete;

    expect(el.reportValidity()).toBe(true);
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getTrigger(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("reset clears visible invalid state and aria-invalid", async () => {
    const el = await createSelector({ label: "Account", required: "" });

    el.reportValidity();
    await el.updateComplete;
    expect(el.hasAttribute("data-user-invalid")).toBe(true);

    el.formResetCallback();
    await el.updateComplete;

    expect(el.hasAttribute("data-user-invalid")).toBe(false);
    expect(getTrigger(el).getAttribute("aria-invalid")).toBeNull();
  });

  it("multiple: validates required with at least one selection", async () => {
    const el = await createSelector({
      label: "Account",
      required: "",
      variant: "multiple",
    });

    expect(el.checkValidity()).toBe(false);

    // Select one
    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;

    expect(el.checkValidity()).toBe(true);
  });

  // --- Accessibility audit ---

  it("passes accessibility audit (simple)", async () => {
    const el = await createSelector({ label: "Account type", variant: "simple" });
    await expectNoAxeViolations(el, {
      rules: { region: { enabled: false } },
    });
  });

  it("passes accessibility audit (single)", async () => {
    const el = await createSelector({ label: "Account type", variant: "single" });
    await expectNoAxeViolations(el, {
      rules: { region: { enabled: false } },
    });
  });

  it("passes accessibility audit (multiple)", async () => {
    const el = await createSelector({ label: "Account type", variant: "multiple" });
    await expectNoAxeViolations(el, {
      rules: { region: { enabled: false } },
    });
  });

  // --- Edge cases ---

  it("handles empty options gracefully", async () => {
    const el = await createSelector({ label: "Account" }, "");

    getTrigger(el).click();
    await el.updateComplete;

    expect(el.open).toBe(true);
    expect(getOptions(el).length).toBe(0);
  });

  it("skips disabled options during keyboard navigation", async () => {
    const el = await createSelector(
      { label: "Account" },
      `
        <fd-option value="a">A</fd-option>
        <fd-option value="b" disabled>B</fd-option>
        <fd-option value="c">C</fd-option>
      `,
    );

    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const listbox = getListbox(el);
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await el.updateComplete;

    // Should skip B (disabled) and focus C
    const opts = getOptions(el);
    expect(opts[2].hasAttribute("data-focused")).toBe(true);
  });

  it("value property returns first selected for multiple variant", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    el.values = ["savings", "cd"];
    await el.updateComplete;

    expect(el.values).toEqual(["savings", "cd"]);
    // value mirrors the first selected option
    expect(el.value).toBe("savings");
  });

  // --- Regression: Fix 1 — programmatic value updates sync option state ---

  it("programmatic value update syncs option selected state", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });

    el.value = "savings";
    await el.updateComplete;
    await el.updateComplete; // second cycle for display text re-render

    const opts = getOptions(el);
    expect(opts[0].selected).toBe(false);
    expect(opts[1].selected).toBe(true);
    expect(getValueDisplay(el).textContent?.trim()).toBe("Savings");
  });

  it("programmatic value update refreshes trigger text", async () => {
    const el = await createSelector({ label: "Account", variant: "single" });

    // Select one option first
    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;

    // Programmatically change to a different option
    el.value = "cd";
    await el.updateComplete;
    await el.updateComplete; // second cycle for display text re-render

    expect(getValueDisplay(el).textContent?.trim()).toBe("Certificate of Deposit");
    expect(getOptions(el)[0].selected).toBe(false);
    expect(getOptions(el)[2].selected).toBe(true);
  });

  it("programmatic value set to non-matching option clears selection", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });

    // First set a valid value
    el.value = "savings";
    await el.updateComplete;
    await el.updateComplete;
    expect(getOptions(el)[1].selected).toBe(true);

    // Set to a non-existent value
    el.value = "nonexistent";
    await el.updateComplete;
    await el.updateComplete;

    // All options should be deselected, value normalized to empty
    const opts = getOptions(el);
    for (const opt of opts) {
      expect(opt.selected).toBe(false);
    }
    expect(el.value).toBe("");
    expect(getValueDisplay(el).textContent?.trim()).toBe("Select\u2026");
  });

  // --- Regression: Fix 2 — multiple-mode value mirrors first selected ---

  it("multiple: value mirrors first selected option after toggle", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[1].click(); // savings
    await el.updateComplete;
    expect(el.value).toBe("savings");

    getOptions(el)[0].click(); // checking
    await el.updateComplete;
    // First selected in DOM order is checking
    expect(el.value).toBe("checking");
  });

  it("multiple: fd-selector-change.detail.value reflects first selected", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    const handler = vi.fn();
    el.addEventListener("fd-selector-change", handler);

    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[1].click(); // savings
    await el.updateComplete;

    const detail = handler.mock.calls[0][0].detail;
    expect(detail.value).toBe("savings");
    expect(detail.values).toEqual(["savings"]);
  });

  it("multiple: fd-selector-change includes both value and values after multiple selections", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    const handler = vi.fn();
    el.addEventListener("fd-selector-change", handler);

    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[1].click(); // savings
    await el.updateComplete;
    getOptions(el)[2].click(); // cd
    await el.updateComplete;

    const detail = handler.mock.calls[1][0].detail;
    expect(detail.value).toBe("savings");
    expect(detail.values).toEqual(["savings", "cd"]);
  });

  it("multiple: value is empty when all deselected", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[0].click(); // select
    await el.updateComplete;
    getOptions(el)[0].click(); // deselect
    await el.updateComplete;

    expect(el.value).toBe("");
    expect(el.values).toEqual([]);
  });

  // --- Regression: Fix 3 — aria-describedby excludes error until invalid ---

  it("aria-describedby excludes error ID before validation failure", async () => {
    const el = await createSelector(
      { label: "Account", required: "" },
      `
        <span slot="error">Selection required</span>
        <fd-option value="a">A</fd-option>
      `,
    );
    const trigger = getTrigger(el);
    const describedBy = trigger.getAttribute("aria-describedby") ?? "";

    expect(describedBy).not.toContain("selector-error");
  });

  it("aria-describedby includes error ID after validation failure", async () => {
    const el = await createSelector(
      { label: "Account", required: "" },
      `
        <span slot="error">Selection required</span>
        <fd-option value="a">A</fd-option>
      `,
    );

    el.reportValidity();
    // reportValidity sets data-user-invalid; need re-render to pick it up
    el.requestUpdate();
    await el.updateComplete;

    const trigger = getTrigger(el);
    const describedBy = trigger.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("selector-error");
  });

  // --- Regression: Fix 4 — form reset restores initial state ---

  it("form reset restores initial single-select state", async () => {
    const el = await createSelector(
      { label: "Account", variant: "single", value: "savings" },
      `
        <fd-option value="checking">Checking</fd-option>
        <fd-option value="savings" selected>Savings</fd-option>
      `,
    );

    // Change selection
    getTrigger(el).click();
    await el.updateComplete;
    getOptions(el)[0].click();
    await el.updateComplete;
    expect(el.value).toBe("checking");

    // Reset via formResetCallback (happy-dom doesn't call it from form.reset)
    el.formResetCallback();
    await el.updateComplete;
    await el.updateComplete;

    expect(el.value).toBe("savings");
    const opts = getOptions(el);
    expect(opts[0].selected).toBe(false);
    expect(opts[1].selected).toBe(true);
  });

  it("form reset restores initial multi-select state", async () => {
    const el = await createSelector(
      { label: "Account", variant: "multiple" },
      `
        <fd-option value="checking" selected>Checking</fd-option>
        <fd-option value="savings">Savings</fd-option>
        <fd-option value="cd" selected>Certificate of Deposit</fd-option>
      `,
    );

    // Clear all selections
    el.values = [];
    await el.updateComplete;
    expect(el.values).toEqual([]);

    // Reset
    el.formResetCallback();
    await el.updateComplete;

    expect(el.values).toEqual(["checking", "cd"]);
    const opts = getOptions(el);
    expect(opts[0].selected).toBe(true);
    expect(opts[1].selected).toBe(false);
    expect(opts[2].selected).toBe(true);
  });

  // --- Regression: Fix 5 — type-ahead advances among same-prefix matches ---

  it("type-ahead advances through options with same starting letter", async () => {
    const el = await createSelector(
      { label: "Account" },
      `
        <fd-option value="s1">Savings Basic</fd-option>
        <fd-option value="s2">Savings Plus</fd-option>
        <fd-option value="s3">Savings Premium</fd-option>
      `,
    );

    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    const listbox = getListbox(el);
    const opts = getOptions(el);

    // On open, first option is focused
    expect(opts[0].hasAttribute("data-focused")).toBe(true);

    // Type "s" — searches from after focused (index 0), finds Savings Plus
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", bubbles: true }),
    );
    await el.updateComplete;
    expect(opts[1].hasAttribute("data-focused")).toBe(true);

    // Clear buffer to simulate timeout
    (el as any)._typeAheadBuffer = "";

    // Type "s" again — searches from after index 1, finds Savings Premium
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", bubbles: true }),
    );
    await el.updateComplete;
    expect(opts[2].hasAttribute("data-focused")).toBe(true);

    // Clear buffer
    (el as any)._typeAheadBuffer = "";

    // Type "s" again — wraps around, finds Savings Basic
    listbox.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", bubbles: true }),
    );
    await el.updateComplete;
    expect(opts[0].hasAttribute("data-focused")).toBe(true);
  });

  // --- Regression: click events bubble normally from fd-option ---

  it("click events on fd-option bubble to ancestors", async () => {
    const el = await createSelector({ label: "Account", variant: "simple" });
    const clickHandler = vi.fn();
    el.addEventListener("click", clickHandler);

    getTrigger(el).click();
    await el.updateComplete;

    getOptions(el)[0].click();
    await el.updateComplete;

    // The native click should bubble to the fd-selector host
    expect(clickHandler).toHaveBeenCalled();
  });

  // --- Regression: outside dismiss ---

  it("closes on pointerdown outside the component", async () => {
    const el = await createSelector({ label: "Account" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    expect(el.open).toBe(true);

    // Simulate pointerdown outside
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it("does not close on pointerdown inside the dropdown", async () => {
    const el = await createSelector({ label: "Account", variant: "multiple" });
    getTrigger(el).click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    expect(el.open).toBe(true);

    // Simulate pointerdown on an option (inside the component)
    getOptions(el)[0].dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(el.open).toBe(true);
  });
});
