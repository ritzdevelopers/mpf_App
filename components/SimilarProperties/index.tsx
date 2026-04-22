// components/SimilarProperties/index.tsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { fetchProjects, getProjectsCache, getImageUrl, type Project } from "@/utils/api";

const STATUS_COLORS: Record<string, string> = {
  "Ready To Move":    "#16a34a",
  "Under Construction": "#d89b38",
  "New Launch":       "#2563eb",
  "Possession Soon":  "#9333ea",
};

export default function SimilarProperties() {
  const cached = getProjectsCache();
  const [projects, setProjects] = useState<Project[]>(
    cached ? cached.slice(0, 6) : []
  );
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return; // already warm — skip fetch + spinner
    fetchProjects()
      .then((data) => setProjects(data.slice(0, 6)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View className="bg-white px-4 pt-5 pb-6">
      {/* Heading */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-bold text-slate-900">Featured Projects</Text>
          <Text className="text-xs text-slate-400 mt-0.5">Curated especially for you</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/listings" as any)}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-[#d89b38]">See All</Text>
          <Ionicons name="chevron-forward" size={14} color="#d89b38" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="h-44 items-center justify-center">
          <ActivityIndicator color="#d89b38" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 4 }}
        >
          {projects.map((item) => {
            const tagColor = STATUS_COLORS[item.projectStatusName] ?? "#64748b";
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/propertyDetail/${item.slugURL}` as any)}
                className="mr-4 w-64 bg-white rounded-2xl overflow-hidden border border-slate-100"
                style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
                activeOpacity={0.9}
              >
                {/* Image */}
                <View className="h-44 relative">
                  <Image
                    source={{ uri: getImageUrl(item.slugURL, item.projectThumbnailImage) }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={150}
                  />

                  {/* Status tag */}
                  <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: tagColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{item.projectStatusName}</Text>
                  </View>

                  {/* Heart */}
                  <TouchableOpacity className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 items-center justify-center">
                    <Ionicons name="heart-outline" size={16} color="white" />
                  </TouchableOpacity>

                  {/* Price overlay */}
                  <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.45)", paddingHorizontal: 12, paddingVertical: 7 }}>
                    <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>₹{item.projectPrice} Cr</Text>
                  </View>
                </View>

                {/* Info */}
                <View className="p-3">
                  <Text className="text-sm font-bold text-slate-900" numberOfLines={1}>
                    {item.projectName}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={11} color="#94a3b8" />
                    <Text className="text-xs text-slate-400 ml-0.5" numberOfLines={1}>
                      {item.projectLocality}, {item.cityName}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <Text className="text-xs text-slate-500" numberOfLines={1}>{item.projectConfiguration.split(",")[0]}</Text>
                    <Text className="text-xs text-slate-400" numberOfLines={1}>{item.builderName}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
