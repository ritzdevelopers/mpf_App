/** Deep link: myapp://reset-password?token=JWT (scheme from app.json) */
import { getApiErrorMessage, resetPasswordRequest } from "@/services/authApi";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    setError("");
    const jwt = typeof token === "string" ? token.trim() : "";
    if (!jwt) {
      setError("Invalid or missing reset link. Please request a new email.");
      shake();
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError("Password must be 8–128 characters.");
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
      await resetPasswordRequest(jwt, password);
      router.replace("/auth");
    } catch (e: unknown) {
      setError(getApiErrorMessage(e));
      shake();
    } finally {
      setSubmitting(false);
    }
  };

  const missingToken = typeof token !== "string" || !token.trim();

  return (
    <View style={{ flex: 1, backgroundColor: "#eef2ff" }}>
      <StatusBar barStyle="dark-content" />

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
                backgroundColor: "#4361EE",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons name="lock-closed-outline" size={34} color="#fff" />
            </View>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#0f172a" }}>Reset password</Text>
            <Text style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Choose a strong new password</Text>
          </View>

          <Animated.View
            style={{
              borderRadius: 28,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#f1f5f9",
              padding: 22,
              transform: [{ translateX: shakeAnim }],
            }}
          >
            {missingToken && (
              <View
                style={{
                  backgroundColor: "#fef2f2",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: "#fecaca",
                }}
              >
                <Text style={{ color: "#b91c1c", fontSize: 13 }}>
                  Open this screen from the link in your email so the reset token is included.
                </Text>
              </View>
            )}

            <PwField
              placeholder="New password"
              value={password}
              onChangeText={setPassword}
              reveal={showPass}
              toggleReveal={() => setShowPass((v) => !v)}
            />
            <PwField
              placeholder="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              reveal={showConfirm}
              toggleReveal={() => setShowConfirm((v) => !v)}
            />

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
              disabled={submitting || missingToken}
              activeOpacity={0.85}
              style={{
                backgroundColor: submitting || missingToken ? "#94a3b8" : "#4361EE",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>Submit</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function PwField({
  placeholder,
  value,
  onChangeText,
  reveal,
  toggleReveal,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  reveal: boolean;
  toggleReveal: () => void;
}) {
  return (
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
      <TextInput
        style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: "#0f172a" }}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!reveal}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity onPress={toggleReveal} hitSlop={{ top: 10, bottom: 10 }}>
        <Ionicons name={reveal ? "eye-off-outline" : "eye-outline"} size={18} color="#94a3b8" />
      </TouchableOpacity>
    </View>
  );
}
