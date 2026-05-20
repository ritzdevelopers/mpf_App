"use no memo";
import { ALL_CITIES_CARDS } from "@/data/allCitiesCards";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image } from "expo-image";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./AllCitiesUI";

const HERO = StyleSheet.create({
  shell: {
    marginTop: 8,
    borderRadius: 26,
    overflow: "hidden",
    shadowColor: "#0c1220",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.38,
    shadowRadius: 28,
    elevation: 14,
  },
  gradient: {
    borderRadius: 26,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(251, 191, 36, 0.14)",
    top: -70,
    right: -60,
  },
  glow2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(129, 140, 248, 0.12)",
    bottom: -40,
    left: -50,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.35)",
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fde68a",
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  headline: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.3,
    marginTop: 14,
  },
  sub: {
    fontSize: 14,
    color: "rgba(226, 232, 240, 0.92)",
    lineHeight: 20,
    marginTop: 8,
    maxWidth: "92%" as const,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  stat: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(251, 191, 36, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(203, 213, 225, 0.95)",
    marginTop: 3,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(251, 191, 36, 0.65)",
  },
});

export default function AllCities() {
  return (
    <SafeAreaView edges={["top"]} className={styles.safe}>
      {/* ── Top bar ── */}
      <View className={styles.headerRow} style={{ position: "relative" }}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)" as any);
            }
          }}
          className={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color="#0f172a" />
        </TouchableOpacity>
        <View
          pointerEvents="none"
          style={{ position: "absolute", left: 0, right: 0, alignItems: "center" }}
        >
          <Text className={styles.title}>All Cities</Text>
        </View>
      </View>

      <ScrollView
        className={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={HERO.shell}>
          <LinearGradient
            colors={["#0b1220", "#152a4a", "#0f1f38"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={HERO.gradient}
          >
            <View style={HERO.accentLine} />
            <View style={HERO.glow} pointerEvents="none" />
            <View style={HERO.glow2} pointerEvents="none" />

            <View style={HERO.liveBadge}>
              <Ionicons name="pulse" size={13} color="#fbbf24" />
              <Text style={HERO.liveBadgeText}>LIVE COVERAGE</Text>
            </View>

            <Text style={HERO.headline}>Discover by city</Text>
            <Text style={HERO.sub}>
              Hand-picked growth corridors and high-demand pockets — your next
              home starts where the market is strongest.
            </Text>
          </LinearGradient>
        </View>

        {/* ── City grid ── */}
        <View className={styles.grid}>
          {ALL_CITIES_CARDS.map((city) => (
            <TouchableOpacity
              key={city.name}
              className={styles.cardOuter}
              style={styles.cardShadow}
              activeOpacity={0.92}
              onPress={() =>
                router.push({
                  pathname: "/listings",
                  params: { city: city.name, tag: city.tag },
                })
              }
            >
              <View className={styles.cardInner}>
                <Image
                  source={city.image}
                  style={{ width: "100%", height: 240 }}
                  contentFit="cover"
                />

                <View className={styles.glassFooter}>
                  <Text className={styles.city}>{city.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
