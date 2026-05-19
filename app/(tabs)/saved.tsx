// app/(tabs)/saved.tsx

import { fetchProjects, getImageUrl, getProjectsCache, type Project } from "@/utils/api";
import { toggleFavorite, useFavorites } from "@/utils/favoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SavedScreen() {
  const router = useRouter();
  const favoriteIds = useFavorites();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const isFocused = useIsFocused();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Filter the full list to only show properties the user has favorited
  const savedProjects = allProjects.filter(p => favoriteIds.has(p.id));

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startSelecting = () => {
    setIsSelecting(true);
  };

  const cancelSelecting = () => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  };

  const handleComparePress = () => {
    if (!isSelecting) {
      setIsSelecting(true);
      return;
    }

    if (selectedIds.size < 2) {
      alert("Please select at least 2 properties to compare.");
      return;
    }
    
    const ids = Array.from(selectedIds).join(",");
    router.push({
      pathname: "/compare" as any,
      params: { ids }
    });
  };

  useEffect(() => {
    if (isFocused) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isFocused]);

  useEffect(() => {
    // 1. Try cache first
    const cached = getProjectsCache();
    if (cached) setAllProjects(cached);

    // 2. Fetch fresh
    fetchProjects().then(setAllProjects).catch(() => {});
  }, []);

  const readyToMoveCount = savedProjects.filter(p => p.projectStatusName === "Ready To Move").length;
  const newLaunchCount = savedProjects.filter(p => p.projectStatusName === "New Launch").length;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1, backgroundColor: "#f1f5f9" }}
      showsVerticalScrollIndicator={false}
    >

      {/* ── HEADER ── */}
      <View style={{ backgroundColor: "#fff", paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>Shortlist</Text>
            <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>Your favourite saved properties</Text>
          </View>
          
          <TouchableOpacity 
            onPress={isSelecting ? cancelSelecting : startSelecting}
            style={{ 
              backgroundColor: isSelecting ? "#f1f5f9" : "#fff7ed", 
              borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, 
              borderWidth: 1, borderColor: isSelecting ? "#e2e8f0" : "#fed7aa" 
            }}
          >
            <Text style={{ fontWeight: "700", color: isSelecting ? "#64748b" : "#d89b38" }}>
              {isSelecting ? "Cancel" : "Compare"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>

        {/* ── STATS GLASS CARD ── */}
        <View style={[styles.glass, { marginTop: 16, overflow: "hidden" }]}>
          <View style={{ backgroundColor: "#d89b38", borderRadius: 16, padding: 16, margin: -16, marginBottom: 0 }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Saved Collection</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>
              {savedProjects.length} shortlisted properties
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              {[
                { val: String(savedProjects.length), label: "Saved" },
                { val: String(newLaunchCount),  label: "New Launch" },
                { val: String(readyToMoveCount),  label: "Ready" },
              ].map((s, i) => (
                <View key={i} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 14, paddingVertical: 10, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{s.val}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── EMPTY STATE ── */}
        {savedProjects.length === 0 && (
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
            <View style={{ width: 80, height: 80, backgroundColor: "#fff", borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 }}>
              <Ionicons name="heart-dislike-outline" size={40} color="#cbd5e1" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#475569" }}>No saved properties yet</Text>
            <Text style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", marginTop: 8, paddingHorizontal: 40 }}>
              Tap the heart icon on any property to save it to your shortlist.
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/listings" as any)}
              style={{ marginTop: 24, backgroundColor: "#0f172a", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Explore Projects</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── CARDS ── */}
        <View style={{ marginTop: 16 }}>
          {savedProjects.map((item) => {
            const imageUri = getImageUrl(item.slugURL, item.projectThumbnailImage);
            return (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.9}
                onPress={() => {
                  if (isSelecting) {
                    toggleSelect(item.id);
                  } else {
                    router.push(`/propertyDetail/${item.slugURL}` as any);
                  }
                }}
                style={[styles.glass, { 
                  marginBottom: 14, 
                  padding: 0, 
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: (isSelecting && selectedIds.has(item.id)) ? "#d89b38" : "rgba(255,255,255,0.95)"
                }]}
              >
                {/* Image */}
                <View style={{ position: "relative" }}>
                  <Image source={{ uri: imageUri }} style={{ width: "100%", height: 190 }} resizeMode="cover" />

                  {/* Selection Indicator (only in selection mode) */}
                  {isSelecting && (
                    <View style={{ 
                      position: "absolute", top: 12, left: 12, 
                      backgroundColor: selectedIds.has(item.id) ? "#d89b38" : "rgba(255,255,255,0.7)", 
                      width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center",
                      borderWidth: 2, borderColor: "#fff"
                    }}>
                      {selectedIds.has(item.id) && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                  )}

                  {/* Tag */}
                  <View style={{ 
                    position: "absolute", bottom: 12, left: 12, 
                    backgroundColor: item.projectStatusName === "Ready To Move" ? "#16a34a" : "#d89b38", 
                    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 
                  }}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{item.projectStatusName}</Text>
                  </View>

                </View>

                {/* Info */}
                <View style={{ padding: 14 }}>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#0f172a" }}>{item.projectName}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <Ionicons name="location-outline" size={12} color="#94a3b8" />
                    <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 4 }} numberOfLines={1}>
                      {item.projectLocality}, {item.cityName}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f1f5f9" }}>
                    <View>
                      <Text style={{ fontSize: 11, color: "#94a3b8" }}>Starting Price</Text>
                      <Text style={{ fontSize: 20, fontWeight: "800", color: "#d89b38" }}>₹{item.projectPrice} Cr</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity 
                        onPress={() => router.push(`/propertyDetail/${item.slugURL}` as any)}
                        style={{ backgroundColor: "#0f172a", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>View</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── COMPARE CTA ── */}
        {savedProjects.length > 1 && (
          <View style={[styles.glass, { 
            marginBottom: 32, 
            borderColor: isSelecting ? "#d89b38" : "#bfdbfe", 
            backgroundColor: isSelecting ? "rgba(255,248,236,0.9)" : "rgba(239,246,255,0.9)" 
          }]}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ backgroundColor: isSelecting ? "#fff7ed" : "#dbeafe", borderRadius: 12, padding: 8, marginRight: 12 }}>
                <Ionicons 
                  name={isSelecting ? "checkmark-circle-outline" : "git-compare-outline"} 
                  size={20} 
                  color={isSelecting ? "#d89b38" : "#2563eb"} 
                />
              </View>
              <View>
                <Text style={{ fontWeight: "700", fontSize: 15, color: "#1e293b" }}>
                  {isSelecting ? "Selecting Projects" : "Compare Saved Homes"}
                </Text>
                <Text style={{ color: "#64748b", fontSize: 12, marginTop: 1 }}>
                  {isSelecting 
                    ? `Pick ${selectedIds.size < 2 ? "at least 2" : selectedIds.size} to compare` 
                    : "See them side by side"}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={handleComparePress}
              style={{ backgroundColor: "#1e293b", borderRadius: 14, paddingVertical: 13, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                {!isSelecting ? "Compare Now" : selectedIds.size < 2 ? "Select Projects" : `Compare (${selectedIds.size}) Now`}
              </Text>
            </TouchableOpacity>
            {isSelecting && (
              <TouchableOpacity onPress={cancelSelecting} style={{ marginTop: 10, alignItems: "center" }}>
                <Text style={{ fontSize: 12, color: "#64748b", fontWeight: "600" }}>Cancel Selection</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    padding: 16,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 2,
  },
});
