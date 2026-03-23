import { FdLabel } from "../components/fd-label.js";

if (!customElements.get("fd-label")) {
  customElements.define("fd-label", FdLabel);
}
