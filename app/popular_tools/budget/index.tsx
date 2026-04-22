import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./budgetUI";
import BackHeader from '@/components/layout/BackHeader';

export default function BudgetPage() {
  const [income, setIncome] = useState("");
  const [existingLoan, setExistingLoan] = useState("");
  const [rate, setRate] = useState("");

  const [budget, setBudget] = useState(0);

  const calculate = () => {
    const monthlyIncome = Number(income);
    const loanEmi = Number(existingLoan) || 0;
    const interestRate = Number(rate);

    if (!monthlyIncome || !interestRate) return;

    // Typically bank finances 80-85% of property value
    // And EMI should not exceed 40-50% of monthly income
    const availableForEmi = (monthlyIncome * 0.4) - loanEmi;
    
    if (availableForEmi <= 0) {
      setBudget(0);
      return;
    }

    const r = interestRate / 12 / 100;
    const n = 20 * 12; // 20 years tenure

    // P = availableForEmi * ((1+r)^n - 1) / (r * (1+r)^n)
    const loanAmount =
      availableForEmi *
      ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));

    // Property value = loan amount / 0.80 (assuming 80% financing)
    const propertyBudget = loanAmount / 0.8;

    setBudget(Math.round(propertyBudget));
  };

  const percent = budget > 0 ? Math.min((budget / 10000000) * 100, 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <BackHeader />
    <ScrollView className={styles.container}>
      <View className={styles.hero}>
        <View className={styles.iconBox}>
          <Ionicons name="calculator-outline" size={34} color="#d97706" />
        </View>

        <Text className={styles.title}>
          Budget Calculator
        </Text>

        <Text className={styles.subTitle}>
          Check your buying budget instantly
        </Text>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.label}>
          Monthly Income
        </Text>

        <TextInput
          placeholder="₹ Enter monthly income"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
          className={styles.input}
        />

        <Text className={styles.label}>
          Existing Loan EMI
        </Text>

        <TextInput
          placeholder="₹ If any (optional)"
          placeholderTextColor="#cbd5e1"
          keyboardType="numeric"
          value={existingLoan}
          onChangeText={setExistingLoan}
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

        <TouchableOpacity
          className={styles.button}
          onPress={calculate}
        >
          <Text className={styles.buttonText}>
            Check Budget
          </Text>
        </TouchableOpacity>
      </View>

      {budget > 0 && (
        <View className={styles.resultCard}>
          <View className="items-center mt-2 mb-4">
            <View className="relative h-40 w-40 rounded-full border-8 border-gray-200 items-center justify-center" style={{borderColor: "#e5e7eb"}}>
              <View 
                className="absolute inset-0 rounded-full border-8" 
                style={{
                  borderColor: "#d97706",
                  borderBottomColor: "#e5e7eb",
                  borderRightColor: "#e5e7eb",
                  borderTopColor: "#e5e7eb",
                  transform: [{ rotate: `${(percent / 100) * 360}deg` }],
                }}
              />
              <View className="items-center">
                <Text className="text-xs text-slate-500">
                  Budget
                </Text>
                <Text className="text-2xl font-bold text-slate-900">
                  {percent.toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>

          <Text className={styles.bigNumber}>
            ₹{budget.toLocaleString()}
          </Text>

          <Text className={styles.grayText}>
            Approx Budget
          </Text>

          <View className={styles.line} />

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Monthly Income
            </Text>

            <Text className={styles.smallValue}>
              ₹{Number(income).toLocaleString()}
            </Text>
          </View>

          <View className={styles.row}>
            <Text className={styles.smallText}>
              Interest Rate
            </Text>

            <Text className={styles.smallValue}>
              {rate}%
            </Text>
          </View>
        </View>
      )}

      <View className={styles.tipCard}>
        <Text className={styles.tipHeading}>
          Budget Tips
        </Text>

        <Text className={styles.tipText}>
          • Higher income increases buying power
        </Text>

        <Text className={styles.tipText}>
          • Lower existing EMI means higher budget
        </Text>

        <Text className={styles.tipText}>
          • Add down payment to increase property options
        </Text>
      </View>
    </ScrollView>
    </View>
  );
}
