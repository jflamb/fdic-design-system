var i=Object.defineProperty;var f=(r,e,a)=>e in r?i(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a;var t=(r,e,a)=>f(r,typeof e!="symbol"?e+"":e,a);import{i as m,a as p,b as n}from"./iframe-B3pk9F1K.js";import"./preload-helper-C1FmrZbK.js";class l extends m{render(){return n`<span>Placeholder component</span>`}}t(l,"styles",p`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 12rem;
      padding: 0.75rem 1rem;
      border: 1px dashed var(--fdic-color-border, #7a7a7a);
      border-radius: 0.5rem;
      background: var(--fdic-color-surface, #f5f5f5);
      color: var(--fdic-color-text, #1f1f1f);
      font: 600 0.95rem/1.2 sans-serif;
      letter-spacing: 0.02em;
    }
  `);customElements.get("fd-placeholder")||customElements.define("fd-placeholder",l);const x={title:"Components/Placeholder",tags:["autodocs"],render:()=>n`<fd-placeholder></fd-placeholder>`},o={};var s,d,c;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:"{}",...(c=(d=o.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const b=["Default"];export{o as Default,b as __namedExportsOrder,x as default};
