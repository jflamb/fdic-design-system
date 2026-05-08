import { beforeEach, describe, expect, it } from "vitest";
import "../../../register/fd-icon.js";
import { FdOrgToolbar } from "./fd-org-toolbar.js";
import { normalizeOrgTree } from "../../org-chart-normalize.js";
import { statesOrgFixture } from "../../org-chart-fixtures/fixture.states.js";

if (!customElements.get("fd-internal-org-toolbar")) {
  customElements.define("fd-internal-org-toolbar", FdOrgToolbar);
}

async function createToolbar() {
  const el = document.createElement("fd-internal-org-toolbar") as FdOrgToolbar;
  el.tree = normalizeOrgTree(statesOrgFixture).tree;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("fd-org-toolbar", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("does not surface a visual chart toggle", async () => {
    const el = await createToolbar();

    expect(el.shadowRoot!.textContent).not.toContain("Chart");
  });

  it("emits approved v1 filters only", async () => {
    const el = await createToolbar();
    const override = el.shadowRoot!.querySelector<HTMLInputElement>(
      "input[name='source-status'][value='override']",
    )!;
    const unit = el.shadowRoot!.querySelector<HTMLInputElement>(
      "input[name='node-type'][value='unit']",
    )!;
    let detail: unknown;

    el.addEventListener("fd-org-toolbar-change", (event) => {
      detail = (event as CustomEvent).detail;
    });

    override.click();
    unit.click();
    await el.updateComplete;

    expect(detail).toMatchObject({
      filters: {
        nodeTypes: ["unit"],
        sourceStatuses: ["override"],
      },
    });
    expect(el.shadowRoot!.textContent).not.toContain("Region");
    expect(el.shadowRoot!.textContent).not.toContain("Effective date");
    expect(el.shadowRoot!.textContent).not.toContain("Stale");
    expect(el.shadowRoot!.textContent).not.toContain("Unavailable");
  });

});
