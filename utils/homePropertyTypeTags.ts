import type { Project } from "@/utils/api";

/** Home search + listings property-type picker — three segments only. */
export const HOME_PROPERTY_TYPE_OPTIONS = [
  "Commercial",
  "New Launches",
  "Residential",
] as const;

export type HomePropertyTypeTag = (typeof HOME_PROPERTY_TYPE_OPTIONS)[number];

const TAG_SET = new Set<string>(HOME_PROPERTY_TYPE_OPTIONS);

export function isHomePropertyTypeTag(
  s: string | null | undefined
): s is HomePropertyTypeTag {
  return s != null && TAG_SET.has(s);
}

/**
 * Map UI segment → project rows. API uses long names (e.g. "Residential Apartment");
 * "New Launches" is matched via status/launch-style wording.
 */
export function projectMatchesHomeTypeTag(
  p: Project,
  tag: string | null
): boolean {
  if (!tag) return true;
  if (!TAG_SET.has(tag)) {
    return p.propertyTypeName === tag;
  }
  const pt = (p.propertyTypeName || "").toLowerCase();
  const st = (p.projectStatusName || "").toLowerCase();
  if (tag === "Commercial") return pt.includes("commercial");
  if (tag === "Residential") return pt.includes("residential");
  if (tag === "New Launches") {
    return st.includes("launch") || pt.includes("launch");
  }
  return true;
}
