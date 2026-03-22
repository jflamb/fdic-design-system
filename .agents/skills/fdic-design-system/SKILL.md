---
name: fdic-design-system-conventions
description: Development conventions and patterns for fdic-design-system. TypeScript project with conventional commits.
---

# Fdic Design System Conventions

> Generated from [jflamb/fdic-design-system](https://github.com/jflamb/fdic-design-system) on 2026-03-22

## Overview

This skill teaches Claude the development patterns and conventions used in fdic-design-system.

## Tech Stack

- **Primary Language**: TypeScript
- **Architecture**: type-based module organization
- **Test Location**: mixed
- **Test Framework**: vitest

## When to Use This Skill

Activate this skill when:
- Making changes to this repository
- Adding new features following established patterns
- Writing tests that match project conventions
- Creating commits with proper message format

## Commit Conventions

Follow these commit message conventions based on 74 analyzed commits.

### Commit Style: Conventional Commits

### Prefixes Used

- `feat`
- `fix`
- `docs`
- `chore`
- `refactor`

### Message Guidelines

- Average message length: ~57 characters
- Keep first line concise and descriptive
- Use imperative mood ("Add feature" not "Added feature")


*Commit message example*

```text
docs: add icon and button component documentation
```

*Commit message example*

```text
feat(storybook): add icon and button component stories
```

*Commit message example*

```text
chore: add vitest test infrastructure for components package
```

*Commit message example*

```text
fix: right-align numeric column headers to match cell alignment
```

*Commit message example*

```text
refactor(docs): replace inline HTML examples with Storybook embeds
```

*Commit message example*

```text
feat: add fd-icon and fd-button Web Components
```

*Commit message example*

```text
feat(icon): add icon registry and built-in Phosphor Regular set
```

*Commit message example*

```text
Remove dated button implementation plan
```

## Architecture

### Project Structure: Monorepo

This project uses **type-based** module organization.

### Configuration Files

- `.github/workflows/deploy-pages.yml`
- `apps/docs/package.json`
- `apps/storybook/package.json`
- `package.json`
- `packages/components/package.json`
- `packages/components/tsconfig.json`
- `packages/components/vitest.config.ts`
- `packages/react/package.json`
- `packages/react/tsconfig.json`

### Guidelines

- Group code by type (components, services, utils)
- Keep related functionality in the same type folder
- Avoid circular dependencies between type folders

## Code Style

### Language: TypeScript

### Naming Conventions

| Element | Convention |
|---------|------------|
| Files | camelCase |
| Functions | camelCase |
| Classes | PascalCase |
| Constants | SCREAMING_SNAKE_CASE |

### Import Style: Mixed Style

### Export Style: Mixed Style


## Testing

### Test Framework: vitest

### File Pattern: `*.test.ts`

### Test Types

- **Unit tests**: Test individual functions and components in isolation


*Test file structure*

```typescript
import { describe, it, expect } from 'vitest'

describe('MyFunction', () => {
  it('should return expected result', () => {
    const result = myFunction(input)
    expect(result).toBe(expected)
  })
})
```

## Common Workflows

These workflows were detected from analyzing commit patterns.

### Feature Development

Standard feature implementation workflow

**Frequency**: ~21 times per month

**Steps**:
1. Add feature implementation
2. Add tests for feature
3. Update documentation

**Files typically involved**:
- `apps/docs/.vitepress/theme/*`
- `apps/docs/components/*`
- `apps/docs/.vitepress/*`
- `**/*.test.*`

**Example commit sequence**:
```
docs: define OKLCH on first use with dfn and abbr elements
refactor: replace decision cards with vertical stepped flow
fix: suppress default ol numbering on decision flow
```

### Refactoring

Code refactoring and cleanup workflow

**Frequency**: ~2 times per month

**Steps**:
1. Ensure tests pass before refactor
2. Refactor code structure
3. Verify tests still pass

**Files typically involved**:
- `src/**/*`

**Example commit sequence**:
```
refactor(docs): replace inline HTML examples with Storybook embeds
fix: right-align numeric column headers to match cell alignment
add agent configs, skills, and consolidated AGENT_GUIDE
```

### Add Or Update Component Documentation

Adds or rewrites documentation pages for UI components in the docs site, often with a guidance-focused template and live examples.

**Frequency**: ~3 times per month

**Steps**:
1. Create or update Markdown file(s) under apps/docs/components/{component}.md
2. Follow guidance-focused template: Overview, When to use, When not to use, Examples, Best practices, etc.
3. Optionally update VitePress sidebar or navigation config (apps/docs/.vitepress/config.ts)
4. Optionally add or update live rendered examples

**Files typically involved**:
- `apps/docs/components/*.md`
- `apps/docs/.vitepress/config.ts`

**Example commit sequence**:
```
Create or update Markdown file(s) under apps/docs/components/{component}.md
Follow guidance-focused template: Overview, When to use, When not to use, Examples, Best practices, etc.
Optionally update VitePress sidebar or navigation config (apps/docs/.vitepress/config.ts)
Optionally add or update live rendered examples
```

### Add Or Update Storybook Stories For Component

Adds or updates Storybook stories for a UI component, providing interactive examples and variants for developers.

**Frequency**: ~3 times per month

**Steps**:
1. Create or update a file apps/storybook/src/{component}.stories.ts
2. Implement stories for all relevant variants and states
3. Optionally update Storybook preview config or decorators

**Files typically involved**:
- `apps/storybook/src/*.stories.ts`
- `apps/storybook/.storybook/preview.ts`

**Example commit sequence**:
```
Create or update a file apps/storybook/src/{component}.stories.ts
Implement stories for all relevant variants and states
Optionally update Storybook preview config or decorators
```

### Component Implementation With Tests And Exports

Implements a new Web Component (or major feature), adds tests, and exports it from the package index.

**Frequency**: ~1 times per month

**Steps**:
1. Create {component}.ts and {component}.test.ts in packages/components/src/components/
2. Export the component in packages/components/src/index.ts
3. Implement tests covering rendering, accessibility, and edge cases

**Files typically involved**:
- `packages/components/src/components/*.ts`
- `packages/components/src/components/*.test.ts`
- `packages/components/src/index.ts`

**Example commit sequence**:
```
Create {component}.ts and {component}.test.ts in packages/components/src/components/
Export the component in packages/components/src/index.ts
Implement tests covering rendering, accessibility, and edge cases
```

### Add Or Update Style Or Theme Css

Adds or refines CSS for prose, custom components, or theme overrides in the docs site.

**Frequency**: ~3 times per month

**Steps**:
1. Edit apps/docs/.vitepress/theme/prose.css or custom.css for prose/component-specific styles
2. Optionally update Vue theme/index.ts for component registration

**Files typically involved**:
- `apps/docs/.vitepress/theme/prose.css`
- `apps/docs/.vitepress/theme/custom.css`
- `apps/docs/.vitepress/theme/index.ts`

**Example commit sequence**:
```
Edit apps/docs/.vitepress/theme/prose.css or custom.css for prose/component-specific styles
Optionally update Vue theme/index.ts for component registration
```

### Add Or Update Docs Site Foundations Section

Adds or restructures the Foundations section in the documentation, including tokens, colors, typography, spacing, etc.

**Frequency**: ~1 times per month

**Steps**:
1. Create or update Markdown files under apps/docs/guide/foundations/
2. Update sidebar/navigation in apps/docs/.vitepress/config.ts
3. Optionally update or remove apps/docs/guide/tokens.md

**Files typically involved**:
- `apps/docs/guide/foundations/*.md`
- `apps/docs/.vitepress/config.ts`
- `apps/docs/guide/tokens.md`

**Example commit sequence**:
```
Create or update Markdown files under apps/docs/guide/foundations/
Update sidebar/navigation in apps/docs/.vitepress/config.ts
Optionally update or remove apps/docs/guide/tokens.md
```

### Add Or Update Ci Cd Workflow

Adds or updates GitHub Actions workflows for deployment, build, or collaboration.

**Frequency**: ~2 times per month

**Steps**:
1. Edit or add YAML files under .github/workflows/
2. Optionally update related config files or environment variables

**Files typically involved**:
- `.github/workflows/*.yml`

**Example commit sequence**:
```
Edit or add YAML files under .github/workflows/
Optionally update related config files or environment variables
```


## Best Practices

Based on analysis of the codebase, follow these practices:

### Do

- Use conventional commit format (feat:, fix:, etc.)
- Write tests using vitest
- Follow *.test.ts naming pattern
- Use camelCase for file names
- Prefer mixed exports

### Don't

- Don't write vague commit messages
- Don't skip tests for new features
- Don't deviate from established patterns without discussion

---

*This skill was auto-generated by [ECC Tools](https://ecc.tools). Review and customize as needed for your team.*
