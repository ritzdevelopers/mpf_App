/**
 * All cities for the "All Cities" screen and shared city image map.
 * Each city has its own Unsplash URL — no rotating pool (avoids duplicate images on cards).
 */

const Q = "w=800&auto=format&fit=crop&q=80";

const NAMES = [
  "Agra",
  "Bangalore",
  "Bareilly",
  "Chandigarh",
  "Chennai",
  "Dehradun",
  "Delhi",
  "Dwarka",
  "Faridabad",
  "Ghaziabad",
  "Goa",
  "Greater Noida",
  "Gurugram",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Karnal",
  "Kochi",
  "Lucknow",
  "Ludhiana",
  "Mohali",
  "Mumbai",
  "Noida",
  "Noida extension",
  "Panipat",
  "Pune",
  "Rohini",
  "Sonipat",
  "Thiruvananthapuram",
  "Vrindavan",
] as const;

/** Same list as the All Cities screen — for home search location dropdown, etc. */
export { NAMES as ALL_CITY_NAMES };

/**
 * One unique image per city (key order matches `NAMES`).
 * IDs verified reachable from images.unsplash.com.
 */
const IMAGE_BY_CITY: Record<(typeof NAMES)[number], string> = {
  Agra: `https://images.unsplash.com/photo-1564507592333-c60657eea523?${Q}`,
  Bangalore: `https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?${Q}`,
  Bareilly: `https://images.unsplash.com/photo-1573132223210-d65883b944aa?${Q}`,
  Chandigarh: `https://images.unsplash.com/photo-1522726832281-362409683a2d?${Q}`,
  Chennai: `https://images.unsplash.com/photo-1569758267239-d08deb78bb1a?${Q}`,
  Dehradun: `https://images.unsplash.com/photo-1519681393784-d120267933ba?${Q}`,
  Delhi: `https://images.unsplash.com/photo-1587474260584-136574528ed5?${Q}`,
  Dwarka: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?${Q}`,
  Faridabad: `https://images.unsplash.com/photo-1584782559059-89669ef4e1cc?${Q}`,
  Ghaziabad: `https://images.unsplash.com/photo-1600713193398-7782a2874f5d?${Q}`,
  Goa: `https://images.unsplash.com/photo-1656662738309-b22ac2039b2e?${Q}`,
  "Greater Noida": `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?${Q}`,
  Gurugram: `https://images.unsplash.com/photo-1511818966892-d7d671e672a2?${Q}`,
  Hyderabad: `https://images.unsplash.com/photo-1535109847681-118bcd6f6463?${Q}`,
  Indore: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?${Q}`,
  Jaipur: `https://images.unsplash.com/photo-1500382017468-9049fed747ef?${Q}`,
  Karnal: `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?${Q}`,
  Kochi: `https://images.unsplash.com/photo-1559827260-dc66d52bef19?${Q}`,
  Lucknow: `https://images.unsplash.com/photo-1514392181188-8f5d54262fa5?${Q}`,
  Ludhiana: `https://images.unsplash.com/photo-1516406742981-2b7d67ec4ae8?${Q}`,
  Mohali: `https://images.unsplash.com/photo-1595658658481-d53d3f999875?${Q}`,
  Mumbai: `https://images.unsplash.com/photo-1706470973911-7e5b81631ab6?${Q}`,
  Noida: `https://images.unsplash.com/photo-1565838500329-d10006e80f55?${Q}`,
  "Noida extension": `https://images.unsplash.com/photo-1625019401404-421b2de1b0a8?${Q}`,
  Panipat: `https://images.unsplash.com/photo-1570795876989-bcec725b8e72?${Q}`,
  Pune: `https://images.unsplash.com/photo-1769589202365-a7ac98d784d5?${Q}`,
  Rohini: `https://images.unsplash.com/photo-1598114725190-5b8807c9c47a?${Q}`,
  Sonipat: `https://images.unsplash.com/photo-1592639296346-560c37a0f711?${Q}`,
  Thiruvananthapuram: `https://images.unsplash.com/photo-1720513138417-5c8eb0b2d660?${Q}`,
  Vrindavan: `https://images.unsplash.com/photo-1460317442991-0ec209397118?${Q}`,
};

const TAGS = [
  "METRO",
  "PRIME",
  "HERITAGE",
  "GROWING",
  "COAST",
  "LIFESTYLE",
  "VALUE",
  "TECH HUB",
  "HOT MARKET",
  "MIDCITY",
] as const;

export type CityCard = {
  name: string;
  image: string;
  homes: string;
  tag: string;
};

function homesForIndex(i: number): string {
  const base = 40 + (i * 11) % 180;
  return `${base}+ homes`;
}

export const ALL_CITIES_CARDS: CityCard[] = NAMES.map((name, i) => ({
  name,
  image: IMAGE_BY_CITY[name],
  homes: homesForIndex(i),
  tag: TAGS[i % TAGS.length],
}));

export const ALL_CITIES_COUNT = ALL_CITIES_CARDS.length;

/** Lookup a city's hero image (same URL as in cards). */
export function getCityImageUrl(name: string): string | undefined {
  if ((NAMES as readonly string[]).includes(name)) {
    return IMAGE_BY_CITY[name as (typeof NAMES)[number]];
  }
  return undefined;
}
