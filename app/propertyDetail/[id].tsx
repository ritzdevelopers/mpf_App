import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PropertyDetail from "@/components/PropertiyDetail";
import { fetchProjects, type Project } from "@/utils/api";

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        const found = data.find(
          (p) => p.slugURL === id || String(p.id) === String(id)
        );
        setProject(found ?? null);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#050816]">
        <ActivityIndicator size="large" color="#d89b38" />
        <Text className="text-slate-400 text-sm mt-3">Loading property...</Text>
      </View>
    );
  }

  return <PropertyDetail project={project} />;
}
