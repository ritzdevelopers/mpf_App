import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

const IMAGE_BASE = "https://apis.mypropertyfact.in/api/v1/get/images/properties/";

export function getImageUrl(slugURL: string, filename: string): string {
  if (!filename) return "";
  // Safely encode the filename: split by slash to preserve directory structure,
  // then encodeURIComponent each part so special characters like #, ?, and & are encoded properly.
  const safeFilename = filename.split('/').map(encodeURIComponent).join('/');
  return `${IMAGE_BASE}${slugURL}/${safeFilename}`;
}

export interface Project {
  id: number;
  projectName: string;
  projectPrice: string;
  slugURL: string;
  projectLocality: string;
  projectConfiguration: string;
  status: boolean;
  builderName: string;
  projectStatusName: string;
  propertyTypeName: string;
  cityName: string;
  projectAddress: string;
  projectThumbnailImage: string;
  projectBannerImage: string;
  projectLogo: string;
  builderSlug: string;
  citySlug: string;
}

/* Richer shape returned by /api/v1/projects/get/{slug} */
export interface Amenity {
  id: number;
  title: string;
  image: string;
  altTag?: string;
}
export interface FloorPlan {
  planType: string;
  areaSqFt: number;
  areaSqMt: number;
  pname?: string | null;
}
export interface LocationBenefit {
  benefitName: string;
  distance: string;
}
export interface Faq {
  id: number;
  question: string;
  answer: string;
}
export interface GalleryImage {
  id: number;
  imageName: string;
  altTag?: string;
}
export interface BannerImage {
  desktopImage?: string;
  mobileImage?: string;
  desktopAltTag?: string;
  mobileAltTag?: string;
}
export interface BuilderInfo {
  id: number;
  builderName: string;
  builderDescription?: string;
  slugURL?: string;
}

export interface ProjectDetail {
  id: number;
  slugURL: string;
  projectName: string;
  projectPrice: string;
  projectLocality: string;
  projectConfiguration: string;
  propertyTypeName: string;
  city: string;
  state?: string;
  country?: string;
  projectLogo: string;
  projectThumbnailImage: string;
  projectStatusId?: number;

  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;

  amenityDesc?: string;
  floorPlanDesc?: string;
  locationDesc?: string;
  projectWalkthroughDescription?: string;

  reraNo?: string;
  reraWebsite?: string;
  ivrNo?: string;

  amenities?: Amenity[];
  floorPlans?: FloorPlan[];
  locationBenefits?: LocationBenefit[];
  faqs?: Faq[];
  galleryImages?: GalleryImage[];
  desktopImages?: BannerImage[];
  mobileImages?: BannerImage[];
  builder?: BuilderInfo;
}

/**
 * Low-level fetch that bypasses React Native's cookie jar by using
 * XMLHttpRequest directly with withCredentials = false.
 */
function rawGet(url: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.withCredentials = false; // Don't send any cookies
    xhr.timeout = 15000;
    xhr.onload = () => resolve({ status: xhr.status, body: xhr.responseText });
    xhr.onerror = () => reject(new Error("Network request failed"));
    xhr.ontimeout = () => reject(new Error("Request timed out"));
    xhr.send();
  });
}

const detailCache: Record<string, ProjectDetail> = {};
const CACHE_KEY = (slug: string) => `detail_cache_${slug}`;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Store in-flight promises so we don't duplicate network requests
const detailPromises: Record<string, Promise<ProjectDetail | null>> = {};

/** Returns the detail from cache synchronously if it exists. */
export function getProjectDetailCache(slug: string): ProjectDetail | null {
  return detailCache[slug] || null;
}

export async function fetchProjectDetail(slug: string): Promise<ProjectDetail | null> {
  if (!slug) return null;

  // 1. In-memory hit (instant)
  if (detailCache[slug]) return detailCache[slug];

  // If a request is already in-flight, just wait for that one to finish!
  if (await detailPromises[slug]) {
    return detailPromises[slug];
  }

  // Wrap the actual fetch logic in a promise that we store
  const fetchPromise = (async () => {
    // 2. Disk hit (fast, survives app restart)
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY(slug));
      if (raw) {
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts < CACHE_TTL) {
          detailCache[slug] = data;      // promote to memory
          return data;
        }
      }
    } catch { /* ignore storage errors */ }

    // 3. Network fetch (slow path — only when truly needed)
    try {
      console.log("[API] Fetching project detail:", slug);
      const { status, body } = await rawGet(
        `https://apis.mypropertyfact.in/api/v1/projects/get/${slug}`
      );
      if (status !== 200) {
        console.error("[API] Detail error:", body.substring(0, 300));
        return null;
      }
      const data: ProjectDetail = JSON.parse(body);
      detailCache[slug] = data;

      // Persist to disk in the background — don't await
      AsyncStorage.setItem(CACHE_KEY(slug), JSON.stringify({ data, ts: Date.now() }))
        .catch(() => { });

      return data;
    } catch (err) {
      console.error("[API] fetchProjectDetail failed:", err);
      return null;
    } finally {
      // Remove from in-flight tracker once done
      delete detailPromises[slug];
    }
  })();

  detailPromises[slug] = fetchPromise;
  return fetchPromise;
}

let cache: Project[] | null = null;

/** Returns the already-loaded cache synchronously (null if not yet fetched). */
export function getProjectsCache(): Project[] | null {
  return Array.isArray(cache) ? cache : null;
}



export async function fetchProjects(): Promise<Project[]> {
  if (Array.isArray(cache)) return cache;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const url = `https://apis.mypropertyfact.in/api/v1/projects?_t=${Date.now()}`;
      console.log(`[API] Fetching projects (attempt ${attempt}/${MAX_RETRIES})...`);
      const { status, body } = await rawGet(url);
      console.log("[API] Response status:", status);

      if (status !== 200) {
        console.error("[API] Error body:", body.substring(0, 300));
        if (attempt < MAX_RETRIES) {
          const delay = attempt * 2000;
          console.warn(`[API] Server returned ${status}, retrying in ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        console.error(`[API] Server returned ${status} after ${MAX_RETRIES} attempts`);
        return [];
      }

      const json = JSON.parse(body);
      const data: Project[] = Array.isArray(json) ? json : (json?.data ?? []);
      console.log("[API] Projects loaded:", data.length);
      cache = data;
      return data;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = attempt * 2000;
        console.warn(`[API] Network error, retrying in ${delay}ms...`, err);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      console.error("[API] fetchProjects FAILED after all retries:", err);
      return [];
    }
  }
  return [];
}

/**
 * Prefetches thumbnails for the given projects.
 * We only prefetch thumbnails (small files, needed for listing cards).
 * Banners and gallery images are loaded on-demand to prevent network queue exhaustion.
 */
export async function prefetchProjectImages(
  projects: Project[],
  limit = 3
): Promise<void> {
  const subset = projects.slice(0, limit);

  const thumbUrls = subset
    .map((p) => getImageUrl(p.slugURL, p.projectThumbnailImage))
    .filter(Boolean);

  if (thumbUrls.length > 0) {
    await Image.prefetch(thumbUrls, "memory-disk");
  }
}

