# Trust Patterns

Use this page for cross-cutting guidance that helps FDIC interfaces feel official, understandable, and safe in high-stakes public-service workflows.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Trust foundations</span>
  <p>Trust is a product requirement, not a visual flourish. People need clear ownership, unambiguous next steps, and error messages that help them recover without guessing. When in doubt, prefer official identifiers, plain language, and visible policy context over brevity or brand voice.</p>
</div>

## Official identifiers

Use official identifiers near the start of a workflow or page when people need confidence that they are in the correct government surface.

- Show the agency or program owner clearly.
- Use the full name on first reference before abbreviations.
- Keep certificate numbers, case numbers, filing IDs, or submission IDs visible when they matter for follow-up.
- Repeat the official identifier on confirmations, receipts, and review screens.

## Banner and ownership guidance

When a page or application needs a government identity banner, keep it near the top of the page and pair it with clear ownership text.

- Make the page owner explicit.
- Keep the banner short and factual.
- Avoid mixing government trust copy with promotional messaging.
- Preserve the banner and ownership pattern consistently across entry, form, review, and confirmation states.

USWDS banner guidance is a useful secondary reference, but FDIC-specific content still controls the exact wording and structure.

## Policy and help links

Place policy and support links where people need them, not only in the footer.

- Keep privacy, records-retention, or disclosure guidance close to the relevant form or upload control.
- Put "what happens next" help near submit actions and confirmation states.
- Use explicit link labels such as "Privacy Act statement" or "Upload requirements".
- Do not hide critical policy context behind generic "Learn more" labels.

## Error message writing

Error messages must explain the problem and the correction in plain language.

### Do

- State what is wrong.
- State how to fix it.
- Refer to the expected format only when it helps correction.
- Keep the message specific to the control or group.

### Avoid

- vague messages such as "Invalid entry"
- blameful language
- internal-only terms
- repeating the field label without a correction

### Examples

Good:

- "Enter a valid 9-digit routing number."
- "Select at least one contact method."
- "Upload a PDF, DOCX, or TXT file smaller than 10 MB."

Avoid:

- "Routing number invalid."
- "Required."
- "Submission error 1027."

## Review and confirmation patterns

High-stakes workflows should help people confirm what they are doing before they commit.

- Use review-before-submit when the action creates an official record, attestation, or financial effect.
- Make the primary action label explicit: `Submit filing`, `Confirm account closure`, `Send request`.
- After completion, show a confirmation that says the action succeeded, what happens next, and what reference to keep.
- If there is a reference number, make it easy to copy and keep.

## Sensitive information requests

When a workflow asks for personal, financial, or institution data:

- explain why the information is needed
- keep the explanation near the field or section
- distinguish required from optional data clearly
- avoid asking for the same sensitive value twice unless reconfirmation is necessary

## Secondary guidance

Use USWDS trust and content patterns as a secondary reference for:

- government identity banners
- plain-language writing
- accessible error summaries
- confirmation and status messaging

When FDIC-specific requirements differ, follow the FDIC design and content rules unless doing so would create an accessibility or policy problem.
