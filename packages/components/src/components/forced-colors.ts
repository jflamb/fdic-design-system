import { css } from "lit";

/**
 * Shared forced-colors (Windows High Contrast) CSS fragments.
 *
 * These extract repeated `@media (forced-colors: active)` patterns that
 * appear identically across multiple components. Import and spread into
 * a component's `static styles` array:
 *
 *   import { forcedColorsTextInput } from "./forced-colors.js";
 *   static styles = [forcedColorsTextInput, css`...component styles...`];
 *
 * Components with unique forced-colors selectors should keep their own
 * `@media (forced-colors: active)` block — this file only covers patterns
 * that genuinely repeat with the same selectors.
 */

/**
 * Text-input forced-colors — shared by fd-input and fd-textarea.
 *
 * Covers: rest border, focus ring, validation-state borders, and disabled state.
 * Both components use `[part="base"]` as the visual container and
 * `[part="native"]` as the inner input/textarea.
 */
export const forcedColorsTextInput = css`
  @media (forced-colors: active) {
    [part="base"] {
      border-color: ButtonText;
    }

    [part="base"]:has([part="native"]:focus-visible) {
      border-color: LinkText;
      outline: 2px solid LinkText;
    }

    :host([data-state="error"]) [part="base"] {
      border-color: LinkText;
      forced-color-adjust: none;
    }

    :host([data-state="warning"]) [part="base"],
    :host([data-state="success"]) [part="base"] {
      border-color: ButtonText;
      forced-color-adjust: none;
    }

    :host([disabled]) [part="base"] {
      border-color: GrayText;
      color: GrayText;
    }
  }
`;

/**
 * Field-group forced-colors — shared by fd-checkbox-group and fd-radio-group.
 *
 * Covers: invalid fieldset border indicator and error message color.
 */
export const forcedColorsFieldGroup = css`
  @media (forced-colors: active) {
    :host([data-user-invalid]) [part="fieldset"] {
      border-inline-start-color: LinkText;
    }

    [part="error"] {
      color: LinkText;
    }
  }
`;
