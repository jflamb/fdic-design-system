import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { expect } from "storybook/test";

import { renderCompositionPatternsFixture } from "./composition-patterns.fixtures";

const meta = {
  title: "Foundations/Composition Patterns",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      test: "error",
    },
  },
  render: renderCompositionPatternsFixture,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const CanonicalContract: Story = {};

CanonicalContract.play = async ({ canvasElement }) => {
  const root = canvasElement.querySelector('[data-testid="composition-patterns-canonical"]');
  const sections = canvasElement.querySelectorAll("section");
  const nav = canvasElement.querySelector("nav");
  const listColumns = canvasElement.querySelectorAll(".fdic-composition-link-column__list");
  const grid = canvasElement.querySelector(".fdic-composition-link-grid");
  const img = canvasElement.querySelector(".fdic-composition-story__media img");

  expect(root).toBeTruthy();
  expect(sections.length).toBeGreaterThanOrEqual(8);
  expect(canvasElement.querySelectorAll("section[aria-labelledby], nav[aria-labelledby]")).toHaveLength(9);
  expect(nav?.getAttribute("aria-labelledby")).toBe("resources-title");
  expect(listColumns.length).toBe(3);
  expect(grid?.tagName).toBe("UL");
  expect(img?.getAttribute("alt")).toBe("FDIC staff reviewing guidance on a laptop");
};
