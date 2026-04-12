# ADR-001: Component Technology

- Status: Accepted
- Date: 2026-04-11

## Context

The FDIC Design System needs a component model that works across multiple consuming stacks, keeps browser semantics available, and supports a docs-and-Storybook workflow without adding framework lock-in.

The current repository already implements first-party components as Lit-based Web Components and distributes explicit registration entrypoints for consumers.

## Decision

The design system will continue to ship first-party UI components as Lit-based Web Components.

## Consequences

- Components remain framework-agnostic at the distribution layer and can be adopted from plain HTML, CMS templates, or framework wrappers.
- Native HTML semantics, form behavior, and progressive enhancement stay available as first principles instead of being reimplemented per framework.
- Lit remains the authoring layer because it provides a small reactive model, declarative templates, and strong alignment with platform APIs.
- Framework-specific adapters, including React wrappers, are downstream integration surfaces rather than the primary source of truth.
- Documentation, tests, and Storybook examples should continue to describe the Web Component contract first.

## Alternatives Considered

### Framework-native component packages

Rejected because they would fragment the public contract, duplicate accessibility and form logic, and create pressure to keep multiple implementations behaviorally identical.

### Vanilla custom elements without Lit

Rejected because the repository already depends on Lit patterns, controllers, and authored conventions. Replacing Lit would create churn without a compensating platform benefit.
