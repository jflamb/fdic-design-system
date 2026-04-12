# Prose Integration & Live Component Examples

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate the prose-standalone.css into the VitePress docs site so that (a) content areas render with the design system's typography, and (b) every component documentation page leads with a live rendered example.

**Architecture:** Copy the prose CSS into the docs theme (sections 0, 1, 3–6 only — skip section 2's base reset to avoid conflicts with VitePress chrome). Scope the `.prose` class to the VitePress content area via `.vp-doc`. Each component page gets a live example block at the top — raw HTML inside the markdown that VitePress renders directly — wrapped in a `<div class="prose">` container so the prose styles apply.

**Tech Stack:** VitePress, vanilla CSS, markdown with inline HTML

---

## Context for the Implementer

### File locations

| What | Path |
|------|------|
| Prose CSS (source of truth) | `/Users/jlamb/Projects/fdicnet-prose/prose-standalone.css` |
| VitePress theme dir | `apps/docs/.vitepress/theme/` |
| Theme entry | `apps/docs/.vitepress/theme/index.ts` |
| Existing tokens | `apps/docs/.vitepress/theme/tokens.css` |
| Existing custom styles | `apps/docs/.vitepress/theme/custom.css` |
| Component doc pages | `apps/docs/components/*.md` |

### Prose CSS section map (in prose-standalone.css)

| Section | Lines | Include? | Notes |
|---------|-------|----------|-------|
| 0. Font Loading | 14–20 | Yes | Google Fonts `@import` for Source Sans 3 |
| 1. Design Tokens | 22–117 | Yes | `--fdic-*` custom properties in `:root` |
| 2. Base Reset | 119–253 | **No** | `body`, `h1`–`h6`, `a` styles — conflicts with VitePress |
| 3. Prose Component | 255–1467 | Yes | All `.prose`-scoped rules (the bulk) |
| 4. Responsive Scaling | 1469–1492 | Yes | `@media (max-width: 640px)` heading overrides |
| 5. Print Styles | 1494–1657 | Yes | `@media print` rules |
| 6. Forced-Colors | 1659–1718 | Yes | `@media (forced-colors: active)` rules |

### How VitePress renders content

VitePress wraps rendered markdown in `<div class="vp-doc">`. Raw HTML in markdown files is rendered directly by Vue — no escaping. This means we can write `<div class="prose-callout">...</div>` in a markdown file and it will render as live HTML.

### Key constraint

The prose CSS uses `--fdic-*` tokens. The existing `tokens.css` uses `--fdic-color-*` tokens. These are parallel systems — both define the same colors under different names. The prose CSS includes its own token definitions with hardcoded fallbacks, so it is self-contained and does not need the `--fdic-*` tokens to function.

---

## Task 1: Copy prose styles into VitePress theme

**Files:**
- Create: `apps/docs/.vitepress/theme/prose.css`
- Modify: `apps/docs/.vitepress/theme/index.ts`

**Step 1: Extract sections 0, 1, 3, 4, 5, 6 from prose-standalone.css into a new file**

Copy `/Users/jlamb/Projects/fdicnet-prose/prose-standalone.css` sections 0 (lines 14–20), 1 (lines 22–117), 3 (lines 255–1467), 4 (lines 1469–1492), 5 (lines 1494–1657), and 6 (lines 1659–1718) into `apps/docs/.vitepress/theme/prose.css`.

Skip section 2 entirely (lines 119–253: base reset, body, headings, links) — these conflict with VitePress's own styling.

Add a comment at the top:

```css
/*
 * FDIC Prose Component Styles
 *
 * Extracted from prose-standalone.css (sections 0, 1, 3–6).
 * Section 2 (base reset) is intentionally omitted to avoid
 * conflicts with VitePress theme styles.
 *
 * Source: /Users/jlamb/Projects/fdicnet-prose/prose-standalone.css
 */
```

In section 3, the `.prose` container rule sets `max-width: 65ch`. Remove that line — we don't want the prose container to constrain width inside VitePress's layout, which manages its own content width.

**Step 2: Import prose.css in the theme entry**

In `apps/docs/.vitepress/theme/index.ts`, add the import after `tokens.css` and before `custom.css`:

```typescript
import DefaultTheme from "vitepress/theme";
import "@fdic-ds/components";
import "./tokens.css";
import "./prose.css";
import "./custom.css";
```

Ordering matters: tokens first (primitives), then prose (typography), then custom (doc-specific overrides that may need to override prose).

**Step 3: Verify the dev server starts without errors**

Run: `cd apps/docs && npx vitepress dev`

Expected: Dev server starts. No CSS parse errors in the console. Existing pages render with VitePress chrome intact. Source Sans 3 loads (check network tab or inspect body font-family).

**Step 4: Commit**

```
feat: integrate prose component styles into VitePress theme

Import sections 0, 1, 3–6 from prose-standalone.css, omitting
the base reset (section 2) to preserve VitePress chrome styling.
```

---

## Task 2: Add `.prose` wrapper to component page live examples

### Approach

Each component page gets a live example section inserted **immediately after the intro paragraph** (the `<div class="fdic-foundation-intro">` block). The live example is raw HTML wrapped in `<div class="prose">` so the prose styles apply.

The pattern for each page:

```markdown
## Live example

<div class="prose">
  <!-- actual component HTML here -->
</div>
```

The heading "Live example" keeps the page scannable. The `<div class="prose">` scopes the styles. The HTML inside is identical to what appears in the code blocks further down the page — readers see the rendered result first, then the code that produces it.

### Task 2a: Callouts (callouts.md)

**File:** `apps/docs/components/callouts.md`

Insert after the `</div>` closing the `fdic-foundation-intro` block (line 8) and before `## Variants` (line 10):

```html
## Live example

<div class="prose">
  <div class="prose-callout" role="note" aria-label="Note">
    <span class="prose-callout-icon" aria-hidden="true"></span>
    <div class="prose-callout-content">
      <p>Deposit insurance coverage is determined by the ownership category of the depositor's accounts, not by the number of accounts held.</p>
    </div>
  </div>

  <div class="prose-callout prose-callout-info" role="note" aria-label="Information">
    <span class="prose-callout-icon" aria-hidden="true"></span>
    <div class="prose-callout-content">
      <p>The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.</p>
    </div>
  </div>

  <div class="prose-callout prose-callout-warning" role="note" aria-label="Warning">
    <span class="prose-callout-icon" aria-hidden="true"></span>
    <div class="prose-callout-content">
      <p>If your combined deposits at a single institution exceed $250,000, amounts above the limit may not be insured. Review your account ownership categories before the reporting deadline.</p>
    </div>
  </div>

  <div class="prose-callout prose-callout-success" role="note" aria-label="Success">
    <span class="prose-callout-icon" aria-hidden="true"></span>
    <div class="prose-callout-content">
      <p>Your Call Report has been submitted and accepted. A confirmation number has been sent to the contact email on file.</p>
    </div>
  </div>

  <div class="prose-callout prose-callout-danger" role="status" aria-label="Danger">
    <span class="prose-callout-icon" aria-hidden="true"></span>
    <div class="prose-callout-content">
      <p>This action will permanently close the account and cannot be reversed. All associated records will be archived according to retention policy.</p>
    </div>
  </div>
</div>
```

**Commit:** `docs: add live callout examples to component page`

### Task 2b: Tables (tables.md)

**File:** `apps/docs/components/tables.md`

Insert after the `fdic-foundation-intro` block (line 8) and before `## HTML pattern` (line 10):

```html
## Live example

<div class="prose">
  <div class="prose-table-wrapper" role="region" aria-label="Quarterly deposit summary by account type" tabindex="0">
    <table>
      <caption>FDIC-insured deposit balances, Q4 2025</caption>
      <thead>
        <tr>
          <th>Account type</th>
          <th>Interest rate</th>
          <th>Total deposits</th>
          <th>Change from Q3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Checking</td>
          <td class="prose-td-numeric">0.07%</td>
          <td class="prose-td-numeric">$5,842,300,000</td>
          <td class="prose-td-numeric">+2.1%</td>
        </tr>
        <tr>
          <td>Savings</td>
          <td class="prose-td-numeric">0.46%</td>
          <td class="prose-td-numeric">$3,217,600,000</td>
          <td class="prose-td-numeric">+1.8%</td>
        </tr>
        <tr>
          <td>Money market</td>
          <td class="prose-td-numeric">4.25%</td>
          <td class="prose-td-numeric">$1,985,400,000</td>
          <td class="prose-td-numeric">+5.3%</td>
        </tr>
        <tr>
          <td>Certificates of deposit</td>
          <td class="prose-td-numeric">4.80%</td>
          <td class="prose-td-numeric">$2,641,900,000</td>
          <td class="prose-td-numeric">+8.7%</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td><strong>Total</strong></td>
          <td></td>
          <td class="prose-td-numeric"><strong>$13,687,200,000</strong></td>
          <td class="prose-td-numeric"><strong>+3.9%</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
```

**Commit:** `docs: add live table example to component page`

### Task 2c: Details / Accordion (details.md)

**File:** `apps/docs/components/details.md`

Insert after the `fdic-foundation-intro` block (line 8) and before `## HTML pattern` (line 10):

```html
## Live example

<div class="prose">
  <details>
    <summary>What is FDIC deposit insurance?</summary>
    <p>The Federal Deposit Insurance Corporation (FDIC) insures deposits at member banks up to $250,000 per depositor, per insured bank, for each account ownership category.</p>
  </details>

  <details>
    <summary>What types of accounts are insured?</summary>
    <p>FDIC insurance covers checking accounts, savings accounts, money market deposit accounts, and certificates of deposit (CDs) at insured institutions.</p>
  </details>

  <details>
    <summary>Are joint accounts insured separately?</summary>
    <p>Yes. Joint accounts are insured separately from single-ownership accounts. Each co-owner's share is insured up to $250,000.</p>
  </details>
</div>
```

**Commit:** `docs: add live details/accordion examples to component page`

### Task 2d: Aside / Pull Quote (aside.md)

**File:** `apps/docs/components/aside.md`

Insert after the `fdic-foundation-intro` block (line 8) and before `## Styling` (line 10):

```html
## Live example

<div class="prose">
  <p>When evaluating deposit insurance coverage, it is important to understand how the FDIC categorizes account ownership. Each ownership category — single accounts, joint accounts, revocable trust accounts, and certain retirement accounts — is insured separately up to the standard maximum amount.</p>
  <aside aria-label="Key fact about deposit insurance">
    <p>The standard maximum deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category.</p>
  </aside>
  <p>This means a depositor with accounts in multiple ownership categories at the same insured bank can potentially be insured for more than $250,000 in total. For example, funds in a single account, a joint account, and an IRA at the same bank are each insured separately.</p>
</div>
```

Note: The surrounding `<p>` elements are necessary to demonstrate the float-right behavior of the aside. Without body text wrapping around it, the pull-quote effect is invisible.

**Commit:** `docs: add live aside/pull-quote example to component page`

### Task 2e: Code Blocks (code-blocks.md)

**File:** `apps/docs/components/code-blocks.md`

Insert after the `fdic-foundation-intro` block (line 8) and before `## Inline code` (line 10):

```html
## Live example

<div class="prose">
  <p>Set the <code>max-width</code> property to <code>65ch</code> for optimal reading comfort.</p>

  <pre><code class="language-css">.prose {
  max-width: var(--prose-max-width, 65ch);
  line-height: var(--fdic-line-height-body, 1.5);
  color: var(--fdic-text-primary, #212123);
}</code></pre>
</div>
```

**Commit:** `docs: add live code block examples to component page`

### Task 2f: Progress & Meter (progress-meter.md)

**File:** `apps/docs/components/progress-meter.md`

Insert after the `fdic-foundation-intro` block (line 8) and before `## Progress` (line 10):

```html
## Live example

<div class="prose">
  <div class="prose-progress-group">
    <label for="demo-app-progress">Application completion</label>
    <progress id="demo-app-progress" value="3" max="5" aria-label="Application completion: 60%">60%</progress>
    <span class="prose-progress-value">3 of 5 steps (60%)</span>
  </div>

  <div class="prose-progress-group">
    <label for="demo-tier1">Tier 1 leverage ratio</label>
    <meter id="demo-tier1" value="12.4" min="0" max="20" low="4" high="5" optimum="10" aria-label="Tier 1 leverage ratio: 12.4%">12.4%</meter>
    <span class="prose-progress-value">12.4% (well-capitalized)</span>
  </div>
</div>
```

**Commit:** `docs: add live progress and meter examples to component page`

### Task 2g: Table of Contents (table-of-contents.md)

**File:** `apps/docs/components/table-of-contents.md`

Insert after the `fdic-foundation-intro` block (line 8) and before `## HTML pattern` (line 10):

```html
## Live example

<div class="prose">
  <nav class="prose-toc" aria-label="Table of contents">
    <p class="prose-toc-title" id="demo-toc">On this page</p>
    <ul>
      <li><a href="#html-pattern">HTML Pattern</a></li>
      <li><a href="#styling-details">Styling Details</a></li>
      <li><a href="#active-state">Active State</a></li>
      <li><a href="#accessibility">Accessibility</a></li>
    </ul>
  </nav>
</div>
```

Note: The TOC links point to actual section headings on this very page, so they function as real navigation.

**Commit:** `docs: add live table of contents example to component page`

### Task 2h: Footnotes (footnotes.md)

**File:** `apps/docs/components/footnotes.md`

Insert after the `fdic-foundation-intro` block (line 8) and before `## Inline reference` (line 10):

```html
## Live example

<div class="prose">
  <p>Deposit insurance covers up to $250,000 per depositor, per insured bank, for each account ownership category.<sup><a href="#demo-fn1" id="demo-ref1" role="doc-noteref">[1]</a></sup> Joint accounts receive separate coverage from single-ownership accounts.<sup><a href="#demo-fn2" id="demo-ref2" role="doc-noteref">[2]</a></sup></p>

  <section class="prose-footnotes" role="doc-endnotes" aria-label="Footnotes">
    <hr />
    <ol>
      <li id="demo-fn1" role="doc-footnote">
        Federal Deposit Insurance Corporation. "Deposit Insurance FAQs." Coverage limits were last adjusted by the Dodd-Frank Act of 2010. <a href="#demo-ref1" role="doc-backlink" title="Back to reference">&#x21a9;</a>
      </li>
      <li id="demo-fn2" role="doc-footnote">
        12 C.F.R. Part 330 governs the general rules for deposit insurance coverage. <a href="#demo-ref2" role="doc-backlink" title="Back to reference">&#x21a9;</a>
      </li>
    </ol>
  </section>
</div>
```

Note: Footnote `id` attributes are prefixed with `demo-` to avoid conflicts with any footnotes in the documentation text itself.

**Commit:** `docs: add live footnote examples to component page`

---

## Task 3: Visual verification

**Step 1:** Start the dev server and visit each component page. Verify:

- [ ] Callouts: all 5 variants render with correct icons, colors, and spacing
- [ ] Tables: striped rows, hover highlight, numeric alignment, tfoot styling
- [ ] Details: summary pill, chevron rotation on open, content reveal animation
- [ ] Aside: floats right at 40% width with body text wrapping, brand-blue left border
- [ ] Code blocks: monospace font, container background, border-radius
- [ ] Progress/Meter: grid layout, bar fills, value text alignment
- [ ] TOC: container styling, link list, title styling
- [ ] Footnotes: superscript refs, HR separator, back-links, smaller text

**Step 2:** Verify VitePress chrome is unaffected:

- [ ] Sidebar navigation renders correctly
- [ ] Top navbar and search work
- [ ] Dark mode toggle (if present) does not break prose styles
- [ ] Mobile responsive layout works

**Step 3:** Fix any CSS conflicts between prose styles and VitePress defaults (likely candidates: link colors in `.vp-doc a` vs `.prose a`, code block styling from VitePress's Shiki highlighter vs `.prose pre`).

**Commit (if fixes needed):** `fix: resolve CSS specificity conflicts between prose and VitePress styles`

---

## Notes

### Why copy instead of symlink or npm dependency?

The `fdicnet-prose` repo is a separate project with its own lifecycle. Copying the relevant sections:
- Avoids a cross-repo dependency that would require coordinated releases
- Lets us omit section 2 (base reset) cleanly
- Makes the docs site self-contained for CI/CD

When the prose CSS changes upstream, update the copy. This is documented in the file header.

### Why not scope prose styles to only the live example containers?

We discussed using prose styles for the content area broadly (dogfooding), not just in demo blocks. However, applying `.prose` to the entire `.vp-doc` area would conflict with VitePress's built-in markdown rendering (its own heading styles, code highlighting, list styles, etc.). The safer approach for now is `.prose` only on the live example containers. The content area already gets Source Sans 3 via the font import, which is the most visible typography change.

### Future: VitePress content area styling

A follow-up task could selectively apply prose-derived styles (font, spacing, link treatments) to `.vp-doc` elements without using the full `.prose` class. This would require writing targeted overrides in `custom.css` rather than importing the prose component wholesale.
