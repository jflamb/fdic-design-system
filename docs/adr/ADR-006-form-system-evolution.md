# ADR-006: Form System Evolution Strategy

- Status: Accepted
- Date: 2026-04-12

## Context

ADR-005 established the narrow v1 form contract: native `<form>` ownership, native `<button type="submit">`, direct-child `fd-field` composition, and no submit-capable `fd-button`. That boundary is now documented, validated, and adopted by at least one downstream reference.

The remaining question is not clarity — it is whether this boundary is the intended long-term product model, or the first tier of a broader form system. Without an explicit evolution strategy, future contributors will debate scope on a case-by-case basis.

## Decision

Adopt a three-tier form evolution strategy.

### Tier 1 — Keep the v1 contract as the stable default

The supported v1 contract from ADR-005 remains the recommended public path for all current adopters. No behavior changes to `fd-button`, no expansion of `fd-field`, no new form primitives.

### Tier 2 — Introduce docs-only composition patterns before new components

Before creating any new form primitives, define higher-level patterns as reference compositions in documentation and Storybook, not as reusable components.

Candidate patterns for documentation:

- Blocked submit with error summary
- Review-before-submit step
- Confirmation receipt
- Grouped-field section with trust and privacy copy
- Conditional reveal within a native fieldset

These compositions prove repetition, keep accessibility and content rules explicit, and let the team observe whether real adopters need reusable shells.

### Tier 3 — Only componentize if repetition is proven

Only after multiple workflows or downstream adopters repeat the same structure should the repo consider new supporting primitives. Possible future candidates include `fd-error-summary`, `fd-form-section`, `fd-review-list`, and `fd-confirmation-record`.

Promotion criteria — all must be true:

1. Figma defines the anatomy across required states
2. Multiple workflows need the same semantics
3. Hand-authoring causes real inconsistency risk
4. The API can stay narrow and platform-neutral

### Patterns explicitly deferred

The following are not planned and require their own ADR if revisited:

- `fd-button type="submit"` or `fd-button type="reset"`
- Slot-based `fd-field` composition
- A full form framework or form-level state manager
- Cross-root label or message wiring

## Consequences

- Maintainers have a documented decision tree for evaluating future form work.
- Contributors stop debating `fd-button` submit behavior on a case-by-case basis.
- Future form proposals are evaluated against explicit promotion criteria instead of ad hoc judgment.
- The v1 contract is affirmed as stable, not deprecated or provisional.

## Alternatives Considered

### Jump directly to broader componentization

Rejected because the repo has not yet proven repeated need across multiple downstream adopters. Speculative abstraction is the primary risk this ADR prevents.

### Keep the v1 contract without an evolution path

Rejected because it leaves the long-term direction implicit. Contributors would either avoid form work entirely or propose expansions without a shared framework for evaluation.
