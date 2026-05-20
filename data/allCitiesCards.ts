/**
 * All cities for the "All Cities" screen and shared city image map.
 * Images are loaded from local assets (assets/images/City/) — no network required.
 */
import { ImageSourcePropType } from "react-native";

export type CityCard = {
  name: string;
  image: ImageSourcePropType;
  homes: string;
  tag: string;
};

const NAMES = [
  "Agra",
  "Bangalore",
  "Bareilly",
  "Chandigarh",
  "Chennai",
  "Dehradun",
  "Delhi",
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
  "Sonipat",
  "Thiruvananthapuram",
  "Vrindavan",
] as const;

/** Same list as the All Cities screen — for home search location dropdown, etc. */
export { NAMES as ALL_CITY_NAMES };

/**
 * One unique local asset per city.
 * Cities without a matching file fall back to the Noida image.
 */
const IMAGE_BY_CITY: Record<(typeof NAMES)[number], ImageSourcePropType> = {
  Agra: require("@/assets/images/City/Taj_Mahal,_Agra,_India.jpg"),
  Bangalore: require("@/assets/images/City/Bangalore.jpg"),
  Bareilly: require("@/assets/images/City/Bareilly.jpg"),
  Chandigarh: require("@/assets/images/City/Chandigarh.jpg"),
  Chennai: require("@/assets/images/City/Chennai.jpg"),
  Dehradun: require("@/assets/images/City/Dehradun.avif"),
  Delhi: require("@/assets/images/City/Delhi.jpg"),
  Faridabad: require("@/assets/images/City/Faridabad.webp"),
  Ghaziabad: require("@/assets/images/City/Ghaziabad.avif"),
  Goa: require("@/assets/images/City/Goa.jpg"),
  "Greater Noida": require("@/assets/images/City/Greater Noida.webp"),
  Gurugram: require("@/assets/images/City/Gurugram.jpg"),
  Hyderabad: require("@/assets/images/City/Hyderabad.jpg"),
  Indore: require("@/assets/images/City/Indore.avif"),
  Jaipur: require("@/assets/images/City/Jaipur.jpg"),
  Karnal: require("@/assets/images/City/Karnal.avif"),
  Kochi: require("@/assets/images/City/Kochi.webp"),
  Lucknow: require("@/assets/images/City/Lucknow.avif"),
  Ludhiana: require("@/assets/images/City/Ludhiana.jpg"),
  Mohali: require("@/assets/images/City/Mohali.webp"),
  Mumbai: require("@/assets/images/City/Mumbai.jpg"),
  Noida: require("@/assets/images/City/Noida.webp"),
  "Noida extension": require("@/assets/images/City/Noida_extension.png"),
  Panipat: require("@/assets/images/City/Panipat.jpg"),
  Pune: require("@/assets/images/City/Pune.avif"),
  Sonipat: require("@/assets/images/City/Sonipat.jpg"),
  Thiruvananthapuram: require("@/assets/images/City/thiruvananthapuram.jpg"),
  Vrindavan: require("@/assets/images/City/Vrindavan.webp"),
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

/** Lookup a city's hero image (same local asset as in cards). */
export function getCityImage(name: string): ImageSourcePropType | undefined {
  if ((NAMES as readonly string[]).includes(name)) {
    return IMAGE_BY_CITY[name as (typeof NAMES)[number]];
  }
  return undefined;
}

/** @deprecated Use getCityImage() for local assets */
export function getCityImageUrl(name: string): string | undefined {
  return undefined;
}
