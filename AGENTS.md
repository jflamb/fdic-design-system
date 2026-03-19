# AGENTS

Instructions for AI agents working in this repository.

## Current Stage

- This repository is in early scaffold stage.
- Placeholder code is allowed.
- Do not introduce production-ready visual language, brand styling, or complex component behavior unless explicitly asked.
- Favor minimal, reversible structure over premature implementation.
- The maintainer is working solo for now. Do not assume branch protection, CODEOWNERS, or multi-review workflows are enabled.

## Mission

Build an open source design system for government websites in the financial sector using:

- TypeScript
- Web Components
- A documentation site published via GitHub Pages

The system must prioritize accessibility, trust, clarity, security, and long-term maintainability over visual novelty.

## Source of Truth

- FDIC design specifications in Figma are the primary source of truth for visual design, component anatomy, layout, and interaction intent.
- Implement FDIC components as first-party Web Components in this repository.
- Do not wrap `uswds-elements`.
- Use USWDS as a secondary reference for government UX conventions, accessibility expectations, trust patterns, and content guidance.
- If FDIC design differs from USWDS, follow FDIC design unless doing so would create an accessibility, usability, or policy problem.

## Primary Standards

Use these as defaults unless the maintainer explicitly chooses otherwise:

- USWDS as a secondary reference for government design patterns, accessibility expectations, and trust conventions
- Section 508 compliance as a minimum requirement
- WCAG 2.2 AA as the target standard where feasible
- Plain language for all public-facing guidance and examples
- NIST SSDF and CISA Secure by Design principles for software delivery and supply chain practices

## Non-Negotiables

- Accessibility is a release requirement, not a polish step.
- Accessible components alone are not enough; document page-level and workflow-level usage constraints.
- Prefer native HTML semantics over custom behavior when possible.
- Design for trust in high-stakes financial and public-service workflows.
- Keep decisions explainable, auditable, and easy for future contributors to adopt.

## Accessibility Rules

For any component, pattern, or doc page that is more than placeholder-level, include or preserve:

- keyboard interaction expectations
- focus management expectations
- semantic HTML requirements
- ARIA only when necessary
- screen reader considerations
- zoom, reflow, and responsive behavior
- color contrast expectations
- form labeling, validation, and error recovery behavior where relevant

Do not:

- ship div-based controls when native elements are viable
- hide focus indicators without an accessible replacement
- rely on color alone to convey meaning
- add motion that cannot be reduced or disabled

## Trust and Content Rules

This system is for government and financial-sector use. Optimize for trust and comprehension.

- Use plain language.
- Prefer explicit labels over clever or branded wording.
- Explain why sensitive information is requested in examples and patterns when relevant.
- Treat error prevention, confirmation, and recovery as first-class UX requirements.
- Preserve or encourage established government trust markers such as official identifiers, clear ownership, and policy links.

## Design and Architecture Rules

Prefer this order of operations:

1. Translate FDIC design decisions into tokens
2. Define semantics and usage guidance
3. Define component APIs
4. Implement components

Token architecture should separate:

- core tokens
- semantic tokens
- component tokens

Before introducing non-trivial components, clarify:

- browser support expectations
- theming model
- SSR and hydration expectations if relevant
- form-associated behavior if relevant
- whether a pattern should stay native HTML instead of becoming a custom element
- where USWDS guidance is relevant and where FDIC intentionally diverges

## Documentation Rules

Docs are part of the product, not an afterthought.

When adding real guidance, document:

- intended use
- when not to use
- accessibility notes
- content guidance
- example markup or usage
- known limitations

Keep docs plain, direct, and task-oriented.

## Open Source Governance

Favor lightweight but explicit governance.

- Record important architectural decisions.
- Make breaking changes deliberate and documented.
- Prefer small, reviewable changes over broad speculative refactors.
- If a new component or token set is proposed, include acceptance criteria and rationale.

## Security and Supply Chain

Protect the repo like a public-sector dependency.

- Minimize dependencies.
- Prefer well-understood tooling over novelty.
- Keep build and release steps deterministic.
- Support dependency review, security scanning, and provenance improvements when asked.
- Do not add telemetry, external calls, or third-party hosted assets without a clear reason and documentation.

## Implementation Bias

While the project is young:

- choose placeholder implementations when structure is the main goal
- avoid locking in naming, styling, or API decisions too early
- leave the codebase cleaner and more explicit than you found it

When in doubt, choose the path that improves:

- accessibility
- clarity
- trust
- reversibility
- maintainability

## Working Norms for Agents

- Read existing repo conventions before editing.
- Do not silently introduce major design decisions.
- State assumptions clearly when making structural changes.
- Prefer incremental scaffolding over large one-shot implementations.
- If a requested change conflicts with these instructions, raise the conflict explicitly.
