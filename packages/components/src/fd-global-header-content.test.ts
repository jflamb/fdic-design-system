import { describe, expect, it } from "vitest";
import {
  createFdGlobalHeaderContent,
  createFdGlobalHeaderSearchConfig,
  createHeaderSearchItemsFromNavigation,
} from "./fd-global-header-content.js";

describe("fd-global-header-content", () => {
  it("defaults search to null when creating a content handoff object", () => {
    const content = createFdGlobalHeaderContent({
      navigation: [
        {
          kind: "link",
          label: "Home",
          href: "/",
        },
      ],
    });

    expect(content.search).toBeNull();
    expect(content.navigation).toHaveLength(1);
  });

  it("defaults the fallback query parameter name to q", () => {
    const search = createFdGlobalHeaderSearchConfig({
      action: "/search",
      label: "Search",
    });

    expect(search.paramName).toBe("q");
  });

  it("re-exports the search-item derivation helper for consumer adapters", () => {
    const items = createHeaderSearchItemsFromNavigation([
      {
        kind: "panel",
        id: "services",
        label: "Services",
        sections: [
          {
            label: "Overview",
            href: "/services",
            items: [],
          },
          {
            label: "Programs",
            href: "/services/programs",
            items: [
              {
                label: "Bank Data",
                href: "/services/programs/bank-data",
              },
            ],
          },
        ],
      },
    ]);

    expect(items.map((item) => item.title)).toContain("Services");
    expect(items.map((item) => item.title)).toContain("Bank Data");
  });
});
