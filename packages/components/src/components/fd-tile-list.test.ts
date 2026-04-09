import { describe, expect, it } from "vitest";
import { FdTileList } from "./fd-tile-list.js";
import "../register/fd-tile.js";
import "../register/fd-tile-list.js";

describe("FdTileList", () => {
  it("registers fd-tile-list", () => {
    expect(customElements.get("fd-tile-list")).toBeDefined();
  });

  it("renders a labelled list container", async () => {
    const el = document.createElement("fd-tile-list") as HTMLElement & {
      columns?: "2" | "3" | "4";
      updateComplete: Promise<void>;
      label?: string;
    };
    el.label = "Benefits links";

    document.body.appendChild(el);
    await el.updateComplete;

    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Benefits links");
    expect(el.getAttribute("columns")).toBe("3");

    el.remove();
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

    list.remove();
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

    list.remove();
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

    list.remove();
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

    list.remove();
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

    expect(styles).toContain("--fd-tile-list-col-2-min: 384px;");
    expect(styles).toContain("--fd-tile-list-col-3-max: 440px;");
    expect(styles).toContain("--fd-tile-list-col-4-gap-mobile: 16px;");
    expect(styles).toContain(":host([data-narrow][columns=\"2\"])");
    expect(styles).toContain("1fr");
  });
});
