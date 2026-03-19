# Token Inventory

This document records the current token exports provided from the FDIC Figma file.

It is an inventory and translation aid, not a final implementation spec. The repository is still in scaffold stage, so this note favors traceability and reversibility over locking in package APIs or delivery format.

## Source files

The current token inventory was derived from four Figma export archives supplied by the maintainer:

- `/Users/jlamb/Downloads/_primitives.zip`
- `/Users/jlamb/Downloads/colors.zip`
- `/Users/jlamb/Downloads/metrics.zip`
- `/Users/jlamb/Downloads/typography.zip`

Each archive contains `.tokens.json` files. These exports follow a design-token JSON shape and include Figma metadata under `$extensions.com.figma.*`.

## Token sets and modes

The current exports map to four token sets:

| Token set | Files | Modes observed | Notes |
| --- | --- | --- | --- |
| `_primitives` | `Default.tokens.json` | `Default` | Lowest-level color, spacing, radius, overlay, and effect primitives. |
| `colors` | `Default.tokens.json`, `Dark.tokens.json` | `Default`, `Dark` | Semantic and usage-facing color tokens. |
| `metrics` | `Desktop.tokens.json`, `Mobile.tokens.json` | `Desktop`, `Mobile` | Spacing, radius, width, padding, height, and visual-size tokens. |
| `typography` | `Desktop.tokens.json`, `Mobile.tokens.json` | `Desktop`, `Mobile` | Font families, type sizes, and typography-related spacing. |

Mode names are stored in the exports at:

- `$extensions.com.figma.modeName`

## Current token architecture in Figma

The exported data suggests an emerging three-layer model:

1. Primitives
2. Semantic and usage tokens
3. Contextual metrics and typography tokens

That aligns well with the repo guidance to separate:

- core tokens
- semantic tokens
- component tokens

Component tokens do not appear to be exported yet as a distinct set. Current exports are mostly foundations.

## `_primitives`

Top-level groups observed:

- `_color`
- `_spacing`
- `_corner-radius`
- `_effect`
- `_overlay`

Examples:

- `_color._brand.--primary-500 = #0D6191`
- `_color._brand.--secondary-600 = #BD9327`
- `_color._neutral.--neutral-000 = #FFFFFF`
- `_spacing.--spacing-16 = 16`
- `_corner-radius.--radius-md` is not present by that exact name; the primitive export currently uses numeric labels such as `--radius-5`

Notes:

- This set is the clearest candidate for future `core` tokens.
- The export includes typed values such as `color` and `number`.
- This export includes mode metadata, but scope metadata is less consistently surfaced than in the higher-level token exports.

## `colors`

Top-level groups observed:

- `Brand`
- `Background`
- `Text`
- `Icon`
- `Border`
- `Semantic`
- `Overlay`
- `Effect`

Examples:

- `Brand.Core.Default = #0D6191`
- `Brand.Highlight.Default = #D9AF45`
- `Background.Base = #FFFFFF`
- `Text.Primary`
- `Border.Input.Disabled = #D6D6D8`
- `Semantic.Background.Error = #FDEDEA`
- `Semantic.Foreground.Warning = #F49F00`

This set is the clearest candidate for future `semantic` tokens.

## `metrics`

Top-level groups observed:

- `Spacing`
- `Corner-radius`
- `Width`
- `Padding`
- `Height`
- `Visual`
- `Target`

Examples from the `Desktop` mode:

- `Spacing.md = 16`
- `Spacing.2xl = 32`
- `Corner-radius.md = 5`
- `Width.content-max = 1440`
- `Width.paragraph-max = 720`
- `Padding.section-horizontal = 64`
- `Visual.lg = 48`
- `Visual.Glyph.xl = 28`

Notes:

- `metrics` mixes layout tokens and presentation sizing tokens.
- `Target` is currently a string token set to the active mode label, for example `Desktop`.
- The mode split between `Desktop` and `Mobile` is important and should be preserved in future token delivery.

## `typography`

Top-level groups observed:

- `Font`
- `Spacing`

Examples from the `Desktop` mode:

- `Font.Family.Sans Serif = "Source Sans 3"`
- `Font.Family.Serif = "Lora"`
- `Font.Size.sm = 16`
- `Font.Size.h1 = 40.5`
- `Font.Size.display1 = 60`
- `Font.Padding.h2-top = 48`
- `Spacing.paragraph = {Font.Size.md}`

Notes:

- Typography tokens include aliasing, such as `Spacing.paragraph = {Font.Size.md}`.
- The use of decimals in heading sizes and padding values should be preserved until the implementation layer decides whether rounding is acceptable.

## Scope metadata

Figma scopes are exported in:

- `$extensions.com.figma.scopes`

These scopes are useful because they show how the design file intends tokens to be applied. They should inform documentation and implementation constraints, even if the runtime token package does not expose them directly.

Common scopes observed:

| Scope | Meaning in practice |
| --- | --- |
| `ALL_SCOPES` | General-purpose token with no narrow application restriction in Figma. |
| `FRAME_FILL` | Intended for fills on frames or containers. |
| `SHAPE_FILL` | Intended for fills on shapes or non-text graphic surfaces. |
| `STROKE` | Intended for borders and strokes. |
| `EFFECT_COLOR` | Intended for shadows, overlays, or other effect color usage. |
| `WIDTH_HEIGHT` | Intended for dimensional values such as width, height, or size. |
| `GAP` | Intended for spacing between items. |
| `CORNER_RADIUS` | Intended for border radius values. |
| `FONT_SIZE` | Intended for text size. |
| `TEXT_CONTENT` | Text-related scope exposed by Figma for typography tokens. |
| `PARAGRAPH_SPACING` | Intended for paragraph spacing or text block rhythm. |
| `STROKE_FLOAT` | Numeric stroke-width style usage. |
| `EFFECT_FLOAT` | Numeric values tied to effects. |
| `OPACITY` | Numeric opacity-compatible usage. |

Examples:

- `Background.Base` uses `FRAME_FILL`, `SHAPE_FILL`, `EFFECT_COLOR`
- `Semantic.Foreground.Error` uses `FRAME_FILL`, `SHAPE_FILL`, `STROKE`
- `Spacing.md` uses `WIDTH_HEIGHT`, `GAP`, `STROKE_FLOAT`, `OPACITY`
- `Corner-radius.md` uses `CORNER_RADIUS`
- `Font.Size.h1` uses `TEXT_CONTENT`, `FONT_SIZE`, `PARAGRAPH_SPACING`

## Recommended repo translation

The safest next translation into the repository is:

1. Treat `_primitives` as the source for `core` tokens.
2. Treat `colors` as the source for `semantic` color tokens.
3. Keep `metrics` and `typography` as foundational sets with mode support for `Desktop` and `Mobile`.
4. Delay creation of component tokens until component APIs and anatomy are clearer.

That approach matches the repository guidance:

1. Translate FDIC design decisions into tokens.
2. Define semantics and usage guidance.
3. Define component APIs.
4. Implement components.

## Immediate gaps

The exports are enough to start documentation and future packaging work, but several implementation decisions still need to be made before code generation:

- canonical token naming for published packages
- output format for consumers
- whether modes map to CSS media queries, theme classes, or separate bundles
- whether scope metadata should be preserved in generated artifacts
- how alias resolution should be handled across token sets

## Proposed next step

The next incremental step should be a placeholder `packages/tokens` package that:

- stores the Figma exports in-repo or in normalized source form
- preserves modes
- preserves aliases
- records scope metadata for documentation and tooling
- does not yet commit to a production CSS variable contract
