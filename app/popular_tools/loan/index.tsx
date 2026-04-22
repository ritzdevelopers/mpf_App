// app/popular_tools/loan/index.tsx

import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./LoanUi";
import BackHeader from '@/components/layout/BackHeader';

export default function LoanPage() {
  const [salary, setSalary] = useState("");
  const [tenure, setTenure] = useState("");
  const [rate, setRate] = useState("");

  const [loan, setLoan] = useState(0);
  const [emi, setEmi] = useState(0);

  const calculate = () => {
    const monthlySalary = Number(salary);
    const years = Number(tenure);
    const interest = Number(rate);

    if (!monthlySalary || !years || !interest) return;

    const eligibleLoan = monthlySalary * 70;
    const P = eligibleLoan;
    const r = interest / 12 / 100;
    const n = years * 12;

    const monthlyEmi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    setLoan(eligibleLoan);
    setEmi(monthlyEmi);
  };

  const percent = Math.min((loan / 10000000) * 100, 100);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <BackHeader />
    <ScrollView className={styles.container}>
      <View className={styles.hero}>
        <View className={styles.iconBox}>
          <Ionicons name="cash-outline" size={34} color="#2563eb" />
        </View>

        <Text className={styles.title}>
          Loan Eligibility
        </Text>

        <Text className={styles.subTitle}>
          Check how much loan amount you may get
        </Text>
      </View>

      <View className={styles.formCard}>

        <Text className={styles.label}>
          Monthly Salary
        </Text>

        <TextInput
          placeholder="₹ Enter salary"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
          className={styles.input}
        />

        <Text className={styles.label}>
          Interest Rate %
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
          value={tenure}
          onChangeText={setTenure}
          className={styles.input}
        />

        <TouchableOpacity
          className={styles.button}
          onPress={calculate}
        >
          <Text className={styles.buttonText}>
            Check Now
          </Text>
        </TouchableOpacity>

      </View>

      {loan > 0 && (
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
                  transform: [{ rotate: `${(percent / 100) * 360}deg` }],
                }}
              />
              <View className="items-center">
                <Text className="text-2xl font-bold text-slate-900">
                  {percent.toFixed(0)}%
                </Text>
                <Text className="text-xs text-slate-500">
                  Eligible
                </Text>
              </View>
            </View>
          </View>

          <Text className={styles.bigNumber}>
            ₹{loan.toLocaleString()}
          </Text>

          <Text className={styles.grayText}>
            Approx Loan Amount
          </Text>

          <View className={styles.line} />

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Estimated EMI
            </Text>

            <Text className={styles.smallValue}>
              ₹{emi.toFixed(0)}
            </Text>
          </View>

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Tenure
            </Text>

            <Text className={styles.smallValue}>
              {tenure} Years
            </Text>
          </View>

        </View>
      )}

      <View className={styles.tipCard}>
        <Text className={styles.tipHeading}>
          Improve Eligibility
        </Text>

        <Text className={styles.tipText}>
          • Add co-applicant
        </Text>

        <Text className={styles.tipText}>
          • Reduce current debts
        </Text>

        <Text className={styles.tipText}>
          • Increase down payment
        </Text>
      </View>

    </ScrollView>
    </View>
  );
}