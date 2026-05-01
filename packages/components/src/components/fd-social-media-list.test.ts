import { describe, expect, it } from "vitest";
import "../register/fd-social-media-list.js";
import "../register/fd-social-media-item.js";
import { expectNoAxeViolations } from "./test-a11y.js";

async function createSocialMediaList(
  attrs: Record<string, string> = {},
  childCount = 2,
) {
  const el = document.createElement("fd-social-media-list") as HTMLElement & {
    updateComplete: Promise<void>;
    columns: string;
  };

  for (const [name, value] of Object.entries(attrs)) {
    el.setAttribute(name, value);
  }

  for (let index = 0; index < childCount; index += 1) {
    const item = document.createElement("fd-social-media-item") as HTMLElement & {
      timestamp: string;
      imageAlt: string;
      platforms: string[];
    };
    item.timestamp = `Aug. ${26 + index}, 2024 · 9:25 AM`;
    item.textContent = "Social media post summary";
    item.platforms = ["linkedin"];
    el.appendChild(item);
  }

  document.body.appendChild(el);
  await el.updateComplete;
  await Promise.all(
    [...el.querySelectorAll("fd-social-media-item")].map((item: any) => item.updateComplete),
  );
  return el;
}

describe("FdSocialMediaList", () => {
  it("registers fd-social-media-list", () => {
    expect(customElements.get("fd-social-media-list")).toBeDefined();
  });

  it("renders an internal list with optional accessible label", async () => {
    const el = await createSocialMediaList({ label: "Recent FDIC social posts" });
    const list = el.shadowRoot?.querySelector("[part=base]");

    expect(list?.getAttribute("role")).toBe("list");
    expect(list?.getAttribute("aria-label")).toBe("Recent FDIC social posts");
  });

  it("assigns listitem semantics to direct social media item children", async () => {
    const el = await createSocialMediaList();
    const items = el.querySelectorAll("fd-social-media-item");

    expect(items[0]?.getAttribute("role")).toBe("listitem");
    expect(items[1]?.getAttribute("role")).toBe("listitem");
  });

  it("restores listitem semantics if a managed child role changes", async () => {
    const el = await createSocialMediaList();
    const item = el.querySelector("fd-social-media-item");

    item?.setAttribute("role", "presentation");
    await new Promise((resolve) => queueMicrotask(resolve));

    expect(item?.getAttribute("role")).toBe("listitem");
  });

  it("does not assign listitem semantics to unexpected direct element children", async () => {
    const el = await createSocialMediaList({}, 0);
    const child = document.createElement("div");
    el.appendChild(child);

    await el.updateComplete;
    el.shadowRoot?.querySelector("slot")?.dispatchEvent(new Event("slotchange"));

    expect(child.hasAttribute("role")).toBe(false);
  });

  it("uses aria-labelledby when labelledby references visible copy", async () => {
    const heading = document.createElement("h2");
    heading.id = "social-heading";
    heading.textContent = "Visible social posts";
    document.body.append(heading);
    const el = await createSocialMediaList({
      label: "Recent FDIC social posts",
      labelledby: "social-heading",
    });
    const list = el.shadowRoot?.querySelector("[part=base]");
    const proxy = el.shadowRoot?.getElementById(
      list?.getAttribute("aria-labelledby") ?? "",
    );

    expect(proxy?.textContent).toBe("Visible social posts");
    expect(list?.hasAttribute("aria-label")).toBe(false);
  });

  it("normalizes unsupported column values to the default", async () => {
    const el = await createSocialMediaList({ columns: "9" });

    await el.updateComplete;
    expect(el.columns).toBe("3");
  });

  it("passes an axe audit with representative children", async () => {
    const el = await createSocialMediaList({ label: "Recent FDIC social posts" });

    await expectNoAxeViolations(el.shadowRoot!);
  });
});
