import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import Navbar from "@/components/layout/navbar";
import Header from "@/components/layout/Header";
import SidebarMenu from "@/components/layout/SidebarMenu";
import CategoryCarousel from "@/components/home/CategoryCaraousel";
import SimilarProperties from "@/components/home/SimilarProperties";
import PropertyTypes from "@/components/home/PropertyTypes";
import PropertyChoice from "@/components/home/PropertyChoice";
import PopularTools from "@/components/home/PopularTools";
import PropertyDetail from "@/components/property/PropertyDetail";
const styles = {
  container: "flex-1 bg-slate-50",
};

export default function HomeScreen() {
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1">
      
      <ScrollView
        className={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Navbar onMenuPress={() => setOpen(true)} />
        <CategoryCarousel />
        <Header />
    
        <SimilarProperties />
        <PropertyTypes />
        <PropertyChoice />
        <PopularTools />
       
      </ScrollView>

      <SidebarMenu
        visible={open}
        onClose={() => setOpen(false)}
      />

    </View>
  );
}