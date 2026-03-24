# Radio Group

Radio groups collect mutually exclusive options under one prompt. Use them when several radios answer the same question and need shared context, description, or validation.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-radio-group</code> to wrap related <code>fd-radio</code> options in a native <code>&lt;fieldset&gt;</code> with a shared <code>&lt;legend&gt;</code>. The group handles vertical or horizontal layout, optional description and error text, and the "select one" validation pattern.</p>
</div>

## When to use

- **Several radios answer one prompt** — Preferred contact method, delivery channel, account type, statement frequency, and similar single-choice decisions.
- **The options need shared help text** — Group-level description reduces repetition when the same clarification applies to every option.
- **One selection is required** — Use group-level validation when the rule is "choose exactly one."

## When not to use

- **Don't use a group for a single radio** — A single option with no alternatives is not a meaningful radio group.
- **Don't use a group when users may select more than one option** — That is a checkbox-group pattern.
- **Don't rely on horizontal layout for dense lists** — Horizontal groups are only appropriate for short, low-count option sets.

## Examples

<StoryEmbed
  storyId="components-radio-group--docs-overview"
  linkStoryId="components-radio-group--playground"
  height="560"
  caption="Radio group overview — vertical layout, long-label wrapping, disabled options, and required group messaging. Open Storybook for form validation and horizontal layout examples."
/>

## Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | Layout direction for the radio set |
| `required` | `boolean` | `false` | Requires one enabled radio to be selected |
| `disabled` | `boolean` | `false` | Disables the group and temporarily disables enabled child radios |
| `label` | `string` | `""` | Fallback legend text when no `legend` slot content is provided |

## Slots

| Name | Description |
|------|-------------|
| `legend` | Optional replacement for the authored legend text |
| `description` | Group-level help text announced from the fieldset |
| (default) | One or more `fd-radio` children |
| `error` | Group-level validation message shown and announced while invalid |

## Events

| Name | Detail | Description |
|------|--------|-------------|
| `fd-radio-group-change` | `{ value: string }` | Fired when the selected radio changes |

Compatibility note:

- `fd-radio-group` still fires deprecated `fd-group-change` with `{ selectedValue: string }` during the compatibility window.
- New consumer code should listen to `fd-radio-group-change`.

## CSS custom properties

| Name | Default | Description |
|------|---------|-------------|
| `--fd-radio-group-max-width` | `32rem` | Maximum inline size of the group |
| `--fd-radio-group-legend-gap` | `var(--fdic-spacing-xs, 8px)` | Space between the legend and the description or items |
| `--fd-radio-group-description-gap` | `var(--fdic-spacing-sm, 12px)` | Space below the description before the radio items |
| `--fd-radio-group-gap` | `var(--fdic-spacing-sm, 12px)` | Gap between radio items |

## Shadow parts

| Name | Description |
|------|-------------|
| `fieldset` | Native fieldset wrapper |
| `legend` | Native legend element |
| `description` | Group-level description wrapper |
| `items` | Container for slotted `fd-radio` children |
| `error` | Group-level error message wrapper |

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Write the legend as a full prompt</h4>
    <p>The legend should make sense before the user reads any individual option labels.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use the legend as a vague heading</h4>
    <p>Generic headings make the user scan every option just to understand the question.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Include "(required)" in the legend text</h4>
    <p>Making the requirement visible in the legend avoids relying on color or symbols alone.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use required without providing an error message</h4>
    <p>Provide an <code>error</code> slot whenever the group is required so screen reader users hear the validation message inline. Without it, only the browser's native validation tooltip is available.</p>
  </div>
</div>

## Content guidelines

- **Use plain-language legends.**
- **Place required text in the legend.** Example: "Preferred contact method (required)".
- **Provide one group-level error message.** The error belongs to the group, not to individual radios.
- **When the choice affects legal notices or regulated content**, explain the consequence of each option in the description — not just the mechanics.

## Accessibility

- `fd-radio-group` renders a real native `<fieldset>` and `<legend>` in Shadow DOM.
- Group-level `aria-describedby` is computed. Description text is referenced only when present, and error text is referenced only when present and the group is invalid.
- The group participates in validation through `ElementInternals`, but submits no form value of its own. Individual `fd-radio` children submit their own `name` / `value` pairs.
- Arrow-key navigation between radios is coordinated by `fd-radio`. Disabled radios are skipped during arrow movement.
- `checkValidity()` updates and returns validity without revealing invalid state.
- `reportValidity()`, form submit attempts, and focus leaving the logical group after user interaction reveal invalid state when the group is invalid. The host gets `data-user-invalid` and the internal `<fieldset>` gets `aria-invalid="true"`.
- `aria-invalid` is present iff `data-user-invalid` is present, and it clears in the same update cycle when the group becomes valid or when the form reset path runs.
- Provide one authored group-level error message in the `error` slot whenever the group can block submission. Missing error copy is incomplete usage even though invalid styling still appears.

## Known limitations

- **Native radio group tab-stop behavior is not fully reproducible across separate shadow roots** — Arrow-key navigation is coordinated by `fd-radio`, but Tab behavior depends on the browser's treatment of shadow-separated inputs. Manual AT verification (NVDA, JAWS, VoiceOver) is required before release.
- **Group container structure is derived from `fd-checkbox-group`, not from a distinct radio-group Figma comp** — The individual radio anatomy is Figma-backed; group chrome follows the checkbox-group pattern for consistency.
- **Dynamic child disabled toggles while the group is disabled are out of scope in v1** — Set child-specific disabled states before disabling the group or after re-enabling it.
- **Automatic `name` propagation is deferred** — Consumers must set `name` on each `fd-radio` child. The group warns at dev time if names are empty or mismatched.

## Related components

<ul class="fdic-related-list">
  <li><a href="./radio">Radio</a> — Use <code>fd-radio</code> for the individual radio control that <code>fd-radio-group</code> wraps.</li>
  <li><a href="./checkbox-group">Checkbox Group</a> — Use <code>fd-checkbox-group</code> when users may select more than one option.</li>
</ul>
