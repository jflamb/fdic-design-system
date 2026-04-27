# Canonical CMS Filing Reference

Use this page as the copyable downstream reference for a server-rendered CMS integration. It stays on the published package surface, uses only public `--fdic-*` tokens, and keeps the supported v1 form contract intact.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Downstream reference</span>
  <p>This example shows a realistic filing-update page that a CMS team could adopt directly: semantic HTML first, progressive enhancement through published Web Component assets, native form semantics with a styled submit control, and trust language that remains visible before JavaScript upgrades finish.</p>
</div>

## What this reference proves

- The integration uses only `@jflamb/fdic-ds-components` and `@jflamb/fdic-ds-tokens`.
- Token overrides stay on documented `--fdic-*` names.
- The form remains understandable as server-rendered HTML.
- `fd-field` remains limited to direct-child text-entry composition, while `fd-form-field` provides the broader wrapper contract.
- The primary submit action uses `fd-button type="submit"` so submission keeps FDIC styling without leaving native form semantics.

## Client bundle entry

Import the published stylesheet and registration entrypoint into the CMS theme or frontend bundle.

```ts
import "@jflamb/fdic-ds-components/styles.css";
import "@jflamb/fdic-ds-components/register-all";
```

## Theme-level token overrides

Apply token overrides at the CMS shell or route wrapper, not inside editor-authored markup.

```css
.fdic-filing-shell {
  --fdic-layout-shell-max-width: 80rem;
  --fdic-color-bg-base: #f4f8fb;
  --fdic-color-bg-surface: #ffffff;
  --fdic-color-text-primary: #17324d;
  --fdic-spacing-lg: 1.5rem;
}
```

## Server-rendered page shell

This HTML is meaningful before upgrade and remains within the supported public contract after upgrade.

```html
<main class="fdic-filing-shell">
  <header>
    <p><a href="/institution-profile">Back to institution profile</a></p>
    <h1>Update the institution filing contact</h1>
    <p>
      Use this form to update the person we contact if a reviewer needs clarification
      about this filing. We will keep the existing contact on file until this update is
      reviewed.
    </p>
  </header>

  <section aria-labelledby="privacy-title">
    <h2 id="privacy-title">Why we ask for this information</h2>
    <p>
      We use this contact information only to review and process this filing update.
      If the update is approved, the submitted details become part of the institution's
      official filing record.
    </p>
  </section>

  <form method="post" action="/institution-profile/contact" novalidate>
    <fd-error-summary
      aria-labelledby="contact-errors-title"
      id="contact-errors-title"
      hidden
    ></fd-error-summary>

    <fd-form-field
      label="Institution name"
      description="Enter the legal institution name exactly as it appears on the charter."
      required
    >
      <fd-input
        name="institution-name"
        value="First Community Bank"
        required
      ></fd-input>
    </fd-form-field>

    <fd-form-field
      label="Certificate number"
      description="Enter the 5-digit FDIC certificate number."
      required
    >
      <fd-input
        id="certificate-number"
        name="certificate-number"
        type="text"
        inputmode="numeric"
        pattern="[0-9]{5}"
        value="12345"
        required
      ></fd-input>
    </fd-form-field>

    <fd-form-field
      label="Reason for the update"
      description="Explain why the filing contact changed so the reviewer can confirm the request."
      required
    >
      <fd-textarea
        name="update-reason"
        value="The prior contact retired on March 31, 2026."
        required
      ></fd-textarea>
    </fd-form-field>

    <fd-form-field
      label="How should we contact you if clarification is needed?"
      description="Choose the method the filing contact will monitor during the review window."
      error="Select how we should contact you."
      required
      field-id="contact-method-group"
    >
      <fd-radio-group required>
        <fd-radio name="contact-method" value="email">Email</fd-radio>
        <fd-radio name="contact-method" value="phone">Phone</fd-radio>
        <fd-radio name="contact-method" value="secure-message">
          Secure message
        </fd-radio>
      </fd-radio-group>
    </fd-form-field>

    <section aria-labelledby="recordkeeping-title">
      <h2 id="recordkeeping-title">Before you submit</h2>
      <p>
        Review the entered information carefully. After submission, we will show a
        confirmation number that the institution should keep until the review is complete.
      </p>
    </section>

    <div>
      <fd-button variant="primary" type="submit">Continue to review</fd-button>
      <fd-button href="/institution-profile" variant="subtle">
        Cancel
      </fd-button>
    </div>
  </form>
</main>
```

## Operational notes

- If the server blocks submission, return the same page with `fd-error-summary` visible, preserve the values the person already entered, and update the relevant field or group error copy.
- Keep the trust, privacy, and record-keeping language in the server-rendered HTML so it is present before the components upgrade.
- Use [Review List](/components/review-list) for the review step and [Confirmation Record](/components/confirmation-record) for the completion state when the workflow should standardize those shells.

## Related guidance

- [CMS Integration](/guide/cms-integration)
- [Getting Started](/guide/getting-started)
- [Form Workflows](/guide/form-workflows)
