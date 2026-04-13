import { render } from "lit";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

import "../../../packages/components/styles.css";

import {
  COMPOSITION_PATTERNS_TEST_ID,
  renderCompositionPatternsFixture,
} from "./composition-patterns.fixtures";

const mountFixture = () => {
  document.body.replaceChildren();
  document.body.style.margin = "0";
  const host = document.createElement("div");
  document.body.append(host);
  render(renderCompositionPatternsFixture(), host);
};

const verifySemanticStructure = () => {
  const root = document.querySelector<HTMLElement>(
    `[data-testid="${COMPOSITION_PATTERNS_TEST_ID}"]`,
  );
  const sections = document.querySelectorAll("section");
  const listColumns = document.querySelectorAll(".fdic-composition-link-column__list");
  const listItems = document.querySelectorAll(".fdic-composition-link-column__list li");
  const namedLandmarks = document.querySelectorAll("section[aria-labelledby], nav[aria-labelledby]");
  const roleLists = document.querySelectorAll('[role="list"]');
  const heroImage = document.querySelector<HTMLImageElement>(
    ".fdic-composition-story__media img",
  );

  expect(root).toBeTruthy();
  expect(sections.length).toBe(8);
  expect(namedLandmarks.length).toBe(9);
  expect(listColumns.length).toBe(3);
  expect(listItems.length).toBe(6);
  expect(roleLists.length).toBe(0);
  expect(heroImage?.getAttribute("alt")).toBe(
    "FDIC staff reviewing guidance on a laptop",
  );
};

const renderAtViewport = async (width: number, height: number) => {
  await page.viewport(width, height);
  mountFixture();
  verifySemanticStructure();
};

test("composition patterns render and stay semantic at desktop width", async () => {
  await renderAtViewport(1440, 1800);

  const root = page.getByTestId(COMPOSITION_PATTERNS_TEST_ID);
  await expect.element(root).toBeVisible();
  await expect
    .element(page.getByRole("heading", { level: 1, name: "Composition patterns with semantic HTML" }))
    .toBeVisible();
  await expect
    .element(page.getByRole("navigation", { name: "Grouped resources" }))
    .toBeVisible();
  await expect.element(root).toMatchScreenshot("composition-patterns-desktop");
});

test("composition patterns render and stay semantic at mobile width", async () => {
  await renderAtViewport(390, 2400);

  const root = page.getByTestId(COMPOSITION_PATTERNS_TEST_ID);
  await expect.element(root).toBeVisible();
  await expect
    .element(page.getByRole("heading", { level: 2, name: "Grouped resources" }))
    .toBeVisible();
  await expect.element(root).toMatchScreenshot("composition-patterns-mobile");
});
