import { FdMenuItem } from "../components/fd-menu-item.js";
import { FdMenu } from "../components/fd-menu.js";

if (!customElements.get("fd-menu-item")) {
  customElements.define("fd-menu-item", FdMenuItem);
}
if (!customElements.get("fd-menu")) {
  customElements.define("fd-menu", FdMenu);
}
