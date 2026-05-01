/**
 * Built-in Phosphor Regular icon set.
 *
 * Importing this module auto-registers the regular-weight built-in icons into
 * the global `iconRegistry`. Regular icons are the default for interface chrome
 * such as buttons, menus, close actions, and loading states.
 *
 * Use `icons/phosphor-duotone` only where the richer filled treatment is
 * intentional, such as visual/decorative component contexts.
 */
import { iconRegistry } from "./registry.js";
// @ts-expect-error Generated ESM data module is consumed at runtime.
import { phosphorRegularIcons } from "./phosphor-data.mjs";

iconRegistry.register(phosphorRegularIcons);
