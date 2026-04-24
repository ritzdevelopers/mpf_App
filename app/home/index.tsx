import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import CategoryCarousel from "@/components/home/CategoryCaraousel";
import CityProperty from "@/components/home/CityProperty";
import NewLaunches from "@/components/home/NewLaunches";
import PopularTools from "@/components/home/PopularTools";
import PropertyChoice from "@/components/home/PropertyChoice";
import PropertyTypes from "@/components/home/PropertyTypes";
import SimilarProperties from "@/components/home/SimilarProperties";
import TopPickCard from "@/components/home/TopPickCard";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/navbar";
import SidebarMenu from "@/components/layout/SidebarMenu";
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
        <TopPickCard/>
        <PopularTools />
        <NewLaunches />
        <CityProperty/>
      </ScrollView>

      <SidebarMenu
        visible={open}
        onClose={() => setOpen(false)}
      />

    </View>
  );
}