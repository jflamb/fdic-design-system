# Tokens

This page documents the current token exports from the FDIC Figma file.

It is intentionally focused on inventory and usage guidance, not a final package API. The repository is still in scaffold stage, so token documentation should stay plain and easy to revise as the implementation takes shape.

## Current token sets

The current Figma exports are organized into four sets:

- `_primitives`
- `colors`
- `metrics`
- `typography`

## Current modes

The current exports include these modes:

- `_primitives`: `Default`
- `colors`: `Default`, `Dark`
- `metrics`: `Desktop`, `Mobile`
- `typography`: `Desktop`, `Mobile`

## Intended use

Use these exports as the current source of truth for:

- foundational color values
- semantic color assignments
- spacing and measurement scales
- typography families and type scales

These exports are a good basis for documenting component behavior and layout constraints before the repo publishes a formal token package.

## When not to use

Do not treat the current export filenames or token object shape as a stable public API yet.

Do not assume:

- final CSS custom property names
- final package boundaries
- final mode-delivery strategy
- final component token names

## Token groups

### Primitives

The `_primitives` export contains low-level values such as:

- raw brand, neutral, semantic, background, and link colors
- spacing increments
- corner radii
- overlay values
- effect values

Examples:

- `_color._brand.--primary-500`
- `_spacing.--spacing-16`
- `_corner-radius.--radius-5`

### Colors

The `colors` export contains more usage-facing tokens such as:

- `Brand`
- `Background`
- `Text`
- `Icon`
- `Border`
- `Semantic`
- `Overlay`
- `Effect`

Examples:

- `Background.Base`
- `Text.Primary`
- `Border.Input.Disabled`
- `Semantic.Background.Error`

### Metrics

The `metrics` export contains layout and measurement tokens such as:

- `Spacing`
- `Corner-radius`
- `Width`
- `Padding`
- `Height`
- `Visual`

Examples:

- `Spacing.md`
- `Width.content-max`
- `Padding.section-horizontal`

### Typography

The `typography` export contains font and type-scale tokens such as:

- `Font.Family.Sans Serif`
- `Font.Family.Serif`
- `Font.Size.h1`
- `Font.Size.display1`
- `Spacing.paragraph`

## Scope metadata

The exports also include Figma scope metadata. That metadata describes how tokens are intended to be used inside the design file.

Examples:

- background tokens may be scoped to `FRAME_FILL` and `SHAPE_FILL`
- border tokens may include `STROKE`
- spacing tokens may include `WIDTH_HEIGHT` and `GAP`
- typography size tokens may include `FONT_SIZE` and `PARAGRAPH_SPACING`

This metadata is useful for documentation because it helps explain intended usage and helps avoid applying a token in the wrong context.

## Accessibility notes

Tokens alone do not guarantee accessibility.

When these tokens are used in components or page patterns, documentation still needs to explain:

- required color contrast outcomes
- text sizing expectations
- zoom and reflow behavior
- focus indicator treatment
- error, warning, and success usage

## Content guidance

When semantic tokens are used in public-service content:

- prefer plain language labels
- do not rely on color alone to communicate meaning
- pair status colors with text, icons, or other explicit cues
- document why sensitive information is requested in high-trust workflows

## Known limitations

- The repo does not yet publish a formal token package.
- Component tokens are not yet documented as a separate layer.
- The current documentation is based on exported Figma token files and may change as the design file evolves.

## Internal reference

For the fuller inventory and implementation notes, see [docs/architecture/token-inventory.md](/Users/jlamb/Projects/fdic-design-system/docs/architecture/token-inventory.md).
