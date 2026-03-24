import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    // Root entry (side-effect-free)
    index: "src/index.ts",
    "public-events": "src/public-events.ts",

    // Per-component symbol exports
    "components/fd-button": "src/components/fd-button.ts",
    "components/fd-button-group": "src/components/fd-button-group.ts",
    "components/fd-checkbox": "src/components/fd-checkbox.ts",
    "components/fd-checkbox-group": "src/components/fd-checkbox-group.ts",
    "components/fd-field": "src/components/fd-field.ts",
    "components/fd-icon": "src/components/fd-icon.ts",
    "components/fd-input": "src/components/fd-input.ts",
    "components/fd-label": "src/components/fd-label.ts",
    "components/fd-menu": "src/components/fd-menu.ts",
    "components/fd-menu-item": "src/components/fd-menu-item.ts",
    "components/fd-message": "src/components/fd-message.ts",
    "components/fd-option": "src/components/fd-option.ts",
    "components/fd-radio": "src/components/fd-radio.ts",
    "components/fd-radio-group": "src/components/fd-radio-group.ts",
    "components/fd-selector": "src/components/fd-selector.ts",
    "components/fd-split-button": "src/components/fd-split-button.ts",
    "components/fd-file-input": "src/components/fd-file-input.ts",
    "components/fd-slider": "src/components/fd-slider.ts",
    "components/fd-badge": "src/components/fd-badge.ts",
    "components/fd-badge-group": "src/components/fd-badge-group.ts",
    "components/fd-chip": "src/components/fd-chip.ts",
    "components/fd-chip-group": "src/components/fd-chip-group.ts",

    // Registration entry points
    "register/register-all": "src/register/register-all.ts",
    "register/fd-button": "src/register/fd-button.ts",
    "register/fd-button-group": "src/register/fd-button-group.ts",
    "register/fd-checkbox": "src/register/fd-checkbox.ts",
    "register/fd-checkbox-group": "src/register/fd-checkbox-group.ts",
    "register/fd-field": "src/register/fd-field.ts",
    "register/fd-icon": "src/register/fd-icon.ts",
    "register/fd-input": "src/register/fd-input.ts",
    "register/fd-label": "src/register/fd-label.ts",
    "register/fd-menu": "src/register/fd-menu.ts",
    "register/fd-message": "src/register/fd-message.ts",
    "register/fd-radio": "src/register/fd-radio.ts",
    "register/fd-radio-group": "src/register/fd-radio-group.ts",
    "register/fd-selector": "src/register/fd-selector.ts",
    "register/fd-split-button": "src/register/fd-split-button.ts",
    "register/fd-file-input": "src/register/fd-file-input.ts",
    "register/fd-slider": "src/register/fd-slider.ts",
    "register/fd-badge": "src/register/fd-badge.ts",
    "register/fd-badge-group": "src/register/fd-badge-group.ts",
    "register/fd-chip": "src/register/fd-chip.ts",
    "register/fd-chip-group": "src/register/fd-chip-group.ts",

    // Icon packs
    "icons/phosphor-regular": "src/icons/phosphor-regular.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
});
