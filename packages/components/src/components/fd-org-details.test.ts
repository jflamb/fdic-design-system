import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-org-details.js";
import { FdOrgDetails } from "./fd-org-details.js";
import { normalizeOrgTree } from "./org-chart-normalize.js";
import { statesOrgFixture } from "./org-chart-fixtures/fixture.states.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createDetails(nodeId = "branch-chief") {
  const el = document.createElement("fd-org-details") as FdOrgDetails;
  el.tree = normalizeOrgTree(statesOrgFixture).tree;
  el.nodeId = nodeId;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("fd-org-details", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-org-details", () => {
    expect(customElements.get("fd-org-details")).toBeDefined();
  });

  it("announces selected details politely without dialog semantics", async () => {
    const el = await createDetails();
    const panel = el.shadowRoot!.querySelector("[part='panel']");
    const live = el.shadowRoot!.querySelector("[part='live']");

    expect(panel?.getAttribute("aria-label")).toBe("Organization details");
    expect(panel?.hasAttribute("aria-live")).toBe(false);
    expect(live?.getAttribute("aria-live")).toBe("polite");
    expect(panel?.getAttribute("role")).not.toBe("dialog");
    await expectNoAxeViolations(el);
  });

  it("renders an accessible empty state", async () => {
    const el = await createDetails("");
    const panel = el.shadowRoot!.querySelector("[part='panel']");

    expect(panel?.textContent).toContain("Select an organization record");
    await expectNoAxeViolations(el);
  });

  it("renders conflict comparison with explicit source and override labels", async () => {
    const el = await createDetails("branch-chief");

    expect(el.shadowRoot!.textContent).toContain("Conflict comparison");
    expect(el.shadowRoot!.textContent).toContain("Source of truth");
    expect(el.shadowRoot!.textContent).toContain("Override");
  });

  it("renders acting assignment metadata for an acting record", async () => {
    const el = await createDetails("sam-taylor");

    expect(el.shadowRoot!.textContent).toContain("Acting assignment");
    expect(el.shadowRoot!.textContent).toContain("2026-03-15");
    expect(el.shadowRoot!.textContent).toContain("Editor review");
  });

  it("renders editorial override metadata for an overridden record", async () => {
    const el = await createDetails("branch-chief");

    expect(el.shadowRoot!.textContent).toContain("Editorial override");
    expect(el.shadowRoot!.textContent).toContain("Reports-to override");
  });

  it("renders source provenance with provider, last-verified, and effective range", async () => {
    const el = await createDetails("office-root");
    const text = el.shadowRoot!.textContent ?? "";

    expect(text).toContain("Provider");
    expect(text).toContain("Editor review fixture");
    expect(text).toContain("Last verified");
    expect(text).toContain("2026-05-08");
  });

  it("formats effective dates as a range when both ends are provided", async () => {
    const tree = normalizeOrgTree([
      {
        id: "person-rivera",
        label: "Alex Rivera",
        title: "Deputy Director",
        nodeType: "person",
        sourceStatus: "historical",
        effectiveStart: "2024-01-01",
        effectiveEnd: "2024-12-31",
      },
    ]).tree;
    const el = document.createElement("fd-org-details") as FdOrgDetails;
    el.tree = tree;
    el.nodeId = "person-rivera";
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain("2024-01-01 to 2024-12-31");
  });
});
