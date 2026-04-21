export const IMAGE_BASE_URL = "https://apis.mypropertyfact.in/api/v1/";

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
