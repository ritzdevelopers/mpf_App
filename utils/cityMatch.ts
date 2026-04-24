/**
 * Map city names from app cards / URLs to `Project.cityName` from the API.
 * Keys: normalized lowercase trimmed; values: canonical name we try in order.
 */
export const CITY_PARAM_ALIASES: Record<string, string[]> = {
  bangalore: ["Bengaluru", "Bangalore"],
  bengaluru: ["Bengaluru", "Bangalore"],
  mumbai: ["Mumbai", "Bombay"],
  bombay: ["Mumbai", "Bombay"],
  delhi: ["Delhi", "New Delhi"],
  "new delhi": ["New Delhi", "Delhi"],
  "noida extension": ["Noida", "Greater Noida", "Noida Extension"],
  "greater noida": ["Greater Noida", "Noida"],
  gurugram: ["Gurugram", "Gurgaon", "Gurugram (Gurgaon)"],
  gurgaon: ["Gurgaon", "Gurugram"],
  chennai: ["Chennai", "Madras"],
  kolkata: ["Kolkata", "Calcutta"],
};

function normalizeKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Picks a single string from Expo Router `useLocalSearchParams` values.
 */
export function firstStringParam(
  v: string | string[] | undefined
): string | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v[0] ?? undefined;
  return v;
}

/**
 * Resolves a user/card city label to a value present in `apiCities` (from API data).
 */
export function resolveCityFromParam(
  param: string,
  apiCities: string[]
): string | null {
  const trimmed = param.trim();
  if (!trimmed) return null;

  if (apiCities.includes(trimmed)) return trimmed;

  const set = new Set(apiCities);
  const key = normalizeKey(trimmed);
  const aliases = CITY_PARAM_ALIASES[key];
  if (aliases) {
    for (const a of aliases) {
      if (set.has(a)) return a;
    }
  }

  // Case-insensitive match against known cities
  const lower = key;
  for (const c of apiCities) {
    if (normalizeKey(c) === lower) return c;
  }

  // Loose match: only for longer strings to avoid false positives
  if (lower.length >= 4) {
    for (const c of apiCities) {
      const nc = normalizeKey(c);
      if (nc.includes(lower) || lower.includes(nc)) return c;
    }
  }

  return null;
}
