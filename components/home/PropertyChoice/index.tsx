import { fetchProjects, getProjectsCache, type Project } from "@/utils/api";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const STATIC_BHK_DATA = [
  { id: 1, title: "1 BHK", icon: "bed-outline"    },
  { id: 2, title: "2 BHK",         icon: "home-outline"   },
  { id: 3, title: "3 BHK",         icon: "home-outline"   },
  { id: 4, title: "4 BHK",         icon: "business-outline"},
];


function SectionBlock({ title, subtitle, data, counts, isFA = false, onSelect }: any) {
  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-base font-bold text-slate-900">{title}</Text>
          {subtitle && <Text className="text-xs text-slate-400 mt-0.5">{subtitle}</Text>}
        </View>
        <TouchableOpacity
          onPress={() => router.push("/listings" as any)}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-[#d89b38]">See All</Text>
          <Ionicons name="chevron-forward" size={13} color="#d89b38" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 4 }}>
        {data.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect && onSelect(item)}
            className="mr-3 w-32 bg-white rounded-2xl p-4 items-center border border-slate-100"
            style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}
          >
            <View className="h-12 w-12 rounded-2xl bg-blue-50 items-center justify-center mb-2">
              {isFA
                ? <FontAwesome5 name={item.icon} size={22} color="#2563eb" />
                : <Ionicons name={item.icon} size={24} color="#2563eb" />
              }
            </View>
            <Text className="text-xs font-bold text-slate-900 text-center">{item.title}</Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">
              {(counts[item.title] || "+")} Properties
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function PropertyChoice() {
  const [counts, setCounts] = useState<Record<string, string>>({});

  useEffect(() => {
    const cached = getProjectsCache();
    if (cached) calculateCounts(cached);

    fetchProjects()
      .then(calculateCounts)
      .catch(() => {});
  }, []);

  const calculateCounts = (list: Project[]) => {
    const newCounts: Record<string, string> = {};
    
    // BHK Counts
    newCounts["1 BHK"] = list.filter(p => {
       const conf = (p.projectConfiguration || "").toLowerCase();
       return conf.includes("1 bhk") || conf.includes("1 rk");
    }).length.toString();

    newCounts["2 BHK"] = list.filter(p => (p.projectConfiguration || "").toLowerCase().includes("2 bhk")).length.toString();
    newCounts["3 BHK"] = list.filter(p => (p.projectConfiguration || "").toLowerCase().includes("3 bhk")).length.toString();
    newCounts["4 BHK"] = list.filter(p => (p.projectConfiguration || "").toLowerCase().includes("4 bhk")).length.toString();
    
    setCounts(newCounts);
  };

  const handleBhkSelect = (item: any) => {
    const searchTerm = item.title.replace("+", "").split("/").pop().trim();
    router.push({
      pathname: "/listings" as any,
      params: { tag: "Residential", search: searchTerm }
    });
  };

  return (
    <View className="bg-white px-4 pt-5 pb-4">
      <SectionBlock
        title="BHK Choice in Mind?"
        subtitle="Browse by bedroom configuration"
        data={STATIC_BHK_DATA}
        counts={counts}
        isFA={false}
        onSelect={handleBhkSelect}
      />
    </View>
  );
}


