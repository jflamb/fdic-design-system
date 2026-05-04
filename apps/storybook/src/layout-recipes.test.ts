import { render } from "lit";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

import "@jflamb/fdic-ds-components/styles.css";

import { renderRecipe } from "./layout-recipes.stories";

const VIEWPORTS = [
  { width: 390, height: 1800, gutter: 16 },
  { width: 640, height: 1800, gutter: 16 },
  { width: 768, height: 1800, gutter: 32 },
  { width: 1023, height: 1800, gutter: 32 },
  { width: 1040, height: 1800, gutter: 64 },
  { width: 1280, height: 1800, gutter: 64 },
  { width: 1440, height: 1800, gutter: 64 },
  { width: 1600, height: 1800, gutter: 64 },
] as const;

const SHELL_MAX_WIDTH = 1312;
const TOLERANCE = 1;

type SectionRect = {
  name: string;
  rect: DOMRect;
};

const mountRecipe = () => {
  document.body.replaceChildren();
  document.body.style.margin = "0";
  const host = document.createElement("div");
  document.body.append(host);
  render(renderRecipe(), host);
};

const waitForLayout = async () => {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => window.setTimeout(resolve, 50));
};

const expectClose = (actual: number, expected: number, context: string) => {
  expect(
    Math.abs(actual - expected),
    `${context}: expected ${actual} to be within ${TOLERANCE}px of ${expected}`,
  ).toBeLessThanOrEqual(TOLERANCE);
};

const requireElement = <T extends Element>(root: ParentNode, selector: string, name: string) => {
  const element = root.querySelector<T>(selector);
  expect(element, `Missing ${name}: ${selector}`).toBeTruthy();
  return element!;
};

const getLayoutSectionRects = (): SectionRect[] => {
  const globalHeader = requireElement<HTMLElement>(document, "fd-global-header", "global header");
  const pageHeader = requireElement<HTMLElement>(document, "fd-page-header", "page header");
  const feedback = requireElement<HTMLElement>(document, "fd-page-feedback", "page feedback");
  const footer = requireElement<HTMLElement>(document, "fd-global-footer", "global footer");
  const pageBands = Array.from(
    document.querySelectorAll<HTMLElement>(".fdic-page-band__content"),
  );

  expect(pageBands.length, "Expected the Section Bands recipe to render two page bands").toBe(2);

  return [
    {
      name: "global header shell",
      rect: requireElement<HTMLElement>(
        globalHeader.shadowRoot!,
        ".shell",
        "global header shell",
      ).getBoundingClientRect(),
    },
    {
      name: "page header content",
      rect: requireElement<HTMLElement>(
        pageHeader.shadowRoot!,
        ".content",
        "page header content",
      ).getBoundingClientRect(),
    },
    ...pageBands.map((element, index) => ({
      name: `page band ${index + 1}`,
      rect: element.getBoundingClientRect(),
    })),
    {
      name: "page feedback panel",
      rect: requireElement<HTMLElement>(
        feedback.shadowRoot!,
        ".panel",
        "page feedback panel",
      ).getBoundingClientRect(),
    },
    {
      name: "global footer content",
      rect: requireElement<HTMLElement>(
        footer.shadowRoot!,
        ".content",
        "global footer content",
      ).getBoundingClientRect(),
    },
  ];
};

test("Section Bands keeps shell gutters aligned across viewport sizes", async () => {
  for (const viewport of VIEWPORTS) {
    await page.viewport(viewport.width, viewport.height);
    mountRecipe();
    await waitForLayout();

    const layoutWidth = document.documentElement.clientWidth;
    const expectedGutter = layoutWidth <= 640
      ? 16
      : layoutWidth < 1024
        ? 32
        : viewport.gutter;
    const expectedWidth = Math.min(
      SHELL_MAX_WIDTH,
      layoutWidth - 2 * expectedGutter,
    );
    const expectedLeft = (layoutWidth - expectedWidth) / 2;
    const expectedRight = expectedLeft + expectedWidth;
    for (const { name, rect } of getLayoutSectionRects()) {
      const context = `${name} at ${viewport.width}px viewport / ${layoutWidth}px layout`;

      expectClose(rect.left, expectedLeft, `${context} left edge`);
      expectClose(rect.right, expectedRight, `${context} right edge`);
      expectClose(layoutWidth - rect.right, expectedLeft, `${context} right gutter`);
      expectClose(rect.width, expectedWidth, `${context} width`);
    }
  }
});
