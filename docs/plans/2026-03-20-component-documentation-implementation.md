# Component Documentation Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite all 8 component documentation pages from technical-spec-focused to guidance-focused, add `<StoryEmbed>` and `<FigmaEmbed>` Vue wrapper components, and add new CSS styles for do/don't cards and content guideline examples.

**Architecture:** Each component page follows the template defined in `docs/plans/2026-03-20-component-documentation-design.md`. Technical detail (HTML patterns, token tables, ARIA implementation, forced-colors, print, responsive breakpoints) is removed from the docs site pages — it will migrate to Storybook stories in a separate effort. The Storybook and Figma embed components use `<iframe>` with `loading="lazy"` and are placeholder-safe (they render a styled fallback when no Storybook/Figma URL is configured yet).

**Tech Stack:** VitePress (markdown + Vue SFCs), vanilla CSS, no build tool changes needed.

**Design doc:** `docs/plans/2026-03-20-component-documentation-design.md`

---

## Phase 1: Infrastructure (embed components + CSS)

### Task 1: Create the `<StoryEmbed>` Vue component

**Files:**
- Create: `apps/docs/.vitepress/theme/components/StoryEmbed.vue`

**Step 1: Create the components directory**

Run: `mkdir -p apps/docs/.vitepress/theme/components`

**Step 2: Write the component**

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  storyId: string
  height?: string
  caption?: string
  storybookBaseUrl?: string
}>(), {
  height: '300',
  storybookBaseUrl: ''
})

const iframeSrc = props.storybookBaseUrl
  ? `${props.storybookBaseUrl}/iframe.html?id=${props.storyId}&viewMode=story`
  : ''

const storybookLink = props.storybookBaseUrl
  ? `${props.storybookBaseUrl}/?path=/story/${props.storyId}`
  : ''
</script>

<template>
  <figure class="fdic-story-embed">
    <div
      v-if="iframeSrc"
      class="fdic-story-embed-frame"
      :style="{ height: height + 'px' }"
    >
      <iframe
        :src="iframeSrc"
        loading="lazy"
        :title="caption || 'Component example'"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
    <div v-else class="fdic-story-embed-placeholder">
      <span class="fdic-story-embed-placeholder-icon" aria-hidden="true">⬡</span>
      <p>Storybook example: <code>{{ storyId }}</code></p>
      <p class="fdic-story-embed-placeholder-hint">Connect a Storybook instance to see live examples</p>
    </div>
    <figcaption v-if="caption" class="fdic-story-embed-caption">
      {{ caption }}
      <a
        v-if="storybookLink"
        :href="storybookLink"
        target="_blank"
        rel="noopener"
        class="fdic-story-embed-link"
      >View in Storybook →</a>
    </figcaption>
  </figure>
</template>
```

**Step 3: Verify the file was created**

Run: `cat apps/docs/.vitepress/theme/components/StoryEmbed.vue | head -5`
Expected: `<script setup lang="ts">`

### Task 2: Create the `<FigmaEmbed>` Vue component

**Files:**
- Create: `apps/docs/.vitepress/theme/components/FigmaEmbed.vue`

**Step 1: Write the component**

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  url: string
  height?: string
  caption?: string
}>(), {
  height: '450'
})

const iframeSrc = props.url
  ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(props.url)}`
  : ''
</script>

<template>
  <figure class="fdic-figma-embed">
    <div
      v-if="iframeSrc"
      class="fdic-figma-embed-frame"
      :style="{ height: height + 'px' }"
    >
      <iframe
        :src="iframeSrc"
        loading="lazy"
        :title="caption || 'Design specification'"
        allowfullscreen
      />
    </div>
    <div v-else class="fdic-figma-embed-placeholder">
      <span class="fdic-figma-embed-placeholder-icon" aria-hidden="true">◇</span>
      <p>Figma design spec</p>
      <p class="fdic-figma-embed-placeholder-hint">Connect a Figma file to see design specifications</p>
    </div>
    <figcaption v-if="caption" class="fdic-figma-embed-caption">
      {{ caption }}
      <a
        v-if="url"
        :href="url"
        target="_blank"
        rel="noopener"
        class="fdic-figma-embed-link"
      >View in Figma →</a>
    </figcaption>
  </figure>
</template>
```

### Task 3: Register components globally in the theme

**Files:**
- Modify: `apps/docs/.vitepress/theme/index.ts`

**Step 1: Update the theme to register both components**

```ts
import DefaultTheme from "vitepress/theme";
import "@fdic-ds/components";
import "./tokens.css";
import "./prose.css";
import "./custom.css";

import type { Theme } from "vitepress";
import StoryEmbed from "./components/StoryEmbed.vue";
import FigmaEmbed from "./components/FigmaEmbed.vue";

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("StoryEmbed", StoryEmbed);
    app.component("FigmaEmbed", FigmaEmbed);
  }
};

export default theme;
```

**Step 2: Verify the build still works**

Run: `cd apps/docs && npx vitepress build 2>&1 | tail -5`
Expected: Build completes without errors.

### Task 4: Add CSS for embed components, do/don't cards, and content guideline examples

**Files:**
- Modify: `apps/docs/.vitepress/theme/custom.css`

Append the following CSS to the end of `custom.css`:

```css
/* ------------------------------------------------------------------ */
/* Storybook embed                                                     */
/* ------------------------------------------------------------------ */

.fdic-story-embed {
  margin: 1.25rem 0 2rem;
}

.fdic-story-embed-frame {
  border: 1px solid var(--fdic-docs-border);
  border-radius: 12px;
  overflow: hidden;
}

.fdic-story-embed-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.fdic-story-embed-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  border: 2px dashed var(--fdic-docs-border);
  border-radius: 12px;
  background: var(--fdic-docs-surface);
  color: var(--fdic-docs-muted);
  text-align: center;
  padding: 2rem;
}

.fdic-story-embed-placeholder-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.4;
}

.fdic-story-embed-placeholder-hint {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.fdic-story-embed-caption {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--fdic-docs-muted);
}

.fdic-story-embed-link {
  font-size: 0.875rem;
  white-space: nowrap;
}

/* ------------------------------------------------------------------ */
/* Figma embed                                                         */
/* ------------------------------------------------------------------ */

.fdic-figma-embed {
  margin: 1.25rem 0 2rem;
}

.fdic-figma-embed-frame {
  border: 1px solid var(--fdic-docs-border);
  border-radius: 12px;
  overflow: hidden;
}

.fdic-figma-embed-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.fdic-figma-embed-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  border: 2px dashed var(--fdic-docs-border);
  border-radius: 12px;
  background: var(--fdic-docs-surface);
  color: var(--fdic-docs-muted);
  text-align: center;
  padding: 2rem;
}

.fdic-figma-embed-placeholder-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.4;
}

.fdic-figma-embed-placeholder-hint {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.fdic-figma-embed-caption {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--fdic-docs-muted);
}

.fdic-figma-embed-link {
  font-size: 0.875rem;
  white-space: nowrap;
}

/* ------------------------------------------------------------------ */
/* Do / Don't card pairs                                               */
/* ------------------------------------------------------------------ */

.fdic-do-dont-grid {
  display: grid;
  gap: 1rem;
  margin: 1.25rem 0 2rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.fdic-do-card,
.fdic-dont-card {
  padding: 1rem;
  border-radius: 12px;
  background: var(--ds-color-bg-surface, #FFFFFF);
  color: var(--fdic-docs-ink);
}

.fdic-do-card {
  border: 1px solid rgba(30, 130, 50, 0.3);
  border-top: 3px solid var(--fdic-docs-success);
}

.fdic-dont-card {
  border: 1px solid rgba(190, 40, 40, 0.25);
  border-top: 3px solid var(--fdic-docs-danger);
}

.fdic-do-card > .fdic-eyebrow {
  color: var(--fdic-docs-success);
}

.fdic-dont-card > .fdic-eyebrow {
  color: var(--fdic-docs-danger);
}

.fdic-do-card > p:last-child,
.fdic-dont-card > p:last-child {
  margin-bottom: 0;
}

/* ------------------------------------------------------------------ */
/* Content guideline examples                                          */
/* ------------------------------------------------------------------ */

.fdic-content-rule {
  margin: 1.5rem 0;
  padding: 0 0 1.5rem;
  border-bottom: 1px solid var(--fdic-docs-border);
}

.fdic-content-rule:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.fdic-content-rule > strong:first-child {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--fdic-docs-ink);
}

.fdic-content-rule > p {
  color: var(--fdic-docs-muted);
  margin-bottom: 0.75rem;
}

.fdic-content-example {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.fdic-content-do,
.fdic-content-dont {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.fdic-content-do {
  background: rgba(30, 130, 50, 0.06);
  border-left: 3px solid var(--fdic-docs-success);
}

.fdic-content-dont {
  background: rgba(190, 40, 40, 0.06);
  border-left: 3px solid var(--fdic-docs-danger);
}

.fdic-content-do > .fdic-eyebrow,
.fdic-content-dont > .fdic-eyebrow {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.fdic-content-do > .fdic-eyebrow {
  color: var(--fdic-docs-success);
}

.fdic-content-dont > .fdic-eyebrow {
  color: var(--fdic-docs-danger);
}

.fdic-content-do > p,
.fdic-content-dont > p {
  margin: 0;
}

/* ------------------------------------------------------------------ */
/* Related components list                                             */
/* ------------------------------------------------------------------ */

.fdic-related-list {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0 2rem;
}

.fdic-related-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--fdic-docs-border);
}

.fdic-related-list li:last-child {
  border-bottom: 0;
}

.fdic-related-list a {
  font-weight: 600;
}
```

**Step 5: Commit infrastructure**

Run:
```bash
git add apps/docs/.vitepress/theme/components/ apps/docs/.vitepress/theme/index.ts apps/docs/.vitepress/theme/custom.css
git commit -m "feat: add StoryEmbed, FigmaEmbed components and guidance page CSS"
```

---

## Phase 2: Rewrite component pages

Each task rewrites one component page. The existing page is replaced entirely with the new guidance-focused template. All pages use the section order from the design doc:

1. Overview (required)
2. When to use (required)
3. When not to use (optional)
4. Live examples (required) — `<StoryEmbed>` with placeholder storyIds
5. Best practices (required) — new `fdic-do-dont-grid` layout
6. Interaction behavior (optional)
7. Content guidelines (optional) — new `fdic-content-rule` layout
8. Accessibility (required) — plain language, author-focused
9. Design specs (optional) — `<FigmaEmbed>` placeholder
10. Related components (optional) — new `fdic-related-list` layout

**Important context for all page rewrites:**
- Use FDIC-appropriate example content (banking, regulatory, financial) — never lorem ipsum
- `StoryEmbed` storyIds follow the pattern `prose-{component}--{variant}` (e.g., `prose-callout--default`)
- All `<StoryEmbed>` and `<FigmaEmbed>` will render as styled placeholders until Storybook/Figma are connected — this is by design
- The live HTML examples from the current pages should be preserved in ONE representative specimen per page (inside a `<div class="prose">` wrapper), positioned before the Storybook embeds as an inline preview
- Keep the `fdic-foundation-intro` box pattern from current pages

### Task 5: Rewrite Callouts page

**Files:**
- Modify: `apps/docs/components/callouts.md`

**Sections to include:** Overview, When to use, When not to use, Live examples (preserve current live HTML specimens + add StoryEmbed placeholders for each variant), Best practices (4 do/don't pairs), Content guidelines (4 rules), Accessibility (plain language), Design specs (FigmaEmbed placeholder), Related components (Aside, Details, Lead paragraph).

**Content source:** Use the validated draft from the design conversation as the primary content. Adapt it to use the new CSS classes (`fdic-do-dont-grid`, `fdic-content-rule`, `fdic-related-list`).

**Step 1: Write the new page content**

Replace the full contents of `callouts.md`. See the design doc's "Example: Callouts page" section for the approved content. Wrap do/don't pairs in `fdic-do-dont-grid` with `fdic-do-card` / `fdic-dont-card`. Wrap content guidelines in `fdic-content-rule` divs with `fdic-content-example` grids.

**Step 2: Verify the build**

Run: `cd apps/docs && npx vitepress build 2>&1 | tail -3`
Expected: Build completes without errors.

**Step 3: Commit**

Run:
```bash
git add apps/docs/components/callouts.md
git commit -m "docs: rewrite callouts page with guidance-focused template"
```

### Task 6: Rewrite Details / Accordion page

**Files:**
- Modify: `apps/docs/components/details.md`

**Sections to include:** Overview, When to use, When not to use, Live examples (preserve current FAQ specimens + StoryEmbed placeholders), Best practices (4 pairs), Interaction behavior (keyboard: Enter/Space toggle; mouse: click summary toggles; animation: chevron rotates, content reveals; focus: ring on summary only), Content guidelines (rules for writing summary text), Accessibility (plain language), Design specs (FigmaEmbed placeholder), Related components (Callouts, TOC).

**Key interaction guidance content:**
- "Clicking or tapping the summary bar toggles the content open and closed."
- "Enter and Space keys toggle the accordion when the summary is focused."
- "The chevron rotates to point upward when open, providing a visual cue for the current state."
- "Content animates open with a smooth reveal. Users who prefer reduced motion see the content appear instantly."
- "Focus stays on the summary after toggling — the user decides whether to Tab into the revealed content."

**Key content guidelines:**
- "Write summaries as specific questions or descriptive labels" (with FAQ-style do/don't)
- "Don't start with verbs like 'Click to see' or 'Expand for'" — the interaction is self-evident
- "Keep summary text to one line" — long summaries break the scanning pattern

**Step 1: Write the new page content**
**Step 2: Verify the build**
**Step 3: Commit**

```bash
git add apps/docs/components/details.md
git commit -m "docs: rewrite details/accordion page with guidance-focused template"
```

### Task 7: Rewrite Tables page

**Files:**
- Modify: `apps/docs/components/tables.md`

**Sections to include:** Overview, When to use, When not to use, Live examples (preserve current FDIC deposit data table + StoryEmbed placeholders), Best practices (4 pairs — e.g., use tables for structured comparison data not for layout; include a caption; right-align numeric columns; keep tables scannable), Interaction behavior (keyboard scrolling for overflow tables, focus ring on wrapper), Content guidelines (writing captions, header labels, numeric formatting), Accessibility (plain language — describe what the table contains in the aria-label, don't use tables for layout), Design specs (FigmaEmbed placeholder).

**Step 1-3: Write, verify, commit**

```bash
git add apps/docs/components/tables.md
git commit -m "docs: rewrite tables page with guidance-focused template"
```

### Task 8: Rewrite Table of Contents page

**Files:**
- Modify: `apps/docs/components/table-of-contents.md`

**Sections to include:** Overview, When to use (long-form documents with 3+ sections), Live examples (preserve current specimen + StoryEmbed placeholders), Best practices (3-4 pairs), Interaction behavior (smooth scroll to target section, active state highlights current section, keyboard navigation), Accessibility (nav landmark with aria-label, title is a `<p>` not a heading), Design specs (FigmaEmbed placeholder), Related components (Footnotes — both are document navigation aids).

**Step 1-3: Write, verify, commit**

```bash
git add apps/docs/components/table-of-contents.md
git commit -m "docs: rewrite table-of-contents page with guidance-focused template"
```

### Task 9: Rewrite Footnotes page

**Files:**
- Modify: `apps/docs/components/footnotes.md`

**Sections to include:** Overview, When to use, When not to use (don't use for parenthetical asides that could be inline), Live examples (preserve current specimen + StoryEmbed placeholders), Best practices (3-4 pairs), Interaction behavior (bidirectional navigation: ref jumps to footnote, backlink returns to ref; target highlight flash on arrival), Content guidelines (footnote text should stand alone; keep footnotes short; number sequentially), Accessibility (plain language — DPUB-ARIA roles are handled by the component; authors provide meaningful footnote text), Design specs (FigmaEmbed placeholder), Related components (TOC).

**Step 1-3: Write, verify, commit**

```bash
git add apps/docs/components/footnotes.md
git commit -m "docs: rewrite footnotes page with guidance-focused template"
```

### Task 10: Rewrite Code Blocks page

**Files:**
- Modify: `apps/docs/components/code-blocks.md`

**Sections to include:** Overview, When to use, Live examples (preserve current specimens + StoryEmbed placeholders), Best practices (3-4 pairs — e.g., always specify the language, use `.prose-pre-wrap` for long lines that shouldn't scroll), Interaction behavior (copy button: appears on hover/focus, announces "Copied" on activation; keyboard scrolling for overflow), Accessibility (plain language — code blocks are keyboard-scrollable, copy button has accessible label), Design specs (FigmaEmbed placeholder).

**Step 1-3: Write, verify, commit**

```bash
git add apps/docs/components/code-blocks.md
git commit -m "docs: rewrite code-blocks page with guidance-focused template"
```

### Task 11: Rewrite Progress & Meter page

**Files:**
- Modify: `apps/docs/components/progress-meter.md`

**Sections to include:** Overview, When to use (progress for tasks with a beginning and end; meter for measurements within a known range), Live examples (preserve current specimens + StoryEmbed placeholders), Best practices (3-4 pairs — e.g., always pair with a visible label and text value; use meter not progress for static measurements; indeterminate progress for unknown duration), Content guidelines (writing labels and value text — "75 of 100 items processed" not just "75%"), Accessibility (plain language — every bar needs a visible label; text value provides the number screen readers announce), Design specs (FigmaEmbed placeholder), Related components (distinguish progress from meter).

**Step 1-3: Write, verify, commit**

```bash
git add apps/docs/components/progress-meter.md
git commit -m "docs: rewrite progress-meter page with guidance-focused template"
```

### Task 12: Rewrite Aside / Pull Quote page

**Files:**
- Modify: `apps/docs/components/aside.md`

**Sections to include:** Overview, When to use, When not to use (don't use for short tips — that's a callout; don't use for required reading), Live examples (preserve current specimen + StoryEmbed placeholders), Best practices (3-4 pairs — e.g., place the aside near the content it relates to; keep to 1-2 paragraphs; don't use more than one aside per section), Content guidelines (aside content should enrich but not duplicate the surrounding text; write in the same voice as the main content), Accessibility (plain language — the aside is an ARIA landmark; give it a descriptive label), Design specs (FigmaEmbed placeholder), Related components (Callout, Blockquote).

**Step 1-3: Write, verify, commit**

```bash
git add apps/docs/components/aside.md
git commit -m "docs: rewrite aside page with guidance-focused template"
```

---

## Phase 3: Cleanup and verification

### Task 13: Remove the placeholder page

**Files:**
- Delete: `apps/docs/components/placeholder.md`

**Step 1: Remove the file**

Run: `rm apps/docs/components/placeholder.md`

**Step 2: Remove from sidebar if referenced**

Check `apps/docs/.vitepress/config.ts` — the placeholder is not currently in the sidebar, so no change needed. Verify with:

Run: `grep -n placeholder apps/docs/.vitepress/config.ts`
Expected: No output (not referenced).

**Step 3: Commit**

```bash
git add -u apps/docs/components/placeholder.md
git commit -m "chore: remove placeholder component page"
```

### Task 14: Full build verification and visual check

**Step 1: Run the full VitePress build**

Run: `cd apps/docs && npx vitepress build 2>&1 | tail -10`
Expected: Build completes with no errors and no warnings about missing links.

**Step 2: Start the dev server and visually verify**

Run: `cd apps/docs && npx vitepress dev --port 5173 &`

Manually check each component page loads and renders correctly:
- http://localhost:5173/fdic-design-system/components/callouts
- http://localhost:5173/fdic-design-system/components/details
- http://localhost:5173/fdic-design-system/components/tables
- http://localhost:5173/fdic-design-system/components/table-of-contents
- http://localhost:5173/fdic-design-system/components/footnotes
- http://localhost:5173/fdic-design-system/components/code-blocks
- http://localhost:5173/fdic-design-system/components/progress-meter
- http://localhost:5173/fdic-design-system/components/aside

Verify:
- Each page renders with the correct section order
- `<StoryEmbed>` placeholders display the dashed-border placeholder state
- `<FigmaEmbed>` placeholders display the dashed-border placeholder state
- Do/Don't card pairs render with green/red top borders
- Content guideline examples render with green/red left borders
- Live HTML specimens still render correctly inside `<div class="prose">` wrappers
- Related components links navigate correctly

**Step 3: Stop the dev server and commit any fixes**

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Infrastructure | Tasks 1-4 | `<StoryEmbed>`, `<FigmaEmbed>` Vue components, new CSS for do/don't cards, content guidelines, and related components |
| 2: Page rewrites | Tasks 5-12 | All 8 component pages rewritten with guidance-focused template |
| 3: Cleanup | Tasks 13-14 | Remove placeholder, verify full build and visual output |

Total: 14 tasks, ~8 commits.
