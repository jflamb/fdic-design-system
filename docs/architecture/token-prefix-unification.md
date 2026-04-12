# Token Prefix Unification Strategy

## Summary

The current consumer surface uses two overlapping token families:

- `--ds-*` for system semantic and foundation tokens
- `--fdic-*` for older public families, especially typography and some color, spacing, and compatibility aliases

This split is workable today but it fragments documentation, increases migration ambiguity for downstream adopters, and makes it harder to explain which layer is the stable entrypoint for new work.

## Current State

Repository evidence on 2026-04-11 shows:

- `packages/tokens/styles.css` treats `--ds-*` as the primary system layer for colors, spacing, layout, interaction, and radius.
- `packages/tokens/styles.css` also still ships `--fdic-*` families for typography and compatibility-oriented values.
- component docs frequently show component custom properties resolving through `var(--fdic-*, fallback)` chains.
- architecture docs already describe `--ds-*` as the preferred system token layer.

## Recommendation

Adopt `--ds-*` as the long-term canonical system token namespace and treat `--fdic-*` as a compatibility layer that is reduced over time.

This does not mean immediate renaming. It means:

1. New system-level tokens should ship under `--ds-*`.
2. Existing `--fdic-*` families should be documented as compatibility or legacy-facing where applicable.
3. Removals should happen only through a versioned migration plan with aliases and deprecation guidance.

## Migration Path

### Phase A: Clarify the contract ✅ (completed 2026-04-12)

- Updated `using-tokens.md` and `customization.md` to state `--ds-*` is canonical.
- Identified all `--fdic-*` families as typography-only compatibility aliases.

### Phase B: Alias before removing ✅ (completed 2026-04-12)

- All 41 `--fdic-*` typography tokens are now aliases of `--ds-*` equivalents in the token generator (`scripts/tokens/generate-dtcg.mjs`).
- `packages/tokens/styles.css` declares canonical `--ds-font-*`, `--ds-line-height-*`, `--ds-letter-spacing-*`, `--ds-font-weight-*`, `--ds-heading-padding-*` tokens.
- `--fdic-*` aliases resolve to `var(--ds-*)` — existing consumer code continues to work.
- Component-level `--fd-*` overrides are unchanged.

### Phase C: Deprecate selectively

- Deprecate only the `--fdic-*` families that have a clear `--ds-*` equivalent and a consumer migration path.
- Preserve typography families longer if no equivalent `--ds-*` naming scheme exists yet.

## Scope Notes

- This recommendation does not propose a mass migration in the current remediation cycle.
- `--fd-*` component override properties are not part of this unification discussion and should remain component-scoped.

## Discussion Recommendation

Post this recommendation as a GitHub Discussion so downstream consumers can comment on:

- which `--fdic-*` families they use directly
- whether aliases are sufficient for migration
- whether typography should remain under `--fdic-*` longer than other token categories
