// components/Header/index.tsx

import React from "react";
import { View, Text, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from './hederUi';

export default function Header() {
  return (
    <View className={styles.container}>
      
      {/* Banner Section */}
      <View className={styles.banner}>
         <Image

          source={require("@/assets/images/mpf_generic_banner_tab.jpg")}

          style={{ width: "100%", height: "100%" }}

          resizeMode="cover"

        />
       

        {/* Text Overlay */}
        <View className={styles.overlay}>
          <Text className={styles.heading}>ISHVARA</Text>

          <Text className={styles.subHeading}>
            FOUR-SIDE OPEN LIVING
          </Text>
        </View>
      </View>

      {/* Search Box */}
      <View className={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#9ca3af" />

        <TextInput
          placeholder='Search "3 BHK in 80L - 1.5Cr in Sector 150"'
          placeholderTextColor="#9ca3af"
          className={styles.input}
        />
      </View>

    </View>
  );
}