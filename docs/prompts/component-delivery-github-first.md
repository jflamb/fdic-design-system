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
- Complete the design-review loop and implementation-plan review loop.
- Implement the component and update tests, docs, stories, metadata, and generated surfaces as required.
- Run required validation from the support document, plus conditional Storybook validation when triggered by the change.
- Create or update a PR, include the required review prompt, include at least one visual verification artifact when the component has meaningful visual or interactive states, complete PR self-review, and fix actionable findings.
- Create follow-up issue(s) for deferred work that is materially useful, and explicitly open enhancement issues for important features that fall out of scope for v1.
- Merge with `squash` when checks are green and no blocker findings remain.
- Perform post-merge cleanup and verification on `main`.
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
