import { describe, expect, it } from "vitest";
import "../register/fd-infotip.js";

async function createInfotip(attrs: Record<string, string | boolean> = {}) {
  const el = document.createElement("fd-infotip") as any;
  for (const [name, value] of Object.entries(attrs)) {
    if (typeof value === "boolean") {
      if (value) el.setAttribute(name, "");
    } else {
      el.setAttribute(name, value);
    }
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getTrigger(el: HTMLElement): HTMLElement | null {
  return el.querySelector(".fd-infotip__trigger");
}

function getPanel(el: HTMLElement): HTMLElement | null {
  return el.querySelector(".fd-infotip__panel");
}

describe("FdInfotip", () => {
  it("registers fd-infotip", () => {
    expect(customElements.get("fd-infotip")).toBeDefined();
  });

  it("renders an icon button trigger by default", async () => {
    const el = await createInfotip({
      text: "Supplementary help.",
      label: "More information about account number",
    });
    const trigger = getTrigger(el);
    const panel = getPanel(el);

    expect(trigger?.tagName).toBe("BUTTON");
    expect(trigger?.getAttribute("type")).toBe("button");
    expect(trigger?.getAttribute("aria-label")).toBe(
      "More information about account number",
    );
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(trigger?.getAttribute("aria-controls")).toBe(panel?.id);
    expect(trigger?.getAttribute("aria-describedby")).toBe(panel?.id);
    expect(panel?.getAttribute("role")).toBe("tooltip");
    expect(panel?.textContent).toContain("Supplementary help.");
  });

  it("opens and closes on button click", async () => {
    const el = await createInfotip({ text: "Help.", label: "More information" });
    const trigger = getTrigger(el) as HTMLButtonElement;

    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const el = await createInfotip({ text: "Help.", label: "More information" });
    const trigger = getTrigger(el) as HTMLButtonElement;

    trigger.focus();
    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;

    expect(el.open).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes when clicking outside in click mode", async () => {
    const el = await createInfotip({ text: "Help.", label: "More information" });
    const trigger = getTrigger(el) as HTMLButtonElement;

    trigger.click();
    await el.updateComplete;
    expect(el.open).toBe(true);

    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    expect(el.open).toBe(false);
  });

  it("renders an inline noteref link when href and inline variant are provided", async () => {
    const el = await createInfotip({
      text: "Citation text.",
      label: "Footnote 1",
      trigger: "1",
      href: "#fn1",
      variant: "inline",
      mode: "hover-focus",
    });
    const trigger = getTrigger(el);
    const panel = getPanel(el);

    expect(trigger?.tagName).toBe("A");
    expect(trigger?.getAttribute("href")).toBe("#fn1");
    expect(trigger?.getAttribute("role")).toBe("doc-noteref");
    expect(trigger?.textContent?.trim()).toBe("1");
    expect(trigger?.getAttribute("aria-label")).toBe("Footnote 1");
    expect(trigger?.getAttribute("aria-describedby")).toBe(panel?.id);
  });

  it("opens inline hover-focus infotips on focus and dismisses on Escape", async () => {
    const el = await createInfotip({
      text: "Citation text.",
      label: "Footnote 1",
      trigger: "1",
      href: "#fn1",
      variant: "inline",
      mode: "hover-focus",
    });
    const trigger = getTrigger(el)!;

    trigger.dispatchEvent(new FocusEvent("focus"));
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("renders nothing when text is empty", async () => {
    const el = await createInfotip({ label: "More information" });

    expect(getTrigger(el)).toBeNull();
    expect(getPanel(el)).toBeNull();
  });
});
