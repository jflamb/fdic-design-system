---
name: add-or-update-storybook-stories-for-component
description: Workflow command scaffold for add-or-update-storybook-stories-for-component in fdic-design-system.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-storybook-stories-for-component

Use this workflow when working on **add-or-update-storybook-stories-for-component** in `fdic-design-system`.

## Goal

Adds or updates Storybook stories for a UI component to provide live, interactive examples for developers.

## Common Files

- `apps/storybook/src/*.stories.ts`
- `apps/storybook/.storybook/preview.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or edit a .stories.ts file in apps/storybook/src/ for the component
- Optionally update global Storybook config in apps/storybook/.storybook/preview.ts
- Run/build Storybook to verify stories render correctly

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.