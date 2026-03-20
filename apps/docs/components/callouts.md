# Callouts

Callouts draw attention to important information within prose content — regulatory notes, compliance warnings, confirmation messages, and critical alerts.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>The <code>.prose-callout</code> component uses a flex layout with an icon and content area. Five variants map to different levels of urgency and meaning, each with its own color treatment, icon, and ARIA role.</p>
</div>

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

## Variants

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Default</span>
    <h3>.prose-callout</h3>
    <p>General-purpose notes and supplementary context. Uses the Phosphor Lightbulb icon with neutral container styling.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Info</span>
    <h3>.prose-callout-info</h3>
    <p>Guidance, clarification, and non-urgent context. Uses the Phosphor Info icon with blue tinting.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Warning</span>
    <h3>.prose-callout-warning</h3>
    <p>Caution, deadlines, and conditions that require review before proceeding. Uses the Phosphor Warning icon with yellow tinting.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Success</span>
    <h3>.prose-callout-success</h3>
    <p>Confirmations, completed actions, and favorable outcomes. Uses the Phosphor CheckCircle icon with green tinting.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Danger</span>
    <h3>.prose-callout-danger</h3>
    <p>Errors, irreversible actions, and serious alerts. Uses the Phosphor WarningOctagon icon with red tinting.</p>
  </div>
</div>

## Anatomy

Each callout is a flex container with two children: an icon span and a content wrapper. The icon is purely decorative and hidden from assistive technology. The outer element carries the ARIA role and label.

<div class="fdic-anatomy">
  <div class="fdic-anatomy-panel fdic-doc-card-copy">
    <span class="fdic-eyebrow">Structure</span>
    <h3>Flex layout</h3>
    <p>The icon sits at the start of the flex row. The content area fills the remaining space and can contain any block-level prose elements — paragraphs, lists, code blocks, or nested callouts.</p>
  </div>
  <div class="fdic-anatomy-panel fdic-doc-card-copy">
    <span class="fdic-eyebrow">Icons</span>
    <h3>Phosphor regular weight</h3>
    <p>All icons are embedded as inline SVG data URIs in CSS <code>background-image</code>. Icon fill colors are hardcoded in the SVG to match each variant's semantic color. No external icon dependencies.</p>
  </div>
</div>

## HTML pattern

The markup follows a consistent structure across all five variants. Swap the modifier class, `role`, and `aria-label` to match the variant.

```html
<!-- Default callout -->
<div class="prose-callout" role="note" aria-label="Note">
  <span class="prose-callout-icon" aria-hidden="true"></span>
  <div class="prose-callout-content">
    <p>Deposit insurance coverage is determined by the ownership
    category of the depositor's accounts, not by the number of
    accounts held.</p>
  </div>
</div>

<!-- Info variant -->
<div class="prose-callout prose-callout-info" role="note"
     aria-label="Information">
  <span class="prose-callout-icon" aria-hidden="true"></span>
  <div class="prose-callout-content">
    <p>The standard maximum deposit insurance amount is $250,000
    per depositor, per insured bank, for each account ownership
    category.</p>
  </div>
</div>

<!-- Warning variant -->
<div class="prose-callout prose-callout-warning" role="note"
     aria-label="Warning">
  <span class="prose-callout-icon" aria-hidden="true"></span>
  <div class="prose-callout-content">
    <p>If your combined deposits at a single institution exceed
    $250,000, amounts above the limit may not be insured. Review
    your account ownership categories before the reporting deadline.</p>
  </div>
</div>

<!-- Success variant -->
<div class="prose-callout prose-callout-success" role="note"
     aria-label="Success">
  <span class="prose-callout-icon" aria-hidden="true"></span>
  <div class="prose-callout-content">
    <p>Your Call Report has been submitted and accepted. A
    confirmation number has been sent to the contact email on file.</p>
  </div>
</div>

<!-- Danger variant -->
<div class="prose-callout prose-callout-danger" role="status"
     aria-label="Danger">
  <span class="prose-callout-icon" aria-hidden="true"></span>
  <div class="prose-callout-content">
    <p>This action will permanently close the account and cannot
    be reversed. All associated records will be archived according
    to retention policy.</p>
  </div>
</div>
```

## Variant reference

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Variant</span>
    <span>ARIA role</span>
    <span>Icon</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>.prose-callout</code></span>
    <span><code>role="note"</code></span>
    <span>Phosphor Lightbulb</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>.prose-callout-info</code></span>
    <span><code>role="note"</code></span>
    <span>Phosphor Info</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>.prose-callout-warning</code></span>
    <span><code>role="note"</code></span>
    <span>Phosphor Warning</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>.prose-callout-success</code></span>
    <span><code>role="note"</code></span>
    <span>Phosphor CheckCircle</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>.prose-callout-danger</code></span>
    <span><code>role="status"</code></span>
    <span>Phosphor WarningOctagon</span>
  </div>
</div>

## Color tokens

Callout colors use a transparency-based approach — 8% opacity for backgrounds and 25% (or 30%) for borders. This keeps the callouts visually light while maintaining clear distinction between variants.

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Token</span>
    <span>Value</span>
    <span>Usage</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-bg</code></span>
    <span>Container default</span>
    <span>Default callout background</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-border</code></span>
    <span>Divider default</span>
    <span>Default callout border</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-info-bg</code></span>
    <span><code>rgba(18, 120, 176, 0.08)</code></span>
    <span>Info background</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-info-border</code></span>
    <span><code>rgba(18, 120, 176, 0.25)</code></span>
    <span>Info border</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-warning-bg</code></span>
    <span><code>rgba(180, 140, 20, 0.08)</code></span>
    <span>Warning background</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-warning-border</code></span>
    <span><code>rgba(180, 140, 20, 0.25)</code></span>
    <span>Warning border</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-success-bg</code></span>
    <span><code>rgba(30, 130, 50, 0.08)</code></span>
    <span>Success background</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-success-border</code></span>
    <span><code>rgba(30, 130, 50, 0.3)</code></span>
    <span>Success border</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-danger-bg</code></span>
    <span><code>rgba(190, 40, 40, 0.08)</code></span>
    <span>Danger background</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>--fdic-callout-danger-border</code></span>
    <span><code>rgba(190, 40, 40, 0.25)</code></span>
    <span>Danger border</span>
  </div>
</div>

Each variant also applies its own tinted selection color so that text selection within the callout is visually consistent with the callout's color scheme.

## Accessibility

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">ARIA roles</span>
    <h3>role="note" or role="status"</h3>
    <p>All variants use <code>role="note"</code> except danger, which uses <code>role="status"</code>. The <code>aria-label</code> attribute must match the variant name so screen readers announce the callout's purpose.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Decorative icons</span>
    <h3>aria-hidden="true"</h3>
    <p>The <code>.prose-callout-icon</code> span is marked <code>aria-hidden="true"</code> because it is decorative. The icon's meaning is conveyed by the ARIA label on the container, not by the icon itself.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Color independence</span>
    <h3>Do not rely on color alone</h3>
    <p>Each variant includes a distinct icon shape and should be paired with text that communicates the message's urgency. Color reinforces meaning but does not carry it independently.</p>
  </div>
</div>

### Required attributes

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">ARIA role</span>
    <p>Use <code>role="note"</code> for default, info, warning, and success. Use <code>role="status"</code> for danger.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">aria-label</span>
    <p>The label should match the variant: "Note", "Information", "Warning", "Success", or "Danger".</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Icon visibility</span>
    <p>Always include <code>aria-hidden="true"</code> on the <code>.prose-callout-icon</code> span to hide it from assistive technology.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Content independence</span>
    <p>The callout text should be understandable without seeing the icon or background color.</p>
  </div>
</div>

## Forced-colors mode

In Windows High Contrast and other forced-colors environments:

- Callout backgrounds are overridden by the system. Borders remain visible using system color keywords.
- Icons use `forced-color-adjust: none` so they remain visible and distinguishable. Without this, the system may strip the embedded SVG fill colors.
- The distinct icon shapes for each variant ensure that meaning is preserved even when color is removed.

## Print behavior

When the page is printed:

- Callout background colors are removed to save ink and ensure legibility on paper.
- Borders are retained at `#999` to preserve the callout's visual boundary.
- Icons are hidden because they are CSS background images and do not reproduce reliably in print.
- The callout content remains fully visible and readable.

<div class="fdic-card-grid">
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do</span>
    <p>Use callouts to highlight regulatory requirements, filing deadlines, confirmation of completed actions, or irreversible operations that need explicit acknowledgment.</p>
  </div>
  <div class="fdic-card fdic-doc-card-copy">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not use callouts for general body content, decorative emphasis, or information that does not require special attention. Overuse dilutes their impact.</p>
  </div>
</div>
