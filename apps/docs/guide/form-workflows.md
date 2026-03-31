# Form Workflows

Use this guide for high-stakes public-service forms that collect, validate, route, or confirm consequential information. It defines the workflow rules that sit above field primitives such as [Input](/components/input), [Message](/components/message), [Checkbox Group](/components/checkbox-group), [Radio Group](/components/radio-group), and [Alert](/components/alert).

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Workflow guidance</span>
  <p>Start with native semantics, visible labels, clear instructions, preserved values after errors, and explicit review or confirmation protections where the workflow carries legal, financial, or official-record consequences. Keep visual layout decisions bounded by Figma.</p>
</div>

## Minimum viable form

If you are building a form for the first time, start with this pattern. It demonstrates the correct component composition, label association, and error message wiring. Copy this, then customize.

```html
<form>
  <fd-field>
    <fd-label slot="label" required>Institution name</fd-label>
    <fd-input slot="input" required></fd-input>
    <fd-message slot="message" type="helper">
      Enter the full legal name as it appears on the charter.
    </fd-message>
  </fd-field>

  <fd-field>
    <fd-label slot="label" required>Certificate number</fd-label>
    <fd-input slot="input" type="text" inputmode="numeric" required></fd-input>
    <fd-message slot="message" type="helper">
      The 5-digit FDIC certificate number.
    </fd-message>
  </fd-field>

  <fd-field>
    <fd-label slot="label">Additional notes</fd-label>
    <fd-textarea slot="input"></fd-textarea>
  </fd-field>

  <fd-button-group>
    <fd-button variant="primary" type="submit">Submit filing</fd-button>
    <fd-button variant="subtle" type="button">Cancel</fd-button>
  </fd-button-group>
</form>
```

**What this demonstrates:**

- Every input is wrapped in `fd-field`, which connects the label, input, and message for accessibility.
- `fd-label` with `required` shows the required indicator.
- `fd-message` with `type="helper"` provides persistent instructions below the field.
- Numeric identifiers use `type="text"` with `inputmode="numeric"` — never `type="number"`.
- The submit button uses `variant="primary"` so it stands out as the main action. Secondary actions use `variant="subtle"`.
- There is no reset or clear button.

**What happens on error:** When validation fails, change the `fd-message` type to `"error"` and update its text to explain what needs to be fixed. The field will show its error state automatically. See the validation timing rules below for when to show errors.

## Core rules

- Prefer **web forms over PDFs** when the workflow should produce structured, routable, or reviewable data.
- Keep complex forms **left-aligned and easy to scan**. Do not rely on dense multi-column layouts for consequential questions.
- Use **visible labels and persistent instructions**. Do not use placeholder text as the primary label.
- Use **standard controls** before proposing custom interactions.
- **Remove unnecessary questions** instead of compensating with more guidance.
- **Preserve entered values after errors**. Never clear work as part of validation.
- **Do not include reset or clear buttons** as routine workflow actions.
- Treat **review, confirmation, and record-keeping** as workflow requirements where the submission creates real consequences.

## Structure guidance

### Use single-question pages when

- the answer is consequential or cognitively heavy
- the person may need supporting explanation before answering
- the answer changes routing, eligibility, or downstream handling
- the workflow benefits from step-by-step focus more than side-by-side comparison

### Use grouped sections when

- several fields form one logical unit
- the person benefits from reviewing related information together
- the fields share the same explanation, trust language, or validation context
- the grouping can be expressed semantically with native structure such as `fieldset` and `legend`

### Structure constraints

- Only place multiple inputs on one row when they form one clear logical unit.
- Size fields in proportion to the expected value length where the approved visual system supports it.
- Keep trust, privacy, or records language close to the fields it explains.
- Do not duplicate questions across the same journey unless the workflow requires explicit reconfirmation.

## Labels, instructions, and control choice

- Every field needs a visible label.
- Use placeholder text only for examples, never as the main label.
- Instructions should explain what is required, what format is expected, and why sensitive information is being requested when relevant.
- Use standard required indicators and plain-language error text. Do not rely on color alone.
- When the system already knows information, prefill it only if the value can still be reviewed and corrected when appropriate.

## Validation and error recovery

This system separates native validity from visible invalid state. The workflow pattern below defines when errors become visible and how people recover from them.

### On input

- Do not reveal new error states for untouched or pristine fields.
- If a field or group has already crossed a visibility boundary, revalidate on input and update inline feedback immediately.
- Clear inline error messaging as soon as the value becomes valid.
- Do not move focus during input-driven validation.

### On blur

- Blur is a visibility boundary after interaction.
- If a field has been interacted with and is still invalid on blur, reveal its inline error.
- For grouped controls, reveal the group-level error only when focus leaves the logical group.
- Do not show a page-level error summary on blur alone.

### On submit

- Run validation for the entire page.
- Preserve all entered values.
- Reveal inline errors for every blocking field or group.
- Show a top-of-page error summary when submission is blocked.
- Move focus to the error summary container or heading once so keyboard and screen-reader users know submission failed.

### After a submit attempt

- Keep inline errors visible until the relevant values become valid.
- Keep the error summary visible until all blocking errors are resolved or the page state resets.
- Revalidate on input and blur while the person corrects errors.
- Do not move focus back to the summary during correction.
- If a later submit attempt still fails, focus the summary again.

### Async and server-side errors

- Preserve all entered values.
- Map field-specific server errors into the same inline plus summary contract used for client-side errors.
- Render non-field server failures as page-level alerts above the form.
- If the failure has field targets, focus the error summary after the failed submit.
- If the failure has no field targets, focus the page-level alert instead.

### Inline errors and top-of-page summaries

- **Inline errors are the primary correction surface.** They tell the person what to fix where the fix happens.
- **The error summary is a submit-scoped navigation surface.** It helps people find blocking errors after a failed submit.
- The summary must never be the only place an error appears.
- Summary wording should match the inline error wording closely enough that the same correction is communicated in both places.
- Summary links must target the real correction point: the control itself for single fields, the first invalid sub-field for compound clusters, or the fieldset or legend wrapper for grouped controls.

## Required and conditional workflow protections

| Protection | Required when | Conditional when | Not a default requirement |
|---|---|---|---|
| Review-before-submit | The submission creates an official record, includes attestation, affects legal or financial status, or submits multi-page consequential data | Low-risk update flows may document direct submit if no review risk exists | Do not require for simple, reversible contact or preference updates |
| Confirmation / receipt / keep-a-record | The product creates a case, filing, request, or deadline-sensitive submission | Optional for low-risk changes that do not create a durable record | Never omit when the user needs proof of completion |
| Trust / privacy / records language | The workflow asks for sensitive, financial, legal, or uploaded information | Supporting explanation may be lighter for low-risk fields | Do not rely on generic boilerplate when the user needs a real reason |
| Autosave / save-and-return | The flow is expected to take more than 10 minutes, span multiple pages, require document gathering, or carry high interruption risk | Product teams may still choose it for shorter authenticated flows | Not a universal default for every public form |
| Routing preview / “what happens next” | Answers affect routing, eligibility path, review path, or downstream handling | Useful when outcomes are delayed or non-obvious | Not required when the outcome is immediate and obvious |
| Editable prefill | Known data is prepopulated and the user may need to correct it | Read-only prefill is acceptable only when policy requires it and the state is clearly explained | Do not silently lock prefilled values without explanation |

### Confirmation guidance

- Confirmation should clearly say the task is complete.
- Confirmation should explain what happens next.
- When the workflow creates a case, filing, or request, the confirmation should tell the person what record to keep.
- Avoid obscure system-only confirmation language that requires interpretation.

## Research-aligned guidance

The NN/g intranet findings reinforce several rules that apply broadly here:

- prefer web forms over PDFs for structured-data workflows
- keep complex forms left-aligned and low-density
- use visible labels rather than placeholder-only labeling
- size fields proportionally where the approved design supports it
- eliminate unnecessary fields
- use standard controls
- avoid reset or clear actions
- show clear confirmation after submit

Some findings should stay conditional rather than universal:

- editable prefill is useful when the product already has reliable account data
- autosave or save-progress is appropriate for long, interrupted, or authenticated workflows

Some decisions still require Figma before they become system guidance:

- exact grouped-section shells
- exact low-density layout and field-width recipes
- exact trust, privacy, save-progress, confirmation, or receipt presentation patterns

## Verification checklist

Use this checklist for any form-pattern deliverable, workflow example proposal, or future component proposal in this area.

- Uses native form semantics and native grouping such as `fieldset` and `legend` where the content is logically grouped.
- Provides visible labels and persistent instructions. Placeholder-only labeling is not used.
- Preserves user-entered values after client-side and server-side validation failures.
- Defines how inline field or group errors appear and how the top-of-page error summary appears after blocked submit.
- Maps every summary item to a real correction target.
- Defines focus behavior after failed submit and after successful submit.
- Supports keyboard-only use without custom traps or skipped recovery paths.
- Holds up at zoom and on small screens without requiring horizontal scrolling for core tasks.
- Includes trust, privacy, or records guidance when the workflow asks for sensitive or consequential data.
- Includes review-before-submit when the workflow is legal, financial, or otherwise high-stakes by the criteria above.
- Includes a clear confirmation state after submission and explains what record, receipt, or next step the user should expect.
- Avoids reset and clear actions that can wipe work unexpectedly.

## Maintainer notes

### Keep this area docs-first

- Do not introduce `fd-form`, `fd-stepper`, `fd-review-summary`, or domain composites without repeated Figma-backed structure.
- `fd-error-summary` is a future candidate, not a current approval.
- `fd-form-section` stays docs-only unless repeated structure proves it should own more than spacing and composition guidance.

### Before proposing a new supporting component

Only promote a workflow concern into a reusable component if all of these are true:

1. Figma defines the same anatomy in the default state and every required state.
2. The same nonvisual structure appears in at least 2 canonical workflows or 3 approved workflow exemplars.
3. Hand-authoring it repeatedly would likely create inconsistent semantics, focus behavior, validation behavior, or error recovery.
4. The public API can stay narrow, generic, and free of product-specific workflow logic.
5. The abstraction can be tested independently of routing or page-state ownership.

### Additional source-of-truth inputs required before workflow components

- intake or start state
- validation or blocked-submit state
- review state
- confirmation or receipt state
- trust, privacy, and save-progress states where applicable

Each state should clarify semantic grouping, error targets, focus destination, and whether prefilled data, routing preview, or save-progress behavior is in scope.
