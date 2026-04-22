// components/navbar/index.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Navbar({ onMenuPress }: { onMenuPress?: () => void }) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-14 pb-3 bg-white border-b border-slate-100">
      {/* Menu */}
      <TouchableOpacity
        onPress={onMenuPress}
        className="h-10 w-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-200"
      >
        <Ionicons name="menu" size={22} color="#334155" />
      </TouchableOpacity>

      {/* Brand */}
      <View className="items-center">
        <Text className="text-lg font-extrabold tracking-tight text-slate-900">
          MyProperty<Text className="text-[#d89b38]">Fact</Text>
        </Text>
        <Text className="text-[10px] text-slate-400 tracking-widest uppercase">
          Find Your Dream Home
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity className="h-10 w-10 rounded-xl bg-slate-50 items-center justify-center border border-slate-200">
          <Ionicons name="notifications-outline" size={20} color="#334155" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
