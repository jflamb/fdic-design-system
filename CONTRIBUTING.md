# Contributing

This repository is in an early scaffold stage. Keep changes small, explicit, and easy to review.

The canonical repository policy lives in [.context/AGENT_GUIDE.md](./.context/AGENT_GUIDE.md). If this file and the guide disagree, follow the guide.

## Working Style

- Prefer one concern per issue or pull request.
- Record rationale when a change affects tokens, component APIs, accessibility behavior, documentation structure, or architecture.
- Keep placeholder implementations reversible until FDIC design decisions are clearer.
- Update docs when behavior, usage guidance, or accessibility expectations materially change.
- Treat accessibility as a release requirement, not follow-up cleanup.

## Coding Conventions

This project uses tooling for baseline formatting. The conventions below are the project-specific rules contributors should follow when designing, implementing, and documenting changes.

### Component architecture

- Build first-party components with Lit (`LitElement`).
- Prefer native HTML semantics over custom ARIA widgets whenever native elements can satisfy the use case.
- Use form-associated custom elements when a component needs to participate in form submission, validity, or reset behavior.
- Keep responsibilities narrow. Labeling, messaging, validation state, layout, and field composition should stay in the component layer that owns them.
- Render in light DOM only when the behavior requires it. Current examples include `fd-label` for native label association and `fd-message` for same-root description wiring.
- Avoid introducing bespoke patterns when an established repo pattern already exists. Reuse the shared form controllers and registration entry points.

### Accessibility and form behavior

- Accessibility is a release requirement. New or materially changed components must preserve keyboard behavior, focus behavior, semantic structure, screen reader expectations, zoom/reflow behavior, and contrast expectations.
- Use `fd-label` with matching `for` / `id` for form controls that need visible labels.
- `aria-describedby` ownership should be explicit and stable. Do not let multiple sibling components compete to manage the same description relationship.
- For form controls, keep internal validity current as state changes. Visible invalid state is a separate concern.
- Use `data-user-invalid` as the shared host attribute for visible invalid presentation.
- Apply `aria-invalid` only while visible invalid state is active, and place it on the correct surface for the control family:
- native-like single controls: the internal native control
- grouped controls: the group semantics surface
- selector-style controls: the trigger surface
- Do not derive `aria-invalid` from authored message state alone.
- Treat authored error content as the primary user-facing error surface. Missing error copy for controls that can block submission is incomplete usage.
- Preserve reset behavior. Form reset must clear visible invalid state and restore the component’s default value or selection.

### Styling and tokens

- Follow FDIC Figma as the primary source of truth for visual design and interaction intent.
- Prefer tokens before component-specific CSS decisions. Separate core, semantic, and component-level token concerns when introducing new values.
- Keep CSS minimal, explicit, and easy to reverse. Do not introduce visual flourish, brand styling, or novel motion without a clear design requirement.
- Do not rely on color alone to communicate state.

### Tests

- Keep component tests co-located with source in `packages/components/src/components/*.test.ts`.
- Add or update tests whenever behavior, accessibility wiring, validation behavior, or public API changes.
- For form controls, cover the relevant validation contract:
  - `checkValidity()` behavior
  - `reportValidity()` behavior
  - visible invalid entry and clearing rules
  - reset behavior
  - `aria-invalid` ownership and clearing
- Prefer focused tests for component behavior over broad snapshot-style coverage.

### Docs and Storybook

- Docs are part of the product. When component behavior or usage guidance changes, update the relevant docs page in `apps/docs/components/`.
- Treat VitePress docs as curated guidance, not a dump of every possible Storybook state.
- Prefer one representative Storybook embed per docs page and use consolidated stories such as `DocsOverview` when multiple variants matter.
- Storybook stories should demonstrate meaningful usage patterns, including validation lifecycle examples for form controls when relevant.
- Use plain language in docs, stories, labels, descriptions, and examples. This design system is for government and financial-sector workflows.

#### Storybook quality standard

- Storybook is part of the completion bar for first-class public components. It remains supplementary for very simple primitives, but it is not an illustrative-only gallery.
- First-class public components should have, at minimum:
  - a canonical/default story
  - a controls-oriented story when the component has 3 or more meaningful argument axes or the state space is otherwise hard to understand statically
  - a states/variants story or equivalent explicit permutation coverage
  - a docs-focused overview when authoring constraints are not obvious from visuals alone
- Simpler components may overlap those roles when the story file stays intentional. A pattern like `Playground` plus `DocsOverview` in `apps/storybook/src/fd-label.stories.ts` is acceptable.
- Supporting-embedded primitives may satisfy Storybook obligations through explicitly labeled parent stories. Incidental inclusion is not enough.
- Treat a component as high-complexity for Storybook purposes when it matches at least 2 of these characteristics:
  - focus management beyond basic tab order
  - keyboard navigation beyond native defaults
  - child composition with its own interaction contract
  - visible validation or invalid-state lifecycle behavior
- Current authoritative example set for this rule:
  - `fd-menu`
  - `fd-selector`
  - `fd-split-button`
  - grouped validation flows such as `fd-checkbox-group` and `fd-radio-group`
- High-complexity components require `play` coverage for user-observable behavior such as keyboard flows, focus movement, open/close behavior, selection/action behavior, and visible state transitions.
- Storybook `play` tests should focus on user-observable behavior. Vitest component tests should continue to own lower-level contract assertions such as event payloads, form data, and attribute reflection.
- `@storybook/addon-a11y` should be enabled in Storybook. During the current repository phase, accessibility findings are a required review surface for first-class components and advisory for supporting-standalone primitives unless complexity or risk warrants stricter handling.
- In Storybook config, `a11y: { test: "todo" }` means accessibility checks run and surface findings in the addon panel, but those findings are not treated as passing/blocked automated test assertions yet. A green Storybook test run does not remove the requirement to review and address meaningful a11y findings for qualifying components.
- Scoped a11y suppressions must identify the rule and justification in story metadata or adjacent code comments. Avoid broad silent disablement.

#### Component completeness standard

- Every public component must be classified as one of:
  - `first-class`: a top-level component consumers are expected to author directly
  - `supporting-standalone`: a supporting primitive that still needs its own docs page and Storybook file
  - `supporting-embedded`: a supporting primitive whose contract lives inside a parent component's docs and story file
  - `internal-only`: not part of the public docs or Storybook inventory
- First-class and supporting-standalone components require:
  - a dedicated VitePress page
  - a dedicated Storybook file
  - documented API coverage for properties, slots, events, parts, and CSS custom properties when applicable
  - accessibility notes, usage constraints, and at least one canonical usage example
- Supporting-embedded primitives require an explicit parent-page subsection with:
  - purpose and relationship to the parent
  - supported authored surface
  - authoring constraints
  - accessibility contract
  - at least one usage example in parent context
- Supporting-embedded primitives also require at least one explicitly labeled parent story that demonstrates the child primitive's contract, states, or variants. Incidental inclusion is not enough.
- Internal-only primitives should not appear in the public docs index, public component sidebar, or Storybook sidebar.
- The VitePress components index and sidebar should distinguish supporting-standalone primitives from first-class components.
- Storybook should distinguish supporting-standalone primitives from first-class components with stable title grouping. Embedded-only primitives stay inside their parent story file.
- Keep StoryEmbed references and `linkStoryId` values valid whenever story titles or inventory move.

#### Current primitive classifications

- `fd-label`: `first-class`
- `fd-field`: `supporting-standalone`
- `fd-message`: `supporting-standalone`
- `fd-menu-item`: `supporting-embedded` under `fd-menu` and composed menu usage
- `fd-option`: `supporting-embedded` under `fd-selector`
- `fd-placeholder`: `internal-only`

### Package and repo conventions

- Component authoring is inventory-driven. The source-of-truth files are:
  - `scripts/components/inventory.mjs`
  - `scripts/components/api-metadata.json`
- Use `npm run new:component -- --name component-name --kind first-class|supporting-standalone|supporting-embedded` to scaffold new component work.
- After changing public component metadata or component source that affects the public contract, run `npm run sync:components`.
- Before finishing component work, run `npm run validate:components`.
- Do not hand-edit generated component surfaces:
  - `packages/components/src/index.ts`
  - `packages/components/src/register/*.ts`
  - `packages/components/package.json` exports
  - `packages/components/tsup.config.ts`
  - `apps/docs/components/index.md`
  - `apps/docs/.vitepress/generated/component-navigation.ts`
  - `apps/storybook/src/generated/component-arg-types.ts`
  - docs content between `<!-- GENERATED_COMPONENT_API:START -->` and `<!-- GENERATED_COMPONENT_API:END -->`
- Use explicit registration entry points in `packages/components/src/register/` for custom element registration.
- Import `@fdic-ds/components/register-all` in Storybook stories unless a narrower registration path is needed for a specific reason.
- For direct component properties in Storybook, prefer `getComponentArgs()` and `getComponentArgTypes()` from `apps/storybook/src/generated/component-arg-types.ts`. Keep manual story args for wrapper content, slot text, or composed fixtures only.
- Keep root package symbol exports side-effect-free.
- For public component events, prefer component-specific names over generic library-wide names. Use `fd-{component}-change` for value or selection changes, `fd-{component}-open-change` for open-state changes, and `fd-{component}-action` or `fd-{component}-select` when those verbs are the clearest fit.
- For normalized value or selection events, always include `detail.value`. Multi-select components should additionally include `detail.values`.
- When deprecating a public event name, dual-fire the old and new events during the transition window. The new event should carry the new normalized payload. The deprecated event should keep its old payload shape until the next breaking major version removes it.
- Internal wiring events are not automatically part of the public API. Do not rename internal child-to-parent events just to match public naming conventions unless the change is explicitly part of the approved scope.
- Documented public attributes should reflect by default unless they are explicitly property-only or documented as derived read-only state.
- Use conventional commits with a scope, such as `feat(input): ...`, `fix(selector): ...`, or `docs(radio-group): ...`.
- When a change is architectural, cross-package, accessibility-sensitive, or likely to be reused, record the reasoning in an issue, docs note, or plan document instead of leaving the decision implicit in code.

## When To Open An Issue

Open an issue when one of these is true:

- the work needs a scoped decision record
- the problem spans more than a quick typo or tiny cleanup
- the change needs acceptance criteria before implementation
- the work touches accessibility, content guidance, architecture, security, or cross-package behavior

Skip the issue for very small, obvious fixes if a focused pull request is enough.

## Discussions

GitHub Discussions are the durable knowledge layer for this repository.

Use Discussions to capture information that future contributors and agents should reuse rather than rediscover:

- repo-wide design or engineering decisions
- repeatable protocols, checklists, and development workflows
- lessons learned from shipped improvements or reviews
- reusable recipes for testing, docs authoring, accessibility validation, or component development
- early proposals that are not yet implementation-ready

Do not use Discussions for:

- security reports
- bug triage without a concrete work item
- implementation progress updates that belong on an issue or pull request

Use the following category model:

- `Decisions`: durable choices with repo-wide consequences
- `Protocols`: repeatable workflows, review prompts, or checklists
- `Learnings`: lessons learned from completed work, regressions, and review feedback
- `Recipes`: reusable implementation, testing, docs, or review patterns
- `Proposals`: early cross-cutting ideas that are not yet scoped as implementation issues

When an issue depends on prior repository knowledge, link the relevant discussion in the issue body or a top-level issue comment. When an implementation produces a reusable lesson, add or update the relevant discussion before closing the issue.

## Issue Types

Use the built-in forms when possible:

- `Bug report`: behavior is incorrect, missing, or regressed
- `Continuous improvement`: a high-impact improvement candidate with research, requirements, and knowledge-capture expectations
- `Proposal`: a component, token, docs, architecture, content, or planning change needs rationale and acceptance criteria
- `Maintenance task`: dependency, tooling, CI, security-hardening, or repo-workflow work

Blank issues remain enabled for edge cases, but they should still follow the same scope and documentation expectations.

## Pull Requests

Pull requests should explain:

- what changed
- why the change is needed now
- what is explicitly out of scope
- accessibility impact
- docs impact
- validation actually performed

Prefer small PRs over broad refactors. If a change is architectural or deliberately breaking, link the related issue and add or update a note in `docs/architecture/` or `docs/plans/` when that context will help future contributors.

## Label Taxonomy

Labels answer five questions: what kind of work is this, what area does it affect, how urgent is it, what state is it in, and whether it creates reusable repo knowledge.

### Type labels

- `type:bug`: incorrect or regressed behavior
- `type:feature`: implementation work that adds or expands capability
- `type:improvement`: high-leverage quality, accessibility, usability, or workflow improvement work
- `type:docs`: documentation or content-authoring work
- `type:maintenance`: dependency, tooling, CI, release, or repo upkeep
- `type:planning`: proposals, scoping, acceptance criteria, or decision framing
- `type:research`: standards or repo discovery work that informs future implementation
- `type:question`: clarification needed before work should proceed
- `type:security`: vulnerability handling or security-sensitive work

### Area labels

- `area:tokens`
- `area:components`
- `area:docs`
- `area:storybook`
- `area:accessibility`
- `area:content`
- `area:architecture`
- `area:security`
- `area:tooling`
- `area:workflow`

### Priority labels

- `priority:p0`: urgent user, accessibility, security, or release risk
- `priority:p1`: next-up high-value work
- `priority:p2`: important backlog work
- `priority:p3`: longer-term or opportunistic backlog work

### Status labels

- `status:needs-triage`: new and not yet clarified
- `status:needs-research`: needs standards review or repo-specific discovery before implementation
- `status:ready`: scoped well enough to pick up
- `status:in-progress`: actively being worked
- `status:in-review`: implemented or drafted and ready for review
- `status:blocked`: waiting on a dependency or answer
- `status:needs-decision`: open question or tradeoff still needs a call

### Impact and knowledge labels

- `impact:high`: meaningful cross-cutting impact
- `impact:systemic`: creates reusable leverage for future work
- `knowledge:decision`: discussion captures a durable decision
- `knowledge:protocol`: discussion captures a repeatable workflow or checklist
- `knowledge:learning`: discussion captures a lesson learned
- `knowledge:recipe`: discussion captures a reusable implementation or testing recipe

### Community and closure labels

- `help wanted`
- `good first issue`
- `duplicate`
- `invalid`
- `wontfix`

## Validation Expectations

Before merging, run the checks that match the risk of the change and report what you actually validated. Examples:

- `npm run build` for cross-workspace changes
- targeted package builds when the change is narrow
- manual review of docs or Storybook when the change is presentation-focused

If you did not run a check, say so directly.
