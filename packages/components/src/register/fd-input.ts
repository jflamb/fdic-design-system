import { FdInput } from "../components/fd-input.js";

if (!customElements.get("fd-input")) {
  customElements.define("fd-input", FdInput);
}
