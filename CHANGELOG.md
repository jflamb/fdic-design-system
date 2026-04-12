# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Generated React wrappers for every first-class web component, wired into sync and validation workflows.
- Architecture decision records covering component technology, token architecture, form association, and accessibility expectations.
- Shared component test utilities plus broader accessibility assertions across the under-tested component suite.
- Browser support documentation with a published support matrix and root Browserslist target.
- Consumer guides for token usage, CMS integration, and trust-pattern adoption, plus a contributor quick-start in `CONTRIBUTING.md`.
- Popover API migration for the `fd-selector` dropdown, replacing the legacy overlay layering path.
- GitHub Discussion [#184](https://github.com/jflamb/fdic-design-system/discussions/184) to collect downstream feedback on token namespace unification and alias-removal timing.

### Changed

- Reversed token prefix direction: `--fdic-*` is now the canonical system token namespace. `--ds-*` tokens are preserved as deprecated aliases for backward compatibility. This aligns with government design system naming conventions and avoids namespace collisions with other `--ds-*` systems.
- Expanded component package side-effect coverage so published entry points align with the actual runtime registration surface.
- Raised the component test coverage floor across the audited suite, including the second-tier collection, content, and supporting components.
- Added Storybook interaction coverage for priority component stories and validation lifecycle examples for form flows.
- Clarified the token namespace contract so new adoption prefers `--fdic-*` while public `--ds-*` typography families remain supported.
- Converted all `--ds-*` typography tokens into deprecated aliases of canonical `--fdic-*` equivalents.
- Migrated component and docs CSS token-family call sites from `var(--ds-*)` to `var(--fdic-*)`.
- Migrated `apps/docs/.vitepress/theme/prose.css` spacing and radius usage from `--ds-*` tokens to canonical `--fdic-*` tokens and removed the redundant local token declarations.
- Renamed prose-local callout variables from `--fdic-callout-*` to `--fdic-docs-callout-*` for docs-theme namespace consistency.

### Fixed

- Re-synced generated component metadata and package surfaces so validation catches drift on the main branch.
- Removed the remaining tsup ignored-bare-import warnings by correcting component package side-effect declarations.
- Reduced Storybook test noise by suppressing Lit dev mode warnings, eliminating duplicate ResizeObserver `console.error` output, and fixing the `fd-visual` update cycle warning.

## [0.1.0]

### Added

- Inventory-driven component sync and validation workflows that keep package exports,
  registration entry points, docs navigation, and Storybook arg metadata aligned.
- A Web Components package with FDIC-focused form, messaging, navigation, layout, and
  content primitives.
- A token package that ships CSS and DTCG JSON outputs for shared foundations and
  downstream integration.
- VitePress documentation and Storybook examples covering foundations, accessibility,
  and component usage guidance.

### Changed

- Standardized the published package surface for components, tokens, docs, and
  supporting tooling into an npm workspaces monorepo.
- Established accessibility, validation, and documentation expectations as part of the
  component delivery workflow.

### Fixed

- Re-synced generated component surfaces so validation can confirm metadata, docs, and
  package exports are current on the main branch.
