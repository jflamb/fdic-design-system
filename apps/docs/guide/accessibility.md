# Accessibility

This page is the canonical reference for cross-cutting WCAG 2.1 AA accessibility requirements in the FDIC design system. Every pattern documented here is non-negotiable.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Accessibility requirements</span>
  <p>The FDIC design system targets WCAG 2.1 Level AA conformance. These requirements apply across all components and content authored within the <code>.prose</code> container. They are not optional refinements — they are compliance baselines.</p>
</div>

## What the components handle for you

If you use the design system components as documented, you get the following accessibility requirements automatically — no extra work needed:

- **Rules 1-6** (focus rings, skip link, sr-only utility, ARIA on callouts, table wrappers, DPUB-ARIA on footnotes) are built into the components and prose styles. You do not need to add these yourself when using the documented HTML patterns.

**You are responsible for:**

- **Rule 7** — spelling out abbreviations on first use in your content.
- **Rule 8** — adding screen reader text inside `<del>` and `<ins>` elements you author.
- **Rule 9** — not adding custom animations that bypass `prefers-reduced-motion`.
- **Rule 10** — not overriding component styles in ways that break `forced-colors` mode.

If you only remember one thing: **use the components as documented and write clear content.** The system handles the technical accessibility requirements; you handle the content requirements.

## Non-negotiable requirements

These ten rules govern every element, component, and pattern in the system. Violating any of them is a conformance failure.

<ol>
  <li>
    <strong>Focus rings on all interactive elements</strong>
    <p>Every focusable element must use <code>:focus-visible</code> with <code>outline: 2px solid var(--fdic-border-input-focus, #38b6ff)</code>, <code>outline-offset: 2px</code>, and <code>border-radius: 2px</code>. No exceptions. Never remove or suppress focus indicators.</p>
  </li>
  <li>
    <strong>Skip link</strong>
    <p>The first element inside <code>&lt;body&gt;</code> must be a skip link: <code>&lt;a href="#main" class="skip-link sr-only"&gt;Skip to content&lt;/a&gt;</code>. It becomes visible on focus and bypasses navigation for keyboard users.</p>
  </li>
  <li>
    <strong><code>.sr-only</code> utility</strong>
    <p>Visually hidden text for screen readers uses the clip-rect pattern: <code>position: absolute; width: 1px; height: 1px; clip: rect(0,0,0,0); overflow: hidden</code>. Use this class whenever visual context is insufficient for assistive technology.</p>
  </li>
  <li>
    <strong>ARIA on callouts</strong>
    <p>Callout containers require <code>role="note"</code> (or <code>role="status"</code> for the danger variant) and an <code>aria-label</code> matching the variant name. Icon spans must carry <code>aria-hidden="true"</code> to prevent screen readers from announcing decorative SVGs.</p>
  </li>
  <li>
    <strong>Table wrapper</strong>
    <p>Tables must be wrapped in <code>.prose-table-wrapper</code> with <code>role="region"</code>, a descriptive <code>aria-label</code>, and <code>tabindex="0"</code> for keyboard scrolling. Never apply <code>display: block</code> to the <code>&lt;table&gt;</code> element itself — it destroys screen reader table navigation.</p>
  </li>
  <li>
    <strong>DPUB-ARIA on footnotes</strong>
    <p>Inline references use <code>role="doc-noteref"</code>. The footnote section uses <code>role="doc-endnotes"</code>. Each footnote <code>&lt;li&gt;</code> uses <code>role="doc-footnote"</code>. Back-links use <code>role="doc-backlink"</code>. These roles enable assistive technology to navigate bidirectional footnote references.</p>
  </li>
  <li>
    <strong>Abbreviation expansion</strong>
    <p>Spell out every abbreviation on first use in visible body text: <em>Federal Deposit Insurance Corporation (<abbr title="Federal Deposit Insurance Corporation">FDIC</abbr>)</em>. The <code>title</code> attribute alone is not sufficient — screen readers and mobile users may never see it.</p>
  </li>
  <li>
    <strong>Screen reader text for <code>&lt;del&gt;</code> and <code>&lt;ins&gt;</code></strong>
    <p>Include <code>&lt;span class="sr-only"&gt;deleted: &lt;/span&gt;</code> inside every <code>&lt;del&gt;</code> element and <code>&lt;span class="sr-only"&gt;inserted: &lt;/span&gt;</code> inside every <code>&lt;ins&gt;</code> element. Screen reader support for these semantics is inconsistent without explicit text.</p>
  </li>
  <li>
    <strong><code>prefers-reduced-motion</code></strong>
    <p>All animations and transitions must be suppressed when the user prefers reduced motion. Animated highlights (such as the footnote flash) must fall back to a static visual equivalent. Never assume motion is safe.</p>
  </li>
  <li>
    <strong><code>forced-colors</code> (Windows High Contrast)</strong>
    <p>Borders must use system colors (<code>LinkText</code>, <code>ButtonText</code>). Elements that convey meaning via color or background must use <code>forced-color-adjust: none</code> to remain visible. The <code>&lt;ins&gt;</code> element must fall back to underline instead of background color, since backgrounds are stripped in forced-colors mode.</p>
  </li>
</ol>

## Element-level accessibility guidance

Use this reference table when implementing or reviewing individual elements.

<div class="fdic-roles-table">
  <div class="fdic-roles-row fdic-roles-header">
    <span>Element / Pattern</span>
    <span>Requirement</span>
    <span>WCAG</span>
  </div>
  <div class="fdic-roles-row">
    <span>Headings</span>
    <span>Strict hierarchy — never skip levels. One <code>&lt;h1&gt;</code> per page. Do not use headings for visual sizing alone.</span>
    <span>1.3.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Links</span>
    <span>Descriptive text that makes sense out of context. Never use "click here" or "read more."</span>
    <span>2.4.4</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>&lt;mark&gt;</code></span>
    <span>Surrounding text must convey the significance of the highlight — color alone is not enough. Screen reader support for <code>role="mark"</code> is inconsistent.</span>
    <span>1.4.1</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>&lt;blockquote&gt;</code></span>
    <span>Use only for quoted content, not visual indentation. Wrap attributions in <code>&lt;footer&gt;&lt;cite&gt;</code>.</span>
    <span>1.3.1</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>&lt;aside&gt;</code></span>
    <span>Functions as an ARIA landmark. When multiple asides appear on a page, each must have a distinct <code>aria-label</code>.</span>
    <span>1.3.1, 2.4.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Code blocks</span>
    <span>Add <code>tabindex="0"</code> for keyboard-accessible overflow scrolling. Use <code>role="region"</code> and <code>aria-label</code> to provide context.</span>
    <span>2.1.1</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>&lt;address&gt;</code></span>
    <span>Use only for contact information. Telephone links must use international format (<code>tel:+1-...</code>).</span>
    <span>1.3.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Lists</span>
    <span>Always use semantic list elements (<code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;dl&gt;</code>). Never simulate lists with <code>&lt;br&gt;</code> or <code>&lt;div&gt;</code>.</span>
    <span>1.3.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Task lists</span>
    <span>Disabled checkboxes need <code>aria-label</code>. Add <code>role="list"</code> to <code>&lt;ul&gt;</code> for Safari/VoiceOver, which strips list semantics from styled lists.</span>
    <span>4.1.2, 1.3.1</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>&lt;output&gt;</code></span>
    <span>Has implicit <code>role="status"</code> (ARIA live region). Use the <code>for</code> attribute to associate with input controls.</span>
    <span>4.1.3</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>&lt;progress&gt;</code></span>
    <span>Must have a visible label. Use <code>aria-label</code> including the current value. Provide a text fallback inside the element for older browsers.</span>
    <span>4.1.2</span>
  </div>
  <div class="fdic-roles-row">
    <span><code>&lt;meter&gt;</code></span>
    <span>The color bar alone is insufficient — always include a visible text descriptor alongside the meter.</span>
    <span>1.4.1, 4.1.2</span>
  </div>
  <div class="fdic-roles-row">
    <span>Embedded media</span>
    <span><code>&lt;iframe&gt;</code> requires a <code>title</code> attribute. <code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code> require <code>controls</code>. Video must have captions.</span>
    <span>4.1.2, 1.2.2</span>
  </div>
  <div class="fdic-roles-row">
    <span>Images</span>
    <span>Every <code>&lt;img&gt;</code> must have an <code>alt</code> attribute. Describe the purpose, not the appearance. Use <code>alt=""</code> for purely decorative images.</span>
    <span>1.1.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Color independence</span>
    <span>Never use color as the sole means of conveying information. Pair with text, icons, patterns, or other non-color indicators.</span>
    <span>1.4.1</span>
  </div>
  <div class="fdic-roles-row">
    <span>Language</span>
    <span>Set <code>lang="en"</code> on the <code>&lt;html&gt;</code> element. Mark foreign-language passages with the appropriate <code>lang</code> attribute.</span>
    <span>3.1.1, 3.1.2</span>
  </div>
</div>

## Checklists

Use these checklists when adding new styles or components to the design system.

### Adding a new element style

1. Scope all rules to `.prose` — never add unscoped element styles.
2. Use design tokens with hardcoded fallback values for every color, spacing, and font property.
3. Add a `forced-colors` override if the element uses color or background to convey meaning.
4. Add a print override if background or decoration should be removed on paper.
5. Add a `prefers-reduced-motion` override if the element has transitions or animations.
6. Add a responsive override at `640px` if the element's layout changes on small screens.
7. If the element conveys meaning via color alone, add a non-color alternative (text, icon, pattern, or border).
8. If screen reader support is inconsistent, document the workaround inline in `index.html`.

### Adding a new component

1. Use `.prose-{name}` class naming.
2. Include appropriate ARIA attributes in the documented HTML pattern.
3. Add `forced-colors`, print, and `prefers-reduced-motion` overrides as needed.
4. Add responsive overrides at `640px` if the component's layout changes on small screens.
5. Hide from print if the component is interactive-only.
6. Ensure every interactive element within the component has `:focus-visible` styles using the standard focus ring pattern.
7. If the component is a landmark element, require `aria-label` when multiple instances may appear on a single page.
8. If the component has scrollable overflow, add `tabindex="0"`, `role="region"`, and a descriptive `aria-label`.
9. Document the accessibility pattern inline in `index.html` alongside the visual demo.
