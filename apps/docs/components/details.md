# Details / Accordion

The native `<details>` element provides a disclosure widget for expandable content — FAQs, supplementary guidance, and progressive disclosure of regulatory information.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>&lt;details&gt;</code> to let readers opt in to additional content without leaving the page. It reduces page length while keeping procedural details, eligibility criteria, and regulatory definitions accessible on demand.</p>
</div>

## When to use

- **Content is useful but not essential on first read** — procedural details, eligibility criteria, regulatory definitions, and background context that supports but does not replace the main narrative.
- **You want to reduce page length without hiding information behind navigation** — accordions keep content on the same page, one interaction away.
- **The reader should opt in to seeing the content** — it enriches understanding but does not block the reader from completing their task.
- **Building an FAQ section with multiple expandable questions** — sequential accordions create a scannable question-and-answer format.

## When not to use

- **Don't hide critical warnings or required actions inside a collapsed accordion** — if the user must see it, it belongs in the visible flow. Use a [callout](./callouts) instead.
- **Don't use a single accordion to hide content you think is "too long"** — if the content is essential, show it. If it's not, consider removing it entirely.
- **Don't use accordions for primary navigation** — use the [table of contents](./table-of-contents) for document-level navigation.

## Examples

<StoryEmbed
  storyId="prose-details--docs-overview"
  linkStoryId="prose-details--default"
  height="360"
  caption="Overview — a single disclosure and an FAQ-style group in one preview. Open Storybook to test expanded and collapsed states directly."
/>

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Write clear, specific summary text</h4>
    <p>Tell the reader what they'll find inside. Specific labels improve scanning and help users decide whether to expand.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't use vague labels</h4>
    <p>Labels like "More information" or "Click here" force the reader to expand the accordion just to find out what it contains.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use multiple accordions in sequence for FAQ content</h4>
    <p>Each accordion operates independently, letting readers open only the questions they care about.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't nest accordions inside accordions</h4>
    <p>One level of disclosure is enough. Nesting creates a confusing interaction pattern and buries content too deeply.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Put substantive content inside</h4>
    <p>Paragraphs, lists, tables, and even callouts all work well inside an accordion. The component is designed for meaningful content blocks.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't put a single sentence inside an accordion</h4>
    <p>If the content is that short, just show it inline. The interaction cost of expanding an accordion is not worth a single line of text.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Group related questions with a heading above</h4>
    <p>A heading like "Frequently asked questions" or "Coverage details" gives the accordion set context and aids scanning.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't scatter individual accordions throughout body text</h4>
    <p>Isolated accordions break reading flow. Group them together or use a different component for inline supplementary content.</p>
  </div>
</div>

## Interaction behavior

- **Click or tap** the summary bar to toggle the content open and closed.
- **Enter and Space** keys toggle the accordion when the summary is focused.
- The **chevron rotates** to point upward when open, providing a visual cue for the current state.
- Content **animates open** with a smooth reveal. Users who prefer reduced motion see the content appear instantly.
- **Focus stays on the summary** after toggling — the user decides whether to Tab into the revealed content.
- Each accordion **operates independently** — opening one does not close others.

## Content guidelines

<div class="fdic-content-rule">
  <strong>Write summaries as specific questions or descriptive labels.</strong>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>What types of accounts are covered by FDIC insurance?</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Click to learn more about accounts</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Don't start with verbs like "Click to see" or "Expand for."</strong>
  <p>The interaction is self-evident from the component's appearance.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Eligibility requirements for pass-through insurance</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Click here to expand eligibility requirements</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Keep summary text to one line.</strong>
  <p>Long summaries break the visual pattern and make the accordion group harder to scan.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>How are joint account deposits insured?</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>How are deposits in joint accounts at FDIC-insured banks calculated for insurance coverage purposes?</p>
    </div>
  </div>
</div>

## Accessibility

- The accordion is **fully keyboard accessible** with no additional setup — Enter and Space toggle it, and screen readers announce the expanded or collapsed state automatically.
- **Write summary text that makes sense on its own** — screen reader users navigate by summary labels, so "More details" is meaningless without visual context.
- **Don't hide critical information** inside a collapsed accordion. Screen reader users may not realize important content is hidden.
- The **chevron is decorative** — its rotation conveys state visually but is not announced to assistive technology. The expanded/collapsed state is announced through the native element semantics.

## Design specs

<FigmaEmbed url="" caption="Accordion states — collapsed, expanded, hover, and focus" />

## Related components

<div class="fdic-related-list">

- [Callouts](./callouts) — Use when the information is urgent or the reader should not miss it. Callouts are always visible; accordions require interaction.
- [Table of Contents](./table-of-contents) — Use for document-level navigation rather than content disclosure.

</div>
