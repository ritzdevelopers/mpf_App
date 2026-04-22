// app/(tabs)/sell.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const propertyTypes = ["Apartment", "Villa", "Plot", "Commercial", "Studio"];
const bhkOptions = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
const listingTypes = ["Sale", "Rent", "PG/Co-living"];

export default function SellScreen() {
  const [selectedType, setSelectedType] = useState("Apartment");
  const [selectedBHK, setSelectedBHK] = useState("2 BHK");
  const [selectedListing, setSelectedListing] = useState("Sale");

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <View className="bg-slate-900 pt-16 pb-8 px-5 rounded-b-[36px]">
        <Text className="text-white text-2xl font-extrabold">
          Post Your Property
        </Text>
        <Text className="text-slate-400 text-sm mt-1">
          Reach 10L+ buyers & tenants for free
        </Text>

        {/* Stats Row */}
        <View className="flex-row mt-5 gap-3">
          {[
            { label: "Active Buyers", value: "10L+" },
            { label: "Listings Live", value: "48K+" },
            { label: "Cities", value: "50+" },
          ].map((s, i) => (
            <View key={i} className="flex-1 bg-white/10 rounded-2xl py-3 items-center">
              <Text className="text-white text-lg font-bold">{s.value}</Text>
              <Text className="text-slate-400 text-[10px] mt-0.5">{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="px-4 mt-5">
        {/* Listing Type */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
          <Text className="text-sm font-bold text-slate-700 mb-3">Listing Type</Text>
          <View className="flex-row gap-2">
            {listingTypes.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedListing(t)}
                className={`flex-1 py-2.5 rounded-xl items-center border ${
                  selectedListing === t
                    ? "bg-[#d89b38] border-[#d89b38]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text className={`text-xs font-bold ${selectedListing === t ? "text-white" : "text-slate-600"}`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Property Type */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
          <Text className="text-sm font-bold text-slate-700 mb-3">Property Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {propertyTypes.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedType(t)}
                className={`px-4 py-2 rounded-full border ${
                  selectedType === t
                    ? "bg-slate-900 border-slate-900"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text className={`text-xs font-semibold ${selectedType === t ? "text-white" : "text-slate-600"}`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* BHK */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
          <Text className="text-sm font-bold text-slate-700 mb-3">BHK Configuration</Text>
          <View className="flex-row flex-wrap gap-2">
            {bhkOptions.map((b) => (
              <TouchableOpacity
                key={b}
                onPress={() => setSelectedBHK(b)}
                className={`px-4 py-2 rounded-xl border ${
                  selectedBHK === b
                    ? "bg-blue-600 border-blue-600"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text className={`text-xs font-semibold ${selectedBHK === b ? "text-white" : "text-slate-600"}`}>
                  {b}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
          <Text className="text-sm font-bold text-slate-700 mb-3">Property Details</Text>

          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 mb-3">
            <Ionicons name="location-outline" size={18} color="#94a3b8" />
            <TextInput
              placeholder="Society / Project Name"
              placeholderTextColor="#94a3b8"
              className="flex-1 py-3 ml-2 text-sm text-slate-800"
            />
          </View>

          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 mb-3">
            <Ionicons name="map-outline" size={18} color="#94a3b8" />
            <TextInput
              placeholder="City / Locality"
              placeholderTextColor="#94a3b8"
              className="flex-1 py-3 ml-2 text-sm text-slate-800"
            />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3">
              <Ionicons name="resize-outline" size={18} color="#94a3b8" />
              <TextInput
                placeholder="Area (sq.ft)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                className="flex-1 py-3 ml-2 text-sm text-slate-800"
              />
            </View>
            <View className="flex-1 flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3">
              <Ionicons name="cash-outline" size={18} color="#94a3b8" />
              <TextInput
                placeholder="Price (₹)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                className="flex-1 py-3 ml-2 text-sm text-slate-800"
              />
            </View>
          </View>
        </View>

        {/* Upload Photos */}
        <TouchableOpacity className="bg-white rounded-2xl p-4 border border-dashed border-slate-300 mb-4 items-center justify-center">
          <View className="h-12 w-12 rounded-2xl bg-slate-100 items-center justify-center mb-2">
            <Ionicons name="camera-outline" size={24} color="#64748b" />
          </View>
          <Text className="text-sm font-bold text-slate-700">Upload Photos</Text>
          <Text className="text-xs text-slate-400 mt-1">Tap to add up to 10 photos</Text>
        </TouchableOpacity>

        {/* Contact */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-4">
          <Text className="text-sm font-bold text-slate-700 mb-3">Contact Details</Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 mb-3">
            <Ionicons name="person-outline" size={18} color="#94a3b8" />
            <TextInput
              placeholder="Your Full Name"
              placeholderTextColor="#94a3b8"
              className="flex-1 py-3 ml-2 text-sm text-slate-800"
            />
          </View>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3">
            <Ionicons name="call-outline" size={18} color="#94a3b8" />
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              className="flex-1 py-3 ml-2 text-sm text-slate-800"
            />
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity className="bg-[#d89b38] rounded-2xl py-4 items-center mb-3 flex-row justify-center gap-2">
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text className="text-white text-base font-bold">Post Property for FREE</Text>
        </TouchableOpacity>

        <Text className="text-center text-xs text-slate-400 mb-10">
          By posting, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
}
