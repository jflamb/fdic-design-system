# Package Strategy

This repository has both published consumer packages and private workspace wiring. Treat those surfaces differently.

## Public consumer packages

The public package contract for adopters is:

- `@jflamb/fdic-ds-components`
- `@jflamb/fdic-ds-tokens`

Consumer-facing docs, examples, and downstream references should use only those published package names and their documented subpaths.

## Internal workspace wiring

The repository uses npm workspaces and local `file:` links so docs, Storybook, and validation tasks can exercise unpublished changes before release.

That wiring is internal repository setup, not part of the public adoption contract. Consumer-facing docs should describe only the published GitHub Packages installation path.

## Non-public modules

The following should be treated as non-public API unless a package export explicitly says otherwise:

- Storybook-only stories, fixtures, and reference data under `apps/storybook/`
- private app wiring in `apps/*`
- unpublished helper modules that are present only to support docs, tests, or workbench composition

## Rules

- FDIC design specs and tokens remain the source of truth.
- Web Components remain the primary implementation target.
- Framework-specific packages should adapt first-party components instead of redefining design decisions.
- New framework packages should stay thin unless there is a strong usability reason to provide a richer adapter.
- Cross-framework behavior should be documented once and reused, not forked into separate design guidance.
- Public docs and examples use published consumer imports. Internal workbench code may use workspace aliases where the repository needs non-public helpers.

## Likely future package layout

- `packages/tokens`: design tokens if and when token delivery becomes a separate concern
- `packages/components`: first-party Web Components
- `packages/react`: React adapters
- additional adapter packages only when there is a clear user need
