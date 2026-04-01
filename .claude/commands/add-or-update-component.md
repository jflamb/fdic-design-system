---
name: add-or-update-component
description: Workflow command scaffold for add-or-update-component in fdic-design-system.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-component

Use this workflow when working on **add-or-update-component** in `fdic-design-system`.

## Goal

Implements a new UI component or updates an existing one, including code, tests, registration, Storybook, documentation, and metadata sync.

## Common Files

- `packages/components/src/components/*.ts`
- `packages/components/src/components/*.test.ts`
- `packages/components/src/register/*.ts`
- `packages/components/src/index.ts`
- `packages/components/package.json`
- `apps/storybook/src/*.stories.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update component implementation file in packages/components/src/components/
- Add or update corresponding test file in packages/components/src/components/
- Register component in packages/components/src/register/ and/or packages/components/src/index.ts
- Update packages/components/package.json if needed
- Add or update Storybook story in apps/storybook/src/

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.