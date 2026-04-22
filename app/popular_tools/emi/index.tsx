// app/popular_tools/emi/index.tsx

import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from  './emiUI';
import BackHeader from '@/components/layout/BackHeader';

export default function EMIPage() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");

  const [emi, setEmi] = useState(0);
  const [interest, setInterest] = useState(0);
  const [total, setTotal] = useState(0);

  const calculate = () => {
    const P = Number(loan);
    const annualRate = Number(rate);
    const tenure = Number(years);

    if (!P || !annualRate || !tenure) return;

    const r = annualRate / 12 / 100;
    const n = tenure * 12;

    const monthly =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPay = monthly * n;
    const totalInterest = totalPay - P;

    setEmi(monthly);
    setInterest(totalInterest);
    setTotal(totalPay);
  };

  const principalPercent =
    total > 0 ? (Number(loan) / total) * 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <BackHeader />
    <ScrollView
      className={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View className={styles.hero}>

        <View className={styles.iconBox}>
          <Ionicons
            name="calculator-outline"
            size={32}
            color="#2563eb"
          />
        </View>

        <Text className={styles.title}>
          EMI Calculator
        </Text>

        <Text className={styles.subTitle}>
          Know your monthly payment instantly
        </Text>

      </View>

      {/* Form */}
      <View className={styles.formCard}>

        <Text className={styles.label}>
          Loan Amount
        </Text>

        <TextInput
          placeholder="₹ Enter loan amount"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={loan}
          onChangeText={setLoan}
          className={styles.input}
        />

        <Text className={styles.label}>
          Interest Rate (%)
        </Text>

        <TextInput
          placeholder="Eg. 8.5"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
          className={styles.input}
        />

        <Text className={styles.label}>
          Tenure (Years)
        </Text>

        <TextInput
          placeholder="Eg. 20"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={years}
          onChangeText={setYears}
          className={styles.input}
        />

        <TouchableOpacity
          className={styles.button}
          onPress={calculate}
        >
          <Text className={styles.buttonText}>
            Calculate EMI
          </Text>
        </TouchableOpacity>

      </View>

      {/* Result */}
      {emi > 0 && (
        <View className={styles.resultCard}>

          <View className="items-center mt-2 mb-4">
            <View className="relative h-40 w-40 rounded-full border-8 border-gray-200 items-center justify-center" style={{borderColor: "#e5e7eb"}}>
              <View 
                className="absolute inset-0 rounded-full border-8" 
                style={{
                  borderColor: "#2563eb",
                  borderBottomColor: "#e5e7eb",
                  borderRightColor: "#e5e7eb",
                  borderTopColor: "#e5e7eb",
                  transform: [{ rotate: `${(principalPercent / 100) * 360}deg` }],
                }}
              />
              <View className="items-center">
                <Text className="text-xs text-slate-500">
                  EMI
                </Text>
                <Text className="text-xl font-bold text-slate-900">
                  ₹{emi.toFixed(0)}
                </Text>
              </View>
            </View>
          </View>

          <Text className={styles.bigNumber}>
            ₹{emi.toFixed(0)}
          </Text>

          <Text className={styles.grayText}>
            Monthly Installment
          </Text>

          <View className={styles.line} />

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Principal
            </Text>

            <Text className={styles.smallValue}>
              ₹{Number(loan).toLocaleString()}
            </Text>
          </View>

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Interest
            </Text>

            <Text className={styles.smallValue}>
              ₹{interest.toFixed(0)}
            </Text>
          </View>

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Total Payment
            </Text>

            <Text className={styles.smallValue}>
              ₹{total.toFixed(0)}
            </Text>
          </View>

        </View>
      )}

      {/* Tips */}
      <View className={styles.tipCard}>

        <Text className={styles.tipHeading}>
          Smart EMI Tips
        </Text>

        <Text className={styles.tipText}>
          • Higher down payment lowers EMI
        </Text>

        <Text className={styles.tipText}>
          • Shorter tenure saves interest
        </Text>

        <Text className={styles.tipText}>
          • Compare lenders before applying
        </Text>

      </View>

    </ScrollView>
    </View>
  );
}