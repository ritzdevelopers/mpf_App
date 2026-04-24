"use no memo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { getCityImageUrl } from "@/data/allCitiesCards";
import { styles } from "./CityPropertyUI";

const HOME_CITIES: { name: string; homes: string; tag: string }[] = [
  { name: "Agra", homes: "84+ homes", tag: "HERITAGE" },
  { name: "Bangalore", homes: "210+ homes", tag: "TECH HUB" },
  { name: "Noida", homes: "162+ homes", tag: "HOT MARKET" },
  { name: "Delhi", homes: "190+ homes", tag: "PRIME" },
];

export default function CityProperty() {
  const router = useRouter();
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View className={styles.container}>
      {/* ── Header ── */}
      <View className={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View className={styles.titleRow}>
            <View className={styles.titleIcon}>
              <Ionicons name="location" size={14} color="#d89b38" />
            </View>
            <Text className={styles.heading}>Properties By City</Text>
          </View>
          <Text className={styles.subtitle}>
            Explore top markets curated for your next move
          </Text>
        </View>

        <TouchableOpacity
          className={styles.seeAllBtn}
          onPress={() => router.push("/AllCities" as any)}
          activeOpacity={0.85}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text className={styles.seeAllText}>See all</Text>
          <Ionicons name="arrow-forward" size={12} color="#b45309" />
        </TouchableOpacity>
      </View>

      {/* ── Grid ── */}
      <View className={styles.grid}>
        {HOME_CITIES.map((item, index) => (
          <TouchableOpacity
            key={item.name}
            className={styles.cardOuter}
            style={styles.cardShadow}
            activeOpacity={0.92}
            onPress={() =>
              router.push({
                pathname: "/listings",
                params: { city: item.name, tag: item.tag },
              })
            }
          >
            <View className={styles.cardInner}>
              <Image
                source={{ uri: getCityImageUrl(item.name) ?? "" }}
                className={styles.image}
                resizeMode="cover"
              />

              {/* Tag pill */}
              <View className={styles.tagPill}>
                <Text className={styles.tagText}>{item.tag}</Text>
              </View>

              {/* Heart */}
              <TouchableOpacity
                className={styles.heartBtn}
                activeOpacity={0.8}
                onPress={() => toggle(index)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Ionicons
                  name={liked.has(index) ? "heart" : "heart-outline"}
                  size={14}
                  color={liked.has(index) ? "#ef4444" : "#fff"}
                />
              </TouchableOpacity>

              <View className={styles.glassFooter}>
                <Text className={styles.city}>{item.name}</Text>
                <View className={styles.metaRow}>
                  <Ionicons name="business-outline" size={11} color="rgba(255,255,255,0.7)" />
                  <Text className={styles.metaText}>{item.homes}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
