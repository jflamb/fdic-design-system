import { describe, expect, it } from "vitest";
import { FdTileList } from "./fd-tile-list.js";
import "../register/fd-tile.js";
import "../register/fd-tile-list.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createList(
  props: Partial<HTMLElement & {
    columns?: "2" | "3" | "4";
    label?: string;
    tone?: "neutral" | "cool" | "warm";
  }> = {},
) {
  const el = document.createElement("fd-tile-list") as HTMLElement & {
    columns?: "2" | "3" | "4";
    label?: string;
    tone?: "neutral" | "cool" | "warm";
    updateComplete: Promise<void>;
  };
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("FdTileList", () => {
  it("registers fd-tile-list", () => {
    expect(customElements.get("fd-tile-list")).toBeDefined();
  });

  it("renders a labelled list container", async () => {
    const el = await createList({ label: "Benefits links" });

    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Benefits links");
    expect(el.getAttribute("columns")).toBe("3");
  });

  it("assigns listitem semantics to slotted fd-tile children", async () => {
    const list = document.createElement("fd-tile-list") as HTMLElement & {
      updateComplete: Promise<void>;
    };
    const tile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    tile.title = "Health benefits";

    list.append(tile);
    document.body.appendChild(list);

    await list.updateComplete;
    await tile.updateComplete;

    expect(tile.getAttribute("role")).toBe("listitem");
    expect(tile.getAttribute("tone")).toBe("neutral");

  });

  it("applies the shared list tone to direct tile children", async () => {
    const list = document.createElement("fd-tile-list") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: "neutral" | "cool" | "warm";
    };
    const firstTile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: string;
      title: string;
    };
    const secondTile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: string;
      title: string;
    };

    list.tone = "warm";
    firstTile.tone = "cool";
    firstTile.title = "First tile";
    secondTile.tone = "neutral";
    secondTile.title = "Second tile";

    list.append(firstTile, secondTile);
    document.body.appendChild(list);

    await list.updateComplete;
    await firstTile.updateComplete;
    await secondTile.updateComplete;

    expect(firstTile.getAttribute("tone")).toBe("warm");
    expect(secondTile.getAttribute("tone")).toBe("warm");

  });

  it("updates child tile tones when the list tone changes", async () => {
    const list = document.createElement("fd-tile-list") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: "neutral" | "cool" | "warm";
    };
    const tile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };

    list.tone = "cool";
    tile.title = "Health benefits";
    list.append(tile);
    document.body.appendChild(list);

    await list.updateComplete;
    expect(tile.getAttribute("tone")).toBe("cool");

    list.tone = "warm";
    await list.updateComplete;
    await tile.updateComplete;

    expect(tile.getAttribute("tone")).toBe("warm");

  });

  it("restores the shared list tone if a child tile tries to override it", async () => {
    const list = document.createElement("fd-tile-list") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: "neutral" | "cool" | "warm";
    };
    const tile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };

    list.tone = "cool";
    tile.title = "Health benefits";
    list.append(tile);
    document.body.appendChild(list);

    await list.updateComplete;
    await tile.updateComplete;

    tile.setAttribute("tone", "warm");
    await Promise.resolve();
    await tile.updateComplete;

    expect(tile.getAttribute("tone")).toBe("cool");

  });

  it("restores list semantics if a child tile tries to override its role", async () => {
    const list = document.createElement("fd-tile-list") as HTMLElement & {
      updateComplete: Promise<void>;
    };
    const tile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };

    tile.title = "Health benefits";
    list.append(tile);
    document.body.appendChild(list);

    await list.updateComplete;
    await tile.updateComplete;

    tile.setAttribute("role", "presentation");
    await Promise.resolve();
    await tile.updateComplete;

    expect(tile.getAttribute("role")).toBe("listitem");

    list.remove();
  });

  it("defines Figma-backed column constraints in the component stylesheet", () => {
    const styles = FdTileList.styles
      .map((value) => value.cssText)
      .join("\n");

    expect(styles).toContain("var(--fd-tile-list-col-2-min, var(--ds-layout-col-2-min))");
    expect(styles).toContain("var(--fd-tile-list-col-3-max, var(--ds-layout-col-3-max))");
    expect(styles).toContain("var(--fd-tile-list-col-4-gap-mobile, var(--ds-layout-col-4-gap-narrow))");
    expect(styles).toContain("@container (max-width: 815px)");
    expect(styles).toContain("1fr");
  });

  it("normalizes invalid columns back to the default recipe", async () => {
    const el = await createList();
    el.setAttribute("columns", "5");

    await el.updateComplete;
    await el.updateComplete;

    expect(el.columns).toBe("3");
  });

  it("normalizes invalid tones back to neutral", async () => {
    const list = await createList();
    const tile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };

    list.setAttribute("tone", "unsupported");
    tile.title = "Health benefits";
    list.append(tile);
    await list.updateComplete;
    await tile.updateComplete;

    expect(tile.getAttribute("tone")).toBe("neutral");
  });

  it("updates the accessible name when the label changes", async () => {
    const el = await createList({ label: "Benefits links" });

    el.label = "Updated benefits links";
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector("[part=base]")?.getAttribute("aria-label")).toBe(
      "Updated benefits links",
    );
  });

  it("omits aria-label when the label is blank", async () => {
    const el = await createList({ label: "   " });
    expect(el.shadowRoot?.querySelector("[part=base]")?.hasAttribute("aria-label")).toBe(false);
  });

  it("applies semantics and tone to tiles added after initial render", async () => {
    const list = await createList({ tone: "warm" });
    const tile = document.createElement("fd-tile") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    tile.title = "Late addition";

    list.append(tile);
    await list.updateComplete;
    await tile.updateComplete;

    expect(tile.getAttribute("role")).toBe("listitem");
    expect(tile.getAttribute("tone")).toBe("warm");
  });

  it("passes an axe audit when labelled", async () => {
    const el = await createList({ label: "Benefits links" });
    await expectNoAxeViolations(el.shadowRoot!);
  });

  it.each([
    ["2"],
    ["4"],
  ])("preserves the supported %s-column recipe", async (columns) => {
    const el = await createList({ columns: columns as "2" | "4" });
    expect(el.getAttribute("columns")).toBe(columns);
  });

  it("does not mutate non-tile children", async () => {
    const list = await createList({ tone: "warm" });
    const helper = document.createElement("div");
    helper.textContent = "Helper text";

    list.append(helper);
    await list.updateComplete;

    expect(helper.hasAttribute("role")).toBe(false);
    expect(helper.hasAttribute("tone")).toBe(false);
  });
});
