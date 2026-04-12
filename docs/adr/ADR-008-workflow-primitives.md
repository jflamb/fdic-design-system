# ADR-008: Workflow Primitives For Consequential Form Journeys

- Status: Accepted
- Date: 2026-04-12

## Context

ADR-006 explicitly allowed new workflow primitives only after repeated use was proven in docs and downstream references. That evidence now exists in the repository:

- blocked-submit examples repeat the same focusable error-summary shell
- review-before-submit examples repeat the same label/value/change-action presentation
- confirmation and receipt examples repeat the same completion, record-keeping, and next-steps shell
- downstream references such as the CMS filing guide repeat these workflow structures in high-stakes filing scenarios

These patterns meet the ADR-006 promotion criteria:

1. The workflow anatomy is already documented for consequential public-service submissions.
2. Multiple workflows use the same semantics.
3. Hand-authored markup creates inconsistency risk in headings, focus targets, list structure, and record-keeping language.
4. The APIs can stay narrow, presentational, and platform-neutral.

The remaining architectural risk is overreach. These patterns are adjacent to validation, navigation, and state orchestration, so the repo needs explicit limits before componentizing them.

## Decision

Introduce a narrow workflow primitive set:

- `fd-error-summary`
- `fd-review-list`
- `fd-confirmation-record`

`fd-review-item` may be introduced as a supporting embedded primitive if `fd-review-list` needs a repeatable item contract for label/value/change rows.

These primitives standardize repeated consequential-workflow structure while staying outside form-framework territory.

### `fd-error-summary`

`fd-error-summary` is a submit-scoped navigation surface. It:

- renders a heading, optional introduction, and a list of authored correction links
- exposes a focusable summary container and optional autofocus behavior
- does not discover errors, validate fields, or decide when a page is invalid

### `fd-review-list`

`fd-review-list` standardizes review-before-submit presentation. It:

- renders semantic review rows for label/value pairs
- supports optional change actions
- keeps orchestration, routing, and state ownership outside the component

### `fd-confirmation-record`

`fd-confirmation-record` standardizes completion and receipt presentation. It:

- renders completion messaging, reference information, next steps, and record-keeping guidance
- supports follow-up actions as authored content
- does not infer workflow status from transport or business logic

## Stable Contracts During Migration

The following repository contracts remain unchanged:

- native `<form>` owns submission
- native `<button type="submit">` owns primary submit behavior
- `fd-button` does not become submit-capable
- inline field or group errors remain the primary correction surface
- workflow primitives do not own validation timing, transport, or form state

## Consequences

- Repeated high-stakes workflow shells become consistent across docs, stories, and downstream references.
- The public package surface expands with presentational workflow primitives, not a form framework.
- Accessibility-sensitive behavior such as heading structure, focus target choice, summary link semantics, and record-keeping guidance can be documented and tested once instead of hand-authored repeatedly.
- Consumers retain explicit control over when summaries appear, what errors are listed, and how review or confirmation content is sourced.

## Alternatives Considered

### Keep workflow patterns as hand-authored markup only

Rejected because the repo has enough repeated consequential workflow structure that inconsistency risk now outweighs the cost of narrow primitives.

### Introduce a multi-step workflow engine

Rejected because the evidence supports structural repetition, not state-machine ownership. Workflow progression, validation timing, and submission transport remain application concerns.

### Add only `fd-error-summary` and leave review or confirmation markup hand-authored

Rejected because the review and confirmation shells are repeated in the same downstream contexts and are subject to the same consistency and trust-language risks.
