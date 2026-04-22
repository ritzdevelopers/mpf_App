// app/popular_tools/area/index.tsx

import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./areaUI";
import BackHeader from '@/components/layout/BackHeader';

export default function AreaPage() {
  const [value, setValue] = useState("");
  const [sqft, setSqft] = useState("");
  const [sqyd, setSqyd] = useState("");
  const [sqm, setSqm] = useState("");
  const [acre, setAcre] = useState("");

  const convert = () => {
    const num = Number(value);

    if (!num) return;

    setSqft(num.toFixed(2));
    setSqyd((num / 9).toFixed(2));
    setSqm((num / 10.764).toFixed(2));
    setAcre((num / 43560).toFixed(4));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <BackHeader />
    <ScrollView className={styles.container}>
      <View className={styles.hero}>
        <View className={styles.iconBox}>
          <Ionicons
            name="resize-outline"
            size={34}
            color="#16a34a"
          />
        </View>

        <Text className={styles.title}>
          Area Converter
        </Text>

        <Text className={styles.subTitle}>
          Convert square feet into other units instantly
        </Text>
      </View>

      <View className={styles.formCard}>

        <Text className={styles.label}>
          Enter Area (sq.ft)
        </Text>

        <TextInput
          placeholder="Eg. 1000"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
          className={styles.input}
        />

        <TouchableOpacity
          className={styles.button}
          onPress={convert}
        >
          <Text className={styles.buttonText}>
            Convert Now
          </Text>
        </TouchableOpacity>

      </View>

      {sqft ? (
        <View className={styles.resultCard}>

          <Text className={styles.resultTitle}>
            Converted Values
          </Text>

          <View className={styles.line} />

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Square Feet
            </Text>

            <Text className={styles.smallValue}>
              {sqft}
            </Text>
          </View>

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Square Yard
            </Text>

            <Text className={styles.smallValue}>
              {sqyd}
            </Text>
          </View>

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Square Meter
            </Text>

            <Text className={styles.smallValue}>
              {sqm}
            </Text>
          </View>

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Acre
            </Text>

            <Text className={styles.smallValue}>
              {acre}
            </Text>
          </View>

        </View>
      ) : null}

      <View className={styles.tipCard}>
        <Text className={styles.tipHeading}>
          Popular Values
        </Text>

        <Text className={styles.tipText}>
          • 100 sq.yd = 900 sq.ft
        </Text>

        <Text className={styles.tipText}>
          • 1 Acre = 43,560 sq.ft
        </Text>

        <Text className={styles.tipText}>
          • 1 sq.m = 10.764 sq.ft
        </Text>
      </View>

    </ScrollView>
    </View>
  );
}