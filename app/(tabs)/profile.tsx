"use no memo";
// app/(tabs)/profile.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut, useUser } from "../../utils/authStore";

const menuItems = [
  { icon: "heart-outline", label: "Liked Properties", value: "39", color: "#ef4444" },
  { icon: "time-outline", label: "Recently Viewed", value: "248", color: "#2563eb" },
  { icon: "bookmark-outline", label: "Saved Projects", value: "17", color: "#d89b38" },
  { icon: "notifications-outline", label: "Alerts & Reminders", value: "5", color: "#9333ea" },
  { icon: "document-text-outline", label: "My Enquiries", value: "12", color: "#16a34a" },
];

const settingsItems = [
  { icon: "person-outline", label: "Edit Profile" },
  { icon: "shield-checkmark-outline", label: "Privacy & Security" },
  { icon: "help-circle-outline", label: "Help & Support" },
  { icon: "information-circle-outline", label: "About App" },
];

export default function ProfilePage() {
  const user = useUser();
  if (!user) return <GuestView />;
  return <LoggedInView user={user} />;
}
/* ─────────────────────────────────────────────
   LOGGED-IN VIEW
───────────────────────────────────────────── */
function LoggedInView({ user }: { user: { name: string; email: string } }) {
  const initial = (user.name || user.email || "U").trim().charAt(0).toUpperCase();

  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => signOut() },
      ]
    );
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      {/* Decorative glass blobs */}
      <View pointerEvents="none" style={styles.blobIndigo} />
      <View pointerEvents="none" style={styles.blobGold} />
      <View pointerEvents="none" style={styles.blobBlue} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── HERO HEADER ── */}
        <View style={styles.hero}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View style={styles.avatar}>
                <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff" }}>{initial}</Text>
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }} numberOfLines={1}>
                  {user.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                  <View style={styles.premiumChip}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 }}>PREMIUM</Text>
                  </View>
                  <Text style={{ color: "#cbd5e1", fontSize: 11 }} numberOfLines={1}>{user.email}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={confirmSignOut}
              style={styles.iconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Smart Match */}
          <View style={styles.smartMatch}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Smart Match Score</Text>
              <Text style={{ color: "#cbd5e1", fontSize: 11, marginTop: 2 }}>Based on your searches & likes</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: "91%" }]} />
              </View>
            </View>
            <Text style={{ color: "#f5c97a", fontSize: 36, fontWeight: "800" }}>91%</Text>
          </View>
        </View>

        {/* ── FLOATING STATS ── */}
        <View style={{ paddingHorizontal: 16, marginTop: -22 }}>
          <View style={[styles.glass, { flexDirection: "row", gap: 8 }]}>
            {[
              { val: "248", label: "Seen", color: "#2563eb" },
              { val: "39", label: "Liked", color: "#ef4444" },
              { val: "17", label: "Saved", color: "#16a34a" },
            ].map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={{ fontSize: 22, fontWeight: "800", color: s.color }}>{s.val}</Text>
                <Text style={{ fontSize: 11, color: "#64748b", marginTop: 3, fontWeight: "600" }}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* ── BUYER INSIGHTS ── */}
          <Text style={styles.sectionTitle}>Buyer Insights</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[styles.glass, { flex: 1 }]}>
              <View style={[styles.insightIcon, { backgroundColor: "rgba(37,99,235,0.12)" }]}>
                <MaterialCommunityIcons name="home-city-outline" size={22} color="#2563eb" />
              </View>
              <Text style={styles.insightLabel}>Preferred City</Text>
              <Text style={styles.insightValue}>Noida</Text>
            </View>
            <View style={[styles.glass, { flex: 1 }]}>
              <View style={[styles.insightIcon, { backgroundColor: "rgba(22,163,74,0.12)" }]}>
                <Ionicons name="cash-outline" size={22} color="#16a34a" />
              </View>
              <Text style={styles.insightLabel}>Avg Budget</Text>
              <Text style={styles.insightValue}>₹1.4 Cr</Text>
            </View>
          </View>

          {/* ── ACTIVITY ── */}
          <Text style={styles.sectionTitle}>My Activity</Text>
          <View style={styles.glass}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.row, i < menuItems.length - 1 && styles.rowDivider]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ backgroundColor: item.color + "1A", borderRadius: 12, padding: 8, marginRight: 12 }}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1e293b" }}>{item.label}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={styles.valueChip}>
                    <Text style={{ fontWeight: "700", fontSize: 12, color: "#475569" }}>{item.value}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── PREMIUM CTA ── */}
          <View style={styles.premiumCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <View style={styles.upgradeChip}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 }}>UPGRADE</Text>
                </View>
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Supercharge Your Search</Text>
                <Text style={{ color: "#cbd5e1", fontSize: 12, marginTop: 6, lineHeight: 18 }}>
                  AI recommendations, instant alerts & priority access to new launches.
                </Text>
              </View>
              <Ionicons name="sparkles" size={36} color="#f5c97a" />
            </View>
            <TouchableOpacity style={styles.premiumCta}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>Explore Premium</Text>
            </TouchableOpacity>
          </View>

          {/* ── SETTINGS ── */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.glass}>
            {settingsItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.row, i < settingsItems.length - 1 && styles.rowDivider]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon as any} size={18} color="#475569" />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1e293b" }}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>

          {/* ── SIGN OUT ── */}
          <TouchableOpacity onPress={confirmSignOut} style={styles.signOutBtn}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={{ color: "#ef4444", fontSize: 14, fontWeight: "700" }}>Sign Out</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────
   GUEST VIEW  (no LinearGradient, no pink)
───────────────────────────────────────────── */
function GuestView() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      {/* Glass blobs */}
      <View pointerEvents="none" style={styles.blobIndigo} />
      <View pointerEvents="none" style={styles.blobGold} />
      <View pointerEvents="none" style={styles.blobBlue} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#0f172a" }}>Profile</Text>
          <Text style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
            Sign in to unlock your full experience
          </Text>
        </View>

        {/* ── HERO AUTH CARD ── */}
        <View style={[styles.glass, { padding: 0, overflow: "hidden", borderRadius: 28 }]}>
          <View style={styles.authHeader}>
            <View style={styles.authAvatar}>
              <Ionicons name="person" size={38} color="#fff" />
            </View>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "800" }}>Join RealEstate</Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 6, textAlign: "center", lineHeight: 20 }}>
              Login and access millions of properties{"\n"}with smart alerts & saved searches
            </Text>
          </View>

          <View style={{ padding: 20, gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push("/auth" as any)}
              activeOpacity={0.85}
              style={styles.primaryBtn}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>Login / Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/auth" as any)}
              style={styles.secondaryBtn}
            >
              <Text style={{ color: "#4361EE", fontSize: 15, fontWeight: "700" }}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── FEATURE HIGHLIGHTS ── */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Why Sign In?</Text>
        <View style={{ gap: 10 }}>
          {[
            { icon: "heart-outline", color: "#ef4444", bg: "rgba(239,68,68,0.12)", title: "Save & Shortlist", desc: "Bookmark properties you love" },
            { icon: "notifications-outline", color: "#9333ea", bg: "rgba(147,51,234,0.12)", title: "Smart Alerts", desc: "Get notified on new launches & price drops" },
            { icon: "trending-up-outline", color: "#2563eb", bg: "rgba(37,99,235,0.12)", title: "Price Insights", desc: "Track market trends in your locality" },
            { icon: "document-text-outline", color: "#16a34a", bg: "rgba(22,163,74,0.12)", title: "My Enquiries", desc: "Track all your property inquiries" },
          ].map((f, i) => (
            <View key={i} style={[styles.glass, { flexDirection: "row", alignItems: "center", paddingVertical: 14 }]}>
              <View style={{ backgroundColor: f.bg, borderRadius: 14, padding: 10, marginRight: 14 }}>
                <Ionicons name={f.icon as any} size={22} color={f.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#0f172a" }}>{f.title}</Text>
                <Text style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── STYLES ── */
const styles = StyleSheet.create({
  /* Background blobs (soft cool tones — no pink) */
  blobIndigo: {
    position: "absolute",
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: "rgba(99,102,241,0.18)",
    top: -80, right: -80,
  },
  blobGold: {
    position: "absolute",
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(216,155,56,0.14)",
    bottom: 140, left: -60,
  },
  blobBlue: {
    position: "absolute",
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(37,99,235,0.10)",
    top: 280, left: -40,
  },

  /* Glassmorphism card */
  glass: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    padding: 16,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 22,
    marginBottom: 10,
  },

  /* Hero */
  hero: {
    backgroundColor: "#0f172a",
    paddingTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: "#d89b38",
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "rgba(255,255,255,0.25)",
  },
  premiumChip: {
    backgroundColor: "#d89b38",
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14, padding: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.18)",
  },
  smartMatch: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14, marginTop: 20,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
  },
  progressBg: {
    marginTop: 8, height: 6, width: 180,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 3,
  },
  progressFill: {
    height: 6, backgroundColor: "#d89b38", borderRadius: 3,
  },

  /* Stats */
  statCard: {
    flex: 1,
    backgroundColor: "rgba(248,250,252,0.9)",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(241,245,249,0.9)",
  },

  /* Insights */
  insightIcon: { borderRadius: 12, padding: 8, alignSelf: "flex-start" },
  insightLabel: { color: "#64748b", fontSize: 11, marginTop: 12, fontWeight: "600" },
  insightValue: { fontSize: 17, fontWeight: "800", color: "#0f172a", marginTop: 3 },

  /* Row items */
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 13,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(241,245,249,0.9)",
  },
  valueChip: {
    backgroundColor: "rgba(241,245,249,0.9)",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  settingIcon: {
    backgroundColor: "rgba(248,250,252,0.9)",
    borderRadius: 12, padding: 8, marginRight: 12,
    borderWidth: 1, borderColor: "rgba(241,245,249,0.9)",
  },

  /* Premium CTA */
  premiumCard: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    borderWidth: 1, borderColor: "#1e293b",
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 5,
  },
  upgradeChip: {
    backgroundColor: "#d89b38",
    alignSelf: "flex-start",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    marginBottom: 8,
  },
  premiumCta: {
    backgroundColor: "#d89b38",
    borderRadius: 14, paddingVertical: 13,
    alignItems: "center", marginTop: 16,
  },

  /* Sign out */
  signOutBtn: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(254,242,242,0.85)",
    borderWidth: 1,
    borderColor: "rgba(254,202,202,0.9)",
  },

  /* Guest auth card */
  authHeader: {
    backgroundColor: "#4361EE",
    paddingTop: 32, paddingBottom: 24, paddingHorizontal: 24,
    alignItems: "center",
  },
  authAvatar: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: "#4361EE",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#4361EE",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  secondaryBtn: {
    paddingVertical: 15, alignItems: "center", borderRadius: 16,
    borderWidth: 1.5, borderColor: "#4361EE",
    backgroundColor: "rgba(67,97,238,0.08)",
  },
});
