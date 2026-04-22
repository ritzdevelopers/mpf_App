// app/(tabs)/saved.tsx

import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const savedData = [
  {
    id: 1,
    title: "3 BHK Luxury Apartment",
    location: "Sector 150, Noida",
    price: "₹1.45 Cr",
    tag: "New Launch",
    status: "Under Construction",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    tagColor: "#d89b38",
  },
  {
    id: 2,
    title: "2 BHK Ready To Move",
    location: "Sector 137, Noida",
    price: "₹82 Lakh",
    tag: "Ready",
    status: "Ready To Move",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",
    tagColor: "#16a34a",
  },
  {
    id: 3,
    title: "Villa with Garden",
    location: "Greater Noida West",
    price: "₹2.8 Cr",
    tag: "Premium",
    status: "Possession Soon",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    tagColor: "#2563eb",
  },
];

export default function SavedScreen() {
  const [saved, setSaved] = useState(savedData.map((d) => d.id));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f1f5f9" }} showsVerticalScrollIndicator={false}>

      {/* ── HEADER ── */}
      <View style={{ backgroundColor: "#fff", paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>Shortlist</Text>
            <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>Your favourite saved properties</Text>
          </View>
          <View style={{ backgroundColor: "#fff7ed", borderRadius: 16, padding: 10, borderWidth: 1, borderColor: "#fed7aa" }}>
            <Ionicons name="heart" size={22} color="#d89b38" />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>

        {/* ── STATS GLASS CARD ── */}
        <View style={[styles.glass, { marginTop: 16, overflow: "hidden" }]}>
          <View style={{ backgroundColor: "#d89b38", borderRadius: 16, padding: 16, margin: -16, marginBottom: 0 }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Saved Collection</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>
              {saved.length} shortlisted properties
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              {[
                { val: String(saved.length), label: "Saved" },
                { val: "2",  label: "New Launch" },
                { val: "1",  label: "Ready" },
              ].map((s, i) => (
                <View key={i} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 14, paddingVertical: 10, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>{s.val}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 2 }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── FILTER CHIPS ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }} contentContainerStyle={{ gap: 8 }}>
          {["All", "Ready To Move", "New Launch", "Under ₹1 Cr", "Premium"].map((f, i) => (
            <TouchableOpacity key={i} style={{
              paddingHorizontal: 14, paddingVertical: 7,
              backgroundColor: i === 0 ? "#0f172a" : "#fff",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: i === 0 ? "#0f172a" : "#e2e8f0",
            }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: i === 0 ? "#fff" : "#64748b" }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── CARDS ── */}
        <View style={{ marginTop: 16 }}>
          {savedData.map((item) => (
            <View key={item.id} style={[styles.glass, { marginBottom: 14, padding: 0, overflow: "hidden" }]}>
              {/* Image */}
              <View style={{ position: "relative" }}>
                <Image source={{ uri: item.image }} style={{ width: "100%", height: 190 }} resizeMode="cover" />

                {/* Tag */}
                <View style={{ position: "absolute", top: 12, left: 12, backgroundColor: item.tagColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{item.tag}</Text>
                </View>

                {/* Remove heart */}
                <TouchableOpacity
                  onPress={() => setSaved((s) => s.filter((id) => id !== item.id))}
                  style={{ position: "absolute", top: 10, right: 10, backgroundColor: "#fff", borderRadius: 12, padding: 7, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
                >
                  <Ionicons name="heart" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>

              {/* Info */}
              <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: "#0f172a" }}>{item.title}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <Ionicons name="location-outline" size={12} color="#94a3b8" />
                  <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 4 }}>{item.location}</Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f1f5f9" }}>
                  <View>
                    <Text style={{ fontSize: 11, color: "#94a3b8" }}>Price</Text>
                    <Text style={{ fontSize: 20, fontWeight: "800", color: "#d89b38" }}>{item.price}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#64748b" }}>Compare</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: "#0f172a", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── COMPARE CTA ── */}
        <View style={[styles.glass, { marginBottom: 32, borderColor: "#bfdbfe", backgroundColor: "rgba(239,246,255,0.9)" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{ backgroundColor: "#dbeafe", borderRadius: 12, padding: 8, marginRight: 12 }}>
              <Ionicons name="git-compare-outline" size={20} color="#2563eb" />
            </View>
            <View>
              <Text style={{ fontWeight: "700", fontSize: 15, color: "#1e293b" }}>Compare Saved Homes</Text>
              <Text style={{ color: "#64748b", fontSize: 12, marginTop: 1 }}>See them side by side</Text>
            </View>
          </View>
          <TouchableOpacity style={{ backgroundColor: "#1e293b", borderRadius: 14, paddingVertical: 13, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Compare Now</Text>
          </TouchableOpacity>
        </View>

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
