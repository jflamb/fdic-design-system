# ECC for Codex CLI

This supplements the root `AGENTS.md` with a repo-local ECC baseline.

## Repo Skill

- Repo-generated Codex skill: `.agents/skills/fdic-design-system/SKILL.md`
- Claude-facing companion skill: `.claude/skills/fdic-design-system/SKILL.md`
- Keep user-specific credentials and private MCPs in `~/.codex/config.toml`, not in this repo.

## MCP Baseline

Treat `.codex/config.toml` as the default ECC-safe baseline for work in this repository.
The generated baseline enables GitHub, Context7, Exa, Memory, Playwright, and Sequential Thinking.

## Multi-Agent Support

- Explorer: read-only evidence gathering
- Reviewer: correctness, security, and regression review
- Docs researcher: API and release-note verification
- Accessibility tester: a11y audits for components, docs pages, and interaction flows
- Browser debugger: Playwright-backed browser reproduction and UI evidence gathering
- Build engineer: npm workspace, tsup, Storybook, docs, and CI pipeline debugging
- Documentation engineer: repo docs and workflow guidance maintenance
- Test automator: focused Vitest and Storybook regression coverage
- Tooling engineer: script, generator, and workflow utility maintenance
- TypeScript pro: type-system and contract-focused implementation support

## Workflow Files

- `.claude/commands/feature-development.md`
- `.claude/commands/add-or-update-component-documentation.md`
- `.claude/commands/add-or-update-storybook-stories-for-component.md`

Use these workflow files as reusable task scaffolds when the detected repository workflows recur.
