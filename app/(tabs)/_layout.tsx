import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { ComponentProps } from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function AnimatedTabIcon({ name, color, size, focused }: { name: ComponentProps<typeof IconSymbol>['name']; color: string; size: number; focused: boolean }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <IconSymbol size={size} name={name} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#d89b38",
        tabBarInactiveTintColor: "#8e8e8e",
        animation: 'fade',

        tabBarStyle: {
          height: 74,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#eeeeee",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon size={26} name="house.fill" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="sell"
        options={{
          title: "Sell/Rent",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon size={28} name="plus.circle" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Shortlist",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon size={26} name="heart" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon size={26} name="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}