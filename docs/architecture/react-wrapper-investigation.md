# React Wrapper Investigation

## Question

Should the repository generate an initial React wrapper surface for representative components using `@lit/react`?

## Findings

- Lit’s current official guidance supports React wrappers via `@lit/react` and `createComponent()`.
- The repository already has a dedicated `@fdic-ds/react` workspace and React is available in the workspace.
- The repository does not currently have `@lit/react` installed in `node_modules`.
- The component source of truth remains the Web Component layer, which aligns with wrapper generation rather than hand-maintained React reimplementation.

## Viability

The approach is technically viable.

The smallest sustainable shape is:

- keep Web Components as the primary contract
- generate thin React wrappers for selected public components
- map only explicit custom events where the element dispatches them
- avoid introducing React-only behavior or divergent prop contracts

## Recommended Initial Scope

Start with:

- `fd-button`
- `fd-input`
- `fd-alert`

These cover a representative action control, a form-associated input, and a feedback component without requiring the full inventory to be wrapped immediately.

## Proposed Generation Model

- generate wrapper modules from a checked-in source-of-truth list
- generate the React package index from the same list
- keep wrapper code thin and declarative
- validate that generated React files are in sync during `validate:components`

## Current Blocker

`@lit/react` is not currently installed in the workspace. Until that dependency is added and locked, the wrapper package cannot be built as an actual generated adapter surface.

## Alternatives if Deferred

- keep `@fdic-ds/react` private and document the package as intentionally pending
- publish framework guidance that points React consumers to direct Web Component usage until wrappers are promoted
- revisit generation once dependency policy and release expectations for wrapper packages are clarified
