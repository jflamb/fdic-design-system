import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"FDIC Design System","description":"","frontmatter":{},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_fd_placeholder = resolveComponent("fd-placeholder");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="fdic-design-system" tabindex="-1">FDIC Design System <a class="header-anchor" href="#fdic-design-system" aria-label="Permalink to &quot;FDIC Design System&quot;">​</a></h1><p>This site is a placeholder GitHub Pages shell for the future design system.</p><h2 id="current-scope" tabindex="-1">Current scope <a class="header-anchor" href="#current-scope" aria-label="Permalink to &quot;Current scope&quot;">​</a></h2><ul><li>TypeScript workspace</li><li>Web Components package</li><li>GitHub Pages documentation pipeline</li></ul><h2 id="placeholder-preview" tabindex="-1">Placeholder preview <a class="header-anchor" href="#placeholder-preview" aria-label="Permalink to &quot;Placeholder preview&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_fd_placeholder, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
