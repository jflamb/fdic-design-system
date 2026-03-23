import { FdCheckbox } from "../components/fd-checkbox.js";

if (!customElements.get("fd-checkbox")) {
  customElements.define("fd-checkbox", FdCheckbox);
}
