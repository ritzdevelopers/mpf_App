// components/PopularTools/index.tsx

import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const toolsData = [
  {
    id: 1,
    title: "Budget\nCalculator",
    desc: "Check your affordability",
    icon: "calculator-outline" as const,
    lib: "ion",
    color: "#d89b38",
    bg: "#FFF8EC",
    route: "/popular_tools/budget",
  },
  {
    id: 2,
    title: "EMI\nCalculator",
    desc: "Calculate home loan EMI",
    icon: "calculate" as const,
    lib: "mi",
    color: "#2563eb",
    bg: "#EFF6FF",
    route: "/popular_tools/emi",
  },
  {
    id: 3,
    title: "Area\nConverter",
    desc: "Convert sq.ft, acres & more",
    icon: "resize-outline" as const,
    lib: "ion",
    color: "#16a34a",
    bg: "#F0FDF4",
    route: "/popular_tools/area",
  },
  {
    id: 4,
    title: "Loan\nEligibility",
    desc: "Know your loan amount",
    icon: "cash-outline" as const,
    lib: "ion",
    color: "#9333ea",
    bg: "#FAF5FF",
    route: "/popular_tools/loan",
  },
];

export default function PopularTools() {
  return (
    <View className="bg-slate-50 px-4 pt-5 pb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xl font-bold text-slate-900">Popular Tools</Text>
          <Text className="text-xs text-slate-400 mt-0.5">Go from browsing to buying</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/popular_tools" as any)}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-[#d89b38]">View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#d89b38" />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 4 }}>
        {toolsData.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(item.route as any)}
            className="mr-3 w-36 rounded-2xl p-4 border border-slate-100"
            style={{ backgroundColor: item.bg, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}
          >
            <View
              className="h-12 w-12 rounded-2xl items-center justify-center mb-3"
              style={{ backgroundColor: item.color + "20" }}
            >
              {item.lib === "ion"
                ? <Ionicons name={item.icon as any} size={26} color={item.color} />
                : <MaterialIcons name={item.icon as any} size={26} color={item.color} />
              }
            </View>
            <Text className="text-xs font-bold text-slate-900 leading-tight">{item.title}</Text>
            <Text className="text-[10px] text-slate-400 mt-1 leading-4">{item.desc}</Text>
            <View className="flex-row items-center mt-3">
              <Text className="text-[10px] font-bold" style={{ color: item.color }}>Open</Text>
              <Ionicons name="arrow-forward" size={10} color={item.color} style={{ marginLeft: 2 }} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
