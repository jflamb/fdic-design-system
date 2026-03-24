export const CHIP_TYPES = [
  "neutral",
  "cool",
  "warm",
  "positive",
  "alert",
] as const;

export type PillType = (typeof CHIP_TYPES)[number];

const CHIP_TYPE_SET = new Set<string>(CHIP_TYPES);

export function normalizePillType(value: string | undefined): PillType {
  return value && CHIP_TYPE_SET.has(value) ? (value as PillType) : "neutral";
}

export function normalizeLabelText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}
