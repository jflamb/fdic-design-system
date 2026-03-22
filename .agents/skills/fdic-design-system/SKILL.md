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

Follow these commit message conventions based on 77 analyzed commits.

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
docs(icon): remove unsupported forced-colors claim (#12)
```

*Commit message example*

```text
fix(button): align a11y, link safety, and v1 type contract (#9 #10 #11)
```

*Commit message example*

```text
chore: remove local plan file (moved to GitHub issue #5)
```

*Commit message example*

```text
feat(storybook): add icon and button component stories
```

*Commit message example*

```text
refactor(docs): replace inline HTML examples with Storybook embeds
```

*Commit message example*

```text
docs: add icon and button component documentation
```

*Commit message example*

```text
feat: add fd-icon and fd-button Web Components
```

*Commit message example*

```text
feat(icon): add icon registry and built-in Phosphor Regular set
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

**Frequency**: ~20 times per month

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
fix: suppress default ol numbering on decision flow
fix: tighten vertical spacing in palette group headers
feat: integrate prose component styles into VitePress theme
```

### Add Or Update Component Documentation

Adds or updates documentation for a UI component, including guidance, accessibility, usage, and live examples.

**Frequency**: ~4 times per month

**Steps**:
1. Edit or create markdown file for the component in apps/docs/components/
2. Add or update live example section in the markdown file
3. Update or add related CSS in apps/docs/.vitepress/theme/prose.css or custom.css as needed
4. Optionally update navigation in apps/docs/.vitepress/config.ts

**Files typically involved**:
- `apps/docs/components/*.md`
- `apps/docs/.vitepress/theme/prose.css`
- `apps/docs/.vitepress/theme/custom.css`
- `apps/docs/.vitepress/config.ts`

**Example commit sequence**:
```
Edit or create markdown file for the component in apps/docs/components/
Add or update live example section in the markdown file
Update or add related CSS in apps/docs/.vitepress/theme/prose.css or custom.css as needed
Optionally update navigation in apps/docs/.vitepress/config.ts
```

### Add Or Update Storybook Stories For Component

Adds or updates Storybook stories for a UI component to provide live, interactive examples for developers.

**Frequency**: ~3 times per month

**Steps**:
1. Create or edit a .stories.ts file in apps/storybook/src/ for the component
2. Optionally update global Storybook config in apps/storybook/.storybook/preview.ts
3. Run/build Storybook to verify stories render correctly

**Files typically involved**:
- `apps/storybook/src/*.stories.ts`
- `apps/storybook/.storybook/preview.ts`

**Example commit sequence**:
```
Create or edit a .stories.ts file in apps/storybook/src/ for the component
Optionally update global Storybook config in apps/storybook/.storybook/preview.ts
Run/build Storybook to verify stories render correctly
```

### Add Or Update Web Component Implementation

Implements a new Web Component or updates an existing one, including source, tests, and index registration.

**Frequency**: ~2 times per month

**Steps**:
1. Create or edit the component TypeScript file in packages/components/src/components/
2. Create or update the corresponding test file in the same directory
3. Update packages/components/src/index.ts to export/register the component

**Files typically involved**:
- `packages/components/src/components/*.ts`
- `packages/components/src/components/*.test.ts`
- `packages/components/src/index.ts`

**Example commit sequence**:
```
Create or edit the component TypeScript file in packages/components/src/components/
Create or update the corresponding test file in the same directory
Update packages/components/src/index.ts to export/register the component
```

### Add Or Update Icon Set Or Registry

Adds a new icon set or updates the icon registry, including implementation and tests.

**Frequency**: ~2 times per month

**Steps**:
1. Create or edit icon set file in packages/components/src/icons/
2. Create or update registry logic in packages/components/src/icons/registry.ts
3. Add or update corresponding test files

**Files typically involved**:
- `packages/components/src/icons/*.ts`
- `packages/components/src/icons/*.test.ts`

**Example commit sequence**:
```
Create or edit icon set file in packages/components/src/icons/
Create or update registry logic in packages/components/src/icons/registry.ts
Add or update corresponding test files
```

### Add Or Update Design Or Implementation Plan

Adds or updates a markdown plan document for design or implementation of features/components.

**Frequency**: ~3 times per month

**Steps**:
1. Create or edit a markdown file in docs/plans/ with a date and topic in the filename
2. Describe design or implementation details in the markdown file

**Files typically involved**:
- `docs/plans/*.md`

**Example commit sequence**:
```
Create or edit a markdown file in docs/plans/ with a date and topic in the filename
Describe design or implementation details in the markdown file
```

### Update Github Actions Or Workflows

Updates GitHub Actions workflow files for CI/CD, deployment, or automation.

**Frequency**: ~2 times per month

**Steps**:
1. Edit workflow YAML files in .github/workflows/
2. Commit and push changes to trigger workflow runs

**Files typically involved**:
- `.github/workflows/*.yml`

**Example commit sequence**:
```
Edit workflow YAML files in .github/workflows/
Commit and push changes to trigger workflow runs
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
