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

For interactive components and overlays, also treat the following as default protocol requirements:

- Prefer baseline native overlay primitives such as `<dialog>` and the Popover API over custom focus traps, custom backdrops, and document-level dismissal wiring when the shipped browser support target allows it.
- If the component introduces motion or transition effects, provide a component-scoped `prefers-reduced-motion: reduce` path that suppresses all non-essential transitions and animations within that component, not just the one effect currently under review.
- Do not leave `role="dialog"` or `aria-modal="true"` attached to content that is hidden only through CSS. Apply modal dialog semantics only while the overlay is actually open, or use `hidden` or conditional rendering.
- When native `<dialog>` covers the needed modal behavior, prefer `dialog::backdrop` over a separate custom backdrop element and let the browser own focus containment.
- When delayed interaction is used, such as hover intent, close delays, or deferred previews, wire explicit cancellation paths for the inverse interaction (`pointerleave`, `blur`, focus transfer, or close) so timers do not fire after the user has already moved on.
- Prefer existing shadow-DOM-safe containment and focus helpers over simpler `.contains()` checks when deciding whether focus is still inside a composite component or overlay.
- If the test environment is missing a native overlay API, add the narrowest viable test shim or helper. Do not restore a production fallback path just to satisfy happy-dom or another test surface.

For CSS modernization and docs-theme work, also treat the following as default protocol requirements:

- Prefer native CSS and platform features over legacy workarounds when the shipped support target makes them viable. This includes selective use of `light-dark()`, relative color syntax, `@property`, `scrollbar-gutter`, `accent-color`, `text-wrap: balance`, and native overlay styling hooks.
- Use progressive enhancement and fallback-first patterns when support is intentionally partial. For example, keep an explicit fallback before relative color syntax derived from tokens instead of abandoning the improvement entirely.
- Preserve focus indicator geometry. If a focus rule needs to hide a color while keeping the outline behavior, prefer `outline-color: transparent` over `outline: none`.
- Remove obsolete browser hacks when they no longer earn their maintenance cost. Do not keep legacy CSS such as `-webkit-overflow-scrolling` without current evidence that it is still required.
- Treat `content-visibility: auto` as opt-in and heavily scoped. Ship it only after validating the real rendered docs DOM, find-in-page, in-page anchors, visible loading or jump behavior, and content discovery on representative long-form pages.
- Keep these changes readable and reversible. Adopt modern CSS incrementally instead of collapsing multiple token or theme concerns into one opaque rewrite.

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
| `npm run test:storybook` | Run Storybook browser tests (Vitest + Playwright Chromium) |
| `npm run build` | Full sequential build (components → react → docs) |
| `npm run dev:docs` | Start VitePress dev server |
| `npm run dev:storybook` | Start Storybook dev server |
| `npm run dev-server:start -- storybook|docs|all` | Start or reuse repo-scoped local dev servers and print their working URLs |
| `npm run dev-server:stop -- storybook|docs|all` | Stop repo-scoped local dev servers |
| `npm run dev-server:status -- storybook|docs|all` | List running repo-scoped local dev servers, mark the current instance, and show working URLs |
| `npm run dev-server:url -- storybook|docs|all` | Print the preferred working URL for each running local dev server |
| `npm run build:storybook` | Build Storybook for deployment |
| `npm run sync:components` | Regenerate component exports, register entrypoints, docs API blocks, and Storybook arg helpers from repo metadata |
| `npm run validate:components` | Re-run generation and verify component metadata, docs, stories, and generated files stay in sync |
| `npm run new:component -- --name foo --kind first-class` | Scaffold a new component, test, docs page, story, and metadata entry |

## Component Authoring Automation

Use the repo automation whenever component inventory, package surface, docs API tables, or Storybook component args change.

Source-of-truth files:

- `scripts/components/inventory.mjs` — component inventory, classification, docs routing, Storybook titles, register dependencies, and package export behavior
- `scripts/components/api-metadata.json` — public API descriptions for generated docs tables and Storybook arg metadata

Required workflow:

1. For a new component, run `npm run new:component -- --name component-name --kind first-class|supporting-standalone|supporting-embedded`.
2. Implement the component source and tests under `packages/components/src/components/`.
3. Update `scripts/components/inventory.mjs` if the component’s classification, dependencies, export behavior, docs slug, or Storybook title changes.
4. Update `scripts/components/api-metadata.json` when public properties, slots, events, CSS custom properties, or shadow parts change.
5. Run `npm run sync:components` after changing component metadata or public component source files.
6. Run `npm run validate:components` before handing work off or concluding the task.

Do not hand-edit these generated surfaces:

- `packages/components/src/index.ts`
- `packages/components/src/register/*.ts`
- `packages/components/package.json` exports
- `packages/components/tsup.config.ts`
- `apps/docs/components/index.md`
- `apps/docs/.vitepress/generated/component-navigation.ts`
- `apps/storybook/src/generated/component-arg-types.ts`
- Any docs content between `<!-- GENERATED_COMPONENT_API:START -->` and `<!-- GENERATED_COMPONENT_API:END -->`

Storybook rule:

- For direct component properties, prefer `getComponentArgs()` and `getComponentArgTypes()` from `apps/storybook/src/generated/component-arg-types.ts`.
- Keep story-local args only for wrapper content, slot text, fixture data, or composed examples that are not part of the component’s direct public API.

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

Token usage rule:

- Reuse existing design-system tokens before introducing new ones.
- Do not invent a new token name when an existing token already covers the need.
- When refactoring component styles, prefer replacing raw values with existing semantic, spacing, typography, radius, or layout tokens rather than creating component-specific tokens without a clear gap in the system.
- For layout work, keep the public contract small. Prefer the shared `--fdic-layout-*` shell, readable-width, section-spacing, split-gap, stack-gap, and collection tokens, and document higher-level page patterns instead of freezing speculative layout APIs.

Before introducing non-trivial components, clarify:

- browser support expectations
- theming model
- SSR and hydration expectations if relevant
- form-associated behavior if relevant
- whether a pattern should stay native HTML instead of becoming a custom element
- where USWDS guidance is relevant and where FDIC intentionally diverges

## New Component Workflow

The following workflow is required for requests to create a new design-system component. It is not the default workflow for every repository task.

### 1. Gather design inputs first

- If the user has not already provided the relevant Figma links, ask for them before doing component discovery or proposing APIs.
- Treat those Figma links as the visual design specification and the primary reference for anatomy, layout, states, and interaction intent.
- If the provided Figma context is incomplete or ambiguous, ask follow-up questions before drafting the proposal.

### 2. Open a GitHub Discussion for design discovery

- Open a new GitHub Discussion for the component or pattern.
- In the Discussion body, include a draft problem statement, a general description of the component, and links to the relevant Figma frames.
- Research best practices for that component type before proposing implementation details. This should cover usability, accessibility, interaction design, motion or micro-interactions when relevant, trust considerations, and consistency with the design system and government UX conventions.
- Post the resulting design proposal as a comment on the Discussion rather than in the conversation.

The design proposal comment should cover at minimum:

- the problem being solved
- intended use and when not to use the component
- semantic HTML strategy and accessibility expectations
- interaction model, keyboard behavior, focus behavior, and important states
- content and trust guidance where relevant
- proposed API shape
- token and styling impact
- open questions, tradeoffs, and explicit v1 boundaries

### 3. Pause for maintainer feedback

- After posting the design proposal comment, stop and ask the maintainer for feedback before starting implementation.
- Provide a reusable review prompt the maintainer can send to another agent to review the design proposal critically.
- That prompt should call out the highest-value review areas such as accessibility risk, usability risk, API shape, consistency with the rest of the design system, and alignment with the supplied Figma references.

### 4. Create the implementation issue only after approval

- Once the maintainer approves the design proposal, create an implementation issue from the Discussion.
- Use the existing component proposal issue template when practical, adapting it into an implementation-ready issue with a detailed execution plan.
- Ensure the issue links back to the Discussion and any other relevant artifacts.
- Put the issue into the GitHub project board state `In progress` while implementation is active.

The implementation issue should include:

- a concise summary of the approved design direction
- acceptance criteria
- a detailed implementation plan
- explicit sub-tasks as checklist items
- validation expectations covering tests, docs, stories, and accessibility verification
- references to the Figma frames, Discussion, and any relevant standards guidance

### 5. Track implementation live in the issue

- As work is completed, update the issue checklist items as each sub-task is finished. Do not wait until the end.
- If additional implementation work is needed after review feedback, move the project board state back to `In progress` while making changes.
- When implementation is ready for review, move the issue to the GitHub project board state `In review`.

### 6. Handoff for implementation review

- When the issue is in `In review`, provide a reusable review prompt the maintainer can send to another agent for a thorough implementation review.
- If the work is happening directly on `main`, use the issue as the primary review location and ask the reviewer to comment there.
- If a PR exists, use the PR for code-specific review comments and keep the issue updated with summary status as needed.
- After follow-up fixes are completed, move the issue back to `In review` and provide an updated review prompt if another review pass is needed.

### 7. Finish and close the work

- Commit and push only after the maintainer is satisfied that the work is complete.
- Wait for the relevant verification checks to pass before marking the work done.
- When the work is fully complete, move the issue to the GitHub project board state `Done`.

Project board note:

- `In progress`, `In review`, and `Done` are GitHub project board states for this repository, not issue labels.

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
4. `## Examples` — with curated `<StoryEmbed storyId="..." caption="..." />` components referencing Storybook story IDs
5. `## Best practices` — do/don't cards
6. `## Content guidelines`
7. `## Accessibility`
8. `## Known limitations`
9. `## Related components`

Story IDs follow the pattern `components-{name}--{variant-kebab-case}` (e.g., `components-button--loading-with-label` maps to the `LoadingWithLabel` story export).

For docs embeds:

- Treat VitePress docs as curated guidance, not a 1:1 mirror of Storybook.
- Apply the same rule when documenting a brand-new component or topic for the first time.
- Default to one representative Storybook embed per docs page.
- A second embed is acceptable only when it covers a materially different behavior that the first embed cannot communicate well.
- If multiple variants matter, prefer adding a consolidated Storybook story such as `DocsOverview` or `AllVariants` instead of embedding each state separately.
- Use `linkStoryId` to send readers to Storybook for exhaustive exploration, controls, and edge-case states.
- When editing an existing docs page with multiple embeds, reduce iframe count unless each remaining embed has a clear instructional reason to exist.

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
- Use GitHub Discussions for durable repo knowledge that should influence future work, such as decisions, protocols, lessons learned, and reusable recipes.
- Use repository docs only for durable records that should remain true after implementation, such as architecture notes, canonical prompt artifacts, ADR-style decisions, or stable reference material.
- When implementation work changes how consumers are expected to adopt, compose, configure, or integrate a shipped surface, update the relevant repository docs in the same change with thorough implementation guidance. Do not leave new integration patterns discoverable only through code, tests, Storybook controls, or GitHub comments.
- When implementation changes repo-wide styling, token, or platform-support expectations, update the relevant contributor-facing guidance such as this guide, `CONTRIBUTING.md`, prompt support docs, and the related GitHub Discussion in the same run.
- If you cannot create the GitHub artifact directly in the current environment, summarize the proposed issue body in your response instead of creating a new one-off markdown planning file unless the user explicitly asks you to persist it in the repo.
- If a temporary local planning note is explicitly requested, mark it as temporary, keep it short, and avoid date-stamped file sprawl.
- **Design proposals and approach recommendations belong in GitHub**, not in the conversation. Post design proposals as comments on the relevant Discussion or Issue so they are reviewable, linkable, and persist beyond the conversation. Do not output design proposals inline in conversation unless the maintainer explicitly asks for it.
- When an implementation produces a reusable lesson, protocol, or decision, update or create the relevant GitHub Discussion before considering the work fully closed.

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
- When implementation tasks are tracked in a GitHub Issue (as checklist items or sub-tasks), update them as each task is completed — do not wait until all work is finished. This keeps the issue as a live progress tracker and ensures anyone watching the issue can see current status without reading commits or PRs.

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
- Search existing Issues and Discussions before opening new work so you refine or extend existing repository knowledge instead of duplicating it.
- Do not assume every non-trivial change requires a PR, Issue, or Discussion in this early-stage solo repository unless the maintainer asks for that workflow.
- Exception: follow the required `New Component Workflow` above for requests to create new design-system components.
- If GitHub artifacts exist for the task, align with them and note meaningful conflicts.
- If a change is architectural, breaking, or likely to affect future contributors, record the lasting rationale in GitHub Discussions or another durable repo artifact and keep the step-by-step execution plan in GitHub Issues.
- When opening a PR as part of an agent workflow, wait for requested or relevant validation checks to complete and resolve actionable failures before handing off. Do not merge unless the user explicitly asks.
- After opening a PR, add a concise review-request comment written as a well-formed AI agent prompt. The comment should ask for review, identify the highest-value areas to inspect, and call out open questions, assumptions, and any points that need clarification before merge.
- Keep that PR handoff comment specific to the change set. Prefer concrete reviewer focus areas over generic requests for feedback.
- When an issue is related to a GitHub Discussion, ensure the issue body or issue comment links to the relevant discussion so the relationship is explicit and traceable.
- When creating or updating GitHub artifacts that reference each other, prefer direct cross-links between the issue, PR, and discussion where those links add useful context.
- For continuous-improvement work, use Issues for the concrete improvement and Discussions for any reusable decision, protocol, learning, or recipe that the work should leave behind.

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
- `npm run test:storybook` passes when the change affects Storybook-sensitive behavior, first-class component stories, or browser-tier accessibility validation
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

For interactive component work, “update or add tests” should usually include the behavior-specific regressions that are easiest to miss in manual review:

- reduced-motion behavior when motion or transitions are added
- keyboard traversal across composite navigation regions, including arrow keys and `Home` or `End` behavior where supported
- focus restoration and focus trapping for drawers, dialogs, and other overlays
- focus-out and escape-to-close behavior for dismissible desktop surfaces
- delayed hover or preview timing paths, including cancellation when the pointer leaves before the delay completes
- state normalization when component inputs or navigation data change after initial render
- accessibility semantics for hidden versus visible overlays, especially dialog and modal attributes

## Local Dev Server Lifecycle

Agents may need two local servers to test this repository in a browser:

- docs site: `npm run dev:docs`
- Storybook: `npm run dev:storybook`
- managed entrypoint for either or both: `npm run dev-server:start -- docs|storybook|all`

Use these servers intentionally rather than starting them by default for every task.

- Start the docs server when testing VitePress pages, navigation, embeds, theme behavior, or docs-only changes.
- Start Storybook when testing component stories, interactive states, or implementation details intended for the workbench.
- Start both when verifying docs pages that embed or link into Storybook, or when a change affects both surfaces.

Before starting a server:

- Check whether an appropriate instance is already running and reuse it when practical.
- Prefer the managed commands (`npm run dev-server:start`, `npm run dev-server:status`, `npm run dev-server:url`, `npm run dev-server:stop`) so one current instance per surface is tracked explicitly and stale instances do not accumulate.
- Prefer the repository root as the working directory so the documented workspace scripts are used consistently.
- Treat documented default ports as provisional, not guaranteed.

While working:

- Wait for the server to finish starting before claiming it is available.
- Verify the actual bound URL and port from the server startup output, process information, or another direct check before reporting where it is running.
- Prefer reporting the exact working URL emitted by `npm run dev-server:url -- docs|storybook|all` instead of reconstructing it manually.
- If the server falls back to a different port, report the actual port rather than the default one.
- Use the running server for targeted verification, not as a substitute for build or test validation when those are also relevant.
- If a server fails to start, report the failure clearly and include the command and the relevant error.

After verification:

- Stop any server process you started if it is no longer needed.
- Do not leave orphaned long-running processes behind without a reason.
- If an existing server was already running before your task, avoid interrupting it unless the task requires a restart.
- In summaries, distinguish between expected default ports and the ports actually observed during the task when that difference matters.
- When local changes were made in the repository and Storybook or VitePress is running, include the exact working local URL for each running surface in the handoff or summary.
