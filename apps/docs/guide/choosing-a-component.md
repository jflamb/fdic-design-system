# Choosing a Component

Use this page to find the right component for your use case. Start with what the user needs to do, then follow the guidance to the correct element.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Decision guide</span>
  <p>Every component in this system has a specific job. Using the wrong one creates accessibility problems, confuses users, and makes interfaces harder to maintain. This page helps you pick correctly the first time.</p>
</div>

## "I need the user to go somewhere"

Use a **link** when the interaction navigates to a different page or location.

| Situation | Use this |
|-----------|----------|
| Inline text that navigates to another page | [Link (`fd-link`)](/components/link) |
| A navigation action styled to look like a button | [Button (`fd-button`)](/components/button) with `href` — renders a native `<a>` with button styling |

**Do not** use `fd-button` without `href` for navigation. A button without `href` renders a `<button>` element, which does not appear in screen reader link lists and does not support right-click or cmd-click.

## "I need the user to do something"

Use a **button** when the interaction performs an action — submitting a form, opening a dialog, confirming a decision, or triggering a process.

| Situation | Use this |
|-----------|----------|
| One main action on the page or section | [Button (`fd-button`)](/components/button) with `variant="primary"` |
| A secondary or supporting action | [Button (`fd-button`)](/components/button) with `variant="neutral"`, `"outline"`, or `"subtle"` |
| An irreversible or high-risk action | [Button (`fd-button`)](/components/button) with `variant="destructive"` — always pair with a confirmation step |
| A set of related actions side by side | [Button Group (`fd-button-group`)](/components/button-group) |
| One primary action with a few closely related alternates (e.g., "Save" / "Save as Draft") | [Split Button (`fd-split-button`)](/components/split-button) — but start with separate buttons unless the alternates are clearly variations of the same intent |

**Do not** use a link styled to look like a button for actions. Screen readers announce links and buttons differently, and users expect different behavior from each.

## "I need the user to pick from options"

The right component depends on how many options there are and whether the user can pick one or many.

### Single selection (pick exactly one)

| Number of options | Use this |
|-------------------|----------|
| 2 to 5 options | [Radio Group (`fd-radio-group`)](/components/radio-group) — all options are visible without interaction |
| 6 or more options | [Selector (`fd-selector`)](/components/selector) with `variant="single"` — saves space by hiding options behind a trigger |
| Highly consequential single choice | [Radio Group (`fd-radio-group`)](/components/radio-group) regardless of count — visible options reduce the risk of accidental selection in high-stakes workflows |

### Multiple selection (pick zero or more)

| Number of options | Use this |
|-------------------|----------|
| 2 to 5 options | [Checkbox Group (`fd-checkbox-group`)](/components/checkbox-group) — all options are visible |
| 6 or more options, low stakes | [Selector (`fd-selector`)](/components/selector) with `variant="multiple"` |
| Any count, high stakes (regulatory, financial) | [Checkbox Group (`fd-checkbox-group`)](/components/checkbox-group) regardless of count — multi-select dropdowns hide selected state, creating comprehension risk |

### Other selection patterns

| Situation | Use this |
|-----------|----------|
| A single yes/no acknowledgement or consent | [Checkbox (`fd-checkbox`)](/components/checkbox) — standalone, not in a group |
| Choosing a bounded numeric value | [Slider (`fd-slider`)](/components/slider) |
| Entering a known value (not choosing from a list) | [Input (`fd-input`)](/components/input) or [Text Area (`fd-textarea`)](/components/textarea) |

## "I need to show a message"

Messages, alerts, badges, and chips look similar but serve different purposes. Using the wrong one is a common mistake.

| Situation | Use this | Do not use |
|-----------|----------|------------|
| **Field-level feedback** — telling the user about a specific input (error, hint, success) | [Message (`fd-message`)](/components/message) | Alert, Badge |
| **Page-level or section-level notice** — system updates, maintenance windows, submission failures, missing requirements | [Alert (`fd-alert`)](/components/alert) | Message, Badge, Callout |
| **Static metadata label** — a tag, category, or status that the user reads but does not act on ("Approved", "Small business") | [Badge (`fd-badge`)](/components/badge) | Alert, Chip |
| **User-removable filter or selection token** — the user can dismiss it from a set | [Chip (`fd-chip`)](/components/chip) | Badge |
| **Long-form instructional or explanatory content** — background information, how-to guidance, supporting context | [Callout](/components/callouts) | Alert |

### Badge vs. Chip vs. Alert — key differences

These three are frequently confused. Here is how to tell them apart:

- **Badge** = static metadata label. The user reads it. It has no interaction. Use it for tags, categories, and lightweight status indicators.
- **Chip** = user-removable token. The user can dismiss it. Use it for active filters and selected items that the user manages.
- **Alert** = system message requiring attention. It communicates time-sensitive information that changes the user's next step. Use it for warnings, errors, and important updates.

If you are unsure, ask: "Can the user dismiss this item from a set?" If yes, use a chip. "Does this communicate something urgent or time-sensitive?" If yes, use an alert. Otherwise, use a badge.

## "I need the user to fill out a form"

Pick the field shell based on the control family and how much authored markup you need to keep visible before upgrade.

| Situation | Use this |
|-----------|----------|
| A new wrapper-based field shell for text, grouped, selector, or file controls | [Form Field (`fd-form-field`)](/components/form-field) |
| A direct-child text-entry field where you want authored `fd-label` + `fd-input`/`fd-textarea` + `fd-message` markup in the document | [Field (`fd-field`)](/components/field) |
| A visible label for any form control | [Label (`fd-label`)](/components/label) |
| Validation or helper text for a field | [Message (`fd-message`)](/components/message) |

See [Form Workflows](/guide/form-workflows) for complete guidance on form structure, validation timing, and error recovery.

## "I need to structure the page"

| Situation | Use this |
|-----------|----------|
| The site-wide FDIC header | [Global Header (`fd-global-header`)](/components/global-header) |
| A page-level title area with breadcrumbs | [Page Header (`fd-page-header`)](/components/page-header) |
| A search field in the header | [Header Search (`fd-header-search`)](/components/header-search) |
| A slide-out panel for navigation or filters | [Drawer (`fd-drawer`)](/components/drawer) |
| A full-width colored band for section breaks | [Stripe (`fd-stripe`)](/components/stripe) |

## "I need an icon or image"

| Situation | Use this |
|-----------|----------|
| A decorative or semantic icon | [Icon (`fd-icon`)](/components/icon) |
| A responsive image or illustration | [Visual (`fd-visual`)](/components/visual) |
