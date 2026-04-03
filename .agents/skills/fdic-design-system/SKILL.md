```markdown
# fdic-design-system Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `fdic-design-system` TypeScript codebase. You'll learn about file organization, import/export styles, commit message formatting, and how to write and locate tests. This guide is designed to help contributors maintain consistency and quality throughout the project.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `buttonComponent.ts`, `formField.ts`

### Import Style
- Use **relative imports** for referencing other modules within the codebase.
  - Example:
    ```typescript
    import { Button } from './buttonComponent';
    ```

### Export Style
- Use **named exports** rather than default exports.
  - Example:
    ```typescript
    // buttonComponent.ts
    export const Button = () => { /* ... */ };
    ```

### Commit Messages
- Follow **conventional commit** format.
- Use the `feat` prefix for new features.
  - Example:
    ```
    feat: add accessible button component
    ```

## Workflows

### Adding a New Component
**Trigger:** When you need to introduce a new UI component.
**Command:** `/add-component`

1. Create a new file using camelCase naming (e.g., `myNewComponent.ts`).
2. Implement the component using TypeScript.
3. Export the component using a named export.
4. Write a corresponding test file named `myNewComponent.test.ts`.
5. Commit your changes with a conventional commit message:
    ```
    feat: add my new component
    ```

### Writing Tests
**Trigger:** When you add or update functionality.
**Command:** `/write-test`

1. Create a test file with the pattern `*.test.ts` (e.g., `buttonComponent.test.ts`).
2. Write tests covering the component or module logic.
3. Run your test suite (framework unspecified; refer to project documentation if available).
4. Ensure all tests pass before committing.

### Refactoring Code
**Trigger:** When improving or restructuring existing code.
**Command:** `/refactor`

1. Identify the code to refactor.
2. Make changes while preserving existing functionality.
3. Update or add tests as needed.
4. Use a conventional commit message:
    ```
    feat: refactor [component/module] for clarity
    ```

## Testing Patterns

- Test files use the pattern `*.test.ts`.
- The specific testing framework is not specified; check project documentation or existing test files for guidance.
- Place test files alongside the modules they test or in a dedicated test directory.
- Example test file name: `buttonComponent.test.ts`

## Commands
| Command         | Purpose                                    |
|-----------------|--------------------------------------------|
| /add-component  | Scaffold and add a new UI component        |
| /write-test     | Create and run tests for a component/module|
| /refactor       | Refactor existing code with best practices |

```