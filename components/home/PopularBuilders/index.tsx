// components/PopularBuilders/index.tsx

import {
  fetchBuilderDetail,
  fetchProjects,
  getBuilderLogoUrl,
  getImageUrl,
  getProjectsCache,
  type Project,
} from "@/utils/api";

import React, {
  memo,
  useEffect,
  useState,
} from "react";

import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Easing } from "react-native-reanimated";

import Carousel from "react-native-reanimated-carousel";

import { Image } from "expo-image";

import { router } from "expo-router";

interface Builder {
  name: string;
  slug: string;
  logo: string;
  total: number;
  cityCount: number;
}

const { width } = Dimensions.get("window");

const CARD_WIDTH = 130;

const BuilderCard = memo(
  ({ item }: { item: Builder }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          width: CARD_WIDTH,
          alignItems: "center",
        }}
        onPress={() =>
          router.push({
            pathname: "/listings",
            params: {
              builder: item.name,
            },
          })
        }
      >

        {/* CARD */}
        <View
          className="w-28 h-28 rounded-3xl bg-white items-center justify-center mb-3"
          style={{
            shadowColor: "#94a3b8",

            shadowOffset: {
              width: 0,
              height: 4,
            },

            shadowOpacity: 0.08,

            shadowRadius: 10,

            elevation: 3,

            borderWidth: 1,

            borderColor: "#f1f5f9",
          }}
        >

          <Image
            source={{ uri: item.logo }}
            style={{
              width: 80,
              height: 80,
            }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />

        </View>

        {/* NAME */}
        <Text
          numberOfLines={2}
          className="text-[13px] font-semibold text-slate-800 text-center leading-tight"
        >
          {item.name}
        </Text>

        {/* STATS */}
        <View className="flex-row flex-wrap justify-center gap-1 mt-2">

          <View className="bg-slate-100 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] text-slate-500 font-medium">
              {item.total} projects
            </Text>
          </View>

          <View className="bg-blue-50 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] text-blue-500 font-semibold">
              {item.cityCount} here
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  }
);

BuilderCard.displayName = "BuilderCard";

export default function PopularBuilders() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let data = getProjectsCache() ?? (await fetchProjects());
      const map: Record<string, Builder> = {};

      data.forEach((p: Project) => {
        if (!p.builderName) return;
        if (!map[p.builderName]) {
          map[p.builderName] = {
            name: p.builderName,
            slug: p.builderSlug,
            logo: p.builderLogo && p.builderSlug
              ? getBuilderLogoUrl(p.builderSlug, p.builderLogo)
              : p.projectLogo
                ? getImageUrl(p.slugURL, p.projectLogo)
                : getImageUrl(p.slugURL, p.projectThumbnailImage),
            total: 0,
            cityCount: 0,
          };
        }
        map[p.builderName].total += 1;
        if (p.cityName === "Noida") map[p.builderName].cityCount += 1;
      });

      const list = Object.values(map)
        .sort((a, b) => b.cityCount - a.cityCount)
        .slice(0, 15);

      const enriched = await Promise.all(
        list.map(async (b) => {
          try {
            const detail = await fetchBuilderDetail(b.slug);
            return detail?.builderLogo
              ? { ...b, logo: getBuilderLogoUrl(b.slug, detail.builderLogo) }
              : b;
          } catch { return b; }
        })
      );

      setBuilders(enriched);
      setLoading(false);
    })();
  }, []);

  return (
    <View className="bg-white pt-6 pb-8">
      <View className="flex-row items-center justify-between px-5 mb-5">
        <View>
          <Text className="text-[22px] font-bold text-slate-900 tracking-tight">
            Popular Builders
          </Text>
          <View className="flex-row items-center gap-x-1.5 mt-1">
            <View className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <Text className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Noida
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/listings" as any)}
          className="bg-blue-50 px-4 py-2 rounded-full flex-row items-center"
        >
          <Text className="text-xs font-semibold text-blue-600">See all</Text>
          <Text className="ml-1 text-blue-400">→</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="px-5"><Text className="text-slate-400">Loading...</Text></View>
      ) : (
        <View style={{ width }}>
        <Carousel
          loop
          autoPlay
          autoPlayInterval={1}
          autoPlayReverse={false}
          scrollAnimationDuration={1000}
          width={CARD_WIDTH + 20}
          height={200}
          data={builders}
          style={{ width }}
          pagingEnabled={false}
          snapEnabled={false}
  
          withAnimation={{
            type: "timing",
            config: {
              duration: 2000,
              easing: Easing.linear,
            },
          }}
          renderItem={({ item }) => (
            <View style={{ paddingLeft: 20 }}>
              <BuilderCard item={item} />
            </View>
          )}
        />
        </View>
      )}
    </View>
  );
}