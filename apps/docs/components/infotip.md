# Infotip

A small disclosure for supplementary plain-text help.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Supporting primitive</span>
  <p>Use <code>fd-infotip</code> for short supporting explanations that should be available on demand without becoming required instructions. It is the shared InfoTip primitive used by <a href="./label">Label</a> and prose footnote previews.</p>
</div>

## When to use

- **Supplementary definitions** — terms, acronyms, or policy references that help some readers but are not required to complete the task.
- **"Why we ask" explanations** — brief context that supports trust without crowding the label or paragraph.
- **Inline reference previews** — footnotes can use the inline variant to preview citation text while preserving the link to the full note.

## When not to use

- **Don't hide required instructions** — if everyone needs the information, make it visible as hint text or body copy.
- **Don't put interactive content inside an InfoTip** — links, buttons, forms, and rich content need a dialog or another explicit pattern.
- **Don't use it as an error message** — use [Message](./message) for validation feedback.

## Examples

<StoryEmbed
  storyId="supporting-primitives-infotip--playground"
  linkStoryId="supporting-primitives-infotip--playground"
  caption="InfoTip icon button with a plain-text panel"
/>

<StoryEmbed
  storyId="supporting-primitives-infotip--inline-footnote"
  linkStoryId="supporting-primitives-infotip--inline-footnote"
  caption="Inline InfoTip used as a footnote reference preview"
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `` | Plain-text supplementary help shown in the InfoTip panel |
| `label` | `string` | `More information` | Accessible name for the trigger |
| `trigger` | `string` | `` | Visible trigger text. Icon variant falls back to the information icon when empty. |
| `href` | `string \| undefined` | `undefined` | Optional link target. When present, the trigger renders as an anchor instead of a button. |
| `variant` | `"icon" \| "inline"` | `icon` | Visual trigger variant. Use `inline` for text references such as footnotes. |
| `mode` | `"click" \| "hover-focus"` | `click` | Opening behavior. Use `click` for icon toggletips and `hover-focus` for inline references that keep their primary click action. |
| `open` | `boolean` | `false` | Reflects whether the InfoTip panel is currently open |

## Shadow parts

| Name | Description |
|---|---|
| `trigger` | Button or anchor that opens the InfoTip |
| `infotip-trigger` | Compatibility alias for the trigger part |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- The default trigger is a real `<button>` with `aria-expanded`, `aria-controls`, and `aria-describedby`.
- Inline references render as real links when `href` is provided. They keep their primary navigation action while opening the InfoTip on hover or keyboard focus.
- The panel uses `role="tooltip"` and is referenced by `aria-describedby` so assistive technology has a programmatic relationship to the trigger.
- Escape dismisses the panel and returns focus to the trigger.
- Hover/focus panels remain hoverable and persistent while the pointer or focus remains on the trigger or panel.
- The default icon trigger is 36px by 36px. Inline references use the WCAG 2.2 inline-target exception but still provide a 24px visual focus/hover affordance.
- The panel is clamped to the viewport on the inline axis and flips above or below the trigger when needed.

## Known limitations

- InfoTip content is plain text only in v1.
- The inline variant is intended for short reference previews. Use the full footnote or body content for essential information.
- The component uses the Popover API when available and a narrow fallback path for test and older runtime surfaces.

## Related components

- [Label](./label) — uses `fd-infotip` for supplementary field help.
- [Footnotes](./footnotes) — uses the inline variant for citation previews.
- [Message](./message) — use for field helper, warning, success, or error text.
