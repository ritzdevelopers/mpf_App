import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProjects, getImageUrl, getProjectsCache, getBuilderLogoUrl, type Project } from "@/utils/api";

const getNotificationTime = (index: number) => {
  const times = [
    "2 mins ago",
    "15 mins ago",
    "1 hour ago",
    "3 hours ago",
    "5 hours ago",
    "8 hours ago",
    "12 hours ago",
    "18 hours ago",
    "Yesterday at 8:05 AM",
    "Yesterday at 2:30 PM",
    "Yesterday at 6:15 PM",
    "2 days ago",
    "3 days ago",
    "4 days ago",
    "5 days ago",
    "6 days ago",
    "1 week ago",
    "1 week ago",
    "2 weeks ago",
    "3 weeks ago",
  ];
  return times[index] || "Recently";
};

const getPropertyTypeColor = (typeName: string) => {
  const name = typeName?.toLowerCase() || "";
  if (name.includes("commercial") || name.includes("office") || name.includes("shop")) {
    return { bg: "bg-orange-50", icon: "#d89b38", dot: "bg-[#d89b38]", name: "business" };
  }
  if (name.includes("villa") || name.includes("penthouse") || name.includes("row")) {
    return { bg: "bg-purple-50", icon: "#8b5cf6", dot: "bg-purple-500", name: "home" };
  }
  if (name.includes("plot") || name.includes("land")) {
    return { bg: "bg-green-50", icon: "#22c55e", dot: "bg-green-500", name: "leaf" };
  }
  return { bg: "bg-blue-50", icon: "#3b82f6", dot: "bg-blue-500", name: "business-outline" };
};

export default function LatestRemindersScreen() {
  const router = useRouter();
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load visited/read status and projects list
  useEffect(() => {
    AsyncStorage.getItem("read_notification_ids_v2")
      .then((val) => {
        if (val) {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            setReadIds(new Set(parsed));
          }
        }
      })
      .catch((err) => console.error("Error loading read notifications:", err));

    const cached = getProjectsCache();
    if (cached) {
      const sorted = [...cached].sort((a, b) => b.id - a.id).slice(0, 20);
      setLatestProjects(sorted);
      setLoading(false);
    }

    fetchProjects()
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.id - a.id).slice(0, 20);
        setLatestProjects(sorted);
      })
      .catch((err) => console.error("Error loading latest projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleNotificationPress = async (item: Project) => {
    const nextRead = new Set(readIds);
    nextRead.add(item.id);
    setReadIds(nextRead);

    try {
      await AsyncStorage.setItem("read_notification_ids_v2", JSON.stringify(Array.from(nextRead)));
    } catch (err) {
      console.error("Error saving read notification:", err);
    }

    router.push(`/propertyDetail/${item.slugURL}` as any);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* ── HEADER ── */}
      <View className="flex-row items-center bg-white px-4 py-3.5 border-b border-slate-100">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="w-10 h-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-200"
        >
          <Ionicons name="chevron-back" size={22} color="#1e293b" />
        </TouchableOpacity>
        <View className="ml-3">
          <Text className="text-lg font-extrabold text-slate-900">Notifications</Text>
          <Text className="text-[10px] text-slate-400 mt-0.5 font-semibold tracking-wide">Latest added premium properties</Text>
        </View>
      </View>

      {/* ── CONTENT FEED ── */}
      {loading ? (
        <View className="flex-1 items-center justify-center px-5">
          <ActivityIndicator size="large" color="#d89b38" />
          <Text className="mt-3 text-sm text-slate-500 font-semibold">Fetching latest updates…</Text>
        </View>
      ) : latestProjects.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-5 border border-slate-100 shadow-sm">
            <Ionicons name="notifications-off-outline" size={48} color="#cbd5e1" />
          </View>
          <Text className="text-lg font-extrabold text-slate-900">No updates yet</Text>
          <Text className="text-sm text-slate-500 text-center mt-2 leading-5">We will notify you as soon as new properties are added.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="flex-row items-center px-4 pt-5 pb-2.5">
            <Text className="text-base font-extrabold text-slate-900">New Updates</Text>
            <View className="bg-[#d89b38] px-2 py-0.5 rounded-md ml-2">
              <Text className="color-white text-[10px] font-bold">{latestProjects.length} new</Text>
            </View>
          </View>

          {latestProjects.map((item, index) => {
            const timeStr = getNotificationTime(index);
            const styleCfg = getPropertyTypeColor(item.propertyTypeName);
            const logoUri = item.builderLogo ? getBuilderLogoUrl(item.builderSlug, item.builderLogo) : "";
            const isRead = readIds.has(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => handleNotificationPress(item)}
                className={`flex-row px-4 py-3.5 border-b border-slate-100 ${isRead ? "bg-white" : "bg-blue-50/60"}`}
              >
                {/* Left side: Avatar */}
                <View className="relative mr-3.5">
                  {logoUri ? (
                    <Image
                      source={{ uri: logoUri }}
                      className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200"
                      resizeMode="contain"
                    />
                  ) : (
                    <View className={`w-12 h-12 rounded-full items-center justify-center ${styleCfg.bg}`}>
                      <Ionicons name={styleCfg.name as any} size={20} color={styleCfg.icon} />
                    </View>
                  )}
                  {/* Property type badge dot */}
                  <View className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${styleCfg.dot}`} />
                </View>

                {/* Middle: Content */}
                <View className="flex-1 justify-center">
                  <Text className="text-xs text-slate-600 leading-5" numberOfLines={3}>
                    <Text className="font-bold text-slate-900">{item.builderName || "Developer"}</Text>
                    {" launched a brand new project, "}
                    <Text className="font-bold text-slate-900">{item.projectName}</Text>
                    {", offering premium "}
                    <Text className="font-semibold text-blue-600">{item.propertyTypeName}</Text>
                    {" at "}
                    <Text className="font-bold text-slate-900">{item.projectLocality}, {item.cityName}</Text>
                    {" starting at "}
                    <Text className="font-extrabold text-[#d89b38]">₹{item.projectPrice} Cr</Text>
                    {"."}
                  </Text>
                  <Text className="text-[10px] text-slate-400 mt-1.5">{timeStr}</Text>
                </View>

                {/* Right side: Action dot / three dots */}
                <View className="items-end ml-2 justify-between py-0.5">
                  {isRead ? (
                    <View className="w-2 h-2 mt-1.5" />
                  ) : (
                    <View className="w-2 h-2 rounded-full bg-[#d89b38] mt-1.5" />
                  )}
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} className="mt-2">
                    <Ionicons name="ellipsis-horizontal" size={16} color="#94a3b8" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
