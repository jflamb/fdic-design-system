import { FdRadio } from "../components/fd-radio.js";

if (!customElements.get("fd-radio")) {
  customElements.define("fd-radio", FdRadio);
}
