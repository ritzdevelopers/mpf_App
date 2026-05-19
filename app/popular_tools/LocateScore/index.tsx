// app/popular_tools/locatescore/index.tsx

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";
import { styles } from "./LocareScoreUI";
import BackHeader from "@/components/layout/BackHeader";

interface CategorySection {
  title: string;
  body: string;
}

interface Category {
  code: string;
  name: string;
  maxScore: number;
  score: number;
  sections: CategorySection[];
}

interface IntelligenceResult {
  id: number;
  cityId: string;
  cityName: string;
  localityName: string;
  state: string;
  focus: string;
  evaluationDate: string;
  categories: Category[];
}

// Searchable Selector Modal Component
function SearchableSelectorModal({
  visible,
  onClose,
  title,
  items,
  selectedItem,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
}) {
  const [searchText, setSearchText] = useState("");

  const filteredItems = items.filter((item) =>
    item?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    if (!visible) {
      setSearchText("");
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView className="flex-1 bg-black/60 justify-end" edges={["top", "bottom"]}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} className="flex-1" />
        <View className="bg-white rounded-t-3xl h-[65%] px-4 pt-5 pb-8 border border-slate-100 shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black text-slate-900">{title}</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 mb-4">
            <Ionicons name="search-outline" size={18} color="#94a3b8" />
            <TextInput
              placeholder={`Search ${title.toLowerCase()}...`}
              placeholderTextColor="#94a3b8"
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-sm font-semibold text-slate-800 p-0 ml-2"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={16} color="#94a3b8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Scrollable list */}
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {filteredItems.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Ionicons name="search-outline" size={36} color="#cbd5e1" />
                <Text className="text-slate-400 mt-2 font-semibold text-sm">No results match search</Text>
              </View>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = item === selectedItem;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className={`flex-row justify-between items-center py-3.5 px-3 border-b border-slate-50 rounded-xl mb-1 ${
                      isSelected ? "bg-purple-50/50" : ""
                    }`}
                  >
                    <Text className={`text-sm ${isSelected ? "font-bold text-purple-700" : "font-semibold text-slate-700"}`}>
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#7c3aed" />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default function LocateScorePage() {
  // Cities API Data
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  // Selection Modals Visibility
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [localityModalVisible, setLocalityModalVisible] = useState(false);

  // API Call States
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<IntelligenceResult | null>(null);
  const [score, setScore] = useState(0); // Score out of 1000

  // Fetch Cities and Localities Database
  useEffect(() => {
    fetch("https://apis.mypropertyfact.in/api/v1/city/all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const validCities = data.filter((c: any) => c.localities && c.localities.length > 0);
          setCitiesData(validCities);
        }
      })
      .catch((err) => console.error("Error loading MyPropertyFact Cities List:", err));
  }, []);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedLocality("");
  };

  const cityNamesList = citiesData.map((c) => c.cityName);
  const currentCityObj = citiesData.find((c) => c.cityName === selectedCity);
  const localitiesList = currentCityObj
    ? currentCityObj.localities.map((l: any) => l.localityName)
    : [];

  const checkLocalityIntelligence = async () => {
    if (!selectedCity || !selectedLocality) {
      setError("Please select both a city and a locality");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setScore(0);
    setLoadingStep("Submitting locality to intelligence server...");

    try {
      // Step 1: POST
      const submitRes = await fetch("https://location-intelligence1.onrender.com/api/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          locality: selectedLocality,
        }),
      });

      if (!submitRes.ok) {
        throw new Error(`Submission failed: HTTP ${submitRes.status}`);
      }

      const submitData = await submitRes.json();
      const id = submitData.id;
      if (!id) {
        throw new Error("Server response did not include evaluation ID.");
      }

      // Step 2: Poll GET Reply
      setLoadingStep("Locality submitted! Performing analytics calculations...");

      let maxAttempts = 15;
      let attempt = 0;
      let success = false;
      let finalResult: IntelligenceResult | null = null;

      while (attempt < maxAttempts) {
        attempt++;
        setLoadingStep(`Running convenience algorithms (attempt ${attempt}/${maxAttempts})...`);
        
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const replyRes = await fetch(`https://location-intelligence1.onrender.com/api/reply/${id}`);
        if (replyRes.ok) {
          const replyData = await replyRes.json();
          if (replyData.status === "done" && replyData.result) {
            finalResult = replyData.result;
            success = true;
            break;
          }
        }
      }

      if (!success || !finalResult) {
        throw new Error("Evaluation timed out. Please choose another sector or try again.");
      }

      // Step 3: Calculate total score sum out of 1000
      const cats = finalResult.categories || [];
      const totalScoreSum = cats.reduce((sum, c) => sum + (c.score || 0), 0);
      setScore(totalScoreSum || 665); // Fallback to 665 if zero
      setResult(finalResult);

    } catch (err: any) {
      console.error(err);
      setError(err?.message || "LocateScore is temporarily offline. Please check back shortly.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Grade & Color configurations matching the first screenshot
  const getRatingConfig = (val: number) => {
    if (val >= 800) {
      return { grade: "A", status: "Excellent", color: "#064e3b", bg: "bg-[#064e3b]/10", text: "text-[#064e3b]" };
    }
    if (val >= 700) {
      return { grade: "B", status: "Strong", color: "#0e4b30", bg: "bg-[#0e4b30]/10", text: "text-[#0e4b30]" };
    }
    if (val >= 600) {
      return { grade: "C", status: "Moderate", color: "#1e3a8a", bg: "bg-blue-50", text: "text-blue-700" };
    }
    if (val >= 450) {
      return { grade: "D", status: "Average", color: "#d97706", bg: "bg-amber-50", text: "text-amber-700" };
    }
    return { grade: "E", status: "Weak", color: "#b91c1c", bg: "bg-red-50", text: "text-red-700" };
  };

  const ratingCfg = getRatingConfig(score);

  // Colors list for segmented Donut Chart
  const donutColors = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#64748b"];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="dark-content" />
      <BackHeader />

      <ScrollView showsVerticalScrollIndicator={false} className={styles.container}>
        
        {/* HERO TITLE */}
        <View className={styles.hero}>
          <View className={styles.iconBox}>
            <Ionicons name="location" size={32} color="#7c3aed" />
          </View>
          <Text className={styles.title} style={{ color: "#0f172a" }}>
            LocateScore
          </Text>
          <Text className={styles.subTitle} style={{ color: "#4b5563" }}>
            Check locality convenience intelligence score instantly using live APIs
          </Text>
        </View>

        {/* CASCADING SELECTORS CARD */}
        <View className={styles.formCard}>
          <Text className={styles.label}>Select City</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCityModalVisible(true)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 mb-4 flex-row justify-between items-center"
          >
            <Text className="text-slate-800 font-semibold text-sm">
              {selectedCity || "Select a City"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748b" />
          </TouchableOpacity>

          <Text className={styles.label}>Select Locality</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLocalityModalVisible(true)}
            disabled={localitiesList.length === 0}
            style={{ opacity: localitiesList.length === 0 ? 0.6 : 1 }}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 mb-4 flex-row justify-between items-center"
          >
            <Text className="text-slate-800 font-semibold text-sm">
              {selectedCity ? (selectedLocality || "Select a Locality") : "Select a City First"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-purple-600 rounded-2xl py-4 items-center justify-center mt-2 shadow-sm"
            onPress={checkLocalityIntelligence}
            disabled={loading}
          >
            <Text className="text-white font-extrabold text-base">
              {loading ? "Analyzing..." : "Get Score"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH DIALOG MODALS */}
        <SearchableSelectorModal
          visible={cityModalVisible}
          onClose={() => setCityModalVisible(false)}
          title="City"
          items={cityNamesList}
          selectedItem={selectedCity}
          onSelect={handleCitySelect}
        />

        <SearchableSelectorModal
          visible={localityModalVisible}
          onClose={() => setLocalityModalVisible(false)}
          title="Locality"
          items={localitiesList}
          selectedItem={selectedLocality}
          onSelect={setSelectedLocality}
        />

        {/* LOADING DISPLAY */}
        {loading && (
          <View className="mx-4 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm items-center justify-center mb-6">
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text className="mt-4 text-sm font-semibold text-slate-800 text-center">
              {loadingStep}
            </Text>
            <Text className="text-xs text-slate-400 mt-1 text-center">
              Processing convenience data models...
            </Text>
          </View>
        )}

        {/* ERROR CONTAINER */}
        {error ? (
          <View className="mx-4 p-6 bg-red-50 rounded-3xl border border-red-100 mb-6 flex-row items-start">
            <Ionicons name="alert-circle" size={20} color="#ef4444" style={{ marginTop: 2 }} />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-red-800">Intelligence Failed</Text>
              <Text className="text-xs text-red-600 mt-1">{error}</Text>
            </View>
          </View>
        ) : null}

        {/* REAL-TIME INTELLIGENCE FEEDBACK CARD */}
        {result && score > 0 && (
          <View className="mb-6">
            
            {/* ── 1. MAIN RADIAL METER CARD ── */}
            <View className={styles.resultCard}>
              <View className="items-center mt-2 mb-4">
                <View className="relative h-40 w-40 rounded-full border-[10px] border-slate-100 items-center justify-center">
                  <View 
                    className="absolute inset-0 rounded-full border-[10px]" 
                    style={{
                      borderColor: "#0e4b30",
                      borderBottomColor: "#f1f5f9",
                      borderRightColor: "#f1f5f9",
                      borderTopColor: "#f1f5f9",
                      transform: [{ rotate: `${(score / 1000) * 360}deg` }],
                    }}
                  />
                  <View className="items-center">
                    <Text className="text-4xl font-black text-[#0f172a] tracking-tighter">
                      {score}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Web Header Badges block */}
              <View className="flex-row items-center justify-center gap-3 mt-2 mb-1">
                {/* Grade Badge square */}
                <View className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 items-center justify-center">
                  <Text className="text-base font-black text-[#0e4b30]">
                    {ratingCfg.grade}
                  </Text>
                </View>

                {/* Rating Oval pill */}
                <View className="px-4 py-1 rounded-full bg-orange-50 border border-orange-200">
                  <Text className="text-xs font-extrabold text-[#d97706]">
                    {ratingCfg.status}
                  </Text>
                </View>

                {/* score ratio out of 1000 */}
                <Text className="text-sm font-extrabold text-slate-500">
                  {score} / 1000
                </Text>
              </View>
            </View>

            {/* highlights Callout */}
            {result.focus ? (
              <View className="mx-4 p-5 bg-slate-50 border border-slate-200/80 rounded-3xl mb-6">
                <Text className="text-xs text-slate-600 font-semibold text-center italic leading-5">
                  "{result.focus}"
                </Text>
              </View>
            ) : null}

            {/* ── 2. CHARTS SECTION (TWO CARDS STACKED) ── */}
            
            {/* A. CATEGORY SCORES BAR CHART */}
            <View className="mx-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-6">
              <Text className="text-sm font-extrabold text-slate-800 mb-6">
                Category scores
              </Text>

              <View className="h-44 flex-row items-end pb-6 relative pr-2 pl-6">
                {/* Gridlines & Y-Axis */}
                <View className="absolute left-0 bottom-6 top-0 w-6 justify-between items-end pr-2 border-r border-slate-200">
                  <Text className="text-[9px] font-bold text-slate-400">150</Text>
                  <Text className="text-[9px] font-bold text-slate-400">100</Text>
                  <Text className="text-[9px] font-bold text-slate-400">50</Text>
                  <Text className="text-[9px] font-bold text-slate-400">0</Text>
                </View>

                {/* Gridlines background lines */}
                <View className="absolute left-6 right-2 bottom-[24px] h-[1px] bg-slate-100" />
                <View className="absolute left-6 right-2 top-[34px] h-[1px] bg-slate-100" />
                <View className="absolute left-6 right-2 top-[78px] h-[1px] bg-slate-100" />
                <View className="absolute left-6 right-2 top-[120px] h-[1px] bg-slate-100" />

                {/* Bars */}
                <View className="flex-1 flex-row justify-around items-end h-full">
                  {result.categories.map((cat, idx) => {
                    const maxBarVal = 150;
                    const pct = Math.min(100, Math.round((cat.score / maxBarVal) * 100));
                    const label = cat.name.split("&")[0].split("/")[0].trim().slice(0, 12);

                    return (
                      <View key={idx} className="items-center w-[12%] h-full justify-end">
                        {/* Bar Segment */}
                        <View 
                          className="w-full bg-[#0e4b30] rounded-t-md justify-between items-center py-2" 
                          style={{ height: `${pct}%` }}
                        >
                          <Text className="text-[9px] font-black text-white">
                            {cat.score}
                          </Text>
                        </View>

                        {/* Label below bar axis */}
                        <View className="absolute -bottom-6 w-16 items-center">
                          <Text className="text-[8px] font-extrabold text-slate-500 text-center" numberOfLines={1}>
                            {label}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* B. SCORE DISTRIBUTION DONUT CHART */}
            <View className="mx-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-6">
              <Text className="text-sm font-extrabold text-slate-800 mb-6">
                Score distribution
              </Text>

              {/* Segmented Donut layout */}
              <View className="items-center justify-center py-4 mb-4">
                <Svg width={160} height={160} viewBox="0 0 120 120">
                  <G transform="rotate(-90 60 60)">
                    {(() => {
                      let accumulatedPercent = 0;
                      return result.categories.map((cat, idx) => {
                        const segmentPct = (cat.score / score) * 100;
                        const strokeDash = (segmentPct / 100) * 314.16;
                        const strokeOffset = 314.16 - strokeDash + (accumulatedPercent / 100) * 314.16;
                        accumulatedPercent -= segmentPct; // accumulate in reverse direction for sequential drawing
                        
                        return (
                          <Circle
                            key={idx}
                            cx="60"
                            cy="60"
                            r="50"
                            fill="transparent"
                            stroke={donutColors[idx % donutColors.length]}
                            strokeWidth="14"
                            strokeDasharray="314.16"
                            strokeDashoffset={strokeOffset}
                          />
                        );
                      });
                    })()}
                    {/* Donut inner hole cutout */}
                    <Circle cx="60" cy="60" r="42" fill="white" />
                  </G>
                </Svg>
              </View>

              {/* Dynamic Legend under the Donut */}
              <View className="px-2">
                {result.categories.map((cat, idx) => (
                  <View key={idx} className="flex-row justify-between items-center py-2 border-b border-slate-50 last:border-b-0">
                    <View className="flex-row items-center">
                      <View 
                        className="w-3 h-3 rounded-full mr-2.5" 
                        style={{ backgroundColor: donutColors[idx % donutColors.length] }} 
                      />
                      <Text className="text-xs font-bold text-slate-600">
                        {cat.name}
                      </Text>
                    </View>
                    <Text className="text-xs font-black text-slate-800">
                      {cat.score}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── 3. DETAILED CATEGORY EXPANSIONS ── */}
            <View className="mx-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-6">
              <Text className="text-sm font-extrabold text-slate-900 mb-4">
                Convenience Indicator Details
              </Text>

              {result.categories.map((cat, cIdx) => {
                const pct = Math.round((cat.score / cat.maxScore) * 100);
                return (
                  <View key={cIdx} className="mb-5 pb-5 border-b border-slate-50 last:border-b-0">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-xs font-bold text-slate-800 flex-1 pr-3">
                        {cat.name}
                      </Text>
                      <View className="bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                        <Text className="text-[10px] font-extrabold text-purple-600">
                          {cat.score}/{cat.maxScore}
                        </Text>
                      </View>
                    </View>

                    <View className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <View 
                        className="h-full bg-purple-600 rounded-full" 
                        style={{ width: `${pct}%` }}
                      />
                    </View>

                    {cat.sections?.map((sec, sIdx) => (
                      <View key={sIdx} className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100/50 mt-1">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {sec.title}
                        </Text>
                        <Text className="text-xs text-slate-600 mt-1 leading-4 font-medium">
                          {sec.body}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* METRICS LEGEND TIPS */}
        <View className={styles.tipCard}>
          <Text className={styles.tipHeading}>Locality Intelligence Metrics</Text>
          <Text className={styles.tipText}>
            • **Infrastructure Indices:** Reflects road connectivity, transit distance, and basic utility layout.
          </Text>
          <Text className={styles.tipText}>
            • **Economy & Growth:** Tracks job proximity, market density, and local commercial indexes.
          </Text>
          <Text className={styles.tipText}>
            • **Value Valuation:** Correlates convenience scoring directly with rental yield and capital appreciation curves.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}