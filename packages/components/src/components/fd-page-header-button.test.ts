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

function getBase(el: any): HTMLElement | null {
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

  it("renders an fd-button with the subtle variant", async () => {
    const el = await createButton();
    const base = getBase(el);
    expect(base).not.toBeNull();
    expect(base?.tagName).toBe("FD-BUTTON");
    expect(base?.getAttribute("variant")).toBe("subtle");
    expect(base?.getAttribute("type")).toBe("button");
  });

  it("renders slotted label text", async () => {
    const el = await createButton({}, "Add to Quick Links");
    const base = getBase(el);
    const slot = base?.shadowRoot?.querySelector("slot:not([name])");
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

  it("configures fd-button tokens for page-header usage", () => {
    const stylesheet = Array.isArray(FdPageHeaderButton.styles)
      ? FdPageHeaderButton.styles.map((style) => style.cssText).join("\n")
      : FdPageHeaderButton.styles.cssText;

    expect(stylesheet).toContain("--fd-button-text-subtle");
    expect(stylesheet).toContain("--fd-button-overlay-hover");
    expect(stylesheet).toContain("--fd-button-overlay-active");
    expect(stylesheet).toContain("--fd-button-height");
  });

  it("passes axe checks", async () => {
    const el = await createButton({ icon: "share-fat" }, "Share");
    await expectNoAxeViolations(el);
  });

  it("trims surrounding whitespace from the icon name", async () => {
    const el = await createButton({ icon: " share-fat " });

    expect(getIcon(el)).not.toBeNull();
  });

  it("renders the icon into the fd-button icon-start slot", async () => {
    const el = await createButton({ icon: "share-fat" });

    expect(getIcon(el)?.getAttribute("slot")).toBe("icon-start");
  });

  it("updates the icon when the host attribute changes after render", async () => {
    const el = await createButton();

    el.icon = "share-fat";
    await el.updateComplete;

    expect(getIcon(el)).not.toBeNull();
  });

  it("keeps the host inline-flex for header action layouts", () => {
    const stylesheet = Array.isArray(FdPageHeaderButton.styles)
      ? FdPageHeaderButton.styles.map((style) => style.cssText).join("\n")
      : FdPageHeaderButton.styles.cssText;

    expect(stylesheet).toContain(":host {\n      display: inline-flex;");
  });

  it("defines responsive overrides for compact header layouts", () => {
    const stylesheet = Array.isArray(FdPageHeaderButton.styles)
      ? FdPageHeaderButton.styles.map((style) => style.cssText).join("\n")
      : FdPageHeaderButton.styles.cssText;

    expect(stylesheet).toContain("@media (max-width: 640px)");
    expect(stylesheet).toContain("--fd-page-header-button-height-mobile");
  });

  it("hides the wrapper in print styles", () => {
    const stylesheet = Array.isArray(FdPageHeaderButton.styles)
      ? FdPageHeaderButton.styles.map((style) => style.cssText).join("\n")
      : FdPageHeaderButton.styles.cssText;

    expect(stylesheet).toContain("@media print");
    expect(stylesheet).toContain("display: none;");
  });
});
