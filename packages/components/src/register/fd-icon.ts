import { FdIcon } from "../components/fd-icon.js";

if (!customElements.get("fd-icon")) {
  customElements.define("fd-icon", FdIcon);
}
