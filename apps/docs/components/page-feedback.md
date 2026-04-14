# Page Feedback

Collect a quick usefulness signal, route dissatisfied visitors to a fuller survey, and offer a lightweight way to report page problems.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use <code>fd-page-feedback</code> near the end of a page when you want a compact “Was this useful?” pattern with a survey follow-up path, a simple page-problem report, and built-in focus recovery between those states.</p>
</div>

## When to use

- **You need a small inline feedback pattern** — the component keeps the flow on the page instead of pushing people into a larger support workflow immediately.
- **A survey link exists for deeper dissatisfaction feedback** — the “No” path assumes there is a follow-up destination where people can explain more.
- **A page issue can be described briefly** — the report state is intentionally lightweight and fits short freeform text, not a full case-management flow.

## When not to use

- **The problem report needs attachments, identity capture, or tracking** — use a fuller support or contact workflow instead.
- **You need broad copy customization or localization flexibility today** — v1 keeps the wording intentionally narrow and FDIC-specific.
- **The page already includes another major feedback or support surface nearby** — avoid stacking multiple “give feedback” patterns in the same part of the page.

## Examples

<StoryEmbed
  storyId="components-page-feedback--docs-overview"
  linkStoryId="components-page-feedback--playground"
  height="1480"
  caption="Page Feedback overview — prompt, survey follow-up, report problem, and thank-you states. Open Storybook for controls and interaction stories."
/>

`fd-page-feedback` uses the shared page-shell alignment token, the compact section-padding token, the shared stack/content gap tokens, and the readable paragraph-width token for its longer survey and report copy.

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `view` | `"prompt"` \| `"survey"` \| `"report"` \| `"thanks"` | `prompt` | Current visible state. The component updates this internally for its built-in flow, but hosts may also set it directly to reset or override the visible state. |
| `survey-href` | `string \| undefined` | `undefined` | Optional survey destination used by the survey follow-up link. |
| `survey-target` | `string \| undefined` | `undefined` | Optional native target for the survey link. |
| `survey-rel` | `string \| undefined` | `undefined` | Optional native rel tokens for the survey link. Use this when the survey destination needs extra relationship hints beyond the component's default link behavior. |

`fd-page-feedback` intentionally keeps copy and field structure fixed in v1. Hosts configure the survey destination and respond to events instead of customizing every label.

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-page-feedback-view-change` | `{ view: "prompt" \| "survey" \| "report" \| "thanks", previousView: "prompt" \| "survey" \| "report" \| "thanks", reason: "yes" \| "no" \| "report" \| "cancel-survey" \| "cancel-report" \| "submit-report" \| "external" }` | Fired whenever the visible view changes through the built-in interaction flow or an external `view` write. |
| `fd-page-feedback-report-submit` | `{ tryingToDo: string, wentWrong: string }` | Cancelable event fired when the report action is submitted. If not canceled, the component clears the draft values and moves to the thank-you state. |

`fd-page-feedback-report-submit` is cancelable so the host can keep the report view open while it performs validation, analytics, or transport work.

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-page-feedback-border-image` | `var(--fdic-gradient-brand-core, var(--fdic-brand-core-light, #38b6ff))` | Decorative top rule fill applied to the feedback surface. |
| `--fd-page-feedback-max-width` | `var(--fdic-layout-shell-max-width, var(--fdic-layout-content-max-width, 1312px))` | Maximum inline size of the feedback panel. Defaults to the shared page-shell width contract. |
| `--fd-page-feedback-inline-padding` | `64px` | Desktop inline padding. |
| `--fd-page-feedback-inline-padding-mobile` | `16px` | Mobile inline padding at `640px` and below. |
| `--fd-page-feedback-block-padding` | `var(--fdic-layout-section-block-padding-compact, 24px)` | Desktop block padding. Defaults to the shared compact-section spacing token. |
| `--fd-page-feedback-block-padding-mobile` | `20px` | Mobile block padding at `640px` and below. |
| `--fd-page-feedback-gap` | `var(--fdic-layout-stack-gap, 16px)` | Gap between stacked elements inside survey and report states. Defaults to the shared vertical stack rhythm token. |
| `--fd-page-feedback-heading-size` | `22.5px` | Heading-size override for the survey and report titles. |
| `--fd-page-feedback-thank-you-color` | `inherit` | Thank-you message color. |

Buttons, links, icons, and textareas keep their own component-scoped tokens. `fd-page-feedback` only exposes framing and layout overrides in v1.

## Shadow parts

| Name | Description |
|---|---|
| `base` | Outer feedback surface. |
| `prompt` | Active prompt or view heading text. |
| `responses` | Yes/No response row in the prompt state. |
| `survey-link` | Survey link wrapper in the survey state. |
| `report-fields` | Stack containing the two report text areas. |
| `actions` | Action row for the active state. |
| `thank-you` | Focusable thank-you acknowledgement container. |
<!-- GENERATED_COMPONENT_API:END -->

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Place the component after the main content</h4>
    <p>People need enough context to answer whether the page was useful. Treat it as an end-of-page feedback checkpoint, not an introduction.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use it as a support portal</h4>
    <p>The report state is intentionally small. If the workflow needs case tracking, attachments, or contact information, hand off to a fuller form.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Provide a real survey destination</h4>
    <p>The “No” path is most useful when it leads somewhere people can explain what was missing or confusing in more detail.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Assume the component handles analytics or transport</h4>
    <p>The host application still owns persistence, instrumentation, and any follow-up action after someone submits a report.</p>
  </div>
</div>

## Content guidelines

- **Keep the pattern near the page it evaluates.** The question should refer to the content people just reviewed, not to a broader site section.
- **Keep the feedback rail aligned to the surrounding page shell.** Let the component keep its default shell width and readable text width unless the whole page intentionally diverges from the shared contract.
- **Let the prompt row keep its natural one-line fit on larger widths.** The usefulness question and response buttons are designed to stay together as one compact cluster until the available width genuinely requires wrapping.
- **Treat the survey path as the deeper dissatisfaction channel.** The inline component should stay small and fast; the survey can ask broader or more detailed questions.
- **Use the report state for page-specific problems.** The two prompts work best for broken links, missing information, unexpected behavior, or other page-level issues.
- **Avoid adding apology-heavy copy inside the component.** Keep the language direct and task-oriented so people can act quickly.

## Implementation guide

`fd-page-feedback` owns its internal view transitions and focus recovery, but the host application still owns integration work.

Use it this way:

```html
<fd-page-feedback
  survey-href="https://www.fdic.gov/feedback-survey"
  survey-target="_blank"
></fd-page-feedback>

<script type="module">
  const feedback = document.querySelector("fd-page-feedback");

  feedback.addEventListener("fd-page-feedback-report-submit", async (event) => {
    const { tryingToDo, wentWrong } = event.detail;

    // Keep the report view open if the host needs to validate or wait for a response.
    event.preventDefault();

    await sendPageFeedback({ tryingToDo, wentWrong });
    feedback.view = "thanks";
  });
</script>
```

Key integration rules:

- **Set `survey-href` whenever the “No” path should offer a deeper survey.** If `survey-href` is omitted, the survey state still renders its explanatory copy and Cancel action, but it has no survey link.
- **Listen for `fd-page-feedback-report-submit` to capture report content.** The event is cancelable, so the host can keep the report state open while it validates or transports the data.
- **Treat external `view` writes as host-owned focus changes.** The component restores focus for its built-in button-driven transitions, but if the application changes `view` programmatically it should also decide whether additional focus movement is appropriate.
- **Use `fd-page-feedback-view-change` for analytics or logging.** That event records whether the person answered Yes, answered No, opened the report flow, canceled, submitted, or whether the host changed the view directly.

## Accessibility

- The root uses a light `role="group"` wrapper with `aria-labelledby` pointing at the active prompt or heading text. This keeps the component discoverable without adding another page landmark.
- All interactive controls stay native: buttons for state changes, a link for the survey path, and textareas for the report prompts.
- The component owns focus recovery for built-in state changes that remove the active control:
  - `No` moves focus to the survey link when `survey-href` exists, otherwise to the survey Cancel button.
  - `Report a problem with this page` moves focus to the first textarea.
  - Survey Cancel returns focus to the `No` button.
  - Report Cancel returns focus to the report trigger button.
  - `Yes` and successful report submit move focus to the thank-you acknowledgement.
- Decorative framing and icons remain `aria-hidden`.
- No custom arrow-key, roving-tabindex, overlay, or modal behavior is added in v1.

## Known limitations

- **Copy surface is intentionally narrow** — v1 does not expose separate properties for each label, heading, or message in the flow.
- **No built-in inline validation UI** — the report state emits a cancelable submit event, but it does not ship field-level error messaging in v1.
- **No loading or failure state** — if the host needs transport progress or failure messaging, it should cancel submit and manage the next visible state itself.
- **Survey path is URL-based** — embedded survey integrations or richer survey callbacks are out of scope for v1.

## Related components

- [Alert](/components/alert) — higher-visibility feedback and status messaging
- [Button](/components/button) — the action and response controls used inside the pattern
- [Link](/components/link) — text-link treatment for the survey follow-up path
- [Text Area](/components/textarea) — multiline report fields for page-problem capture
