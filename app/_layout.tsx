import NotificationSetup from '@/components/common/NotificationSetup';
import { fetchProjects, prefetchProjectImages } from '@/utils/api';
import { hydrateSession } from '@/utils/authStore';
import { hydrateFavorites } from '@/utils/favoritesStore';
import { hydrateRecentViews } from '@/utils/recentViewsStore';
import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Text, View } from 'react-native';
import 'react-native-reanimated';
import { enableFreeze } from 'react-native-screens';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import '../global.css';


// Disable react-native-screens' freeze-on-blur optimization globally.
// On the new architecture it can leave a tab screen stuck with display:none
// after rapid tab switches, which renders as a blank white screen. We prefer
// the small memory cost over the blank-screen bug.
enableFreeze(false);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const MIN_SPLASH_MS = 2000;
const { width } = Dimensions.get('window');
const TRACK_WIDTH = width * 0.38;

function SplashOverlay() {
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500, useNativeDriver: true,
    }).start();
    Animated.timing(loadingAnim, {
      toValue: 1, duration: MIN_SPLASH_MS - 200, delay: 200, useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_WIDTH],
  });

  return (
    <Animated.View
      style={{ opacity: fadeAnim, flex: 1, backgroundColor: '#f8fafc',
               alignItems: 'center', justifyContent: 'space-between', paddingVertical: 64 }}
    >
      {/* Center card */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{
          width: width * 0.62, backgroundColor: '#FFFFFF', borderRadius: 28,
          alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24,
          shadowColor: '#0f172a', shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.1, shadowRadius: 28, elevation: 12,
        }}>
          <View style={{
            width: 72, height: 72, borderRadius: 20, backgroundColor: '#0f172a',
            alignItems: 'center', justifyContent: 'center', marginBottom: 18,
            shadowColor: '#0f172a', shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
          }}>
            <Image source={require('../assets/images/icon.png')} style={{ width: 44, height: 44, resizeMode: 'contain', borderRadius: 10 }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 }}>
            <Text style={{ fontSize: 28, fontWeight: '300', color: '#d89b38', letterSpacing: 0.5 }}>Real</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', letterSpacing: 0.5 }}>Estate</Text>
          </View>

          <Text style={{ fontSize: 10, fontWeight: '600', color: '#64748b',
                         letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center' }}>
            Find Your Dream Home
          </Text>
        </View>
      </View>

      {/* Loading bar + footer */}
      <View style={{ alignItems: 'center', gap: 10 }}>
        <View style={{ width: TRACK_WIDTH, height: 3, backgroundColor: '#e2e8f0',
                       borderRadius: 99, overflow: 'hidden' }}>
          <Animated.View style={{ height: '100%', backgroundColor: '#d89b38',
                                  borderRadius: 99, width: barWidth }} />
        </View>
        <Text style={{ fontSize: 10, fontWeight: '600', color: '#64748b',
                       letterSpacing: 2.5, textTransform: 'uppercase' }}>
          Loading...
        </Text>
        <Text style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 0.3 }}>
          © 2025 RealEstate Inc. All rights reserved.
        </Text>
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Print device details, timezone, country, and network type in the terminal immediately on startup
    const logTelemetry = async () => {
      let networkType = 'Unknown';
      try {
        const netState = await Network.getNetworkStateAsync();
        networkType = netState.type || 'Unknown';
      } catch (err) {}

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
      const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-IN';
      const country = locale.split('-')[1]?.toUpperCase() || 'IN';

      console.log("=========================================");
      console.log("📱 DEVICE DETAILS DETECTED ON STARTUP:");
      console.log("👉 Device Name:  ", Device.deviceName);
      console.log("👉 Brand:        ", Device.brand);
      console.log("👉 Model Name:   ", Device.modelName);
      console.log("👉 OS Name:      ", Device.osName);
      console.log("👉 OS Version:   ", Device.osVersion);
      console.log("👉 Timezone:     ", timezone);
      console.log("👉 Country Code: ", country);
      console.log("👉 Network Type: ", networkType);
      console.log("👉 Device Type:  ", Device.deviceType);
      console.log("👉 Is Device?:   ", Device.isDevice);
      console.log("=========================================");
    };

    logTelemetry();

    const minWait  = new Promise<void>((res) => setTimeout(res, MIN_SPLASH_MS));
    const apiFetch = fetchProjects()
      .then((projects) => {
        prefetchProjectImages(projects);
      })
      .catch(() => null);
    const session = hydrateSession().catch(() => null);
    const favorites = hydrateFavorites().catch(() => null);
    const recentViews = hydrateRecentViews().catch(() => null);

    Promise.all([minWait, apiFetch, session, favorites, recentViews]).then(() => {
      setSplashDone(true);
    });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    // This is called when the first layout of the custom splash screen is complete.
    // Hiding the native splash here prevents the "black screen" flicker.
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    // Set the root view background color natively to match our splash theme.
    // This provides a fallback if there's any gap between screens.
    SystemUI.setBackgroundColorAsync('#f8fafc');
  }, []);

  if (!splashDone) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SplashOverlay />
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <NotificationSetup />
      <Stack>

        <Stack.Screen name="(tabs)"              options={{ headerShown: false }} />
        <Stack.Screen name="popular_tools"       options={{ headerShown: false }} />
        <Stack.Screen name="listings/index"      options={{ headerShown: false }} />
        <Stack.Screen name="propertyDetail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPassword/index" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="latest_reminders/index" options={{ headerShown: false }} />
        <Stack.Screen name= "AllCities/index"    options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" translucent />
    </ThemeProvider>
  );
}
