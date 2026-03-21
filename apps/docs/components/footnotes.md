# Footnotes

Footnotes provide a way to cite sources, add clarifications, or include supplementary detail without interrupting the main text. They connect inline references to notes at the bottom of the page with bidirectional navigation.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use footnotes for citations, legal references, and clarifications that support the main text but would break the reading flow if included inline.</p>
</div>

## When to use

- **Citing a regulation, statute, or external source that readers may want to verify** — Footnotes let you provide the full citation without interrupting the sentence the reader is in the middle of.
- **Adding a clarification or caveat that would break the flow of the main sentence** — Move the qualifying detail to a footnote so the primary point lands clearly.
- **Providing technical definitions or methodology notes for data presented in the text** — Readers who need the detail can follow the reference; others can keep reading.

## When not to use

- **Don't use footnotes for content that most readers need** — If it's essential, put it in the body text or a [callout](./callouts).
- **Don't use footnotes as a dumping ground for tangential thoughts** — If the information isn't worth citing, it's not worth footnoting.
- **Don't use footnotes when a parenthetical aside would work** — Short inline clarifications are easier to read than jumping to the bottom of the page.

## Examples

<StoryEmbed storyId="prose-footnotes--default" caption="Footnotes section with bidirectional navigation" />

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Number footnotes sequentially</h4>
    <p>Number footnotes sequentially as they appear in the text — [1], [2], [3].</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use symbols, letters, or skip numbers</h4>
    <p>Sequential numbering is the expected convention. Non-standard markers confuse readers.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Place footnotes at the end of the article</h4>
    <p>Place the footnotes section at the end of the article, after all body content.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Scatter footnote definitions mid-page</h4>
    <p>Readers expect footnotes at the bottom. Placing them elsewhere breaks the convention.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep footnotes concise</h4>
    <p>Keep footnotes to one or two sentences.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Write multi-paragraph footnotes</h4>
    <p>If the content needs that much space, it belongs in the body text or an <a href="./aside">aside</a>.</p>
  </div>
</div>

## Interaction behavior

- Clicking a **footnote reference** (e.g., [1]) in the body text scrolls to the corresponding footnote at the bottom of the page.
- Each footnote includes a **back-link** (↩) that returns the reader to the exact point in the text where the reference appeared.
- When a footnote is navigated to, it **briefly highlights** with a yellow flash to help the reader locate it. Users who prefer reduced motion see a static highlight instead.
- Footnote references have **enlarged tap targets** for easier activation on touch devices.

## Content guidelines

<div class="fdic-content-rule">
  <strong>Footnote text should stand alone.</strong>
  <p>A reader jumping to the footnote shouldn't need to re-read the surrounding paragraph to understand it.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>"12 C.F.R. § 330.1 defines 'deposit' for insurance purposes."</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>"See the above section for context on this definition."</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Lead with the source or fact, not filler.</strong>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>"Federal Register, Vol. 89, No. 42 (March 2024)."</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>"For more information, please refer to the Federal Register, Vol. 89, No. 42 (March 2024), which contains additional details."</p>
    </div>
  </div>
</div>

<div class="fdic-content-rule">
  <strong>Use consistent citation formatting throughout a document.</strong>
  <p>Pick a citation style and stick with it.</p>
  <div class="fdic-content-example">
    <div class="fdic-content-do">
      <span class="fdic-eyebrow">Do</span>
      <p>Consistent "12 C.F.R. § 330.1" format throughout.</p>
    </div>
    <div class="fdic-content-dont">
      <span class="fdic-eyebrow">Don't</span>
      <p>Mixing "12 CFR 330.1", "Title 12, Section 330.1", and "§330.1" in the same document.</p>
    </div>
  </div>
</div>

## Accessibility

- Footnote references and back-links create a **bidirectional navigation pattern** — screen reader users can jump to the footnote and back without losing their place.
- The footnotes section is identified as a **document endnotes region**, so assistive technology can announce it as a distinct section.
- Each footnote reference is **clearly labeled** so screen readers announce it as a link to a specific note, not just a bracketed number.
- The highlight animation on footnote arrival is **suppressed for users who prefer reduced motion** — they see a static highlight instead.

## Design specs

<FigmaEmbed url="" caption="Footnote anatomy — inline reference, back-link, and target highlight" />

## Related components

<div class="fdic-related-list">

- [Table of Contents](./table-of-contents) — Both are document navigation aids. TOC navigates between sections; footnotes navigate between references and their sources.

</div>
