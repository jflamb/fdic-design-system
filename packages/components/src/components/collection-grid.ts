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
    return unsafeCSS("none");
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

function baseSelector(selectorList: string) {
  return selectorList
    .split(",")
    .map((item) => `${item.trim()} [part="base"]`)
    .join(", ");
}

function childSelector(selectorList: string) {
  return selectorList
    .split(",")
    .map((item) => `${item.trim()} ::slotted(*)`)
    .join(", ");
}

export function collectionGridStyles(prefix: string) {
  const internalMin = unsafeCSS(`--_${prefix}-track-min`);
  const internalMax = unsafeCSS(`--_${prefix}-track-max`);
  const internalColumnGap = unsafeCSS(`--_${prefix}-track-column-gap`);
  const internalRowGap = unsafeCSS(`--_${prefix}-track-row-gap`);

  return css`
    :host {
      inline-size: 100%;
      /* Collection list collapse queries depend on this local container. */
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
      display: flex;
      flex-wrap: wrap;
      column-gap: var(${internalColumnGap});
      row-gap: var(${internalRowGap});
      align-items: start;
      justify-content: start;
      inline-size: 100%;
      box-sizing: border-box;
    }

    slot {
      display: contents;
    }

    ::slotted(*) {
      flex: 1 1 auto;
      min-inline-size: 0;
      box-sizing: border-box;
    }

    ${unsafeCSS(childSelector(defaultSelector(false)))} {
      flex-basis: var(${internalMin});
      max-inline-size: var(${internalMax});
    }

    ${unsafeCSS(childSelector(selector("2", false)))} {
      flex-basis: var(${internalMin});
      max-inline-size: var(${internalMax});
    }

    ${unsafeCSS(childSelector(selector("4", false)))} {
      flex-basis: var(${internalMin});
      max-inline-size: var(${internalMax});
    }

    @container (max-width: ${unsafeCSS(`${FIGMA_NARROW_THRESHOLD_PX["3"] - 1}px`)}) {
      ${unsafeCSS(baseSelector(defaultSelector(true)))} {
        ${internalMin}: min(100%, ${trackMinToken(prefix, "3", true)});
        ${internalMax}: ${trackMaxValue(prefix, "3", true)};
        ${internalColumnGap}: ${trackGapToken(prefix, "3", true)};
        ${internalRowGap}: ${trackRowGapToken(prefix, "3", true)};
      }

      ${unsafeCSS(childSelector(defaultSelector(true)))} {
        flex-basis: min(100%, ${trackMinToken(prefix, "3", true)});
        max-inline-size: ${trackMaxValue(prefix, "3", true)};
      }
    }

    @container (max-width: ${unsafeCSS(`${FIGMA_NARROW_THRESHOLD_PX["2"] - 1}px`)}) {
      ${unsafeCSS(baseSelector(selector("2", true)))} {
        ${internalMin}: min(100%, ${trackMinToken(prefix, "2", true)});
        ${internalMax}: ${trackMaxValue(prefix, "2", true)};
        ${internalColumnGap}: ${trackGapToken(prefix, "2", true)};
        ${internalRowGap}: ${trackRowGapToken(prefix, "2", true)};
      }

      ${unsafeCSS(childSelector(selector("2", true)))} {
        flex-basis: min(100%, ${trackMinToken(prefix, "2", true)});
        max-inline-size: ${trackMaxValue(prefix, "2", true)};
      }
    }

    @container (max-width: ${unsafeCSS(`${FIGMA_NARROW_THRESHOLD_PX["4"] - 1}px`)}) {
      ${unsafeCSS(baseSelector(selector("4", true)))} {
        ${internalMin}: min(100%, ${trackMinToken(prefix, "4", true)});
        ${internalMax}: ${trackMaxValue(prefix, "4", true)};
        ${internalColumnGap}: ${trackGapToken(prefix, "4", true)};
        ${internalRowGap}: ${trackRowGapToken(prefix, "4", true)};
      }

      ${unsafeCSS(childSelector(selector("4", true)))} {
        flex-basis: min(100%, ${trackMinToken(prefix, "4", true)});
        max-inline-size: ${trackMaxValue(prefix, "4", true)};
      }
    }
  `;
}

export function collectionGridLayoutStyles(prefix: string, childSelector: string) {
  return css`
    :host {
      display: block;
      --${unsafeCSS(prefix)}-col-2-min: var(--fdic-layout-col-2-min);
      --${unsafeCSS(prefix)}-col-2-max: var(--fdic-layout-col-2-max);
      --${unsafeCSS(prefix)}-col-2-gap: var(--fdic-layout-col-2-gap);
      --${unsafeCSS(prefix)}-col-3-min: var(--fdic-layout-col-3-min, 320px);
      --${unsafeCSS(prefix)}-col-3-max: calc(
        (
          var(--fdic-layout-shell-max-width, 1312px) -
            (2 * var(--${unsafeCSS(prefix)}-col-3-gap, var(--fdic-layout-col-3-gap, 48px)))
        ) / 3
      );
      --${unsafeCSS(prefix)}-col-3-gap: var(--fdic-layout-col-3-gap);
      --${unsafeCSS(prefix)}-col-3-row-gap: var(--fdic-layout-section-block-padding-compact, 24px);
      --${unsafeCSS(prefix)}-col-4-min: var(--fdic-layout-col-4-min);
      --${unsafeCSS(prefix)}-col-4-max: var(--fdic-layout-col-4-max);
      --${unsafeCSS(prefix)}-col-4-gap: var(--fdic-layout-col-4-gap);
      --${unsafeCSS(prefix)}-col-2-min-mobile: var(--fdic-layout-col-2-min-narrow);
      --${unsafeCSS(prefix)}-col-2-gap-mobile: var(--fdic-layout-col-2-gap-narrow);
      --${unsafeCSS(prefix)}-col-3-min-mobile: var(--fdic-layout-col-3-min-narrow, 320px);
      --${unsafeCSS(prefix)}-col-3-gap-mobile: var(--fdic-layout-col-3-gap, 48px);
      --${unsafeCSS(prefix)}-col-3-row-gap-mobile: var(--fdic-layout-section-block-padding-compact, 24px);
      --${unsafeCSS(prefix)}-col-4-min-mobile: var(--fdic-layout-col-4-min-narrow);
      --${unsafeCSS(prefix)}-col-4-max-mobile: var(--fdic-layout-col-4-max-narrow);
      --${unsafeCSS(prefix)}-col-4-gap-mobile: var(--fdic-layout-col-4-gap-narrow);
    }

    :host([hidden]) {
      display: none;
    }

    ::slotted(${unsafeCSS(childSelector)}) {
      inline-size: 100%;
      min-inline-size: 0;
    }
  `;
}

function isUnboundedTrackValue(value: number | string) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value.trim());
  return Number.isFinite(parsed) && parsed >= UNBOUNDED_TRACK_MAX_PX;
}
