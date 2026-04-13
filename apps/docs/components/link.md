# Link

Links navigate people to another location without changing the control into a button-style action. `fd-link` standardizes the FDIC link treatments for inline and standalone navigation while preserving native anchor semantics.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-link</code> when people need a real hyperlink with a consistent FDIC presentation: standard, visited, subtle, or inverted. The component renders a native <code>&lt;a&gt;</code> inside shadow DOM, keeps native link behavior, and adds the repository's safe <code>target="_blank"</code> rel normalization.</p>
</div>

## When to use

- **Inline navigation belongs in running text**. Use `fd-link` inside sentences, paragraphs, helper text, and lightweight standalone references.
- **The destination should remain a true hyperlink**. Screen reader link lists, context menus, modified-click behavior, and browser history all still matter here.
- **You need a deliberate visual treatment**. Use `normal` for default hyperlinks, `subtle` when the surrounding text already carries most of the emphasis, `inverted` on dark surfaces, and `visited` only when the product intentionally needs that visual state.

## When not to use

- **Don't use `fd-link` for primary actions**. If the interaction should feel like "take this action now," use `fd-button` instead.
- **Don't use it as a generic text wrapper**. Supported usage requires a meaningful `href`. If the content does not navigate, it is not a link.
- **Don't treat `visited` as browser-history truth**. In v1 it is an explicit visual treatment, not a history check.
- **Don't stretch it into compound action patterns**. Keep icons supportive and lightweight; if the interaction should feel like a promoted action, use `fd-button` instead.

## Examples

<StoryEmbed
  storyId="components-link--all-variants"
  linkStoryId="components-link--playground"
  caption="FDIC link variants across the shipped small, medium, and large sizes. Open Storybook to swap visual treatments and destinations."
/>

<StoryEmbed
  storyId="components-link--docs-overview"
  linkStoryId="components-link--playground"
  height="220"
  caption="Representative inline usage for normal, visited, subtle, and inverted links. Open Storybook for focus and external-link verification."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `href` | `string \| undefined` | `undefined` | Link destination. Supported usage should provide `href` so the component remains a real hyperlink. |
| `target` | `string \| undefined` | `undefined` | Native link target. |
| `rel` | `string \| undefined` | `undefined` | Native link relationship tokens. When `target="_blank"`, `fd-link` always adds `noopener noreferrer`. |
| `variant` | `"normal"` \| `"visited"` \| `"subtle"` \| `"inverted"` | `normal` | Visual treatment for the hyperlink. |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `md` | Typography scale for the hyperlink. |

- `fd-link` forwards `aria-label`, `aria-labelledby`, and `aria-current` from the host to the internal anchor.
- The `visited` variant is an explicit visual treatment in v1. It does not inspect browser history.
- `subtle` starts without an underline and gains the emphasized underline treatment on hover and focus.

## Slots

| Name | Description |
|---|---|
| (default) | Authored link text. |
| `icon-start` | Optional leading icon for lightweight directional or status cues. |
| `icon-end` | Optional trailing icon for lightweight destination cues such as a caret. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-link-color-normal` | `var(--fdic-color-bg-active, #0d6191)` | Default text color for the normal variant. |
| `--fd-link-color-visited` | `var(--fdic-color-text-link-visited, #855aa5)` | Text color for the visited variant. |
| `--fd-link-color-subtle` | `var(--fdic-color-text-primary, #212123)` | Default text color for the subtle variant before hover or focus. |
| `--fd-link-color-inverted` | `var(--fdic-color-text-inverted, #ffffff)` | Text color for links on dark surfaces. |
| `--fd-link-hover-overlay` | `var(--fdic-color-overlay-hover, rgba(0, 0, 0, 0.04))` | Background overlay used for hover and focus emphasis. |
| `--fd-link-focus-gap` | `var(--fdic-color-bg-input, #ffffff)` | Inner gap color in the focus ring. |
| `--fd-link-focus-ring` | `var(--fdic-color-border-input-focus, #38b6ff)` | Outer focus-ring color. |
| `--fd-link-underline-thickness` | `1px` | Default underline thickness. |
| `--fd-link-underline-thickness-emphasis` | `2px` | Underline thickness on hover and focus. |
| `--fd-link-underline-offset` | `0.12em` | Underline offset from the text baseline. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Internal native `<a>` element. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use descriptive link text</h4>
    <p>Link text should make sense out of context so people know where they are going before they activate it.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use vague labels like "click here"</h4>
    <p>Generic wording forces people to read surrounding copy just to understand the destination.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Reserve subtle links for secondary references</h4>
    <p>Subtle links work best when surrounding copy already establishes the context and the destination is supportive rather than primary.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Hide the only path forward in a subtle link</h4>
    <p>If a link is the main next step, use the standard treatment or a button so it stands out clearly.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use inverted links only on dark surfaces</h4>
    <p>The inverted treatment assumes the surrounding surface already provides the dark contrast needed for white link text.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use inverted links on light backgrounds</h4>
    <p>White link text on a light surface breaks contrast and erodes trust quickly in government and financial contexts.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Write for the destination, not the gesture.</strong>
  <p>People should understand where the link goes without having to inspect nearby copy.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Read the deposit insurance handbook</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Click here</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Keep inline links short and specific.</strong>
  <p>Shorter link text is easier to scan, but it still needs to identify the destination clearly.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Coverage calculator</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Important information you should probably read about coverage limits</p>
    </div>
  </div>
</div>

## Accessibility

- `fd-link` renders a **native `<a>` element** inside shadow DOM. That preserves link semantics for screen readers, link lists, browser context menus, and modified-click navigation.
- Keyboard behavior stays native. Links remain in the **plain tab order** and activate with **Enter**.
- Calling `focus()` on `fd-link` forwards focus to the internal anchor so the visible focus indicator appears on the real interaction target.
- The component forwards `aria-label`, `aria-labelledby`, and `aria-current` from the host to the internal anchor. Use those only when the visible text or navigation context needs them.
- The focus treatment uses the repository's dual-ring pattern so the link remains visible on both light and dark surfaces.
- `target="_blank"` automatically adds `rel="noopener noreferrer"` and preserves any extra rel tokens you pass.
- `subtle` links still rely on more than color alone: they gain an underline on hover and focus. Keep surrounding copy explicit so the link remains discoverable.

## Known limitations

- **Four sizes in v1**. Use `h3` only when the link is the actual interactive text inside a semantic `h3` heading. Keep `sm`, `md`, and `lg` for inline or standalone links outside heading markup.
- **Icons stay secondary.** `fd-link` supports lightweight leading and trailing icons, but it is still a text-first hyperlink. If the interaction should read like a promoted action, use `fd-button` instead.
- **`visited` is explicit, not browser-owned.** The `visited` variant is a deterministic visual treatment for the shipped component surface. It does not inspect browser history.

## Related components

<ul class="fdic-related-list">
  <li><a href="./button">Button</a> — Use <code>fd-button</code> when the interaction should feel like an action rather than inline navigation.</li>
  <li><a href="../guide/foundations/typography">Typography foundations</a> — Review the baseline content-link guidance, including link wording and prose behavior.</li>
  <li><a href="./alert">Alert</a> — Use authored links inside <code>fd-alert</code> body content when people need a recovery path or supporting destination.</li>
</ul>
