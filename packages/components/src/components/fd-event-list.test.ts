import { beforeEach, describe, expect, it } from "vitest";
import { FdEventList } from "./fd-event-list.js";
import "../register/fd-event.js";
import "../register/fd-event-list.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { clearTestDom, createTestElement, queryShadow } from "./test-utils.js";

async function createEventList() {
  return createTestElement<
    HTMLElement & {
      columns: "2" | "3" | "4";
      label?: string;
      tone: "neutral" | "cool" | "warm";
      updateComplete: Promise<void>;
    }
  >("fd-event-list");
}

describe("FdEventList", () => {
  beforeEach(() => {
    clearTestDom();
  });

  it("registers fd-event-list", () => {
    expect(customElements.get("fd-event-list")).toBeDefined();
  });

  it("renders a labelled list container", async () => {
    const el = document.createElement("fd-event-list") as HTMLElement & {
      columns?: "2" | "3" | "4";
      updateComplete: Promise<void>;
      label?: string;
    };
    el.label = "Upcoming events";

    document.body.appendChild(el);
    await el.updateComplete;

    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Upcoming events");
    expect(el.getAttribute("columns")).toBe("3");

    el.remove();
  });

  it("assigns listitem semantics to slotted fd-event children", async () => {
    const list = await createEventList();
    const event = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    event.title = "Health insurance workshop";

    list.append(event);
    document.body.appendChild(list);

    await list.updateComplete;
    await event.updateComplete;

    expect(event.getAttribute("role")).toBe("listitem");
    expect(event.getAttribute("tone")).toBe("neutral");

    list.remove();
  });

  it("applies the shared list tone to direct event children", async () => {
    const list = document.createElement("fd-event-list") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: "neutral" | "cool" | "warm";
    };
    const firstEvent = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: string;
      title: string;
    };
    const secondEvent = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: string;
      title: string;
    };

    list.tone = "warm";
    firstEvent.tone = "cool";
    firstEvent.title = "First";
    secondEvent.tone = "neutral";
    secondEvent.title = "Second";

    list.append(firstEvent, secondEvent);
    document.body.appendChild(list);

    await list.updateComplete;
    await firstEvent.updateComplete;
    await secondEvent.updateComplete;

    expect(firstEvent.getAttribute("tone")).toBe("warm");
    expect(secondEvent.getAttribute("tone")).toBe("warm");

    list.remove();
  });

  it("restores the shared list tone if a child event tries to override it", async () => {
    const list = document.createElement("fd-event-list") as HTMLElement & {
      updateComplete: Promise<void>;
      tone: "neutral" | "cool" | "warm";
    };
    const event = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };

    list.tone = "cool";
    event.title = "Upcoming conference";
    list.append(event);
    document.body.appendChild(list);

    await list.updateComplete;
    await event.updateComplete;

    event.setAttribute("tone", "warm");
    await Promise.resolve();
    await event.updateComplete;

    expect(event.getAttribute("tone")).toBe("cool");

    list.remove();
  });

  it("restores list semantics if a child event tries to override its role", async () => {
    const list = document.createElement("fd-event-list") as HTMLElement & {
      updateComplete: Promise<void>;
    };
    const event = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };

    event.title = "Upcoming conference";
    list.append(event);
    document.body.appendChild(list);

    await list.updateComplete;
    await event.updateComplete;

    event.setAttribute("role", "presentation");
    await Promise.resolve();
    await event.updateComplete;

    expect(event.getAttribute("role")).toBe("listitem");

    list.remove();
  });

  it("defines Figma-backed column constraints in the component stylesheet", () => {
    const styles = FdEventList.styles
      .map((value) => value.cssText)
      .join("\n");

    expect(styles).toContain("var(--fd-event-list-col-2-min, var(--ds-layout-col-2-min))");
    expect(styles).toContain("var(--fd-event-list-col-3-max, var(--ds-layout-col-3-max))");
    expect(styles).toContain("var(--fd-event-list-col-4-gap-mobile, var(--ds-layout-col-4-gap-narrow))");
    expect(styles).toContain("@container (max-width: 815px)");
    expect(styles).toContain("1fr");
  });

  it("omits aria-label when the label is blank", async () => {
    const list = await createEventList();
    list.label = "   ";
    await list.updateComplete;

    expect(queryShadow(list, "[part=base]")?.hasAttribute("aria-label")).toBe(
      false,
    );
  });

  it("normalizes unsupported columns values back to the default recipe", async () => {
    const list = await createEventList();
    (list as HTMLElement & { columns: "2" | "3" | "4" }).columns = "7" as
      | "2"
      | "3"
      | "4";
    await list.updateComplete;

    expect(list.columns).toBe("3");
  });

  it("updates the accessible name when the label changes", async () => {
    const list = await createEventList();
    list.label = "Upcoming events";
    await list.updateComplete;
    list.label = "Archived events";
    await list.updateComplete;

    expect(queryShadow(list, "[part=base]")?.getAttribute("aria-label")).toBe(
      "Archived events",
    );
  });

  it("re-applies list tones when the host tone changes", async () => {
    const list = await createEventList();
    const event = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    event.title = "Regional conference";
    list.append(event);
    await list.updateComplete;

    list.tone = "warm";
    await list.updateComplete;
    await event.updateComplete;

    expect(event.getAttribute("tone")).toBe("warm");
  });

  it("does not mutate non-event children", async () => {
    const list = await createEventList();
    const helper = document.createElement("div");
    helper.textContent = "Helper copy";
    list.append(helper);
    await list.updateComplete;

    expect(helper.hasAttribute("role")).toBe(false);
    expect(helper.hasAttribute("tone")).toBe(false);
  });

  it("applies list semantics to events added after initial render", async () => {
    const list = await createEventList();
    const event = document.createElement("fd-event") as HTMLElement & {
      updateComplete: Promise<void>;
      title: string;
    };
    event.title = "Late-added workshop";

    list.append(event);
    await list.updateComplete;
    await event.updateComplete;

    expect(event.getAttribute("role")).toBe("listitem");
    expect(event.getAttribute("tone")).toBe("neutral");
  });

  it("renders the slot inside the list wrapper", async () => {
    const list = await createEventList();

    expect(queryShadow<HTMLSlotElement>(list, "slot")).not.toBeNull();
    expect(queryShadow(list, "[part=base]")?.getAttribute("role")).toBe("list");
  });

  it("passes an axe audit when labelled", async () => {
    const list = await createEventList();
    list.label = "Upcoming events";
    list.innerHTML = `
      <fd-event title="Regional conference" month="SEP" day="18"></fd-event>
      <fd-event title="Board meeting" month="SEP" day="19"></fd-event>
    `;
    await list.updateComplete;
    await Promise.all(
      Array.from(list.querySelectorAll("fd-event")).map((event) =>
        (event as HTMLElement & { updateComplete?: Promise<void> }).updateComplete,
      ),
    );

    await expectNoAxeViolations(list.shadowRoot!);
  });
});
