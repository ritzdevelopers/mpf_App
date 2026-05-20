import { forgotPasswordRequest, getApiErrorMessage } from "@/services/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Please enter your email address.");
      shake();
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!emailOk) {
      setError("Please enter a valid email address.");
      shake();
      return;
    }

    setSubmitting(true);
    try {
      await forgotPasswordRequest(trimmed);
      setSuccess(true);
    } catch (e: unknown) {
      setError(getApiErrorMessage(e));
      shake();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      <StatusBar barStyle="dark-content" />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: "rgba(99,102,241,0.15)",
          top: -80,
          left: -80,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 60,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 58,
              left: 20,
              zIndex: 10,
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#e2e8f0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#1e293b" />
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: "#d89b38",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                shadowColor: "#d89b38",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Ionicons name="key-outline" size={34} color="#fff" />
            </View>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#0f172a" }}>
              Forgot password?
            </Text>
            <Text style={{ fontSize: 14, color: "#64748b", marginTop: 6, textAlign: "center" }}>
              Enter your email and we&apos;ll send you a reset link if an account exists.
            </Text>
          </View>

          <Animated.View
            style={{
              borderRadius: 28,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#f1f5f9",
              padding: 22,
              shadowColor: "#d89b38",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.13,
              shadowRadius: 28,
              elevation: 6,
              transform: [{ translateX: shakeAnim }],
            }}
          >
            {success ? (
              <View
                style={{
                  backgroundColor: "#f0fdf4",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#bbf7d0",
                  padding: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                  <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
                  <Text style={{ color: "#166534", fontSize: 14, flex: 1, lineHeight: 20 }}>
                    If account exists, reset link sent to your email.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.replace("/auth")}
                  activeOpacity={0.85}
                  style={{
                    marginTop: 18,
                    backgroundColor: "#d89b38",
                    borderRadius: 14,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#d89b38", marginBottom: 8 }}>
                  EMAIL
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#f8fafc",
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: "#e2e8f0",
                    paddingHorizontal: 14,
                    marginBottom: 14,
                  }}
                >
                  <Ionicons name="mail-outline" size={18} color="#94a3b8" style={{ marginRight: 10 }} />
                  <TextInput
                    style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: "#0f172a" }}
                    placeholder="you@example.com"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!submitting}
                  />
                </View>

                {!!error && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      backgroundColor: "#fef2f2",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#fecaca",
                      padding: 12,
                      marginBottom: 14,
                    }}
                  >
                    <Ionicons name="alert-circle" size={16} color="#ef4444" style={{ marginTop: 1, marginRight: 8 }} />
                    <Text style={{ color: "#dc2626", fontSize: 13, flex: 1 }}>{error}</Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => void handleSubmit()}
                  disabled={submitting}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: submitting ? "#94a3b8" : "#d89b38",
                    borderRadius: 16,
                    paddingVertical: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>Submit</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
