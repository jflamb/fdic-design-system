import axe, { type RunOptions, type Result } from "axe-core";
import { expect } from "vitest";

type AxeTarget = Document | Element;

const componentAxeOptions: RunOptions = {
  rules: {
    // happy-dom does not compute rendered color contrast the way a browser does,
    // so keep this browser-dependent rule for the Storybook tier instead.
    "color-contrast": { enabled: false },
  },
};

function formatViolations(violations: Result["violations"]) {
  return violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      target: node.target,
      failureSummary: node.failureSummary,
    })),
  }));
}

export async function expectNoAxeViolations(
  target: AxeTarget,
  options?: RunOptions,
) {
  const results = await axe.run(target, {
    ...componentAxeOptions,
    ...options,
    rules: {
      ...componentAxeOptions.rules,
      ...options?.rules,
    },
  });

  expect(formatViolations(results.violations)).toEqual([]);
}

