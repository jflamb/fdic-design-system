# File Input

A file-upload control for selecting supporting documents by browsing or dragging files into a bounded upload area.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-file-input</code> when a task genuinely requires supporting files and the user benefits from clear restrictions, visible upload states, and predictable follow-up actions.</p>
</div>

## When to use

- **Required supporting documents** — identity verification, supporting evidence, or correspondence attachments.
- **Short batches of files** — when users may attach one or a few files and benefit from drag-and-drop as an optional shortcut.
- **Upload workflows that need visible file state** — such as uploading, uploaded, failed, or invalid rows managed by the host application.

## When not to use

- **Optional documents** — avoid asking for uploads unless the service genuinely needs them.
- **Large or advanced transfer workflows** — resumable uploads, background sync, directory upload, or preview-heavy media workflows need a dedicated uploader pattern.
- **Many separate document requirements** — if each document has a distinct meaning, use a dedicated upload step or one input per requirement instead of a generic multi-file bucket.

## Examples

<StoryEmbed
  storyId="components-file-input--docs-overview"
  linkStoryId="components-file-input--playground"
  height="1700"
  caption="File input states — empty, drag target, files attached, mixed row states, and limit reached. Open Storybook for interactive controls."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `` | Form field name used when accepted files are submitted. |
| `label` | `string` | `` | Visible field label rendered inside the container. |
| `hint` | `string` | `` | Persistent plain-language guidance for accepted file types, counts, or sizes. |
| `buttonText` | `string` | `DEFAULT_SELECT_LABEL` | Text shown on the browse affordance over the native file input. |
| `dropText` | `string` | `DEFAULT_DROP_TEXT` | Supporting drag-and-drop instruction shown next to the browse affordance. |
| `errorMessage` | `string` | `` | Authored field-level error copy shown when the component reveals invalid state. |
| `limitText` | `string` | `DEFAULT_LIMIT_MESSAGE` | Informational message shown when `maxFiles` has been reached. |
| `required` | `boolean` | `false` | Requires at least one accepted file before the field is valid. |
| `disabled` | `boolean` | `false` | Disables browse, drop, and row actions. |
| `multiple` | `boolean` | `false` | Allows multiple accepted files and repeated selection up to `maxFiles`. |
| `accept` | `string` | `` | Native accept filter used for browse selection and mirrored during drop validation. |
| `maxFiles` | `number \| undefined` | `undefined` | Maximum number of accepted files allowed at one time. |
| `maxFileSize` | `number \| undefined` | `undefined` | Maximum file size in bytes for any accepted file. |
| `items` | `FileInputItem[]` | `[]` | Property-only row model for authored upload states such as `uploading`, `success`, `error`, and `invalid`. |

- `items` is a property-only API. Set it from JavaScript rather than authoring it as an HTML attribute.
- Accepted files remain the source of truth for form submission, `required`, and `maxFiles` behavior even when `items` is provided.

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-file-input-change` | `{ files: File[]; rejectedFiles: FileInputRejectedFile[] }` | Fired after browse or drop selection is processed. Includes accepted files and local validation rejections. |
| `fd-file-input-action` | `{ action: "cancel" \| "remove" \| "retry" \| "dismiss"; itemId: string }` | Fired when the user activates a per-file row action. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-file-input-gap` | `var(--fdic-spacing-md, 16px)` | Vertical gap between the main content blocks inside the container. |
| `--fd-file-input-radius` | `var(--fdic-corner-radius-md, 5px)` | Outer container corner radius. |
| `--fd-file-input-border-color` | `var(--ds-color-border-input, #bdbdbf)` | Container border color at rest. |
| `--fd-file-input-border-color-hover` | `var(--ds-color-border-input-active, #424244)` | Container border color for hover and drag-target emphasis. |
| `--fd-file-input-background` | `var(--ds-color-bg-base, #ffffff)` | Container background color. |
| `--fd-file-input-focus-ring` | `var(--ds-color-border-input-focus, #38b6ff)` | Outer focus glow color when the internal input is focused. |
| `--fd-file-input-drop-overlay` | `var(--ds-color-overlay-hover, rgba(0, 0, 0, 0.04))` | Overlay color used for the active drop-target state. |
| `--fd-file-input-item-border-color` | `var(--ds-color-border-input-interactive, #e8e8ed)` | Border color for file rows. |
| `--fd-file-input-progress-color` | `var(--ds-color-border-input-focus, #38b6ff)` | Indicator color for `uploading` rows. |

## Shadow parts

| Name | Description |
|---|---|
| `container` | Outer upload container. |
| `label` | Visible field label. |
| `browse-button` | Visual chrome for the browse affordance that overlays the native file input. |
| `native` | Internal native `<input type="file">`. |
| `drop-text` | Visible drag-and-drop instruction text. |
| `hint` | Persistent guidance text. |
| `error` | Field-level error message. |
| `limit` | Limit-reached informational message. |
| `summary` | Fallback selected-file summary when no authored rows are provided. |
| `list` | List wrapper for authored file rows. |
| `item` | Individual file row. |
| `item-status` | Per-file status text and icon wrapper. |
| `item-action` | Per-file action button. |
| `live-region` | Screen-reader-only announcement region for drop and selection status. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Explain file restrictions in plain language</h4>
    <p>Tell users which file types are accepted, how many files they may attach, and the size limit before they choose a file.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Rely on <code>accept</code> alone</h4>
    <p>File-picker filtering is not enough guidance. Keep restrictions visible in the UI.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep upload state visible</h4>
    <p>Show users which files are uploading, succeeded, failed, or invalid so they know what needs attention.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Hide failure behind a generic error</h4>
    <p>Use clear status text like “Upload failed” or “Invalid file type” instead of vague warnings.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Prefer one file per input unless batching is expected</h4>
    <p>Small, explicit upload requirements are easier for users to understand and recover from.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Treat drag-and-drop as required</h4>
    <p>Drag-and-drop is optional enhancement. The browse path must remain the primary reliable path.</p>
  </div>
</div>

## Content guidelines

- **State the need clearly.** If the document is sensitive or high-stakes, explain why the service needs it.
- **Use explicit action labels.** “Select file” is clearer before a file is chosen than “Upload”.
- **Keep limit text calm and specific.** For example: “All set! You’ve reached the file upload limit.”
- **Avoid implying storage success too early.** Only show “Upload successful” after the host workflow has actually accepted the file.
- **Prefer one file per input** unless users routinely attach a small set of related files. This matches USWDS guidance and reduces confusion around multi-select gestures.

## Accessibility

- `fd-file-input` keeps a real internal <code>&lt;input type="file"&gt;</code> as the semantic foundation.
- **Progressive enhancement:** browsing remains available even if drag-and-drop is unsupported or ignored.
- **Labeling:** the component owns its visible label and hint text internally.
- **Description wiring:** the internal file input owns <code>aria-describedby</code> for hint text, visible field-level error text, and live-region announcements.
- **Invalid state:** the host uses <code>data-user-invalid</code> for visible invalid styling, while the internal input gets <code>aria-invalid="true"</code> only when that visible invalid state is active.
- **Keyboard:** users can tab to the browse control and any row actions. Drag-and-drop is never required for keyboard completion.
- **Color independence:** every file row includes visible status text in addition to status color and indicator lines.
- **Forced colors and reduced motion:** the component preserves borders, focus treatment, and readable state cues in those modes.

## Known limitations

- `fd-file-input` does **not** own network upload transport. The host application is responsible for actual upload lifecycle, retry behavior, and persistence.
- The `items` row model is a **property-only** API. Set it from JavaScript rather than markup.
- When you provide `items`, keep them aligned with the accepted files that should remain visible to the user.
- v1 does not support previews, directory upload, paste-to-upload, chunked uploads, or drag-only workflows.

## Related components

- [Input](/components/input) — single-line text entry and field-level validation patterns
- [Field](/components/field) — supporting composition helper for `fd-label`, `fd-input`, and `fd-message`
- [Message](/components/message) — standalone supporting primitive for validation and helper messaging
