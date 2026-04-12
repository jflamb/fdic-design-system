# Token Prefix Unification Strategy

## Summary

The design system originally shipped tokens under two overlapping prefixes:

- `--fdic-*` for system semantic and foundation tokens
- `--ds-*` for older public families, especially typography and some color, spacing, and compatibility aliases

This split fragmented documentation, increased migration ambiguity for downstream adopters, and made it harder to explain which layer is the stable entrypoint for new work.

**Resolution:** `--fdic-*` is now the canonical system token namespace. All `--ds-*` tokens are preserved as deprecated aliases that resolve to their `--fdic-*` equivalents.

## Current State (completed)

All phases of the migration are complete as of 2026-04-12:

- `packages/tokens/styles.css` treats `--fdic-*` as the sole primary system layer for all token categories (colors, spacing, layout, interaction, radius, typography).
- `--ds-*` families are retained as compatibility aliases that resolve to `var(--fdic-*)`.
- Component docs show component custom properties resolving through `var(--fdic-*, fallback)` chains.
- Architecture docs and all documentation markdown describe `--fdic-*` as the canonical system token layer.

## Migration Path

### Phase A: Clarify the contract ✅ (completed 2026-04-12)

- Updated `using-tokens.md` and `customization.md` to state `--fdic-*` is canonical.
- Identified all `--ds-*` families as typography-only compatibility aliases.

### Phase B: Alias before removing ✅ (completed 2026-04-12)

- All 41 `--ds-*` typography tokens are now aliases of `--fdic-*` equivalents in the token generator (`scripts/tokens/generate-dtcg.mjs`).
- `packages/tokens/styles.css` declares canonical `--fdic-font-*`, `--fdic-line-height-*`, `--fdic-letter-spacing-*`, `--fdic-font-weight-*`, `--fdic-heading-padding-*` tokens.
- `--ds-*` aliases resolve to `var(--fdic-*)` — existing consumer code continues to work.
- Component-level `--fd-*` overrides are unchanged.

### Phase C: Deprecate selectively (next)

- Deprecate only the `--ds-*` families that have a clear `--fdic-*` equivalent and a consumer migration path.
- Preserve typography families longer if downstream consumers have not yet migrated off `--ds-*` naming.

## Scope Notes

- `--fd-*` component override properties are not part of this unification discussion and should remain component-scoped.

## Discussion Recommendation

This recommendation is posted for downstream feedback in GitHub Discussion [#184](https://github.com/jflamb/fdic-design-system/discussions/184).

Please use that thread to comment on:

- which `--ds-*` families they use directly
- whether aliases are sufficient for migration
- whether typography should remain under `--ds-*` longer than other token categories
