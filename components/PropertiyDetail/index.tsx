// components/PropertyDetail/index.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getImageUrl, type Project } from "@/utils/api";

const FALLBACK = "https://placehold.co/900x500/f1f5f9/94a3b8?text=No+Image";

/* ── Glass card helper ── */
function GlassCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.glass, style]}>
      {children}
    </View>
  );
}

function StatChip({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.glass, { flex: 1, alignItems: "center", paddingVertical: 14 }]}>
      <View style={{ backgroundColor: color + "18", borderRadius: 12, padding: 7, marginBottom: 6 }}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 12, fontWeight: "700", color: "#1e293b", textAlign: "center" }} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function OverviewItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={[styles.glass, { width: "48%", marginBottom: 10, paddingVertical: 14, paddingHorizontal: 14 }]}>
      <Ionicons name={icon as any} size={15} color="#d89b38" />
      <Text style={{ fontSize: 10, color: "#94a3b8", marginTop: 8 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "700", color: "#1e293b", marginTop: 3 }} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const HERO_H = 380;

export default function PropertyDetail({ project }: { project: Project | null }) {
  const [liked, setLiked] = useState(false);

  if (!project) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
        <Ionicons name="home-outline" size={52} color="#cbd5e1" />
        <Text style={{ color: "#94a3b8", fontSize: 16, marginTop: 14 }}>Property not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.glass, { marginTop: 20, paddingHorizontal: 28, paddingVertical: 12 }]}>
          <Text style={{ color: "#1e293b", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const configurations = project.projectConfiguration.split(",").map((c) => c.trim()).filter(Boolean);
  const imgUri = getImageUrl(project.slugURL, project.projectBannerImage || project.projectThumbnailImage);
  const emi = Math.round(parseFloat(project.projectPrice) * 100000 * 8.5 / 1200);

  return (
    <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* ── HERO ── */}
        <View style={{ position: "relative", height: HERO_H, backgroundColor: "#e2e8f0" }}>
          <Image
            source={{ uri: imgUri }}
            style={{ width: "100%", height: HERO_H }}
            resizeMode="cover"
          />


          {/* top buttons */}
          <View style={{ position: "absolute", top: 52, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.heroBtn}>
              <Ionicons name="arrow-back" size={20} color="#1e293b" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity style={styles.heroBtn}>
                <Ionicons name="share-social-outline" size={18} color="#1e293b" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.heroBtn}>
                <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#ef4444" : "#1e293b"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* badges */}
          <View style={{ position: "absolute", top: 116, left: 16, flexDirection: "row", gap: 8 }}>
            <View style={{ backgroundColor: "#2563eb", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{project.propertyTypeName}</Text>
            </View>
            <View style={{ backgroundColor: project.projectStatusName === "Ready To Move" ? "#16a34a" : "#d89b38", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 }}>
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{project.projectStatusName}</Text>
            </View>
          </View>

          {/* Glass title card aligned inside image bottom */}
          <View style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
            <GlassCard>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a" }} numberOfLines={2}>
                {project.projectName}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 8 }}>
                  <Ionicons name="location-outline" size={13} color="#94a3b8" />
                  <Text style={{ color: "#64748b", fontSize: 12, marginLeft: 4 }} numberOfLines={1}>{project.projectAddress}</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: "800", color: "#d89b38" }}>₹{project.projectPrice} Cr</Text>
              </View>
            </GlassCard>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>

          {/* ── STAT CHIPS ── */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <StatChip icon="business-outline"  label="Type"   value={project.propertyTypeName}    color="#2563eb" />
            <StatChip icon="location-outline"  label="City"   value={project.cityName}             color="#16a34a" />
            <StatChip icon="construct-outline" label="Status" value={project.projectStatusName}    color="#d89b38" />
          </View>

          {/* ── CONFIGURATIONS ── */}
          {configurations.length > 0 && (
            <GlassCard style={{ marginTop: 12 }}>
              <Text style={styles.sectionTitle}>Configurations</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {configurations.map((cfg, i) => (
                  <View key={i} style={{ backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                    <Text style={{ color: "#334155", fontSize: 12, fontWeight: "600" }}>{cfg}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {/* ── OVERVIEW ── */}
          <GlassCard style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Property Overview</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 10 }}>
              <OverviewItem icon="map-outline"    label="Locality"       value={project.projectLocality} />
              <OverviewItem icon="person-outline" label="Builder"        value={project.builderName} />
              <OverviewItem icon="cash-outline"   label="Starting Price" value={`₹${project.projectPrice} Cr`} />
              <OverviewItem icon="home-outline"   label="City"           value={project.cityName} />
            </View>
          </GlassCard>

          {/* ── WHY INVEST ── */}
          <GlassCard style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Why Invest?</Text>
            {[
              { icon: "shield-checkmark-outline", text: "RERA Registered & Verified Project",          color: "#16a34a" },
              { icon: "trending-up-outline",       text: "High appreciation potential in this locality", color: "#2563eb" },
              { icon: "people-outline",            text: "Trusted builder with proven track record",    color: "#d89b38" },
              { icon: "car-outline",               text: "Excellent connectivity & infrastructure",     color: "#9333ea" },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
                <View style={{ backgroundColor: item.color + "15", borderRadius: 12, padding: 8, marginRight: 12 }}>
                  <Ionicons name={item.icon as any} size={17} color={item.color} />
                </View>
                <Text style={{ color: "#475569", fontSize: 13, flex: 1 }}>{item.text}</Text>
              </View>
            ))}
          </GlassCard>

          {/* ── BUILDER ── */}
          <GlassCard style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Builder / Developer</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0", marginRight: 12 }}>
                <Image
                  source={{ uri: getImageUrl(project.slugURL, project.projectLogo) }}
                  style={{ width: 52, height: 52 }}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", fontSize: 15, color: "#0f172a" }}>{project.builderName}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                  <Ionicons name="location-outline" size={11} color="#94a3b8" />
                  <Text style={{ color: "#94a3b8", fontSize: 11, marginLeft: 3 }}>{project.cityName}</Text>
                </View>
              </View>
              <TouchableOpacity style={{ backgroundColor: "#eff6ff", borderWidth: 1, borderColor: "#bfdbfe", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}>
                <Text style={{ color: "#2563eb", fontSize: 12, fontWeight: "700" }}>View More</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* ── EMI TEASER ── */}
          <GlassCard style={{ marginTop: 12, marginBottom: 110, borderColor: "#fed7aa", backgroundColor: "rgba(255,247,237,0.9)" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: "#92400e", fontWeight: "600" }}>EMI Starts at</Text>
                <Text style={{ fontSize: 26, fontWeight: "800", color: "#d89b38", marginTop: 2 }}>
                  ₹{emi.toLocaleString("en-IN")}
                  <Text style={{ fontSize: 13, fontWeight: "400", color: "#94a3b8" }}> /mo</Text>
                </Text>
                <Text style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Based on 20yr loan @ 8.5% p.a.</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/popular_tools/emi" as any)}
                style={{ backgroundColor: "#d89b38", paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16 }}
              >
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>Calculate</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

        </View>
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => Linking.openURL("tel:+911234567890")}
          style={styles.iconActionBtn}
        >
          <Ionicons name="call" size={22} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://wa.me/911234567890")}
          style={styles.iconActionBtn}
        >
          <Ionicons name="logo-whatsapp" size={22} color="#16a34a" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Book Site Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    padding: 16,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 3,
  },
  heroBtn: {
    height: 42,
    width: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  iconActionBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#d89b38",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#d89b38",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
