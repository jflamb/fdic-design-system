import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-form-field.js";
import "../register/fd-input.js";
import "../register/fd-radio-group.js";
import "../register/fd-file-input.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createField(markup = "") {
  const el = document.createElement("fd-form-field") as any;
  el.innerHTML = markup;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const controls = el.querySelectorAll(
    "fd-input, fd-radio-group, fd-file-input, fd-label, fd-message",
  ) as NodeListOf<any>;

  for (const control of controls) {
    await control.updateComplete;
  }

  return el;
}

describe("FdFormField", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-form-field", () => {
    expect(customElements.get("fd-form-field")).toBeDefined();
  });

  it("manages text-entry label, description, error, and id wiring", async () => {
    const el = await createField(`<fd-input name="routing-number"></fd-input>`);

    el.label = "Routing number";
    el.description = "Enter the 9-digit number used for this transfer report.";
    el.error = "Enter the 9-digit routing number.";
    el.required = true;
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const label = el.querySelector(
      'fd-label[data-fd-form-field-owned="label"]',
    ) as any;
    const input = el.querySelector("fd-input") as any;
    const message = el.querySelector(
      'fd-message[data-fd-form-field-owned="error"]',
    ) as any;

    expect(input.id).toMatch(/^fd-form-field-\d+$/);
    expect(label.getAttribute("for")).toBe(input.id);
    expect(label.label).toBe("Routing number");
    expect(label.description).toBe(
      "Enter the 9-digit number used for this transfer report.",
    );
    expect(message.getAttribute("for")).toBe(input.id);
    expect(message.state).toBe("error");
    expect(message.message).toBe("Enter the 9-digit routing number.");
  });

  it("respects explicit field-id and optional affordance for text-entry controls", async () => {
    const el = await createField(`<fd-input name="institution-name"></fd-input>`);

    el.label = "Institution name";
    el.fieldId = "institution-name";
    el.optional = true;
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const label = el.querySelector("fd-label") as any;
    const input = el.querySelector("fd-input") as any;

    expect(input.id).toBe("institution-name");
    expect(label.getAttribute("for")).toBe("institution-name");
    expect(label.label).toBe("Institution name (optional)");
  });

  it("projects grouped-control content through the child group's public API", async () => {
    const el = await createField(`
      <fd-radio-group>
        <fd-radio name="contact-method" value="email">Email</fd-radio>
        <fd-radio name="contact-method" value="phone">Phone</fd-radio>
      </fd-radio-group>
    `);

    el.label = "Preferred follow-up method";
    el.description = "Choose the method you monitor during the filing window.";
    el.error = "Select how we should contact you if a reviewer needs clarification.";
    el.required = true;
    el.invalid = true;
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const group = el.querySelector("fd-radio-group") as HTMLElement;
    const legend = group.querySelector('[slot="legend"]');
    const description = group.querySelector('[slot="description"]');
    const error = group.querySelector('[slot="error"]');

    expect(group.getAttribute("data-user-invalid")).toBe("");
    expect(legend?.textContent?.trim()).toBe("Preferred follow-up method");
    expect(description?.textContent?.trim()).toBe(
      "Choose the method you monitor during the filing window.",
    );
    expect(error?.textContent?.trim()).toBe(
      "Select how we should contact you if a reviewer needs clarification.",
    );
  });

  it("maps file-input copy through the managed contract", async () => {
    const el = await createField(`<fd-file-input name="supporting-document"></fd-file-input>`);

    el.label = "Supporting document";
    el.description = "Upload the signed filing support letter.";
    el.error = "Select a file before you continue.";
    el.required = true;
    el.invalid = true;
    await el.updateComplete;

    const input = el.querySelector("fd-file-input") as any;

    expect(input.label).toBe("Supporting document");
    expect(input.hint).toBe("Upload the signed filing support letter.");
    expect(input.errorMessage).toBe("Select a file before you continue.");
    expect(input.required).toBe(true);
    expect(input.getAttribute("data-user-invalid")).toBe("");
  });

  it("warns when no supported direct control child is present", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await createField(`<div>Manual content only</div>`);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("No supported direct control child found"),
    );
    warnSpy.mockRestore();
  });

  it("has no axe violations for managed text-entry composition", async () => {
    const region = document.createElement("main");
    document.body.appendChild(region);
    const el = document.createElement("fd-form-field") as any;
    el.innerHTML = `<fd-input name="routing-number"></fd-input>`;
    region.appendChild(el);

    el.label = "Routing number";
    el.description = "Enter the 9-digit number used for this transfer report.";
    el.error = "Enter the 9-digit routing number.";
    el.required = true;
    await el.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    await expectNoAxeViolations(region);
  });
});
