import { describe, expect, it } from "vitest";
import "../register/fd-tile.js";
import "../register/fd-tile-list.js";

describe("FdTileList", () => {
  it("registers fd-tile-list", () => {
    expect(customElements.get("fd-tile-list")).toBeDefined();
  });

  it("renders a labelled list container", async () => {
    const el = document.createElement("fd-tile-list") as HTMLElement & {
      updateComplete: Promise<void>;
      label?: string;
    };
    el.label = "Benefits links";

    document.body.appendChild(el);
    await el.updateComplete;

    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Benefits links");

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

    list.remove();
  });
});
