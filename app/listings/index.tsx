// app/listings/index.tsx

import React from "react";
import { View } from "react-native";
import ListingsPage from "@/components/ListingPage";

export default function ListingsScreen() {
  return (
    <View className="flex-1 bg-white">
      <ListingsPage />
    </View>
  );
}
