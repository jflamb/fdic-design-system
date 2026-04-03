import { describe, expect, it } from "vitest";
import "../register/fd-event.js";
import "../register/fd-event-list.js";

describe("FdEventList", () => {
  it("registers fd-event-list", () => {
    expect(customElements.get("fd-event-list")).toBeDefined();
  });

  it("renders a labelled list container", async () => {
    const el = document.createElement("fd-event-list") as HTMLElement & {
      updateComplete: Promise<void>;
      label?: string;
    };
    el.label = "Upcoming events";

    document.body.appendChild(el);
    await el.updateComplete;

    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Upcoming events");

    el.remove();
  });

  it("assigns listitem semantics to slotted fd-event children", async () => {
    const list = document.createElement("fd-event-list") as HTMLElement & {
      updateComplete: Promise<void>;
    };
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
});
