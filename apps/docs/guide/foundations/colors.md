# Colors

This page documents the color foundations for the FDIC design system.

Color tokens use a three-layer model — palette, role, and semantic — so that consumers can choose the right level of abstraction for their context.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Color foundations</span>
  <p>The color system is organized in three layers: palette, role, and meaning. Most consumers should reach for role or semantic tokens rather than raw palette values.</p>
</div>

## Color anatomy

The token inventory defines three practical layers:

- palette tokens for source color families
- role tokens for where color is applied
- semantic tokens for status and meaning

That maps the current groups into a documentation model:

- `Neutral`
- `Brand`
  - primary brand
  - secondary brand
- `Background`
- `Text`
- `Icon`
- `Border`
- `Semantic`
- `Overlay`
- `Effect`

<div class="fdic-swatch-grid">
  <div class="fdic-swatch-card">
    <div class="fdic-swatch-sample" style="background:#212123; color:#FFFFFF;">Neutral</div>
    <div class="fdic-swatch-meta">
      <span class="fdic-token-label">Neutral palette</span>
      <div class="fdic-token-meta">The default backbone for text, surfaces, borders, and mode support.</div>
    </div>
  </div>
  <div class="fdic-swatch-card">
    <div class="fdic-swatch-sample" style="background:#0D6191; color:#FFFFFF;">Primary brand</div>
    <div class="fdic-swatch-meta">
      <span class="fdic-token-label">Brand primary palette</span>
      <div class="fdic-token-meta">Reserved for institutional emphasis, key actions, and trust markers.</div>
    </div>
  </div>
  <div class="fdic-swatch-card">
    <div class="fdic-swatch-sample" style="background:#D9AF45; color:#2A2110;">Secondary brand</div>
    <div class="fdic-swatch-meta">
      <span class="fdic-token-label">Brand secondary palette</span>
      <div class="fdic-token-meta">Supports secondary emphasis without competing with semantic meaning.</div>
    </div>
  </div>
  <div class="fdic-swatch-card">
    <div class="fdic-swatch-sample" style="background:#FDEDEA; color:#B10B2D;">Semantic</div>
    <div class="fdic-swatch-meta">
      <span class="fdic-token-label">Meaning-bearing colors</span>
      <div class="fdic-token-meta">Success, warning, error, and information states belong in the semantic layer.</div>
    </div>
  </div>
</div>

## Applying color with tokens

<div class="fdic-decision-grid">
  <div class="fdic-decision-step">
    <span class="fdic-eyebrow">Step 1</span>
    <strong>Does the color carry meaning?</strong>
    <p>If yes, use a semantic token such as success, warning, error, or info.</p>
  </div>
  <div class="fdic-decision-step">
    <span class="fdic-eyebrow">Step 2</span>
    <strong>If not, where is it applied?</strong>
    <p>Choose a role token such as <code>background</code>, <code>text</code>, <code>border</code>, or <code>icon</code>.</p>
  </div>
  <div class="fdic-decision-step">
    <span class="fdic-eyebrow">Step 3</span>
    <strong>Use palette tokens only as source values</strong>
    <p>Palette tokens define the system. They are not the first choice for most consumers.</p>
  </div>
</div>

Examples of the naming model:

- palette: <code>--ds-color-neutral-300</code>
- role: <code>--ds-color-text-primary</code>
- semantic: <code>--ds-color-semantic-bg-error</code>

## Palette tokens

Palette tokens are source values for the system. They should be documented visually, but used sparingly in consumer guidance.

<div class="fdic-palette-ramp">
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Neutral</span>
    <h3>Default system backbone</h3>
    <p>Use the neutral ramp to support text hierarchy, borders, surfaces, and dark-mode mapping.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch" style="background:#FFFFFF; color:#212123;">000 #FFFFFF</div>
      <div class="fdic-palette-swatch" style="background:#FAFAFC; color:#212123;">050 #FAFAFC</div>
      <div class="fdic-palette-swatch" style="background:#F5F5F7; color:#212123;">100 #F5F5F7</div>
      <div class="fdic-palette-swatch" style="background:#E0E0E2; color:#212123;">200 #E0E0E2</div>
      <div class="fdic-palette-swatch" style="background:#D6D6D8; color:#212123;">300 #D6D6D8</div>
      <div class="fdic-palette-swatch" style="background:#BDBDBF; color:#212123;">400 #BDBDBF</div>
      <div class="fdic-palette-swatch" style="background:#9E9EA0; color:#FFFFFF;">500 #9E9EA0</div>
      <div class="fdic-palette-swatch" style="background:#595961; color:#FFFFFF;">700 #595961</div>
      <div class="fdic-palette-swatch" style="background:#424244; color:#FFFFFF;">800 #424244</div>
      <div class="fdic-palette-swatch" style="background:#212123; color:#FFFFFF;">900 #212123</div>
      <div class="fdic-palette-swatch" style="background:#000000; color:#FFFFFF;">1000 #000000</div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Primary brand</span>
    <h3>Institutional emphasis</h3>
    <p>Use for key actions, official identifiers, and moments where FDIC ownership should be explicit.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch" style="background:#E6F4FA; color:#003256;">050 #E6F4FA</div>
      <div class="fdic-palette-swatch" style="background:#84DBFF; color:#003256;">200 #84DBFF</div>
      <div class="fdic-palette-swatch" style="background:#38B6FF; color:#003256;">400 #38B6FF</div>
      <div class="fdic-palette-swatch" style="background:#0D6191; color:#FFFFFF;">500 #0D6191</div>
      <div class="fdic-palette-swatch" style="background:#09496D; color:#FFFFFF;">700 #09496D</div>
      <div class="fdic-palette-swatch" style="background:#073C5B; color:#FFFFFF;">800 #073C5B</div>
      <div class="fdic-palette-swatch" style="background:#003256; color:#FFFFFF;">900 #003256</div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Secondary brand</span>
    <h3>Secondary emphasis</h3>
    <p>Use more sparingly than the primary brand. It should support hierarchy without becoming semantic status color.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch" style="background:#F8EFDA; color:#60511B;">050 #F8EFDA</div>
      <div class="fdic-palette-swatch" style="background:#EBD49B; color:#60511B;">300 #EBD49B</div>
      <div class="fdic-palette-swatch" style="background:#E1C16E; color:#60511B;">400 #E1C16E</div>
      <div class="fdic-palette-swatch" style="background:#D9AF45; color:#60511B;">500 #D9AF45</div>
      <div class="fdic-palette-swatch" style="background:#BD9327; color:#FFFFFF;">600 #BD9327</div>
      <div class="fdic-palette-swatch" style="background:#88691C; color:#FFFFFF;">800 #88691C</div>
      <div class="fdic-palette-swatch" style="background:#60511B; color:#FFFFFF;">900 #60511B</div>
    </div>
  </div>
</div>

## Role tokens

Role tokens are the main implementation layer for non-semantic UI.

<div class="fdic-role-map">
  <div class="fdic-role-card">
    <span class="fdic-eyebrow">Background</span>
    <h3>Surface and emphasis</h3>
    <p>Background tokens describe where color sits: base surface, container surface, or brand surface.</p>
    <div class="fdic-role-demo" data-role="background">
      <div class="fdic-bg-demo-row">
        <div class="fdic-bg-demo-swatch" style="background:var(--ds-color-bg-base); border:1px solid var(--ds-color-border-divider);">
          <span>base</span>
        </div>
        <div class="fdic-bg-demo-swatch" style="background:var(--ds-color-bg-container);">
          <span>container</span>
        </div>
        <div class="fdic-bg-demo-swatch" style="background:var(--ds-color-bg-brand); color:var(--ds-color-text-inverted);">
          <span>brand</span>
        </div>
      </div>
    </div>
  </div>
  <div class="fdic-role-card">
    <span class="fdic-eyebrow">Text</span>
    <h3>Reading hierarchy</h3>
    <p>Text tokens should support primary, secondary, inverse, and brand-linked content without weakening readability.</p>
    <div class="fdic-role-demo" data-role="text">
      <strong style="color:var(--ds-color-text-primary);">Primary text</strong>
      <p style="color:var(--ds-color-text-secondary);">Secondary text</p>
      <p style="color:var(--ds-color-text-brand);">Brand-linked text</p>
    </div>
  </div>
  <div class="fdic-role-card">
    <span class="fdic-eyebrow">Border</span>
    <h3>Structure and control states</h3>
    <p>Border tokens define separation, input affordance, and focus visibility.</p>
    <div class="fdic-role-demo" data-role="border">
      <div class="fdic-border-demo-row">
        <div class="fdic-border-demo" style="border:1px solid var(--ds-color-border-divider);">
          <span>divider</span>
        </div>
        <div class="fdic-border-demo" style="border:1px solid var(--ds-color-border-input);">
          <span>input</span>
        </div>
        <div class="fdic-border-demo" style="border:2px solid var(--ds-color-border-input-focus);">
          <span>focus</span>
        </div>
      </div>
    </div>
  </div>
  <div class="fdic-role-card">
    <span class="fdic-eyebrow">Icon</span>
    <h3>Supporting emphasis</h3>
    <p>Icon tokens should align with surrounding text and status cues rather than invent separate meaning.</p>
    <div class="fdic-role-demo" data-role="icon">
      <div class="fdic-chip-row">
        <span class="fdic-chip" style="color:var(--ds-color-icon-primary);">&#9679; primary</span>
        <span class="fdic-chip" style="color:var(--ds-color-icon-secondary);">&#9679; secondary</span>
        <span class="fdic-chip" data-tone="brand">&#9679; brand</span>
      </div>
    </div>
  </div>
</div>

Role token families:

- <code>--ds-color-bg-*</code>
- <code>--ds-color-text-*</code>
- <code>--ds-color-icon-*</code>
- <code>--ds-color-border-*</code>
- <code>--ds-color-overlay-*</code>
- <code>--ds-color-effect-*</code>

## Semantic tokens

Semantic tokens are the only color tokens that should carry status meaning.

<div class="fdic-example-grid">
  <div class="fdic-example-card">
    <div class="fdic-example-header">Success</div>
    <div class="fdic-example-body" style="background:#E8F5E9;">
      <p><strong style="color:#4CAF50;">Your information was submitted.</strong></p>
      <p style="color:#4CAF50;">Use semantic success tokens only when the message communicates a favorable outcome.</p>
    </div>
  </div>
  <div class="fdic-example-card">
    <div class="fdic-example-header">Warning</div>
    <div class="fdic-example-body" style="background:#FCF7EE;">
      <p><strong style="color:#F49F00;">Review this section before continuing.</strong></p>
      <p style="color:#F49F00;">Warnings should help prevent mistakes before they become errors.</p>
    </div>
  </div>
  <div class="fdic-example-card">
    <div class="fdic-example-header">Error</div>
    <div class="fdic-example-body" style="background:#FDEDEA;">
      <p><strong style="color:#B10B2D;">There is a problem with this entry.</strong></p>
      <p style="color:#B10B2D;">Errors need explicit recovery guidance, not color alone.</p>
    </div>
  </div>
  <div class="fdic-example-card">
    <div class="fdic-example-header">Info</div>
    <div class="fdic-example-body" style="background:#F1F8FE;">
      <p><strong style="color:#0776CB;">We ask for this information to protect your account.</strong></p>
      <p style="color:#0776CB;">Informational states should add clarity without reading as success or warning.</p>
    </div>
  </div>
</div>

Semantic token families:

- <code>--ds-color-semantic-bg-success</code> / warning / error / info
- <code>--ds-color-semantic-fg-success</code> / warning / error / info
- <code>--ds-color-semantic-border-success</code> / warning / error / info

<div class="fdic-card-grid">
  <div class="fdic-card">
    <span class="fdic-eyebrow">Do</span>
    <p>Use semantic colors to reinforce meaning that is already communicated by labels, headings, helper text, and icons.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Do not</span>
    <p>Do not use primary or secondary brand colors to imply warning, error, or other status meaning.</p>
  </div>
</div>

## Accessibility in color

Colors alone do not make an interface accessible.

When documenting or implementing color usage, preserve these expectations:

- text and interactive states must meet contrast requirements
- status meaning must not rely on color alone
- focus indicators must remain visible against surrounding surfaces
- disabled and muted states must remain understandable without reducing legibility too far
- semantic colors must remain distinct in both default and dark modes

## Trust and content guidance

This system serves government and financial-sector workflows, so color usage should support clarity and trust.

When semantic colors are used in content:

- pair status colors with text, icons, or labels
- use explicit error, warning, and success wording
- explain sensitive steps with text rather than visual emphasis alone
- avoid decorative color choices that weaken clarity

## Modes

The current exports include `Default` and `Dark` color modes.

Documentation should explain mode behavior at the role-token level:

- the same role token may map to different values by mode
- contrast must hold in every supported mode
- consumers should not hard-code palette values for theme behavior

<div class="fdic-mode-grid">
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="light">
      <div class="fdic-mode-header">Default mode</div>
      <div class="fdic-mode-panel">
        <strong>Role tokens on light surfaces</strong>
        <p style="margin:0.5rem 0 0;">Neutral surfaces and brand emphasis should feel clear, restrained, and document-oriented.</p>
      </div>
    </div>
    <div class="fdic-mode-meta"><code>--ds-color-bg-base</code></div>
  </div>
  <div class="fdic-mode-card">
    <div class="fdic-mode-frame" data-mode="dark" style="background:linear-gradient(135deg, #000000, #212123); color:#FAFAFC;">
      <div class="fdic-mode-header">Dark mode</div>
      <div class="fdic-mode-panel">
        <strong>Role tokens remapped for dark surfaces</strong>
        <p style="margin:0.5rem 0 0;">Dark mode should preserve legibility and focus visibility rather than simply inverting values.</p>
      </div>
    </div>
    <div class="fdic-mode-meta"><code>--ds-color-bg-base</code></div>
  </div>
</div>

## What not to rely on yet

Do not treat current token paths or names as a stable public API.

Do not assume:

- final dark-mode activation strategy
- final semantic naming for all states

## Known gaps

- Semantic hue ramp intermediate steps (200/600/900) are placeholder values pending OKLCH refinement.
- Component-level color tokens are deferred.
- Dark mode activation strategy (media query vs. class toggle) not finalized.
- Contrast validation at the component/pattern level not yet documented.
