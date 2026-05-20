import React from "react";
import { ScrollView, View, Text, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import BackHeader from "@/components/layout/BackHeader";

interface PolicyPointProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
  showDivider?: boolean;
}

function PolicyPoint({ icon, title, body, showDivider = true }: PolicyPointProps) {
  return (
    <View>
      <View className="flex-row items-center mb-2.5">
        <View className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 items-center justify-center">
          <Ionicons name={icon} size={18} color="#4361ee" />
        </View>
        <Text className="text-base font-extrabold text-slate-800 ml-3">{title}</Text>
      </View>
      <Text className="text-xs text-slate-500 leading-5 font-semibold pl-12 pr-1">
        {body}
      </Text>
      {showDivider && <View className="h-[1px] bg-slate-100 my-5" />}
    </View>
  );
}

export default function PrivacySettingsPage() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <BackHeader />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 pt-4">
        {/* Title Block */}
        <View className="items-center mb-6 pt-2">
          <View className="w-16 h-16 rounded-[22px] bg-indigo-50 items-center justify-center border border-indigo-100 mb-3">
            <Ionicons name="shield-checkmark" size={32} color="#4361ee" />
          </View>
          <Text className="text-2xl font-black text-slate-900">Privacy & Security</Text>
          <Text className="text-xs text-slate-400 font-bold mt-1 tracking-wider uppercase">
            Data Protections & Protocols
          </Text>
        </View>

        {/* Unified big container box */}
        <View className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-8 mx-0.5">
          <PolicyPoint
            icon="eye"
            title="Data Collection & Hashing"
            body="We collect basic registration parameters, search queries, and recently viewed indices purely to customize your personal feed. All profile passwords and sensitive preferences undergo high-security cryptographic hashing prior to database storage."
          />

          <PolicyPoint
            icon="lock-closed"
            title="FCM Token & Notifications"
            body="Your unique Firebase Cloud Messaging (FCM) push tokens are stored within encrypted partitions in our secure cloud cluster. These keys are used strictly to notify you about matching listings, price appreciation trends, and live reminders."
          />

          <PolicyPoint
            icon="cloud-done"
            title="Cloud APIs Compliance"
            body="Integration handshakes with the Location Intelligence API and Supabase database endpoints utilize standard TLS 1.3 transport-layer encryption. This ensures third-party intelligence queries remain anonymous and completely safe."
          />

          <PolicyPoint
            icon="trash-bin"
            title="Your Control & Erasure"
            body="You hold complete authority over your credentials. You can opt out of dynamic alerts at any point, reset analytical caches, or request complete account deletion directly by contacting our Help and Support department."
            showDivider={false}
          />
        </View>

        {/* Footer */}
        <View className="items-center mb-12">
          <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Last Updated: May 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
