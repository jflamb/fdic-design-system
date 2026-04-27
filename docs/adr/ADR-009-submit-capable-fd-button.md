# ADR-009: Submit-Capable fd-button

- Status: Accepted ([implementation issue #193](https://github.com/jflamb/fdic-design-system/issues/193))
- Date: 2026-04-27
- Supersedes (in part): ADR-005, ADR-006
- Amends: ADR-008

## Context

ADR-005 established a narrow v1 form contract requiring native `<button type="submit">` for primary submit actions, and explicitly excluded `fd-button type="submit"` from the supported public path. ADR-006 reaffirmed that boundary as part of a deferred-pattern list and required a new ADR before revisiting. ADR-008 carried that boundary forward as a "stable contract during migration" while workflow primitives landed.

Since those ADRs were accepted (2026-04-12), one practical problem has surfaced: the FormActionRow story embedded in the Button docs page renders a bare native `<button type="submit">` next to two `fd-button` siblings. The browser UA stylesheet renders that submit element in default gray, while the secondary `fd-button` actions render with FDIC token-driven styling. Readers see the recommended primary submit action presented as the least-styled element on the page.

The repository ships no documented selector, class, or token recipe for styling a native submit button to match `fd-button`. Every adopter who follows the form-workflows guide must either ship a visually inconsistent submit action or independently re-derive `fd-button` styling against a native button and keep it in sync as tokens evolve. Neither outcome aligns with the design system's stated priorities of trust, clarity, and long-term maintainability.

The reactive `type` property is already declared on the component class but the render path hardcodes `type="button"`, so the API surface for this expansion already exists in source — only the rendering behavior is gated.

## Decision

Make `fd-button` submit-capable by promoting it to a form-associated custom element and honoring `type="submit"` at render time.

### In scope

- `fd-button` becomes a form-associated custom element (`static formAssociated = true` + `ElementInternals`).
- `type="submit"` renders the internal `<button>` with `type="submit"` and triggers the host form's submission via the form-association API on activation.
- Default-submit-on-Enter inside `<form>` works because the internal native button still owns that browser behavior.
- `disabled` and `loading` continue to suppress activation and therefore suppress submission.
- The form-workflows guide and the FormActionRow story migrate to use `fd-button type="submit"` as the primary pattern.

### Explicitly out of scope (still deferred)

- `type="reset"` on `fd-button`. The form-workflows guide already says workflows should not include reset or clear buttons; making `fd-button` reset-capable solves a problem the design system actively discourages.
- The full `form*` attribute family (`formaction`, `formmethod`, `formnovalidate`, `formtarget`, `formenctype`).
- `name` and `value` participation in form submission payloads.
- Constraint validation surfaces on `fd-button` itself.
- Making any other action-styling primitive form-associated.

These deferrals can be revisited later under their own ADR if real adopter need emerges.

### Effect on prior ADRs

- ADR-005's exclusion of `fd-button type="submit"` is superseded for `type="submit"` only. Reset, slot-based `fd-field`, wrapper elements inside `fd-field`, and cross-root label discovery remain out of scope.
- ADR-006's deferred-patterns list is amended to remove `fd-button type="submit"` and retain `fd-button type="reset"` as deferred.
- ADR-008's "stable contract during migration" line stating `fd-button does not become submit-capable` is amended in this ADR. Workflow primitives (`fd-error-summary`, `fd-review-list`, `fd-confirmation-record`) remain independent of submit-capable button work.

## Consequences

- The recommended primary submit action in form workflows is rendered with FDIC token-driven styling instead of the browser default. The docs page that prompted this ADR shows a coherent action row by default.
- Adopters no longer need to re-derive `fd-button` styling for a parallel native submit button.
- The component layer takes on form-association responsibility, which adds maintenance surface (test environment compatibility, behavior across nested shadow boundaries, and constraint validation participation if pursued later).
- Pre-1.0 is the cheapest time to make this change. Deferring past v1 makes the contract harder to expand without a breaking change.
- The boundary between "action styling" and "native form ownership" softens slightly. The line moves from "`fd-button` never submits" to "`fd-button` may submit when authored as `type="submit"`, and otherwise behaves as a button-mode action."

## Alternatives Considered

### Keep ADR-005/006/008 as-is and ship a documented native-button styling recipe

Considered. A stable selector or class applied to a native `<button type="submit">` would close the styling gap without expanding the component contract. Rejected as the primary path because it forces every adopter to remember the recipe and keeps two parallel styling implementations in sync. It remains a reasonable mitigation if this ADR is rejected.

### Make `fd-button` submit-capable via `closest("form")?.requestSubmit()` from a click handler

Rejected. This works in the simplest light-DOM-form case and breaks subtly across nested shadow boundaries and implicit Enter submission. Form-associated custom elements are the correct primitive when the platform offers one.

### Revisit the full deferred-patterns list at once

Rejected. `type="reset"` and the `form*` attribute family carry separate tradeoffs and have weaker adopter demand. Bundling them dilutes review focus.

### Defer until post-v1

Rejected. Pre-v1 is the cheapest expansion window. Deferring would lock the unstyled-submit pattern into v1 docs and make the change a breaking expansion of a stable contract later.
