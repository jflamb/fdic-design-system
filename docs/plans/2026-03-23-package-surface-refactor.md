# Package Surface Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `@fdic-ds/components` so the root import is side-effect-free, registration is explicit via `register/*` entry points, and every public component has a symbol subpath export.

**Architecture:** Strip `customElements.define()` calls from component source modules into separate `register/*.ts` files. Add subpath exports to `package.json`. Migrate tests and Storybook stories to use registration imports. Update the tsup build to produce per-component entry points.

**Tech Stack:** Lit 3, TypeScript, tsup, vitest + happy-dom

**Discussion:** https://github.com/jflamb/fdic-design-system/discussions/50

---

## Component Classification Reference

| Component | Tier | Symbol subpath | Registration subpath | Implicit registrations |
|-----------|------|----------------|---------------------|----------------------|
| `fd-button` | first-class | `fd-button` | `register/fd-button` | — |
| `fd-button-group` | first-class | `fd-button-group` | `register/fd-button-group` | — |
| `fd-checkbox` | first-class | `fd-checkbox` | `register/fd-checkbox` | — |
| `fd-checkbox-group` | first-class | `fd-checkbox-group` | `register/fd-checkbox-group` | `fd-checkbox` |
| `fd-field` | first-class | `fd-field` | `register/fd-field` | `fd-label`, `fd-input`, `fd-message` |
| `fd-icon` | first-class | `fd-icon` | `register/fd-icon` | — |
| `fd-input` | first-class | `fd-input` | `register/fd-input` | — |
| `fd-label` | first-class | `fd-label` | `register/fd-label` | — |
| `fd-menu` | first-class | `fd-menu` | `register/fd-menu` | `fd-menu-item` |
| `fd-radio` | first-class | `fd-radio` | `register/fd-radio` | — |
| `fd-radio-group` | first-class | `fd-radio-group` | `register/fd-radio-group` | `fd-radio` |
| `fd-selector` | first-class | `fd-selector` | `register/fd-selector` | `fd-option` |
| `fd-split-button` | first-class | `fd-split-button` | `register/fd-split-button` | `fd-menu`, `fd-menu-item`, `fd-button` |
| `fd-label` | first-class | `fd-label` | `register/fd-label` | — |
| `fd-menu-item` | child-only | `fd-menu-item` | — | registered by `fd-menu`, `fd-split-button` |
| `fd-message` | child-only | `fd-message` | — | registered by `fd-field` |
| `fd-option` | child-only | `fd-option` | — | registered by `fd-selector` |
| `fd-placeholder` | demoted | — | — | removed from public inventory |

---

## Task 1: Strip `customElements.define()` from all component source files

Every component file (17 total) ends with a self-registration block like:

```ts
if (!customElements.get("fd-button")) {
  customElements.define("fd-button", FdButton);
}
```

Remove this block from every component source file. After this task, importing a component module only gives you the class — no side effects.

**Files to modify** (remove the trailing `if (!customElements.get(...)) { ... }` block from each):

- `packages/components/src/components/fd-button.ts` (lines 450-452)
- `packages/components/src/components/fd-button-group.ts`
- `packages/components/src/components/fd-checkbox.ts`
- `packages/components/src/components/fd-checkbox-group.ts`
- `packages/components/src/components/fd-field.ts` (lines 210-212)
- `packages/components/src/components/fd-icon.ts`
- `packages/components/src/components/fd-input.ts`
- `packages/components/src/components/fd-label.ts` (lines 789-791)
- `packages/components/src/components/fd-menu.ts`
- `packages/components/src/components/fd-menu-item.ts`
- `packages/components/src/components/fd-message.ts`
- `packages/components/src/components/fd-option.ts`
- `packages/components/src/components/fd-placeholder.ts`
- `packages/components/src/components/fd-radio.ts`
- `packages/components/src/components/fd-radio-group.ts`
- `packages/components/src/components/fd-selector.ts`
- `packages/components/src/components/fd-split-button.ts`

**Step 1:** For each file, remove the `if (!customElements.get(...)) { customElements.define(...); }` block at the end.

**Step 2:** Run the build to make sure the stripped files still compile:

```bash
cd packages/components && npm run build
```

Expected: Build succeeds. Tests will fail at this point — that's expected and fixed in Task 3.

**Step 3:** Commit.

```bash
git add packages/components/src/components/fd-*.ts
git commit -m "refactor: strip auto-registration from component source modules

Component modules are now side-effect-free. Importing a component
gives you the class and types without calling customElements.define().

Registration moves to explicit entry points in the next commit."
```

---

## Task 2: Create per-component registration entry points

Create a `packages/components/src/register/` directory with one file per first-class component, plus `register-all.ts`.

**Directory:** `packages/components/src/register/`

### Registration file pattern

Each registration file imports the component class(es) and defines them. Use the same guard pattern that was in the source files.

**Step 1:** Create `packages/components/src/register/fd-button.ts`:

```ts
import { FdButton } from "../components/fd-button.js";

if (!customElements.get("fd-button")) {
  customElements.define("fd-button", FdButton);
}
```

**Step 2:** Create all other first-class registration files following the same pattern. Components with implicit child registrations pull in their children:

`packages/components/src/register/fd-button-group.ts`:
```ts
import { FdButtonGroup } from "../components/fd-button-group.js";

if (!customElements.get("fd-button-group")) {
  customElements.define("fd-button-group", FdButtonGroup);
}
```

`packages/components/src/register/fd-checkbox.ts`:
```ts
import { FdCheckbox } from "../components/fd-checkbox.js";

if (!customElements.get("fd-checkbox")) {
  customElements.define("fd-checkbox", FdCheckbox);
}
```

`packages/components/src/register/fd-checkbox-group.ts`:
```ts
import { FdCheckbox } from "../components/fd-checkbox.js";
import { FdCheckboxGroup } from "../components/fd-checkbox-group.js";

if (!customElements.get("fd-checkbox")) {
  customElements.define("fd-checkbox", FdCheckbox);
}
if (!customElements.get("fd-checkbox-group")) {
  customElements.define("fd-checkbox-group", FdCheckboxGroup);
}
```

`packages/components/src/register/fd-field.ts`:
```ts
import { FdLabel } from "../components/fd-label.js";
import { FdInput } from "../components/fd-input.js";
import { FdMessage } from "../components/fd-message.js";
import { FdField } from "../components/fd-field.js";

if (!customElements.get("fd-label")) {
  customElements.define("fd-label", FdLabel);
}
if (!customElements.get("fd-input")) {
  customElements.define("fd-input", FdInput);
}
if (!customElements.get("fd-message")) {
  customElements.define("fd-message", FdMessage);
}
if (!customElements.get("fd-field")) {
  customElements.define("fd-field", FdField);
}
```

`packages/components/src/register/fd-icon.ts`:
```ts
import { FdIcon } from "../components/fd-icon.js";

if (!customElements.get("fd-icon")) {
  customElements.define("fd-icon", FdIcon);
}
```

`packages/components/src/register/fd-input.ts`:
```ts
import { FdInput } from "../components/fd-input.js";

if (!customElements.get("fd-input")) {
  customElements.define("fd-input", FdInput);
}
```

`packages/components/src/register/fd-label.ts`:
```ts
import { FdLabel } from "../components/fd-label.js";

if (!customElements.get("fd-label")) {
  customElements.define("fd-label", FdLabel);
}
```

`packages/components/src/register/fd-menu.ts`:
```ts
import { FdMenuItem } from "../components/fd-menu-item.js";
import { FdMenu } from "../components/fd-menu.js";

if (!customElements.get("fd-menu-item")) {
  customElements.define("fd-menu-item", FdMenuItem);
}
if (!customElements.get("fd-menu")) {
  customElements.define("fd-menu", FdMenu);
}
```

`packages/components/src/register/fd-radio.ts`:
```ts
import { FdRadio } from "../components/fd-radio.js";

if (!customElements.get("fd-radio")) {
  customElements.define("fd-radio", FdRadio);
}
```

`packages/components/src/register/fd-radio-group.ts`:
```ts
import { FdRadio } from "../components/fd-radio.js";
import { FdRadioGroup } from "../components/fd-radio-group.js";

if (!customElements.get("fd-radio")) {
  customElements.define("fd-radio", FdRadio);
}
if (!customElements.get("fd-radio-group")) {
  customElements.define("fd-radio-group", FdRadioGroup);
}
```

`packages/components/src/register/fd-selector.ts`:
```ts
import { FdOption } from "../components/fd-option.js";
import { FdSelector } from "../components/fd-selector.js";

if (!customElements.get("fd-option")) {
  customElements.define("fd-option", FdOption);
}
if (!customElements.get("fd-selector")) {
  customElements.define("fd-selector", FdSelector);
}
```

`packages/components/src/register/fd-split-button.ts`:
```ts
import { FdButton } from "../components/fd-button.js";
import { FdMenuItem } from "../components/fd-menu-item.js";
import { FdMenu } from "../components/fd-menu.js";
import { FdSplitButton } from "../components/fd-split-button.js";

if (!customElements.get("fd-button")) {
  customElements.define("fd-button", FdButton);
}
if (!customElements.get("fd-menu-item")) {
  customElements.define("fd-menu-item", FdMenuItem);
}
if (!customElements.get("fd-menu")) {
  customElements.define("fd-menu", FdMenu);
}
if (!customElements.get("fd-split-button")) {
  customElements.define("fd-split-button", FdSplitButton);
}
```

**Step 3:** Create `packages/components/src/register/register-all.ts`:

```ts
/**
 * Convenience entry point — registers all public components and icons.
 *
 * Usage:
 * ```ts
 * import "@fdic-ds/components/register-all";
 * ```
 */
import "./fd-button.js";
import "./fd-button-group.js";
import "./fd-checkbox.js";
import "./fd-checkbox-group.js";
import "./fd-field.js";
import "./fd-icon.js";
import "./fd-input.js";
import "./fd-label.js";
import "./fd-menu.js";
import "./fd-radio.js";
import "./fd-radio-group.js";
import "./fd-selector.js";
import "./fd-split-button.js";
import "../icons/phosphor-regular.js";
```

**Step 4:** Commit.

```bash
git add packages/components/src/register/
git commit -m "feat: add explicit registration entry points for all public components

Each first-class component gets a register/*.ts file that calls
customElements.define(). Parent components pull in required children:
- fd-checkbox-group registers fd-checkbox
- fd-field registers fd-label, fd-input, fd-message
- fd-menu registers fd-menu-item
- fd-radio-group registers fd-radio
- fd-selector registers fd-option
- fd-split-button registers fd-button, fd-menu, fd-menu-item

register-all.ts registers everything plus the Phosphor icon set."
```

---

## Task 3: Migrate test files to use registration imports

Tests currently import component source files for their side effects (e.g., `import "./fd-button.js"`). These imports no longer register elements after Task 1. Replace them with registration imports.

**Migration pattern:** Change `import "./fd-button.js"` to `import "../register/fd-button.js"`.

**Files and changes:**

| Test file | Old imports | New imports |
|-----------|------------|------------|
| `fd-button.test.ts` | `./fd-button.js` | `../register/fd-button.js` |
| `fd-button-group.test.ts` | `./fd-button-group.js`, `./fd-button.js` | `../register/fd-button-group.js`, `../register/fd-button.js` |
| `fd-checkbox.test.ts` | `./fd-checkbox.js`, `./fd-icon.js` | `../register/fd-checkbox.js`, `../register/fd-icon.js` |
| `fd-checkbox-group.test.ts` | `./fd-checkbox-group.js`, `./fd-checkbox.js`, `./fd-icon.js` | `../register/fd-checkbox-group.js`, `../register/fd-icon.js` |
| `fd-field.test.ts` | `./fd-field.js`, `./fd-label.js`, `./fd-input.js`, `./fd-message.js` | `../register/fd-field.js` |
| `fd-icon.test.ts` | `./fd-icon.js` (side-effect import) | `../register/fd-icon.js` |
| `fd-input.test.ts` | `./fd-input.js`, `./fd-label.js`, `./fd-message.js` | `../register/fd-input.js`, `../register/fd-label.js`, `../register/fd-message.js` |
| `fd-label.test.ts` | `./fd-label.js` | `../register/fd-label.js` |
| `fd-menu.test.ts` | `./fd-menu.js`, `./fd-menu-item.js` | `../register/fd-menu.js` |
| `fd-menu-item.test.ts` | `./fd-menu-item.js` | `../register/fd-menu.js` (registers fd-menu-item via parent) |
| `fd-message.test.ts` | `./fd-message.js` | `../register/fd-field.js` (registers fd-message via parent) |
| `fd-radio.test.ts` | `./fd-radio.js` | `../register/fd-radio.js` |
| `fd-radio-group.test.ts` | `./fd-radio-group.js`, `./fd-radio.js` | `../register/fd-radio-group.js` |
| `fd-selector.test.ts` | `./fd-option.js`, `./fd-selector.js` | `../register/fd-selector.js` |
| `fd-split-button.test.ts` | `./fd-split-button.js`, `./fd-menu.js`, `./fd-menu-item.js` | `../register/fd-split-button.js` |

Note: For `fd-icon.test.ts`, keep the named import `import { FdIcon } from "./fd-icon.js"` — that's a symbol import for class-level assertions. Only change the bare side-effect imports.

Note: For child-only components (`fd-menu-item`, `fd-message`, `fd-option`), their tests can register via the parent registration entry point, or via a direct `customElements.define()` call in the test file. Using the parent registration is simpler unless the test needs to verify the component in isolation without its parent. Use your judgment — if a test only exercises the child component, a direct define in the test is cleaner than pulling in the parent.

**Step 1:** Update all test files per the table above.

**Step 2:** Run all tests:

```bash
cd packages/components && npm test
```

Expected: All tests pass.

**Step 3:** Commit.

```bash
git add packages/components/src/components/*.test.ts
git commit -m "test: migrate test imports to use registration entry points"
```

---

## Task 4: Migrate Storybook stories to use `register-all`

All Storybook stories currently import `@fdic-ds/components` (the root package) for side effects. Replace with the register-all entry point.

**Files** (all in `apps/storybook/src/`):

- `fd-button.stories.ts`
- `fd-button-group.stories.ts`
- `fd-checkbox.stories.ts`
- `fd-checkbox-group.stories.ts`
- `fd-icon.stories.ts`
- `fd-input.stories.ts`
- `fd-label.stories.ts`
- `fd-menu.stories.ts`
- `fd-radio.stories.ts`
- `fd-radio-group.stories.ts`
- `fd-selector.stories.ts`
- `fd-split-button.stories.ts`
- `placeholder.stories.ts`

**Step 1:** In each file, replace:
```ts
import "@fdic-ds/components";
```
with:
```ts
import "@fdic-ds/components/register-all";
```

Note: `placeholder.stories.ts` will need special handling since `fd-placeholder` is being demoted. For now, keep it importing register-all (which still registers all elements for backward compatibility during migration). The placeholder story can be addressed in a follow-up cleanup.

**Step 2:** Verify Storybook still builds:

```bash
cd apps/storybook && npm run build
```

**Step 3:** Commit.

```bash
git add apps/storybook/src/*.stories.ts
git commit -m "refactor: migrate Storybook stories to register-all entry point"
```

---

## Task 5: Rewrite `src/index.ts` to be side-effect-free

The root `index.ts` currently imports every component file (triggering registration) and every icon set. Rewrite it to only re-export symbols — no side-effect imports.

**File:** `packages/components/src/index.ts`

**Step 1:** Rewrite to:

```ts
// --- Component classes ---
export { FdButton } from "./components/fd-button.js";
export { FdButtonGroup } from "./components/fd-button-group.js";
export { FdCheckbox } from "./components/fd-checkbox.js";
export { FdCheckboxGroup } from "./components/fd-checkbox-group.js";
export { FdField } from "./components/fd-field.js";
export { FdIcon } from "./components/fd-icon.js";
export { FdInput } from "./components/fd-input.js";
export { FdLabel } from "./components/fd-label.js";
export { FdMenu } from "./components/fd-menu.js";
export { FdMenuItem } from "./components/fd-menu-item.js";
export { FdMessage } from "./components/fd-message.js";
export { FdOption } from "./components/fd-option.js";
export { FdRadio } from "./components/fd-radio.js";
export { FdRadioGroup } from "./components/fd-radio-group.js";
export { FdSelector } from "./components/fd-selector.js";
export { FdSplitButton } from "./components/fd-split-button.js";

// --- Public types ---
export type { ButtonVariant } from "./components/fd-button.js";
export type {
  ButtonGroupAlign,
  ButtonGroupDirection,
} from "./components/fd-button-group.js";
export type { CheckboxGroupOrientation } from "./components/fd-checkbox-group.js";
export type { InputType } from "./components/fd-input.js";
export type { MenuItemVariant } from "./components/fd-menu-item.js";
export type { MessageState, LiveMode } from "./components/fd-message.js";
export type { Placement } from "./components/placement.js";
export type { RadioGroupOrientation } from "./components/fd-radio-group.js";
export type { SelectorVariant } from "./components/fd-selector.js";

// --- Icon registry ---
export { iconRegistry } from "./icons/registry.js";
```

Key changes:
- Removed all bare `import "./components/fd-*.js"` side-effect imports
- Removed `import "./icons/phosphor-regular.js"` (icon pack registration is now via `register-all` or explicit `icons/phosphor-regular` import)
- Removed `FdPlaceholder` export (demoted from public inventory)
- Kept all class and type re-exports

**Step 2:** Run the build:

```bash
cd packages/components && npm run build
```

**Step 3:** Run tests:

```bash
cd packages/components && npm test
```

Expected: All pass.

**Step 4:** Commit.

```bash
git add packages/components/src/index.ts
git commit -m "feat: make root package entry point side-effect-free

Importing @fdic-ds/components now exports classes and types without
calling customElements.define() or registering icons. Consumers who
want registration should use @fdic-ds/components/register-all or
individual register/* entry points.

FdPlaceholder removed from public exports (demoted)."
```

---

## Task 6: Update `package.json` exports and tsup build config

Add subpath exports for all public components, registration entry points, and the icon set. Update the tsup build to produce the required output files.

**File:** `packages/components/package.json`

**Step 1:** Replace the `"scripts"` and `"exports"` sections:

```json
{
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./register-all": {
      "types": "./dist/register/register-all.d.ts",
      "import": "./dist/register/register-all.js"
    },
    "./register/*": {
      "types": "./dist/register/*.d.ts",
      "import": "./dist/register/*.js"
    },
    "./fd-button": {
      "types": "./dist/components/fd-button.d.ts",
      "import": "./dist/components/fd-button.js"
    },
    "./fd-button-group": {
      "types": "./dist/components/fd-button-group.d.ts",
      "import": "./dist/components/fd-button-group.js"
    },
    "./fd-checkbox": {
      "types": "./dist/components/fd-checkbox.d.ts",
      "import": "./dist/components/fd-checkbox.js"
    },
    "./fd-checkbox-group": {
      "types": "./dist/components/fd-checkbox-group.d.ts",
      "import": "./dist/components/fd-checkbox-group.js"
    },
    "./fd-field": {
      "types": "./dist/components/fd-field.d.ts",
      "import": "./dist/components/fd-field.js"
    },
    "./fd-icon": {
      "types": "./dist/components/fd-icon.d.ts",
      "import": "./dist/components/fd-icon.js"
    },
    "./fd-input": {
      "types": "./dist/components/fd-input.d.ts",
      "import": "./dist/components/fd-input.js"
    },
    "./fd-label": {
      "types": "./dist/components/fd-label.d.ts",
      "import": "./dist/components/fd-label.js"
    },
    "./fd-menu": {
      "types": "./dist/components/fd-menu.d.ts",
      "import": "./dist/components/fd-menu.js"
    },
    "./fd-menu-item": {
      "types": "./dist/components/fd-menu-item.d.ts",
      "import": "./dist/components/fd-menu-item.js"
    },
    "./fd-message": {
      "types": "./dist/components/fd-message.d.ts",
      "import": "./dist/components/fd-message.js"
    },
    "./fd-option": {
      "types": "./dist/components/fd-option.d.ts",
      "import": "./dist/components/fd-option.js"
    },
    "./fd-radio": {
      "types": "./dist/components/fd-radio.d.ts",
      "import": "./dist/components/fd-radio.js"
    },
    "./fd-radio-group": {
      "types": "./dist/components/fd-radio-group.d.ts",
      "import": "./dist/components/fd-radio-group.js"
    },
    "./fd-selector": {
      "types": "./dist/components/fd-selector.d.ts",
      "import": "./dist/components/fd-selector.js"
    },
    "./fd-split-button": {
      "types": "./dist/components/fd-split-button.d.ts",
      "import": "./dist/components/fd-split-button.js"
    },
    "./icons/phosphor-regular": {
      "types": "./dist/icons/phosphor-regular.d.ts",
      "import": "./dist/icons/phosphor-regular.js"
    }
  }
}
```

**Step 2:** Create `packages/components/tsup.config.ts` (the build command currently uses inline CLI args — a config file is needed for multi-entry builds):

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    // Root entry (side-effect-free)
    index: "src/index.ts",

    // Per-component symbol exports
    "components/fd-button": "src/components/fd-button.ts",
    "components/fd-button-group": "src/components/fd-button-group.ts",
    "components/fd-checkbox": "src/components/fd-checkbox.ts",
    "components/fd-checkbox-group": "src/components/fd-checkbox-group.ts",
    "components/fd-field": "src/components/fd-field.ts",
    "components/fd-icon": "src/components/fd-icon.ts",
    "components/fd-input": "src/components/fd-input.ts",
    "components/fd-label": "src/components/fd-label.ts",
    "components/fd-menu": "src/components/fd-menu.ts",
    "components/fd-menu-item": "src/components/fd-menu-item.ts",
    "components/fd-message": "src/components/fd-message.ts",
    "components/fd-option": "src/components/fd-option.ts",
    "components/fd-radio": "src/components/fd-radio.ts",
    "components/fd-radio-group": "src/components/fd-radio-group.ts",
    "components/fd-selector": "src/components/fd-selector.ts",
    "components/fd-split-button": "src/components/fd-split-button.ts",

    // Registration entry points
    "register/register-all": "src/register/register-all.ts",
    "register/fd-button": "src/register/fd-button.ts",
    "register/fd-button-group": "src/register/fd-button-group.ts",
    "register/fd-checkbox": "src/register/fd-checkbox.ts",
    "register/fd-checkbox-group": "src/register/fd-checkbox-group.ts",
    "register/fd-field": "src/register/fd-field.ts",
    "register/fd-icon": "src/register/fd-icon.ts",
    "register/fd-input": "src/register/fd-input.ts",
    "register/fd-label": "src/register/fd-label.ts",
    "register/fd-menu": "src/register/fd-menu.ts",
    "register/fd-radio": "src/register/fd-radio.ts",
    "register/fd-radio-group": "src/register/fd-radio-group.ts",
    "register/fd-selector": "src/register/fd-selector.ts",
    "register/fd-split-button": "src/register/fd-split-button.ts",

    // Icon packs
    "icons/phosphor-regular": "src/icons/phosphor-regular.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
});
```

Key config choices:
- `splitting: true` — tsup will deduplicate shared code (e.g., Lit base classes) across entry points instead of duplicating it into each chunk.
- All entries are explicit — no glob patterns, so the build is predictable.

**Step 3:** Run the build and verify output:

```bash
cd packages/components && npm run build
```

Expected: `dist/` contains `index.js`, `components/*.js`, `register/*.js`, `icons/phosphor-regular.js`, and corresponding `.d.ts` files.

**Step 4:** Verify the root entry is actually side-effect-free — it should not contain any `customElements.define` calls:

```bash
grep -c "customElements" packages/components/dist/index.js
```

Expected: 0 matches.

**Step 5:** Verify a registration entry point does contain the define call:

```bash
grep "customElements" packages/components/dist/register/fd-button.js
```

Expected: Contains `customElements.define`.

**Step 6:** Run tests again to make sure the new build doesn't break anything:

```bash
cd packages/components && npm test
```

**Step 7:** Commit.

```bash
git add packages/components/package.json packages/components/tsup.config.ts
git commit -m "feat: add subpath exports and multi-entry tsup build

Every first-class component gets a symbol subpath and a registration
subpath. Child-only primitives get symbol subpaths only. register-all
is the convenience import for full library registration.

Subpath exports:
- ./fd-button, ./fd-input, etc. (side-effect-free symbol access)
- ./register/fd-button, ./register/fd-input, etc. (element registration)
- ./register-all (register everything + icons)
- ./icons/phosphor-regular (icon pack registration)"
```

---

## Task 7: Add `HTMLElementTagNameMap` augmentation

Add global type augmentation so `document.querySelector("fd-button")` returns the correct type in TypeScript projects.

**Step 1:** Create `packages/components/src/global.d.ts`:

```ts
import type { FdButton } from "./components/fd-button.js";
import type { FdButtonGroup } from "./components/fd-button-group.js";
import type { FdCheckbox } from "./components/fd-checkbox.js";
import type { FdCheckboxGroup } from "./components/fd-checkbox-group.js";
import type { FdField } from "./components/fd-field.js";
import type { FdIcon } from "./components/fd-icon.js";
import type { FdInput } from "./components/fd-input.js";
import type { FdLabel } from "./components/fd-label.js";
import type { FdMenu } from "./components/fd-menu.js";
import type { FdMenuItem } from "./components/fd-menu-item.js";
import type { FdMessage } from "./components/fd-message.js";
import type { FdOption } from "./components/fd-option.js";
import type { FdRadio } from "./components/fd-radio.js";
import type { FdRadioGroup } from "./components/fd-radio-group.js";
import type { FdSelector } from "./components/fd-selector.js";
import type { FdSplitButton } from "./components/fd-split-button.js";

declare global {
  interface HTMLElementTagNameMap {
    "fd-button": FdButton;
    "fd-button-group": FdButtonGroup;
    "fd-checkbox": FdCheckbox;
    "fd-checkbox-group": FdCheckboxGroup;
    "fd-field": FdField;
    "fd-icon": FdIcon;
    "fd-input": FdInput;
    "fd-label": FdLabel;
    "fd-menu": FdMenu;
    "fd-menu-item": FdMenuItem;
    "fd-message": FdMessage;
    "fd-option": FdOption;
    "fd-radio": FdRadio;
    "fd-radio-group": FdRadioGroup;
    "fd-selector": FdSelector;
    "fd-split-button": FdSplitButton;
  }
}
```

**Step 2:** Re-export the global types from `src/index.ts` by adding at the top:

```ts
import "./global.js";
```

**Step 3:** Build and verify the `.d.ts` output includes the augmentation:

```bash
cd packages/components && npm run build
grep "HTMLElementTagNameMap" dist/global.d.ts
```

**Step 4:** Commit.

```bash
git add packages/components/src/global.d.ts packages/components/src/index.ts
git commit -m "feat: add HTMLElementTagNameMap augmentation for all public components"
```

---

## Task 8: Demote `fd-placeholder`

Remove `fd-placeholder` from the public surface. It stays in the source tree as an internal/dev component but is not exported or registered by any public entry point.

**Step 1:** Verify `fd-placeholder` is already absent from `src/index.ts` (done in Task 5). If not, remove it.

**Step 2:** Verify no registration entry point imports it.

**Step 3:** Verify `fd-placeholder` is not in `global.d.ts`.

**Step 4:** Add a comment to the top of `packages/components/src/components/fd-placeholder.ts`:

```ts
/**
 * Internal development placeholder — NOT part of the public package surface.
 * This component is not exported from the root package or any subpath.
 * Do not depend on it in consumer code.
 */
```

**Step 5:** Commit.

```bash
git add packages/components/src/components/fd-placeholder.ts
git commit -m "chore: demote fd-placeholder to internal-only component"
```

---

## Task 9: Full integration verification

**Step 1:** Clean build from scratch:

```bash
cd packages/components && rm -rf dist && npm run build
```

**Step 2:** Run all component tests:

```bash
cd packages/components && npm test
```

**Step 3:** Build Storybook:

```bash
cd apps/storybook && npm run build
```

**Step 4:** Verify the `dist/` directory structure matches expectations:

```bash
ls packages/components/dist/index.js
ls packages/components/dist/components/fd-button.js
ls packages/components/dist/register/fd-button.js
ls packages/components/dist/register/register-all.js
ls packages/components/dist/icons/phosphor-regular.js
ls packages/components/dist/global.d.ts
```

**Step 5:** Verify root entry is side-effect-free:

```bash
grep "customElements" packages/components/dist/index.js | wc -l
```

Expected: 0.

**Step 6:** If all checks pass, commit any remaining changes and the work is ready for PR.
