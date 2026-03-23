import { describe, it, expect, beforeEach, vi } from "vitest";
import "../register/fd-button.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createButton(
  attrs: Record<string, string> = {},
  innerHTML = "Click me",
) {
  const el = document.createElement("fd-button") as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: any): HTMLElement {
  return el.shadowRoot!.querySelector("[part=base]") as HTMLElement;
}

describe("fd-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-button")).toBeDefined();
  });

  it("renders native <button> by default with type='button'", async () => {
    const el = await createButton();
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("type")).toBe("button");
  });

  it("renders <a> when href is set", async () => {
    const el = await createButton({ href: "https://example.com" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("A");
    expect(inner.getAttribute("href")).toBe("https://example.com");
  });

  it("does NOT add role='button' to <a>", async () => {
    const el = await createButton({ href: "https://example.com" });
    const inner = getInternal(el);
    expect(inner.getAttribute("role")).toBeNull();
  });

  it("keeps the rendered control as type='button' even when submit is requested", async () => {
    const el = await createButton({ type: "submit" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("type")).toBe("button");
  });

  it("ignores type when href is set", async () => {
    const el = await createButton({
      href: "https://example.com",
      type: "submit",
    });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("A");
    expect(inner.hasAttribute("type")).toBe(false);
  });

  it("does not submit a light-DOM form when host type='submit' is set", async () => {
    const form = document.createElement("form");
    const submitSpy = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener("submit", submitSpy);
    form.innerHTML = '<fd-button type="submit">Submit filing</fd-button>';
    document.body.appendChild(form);

    const el = form.querySelector("fd-button") as any;
    await el.updateComplete;

    const inner = getInternal(el);
    inner.click();

    expect(inner.tagName).toBe("BUTTON");
    expect(inner.getAttribute("type")).toBe("button");
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it("applies native disabled on <button>", async () => {
    const el = await createButton({ disabled: "" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("applies aria-disabled and tabindex=-1 on disabled <a>, no href", async () => {
    const el = await createButton({
      href: "https://example.com",
      disabled: "",
    });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("A");
    expect(inner.getAttribute("aria-disabled")).toBe("true");
    expect(inner.getAttribute("tabindex")).toBe("-1");
    expect(inner.hasAttribute("href")).toBe(false);
  });

  it("suppresses click on disabled <a>", async () => {
    const el = await createButton({
      href: "https://example.com",
      disabled: "",
    });
    const inner = getInternal(el);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    inner.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("forwards aria-label to the rendered native control", async () => {
    const el = await createButton({ "aria-label": "Close dialog" }, "");
    const inner = getInternal(el);

    expect(inner.getAttribute("aria-label")).toBe("Close dialog");
  });

  it("forwards aria-labelledby to the rendered native control", async () => {
    const label = document.createElement("span");
    label.id = "button-label";
    label.textContent = "Close dialog";
    document.body.appendChild(label);

    const el = await createButton({ "aria-labelledby": "button-label" }, "");
    const inner = getInternal(el);

    expect(inner.getAttribute("aria-labelledby")).toBe("button-label");
  });

  it("adds noopener and noreferrer for _blank links by default", async () => {
    const el = await createButton({
      href: "https://example.com",
      target: "_blank",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("preserves explicit rel tokens while adding missing _blank protections", async () => {
    const el = await createButton({
      href: "https://example.com",
      target: "_blank",
      rel: "external noopener",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("external noopener noreferrer");
  });

  it("does not duplicate noopener/noreferrer when already present", async () => {
    const el = await createButton({
      href: "https://example.com",
      target: "_blank",
      rel: "noreferrer noopener",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("noreferrer noopener");
  });

  it("defaults to primary variant", async () => {
    const el = await createButton();
    const inner = getInternal(el);
    expect(inner.classList.contains("primary")).toBe(true);
  });

  it("applies variant class for destructive", async () => {
    const el = await createButton({ variant: "destructive" });
    const inner = getInternal(el);
    expect(inner.classList.contains("destructive")).toBe(true);
  });

  it("has default slot, icon-start slot, and icon-end slot", async () => {
    const el = await createButton(
      {},
      '<span slot="icon-start">S</span>Label<span slot="icon-end">E</span>',
    );
    const slots = el.shadowRoot!.querySelectorAll("slot");
    const slotNames = Array.from(slots).map(
      (s: any) => s.getAttribute("name") || "default",
    );
    expect(slotNames).toContain("default");
    expect(slotNames).toContain("icon-start");
    expect(slotNames).toContain("icon-end");
  });

  it("applies an icon-only class when the button only contains an icon", async () => {
    const el = await createButton(
      { "aria-label": "Close dialog" },
      '<fd-icon slot="icon-start" name="x"></fd-icon>',
    );
    const inner = getInternal(el);

    expect(inner.classList.contains("icon-only")).toBe(true);
  });

  it("does not apply icon-only when the button has visible label text", async () => {
    const el = await createButton(
      {},
      '<fd-icon slot="icon-start" name="download"></fd-icon>Download report',
    );
    const inner = getInternal(el);

    expect(inner.classList.contains("icon-only")).toBe(false);
  });

  it("applies icon-edge spacing classes when leading or trailing icons are present", async () => {
    const el = await createButton(
      {},
      '<fd-icon slot="icon-start" name="download"></fd-icon>Download report<fd-icon slot="icon-end" name="caret-down"></fd-icon>',
    );
    const inner = getInternal(el);

    expect(inner.classList.contains("has-leading-visual")).toBe(true);
    expect(inner.classList.contains("has-icon-start")).toBe(true);
    expect(inner.classList.contains("has-icon-end")).toBe(true);
  });

  it("applies leading-visual spacing when loading without a start icon", async () => {
    const el = await createButton({ loading: "" }, "Submit filing");
    const inner = getInternal(el);

    expect(inner.classList.contains("has-leading-visual")).toBe(true);
    expect(inner.classList.contains("has-icon-start")).toBe(false);
  });

  /* --- Loading state --- */

  it("renders a spinner element when loading", async () => {
    const el = await createButton({ loading: "" });
    const spinner = el.shadowRoot!.querySelector("[part=spinner]");
    expect(spinner).not.toBeNull();
    expect(spinner!.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render a spinner when not loading", async () => {
    const el = await createButton();
    const spinner = el.shadowRoot!.querySelector("[part=spinner]");
    expect(spinner).toBeNull();
  });

  it("sets disabled on native <button> when loading", async () => {
    const el = await createButton({ loading: "" });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("BUTTON");
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("sets aria-busy on native <button> when loading", async () => {
    const el = await createButton({ loading: "" });
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-busy")).toBe("true");
  });

  it("does not set aria-busy when not loading", async () => {
    const el = await createButton();
    const inner = getInternal(el);
    expect(inner.hasAttribute("aria-busy")).toBe(false);
  });

  it("preserves the variant class when loading (not disabled styling)", async () => {
    const el = await createButton({ loading: "", variant: "primary" });
    const inner = getInternal(el);
    expect(inner.classList.contains("primary")).toBe(true);
    expect(inner.classList.contains("loading")).toBe(true);
    expect(inner.classList.contains("disabled")).toBe(false);
  });

  it("loading-label replaces visible text during loading", async () => {
    const el = await createButton(
      { loading: "", "loading-label": "Submitting…" },
      "Submit",
    );
    const loadingLabel = el.shadowRoot!.querySelector(".loading-label");
    expect(loadingLabel).not.toBeNull();
    expect(loadingLabel!.textContent).toBe("Submitting…");
  });

  it("loading-label updates the accessible name on the native control", async () => {
    const el = await createButton(
      {
        loading: "",
        "loading-label": "Submitting…",
        "aria-label": "Submit filing",
      },
      "",
    );
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-label")).toBe("Submitting…");
  });

  it("loading link-mode: removes href, sets aria-disabled, tabindex=-1", async () => {
    const el = await createButton({
      href: "https://example.com",
      loading: "",
    });
    const inner = getInternal(el);
    expect(inner.tagName).toBe("A");
    expect(inner.hasAttribute("href")).toBe(false);
    expect(inner.getAttribute("aria-disabled")).toBe("true");
    expect(inner.getAttribute("tabindex")).toBe("-1");
  });

  it("loading link-mode: sets aria-busy", async () => {
    const el = await createButton({
      href: "https://example.com",
      loading: "",
    });
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-busy")).toBe("true");
  });

  it("loading link-mode: suppresses clicks", async () => {
    const el = await createButton({
      href: "https://example.com",
      loading: "",
    });
    const inner = getInternal(el);
    const spy = vi.fn();
    el.addEventListener("click", spy);
    inner.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it("icon-only loading: hides icon-start slot", async () => {
    const el = await createButton(
      { loading: "", "aria-label": "Close dialog" },
      '<fd-icon slot="icon-start" name="x"></fd-icon>',
    );
    const iconSlot = el.shadowRoot!.querySelector(
      'slot[name="icon-start"]',
    ) as HTMLSlotElement;
    expect(iconSlot).not.toBeNull();
    expect(iconSlot!.style.display).toBe("none");
  });

  it("loading-label suppresses aria-labelledby so aria-label takes effect", async () => {
    const label = document.createElement("span");
    label.id = "ext-label";
    label.textContent = "Submit filing";
    document.body.appendChild(label);

    const el = await createButton(
      {
        loading: "",
        "loading-label": "Submitting…",
        "aria-labelledby": "ext-label",
      },
      "Submit",
    );
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-label")).toBe("Submitting…");
    expect(inner.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("loading-label suppresses aria-labelledby in link mode", async () => {
    const label = document.createElement("span");
    label.id = "ext-label-link";
    label.textContent = "Go to dashboard";
    document.body.appendChild(label);

    const el = await createButton(
      {
        href: "https://example.com",
        loading: "",
        "loading-label": "Loading…",
        "aria-labelledby": "ext-label-link",
      },
      "Dashboard",
    );
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-label")).toBe("Loading…");
    expect(inner.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("preserves aria-labelledby when loading without loading-label", async () => {
    const label = document.createElement("span");
    label.id = "ext-label-keep";
    label.textContent = "Submit filing";
    document.body.appendChild(label);

    const el = await createButton(
      {
        loading: "",
        "aria-labelledby": "ext-label-keep",
      },
      "Submit",
    );
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-labelledby")).toBe("ext-label-keep");
  });

  it("icon-only loading: preserves accessible name", async () => {
    const el = await createButton(
      { loading: "", "aria-label": "Close dialog" },
      '<fd-icon slot="icon-start" name="x"></fd-icon>',
    );
    const inner = getInternal(el);
    expect(inner.getAttribute("aria-label")).toBe("Close dialog");
    expect(inner.classList.contains("icon-only")).toBe(true);
  });

  it("has no axe violations for a primary text button", async () => {
    const el = await createButton({}, "Submit application");

    await expectNoAxeViolations(getInternal(el));
  });

  it("has no axe violations for an icon-only named button", async () => {
    const el = await createButton(
      { "aria-label": "Close dialog" },
      '<fd-icon slot="icon-start" name="x"></fd-icon>',
    );

    await expectNoAxeViolations(getInternal(el));
  });

  it("has no axe violations for a disabled button", async () => {
    const el = await createButton({ disabled: "" }, "Not available");

    await expectNoAxeViolations(getInternal(el));
  });

  it("has no axe violations for link mode", async () => {
    const el = await createButton(
      { href: "https://www.fdic.gov" },
      "Visit FDIC.gov",
    );

    await expectNoAxeViolations(getInternal(el));
  });
});
