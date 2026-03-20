# Component Documentation Redesign

> **Date:** 2026-03-20
> **Status:** Draft
> **Scope:** Component-level documentation pages on the VitePress docs site

## Problem

The current component documentation is heavily weighted toward technical specifications — HTML markup patterns, CSS token tables, ARIA attribute lists, forced-colors behavior. This serves developers well, but the docs site's primary audience is **designers and content authors** who need guidance on *when*, *why*, and *how* to use components — not implementation details.

World-class design systems (GOV.UK, Polaris, Carbon, USWDS) lead with decision-making guidance, content writing rules, and plain-language accessibility notes. Our docs need to match that standard.

## Decisions

### Audience split

- **Docs site** (VitePress): Serves designers and content authors. Guidance-first.
- **Storybook**: Serves developers. Houses all implementation detail — markup patterns, token references, ARIA implementation, forced-colors, print styles, responsive breakpoint mechanics, scripts.

### Embeds

- **Storybook embeds**: iframe via a `<StoryEmbed>` Vue component wrapping `<storybook-url>/iframe.html?id=<story-id>&viewMode=story`. Each embed gets a 1-sentence caption and a "View in Storybook" link.
- **Figma embeds**: iframe via a `<FigmaEmbed>` Vue component wrapping `https://www.figma.com/embed?embed_host=share&url=<encoded-url>`. Both use `loading="lazy"` for performance.

### Guidance depth

Full Polaris-style: decision trees for when to use/not use, do/don't pairs with explanations, content writing rules with before/after examples, plain-language accessibility guidance.

### Page structure

Required core sections on every page, plus optional sections that appear when relevant to a specific component.

## Page Template

| Order | Section | Required? | Purpose |
|-------|---------|-----------|---------|
| 1 | Overview | Required | 1-2 sentence definition in `fdic-foundation-intro` box with "Component" eyebrow |
| 2 | When to use | Required | Bulleted scenarios — "Use this when..." |
| 3 | When not to use | Optional | Misuse patterns + link to the right alternative |
| 4 | Live examples | Required | Storybook iframe embeds with captioned variants |
| 5 | Best practices | Required | Do/Don't card pairs (3-6 per page) |
| 6 | Interaction behavior | Optional | Keyboard, mouse, touch, focus management — for interactive components |
| 7 | Content guidelines | Optional | Writing rules for text inside the component |
| 8 | Accessibility | Required | Plain-language guidance for authors, not ARIA implementation |
| 9 | Design specs | Optional | Figma iframe embed |
| 10 | Related components | Optional | Links + 1-sentence differentiators |

## Section Definitions

### 1. Overview (required)

- Format: 1-2 sentences in `fdic-foundation-intro` box with "Component" eyebrow label
- Tone: Plain language, no jargon. A content author who has never seen a design system should understand it.
- Example: "Callouts draw attention to important information within a page. They use color, icons, and placement to signal how critical the message is — from helpful tips to urgent warnings."

### 2. When to use (required)

- Format: Bulleted list. Each bullet: **bolded situation** followed by brief explanation.
- Tone: Decision-oriented. "Use this when..." not "This component is for..."
- Every bullet should describe a real scenario the author would recognize.

### 3. When not to use (optional)

- Format: Same bulleted format. Each bullet names the wrong pattern AND links to the right one.
- Rule: Every "don't" must have a "do instead." Never say "don't use this" without an alternative.
- Present on components that are commonly confused with another (callouts vs. asides, details vs. callouts, etc.).

### 4. Live examples (required)

- Format: `<StoryEmbed>` Vue component(s). Default variant first, then key variants.
- Each embed gets a 1-sentence caption explaining what the variant is *for*, not just its name.
  - Good: "Warning — for actions that could lead to financial loss, missed deadlines, or compliance issues"
  - Bad: "Warning variant"
- "View in Storybook →" link below opens the full Storybook page.

### 5. Best practices (required)

- Format: Do/Don't card pairs using `fdic-card-grid` layout. Each card: short heading + 1-2 sentence explanation.
- Rule: Always pair a Do with a Don't. Never orphan either side.
- Quantity: 3-6 pairs per component.
- The Don't card should reflect a real-world mistake, not a straw man.

### 6. Interaction behavior (optional)

- Present on interactive components (Details/Accordion, TOC, Code Blocks copy button, and future interactive components).
- Format: Subsections for keyboard, mouse/touch, and focus management as needed.
- Tone: Describes what the interaction *should be and why* — aimed at designers and content authors evaluating the component, not developers wiring it up.
- Example (Details/Accordion):
  - "Clicking or tapping the summary toggles the content open and closed."
  - "Enter and Space keys toggle the accordion when the summary is focused."
  - "Focus moves to the summary element, not into the revealed content, after toggling — the user decides whether to read further."
- Implementation details (event handlers, ARIA state toggling, JS examples) live in Storybook.

### 7. Content guidelines (optional)

- Present on components where authors write text inside them (callouts, asides, table captions, details summaries, footnotes).
- Format: Bold rule → explanation → concrete Do/Don't example pair.
- Scope: Length, voice, structure, word choice for the text *inside* the component.
- Example:
  > **Lead with the consequence, not the action.**
  > Tell the reader what's at stake first, then what to do about it.
  >
  > *Do*: "Deposits above $250,000 are not insured. Contact your bank to discuss coverage options."
  > *Don't*: "Please note that you should contact your bank about coverage options for deposits above $250,000."

### 8. Accessibility (required)

- Format: Bulleted plain-language guidance for content authors.
- Scope: What authors need to *decide* or *provide* — labels, alt text, reading order, severity semantics. Not ARIA attributes or HTML structure (that's Storybook).
- Tone: "Every callout needs a label that tells screen reader users what kind of message it is" — not "Add role='note' and aria-label matching the variant."

### 9. Design specs (optional)

- Format: `<FigmaEmbed>` Vue component with `loading="lazy"`.
- Caption: 1-sentence description of what's in the Figma file.
- "View in Figma →" link opens the full Figma file.

### 10. Related components (optional)

- Format: Small card grid or simple list.
- Each entry: component name (linked) + 1-sentence differentiator framed as decision help.
- Pattern: "Use X *instead* when..." or "Use X *alongside* this when..."

## What Migrates to Storybook

The following content currently on component doc pages moves to Storybook:

- Full HTML markup patterns with ARIA attributes
- CSS token reference tables (anatomy panels, roles tables)
- Forced-colors mode implementation details
- Print stylesheet behavior
- Responsive breakpoint implementation mechanics
- Copy button and TOC JavaScript examples
- Component anatomy diagrams with token values

## Which Optional Sections Apply to Each Component

| Component | When not to use | Interaction | Content guidelines | Design specs | Related |
|-----------|:-:|:-:|:-:|:-:|:-:|
| Callouts | Yes | — | Yes | Yes | Yes |
| Table of Contents | — | Yes | — | Yes | Yes |
| Tables | Yes | Yes (scroll) | Yes (captions) | Yes | — |
| Footnotes | Yes | Yes (navigation) | Yes | Yes | — |
| Details / Accordion | Yes | Yes | Yes (summaries) | Yes | Yes |
| Code Blocks | — | Yes (copy) | — | Yes | — |
| Progress & Meter | — | — | Yes (labels) | Yes | Yes |
| Aside / Pull Quote | Yes | — | Yes | Yes | Yes |

## Example: Callouts Page

See the validated draft in the conversation history. It exercises all 10 sections and demonstrates the tone, format, and depth for each.

## Vue Components Needed

### `<StoryEmbed>`

Props:
- `storyId` (string, required) — Storybook story ID (e.g., `components-callout--default`)
- `height` (string, default `"300"`) — iframe height in px
- `caption` (string, optional) — displayed below the embed
- `storybookUrl` (string, optional) — override base URL; defaults to site config

Renders: `<figure>` with lazy-loaded iframe + caption + "View in Storybook →" link.

### `<FigmaEmbed>`

Props:
- `url` (string, required) — Figma file URL
- `height` (string, default `"450"`) — iframe height in px
- `caption` (string, optional) — displayed below the embed

Renders: `<figure>` with lazy-loaded iframe + caption + "View in Figma →" link.

## Writing Standards for All Component Pages

1. **Plain language first.** Write for someone who designs pages or writes content, not someone who writes CSS.
2. **FDIC-appropriate examples.** Use banking, regulatory, and financial content in all examples — never lorem ipsum.
3. **Concrete over abstract.** Every rule needs a real example. "Keep it short" → "1 to 3 sentences."
4. **Every "don't" needs a "do instead."** Never leave the reader knowing what's wrong without knowing what's right.
5. **Decision framing.** "When to use" and "Related components" exist to help someone pick the right component. Frame everything as choice guidance.
