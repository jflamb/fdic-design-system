# Button

Buttons trigger actions or navigate to new pages. They tell the user what will happen next and visually communicate the importance and risk of that action.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-button</code> to let users take actions — confirming decisions, navigating to new pages, or triggering client-side operations. Five variants communicate the weight and risk of each action. The component renders a native <code>&lt;button type="button"&gt;</code> by default, or an <code>&lt;a&gt;</code> when an <code>href</code> is provided.</p>
</div>

## When to use

- **The user needs to take an action** — Confirming a decision, starting a process, opening a dialog, or navigating to a destination that feels like an action ("Apply now," "Download report").
- **You need to communicate the importance of an action** — Primary for the main action, neutral or subtle for secondary actions, destructive for irreversible operations.
- **You need a link that looks and feels like a button** — Set the `href` attribute and `fd-button` renders an `<a>` element, preserving link semantics (right-click, cmd-click, screen reader link lists) while providing button styling.

## When not to use

- **Don't use buttons for inline navigation** — If the text sits inside a paragraph and navigates to another page, use a regular link. Buttons are for actions that feel like decisions, not for inline references.
- **Don't use buttons for toggling state** — Checkboxes, radio buttons, switches, and toggle buttons are better for on/off or selection patterns.
- **Don't use a destructive button without a confirmation step** — In a government/regulatory context, irreversible actions must give the user a chance to reconsider. Pair destructive buttons with confirmation dialogs or two-step flows.

## Examples

<StoryEmbed storyId="components-button--primary" caption="Primary — the main action on the page or section; limit to one per section" />
<StoryEmbed storyId="components-button--neutral" caption="Neutral — secondary actions that don't compete with the primary action" />
<StoryEmbed storyId="components-button--outline" caption="Outline — lower-emphasis alternative, useful alongside a primary button" />
<StoryEmbed storyId="components-button--subtle" caption="Subtle — minimal visual weight for tertiary actions like 'Cancel' or 'Skip'" />
<StoryEmbed storyId="components-button--destructive" caption="Destructive — irreversible actions like deleting records or revoking access; always pair with confirmation" />
<StoryEmbed storyId="components-button--with-icons" caption="With icons — use icon-start and icon-end slots to add fd-icon elements alongside the label" />
<StoryEmbed storyId="components-button--icon-only" caption="Icon-only — for compact UI; requires aria-label on fd-button for accessibility" />
<StoryEmbed storyId="components-button--as-link" caption="As link — setting href renders a native anchor element, preserving link semantics" />
<StoryEmbed storyId="components-button--loading" caption="Loading — shows a spinner and suppresses activation to prevent duplicate submissions" />
<StoryEmbed storyId="components-button--loading-with-label" caption="Loading with label — optionally replaces the visible label during loading for clarity" />
<StoryEmbed storyId="components-button--all-variants-loading" caption="All variants loading — every variant supports the loading state" />

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use one primary button per section</h4>
    <p>A single primary button creates a clear visual hierarchy and tells the user where the main action is.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use multiple primary buttons in the same section</h4>
    <p>Competing primary buttons force the user to evaluate equal-weight options without guidance. Use neutral or outline for secondary actions.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use specific verb labels</h4>
    <p>"Submit filing," "Download report," "Revoke access" — the user knows exactly what will happen.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use vague labels like "Click here" or "Submit"</h4>
    <p>Generic labels leave the user guessing. In a regulatory context, clarity about the action builds trust and reduces errors.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Pair destructive buttons with a confirmation step</h4>
    <p>A dialog or two-step flow gives the user a chance to reconsider before an irreversible action.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Let a single click trigger an irreversible action</h4>
    <p>In government systems, accidental deletions or revocations can have legal and financial consequences. Always confirm.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Start labels with a verb.</strong>
  <p>Buttons are actions. Lead with what happens when the user clicks.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Submit filing</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Filing submission</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Keep labels short — 1 to 3 words.</strong>
  <p>Buttons should be scannable at a glance. Move additional context to surrounding text.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Export data</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Export all quarterly data to CSV format</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Use sentence case.</strong>
  <p>Sentence case is easier to read and feels less formal than title case, which is important for approachability in public-facing government tools.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Download report</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Download Report</p>
    </div>
  </div>
</div>

## Loading state

Use the `loading` attribute when an action is in progress and you need to prevent duplicate submissions — for example, after the user clicks "Submit filing" and the request is still processing.

- **Loading is not disabled.** Loading means "your action is in progress, please wait." Disabled means "this action is not available right now." Use the right one.
- **The label stays visible by default.** The spinner appears alongside the text so the user can still read what action is pending.
- **Use `loading-label` for long-running actions.** If the wait may be noticeable, changing the label can improve clarity: `loading-label="Submitting…"` while the original label is "Submit filing."
- **Icon-only buttons** show the spinner in place of the icon. The accessible name (`aria-label`) is preserved.
- **Link-mode buttons** (`href`) suppress navigation while loading using the same inert pattern as disabled links.
- **Reduced motion:** The spinner animation is suppressed under `prefers-reduced-motion: reduce`. The static spinner icon and `aria-busy` state still communicate progress.

## Accessibility

- `fd-button` renders a **native `<button>` element** inside its shadow DOM. Native buttons are focusable, keyboard-operable (Enter and Space), and announced correctly by screen readers without extra ARIA.
- When `href` is set, the component renders a **native `<a>` element** instead. This preserves link semantics — screen reader link lists, right-click context menus, and cmd/ctrl-click for new tabs all work as expected.
- **Icon-only buttons require a name on `fd-button`** — Set `aria-label` or `aria-labelledby` on the `fd-button` element itself, not on the `fd-icon` inside it. The component forwards that accessible name to the internal native control, and the icon should remain decorative (`aria-hidden="true"`).
- **Disabled state**: On `<button>`, the native `disabled` attribute is used. On `<a>` (link mode), `aria-disabled="true"` is set instead, since anchor elements don't support native `disabled`.
- **External link safety**: When link-mode buttons use `target="_blank"`, `fd-button` adds `rel="noopener noreferrer"` automatically and preserves any extra `rel` tokens you supply.
- All interactive states use the standard focus ring: `outline: 2px solid` with `outline-offset: 2px` on `:focus-visible`.
- **Loading state**: When `loading` is set, the native control becomes inert (`disabled` on `<button>`, `aria-disabled="true"` on `<a>`) and receives `aria-busy="true"` as a supplemental signal. The spinner icon is decorative (`aria-hidden="true"`). If `loading-label` is provided, the accessible name updates to match the visible loading label.

## Known limitations

- **Form submission is out of scope in v1** — `fd-button` always renders an internal `<button type="button">` when it is not in link mode. Because the component is not form-associated, use a native `<button type="submit">` or `<button type="reset">` inside light-DOM forms until a future version explicitly adds form association.
- **`aria-busy` AT coverage varies** — `aria-busy` on `<button>` is not consistently announced across all screen reader / browser combinations. The primary inert signal is the native `disabled` attribute (or `aria-disabled` for links), with `aria-busy` as supplemental. Verify with your target AT combinations.

## Related components

<ul class="fdic-related-list">
  <li><a href="./icon">Icon</a> — Use <code>fd-icon</code> in the <code>icon-start</code> and <code>icon-end</code> slots to add icons to buttons.</li>
  <li><a href="./callouts">Callouts</a> — For communicating information that doesn't require user action. If you're tempted to put a button inside a callout, consider whether the callout should be a standalone action section instead.</li>
</ul>
