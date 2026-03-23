import { FdRadio } from "../components/fd-radio.js";
import { FdRadioGroup } from "../components/fd-radio-group.js";

if (!customElements.get("fd-radio")) {
  customElements.define("fd-radio", FdRadio);
}
if (!customElements.get("fd-radio-group")) {
  customElements.define("fd-radio-group", FdRadioGroup);
}
