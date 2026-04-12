# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
