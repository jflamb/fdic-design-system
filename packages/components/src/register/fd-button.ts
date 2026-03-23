import { FdButton } from "../components/fd-button.js";

if (!customElements.get("fd-button")) {
  customElements.define("fd-button", FdButton);
}
