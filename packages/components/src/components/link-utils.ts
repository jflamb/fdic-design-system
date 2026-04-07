/**
 * Ensures `rel="noopener noreferrer"` is present on links that open in a new
 * tab (`target="_blank"`).  Leaves the `rel` value untouched for all other
 * targets.
 */
export function normalizeLinkRel(
  target: string | undefined,
  rel: string | undefined,
) {
  if (target !== "_blank") {
    return rel;
  }

  const tokens = new Set(
    (rel ?? "")
      .split(/\s+/)
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean),
  );

  tokens.add("noopener");
  tokens.add("noreferrer");

  return [...tokens].join(" ");
}
