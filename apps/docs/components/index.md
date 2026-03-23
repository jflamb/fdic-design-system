# Components

The components section documents the reusable building blocks and authored-content patterns in the FDIC design system.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component overview</span>
  <p>Use this section for implementation guidance, usage constraints, accessibility notes, and examples. Foundations explain the underlying rules; components show how those rules are applied in real interfaces and real content.</p>
</div>

## Current component groups

<div class="fdic-card-grid">
  <div class="fdic-card">
    <span class="fdic-eyebrow">First-class components</span>
    <h3>Button, Button Group, Checkbox, Checkbox Group, Radio, Radio Group, Input, Label, Selector, Split Button, Menu, Icon</h3>
    <p>Top-level Web Components consumers are expected to author directly in application markup. These pages define the primary supported component inventory.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Supporting primitives</span>
    <h3>Field and Message</h3>
    <p>Supporting primitives stay public and intentionally authorable, but their meaning depends on a broader composition contract. They have dedicated docs because consumers still need direct guidance for correct use.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Authored content</span>
    <h3>Prose</h3>
    <p>The <code>.prose</code> topic covers long-form content styling, document navigation, references, and supporting patterns for articles, policy content, and technical guidance.</p>
  </div>
</div>

Embedded-only supporting primitives such as <code>fd-menu-item</code> and <code>fd-option</code> are documented inside their parent component pages instead of appearing as top-level entries. Internal-only scaffolding primitives such as <code>fd-placeholder</code> are not part of the public component inventory.

## Featured topics

- [Prose](./prose) explains the `.prose` container, its boundary with Typography, and the specialized pages for callouts, tables, code blocks, references, disclosure patterns, and progress indicators.
- [Button](./button) documents action hierarchy, loading behavior, and native semantics.
- [Button Group](./button-group) documents grouped action layouts, semantic labeling, and responsive stacking.
- [Checkbox](./checkbox) documents standalone selection controls, indeterminate usage, and native form semantics.
- [Checkbox Group](./checkbox-group) documents grouped checkbox layouts, shared legends, and “at least one” validation.
- [Radio](./radio) documents single-choice controls, same-name grouping, and keyboard behavior.
- [Radio Group](./radio-group) documents grouped radio layouts, shared legends, and "select one" validation.
- [Icon](./icon) covers the system icon registry and usage guidance.
- [Menu](./menu) documents the current menu component patterns and limitations.
- [Field](./field) documents the supporting composition wrapper for label/input/message wiring.
- [Message](./message) documents helper, validation, warning, and success feedback content.
