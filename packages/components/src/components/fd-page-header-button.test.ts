import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-page-header.js";
import "../icons/phosphor-regular.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { FdPageHeaderButton } from "./fd-page-header-button.js";

async function createButton(
  attrs: Record<string, string> = {},
  label = "Share",
) {
  const el = document.createElement("fd-page-header-button") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.textContent = label;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getBase(el: any): HTMLButtonElement | null {
  return el.shadowRoot?.querySelector("[part=base]") ?? null;
}

function getIcon(el: any): Element | null {
  return el.shadowRoot?.querySelector("[part=icon]") ?? null;
}

describe("FdPageHeaderButton", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("registers fd-page-header-button", () => {
    expect(customElements.get("fd-page-header-button")).toBeDefined();
  });

  it("renders a native button element", async () => {
    const el = await createButton();
    const base = getBase(el);
    expect(base).not.toBeNull();
    expect(base?.tagName).toBe("BUTTON");
    expect(base?.type).toBe("button");
  });

  it("renders slotted label text", async () => {
    const el = await createButton({}, "Add to Quick Links");
    const base = getBase(el);
    const slot = base?.querySelector("slot");
    expect(slot).not.toBeNull();
  });

  it("renders icon when icon attribute is set", async () => {
    const el = await createButton({ icon: "share-fat" });
    const icon = getIcon(el);
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render icon when icon is empty", async () => {
    const el = await createButton();
    expect(getIcon(el)).toBeNull();
  });

  it("does not render icon when icon name is not in registry", async () => {
    const el = await createButton({ icon: "nonexistent-icon-xyz" });
    expect(getIcon(el)).toBeNull();
  });

  it("defaults icon to empty string", () => {
    const el = document.createElement("fd-page-header-button") as any;
    expect(el.icon).toBe("");
  });

  it("uses semantic glass tokens for its surface treatment", () => {
    const stylesheet = Array.isArray(FdPageHeaderButton.styles)
      ? FdPageHeaderButton.styles.map((style) => style.cssText).join("\n")
      : FdPageHeaderButton.styles.cssText;

    expect(stylesheet).toContain("var(--ds-gradient-glass-button)");
    expect(stylesheet).toContain("var(--ds-color-border-glass)");
  });

  it("passes axe checks", async () => {
    const el = await createButton({ icon: "share-fat" }, "Share");
    await expectNoAxeViolations(el);
  });
});
