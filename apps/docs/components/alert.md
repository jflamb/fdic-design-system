# Alert

Alerts communicate important, time-sensitive, or contextual information that may affect a person's next step.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-alert</code> for high-visibility messaging that needs to be noticed quickly without taking over the page. The component supports standard inline alerts, compact slim alerts, and page-level site alerts, with optional dismissal and optional live-region announcement when the alert is inserted after page load.</p>
</div>

## When to use

- **A message changes the person's task or attention priority** — system updates, maintenance windows, filing deadlines, missing requirements, or next-step blockers.
- **The message must be scannable at a glance** — severity color, iconography, and concise copy help people recognize urgency quickly.
- **You need a narrow page-level announcement surface** — use `variant="site"` when the message applies to the whole page, not just one field or subsection.

## When not to use

- **Routine field guidance or validation** — use [Message](/components/message) for field-level helper, warning, success, or error content tied to a specific input.
- **Long-form instructional content** — use [Callouts](/components/callouts) or page content when the information is explanatory rather than time-sensitive.
- **Actions that need a dedicated CTA row or multiple controls** — v1 keeps `fd-alert` focused on message delivery. If the pattern starts behaving like a panel or mini-workflow, compose with surrounding layout instead of stretching the alert API.

## Examples

<StoryEmbed
  storyId="components-alert--docs-overview"
  linkStoryId="components-alert--playground"
  height="1080"
  caption="Alert overview — default, slim, site-level, and emergency examples in one stack. Open Storybook for controls and dedicated state stories."
/>

<StoryEmbed
  storyId="components-alert--all-severities"
  linkStoryId="components-alert--playground"
  height="900"
  caption="Severity comparison — info, success, warning, error, and emergency. Choose the least disruptive severity that accurately reflects the situation."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default"` \| `"slim"` \| `"site"` | `default` | Controls the supplied Figma layout family: standard stacked alert, compact slim alert, or page-level site alert. |
| `type` | `"info"` \| `"success"` \| `"warning"` \| `"error"` \| `"emergency"` | `info` | Severity treatment for the alert surface, icon, and color system. |
| `title` | `string` | `` | Optional plain-text title rendered by the component. Slim alerts usually omit it, but the property is available across variants. |
| `dismissible` | `boolean` | `false` | Shows the internal dismiss button. The component emits an event but does not remove itself. |
| `dismiss-label` | `string \| undefined` | `undefined` | Optional accessible-name override for the dismiss button. Defaults to `Dismiss {title}` or `Dismiss alert`. |
| `live` | `"off"` \| `"polite"` \| `"assertive"` | `off` | Controls whether the alert stays static, announces politely via `role="status"`, or announces assertively via `role="alert"`. |

- `variant="site"` keeps its page-level region semantics even when `live` is enabled by nesting the live-region wrapper inside the site banner.
- `type="emergency"` is supported for all variants, including `site`; the site emergency styling is a small documented inference from the supplied Figma family.

## Slots

| Name | Description |
|---|---|
| (default) | Authored alert body content. Inline links are supported; dedicated CTA rows are intentionally out of scope in v1. |

Use the default slot for visible message copy. The component does not expose a separate actions slot in v1.

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-alert-dismiss` | `{}` | Fired when the internal dismiss button is activated. |

`fd-alert` does not hide or remove itself. The host application owns dismissal state and any follow-up focus recovery after removal.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-alert-radius` | `0` | Outer corner radius for the alert surface. |
| `--fd-alert-accent-width` | `8px` | Inline accent width for `default` and `slim` alerts. |
| `--fd-alert-site-accent-width` | `8px` | Top accent width for `site` alerts. |
| `--fd-alert-icon-size` | `22px` | Icon size for `default` and `slim` variants. |
| `--fd-alert-site-icon-size` | `28px` | Icon size for the `site` variant. |
| `--fd-alert-focus-ring` | `#38b6ff` | Focus-ring color for links and the dismiss button. |
| `--fd-alert-focus-gap` | `#ffffff` | Inner gap color used in the dismiss-button focus ring. |
| `--fd-alert-bg-info` | `#f1f8fe` | Info alert background. |
| `--fd-alert-accent-info` | `#0776cb` | Info alert accent and icon color. |
| `--fd-alert-bg-success` | `#e8f5e9` | Success alert background. |
| `--fd-alert-accent-success` | `#4caf50` | Success alert accent and icon color. |
| `--fd-alert-bg-warning` | `#fcf7ee` | Warning alert background. |
| `--fd-alert-accent-warning` | `#f49f00` | Warning alert accent and icon color. |
| `--fd-alert-bg-error` | `#fdedea` | Error alert background. |
| `--fd-alert-accent-error` | `#b10b2d` | Error alert accent and icon color. |
| `--fd-alert-bg-emergency` | `#d80e3a` | Emergency alert background. |
| `--fd-alert-accent-emergency` | `#b10b2d` | Emergency alert accent. |
| `--fd-alert-text-color` | `#212123` | Default alert text color. |
| `--fd-alert-text-color-inverted` | `#ffffff` | Text color used for emergency alerts. |
| `--fd-alert-link-color` | `#0d6191` | Link color for non-emergency alerts. |
| `--fd-alert-link-color-inverted` | `#ffffff` | Link color for emergency alerts. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Outer alert surface. For `site`, this is the named page-level section wrapper. |
| `icon` | Decorative severity icon wrapper. |
| `title` | Rendered title text when the `title` property is set. |
| `body` | Visible body-content wrapper around the default slot. |
| `dismiss-button` | Internal native dismiss button. |
| `dismiss-icon` | Decorative close icon wrapper inside the dismiss button. |

- `fd-alert` keeps the severity icon decorative and adds a screen-reader-only severity label in the rendered content.
- The component does not expose a shadow part for the live-region wrapper because that wrapper is an implementation detail of the semantic contract, not a styling surface.
<!-- GENERATED_COMPONENT_API:END -->

## Severity guidance

Choose the least disruptive severity that accurately reflects the situation:

| Severity | When to use | Example |
|----------|------------|---------|
| `info` | Neutral updates that do not require action. The default. | "Your session will expire in 10 minutes." |
| `success` | Confirming that an action completed successfully. | "Filing submitted successfully." |
| `warning` | Emerging risk that does not yet block the user. | "This account has not been reviewed in 90 days." |
| `error` | A blocker that prevents the user from continuing. | "Submission failed — required fields are missing." |
| `emergency` | Truly urgent, high-impact conditions affecting safety or critical operations. Use sparingly. | "All systems are offline for emergency maintenance." |

**Do not default to `error` or `emergency`.** Overusing high-severity treatments trains users to ignore them. Start with `info` and escalate only when the situation genuinely warrants it.

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Lead with the consequence or next step</h4>
    <p>People should understand why the alert matters as soon as they read the title and first sentence.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use alerts for generic status noise</h4>
    <p>If the message does not change what the person should notice or do, it probably does not need alert treatment.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Match severity to real user impact</h4>
    <p>Use info for neutral updates, warning for emerging risk, error for blockers, and emergency only for truly urgent, high-impact conditions.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Escalate everything to emergency styling</h4>
    <p>Overusing the highest-severity treatment makes it harder for people to recognize genuinely urgent situations.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Let the application own dismissal state</h4>
    <p>When the close button is shown, remove the alert only when your application decides it should go away and can restore focus appropriately if needed.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Auto-dismiss important messages</h4>
    <p>People need enough time to read and act on high-importance content, especially in high-stakes financial and government workflows.</p>
  </div>
</div>

## Content guidelines

- **Write concise, specific titles.** Lead with what changed: “Planned maintenance,” “Missing attachment,” “Submission failed.”
- **Keep body copy focused on impact and next step.** One short sentence is often enough. Add an inline link only when the person needs more detail or a clear recovery path.
- **Use sentence case.** It reads more naturally and aligns with the rest of the system.
- **Do not rely on color alone.** The component already pairs color with iconography and a screen-reader-only severity label, but the written message still needs to explain the issue clearly.

## Accessibility

- `fd-alert` keeps a **plain tab order**. It does not add custom keyboard handling beyond the native dismiss button and any authored links in the body.
- For default and slim variants, the base surface is a non-interactive container. When `live="polite"` or `live="assertive"`, the base receives `role="status"` or `role="alert"` with `aria-atomic="true"`.
- For `variant="site"`, the component keeps a semantic `<section>` wrapper for page-level structure. If live announcement is enabled, the live region is nested inside that section instead of replacing it.
- The severity icon is decorative. The component adds a screen-reader-only severity label in the rendered content so meaning is not conveyed by color or icon alone.
- The dismiss control is a native `<button type="button">`. Activating it emits `fd-alert-dismiss` but does not remove the alert. The host application owns dismissal state and any focus recovery after removal.
- Use `live="polite"` or `live="assertive"` only when the alert is injected or updated after page load and needs announcement. Static alerts that are already present when the page loads should usually leave `live="off"`.

## Known limitations

- **No built-in action slot** — v1 supports concise body content and inline links, but not dedicated CTA rows or grouped actions.
- **No auto-dismiss behavior** — timing, persistence, and removal conditions are application-owned.
- **Title is text-only in v1** — use the `title` property for a short heading. Rich heading markup is intentionally out of scope.

## Choosing between Alert, Badge, and Chip

These three components are frequently confused. Use the right one:

- **Alert** (this component) = system message requiring attention. Use for time-sensitive or high-priority information that changes the user's next step.
- **[Badge](/components/badge)** = static metadata label. The user reads it but cannot act on it. Use for tags, categories, and status indicators.
- **[Chip](/components/chip)** = user-removable token. The user can dismiss it from a visible set. Use for active filters and selected items.

If the user only reads a short label, use a badge. If the user removes it from a set, use a chip. If it communicates something requiring attention or action, use an alert.

## Related components

- [Message](/components/message) — field-level feedback tied to a specific form control
- [Callouts](/components/callouts) — longer-form instructional or supportive content that does not need alert urgency
- [Badge](/components/badge) — static metadata labels when the information is not time-sensitive
- [Chip](/components/chip) — user-removable tokens for active filters or selections
- [Button](/components/button) — use adjacent buttons when the page needs a separate recovery action outside the alert body
- [Form Workflows](/guide/form-workflows) — page-level guidance for blocked-submit error summaries, trust language, review protections, and confirmation states
