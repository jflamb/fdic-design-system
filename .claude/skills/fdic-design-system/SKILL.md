```markdown
# fdic-design-system Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute to the `fdic-design-system` repository, a TypeScript-based design system for FDIC projects. It covers coding conventions, common workflows (such as adding components, updating CI, bumping dependencies, theming, and documentation), and testing patterns. By following these patterns, you can ensure your contributions are consistent, maintainable, and aligned with the project's standards.

## Coding Conventions

- **File Naming:** Use kebab-case for all files.
  - Example: `button-group.ts`, `alert-banner.test.ts`
- **Import Style:** Use absolute imports.
  - Example:
    ```ts
    import { Button } from 'packages/components/src/components/button'
    ```
- **Export Style:** Use named exports.
  - Example:
    ```ts
    // button.ts
    export function Button(props: ButtonProps) { ... }
    ```
- **Commit Messages:** Follow Conventional Commits.
  - Prefixes: `feat`, `fix`, `docs`, `chore`, `refactor`, `ci`
  - Example: `feat(button): add loading state support`
- **Code Structure:** Components live in `packages/components/src/components/`. Registration, stories, and docs are in their respective folders.
- **Documentation:** Use Markdown for docs in `apps/docs/components/` and `apps/docs/guide/`.

## Workflows

### Add or Update Component
**Trigger:** When adding a new UI component or making significant updates to an existing one  
**Command:** `/new-component`

1. Create or update the component file in `packages/components/src/components/`.
2. Add or update the corresponding test file in the same directory.
3. Register the component in `packages/components/src/register/` and/or update `packages/components/src/index.ts`.
4. Update `packages/components/package.json` if needed (e.g., exports, dependencies).
5. Add or update the Storybook story in `apps/storybook/src/`.
6. Write or update the documentation page in `apps/docs/components/`.
7. Sync or update `scripts/components/api-metadata.json` and `scripts/components/inventory.mjs`.
8. If the component is new, update `apps/docs/.vitepress/generated/component-navigation.ts` and/or `apps/docs/components/index.md`.

**Example:**
```ts
// packages/components/src/components/alert-banner.ts
export function AlertBanner(props: AlertBannerProps) { ... }
```
```ts
// packages/components/src/components/alert-banner.test.ts
import { describe, it, expect } from 'vitest'
import { AlertBanner } from './alert-banner'
describe('AlertBanner', () => {
  it('renders', () => {
    // test implementation
  })
})
```

### CI Workflow Update
**Trigger:** When updating or refactoring GitHub Actions workflows for CI/CD  
**Command:** `/update-ci`

1. Edit or create workflow files in `.github/workflows/` (e.g., `component-integrity.yml`).
2. Edit or create files in `.github/actions/` if custom actions are needed.
3. Update workflow inputs, runners, or action versions as required.
4. Update related scripts or config files if necessary.

**Example:**
```yaml
# .github/workflows/component-integrity.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

### Dependency Bump
**Trigger:** When a dependency update is available or required  
**Command:** `/bump-dependency`

1. Update `package.json` and/or `package-lock.json` in the relevant packages.
2. Update workflow files in `.github/workflows/` if bumping GitHub Actions dependencies.
3. Commit with a standardized message referencing the dependency and version change.

**Example:**
```json
// packages/components/package.json
{
  "dependencies": {
    "react": "^18.2.0"
  }
}
```
```yaml
# .github/workflows/deploy-pages.yml
- uses: actions/deploy-pages@v2
```

### Component CSS/Token/Theme Update
**Trigger:** When updating design tokens, theme CSS, or component-level styles  
**Command:** `/update-tokens`

1. Edit CSS token files in `apps/docs/.vitepress/theme/` and/or `apps/storybook/.storybook/`.
2. Update component styles in `packages/components/src/components/*.ts`.
3. Update related documentation or stories if needed.

**Example:**
```css
/* apps/docs/.vitepress/theme/tokens.css */
:root {
  --color-primary: #005ea2;
}
```
```ts
// packages/components/src/components/button.ts
export function Button(props) {
  return <button className="fdic-btn">{props.children}</button>
}
```

### Documentation Expansion or Refactor
**Trigger:** When improving, expanding, or reorganizing documentation  
**Command:** `/update-docs`

1. Edit or add Markdown files in `apps/docs/components/` or `apps/docs/guide/`.
2. Update navigation or index files in `apps/docs/.vitepress/` or `apps/docs/components/index.md`.
3. Optionally, update related prompts or `CONTRIBUTING.md`.

**Example:**
```markdown
<!-- apps/docs/components/alert-banner.md -->
# AlertBanner

Displays an important message at the top of the page.
```

## Testing Patterns

- **Framework:** [Vitest](https://vitest.dev/)
- **Test File Pattern:** `*.test.ts` (located alongside the component)
- **Test Structure:** Use `describe`, `it`, and `expect` from Vitest.

**Example:**
```ts
import { describe, it, expect } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders with label', () => {
    // test implementation
  })
})
```

## Commands

| Command           | Purpose                                                      |
|-------------------|--------------------------------------------------------------|
| /new-component    | Add or update a UI component, including tests and docs       |
| /update-ci        | Update or refactor CI/CD GitHub Actions workflows            |
| /bump-dependency  | Bump npm or GitHub Actions dependencies                      |
| /update-tokens    | Update design tokens, theme CSS, or component-level styles   |
| /update-docs      | Add or refactor documentation and guides                     |
```