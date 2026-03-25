import { describe, expect, it } from "vitest";
import {
  createFdGlobalHeaderContentFromDrupal,
  createFdGlobalHeaderNavigationFromDrupal,
} from "./fd-global-header-drupal.js";

describe("fd-global-header-drupal", () => {
  it("maps direct top-level items to header links", () => {
    const navigation = createFdGlobalHeaderNavigationFromDrupal([
      {
        title: "Home",
        url: "/",
        current: true,
      },
    ]);

    expect(navigation).toEqual([
      {
        kind: "link",
        id: "home",
        label: "Home",
        href: "/",
        current: true,
        description: undefined,
        keywords: undefined,
      },
    ]);
  });

  it("normalizes hyphen-heavy titles without regex edge trimming", () => {
    const navigation = createFdGlobalHeaderNavigationFromDrupal([
      {
        title: "--- News --- Events ---",
        url: "/news-events",
      },
    ]);

    expect(navigation[0]).toMatchObject({
      kind: "link",
      id: "news-events",
      label: "--- News --- Events ---",
    });
  });

  it("synthesizes an overview row for multi-section panels", () => {
    const navigation = createFdGlobalHeaderNavigationFromDrupal([
      {
        title: "Services",
        url: "/services",
        below: [
          {
            title: "Programs",
            url: "/services/programs",
          },
          {
            title: "Data",
            url: "/services/data",
          },
        ],
      },
    ]);

    const panel = navigation[0];
    expect(panel.kind).toBe("panel");
    if (panel.kind !== "panel") {
      throw new Error("Expected a panel item");
    }

    expect(panel.sections[0]?.label).toBe("Services Overview");
    expect(panel.sections[0]?.href).toBe("/services");
    expect(panel.sections[1]?.label).toBe("Programs");
    expect(panel.sections[2]?.label).toBe("Data");
  });

  it("propagates current state to the containing panel and derives search items", () => {
    const content = createFdGlobalHeaderContentFromDrupal({
      items: [
        {
          title: "Services",
          url: "/services",
          below: [
            {
              title: "Programs",
              url: "/services/programs",
              below: [
                {
                  title: "Bank Data",
                  url: "/services/programs/bank-data",
                  current: true,
                },
              ],
            },
          ],
        },
      ],
      search: {
        action: "/search",
        label: "Search",
      },
    });

    expect(content.navigation[0]).toMatchObject({
      kind: "panel",
      current: true,
    });
    expect(content.search?.items?.map((item) => item.title)).toContain(
      "Bank Data",
    );
  });
});
