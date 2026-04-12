# ADR-003: Form Association Strategy

- Status: Accepted
- Date: 2026-04-11

## Context

Form controls in this system need to participate in native forms, preserve reset behavior, expose validity correctly, and keep visible-invalid behavior separate from internal validity state.

The current component set already uses form-associated custom elements and shared controller patterns for text-entry and grouped form controls.

## Decision

The design system will use form-associated custom elements backed by `ElementInternals` where a component must participate in form submission, reset, or validity.

Visible invalid state remains a distinct lifecycle concern:

- internal validity is synchronized continuously
- visible invalid styling is revealed only at the documented visibility boundaries
- `data-user-invalid` remains the shared host indicator for revealed invalid state

## Consequences

- Components retain native form participation instead of simulating it in framework code.
- Validation behavior stays consistent across inputs, grouped controls, and future form-associated components.
- `aria-invalid` can stay tied to revealed invalid state instead of authored message presence alone.
- Shared controllers and utilities remain the preferred implementation path for new controls.

## Alternatives Considered

### Light-DOM native controls only

Rejected because several components need encapsulated structure, slots, and stronger internal wiring than a pure light-DOM approach provides.

### Custom form serialization without `ElementInternals`

Rejected because it would recreate native browser behavior in application code and increase the risk of reset, submission, and accessibility regressions.
