import { describe, expect, it, beforeEach } from "vitest";
import { largeOrgFixture } from "../../org-chart-fixtures/fixture.large.js";
import { statesOrgFixture } from "../../org-chart-fixtures/fixture.states.js";
import { normalizeOrgTree } from "../../org-chart-normalize.js";
import { printDecision } from "../../org-chart-types.js";
import {
  FdOrgPrintChart,
  layoutOrgPrintChart,
} from "./fd-org-print-chart.js";

if (!customElements.get("fd-internal-org-print-chart")) {
  customElements.define("fd-internal-org-print-chart", FdOrgPrintChart);
}

describe("fd-internal-org-print-chart", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("opts into chart print decisions without changing the v1 default", () => {
    const tree = normalizeOrgTree(statesOrgFixture).tree;

    expect(printDecision(tree, "all").mode).toBe("outline");
    expect(
      printDecision(tree, "selected-branch", "avery-chen", {
        visualChartAvailable: true,
      }).mode,
    ).toBe("chart");
  });

  it("computes a printable layout from normalized hierarchy data", () => {
    const tree = normalizeOrgTree(statesOrgFixture).tree;
    const layout = layoutOrgPrintChart(tree, "selected-branch", "avery-chen");

    expect(layout).not.toBeNull();
    expect(layout!.nodes.map((node) => node.id)).toContain("avery-chen");
    expect(layout!.links.length).toBeGreaterThan(0);
    expect(layout!.width).toBeGreaterThan(300);
    expect(layout!.height).toBeGreaterThan(200);
  });

  it("renders SVG cards with text status labels", async () => {
    const tree = normalizeOrgTree(statesOrgFixture).tree;
    const el = document.createElement(
      "fd-internal-org-print-chart",
    ) as FdOrgPrintChart;
    el.tree = tree;
    el.scope = "selected-branch";
    el.selectedNodeId = "avery-chen";
    document.body.appendChild(el);
    await el.updateComplete;

    const svg = el.shadowRoot!.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("role")).toBe("img");
    expect(el.shadowRoot!.textContent).toContain("Official");
  });

  it("falls back when the scoped hierarchy exceeds chart thresholds", async () => {
    const tree = normalizeOrgTree(largeOrgFixture).tree;
    const el = document.createElement(
      "fd-internal-org-print-chart",
    ) as FdOrgPrintChart;
    el.tree = tree;
    el.scope = "all";
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector("svg")).toBeNull();
    expect(el.shadowRoot!.textContent).toContain("Hierarchy/table print selected");
  });
});
