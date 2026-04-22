import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BackHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: '#ffffff',
        borderBottomWidth: 0,
        height: insets.top + 36,
        justifyContent: 'flex-end',
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ paddingVertical: 2, paddingLeft: 14 }}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={22} color="#111111" />
      </TouchableOpacity>
    </View>
  );
}
