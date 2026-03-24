# Icon

Icons provide visual cues that reinforce meaning, improve scannability, and support recognition over recall. The `fd-icon` component renders named icons from a registry as inline SVG.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-icon</code> to render icons inline with text, inside buttons, or alongside labels. Icons are decorative by default and hidden from assistive technology — set the <code>label</code> attribute when the icon conveys meaning on its own.</p>
</div>

## When to use

- **You need a visual cue alongside text** — Icons reinforce meaning when paired with labels, such as a warning triangle next to an alert message or a download arrow next to a link.
- **You need to improve scannability** — In navigation, toolbars, or dense lists, icons help the reader locate items faster than text alone.
- **You need an icon-only control** — When space is tight and the action is universally understood (close, search, menu), an icon alone can work — but always provide an accessible label.

## When not to use

- **Don't use icons as the sole means of communication** — If removing the icon makes the interface confusing, you need visible text. Icons are ambiguous across cultures and contexts.
- **Don't use decorative icons excessively** — Every icon competes for attention. If an icon doesn't help the reader understand or act, leave it out.
- **Don't use icons where an illustration or diagram is needed** — Icons are small, symbolic glyphs. Complex concepts need richer visuals.

## Examples

<StoryEmbed
  storyId="components-icon--docs-overview"
  linkStoryId="components-icon--all-icons"
  height="260"
  caption="Overview — decorative, semantic, and control-integrated icon usage in one preview. Open Storybook for the full icon registry."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `` | Registry key for the icon to render. Unknown names render nothing and log a warning. |
| `label` | `string` | `` | Accessible name for semantic standalone icons. When set, `fd-icon` uses `role="img"` and `aria-label` instead of `aria-hidden`. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-icon-size` | `18px` | Inline and block size of the rendered icon |

## Shadow parts

| Name | Description |
|---|---|
| `svg` | Wrapper around the inline SVG markup |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- Icons are **decorative by default** — `fd-icon` sets `aria-hidden="true"` automatically. Screen readers will skip the icon entirely, which is correct when the icon accompanies visible text.
- **Set the `label` attribute for semantic icons** — When an icon conveys meaning that isn't available in surrounding text (e.g., a standalone status indicator), set `label="Description"` on the `fd-icon` element. This adds an accessible name via `aria-label` and removes `aria-hidden`.
- **Don't put labels on icons inside labeled controls** — If the icon is inside an `fd-button` that already has visible text or its own `aria-label`, the icon should remain decorative. Doubling up labels creates redundant announcements.
- In **forced-colors mode** (Windows High Contrast), `fd-icon` continues to inherit `currentColor` from the surrounding text or control. The component does not add a special forced-colors override today, so verify standalone semantic icons in context instead of assuming extra high-contrast treatment.

## Content guidance

- Use the icon name that most closely matches the concept — `warning` for alerts, `info` for informational context, `check-circle` for confirmations.
- Keep the icon set intentional. Not every piece of text needs an icon. Use them where they create genuine recognition advantage.
- When extending the registry with `FdIcon.register()`, follow the same Phosphor Regular weight for visual consistency.

## Customization

- **Size**: Set the `--fd-icon-size` CSS custom property on the element or an ancestor. The default is `18px`.
- **Color**: Icons inherit `currentColor` by default. Set `color` on the element or let it inherit from the parent.
- **Custom icons**: Register additional icons with `FdIcon.register({ name: svgString })` or `FdIcon.register("name", svgString)`. Registered icons are available globally.

## Related components

<ul class="fdic-related-list">
  <li><a href="./button">Button</a> — Buttons accept icons in their <code>icon-start</code> and <code>icon-end</code> slots. Use <code>fd-icon</code> inside these slots.</li>
</ul>
