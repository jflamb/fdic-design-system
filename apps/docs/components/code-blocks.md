# Code Blocks

Code blocks display formatted code snippets, configuration examples, and technical output. They use a monospace font, syntax-appropriate formatting, and an optional copy button for easy reuse.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Component</span>
  <p>Use code blocks to present API examples, configuration snippets, file paths, and technical output that readers may need to copy or reference exactly as shown.</p>
</div>

## When to use

- **Showing API request/response examples, configuration files, or command-line instructions** — Any content where the reader needs to see exact syntax and may copy it directly.
- **Presenting file paths, database queries, or technical identifiers that must be reproduced exactly** — Monospace formatting and container styling signal "use this verbatim."
- **Displaying sample data formats (JSON, XML, CSV) that accompany technical documentation** — Structured data is easier to scan in a code block than in running prose.
- **Any content where exact characters, spacing, and formatting matter** — Code blocks preserve whitespace and prevent line-wrapping by default, keeping the structure intact.

## Examples

<StoryEmbed storyId="prose-code-block--default" caption="Fenced code block with syntax formatting" />
<StoryEmbed storyId="prose-code-block--with-copy" caption="Code block with copy-to-clipboard button" />

## Best practices

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Always specify the language for fenced code blocks</h4>
    <p>It enables syntax formatting and helps screen readers announce the content type.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use generic unstyled code blocks when the language is known</h4>
    <p>Without a language class, the block loses syntax formatting and assistive technology cannot describe what kind of code it contains.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Keep code blocks focused</h4>
    <p>Show the minimum needed to illustrate the point. Highlight the relevant lines, not the entire file.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Paste entire files into a code block</h4>
    <p>Readers lose the relevant lines in noise. Extract only the portion that matters and link to the full source if needed.</p>
  </div>
</div>

<div class="fdic-do-dont-grid">
  <div class="fdic-do-card">
    <span class="fdic-eyebrow">Do</span>
    <h4>Use inline code for short references within sentences</h4>
    <p>File names, function names, property values, and similar fragments stay in the reading flow as inline <code>&lt;code&gt;</code> elements.</p>
  </div>
  <div class="fdic-dont-card">
    <span class="fdic-eyebrow">Don't</span>
    <h4>Use a full code block for a single value or file path</h4>
    <p>Inline code keeps short references in context. A full block for one value disrupts reading and wastes vertical space.</p>
  </div>
</div>

## Interaction behavior

- The **copy button** appears when the reader hovers over or focuses on the code block. Clicking it copies the block's content to the clipboard.
- After copying, the button briefly shows a **"Copied" confirmation** before reverting to its default state.
- Code blocks that overflow horizontally become **keyboard-scrollable** — readers can Tab to the block and scroll with arrow keys.
- For long lines that should not scroll, the **word-wrap option** (`prose-pre-wrap`) breaks lines to fit the container width.

## Accessibility

- Code blocks that overflow horizontally are keyboard-scrollable — readers can navigate them without a mouse.
- The copy button includes an accessible label so screen readers announce its purpose. After activation, the "Copied" state is announced to assistive technology.
- Inline code is styled differently from surrounding text (monospace font, background tint) so readers can distinguish code from prose visually.

## Design specs

<FigmaEmbed url="" caption="Code block anatomy — syntax area, copy button states, and inline code" />
