import { FdLabel } from "../components/fd-label.js";
import { FdInput } from "../components/fd-input.js";
import { FdMessage } from "../components/fd-message.js";
import { FdField } from "../components/fd-field.js";

if (!customElements.get("fd-label")) {
  customElements.define("fd-label", FdLabel);
}
if (!customElements.get("fd-input")) {
  customElements.define("fd-input", FdInput);
}
if (!customElements.get("fd-message")) {
  customElements.define("fd-message", FdMessage);
}
if (!customElements.get("fd-field")) {
  customElements.define("fd-field", FdField);
}
