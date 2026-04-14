import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-button-group.js";
import "../register/fd-button.js";
import "../register/fd-page-header.js";
import type { FdPageHeaderBreadcrumb } from "./fd-page-header.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createPageHeader(
  attrs: Record<string, string> = {},
  options: {
    breadcrumbs?: FdPageHeaderBreadcrumb[];
    actionElements?: HTMLElement[];
  } = {},
) {
  const el = document.createElement("fd-page-header") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  if (options.breadcrumbs) {
    el.breadcrumbs = options.breadcrumbs;
  }
  if (options.actionElements) {
    for (const child of options.actionElements) {
      child.slot = "actions";
      el.appendChild(child);
    }
  }
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function makeButton(label: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  return btn;
}

function makeButtonGroup(labels: string[]): HTMLElement {
  const group = document.createElement("fd-button-group");
  group.setAttribute("label", "Page actions");
  for (const label of labels) {
    const button = document.createElement("fd-button");
    button.setAttribute("variant", "subtle");
    button.textContent = label;
    group.appendChild(button);
  }
  return group;
}

function getBase(el: any): Element | null {
  return el.shadowRoot?.querySelector("[part=base]") ?? null;
}

function getTitle(el: any): HTMLHeadingElement | null {
  return el.shadowRoot?.querySelector("[part=title]") ?? null;
}

function getKicker(el: any): Element | null {
  return el.shadowRoot?.querySelector("[part=kicker]") ?? null;
}

function getBreadcrumbNav(el: any): Element | null {
  return el.shadowRoot?.querySelector("[part=breadcrumbs]") ?? null;
}

function getBreadcrumbItems(el: any): Element[] {
  return Array.from(
    el.shadowRoot?.querySelectorAll(".breadcrumb-item") ?? [],
  );
}

function getSeparators(el: any): Element[] {
  return Array.from(
    el.shadowRoot?.querySelectorAll(".breadcrumb-separator") ?? [],
  );
}

function getActionsContainer(el: any): Element | null {
  return el.shadowRoot?.querySelector("[part=actions]") ?? null;
}

const SAMPLE_BREADCRUMBS: FdPageHeaderBreadcrumb[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/about/leadership" },
];

describe("FdPageHeader", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-page-header", () => {
    expect(customElements.get("fd-page-header")).toBeDefined();
  });

  it("uses the shared shell width token for content alignment", () => {
    const styles = (
      customElements.get("fd-page-header") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("var(--fdic-layout-shell-max-width, var(--fdic-layout-content-max-width, 1312px))");
    expect(styles).toContain("var(--fdic-layout-section-block-padding, var(--fdic-spacing-3xl, 48px))");
    expect(styles).toContain("var(--fdic-layout-gutter, 64px)");
    expect(styles).toContain("@media (max-width: 1023.999px)");
    expect(styles).toContain("var(--fdic-layout-gutter-tablet, 32px)");
    expect(styles).toContain("@media (max-width: 640px)");
    expect(styles).toContain("var(--fdic-layout-gutter-mobile, 16px)");
  });

  // --- Rendering ---

  it("renders nothing when heading is empty", async () => {
    const el = await createPageHeader();
    expect(getBase(el)).toBeNull();
  });

  it("renders an h1 with the heading text", async () => {
    const el = await createPageHeader({ heading: "Account Overview" });
    const title = getTitle(el);
    expect(title).not.toBeNull();
    expect(title?.tagName).toBe("H1");
    expect(title?.textContent).toBe("Account Overview");
  });

  it("renders the kicker when set", async () => {
    const el = await createPageHeader({
      heading: "Account Overview",
      kicker: "Banking Services",
    });
    const kicker = getKicker(el);
    expect(kicker).not.toBeNull();
    expect(kicker?.textContent).toBe("Banking Services");
  });

  it("does not render the kicker when empty", async () => {
    const el = await createPageHeader({ heading: "Account Overview" });
    expect(getKicker(el)).toBeNull();
  });

  it("does not render the kicker when whitespace-only", async () => {
    const el = await createPageHeader({
      heading: "Account Overview",
      kicker: "   ",
    });
    expect(getKicker(el)).toBeNull();
  });

  // --- Breadcrumbs ---

  it("renders breadcrumbs from the breadcrumbs property", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const items = getBreadcrumbItems(el);
    expect(items.length).toBe(3);
  });

  it("does not render breadcrumb nav when breadcrumbs is empty", async () => {
    const el = await createPageHeader({ heading: "Home" });
    expect(getBreadcrumbNav(el)).toBeNull();
  });

  it("renders the last breadcrumb as current page", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const items = getBreadcrumbItems(el);
    const lastItem = items[items.length - 1];
    const currentSpan = lastItem.querySelector("[aria-current='page']");
    expect(currentSpan).not.toBeNull();
    expect(currentSpan?.textContent).toBe("Leadership");
  });

  it("renders non-last breadcrumbs as links", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const items = getBreadcrumbItems(el);
    const firstLink = items[0].querySelector("a");
    expect(firstLink).not.toBeNull();
    expect(firstLink?.href).toContain("/");
    expect(firstLink?.textContent).toBe("Home");
  });

  it("renders separators between breadcrumb items", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const separators = getSeparators(el);
    expect(separators.length).toBe(2); // n-1 separators
  });

  it("marks separators as aria-hidden", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const separators = getSeparators(el);
    for (const sep of separators) {
      expect(sep.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("renders breadcrumb nav with default aria-label", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const nav = getBreadcrumbNav(el);
    expect(nav?.getAttribute("aria-label")).toBe("Breadcrumbs");
  });

  it("renders breadcrumb nav with custom aria-label", async () => {
    const el = await createPageHeader(
      { heading: "Leadership", "breadcrumb-label": "Page trail" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const nav = getBreadcrumbNav(el);
    expect(nav?.getAttribute("aria-label")).toBe("Page trail");
  });

  it("renders breadcrumbs inside an ordered list", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    const ol = getBreadcrumbNav(el)?.querySelector("ol");
    expect(ol).not.toBeNull();
    expect(ol?.tagName).toBe("OL");
  });

  // --- Actions slot ---

  it("hides actions container when no actions are slotted", async () => {
    const el = await createPageHeader({ heading: "Account Overview" });
    const actions = getActionsContainer(el);
    expect(actions?.classList.contains("actions-hidden")).toBe(true);
  });

  it("shows actions container when actions are slotted", async () => {
    const el = await createPageHeader(
      { heading: "Account Overview" },
      { actionElements: [makeButton("Print")] },
    );
    // Wait for slotchange to fire
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const actions = getActionsContainer(el);
    expect(actions?.classList.contains("actions-hidden")).toBe(false);
  });

  it("shows actions container when an fd-button-group is slotted", async () => {
    const el = await createPageHeader(
      { heading: "Account Overview" },
      { actionElements: [makeButtonGroup(["Share", "Add to Quick Links"])] },
    );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const actions = getActionsContainer(el);
    expect(actions?.classList.contains("actions-hidden")).toBe(false);
  });

  it("applies page-header action tokens to a slotted fd-button-group", async () => {
    const group = makeButtonGroup(["Share", "Add to Quick Links"]);
    const el = await createPageHeader(
      { heading: "Account Overview" },
      { actionElements: [group] },
    );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(group.style.getPropertyValue("--fd-button-overlay-hover")).toContain(
      "--fd-page-header-action-overlay-hover",
    );
    expect(group.style.getPropertyValue("--fd-button-focus-gap")).toContain(
      "--fd-page-header-action-focus-gap",
    );
  });

  it("uses the button-group spacing token for slotted action groups", async () => {
    const el = await createPageHeader(
      { heading: "Account Overview" },
      { actionElements: [makeButton("Print"), makeButton("Share")] },
    );
    el.style.setProperty("--fd-button-group-gap", "1.5rem");
    await el.updateComplete;
    const actions = getActionsContainer(el) as HTMLElement | null;

    expect(getComputedStyle(actions as HTMLElement).gap).toContain(
      "--fd-page-header-actions-gap",
    );
    expect(getComputedStyle(actions as HTMLElement).gap).toContain("1.5rem");
  });

  // --- Property defaults ---

  it("defaults heading to empty string", async () => {
    const el = document.createElement("fd-page-header") as any;
    expect(el.heading).toBe("");
  });

  it("defaults kicker to empty string", async () => {
    const el = document.createElement("fd-page-header") as any;
    expect(el.kicker).toBe("");
  });

  it("defaults breadcrumbs to empty array", async () => {
    const el = document.createElement("fd-page-header") as any;
    expect(el.breadcrumbs).toEqual([]);
  });

  it("defaults breadcrumbLabel to 'Breadcrumbs'", async () => {
    const el = document.createElement("fd-page-header") as any;
    expect(el.breadcrumbLabel).toBe("Breadcrumbs");
  });

  // --- Single breadcrumb ---

  it("renders a single breadcrumb as current page with no separators", async () => {
    const el = await createPageHeader(
      { heading: "Home" },
      { breadcrumbs: [{ label: "Home", href: "/" }] },
    );
    const items = getBreadcrumbItems(el);
    expect(items.length).toBe(1);
    expect(getSeparators(el).length).toBe(0);
    const current = items[0].querySelector("[aria-current='page']");
    expect(current).not.toBeNull();
  });

  // --- Full combination ---

  it("renders all parts together: breadcrumbs, kicker, heading, actions", async () => {
    const el = await createPageHeader(
      { heading: "Deposit Insurance", kicker: "Consumer Resources" },
      {
        breadcrumbs: SAMPLE_BREADCRUMBS,
        actionElements: [makeButton("Share")],
      },
    );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(getBreadcrumbNav(el)).not.toBeNull();
    expect(getKicker(el)?.textContent).toBe("Consumer Resources");
    expect(getTitle(el)?.textContent).toBe("Deposit Insurance");
    expect(getActionsContainer(el)?.classList.contains("actions-hidden")).toBe(
      false,
    );
  });

  // --- Accessibility ---

  it("passes axe checks with heading only", async () => {
    const el = await createPageHeader({ heading: "Account Overview" });
    await expectNoAxeViolations(el);
  });

  it("passes axe checks with breadcrumbs and heading", async () => {
    const el = await createPageHeader(
      { heading: "Leadership" },
      { breadcrumbs: SAMPLE_BREADCRUMBS },
    );
    await expectNoAxeViolations(el);
  });

  it("passes axe checks with all features", async () => {
    const el = await createPageHeader(
      { heading: "Deposit Insurance", kicker: "Consumer Resources" },
      {
        breadcrumbs: SAMPLE_BREADCRUMBS,
        actionElements: [makeButton("Share")],
      },
    );
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    await expectNoAxeViolations(el);
  });
});
