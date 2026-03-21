# Progress & Meter

Progress bars and meters visualize completion and measurement. Progress tracks how far a task has advanced toward completion; meter displays a value within a known range.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use progress for tasks that have a beginning and end — file uploads, form completion, processing steps. Use meter for static measurements within a defined range — compliance scores, capacity utilization, threshold levels.</p>
</div>

## When to use

### Progress

A task is underway and the reader benefits from knowing how far along it is — uploading documents, processing submissions, completing a multi-step form.

### Indeterminate progress

A task is running but the duration is unknown — waiting for a server response, background processing.

### Meter

Displaying a measurement within a known range — a bank's capital ratio against regulatory minimums, storage capacity, compliance score.

## Examples

<StoryEmbed storyId="prose-progress--determinate" caption="Determinate progress — known completion percentage" />
<StoryEmbed storyId="prose-progress--indeterminate" caption="Indeterminate progress — unknown duration with animated stripes" />
<StoryEmbed storyId="prose-meter--default" caption="Meter — value within a known range with optimum/suboptimum states" />

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Always pair the bar with a label and text value</h4>
    <p>Always pair a progress bar or meter with a visible label and text value — "75 of 100 items processed (75%)."</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't show a bar without context</h4>
    <p>A bare bar is ambiguous — users cannot tell what is being measured, what the scale is, or how far along the task is without a label and value.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use meter for static measurements</h4>
    <p>Use meter (not progress) for static measurements — compliance scores, capital ratios, capacity levels.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't use progress for values that aren't progressing</h4>
    <p>Progress implies a task moving toward completion. A static measurement like a compliance score should use meter instead.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use indeterminate progress for unknown durations</h4>
    <p>Use indeterminate progress when the task is running but the duration is unknown.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't fake a percentage</h4>
    <p>A fabricated number erodes trust. An honest indeterminate bar tells the user the task is running without making promises about when it will finish.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use meter ranges to communicate status</h4>
    <p>Use meter's optimum, suboptimum, and sub-sub-optimum ranges to color-code whether a value is acceptable (green), concerning (yellow), or critical (red).</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Don't rely on color alone</h4>
    <p>Color-blind users and those in high-contrast mode cannot distinguish green from red. The numeric value and label text must convey the same status information the color does.</p>
  </div>
</div>

## Content guidelines

<div class="fdic-content-rule">
  <strong>Write labels that describe what is being measured.</strong>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>"Call Reports submitted — 847 of 1,200 (71%)"</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>"Progress: 71%"</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Include both the current value and the total or range in the text.</strong>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>"Tier 1 capital ratio: 12.4% (well-capitalized minimum: 6%)"</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>"Ratio: 12.4%"</p>
    </div>
  </div>
</div>

## Accessibility

- **Every progress bar and meter needs a visible label.** The label connects the visual bar to its meaning for all users.
- **The text value provides the information screen readers announce.** The text value (e.g., "75 of 100") provides the information screen readers announce. Don't rely on the visual bar alone.
- **Indeterminate progress respects reduced motion.** Indeterminate progress bars use animated stripes to show activity. Users who prefer reduced motion see a static striped pattern instead.
- **Meter color changes must be paired with numeric values.** Meter color changes (green/yellow/red) must be paired with the numeric value — color alone does not convey whether a value is good or bad.

## Design specs

<FigmaEmbed url="" caption="Progress and meter anatomy — label, bar, value text, and color states" />

## Related components

<div class="fdic-related-list">

- Progress and meter are two distinct elements documented on this page. See [Callouts](./callouts) for status messages that need visual emphasis beyond a bar chart.

</div>
