# Roadmap

This roadmap governs how v1 limitations move from scattered follow-up issues into planned design-system work.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Governance</span>
  <p>The roadmap is not a promise that every open enhancement will ship. It is a decision tool for ranking work by public-service value, accessibility risk, adopter readiness, and long-term maintainability.</p>
</div>

## Roadmap rules

Use these rules when deciding whether a v1 limitation should move into active work:

1. **Start from the user workflow.** Prioritize limitations that affect high-stakes public or internal FDIC workflows, especially forms, search, navigation, confirmation, and recovery.
2. **Protect the core contract.** Keep the published Web Component and token packages framework-agnostic. CMS or framework adapters should prove the integration path without moving design authority out of the core system.
3. **Prefer patterns before APIs.** If a need can be solved with semantic HTML, tokens, and documented composition, document the pattern before expanding a component API.
4. **Require accessibility acceptance criteria.** Any roadmap item that changes interaction, structure, validation, motion, focus, or announcement behavior needs keyboard, screen reader, zoom/reflow, contrast, and reduced-motion expectations.
5. **Keep v1 boundaries explicit.** When a limitation stays deferred, the component page should say why and identify the evidence needed to reopen it.

## Current issue audit

This roadmap was reviewed against the current repository state on May 18, 2026. Open issues are not automatically roadmap candidates. If an issue describes work that has already shipped, close it, split the remaining follow-up, or relabel it before using it for planning.

**Recently completed:**

- [#28 Code-block copy button](https://github.com/jflamb/fdic-design-system/issues/28): the DocsOverview story copy button is functional, exposes a copied state, and has Storybook coverage.
- [#23 Evaluate dedicated real-browser component runner](https://github.com/jflamb/fdic-design-system/issues/23): the testing strategy now records the decision to keep the current Vitest happy-dom plus Storybook browser-test model for v1, with explicit triggers for revisiting a dedicated runner.
- [#112 Define async search integration and richer results patterns](https://github.com/jflamb/fdic-design-system/issues/112): the global-header and header-search docs now define the v1 search handoff contract, with Storybook coverage for canceling submit and routing through the application-owned results path.
- [#113 Document broader header IA composition and variant guidance](https://github.com/jflamb/fdic-design-system/issues/113): the global-header/page-shell composition guide now defines ownership boundaries, supported shell recipes, utility-slot policy, shy-header limits, and CMS/framework integration boundaries without adding new component API.
- [#125 Scope shy-header layout reservation and scroll-container support](https://github.com/jflamb/fdic-design-system/issues/125): shy mode now documents application-owned layout reservation, explicitly rules out automatic spacing, and supports one property-only `scrollContainer` target for app-owned scroll shells.
- [#211 Add structured metadata support to Media Item](https://github.com/jflamb/fdic-design-system/issues/211): `fd-media-item` now supports structured metadata fields with the authored `metadata` string preserved as the compatibility override.
- [#168 Evaluate structured date semantics for fd-event](https://github.com/jflamb/fdic-design-system/issues/168): `fd-event` now keeps visible month/day author-controlled while exposing machine-readable `date`, `start-date`, and `end-date` attributes.
- [#205 Add structured datetime support to Social Media Item](https://github.com/jflamb/fdic-design-system/issues/205): `fd-social-media-item` now keeps visible `timestamp` text author-controlled while exposing optional machine-readable `datetime` through native `<time datetime>` semantics.
- [#80 Refresh fd-input guidance around remaining email, URL, and validation gaps](https://github.com/jflamb/fdic-design-system/issues/80): `fd-input` docs and Storybook now include explicit email, password, search, and URL recipes with autocomplete, validation-copy, clear-button, and password-reveal guidance.

**Appears complete or superseded in the repo:**

- [#66 Storybook browser and accessibility CI](https://github.com/jflamb/fdic-design-system/issues/66): the component-integrity workflow builds the component package, installs Playwright Chromium, and runs `npm run test:storybook`; first-class stories include accessibility enforcement; the pushed GitHub Actions run passed.
- [#217 Sidebar Nav](https://github.com/jflamb/fdic-design-system/issues/217): `fd-sidebar-nav` is exported, documented, inventoried, and referenced by current composition guidance. Close or update the issue rather than treating it as unstarted roadmap work.
- [#220 Dynamic Org Chart](https://github.com/jflamb/fdic-design-system/issues/220): the current system has the v1 outline/details pattern through `fd-org-outline` and `fd-org-details`. If a visual chart adapter is still wanted, split that post-v1 work into a narrower issue.
- [#172 Card Group companion](https://github.com/jflamb/fdic-design-system/issues/172): the repo now includes `fd-card-group` source, docs, inventory, and stories. Re-scope any remaining grid/list limitations before scheduling more work.

**Still valid as roadmap candidates:**

- [#126](https://github.com/jflamb/fdic-design-system/issues/126), [#127](https://github.com/jflamb/fdic-design-system/issues/127), [#145](https://github.com/jflamb/fdic-design-system/issues/145), [#146](https://github.com/jflamb/fdic-design-system/issues/146), and [#108](https://github.com/jflamb/fdic-design-system/issues/108): shy-header, navigation, breadcrumb, and pagination limitations remain useful but should be driven by adopter evidence.
- [#95](https://github.com/jflamb/fdic-design-system/issues/95), [#159](https://github.com/jflamb/fdic-design-system/issues/159), [#179](https://github.com/jflamb/fdic-design-system/issues/179), and [#99](https://github.com/jflamb/fdic-design-system/issues/99): feedback and recovery patterns remain relevant, but most need product-flow evidence before component API work.
- [#79](https://github.com/jflamb/fdic-design-system/issues/79), [#91](https://github.com/jflamb/fdic-design-system/issues/91), [#153](https://github.com/jflamb/fdic-design-system/issues/153), [#154](https://github.com/jflamb/fdic-design-system/issues/154), and [#200](https://github.com/jflamb/fdic-design-system/issues/200): advanced authoring and media/content semantics remain future candidates, not near-term adoption blockers.

## Planning horizons

### Now

Work that raises confidence in the system as a real adoption target.

- Keep release checks aligned with the public contract: package surfaces, docs, Storybook, contrast, and downstream references.
- Prove the CMS integration path through server-rendered examples before adding any framework-specific adapter package.
- Clean up completed or superseded issues so the open backlog does not misrepresent v1 status.

Issue hygiene:

- Keep the closed issue set visible during the next review so newly opened work does not duplicate [#23](https://github.com/jflamb/fdic-design-system/issues/23), [#28](https://github.com/jflamb/fdic-design-system/issues/28), [#66](https://github.com/jflamb/fdic-design-system/issues/66), [#80](https://github.com/jflamb/fdic-design-system/issues/80), [#112](https://github.com/jflamb/fdic-design-system/issues/112), [#113](https://github.com/jflamb/fdic-design-system/issues/113), [#125](https://github.com/jflamb/fdic-design-system/issues/125), [#168](https://github.com/jflamb/fdic-design-system/issues/168), [#205](https://github.com/jflamb/fdic-design-system/issues/205), [#211](https://github.com/jflamb/fdic-design-system/issues/211), [#217](https://github.com/jflamb/fdic-design-system/issues/217), [#220](https://github.com/jflamb/fdic-design-system/issues/220), or [#172](https://github.com/jflamb/fdic-design-system/issues/172). Use [#222](https://github.com/jflamb/fdic-design-system/issues/222) for any post-v1 org-chart visual adapter research.

### Next

Work that directly improves high-stakes user tasks and the first Drupal/CMS adoption path.

- Resolve structured metadata for dated, time-based, and media content so public pages can expose machine-readable facts without custom one-off markup.
- Clarify navigation and search behavior where page shells, global header behavior, and local navigation meet.

### Later

Work that may be valuable, but needs more design evidence, adopter pressure, or implementation confidence before it should expand the core contract.

- Richer layout companions and advanced authoring modes.
- Visual or media semantics that go beyond decorative defaults.
- Global-header scroll, translation, and shell-coordination refinements.
- Specialized workflow components whose use cases are real but narrower than the public component baseline.

Representative issues:

- [#153 Evaluate semantic media mode for non-decorative imagery](https://github.com/jflamb/fdic-design-system/issues/153)
- [#154 Evaluate richer CTA composition beyond one internal link](https://github.com/jflamb/fdic-design-system/issues/154)
- [#81 Component Proposal: fd-money-field](https://github.com/jflamb/fdic-design-system/issues/81)
- [#82 Component Proposal: fd-number-field](https://github.com/jflamb/fdic-design-system/issues/82)
- [#126 Evaluate condensed shy-header and shell coordination](https://github.com/jflamb/fdic-design-system/issues/126)
- [#127 Evaluate shy-header accessibility exposure when translated](https://github.com/jflamb/fdic-design-system/issues/127)

## Roadmap themes

### Forms and Data Entry

**Goal:** make high-stakes input workflows safer, clearer, and easier to implement without turning the design system into a form framework.

Prioritize when:

- the pattern reduces validation, labeling, formatting, or recovery mistakes
- the same guidance would apply across public forms and internal operational tools
- native input semantics remain intact

Hold when:

- the issue is only a visual variant
- the component would duplicate browser behavior without improving clarity or accessibility
- the workflow needs policy or content decisions before component work can start

Key issues: [#88](https://github.com/jflamb/fdic-design-system/issues/88), [#159](https://github.com/jflamb/fdic-design-system/issues/159).

Parked until adopter evidence is stronger: [#81](https://github.com/jflamb/fdic-design-system/issues/81), [#82](https://github.com/jflamb/fdic-design-system/issues/82).

### Structured Content and Metadata

**Goal:** help public pages expose dates, media facts, social content, cards, tiles, and link collections with durable semantics instead of decorative-only presentation.

Prioritize when:

- the component already displays a fact that should be machine-readable
- structured data improves findability, source clarity, or downstream CMS rendering
- the API can remain narrow and source-system friendly

Hold when:

- the metadata model is likely to become a mini CMS
- the issue only improves author convenience without improving user comprehension
- the design source of truth does not yet show the required states

Key issues: [#163](https://github.com/jflamb/fdic-design-system/issues/163), [#200](https://github.com/jflamb/fdic-design-system/issues/200).

### Navigation, Search, and Page Shells

**Goal:** make common page movement predictable across global navigation, local navigation, search, breadcrumbs, pagination, and shell layout.

Prioritize when:

- users could lose context, miss a route, or misunderstand scope
- keyboard and screen reader behavior needs a clearer contract
- Drupal or another CMS needs stable server-rendered markup guidance

Hold when:

- the behavior depends on application-specific routing or analytics
- the feature would make a shell component own too much application state
- the page pattern can be documented without adding component state

Key issues: [#126](https://github.com/jflamb/fdic-design-system/issues/126), [#127](https://github.com/jflamb/fdic-design-system/issues/127), [#145](https://github.com/jflamb/fdic-design-system/issues/145), [#146](https://github.com/jflamb/fdic-design-system/issues/146), [#108](https://github.com/jflamb/fdic-design-system/issues/108).

### Workflow Feedback and Recovery

**Goal:** improve status, confirmation, error recovery, and feedback patterns for anxious or high-consequence tasks.

Prioritize when:

- the pattern prevents mistakes or helps users recover from them
- status needs to be announced or persisted clearly
- the guidance can reduce inconsistent product-level implementations

Hold when:

- the request is mainly for richer visual treatment
- the flow depends on backend state the component cannot own
- the component would need application-specific submission or analytics behavior

Key issues: [#95](https://github.com/jflamb/fdic-design-system/issues/95), [#159](https://github.com/jflamb/fdic-design-system/issues/159), [#179](https://github.com/jflamb/fdic-design-system/issues/179), [#99](https://github.com/jflamb/fdic-design-system/issues/99).

### Specialized Patterns

**Goal:** support real FDIC workflows without letting specialized examples distort the general component contract.

Prioritize when:

- the pattern has an approved design source of truth
- the work can ship as a composed pattern or internal helper before becoming a general component
- the accessibility model is simpler and safer than a more visual alternative

Hold when:

- the pattern needs live data, policy decisions, or editorial governance that belongs outside the component package
- a visual-first implementation would weaken semantics or mobile behavior
- a private helper would leak into public package exports

Key issues: [#79](https://github.com/jflamb/fdic-design-system/issues/79), [#91](https://github.com/jflamb/fdic-design-system/issues/91), [#153](https://github.com/jflamb/fdic-design-system/issues/153), [#154](https://github.com/jflamb/fdic-design-system/issues/154).

Completed or superseded issues to close or split before reuse: [#217](https://github.com/jflamb/fdic-design-system/issues/217), [#220](https://github.com/jflamb/fdic-design-system/issues/220).

## Issue triage contract

Every roadmap candidate should have:

- a clear user or adopter problem
- the affected workflow and component or pattern
- accessibility acceptance criteria
- whether the change is docs-only, pattern-level, component API, token-level, or tooling
- what stays out of scope
- validation commands or review surfaces

Use labels consistently:

- `type:planning` for scope, tradeoffs, or unresolved decisions
- `type:improvement` or `type:feature` for implementation work
- `area:accessibility`, `area:docs`, `area:components`, `area:storybook`, `area:tooling`, or `area:security` for ownership
- `status:needs-research`, `status:needs-decision`, `status:ready`, or `status:in-progress` for next action
- `priority:p1`, `priority:p2`, or `priority:p3` only after the issue has enough evidence to compare against the roadmap themes

## Review cadence

Review the roadmap when:

- a first adopter starts implementation work
- a release changes the public package contract
- a theme accumulates more than five open issues without a clear next action
- a deferred limitation appears in consumer feedback or accessibility review

When closing or deferring an issue, update the affected component page if the limitation is still visible to adopters.
