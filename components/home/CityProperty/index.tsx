"use no memo";
import { getCityImage } from "@/data/allCitiesCards";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./CityPropertyUI";

const HOME_CITIES: { name: string; homes: string; tag: string }[] = [
  { name: "Agra", homes: "84+ homes", tag: "HERITAGE" },
  { name: "Bangalore", homes: "210+ homes", tag: "TECH HUB" },
  { name: "Noida", homes: "162+ homes", tag: "HOT MARKET" },
  { name: "Delhi", homes: "190+ homes", tag: "PRIME" },
];

export default function CityProperty() {
  const router = useRouter();
  const seeAllScale = useRef(new Animated.Value(1)).current;

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
          activeOpacity={1}
          onPress={() => router.push("/AllCities" as any)}
          onPressIn={() => Animated.spring(seeAllScale, { toValue: 0.82, useNativeDriver: true, speed: 40, bounciness: 10 }).start()}
          onPressOut={() => Animated.spring(seeAllScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }).start()}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Animated.View style={{ transform: [{ scale: seeAllScale }], flexDirection: "row", alignItems: "center" }}>
            <Text className={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={12} color="#b45309" />
          </Animated.View>
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
                source={getCityImage(item.name)}
                className={styles.image}
                resizeMode="cover"
              />

              <View className={styles.glassFooter}>
                <Text className={styles.city}>{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
