# Responsive Page-Shell And Section-Alignment Contract Proposal

> **Date:** 2026-04-13
> **Status:** Proposed
> **Scope:** Shared layout foundations, shell components, and top-level page
> section alignment

## Summary

The design system currently exposes the right building blocks to compose page
shells and top-level sections, but the responsive contract is still implicit and
partially duplicated. That has allowed `fd-page-header`, `fd-page-feedback`,
composition sections, and theme-level layout wrappers to drift from one another
across breakpoint ranges, especially in the 641–1049px range.

This proposal formalizes a single responsive page-shell and section-alignment
contract in the design system so shell components, top-level sections, and
downstream CMS integrations align by default.

The proposal is intentionally narrow:

- define canonical shell-width and gutter behavior
- define canonical responsive ranges for section alignment
- specify which components and patterns consume the contract directly
- reduce theme-side breakpoint math to adoption, not reinterpretation

It does **not** propose a new page-shell component or a generic application
frame abstraction.

## Problem

Recent FDICnet parity work exposed the same class of issue multiple times:

- page-header content aligned differently from section content at tablet widths
- page-feedback used a different width constraint than the rest of the page
- composition sections and shell-adjacent components collapsed at different
  ranges
- Drupal theme fixes repeatedly had to compensate for missing or inconsistent
  responsive layout rules in the design system

The root cause is not that the system lacks layout tokens. The root cause is
that the **responsive page-shell and section-alignment contract is not
expressed as one explicit, documented, reusable foundation**.

Today:

- some components consume `--fdic-layout-shell-max-width`
- some use `--fdic-layout-max-width`
- some switch to tablet/mobile gutters at different breakpoints
- some composition patterns infer responsive behavior from local media queries
  rather than a documented shell range contract

That makes parity work brittle and causes regressions whenever a component or
theme makes a slightly different assumption about width, gutter, or collapse
behavior.

## Goals

1. **One explicit section-alignment contract**
   - The design system should define when top-level sections use desktop,
     tablet, and mobile gutters and width constraints.

2. **One explicit breakpoint contract**
   - Top-level sections and shell components should respond to the same width
     ranges unless a documented exception exists.

3. **Clear ownership**
   - The design system owns page-level alignment behavior.
   - Downstream themes consume the contract and may set tokens, but should not
     restate the breakpoint math.

4. **Small public API**
   - Prefer a minimal set of stable `--fdic-layout-*` tokens and documented
     usage rules over a large family of speculative shell variables.

5. **Migration without breakage**
   - Existing components should move toward the shared contract additively.

## Non-goals

- introducing a new `fd-page-shell` Web Component
- freezing every possible layout scenario as a first-class API
- replacing composition patterns with component-only layout
- changing section-level content layouts that are not top-level page sections

## Proposed Contract

### 1. Canonical section-alignment tokens

The following tokens become the explicit public page-shell and top-level section
foundation:

- `--fdic-layout-shell-max-width`
- `--fdic-layout-gutter`
- `--fdic-layout-gutter-tablet`
- `--fdic-layout-gutter-mobile`

These already exist in practice and should be treated as the canonical
page-alignment tokens.

### 2. Canonical section-alignment breakpoint ranges

The design system should document and consistently apply three alignment ranges:

- **Desktop shell**
  - `>= 64rem` (`>= 1024px`)
  - Uses `--fdic-layout-gutter`

- **Tablet shell**
  - `40rem` to `63.999rem` (`640px–1023.999px`)
  - Uses `--fdic-layout-gutter-tablet`

- **Mobile shell**
  - `< 40rem` (`< 640px`)
  - Uses `--fdic-layout-gutter-mobile`

These ranges match how the broader page currently behaves and close the gap that
caused the mid-range page-header drift.

### 3. Canonical section-alignment rule

By default, top-level page sections should follow this behavior:

- full-bleed section background is allowed
- internal content row aligns to `--fdic-layout-shell-max-width`
- internal row uses the active shell gutter for the current range
- components and patterns that participate in page-level section alignment must
  not hard-code competing breakpoint logic

This means the contract is broader than header/footer chrome. It applies to
most first-class sections on a page, including editorial, utility, event, and
supporting sections, unless an exception is documented.

### 4. Participation

The following components or patterns should explicitly consume the contract:

- `fd-page-header`
- `fd-page-feedback`
- `fd-global-footer`
- shell-level header reference patterns and CMS shell examples
- documented full-bleed composition sections that claim page-level alignment
- top-level page sections such as feature/news bands, featured-link or
  tile-list bands, utility-link column groups, event rails, and dual-panel
  spotlight/social sections

In practice, most top-level page sections should align to the shared shell
constraint unless they intentionally opt into a documented wider or readable
content width.

Components or patterns that are **not** top-level page sections should keep
using their own local layout contracts.

## API Shape

This proposal recommends **no new top-level component**. Instead:

### A. Keep the public token surface small

Retain the current shell token names and avoid introducing parallel aliases such
as `--fdic-shell-*` unless the existing names are insufficient.

### B. Add one reusable shell utility recipe

Document a canonical shell-aligned content recipe for:

- published docs examples
- composition patterns
- shell-adjacent components
- top-level page sections

Example shape:

```css
.fdic-shell-content {
  inline-size: min(100%, var(--fdic-layout-shell-max-width, 82rem));
  margin-inline: auto;
  padding-inline: var(--fdic-layout-gutter, 4rem);
}

@media (max-width: 63.999rem) {
  .fdic-shell-content {
    padding-inline: var(--fdic-layout-gutter-tablet, 2rem);
  }
}

@media (max-width: 39.999rem) {
  .fdic-shell-content {
    padding-inline: var(--fdic-layout-gutter-mobile, 1rem);
  }
}
```

This does **not** have to be published as a utility class in v1. The important
part is that this recipe becomes the documented shared implementation model
behind shell-aligned components and top-level sections.

### C. Clarify width-token responsibilities

- `--fdic-layout-shell-max-width`
  - page shell, page header, page feedback, global footer, and top-level
    section content rows

- `--fdic-layout-max-width`
  - broader composition surfaces that intentionally exceed the shell width
  - should not be used by top-level section wrappers unless the pattern
    explicitly documents that wider behavior

- `--fdic-layout-content-max-width`
  - readable content and prose-like surfaces
  - should not be used as a substitute for shell width

## Proposed Documentation Changes

### 1. Add a dedicated foundations page

Create a public foundations page such as:

- `apps/docs/guide/foundations/page-shell.md`

This page should become the canonical reference for:

- shell-width tokens
- shell breakpoints
- full-bleed vs constrained section content
- component and section participation rules
- downstream CMS adoption guidance

### 2. Update existing docs to defer to the shell page

The following docs should link back to the new shell contract instead of
redefining shell behavior locally:

- `components/page-header.md`
- `components/page-feedback.md`
- `components/global-footer.md`
- `guide/navigation-shell-reference.md`
- `guide/foundations/spacing-layout.md`

### 3. Document exceptions explicitly

If a shell component or top-level section pattern intentionally diverges from
the canonical alignment contract, that divergence should be documented in the
component or pattern page as an exception, not left implicit in the CSS.

## Proposed Implementation Plan

### Phase 1: Formalize the contract in docs

- publish the page-shell foundations page
- define canonical shell ranges and width-token responsibilities
- update shell-adjacent component docs and section-pattern docs to reference the
  shared contract

### Phase 2: Audit shell-adjacent components and section patterns

Audit:

- `fd-page-header`
- `fd-page-feedback`
- `fd-global-footer`
- documented top-level composition patterns

For each:

- confirm it consumes `--fdic-layout-shell-max-width`
- confirm it switches gutters at the canonical tablet/mobile ranges
- remove local breakpoint logic that duplicates or conflicts with the shell
  contract

### Phase 3: Audit published shell/composition examples

Audit:

- navigation shell reference
- CMS integration guide
- composition patterns that claim top-level section alignment

Ensure examples align to the same width/gutter rules.

### Phase 4: Reduce downstream theme overrides

Once the DS shell contract is stable:

- remove theme overrides that restate shell breakpoint math
- keep only page-specific branding/layout choices in downstream repos

## Acceptance Criteria

The contract is successful when:

1. `fd-page-header`, `fd-page-feedback`, `fd-global-footer`, and documented
   top-level section patterns align to the same shell width and gutters by
   default.
2. The 640px–1024px range no longer produces narrower or wider shell alignment
   in one component than another.
3. CMS example pages can adopt aligned top-level sections without redefining the
   shell breakpoint logic in theme CSS.
4. Public docs clearly state when to use shell width vs broader composition
   width vs readable-content width.
5. New shell-adjacent components and top-level section patterns can be reviewed
   against one explicit contract instead of inferred behavior.

## Risks

### 1. Over-freezing layout behavior

If the contract tries to standardize too many layout cases, it becomes rigid and
hard to evolve. Keep the contract focused on **top-level page-section
alignment**, not all page composition.

### 2. Confusing width tokens

If `shell`, `max`, and `content` widths are not clearly documented, downstream
teams will keep picking the wrong one. The docs must assign crisp
responsibilities to each token family.

### 3. Theme drift during migration

Until all shell-adjacent components and top-level section patterns consume the
same responsive contract, downstream repos may still carry compensating
overrides. Those should be treated as temporary migration debt and removed once
the shared contract is in place.

## Recommendation

Adopt this proposal and implement it as a **foundations-first documentation and
alignment pass**, not a new component initiative.

The page-shell and section-alignment contract should be small, explicit, and
reusable:

- one section-alignment max-width contract
- one set of shell/section gutters
- one set of shell/section breakpoint ranges
- clear token responsibilities
- clear rules for top-level page sections and shell components

That is enough to stop the recurring responsive misalignment bugs without
turning the design system into a page-builder framework.
