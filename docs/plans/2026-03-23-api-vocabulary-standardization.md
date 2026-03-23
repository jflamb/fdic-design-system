# Public API Vocabulary Standardization

Issue: [#57](https://github.com/jflamb/fdic-design-system/issues/57)  
Discussion: [#49](https://github.com/jflamb/fdic-design-system/discussions/49)

## Summary

This note defines the public event and reflection contract for the first API
vocabulary standardization pass across the FDIC Design System component
library.

The target of this pass is narrow on purpose:

- public event names
- public event detail payload shapes
- compatibility behavior for deprecated event names
- reflection policy for documented public attributes

It does not attempt to normalize every public API surface in one pass.

## Decisions

### 1. Public event names should be component-specific

Use component-specific names for public component events instead of generic
library-wide names when the event belongs to one concrete component surface.

Adopted pattern:

- value or selection changes: `fd-{component}-change`
- open-state changes: `fd-{component}-open-change`
- action or activation events: `fd-{component}-action` or
  `fd-{component}-select` when selection is the more accurate verb

Examples from this pass:

- `fd-checkbox-group-change`
- `fd-radio-group-change`
- `fd-selector-change`
- `fd-menu-open-change`
- `fd-selector-open-change`
- `fd-split-button-open-change`
- `fd-menu-item-select`
- `fd-split-button-action`

### 2. Open-state events standardize on a single event with `detail.open`

For the affected public components, open-state changes use a single
component-specific event carrying `detail: { open: boolean }`.

Chosen over open/close event pairs because:

- it matches the existing `fd-menu` and `fd-split-button` state model
- it keeps listener setup simpler for wrapper packages and consumers
- it avoids duplicating type exports for symmetric state changes

Compatibility bridge:

- `fd-menu` continues to dual-fire deprecated `fd-open`
- `fd-selector` continues to dual-fire deprecated `fd-selector-open` and
  `fd-selector-close`
- `fd-split-button` continues to dual-fire deprecated `fd-split-open`

### 3. Value and selection change payloads standardize on `value` and `values`

All standardized value or selection change events must include:

- `detail.value: string`

Multi-select components must additionally include:

- `detail.values: string[]`

This means:

- single-select components emit `{ value }`
- multi-select components emit `{ value, values }`

For `fd-checkbox-group`, `value` mirrors the first selected value in DOM order.
This matches the existing `fd-selector` multi-select convention and gives
wrapper packages one stable single-value field when they need it.

### 4. Action events may use empty detail when the source element is the API

Not every public event needs a value payload.

For action-style components where the activated element is the public source of
truth, the standardized detail payload may be empty:

- `fd-menu-item-select` -> `{}`
- `fd-split-button-action` -> `{}`

This pass does not introduce a new `value` attribute on `fd-menu-item`.

### 5. Deprecated events keep their old payload shape during overlap

When an event is deprecated in favor of a new component-specific event:

- both old and new events fire during the overlap period
- the new event carries the new standardized payload
- the deprecated event keeps its previous payload shape

This minimizes upgrade breakage for current consumers.

Applied in this pass:

- `fd-group-change`
  - checkbox group deprecated payload stays `{ checkedValues }`
  - radio group deprecated payload stays `{ selectedValue }`
- `fd-open` stays `{ open }`
- `fd-selector-open` and `fd-selector-close` remain no-detail compatibility
  events
- `fd-select` remains `{}`
- `fd-split-open` remains `{ open }`
- `fd-split-action` remains `{}`

Removal target:

- remove deprecated event names in the next breaking major version after this
  contract has been documented and shipped

### 6. Reflection policy defaults to reflecting documented public attributes

Documented public attributes should reflect unless they are explicitly one of:

- property-only API
- internal state not intended for DOM inspection
- derived state documented as read-only

Rationale:

- consumers reasonably inspect documented attributes in the DOM
- wrapper packages and tests benefit from markup round-tripping
- CSS selectors should not depend on undocumented implementation details

Applied in this pass:

- `fd-split-button`
  - `trigger-label` reflects
  - `menu-placement` reflects
  - `open` remains reflected and read-only derived state

## Out of scope clarifications

- Internal wiring events such as `fd-option-select` are not part of the public
  vocabulary contract for this pass.
- This note does not introduce a broader part, slot, or attribute naming
  overhaul outside the targeted components.

## Implementation notes

- Export public event detail types from `packages/components`
- Use the exported types in component code where practical so the types drive
  the runtime contract
- Update docs and stories anywhere public event names or attribute reflection
  behavior changed
