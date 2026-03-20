# Code blocks

This page documents inline code, fenced code blocks, the copy button, and the word-wrap helper class for the FDIC design system prose component.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Code display components</span>
  <p>Code elements present technical content — configuration values, markup examples, terminal output — in a monospace font with container styling that visually separates it from body text.</p>
</div>

## Live example

<div class="prose">
  <p>Set the <code>max-width</code> property to <code>65ch</code> for optimal reading comfort.</p>

  <pre><code class="language-css">.prose {
  max-width: var(--prose-max-width, 65ch);
  line-height: var(--fdic-line-height-body, 1.5);
  color: var(--fdic-text-primary, #212123);
}</code></pre>
</div>

## Inline code

Use the `<code>` element for short references to code within running prose — function names, property values, file paths, and similar fragments.

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Property</span>
    <span>Value</span>
    <span>Token</span>
  </div>
  <div class="fdic-roles-row">
    <span>Font family</span>
    <span>System monospace stack</span>
    <span><code>--fdic-font-family-mono</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Font size</span>
    <span>0.8em (relative to parent)</span>
    <span>—</span>
  </div>
  <div class="fdic-roles-row">
    <span>Background</span>
    <span>#f5f5f7</span>
    <span><code>--fdic-background-container</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Border radius</span>
    <span>3px</span>
    <span><code>--fdic-corner-radius-sm</code></span>
  </div>
</div>

### Usage

```html
<p>Set the <code>max-width</code> property to <code>65ch</code> for optimal reading comfort.</p>
```

Inline code inherits the surrounding text color and receives a subtle container background to distinguish it from prose. It does not include a border.

::: tip When to use inline code
Use inline code for values the reader might copy, type, or look up: CSS properties, token names, HTML elements, file paths, and shell commands. Do not use it for general emphasis — use `<strong>` or `<em>` instead.
:::

## Code blocks

Fenced code blocks use a `<pre>` wrapping a `<code>` element. The `<code>` element should include a `class="language-{lang}"` attribute to indicate the language for syntax highlighting.

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Property</span>
    <span>Value</span>
    <span>Token</span>
  </div>
  <div class="fdic-roles-row">
    <span>Font family</span>
    <span>System monospace stack</span>
    <span><code>--fdic-font-family-mono</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Font size</span>
    <span>0.875rem</span>
    <span>—</span>
  </div>
  <div class="fdic-roles-row">
    <span>Line height</span>
    <span>1.625</span>
    <span>—</span>
  </div>
  <div class="fdic-roles-row">
    <span>Background</span>
    <span>#f5f5f7</span>
    <span><code>--fdic-background-container</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Border</span>
    <span>1px solid #bdbdbf</span>
    <span><code>--fdic-border-divider</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Border radius</span>
    <span>7px</span>
    <span><code>--fdic-corner-radius-lg</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Padding</span>
    <span>1rem</span>
    <span><code>--fdic-spacing-md</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Overflow</span>
    <span>auto (horizontal scroll)</span>
    <span>—</span>
  </div>
</div>

### Basic example

```html
<pre><code class="language-css">.prose {
  max-width: var(--prose-max-width, 65ch);
  line-height: var(--fdic-line-height-body, 1.5);
  color: var(--fdic-text-primary, #212123);
}</code></pre>
```

### Overflowing content

When a code block contains lines wider than the container, the `<pre>` element scrolls horizontally. To make this scrollable region keyboard-accessible, add `tabindex="0"`, `role="region"`, and a descriptive `aria-label`:

```html
<pre tabindex="0" role="region" aria-label="CSS custom property definitions"><code class="language-css">:root {
  --fdic-font-family-sans-serif: "Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --fdic-font-family-mono: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}</code></pre>
```

::: warning Keyboard scrolling
Any `<pre>` element whose content overflows must include `tabindex="0"` so keyboard users can scroll horizontally. Without it, the overflowing content is unreachable for non-mouse users.
:::

### HTML entities in code examples

When showing HTML markup inside a code block, escape angle brackets as `&lt;` and `&gt;`:

```html
<pre><code class="language-html">&lt;article class="prose" id="main"&gt;
  &lt;h1&gt;Page Title&lt;/h1&gt;
  &lt;p class="lead"&gt;Introductory summary paragraph.&lt;/p&gt;
&lt;/article&gt;</code></pre>
```

## Copy button

The `.prose-copy-btn` class provides a one-click copy-to-clipboard button for code blocks. It requires a small inline script and a `<pre>` with `position: relative`.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Behavior</span>
    <h3>Fade-in on hover</h3>
    <p>The button is invisible at rest and fades in (opacity transition, 0.15s) when the user hovers or focuses within the <code>&lt;pre&gt;</code> block.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Feedback</span>
    <h3>Success state</h3>
    <p>After a successful copy, add the <code>.prose-copy-btn-success</code> class to change the button label (e.g., "Copied!") and provide visual confirmation.</p>
  </div>
</div>

### Markup

```html
<pre style="position: relative;"
     tabindex="0" role="region"
     aria-label="Bank configuration example"><code class="language-json">{
  "institution": "First National Bank",
  "certNumber": 12345,
  "insuredStatus": "active"
}</code>
  <button class="prose-copy-btn"
          type="button"
          aria-label="Copy code to clipboard">Copy</button>
</pre>
```

### Key CSS properties

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Property</span>
    <span>Value</span>
    <span>Notes</span>
  </div>
  <div class="fdic-roles-row">
    <span>Position</span>
    <span><code>absolute</code> (top-right of <code>&lt;pre&gt;</code>)</span>
    <span>Parent <code>&lt;pre&gt;</code> must have <code>position: relative</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Opacity (rest)</span>
    <span>0</span>
    <span>Hidden until parent is hovered or focused-within</span>
  </div>
  <div class="fdic-roles-row">
    <span>Opacity (visible)</span>
    <span>1</span>
    <span>Fades in via <code>transition: opacity 0.15s</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Focus ring</span>
    <span><code>2px solid #38b6ff</code>, offset 2px</span>
    <span>Standard focus-visible pattern</span>
  </div>
</div>

### Script

The copy button requires a small inline script. It reads the text content of the sibling `<code>` element and writes it to the clipboard:

```html
<script>
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.prose-copy-btn');
  if (!btn) return;
  var pre = btn.closest('pre');
  var code = pre ? pre.querySelector('code') : null;
  if (!code) return;
  navigator.clipboard.writeText(code.textContent).then(function () {
    btn.classList.add('prose-copy-btn-success');
    btn.textContent = 'Copied!';
    setTimeout(function () {
      btn.classList.remove('prose-copy-btn-success');
      btn.textContent = 'Copy';
    }, 2000);
  });
});
</script>
```

## Word-wrap helper

The `.prose-pre-wrap` class forces word wrapping on `<pre>` elements when horizontal scrolling is not desirable — for example, in narrow layouts or when the code content is plain text rather than formatted source.

```html
<pre class="prose-pre-wrap"><code>This is a long line of configuration output that should wrap
rather than scroll, because the exact whitespace formatting is
not meaningful in this context.</code></pre>
```

When `.prose-pre-wrap` is applied, the `<pre>` element uses `white-space: pre-wrap` and `word-wrap: break-word` instead of the default horizontal overflow.

::: info When to wrap vs. scroll
Use `.prose-pre-wrap` for terminal output, log excerpts, and plain-text content where line breaks are not semantically important. Keep the default horizontal scroll for source code where indentation and line structure matter.
:::

## Accessibility

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Requirement</span>
    <span>Implementation</span>
    <span>Reference</span>
  </div>
  <div class="fdic-roles-row">
    <span>Keyboard-scrollable overflow</span>
    <span>Add <code>tabindex="0"</code> to any <code>&lt;pre&gt;</code> with overflowing content</span>
    <span>WCAG 2.1.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Screen reader context</span>
    <span>Add <code>role="region"</code> and a descriptive <code>aria-label</code> to overflowing <code>&lt;pre&gt;</code> elements</span>
    <span>WCAG 1.3.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Focus ring</span>
    <span><code>outline: 2px solid var(--fdic-border-input-focus, #38b6ff)</code>, <code>outline-offset: 2px</code>, <code>border-radius: 2px</code></span>
    <span>WCAG 2.4.7</span>
  </div>
  <div class="fdic-roles-row">
    <span>Copy button label</span>
    <span><code>aria-label="Copy code to clipboard"</code> on the <code>&lt;button&gt;</code></span>
    <span>WCAG 4.1.2</span>
  </div>
  <div class="fdic-roles-row">
    <span>Reduced motion</span>
    <span>Copy button opacity transition suppressed under <code>prefers-reduced-motion: reduce</code></span>
    <span>WCAG 2.3.3</span>
  </div>
</div>

## Print and forced-colors

### Print styles

- Copy buttons are hidden (`display: none`)
- Code block backgrounds are removed to save ink
- Borders are preserved at `#999` for structure
- `max-width` is removed so code blocks use available page width

### Forced-colors mode (Windows High Contrast)

- Code block borders use system `ButtonText` color
- Focus rings use system `Highlight` color
- Background colors are removed (the system manages contrast)
- `forced-color-adjust: none` is not applied to code blocks — they defer to the system palette

```css
/* forced-colors override */
@media (forced-colors: active) {
  .prose pre {
    border-color: ButtonText;
  }
  .prose pre:focus-visible {
    outline-color: Highlight;
  }
}
```
