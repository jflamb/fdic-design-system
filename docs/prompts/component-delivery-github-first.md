# Component Delivery Prompt

Use this prompt when you want an agent to deliver a new design-system component end-to-end while keeping the invocation concise and pushing durable workflow detail into [component-delivery-support.md](./component-delivery-support.md).

## Prompt

```text
You are autonomously designing, planning, implementing, documenting, reviewing, validating, and shipping a design-system component for this repository.

Read and follow:
- `.context/AGENT_GUIDE.md`
- `docs/prompts/component-delivery-support.md`

The support document carries the default workflow, review loops, fallback rules, GitHub-artifact policy, validation policy, merge policy, and post-merge expectations for this task. Follow it unless this prompt explicitly overrides a step.

Execution overrides for this run:
- Continue end-to-end without waiting for maintainer approval unless semantics, keyboarding, focus behavior, or state ownership remain materially ambiguous after reviewing repo patterns and any supplied Figma.
- If no Figma is provided, use the closest shipped repo component family as the baseline and document that fallback in GitHub artifacts.
- You are authorized to create or update Discussions, Issues, project-board state, branches, PRs, review comments, follow-up issues, and to merge with `squash` after required checks pass and no blocker findings remain.
- If a GitHub artifact step fails but the implementation can continue safely, continue and record the missed action in the relevant Issue or PR comment.
- Keep v1 narrow, reversible, semantically correct, and minimal in public API surface.
- Prefer native platform features and fallback-first progressive enhancement over legacy support architecture when the shipped browser target makes the modern approach viable.

Component request:
- Name: <Component Name>
- Suggested tag: <tag-name>
- Brief description: <one or two sentences>
- Figma: <link or "none supplied">

Scope notes:
- Base the component on these existing repo patterns when relevant: <similar components or "discover locally">
- Any task-specific constraints: <constraints or "none">

Required outcomes:
- Decide and record taxonomy, semantic HTML strategy, keyboard model, focus behavior, focus recovery after removal if applicable, and state ownership before implementation.
- When the component is decorative or static-only, explicitly decide whether the host should be hidden from assistive technology or merely remain semantically inert.
- Create or reuse the required GitHub Discussion and implementation Issue.
- Resolve the current GitHub artifact targets from live URLs, numbers, or fresh queries before posting comments or updates; do not rely on copied GraphQL node IDs from earlier context.
- If the primary GitHub connector cannot post to Discussions directly, use a live GraphQL or `gh` fallback in the same run and record that fallback only if it also fails.
- Complete the design-review loop and implementation-plan review loop.
- Implement the component and update tests, docs, stories, metadata, and generated surfaces as required.
- Keep all documentation fully in sync with the shipped design and implementation as each code change lands. Update narrative docs, Storybook stories, embeds, linked story IDs, examples, accessibility guidance, integration guidance, framework or CMS recipes, migration notes, and generated API surfaces in the same change whenever behavior, visuals, semantics, keyboarding, focus, motion, responsive behavior, or consumer implementation guidance changes.
- If implementation constraints force a meaningful deviation from the initial design proposal or proposed API, update the Discussion, implementation Issue, PR description, and affected docs in the same run so the shipped contract and recorded rationale stay aligned.
- If the design or token direction changes during the run, reconcile the affected implementation, docs, metadata, visual artifacts, and GitHub records before merge, then rerun the validation surfaces affected by that update.
- Treat implementation guidance as a required deliverable, not optional polish. If the shipped work adds a new consumer-facing pattern, adapter layer, integration contract, workflow, or composition rule, document how to adopt it in the component docs before the PR is considered complete.
- When native CSS or platform primitives replace legacy patterns, update the repo guidance and the relevant GitHub Discussion so future work starts from the new baseline instead of rediscovering it.
- When editing `scripts/components/api-metadata.json`, escape union pipes as `\\|` so generated markdown tables render correctly.
- In `scripts/components/api-metadata.json`, use `default` for the unnamed slot entry; do not use display-only labels such as `(default)`.
- Run required validation from the support document, plus conditional Storybook validation when triggered by the change.
- When Storybook interaction stories drive animated or overlay states, ensure their `play` functions wait for the settled end state before returning so addon-a11y audits the shipped state rather than a transitional frame.
- When a docs-overview story would otherwise render multiple instances of a unique landmark such as `header`, `footer`, `main`, or `banner`, keep the overview to a single representative instance and cover additional variants in separate stories so addon-a11y audits a truthful document structure.
- If component-scoped work exposes a narrow shared validation or toolchain regression on a required surface, fix it in the same run when the cause is clear and the change is low-risk, and record that rationale in GitHub artifacts.
- If browser-backed accessibility validation shows that a supplied Figma visual value would ship an inaccessible result, prefer the accessible implementation and record the deviation in the Discussion, Issue, and PR artifacts.
- Create or update a PR, include the required review prompt, include at least one visual verification artifact when the component has meaningful visual or interactive states, complete PR self-review, fix actionable findings, and ensure the implementation Issue will close on merge or is closed manually during post-merge cleanup.
- When the visual verification artifact comes from Storybook, capture the rendered story state itself, not the Storybook chrome or a loading frame.
- Create follow-up issue(s) for deferred work that is materially useful, and explicitly open enhancement issues for important features that fall out of scope for v1.
- Merge with `squash` when checks are green and no blocker findings remain.
- Perform post-merge cleanup and verification on `main`.
- If post-merge verification on `main` shows a single unexpected failure on a previously green surface, rerun that failing surface once in isolation before changing code; treat repeated failure as a real regression and record one-off flakes in the final report.
- End with a self-reflection step that reviews whether this prompt and `docs/prompts/component-delivery-support.md` were sufficient. If meaningful improvements are warranted, update both prompt files directly and report what changed, why, and how it should improve future runs.

Milestone reporting:
For each of these, report the artifact URL if one exists, a one-line status, and the key risk or decision if any:
- Discussion created or reused
- design review loop complete
- Issue created or reused
- implementation plan review loop complete
- PR opened or updated
- implementation/review loop complete
- merge complete
```
