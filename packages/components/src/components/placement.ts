/**
 * Internal placement utility for positioning popup surfaces relative to anchors.
 * Not part of the public API — used by fd-menu.
 *
 * Supports four placements with block-axis viewport flipping.
 */

export type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface PlacementResult {
  top: number;
  left: number;
  placement: Placement;
}

/**
 * Compute the absolute position for a popup surface relative to an anchor element.
 * Flips on the block axis if insufficient viewport space.
 */
export function computePlacement(
  anchor: Element,
  surface: Element,
  placement: Placement,
): PlacementResult {
  const anchorRect = anchor.getBoundingClientRect();
  const surfaceRect = surface.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const isTop = placement.startsWith("top");
  const isEnd = placement.endsWith("end");

  // Compute the preferred position
  let top: number;
  let left: number;

  if (isTop) {
    top = anchorRect.top + scrollY - surfaceRect.height;
  } else {
    top = anchorRect.bottom + scrollY;
  }

  if (isEnd) {
    left = anchorRect.right + scrollX - surfaceRect.width;
  } else {
    left = anchorRect.left + scrollX;
  }

  // Block-axis flip: if the menu would overflow the viewport, try the opposite side
  let finalPlacement = placement;
  const viewportHeight = window.innerHeight;

  if (!isTop && anchorRect.bottom + surfaceRect.height > viewportHeight) {
    // Preferred bottom, but overflows — try top
    const topCandidate = anchorRect.top - surfaceRect.height;
    if (topCandidate >= 0) {
      top = anchorRect.top + scrollY - surfaceRect.height;
      finalPlacement = placement.replace("bottom", "top") as Placement;
    }
  } else if (isTop && anchorRect.top - surfaceRect.height < 0) {
    // Preferred top, but overflows — try bottom
    const bottomCandidate = anchorRect.bottom + surfaceRect.height;
    if (bottomCandidate <= viewportHeight) {
      top = anchorRect.bottom + scrollY;
      finalPlacement = placement.replace("top", "bottom") as Placement;
    }
  }

  return { top, left, placement: finalPlacement };
}
