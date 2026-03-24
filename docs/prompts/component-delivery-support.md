# Component Delivery Support

Use this document with a shorter component-delivery prompt when you want an agent to design, plan, implement, document, verify, review, and ship a component end-to-end without re-embedding the full workflow every time.

This support document is repository-specific. It assumes work is happening in the FDIC design system monorepo and that `.context/AGENT_GUIDE.md` remains the binding repository guide unless the invoking prompt explicitly overrides a step.

## Execution Policy

- Read `.context/AGENT_GUIDE.md` first and treat it as binding repository guidance except where the invoking prompt explicitly overrides it.
- Continue end-to-end without pausing for maintainer approval unless semantics, keyboarding, or state ownership remain materially ambiguous after reviewing local repo patterns and any supplied Figma.
- If the invoking prompt authorizes merge, the agent may create or update GitHub artifacts, open or update a PR, and merge after required checks pass and no blocker findings remain.
- If a GitHub artifact action fails but the implementation can continue safely, continue the work and record the missed action in the most relevant Issue or PR comment.
- Keep v1 narrow, reversible, semantically correct, and easy to back out.
- Default to the smallest public API that satisfies semantics, accessibility, and the supplied design intent.

## Inputs And Precedence

Use this precedence order unless the invoking prompt states otherwise:

1. `.context/AGENT_GUIDE.md`
2. Provided Figma links
3. Existing repo patterns
4. Relevant accessibility standards and mature design-system research
5. USWDS and government UX conventions

### Figma Fallback Rule

- If Figma is supplied, treat it as the primary visual and interaction reference.
- If no Figma is supplied, use the closest shipped repo component family as the visual and behavioral baseline and document that fallback in GitHub artifacts.
- Only stop for clarification when semantics, keyboarding, focus behavior, or state ownership remain materially ambiguous after applying the repo-pattern fallback.
- If you intentionally diverge from Figma or repo precedent, document why in GitHub artifacts.

## Design Decisions To Record

Before implementation, explicitly decide and record:

- component taxonomy:
  - `static`
  - `dismissible`
  - `selectable`
  - `action/clickable`
  - `composite/group-managed`
- semantic HTML strategy
- assistive-technology visibility for decorative/static content:
  - hidden from the accessibility tree
  - semantically inert but still exposed
- keyboard model:
  - `plain tab order`
  - `roving tabindex`
  - `composite arrow navigation`
  - `no custom keyboarding beyond native controls`
- focus behavior
- focus recovery after removal, if applicable
- state ownership:
  - what the component owns
  - what the application owns

## Public API Minimization Rules

- Prefer native HTML semantics and built-in browser behavior over custom contracts.
- Do not add adjacent variants, richer behaviors, convenience aliases, extra slots, or styling hooks unless explicitly requested, clearly required by Figma, or necessary for accessibility correctness.
- When basing a new component on an existing one, reuse and extract proven contracts where practical instead of creating slightly divergent parallel behavior.
- If a docs example or story needs composition beyond the component's direct API, present it as a recipe and avoid stretching the component API to absorb it.

## GitHub-First Workflow

### 1. Discussion

- Create or reuse a GitHub Discussion before implementation.
- Include:
  - draft problem statement
  - concise component description
  - Figma link(s), if any
  - fallback statement when no Figma is available
  - links to related repo or GitHub artifacts
- Post a design proposal comment covering:
  - problem being solved
  - intended use and when not to use
  - taxonomy decision
  - semantic HTML strategy
  - assistive-technology visibility decision for decorative/static content, if applicable
  - accessibility expectations
  - interaction model
  - keyboard behavior
  - focus behavior
  - focus recovery after removal, if applicable
  - important states
  - proposed API shape
  - explicit public surface:
    - tag
    - attributes/properties
    - events
    - slots
    - shadow parts
    - CSS custom properties
  - token and styling impact
  - generated-surface impact
  - v1 boundaries
  - deferred enhancements
  - tradeoffs and open questions
  - deviations from Figma or repo precedent

### 2. Design Review Loop

- Perform a critical design self-review in the Discussion.
- Revise until no actionable issues remain.
- Cap at 3 passes unless a severe late issue appears.
- A pass counts only when new actionable findings were recorded.

### 3. Implementation Issue

- Create or reuse an implementation Issue linked to the Discussion and Figma.
- If a related planning or proposal issue already exists, link it instead of repurposing it unless it is clearly the implementation issue.
- Move the Issue to `In progress` when implementation starts.
- Add:
  - summary of approved direction
  - acceptance criteria
  - detailed plan
  - checklist sub-tasks
  - validation expectations for tests, docs, Storybook, accessibility, and generated surfaces
  - reusable review prompt for implementation review

### 4. Plan Review Loop

- Perform a critical implementation-plan self-review in the Issue.
- Revise until no actionable issues remain.
- Cap at 3 passes unless a severe late issue appears.
- A pass counts only when new actionable findings were recorded.

### 5. Branch, Implementation, And Live Tracking

- Create or reuse a branch and publish it before or during implementation.
- Commit before opening the PR unless repo conditions make that unsafe.
- Update the Issue checklist incrementally as work completes. Do not batch the entire checklist at the end.
- Do not run scaffold or codegen steps in parallel when they touch shared generated files.

### 6. PR And Review

- Create or update a PR when the implementation is reviewable.
- Move the Issue to `In review`.
- Post the reusable review prompt required by repo conventions.
- Add a PR self-review comment that explicitly states:
  - blocker findings
  - non-blocking risks
  - deferred work
  - merge recommendation
- If the review finds actionable issues, fix them, update the PR, and repeat.
- Cap at 3 implementation/review passes unless a severe late issue appears.
- A pass counts only when new actionable findings were recorded.

### 7. Merge And Post-Merge

- Merge with `squash` after required checks pass and no blocker findings remain, if merge authority was granted by the invoking prompt.
- After merge:
  - move the Issue to `Done`
  - delete the remote and local branch when possible
  - return to `main`
  - pull latest `main`
  - run post-merge verification on `main`
- If branch deletion already happened automatically, record that and continue.

## Validation Policy

Required:

- `npm run validate:components`
- `npm run test:components`
- `npm run build`

Conditional:

- `npm run test:storybook` when the change affects browser-visible interaction, keyboarding, or accessibility behavior
- `npm run build:storybook` when stories, docs embeds, or Storybook output changed

Validation expectations:

- Fix failures before proceeding.
- Review generated outputs for malformed changes, accidental deletions, duplicate headings, placeholders, stale generated sections, or misleading guidance.
- If generated files changed only by ordering or formatting noise, verify the change is expected and avoid committing avoidable churn.
- Post-merge verification should run on `main` and should not rerun optional surfaces unless they changed as part of the merged work.

## Visual Verification

- Include at least one visual verification artifact when the component has meaningful visual or interactive states.
- Acceptable artifacts:
  - committed image under the repository
  - PR attachment
  - stable Storybook or docs URL showing the relevant state
- For form controls, cover the primary state set and any materially distinct states changed by the work, such as error, disabled, or read-only when applicable.

## Documentation Truthfulness

- Keep docs and stories aligned with the shipped API.
- Remove placeholder, stale, duplicate, or misleading guidance before opening the PR.
- If usage guidance depends on composition outside the component contract, label it clearly as a recipe or integration pattern.

## Follow-Up Issues

- Create follow-up issue(s) only for deferred work that is materially useful.
- Do not create follow-up issues for every minor idea or speculative variant.
- Deferred work that changes semantics, keyboarding, taxonomy, state ownership, or broadens v1 materially should usually become a follow-up issue instead of being stretched into v1.
- If an important feature, state, accessibility enhancement, or integration need falls out of scope for v1, open a follow-up enhancement issue before closing the work so it can be revisited intentionally later.
- Follow-up issues should explain:
  - what was deferred
  - why it was kept out of v1
  - user or system impact
  - recommended next step or decision needed

## Prompt Continuous Improvement

- End each run with a brief self-reflection on how well the prompt and support document guided the work.
- Check whether:
  - instructions were ambiguous
  - important workflow steps were missing
  - validation expectations were incomplete
  - GitHub artifact expectations were unclear
  - out-of-scope handling or follow-up capture was under-specified
- If meaningful improvements are warranted, update:
  - `docs/prompts/component-delivery-github-first.md`
  - `docs/prompts/component-delivery-support.md`
- Prefer targeted edits over wholesale rewrites.
- In the final report, state:
  - whether either prompt file changed
  - why each change was made
  - how the change should improve the next invocation

## Milestone Reporting

When the invoking prompt asks for milestone updates, report:

- artifact URL if one exists
- one-line status
- key risk or decision, if any

Recommended milestones:

- Discussion created or reused
- design review loop complete
- Issue created or reused
- implementation plan review loop complete
- PR opened or updated
- implementation/review loop complete
- merge complete
