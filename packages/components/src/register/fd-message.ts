import { FdMessage } from "../components/fd-message.js";

if (!customElements.get("fd-message")) {
  customElements.define("fd-message", FdMessage);
}
