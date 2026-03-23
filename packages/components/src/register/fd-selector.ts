import { FdOption } from "../components/fd-option.js";
import { FdSelector } from "../components/fd-selector.js";

if (!customElements.get("fd-option")) {
  customElements.define("fd-option", FdOption);
}
if (!customElements.get("fd-selector")) {
  customElements.define("fd-selector", FdSelector);
}
