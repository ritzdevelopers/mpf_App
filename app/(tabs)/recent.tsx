import {
    fetchProjects,
    getImageUrl,
    getProjectsCache,
    type Project,
} from "@/utils/api";
import { clearRecentViews, useRecentViews } from "@/utils/recentViewsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// ─── Main Screen (unchanged) ──────────────────────────────────────────────────
export default function RecentScreen() {
  const router = useRouter();
  const recentIds = useRecentViews();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const isFocused = useIsFocused();
  const scrollViewRef = useRef<ScrollView>(null);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-20)).current;

  const recentProjects = recentIds
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is Project => !!p);

  useEffect(() => {
    if (isFocused) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isFocused]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const cached = getProjectsCache();
    if (cached) setAllProjects(cached);
    fetchProjects().then(setAllProjects).catch(() => {});
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-[#F5F4F0]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* ── Hero Header ── */}
        <Animated.View
          className="px-6 pt-16"
          style={{ opacity: headerOpacity, transform: [{ translateY: headerY }] }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-[10px] tracking-[5px] uppercase font-bold text-neutral-400">
                Recent Collection
              </Text>

              <Text className="text-[54px] leading-[56px] font-black text-[#141210] mt-3 tracking-tight">
                {"Spaces\nYou Loved"}
              </Text>
            </View>

            {recentProjects.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={clearRecentViews}
                className="w-12 h-12 rounded-full bg-[#EDEBE6] items-center justify-center mt-7"
              >
                <Ionicons name="close" size={18} color="#5C5852" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center justify-between mt-5">
            <Text className="text-[14px] leading-6 text-neutral-400 flex-1 pr-4">
              An editorial collection of architectural residences you explored.
            </Text>

            {recentProjects.length > 0 && (
              <View className="bg-[#141210] rounded-full px-4 py-2">
                <Text className="text-[#F5F4F0] text-[12px] font-bold tracking-wide">
                  {recentProjects.length} saved
                </Text>
              </View>
            )}
          </View>

          <View className="h-px bg-[#DDD9D0] mt-7" />
        </Animated.View>

        {/* ── Cards / Empty ── */}
        {recentProjects.length === 0 ? (
          <EmptyState onBrowse={() => router.push("/")} />
        ) : (
          <View className="pt-10 pb-6">
            {recentProjects.map((item, index) => {
              const imageUri = getImageUrl(
                item.slugURL,
                item.projectThumbnailImage
              );
              return (
                <LuxuryCard
                  key={item.id}
                  item={item}
                  imageUri={imageUri}
                  index={index}
                  total={recentProjects.length}
                  onPress={() =>
                    router.push(`/propertyDetail/${item.slugURL}` as any)
                  }
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </>
  );
}

// ─── Luxury Card (redesigned) ─────────────────────────────────────────────────
interface CardProps {
  item: Project;
  imageUri: string;
  index: number;
  total: number;
  onPress: () => void;
}

function LuxuryCard({ item, imageUri, index, total, onPress }: CardProps) {
  // Entrance animations
  const translateY  = useRef(new Animated.Value(60)).current;
  const opacity     = useRef(new Animated.Value(0)).current;
  const rotate      = useRef(new Animated.Value(0)).current;

  // Press animation
  const scale       = useRef(new Animated.Value(1)).current;

  // Info panel separate entrance (slight extra delay)
  const infoOpacity = useRef(new Animated.Value(0)).current;
  const infoY       = useRef(new Animated.Value(12)).current;

  const isOffset   = index % 2 === 1;
  const cardWidth  = width - 48;
  const serialNum  = String(index + 1).padStart(2, "0");
  const totalStr   = String(total).padStart(2, "0");
  const delay      = index * 140;

  // Cards tilt into place from alternating sides
  const rotateDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: [isOffset ? "2.5deg" : "-2.5deg", "0deg"],
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 700,
        delay,
        useNativeDriver: true,
      }),
    ]).start();

    // Info panel fades in slightly after the image card
    Animated.parallel([
      Animated.timing(infoOpacity, {
        toValue: 1,
        duration: 500,
        delay: delay + 180,
        useNativeDriver: true,
      }),
      Animated.timing(infoY, {
        toValue: 0,
        duration: 500,
        delay: delay + 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.965,
      useNativeDriver: true,
      tension: 140,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      className={`mb-16 ${isOffset ? "pl-8" : "pl-6"} pr-6`}
      style={{ opacity, transform: [{ translateY }, { rotate: rotateDeg }] }}
    >
      {/* ── Top meta row ── */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-[10px] tracking-[3px] font-bold text-[#C4BFB6] uppercase">
          {serialNum} / {totalStr}
        </Text>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="share-outline" size={17} color="#C4BFB6" />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="heart-outline" size={17} color="#C4BFB6" />
          </TouchableOpacity>
        </View>
      </View>

      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        <Animated.View style={{ transform: [{ scale }] }}>

          {/* ── Image card ── */}
          <View
            className="rounded-[32px] overflow-hidden bg-[#E8E5DF]"
            style={{ width: cardWidth }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 420 }}
              resizeMode="cover"
            />

            {/* CURATED tag — top left */}
            <View className="absolute top-5 left-5">
              <View className="bg-[#F5F4F0] rounded-full px-4 py-[9px] flex-row items-center gap-2">
                <View className="w-[5px] h-[5px] rounded-full bg-emerald-500" />
                <Text className="text-[9px] font-black tracking-[2px] text-[#141210]">
                  CURATED
                </Text>
              </View>
            </View>

            {/* Name + location overlay — bottom inside image */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#141210]/90 px-6 pt-5 pb-6">
              <Text
                numberOfLines={1}
                className="text-white text-[20px] font-black tracking-tight leading-7"
              >
                {item.projectName}
              </Text>

              <View className="flex-row items-center mt-1 gap-1">
                <Ionicons name="location-sharp" size={12} color="rgba(255,255,255,0.4)" />
                <Text
                  numberOfLines={1}
                  className="text-[12px] font-medium flex-1"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {item.projectLocality}, {item.cityName}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Info bar (price + CTA) ── */}
          <Animated.View
            className="flex-row items-center bg-white rounded-[22px] mt-3 px-5 py-4 border border-[#E8E5DF]"
            style={{ opacity: infoOpacity, transform: [{ translateY: infoY }] }}
          >
            {/* Price */}
            <View className="flex-1">
              <Text className="text-[9px] tracking-[2px] text-[#C4BFB6] uppercase font-bold mb-1">
                Starting from
              </Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-[26px] font-black text-[#141210] tracking-tight">
                  ₹{item.projectPrice}
                </Text>
                <Text className="text-[13px] font-semibold text-[#A8A49C]">Cr</Text>
              </View>
            </View>

            {/* Vertical rule */}
            <View className="w-px h-10 bg-[#E8E5DF] mx-5" />

            {/* CTA */}
            <TouchableOpacity
              onPress={onPress}
              className="flex-row items-center gap-3"
              activeOpacity={0.8}
            >
              <Text className="text-[14px] font-black text-[#141210] tracking-tight">
                Explore
              </Text>
              <View className="w-9 h-9 rounded-full bg-[#141210] items-center justify-center">
                <Ionicons name="arrow-forward" size={15} color="#F5F4F0" />
              </View>
            </TouchableOpacity>
          </Animated.View>

        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onBrowse }: { onBrowse: () => void }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const iconScale  = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        delay: 400,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      className="items-center px-10 pt-20 pb-12"
      style={{ opacity, transform: [{ translateY }] }}
    >
      {/* Animated icon ring */}
      <Animated.View
        className="w-[120px] h-[120px] rounded-full bg-[#EDEBE6] border border-[#DDD9D0] items-center justify-center mb-8"
        style={{ transform: [{ scale: iconScale }] }}
      >
        <Ionicons name="home-outline" size={46} color="#C4BFB6" />
      </Animated.View>

      <Text className="text-[10px] tracking-[4px] font-bold text-[#C4BFB6] uppercase mb-4">
        00 / 00
      </Text>

      <Text className="text-[36px] font-black text-[#141210] tracking-tight text-center leading-10">
        {"Nothing\nHere Yet"}
      </Text>

      <Text className="text-center text-neutral-400 text-[14px] leading-6 mt-4">
        Your recently viewed luxury residences will appear here beautifully.
      </Text>

      <View className="w-10 h-0.5 bg-[#DDD9D0] rounded-full mt-8 mb-8" />

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onBrowse}
        className="bg-[#141210] px-8 py-[18px] rounded-full flex-row items-center gap-3"
      >
        <Text className="text-[#F5F4F0] text-[15px] font-black">
          Explore Properties
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#F5F4F0" />
      </TouchableOpacity>
    </Animated.View>
  );
}