# AGENTS

Instructions for AI agents working in this repository.

## Current Stage

- This repository has working components (`fd-button`, `fd-icon`), real tests, Storybook, a VitePress docs site deployed via GitHub Pages, and multiple merged PRs with proper conventional commits.
- Placeholder code is allowed for new scaffolding, but existing components follow production-quality standards including tests, docs, stories, and accessibility.
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

## Tech Stack

- **Component authoring**: Lit (LitElement) — all first-party components use Lit.
- **Build**: tsup for component and React wrapper packages.
- **Testing**: Vitest with happy-dom environment. Test files are co-located with source (`*.test.ts` alongside `*.ts` in `src/components/`).
- **Documentation site**: VitePress (`apps/docs/`).
- **Component workbench**: Storybook (`apps/storybook/`).
- **React wrappers**: `packages/react/` — auto-generated wrappers for React consumers.
- **Icons**: Phosphor Icons embedded as inline SVG strings in an icon registry (`src/icons/`).

## Monorepo Structure and Build Order

This is an npm-workspaces monorepo. Build order matters because downstream packages depend on upstream outputs:

```
npm run build:components  →  npm run build:react  →  npm run build:docs
```

Key workspace scripts (run from the repo root):

| Script | Purpose |
|--------|---------|
| `npm run test:components` | Run all component tests (Vitest + happy-dom) |
| `npm run build` | Full sequential build (components → react → docs) |
| `npm run dev:docs` | Start VitePress dev server |
| `npm run dev:storybook` | Start Storybook dev server |
| `npm run build:storybook` | Build Storybook for deployment |

## Commit Message Conventions

Use conventional commits with a scope:

```
feat(button): add loading state with spinner
fix(button): suppress aria-labelledby when loading-label is active
docs(button): add loading state usage guidance
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`. Scope is typically the component or area name.

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

### VitePress Component Doc Pages

Component doc pages live in `apps/docs/components/` and follow a consistent structure:

1. `# Component Name` — title heading
2. Intro block with `.fdic-foundation-intro` wrapper and `.fdic-eyebrow` span
3. `## When to use` / `## When not to use`
4. `## Examples` — with `<StoryEmbed storyId="..." caption="..." />` components referencing Storybook story IDs
5. `## Best practices` — do/don't cards
6. `## Content guidelines`
7. `## Accessibility`
8. `## Known limitations`
9. `## Related components`

Story IDs follow the pattern `components-{name}--{variant-kebab-case}` (e.g., `components-button--loading-with-label` maps to the `LoadingWithLabel` story export).

### Storybook Story Conventions

- Stories live in `apps/storybook/src/` as `fd-{component}.stories.ts`.
- Use `@storybook/web-components-vite` with Lit `html` tagged templates.
- Use `ifDefined()` from `lit/directives/if-defined.js` for optional attribute bindings to avoid rendering `"undefined"` as a literal string.
- Story exports use PascalCase (e.g., `LoadingWithLabel`), which Storybook converts to kebab-case IDs.
- Every story embedded in VitePress docs via `<StoryEmbed>` must have a corresponding export in the stories file.
- Cover edge-case combinations (e.g., loading + disabled, loading-label + aria-labelledby) when they have distinct behavior.

### Component Testing Patterns

- Test files are co-located: `fd-{component}.test.ts` alongside `fd-{component}.ts` in `packages/components/src/components/`.
- Tests run in Vitest with happy-dom environment (configured in `packages/components/vitest.config.ts`).
- Use a factory helper pattern (e.g., `createButton(attrs, innerHTML)`) that creates the element, sets attributes, appends to `document.body`, and awaits `updateComplete`.
- Use `getInternal(el)` to query the shadow DOM for the native control via `[part=base]`.
- Clean up the DOM in `beforeEach` with `document.body.innerHTML = ""`.

For planning and decision capture:

- Do not create ad hoc dated planning files in `docs/plans/` by default.
- Use GitHub Issues for scoped proposals, implementation plans, and task tracking when the work benefits from review or decision history.
- Use repository docs only for durable records that should remain true after implementation, such as architecture notes, ADR-style decisions, or stable reference material.
- If you cannot create the GitHub artifact directly in the current environment, summarize the proposed issue body in your response instead of creating a new one-off markdown planning file unless the user explicitly asks you to persist it in the repo.
- If a temporary local planning note is explicitly requested, mark it as temporary, keep it short, and avoid date-stamped file sprawl.
- **Design proposals and approach recommendations belong in GitHub**, not in the conversation. Post design proposals as comments on the relevant Discussion or Issue so they are reviewable, linkable, and persist beyond the conversation. Do not output design proposals inline in conversation unless the maintainer explicitly asks for it.

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
- Inspect relevant local context before changing files.
- Do not silently introduce major design decisions.
- State assumptions clearly when making structural changes.
- Prefer incremental scaffolding over large one-shot implementations.
- If a requested change conflicts with these instructions, raise the conflict explicitly.

## Workflow Expectations

- Use the repository itself as the system of record for implementation, validation, and documentation.
- Keep changes small, scoped, and reviewable.
- Do not do substantial work silently.
- Preserve existing conventions unless there is a clear reason to change them.
- Validate relevant behavior before claiming completion.
- Update documentation when behavior, APIs, or guidance materially change.

At task start, inspect the local context that is relevant to the request. This usually includes:

- current working tree status
- relevant files and directories
- existing docs such as `README.md`, `docs/`, and this guide
- related tests, build scripts, or config when the task touches them

Do not treat a fixed startup command checklist as mandatory for every task. Scale investigation to the scope and risk of the change.

## GitHub Workflow Guidance

GitHub artifacts are useful when relevant, but they are not the default source of truth over the repository and FDIC design inputs.

- Use Issues, PRs, and Discussions when the work benefits from explicit tracking, review, or decision history.
- Prefer the existing GitHub issue templates for proposals, maintenance work, and bugs instead of inventing one-off planning documents in the repo.
- Do not assume every non-trivial change requires a PR, Issue, or Discussion in this early-stage solo repository unless the maintainer asks for that workflow.
- If GitHub artifacts exist for the task, align with them and note meaningful conflicts.
- If a change is architectural, breaking, or likely to affect future contributors, record the lasting rationale in a durable repo doc and keep the step-by-step execution plan in GitHub.
- When opening a PR as part of an agent workflow, wait for requested or relevant validation checks to complete and resolve actionable failures before handing off. Do not merge unless the user explicitly asks.
- After opening a PR, add a concise review-request comment written as a well-formed AI agent prompt. The comment should ask for review, identify the highest-value areas to inspect, and call out open questions, assumptions, and any points that need clarification before merge.
- Keep that PR handoff comment specific to the change set. Prefer concrete reviewer focus areas over generic requests for feedback.
- When an issue is related to a GitHub Discussion, ensure the issue body or issue comment links to the relevant discussion so the relationship is explicit and traceable.
- When creating or updating GitHub artifacts that reference each other, prefer direct cross-links between the issue, PR, and discussion where those links add useful context.

### PR Review Workflow

When addressing PR review feedback:

- Read all review comments before starting changes.
- Verify each comment's technical claim independently — do not assume feedback is correct without checking the code.
- Make targeted fixes addressing the feedback. Add regression tests for bugs identified in review.
- After pushing fixes, add a summary comment on the PR explaining what changed and why, referencing the specific feedback addressed.

### Post-Merge Cleanup

After a PR is merged:

- Delete the remote feature branch (use `--delete-branch` with `gh pr merge`, or delete manually).
- Delete the local feature branch and switch back to `main`.
- Pull the latest `main` to ensure the local copy is current.
- Run `npm run test:components` and `npm run build` to verify the merge didn't introduce issues.
- Clean up any other stale local branches that have already been merged.

### Pre-Merge Validation

Before merging a PR, ensure at minimum:

- `npm run test:components` passes
- `npm run build` succeeds (full build: components → react → docs)
- Documentation is updated if the change affects component APIs or behavior
- Storybook stories are updated if the change adds or modifies visual states

When sources conflict, use this priority order:

1. Direct user instructions
2. this guide and other explicit repository policies
3. FDIC Figma design specifications
4. Existing repository code, docs, and configuration
5. Relevant GitHub Issues, PRs, Discussions, and CI context
6. Secondary references such as USWDS guidance

If the conflict is material, call it out explicitly in your summary or in the relevant project artifact when one is being used.

## Validation and Delivery

- Run relevant tests, linting, builds, or manual checks appropriate to the task.
- Do not claim success without describing what was validated and what was not.
- When behavior changes, update or add tests where practical.
- When adding real guidance, keep docs current and task-oriented.
- Prefer small commits and deliberate breaking changes when version control actions are part of the task.

## Local Dev Server Lifecycle

Agents may need two local servers to test this repository in a browser:

- docs site: `npm run dev:docs`
- Storybook: `npm run dev:storybook`

Use these servers intentionally rather than starting them by default for every task.

- Start the docs server when testing VitePress pages, navigation, embeds, theme behavior, or docs-only changes.
- Start Storybook when testing component stories, interactive states, or implementation details intended for the workbench.
- Start both when verifying docs pages that embed or link into Storybook, or when a change affects both surfaces.

Before starting a server:

- Check whether an appropriate instance is already running and reuse it when practical.
- Prefer the repository root as the working directory so the documented workspace scripts are used consistently.
- Treat documented default ports as provisional, not guaranteed.

While working:

- Wait for the server to finish starting before claiming it is available.
- Verify the actual bound URL and port from the server startup output, process information, or another direct check before reporting where it is running.
- If the server falls back to a different port, report the actual port rather than the default one.
- Use the running server for targeted verification, not as a substitute for build or test validation when those are also relevant.
- If a server fails to start, report the failure clearly and include the command and the relevant error.

After verification:

- Stop any server process you started if it is no longer needed.
- Do not leave orphaned long-running processes behind without a reason.
- If an existing server was already running before your task, avoid interrupting it unless the task requires a restart.
- In summaries, distinguish between expected default ports and the ports actually observed during the task when that difference matters.
