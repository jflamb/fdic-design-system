/**
 * Compatibility entry point for the built-in icon set.
 *
 * The design system now uses Phosphor Duotone icons everywhere. This legacy
 * module path remains so existing consumers that import `icons/phosphor-regular`
 * still receive the current built-in icon registry.
 */
import "./phosphor-duotone.js";
