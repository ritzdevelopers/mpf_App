import { Image } from "expo-image";

const IMAGE_BASE = "https://apis.mypropertyfact.in/api/v1/get/images/properties/";

export function getImageUrl(slugURL: string, filename: string): string {
  if (!filename) return "";
  return `${IMAGE_BASE}${slugURL}/${filename}`;
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

const detailCache: Record<string, ProjectDetail> = {};

export async function fetchProjectDetail(slug: string): Promise<ProjectDetail | null> {
  if (!slug) return null;
  if (detailCache[slug]) return detailCache[slug];
  try {
    const res = await fetch(`https://apis.mypropertyfact.in/api/v1/projects/get/${slug}`);
    if (!res.ok) return null;
    const data: ProjectDetail = await res.json();
    detailCache[slug] = data;
    return data;
  } catch {
    return null;
  }
}

let cache: Project[] | null = null;

/** Returns the already-loaded cache synchronously (null if not yet fetched). */
export function getProjectsCache(): Project[] | null {
  return cache;
}

export async function fetchProjects(): Promise<Project[]> {
  if (cache) return cache;
  const res = await fetch("https://apis.mypropertyfact.in/api/v1/projects");
  const data: Project[] = await res.json();
  cache = data;
  return data;
}

/**
 * Prefetches thumbnail images for the first `limit` projects into the
 * native image cache so they render instantly after the splash screen.
 */
export async function prefetchProjectImages(
  projects: Project[],
  limit = 10
): Promise<void> {
  const urls = projects
    .slice(0, limit)
    .map((p) => getImageUrl(p.slugURL, p.projectThumbnailImage))
    .filter(Boolean);

  // expo-image caches to disk, so subsequent <Image> renders are instant.
  await Image.prefetch(urls, "memory-disk");
}
