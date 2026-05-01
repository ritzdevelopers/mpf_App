import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import PropertyDetail from "@/components/property/PropertyDetail";
import {
  fetchProjects,
  getImageUrl,
  getProjectsCache,
  fetchProjectDetail,
  getProjectDetailCache,
  type Project,
  type ProjectDetail,
} from "@/utils/api";

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // 3. Lazy initialization: getProjectsCache() is only called once on initial render
  const [cachedData] = useState(() => getProjectsCache());
  
  // 1. Stale closure fix: wrap findInData in useCallback so it always uses the latest 'id'
  const findInData = useCallback((data: Project[]) => {
    return data.find((p) => p.slugURL === id || String(p.id) === String(id)) ?? null;
  }, [id]);

  const [project, setProject] = useState<Project | null>(() => 
    cachedData && cachedData.length > 0 ? findInData(cachedData) : null
  );

  // Initialize synchronously from cache to prevent skeleton flash when reopening the same card
  const [detail, setDetail] = useState<ProjectDetail | null>(() => getProjectDetailCache(String(id)));
  
  // 6. Explicit truthy check: Make sure cachedData is actually an array with items
  const [loading, setLoading] = useState(!(cachedData && cachedData.length > 0));

  useEffect(() => {
    const hasCache = cachedData && cachedData.length > 0;
    if (!hasCache) {
      fetchProjects()
        .then((data) => setProject(findInData(data)))
        .catch(() => setProject(null))
        .finally(() => setLoading(false));
    }

    // 2. Timer leak fix: store timer IDs so they can be cleared if the user navigates away
    const timers: ReturnType<typeof setTimeout>[] = [];

    // 4. Note: fetchProjectDetail is internally guarded against redundant network calls
    fetchProjectDetail(String(id)).then((d) => {
      setDetail(d);
      
      if (d?.galleryImages?.length) {
        d.galleryImages.forEach((img, i) => {
          const timer = setTimeout(() => {
            const url = getImageUrl(d.slugURL || String(id), img.imageName);
            if (url) Image.prefetch(url, "memory-disk");
          }, 2000 + (i * 400));
          timers.push(timer);
        });
      }
    });

    // Cleanup function to prevent memory leaks if component unmounts early
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [id, cachedData, findInData]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#050816]">
        <ActivityIndicator size="large" color="#d89b38" />
        <Text className="text-slate-400 text-sm mt-3">Loading property...</Text>
      </View>
    );
  }

  return <PropertyDetail project={project} detail={detail} />;
}
