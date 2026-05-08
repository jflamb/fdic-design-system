import { beforeEach, describe, expect, it } from "vitest";
import { FdOrgContextBar } from "./fd-org-context-bar.js";
import { normalizeOrgTree } from "../../org-chart-normalize.js";
import { minimalOrgFixture } from "../../org-chart-fixtures/fixture.minimal.js";

if (!customElements.get("fd-internal-org-context-bar")) {
  customElements.define("fd-internal-org-context-bar", FdOrgContextBar);
}

describe("fd-org-context-bar", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders selected hierarchy path and source freshness", async () => {
    const el = document.createElement("fd-internal-org-context-bar") as FdOrgContextBar;
    el.tree = normalizeOrgTree({
      nodes: minimalOrgFixture,
      source: { source: "fixture", label: "Fixture", fetchedAt: "2026-05-08" },
    }).tree;
    el.nodeId = "person-rivera";
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain("Division of Risk Management Supervision");
    expect(el.shadowRoot!.textContent).toContain("Alex Rivera");
    expect(el.shadowRoot!.textContent).toContain("Fixture");
  });
});
