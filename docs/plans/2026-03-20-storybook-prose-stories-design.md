# Storybook Stories for Prose Components

**Date:** 2026-03-20
**Status:** Approved

## Goal

Create Storybook story files for each of the 8 documented prose components so that the `<StoryEmbed>` references in the VitePress docs site resolve to real, interactive stories.

## Infrastructure

### Preview setup

Create `apps/storybook/.storybook/preview.ts`:

- Import `../../docs/.vitepress/theme/prose.css` (cross-workspace, Vite resolves it)
- Register a global decorator wrapping every story in `<div class="prose">...</div>`

### Story file convention

One file per component page, plus a separate file for meter (since it needs its own Storybook title to produce the correct story ID prefix):

```
apps/storybook/src/
  callout.stories.ts
  table.stories.ts
  toc.stories.ts
  details.stories.ts
  code-block.stories.ts
  progress.stories.ts
  meter.stories.ts
  footnotes.stories.ts
  aside.stories.ts
```

### Title convention

All under `Prose/` prefix (e.g., `title: "Prose/Callout"`) so story IDs match what docs expect (`prose-callout--default`).

## Story Structure

Each file uses this pattern:

```ts
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta = {
  title: "Prose/ComponentName",
  tags: ["autodocs"],
  argTypes: { /* controls */ },
  args: { /* defaults matching doc examples */ },
  render: (args) => html`...`
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Variant: Story = { args: { /* overrides */ } };
```

- `tags: ["autodocs"]` auto-generates a docs page in Storybook
- `render()` builds HTML from args; the prose wrapper comes from the global decorator
- Default args match the doc page "Live examples" content exactly

## Args by Component

| Component | Args | Controls |
|-----------|------|----------|
| Callout | `variant` (select), `content` (text), `label` (text) | All |
| Table | `caption` (text), `showNumeric` (boolean), `showFooter` (boolean) | All |
| TOC | `items` (object array), `activeIndex` (number) | activeIndex as range |
| Details | `summary` (text), `content` (text), `open` (boolean) | All |
| Code Block | `code` (text), `language` (text), `showCopyButton` (boolean) | All |
| Progress | `value` (number), `max` (number), `label` (text) | value as range |
| Meter | `value`, `min`, `max`, `low`, `high`, `optimum` (numbers), `label` (text) | value as range |
| Footnotes | `notes` (object array) | Mostly static |
| Aside | `content` (text), `label` (text) | Both |

## Stories per File (matching StoryEmbed IDs in docs)

| File | Exports | Story IDs |
|------|---------|-----------|
| callout | Default, Info, Warning, Success, Danger | prose-callout--default through --danger |
| table | Default, Numeric | prose-table--default, --numeric |
| toc | Default, ActiveState | prose-toc--default, --active-state |
| details | Default, FaqGroup | prose-details--default, --faq-group |
| code-block | Default, WithCopy | prose-code-block--default, --with-copy |
| progress | Determinate, Indeterminate | prose-progress--determinate, --indeterminate |
| meter | Default | prose-meter--default |
| footnotes | Default | prose-footnotes--default |
| aside | Default | prose-aside--default |

## Content & Accessibility

- Default args use exact FDIC domain content from doc page "Live examples"
- All ARIA attributes from the prose spec are included (callout roles, table wrapper region, DPUB-ARIA on footnotes, etc.)
- No JS behaviors — copy buttons, TOC scroll tracking, and footnote flash are HTML/CSS only in stories. Interactive states (e.g., TOC active) are set statically via args/classes.

## CSS Loading Strategy

Import prose.css directly from the docs workspace in the Storybook preview file. This is a monorepo and Vite resolves cross-workspace imports. No copy or symlink needed.
