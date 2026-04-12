# Using Tokens In Your Project

This guide explains the supported consumer path for FDIC Design System tokens in application code, downstream themes, and build pipelines.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Adoption guide</span>
  <p>Use the published token files as your source of truth. Start with the stable stylesheet entrypoint, layer in DTCG JSON only when your tooling needs structured data, and keep overrides scoped to semantic roles instead of hard-coding replacement colors or spacing values.</p>
</div>

## Stable token entrypoints

The token package publishes four supported artifacts:

- `@jflamb/fdic-ds-tokens/styles.css` for the full runtime token surface
- `@jflamb/fdic-ds-tokens/fdic.tokens.json` for DTCG JSON consumption
- `@jflamb/fdic-ds-tokens/interaction.css` for interaction-only token consumption
- `@jflamb/fdic-ds-tokens/semantic.css` as a compatibility alias for the semantic runtime layer

If you are also using the component package, import `@jflamb/fdic-ds-components/styles.css` first. That stylesheet includes the token runtime the components expect.

## Token namespaces

Use `--ds-*` as the canonical token namespace for new system-level adoption. That is the stable surface for colors, spacing, layout, radius, shadows, and gradients.

Typography tokens now also have canonical `--ds-*` declarations:

- `--ds-font-family-*`, `--ds-font-size-*`, `--ds-font-weight-*`
- `--ds-line-height-*`
- `--ds-letter-spacing-*`
- `--ds-heading-padding-*`

The older `--fdic-*` names (`--fdic-font-*`, `--fdic-line-height-*`, `--fdic-letter-spacing-*`, `--fdic-heading-padding-*`) are preserved as **deprecated aliases** that resolve to their `--ds-*` equivalents. Existing code using `var(--fdic-font-size-body)` continues to work, but new code should use `var(--ds-font-size-body)`.

When both namespaces can express the same system concern, always prefer the `--ds-*` token. The `--fdic-*` aliases are scheduled for removal in a future major version.

## CSS adoption

### App-level import

Use a normal stylesheet import when your build system resolves npm CSS entrypoints.

```css
@import "@jflamb/fdic-ds-tokens/styles.css";
```

That gives your authored layout and content access to the stable public token families:

- `--ds-color-*`
- `--ds-spacing-*`
- `--ds-corner-radius-*`
- `--ds-layout-*`
- `--ds-shadow-*`
- `--ds-gradient-*`
- `--fdic-font-*`
- `--fdic-line-height-*`
- `--fdic-letter-spacing-*`
- `--fdic-heading-padding-*`

For new adoption, start with the `--ds-*` families above and add the public `--fdic-*` typography families only when you need explicit type controls.

### Component runtime import

If you are using FDIC Web Components, prefer the component stylesheet instead of importing tokens separately.

```ts
import "@jflamb/fdic-ds-components/styles.css";
import "@jflamb/fdic-ds-components/register-all";
```

That path ensures the components and your page share the same token runtime.

## DTCG JSON consumption

`fdic.tokens.json` follows the W3C DTCG 2025.10 schema and is intended for build tooling, design-token transforms, and downstream platform integration.

```ts
import tokens from "@jflamb/fdic-ds-tokens/fdic.tokens.json" with { type: "json" };

const pageBackground = tokens.color.background.base.value;
const bodyFont = tokens.typography.family.sans.value;
```

Use the JSON export when you need to:

- map design tokens into another platform's token format
- generate CMS theme variables at build time
- inspect token metadata without parsing CSS
- keep a downstream design-token pipeline aligned with the published package

Do not treat the JSON as a second authoring surface. Keep your runtime overrides in CSS custom properties unless your platform strictly requires generated output.

## Override patterns

### Override semantic roles, not component internals

Scope overrides to the smallest boundary that owns the visual change.

```css
.fdic-regional-theme {
  --ds-color-bg-base: #f7fbff;
  --ds-color-bg-surface: #ffffff;
  --ds-color-text-default: #102a43;
  --ds-color-border-strong: #40637a;
}
```

This keeps the component surface intact while letting a downstream product adjust the surrounding theme.

### Prefer semantic token swaps over primitive replacements

Good:

```css
.campaign-shell {
  --ds-color-status-info-bg: #e9f5ff;
  --ds-color-status-info-text: #0f3657;
}
```

Avoid:

```css
.campaign-shell {
  --fd-input-border-color: #0f3657;
  --fd-button-bg: #004a80;
}
```

Undocumented `--fd-*` overrides are not part of the supported contract unless a component page lists them in its public API table.

### Scope by container when you need local variation

```css
.fdic-review-panel {
  --ds-layout-readable-max: 68ch;
  --ds-spacing-3: 0.75rem;
  --ds-spacing-5: 1.5rem;
}
```

This pattern is appropriate for page shells, content panels, and CMS regions that need local adjustments without redefining the entire site.

## Recommended adoption sequence

1. Import `styles.css`.
2. Use the published semantic token families in your app CSS.
3. Reach for documented component-level `--fd-*` hooks only when a component page explicitly documents them.
4. Add the public `--fdic-*` typography families only if your theme needs explicit type overrides.
5. Use `fdic.tokens.json` only when you need structured token data for a build or CMS pipeline.

## Guardrails for downstream teams

- Keep contrast-safe foreground and background pairs together.
- Do not remap status semantics to unrelated brand colors.
- Do not depend on undocumented token names.
- Do not create a parallel alias layer unless you are intentionally managing a migration.
- Do not start new app themes on compatibility-era `--fdic-*` tokens when a `--ds-*` token already covers the same system role.
- Keep token overrides outside component shadow DOM internals.

## Related guidance

- [Customization](/guide/foundations/customization) defines the supported override boundary.
- [Colors](/guide/foundations/colors) documents the semantic color families.
- [Spacing and Layout](/guide/foundations/spacing-layout) documents the public layout token contract.
- [CMS Integration](/guide/cms-integration) shows how to apply these tokens in Drupal and WordPress.
