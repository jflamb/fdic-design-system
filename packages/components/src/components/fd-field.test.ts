import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-field.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createField(innerHTML = ""): Promise<any> {
  const el = document.createElement("fd-field") as any;
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  // Wait for connectedCallback + requestAnimationFrame
  await new Promise((r) => requestAnimationFrame(r));
  // Wait for child updateComplete
  const input = el.querySelector("fd-input") as any;
  if (input) await input.updateComplete;
  const label = el.querySelector("fd-label") as any;
  if (label) await label.updateComplete;
  const message = el.querySelector("fd-message") as any;
  if (message) await message.updateComplete;
  return el;
}

describe("fd-field", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  // --- Registration ---

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-field")).toBeDefined();
  });

  // --- Auto-wiring ---

  it("auto-generates id on fd-input and for on fd-label and fd-message", async () => {
    const el = await createField(`
      <fd-label label="Email"></fd-label>
      <fd-input name="email"></fd-input>
      <fd-message message="Required"></fd-message>
    `);

    const input = el.querySelector("fd-input");
    const label = el.querySelector("fd-label");
    const message = el.querySelector("fd-message");

    expect(input.id).toMatch(/^fd-field-\d+$/);
    expect(label.getAttribute("for")).toBe(input.id);
    expect(message.getAttribute("for")).toBe(input.id);
  });

  it("respects pre-set id on fd-input", async () => {
    const el = await createField(`
      <fd-label label="Name"></fd-label>
      <fd-input id="custom-id" name="name"></fd-input>
      <fd-message message="Required"></fd-message>
    `);

    const input = el.querySelector("fd-input");
    const label = el.querySelector("fd-label");
    const message = el.querySelector("fd-message");

    expect(input.id).toBe("custom-id");
    expect(label.getAttribute("for")).toBe("custom-id");
    expect(message.getAttribute("for")).toBe("custom-id");
  });

  it("respects pre-set for on fd-label", async () => {
    const el = await createField(`
      <fd-label for="explicit" label="Name"></fd-label>
      <fd-input name="name"></fd-input>
    `);

    const label = el.querySelector("fd-label");
    expect(label.getAttribute("for")).toBe("explicit");
  });

  it("respects pre-set for on fd-message", async () => {
    const el = await createField(`
      <fd-input name="name"></fd-input>
      <fd-message for="explicit" message="Hint"></fd-message>
    `);

    const message = el.querySelector("fd-message");
    expect(message.getAttribute("for")).toBe("explicit");
  });

  // --- Missing children ---

  it("handles missing fd-label gracefully", async () => {
    const el = await createField(`
      <fd-input name="email"></fd-input>
      <fd-message message="Required"></fd-message>
    `);

    const input = el.querySelector("fd-input");
    const message = el.querySelector("fd-message");
    expect(input.id).toMatch(/^fd-field-\d+$/);
    expect(message.getAttribute("for")).toBe(input.id);
  });

  it("handles missing fd-message gracefully", async () => {
    const el = await createField(`
      <fd-label label="Name"></fd-label>
      <fd-input name="name"></fd-input>
    `);

    const input = el.querySelector("fd-input");
    const label = el.querySelector("fd-label");
    expect(input.id).toMatch(/^fd-field-\d+$/);
    expect(label.getAttribute("for")).toBe(input.id);
  });

  it("handles missing fd-input gracefully", async () => {
    // Should not throw
    const el = await createField(`
      <fd-label label="Name"></fd-label>
      <fd-message message="Hint"></fd-message>
    `);

    const label = el.querySelector("fd-label");
    const message = el.querySelector("fd-message");
    // for is set to the generated field ID even without an input
    expect(label.getAttribute("for")).toMatch(/^fd-field-\d+$/);
    expect(message.getAttribute("for")).toMatch(/^fd-field-\d+$/);
  });

  // --- Cardinality warnings ---

  it("warns on multiple fd-input direct children", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await createField(`
      <fd-input name="a"></fd-input>
      <fd-input name="b"></fd-input>
    `);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Multiple fd-input"),
    );
    warnSpy.mockRestore();
  });

  it("warns on multiple fd-label direct children", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await createField(`
      <fd-label label="First"></fd-label>
      <fd-label label="Second"></fd-label>
      <fd-input name="a"></fd-input>
    `);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Multiple fd-label"),
    );
    warnSpy.mockRestore();
  });

  it("warns on multiple fd-message direct children", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await createField(`
      <fd-input name="a"></fd-input>
      <fd-message message="First"></fd-message>
      <fd-message message="Second"></fd-message>
    `);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Multiple fd-message"),
    );
    warnSpy.mockRestore();
  });

  it("warns on nested fd-field", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const outer = document.createElement("fd-field") as any;
    document.body.appendChild(outer);
    await new Promise((r) => requestAnimationFrame(r));

    const inner = document.createElement("fd-field") as any;
    outer.appendChild(inner);
    await new Promise((r) => requestAnimationFrame(r));
    // Trigger inner's validation
    await new Promise((r) => requestAnimationFrame(r));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Nested fd-field"),
    );
    warnSpy.mockRestore();
  });

  it("only wires first fd-input when multiple exist", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const el = await createField(`
      <fd-input name="a"></fd-input>
      <fd-input name="b"></fd-input>
    `);

    const inputs = el.querySelectorAll("fd-input");
    expect(inputs[0].id).toMatch(/^fd-field-\d+$/);
    // Second input should NOT get an auto-generated id
    expect(inputs[1].id).toBe("");

    vi.restoreAllMocks();
  });

  // --- Direct children only ---

  it("does not wire descendants inside nested elements", async () => {
    const el = await createField(`
      <fd-label label="Outer"></fd-label>
      <fd-input name="outer"></fd-input>
      <div>
        <fd-input name="nested"></fd-input>
      </div>
    `);

    const outerInput = el.querySelector(":scope > fd-input");
    const nestedInput = el.querySelector("div > fd-input");
    expect(outerInput.id).toMatch(/^fd-field-\d+$/);
    // Nested input should not be wired
    expect(nestedInput.id).toBe("");
  });

  // --- Late-added children ---

  it("wires late-added fd-input", async () => {
    const el = await createField(`
      <fd-label label="Name"></fd-label>
    `);

    const input = document.createElement("fd-input") as any;
    input.setAttribute("name", "name");
    el.appendChild(input);

    // Wait for MutationObserver
    await new Promise((r) => setTimeout(r, 50));

    expect(input.id).toMatch(/^fd-field-\d+$/);
    const label = el.querySelector("fd-label");
    expect(label.getAttribute("for")).toBe(input.id);
  });

  // --- Accessibility ---

  // axe-core cannot follow <label for> → form-associated custom element → shadow DOM <input>,
  // so label rules are disabled. The FACE labeling contract is verified by the wiring tests.
  const axeOverrides = {
    rules: {
      label: { enabled: false },
      "label-title-only": { enabled: false },
      region: { enabled: false },
    },
  };

  it("has no axe violations (basic composition)", async () => {
    const el = await createField(`
      <fd-label label="Email"></fd-label>
      <fd-input name="email" type="email"></fd-input>
      <fd-message message="Enter your email address"></fd-message>
    `);

    // Wait for all children to render
    const input = el.querySelector("fd-input") as any;
    await input.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    await input.updateComplete;

    await expectNoAxeViolations(document.body, axeOverrides);
  });
});
