# Radio

Radio buttons let users make one explicit selection from a short list of mutually exclusive options. Use them when choosing one answer should clear the others.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-radio</code> for single-choice questions such as preferred contact method, delivery option, or account setting selection. The component keeps a real native radio input in Shadow DOM and mirrors expected radio-group behavior, including same-name selection rules and arrow-key movement.</p>
</div>

## When to use

- **Users must choose one option from a defined set** — Contact method, delivery channel, statement preference, or similar single-choice questions.
- **The options should stay visible for quick comparison** — Radios work well when the full list is short enough to scan without opening a menu.
- **You need a default selection that remains explicit** — A preselected radio still shows all available alternatives.

## When not to use

- **Don’t use radios when users may choose more than one option** — Use checkboxes for independent selections.
- **Don’t use radios for long or collapsing lists** — If the option set is large, a select or combobox pattern is usually easier to scan and navigate.
- **Don’t use a single radio by itself** — Radios are a group decision pattern, even when only one item is marked required.

## Examples

<StoryEmbed
  storyId="components-radio--docs-overview"
  linkStoryId="components-radio--playground"
  height="360"
  caption="Radio overview — default, selected, description, and disabled states. Open Storybook for interactive controls and form examples."
/>

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Write labels that can stand alone</h4>
    <p>Users should understand the consequence of each option without relying on surrounding paragraphs.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Hide the distinction in vague wording</h4>
    <p>If options sound interchangeable, users are more likely to choose the wrong path.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep related radios in one named group</h4>
    <p>Shared names make the options mutually exclusive and keep keyboard movement predictable.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Split one decision across multiple groups</h4>
    <p>Fragmented single-choice questions make validation and screen reader context harder to follow.</p>
  </div>
</div>

## Content guidelines

- **Use sentence case.**
- **Keep labels parallel.** Similar option structures help users compare choices quickly.
- **Use the description slot only for meaningful clarification.** Extra text should explain the difference between options, not repeat the label.

## Accessibility

- `fd-radio` contains a real native `<input type="radio">` as its semantic and interaction foundation.
- Radios with the same `name` behave as one exclusive group even though each control lives in its own Shadow DOM.
- Arrow keys move selection across enabled radios in the same group to preserve expected keyboard behavior.
- When composing a question in page markup, wrap related radios in a native `<fieldset>` with a `<legend>`, and add `role="radiogroup"` when that grouping needs to be announced explicitly by assistive technology.
- The description is linked with `aria-describedby` only when the `description` slot has actual content.
- Required radios participate in constraint validation and use the selected radio value as the submitted form value.

## Known limitations

- **Use [`fd-radio-group`](./radio-group) for shared legends, descriptions, and group-level error presentation** — The grouping component handles fieldset/legend structure, validation, and layout.
- **Native radio tab-order behavior is not fully reproducible across separate shadow roots** — Arrow keys are coordinated, but manual AT verification is still required for tab-stop expectations in grouped usage.
- **No size variants in v1** — The component ships with one accessible default size.
- **Manual AT validation is still required** — Automated checks do not replace VoiceOver and NVDA verification for grouped selection and validation announcements.

## Related components

<ul class="fdic-related-list">
  <li><a href="./radio-group">Radio Group</a> — Use <code>fd-radio-group</code> to wrap related radios with a shared legend, description, and validation.</li>
  <li><a href="./checkbox">Checkbox</a> — Use <code>fd-checkbox</code> when each option is independent and users may select more than one.</li>
</ul>
