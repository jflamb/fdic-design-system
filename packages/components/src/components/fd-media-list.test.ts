import { beforeEach, describe, expect, it } from "vitest";
import "../register/fd-media-list.js";
import "../register/fd-media-item.js";
import { expectNoAxeViolations } from "./test-a11y.js";
import { clearTestDom } from "./test-utils.js";

async function createMediaList(
  attrs: Record<string, string> = {},
  childCount = 2,
) {
  const el = document.createElement("fd-media-list") as HTMLElement & {
    updateComplete: Promise<void>;
    columns: string;
  };

  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }

  for (let index = 0; index < childCount; index += 1) {
    const item = document.createElement("fd-media-item") as HTMLElement & {
      updateComplete: Promise<void>;
      heading: string;
      href: string;
      metadata: string;
      imageAlt: string;
    };
    item.heading = `Media resource ${index + 1}`;
    item.href = `/media/${index + 1}`;
    item.metadata = `${index + 1}m 23s  ·  Updated Oct 2023`;
    item.imageAlt = "";
    el.appendChild(item);
  }

  document.body.appendChild(el);
  await el.updateComplete;
  await Promise.all(
    [...el.querySelectorAll("fd-media-item")].map((item: any) => item.updateComplete),
  );
  return el;
}

describe("FdMediaList", () => {
  beforeEach(() => {
    clearTestDom();
  });

  it("registers fd-media-list", () => {
    expect(customElements.get("fd-media-list")).toBeDefined();
  });

  it("renders an internal list with optional accessible label", async () => {
    const el = await createMediaList({ label: "Training videos" });
    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Training videos");
  });

  it("assigns listitem semantics to direct media item children", async () => {
    const el = await createMediaList();
    const items = el.querySelectorAll("fd-media-item");

    expect(items[0]?.getAttribute("role")).toBe("listitem");
    expect(items[1]?.getAttribute("role")).toBe("listitem");
  });

  it("assigns listitem semantics to unexpected direct element children", async () => {
    const el = await createMediaList({}, 0);
    const child = document.createElement("div");
    el.appendChild(child);

    await el.updateComplete;
    el.shadowRoot?.querySelector("slot")?.dispatchEvent(new Event("slotchange"));

    expect(child.getAttribute("role")).toBe("listitem");
  });

  it("restores listitem semantics if a managed child role changes", async () => {
    const el = await createMediaList();
    const item = el.querySelector("fd-media-item");

    item?.setAttribute("role", "presentation");
    await new Promise((resolve) => queueMicrotask(resolve));

    expect(item?.getAttribute("role")).toBe("listitem");
  });

  it("normalizes unsupported column values to the default", async () => {
    const el = await createMediaList({ columns: "9" });

    await el.updateComplete;
    expect(el.columns).toBe("3");
    expect(el.getAttribute("columns")).toBe("3");
  });

  it("passes an axe audit with representative children", async () => {
    const el = await createMediaList({ label: "Training videos" });

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
