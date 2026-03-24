# Checkbox Group

Checkbox groups collect related options under one prompt. Use them when several checkboxes answer the same question and need shared context, description, or validation.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-checkbox-group</code> to wrap related <code>fd-checkbox</code> options in a native <code>&lt;fieldset&gt;</code> with a shared <code>&lt;legend&gt;</code>. The group handles vertical or horizontal layout, optional description and error text, and the “select at least one” validation pattern.</p>
</div>

## When to use

- **Several checkboxes answer one prompt** — Communication preferences, account access scopes, notification channels, and similar grouped decisions.
- **The options need shared help text** — Group-level description reduces repetition when the same clarification applies to every option.
- **At least one option is required** — Use group-level validation when the rule is “select one or more.”

## When not to use

- **Don’t use a group for a single checkbox** — A standalone checkbox is simpler and clearer.
- **Don’t use a group when only one option may be selected** — That is a radio-group pattern.
- **Don’t rely on horizontal layout for dense lists** — Horizontal groups are only appropriate for short, low-count option sets.

## Examples

<StoryEmbed
  storyId="components-checkbox-group--docs-overview"
  linkStoryId="components-checkbox-group--playground"
  height="480"
  caption="Checkbox group overview — vertical layout, long-label wrapping, disabled options, and required group messaging. Open Storybook for form validation and horizontal layout examples."
/>

## Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"vertical"` \| `"horizontal"` | `"vertical"` | Layout direction for the checkbox set |
| `required` | `boolean` | `false` | Requires at least one enabled checkbox to be selected |
| `disabled` | `boolean` | `false` | Disables the group and temporarily disables enabled child checkboxes |
| `label` | `string` | `""` | Fallback legend text when no `legend` slot content is provided |

## Slots

| Name | Description |
|------|-------------|
| `legend` | Optional replacement for the authored legend text |
| `description` | Group-level help text announced from the fieldset |
| (default) | One or more `fd-checkbox` children |
| `error` | Group-level validation message shown and announced while invalid |

## Events

| Name | Detail | Description |
|------|--------|-------------|
| `fd-checkbox-group-change` | `{ value: string, values: string[] }` | Fired when the checked set changes. `value` mirrors the first selected value in DOM order. |

Compatibility note:

- `fd-checkbox-group` still fires deprecated `fd-group-change` with `{ checkedValues: string[] }` during the compatibility window.
- New consumer code should listen to `fd-checkbox-group-change`.

## CSS custom properties

| Name | Default | Description |
|------|---------|-------------|
| `--fd-checkbox-group-max-width` | `32rem` | Maximum inline size of the group |
| `--fd-checkbox-group-legend-gap` | `var(--fdic-spacing-xs, 8px)` | Space between the legend and the description or items |
| `--fd-checkbox-group-description-gap` | `var(--fdic-spacing-sm, 12px)` | Space below the description before the checkbox items |
| `--fd-checkbox-group-gap` | `var(--fdic-spacing-sm, 12px)` | Gap between checkbox items |

## Shadow parts

| Name | Description |
|------|-------------|
| `fieldset` | Native fieldset wrapper |
| `legend` | Native legend element |
| `description` | Group-level description wrapper |
| `items` | Container for slotted `fd-checkbox` children |
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
    <h4>Keep the group vertical by default</h4>
    <p>Vertical stacking is easier to scan, especially when labels wrap across multiple lines.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Force wide horizontal layouts for long labels</h4>
    <p>That increases reading effort and can make the question harder to parse.</p>
  </div>
</div>

## Content guidelines

- **Use plain-language legends.**
- **Place required text in the legend.** Example: “Communication preferences (required)”.
- **Use one group-level error message.** For “select at least one” rules, the error belongs to the group, not to every checkbox.

## Accessibility

- `fd-checkbox-group` renders a real native `<fieldset>` and `<legend>` in Shadow DOM.
- Group-level `aria-describedby` is computed. Description text is referenced only when present, and error text is referenced only when present and the group is invalid.
- The group participates in validation through `ElementInternals`, but submits no form value of its own. Individual `fd-checkbox` children submit their own `name` / `value` pairs.
- `checkValidity()` updates and returns validity without revealing invalid state.
- `reportValidity()`, form submit attempts, and focus leaving the logical group after user interaction are visibility boundaries. When the group is invalid at that point, the host gets `data-user-invalid` and the internal `<fieldset>` gets `aria-invalid="true"`.
- `aria-invalid` is present iff `data-user-invalid` is present, and it clears in the same update cycle when the group becomes valid or when the form reset path runs.
- Provide one authored group-level error message in the `error` slot whenever the group can block submission. Missing error copy is incomplete usage even though invalid styling still appears.

## Known limitations

- **Dynamic child disabled toggles while the group is disabled are out of scope in v1** — Set child-specific disabled states before disabling the group or after re-enabling it.
- **Legend, description, and error treatment are still awaiting full Figma comps for all orientations** — The shipped implementation follows the approved proposal and current issue guidance.
- **Manual AT validation remains a release gate** — VoiceOver and NVDA checks are still required for description and error announcement behavior.

## Related components

<ul class="fdic-related-list">
  <li><a href="./checkbox">Checkbox</a> — Use <code>fd-checkbox</code> for standalone consent, acknowledgement, or parent “select all” controls.</li>
</ul>
