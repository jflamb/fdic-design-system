import type { FdButton } from "./components/fd-button.js";
import type { FdButtonGroup } from "./components/fd-button-group.js";
import type { FdCheckbox } from "./components/fd-checkbox.js";
import type { FdCheckboxGroup } from "./components/fd-checkbox-group.js";
import type { FdField } from "./components/fd-field.js";
import type { FdIcon } from "./components/fd-icon.js";
import type { FdInput } from "./components/fd-input.js";
import type { FdLabel } from "./components/fd-label.js";
import type { FdMenu } from "./components/fd-menu.js";
import type { FdMenuItem } from "./components/fd-menu-item.js";
import type { FdMessage } from "./components/fd-message.js";
import type { FdOption } from "./components/fd-option.js";
import type { FdRadio } from "./components/fd-radio.js";
import type { FdRadioGroup } from "./components/fd-radio-group.js";
import type { FdSelector } from "./components/fd-selector.js";
import type { FdSplitButton } from "./components/fd-split-button.js";
import type { FdTextarea } from "./components/fd-textarea.js";
import type { FdVisual } from "./components/fd-visual.js";

declare global {
  interface HTMLElementTagNameMap {
    "fd-button": FdButton;
    "fd-button-group": FdButtonGroup;
    "fd-checkbox": FdCheckbox;
    "fd-checkbox-group": FdCheckboxGroup;
    "fd-field": FdField;
    "fd-icon": FdIcon;
    "fd-input": FdInput;
    "fd-label": FdLabel;
    "fd-menu": FdMenu;
    "fd-menu-item": FdMenuItem;
    "fd-message": FdMessage;
    "fd-option": FdOption;
    "fd-radio": FdRadio;
    "fd-radio-group": FdRadioGroup;
    "fd-selector": FdSelector;
    "fd-split-button": FdSplitButton;
    "fd-textarea": FdTextarea;
    "fd-visual": FdVisual;
  }
}
