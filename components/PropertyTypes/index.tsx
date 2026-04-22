// components/PropertyTypes/index.tsx

import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const propertyTypes = [
  {
    id: 1,
    title: "Residential\nApartment",
    count: "16,000+",
    label: "Properties",
    bg: "#FFF8EC",
    accent: "#d89b38",
    image: require("@/assets/images/b4.webp"),
  },
  {
    id: 2,
    title: "Residential\nLand / Plot",
    count: "3,500+",
    label: "Properties",
    bg: "#EDF4FB",
    accent: "#2563eb",
    image: require("@/assets/images/b5.jpg"),
  },
];

export default function PropertyTypes() {
  return (
    <View className="bg-slate-50 px-4 pt-5 pb-6">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-bold text-slate-900">Browse by Type</Text>
          <Text className="text-xs text-slate-400 mt-0.5">Apartments, Villas and more in Noida</Text>
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
          >
            <View className="px-4 pt-4 pb-2">
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
            <Image
              source={item.image}
              style={{ width: "100%", height: 140 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
