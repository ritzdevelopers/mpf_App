// app/popular_tools/locatescore/index.tsx

import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./LocareScoreUI";
import BackHeader from '@/components/layout/BackHeader';

export default function LocateScorePage() {
  const [metro, setMetro] = useState("");
  const [hospital, setHospital] = useState("");
  const [school, setSchool] = useState("");
  const [market, setMarket] = useState("");

  const [score, setScore] = useState(0);

  const calculate = () => {
    const m = Number(metro);
    const h = Number(hospital);
    const s = Number(school);
    const mk = Number(market);

    const metroScore = Math.max(0, 30 - m * 3);
    const hospitalScore = Math.max(0, 25 - h * 2.5);
    const schoolScore = Math.max(0, 25 - s * 2.5);
    const marketScore = Math.max(0, 20 - mk * 2);

    const total =
      metroScore +
      hospitalScore +
      schoolScore +
      marketScore;

    setScore(Math.round(total));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <BackHeader />
    <ScrollView className={styles.container}>
      <View className={styles.hero}>
        <View className={styles.iconBox}>
          <Ionicons
            name="location-outline"
            size={34}
            color="#7c3aed"
          />
        </View>

        <Text className={styles.title}>
          LocateScore
        </Text>

        <Text className={styles.subTitle}>
          Check locality convenience score instantly
        </Text>
      </View>

      <View className={styles.formCard}>

        <Text className={styles.label}>
          Metro Distance (km)
        </Text>

        <TextInput
          placeholder="Eg. 1"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={metro}
          onChangeText={setMetro}
          className={styles.input}
        />

        <Text className={styles.label}>
          Hospital Distance (km)
        </Text>

        <TextInput
          placeholder="Eg. 2"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={hospital}
          onChangeText={setHospital}
          className={styles.input}
        />

        <Text className={styles.label}>
          School Distance (km)
        </Text>

        <TextInput
          placeholder="Eg. 1"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={school}
          onChangeText={setSchool}
          className={styles.input}
        />

        <Text className={styles.label}>
          Market Distance (km)
        </Text>

        <TextInput
          placeholder="Eg. 0.5"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={market}
          onChangeText={setMarket}
          className={styles.input}
        />

        <TouchableOpacity
          className={styles.button}
          onPress={calculate}
        >
          <Text className={styles.buttonText}>
            Check Score
          </Text>
        </TouchableOpacity>

      </View>

      {score > 0 && (
        <View className={styles.resultCard}>

          <View className="items-center mt-2 mb-4">
            <View className="relative h-40 w-40 rounded-full border-8 border-gray-200 items-center justify-center" style={{borderColor: "#e5e7eb"}}>
              <View 
                className="absolute inset-0 rounded-full border-8" 
                style={{
                  borderColor: "#7c3aed",
                  borderBottomColor: "#e5e7eb",
                  borderRightColor: "#e5e7eb",
                  borderTopColor: "#e5e7eb",
                  transform: [{ rotate: `${(score / 100) * 360}deg` }],
                }}
              />
              <View className="items-center">
                <Text className="text-xs text-slate-500">
                  Score
                </Text>
                <Text className="text-2xl font-bold text-slate-900">
                  {score}
                </Text>
              </View>
            </View>
          </View>

          <Text className={styles.bigNumber}>
            {score}/100
          </Text>

          <Text className={styles.grayText}>
            Locality Convenience Rating
          </Text>

          <View className={styles.line} />

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Category
            </Text>

            <Text className={styles.smallValue}>
              {score >= 80
                ? "Excellent"
                : score >= 60
                ? "Good"
                : score >= 40
                ? "Average"
                : "Needs Improvement"}
            </Text>
          </View>

        </View>
      )}

      <View className={styles.tipCard}>
        <Text className={styles.tipHeading}>
          Better Score Means
        </Text>

        <Text className={styles.tipText}>
          • Better daily convenience
        </Text>

        <Text className={styles.tipText}>
          • Higher rental demand
        </Text>

        <Text className={styles.tipText}>
          • Better resale potential
        </Text>
      </View>

    </ScrollView>
    </View>
  );
}