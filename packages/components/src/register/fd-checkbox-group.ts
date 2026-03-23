import { FdCheckbox } from "../components/fd-checkbox.js";
import { FdCheckboxGroup } from "../components/fd-checkbox-group.js";

if (!customElements.get("fd-checkbox")) {
  customElements.define("fd-checkbox", FdCheckbox);
}
if (!customElements.get("fd-checkbox-group")) {
  customElements.define("fd-checkbox-group", FdCheckboxGroup);
}
