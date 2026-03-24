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
    <h3>Button, Button Group, Checkbox, Checkbox Group, Icon, Input, Label, Menu, Radio, Radio Group, Selector, Split Button, File Input, Slider, Badge, Badge Group, Chip, Chip Group</h3>
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
- [Button](./button) documents button usage, constraints, and accessibility guidance.
- [Button Group](./button-group) documents button group usage, constraints, and accessibility guidance.
- [Checkbox](./checkbox) documents checkbox usage, constraints, and accessibility guidance.
- [Checkbox Group](./checkbox-group) documents checkbox group usage, constraints, and accessibility guidance.
- [Icon](./icon) documents icon usage, constraints, and accessibility guidance.
- [Input](./input) documents input usage, constraints, and accessibility guidance.
- [Label](./label) documents label usage, constraints, and accessibility guidance.
- [Menu](./menu) documents menu usage, constraints, and accessibility guidance.
- [Radio](./radio) documents radio usage, constraints, and accessibility guidance.
- [Radio Group](./radio-group) documents radio group usage, constraints, and accessibility guidance.
- [Selector](./selector) documents selector usage, constraints, and accessibility guidance.
- [Split Button](./split-button) documents split button usage, constraints, and accessibility guidance.
- [File Input](./file-input) documents file input usage, constraints, and accessibility guidance.
- [Slider](./slider) documents slider usage, constraints, and accessibility guidance.
- [Badge](./badge) documents badge usage, constraints, and accessibility guidance.
- [Badge Group](./badge-group) documents badge group usage, constraints, and accessibility guidance.
- [Chip](./chip) documents chip usage, constraints, and accessibility guidance.
- [Chip Group](./chip-group) documents chip group usage, constraints, and accessibility guidance.
- [Field](./field) documents the supporting primitive contract for field.
- [Message](./message) documents the supporting primitive contract for message.
