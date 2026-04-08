# Components

The components section documents the reusable building blocks and authored-content patterns in the FDIC design system.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component overview</span>
  <p>Use this section for implementation guidance, usage constraints, accessibility notes, and examples. Foundations explain the underlying rules; components show how those rules are applied in real interfaces and real content.</p>
</div>

## Current component groups

<div class="fdic-card-grid">
  <div class="fdic-card">
    <span class="fdic-eyebrow">Forms & Input</span>
    <h3>Label, Input, Text Area, Checkbox, Checkbox Group, Radio, Radio Group, Selector, File Input, Slider, Field, Message</h3>
    <p>Data-entry controls and composition helpers for labels, grouping, validation, and supporting guidance.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Actions & Navigation</span>
    <h3>Button, Button Group, Split Button, Link, Menu, Tile, Tile List, Event, Event List, Pagination</h3>
    <p>Controls and navigation patterns that trigger actions, expose destinations, or move people through flows.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Feedback & Status</span>
    <h3>Alert, Badge, Page Feedback, Badge Group, Chip, Chip Group</h3>
    <p>Components that communicate status, lightweight emphasis, selection context, or supporting state.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Layout & Shell</span>
    <h3>Global Header, Page Header, Hero, Global Footer, Header Search, Drawer, Stripe</h3>
    <p>Shell-level and structural components for headers, drawers, search surfaces, and grouped layout treatments.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Visual & Media</span>
    <h3>Icon, Visual, Card</h3>
    <p>Icons and visual primitives that support other components and layouts without becoming full authored-content patterns.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Authored content</span>
    <h3>Prose</h3>
    <p>The <code>.prose</code> topic covers long-form content styling, document navigation, references, and supporting patterns for articles, policy content, and technical guidance.</p>
  </div>
</div>

These docs group public components by the job they do in an interface. The underlying implementation taxonomy still distinguishes first-class components from supporting primitives for export and composition rules.

Embedded-only supporting primitives such as <code>fd-menu-item</code> and <code>fd-option</code> are documented inside their parent component pages instead of appearing as top-level entries. Internal-only scaffolding primitives such as <code>fd-placeholder</code> are not part of the public component inventory.

## Featured topics

- [Prose](./prose) explains the `.prose` container, its boundary with Typography, and the specialized pages for callouts, tables, code blocks, references, disclosure patterns, and progress indicators.
### Forms & Input

- [Label](./label) documents label usage, constraints, and accessibility guidance.
- [Input](./input) documents input usage, constraints, and accessibility guidance.
- [Text Area](./textarea) documents text area usage, constraints, and accessibility guidance.
- [Checkbox](./checkbox) documents checkbox usage, constraints, and accessibility guidance.
- [Checkbox Group](./checkbox-group) documents checkbox group usage, constraints, and accessibility guidance.
- [Radio](./radio) documents radio usage, constraints, and accessibility guidance.
- [Radio Group](./radio-group) documents radio group usage, constraints, and accessibility guidance.
- [Selector](./selector) documents selector usage, constraints, and accessibility guidance.
- [File Input](./file-input) documents file input usage, constraints, and accessibility guidance.
- [Slider](./slider) documents slider usage, constraints, and accessibility guidance.
- [Field](./field) documents the supporting primitive contract for field.
- [Message](./message) documents the supporting primitive contract for message.

### Actions & Navigation

- [Button](./button) documents button usage, constraints, and accessibility guidance.
- [Button Group](./button-group) documents button group usage, constraints, and accessibility guidance.
- [Split Button](./split-button) documents split button usage, constraints, and accessibility guidance.
- [Link](./link) documents link usage, constraints, and accessibility guidance.
- [Menu](./menu) documents menu usage, constraints, and accessibility guidance.
- [Tile](./tile) documents tile usage, constraints, and accessibility guidance.
- [Tile List](./tile-list) documents tile list usage, constraints, and accessibility guidance.
- [Event](./event) documents event usage, constraints, and accessibility guidance.
- [Event List](./event-list) documents event list usage, constraints, and accessibility guidance.
- [Pagination](./pagination) documents pagination usage, constraints, and accessibility guidance.

### Feedback & Status

- [Alert](./alert) documents alert usage, constraints, and accessibility guidance.
- [Badge](./badge) documents badge usage, constraints, and accessibility guidance.
- [Page Feedback](./page-feedback) documents page feedback usage, constraints, and accessibility guidance.
- [Badge Group](./badge-group) documents badge group usage, constraints, and accessibility guidance.
- [Chip](./chip) documents chip usage, constraints, and accessibility guidance.
- [Chip Group](./chip-group) documents chip group usage, constraints, and accessibility guidance.

### Layout & Shell

- [Global Header](./global-header) documents global header usage, constraints, and accessibility guidance.
- [Page Header](./page-header) documents page header usage, constraints, and accessibility guidance.
- [Hero](./hero) documents hero usage, constraints, and accessibility guidance.
- [Global Footer](./global-footer) documents global footer usage, constraints, and accessibility guidance.
- [Header Search](./header-search) documents the supporting primitive contract for header search.
- [Drawer](./drawer) documents the supporting primitive contract for drawer.
- [Stripe](./stripe) documents the supporting primitive contract for stripe.

### Visual & Media

- [Icon](./icon) documents icon usage, constraints, and accessibility guidance.
- [Visual](./visual) documents the supporting primitive contract for visual.
- [Card](./card) documents card usage, constraints, and accessibility guidance.
