import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-link.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createLink(
  attrs: Record<string, string> = {},
  innerHTML = "Deposit insurance resources",
) {
  const el = document.createElement("fd-link") as any;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  el.innerHTML = innerHTML;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getInternal(el: any) {
  return el.shadowRoot!.querySelector("[part=base]") as HTMLAnchorElement;
}

describe("fd-link", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is defined as a custom element", () => {
    expect(customElements.get("fd-link")).toBeDefined();
  });

  it("renders a native <a> element", async () => {
    const el = await createLink({ href: "/coverage" });
    const inner = getInternal(el);

    expect(inner.tagName).toBe("A");
    expect(inner.getAttribute("href")).toBe("/coverage");
  });

  it("defaults to the normal variant and md size", async () => {
    const el = await createLink({ href: "/coverage" });
    const inner = getInternal(el);

    expect(inner.classList.contains("variant-normal")).toBe(true);
    expect(inner.classList.contains("size-md")).toBe(true);
  });

  it("normalizes invalid variant and size values to defaults", async () => {
    const el = await createLink({
      href: "/coverage",
      variant: "nope",
      size: "huge",
    });
    const inner = getInternal(el);

    expect(inner.classList.contains("variant-normal")).toBe(true);
    expect(inner.classList.contains("size-md")).toBe(true);
  });

  it("supports the h3 size treatment", async () => {
    const el = await createLink({ href: "/coverage", size: "h3" });
    const inner = getInternal(el);

    expect(inner.classList.contains("size-h3")).toBe(true);
  });

  it("forwards aria-label to the rendered anchor", async () => {
    const el = await createLink(
      { href: "/coverage", "aria-label": "Coverage details" },
      "",
    );
    const inner = getInternal(el);

    expect(inner.getAttribute("aria-label")).toBe("Coverage details");
  });

  it("forwards aria-labelledby to the rendered anchor", async () => {
    const label = document.createElement("span");
    label.id = "coverage-link-label";
    label.textContent = "Coverage details";
    document.body.appendChild(label);

    const el = await createLink(
      { href: "/coverage", "aria-labelledby": "coverage-link-label" },
      "",
    );
    const inner = getInternal(el);

    expect(inner.getAttribute("aria-labelledby")).toBe("coverage-link-label");
  });

  it("forwards aria-current to the rendered anchor", async () => {
    const el = await createLink({
      href: "/coverage",
      "aria-current": "page",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("aria-current")).toBe("page");
  });

  it("adds noopener and noreferrer for _blank links by default", async () => {
    const el = await createLink({
      href: "https://www.fdic.gov",
      target: "_blank",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("preserves explicit rel tokens while adding missing _blank protections", async () => {
    const el = await createLink({
      href: "https://www.fdic.gov",
      target: "_blank",
      rel: "external noopener",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("external noopener noreferrer");
  });

  it("does not duplicate noopener/noreferrer when already present", async () => {
    const el = await createLink({
      href: "https://www.fdic.gov",
      target: "_blank",
      rel: "noreferrer noopener",
    });
    const inner = getInternal(el);

    expect(inner.getAttribute("rel")).toBe("noreferrer noopener");
  });

  it("delegates host focus() to the internal anchor", async () => {
    const el = await createLink({ href: "/coverage" });
    const inner = getInternal(el);
    const focusSpy = vi.spyOn(inner, "focus");

    el.focus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it("keeps default slot content inside the anchor", async () => {
    const el = await createLink({ href: "/coverage" }, "Read more");
    const inner = getInternal(el);
    const slot = inner.querySelector("slot");

    expect(slot).not.toBeNull();
    expect(el.textContent?.trim()).toBe("Read more");
  });

  it("renders icon-start and icon-end slots for additive icon treatments", async () => {
    const el = await createLink(
      { href: "/coverage" },
      '<fd-icon slot="icon-start" name="arrow-left"></fd-icon>Read more<fd-icon slot="icon-end" name="caret-right"></fd-icon>',
    );
    const inner = getInternal(el);
    const slotNames = Array.from(inner.querySelectorAll("slot")).map((slot) =>
      slot.getAttribute("name") ?? "default",
    );

    expect(slotNames).toContain("icon-start");
    expect(slotNames).toContain("default");
    expect(slotNames).toContain("icon-end");
  });

  it("updates forwarded aria attributes after host mutations", async () => {
    const el = await createLink({ href: "/coverage" }, "Read more");
    const inner = getInternal(el);

    el.setAttribute("aria-label", "Updated label");
    await el.updateComplete;

    expect(inner.getAttribute("aria-label")).toBe("Updated label");
  });

  it("has no axe violations for a standard link", async () => {
    const el = await createLink({ href: "/coverage" }, "Read the handbook");

    await expectNoAxeViolations(el.shadowRoot!);
  });

  it("has no axe violations for an inverted link with aria-current", async () => {
    const el = await createLink(
      {
        href: "/coverage",
        variant: "inverted",
        size: "lg",
        "aria-current": "page",
      },
      "Coverage overview",
    );

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
