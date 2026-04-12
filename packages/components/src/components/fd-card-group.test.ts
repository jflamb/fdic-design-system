import { describe, expect, it } from "vitest";
import { FdCardGroup } from "./fd-card-group.js";
import "../register/fd-card.js";
import "../register/fd-card-group.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createGroup(
  props: Partial<HTMLElement & {
    columns?: "2" | "3" | "4";
    label?: string;
  }> = {},
) {
  const el = document.createElement("fd-card-group") as HTMLElement & {
    columns?: "2" | "3" | "4";
    label?: string;
    updateComplete: Promise<void>;
  };
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdCardGroup", () => {
  it("registers fd-card-group", () => {
    expect(customElements.get("fd-card-group")).toBeDefined();
  });

  it("renders a labelled list container", async () => {
    const el = await createGroup({ label: "Featured updates" });

    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Featured updates");
    expect(el.getAttribute("columns")).toBe("3");

  });

  it("normalizes invalid columns values back to the default recipe", async () => {
    const el = await createGroup();
    el.setAttribute("columns", "5");

    await el.updateComplete;
    await el.updateComplete;

    expect(el.columns).toBe("3");
    expect(el.getAttribute("columns")).toBe("3");
  });

  it("assigns listitem semantics to slotted fd-card children", async () => {
    const group = document.createElement("fd-card-group") as HTMLElement & {
      updateComplete: Promise<void>;
    };
    const card = document.createElement("fd-card") as HTMLElement & {
      category: string;
      title: string;
      metadata: string;
      updateComplete: Promise<void>;
    };

    card.category = "News";
    card.title = "Quarterly banking profile";
    card.metadata = "April 3, 2026";

    group.append(card);
    document.body.appendChild(group);

    await group.updateComplete;
    await card.updateComplete;

    expect(card.getAttribute("role")).toBe("listitem");

    card.setAttribute("role", "presentation");
    await Promise.resolve();

    expect(card.getAttribute("role")).toBe("listitem");

  });

  it("defines Figma-backed column constraints in the component stylesheet", async () => {
    const el = document.createElement("fd-card-group") as HTMLElement & {
      columns?: "2" | "3" | "4";
      updateComplete: Promise<void>;
    };
    el.columns = "4";

    document.body.appendChild(el);
    await el.updateComplete;

    const styles = FdCardGroup.styles
      .map((value) => value.cssText)
      .join("\n");

    expect(styles).toContain("var(--fd-card-group-col-4-min, var(--ds-layout-col-4-min))");
    expect(styles).toContain("var(--fd-card-group-col-4-max, var(--ds-layout-col-4-max))");
    expect(styles).toContain("var(--fd-card-group-col-4-gap, var(--ds-layout-col-4-gap))");
    expect(styles).toContain("var(--fd-card-group-col-4-min-mobile, var(--ds-layout-col-4-min-narrow))");
    expect(styles).toContain("var(--fd-card-group-col-4-max-mobile, var(--ds-layout-col-4-max-narrow))");
    expect(styles).toContain("var(--fd-card-group-col-4-gap-mobile, var(--ds-layout-col-4-gap-narrow))");
    expect(styles).toContain("@container (max-width: 815px)");
    expect(styles).toContain("1fr");
  });

  it.each([
    ["2"],
    ["4"],
  ])("preserves the supported %s-column recipe", async (columns) => {
    const el = await createGroup({ columns: columns as "2" | "4" });
    expect(el.getAttribute("columns")).toBe(columns);
  });

  it("omits aria-label when the label is blank", async () => {
    const el = await createGroup({ label: "   " });
    expect(el.shadowRoot?.querySelector("[part=base]")?.hasAttribute("aria-label")).toBe(false);
  });

  it("applies listitem semantics to cards added after initial render", async () => {
    const group = await createGroup();
    const card = document.createElement("fd-card") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    card.title = "Late addition";

    group.append(card);
    await group.updateComplete;
    await card.updateComplete;

    expect(card.getAttribute("role")).toBe("listitem");
  });

  it("does not mutate non-card children", async () => {
    const group = await createGroup();
    const helper = document.createElement("div");
    helper.textContent = "Helper text";

    group.append(helper);
    await group.updateComplete;

    expect(helper.hasAttribute("role")).toBe(false);
  });

  it("updates the accessible name when the label changes", async () => {
    const el = await createGroup({ label: "Featured updates" });
    const list = el.shadowRoot?.querySelector("[part=base]");

    el.label = "Recent updates";
    await el.updateComplete;

    expect(list?.getAttribute("aria-label")).toBe("Recent updates");
  });

  it("passes an axe audit when labelled", async () => {
    const el = await createGroup({ label: "Featured updates" });
    await expectNoAxeViolations(el.shadowRoot!);
  });

  it("always renders the base list role even without a label", async () => {
    const el = await createGroup();
    expect(el.shadowRoot?.querySelector("[part=base]")?.getAttribute("role")).toBe("list");
  });

  it("keeps the host display block and hides when [hidden] is present", () => {
    const styles = FdCardGroup.styles.map((value) => value.cssText).join("\n");

    expect(styles).toContain(":host {\n      display: block;");
    expect(styles).toContain(":host([hidden]) {\n      display: none;");
  });

  it.each([
    ["--fd-card-group-col-2-min", "--ds-layout-col-2-min"],
    ["--fd-card-group-col-3-max", "--ds-layout-col-3-max"],
    ["--fd-card-group-col-4-gap-mobile", "--ds-layout-col-4-gap-narrow"],
  ])("defines %s using %s", (token, sourceToken) => {
    const styles = FdCardGroup.styles.map((value) => value.cssText).join("\n");
    expect(styles).toContain(`${token}: var(${sourceToken})`);
  });
});
