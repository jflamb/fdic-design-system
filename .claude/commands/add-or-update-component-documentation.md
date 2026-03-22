---
name: add-or-update-component-documentation
description: Workflow command scaffold for add-or-update-component-documentation in fdic-design-system.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-component-documentation

Use this workflow when working on **add-or-update-component-documentation** in `fdic-design-system`.

## Goal

Adds or rewrites documentation pages for UI components in the docs site, often with a guidance-focused template and live examples.

## Common Files

- `apps/docs/components/*.md`
- `apps/docs/.vitepress/config.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update Markdown file(s) under apps/docs/components/{component}.md
- Follow guidance-focused template: Overview, When to use, When not to use, Examples, Best practices, etc.
- Optionally update VitePress sidebar or navigation config (apps/docs/.vitepress/config.ts)
- Optionally add or update live rendered examples

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.