import { fetchProjects, prefetchProjectImages } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import 'react-native-reanimated';
import { enableFreeze } from 'react-native-screens';
import '../global.css';

// Disable react-native-screens' freeze-on-blur optimization globally.
// On the new architecture it can leave a tab screen stuck with display:none
// after rapid tab switches, which renders as a blank white screen. We prefer
// the small memory cost over the blank-screen bug.
enableFreeze(false);

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
      style={{ opacity: fadeAnim, flex: 1, backgroundColor: '#EEF2FF',
               alignItems: 'center', justifyContent: 'space-between', paddingVertical: 64 }}
    >
      {/* Center card */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{
          width: width * 0.62, backgroundColor: '#FFFFFF', borderRadius: 28,
          alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24,
          shadowColor: '#4361EE', shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.13, shadowRadius: 28, elevation: 12,
        }}>
          <View style={{
            width: 72, height: 72, borderRadius: 20, backgroundColor: '#4361EE',
            alignItems: 'center', justifyContent: 'center', marginBottom: 18,
            shadowColor: '#4361EE', shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
          }}>
            <Ionicons name="home" size={34} color="#FFFFFF" />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 }}>
            <Text style={{ fontSize: 28, fontWeight: '300', color: '#4361EE', letterSpacing: 0.5 }}>Real</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#1A1A2E', letterSpacing: 0.5 }}>Estate</Text>
          </View>

          <Text style={{ fontSize: 10, fontWeight: '600', color: '#8896B3',
                         letterSpacing: 3, textTransform: 'uppercase' }}>
            Find Your Dream Home
          </Text>
        </View>
      </View>

      {/* Loading bar + footer */}
      <View style={{ alignItems: 'center', gap: 10 }}>
        <View style={{ width: TRACK_WIDTH, height: 3, backgroundColor: '#D8E0F5',
                       borderRadius: 99, overflow: 'hidden' }}>
          <Animated.View style={{ height: '100%', backgroundColor: '#4361EE',
                                  borderRadius: 99, width: barWidth }} />
        </View>
        <Text style={{ fontSize: 10, fontWeight: '600', color: '#A0ABCC',
                       letterSpacing: 2.5, textTransform: 'uppercase' }}>
          Loading...
        </Text>
        <Text style={{ fontSize: 11, color: '#B0BACC', letterSpacing: 0.3 }}>
          © 2025 RealEstate Inc. All rights reserved.
        </Text>
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const minWait  = new Promise<void>((res) => setTimeout(res, MIN_SPLASH_MS));
    const apiFetch = fetchProjects()
      .then((projects) => prefetchProjectImages(projects))
      .catch(() => null);
    Promise.all([minWait, apiFetch]).then(() => setSplashDone(true));
  }, []);

  if (!splashDone) return <SplashOverlay />;

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)"              options={{ headerShown: false }} />
        <Stack.Screen name="popular_tools"       options={{ headerShown: false }} />
        <Stack.Screen name="listings/index"      options={{ headerShown: false }} />
        <Stack.Screen name="propertyDetail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth"                options={{ headerShown: false }} />
        <Stack.Screen name= "AllCities/index"    options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
