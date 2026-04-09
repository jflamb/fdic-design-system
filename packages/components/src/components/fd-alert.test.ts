import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-alert.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createAlert(
  attrs: Record<string, string> = {},
  body = "The filing deadline is tomorrow.",
) {
  const el = document.createElement("fd-alert") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  el.innerHTML = body;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function getBase(el: any): Element | null {
  return el.shadowRoot?.querySelector("[part=base]") ?? null;
}

function getDismissButton(el: any): HTMLButtonElement | null {
  return el.shadowRoot?.querySelector("[part=dismiss-button]") ?? null;
}

describe("FdAlert", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-alert", () => {
    expect(customElements.get("fd-alert")).toBeDefined();
  });

  it("defaults to a non-dismissible info alert with live mode off", async () => {
    const el = await createAlert();
    const base = getBase(el);

    expect(el.variant).toBe("default");
    expect(el.type).toBe("info");
    expect(el.dismissible).toBe(false);
    expect(el.live).toBe("off");
    expect(base?.className).toContain("variant-default");
    expect(base?.className).toContain("type-info");
    expect(base?.getAttribute("role")).toBeNull();
  });

  it("renders title and slotted body content", async () => {
    const el = await createAlert(
      {
        title: "Scheduled maintenance",
      },
      'The service will be unavailable from 8 to 10 p.m. <a href="/status">Check status</a>.',
    );

    const title = el.shadowRoot?.querySelector("[part=title]");
    const body = el.shadowRoot?.querySelector("[part=body]");
    const assignedText = el.shadowRoot
      ?.querySelector("slot")
      ?.assignedNodes({ flatten: true })
      .map((node: Node) => node.textContent ?? "")
      .join(" ");

    expect(title?.textContent?.trim()).toBe("Scheduled maintenance");
    expect(body).toBeTruthy();
    expect(assignedText).toContain("The service will be unavailable");
    expect(el.shadowRoot?.querySelector("slot")?.assignedElements()).toHaveLength(1);
  });

  it("renders no dismiss button by default", async () => {
    const el = await createAlert();
    expect(getDismissButton(el)).toBeNull();
  });

  it("renders a dismiss button with a derived accessible name", async () => {
    const el = await createAlert({
      title: "Important update",
      dismissible: "",
    });

    expect(getDismissButton(el)?.getAttribute("aria-label")).toBe(
      "Dismiss Important update",
    );
  });

  it("uses dismiss-label when provided", async () => {
    const el = await createAlert({
      title: "Important update",
      dismissible: "",
      "dismiss-label": "Close maintenance alert",
    });

    expect(getDismissButton(el)?.getAttribute("aria-label")).toBe(
      "Close maintenance alert",
    );
  });

  it("dispatches fd-alert-dismiss from the host", async () => {
    const el = await createAlert({
      dismissible: "",
    });
    const onDismiss = vi.fn();
    el.addEventListener("fd-alert-dismiss", onDismiss);

    getDismissButton(el)?.click();

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(document.body.contains(el)).toBe(true);
  });

  it("focus() forwards to the dismiss button when present", async () => {
    const el = await createAlert({
      dismissible: "",
    });

    el.focus();

    expect(el.shadowRoot?.activeElement).toBe(getDismissButton(el));
  });

  it("maps polite live mode to role=status", async () => {
    const el = await createAlert({
      live: "polite",
    });

    expect(getBase(el)?.getAttribute("role")).toBe("status");
    expect(getBase(el)?.getAttribute("aria-atomic")).toBe("true");
  });

  it("maps assertive live mode to role=alert", async () => {
    const el = await createAlert({
      live: "assertive",
    });

    expect(getBase(el)?.getAttribute("role")).toBe("alert");
    expect(getBase(el)?.getAttribute("aria-atomic")).toBe("true");
  });

  it("keeps site semantics separate from the live region wrapper", async () => {
    const el = await createAlert(
      {
        variant: "site",
        title: "Service update",
        live: "polite",
      },
      "Scheduled maintenance begins at 8 p.m.",
    );

    const section = getBase(el);
    const liveRegion = el.shadowRoot?.querySelector('[role="status"]');
    const labelledBy = section?.getAttribute("aria-labelledby") ?? "";

    expect(section?.tagName).toBe("SECTION");
    expect(section?.getAttribute("role")).toBeNull();
    expect(labelledBy).toContain("fd-alert-severity-");
    expect(labelledBy).toContain("fd-alert-title-");
    expect(liveRegion).toBeTruthy();
  });

  it("uses an aria-label fallback for site alerts without a title", async () => {
    const el = await createAlert({
      variant: "site",
    });

    expect(getBase(el)?.getAttribute("aria-label")).toBe("Site alert");
  });

  it("renders the emergency type class for site alerts", async () => {
    const el = await createAlert({
      variant: "site",
      type: "emergency",
      dismissible: "",
    });

    expect(getBase(el)?.className).toContain("type-emergency");
  });

  it("keeps managed link colors token-driven when the resolved token is empty", async () => {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    const getComputedStyleSpy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation((element: Element) => {
        const styles = originalGetComputedStyle(element);

        if (element.tagName === "FD-ALERT") {
          return new Proxy(styles, {
            get(target, prop, receiver) {
              if (prop === "getPropertyValue") {
                return (name: string) => {
                  if (name === "--_fd-alert-link") {
                    return "";
                  }

                  return target.getPropertyValue(name);
                };
              }

              return Reflect.get(target, prop, receiver);
            },
          });
        }

        return styles;
      });

    try {
      const el = await createAlert(
        {},
        'Review the <a href="/status">latest advisory</a>.',
      );
      const link = el.querySelector("a") as HTMLAnchorElement;

      expect(link.style.color).toBe("var(--_fd-alert-link)");
    } finally {
      getComputedStyleSpy.mockRestore();
    }
  });

  it("applies system hyperlink hover treatment to emergency links", async () => {
    const el = await createAlert(
      {
        type: "emergency",
      },
      'Branch access is suspended. <a href="/alternatives">Get service alternatives</a>.',
    );
    const link = el.querySelector("a") as HTMLAnchorElement;

    link.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

    expect(link.style.textDecorationThickness).toBe(
      "var(--fd-link-underline-thickness-emphasis, 2px)",
    );
    expect(link.style.boxShadow).toBe(
      "inset 0 0 0 999px var(--fd-link-hover-overlay, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04)))",
    );

    link.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));

    expect(link.style.textDecorationThickness).toBe(
      "var(--fd-link-underline-thickness, 1px)",
    );
    expect(link.style.boxShadow).toBe("");
  });

  it("applies system hyperlink focus treatment to emergency links", async () => {
    const el = await createAlert(
      {
        type: "emergency",
      },
      'Branch access is suspended. <a href="/alternatives">Get service alternatives</a>.',
    );
    const link = el.querySelector("a") as HTMLAnchorElement;

    link.dispatchEvent(new FocusEvent("focus"));

    expect(link.style.boxShadow).toBe(
      "inset 0 0 0 999px var(--fd-link-hover-overlay, var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))), 0 0 0 var(--ds-focus-gap-width, 2px) var(--fd-link-focus-gap, var(--ds-focus-gap-color)), 0 0 0 var(--ds-focus-ring-width, 4px) var(--fd-link-focus-ring, var(--ds-focus-ring-color))",
    );

    link.dispatchEvent(new FocusEvent("blur"));

    expect(link.style.boxShadow).toBe("");
  });

  it("renders nothing when both title and body content are absent", async () => {
    const el = await createAlert({}, "   ");
    el.removeAttribute("title");
    await el.updateComplete;

    expect(getBase(el)).toBeNull();
  });

  it("has no obvious accessibility violations in a representative state", async () => {
    const el = await createAlert(
      {
        title: "Service update",
        dismissible: "",
        variant: "site",
      },
      'The platform will be unavailable tonight. <a href="/status">Read the update</a>.',
    );

    await expectNoAxeViolations(el);
  });
});
