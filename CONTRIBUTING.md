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

- `fd-field`: `supporting-standalone`
- `fd-message`: `supporting-standalone`
- `fd-menu-item`: `supporting-embedded` under `fd-menu` and composed menu usage
- `fd-option`: `supporting-embedded` under `fd-selector`
- `fd-placeholder`: `internal-only`

### Package and repo conventions

- Use explicit registration entry points in `packages/components/src/register/` for custom element registration.
- Import `@fdic-ds/components/register-all` in Storybook stories unless a narrower registration path is needed for a specific reason.
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

GitHub Discussions are enabled, but they should stay narrow and lightweight.

Use Discussions for:

- early ideas that are not yet scoped enough for an issue
- contributor questions that do not yet describe a concrete repo change
- announcements about releases, roadmap shifts, or contribution workflow changes

Do not use Discussions for:

- final architecture decisions
- accepted implementation scope
- bug triage
- security reports

Record decisions and accepted work in Issues, PRs, and repository docs so the implementation record stays easy to follow.

Recommended categories:

- `Announcements`
- `Ideas`
- `Q&A`

## Issue Types

Use the built-in forms when possible:

- `Bug report`: behavior is incorrect, missing, or regressed
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

Labels are intentionally lightweight. They answer three questions: what kind of work is this, what area does it affect, and what is its current state.

### Type labels

- `type:bug`: incorrect or regressed behavior
- `type:feature`: implementation work that adds or expands capability
- `type:docs`: documentation or content-authoring work
- `type:maintenance`: dependency, tooling, CI, release, or repo upkeep
- `type:planning`: proposals, scoping, acceptance criteria, or decision framing
- `type:question`: clarification needed before work should proceed
- `type:security`: vulnerability handling or security-sensitive work

### Area labels

- `area:tokens`
- `area:components`
- `area:docs`
- `area:accessibility`
- `area:content`
- `area:architecture`
- `area:security`
- `area:tooling`

### Status labels

- `status:needs-triage`: new and not yet clarified
- `status:ready`: scoped well enough to pick up
- `status:in-progress`: actively being worked
- `status:blocked`: waiting on a dependency or answer
- `status:needs-decision`: open question or tradeoff still needs a call

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
