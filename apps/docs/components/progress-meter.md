# Progress & Meter

Progress bars and meters communicate completion, capacity, and quantitative status within prose content — application workflows, capital adequacy ratios, funding levels, and filing deadlines.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>The <code>.prose-progress-group</code> wrapper provides a grid layout for the native <code>&lt;progress&gt;</code> and <code>&lt;meter&gt;</code> elements. The label spans the full width; the bar and its visible value sit side by side beneath it. Both elements are styled cross-browser for WebKit and Firefox.</p>
</div>

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

## Progress

The `<progress>` element represents task completion — how far along a multi-step process has advanced. It does not convey good-or-bad status; it simply shows proportion completed.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Determinate</span>
    <h3>Known completion</h3>
    <p>When both <code>value</code> and <code>max</code> are set, the bar fills proportionally. Use for application workflows, document uploads, and filing steps where the total is known.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Indeterminate</span>
    <h3>Unknown duration</h3>
    <p>When no <code>value</code> attribute is present, the bar shows animated stripes to indicate ongoing activity without a known endpoint. Use for background processing and server-side validation.</p>
  </div>
</div>

### HTML pattern

The markup wraps the label, bar, and visible value in a `.prose-progress-group` container. The grid layout places the label on the first row and the bar plus value side by side on the second row.

```html
<!-- Determinate progress -->
<div class="prose-progress-group">
  <label for="app-progress">Application completion</label>
  <progress id="app-progress" value="3" max="5"
            aria-label="Application completion: 60%">60%</progress>
  <span class="prose-progress-value">3 of 5 steps (60%)</span>
</div>

<!-- Indeterminate progress -->
<div class="prose-progress-group">
  <label for="validation">Validating filing data</label>
  <progress id="validation"
            aria-label="Validating filing data">Processing...</progress>
  <span class="prose-progress-value">Processing...</span>
</div>
```

### Styling details

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Feature</span>
    <span>Implementation</span>
    <span>Notes</span>
  </div>
  <div class="fdic-roles-row">
    <span>Layout</span>
    <span>CSS grid</span>
    <span>Label spans full width; bar + value on second row</span>
  </div>
  <div class="fdic-roles-row">
    <span>Bar track</span>
    <span>Container background, 1px border, <code>border-radius-lg</code></span>
    <span>Styled via <code>::-webkit-progress-bar</code> and <code>::-moz-progress-bar</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Bar fill</span>
    <span>Brand blue (<code>--fdic-brand-core-default</code>)</span>
    <span>Styled via <code>::-webkit-progress-value</code> and <code>::-moz-progress-bar</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Indeterminate</span>
    <span>Animated diagonal stripes</span>
    <span>CSS <code>@keyframes</code> stripe animation on the bar track</span>
  </div>
  <div class="fdic-roles-row">
    <span>Value text</span>
    <span><code>.prose-progress-value</code></span>
    <span>Visible text descriptor aligned to the end of the bar row</span>
  </div>
</div>

## Meter

The `<meter>` element represents a scalar measurement within a known range — capital ratios, reserve levels, utilization percentages. Unlike `<progress>`, the meter's color-coded bar can indicate whether the value falls in a low, optimum, or high range. However, that color alone does not convey status to non-visual users.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Optimum range</span>
    <h3>Green bar</h3>
    <p>The browser renders a green fill when the value falls within the optimum range. Example: a Tier 1 leverage ratio of 12.4% against a well-capitalized threshold of 5%.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Suboptimum range</span>
    <h3>Yellow bar</h3>
    <p>When the value drifts outside the optimum range but remains above the low threshold. Example: a liquidity coverage ratio approaching its minimum requirement.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Sub-sub-optimum range</span>
    <h3>Red bar</h3>
    <p>When the value crosses below the low threshold. Example: a capital ratio below the adequately-capitalized minimum.</p>
  </div>
</div>

### HTML pattern

Always include a visible text descriptor alongside the meter that states both the value and its status. The color-coded bar is a visual reinforcement, not the primary communication channel.

```html
<!-- Meter with visible status text -->
<div class="prose-progress-group">
  <label for="tier1">Tier 1 leverage ratio</label>
  <meter id="tier1" value="12.4" min="0" max="20"
         low="4" high="5" optimum="10"
         aria-label="Tier 1 leverage ratio: 12.4%">12.4%</meter>
  <span class="prose-progress-value">12.4% (well-capitalized)</span>
</div>

<!-- Meter approaching threshold -->
<div class="prose-progress-group">
  <label for="lcr">Liquidity coverage ratio</label>
  <meter id="lcr" value="105" min="0" max="200"
         low="100" high="120" optimum="150"
         aria-label="Liquidity coverage ratio: 105%">105%</meter>
  <span class="prose-progress-value">105% (approaching minimum)</span>
</div>

<!-- Meter below threshold -->
<div class="prose-progress-group">
  <label for="cet1">CET1 capital ratio</label>
  <meter id="cet1" value="3.8" min="0" max="15"
         low="4.5" high="6.5" optimum="10"
         aria-label="CET1 capital ratio: 3.8%">3.8%</meter>
  <span class="prose-progress-value">3.8% (undercapitalized)</span>
</div>
```

### Styling details

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Feature</span>
    <span>Implementation</span>
    <span>Notes</span>
  </div>
  <div class="fdic-roles-row">
    <span>Layout</span>
    <span>CSS grid (same as progress)</span>
    <span>Shares the <code>.prose-progress-group</code> container</span>
  </div>
  <div class="fdic-roles-row">
    <span>Bar track</span>
    <span>Container background, 1px border, <code>border-radius-lg</code></span>
    <span>Styled via <code>::-webkit-meter-bar</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Optimum fill</span>
    <span>Browser-native green</span>
    <span>Styled via <code>::-webkit-meter-optimum-value</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Suboptimum fill</span>
    <span>Browser-native yellow</span>
    <span>Styled via <code>::-webkit-meter-suboptimum-value</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Sub-sub-optimum fill</span>
    <span>Browser-native red</span>
    <span>Styled via <code>::-webkit-meter-even-less-good-value</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Status text</span>
    <span><code>.prose-progress-value</code></span>
    <span>Must include both the numeric value and a plain-language status descriptor</span>
  </div>
</div>

## Accessibility

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Labeling</span>
    <h3>Visible label via for/id</h3>
    <p>Every <code>&lt;progress&gt;</code> and <code>&lt;meter&gt;</code> element must have a visible <code>&lt;label&gt;</code> linked by matching <code>for</code> and <code>id</code> attributes. Do not rely on <code>aria-label</code> as the only label source.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Current value</span>
    <h3>aria-label with value</h3>
    <p>Include an <code>aria-label</code> that states the element's purpose and current value — for example, <code>aria-label="Application completion: 60%"</code>. This gives screen readers immediate context.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Fallback text</span>
    <h3>Text content inside the element</h3>
    <p>Place a text representation of the value inside the element (e.g., <code>&lt;progress&gt;60%&lt;/progress&gt;</code>). Browsers that do not support the element will render this text as a fallback.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Color independence</span>
    <h3>Visible status text for meter</h3>
    <p>The meter's color-coded bar does not convey meaning to non-visual users. Always include a <code>.prose-progress-value</code> span with the numeric value and a plain-language status such as "well-capitalized" or "undercapitalized" (WCAG 1.4.1, 4.1.2).</p>
  </div>
</div>

### Required attributes

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Visible label</span>
    <p>Provide a <code>&lt;label&gt;</code> linked to the element using matching <code>for</code> and <code>id</code> attributes.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">aria-label</span>
    <p>Include both the purpose and the numeric value: <code>aria-label="Tier 1 leverage ratio: 12.4%"</code>.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Text fallback</span>
    <p>Add text content inside the element as a fallback for browsers that do not render the native bar.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Visible status (meter)</span>
    <p>The <code>.prose-progress-value</code> span must state the value and its meaning in words. Color alone is not sufficient (WCAG 1.4.1).</p>
  </div>
</div>

## Indeterminate state

When a `<progress>` element has no `value` attribute, it enters the indeterminate state — the bar displays animated diagonal stripes instead of a proportional fill. Use this when the operation has no known endpoint: server-side validation, background data processing, or asynchronous report generation.

```html
<div class="prose-progress-group">
  <label for="report-gen">Generating quarterly report</label>
  <progress id="report-gen"
            aria-label="Generating quarterly report">
    Generating...</progress>
  <span class="prose-progress-value">Generating...</span>
</div>
```

The animated stripes are suppressed when `prefers-reduced-motion: reduce` is active. The bar falls back to a static striped pattern so the indeterminate state remains visually distinct without motion.

## Forced-colors mode

In Windows High Contrast and other forced-colors environments:

- Bar track borders use system color keywords to remain visible.
- Fill colors are overridden by the system. The visible status text in `.prose-progress-value` becomes the primary way to communicate the value and any threshold status.
- The grid layout and label association remain unchanged.

## Print behavior

When the page is printed:

- The progress and meter bars are rendered as static elements. Animated stripes on indeterminate progress are removed.
- The `.prose-progress-value` text remains visible, ensuring the value is readable on paper.
- Bar backgrounds and fills are simplified for legibility on monochrome printers.

## Reduced motion

All animations on the progress and meter components respect `prefers-reduced-motion: reduce`:

- The indeterminate stripe animation is suppressed. A static striped pattern is shown instead.
- No other transitions or animations are used on these components.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Use progress bars for multi-step workflows (account applications, filing submissions) and meters for quantitative thresholds (capital ratios, reserve levels, utilization rates). Always pair the bar with visible text that communicates the value and, for meters, the status.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not use a meter where a progress bar is appropriate — meters represent scalar measurements, not task completion. Do not rely on bar color alone to communicate whether a value is acceptable, warning-level, or critical.</p>
  </div>
</div>
