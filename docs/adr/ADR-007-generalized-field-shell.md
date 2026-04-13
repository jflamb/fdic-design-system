# ADR-007: Generalized Field Shell

- Status: Accepted
- Date: 2026-04-12

## Context

ADR-005 defined the supported v1 form contract around native `<form>` ownership, native submit buttons, and a deliberately narrow `fd-field` helper for direct-child `fd-label` + `fd-input` or `fd-textarea` + `fd-message` composition.

ADR-006 then established the promotion criteria for expanding the form system: repeated workflow need, narrow platform-neutral APIs, and explicit governance before componentization. Since that ADR landed, the docs and downstream references have repeated the same field-shell responsibilities in two incompatible ways:

- text-entry controls rely on `fd-field` or manual `fd-label`/`fd-message` wiring
- grouped controls such as `fd-selector`, `fd-radio-group`, `fd-checkbox-group`, and `fd-file-input` already own some combination of label, description, error, or grouping semantics

That split forces adopters to memorize different shell rules for text-entry versus grouped controls even when the layout and workflow intent are the same. Expanding `fd-field` in place would blur its documented v1 boundary, change the meaning of an already-supported helper, and create migration ambiguity for downstream adopters who currently rely on its direct-child contract.

## Decision

Introduce a new long-term field-shell primitive named `fd-form-field`.

`fd-form-field` is the preferred generalized shell for new form composition work that needs one consistent contract across major control families:

- `fd-input`
- `fd-textarea`
- `fd-selector`
- `fd-radio-group`
- `fd-checkbox-group`
- `fd-file-input`

`fd-form-field` will:

- own label, description, error, required or optional affordance, and field spacing or layout
- use explicit control anchoring and explicit wiring instead of sibling discovery or wrapper inference
- support grouped controls without depending on `fd-field` direct-child rules
- remain presentational and accessibility-focused, not a form-state or transport abstraction

`fd-form-field` will not:

- own submit behavior
- own validation timing
- own form state, schema, or client-side orchestration
- weaken the native-form guidance from ADR-005

`fd-field` remains supported as simple text-entry sugar for the v1 direct-child recipe. It is not deprecated by this ADR, and its documented contract does not broaden.

## Relationship To Existing Contracts

The following contracts remain stable during rollout:

- native `<form>` continues to own form submission
- native `<button type="submit">` continues to own primary submit behavior
- `fd-button` remains intentionally non-submit-capable
- `fd-field` remains limited to direct-child text-entry composition
- grouped controls remain valid standalone controls when their native or component-owned semantics are sufficient

The following change in recommendation, not in support status:

- `fd-form-field` becomes the preferred long-term shell when consumers need one field wrapper contract across text-entry and grouped controls
- `fd-field` becomes documented as limited-purpose sugar rather than the long-term field-shell direction

## Consequences

- The repo gains one preferred field-shell primitive without redefining `fd-field` in place.
- Docs can stop teaching different shell recipes for text-entry versus grouped controls.
- Consumers keep a stable v1 migration path: existing `fd-field` compositions remain supported, while new work can adopt `fd-form-field`.
- Accessibility wiring moves toward explicit authored relationships instead of implicit sibling discovery for new wrapper-based composition.

## Alternatives Considered

### Expand `fd-field` in place

Rejected because it would repurpose an already-supported public helper with a much broader meaning. That would make migration and support boundaries ambiguous and would undermine ADR-005's explicit v1 contract.

### Keep only docs-level shell recipes

Rejected because the repo now has repeated shell structure across multiple control families, and hand-authoring that structure creates inconsistency risk that meets ADR-006's promotion criteria.

### Introduce a larger form container or framework API

Rejected because the repeated need is field-shell composition, not schema, validation-engine, or workflow-state ownership. A larger abstraction would exceed the promotion criteria and weaken the native-form boundary.
