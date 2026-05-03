# Patterns

Patterns are reusable ways to assemble components, semantic HTML, and layout tokens into a complete page section or workflow.

<div class="fdic-foundation-intro">
  <span class="fdic-eyebrow">Guide</span>
  <p>Use patterns when a team needs more structure than a component can provide, but less freedom than a blank page. A good pattern makes the accessible, trustworthy layout the default and keeps author choices narrow.</p>
</div>

## Components, Patterns, And Recipes

The design system uses three levels of guidance:

| Level | What it controls | Example |
|---|---|---|
| Component | A reusable interface unit with a documented API | `fd-tile`, `fd-event-list`, `fd-page-header` |
| Pattern | A governed composition of components, authored HTML, and tokens | Section bands, feature rails, grouped link sections |
| Recipe | A complete page or workflow assembly using multiple patterns | General hub page, news and events hub, form review flow |

Do not turn every repeated layout into a new Web Component. If the layout has no private state, custom keyboard behavior, or strict API need, start with a documented pattern. Promote it to a component only when repeated use shows that authors need a safer public API.

## Using Pattern Examples

Pattern pages explain when to use a layout, what content it expects, and which parts of the structure should not be changed. The examples show one supported implementation, not a set of loose visual suggestions.

When using a pattern, check:

- whether the pattern fits the user's task
- which components and semantic HTML it requires
- how many links, tiles, columns, or sections it supports
- how headings, landmarks, lists, and images should be authored
- what the system owns, such as spacing, shell alignment, tone, and responsive behavior
- what authors should not customize

Many examples include a link to an interactive preview so you can inspect responsive behavior and component states before adopting the pattern.

## Current Pattern Surfaces

<StoryEmbed
  storyId="patterns-layout-recipes--docs-overview"
  linkStoryId="patterns-layout-recipes--section-bands"
  caption="Layout recipe — full-width section bands with aligned page chrome, tile lists, event lists, page feedback, and footer."
/>

<StoryEmbed
  storyId="foundations-composition-patterns--canonical-contract"
  caption="Composition patterns — semantic authored HTML using the stable layout classes from the shared component stylesheet."
/>

<StoryEmbed
  storyId="patterns-content-page-recipes--news-article-with-sidebar"
  linkStoryId="patterns-content-page-recipes--news-stories-with-filters"
  caption="Content page recipes — article, sidebar navigation, filtering, and headline-list structures for content-heavy pages."
/>

The stable layout-class surface is documented in [Composition Patterns](/guide/foundations/composition-patterns). Use that page when you need the exact class names and semantic requirements.

Use [Content Page Recipes](/guide/content-page-recipes) for long-form article pages, news archive pages, sidebar navigation, filter rows, and dense headline lists.

Use [Form Workflows](/guide/form-workflows) for multi-step or validation-heavy form recipes. Form patterns have stricter rules because they control error prevention, review, recovery, and submission confidence.

## Hub Page Kit

Hub pages help people choose where to go next. They are especially easy to make messy because they mix wayfinding, announcements, images, links, and office-specific content. The design system should give authors a small set of recipes instead of asking them to compose pages from scratch.

### Recommended Recipes

| Recipe | Use for | Typical sections |
|---|---|---|
| General Hub | About, Learning, Support, Knowledge Base | Page header, quick links, feature section, grouped links, resource tiles |
| Topic Hub | Benefits, compensation, policy areas | Page header, quick links, hub feature, two-up text features, related resources |
| News And Events Hub | News and Events | Featured story, news list, event list, archive links |
| Content Article | News stories, policy updates, guidance pages | Page header, sidebar nav, prose article, cover image, topics, related stories |
| Filtered News List | News archives, global messages, divisional updates | Page header, sidebar nav, filter form, headline list, pagination or empty state |
| Organization Hub | Divisions, offices, regions | Page header, overview, leadership or contact panel, office links, policy/resource groups |

The recipe should own section order, spacing, heading scale, and available block types. Authors should choose content, not invent layout.

### Governed Blocks

These blocks should be available to CMS and low-code authors as constrained choices:

| Block | Purpose | Guardrails |
|---|---|---|
| Page Header | Names the hub and provides orientation | One page `h1`; optional breadcrumbs; short intro |
| Quick Link Strip | Promotes the most common destinations | 3-6 links; one tone; no long descriptions |
| Hub Feature Section | Highlights one major topic with image, copy, and CTA | One heading, two short text fields, one CTA, required image alt decision |
| Text Feature Pair | Presents two related paths with equal weight | Two columns only; one CTA per column |
| Grouped Link Section | Organizes plain links by topic | 2-4 groups; real headings; real lists |
| Resource Tile Section | Shows destinations that need summaries or icons | Use `fd-tile-list`; consistent tone; short descriptions |
| News List | Lists dated announcements or stories | Data-driven title, date, type, href; avoid hand-built link piles |
| Event List | Lists upcoming events | Data-driven date, title, metadata, href |
| Contact Or Support Panel | Shows escalation, office, or service details | Clear labels; no unstructured paragraphs for contact data |

### Hub Feature Section

Use a hub feature when one page section needs editorial emphasis: a meaningful image, a concise heading, short explanatory copy, and one clear link.

This pattern is a good fit for second-level hub pages such as Benefits, Compensation, Learning, or division pages. It should not become a general promotional banner.

Recommended author fields:

- heading
- primary copy
- supporting copy
- CTA label
- CTA URL
- image
- image alt text, or a required "decorative image" decision
- image position, only when the recipe allows left/right variation

The system should own:

- warm or neutral section surface
- shell alignment
- image ratio and crop
- stripe treatment
- seal watermark, when appropriate
- responsive stacking
- link styling
- spacing between text, media, and action

Do not expose manual color, font size, rotation, shadow, seal opacity, or arbitrary spacer controls.

## Authoring Guardrails

For low-design or low-technical authoring environments, prevent bad pages instead of documenting how to avoid them.

Required guardrails:

- fixed recipes with allowed section types
- required headings for every major section
- automatic heading-level management where the CMS can support it
- real lists for repeated links
- maximum item counts for quick links, tiles, and link columns
- required link labels that make sense out of context
- required image alt text or an explicit decorative-image choice
- no arbitrary colors, font sizes, columns, or spacer blocks
- automatic responsive behavior
- empty states for data-driven lists
- warnings for vague labels such as "Click here," "Learn more," or duplicate link text

These constraints are not about limiting creativity. They protect users from unclear, inconsistent, and inaccessible pages.

## Choosing The Right Level

Start with a pattern when:

- the layout is mostly semantic HTML and existing components
- the author still needs to own headings, links, lists, or images
- the pattern is page-level or CMS-level
- the main risk is inconsistent layout, not complex interaction

Create or promote a component when:

- the pattern needs a strict public API
- the system must enforce internal semantics
- repeated authoring mistakes would be hard to catch later
- the pattern needs private state, managed interaction, or generated accessibility wiring
- CMS authors cannot safely provide the required HTML structure

Keep it as a recipe when:

- the pattern only makes sense as part of a page type
- section order matters
- the accessibility requirement depends on the surrounding page structure
- the pattern combines several components that already have stable APIs

## Accessibility Checklist

Every pattern page or recipe should document:

- the required landmarks and headings
- whether the pattern should be a `section`, `nav`, `article`, `aside`, `ul`, or `ol`
- how links are labeled
- how images are described or marked decorative
- how the pattern reflows at narrow widths and high zoom
- which component owns keyboard behavior, if any
- what authors must not remove

Accessible components do not guarantee accessible pages. Patterns are where page-level structure, authoring constraints, and content quality have to meet.
