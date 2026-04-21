export const API_BASE_URL = "https://apis.mypropertyfact.in/api/v1/";
export const IMAGE_BASE_URL = "https://apis.mypropertyfact.in/api/v1/get/images/";

export const buildImageUrl = (
  path?: string | null,
  slug?: string | null
): string => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const cleaned = path.replace(/^\/+/, "");
  if (slug) {
    return `${IMAGE_BASE_URL}properties/${slug}/${cleaned}`;
  }
  return `${IMAGE_BASE_URL}${cleaned}`;
};

export const buildProjectImageUrl = (
  project: Pick<Project, "slugURL"> | null | undefined,
  path?: string | null
): string => buildImageUrl(path, project?.slugURL);

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

export async function fetchProjects(): Promise<Project[]> {
  if (cache) return cache;
  const res = await fetch(`${API_BASE_URL}projects`);
  const data: Project[] = await res.json();
  cache = data;
  return data;
}
