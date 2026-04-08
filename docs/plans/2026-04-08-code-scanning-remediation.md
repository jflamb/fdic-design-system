# Code Scanning Remediation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve all 5 open GitHub code scanning alerts on `jflamb/fdic-design-system`.

**Architecture:** Two independent fixes — (1) replace the regex-based SVG sanitizer fallback with a loop-until-clean approach using DOMParser where available and iterative regex otherwise, and (2) add explicit `permissions` to the GHES CI workflow.

**Tech Stack:** TypeScript, Vitest, GitHub Actions YAML

---

## Alert Summary

| # | Rule | Severity | File | Issue |
|---|------|----------|------|-------|
| 26 | `js/bad-tag-filter` | warning | `registry.ts:25` | Regex doesn't match `</script >` (space before `>`) |
| 27 | `js/incomplete-multi-character-sanitization` | warning | `registry.ts:24-26` | Single-pass replace can leave residual `on*` attributes |
| 28 | `js/incomplete-multi-character-sanitization` | warning | `registry.ts:24-25` | Single-pass replace can leave residual `<script` after nested removal |
| 29 | `js/polynomial-redos` | warning | `registry.ts:24-25` | `<script[\s>][\s\S]*?<\/script>` is vulnerable to catastrophic backtracking |
| 31 | `actions/missing-workflow-permissions` | warning | `ghes-component-integrity.yml:11` | No `permissions` key in workflow |

## Task 1: Fix regex sanitizer (alerts #26-29)

All four JS alerts stem from the regex fallback branch in `sanitize()` (lines 24-26 of `registry.ts`). The problems:

1. **ReDoS (#29):** `<script[\s>][\s\S]*?<\/script>` backtracks polynomially on crafted input.
2. **Incomplete sanitization (#27, #28):** A single `.replace()` pass can leave behind dangerous content when removals create new matches (e.g. `<scr<script>ipt>`).
3. **Bad tag filter (#26):** The regex doesn't account for whitespace before `>` in closing tags (`</script >`).

**Fix approach:** Replace both regexes with simpler, non-backtracking patterns applied in a loop until no further matches are found. This eliminates all four issues at once.

**Files:**
- Modify: `packages/components/src/icons/registry.ts` (lines 22-27)
- Modify: `packages/components/src/icons/registry.test.ts` (add test cases)

### Step 1: Add failing tests for the edge cases CodeQL flagged

Add these test cases to `packages/components/src/icons/registry.test.ts`, inside the existing `describe("iconRegistry", ...)` block, after the existing sanitization tests:

```typescript
it("strips <script> tags with whitespace in closing tag", () => {
  const dirty = '<svg><script>alert("xss")</script ><path d="M0 0"/></svg>';
  iconRegistry.register("ws-close", dirty);
  const result = iconRegistry.get("ws-close")!;
  expect(result).not.toContain("<script");
  expect(result).not.toContain("</script");
  expect(result).toContain('<path d="M0 0"/>');
});

it("strips nested/recursive script injections", () => {
  const dirty =
    '<svg><scr<script>alert(1)</script>ipt>alert(2)</script><path d="M0 0"/></svg>';
  iconRegistry.register("nested", dirty);
  const result = iconRegistry.get("nested")!;
  expect(result).not.toContain("<script");
  expect(result).not.toContain("</script");
  expect(result).toContain('<path d="M0 0"/>');
});

it("strips nested on* handler injections", () => {
  const dirty =
    '<svg on onload="x"load="alert(1)"><path d="M0 0"/></svg>';
  iconRegistry.register("nested-on", dirty);
  const result = iconRegistry.get("nested-on")!;
  expect(result).not.toMatch(/\bon\w+\s*=/i);
  expect(result).toContain('<path d="M0 0"/>');
});
```

### Step 2: Run tests to confirm the new cases fail

Run: `cd packages/components && npx vitest run src/icons/registry.test.ts`

Expected: The 3 new tests FAIL (the current single-pass regex doesn't handle these cases).

### Step 3: Rewrite the regex fallback in `sanitize()`

Replace lines 23-26 of `registry.ts` (the `if (typeof DOMParser === "undefined")` branch) with:

```typescript
if (typeof DOMParser === "undefined") {
  let clean = svg;
  let prev: string;
  do {
    prev = clean;
    clean = clean
      .replace(/<script\b[^]*?<\/script\s*>/gi, "")
      .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  } while (clean !== prev);
  return clean;
}
```

Key changes:
- `<script\b[^]*?<\/script\s*>` — uses `[^]*?` (non-backtracking on `\s`) and `\s*>` to handle whitespace before `>`. The `\b` word boundary prevents partial matches.
- Loop runs until stable — handles recursive/nested payloads.
- The `on*` attribute regex is unchanged but now runs in the loop for completeness.

### Step 4: Run tests to verify all pass

Run: `cd packages/components && npx vitest run src/icons/registry.test.ts`

Expected: All 10 tests PASS (7 existing + 3 new).

### Step 5: Commit

```bash
git add packages/components/src/icons/registry.ts packages/components/src/icons/registry.test.ts
git commit -m "fix(icons): harden SVG sanitizer regex fallback

Replace single-pass regex with loop-until-stable approach and fix
closing-tag whitespace handling. Resolves CodeQL alerts #26-29:
js/bad-tag-filter, js/incomplete-multi-character-sanitization,
js/polynomial-redos."
```

---

## Task 2: Add workflow permissions (alert #31)

**File:**
- Modify: `.github/workflows/ghes-component-integrity.yml`

### Step 1: Add `permissions` block to the workflow

Add a top-level `permissions` key after line 7 (after the `on:` block, before `jobs:`). This workflow only checks out code and runs tests — it needs only `contents: read`:

```yaml
permissions:
  contents: read
```

The full file top should read:

```yaml
name: "Component Integrity (GHES)"

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  validate:
    ...
```

### Step 2: Validate YAML syntax

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ghes-component-integrity.yml'))"`

Expected: No output (valid YAML).

### Step 3: Commit

```bash
git add .github/workflows/ghes-component-integrity.yml
git commit -m "fix(ci): add explicit permissions to GHES workflow

Set contents:read as the minimum required permission scope.
Resolves CodeQL alert #31: actions/missing-workflow-permissions."
```

---

## Verification

After both tasks are committed and pushed, confirm alerts close:

1. Push branch and open PR (or push to `main`)
2. Wait for CodeQL analysis to complete
3. Check https://github.com/jflamb/fdic-design-system/security/code-scanning — all 5 alerts should be resolved
