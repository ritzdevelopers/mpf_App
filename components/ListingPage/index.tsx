// components/ListingsPage/index.tsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./listingUI";
import { fetchProjects, IMAGE_BASE_URL, type Project } from "@/utils/api";

const PAGE_SIZE = 20;

const FALLBACK_IMAGE = "https://placehold.co/900x600/e2e8f0/94a3b8?text=No+Image";

export default function ListingsPage() {
  const allProjects = useRef<Project[]>([]);
  const [displayed, setDisplayed] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const page = useRef(0);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        allProjects.current = data;
        page.current = 1;
        setDisplayed(data.slice(0, PAGE_SIZE));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(() => {
    const total = allProjects.current.length;
    const nextStart = page.current * PAGE_SIZE;
    if (nextStart >= total || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextChunk = allProjects.current.slice(nextStart, nextStart + PAGE_SIZE);
      setDisplayed((prev) => [...prev, ...nextChunk]);
      page.current += 1;
      setLoadingMore(false);
    }, 100);
  }, [loadingMore]);

  const renderCard = useCallback(({ item }: { item: Project }) => (
    <TouchableOpacity
      className={styles.card}
      activeOpacity={0.95}
      onPress={() => router.push(`/propertyDetail/${item.slugURL}` as any)}
    >
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.projectThumbnailImage}` }}
        className={styles.image}
        defaultSource={{ uri: FALLBACK_IMAGE }}
        onError={(e) => {
          (e.target as any).src = FALLBACK_IMAGE;
        }}
      />

      <View className={styles.badgeRow}>
        <Text className={styles.badgeDark}>{item.propertyTypeName}</Text>
        <TouchableOpacity className={styles.heartBtn}>
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className={styles.bottomTag}>
        <Text className="text-white text-xs">{item.projectStatusName}</Text>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className={styles.title} numberOfLines={2}>
            {item.projectName}
          </Text>
          <Text className={styles.yellowTag}>{item.cityName}</Text>
        </View>

        <Text className={styles.location} numberOfLines={1}>
          {item.projectConfiguration} · {item.projectLocality}
        </Text>

        <View className="flex-row justify-between mt-4">
          <View>
            <Text className={styles.smallText}>Starting Price</Text>
            <Text className={styles.price}>₹{item.projectPrice} Cr</Text>
          </View>
          <View className="items-end">
            <Text className={styles.smallText}>Builder</Text>
            <Text className={styles.price} numberOfLines={1}>
              {item.builderName}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity className={styles.outlineBtn}>
            <Text className={styles.outlineText}>Brochure</Text>
          </TouchableOpacity>
          <TouchableOpacity className={styles.fillBtn}>
            <Text className={styles.fillText}>View Number</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  ), []);

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View className={styles.header}>
        <TouchableOpacity className={styles.circleBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <View className={styles.searchBox}>
          <TextInput
            placeholder="Search City/Locality/Project"
            placeholderTextColor="#999"
            className="flex-1 text-sm"
          />
          <Feather name="search" size={18} color="#777" />
        </View>
        <TouchableOpacity className={styles.circleBtn}>
          <Ionicons name="heart-outline" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View className="mt-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["Sort", "Property Type", "City", "Status", "Budget"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity className={styles.filterBtn}>
              <Text className={styles.filterText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {!loading && (
        <Text className={styles.resultText}>
          {allProjects.current.length} RESULTS | Properties
        </Text>
      )}

      {error && (
        <View className="items-center justify-center mt-16">
          <Text className="text-red-400 text-sm">
            Failed to load properties. Please try again.
          </Text>
        </View>
      )}
    </View>
  );

  const ListFooter = () =>
    loadingMore ? (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#d89b38" />
      </View>
    ) : null;

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#d89b38" />
        <Text className="text-slate-400 text-sm mt-3">Loading properties...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={displayed}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderCard}
      ListHeaderComponent={<ListHeader />}
      ListFooterComponent={<ListFooter />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 48, paddingBottom: 40 }}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={5}
    />
  );
}
