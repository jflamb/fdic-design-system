import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const runtimeStylesheet = readFileSync(
  resolve(process.cwd(), "styles.css"),
  "utf8",
);

describe("component runtime stylesheet", () => {
  it("uses a browser-resolvable token import for direct package serving", () => {
    expect(runtimeStylesheet).toContain('@import "../fdic-ds-tokens/styles.css";');
    expect(runtimeStylesheet).not.toContain('@import "@jflamb/fdic-ds-tokens/styles.css";');
  });

  it("includes a section-header composition scope that neutralizes prose heading rhythm", () => {
    expect(runtimeStylesheet).toContain(".fdic-section-header");
    expect(runtimeStylesheet).toContain(".fdic-section-header :where(h1, h2, h3, h4, h5, h6, p)");
    expect(runtimeStylesheet).toContain("margin-block: 0");
    expect(runtimeStylesheet).toContain("padding-block: 0");
  });

  it("includes reusable page layout classes for full-width band recipes", () => {
    expect(runtimeStylesheet).toContain(".fdic-page");
    expect(runtimeStylesheet).toContain("min-block-size: 100svh");
    expect(runtimeStylesheet).toContain("container-type: inline-size");
    expect(runtimeStylesheet).toContain('.fdic-page[data-page-overflow="true"]');
    expect(runtimeStylesheet).toContain(".fdic-page__main");
    expect(runtimeStylesheet).toContain(".fdic-page__chrome-end");
    expect(runtimeStylesheet).toContain(".fdic-page-band");
    expect(runtimeStylesheet).toContain(".fdic-page-band--neutral");
    expect(runtimeStylesheet).toContain(".fdic-page-band__content");
    expect(runtimeStylesheet).toContain(".fdic-page-band__stack");
    expect(runtimeStylesheet).toContain(".fdic-brand-wordmark");
    expect(runtimeStylesheet).toContain("@media (max-width: 640px)");
    expect(runtimeStylesheet).toContain("@container (max-width: 640px)");
    expect(runtimeStylesheet).toContain("var(--fdic-layout-gutter-mobile, 16px)");
  });

  it("includes reusable content-page classes for article and filtered-list recipes", () => {
    expect(runtimeStylesheet).toContain(".fdic-content-layout");
    expect(runtimeStylesheet).toContain("var(--fdic-content-layout-sidebar-width, var(--fdic-layout-sidebar-width, 18rem))");
    expect(runtimeStylesheet).toContain(".fdic-content-layout__sidebar-disclosure");
    expect(runtimeStylesheet).toContain(".fdic-section-nav");
    expect(runtimeStylesheet).toContain(".fdic-section-nav li");
    expect(runtimeStylesheet).toContain("box-sizing: border-box");
    expect(runtimeStylesheet).toContain('.fdic-section-nav [aria-current="page"]::before');
    expect(runtimeStylesheet).toContain(".fdic-content-layout--detail-priority");
    expect(runtimeStylesheet).toContain('grid-template-areas: "sidebar main"');
    expect(runtimeStylesheet).toContain('"main"');
    expect(runtimeStylesheet).toContain('"sidebar"');
    expect(runtimeStylesheet).toContain(".fdic-content-filter");
    expect(runtimeStylesheet).toContain(".fdic-content-filter__criteria");
    expect(runtimeStylesheet).toContain(".fdic-headline-list");
    expect(runtimeStylesheet).toContain(".fdic-article-media");
    expect(runtimeStylesheet).toContain("aspect-ratio: 16 / 9");
    expect(runtimeStylesheet).toContain(".fdic-related-stories");
    expect(runtimeStylesheet).toContain(".fdic-event-detail-summary");
    expect(runtimeStylesheet).toContain(".fdic-event-detail-summary__actions");
  });
});
