# Drawer

`fd-drawer` is the reusable structural primitive for the global-header family’s mobile surfaces. It provides the shared shell, modal backdrop behavior, focus trapping, and open-close animation used by the mobile menu and mobile search suggestion experience.

## When to use

- Use it when a top-attached drawer needs the same motion and close-request contract as the header family.
- Use it when the parent component should own state while the drawer owns animation, backdrop, and focus-trap internals.
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
| `modal` | `boolean` | `false` | When true, the drawer behaves like a modal dialog with a backdrop and focus trap. |
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
| `base` | Root wrapper for the drawer and optional backdrop. |
| `backdrop` | Modal backdrop shown behind the drawer surface. |
| `surface` | Drawer surface element. |
| `header` | Optional header slot wrapper. |
| `body` | Drawer body wrapper. |
<!-- GENERATED_COMPONENT_API:END -->

## Accessibility

- When `modal` is true, the drawer exposes dialog semantics only while open, traps focus, and emits close requests for Escape and backdrop dismissal.
- The parent component is responsible for deciding whether a close request should actually close the surface and where focus should return.
- Drawer content stays semantic because the primitive only supplies the shell; callers provide links, buttons, headings, and landmarks.

## Known limitations

- The current primitive intentionally supports only the top-attached header-family use case.
- Body scroll management and page inerting remain the caller’s responsibility.

## Related components

- [Global Header](/components/global-header)
- [Header Search](/components/header-search)
