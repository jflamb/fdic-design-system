# ADR-005: Supported V1 Form Contract

- Status: Accepted
- Date: 2026-04-12
- Status note: Superseded in part by [ADR-009](./ADR-009-submit-capable-fd-button.md) for `fd-button type="submit"` only. Reset behavior, slot-based `fd-field`, wrapper elements inside `fd-field`, and cross-root label discovery remain out of scope.

## Context

The component set already supports native form participation for text-entry and grouped controls, but the public docs need one explicit boundary for how adopters should compose forms today.

Without that boundary, downstream consumers can infer unsupported patterns from internal implementation details, such as treating `fd-button` like a submit control or wrapping `fd-field` children in extra layout containers.

## Decision

The supported v1 form contract is intentionally narrow:

- use native `<form>` elements for form ownership and submission
- use native `<button type="submit">` for primary submit actions
- use `fd-field` only for direct-child `fd-label` + `fd-input` or `fd-textarea` + `fd-message` composition
- use grouped controls such as `fd-radio-group`, `fd-checkbox-group`, and `fd-selector` outside `fd-field`
- do not treat `fd-button` as submit-capable or reset-capable in v1

The following patterns are out of scope for the supported public path:

- `fd-button type="submit"` or `fd-button type="reset"`
- slot-based `fd-field` composition
- wrapper elements inside `fd-field` around the auto-wired label, control, or message
- cross-root discovery between light DOM and another component shadow root for label or message wiring

## Consequences

- Public docs can present one stable form recipe without implying hidden approval of unsupported compositions.
- Downstream adopters know when to stay on native HTML structure instead of expecting the component layer to abstract submission semantics.
- Future expansion beyond this contract will require an explicit follow-up ADR or architecture decision instead of ad hoc documentation drift.

## Alternatives Considered

### Broader wrapper-based `fd-field` composition

Rejected for v1 because it would imply structural guarantees the current implementation does not provide.

### Submit-capable `fd-button`

Rejected for v1 because it would expand the component API surface and blur the boundary between action styling and native form ownership.
