// components/CategoryCarousel/index.tsx

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { id: 1, title: "Buy",        icon: "home-outline" },
  { id: 3, title: "New Launch", icon: "sparkles-outline" },
  { id: 4, title: "Plot/Land",  icon: "map-outline" },
  { id: 5, title: "Commercial", icon: "business-outline" },
  { id: 6, title: "Insights",   icon: "bulb-outline" },
];

export default function CategoryCarousel() {
  const [active, setActive] = useState(1);

  return (
    <View className="bg-white border-b border-slate-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
      >
        {categories.map((item) => {
          const isActive = active === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setActive(item.id)}
              className={`flex-row items-center mr-2 px-4 py-2 rounded-full border ${
                isActive
                  ? "bg-[#d89b38] border-[#d89b38]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <Ionicons
                name={item.icon as any}
                size={15}
                color={isActive ? "#fff" : "#64748b"}
              />
              <Text
                className={`ml-1.5 text-xs font-semibold ${
                  isActive ? "text-white" : "text-slate-600"
                }`}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
