"use no memo";
// app/(tabs)/profile.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { signOut, useUser } from "../../utils/authStore";
import ContactFormModal from "@/components/property/ContactFormModal";

const menuItems = [
  { icon: "heart-outline", label: "Liked Properties", color: "#ef4444", action: "liked" },
  { icon: "time-outline", label: "Recently Viewed", color: "#2563eb", action: "recent" },
  { icon: "document-text-outline", label: "My Enquiries", color: "#16a34a", action: "enquiries" },
];

const settingsItems = [
  { icon: "person-outline", label: "Edit Profile", route: "" },
  { icon: "shield-checkmark-outline", label: "Privacy & Security", route: "/settings/privacy" },
  { icon: "help-circle-outline", label: "Help & Support", route: "" },
  { icon: "information-circle-outline", label: "About App", route: "/settings/about" },
];

export default function ProfilePage() {
  const user = useUser();
  if (!user) return <GuestView />;
  return <LoggedInView user={user} />;
}
/* ─────────────────────────────────────────────
   LOGGED-IN VIEW
───────────────────────────────────────────── */
import { Modal, Animated, Pressable } from "react-native";

function CustomSignOutModal({ visible, onCancel, onConfirm }: { visible: boolean; onCancel: () => void; onConfirm: () => void }) {
  const animValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      animValue.setValue(0); // Reset spring start position to bottom every time
      Animated.spring(animValue, {
        toValue: 1,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleDismiss = (callback: () => void) => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      callback();
    });
  };

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [450, 0],
  });

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={() => handleDismiss(onCancel)}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable onPress={() => handleDismiss(onCancel)} style={{ ...StyleSheet.absoluteFillObject }}>
          <Animated.View style={{ flex: 1, backgroundColor: "#000", opacity: backdropOpacity }} />
        </Pressable>

        <Animated.View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingTop: 10,
            paddingHorizontal: 24,
            paddingBottom: Platform.OS === "ios" ? 44 : 28,
            transform: [{ translateY }],
          }}
        >
          {/* Top handle bar */}
          <View style={{ width: 42, height: 5, backgroundColor: "#e2e8f0", borderRadius: 99, alignSelf: "center", marginBottom: 24 }} />

          {/* Exit icon circle */}
          <View style={{
            width: 58,
            height: 58,
            borderRadius: 20,
            backgroundColor: "#FEF2F2",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 16,
          }}>
            <Ionicons name="log-out" size={24} color="#ef4444" />
          </View>

          {/* Header */}
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a", textAlign: "center", marginBottom: 24 }}>
            Sign Out?
          </Text>

          {/* CTA buttons */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => handleDismiss(onConfirm)}
              style={{
                backgroundColor: "#EF4444",
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: "center",
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>Yes, Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => handleDismiss(onCancel)}
              style={{
                backgroundColor: "#F1F5F9",
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#475569", fontSize: 15, fontWeight: "700" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function LoggedInView({ user }: { user: { name: string; email: string } }) {
  const initial = (user.name || user.email || "U").trim().charAt(0).toUpperCase();
  const [showSignOut, setShowSignOut] = React.useState(false);
  const [showEnquiry, setShowEnquiry] = React.useState(false);

  const handleSignOut = () => {
    setShowSignOut(false);
    signOut();
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
              onPress={() => setShowSignOut(true)}
              style={styles.iconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>

          {/* ── ACTIVITY ── */}
          <Text style={styles.sectionTitle}>My Activity</Text>
          <View style={styles.glass}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (item.action === "liked") {
                    router.push("/(tabs)/saved" as any);
                  } else if (item.action === "recent") {
                    router.push("/(tabs)/recent" as any);
                  } else if (item.action === "enquiries") {
                    setShowEnquiry(true);
                  }
                }}
                style={[styles.row, i < menuItems.length - 1 && styles.rowDivider]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ backgroundColor: item.color + "1A", borderRadius: 12, padding: 8, marginRight: 12 }}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1e293b" }}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>



          {/* ── SETTINGS ── */}
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.glass}>
            {settingsItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  } else if (item.label === "Help & Support") {
                    setShowEnquiry(true);
                  } else if (item.label === "Edit Profile") {
                    Alert.alert("Edit Profile", "Profile editing feature will be available in the next build.");
                  }
                }}
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
          <TouchableOpacity onPress={() => setShowSignOut(true)} style={styles.signOutBtn}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={{ color: "#ef4444", fontSize: 14, fontWeight: "700" }}>Sign Out</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      <CustomSignOutModal
        visible={showSignOut}
        onCancel={() => setShowSignOut(false)}
        onConfirm={handleSignOut}
      />

      <ContactFormModal
        visible={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        pageName="home page"
      />
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

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 32, fontWeight: "800", color: "#0f172a" }}>Profile</Text>
        </View>

        {/* Vertically centered container for the Login / Register card */}
        <View style={{ flex: 1, justifyContent: "center", paddingBottom: 60 }}>
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
        </View>
      </View>
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
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
      android: {
        elevation: 0,
      }
    })
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
