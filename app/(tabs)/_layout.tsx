import { HapticTab } from '@/components/common/haptic-tab';
import { IconSymbol } from '@/components/common/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import React, { useRef } from 'react';
import { Animated } from 'react-native';

function AnimatedTabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: ComponentProps<typeof IconSymbol>['name'];
  color: string;
  size: number;
  focused: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1.2 : 1)).current;
  const prevFocused = useRef(focused);

  React.useEffect(() => {
    if (prevFocused.current === focused) return;

    prevFocused.current = focused;

    const anim = Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    });

    anim.start();

    return () => anim.stop();
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
        // Keep transitions off: on new arch + react-native-screens the tab
        // fade/shift animation races with screen freeze/unfreeze and sometimes
        // leaves the target screen blank after ~5 rapid switches.
        animation: 'none',
        // Mount every tab on first render instead of lazily on focus — removes
        // the second failure mode where a freshly-focused lazy tab never
        // finishes attaching when the animation is interrupted.
        lazy: false,
        // Belt-and-suspenders with enableFreeze(false) in app/_layout.tsx.
        freezeOnBlur: false,

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