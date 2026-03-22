---
name: add-or-update-component-documentation
description: Workflow command scaffold for add-or-update-component-documentation in fdic-design-system.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-component-documentation

Use this workflow when working on **add-or-update-component-documentation** in `fdic-design-system`.

## Goal

Adds or updates documentation for a UI component, including guidance, accessibility, usage, and live examples.

## Common Files

- `apps/docs/components/*.md`
- `apps/docs/.vitepress/theme/prose.css`
- `apps/docs/.vitepress/theme/custom.css`
- `apps/docs/.vitepress/config.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or create markdown file for the component in apps/docs/components/
- Add or update live example section in the markdown file
- Update or add related CSS in apps/docs/.vitepress/theme/prose.css or custom.css as needed
- Optionally update navigation in apps/docs/.vitepress/config.ts

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.