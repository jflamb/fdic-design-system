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

## Color roles

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Role</span>
    <span>Token prefix</span>
    <span>Usage</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-neutral-500);"></span> Neutral</span>
    <span><code>--ds-color-neutral-*</code></span>
    <span>Text, surfaces, borders, and structural UI</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-primary-500);"></span> Brand</span>
    <span><code>--ds-color-primary-*</code></span>
    <span>Institutional emphasis, key actions, trust markers</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-secondary-500);"></span> Secondary</span>
    <span><code>--ds-color-secondary-*</code></span>
    <span>Supporting emphasis without semantic meaning</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-semantic-fg-success);"></span> Success</span>
    <span><code>--ds-color-success-*</code></span>
    <span>Favorable outcomes, confirmations</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-semantic-fg-warning);"></span> Warning</span>
    <span><code>--ds-color-warning-*</code></span>
    <span>Caution, prevention, review needed</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-semantic-fg-error);"></span> Error</span>
    <span><code>--ds-color-error-*</code></span>
    <span>Errors, destructive actions, serious alerts</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-semantic-fg-info);"></span> Info</span>
    <span><code>--ds-color-info-*</code></span>
    <span>Informational context, guidance</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-text-link);"></span> Link</span>
    <span><code>--ds-color-link-*</code></span>
    <span>Hyperlinks and visited state</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-bg-inverted);"></span> Inverse</span>
    <span><code>--ds-color-*-inverted</code></span>
    <span>Elements on inverted or brand backgrounds</span>
  </div>
  <div class="fdic-roles-row">
    <span><span class="fdic-role-dot" style="background:var(--ds-color-border-input);"></span> Input</span>
    <span><code>--ds-color-border-input-*</code></span>
    <span>Form field borders and interaction states</span>
  </div>
</div>

## Palette tokens

Palette tokens are source values for the system. They should be documented visually, but used sparingly in consumer guidance.

<div class="fdic-palette-ramp">
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Neutral</span>
    <h3>Default system backbone</h3>
    <p>Use the neutral ramp to support text hierarchy, borders, surfaces, and dark-mode mapping.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#FFFFFF; color:#212123;">000</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#FFFFFF</span><span class="fdic-swatch-token">--ds-color-neutral-000</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#FAFAFC; color:#212123;">050</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#FAFAFC</span><span class="fdic-swatch-token">--ds-color-neutral-050</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#F5F5F7; color:#212123;">100</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#F5F5F7</span><span class="fdic-swatch-token">--ds-color-neutral-100</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#E0E0E2; color:#212123;">200</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#E0E0E2</span><span class="fdic-swatch-token">--ds-color-neutral-200</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#D6D6D8; color:#212123;">300</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#D6D6D8</span><span class="fdic-swatch-token">--ds-color-neutral-300</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#BDBDBF; color:#212123;">400</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#BDBDBF</span><span class="fdic-swatch-token">--ds-color-neutral-400</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#9E9EA0; color:#212123;">500</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#9E9EA0</span><span class="fdic-swatch-token">--ds-color-neutral-500</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#595961; color:#FFFFFF;">700</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#595961</span><span class="fdic-swatch-token">--ds-color-neutral-700</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#424244; color:#FFFFFF;">800</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#424244</span><span class="fdic-swatch-token">--ds-color-neutral-800</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#212123; color:#FFFFFF;">900</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#212123</span><span class="fdic-swatch-token">--ds-color-neutral-900</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#000000; color:#FFFFFF;">1000</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#000000</span><span class="fdic-swatch-token">--ds-color-neutral-1000</span></div></div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Primary brand</span>
    <h3>Institutional emphasis</h3>
    <p>Use for key actions, official identifiers, and moments where FDIC ownership should be explicit.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#E6F4FA; color:#003256;">050</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#E6F4FA</span><span class="fdic-swatch-token">--ds-color-primary-050</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#84DBFF; color:#003256;">200</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#84DBFF</span><span class="fdic-swatch-token">--ds-color-primary-200</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#38B6FF; color:#003256;">400</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#38B6FF</span><span class="fdic-swatch-token">--ds-color-primary-400</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#0D6191; color:#FFFFFF;">500</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#0D6191</span><span class="fdic-swatch-token">--ds-color-primary-500</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#09496D; color:#FFFFFF;">700</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#09496D</span><span class="fdic-swatch-token">--ds-color-primary-700</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#073C5B; color:#FFFFFF;">800</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#073C5B</span><span class="fdic-swatch-token">--ds-color-primary-800</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#003256; color:#FFFFFF;">900</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#003256</span><span class="fdic-swatch-token">--ds-color-primary-900</span></div></div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Secondary brand</span>
    <h3>Secondary emphasis</h3>
    <p>Use more sparingly than the primary brand. It should support hierarchy without becoming semantic status color.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#F8EFDA; color:#60511B;">050</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#F8EFDA</span><span class="fdic-swatch-token">--ds-color-secondary-050</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#EBD49B; color:#60511B;">300</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#EBD49B</span><span class="fdic-swatch-token">--ds-color-secondary-300</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#E1C16E; color:#2A2110;">400</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#E1C16E</span><span class="fdic-swatch-token">--ds-color-secondary-400</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#D9AF45; color:#2A2110;">500</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#D9AF45</span><span class="fdic-swatch-token">--ds-color-secondary-500</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#BD9327; color:#212123;">600</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#BD9327</span><span class="fdic-swatch-token">--ds-color-secondary-600</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#88691C; color:#FFFFFF;">800</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#88691C</span><span class="fdic-swatch-token">--ds-color-secondary-800</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#60511B; color:#FFFFFF;">900</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#60511B</span><span class="fdic-swatch-token">--ds-color-secondary-900</span></div></div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Success</span>
    <h3>Favorable outcomes</h3>
    <p>Confirmations, successful submissions, and positive status.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#E8F5E9; color:#1B3A1B;">050</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#E8F5E9</span><span class="fdic-swatch-token">--ds-color-success-050</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#A5D6A7; color:#1B3A1B;">200</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#A5D6A7</span><span class="fdic-swatch-token">--ds-color-success-200</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#2E7D32; color:#FFFFFF;">500</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#2E7D32</span><span class="fdic-swatch-token">--ds-color-success-500</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#1B5E20; color:#FFFFFF;">600</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#1B5E20</span><span class="fdic-swatch-token">--ds-color-success-600</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#204520; color:#FFFFFF;">800</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#204520</span><span class="fdic-swatch-token">--ds-color-success-800</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#1B3A1B; color:#FFFFFF;">900</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#1B3A1B</span><span class="fdic-swatch-token">--ds-color-success-900</span></div></div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Warning</span>
    <h3>Caution and prevention</h3>
    <p>Review steps, potential issues, and time-sensitive guidance.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#FCF7EE; color:#4D2E00;">050</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#FCF7EE</span><span class="fdic-swatch-token">--ds-color-warning-050</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#FFCC80; color:#4D2E00;">200</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#FFCC80</span><span class="fdic-swatch-token">--ds-color-warning-200</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#8B5E00; color:#FFFFFF;">500</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#8B5E00</span><span class="fdic-swatch-token">--ds-color-warning-500</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#6D4A00; color:#FFFFFF;">600</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#6D4A00</span><span class="fdic-swatch-token">--ds-color-warning-600</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#663D00; color:#FFFFFF;">800</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#663D00</span><span class="fdic-swatch-token">--ds-color-warning-800</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#4D2E00; color:#FFFFFF;">900</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#4D2E00</span><span class="fdic-swatch-token">--ds-color-warning-900</span></div></div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Error</span>
    <h3>Problems and destructive actions</h3>
    <p>Validation errors, failed operations, and irreversible actions.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#FDEDEA; color:#331919;">050</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#FDEDEA</span><span class="fdic-swatch-token">--ds-color-error-050</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#F5A3A3; color:#331919;">200</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#F5A3A3</span><span class="fdic-swatch-token">--ds-color-error-200</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#B10B2D; color:#FFFFFF;">500</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#B10B2D</span><span class="fdic-swatch-token">--ds-color-error-500</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#D80E3A; color:#FFFFFF;">600</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#D80E3A</span><span class="fdic-swatch-token">--ds-color-error-600</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#442121; color:#FFFFFF;">800</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#442121</span><span class="fdic-swatch-token">--ds-color-error-800</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#331919; color:#FFFFFF;">900</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#331919</span><span class="fdic-swatch-token">--ds-color-error-900</span></div></div>
    </div>
  </div>
  <div class="fdic-palette-group">
    <span class="fdic-eyebrow">Info</span>
    <h3>Informational context</h3>
    <p>Guidance, context, and non-urgent information.</p>
    <div class="fdic-palette-swatches">
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#F1F8FE; color:#162D4A;">050</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#F1F8FE</span><span class="fdic-swatch-token">--ds-color-info-050</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#90CAF9; color:#162D4A;">200</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#90CAF9</span><span class="fdic-swatch-token">--ds-color-info-200</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#0B4F82; color:#FFFFFF;">500</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#0B4F82</span><span class="fdic-swatch-token">--ds-color-info-500</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#0D4B7A; color:#FFFFFF;">600</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#0D4B7A</span><span class="fdic-swatch-token">--ds-color-info-600</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#1E3A5F; color:#FFFFFF;">800</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#1E3A5F</span><span class="fdic-swatch-token">--ds-color-info-800</span></div></div>
      <div class="fdic-palette-swatch"><div class="fdic-swatch-color" style="background:#162D4A; color:#FFFFFF;">900</div><div class="fdic-swatch-meta"><span class="fdic-swatch-hex">#162D4A</span><span class="fdic-swatch-token">--ds-color-info-900</span></div></div>
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

### Interaction states

Role tokens support state suffixes for interactive elements:

<div class="fdic-state-demo">
  <div class="fdic-state-item">
    <div class="fdic-state-swatch" style="background:var(--ds-color-bg-interactive);">rest</div>
    <code>--ds-color-bg-interactive</code>
  </div>
  <div class="fdic-state-item">
    <div class="fdic-state-swatch" style="background:var(--ds-color-bg-interactive); box-shadow:inset 0 0 0 100px var(--ds-color-bg-hovered);">hovered</div>
    <code>+ -hovered</code>
  </div>
  <div class="fdic-state-item">
    <div class="fdic-state-swatch" style="background:var(--ds-color-bg-interactive); box-shadow:inset 0 0 0 100px var(--ds-color-bg-pressed);">pressed</div>
    <code>+ -pressed</code>
  </div>
  <div class="fdic-state-item">
    <div class="fdic-state-swatch" style="background:var(--ds-color-bg-selected);">selected</div>
    <code>--ds-color-bg-selected</code>
  </div>
  <div class="fdic-state-item">
    <div class="fdic-state-swatch" style="background:var(--ds-color-bg-readonly);">readonly</div>
    <code>--ds-color-bg-readonly</code>
  </div>
</div>

Supported state suffixes: `-hovered`, `-pressed`, `-focused`, `-disabled`, `-readonly`

## Semantic tokens

Semantic tokens are the only color tokens that should carry status meaning.

<div class="fdic-example-grid">
  <div class="fdic-example-card">
    <div class="fdic-example-header">Success</div>
    <div class="fdic-example-body" style="background:var(--ds-color-semantic-bg-success);">
      <p><strong style="color:var(--ds-color-semantic-fg-success);">Your information was submitted.</strong></p>
      <p style="color:var(--ds-color-semantic-fg-success);">Use semantic success tokens only when the message communicates a favorable outcome.</p>
    </div>
  </div>
  <div class="fdic-example-card">
    <div class="fdic-example-header">Warning</div>
    <div class="fdic-example-body" style="background:var(--ds-color-semantic-bg-warning);">
      <p><strong style="color:var(--ds-color-semantic-fg-warning);">Review this section before continuing.</strong></p>
      <p style="color:var(--ds-color-semantic-fg-warning);">Warnings should help prevent mistakes before they become errors.</p>
    </div>
  </div>
  <div class="fdic-example-card">
    <div class="fdic-example-header">Error</div>
    <div class="fdic-example-body" style="background:var(--ds-color-semantic-bg-error);">
      <p><strong style="color:var(--ds-color-semantic-fg-error);">There is a problem with this entry.</strong></p>
      <p style="color:var(--ds-color-semantic-fg-error);">Errors need explicit recovery guidance, not color alone.</p>
    </div>
  </div>
  <div class="fdic-example-card">
    <div class="fdic-example-header">Info</div>
    <div class="fdic-example-body" style="background:var(--ds-color-semantic-bg-info);">
      <p><strong style="color:var(--ds-color-semantic-fg-info);">We ask for this information to protect your account.</strong></p>
      <p style="color:var(--ds-color-semantic-fg-info);">Informational states should add clarity without reading as success or warning.</p>
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
