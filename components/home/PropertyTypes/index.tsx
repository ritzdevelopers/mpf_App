// components/PropertyTypes/index.tsx

import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { HomePropertyTypeTag } from "@/utils/homePropertyTypeTags";

/** One distinct asset per card; image area is fixed + cover so all rows align. */
const IMAGES = {
  commercial: require("@/assets/images/b5.jpg"),
  newLaunches: require("@/assets/images/b4.webp"),
  residential: require("@/assets/images/b2.webp"),
} as const;

const propertyTypes: {
  id: number;
  title: string;
  tag: HomePropertyTypeTag;
  count: string;
  label: string;
  bg: string;
  accent: string;
  image: (typeof IMAGES)[keyof typeof IMAGES];
}[] = [
  {
    id: 1,
    title: "Commercial",
    tag: "Commercial",
    count: "2,400+",
    label: "Properties",
    bg: "#EEF2F7",
    accent: "#1e3a5f",
    image: IMAGES.commercial,
  },
  {
    id: 2,
    title: "New\nLaunches",
    tag: "New Launches",
    count: "1,100+",
    label: "Properties",
    bg: "#ECFDF5",
    accent: "#059669",
    image: IMAGES.newLaunches,
  },
  {
    id: 3,
    title: "Residential",
    tag: "Residential",
    count: "16,000+",
    label: "Properties",
    bg: "#FFF8EC",
    accent: "#d89b38",
    image: IMAGES.residential,
  },
];

export default function PropertyTypes() {
  return (
    <View className="bg-slate-50 px-4 pt-5 pb-6">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-bold text-slate-900">Browse by Type</Text>
          <Text className="text-xs text-slate-400 mt-0.5">Commercial, new launches, residential and more in Noida</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/listings" as any)}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-[#d89b38]">See All</Text>
          <Ionicons name="chevron-forward" size={14} color="#d89b38" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 4 }}
      >
        {propertyTypes.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="mr-4 w-52 rounded-2xl overflow-hidden"
            style={{ backgroundColor: item.bg }}
            activeOpacity={0.9}
            onPress={() =>
              router.push({ pathname: "/listings" as any, params: { tag: item.tag } })
            }
          >
            {/* Fixed text height so the image row starts at the same y on every card */}
            <View style={cardStyles.textBlock}>
              <Text className="text-sm font-bold text-slate-900 leading-tight">
                {item.title}
              </Text>
              <View className="flex-row items-baseline mt-1">
                <Text className="text-xl font-extrabold" style={{ color: item.accent }}>
                  {item.count}
                </Text>
                <Text className="text-xs text-slate-500 ml-1">{item.label}</Text>
              </View>
            </View>
            <View style={cardStyles.imageWrap}>
              <Image
                source={item.image}
                style={cardStyles.image}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const IMAGE_H = 140;

const cardStyles = StyleSheet.create({
  textBlock: {
    minHeight: 78,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    justifyContent: "flex-start",
  },
  imageWrap: {
    width: "100%",
    height: IMAGE_H,
    overflow: "hidden",
    backgroundColor: "rgba(15, 23, 42, 0.06)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
