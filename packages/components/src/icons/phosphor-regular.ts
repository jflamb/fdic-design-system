/**
 * Built-in Phosphor Regular icon set.
 *
 * Importing this module auto-registers a curated set of Phosphor Regular icons
 * into the global `iconRegistry`. All icons use `viewBox="0 0 256 256"` and
 * `fill="currentColor"` so they inherit the parent element's text color.
 *
 * SVG path data sourced from the official Phosphor Icons repository:
 * https://github.com/phosphor-icons/core (regular weight)
 *
 * Usage:
 * ```ts
 * import "@fdic-ds/components/icons/phosphor-regular";
 * // All icons are now available via iconRegistry.get("star"), etc.
 * ```
 */
import { iconRegistry } from "./registry.js";
// @ts-expect-error Generated ESM data module is consumed at runtime.
import { phosphorRegularIcons } from "./phosphor-data.mjs";

iconRegistry.register(phosphorRegularIcons);
