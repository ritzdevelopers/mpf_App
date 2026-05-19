import React from "react";
import { ScrollView, View, Text, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import BackHeader from "@/components/layout/BackHeader";

interface PolicySectionProps {
  icon: keyof typeof Ionicons.nameMap;
  title: string;
  body: string;
}

function PolicySection({ icon, title, body }: PolicySectionProps) {
  return (
    <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4">
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 items-center justify-center">
          <Ionicons name={icon} size={20} color="#4361ee" />
        </View>
        <Text className="text-base font-extrabold text-slate-800 ml-3">{title}</Text>
      </View>
      <Text className="text-xs text-slate-500 leading-5 font-semibold">
        {body}
      </Text>
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

        {/* Content list */}
        <PolicySection
          icon="eye"
          title="Data Collection & Hashing"
          body="We collect basic registration parameters, search queries, and recently viewed indices purely to customize your personal feed. All profile passwords and sensitive preferences undergo high-security cryptographic hashing prior to database storage."
        />

        <PolicySection
          icon="lock-closed"
          title="FCM Token & Notifications"
          body="Your unique Firebase Cloud Messaging (FCM) push tokens are stored within encrypted partitions in our secure cloud cluster. These keys are used strictly to notify you about matching listings, price appreciation trends, and live reminders."
        />

        <PolicySection
          icon="cloud-done"
          title="Cloud APIs Compliance"
          body="Integration handshakes with the Location Intelligence API and Supabase database endpoints utilize standard TLS 1.3 transport-layer encryption. This ensures third-party intelligence queries remain anonymous and completely safe."
        />

        <PolicySection
          icon="trash-bin"
          title="Your Control & Erasure"
          body="You hold complete authority over your credentials. You can opt out of dynamic alerts at any point, reset analytical caches, or request complete account deletion directly by contacting our Help and Support department."
        />

        {/* Footer */}
        <View className="items-center mt-4 mb-12">
          <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Last Updated: May 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
