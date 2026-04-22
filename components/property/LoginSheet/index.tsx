// components/LoginSheet/index.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { setUser } from "@/utils/authStore";

const DUMMY_EMAIL    = "test@realestate.com";
const DUMMY_PASSWORD = "Test@123";

const { height: SCREEN_H } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
};

export default function LoginSheet({
  visible,
  onClose,
  onSuccess,
  title = "Login to continue",
  subtitle = "Enter your email to book a site visit",
}: Props) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [focus, setFocus]       = useState<"email" | "password" | null>(null);

  const slide = useRef(new Animated.Value(SCREEN_H)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slide, { toValue: SCREEN_H, duration: 220, useNativeDriver: true }),
      ]).start();
      setError("");
    }
  }, [visible]);

  const submit = () => {
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (
      email.toLowerCase().trim() !== DUMMY_EMAIL ||
      password !== DUMMY_PASSWORD
    ) {
      setError("Invalid email or password.");
      return;
    }
    setUser({
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: email.toLowerCase().trim(),
    });
    setEmail("");
    setPassword("");
    onClose();
    onSuccess?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(15,23,42,0.55)",
          opacity: fade,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <Animated.View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 22,
            paddingTop: 10,
            paddingBottom: 32,
            transform: [{ translateY: slide }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 18,
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: "center", marginBottom: 14 }}>
            <View style={{
              width: 42, height: 4, borderRadius: 4,
              backgroundColor: "#e2e8f0",
            }} />
          </View>

          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 18 }}>
            <View style={{
              width: 44, height: 44, borderRadius: 14,
              backgroundColor: "rgba(67,97,238,0.1)",
              alignItems: "center", justifyContent: "center",
              marginRight: 12,
            }}>
              <Ionicons name="lock-closed" size={20} color="#4361EE" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a" }}>
                {title}
              </Text>
              <Text style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>
                {subtitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: "#f1f5f9",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Email Field */}
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#4361EE", marginBottom: 6, marginLeft: 2 }}>
            EMAIL
          </Text>
          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: "#f8fafc",
            borderRadius: 14, borderWidth: 1.5,
            borderColor: focus === "email" ? "#4361EE" : "#e2e8f0",
            paddingHorizontal: 14, marginBottom: 14,
          }}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={focus === "email" ? "#4361EE" : "#94a3b8"}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: "#0f172a" }}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocus("email")}
              onBlur={() => setFocus(null)}
            />
          </View>

          {/* Password Field */}
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#4361EE", marginBottom: 6, marginLeft: 2 }}>
            PASSWORD
          </Text>
          <View style={{
            flexDirection: "row", alignItems: "center",
            backgroundColor: "#f8fafc",
            borderRadius: 14, borderWidth: 1.5,
            borderColor: focus === "password" ? "#4361EE" : "#e2e8f0",
            paddingHorizontal: 14, marginBottom: 12,
          }}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={focus === "password" ? "#4361EE" : "#94a3b8"}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: "#0f172a" }}
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocus("password")}
              onBlur={() => setFocus(null)}
            />
            <TouchableOpacity
              onPress={() => setShowPass((v) => !v)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPass ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#94a3b8"
              />
            </TouchableOpacity>
          </View>

          {/* Error */}
          {!!error && (
            <View style={{
              flexDirection: "row", alignItems: "flex-start",
              backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca",
              borderRadius: 12, padding: 10, marginBottom: 12,
            }}>
              <Ionicons name="alert-circle" size={14} color="#ef4444" style={{ marginTop: 1, marginRight: 6 }} />
              <Text style={{ color: "#dc2626", fontSize: 12, flex: 1 }}>{error}</Text>
            </View>
          )}

          {/* Continue */}
          <TouchableOpacity
            onPress={submit}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#4361EE",
              borderRadius: 16, paddingVertical: 15,
              alignItems: "center", marginTop: 4,
              shadowColor: "#4361EE",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: 0.3 }}>
              Continue
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, marginBottom: 14 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
            <Text style={{ color: "#94a3b8", fontSize: 11, marginHorizontal: 10, fontWeight: "600" }}>
              NEW HERE?
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
          </View>

          {/* Create Account */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              setTimeout(() => router.push({ pathname: "/auth", params: { mode: "signup" } } as any), 220);
            }}
            activeOpacity={0.85}
            style={{
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              paddingVertical: 14, borderRadius: 16,
              borderWidth: 1.5, borderColor: "#4361EE",
              backgroundColor: "rgba(67,97,238,0.06)",
            }}
          >
            <Ionicons name="person-add-outline" size={18} color="#4361EE" style={{ marginRight: 8 }} />
            <Text style={{ color: "#4361EE", fontSize: 14, fontWeight: "700" }}>
              Create New Account
            </Text>
          </TouchableOpacity>

          {/* Demo hint */}
          <View style={{
            marginTop: 14, padding: 10, borderRadius: 12,
            backgroundColor: "rgba(67,97,238,0.08)",
            borderWidth: 1, borderColor: "rgba(67,97,238,0.15)",
          }}>
            <Text style={{ color: "#4361EE", fontSize: 10, fontWeight: "700", marginBottom: 3, letterSpacing: 0.5 }}>
              DEMO CREDENTIALS
            </Text>
            <Text style={{ color: "#1e293b", fontSize: 11 }}>
              test@realestate.com · Test@123
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
