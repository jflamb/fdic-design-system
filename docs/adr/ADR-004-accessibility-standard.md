# ADR-004: Accessibility Standard

- Status: Accepted
- Date: 2026-04-11

## Context

The FDIC Design System supports public-sector and regulated workflows. Accessibility quality must therefore be a release bar, not an after-the-fact enhancement.

The repository already treats keyboard support, semantics, visible-invalid behavior, docs guidance, and Storybook interaction coverage as first-class requirements.

## Decision

The design system adopts:

- Section 508 conformance as the minimum compliance floor
- WCAG 2.2 AA as the target standard for shipped components, docs, and guidance

## Consequences

- Accessibility expectations must be represented in component implementation, tests, Storybook interaction coverage, and documentation.
- Regressions affecting semantics, focus management, keyboard behavior, contrast, zoom/reflow, or screen reader output should block release work.
- Temporary exceptions require explicit scope, rationale, and follow-up work rather than silent suppression.

## Alternatives Considered

### WCAG 2.1 AA target only

Rejected because the repository is already building toward more current interaction and focus expectations, and regulated consumers benefit from a clearer forward target.

### Best-effort accessibility with no stated bar

Rejected because it produces inconsistent acceptance criteria across components and makes consumer trust harder to earn.
