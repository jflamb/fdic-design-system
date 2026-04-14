import { css, unsafeCSS } from "lit";

export const COLLECTION_COLUMNS = ["2", "3", "4"] as const;
export type CollectionColumns = (typeof COLLECTION_COLUMNS)[number];

const UNBOUNDED_TRACK_MAX_PX = 9999;
const FIGMA_NARROW_MAX_PX: Record<CollectionColumns, number> = {
  "2": 9999,
  "3": 9999,
  "4": 180,
};
const FIGMA_NARROW_THRESHOLD_PX: Record<CollectionColumns, number> = {
  "2": 816,
  "3": 1176,
  "4": 1168,
};

function trackMinToken(prefix: string, columns: CollectionColumns, narrow: boolean) {
  const componentSuffix = narrow ? `col-${columns}-min-mobile` : `col-${columns}-min`;
  const sharedSuffix = narrow ? `col-${columns}-min-narrow` : `col-${columns}-min`;
  return unsafeCSS(`var(--${prefix}-${componentSuffix}, var(--fdic-layout-${sharedSuffix}))`);
}

function trackGapToken(prefix: string, columns: CollectionColumns, narrow: boolean) {
  const componentSuffix = narrow ? `col-${columns}-gap-mobile` : `col-${columns}-gap`;
  const sharedSuffix = narrow ? `col-${columns}-gap-narrow` : `col-${columns}-gap`;
  return unsafeCSS(`var(--${prefix}-${componentSuffix}, var(--fdic-layout-${sharedSuffix}))`);
}

function trackRowGapToken(prefix: string, columns: CollectionColumns, narrow: boolean) {
  const componentSuffix = narrow ? `col-${columns}-row-gap-mobile` : `col-${columns}-row-gap`;
  return unsafeCSS(`var(--${prefix}-${componentSuffix}, ${trackGapToken(prefix, columns, narrow)})`);
}

function trackMaxValue(prefix: string, columns: CollectionColumns, narrow: boolean) {
  if (narrow && isUnboundedTrackValue(FIGMA_NARROW_MAX_PX[columns])) {
    return unsafeCSS("1fr");
  }

  const componentSuffix = narrow ? `col-${columns}-max-mobile` : `col-${columns}-max`;
  const sharedSuffix = narrow ? `col-${columns}-max-narrow` : `col-${columns}-max`;
  return unsafeCSS(`min(100%, var(--${prefix}-${componentSuffix}, var(--fdic-layout-${sharedSuffix})))`);
}

function selector(columns: CollectionColumns, narrow: boolean) {
  return narrow ? `:host([columns="${columns}"])` : `:host([columns="${columns}"])`;
}

function defaultSelector(narrow: boolean) {
  return narrow
    ? ":host(:not([columns])), :host([columns=\"3\"])"
    : ":host(:not([columns])), :host([columns=\"3\"])";
}

export function collectionGridStyles(prefix: string) {
  const internalMin = unsafeCSS(`--_${prefix}-track-min`);
  const internalMax = unsafeCSS(`--_${prefix}-track-max`);
  const internalColumnGap = unsafeCSS(`--_${prefix}-track-column-gap`);
  const internalRowGap = unsafeCSS(`--_${prefix}-track-row-gap`);

  return css`
    :host {
      inline-size: 100%;
      container-type: inline-size;
    }

    ${unsafeCSS(defaultSelector(false))} {
      ${internalMin}: min(100%, ${trackMinToken(prefix, "3", false)});
      ${internalMax}: ${trackMaxValue(prefix, "3", false)};
      ${internalColumnGap}: ${trackGapToken(prefix, "3", false)};
      ${internalRowGap}: ${trackRowGapToken(prefix, "3", false)};
    }

    ${unsafeCSS(selector("2", false))} {
      ${internalMin}: min(100%, ${trackMinToken(prefix, "2", false)});
      ${internalMax}: ${trackMaxValue(prefix, "2", false)};
      ${internalColumnGap}: ${trackGapToken(prefix, "2", false)};
      ${internalRowGap}: ${trackRowGapToken(prefix, "2", false)};
    }

    ${unsafeCSS(selector("4", false))} {
      ${internalMin}: min(100%, ${trackMinToken(prefix, "4", false)});
      ${internalMax}: ${trackMaxValue(prefix, "4", false)};
      ${internalColumnGap}: ${trackGapToken(prefix, "4", false)};
      ${internalRowGap}: ${trackRowGapToken(prefix, "4", false)};
    }

    [part="base"] {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(
        auto-fit,
        minmax(var(${internalMin}), var(${internalMax}))
      );
      column-gap: var(${internalColumnGap});
      row-gap: var(${internalRowGap});
      align-items: start;
      justify-content: start;
      inline-size: 100%;
      box-sizing: border-box;
    }

    @container (max-width: ${unsafeCSS(`${FIGMA_NARROW_THRESHOLD_PX["3"] - 1}px`)}) {
      ${unsafeCSS(defaultSelector(true))} {
        ${internalMin}: min(100%, ${trackMinToken(prefix, "3", true)});
        ${internalMax}: ${trackMaxValue(prefix, "3", true)};
        ${internalColumnGap}: ${trackGapToken(prefix, "3", true)};
        ${internalRowGap}: ${trackRowGapToken(prefix, "3", true)};
      }
    }

    @container (max-width: ${unsafeCSS(`${FIGMA_NARROW_THRESHOLD_PX["2"] - 1}px`)}) {
      ${unsafeCSS(selector("2", true))} {
        ${internalMin}: min(100%, ${trackMinToken(prefix, "2", true)});
        ${internalMax}: ${trackMaxValue(prefix, "2", true)};
        ${internalColumnGap}: ${trackGapToken(prefix, "2", true)};
        ${internalRowGap}: ${trackRowGapToken(prefix, "2", true)};
      }
    }

    @container (max-width: ${unsafeCSS(`${FIGMA_NARROW_THRESHOLD_PX["4"] - 1}px`)}) {
      ${unsafeCSS(selector("4", true))} {
        ${internalMin}: min(100%, ${trackMinToken(prefix, "4", true)});
        ${internalMax}: ${trackMaxValue(prefix, "4", true)};
        ${internalColumnGap}: ${trackGapToken(prefix, "4", true)};
        ${internalRowGap}: ${trackRowGapToken(prefix, "4", true)};
      }
    }
  `;
}

function isUnboundedTrackValue(value: number | string) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value.trim());
  return Number.isFinite(parsed) && parsed >= UNBOUNDED_TRACK_MAX_PX;
}
