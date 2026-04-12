# fd-selector popover migration

## Status: Completed (2026-04-12)

`fd-selector` now uses the Popover API (`popover="manual"`) for its dropdown listbox,
eliminating the `z-index: 9999` stacking hack.

## Approach chosen

- **Popover API** (`popover="manual"`) promotes the listbox to the top layer.
  This provides correct stacking without z-index in all supported browsers.
- **Fixed positioning with JS coordinates**: On open, the listbox is positioned
  using `getBoundingClientRect()` of the trigger button. This replaces the
  `position: absolute; top: 100%` pattern which doesn't work for top-layer elements.
- **CSS Anchor Positioning was NOT used**: It's only available in Chrome 125+
  and has no Firefox or Safari support as of April 2026. The browser support
  floor (Chrome/Edge 123+, Firefox 128+, Safari 17.5+) does not guarantee it.
- **Graceful degradation**: If `showPopover()` is not available (e.g., in
  happy-dom test environment), the component falls back to the `hidden` attribute
  for visibility toggling. The popover is additive, not required.

## What changed

- `z-index: 9999` removed from listbox styles.
- `position: absolute` replaced with `position: fixed`.
- `popover="manual"` added to the listbox element in the template.
- `_openListbox()` calls `showPopover()` + `_positionListbox()`.
- `_closeListbox()` calls `hidePopover()`.
- `?hidden=${!this.open}` retained as a CSS fallback for environments without
  Popover API support.
- Two new tests verify the `popover` attribute and absence of z-index.

## Remaining limitation

CSS Anchor Positioning would allow declarative placement without JS. When the
browser support floor includes anchor positioning (Firefox and Safari ship it),
the JS positioning logic in `_positionListbox()` can be replaced with:

```css
[part="listbox"] {
  position-anchor: --fd-selector-trigger;
  inset-area: block-end span-inline-end;
}
```

Until then, the JS positioning is minimal and correct.
