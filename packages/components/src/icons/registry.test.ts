import { describe, it, expect, beforeEach, vi } from "vitest";
import { iconRegistry } from "./registry.js";

describe("iconRegistry", () => {
  beforeEach(() => {
    iconRegistry.clear();
  });

  it("registers and retrieves a single icon", () => {
    const svg = '<svg viewBox="0 0 256 256"><path d="M0 0"/></svg>';
    iconRegistry.register("test-icon", svg);
    expect(iconRegistry.get("test-icon")).toBe(svg);
  });

  it("registers icons in batch via a Record", () => {
    const icons = {
      alpha: '<svg viewBox="0 0 256 256"><circle r="10"/></svg>',
      beta: '<svg viewBox="0 0 256 256"><rect width="10" height="10"/></svg>',
    };
    iconRegistry.register(icons);
    expect(iconRegistry.get("alpha")).toBe(icons.alpha);
    expect(iconRegistry.get("beta")).toBe(icons.beta);
  });

  it("returns undefined for an unknown icon", () => {
    expect(iconRegistry.get("nonexistent")).toBeUndefined();
  });

  it("overwrites on re-register", () => {
    iconRegistry.register("icon", "<svg>first</svg>");
    iconRegistry.register("icon", "<svg>second</svg>");
    expect(iconRegistry.get("icon")).toBe("<svg>second</svg>");
  });

  it("strips <script> tags from registered SVGs", () => {
    const dirty =
      '<svg><script>alert("xss")</script><path d="M0 0"/></svg>';
    iconRegistry.register("scripted", dirty);
    const result = iconRegistry.get("scripted")!;
    expect(result).not.toContain("<script");
    expect(result).not.toContain("</script>");
    expect(result).toContain('<path d="M0 0"/>');
  });

  it("strips on* event handler attributes from registered SVGs", () => {
    const dirty =
      '<svg onclick="alert(1)" onload="alert(2)"><path d="M0 0" onmouseover="alert(3)"/></svg>';
    iconRegistry.register("handlers", dirty);
    const result = iconRegistry.get("handlers")!;
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("onload");
    expect(result).not.toContain("onmouseover");
    expect(result).toContain('<path d="M0 0"/>');
  });

  it("removes URL-bearing attributes and embedded SVG document surfaces", () => {
    const dirty = [
      '<svg viewBox="0 0 20 20" href="javascript:alert(1)" xlink:href="javascript:alert(2)">',
      '<a href="javascript:alert(3)"><path d="M1 1"/></a>',
      '<image href="https://example.com/icon.svg"/>',
      '<foreignObject><body xmlns="http://www.w3.org/1999/xhtml">HTML</body></foreignObject>',
      '<path d="M2 2" fill="url(javascript:alert(4))" stroke="#005ea8"/>',
      "</svg>",
    ].join("");

    iconRegistry.register("url-surfaces", dirty);

    const result = iconRegistry.get("url-surfaces")!;
    expect(result).not.toContain("href");
    expect(result).not.toContain("xlink:href");
    expect(result).not.toContain("<a");
    expect(result).not.toContain("<image");
    expect(result).not.toContain("<foreignObject");
    expect(result).not.toContain("javascript:");
    expect(result).not.toContain("url(");
    expect(result).toContain('<path d="M2 2" stroke="#005ea8"/>');
  });

  it("removes unsupported SVG features instead of preserving complex behavior", () => {
    const dirty =
      '<svg viewBox="0 0 20 20"><defs><filter id="shadow"></filter></defs><animate attributeName="opacity"/><path d="M0 0" filter="url(#shadow)"/></svg>';

    iconRegistry.register("complex", dirty);

    const result = iconRegistry.get("complex")!;
    expect(result).not.toContain("<defs");
    expect(result).not.toContain("<filter");
    expect(result).not.toContain("<animate");
    expect(result).not.toContain("filter=");
    expect(result).toContain('<path d="M0 0"/>');
  });

  it("strips script tags with whitespace in the closing tag in the fallback path", () => {
    vi.stubGlobal("DOMParser", undefined);
    try {
      const dirty =
        '<svg><script type="application/ecmascript">alert(1)</script ><path d="M0 0"/></svg>';
      iconRegistry.register("scripted-fallback", dirty);

      const result = iconRegistry.get("scripted-fallback")!;
      expect(result).not.toContain("<script");
      expect(result).not.toContain("</script");
      expect(result).toContain('<path d="M0 0"/>');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("strips event handler attributes in the parser fallback path", () => {
    vi.stubGlobal("DOMParser", undefined);
    try {
      const dirty =
        '<svg onload="alert(1)"><path d="M0 0" onfocus="alert(2)"/></svg>';
      iconRegistry.register("handlers-fallback", dirty);

      const result = iconRegistry.get("handlers-fallback")!;
      expect(result).not.toContain("onload");
      expect(result).not.toContain("onfocus");
      expect(result).toContain('<path d="M0 0"/>');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("removes URL-bearing attributes in the parser fallback path", () => {
    vi.stubGlobal("DOMParser", undefined);
    try {
      const dirty =
        '<svg><path d="M0 0" fill="data:image/svg+xml;base64,abc"/><use href="javascript:alert(1)"/></svg>';
      iconRegistry.register("url-surfaces-fallback", dirty);

      const result = iconRegistry.get("url-surfaces-fallback")!;
      expect(result).not.toContain("data:");
      expect(result).not.toContain("href");
      expect(result).not.toContain("<use");
      expect(result).toContain('<path d="M0 0"/>');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("names() returns a sorted list of registered icon names", () => {
    iconRegistry.register("zebra", "<svg/>");
    iconRegistry.register("alpha", "<svg/>");
    iconRegistry.register("middle", "<svg/>");
    expect(iconRegistry.names()).toEqual(["alpha", "middle", "zebra"]);
  });

  it("clear() removes all icons", () => {
    iconRegistry.register("a", "<svg/>");
    iconRegistry.register("b", "<svg/>");
    iconRegistry.clear();
    expect(iconRegistry.names()).toEqual([]);
    expect(iconRegistry.get("a")).toBeUndefined();
  });
});
