import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-confirmation-record.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createRecord() {
  const el = document.createElement("fd-confirmation-record") as any;
  el.heading = "Filing update received";
  el.summary =
    "We received the filing update and assigned a confirmation number.";
  el.referenceLabel = "Confirmation number";
  el.referenceValue = "CMS-2026-004182";
  el.nextSteps =
    "A reviewer will email the filing contact if clarification is needed.";
  el.recordNote =
    "Keep this number until the filing review is complete.";
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdConfirmationRecord", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-confirmation-record", () => {
    expect(customElements.get("fd-confirmation-record")).toBeDefined();
  });

  it("renders completion, reference, next steps, and record note content", async () => {
    const el = await createRecord();

    expect(el.shadowRoot?.querySelector('[part="heading"]')?.textContent?.trim()).toBe(
      "Filing update received",
    );
    expect(
      el.shadowRoot?.querySelector('[part="reference-value"]')?.textContent?.trim(),
    ).toBe("CMS-2026-004182");
    expect(
      el.shadowRoot?.querySelector('[part="next-steps"]')?.textContent?.trim(),
    ).toContain("reviewer will email");
    expect(
      el.shadowRoot?.querySelector('[part="record-note"]')?.textContent?.trim(),
    ).toBe("Keep this number until the filing review is complete.");
  });

  it("renders authored actions through the actions slot", async () => {
    const el = await createRecord();
    const action = document.createElement("a");
    action.slot = "actions";
    action.href = "/print";
    action.textContent = "Print confirmation";
    el.appendChild(action);
    await el.updateComplete;

    const assigned = el.shadowRoot?.querySelector("slot")?.assignedElements();
    expect(assigned).toHaveLength(1);
    expect((assigned?.[0] as HTMLAnchorElement).href).toContain("/print");
  });

  it("has no axe violations", async () => {
    const region = document.createElement("main");
    document.body.appendChild(region);
    const el = document.createElement("fd-confirmation-record") as any;
    el.heading = "Filing update received";
    el.referenceValue = "CMS-2026-004182";
    region.appendChild(el);
    await el.updateComplete;

    await expectNoAxeViolations(region);
  });
});
