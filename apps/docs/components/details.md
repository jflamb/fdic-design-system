# Details / Accordion

The native `<details>` element provides a disclosure widget for expandable content. The prose component styles it as a polished accordion suitable for FAQs, supplementary guidance, and progressive disclosure of regulatory information.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Disclosure component</span>
  <p>Use <code>&lt;details&gt;</code> when content is useful but not essential on first read. It reduces page length without hiding information behind navigation, keeping regulatory and procedural content accessible on demand.</p>
</div>

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

## HTML pattern

The component uses the native `<details>` and `<summary>` elements with no wrapper classes required. The `.prose` container scopes all styling automatically.

```html
<details>
  <summary>What is FDIC deposit insurance?</summary>
  <p>
    The Federal Deposit Insurance Corporation (FDIC) insures deposits
    at member banks up to $250,000 per depositor, per insured bank,
    for each account ownership category.
  </p>
</details>
```

Place multiple `<details>` elements in sequence to create an FAQ or accordion group. Each operates independently -- there is no exclusive-open behavior built in.

```html
<details>
  <summary>What types of accounts are insured?</summary>
  <p>FDIC insurance covers checking accounts, savings accounts,
  money market deposit accounts, and certificates of deposit (CDs)
  at insured institutions.</p>
</details>

<details>
  <summary>Are joint accounts insured separately?</summary>
  <p>Yes. Joint accounts are insured separately from single-ownership
  accounts. Each co-owner's share is insured up to $250,000.</p>
</details>

<details>
  <summary>How do I verify my bank is FDIC-insured?</summary>
  <p>Use the FDIC's BankFind tool at
  <code>research.fdic.gov/bankfind</code> to confirm whether a
  specific institution carries FDIC insurance.</p>
</details>
```

## Summary styling

The `<summary>` element is styled as a flex container with a pill-shaped background.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Background</span>
    <h3>Container surface</h3>
    <p>The summary uses <code>background-container</code> (<code>#F5F5F7</code>) to distinguish it from surrounding body text and signal interactivity.</p>
    <div style="margin-top:0.75rem;">
      <code style="font-size:0.75rem; color:var(--fdic-docs-muted);">--fdic-background-container</code>
    </div>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Weight</span>
    <h3>Semi-bold 600</h3>
    <p>Summary text uses <code>font-weight: 600</code> to create a clear visual anchor that distinguishes the clickable trigger from expanded content below.</p>
  </div>
</div>

Key summary properties:

- **Layout:** `display: flex` with `align-items: center`
- **Background:** `var(--fdic-background-container, #f5f5f7)`
- **Padding:** horizontal and vertical padding using spacing tokens
- **Border radius:** `var(--fdic-corner-radius-lg, 7px)` for the pill shape
- **Cursor:** `pointer`
- **Default marker:** the browser's native disclosure triangle is hidden (`list-style: none` and `::-webkit-details-marker { display: none }`)

## Chevron indicator

A Phosphor CaretDown icon is rendered via the `::after` pseudo-element on `<summary>`, using an inline SVG data URI as a `background-image`.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Collapsed</span>
    <h3>Caret points down</h3>
    <p>In the default closed state, the chevron points downward, indicating that content can be expanded.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Expanded</span>
    <h3>Caret rotates 180 degrees</h3>
    <p>When the <code>&lt;details&gt;</code> element has the <code>[open]</code> attribute, the chevron rotates to point upward via <code>transform: rotate(180deg)</code>.</p>
  </div>
</div>

The rotation transition uses `0.2s ease`. The chevron is pushed to the trailing edge of the summary with `margin-left: auto`.

## Content reveal

When `<details>` is opened, the content area animates in with a combined opacity and max-height transition.

- **Technique:** `interpolate-size: allow-keywords` enables transitioning `max-height` from `0` to the intrinsic content height without a fixed pixel value
- **Duration:** `0.25s ease` for both `opacity` and `max-height`
- **Opacity:** content fades from `0` to `1` as it expands

This creates a smooth accordion open effect that adapts to any content length.

## Micro-interactions

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>State</span>
    <span>Treatment</span>
    <span>Value</span>
  </div>
  <div class="fdic-roles-row">
    <span>Hover</span>
    <span>Overlay box-shadow</span>
    <span><code>inset 0 0 0 100px rgba(0, 0, 0, 0.04)</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Active / pressed</span>
    <span>Overlay box-shadow</span>
    <span><code>inset 0 0 0 100px rgba(0, 0, 0, 0.08)</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Focus-visible</span>
    <span>Border + blue glow</span>
    <span><code>outline: 2px solid #38b6ff; outline-offset: 2px</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Chevron rotation</span>
    <span>Transform on <code>[open]</code></span>
    <span><code>rotate(180deg)</code> over <code>0.2s ease</code></span>
  </div>
  <div class="fdic-roles-row">
    <span>Content reveal</span>
    <span>Opacity + max-height</span>
    <span><code>0.25s ease</code></span>
  </div>
</div>

The overlay box-shadow pattern darkens the pill background on interaction without changing the actual `background-color` value, which keeps the effect composable and avoids specificity conflicts.

## Accessibility

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Keyboard</span>
    <h3>Native toggle behavior</h3>
    <p>The <code>&lt;summary&gt;</code> element is focusable by default. Pressing <kbd>Enter</kbd> or <kbd>Space</kbd> toggles the open state. No JavaScript or ARIA attributes are needed.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Screen readers</span>
    <h3>Built-in semantics</h3>
    <p>Assistive technology announces <code>&lt;summary&gt;</code> as a disclosure button with its expanded or collapsed state. No additional <code>role</code> or <code>aria-expanded</code> is required.</p>
  </div>
</div>

### Focus management

The focus ring follows the standard prose pattern:

- `outline: 2px solid var(--fdic-border-input-focus, #38b6ff)`
- `outline-offset: 2px`
- `border-radius: 2px`
- Applied only on `:focus-visible` to avoid showing focus rings on mouse click

### Content inside details

Expanded content inherits all `.prose` typography styles. Headings, lists, tables, callouts, and code blocks inside `<details>` render identically to their top-level counterparts.

```html
<details>
  <summary>How are coverage limits calculated for trust accounts?</summary>
  <p>Trust accounts are insured based on the number of unique
  beneficiaries, subject to specific rules:</p>
  <ul>
    <li>Each qualifying beneficiary adds up to $250,000 in coverage</li>
    <li>The owner must have an ownership interest in the trust</li>
    <li>Beneficiaries must be natural persons or recognized charities</li>
  </ul>
  <p>For irrevocable trusts, coverage is determined by each
  beneficiary's non-contingent interest.</p>
</details>
```

## Adaptive behavior

### Reduced motion

When `prefers-reduced-motion: reduce` is active, all transitions are suppressed:

- Chevron rotation is instant (no `0.2s` transition)
- Content reveal is instant (no `0.25s` opacity/max-height transition)
- Hover and active box-shadow overlays apply without transition

The component remains fully functional -- only the animated transitions are removed.

### Forced colors (Windows High Contrast)

Under `forced-colors: active`:

- Summary borders use `ButtonText` system color so the interactive boundary remains visible
- Background decorations are removed (the system enforces its own surface colors)
- The chevron icon uses `forced-color-adjust: none` to remain visible since it conveys open/closed state via rotation

### Print

When printing:

- All `<details>` elements are forced open (`details[open]` is not needed -- the print stylesheet sets `display: block` on the content)
- Summary pill backgrounds are removed for clean output
- Chevron icons are hidden since the open/closed distinction is irrelevant on paper
- Content flows naturally in document order

### Responsive

The details component does not have breakpoint-specific overrides at 640px. The summary pill and content area are block-level and naturally adapt to narrow viewports.

## Usage guidance

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Use details for supplementary information that supports but does not replace the main content -- FAQs, procedural steps, regulatory definitions, and eligibility criteria.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not hide critical actions, warnings, or required steps inside a collapsed details element. If the user must see it, it belongs in the visible flow.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Write summary text as a clear question or descriptive label. The user should know what they will find before they expand.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not use vague summary text like "More information" or "Click here." Specific labels improve scanning and assistive technology navigation.</p>
  </div>
</div>
