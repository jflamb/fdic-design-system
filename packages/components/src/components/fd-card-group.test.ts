import { describe, expect, it } from "vitest";
import { FdCardGroup } from "./fd-card-group.js";
import "../register/fd-card.js";
import "../register/fd-card-group.js";

describe("FdCardGroup", () => {
  it("registers fd-card-group", () => {
    expect(customElements.get("fd-card-group")).toBeDefined();
  });

  it("renders a labelled list container", async () => {
    const el = document.createElement("fd-card-group") as HTMLElement & {
      columns?: "2" | "3" | "4";
      label?: string;
      updateComplete: Promise<void>;
    };
    el.label = "Featured updates";

    document.body.appendChild(el);
    await el.updateComplete;

    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Featured updates");
    expect(el.getAttribute("columns")).toBe("3");

    el.remove();
  });

  it("normalizes invalid columns values back to the default recipe", async () => {
    const el = document.createElement("fd-card-group") as HTMLElement & {
      columns?: "2" | "3" | "4";
      updateComplete: Promise<void>;
    };

    el.setAttribute("columns", "5");
    document.body.appendChild(el);

    await el.updateComplete;
    await el.updateComplete;

    expect(el.columns).toBe("3");
    expect(el.getAttribute("columns")).toBe("3");

    el.remove();
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

    group.remove();
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

    expect(styles).toContain("--fd-card-group-col-4-min: 256px;");
    expect(styles).toContain("--fd-card-group-col-4-max: 320px;");
    expect(styles).toContain("--fd-card-group-col-4-gap: 48px;");
    expect(styles).toContain("--fd-card-group-col-4-min-mobile: 160px;");
    expect(styles).toContain("--fd-card-group-col-4-max-mobile: 180px;");
    expect(styles).toContain("--fd-card-group-col-4-gap-mobile: 16px;");
    expect(styles).toContain(":host([data-narrow][columns=\"2\"])");
    expect(styles).toContain("1fr");

    el.remove();
  });
});
