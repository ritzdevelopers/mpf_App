// app/(tabs)/profile.tsx

import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const menuItems = [
  { icon: "heart-outline",        label: "Liked Properties",    value: "39",  color: "#ef4444" },
  { icon: "time-outline",         label: "Recently Viewed",     value: "248", color: "#2563eb" },
  { icon: "bookmark-outline",     label: "Saved Projects",      value: "17",  color: "#d89b38" },
  { icon: "notifications-outline",label: "Alerts & Reminders",  value: "5",   color: "#9333ea" },
  { icon: "document-text-outline",label: "My Enquiries",        value: "12",  color: "#16a34a" },
];

const settingsItems = [
  { icon: "person-outline",       label: "Edit Profile" },
  { icon: "shield-checkmark-outline", label: "Privacy & Security" },
  { icon: "help-circle-outline",  label: "Help & Support" },
  { icon: "information-circle-outline", label: "About App" },
  { icon: "log-out-outline",      label: "Sign Out", danger: true },
];

export default function ProfilePage() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f1f5f9" }} showsVerticalScrollIndicator={false}>

      {/* ── HERO HEADER ── */}
      <View style={{ backgroundColor: "#0f172a", paddingTop: 60, paddingBottom: 50, paddingHorizontal: 20, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Avatar */}
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: "#d89b38", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.2)" }}>
              <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff" }}>S</Text>
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>Simranpreet Singh</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <View style={{ backgroundColor: "#d89b38", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginRight: 8 }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>PREMIUM</Text>
                </View>
                <Text style={{ color: "#94a3b8", fontSize: 11 }}>algoknightcode@gmail.com</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, padding: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Smart Match */}
        <View style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 14, marginTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          <View>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Smart Match Score</Text>
            <Text style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>Based on your searches & likes</Text>
            <View style={{ marginTop: 8, height: 6, width: 180, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
              <View style={{ height: 6, width: "91%", backgroundColor: "#d89b38", borderRadius: 3 }} />
            </View>
          </View>
          <Text style={{ color: "#d89b38", fontSize: 36, fontWeight: "800" }}>91%</Text>
        </View>
      </View>

      {/* ── FLOATING STATS ── */}
      <View style={{ paddingHorizontal: 16, marginTop: -22 }}>
        <View style={[styles.glass, { flexDirection: "row", gap: 8 }]}>
          {[
            { val: "248", label: "Seen",  color: "#2563eb" },
            { val: "39",  label: "Liked", color: "#ef4444" },
            { val: "17",  label: "Saved", color: "#16a34a" },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: 16, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#f1f5f9" }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: s.color }}>{s.val}</Text>
              <Text style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── BUYER INSIGHTS ── */}
        <Text style={styles.sectionTitle}>Buyer Insights</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[styles.glass, { flex: 1 }]}>
            <View style={{ backgroundColor: "#eff6ff", borderRadius: 12, padding: 8, alignSelf: "flex-start" }}>
              <MaterialCommunityIcons name="home-city-outline" size={22} color="#2563eb" />
            </View>
            <Text style={{ color: "#94a3b8", fontSize: 11, marginTop: 12 }}>Preferred City</Text>
            <Text style={{ fontSize: 17, fontWeight: "800", color: "#0f172a", marginTop: 3 }}>Noida</Text>
          </View>
          <View style={[styles.glass, { flex: 1 }]}>
            <View style={{ backgroundColor: "#f0fdf4", borderRadius: 12, padding: 8, alignSelf: "flex-start" }}>
              <Ionicons name="cash-outline" size={22} color="#16a34a" />
            </View>
            <Text style={{ color: "#94a3b8", fontSize: 11, marginTop: 12 }}>Avg Budget</Text>
            <Text style={{ fontSize: 17, fontWeight: "800", color: "#0f172a", marginTop: 3 }}>₹1.4 Cr</Text>
          </View>
        </View>

        {/* ── ACTIVITY ── */}
        <Text style={styles.sectionTitle}>My Activity</Text>
        <View style={styles.glass}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                paddingVertical: 13,
                borderBottomWidth: i < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#f1f5f9",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ backgroundColor: item.color + "15", borderRadius: 12, padding: 8, marginRight: 12 }}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#1e293b" }}>{item.label}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ backgroundColor: "#f1f5f9", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                  <Text style={{ fontWeight: "700", fontSize: 12, color: "#475569" }}>{item.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── PREMIUM CTA ── */}
        <View style={[styles.glass, { marginTop: 16, backgroundColor: "#0f172a", borderColor: "#1e293b", overflow: "hidden" }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ backgroundColor: "#d89b38", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 8 }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>UPGRADE</Text>
              </View>
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Supercharge Your Search</Text>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 6, lineHeight: 18 }}>
                AI recommendations, instant alerts & priority access to new launches.
              </Text>
            </View>
            <Ionicons name="sparkles" size={36} color="#d89b38" />
          </View>
          <TouchableOpacity style={{ backgroundColor: "#d89b38", borderRadius: 14, paddingVertical: 13, alignItems: "center", marginTop: 16 }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>Explore Premium</Text>
          </TouchableOpacity>
        </View>

        {/* ── SETTINGS ── */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={[styles.glass, { marginBottom: 36 }]}>
          {settingsItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                paddingVertical: 13,
                borderBottomWidth: i < settingsItems.length - 1 ? 1 : 0,
                borderBottomColor: "#f1f5f9",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ backgroundColor: (item as any).danger ? "#fef2f2" : "#f8fafc", borderRadius: 12, padding: 8, marginRight: 12, borderWidth: 1, borderColor: (item as any).danger ? "#fecaca" : "#f1f5f9" }}>
                  <Ionicons name={item.icon as any} size={18} color={(item as any).danger ? "#ef4444" : "#475569"} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: (item as any).danger ? "#ef4444" : "#1e293b" }}>{item.label}</Text>
              </View>
              {!(item as any).danger && <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />}
            </TouchableOpacity>
          ))}
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 20,
    marginBottom: 10,
  },
});
