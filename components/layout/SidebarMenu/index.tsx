// components/SidebarMenu/index.tsx

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./sidebarUI";

const { width } = Dimensions.get("window");

export default function SidebarMenu({
  visible,
  onClose,
}: any) {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -width,
      duration: visible ? 300 : 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const menuData = [
    {
      title: "Home",
      icon: "home-outline",
      route: "/(tabs)",
    },
    {
      title: "Buy Property",
      icon: "business-outline",
      route: "/listings",
    },
    {
      title: "Popular Tools",
      icon: "calculator-outline",
      route: "/popular_tools",
    },
    {
      title: "Shortlist",
      icon: "heart-outline",
      route: "/(tabs)/saved",
    },
    {
      title: "Profile",
      icon: "person-outline",
      route: "/(tabs)/profile",
    },
  ];

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className={styles.overlay}>
        
        {/* Background Overlay */}
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sidebar */}
        <Animated.View
          className={styles.sidebar}
          style={{
            transform: [{ translateX: slideAnim }],
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* Top Profile Section */}
            <View className={styles.topBox}>
              <View className={styles.avatar}>
                <Text className={styles.avatarText}>S</Text>
              </View>

              <Text className={styles.name}>
                Simranpreet Singh
              </Text>

              <Text className={styles.email}>
                algoknightcode@gmail.com
              </Text>
            </View>

            {/* Menu Items */}
            {menuData.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={styles.menuItem}
                onPress={() => {
                  router.push(item.route as any);
                  onClose();
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color="#1e293b"
                />

                <Text className={styles.menuText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Close Button */}
            <TouchableOpacity
              className={styles.closeBtn}
              onPress={onClose}
            >
              <Text className={styles.closeText}>
                Close Menu
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}