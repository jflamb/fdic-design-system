# ADR-002: Token Architecture

- Status: Accepted
- Date: 2026-04-11

## Context

The design system needs tokens that support:

- design-to-code alignment from FDIC source materials
- direct CSS consumption by downstream teams
- machine-readable exports for tooling and documentation
- clear separation between raw values, semantic roles, and component overrides

The repository already ships token outputs in CSS and DTCG-compatible JSON, with consumer usage split between `--fdic-*` semantic/foundation tokens and some legacy/public `--fdic-*` families.

## Decision

The design system will keep a three-layer token architecture:

1. core and palette values for primitive scales
2. semantic and foundation tokens for reusable system roles
3. component-level custom properties for authored component overrides

The canonical distribution formats remain CSS custom properties and DTCG-oriented JSON exports.

## Consequences

- Consumers can adopt tokens from CSS alone or from structured JSON pipelines.
- Semantic `--fdic-*` tokens remain the preferred public system layer for new consumption.
- Component-level `--fd-*` custom properties continue to expose focused override points without turning component CSS into a second token system.
- Any future cleanup of legacy `--fdic-*` token families should be handled as an explicit migration with compatibility aliases, not an ad hoc rename.

## Alternatives Considered

### Component-only token exports

Rejected because consumers also need page, shell, and prose foundations outside component boundaries.

### CSS-only distribution with no structured token export

Rejected because build tooling, design tooling, and downstream automation benefit from structured JSON.
