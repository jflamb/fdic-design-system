# Page Shell

This page is the canonical responsive page-shell and top-level section-alignment
contract for the FDIC Design System.

Use it when a page, shell component, or full-bleed section needs to align with
the rest of the page at desktop, tablet, and mobile widths.

## Contract summary

Most top-level page sections should follow this model:

- the section surface may be full bleed
- the inner content row aligns to `--fdic-layout-shell-max-width`
- desktop, tablet, and mobile gutters come from the shared `--fdic-layout-*`
  shell tokens
- shell components and section patterns should not restate competing breakpoint
  math

This applies to:

- `fd-page-header`
- `fd-page-feedback`
- `fd-global-footer`
- documented top-level composition sections
- CMS page bands such as feature/news, tile-link, utility-link, event, and
  dual-panel supporting sections

## Width responsibilities

Use these tokens intentionally:

- `--fdic-layout-shell-max-width`
  - default inner width for page shell and top-level section content
- `--fdic-layout-max-width`
  - broader composition surfaces that intentionally exceed the shell width
- `--fdic-layout-content-max-width`
  - readable content rails, not page-shell alignment
- `--fdic-layout-paragraph-max-width`
  - long-form text width inside a broader shell-aligned section

Default rule:

- if the content is a top-level page section, use
  `--fdic-layout-shell-max-width`
- only use `--fdic-layout-max-width` when the pattern explicitly documents that
  it is wider than the shared shell

## Responsive ranges

The shared alignment ranges are:

- **Desktop:** `>= 64rem` (`>= 1024px`)
  - use `--fdic-layout-gutter`
- **Tablet:** `40rem–63.999rem` (`640px–1023.999px`)
  - use `--fdic-layout-gutter-tablet`
- **Mobile:** `< 40rem` (`< 640px`)
  - use `--fdic-layout-gutter-mobile`

Components and patterns that participate in page-level alignment should switch
gutters at these ranges unless they document a deliberate exception.

## Section model

The standard section model is:

```css
.section {
  width: 100%;
}

.section__inner {
  box-sizing: border-box;
  width: min(100%, var(--fdic-layout-shell-max-width));
  margin-inline: auto;
  padding-inline: var(--fdic-layout-gutter);
}

@media (max-width: 63.999rem) {
  .section__inner {
    padding-inline: var(--fdic-layout-gutter-tablet);
  }
}

@media (max-width: 39.999rem) {
  .section__inner {
    padding-inline: var(--fdic-layout-gutter-mobile);
  }
}
```

The section background, border, stripe, or divider may still span full bleed.
Only the inner content row needs to align to the shared shell width.

## Shell-participating components

These components consume the page-shell contract directly:

- [`fd-page-header`](/components/page-header)
- [`fd-page-feedback`](/components/page-feedback)
- [`fd-global-footer`](/components/global-footer)

Override their width or gutter tokens only when adjacent top-level sections are
intentionally using the same alternate contract.

## Top-level section patterns

The documented composition patterns in
[`Composition Patterns`](./composition-patterns.md) are also participants in the
page-shell contract when they represent first-class page sections.

That means:

- `.fdic-composition-section__inner` aligns to
  `--fdic-layout-shell-max-width`
- tablet/mobile gutter changes follow the same shared shell ranges
- section patterns should not introduce their own shell-width or shell-gutter
  breakpoint logic unless the docs call that out as an exception

## Exceptions

Exceptions are allowed, but they should be explicit.

Document an exception when:

- a section intentionally exceeds the shared shell width
- a section intentionally collapses earlier or later than the shared shell
  range
- a component uses a narrower readable width by design

Do not rely on theme-local breakpoint compensation to create implicit
exceptions.

## Related guidance

- [Spacing and Layout](./spacing-layout.md)
- [Composition Patterns](./composition-patterns.md)
- [CMS Integration](/guide/cms-integration)
