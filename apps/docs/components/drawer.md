# Drawer

`fd-drawer` is the reusable structural primitive for the global-header family’s mobile surfaces. In modal mode it now uses a native `<dialog>` shell, browser-managed backdrop, and native focus containment while keeping the close-request event and parent-owned open state contract.

## When to use

- Use it when a top-attached drawer needs the same motion and close-request contract as the header family.
- Use it when the parent component should own state while the drawer owns the top-attached shell and translates native dialog dismissal into close requests.
- Use it for lightweight modal drawer surfaces, not for a full generic overlay system.

## When not to use

- Don’t use it as a catch-all modal, popover, or toast primitive.
- Don’t over-generalize it with unrelated placement variants until the design system has a real use case.

## Examples

<StoryEmbed
  storyId="supporting-primitives-drawer--reference-menu-surface"
  linkStoryId="supporting-primitives-drawer--reference-menu-surface"
  height="420"
  caption="Reference mobile menu surface built on the shared drawer primitive."
/>

<!-- GENERATED_COMPONENT_API:START -->
## Properties

| Name | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Whether the drawer is visible. |
| `label` | `string` | `` | Accessible label announced for the drawer surface. |
| `modal` | `boolean` | `false` | When true, the drawer uses a native modal `<dialog>` shell with a browser-managed backdrop and focus containment. |
| `placement` | `"top"` | `top` | Drawer placement. The current primitive intentionally supports the top-attached header-family use case only. |

- `fd-drawer` keeps its public contract intentionally small so callers can compose navigation and search semantics around it.

## Slots

| Name | Description |
|---|---|
| `header` | Optional header content rendered above the body slot. |

## Events

| Name | Detail | Description |
|---|---|---|
| `fd-drawer-close-request` | `{ source: "backdrop" \| "escape" }` | Cancelable event fired when the user asks to dismiss the drawer. |

## CSS custom properties

| Name | Default | Description |
|---|---|---|
| `--fd-drawer-surface` | `#ffffff` | Surface color for the drawer body. |
| `--fd-drawer-color` | `inherit` | Foreground color for drawer content. |
| `--fd-drawer-border-color` | `rgba(9, 53, 84, 0.14)` | Border color for the drawer edge. |
| `--fd-drawer-shadow` | `0 18px 48px rgba(0, 18, 32, 0.22)` | Box shadow applied to the drawer surface. |

## Shadow parts

| Name | Description |
|---|---|
| `base` | Native dialog shell in modal mode, or the root wrapper in inline mode. |
| `surface` | Drawer surface element inside the shell. |
| `header` | Optional header slot wrapper. |
| `body` | Drawer body wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- When `modal` is true, the drawer exposes native dialog semantics only while open and emits `fd-drawer-close-request` for Escape and backdrop dismissal instead of closing itself.
- Browser-native dialog behavior owns focus containment while the drawer is open. If a specific control should receive initial focus, author that control with `autofocus`.
- The parent component is still responsible for deciding whether a close request should actually close the surface and whether any explicit focus restoration beyond the native dialog default is needed.
- Drawer content stays semantic because the primitive only supplies the shell; callers provide links, buttons, headings, and landmarks.

## Known limitations

- The current primitive intentionally supports only the top-attached header-family use case.
- Body scroll management and page inerting remain the caller’s responsibility.
- Modal backdrop styling now comes from the native dialog `::backdrop`, so there is no separate backdrop shadow part to target.

## Related components

- [Global Header](/components/global-header)
- [Header Search](/components/header-search)
