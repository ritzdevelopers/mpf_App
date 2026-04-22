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

export async function fetchProjects(): Promise<Project[]> {
  if (cache) return cache;
  const res = await fetch("https://apis.mypropertyfact.in/api/v1/projects");
  const data: Project[] = await res.json();
  cache = data;
  return data;
}
