// components/PopularBuilders/index.tsx

import {
    fetchProjects,
    getImageUrl,
    getProjectsCache,
    type Project,
} from "@/utils/api";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Builder {
  name: string;
  logo: string;
  total: number;
  cityCount: number;
}

export default function PopularBuilders() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuilders = async () => {
      let data = getProjectsCache();

      if (!data) {
        data = await fetchProjects();
      }

      const map: Record<string, Builder> = {};

      data.forEach((p: Project) => {
        if (!p.builderName) return;

        if (!map[p.builderName]) {
          map[p.builderName] = {
            name: p.builderName,
            logo: p.projectLogo
              ? getImageUrl(p.slugURL, p.projectLogo)
              : getImageUrl(p.slugURL, p.projectThumbnailImage),
            total: 0,
            cityCount: 0,
          };
        }

        map[p.builderName].total += 1;

        if (p.cityName === "Noida") {
          map[p.builderName].cityCount += 1;
        }
      });

      const list = Object.values(map)
        .filter((b) => b.total > 0)
        .sort((a, b) => b.cityCount - a.cityCount) // better sorting
        .slice(0, 10); // ✅ LIMIT TO 10

      setBuilders(list);
      setLoading(false);
    };

    loadBuilders();
  }, []);

  return (
    <View className="bg-white px-4 pt-5 pb-6">

      {/* Heading */}
      <Text className="text-xl font-bold text-slate-900">
        Popular builders
      </Text>
      <Text className="text-xs text-slate-400 mt-1 mb-4">
        in Noida
      </Text>

      {/* Loading */}
      {loading ? (
        <Text className="text-xs text-slate-400">Loading...</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {builders.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="mr-8 items-center w-28"
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/listings",
                  params: { builder: item.name },
                })
              }
            >
              {/* Rounded Rectangle Logo */}
              <View className="h-28 w-28 rounded-3xl  items-center justify-center mb-3 bg-white shadow-sm">
                <Image
                  source={{ uri: item.logo }}
                  style={{ width: 100, height: 100 }}
                  contentFit="contain"
                />
              </View>

              {/* Name */}
              <Text className="text-sm font-semibold text-slate-900 text-center">
                {item.name}
              </Text>

              {/* Stats */}
              <Text className="text-xs text-slate-500 text-center mt-1">
                {item.total} Total Projects
              </Text>
              <Text className="text-xs text-slate-400 text-center">
                {item.cityCount} in this city
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}