# Typography

This page documents the FDIC design system's foundational type rules: font families, the size scale, line heights, letter spacing, text rendering, heading and body styles, inline semantics, and link behavior.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Typography foundations</span>
  <p>Typography decisions optimize for readability, plain-language presentation, clear scanning in public-service workflows, and predictable behavior across zoom and reflow. For the authored-content container, page-level utilities, and specialized long-form patterns, see <a href="../../components/prose">Prose</a>.</p>
</div>

## Font families

The system uses two font stacks: a sans-serif family for all body and heading content, and a monospace stack for code.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Sans-serif</span>
    <h3>Source Sans 3</h3>
    <p>The FDIC brand typeface. Successor to Source Sans Pro with variable-weight support. Loaded via Google Fonts <code>@import</code>.</p>
    <div style="margin-top:0.75rem;">
      <code style="font-size:0.75rem; color:var(--fdic-docs-muted);">--fdic-font-family-sans-serif</code>
    </div>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Monospace</span>
    <h3>System monospace stack</h3>
    <p>Used for code blocks, inline code, <code>kbd</code>, <code>samp</code>, <code>var</code>, and <code>output</code> elements. No external font load required.</p>
    <div style="margin-top:0.75rem;">
      <code style="font-size:0.75rem; color:var(--fdic-docs-muted);">--fdic-font-family-mono</code>
    </div>
  </div>
</div>

**Sans-serif stack:** "Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

**Monospace stack:** ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace

::: warning Font shorthand is banned
Always use individual properties (`font-family`, `font-size`, `font-weight`, `line-height`) to avoid PostCSS parse failures. Never use the `font` shorthand.
:::

## Type scale

The size ramp is locked — do not change without leadership approval.

<div class="fdic-type-specimen">
  <div class="fdic-type-row">
    <div class="fdic-type-preview" data-role="display">Financial guidance should feel clear and official.</div>
    <div class="fdic-token-meta">h1 · 2.5313rem · weight 600</div>
  </div>
  <div class="fdic-type-row">
    <div class="fdic-type-preview" data-role="heading">Review and confirm your account details</div>
    <div class="fdic-token-meta">h2 · 1.6875rem · weight 600</div>
  </div>
  <div class="fdic-type-row">
    <div class="fdic-type-preview" data-role="body">Body copy should be easy to read, support plain language, and remain readable under zoom and reflow.</div>
    <div class="fdic-token-meta">body · 1.125rem · weight 400</div>
  </div>
  <div class="fdic-type-row">
    <div class="fdic-type-preview" data-role="supporting">Supporting text helps explain why information is requested and what will happen next.</div>
    <div class="fdic-token-meta">body-small · 1rem · weight 400</div>
  </div>
</div>

### Font size tokens

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Token</span>
    <span>Value</span>
    <span>Usage</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-font-size-h1</code></span>
    <span>2.5313rem</span>
    <span>Page title</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-font-size-h2</code></span>
    <span>1.6875rem</span>
    <span>Section heading</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-font-size-h3</code></span>
    <span>1.4063rem</span>
    <span>Subsection heading</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-font-size-h4</code></span>
    <span>1.125rem</span>
    <span>Minor heading</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-font-size-body</code></span>
    <span>1.125rem</span>
    <span>Default reading text</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-font-size-body-big</code></span>
    <span>1.25rem</span>
    <span>Lead paragraphs, article intros</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-font-size-body-small</code></span>
    <span>1rem</span>
    <span>Supporting text, footnotes</span>
  </div>
</div>

### Line height tokens

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Token</span>
    <span>Value</span>
    <span>Usage</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-line-height-h1</code></span>
    <span>1.15</span>
    <span>Page title — tight for large text</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-line-height-h2</code></span>
    <span>1.2</span>
    <span>Section headings</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-line-height-h3</code></span>
    <span>1.25</span>
    <span>Subsection headings</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-line-height-h4</code></span>
    <span>1.25</span>
    <span>Minor headings</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-line-height-body</code></span>
    <span>1.5</span>
    <span>Body text — WCAG minimum for comfortable reading</span>
  </div>
</div>

### Letter spacing tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--fdic-letter-spacing-0` | 0 | Body text, default |
| `--fdic-letter-spacing-1` | -0.01em | h1 headings — tighter at large sizes |
| `--fdic-letter-spacing-2` | -0.005em | h2–h3 headings |

### Responsive scaling

At `max-width: 640px`, heading sizes reduce to maintain readability on small screens:

| Level | Desktop | Mobile |
|-------|---------|--------|
| h1 | 2.5313rem | 2rem |
| h2 | 1.6875rem | 1.5rem |
| h3 | 1.4063rem | 1.25rem |
| h4 | 1.125rem | 1.0625rem |
| Lead paragraph | 1.25rem | 1.125rem |

## Heading styles

All headings use weight 600, primary color (`#212123`), and re-declare `font-family` for standalone safety.

- **h1**: `padding-bottom` + `border-bottom` — the only heading with a visible divider
- **h2**: `padding-bottom` only
- **Vertical rhythm**: `1.5em` above, `0.5em` below each heading
- **Stacked headings** (h2 + h3, h3 + h4, etc.): top margin collapses to `0.5em`

::: info Heading hierarchy
Use headings in strict hierarchical order (h1, h2, h3) — never skip levels or use headings for visual sizing alone. One `h1` per page. (WCAG 1.3.1)
:::

## Body text

- **Size**: 1.125rem (18px), line-height 1.5, weight 400
- **Text rendering**: `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`
- **Text wrapping**: `text-wrap: pretty` and `hanging-punctuation: first allow-end last`
- **Selection**: rgba brand-blue at 20% opacity

### Lead paragraph

The `.lead` (or `.prose-lead`) class is used for article introductions and section summaries:

- Size: 1.25rem (`--fdic-font-size-body-big`)
- Color: secondary (`#595961`)

```html
<p class="lead">This introductory paragraph summarizes the section.</p>
```

### Blockquotes

- Line-height: 1.6 (slightly airier than body)
- Color: secondary (`#595961`)
- Left border: 4px solid brand-blue (`#0d6191`)
- Nested blockquotes use `--fdic-border-divider` for the border to show hierarchy

::: tip Attribution
Wrap attributions in `<footer><cite>` — do not use blockquotes for visual indentation of non-quoted content (WCAG 1.3.1).
:::

## Inline element styles

These styles describe the baseline treatment for inline semantic HTML in authored content. The current implementation is most visible inside `.prose`, but the rules here are foundational rather than page-specific:

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Element</span>
    <span>Visual treatment</span>
    <span>Key styles</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>abbr[title]</code></span>
    <span>Dotted underline, help cursor</span>
    <span>Secondary color underline, <code>text-underline-offset: 0.15em</code></span>
  </div>
  <div class="fdic-roles-row">
    <span><code>kbd</code></span>
    <span>Key-cap effect</span>
    <span>Monospace 0.8em, container bg, 1px border + 2px bottom border, <code>border-radius-sm</code></span>
  </div>
  <div class="fdic-roles-row">
    <span><code>mark</code></span>
    <span>Yellow highlight</span>
    <span><code>#fff3cd</code> background, <code>color: inherit</code>, 2px radius</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>small</code></span>
    <span>Reduced text</span>
    <span>0.875em, secondary color</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>del</code></span>
    <span>Strikethrough</span>
    <span><code>line-through</code> in secondary color</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>ins</code></span>
    <span>Green background</span>
    <span>No underline, <code>#e6f4ea</code> background, 2px radius</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>dfn</code></span>
    <span>Definition term</span>
    <span>Italic + weight 600</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>var</code></span>
    <span>Variable</span>
    <span>Monospace italic, 0.875em</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>q</code></span>
    <span>Inline quotation</span>
    <span>Curly quotes via CSS <code>quotes</code> property</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>samp</code></span>
    <span>Sample output</span>
    <span>Monospace 0.8em, container bg, 3px left border</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>output</code></span>
    <span>Computed result</span>
    <span>Monospace 0.8em, container bg, 1px border all around</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>time[datetime][title]</code></span>
    <span>Dotted underline, help cursor</span>
    <span>Same treatment as <code>abbr</code></span>
  </div>
  <div class="fdic-roles-row">
    <span><code>sup</code> / <code>sub</code></span>
    <span>Super/subscript</span>
    <span>0.75em, <code>line-height: 0</code> (prevents line distortion)</span>
  </div>
</div>

### Accessibility notes for inline elements

- **`<del>` / `<ins>`**: Include `<span class="sr-only">deleted: </span>` or `<span class="sr-only">inserted: </span>` inside so screen readers announce the change
- **`<mark>`**: Screen reader support for `role="mark"` is inconsistent — ensure surrounding text conveys the significance without relying on color alone
- **`<abbr>`**: Spell out abbreviations on first use in visible body text: `Federal Deposit Insurance Corporation (<abbr title="...">FDIC</abbr>)`
- **`<output>`**: Has implicit `role="status"` (ARIA live region) — use the `for` attribute to associate with input controls

## Link styling

Links use a four-state color model with underline thickness transitions:

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>State</span>
    <span>Color</span>
    <span>Underline</span>
  </div>
  <div class="fdic-roles-row">
    <span>Default</span>
    <span><span class="fdic-role-dot" style="background:#1278B0;"></span> <code>#1278B0</code></span>
    <span>thickness 6.25%, offset 12.5%, <code>from-font</code> position</span>
  </div>
  <div class="fdic-roles-row">
    <span>Hover</span>
    <span><span class="fdic-role-dot" style="background:#0D6191;"></span> <code>#0D6191</code></span>
    <span>thickness bumps to 2px</span>
  </div>
  <div class="fdic-roles-row">
    <span>Visited</span>
    <span><span class="fdic-role-dot" style="background:#855AA5;"></span> <code>#855AA5</code></span>
    <span>same as default</span>
  </div>
  <div class="fdic-roles-row">
    <span>Visited hover</span>
    <span><span class="fdic-role-dot" style="background:#79579F;"></span> <code>#79579F</code></span>
    <span>thickness 2px</span>
  </div>
</div>

- **Focus**: `outline: 2px solid var(--fdic-border-input-focus)`, `outline-offset: 2px`, `border-radius: 2px`
- **External links** (`a[href^="http"]:not([href*="fdic.gov"])`): Phosphor ArrowSquareOut icon appended via `background-image` with `padding-right`; visited variant swaps icon fill to visited purple
- **Content guidance**: Use descriptive link text that makes sense out of context — avoid "click here" or "read more"

## Spacing conventions

All spacing tokens use `rem` — never `px`.

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Token</span>
    <span>Value</span>
    <span>Usage</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-spacing-2xs</code></span>
    <span>0.25rem</span>
    <span>Simple list item spacing, tight gaps</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-spacing-xs</code></span>
    <span>0.5rem</span>
    <span>Below-heading spacing</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-spacing-sm</code></span>
    <span>0.75rem</span>
    <span>Internal component padding</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-spacing-md</code></span>
    <span>1rem</span>
    <span>Complex list item spacing</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-spacing-xl</code></span>
    <span>1.25rem</span>
    <span>Default block element margin-bottom</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-spacing-3xl</code></span>
    <span>3rem</span>
    <span>Thematic breaks (<code>&lt;hr&gt;</code>)</span>
  </div>
</div>

### Vertical rhythm rules

- **Block elements** (p, ul, ol, dl, blockquote, pre, figure, table, hr): `margin-top: 0; margin-bottom: var(--fdic-spacing-xl, 1.25rem)`
- **Headings**: `1.5em` above, `0.5em` below
- **HR**: `--fdic-spacing-3xl` (3rem) above and below — larger gap for thematic breaks
- **Boundary resets**: First child of `.prose` gets `margin-top: 0`; last child gets `margin-bottom: 0`

### List spacing

- **Simple items**: `--fdic-spacing-2xs` (0.25rem) between siblings
- **Complex items** (containing `<p>`): `--fdic-spacing-md` (1rem) between siblings
- **Nested lists**: tight to parent (0.25rem above, 0 below)
- **Sibling items with nested lists**: `1rem` between them

## Text rendering and wrapping

These text-rendering and wrapping defaults are currently applied through the `.prose` content container. They are documented here because they reflect the underlying reading model rather than a one-off component decision:

| Property | Value | Purpose |
|----------|-------|---------|
| `text-wrap` | `pretty` | Prevents orphaned words at line ends |
| `hanging-punctuation` | `first allow-end last` | Optically aligned punctuation at margins |
| `-webkit-font-smoothing` | `antialiased` | Consistent subpixel rendering on macOS |
| `-moz-osx-font-smoothing` | `grayscale` | Firefox equivalent |
| `text-rendering` | `optimizeLegibility` | Enables kerning and ligatures |
| `max-width` | `65ch` | Optimal line length for sustained reading (45–75ch range) |

See [Prose](../../components/prose) for the container API, supporting patterns, and long-form authoring guidance. Override `--prose-max-width` only in layouts that have a documented need for a different reading measure.

## Content guidance

Typography should support direct, explicit government content:

- Use short headings with clear meaning
- Use plain-language labels
- Maintain readable line lengths via the `65ch` max-width
- Use paragraph spacing that supports scanning
- Spell out abbreviations on first use in body text
- Write descriptive link text that makes sense out of context
- Use `<pre><code class="language-{lang}">` for code examples

Do not treat the type scale as visual decoration without considering document structure and comprehension.
