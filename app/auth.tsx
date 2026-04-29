// app/auth.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { applyLoginResponse } from "../utils/authStore";
import { getApiErrorMessage, loginRequest, signupRequest } from "@/services/authApi";

type Tab = "login" | "signup";

export default function AuthScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [tab, setTab] = useState<Tab>(mode === "signup" ? "signup" : "login");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError]     = useState("");
  const [submitting, setSubmitting] = useState(false);

  const slideAnim = useRef(new Animated.Value(mode === "signup" ? 1 : 0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    setError("");
    if (tab === "login") {
      if (!email || !password) {
        setError("Please enter your email and password.");
        shake();
        return;
      }
      setSubmitting(true);
      try {
        const data = await loginRequest(email, password);
        await applyLoginResponse(data);
        router.replace("/(tabs)/profile" as any);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e));
        shake();
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!name || !phone || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      shake();
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      shake();
      return;
    }
    setSubmitting(true);
    try {
      const data = await signupRequest({
        fullName: name.trim(),
        phone: phone.trim(),
        email,
        password,
      });
      await applyLoginResponse(data);
      router.replace("/(tabs)/profile" as any);
    } catch (e: unknown) {
      setError(getApiErrorMessage(e));
      shake();
    } finally {
      setSubmitting(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    Animated.spring(slideAnim, {
      toValue: t === "login" ? 0 : 1,
      useNativeDriver: false,
      bounciness: 6,
    }).start();
  };

  const indicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["2%", "50%"],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      <StatusBar barStyle="dark-content" />

      {/* Decorative blobs */}
      <View pointerEvents="none" style={{
        position: "absolute", width: 280, height: 280,
        borderRadius: 140, backgroundColor: "rgba(99,102,241,0.15)",
        top: -80, left: -80,
      }} />
      <View pointerEvents="none" style={{
        position: "absolute", width: 220, height: 220,
        borderRadius: 110, backgroundColor: "rgba(216,155,56,0.12)",
        top: 60, right: -60,
      }} />
      <View pointerEvents="none" style={{
        position: "absolute", width: 200, height: 200,
        borderRadius: 100, backgroundColor: "rgba(236,72,153,0.08)",
        bottom: 60, left: -50,
      }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20, paddingVertical: 60 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute", top: 58, left: 20, zIndex: 10,
              width: 42, height: 42, borderRadius: 14,
              backgroundColor: "#fff",
              borderWidth: 1, borderColor: "#e2e8f0",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#1e293b" />
          </TouchableOpacity>

          {/* ── BRAND ── */}
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <View style={{
              width: 72, height: 72, borderRadius: 22,
              backgroundColor: "#4361EE",
              alignItems: "center", justifyContent: "center",
              shadowColor: "#4361EE", shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
              marginBottom: 14,
            }}>
              <Ionicons name="home" size={34} color="#fff" />
            </View>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#0f172a" }}>
              {tab === "login" ? "Welcome Back" : "Create Account"}
            </Text>
            <Text style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
              {tab === "login" ? "Sign in to your account" : "Join thousands of home seekers"}
            </Text>
          </View>

          {/* ── CARD ── */}
          <Animated.View style={{
            borderRadius: 28,
            backgroundColor: "#fff",
            borderWidth: 1, borderColor: "#f1f5f9",
            padding: 22,
            shadowColor: "#6366f1", shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.13, shadowRadius: 28, elevation: 6,
            transform: [{ translateX: shakeAnim }],
          }}>
            {/* ── TAB TOGGLE ── */}
            <View style={{
              backgroundColor: "#f1f5f9",
              borderRadius: 16, padding: 4,
              flexDirection: "row", marginBottom: 22,
              position: "relative",
            }}>
              <Animated.View style={{
                position: "absolute", top: 4, bottom: 4,
                left: indicatorLeft, width: "48%",
                backgroundColor: "#fff",
                borderRadius: 12,
                shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
              }} />
              {(["login", "signup"] as Tab[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => switchTab(t)}
                  style={{ flex: 1, paddingVertical: 10, alignItems: "center", zIndex: 1 }}
                >
                  <Text style={{
                    fontSize: 14, fontWeight: "700",
                    color: tab === t ? "#0f172a" : "#94a3b8",
                  }}>
                    {t === "login" ? "Sign In" : "Sign Up"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── FIELDS ── */}
            {tab === "signup" && (
              <>
                <Field
                  icon="person-outline"
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                <Field
                  icon="call-outline"
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </>
            )}

            <Field
              icon="mail-outline"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Field
              icon="lock-closed-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              rightIcon={showPass ? "eye-off-outline" : "eye-outline"}
              onRightPress={() => setShowPass(v => !v)}
            />

            {tab === "signup" && (
              <Field
                icon="lock-closed-outline"
                placeholder="Confirm Password"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
                rightIcon={showConfirm ? "eye-off-outline" : "eye-outline"}
                onRightPress={() => setShowConfirm(v => !v)}
              />
            )}

            {tab === "login" && (
              <TouchableOpacity
                onPress={() => router.push("/ForgetPassword")}
                style={{ alignSelf: "flex-end", marginBottom: 16, marginTop: -4 }}
                hitSlop={{ top: 8, bottom: 8 }}
              >
                <Text style={{ color: "#4361EE", fontSize: 13, fontWeight: "600" }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            {/* ── ERROR MESSAGE ── */}
            {!!error && (
              <View style={{
                backgroundColor: "#fef2f2", borderRadius: 12,
                borderWidth: 1, borderColor: "#fecaca",
                padding: 12, marginBottom: 14,
                flexDirection: "row", alignItems: "flex-start",
              }}>
                <Ionicons name="alert-circle" size={16} color="#ef4444" style={{ marginTop: 1, marginRight: 8 }} />
                <Text style={{ color: "#dc2626", fontSize: 13, flex: 1, lineHeight: 18 }}>{error}</Text>
              </View>
            )}

            {/* ── PRIMARY CTA ── */}
            <TouchableOpacity
              onPress={() => void handleSubmit()}
              disabled={submitting}
              activeOpacity={0.85}
              style={{
                backgroundColor: submitting ? "#94a3b8" : "#4361EE",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                shadowColor: "#4361EE", shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35, shadowRadius: 16, elevation: 6,
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 }}>
                  {tab === "login" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>

            {/* ── DIVIDER ── */}
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 18 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
              <Text style={{ color: "#94a3b8", fontSize: 12, marginHorizontal: 12, fontWeight: "500" }}>
                or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
            </View>

            {/* ── SOCIAL BUTTONS ── */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <SocialBtn icon="logo-google" label="Google" color="#DB4437" />
              <SocialBtn icon="logo-apple"  label="Apple"  color="#000000" />
            </View>
          </Animated.View>

          {/* ── FOOTER ── */}
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 22 }}>
            <Text style={{ color: "#64748b", fontSize: 14 }}>
              {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => switchTab(tab === "login" ? "signup" : "login")}>
              <Text style={{ color: "#4361EE", fontSize: 14, fontWeight: "700" }}>
                {tab === "login" ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ── Reusable input field ── */
function Field({
  icon, placeholder, value, onChangeText,
  secureTextEntry, keyboardType, rightIcon, onRightPress,
  autoCapitalize = "none",
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  rightIcon?: string;
  onRightPress?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      backgroundColor: "#f8fafc",
      borderRadius: 14, borderWidth: 1.5,
      borderColor: focused ? "#4361EE" : "#e2e8f0",
      paddingHorizontal: 14, marginBottom: 14,
    }}>
      <Ionicons
        name={icon as any}
        size={18}
        color={focused ? "#4361EE" : "#94a3b8"}
        style={{ marginRight: 10 }}
      />
      <TextInput
        style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: "#0f172a" }}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || "default"}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={rightIcon as any} size={18} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ── Social auth button ── */
function SocialBtn({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <TouchableOpacity style={{
      flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
      gap: 8, paddingVertical: 13,
      backgroundColor: "#fff",
      borderRadius: 14, borderWidth: 1.5, borderColor: "#e2e8f0",
    }}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#1e293b" }}>{label}</Text>
    </TouchableOpacity>
  );
}
