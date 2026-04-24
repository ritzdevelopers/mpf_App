/**
 * Home search / listings price bands (must match Header `PRICE_RANGES` labels).
 */
export const HOME_PRICE_RANGE_LABELS = [
  "Up to 1 Cr",
  "1–3 Cr",
  "3–5 Cr",
  "Above 5 Cr",
] as const;

export type HomePriceRangeLabel = (typeof HOME_PRICE_RANGE_LABELS)[number];

/** `projectPrice` from API is a numeric string in Crores, e.g. "4.58" */
export function projectMatchesHomePriceRange(
  projectPrice: string,
  rangeLabel: string | null
): boolean {
  if (rangeLabel == null || String(rangeLabel).trim() === "") return true;
  const p = parseFloat(String(projectPrice).trim());
  if (Number.isNaN(p)) return false;

  const r = normalizeRangeLabel(String(rangeLabel));

  if (r === "up to 1 cr" || (r.startsWith("up to") && r.includes("1"))) return p <= 1;
  if (r === "1–3 cr" || r === "1-3 cr") return p > 1 && p <= 3;
  if (r === "3–5 cr" || r === "3-5 cr") return p > 3 && p <= 5;
  if (r === "above 5 cr" || r.includes("above 5")) return p > 5;

  return true;
}

function normalizeRangeLabel(s: string): string {
  return s.trim().toLowerCase().replace(/-/g, "–");
}
