import { describe, it, expect } from "vitest";
import { iconRegistry } from "./registry.js";
// Import triggers auto-registration
import "./phosphor-duotone.js";

describe("phosphor-duotone built-in icons", () => {
  const expectedIcons = [
    "airplane-tilt",
    "arrow-square-out",
    "caret-down",
    "caret-left",
    "caret-right",
    "caret-up",
    "check",
    "check-circle",
    "check-square",
    "download",
    "eye",
    "eye-slash",
    "file-text",
    "fork-knife",
    "funnel",
    "info",
    "lightbulb",
    "linkedin-logo",
    "list",
    "magnifying-glass",
    "minus",
    "minus-square",
    "microsoft-outlook-logo",
    "pencil",
    "plus",
    "printer",
    "share-fat",
    "speedometer",
    "spinner-gap",
    "square",
    "squares-four",
    "star",
    "trash",
    "tree-view",
    "upload",
    "user-circle",
    "warning",
    "warning-circle",
    "warning-octagon",
    "x",
    "x-logo",
  ];

  it("all expected icons are registered after import", () => {
    const registered = iconRegistry.names();
    for (const name of expectedIcons) {
      expect(registered, `expected icon "${name}" to be registered`).toContain(
        name,
      );
    }
    expect(registered).toHaveLength(expectedIcons.length);
  });

  it('each icon SVG contains <svg, viewBox, fill="currentColor", and duotone opacity', () => {
    for (const name of expectedIcons) {
      const svg = iconRegistry.get(name);
      expect(svg, `icon "${name}" should be registered`).toBeDefined();
      expect(svg, `icon "${name}" should contain <svg`).toContain("<svg");
      expect(svg, `icon "${name}" should contain viewBox`).toContain(
        "viewBox",
      );
      expect(
        svg,
        `icon "${name}" should contain fill="currentColor"`,
      ).toContain('fill="currentColor"');
      expect(svg, `icon "${name}" should use duotone opacity`).toContain(
        'opacity="0.2"',
      );
    }
  });

  it("uses the official duotone Phosphor geometry for user-circle and check-square", () => {
    expect(iconRegistry.get("user-circle")).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a95.76,95.76,0,0,1-31.8,71.37A72,72,0,0,0,128,160a40,40,0,1,0-40-40,40,40,0,0,0,40,40,72,72,0,0,0-64.2,39.37h0A96,96,0,1,1,224,128Z" opacity="0.2"/><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"/></svg>',
    );
    expect(iconRegistry.get("check-square")).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M216,48V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"/><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>',
    );
  });
});
