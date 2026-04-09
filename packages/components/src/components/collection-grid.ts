import { css, unsafeCSS } from "lit";

export const COLLECTION_COLUMNS = ["2", "3", "4"] as const;
export type CollectionColumns = (typeof COLLECTION_COLUMNS)[number];

const UNBOUNDED_TRACK_MAX_PX = 9999;
const FIGMA_NARROW_MAX_PX: Record<CollectionColumns, number> = {
  "2": 9999,
  "3": 9999,
  "4": 180,
};

function trackMinToken(prefix: string, columns: CollectionColumns, narrow: boolean) {
  const suffix = narrow ? `col-${columns}-min-mobile` : `col-${columns}-min`;
  return unsafeCSS(`--${prefix}-${suffix}`);
}

function trackGapToken(prefix: string, columns: CollectionColumns, narrow: boolean) {
  const suffix = narrow ? `col-${columns}-gap-mobile` : `col-${columns}-gap`;
  return unsafeCSS(`--${prefix}-${suffix}`);
}

function trackMaxValue(prefix: string, columns: CollectionColumns, narrow: boolean) {
  if (narrow && isUnboundedTrackValue(FIGMA_NARROW_MAX_PX[columns])) {
    return unsafeCSS("1fr");
  }

  const suffix = narrow ? `col-${columns}-max-mobile` : `col-${columns}-max`;
  return unsafeCSS(`min(100%, var(--${prefix}-${suffix}))`);
}

function selector(columns: CollectionColumns, narrow: boolean) {
  return narrow ? `:host([data-narrow][columns="${columns}"])` : `:host([columns="${columns}"])`;
}

function defaultSelector(narrow: boolean) {
  return narrow ? ":host([data-narrow]):not([columns]), :host([data-narrow][columns=\"3\"])" : ":host(:not([columns])), :host([columns=\"3\"])";
}

export function collectionGridStyles(prefix: string) {
  const internalMin = unsafeCSS(`--_${prefix}-track-min`);
  const internalMax = unsafeCSS(`--_${prefix}-track-max`);
  const internalGap = unsafeCSS(`--_${prefix}-track-gap`);

  return css`
    :host {
      inline-size: 100%;
      container-type: inline-size;
    }

    ${unsafeCSS(defaultSelector(false))} {
      ${internalMin}: min(100%, var(${trackMinToken(prefix, "3", false)}));
      ${internalMax}: ${trackMaxValue(prefix, "3", false)};
      ${internalGap}: var(${trackGapToken(prefix, "3", false)});
    }

    ${unsafeCSS(selector("2", false))} {
      ${internalMin}: min(100%, var(${trackMinToken(prefix, "2", false)}));
      ${internalMax}: ${trackMaxValue(prefix, "2", false)};
      ${internalGap}: var(${trackGapToken(prefix, "2", false)});
    }

    ${unsafeCSS(selector("4", false))} {
      ${internalMin}: min(100%, var(${trackMinToken(prefix, "4", false)}));
      ${internalMax}: ${trackMaxValue(prefix, "4", false)};
      ${internalGap}: var(${trackGapToken(prefix, "4", false)});
    }

    ${unsafeCSS(defaultSelector(true))} {
      ${internalMin}: min(100%, var(${trackMinToken(prefix, "3", true)}));
      ${internalMax}: ${trackMaxValue(prefix, "3", true)};
      ${internalGap}: var(${trackGapToken(prefix, "3", true)});
    }

    ${unsafeCSS(selector("2", true))} {
      ${internalMin}: min(100%, var(${trackMinToken(prefix, "2", true)}));
      ${internalMax}: ${trackMaxValue(prefix, "2", true)};
      ${internalGap}: var(${trackGapToken(prefix, "2", true)});
    }

    ${unsafeCSS(selector("4", true))} {
      ${internalMin}: min(100%, var(${trackMinToken(prefix, "4", true)}));
      ${internalMax}: ${trackMaxValue(prefix, "4", true)};
      ${internalGap}: var(${trackGapToken(prefix, "4", true)});
    }

    [part="base"] {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(
        auto-fit,
        minmax(var(${internalMin}), var(${internalMax}))
      );
      gap: var(${internalGap});
      align-items: start;
      justify-content: start;
      inline-size: 100%;
      box-sizing: border-box;
    }
  `;
}

function parseLengthToPx(value: string, computedStyle: CSSStyleDeclaration) {
  const normalized = value.trim();
  if (!normalized) {
    return 0;
  }

  if (normalized.endsWith("px")) {
    return Number.parseFloat(normalized);
  }

  if (normalized.endsWith("rem")) {
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize || "16",
    );
    return Number.parseFloat(normalized) * rootFontSize;
  }

  if (normalized.endsWith("em")) {
    const fontSize = Number.parseFloat(computedStyle.fontSize || "16");
    return Number.parseFloat(normalized) * fontSize;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getCollectionNarrowThresholdPx(
  host: HTMLElement,
  prefix: string,
  columns: CollectionColumns,
) {
  const computedStyle = getComputedStyle(host);
  const count = Number.parseInt(columns, 10);
  const min = parseLengthToPx(
    computedStyle.getPropertyValue(`--${prefix}-col-${columns}-min`),
    computedStyle,
  );
  const gap = parseLengthToPx(
    computedStyle.getPropertyValue(`--${prefix}-col-${columns}-gap`),
    computedStyle,
  );

  return count * min + (count - 1) * gap;
}

function isUnboundedTrackValue(value: number | string) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value.trim());
  return Number.isFinite(parsed) && parsed >= UNBOUNDED_TRACK_MAX_PX;
}
