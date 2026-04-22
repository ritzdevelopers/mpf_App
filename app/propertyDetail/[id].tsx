import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PropertyDetail from "@/components/property/PropertyDetail";
import {
  fetchProjects,
  getProjectsCache,
  fetchProjectDetail,
  type Project,
  type ProjectDetail,
} from "@/utils/api";

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const findInData = (data: Project[]) =>
    data.find((p) => p.slugURL === id || String(p.id) === String(id)) ?? null;

  const cached = getProjectsCache();
  const [project, setProject] = useState<Project | null>(
    cached ? findInData(cached) : null
  );
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (!cached) {
      fetchProjects()
        .then((data) => setProject(findInData(data)))
        .catch(() => setProject(null))
        .finally(() => setLoading(false));
    }
    const slug = String(id);
    fetchProjectDetail(slug).then(setDetail);
  }, [id]);

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
