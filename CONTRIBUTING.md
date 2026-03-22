# Contributing

This repository is in an early scaffold stage. Keep changes small, explicit, and easy to review.

The canonical repository policy lives in [.context/AGENT_GUIDE.md](./.context/AGENT_GUIDE.md). If this file and the guide disagree, follow the guide.

## Working Style

- Prefer one concern per issue or pull request.
- Record rationale when a change affects tokens, component APIs, accessibility behavior, documentation structure, or architecture.
- Keep placeholder implementations reversible until FDIC design decisions are clearer.
- Update docs when behavior, usage guidance, or accessibility expectations materially change.
- Treat accessibility as a release requirement, not follow-up cleanup.

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
