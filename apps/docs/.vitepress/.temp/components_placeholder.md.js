import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Placeholder","description":"","frontmatter":{},"headers":[],"relativePath":"components/placeholder.md","filePath":"components/placeholder.md"}');
const _sfc_main = { name: "components/placeholder.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_fd_placeholder = resolveComponent("fd-placeholder");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="placeholder" tabindex="-1">Placeholder <a class="header-anchor" href="#placeholder" aria-label="Permalink to &quot;Placeholder&quot;">​</a></h1><p><code>fd-placeholder</code> is a temporary component used only to validate the workspace and documentation pipeline.</p><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_fd_placeholder, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/placeholder.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const placeholder = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  placeholder as default
};
