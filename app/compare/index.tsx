import { fetchProjects, getImageUrl, getProjectsCache, type Project } from "@/utils/api";
import { useFavorites } from "@/utils/favoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = 240;
const LABEL_WIDTH = 120;

// Fallback image if project thumbnail is missing
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export default function CompareScreen() {
  const router = useRouter();
  const { ids } = useLocalSearchParams();
  const favoriteIds = useFavorites();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  
  const savedProjects = allProjects.filter((p) => {
    if (ids) {
      const selected = String(ids).split(",").map(Number);
      return selected.includes(p.id);
    }
    return favoriteIds.has(p.id);
  });

  useEffect(() => {
    const cached = getProjectsCache();
    if (cached) setAllProjects(cached);
    fetchProjects().then(setAllProjects).catch(() => {});
  }, []);

  const features = [
    { label: "Price", key: "projectPrice", format: (v: string) => `₹${v} Cr`, icon: "cash-outline", color: "#d89b38" },
    { label: "Status", key: "projectStatusName", icon: "construct-outline", color: "#16a34a" },
    { label: "Type", key: "propertyTypeName", icon: "business-outline", color: "#2563eb" },
    { label: "City", key: "cityName", icon: "location-outline", color: "#ef4444" },
    { label: "Locality", key: "projectLocality", icon: "map-outline", color: "#8b5cf6" },
    { label: "Builder", key: "builderName", icon: "person-outline", color: "#ec4899" },
    { label: "BHKs", key: "projectConfiguration", icon: "grid-outline", color: "#06b6d4" },
  ];

  if (savedProjects.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center p-8">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center shadow-xl shadow-slate-200 mb-8">
          <Ionicons name="git-compare-outline" size={48} color="#cbd5e1" />
        </View>
        <Text className="text-2xl font-black text-slate-800 text-center">Your comparison is empty</Text>
        <Text className="text-center text-slate-400 mt-3 px-6 leading-5">
          Add properties to your shortlist first to unlock the comparison suite.
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-10 bg-indigo-600 px-10 py-4 rounded-2xl shadow-lg shadow-indigo-200"
        >
          <Text className="text-white font-bold text-lg">Explore Projects</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        
        {/* HEADER */}
        <View className="px-6 py-5 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm mr-4"
            >
              <Ionicons name="chevron-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-black text-slate-900 tracking-tight">Project Matrix</Text>
              <Text className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Side-by-Side Analysis
              </Text>
            </View>
          </View>
          
          <View className="bg-indigo-600 px-3 py-2 rounded-xl shadow-sm shadow-indigo-100">
            <Text className="text-white text-xs font-black">{savedProjects.length}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <View>
            {/* STICKY TOP SECTION: PROJECT CARDS */}
            <View className="flex-row py-8 px-4">
              <View style={{ width: LABEL_WIDTH }} className="justify-center">
                <Text className="text-xs font-black text-slate-300 uppercase tracking-widest -rotate-90">Projects</Text>
              </View>
              {savedProjects.map((item) => {
                const uri = getImageUrl(item.slugURL, item.projectThumbnailImage);

                return (
                  <View key={item.id} style={{ width: COLUMN_WIDTH }} className="px-3">
                    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                      {/* Image Container */}
                      <View className="bg-slate-800 h-32 w-full relative overflow-hidden">
                        {uri ? (
                          <Image 
                            source={{ uri }} 
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                            cachePolicy="memory-disk"
                            transition={0}
                          />
                        ) : (
                          <View className="w-full h-full items-center justify-center">
                            <Ionicons name="business" size={24} color="#475569" />
                          </View>
                        )}
                        
                        {/* Status Badge */}
                        <View className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-lg">
                          <Text className="text-[7px] font-black text-white uppercase">
                            {item.projectStatusName}
                          </Text>
                        </View>
                      </View>

                      {/* Info Section */}
                      <View className="p-3">
                        <Text className="text-[11px] font-extrabold text-slate-800 h-8" numberOfLines={2}>
                          {item.projectName}
                        </Text>
                        <TouchableOpacity 
                          onPress={() => router.push(`/propertyDetail/${item.slugURL}` as any)}
                          className="mt-2 bg-slate-50 py-1.5 rounded-xl items-center border border-slate-100"
                        >
                          <Text className="text-[8px] font-bold text-slate-400 uppercase">View Details</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* COMPARISON ROWS */}
            <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
              {features.map((feat, idx) => (
                <View key={idx} className="flex-row mx-4 mb-2 rounded-2xl overflow-hidden">
                  {/* Fixed Label Column */}
                  <View style={{ width: LABEL_WIDTH }} className="p-5 bg-slate-100/50 justify-center">
                    <View className="flex-row items-center mb-1">
                      <View style={{ backgroundColor: feat.color + '20' }} className="w-6 h-6 rounded-lg items-center justify-center mr-2">
                        <Ionicons name={feat.icon as any} size={12} color={feat.color} />
                      </View>
                      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {feat.label}
                      </Text>
                    </View>
                  </View>

                  {/* Data Columns */}
                  <View className="flex-row bg-white/40 border-l border-slate-50">
                    {savedProjects.map((item) => {
                      const val = (item as any)[feat.key];
                      const displayVal = feat.format ? feat.format(val) : val;
                      return (
                        <View key={item.id} style={{ width: COLUMN_WIDTH }} className="p-5 justify-center items-center border-r border-slate-50">
                          <Text 
                            className={`text-sm font-bold text-center ${feat.key === "projectPrice" ? "text-indigo-600 text-base" : "text-slate-600"}`}
                            numberOfLines={2}
                          >
                            {displayVal || "N/A"}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
              
              {/* FINAL ACTION ROW */}
              <View className="flex-row mt-8 px-4">
                <View style={{ width: LABEL_WIDTH }} />
                {savedProjects.map((item) => (
                  <View key={item.id} style={{ width: COLUMN_WIDTH }} className="px-4">
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      className="bg-slate-900 py-4 rounded-[20px] items-center shadow-lg shadow-slate-300"
                      onPress={() => router.push(`/propertyDetail/${item.slugURL}` as any)}
                    >
                      <Text className="text-white text-xs font-black uppercase tracking-widest">Connect</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
