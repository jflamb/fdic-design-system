# Surfaces and Effects

This page documents the current foundation tokens related to corners, overlays, and visual effects.

These values should stay minimal and purposeful. In a government design system, they exist to support clarity and hierarchy, not visual novelty.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Surface foundations</span>
  <p>Visual layering should make interfaces easier to parse, not more decorative. The examples below show the level of restraint these docs should encourage.</p>
</div>

## What exists today

The current exports include foundation values for:

- corner radius
- overlays
- effects
- surface-related semantic colors

Examples observed in the exports include:

- `_corner-radius.--radius-5`
- `Corner-radius.md = 5`
- `Overlay`
- `Effect`

## Visual anatomy

<div class="fdic-surface-demo">
  <div class="fdic-surface-card fdic-doc-card-copy" data-surface="base">
    <span class="fdic-eyebrow">Base surface</span>
    <p>Default page and form surface with clear borders and minimal visual treatment.</p>
  </div>
  <div class="fdic-surface-card fdic-doc-card-copy" data-surface="raised">
    <span class="fdic-eyebrow">Raised surface</span>
    <p>Reserved for contained panels, summaries, or layered content that benefits from separation.</p>
  </div>
  <div class="fdic-surface-card fdic-doc-card-copy" data-surface="overlay">
    <span class="fdic-eyebrow">Overlay</span>
    <p>Use only when the content remains readable and the user keeps context and orientation.</p>
  </div>
</div>

## Intended use

Use these foundations to document:

- corner treatment for components and containers
- overlays used for layered interfaces
- shadows or similar effects that support hierarchy
- surface distinctions between base, raised, and stateful areas

## Accessibility expectations

Effects and surfaces should not be the only mechanism used to communicate state or priority.

Documentation should preserve:

- visible boundaries for inputs and controls
- clear focus treatment independent of shadow alone
- overlays that maintain readable contrast
- restrained visual layering that does not obscure content

## Trust guidance

Financial and government interfaces benefit from visual restraint.

Prefer:

- clear borders over decorative depth
- consistent surface treatment
- overlays that preserve readability and orientation

Avoid:

- heavy shadow systems
- decorative layering that competes with content
- effects that imply interactivity where none exists

## What not to rely on yet

Do not assume:

- final elevation model
- final component radius scale
- final shadow token naming

## Known gaps

- Component-specific surface and elevation rules are not yet documented.
- The current exports show foundations, but not a final component token layer.
