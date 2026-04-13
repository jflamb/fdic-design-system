# Prose

Prose is the FDIC design system's authored-content layer. Apply the `.prose` container to long-form content when you need readable defaults, consistent vertical rhythm, and specialized patterns for references, navigation, supporting content, and technical examples.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Authored-content topic</span>
  <p>Typography defines the underlying type system. Prose documents how that system is applied to real content: article layouts, semantic HTML, editorial utilities, and the specialized classes that only make sense inside long-form documents.</p>
</div>

## Relationship to Typography

- **Typography** in Foundations owns the baseline rules: type scale, line heights, heading hierarchy, inline semantics, link principles, and reading measure.
- **Prose** in Components owns the opt-in content container: `.prose`, `lead`, container-scoped spacing behavior, rendered semantic HTML specimens, and document patterns such as callouts, table wrappers, TOCs, footnotes, and copy-enabled code blocks.
- If guidance still matters outside a `.prose` container, it probably belongs in [Typography](../guide/foundations/typography). If it exists because content is wrapped in `.prose`, it belongs here.

## When to use

- **Long-form editorial or policy content** such as guidance pages, procedures, explainers, and technical references.
- **Mixed semantic HTML content** where headings, lists, blockquotes, tables, inline code, and citations need to work together without page-by-page custom styling.
- **Documents with supporting patterns** such as callouts, TOCs, footnotes, details/summary, and code specimens.

## When not to use

- **Dense application UI** where layouts are component-driven rather than article-driven.
- **Single-purpose interface elements** like buttons, menus, or cards that should be documented as standalone components.
- **Pages that need bespoke layout rules** incompatible with the default reading measure or vertical rhythm.

## Basic usage

```html
<article class="prose">
  <p class="lead">This introductory paragraph summarizes the content.</p>
  <h2>Coverage overview</h2>
  <p>Body content inherits the prose type and spacing defaults.</p>
</article>
```

## Prose specimen

<div class="prose">
  <p class="lead">Use the prose container for content that should read clearly, scan predictably, and hold together across headings, lists, quotations, references, and supporting patterns.</p>

  <nav class="prose-toc" aria-label="Table of contents">
    <p class="prose-toc-title">On this page</p>
    <ul>
      <li><a href="#prose-headings">Headings and body text</a></li>
      <li><a href="#prose-supporting">Supporting patterns</a></li>
      <li><a href="#prose-references">References and navigation</a></li>
    </ul>
  </nav>

  <h2 id="prose-headings">Headings and body text</h2>
  <p>Within <code>.prose</code>, headings, paragraphs, lists, and inline elements work together with a consistent reading measure and spacing rhythm. Links remain descriptive and visible, inline code is distinct without relying on color alone, and semantic elements such as <abbr title="Federal Deposit Insurance Corporation">FDIC</abbr>, <kbd>Tab</kbd>, and <mark>highlighted findings</mark> remain readable inside running text.</p>
  <blockquote>
    <p>Typography provides the baseline. Prose turns those decisions into a usable authored-content system.</p>
    <footer><cite>FDIC design system documentation principle</cite></footer>
  </blockquote>

  <hr />

  <h2 id="prose-supporting">Supporting patterns</h2>
  <div class="prose-callout prose-callout-info" role="note" aria-label="Information">
    <span class="prose-callout-icon" aria-hidden="true"></span>
    <div class="prose-callout-content">
      <p>Specialized patterns such as callouts, code blocks, disclosure widgets, and pull quotes should be used when they improve comprehension, not just to create visual variety.</p>
    </div>
  </div>
  <ul>
    <li>Use callouts for short, high-signal supporting messages.</li>
    <li>Use <code>&lt;details&gt;</code> when readers should opt in to additional material.</li>
    <li>Use asides for supplementary content that still reads on its own.</li>
  </ul>

  <h2 id="prose-references">References and navigation</h2>
  <p>Long documents often need structured navigation and citation support. Prose includes patterns for tables of contents, footnotes, scrollable tables, and technical code examples so those needs can be met without inventing page-specific styling every time.</p>
</div>

## Semantic HTML specimens

Use these specimens to see how baseline semantic HTML renders inside `.prose`. Typography documents the rules; this section shows how those rules behave in running content.

### Inline semantics

<div class="prose">
  <p>
    The <abbr title="Federal Deposit Insurance Corporation">FDIC</abbr> may ask applicants to press <kbd>Tab</kbd> to move between fields, review <mark>highlighted requirements</mark>, and confirm that <q>all account details are accurate</q> before submission.
  </p>
  <p>
    <small>Supporting notes can appear in reduced text.</small> If guidance changes, outdated wording may be shown as <del><span class="sr-only">deleted: </span>previous language</del> and replaced with <ins><span class="sr-only">inserted: </span>updated language</ins>.
  </p>
  <p>
    A <dfn>routing number</dfn> is a bank identifier. In technical examples, <var>accountStatus</var> might produce <samp>verified</samp>, and the calculated result can appear in <output for="example-status">approved</output>.
  </p>
  <p>
    Payment is due by <time datetime="2026-04-15" title="April 15, 2026">April 15</time>, and reference markers such as H<sub>2</sub>O or x<sup>2</sup> should not distort the line height.
  </p>
</div>

```html
<article class="prose">
  <p>
    The <abbr title="Federal Deposit Insurance Corporation">FDIC</abbr>
    may ask applicants to press <kbd>Tab</kbd> to move between fields,
    review <mark>highlighted requirements</mark>, and confirm that
    <q>all account details are accurate</q> before submission.
  </p>
  <p>
    <small>Supporting notes can appear in reduced text.</small>
    If guidance changes, outdated wording may be shown as
    <del><span class="sr-only">deleted: </span>previous language</del>
    and replaced with
    <ins><span class="sr-only">inserted: </span>updated language</ins>.
  </p>
  <p>
    A <dfn>routing number</dfn> is a bank identifier. In technical
    examples, <var>accountStatus</var> might produce <samp>verified</samp>,
    and the calculated result can appear in
    <output for="example-status">approved</output>.
  </p>
</article>
```

### Quoted content

<div class="prose">
  <blockquote>
    <p>
      Clear language and predictable structure reduce mistakes in high-stakes public-service workflows.
    </p>
    <footer><cite>FDIC content principle</cite></footer>
  </blockquote>

  <p>
    Inline quotations such as <q>review before you submit</q> should stay inside running text and not be styled like pulled-out content.
  </p>
</div>

```html
<article class="prose">
  <blockquote>
    <p>
      Clear language and predictable structure reduce mistakes in
      high-stakes public-service workflows.
    </p>
    <footer><cite>FDIC content principle</cite></footer>
  </blockquote>

  <p>
    Inline quotations such as <q>review before you submit</q> should stay
    inside running text and not be styled like pulled-out content.
  </p>
</article>
```

### Authoring guidance

- Use `<blockquote>` only for actual quoted material, not for visual indentation.
- Use `<footer><cite>` for attribution when a quotation needs a source.
- Use `<q>` for short inline quotations that belong inside a paragraph.
- Do not rely on `<mark>` color alone to communicate importance; the surrounding sentence should explain why the text matters.
- Use `<del>` and `<ins>` only when the change itself is meaningful to the reader.

## Horizontal rules

Use `<hr>` to mark a thematic break between sections of content. Inside `.prose`, horizontal rules receive extra vertical spacing (`--fdic-spacing-3xl` / 3rem above and below) to clearly separate major content groups.

```html
<article class="prose">
  <p>End of one topic.</p>
  <hr />
  <p>Beginning of a new topic.</p>
</article>
```

<div class="prose">
  <p>Horizontal rules signal a shift in topic or scope. They carry more visual weight than a heading alone, so use them sparingly — typically between major thematic sections rather than between every heading.</p>
  <hr />
  <p>After the rule, the reader understands they are entering a distinct part of the document.</p>
</div>

### When to use

- Between major thematic sections that are conceptually independent.
- Before a footnotes section (the footnotes component includes its own narrower `<hr>`).

### When not to use

- Between every heading — headings already create visual separation.
- As a decorative element — use only when there is a genuine shift in topic.

## Prose topic map

<div class="fdic-card-grid">
  <div class="fdic-card">
    <span class="fdic-eyebrow">Status and emphasis</span>
    <h3><a href="./callouts">Callouts</a></h3>
    <p>Admonitions and supplementary messages with clear severity and accessibility guidance.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Data in content</span>
    <h3><a href="./tables">Tables</a></h3>
    <p>Scrollable data tables with captions, numeric alignment, and preserved semantics.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Technical specimens</span>
    <h3><a href="./code-blocks">Code blocks</a></h3>
    <p>Inline code, fenced blocks, copy affordances, and wrapping options for exact text.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Supporting content</span>
    <h3><a href="./details">Details / Accordion</a> and <a href="./aside">Aside / Pull Quote</a></h3>
    <p>Patterns for optional reading, supplementary context, and pull-out content.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">References and navigation</span>
    <h3><a href="./table-of-contents">Table of contents</a> and <a href="./footnotes">Footnotes</a></h3>
    <p>Document-level navigation and bidirectional citation patterns for long-form pages.</p>
  </div>
  <div class="fdic-card">
    <span class="fdic-eyebrow">Measurement</span>
    <h3><a href="./progress-meter">Progress and meter</a></h3>
    <p>Native progress indicators and gauges for authored technical and reporting content.</p>
  </div>
</div>

## Authoring rules

- Keep long-form pages structurally simple: one `h1`, sequential headings, clear section boundaries.
- Prefer semantic HTML over utility-heavy wrappers whenever the native element already communicates the meaning.
- Use Prose patterns to improve comprehension or navigation, not to decorate otherwise plain content.
- Keep print, reduced motion, keyboard use, and screen-reader behavior in scope for every specialized pattern.

## Related docs

- [Typography](../guide/foundations/typography) for the foundational type rules and reading principles
- [Accessibility](../guide/accessibility) for container-wide accessibility requirements that apply inside `.prose`
