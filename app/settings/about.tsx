import React from "react";
import { ScrollView, View, Text, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import BackHeader from "@/components/layout/BackHeader";

interface InfoCardProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
}

function InfoCard({ icon, title, body }: InfoCardProps) {
  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4">
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 items-center justify-center">
          <Ionicons name={icon} size={20} color="#d89b38" />
        </View>
        <Text className="text-base font-extrabold text-slate-800 ml-3">{title}</Text>
      </View>
      <Text className="text-xs text-slate-500 leading-5 font-semibold">
        {body}
      </Text>
    </View>
  );
}

export default function AboutAppSettingsPage() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <BackHeader />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 pt-4">
        {/* Branding Hero */}
        <View className="items-center mb-6 pt-2">
          <View className="w-16 h-16 rounded-[22px] bg-amber-50 items-center justify-center border border-amber-100 mb-3">
            <Ionicons name="business" size={32} color="#d89b38" />
          </View>
          <Text className="text-2xl font-black text-slate-900">MyPropertyFact</Text>
          <Text className="text-xs text-slate-400 font-extrabold mt-1 tracking-wider uppercase">
            Version 1.0.0 (Production Build)
          </Text>
        </View>

        {/* Info Cards List */}
        <InfoCard
          icon="rocket"
          title="Our Mission"
          body="MyPropertyFact was established to make luxury property exploration in the National Capital Region (NCR) entirely effortless. We replace real estate assumptions with verified facts, rich listings, and live analytics."
        />

        <InfoCard
          icon="sparkles"
          title="Premium Intelligence"
          body="Features live integration with our advanced Location Intelligence API. It lets you analyze local economics, public connectivity, amenities status, and real estate appreciation indexes dynamically before committing."
        />

        <InfoCard
          icon="construct"
          title="System Architecture"
          body="Engineered natively using Expo SDK and React Native. The backend connects directly to secure Supabase databases, automated FCM push notification microservices, and live property feed pipelines."
        />

        <InfoCard
          icon="ribbon"
          title="Credits & Licensing"
          body="All listings, metadata, locality scores, and architectural specifications are copyright © 2026 Ritz Developers & MyPropertyFact. All rights reserved."
        />

        {/* Footer */}
        <View className="items-center mt-4 mb-12">
          <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Powered by Ritz Developers
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
