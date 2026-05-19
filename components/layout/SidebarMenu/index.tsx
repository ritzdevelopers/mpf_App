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

import { useUser } from "@/utils/authStore";

const { width } = Dimensions.get("window");

export default function SidebarMenu({
  visible,
  onClose,
}: any) {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const user = useUser();

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

  const userInitial = user
    ? (user.name || user.email || "U").trim().charAt(0).toUpperCase()
    : "G";

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
            <View className="pb-6 border-b border-slate-200 flex-row items-center">
              <View className={styles.avatar}>
                <Text className={styles.avatarText}>{userInitial}</Text>
              </View>

              <View className="ml-4 flex-1 justify-center">
                <Text className="text-lg font-extrabold text-slate-900" numberOfLines={1}>
                  {user ? user.name : "Guest User"}
                </Text>

                <Text className="text-xs text-slate-500 mt-1" numberOfLines={1}>
                  {user ? user.email : "Log in to save properties"}
                </Text>
              </View>
            </View>

            {/* Menu Items */}
            {menuData.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={styles.menuItem}
                onPress={() => {
                  onClose();
                  requestAnimationFrame(() => {
                    router.navigate(item.route as any);
                  });
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