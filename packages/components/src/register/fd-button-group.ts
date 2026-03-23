import { FdButtonGroup } from "../components/fd-button-group.js";

if (!customElements.get("fd-button-group")) {
  customElements.define("fd-button-group", FdButtonGroup);
}
