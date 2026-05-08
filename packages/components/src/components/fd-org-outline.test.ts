import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-org-outline.js";
import { FdOrgOutline } from "./fd-org-outline.js";
import { FD_ORG_UNATTACHED_ID, normalizeOrgTree } from "./org-chart-normalize.js";
import { printDecision } from "./org-chart-types.js";
import { dirOrgFixture } from "./org-chart-fixtures/fixture.dir.js";
import { fdicShapeOrgFixture } from "./org-chart-fixtures/fixture.fdic-shape.js";
import { largeOrgFixture } from "./org-chart-fixtures/fixture.large.js";
import { malformedOrgFixture } from "./org-chart-fixtures/fixture.malformed.js";
import { minimalOrgFixture } from "./org-chart-fixtures/fixture.minimal.js";
import { statesOrgFixture } from "./org-chart-fixtures/fixture.states.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createOutline(fixture = minimalOrgFixture) {
  const result = normalizeOrgTree(fixture);
  const el = document.createElement("fd-org-outline") as FdOrgOutline;
  el.tree = result.tree;
  document.body.appendChild(el);
  await el.updateComplete;
  return { el, result };
}

function getNodeButtons(el: FdOrgOutline) {
  return Array.from(
    el.shadowRoot!.querySelectorAll<HTMLElement>("summary,[part~='node-button']"),
  );
}

describe("fd-org-outline", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-org-outline", () => {
    expect(customElements.get("fd-org-outline")).toBeDefined();
  });

  it("normalizes expected fixtures without diagnostics", () => {
    for (const fixture of [
      minimalOrgFixture,
      fdicShapeOrgFixture,
      statesOrgFixture,
      largeOrgFixture,
      dirOrgFixture,
    ]) {
      expect(normalizeOrgTree(fixture).diagnostics).toEqual([]);
    }
  });

  it("keeps malformed org records renderable with diagnostics", () => {
    const { tree, diagnostics } = normalizeOrgTree(malformedOrgFixture);

    expect(diagnostics.map((diagnostic) => diagnostic.type)).toEqual([
      "missing-required-field",
      "conflicting-duplicate",
      "orphan",
      "cycle",
    ]);
    // The synthetic Unattached parent and the orphan record both keep
    // in-spec source statuses; the diagnostics carry the actual issue.
    expect(tree.nodesById[FD_ORG_UNATTACHED_ID].sourceStatus).toBe("historical");
    expect(tree.nodesById.orphan.sourceStatus).toBe("official");
    expect(tree.nodesById["duplicate-conflict"].sourceStatus).toBe("official");
    expect(tree.nodesById["missing-label"].label).toBe("Unnamed org record");
    expect(diagnostics.find((diagnostic) => diagnostic.type === "conflicting-duplicate")?.fields).toEqual(
      expect.arrayContaining(["label", "sourceStatus"]),
    );
  });

  it("dedupes exact duplicates silently", () => {
    const { tree, diagnostics } = normalizeOrgTree(malformedOrgFixture);

    expect(tree.nodesById["duplicate-exact"].childrenIds).toEqual([]);
    expect(Object.keys(tree.nodesById).filter((id) => id.startsWith("duplicate-exact"))).toHaveLength(1);
    expect(diagnostics.some((diagnostic) => diagnostic.nodeId === "duplicate-exact")).toBe(false);
  });

  it("preserves object-form source metadata and stable normalization output", () => {
    const input = {
      nodes: minimalOrgFixture,
      source: { source: "fixture" as const, label: "Fixture source" },
    };
    const first = normalizeOrgTree(input);
    const second = normalizeOrgTree(input);

    expect(first.tree.source?.label).toBe("Fixture source");
    expect(second).toEqual(first);
  });

  it("renders semantic lists and native disclosure without tree role", async () => {
    const { el } = await createOutline(fdicShapeOrgFixture);

    expect(el.shadowRoot!.querySelector("ul")).toBeTruthy();
    expect(el.shadowRoot!.querySelector("li")).toBeTruthy();
    expect(el.shadowRoot!.querySelector("details")).toBeTruthy();
    expect(el.shadowRoot!.querySelector("[role='tree']")).toBeNull();
    await expectNoAxeViolations(el);
  });

  it("emits selected node details from native tab stops", async () => {
    const { el } = await createOutline();
    let detail: unknown;

    el.addEventListener("fd-org-select", (event) => {
      detail = (event as CustomEvent).detail;
    });

    getNodeButtons(el).at(-1)?.click();

    expect(detail).toMatchObject({
      nodeId: "person-rivera",
    });
  });

  it("filters search results while keeping hierarchy context", async () => {
    const { el } = await createOutline(fdicShapeOrgFixture);

    el.searchQuery = "Jordan";
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain("Jordan Patel");
    expect(el.shadowRoot!.textContent).toContain("Federal Deposit Insurance Corporation");
    expect(el.shadowRoot!.textContent).not.toContain("Consumer Response Center");
  });

  it("exposes ambient issue level on tiles without rendering status badges", async () => {
    const { el } = await createOutline(statesOrgFixture);
    const root = el.shadowRoot!;
    const itemFor = (id: string) => {
      const span = root.getElementById(`${id}__issue`);
      return span?.closest<HTMLLIElement>("[part~='item']");
    };

    expect(root.querySelectorAll("fd-badge")).toHaveLength(0);
    expect(itemFor("sam-taylor")?.dataset.issueLevel).toBe("warn"); // acting
    expect(itemFor("branch-chief")?.dataset.issueLevel).toBe("warn"); // override
    expect(itemFor("vacant-analyst")?.dataset.issueLevel).toBe("warn"); // vacancy
    const items = Array.from(root.querySelectorAll<HTMLLIElement>("[part~='item']"));
    const officialLeaf = items.find(
      (item) =>
        item.querySelector("[part~='label']")?.textContent?.trim() === "Jordan Pierce",
    );
    expect(officialLeaf?.dataset.issueLevel).toBe("none");
  });

  it("sorts branches first and pushes vacancies to the bottom", async () => {
    const { el } = await createOutline(statesOrgFixture);
    el.shadowRoot!
      .querySelectorAll<HTMLDetailsElement>("details")
      .forEach((d) => (d.open = true));
    await el.updateComplete;
    const root = el.shadowRoot!;
    const items = Array.from(root.querySelectorAll<HTMLLIElement>("[part~='item']"));
    const labelsUnder = (parentLabel: string) => {
      const parent = items.find(
        (item) =>
          item.querySelector("[part~='label']")?.textContent?.trim() === parentLabel,
      )!;
      const lists = Array.from(
        parent.querySelectorAll<HTMLElement>("[part~='list']"),
      ).filter((list) => list.parentElement?.closest("[part~='item']") === parent);
      return lists.flatMap((list) =>
        Array.from(list.children).map((item) =>
          (item as HTMLElement).querySelector("[part~='label']")?.textContent?.trim(),
        ),
      );
    };

    // Director's children: branches (sections) first, then peer leaves.
    expect(labelsUnder("Avery Chen")).toEqual([
      "Programs Section",
      "Operations Section",
      "Proposed Deputy Director",
      "Legacy Review Team",
    ]);

    // Section chief's children: regular leaves first, vacancy last.
    expect(labelsUnder("Robin Kim")).toEqual([
      "Jordan Pierce",
      "Sam Taylor",
      "Vacant",
    ]);
  });

  it("orders DIR vacancies under Daniel Hoople below the active chief", async () => {
    const { el } = await createOutline(dirOrgFixture);
    el.shadowRoot!
      .querySelectorAll<HTMLDetailsElement>("details")
      .forEach((d) => (d.open = true));
    await el.updateComplete;
    const hoopleSpan = el.shadowRoot!.getElementById("hoople__issue") ?? null;
    // Hoople has no issue marker — find by its label instead.
    const hoopleItem = Array.from(
      el.shadowRoot!.querySelectorAll<HTMLLIElement>("[part~='item']"),
    ).find(
      (item) =>
        item.querySelector("[part~='label']")?.textContent?.trim() === "Daniel Hoople",
    )!;
    void hoopleSpan;
    const childList = hoopleItem.querySelector("[part~='list']")!;
    const labels = Array.from(
      childList.querySelectorAll<HTMLElement>("[part~='item']"),
    ).map((item) => item.querySelector("[part~='label']")?.textContent?.trim());
    expect(labels).toEqual(["Edward Garnett", "Vacant", "Vacant"]);
  });

  it("filters by acting assignment", async () => {
    const { el } = await createOutline(statesOrgFixture);

    el.filters = { actingOnly: true };
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain("Sam Taylor");
    expect(el.shadowRoot!.textContent).not.toContain("Jordan Pierce");
  });

  it("filters by editorial override source status", async () => {
    const { el } = await createOutline(statesOrgFixture);

    el.filters = { sourceStatuses: ["override"] };
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain("Branch Chief");
    expect(el.shadowRoot!.textContent).not.toContain("Jordan Pierce");
  });

  it("defines deterministic print thresholds for large and FDIC-shaped fixtures", () => {
    const large = printDecision(normalizeOrgTree(largeOrgFixture).tree, "all");
    const shaped = printDecision(normalizeOrgTree(fdicShapeOrgFixture).tree, "all");

    expect(large.mode).toBe("table");
    expect(large.metrics.nodeCount).toBeGreaterThan(350);
    expect(shaped.mode).toBe("outline");
    expect(shaped.metrics.estimatedChartPages).toBeLessThanOrEqual(4);
  });

  it("locks print decision node-count boundaries", () => {
    const buildFlatTree = (count: number) => {
      const nodes = Array.from({ length: count }, (_, index) => ({
        id: `node-${index}`,
        parentId: index === 0 ? undefined : "node-0",
        label: `Node ${index}`,
        nodeType: "unit" as const,
        sourceStatus: "official" as const,
      }));

      return normalizeOrgTree(nodes).tree;
    };

    expect(printDecision(buildFlatTree(175), "all").reason).toContain("V1 has no visual chart");
    expect(printDecision(buildFlatTree(176), "all").mode).toBe("outline");
    expect(printDecision(buildFlatTree(350), "all").mode).toBe("outline");
    expect(printDecision(buildFlatTree(351), "all").mode).toBe("table");
  });

  it("opens collapsed native disclosures for print and restores them after print", async () => {
    const { el } = await createOutline(fdicShapeOrgFixture);
    const details = el.shadowRoot!.querySelector("details")!;

    details.open = false;
    window.dispatchEvent(new Event("beforeprint"));
    expect(details.open).toBe(true);
    window.dispatchEvent(new Event("afterprint"));
    expect(details.open).toBe(false);
  });
});
