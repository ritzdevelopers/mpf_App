import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LatestReminders() {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push("/latest_reminders" as any)}
      className="h-10 w-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-200"
    >
      <Ionicons name="notifications-outline" size={20} color="#334155" />
    </TouchableOpacity>
  );
}
