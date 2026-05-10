# Dynamic Org Chart

Dynamic Org Chart is a composed pattern for reviewing organization hierarchy, source status, editorial overrides, and print output.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Composed pattern</span>
  <p>V1 is outline-first on every viewport. Visual chart printing remains an internal post-v1 prototype, not a public component or release boundary.</p>
</div>

## When to use

- Use this pattern for source-aware organization browsing where hierarchy, provenance, and editorial review all matter.
- Use it when editors need to see official, draft/proposed, historical/effective-dated, override, acting, vacancy, person, position, and unit states in one workflow.
- Use it when print or browser “Save as PDF” must produce a readable hierarchy/table rather than a clipped chart.

## When not to use

- Do not use it for a purely decorative org chart.
- Do not add CHRIS/API fetching, historical date pickers, custom editor filters, skip-level filters, or division/office/region taxonomy filters in v1.
- Do not implement a visual chart renderer under this pattern until the post-v1 adapter work is assigned.

## Examples

<StoryEmbed
  storyId="patterns-org-chart--editor-review"
  linkStoryId="patterns-org-chart--editor-review"
  caption="Editor review combines toolbar filtering, hierarchy context, outline selection, details conflict comparison, diagnostics, and print/export scope."
/>

<StoryEmbed
  storyId="patterns-org-chart--printable-visual-prototype"
  linkStoryId="patterns-org-chart--printable-visual-prototype"
  caption="Post-v1 prototype: the screen experience stays outline-first while a print-only adapter renders a selected branch as a visual chart when thresholds allow."
/>

## Public components

- [Org Outline](/components/org-outline) renders the canonical semantic hierarchy.
- [Org Details](/components/org-details) renders the selected record and review metadata.

The toolbar, context bar, and print chart adapter are private modules for the composed pattern. They are not public components, do not have standalone docs pages, and are not exported as package entry points.

## Data contract

Use <code>normalizeOrgTree(input)</code> before rendering. It returns <code>{ tree, diagnostics }</code>. Production consumers may render, log, or surface diagnostics; fixture and test harnesses should fail loudly on unexpected diagnostics.

The status model is deliberately orthogonal:

- <code>nodeType</code>: unit, position, person, vacancy.
- <code>sourceStatus</code>: official, override, draft, historical. (These map to the four states the v1 design requirements call out: official CHRIS-sourced data, editorial override, draft/proposed, and historical/effective-dated.)
- <code>actingMeta</code>: optional acting assignment metadata.
- <code>conflictMeta</code>: optional field-by-field comparison when CHRIS source and editorial override disagree.

This allows combinations such as person plus override plus acting assignment, vacancy plus draft, and override with conflict comparison.

## For editors

- Review Editorial override records first when they carry <code>conflictMeta</code> — the hierarchy is showing competing source-of-truth and override values that an editor needs to reconcile.
- Review Editorial override records with acting assignments when temporary assignments affect reporting context.
- Preserve diagnostics in the editor workflow. Orphans render under “Unattached,” cycles are broken at the recursive edge with both endpoints kept renderable, and conflicting duplicates are retained side by side. The diagnostics list — not the source status — carries these tree-level issues.

## Toolbar filters

V1 includes only:

- Node type: unit, position, person, vacancy.
- Source/status: official, editorial override, draft/proposed, historical/effective-dated.
- Acting/detail assignment.

V1 explicitly excludes division/office/region taxonomy filters, skip-level filters, effective-date filters, and editor-only custom filters.

## Print and PDF

V1 print output uses outline/table behavior, not a public visual chart. The helper <code>printDecision(tree, scope)</code> defines deterministic post-v1 chart thresholds:

- Minimum legible text size: 10 pt for normal charts; fallback begins when the estimated chart would require less than 9 pt.
- Maximum visual chart page count: 4 pages before fallback.
- Clipping/page-break tolerance: no more than 2 split nodes at shallow depth; 0 tolerance beyond depth 6.
- Large hierarchies over 175 nodes fall back to outline; over 350 nodes fall back to table.

Because v1 has no public visual chart renderer, v1 may force outline/table even when a future chart would fit. Internal prototype stories may opt into <code>printDecision(tree, scope, selectedNodeId, { visualChartAvailable: true })</code> to evaluate a print-only chart adapter before the public boundary is reopened.

## Accessibility

- Keyboard order should be toolbar, outline, then details.
- Native disclosure handles expanded/collapsed announcements.
- There is no <code>role="tree"</code>, roving tabindex, or arrow-key tree navigation in v1.
- Details selection changes are announced politely.
- Reduced motion suppresses expand/collapse animation.
- At 200% zoom, toolbar, outline, and details reflow without horizontal page scroll.
- Every status uses text plus iconography and remains identifiable in greyscale.

## Content guidance

- Use source-system language where it is official, but avoid unexplained internal abbreviations in public-facing examples.
- Prefer “Source conflict,” “Editorial override,” and “Unavailable” over vague labels such as “Issue” or “Problem.”
- Explain what editors should do with diagnostics near the workflow that displays them.

## Known limitations

- V1 has no public visual chart adapter, no chart toggle beyond a disabled explanation, no live fetch, no CHRIS/API dependency, and no historical date picker.
- Conflict resolution actions are display-only in this pattern. Consuming applications own approval and write workflows.
- Photo/contact policy is not settled in v1; keep those fields consumer-supplied.

## Unit 0 decision

The generator was checked before implementation. The existing supporting-embedded inventory kind avoids docs pages, public subpath exports, and register-all, but <code>sync:components</code> still exposes non-internal inventory entries through the root symbol export path. Because that is not clean enough for private toolbar/context-bar modules, v1 keeps them under <code>packages/components/src/components/org-chart/internal/</code> and documents only the public components.
