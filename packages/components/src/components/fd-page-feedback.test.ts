import { beforeEach, describe, expect, it, vi } from "vitest";
import "../register/fd-page-feedback.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { FdButtonGroup } from "./fd-button-group.js";

async function createFeedback(
  attrs: Record<string, string> = {
    "survey-href": "https://example.com/survey",
  },
) {
  const el = document.createElement("fd-page-feedback") as any;
  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }
  document.body.appendChild(el);
  await el.updateComplete;
  await waitForFrame();
  return el;
}

function getPart(el: any, part: string): HTMLElement | null {
  return el.shadowRoot?.querySelector(`[part="${part}"]`) ?? null;
}

function getButtonHost(el: any, target: string) {
  return el.shadowRoot?.querySelector(`fd-button[data-focus-target="${target}"]`) as
    | HTMLElement
    | null;
}

function getButtonBase(host: Element | null) {
  return (host as HTMLElement | null)?.shadowRoot?.querySelector(
    "[part=base]",
  ) as HTMLButtonElement | null;
}

function getLinkHost(el: any) {
  return el.shadowRoot?.querySelector(
    'fd-link[data-focus-target="survey-link"]',
  ) as HTMLElement | null;
}

function getTextareaNative(host: Element | null) {
  return (host as HTMLElement | null)?.shadowRoot?.querySelector(
    "[part=native]",
  ) as HTMLTextAreaElement | null;
}

async function clickInner(host: Element | null) {
  getButtonBase(host)?.click();
  await waitForFrame();
  await waitForFrame();
}

async function waitForFrame() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

describe("FdPageFeedback", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers fd-page-feedback", () => {
    expect(customElements.get("fd-page-feedback")).toBeDefined();
  });

  it("uses the shared shell width token for panel alignment", () => {
    const styles = (
      customElements.get("fd-page-feedback") as typeof HTMLElement & {
        styles?: { cssText?: string };
      }
    ).styles?.cssText ?? "";

    expect(styles).toContain("--fd-page-feedback-max-width");
    expect(styles).toContain("var(--fdic-layout-shell-max-width, var(--fdic-layout-content-max-width, 1312px))");
    expect(styles).toContain("var(--fdic-layout-section-block-padding-compact, var(--fdic-spacing-xl, 24px))");
    expect(styles).toContain("var(--fdic-layout-stack-gap, var(--fdic-spacing-md, 16px))");
    expect(styles).toContain("var(--fdic-layout-content-gap, var(--fdic-spacing-xl, 24px))");
    expect(styles).toContain("var(--fdic-layout-paragraph-max-width, 720px)");
    expect(styles).toContain("grid-template-columns: minmax(0, 1fr) auto");
    expect(styles).toContain("grid-template-columns: max-content auto");
    expect(styles).toContain("overflow-wrap: normal");
    expect(styles).toContain("justify-self: end");
    expect(styles).toContain("font-size: var(--fdic-font-size-body, 1.125rem)");
  });

  it("renders the default prompt view with light group semantics", async () => {
    const el = await createFeedback();
    const base = getPart(el, "base");

    expect(el.view).toBe("prompt");
    expect(base?.getAttribute("role")).toBe("group");
    expect(base?.getAttribute("aria-labelledby")).toContain(
      "fd-page-feedback-prompt-",
    );
    expect(getPart(el, "responses")).toBeTruthy();
    expect(getButtonHost(el, "no-button")).toBeTruthy();
    expect(getButtonHost(el, "report-trigger")).toBeTruthy();
    expect(getPart(el, "responses")?.tagName).toBe("FD-BUTTON-GROUP");
  });

  it("moves from prompt to survey and focuses the survey link", async () => {
    const el = await createFeedback();

    await clickInner(getButtonHost(el, "no-button"));

    expect(el.view).toBe("survey");
    expect(getLinkHost(el)).toBeTruthy();
    expect(el.shadowRoot?.activeElement).toBe(getLinkHost(el));
  });

  it("renders the thank-you acknowledgement copy with punctuation", async () => {
    const el = await createFeedback();

    await clickInner(el.shadowRoot?.querySelector("fd-button.choice-button") ?? null);

    expect(el.view).toBe("thanks");
    expect(getPart(el, "thank-you")?.textContent?.trim()).toBe(
      "Thank you for your feedback.",
    );
  });

  it("falls back to the survey cancel button when no survey href is provided", async () => {
    const el = await createFeedback({});

    await clickInner(getButtonHost(el, "no-button"));

    const cancel = getButtonHost(el, "survey-cancel");
    expect(el.view).toBe("survey");
    expect(getLinkHost(el)).toBeNull();
    expect(el.shadowRoot?.activeElement).toBe(cancel);
  });

  it("returns from survey to prompt and restores focus to the no button", async () => {
    const el = await createFeedback();

    await clickInner(getButtonHost(el, "no-button"));
    await clickInner(getButtonHost(el, "survey-cancel"));

    expect(el.view).toBe("prompt");
    expect(el.shadowRoot?.activeElement).toBe(getButtonHost(el, "no-button"));
  });

  it("moves from prompt to report and focuses the first textarea", async () => {
    const el = await createFeedback();

    await clickInner(getButtonHost(el, "report-trigger"));

    const textareaHost = el.shadowRoot?.querySelector("fd-textarea") as
      | HTMLElement
      | null;
    expect(el.view).toBe("report");
    expect(getPart(el, "report-fields")).toBeTruthy();
    expect(el.shadowRoot?.activeElement).toBe(textareaHost);
  });

  it("returns from report to prompt, clears draft values, and restores focus", async () => {
    const el = await createFeedback();

    await clickInner(getButtonHost(el, "report-trigger"));

    const textareas = el.shadowRoot?.querySelectorAll("fd-textarea") ?? [];
    const tryingNative = getTextareaNative(textareas[0] ?? null);
    const wrongNative = getTextareaNative(textareas[1] ?? null);

    if (tryingNative) {
      tryingNative.value = "Renew deposit insurance guidance";
      tryingNative.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }

    if (wrongNative) {
      wrongNative.value = "The links on the page do not work.";
      wrongNative.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }

    await el.updateComplete;
    await clickInner(
      el.shadowRoot?.querySelector(
        'fd-button[data-focus-target="report-cancel"]',
      ) ?? null,
    );

    expect(el.view).toBe("prompt");
    expect(el.shadowRoot?.activeElement).toBe(
      getButtonHost(el, "report-trigger"),
    );

    await clickInner(getButtonHost(el, "report-trigger"));
    const reopened = el.shadowRoot?.querySelectorAll("fd-textarea") ?? [];
    expect((reopened[0] as any)?.value).toBe("");
    expect((reopened[1] as any)?.value).toBe("");
  });

  it("dispatches a cancelable submit event and stays in report when prevented", async () => {
    const el = await createFeedback();
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    el.addEventListener("fd-page-feedback-report-submit", onSubmit);

    await clickInner(getButtonHost(el, "report-trigger"));
    await clickInner(el.shadowRoot?.querySelector("fd-button.send-button") ?? null);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(el.view).toBe("report");
  });

  it("submits report details, clears draft values, and moves to thanks when not canceled", async () => {
    const el = await createFeedback();
    const onSubmit = vi.fn();
    el.addEventListener("fd-page-feedback-report-submit", onSubmit);

    await clickInner(getButtonHost(el, "report-trigger"));

    const textareas = el.shadowRoot?.querySelectorAll("fd-textarea") ?? [];
    const tryingNative = getTextareaNative(textareas[0] ?? null);
    const wrongNative = getTextareaNative(textareas[1] ?? null);

    if (tryingNative) {
      tryingNative.value = "Find branch closure guidance";
      tryingNative.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }

    if (wrongNative) {
      wrongNative.value = "The page returned a blank screen.";
      wrongNative.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    }

    await el.updateComplete;
    await clickInner(el.shadowRoot?.querySelector("fd-button.send-button") ?? null);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect((onSubmit.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      tryingToDo: "Find branch closure guidance",
      wentWrong: "The page returned a blank screen.",
    });
    expect(el.view).toBe("thanks");
    expect(el.shadowRoot?.activeElement).toBe(getPart(el, "thank-you"));
  });

  it("moves to thanks after yes and focuses the acknowledgement", async () => {
    const el = await createFeedback();
    const onViewChange = vi.fn();
    el.addEventListener("fd-page-feedback-view-change", onViewChange);

    await clickInner(el.shadowRoot?.querySelectorAll("fd-button")[0] ?? null);

    expect(el.view).toBe("thanks");
    expect(el.shadowRoot?.activeElement).toBe(getPart(el, "thank-you"));
    expect(onViewChange).toHaveBeenCalled();
    expect((onViewChange.mock.calls.at(-1)?.[0] as CustomEvent).detail).toMatchObject({
      view: "thanks",
      previousView: "prompt",
      reason: "yes",
    });
  });

  it("dispatches view-change for external view writes without forcing focus", async () => {
    const el = await createFeedback();
    const onViewChange = vi.fn();
    el.addEventListener("fd-page-feedback-view-change", onViewChange);

    el.view = "report";
    await el.updateComplete;
    await waitForFrame();

    expect(onViewChange).toHaveBeenCalledTimes(1);
    expect((onViewChange.mock.calls[0]?.[0] as CustomEvent).detail).toMatchObject({
      view: "report",
      previousView: "prompt",
      reason: "external",
    });
    expect(el.shadowRoot?.activeElement).toBeNull();
  });

  it("has no obvious accessibility violations in a representative prompt state", async () => {
    const el = await createFeedback();
    await expectNoAxeViolations(el);
  });

  it("uses fd-button-group for multi-button response and action states", async () => {
    const el = await createFeedback();

    const responses = getPart(el, "responses");
    await clickInner(getButtonHost(el, "report-trigger"));
    const actions = getPart(el, "actions");
    const groupStyles = Array.isArray(FdButtonGroup.styles)
      ? FdButtonGroup.styles.map((style) => style.cssText).join("\n")
      : FdButtonGroup.styles.cssText;

    expect(responses?.tagName).toBe("FD-BUTTON-GROUP");
    expect(actions?.tagName).toBe("FD-BUTTON-GROUP");
    expect(groupStyles).toContain(
      "gap: var(--fd-button-group-gap, var(--fdic-spacing-sm, 0.75rem));",
    );
  });

  it("forwards survey link target and rel attributes when provided", async () => {
    const el = await createFeedback({
      "survey-href": "https://example.com/survey",
      "survey-target": "_blank",
      "survey-rel": "external noopener",
    });

    await clickInner(getButtonHost(el, "no-button"));

    const link = getLinkHost(el)?.shadowRoot?.querySelector("[part=base]") as
      | HTMLAnchorElement
      | null;

    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("external noopener noreferrer");
  });
});
