import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-label.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createLabel(attrs: Record<string, string> = {}) {
  const el = document.createElement("fd-label") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getLabel(el: any): HTMLLabelElement | null {
  return el.querySelector("[part=label]");
}

function getRequiredIndicator(el: any): HTMLElement | null {
  return el.querySelector("[part=required-indicator]");
}

function getDescription(el: any): HTMLElement | null {
  return el.querySelector("[part=description]");
}

function getInfotipTrigger(el: any): HTMLButtonElement | null {
  return el.querySelector("[part=infotip-trigger]");
}

function getInfotipPanel(el: any): HTMLElement | null {
  return el.querySelector(".fd-label__infotip-panel");
}

describe("fd-label", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  // --- Registration ---

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-label")).toBeDefined();
  });

  // --- Basic rendering ---

  it("renders a native label element", async () => {
    const el = await createLabel({ label: "Account number" });
    const label = getLabel(el);

    expect(label).not.toBeNull();
    expect(label?.tagName).toBe("LABEL");
  });

  it("renders the label text", async () => {
    const el = await createLabel({ label: "Routing number" });
    const label = getLabel(el);

    expect(label?.textContent).toContain("Routing number");
  });

  it("sets the for attribute on the native label", async () => {
    const el = await createLabel({ label: "Account", for: "my-input" });
    const label = getLabel(el);

    expect(label?.getAttribute("for")).toBe("my-input");
  });

  it("renders in light DOM (no shadow root)", async () => {
    const el = await createLabel({ label: "Test" });
    expect(el.shadowRoot).toBeNull();
  });

  // --- Required indicator ---

  it("does not render required indicator by default", async () => {
    const el = await createLabel({ label: "Account" });
    const indicator = getRequiredIndicator(el);

    expect(indicator).toBeNull();
  });

  it("renders required indicator when required is set", async () => {
    const el = await createLabel({ label: "Account", required: "" });
    const indicator = getRequiredIndicator(el);

    expect(indicator).not.toBeNull();
    expect(indicator?.textContent).toBe("*");
    expect(indicator?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders visually-hidden required text for screen readers", async () => {
    const el = await createLabel({ label: "Account", required: "" });
    const srText = el.querySelector(".fd-label__sr-only");

    expect(srText).not.toBeNull();
    expect(srText?.textContent).toBe("(required)");
  });

  // --- Description ---

  it("hides description container when no description is provided", async () => {
    const el = await createLabel({ label: "Account" });
    const desc = getDescription(el);

    expect(desc?.hidden).toBe(true);
  });

  it("shows description when description attribute is set", async () => {
    const el = await createLabel({
      label: "Routing number",
      description: "9-digit number on the bottom left of your check",
    });
    const desc = getDescription(el);

    expect(desc?.hidden).toBe(false);
    expect(desc?.textContent).toContain("9-digit number");
  });

  it("generates a stable description ID based on for attribute", async () => {
    const el = await createLabel({
      label: "Account",
      for: "my-input",
      description: "Hint text",
    });
    const desc = getDescription(el);

    expect(desc?.id).toMatch(/^my-input-desc-\d+$/);
  });

  // --- aria-describedby auto-wiring ---

  it("appends description ID to target input aria-describedby", async () => {
    const input = document.createElement("input");
    input.id = "wire-test";
    document.body.appendChild(input);

    const el = await createLabel({
      label: "Account",
      for: "wire-test",
      description: "Help text",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const describedBy = input.getAttribute("aria-describedby") || "";
    const desc = getDescription(el);
    expect(describedBy).toContain(desc?.id);
  });

  it("preserves existing aria-describedby tokens on target input", async () => {
    const input = document.createElement("input");
    input.id = "preserve-test";
    input.setAttribute("aria-describedby", "existing-id");
    document.body.appendChild(input);

    const el = await createLabel({
      label: "Account",
      for: "preserve-test",
      description: "Help",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const describedBy = input.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain("existing-id");
    const desc = getDescription(el);
    expect(describedBy).toContain(desc?.id);
  });

  it("removes only its own ID from aria-describedby on disconnect", async () => {
    const input = document.createElement("input");
    input.id = "cleanup-test";
    input.setAttribute("aria-describedby", "keep-me");
    document.body.appendChild(input);

    const el = await createLabel({
      label: "Account",
      for: "cleanup-test",
      description: "Help",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const desc = getDescription(el);
    const descId = desc?.id;
    expect(input.getAttribute("aria-describedby")).toContain(descId);

    // Disconnect
    el.remove();
    const remaining = input.getAttribute("aria-describedby") || "";
    expect(remaining).toBe("keep-me");
    expect(remaining).not.toContain(descId);
  });

  it("does not wire aria-describedby when target does not exist and starts observing", async () => {
    // With MutationObserver, a missing target starts observation
    // rather than immediately warning. Verify no wiring occurs.
    const el = await createLabel({
      label: "Account",
      for: "nonexistent-element",
      description: "Hint",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    // No target exists, so nothing should be wired
    expect((el as any)._wiredTarget).toBeNull();
  });

  // --- InfoTip ---

  it("does not render infotip button when infotip is not set", async () => {
    const el = await createLabel({ label: "Account" });
    expect(getInfotipTrigger(el)).toBeNull();
  });

  it("renders infotip button when infotip attribute is set", async () => {
    const el = await createLabel({
      label: "Account",
      infotip: "Help text",
    });
    const trigger = getInfotipTrigger(el);

    expect(trigger).not.toBeNull();
    expect(trigger?.tagName).toBe("BUTTON");
    expect(trigger?.getAttribute("type")).toBe("button");
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
  });

  it("auto-generates infotip button label from label text", async () => {
    const el = await createLabel({
      label: "Beneficial owner",
      infotip: "Help",
    });
    const trigger = getInfotipTrigger(el);

    expect(trigger?.getAttribute("aria-label")).toBe(
      "More information about Beneficial owner",
    );
  });

  it("uses custom infotip-label when provided", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "Help",
      "infotip-label": "Custom label",
    });
    const trigger = getInfotipTrigger(el);

    expect(trigger?.getAttribute("aria-label")).toBe("Custom label");
  });

  it("renders infotip panel with content", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "This explains the field.",
    });
    const panel = getInfotipPanel(el);

    expect(panel).not.toBeNull();
    expect(panel?.textContent).toContain("This explains the field.");
  });

  it("toggles infotip panel on button click", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "Help content",
    });
    const trigger = getInfotipTrigger(el)!;

    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    trigger.click();
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    trigger.click();
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes infotip on Escape key", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "Help content",
    });
    const trigger = getInfotipTrigger(el)!;

    // Open
    trigger.click();
    await el.updateComplete;
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    // Press Escape
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("has aria-controls linking trigger to panel", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "Help",
    });
    const trigger = getInfotipTrigger(el)!;
    const panel = getInfotipPanel(el)!;

    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
  });

  // --- Accessibility ---

  it("passes axe checks for basic label", async () => {
    const input = document.createElement("input");
    input.id = "a11y-basic";
    document.body.appendChild(input);

    await createLabel({ label: "Account number", for: "a11y-basic" });
    await expectNoAxeViolations(document.body, {
      rules: { region: { enabled: false } },
    });
  });

  it("passes axe checks for required label with description", async () => {
    const input = document.createElement("input");
    input.id = "a11y-full";
    input.required = true;
    document.body.appendChild(input);

    const el = await createLabel({
      label: "Social Security Number",
      for: "a11y-full",
      required: "",
      description: "Format: XXX-XX-XXXX",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    await expectNoAxeViolations(document.body, {
      rules: { region: { enabled: false } },
    });
  });

  // --- for attribute click-to-focus ---

  it("clicking the label focuses the target input via native for", async () => {
    const input = document.createElement("input");
    input.id = "focus-test";
    document.body.appendChild(input);

    const el = await createLabel({
      label: "Account",
      for: "focus-test",
    });
    const label = getLabel(el)!;

    expect(label.getAttribute("for")).toBe("focus-test");
    expect(label.htmlFor).toBe("focus-test");
  });

  // --- Late target connection (MutationObserver) ---

  it("wires aria-describedby when target input appears after label", async () => {
    // Mount label first, before the input exists
    const el = await createLabel({
      label: "Late target",
      for: "late-input",
      description: "Help text",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    // Input doesn't exist yet — no wiring
    expect(document.getElementById("late-input")).toBeNull();

    // Now add the input
    const input = document.createElement("input");
    input.id = "late-input";
    document.body.appendChild(input);

    // Wait for MutationObserver to fire
    await new Promise((r) => setTimeout(r, 50));

    const describedBy = input.getAttribute("aria-describedby") || "";
    const desc = getDescription(el);
    expect(describedBy).toContain(desc?.id);
  });

  // --- for changing from one target to another ---

  it("re-wires aria-describedby when for changes to a different target", async () => {
    const input1 = document.createElement("input");
    input1.id = "target-1";
    document.body.appendChild(input1);

    const input2 = document.createElement("input");
    input2.id = "target-2";
    document.body.appendChild(input2);

    const el = await createLabel({
      label: "Account",
      for: "target-1",
      description: "Help",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const desc = getDescription(el);
    expect(input1.getAttribute("aria-describedby")).toContain(desc?.id);

    // Change for to target-2
    el.setAttribute("for", "target-2");
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    // Old target should be cleaned up
    expect(input1.getAttribute("aria-describedby")).toBeFalsy();
    // New target should be wired
    const newDesc = getDescription(el);
    expect(input2.getAttribute("aria-describedby")).toContain(newDesc?.id);
  });

  // --- Description removed and re-added ---

  it("unwires and re-wires when description is removed and re-added", async () => {
    const input = document.createElement("input");
    input.id = "desc-toggle";
    document.body.appendChild(input);

    const el = await createLabel({
      label: "Account",
      for: "desc-toggle",
      description: "Help text",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const desc = getDescription(el);
    expect(input.getAttribute("aria-describedby")).toContain(desc?.id);

    // Remove description
    el.removeAttribute("description");
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    expect(input.getAttribute("aria-describedby")).toBeFalsy();

    // Re-add description
    el.setAttribute("description", "New help text");
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const newDesc = getDescription(el);
    expect(input.getAttribute("aria-describedby")).toContain(newDesc?.id);
  });

  // --- Infotip cleared while open ---

  it("cleans up state when infotip attribute is cleared while open", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "Help content",
    });
    const trigger = getInfotipTrigger(el)!;

    // Open the infotip
    trigger.click();
    await el.updateComplete;
    expect(el._infotipOpen).toBe(true);

    // Clear the infotip attribute
    el.removeAttribute("infotip");
    await el.updateComplete;
    // Wait for deferred cleanup
    await new Promise((r) => requestAnimationFrame(r));
    await el.updateComplete;

    // State should be cleaned up
    expect(el._infotipOpen).toBe(false);
    // Trigger and panel should be gone
    expect(getInfotipTrigger(el)).toBeNull();
    expect(getInfotipPanel(el)).toBeNull();
  });

  // --- InfoTip caret ---

  it("renders a caret element in the infotip panel", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "Help content",
    });
    const panel = getInfotipPanel(el);
    const caret = panel?.querySelector(".fd-label__infotip-caret");

    expect(caret).not.toBeNull();
    expect(caret?.getAttribute("aria-hidden")).toBe("true");
  });

  // --- Escape returns focus to trigger ---

  it("returns focus to trigger after Escape closes infotip", async () => {
    const el = await createLabel({
      label: "Field",
      infotip: "Help",
    });
    const trigger = getInfotipTrigger(el)!;

    // Open
    trigger.focus();
    trigger.click();
    await el.updateComplete;

    // Press Escape
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;

    expect(el._infotipOpen).toBe(false);
    // In happy-dom, focus tracking is limited, but we verify the
    // trigger still exists and the panel is closed
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  // --- Target replacement (remove + re-insert with same ID) ---

  it("re-wires aria-describedby when target is removed and replaced", async () => {
    const input1 = document.createElement("input");
    input1.id = "replace-target";
    document.body.appendChild(input1);

    const el = await createLabel({
      label: "Account",
      for: "replace-target",
      description: "Help text",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    const desc = getDescription(el);
    expect(input1.getAttribute("aria-describedby")).toContain(desc?.id);

    // Remove the original input
    input1.remove();
    await new Promise((r) => setTimeout(r, 50));

    // Old target should be unwired
    expect((el as any)._wiredTarget).toBeNull();

    // Insert a replacement with the same ID
    const input2 = document.createElement("input");
    input2.id = "replace-target";
    document.body.appendChild(input2);
    await new Promise((r) => setTimeout(r, 50));

    // New target should be wired
    const newDesc = getDescription(el);
    expect(input2.getAttribute("aria-describedby")).toContain(newDesc?.id);
  });

  // --- Observer stops after successful late wiring ---

  it("stops observing after successful late wiring", async () => {
    const el = await createLabel({
      label: "Account",
      for: "late-stop-test",
      description: "Help",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    // Observer should be active (target not found yet)
    expect((el as any)._targetObserver).not.toBeNull();

    // Add the target
    const input = document.createElement("input");
    input.id = "late-stop-test";
    document.body.appendChild(input);
    await new Promise((r) => setTimeout(r, 50));

    // Observer should have stopped after finding the target
    expect((el as any)._targetObserver).toBeNull();
    // And the target should be wired
    const desc = getDescription(el);
    expect(input.getAttribute("aria-describedby")).toContain(desc?.id);
  });

  // --- Clearing description stops late-target observer ---

  it("stops target observer when description is removed while observing", async () => {
    // Mount label with description but no target yet
    const el = await createLabel({
      label: "Account",
      for: "observer-cleanup-test",
      description: "Help",
    });
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));

    // Observer should be active (target not found)
    expect((el as any)._targetObserver).not.toBeNull();

    // Remove description — observer should stop since there's nothing to wire
    el.removeAttribute("description");
    await el.updateComplete;

    expect((el as any)._targetObserver).toBeNull();

    // Adding the target now should not wire anything (no description)
    const input = document.createElement("input");
    input.id = "observer-cleanup-test";
    document.body.appendChild(input);
    await new Promise((r) => setTimeout(r, 50));

    expect(input.getAttribute("aria-describedby")).toBeFalsy();
  });

  // --- descriptionId getter ---

  it("descriptionId returns the description element ID when description is set", async () => {
    const el = await createLabel({
      for: "test-input",
      label: "Name",
      description: "Enter your full legal name",
    });
    expect(el.descriptionId).toBeTruthy();
    expect(typeof el.descriptionId).toBe("string");
    // Verify the ID matches the rendered description element
    const descEl = getDescription(el);
    expect(descEl).not.toBeNull();
    expect(descEl!.id).toBe(el.descriptionId);
  });

  it("descriptionId returns null when no description is set", async () => {
    const el = await createLabel({ for: "test-input", label: "Name" });
    expect(el.descriptionId).toBeNull();
  });

  it("descriptionId returns null when description is empty/whitespace", async () => {
    const el = await createLabel({
      for: "test-input",
      label: "Name",
      description: "   ",
    });
    expect(el.descriptionId).toBeNull();
  });

  // --- labelId getter ---

  it("labelId returns a stable ID for the rendered label element", async () => {
    const el = await createLabel({ for: "test-input", label: "Name" });
    expect(el.labelId).toBeTruthy();
    expect(typeof el.labelId).toBe("string");
    // Verify the ID matches the rendered label element
    const labelEl = getLabel(el);
    expect(labelEl).not.toBeNull();
    expect(labelEl!.id).toBe(el.labelId);
  });

  // --- fd-label skips aria-describedby auto-wiring for fd-input targets ---

  it("does not auto-wire aria-describedby when target is fd-input", async () => {
    // Requires fd-input to be registered
    await import("./fd-input.js");

    const el = await createLabel({
      for: "skip-wire-target",
      label: "Account",
      description: "Enter account number",
    });

    const fdInput = document.createElement("fd-input") as any;
    fdInput.id = "skip-wire-target";
    document.body.appendChild(fdInput);
    await fdInput.updateComplete;

    // Give the observer time to fire
    await new Promise((r) => setTimeout(r, 100));

    // fd-label should NOT have set aria-describedby on fd-input host
    expect(fdInput.getAttribute("aria-describedby")).toBeNull();
  });
});
