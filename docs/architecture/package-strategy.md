# Package Strategy

This repository is structured to support more than one client target over time.

## Current direction

- `packages/components` is the first-party implementation layer for FDIC Web Components.
- `packages/react` is a placeholder adapter package for future React support.
- `apps/docs` documents the system and should describe both first-party and adapter usage when that becomes real.

## Rules

- FDIC design specs and tokens remain the source of truth.
- Web Components remain the primary implementation target.
- Framework-specific packages should adapt first-party components instead of redefining design decisions.
- New framework packages should stay thin unless there is a strong usability reason to provide a richer adapter.
- Cross-framework behavior should be documented once and reused, not forked into separate design guidance.

## Likely future package layout

- `packages/tokens`: design tokens if and when token delivery becomes a separate concern
- `packages/components`: first-party Web Components
- `packages/react`: React adapters
- additional adapter packages only when there is a clear user need
