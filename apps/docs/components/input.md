# Input

A text input field for user-entered text, with support for labels, hints, error states, and character limits.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-input</code> with <code>fd-label</code> and <code>fd-message</code> to build accessible form fields with labeling, description text, validation messages, and character counting.</p>
</div>

## When to use

- **Single-line text entry** — names, account numbers, email addresses, phone numbers, search terms.
- **Fields that need validation feedback** — error, warning, or success states with an associated message.
- **Fields with character limits** — comments, descriptions, or other bounded text entry.
- **Any form field requiring an accessible label + hint + error message pattern.**

## When not to use

- **Multi-line text** — use a future `fd-textarea` component instead.
- **Structured selection** — use `fd-selector` for dropdown/select patterns.
- **Toggle/boolean input** — use `fd-checkbox` or `fd-radio-group`.
- **Numeric identifiers** — do not use `type="number"` for routing numbers, account numbers, ZIP codes, or SSNs. Use `type="text"` with `inputmode="numeric"` instead.

## Examples

<StoryEmbed
  storyId="components-input--docs-overview"
  linkStoryId="components-input--playground"
  height="1200"
  caption="Input variants — default, with description, error state, character count, disabled, read-only, prefix icon, and fd-field composition. Open Storybook for interactive controls."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `type` | `"text"` \| `"email"` \| `"password"` \| `"tel"` \| `"url"` \| `"search"` | `text` | Native input type passed through to the internal `<input>` |
| `name` | `string` | `` | Submitted form field name |
| `value` | `string` | `` | Current input value |
| `placeholder` | `string \| undefined` | `undefined` | Optional placeholder text. Use for examples, not as the visible label. |
| `disabled` | `boolean` | `false` | Prevents editing and submission |
| `readonly` | `boolean` | `false` | Prevents editing while keeping the value focusable and selectable |
| `required` | `boolean` | `false` | Marks the field as required for constraint validation |
| `maxlength` | `number \| undefined` | `undefined` | Maximum character count. Also enables the built-in character counter. |
| `minlength` | `number \| undefined` | `undefined` | Minimum length requirement passed through to the native input |
| `pattern` | `string \| undefined` | `undefined` | Regular expression pattern passed through to the native input |
| `autocomplete` | `string \| undefined` | `undefined` | Native autocomplete hint |
| `inputmode` | `string \| undefined` | `undefined` | Native input mode hint, such as `numeric` for digit-only identifiers |

## Slots

| Name | Description |
|---|---|
| `prefix` | Leading decorative content, typically `fd-icon` |
| `suffix` | Trailing content, typically a native `<button type="button">` or decorative `fd-icon` |

## Events

| Name | Detail | Description |
|---|---|---|
| `input` | Native `Event` | Fired on each value change |
| `change` | Native `Event` | Fired when the native input commits a value change |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-input-height` | `44px` | Minimum input height |
| `--fd-input-border-color` | `var(--fdic-border-input-rest, #bdbdbf)` | Border color at rest |
| `--fd-input-border-color-hover` | `var(--fdic-border-input-active, #424244)` | Border color on hover |
| `--fd-input-border-color-focus` | `var(--fdic-border-input-focus, #38b6ff)` | Focus glow color |
| `--fd-input-border-radius` | `var(--fdic-corner-radius-sm, 3px)` | Corner radius |
| `--fd-input-bg` | `var(--fdic-background-base, #ffffff)` | Background color |
| `--fd-input-placeholder-color` | `var(--fdic-text-secondary, #595961)` | Placeholder text color |
| `--fd-input-slot-size` | `44px` | Width of prefix and suffix slot containers |
| `--fd-input-icon-size` | `22px` | Icon size inside prefix and suffix slots |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Visual input container (`<div>`) for border, background, radius, focus, and state styling |
| `native` | The native `<input>` element. Exposed for JavaScript access such as `el.shadowRoot.querySelector('[part=native]')`. |
| `wrapper` | Outermost `<div>` containing the input container and character count |
| `char-count` | Visible character count display |

**Migration note:** In previous versions, `::part(base)` targeted the native `<input>` directly. It now targets the visual container `<div>`. For border, background, and radius customization, `::part(base)` continues to work as before.

`::part()` cannot chain with pseudo-elements like `::placeholder`. Use the documented CSS custom properties instead when you need to style placeholder text or slot sizing.

### Icon sizing

Icons inside prefix/suffix slots are automatically sized to 22px via `--fd-input-icon-size`. This is derived from the input's 18px body text at a 1.25× scale factor, rounded down to the nearest multiple of 2 (18 × 1.25 = 22.5 → 22px). The 1.25× ratio produces a glyph that is visually proportional to the accompanying text.

You do not need to set `--fd-icon-size` on slotted icons or buttons — the slot container sets it automatically.

**General principle:** Icons should be sized in proportion to the text they are paired with. When an icon appears inline with or adjacent to a text-bearing control, size the icon at 1.25× the text's font size, rounded down to the nearest multiple of 2px. This keeps the glyph visually balanced with the text baseline and line height.

To override for a specific input, set `--fd-input-icon-size`:

```html
<fd-input style="--fd-input-icon-size: 24px;">
  <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
</fd-input>
```
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use visible, descriptive labels</h4>
    <p>Every input must have a visible <code>fd-label</code>. Labels should use plain language and describe exactly what information is expected.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Rely on placeholder text as a label</h4>
    <p>Placeholder text disappears on input and is not reliably announced by all screen readers. Use it only for format examples.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Write specific, actionable error messages</h4>
    <p>"Enter a 9-digit routing number" tells users exactly what to fix. Where relevant, explain why the value failed.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use generic error text</h4>
    <p>"Invalid input" or "This field is required" forces users to guess what went wrong.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Preserve entered values after validation</h4>
    <p>Never clear a field when showing an error. Users should be able to see and correct what they entered.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Show errors before interaction</h4>
    <p>Don't mark empty required fields as invalid until the user has attempted to submit or leave the field.</p>
  </div>
</div>

## Content guidelines

- **Use plain-language labels.** Government and financial forms require clarity over brevity.
- **Explain why sensitive information is needed** in the description text when relevant (e.g., "We use your routing number to verify your bank").
- **Mark required fields** with the `fd-label required` attribute. If most fields are required, consider marking optional fields with "(optional)" in the label instead.
- **Character counts show remaining** for screen readers ("42 characters remaining") while the visual display uses a compact format ("208 / 250").
- **Do not put critical instructions in placeholder text** — use `fd-label`'s `description` attribute for persistent instructions.

## Accessibility

- `fd-input` renders a native `<input>` in **shadow DOM** and participates in form submission via `ElementInternals` (form-associated custom element).
- **Labeling:** Pair with `fd-label` using matching `for`/`id` attributes. `fd-label` renders a native `<label>` in light DOM for real click-to-focus and screen reader name computation.
- **Description wiring:** `fd-input` is the **single owner** of `aria-describedby` on the inner `<input>`. It discovers associated `fd-label` and `fd-message` siblings via their `for` attributes and reads their stable public getters (`descriptionId`, `messageId`) to assemble the description.
- **Error state:** `fd-message` is the primary authored error surface and still controls the border/message styling through its own `state`. It does **not** control `aria-invalid`.
- **Validation contract:** `checkValidity()` updates and returns validity without revealing invalid state. `reportValidity()` updates and returns validity, and only reveals invalid state when the field is invalid.
- **Visible invalid state:** the host gets `data-user-invalid` after a submit attempt, explicit `reportValidity()`, or blur after user interaction while still invalid. The internal input gets `aria-invalid="true"` only while that visible invalid state is active, and it clears in the same update cycle when `data-user-invalid` clears.
- **Reset behavior:** visible invalid state clears when the value becomes valid or when the form reset path runs.
- **Character count:** A visible count updates on every keystroke. A screen-reader-only live region announces remaining characters at meaningful thresholds (80% used, 100% reached, and on blur).
- **Focus ring:** Standard pattern — `outline: 2px solid`, `outline-offset: 2px`, `border-radius: 2px`.
- **Minimum target size:** 44px input height per WCAG 2.5.8.
- **Forced colors:** Borders use system colors; error/warning/success borders use `forced-color-adjust: none`.
- **Same-root limitation:** `fd-label`, `fd-input`, and `fd-message` must share the same DOM root tree for the `for`/`id` discovery to work.

## Validation contract

- `checkValidity()` updates and returns validity but does not reveal invalid state.
- `reportValidity()` updates and returns validity. When the field is invalid, it applies `data-user-invalid` on the host. When the field is valid, it has no visible effect.
- Blur after user interaction is also a visibility boundary. A required field can be internally invalid before that boundary without showing invalid styling yet.
- `aria-invalid` is applied to the internal native `<input>` only while `data-user-invalid` is present.
- `data-user-invalid` clears when the field becomes valid or when the form reset path runs.
- Provide authored error content with `fd-message` whenever the field can block submission. Missing error copy is incomplete usage even though the component can still show invalid styling.

## Validation with `pattern` and `minlength`

`fd-input` supports the native `pattern` and `minlength` attributes. These pass through to the underlying `<input>` element and participate in the browser's [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation).

**Required:** When using `pattern` or `minlength`, always set `novalidate` on the parent `<form>`. The design system manages all visible validation messaging through `fd-message`. Without `novalidate`, the browser will show its own validation tooltips alongside `fd-message`, creating a confusing dual-error experience.

```html
<form novalidate>
  <fd-label for="routing" label="Routing number" required
    description="9-digit number on the bottom of your check"></fd-label>
  <fd-input id="routing" name="routing" required
    pattern="[0-9]{9}" inputmode="numeric"
    placeholder="e.g. 021000021"></fd-input>
  <fd-message for="routing" state="error"
    message="Enter a valid 9-digit routing number"></fd-message>
</form>
```

`fd-input` mirrors native constraint state (`patternMismatch`, `tooShort`) into `ElementInternals` so form-level validation works correctly. Native validity and visible invalid presentation are separate. Your validation logic should:

1. Read `validity.patternMismatch` or `validity.tooShort` from `fd-input`
2. Set `fd-message[state="error"]` with an actionable message

`reportValidity()` still participates in the shared visibility contract: it reveals invalid state only when the field is invalid, and does nothing visible when the field is already valid.

### `minlength` and the dirty value flag

The browser only validates `minlength` after the user has interactively typed in the field. For programmatic validation of pre-filled values, check `value.length` directly instead of relying on `validity.tooShort`.

Screen readers do not announce `minlength` natively. Always include the minimum length requirement in visible text via `fd-label`'s `description` attribute so all users are aware of the constraint.

## Numeric identifiers

For routing numbers, account numbers, ZIP codes, SSNs, certificate numbers, and any identifier that happens to be digits, use `type="text"` with `inputmode="numeric"`:

```html
<fd-input id="zip" name="zip" type="text"
  inputmode="numeric" pattern="[0-9]{5}"
  placeholder="e.g. 01234"></fd-input>
```

Do **not** use `type="number"`. It strips leading zeros (01234 becomes 1234), accepts scientific notation (1e5), shows increment/decrement arrows, and changes values on scroll — none of which are appropriate for identifiers in financial or government forms.

## Controlling message announcements with `live`

`fd-message` manages screen reader announcements automatically: error messages use `role="alert"` for immediate announcement, and all other states use `aria-live="polite"`. The `live` attribute lets you override this default when needed:

- **`live="off"`** — Use for static messages that never change after initial render (e.g., format hints). Prevents unnecessary announcements when the DOM is restructured.
- **`live="polite"`** — Use for error messages in real-time inline validation (e.g., updating on every keystroke). This prevents `role="alert"` from interrupting the user on every change.

When `live` is not set, the default behavior applies. The default is correct for most form validation — only override when you have a specific reason.

```html
<!-- Static format hint: no announcements needed -->
<fd-message for="phone" state="default"
  message="Format: (XXX) XXX-XXXX" live="off"></fd-message>

<!-- Inline validation: polite instead of assertive for errors -->
<fd-message for="routing" state="error"
  message="Enter a valid 9-digit routing number" live="polite"></fd-message>
```

## Prefix and suffix slots

`fd-input` supports `prefix` and `suffix` named slots for leading icons and trailing action buttons.

### Leading icons (prefix)

Use the `prefix` slot for decorative icons that reinforce the input's purpose. Prefix content must have `aria-hidden="true"` — the label carries the accessible meaning.

```html
<fd-input id="search" type="search" placeholder="Search accounts">
  <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
</fd-input>
```

### Trailing action buttons (suffix)

Use the `suffix` slot for interactive controls that act on the input value. Suffix buttons must be native `<button>` elements with `aria-label`.

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use native buttons with aria-label</h4>
    <p>Suffix action buttons must be <code>&lt;button type="button"&gt;</code> elements with a descriptive <code>aria-label</code> that names both the action and the field.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use prefix for interactive controls</h4>
    <p>Interactive buttons in the prefix slot create confusing focus order. Use the suffix slot for all action buttons.</p>
  </div>
</div>

### Clear button pattern

```html
<fd-input id="search" type="search" value="current query">
  <button slot="suffix" type="button" aria-label="Clear search field"
    onclick="
      const input = this.closest('fd-input');
      input.value = '';
      input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
      input.focus();
    ">
    <fd-icon name="x" aria-hidden="true"></fd-icon>
  </button>
</fd-input>
```

**Required:** After setting `value = ""`, dispatch a standard `input` event so `fd-input` syncs form state and character count. Return focus to the input. Hide the button when the input is empty, disabled, or readonly.

### Password reveal pattern

```html
<fd-input id="pw" type="password" name="password">
  <button slot="suffix" type="button"
    aria-label="Toggle password visibility" aria-pressed="false"
    onclick="
      const isPressed = this.getAttribute('aria-pressed') === 'true';
      this.setAttribute('aria-pressed', String(!isPressed));
      this.closest('fd-input').type = isPressed ? 'password' : 'text';
      this.querySelector('fd-icon').name = isPressed ? 'eye' : 'eye-slash';
    ">
    <fd-icon name="eye" aria-hidden="true"></fd-icon>
  </button>
</fd-input>
```

**Required:** Use a stable `aria-label` with `aria-pressed` — do not dynamically change the label text. Swap the icon between `eye` and `eye-slash` to reflect the current state visually. Disable the toggle when the input is disabled. Keep it active when the input is readonly (viewing is not editing).

### Invalid-state indicator pattern

Use a non-interactive suffix icon when the field needs an inline invalid-state indicator in addition to the error border and message. Per the FDIC Figma input spec, use `warning-circle` for this treatment.

```html
<fd-input id="account-status" value="invalid query">
  <fd-icon slot="suffix" name="warning-circle" aria-hidden="true"></fd-icon>
</fd-input>
<fd-message for="account-status" state="error"
  message="No results found for this query"></fd-message>
```

**Required:** Treat this icon as decorative. Keep the accessible error communication in `fd-message`, and do not use the suffix warning icon as a button. Do not hand-author `aria-invalid`; the component applies it when visible invalid state is active.

### Prefix/suffix and state interactions

- **Disabled:** Slotted content is visually dimmed. Suffix buttons must also have the `disabled` attribute.
- **Readonly:** Prefix appears normally. Clear buttons should be hidden; password toggles remain active.
- **Error:** Use `warning-circle` as the non-interactive suffix indicator when the design calls for an inline invalid-state icon.
- **Warning/Success:** No change to prefix/suffix unless a specific design pattern introduces a dedicated state icon.
- **Focus:** When the input is focused, the container shows the focus ring. When a suffix button is focused, only the button shows its own inset focus ring.

## Shadow parts

| Name | Description |
|------|-------------|
| `base` | Visual input container (`<div>`) for border, background, radius, focus, and state styling |
| `native` | The native `<input>` element. Exposed for JavaScript access such as `el.shadowRoot.querySelector('[part=native]')`. |
| `wrapper` | Outermost `<div>` containing the input container and character count |
| `char-count` | Visible character count display |

**Migration note:** In previous versions, `::part(base)` targeted the native `<input>` directly. It now targets the visual container `<div>`. For border, background, and radius customization, `::part(base)` continues to work as before.

`::part()` cannot chain with pseudo-elements like `::placeholder`. Use the documented CSS custom properties instead when you need to style placeholder text or slot sizing.

### Icon sizing

Icons inside prefix/suffix slots are automatically sized to 22px via `--fd-input-icon-size`. This is derived from the input's 18px body text at a 1.25× scale factor, rounded down to the nearest multiple of 2 (18 × 1.25 = 22.5 → 22px). The 1.25× ratio produces a glyph that is visually proportional to the accompanying text.

You do not need to set `--fd-icon-size` on slotted icons or buttons — the slot container sets it automatically.

**General principle:** Icons should be sized in proportion to the text they are paired with. When an icon appears inline with or adjacent to a text-bearing control, size the icon at 1.25× the text's font size, rounded down to the nearest multiple of 2px. This keeps the glyph visually balanced with the text baseline and line height.

To override for a specific input, set `--fd-input-icon-size`:

```html
<fd-input style="--fd-input-icon-size: 24px;">
  <fd-icon slot="prefix" name="magnifying-glass" aria-hidden="true"></fd-icon>
</fd-input>
```

## Known limitations

- **No input masking** — phone number, SSN, or other format masking must be handled by the consumer.
- **No built-in validation timing** — the component does not automatically validate on blur or input. Consumers control when to show/hide `fd-message`.
- **One suffix action recommended** — multiple trailing action buttons inside a single input are discouraged because they create noisy keyboard and screen reader experiences.
- **axe-core and FACE** — automated accessibility tools like axe-core cannot follow `<label for>` through a form-associated custom element's shadow DOM. Manual screen reader testing (NVDA, JAWS, VoiceOver) is recommended for verification.

## Related components

- [Field](/components/field) — convenience wrapper for `fd-label` + `fd-input` + `fd-message` with auto-wired `for`/`id`
- [Label](/components/label) — provides accessible name, description/hint text, and InfoTip for form inputs
- [Selector](/components/selector) — dropdown/select pattern for structured selection
- [Radio Group](/components/radio-group) — grouped radio inputs with built-in legend
- [Checkbox Group](/components/checkbox-group) — grouped checkboxes with built-in legend
