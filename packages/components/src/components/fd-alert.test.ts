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
