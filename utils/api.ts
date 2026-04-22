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
