# Callouts

Callouts draw attention to important information within a page. They use color, icons, and placement to signal how critical the message is — from helpful tips to urgent warnings.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Prose sub-topic</span>
  <p>Use callouts inside <a href="./prose">Prose</a> content to surface supplementary information that the reader should not miss — regulatory notes, compliance warnings, confirmation messages, and critical alerts. Five variants map to increasing levels of urgency.</p>
</div>

## When to use

- **A piece of information could be missed in body text** — The reader might scan past it, but missing it could cause confusion, a compliance error, or a financial mistake.
- **You need to communicate urgency or severity** — The five variants (default, info, warning, success, danger) give you a visual scale from "helpful context" to "critical alert."
- **The information is supplementary, not primary** — Callouts highlight supporting details. If the callout contains the main point of the section, it should be body text instead.

## When not to use

- **Don't use callouts for primary page content** — If the reader can't understand the page without reading the callout, it's not supplementary. Write it as body text or a lead paragraph.
- **Don't stack multiple callouts in sequence** — Three callouts in a row dilute their impact. Consolidate into one, or restructure. If the items are parallel, use a bulleted list.
- **Don't use a callout where a [details/accordion](./details) would work** — If the information is useful but not urgent, let the reader opt in rather than interrupting their flow.
- **Don't use danger for anything less than irreversible or legally consequential** — Overusing danger trains readers to ignore it. Reserve it for situations involving data loss, legal liability, or safety.

## Examples

<StoryEmbed
  storyId="prose-callout--docs-overview"
  linkStoryId="prose-callout--docs-overview"
  height="620"
  caption="Variant overview — compare default, info, warning, success, and danger in one place. Open Storybook for isolated variants and controls."
/>

- **Default** supports general-purpose tips and supplementary context.
- **Info** adds helpful background that enriches understanding but is not required to proceed.
- **Warning** signals real risk, such as missed deadlines, compliance problems, or financial consequences.
- **Success** confirms that a process completed as expected.
- **Danger** is reserved for irreversible or legally consequential situations.

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use one callout per section at most</h4>
    <p>Callouts work by contrast — they stand out because the surrounding content is plain.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Cluster callouts together</h4>
    <p>Two or more in sequence creates a wall of colored boxes that readers skip entirely.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Match the variant to the real severity</h4>
    <p>Info for context. Warning for risk. Danger for irreversible consequences.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Default to "warning" for emphasis</h4>
    <p>If there's no actual risk, use info or default. Crying wolf erodes trust in the system.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep callouts short — 1 to 3 sentences</h4>
    <p>The reader should grasp the message in a single glance.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Put multi-paragraph content in a callout</h4>
    <p>If it needs that much space, it's body content or belongs in an <a href="./aside">aside</a>.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Place the callout near the content it relates to</h4>
    <p>Proximity creates the connection between the callout and its context.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Put callouts at the top of a page as a general disclaimer</h4>
    <p>Use a lead paragraph for page-level context instead.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Lead with the consequence, not the action.</strong>
  <p>Tell the reader what's at stake first, then what to do about it.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Deposits above $250,000 are not insured. Contact your bank to discuss coverage options.</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Please note that you should contact your bank about coverage options for deposits above $250,000.</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Don't start with "Note:", "Please note:", "Important:", or "Warning:".</strong>
  <p>The icon and color already communicate the type. Redundant labels waste the reader's first few words.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Call Report filing deadlines cannot be extended.</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Important: Please be aware that Call Report filing deadlines cannot be extended.</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Use active voice and direct address.</strong>
  <p>Speak to the reader as "you."</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>You must submit your quarterly filing before the deadline.</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Quarterly filings must be submitted before the deadline by the reporting institution.</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Be specific about consequences and actions.</strong>
  <p>Vague warnings don't help anyone make decisions.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Editing this field resets all downstream calculations. Export your current report before making changes.</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Be careful when editing this field.</p>
    </div>
  </div>
</div>

## Accessibility

- Every callout needs a label that tells screen reader users what kind of message it is. Default labels: "Tip," "Information," "Warning," "Success," "Critical alert."
- If your callout is about something more specific, write a custom label — for example, "Deposit insurance coverage note" instead of the generic "Information."
- Don't rely on color alone to communicate severity. The icon and label text must also convey it — a reader who can't see color should still understand whether this is a tip or a critical alert.
- Danger callouts are announced as live status updates to assistive technology. Only use danger when the information truly warrants immediate attention.

<FigmaEmbed url="" caption="All callout variants with spacing, color, and icon annotations" />

## Related components

<ul class="fdic-related-list">
  <li><a href="./aside">Aside / Pull Quote</a> — Use when the supplementary content is longer (a paragraph or more) and relates to a specific passage rather than the page as a whole.</li>
  <li><a href="./details">Details / Accordion</a> — Use when the information is useful but not urgent, and the reader should opt in to seeing it rather than having it interrupt their flow.</li>
</ul>
