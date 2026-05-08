// components/ListingsPage/index.tsx

import {
  fetchProjects,
  getImageUrl,
  getProjectsCache,
  prefetchProjectImages,
  fetchProjectDetail,
  type Project,
} from "@/utils/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { firstStringParam, resolveCityFromParam } from "@/utils/cityMatch";
import {
  HOME_PROPERTY_TYPE_OPTIONS,
  isHomePropertyTypeTag,
  projectMatchesHomeTypeTag,
} from "@/utils/homePropertyTypeTags";
import { projectMatchesHomePriceRange } from "@/utils/priceRangeFilter";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./listingUI";
import ContactFormModal from "../ContactFormModal";

const PAGE_SIZE = 20;

type SortKey = "default" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
type DropdownKey = "sort" | "type" | "city" | "status" | "builder" | null;


const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default",    label: "Default"             },
  { key: "price_asc",  label: "Price: Low → High"   },
  { key: "price_desc", label: "Price: High → Low"   },
  { key: "name_asc",   label: "Name: A → Z"         },
  { key: "name_desc",  label: "Name: Z → A"         },
];

const IMAGE_STYLE = { width: "100%" as const, height: 260 };

const PropertyCard = memo(function PropertyCard({ item, onEnquiryPress }: { item: Project; onEnquiryPress: (link: string) => void }) {
  const onPress = useCallback(() => {
    // Problem 1 Fix: Fire the fetch immediately on tap to populate detailCache
    // By the time the screen mounts, data may already be ready
    fetchProjectDetail(item.slugURL);
    router.push(`/propertyDetail/${item.slugURL}` as any);
  }, [item.slugURL]);

  return (
    <TouchableOpacity className={styles.card} activeOpacity={0.95} onPress={onPress}>
      <Image
        source={{ uri: getImageUrl(item.slugURL, item.projectThumbnailImage) }}
        style={IMAGE_STYLE}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
      />
      <View className={styles.badgeRow}>
        <Text className={styles.badgeDark}>{item.propertyTypeName}</Text>
      </View>
      <View className={styles.bottomTag}>
        <Text className={styles.bottomTagText}>{item.projectStatusName}</Text>
      </View>
      <View className={styles.cardBody}>
        <View className={styles.titleRow}>
          <Text className={styles.title} numberOfLines={2}>{item.projectName}</Text>
          <Text className={styles.yellowTag}>{item.cityName}</Text>
        </View>
        <Text className={styles.location} numberOfLines={1}>
          {item.projectConfiguration} · {item.projectLocality}
        </Text>
        <View className={styles.metricsRow}>
          <View>
            <Text className={styles.smallText}>Starting Price</Text>
            <Text className={styles.price}>₹{item.projectPrice} Cr</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.metricEnd}>
            <Text className={styles.smallText}>Builder</Text>
            <Text className={styles.price} numberOfLines={1}>{item.builderName}</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.metricEnd}>
            <Text className={styles.smallText}>Type</Text>
            <Text className={styles.price} numberOfLines={1}>{item.propertyTypeName}</Text>
          </View>
        </View>
        <View className={styles.buttonRow}>
          <TouchableOpacity className={styles.outlineBtn} onPress={onPress}>
            <Text className={styles.outlineText}>Brochure</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={styles.fillBtn} 
            onPress={() => onEnquiryPress(`https://mypropertyfact.in/${item.slugURL}`)}
          >
            <Text className={styles.fillText}>View Number</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const keyExtractor = (item: Project) => String(item.id);

const SORT_PARAM_KEYS: readonly SortKey[] = [
  "default",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
];

function isSortParam(s: string): s is SortKey {
  return (SORT_PARAM_KEYS as readonly string[]).includes(s);
}

export default function ListingsPage() {
  const allProjects   = useRef<Project[]>([]);
  const [displayed,   setDisplayed]   = useState<Project[]>([]);
  const [loading,     setLoading]     = useState(!getProjectsCache());
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState(false);
  const filteredRef   = useRef<Project[]>([]);
  const pageRef       = useRef(0);

  // ── filter state ──
  const [search,      setSearch]      = useState("");
  const [sortBy,      setSortBy]      = useState<SortKey>("default");
  const [filterType,  setFilterType]  = useState<string | null>(null);
  const [filterCity,  setFilterCity]  = useState<string | null>(null);
  const [filterStatus,setFilterStatus]= useState<string | null>(null);
  const [filterPriceRange, setFilterPriceRange] = useState<string | null>(null);
  const [filterBuilder, setFilterBuilder] = useState<string | null>(null);
  const [dropdown,    setDropdown]    = useState<DropdownKey>(null);
  const [routeContextTag, setRouteContextTag] = useState<string | null>(null);


  const searchParams     = useLocalSearchParams<{
    city?: string;
    tag?: string;
    priceRange?: string;
    sort?: string;
    search?: string;
    builder?: string;
  }>();
  const paramCity        = firstStringParam(searchParams.city);
  const paramTag         = firstStringParam(searchParams.tag) ?? null;
  const paramPriceRange  = firstStringParam(searchParams.priceRange) ?? null;
  const paramSort        = firstStringParam(searchParams.sort) ?? null;
  const paramSearch      = firstStringParam(searchParams.search) ?? null;
  const paramBuilder     = firstStringParam(searchParams.builder) ?? null;

  const lastRouteSig     = useRef<string>("");

  // ── unique filter values (derived once data loads) ──
  const [cities,   setCities]   = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [builders, setBuilders] = useState<string[]>([]);


  /* Home: /listings?city&tag&priceRange&sort&search — apply when params change (see Clear → lastRouteSig). */
  useEffect(() => {
    const sig = `${paramCity ?? ""}|${paramTag ?? ""}|${paramPriceRange ?? ""}|${paramSort ?? ""}|${paramSearch ?? ""}|${paramBuilder ?? ""}`;
    const hasRoute = !!(paramCity || paramTag || paramPriceRange || paramSort || paramSearch || paramBuilder);
    if (!hasRoute) return;
    if (lastRouteSig.current === sig) return;
    if (!cities.length) return;
    lastRouteSig.current = sig;


    if (paramSort && isSortParam(paramSort)) {
      setSortBy(paramSort);
    }
    if (paramCity) {
      const resolved = resolveCityFromParam(paramCity, cities);
      if (resolved) setFilterCity(resolved);
    }
    if (paramTag) {
      if (isHomePropertyTypeTag(paramTag)) {
        setFilterType(paramTag);
        setRouteContextTag(null);
      } else {
        setRouteContextTag(paramTag);
      }
    }
    if (paramPriceRange) {
      setFilterPriceRange(paramPriceRange);
    }
    if (paramSearch) {
      setSearch(paramSearch);
    }
    if (paramBuilder) {
      setFilterBuilder(paramBuilder);
    }
  }, [cities, paramCity, paramTag, paramPriceRange, paramSort, paramSearch, paramBuilder]);


  useEffect(() => {
    const cached = getProjectsCache();
    if (cached) {
      allProjects.current = cached;
      setCities([...new Set(cached.map((p) => p.cityName).filter(Boolean))].sort());
      setStatuses([...new Set(cached.map((p) => p.projectStatusName).filter(Boolean))].sort());
      setBuilders([...new Set(cached.map((p) => p.builderName).filter(Boolean))].sort());
      applyFilters(cached, "", "default", null, null, null, null, null);
      return;
    }
    fetchProjects()
      .then((data) => {
        allProjects.current = data;
        setCities([...new Set(data.map((p) => p.cityName).filter(Boolean))].sort());
        setStatuses([...new Set(data.map((p) => p.projectStatusName).filter(Boolean))].sort());
        setBuilders([...new Set(data.map((p) => p.builderName).filter(Boolean))].sort());
        applyFilters(data, "", "default", null, null, null, null, null);
      })

      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── apply all filters + sort ──
  function applyFilters(
    all: Project[],
    q: string,
    sort: SortKey,
    type: string | null,
    city: string | null,
    status: string | null,
    homePriceRange: string | null,
    builder: string | null
  ) {
    const q2 = q.toLowerCase().trim();
    let result = all.filter((p) => {
      if (q2) {
        const hay = `${p.projectName} ${p.cityName} ${p.projectLocality} ${p.builderName} ${p.projectConfiguration}`.toLowerCase();
        if (!hay.includes(q2)) return false;
      }
      if (type && !projectMatchesHomeTypeTag(p, type)) return false;
      if (city   && p.cityName          !== city)   return false;
      if (status && p.projectStatusName !== status) return false;
      if (builder && p.builderName !== builder) return false;
      if (homePriceRange && !projectMatchesHomePriceRange(p.projectPrice, homePriceRange)) {

        return false;
      }
      return true;
    });

    if (sort === "price_asc")  result = [...result].sort((a, b) => parseFloat(a.projectPrice) - parseFloat(b.projectPrice));
    if (sort === "price_desc") result = [...result].sort((a, b) => parseFloat(b.projectPrice) - parseFloat(a.projectPrice));
    if (sort === "name_asc")   result = [...result].sort((a, b) => a.projectName.localeCompare(b.projectName));
    if (sort === "name_desc")  result = [...result].sort((a, b) => b.projectName.localeCompare(a.projectName));

    filteredRef.current = result;
    pageRef.current = 1;
    const firstPage = result.slice(0, PAGE_SIZE);
    setDisplayed(firstPage);
    // Warm the disk cache for the visible page so tiles render instantly.
    prefetchProjectImages(firstPage, PAGE_SIZE);
  }

  // re-apply whenever any filter changes
  useEffect(() => {
    if (!allProjects.current.length) return;
    applyFilters(
      allProjects.current,
      search,
      sortBy,
      filterType,
      filterCity,
      filterStatus,
      filterPriceRange,
      filterBuilder
    );
  }, [search, sortBy, filterType, filterCity, filterStatus, filterPriceRange, filterBuilder]);


  const loadMore = useCallback(() => {
    const total = filteredRef.current.length;
    const nextStart = pageRef.current * PAGE_SIZE;
    if (nextStart >= total || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const chunk = filteredRef.current.slice(nextStart, nextStart + PAGE_SIZE);
      setDisplayed((prev) => [...prev, ...chunk]);
      pageRef.current += 1;
      setLoadingMore(false);
      // Prefetch thumbnails for the chunk the user is about to scroll into.
      prefetchProjectImages(chunk, PAGE_SIZE);
    }, 80);
  }, [loadingMore]);
  const activeFilterCount = [
    filterType,
    filterCity,
    filterStatus,
    filterPriceRange,
    filterBuilder
  ].filter(Boolean).length;



  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedProjectLink, setSelectedProjectLink] = useState("");

  const handleEnquiryPress = useCallback((link: string) => {
    setSelectedProjectLink(link);
    setShowContactModal(true);
  }, []);

  const renderCard = useCallback(
    ({ item }: { item: Project }) => (
      <PropertyCard 
        item={item} 
        onEnquiryPress={handleEnquiryPress} 
      />
    ),
    [handleEnquiryPress]
  );

  // ── list header ──
  const ListHeader = useMemo(() => (
    <View>
      {/* Top bar */}
      <View className={styles.header}>
        <TouchableOpacity className={styles.circleBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <View className={styles.searchBox}>
          <Feather name="search" size={16} color="#999" />
          <TextInput
            placeholder="Search project, city, locality…"
            placeholderTextColor="#999"
            className={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className={styles.filterScroll} contentContainerStyle={{ paddingRight: 4 }}>
        {/* Sort */}
        <TouchableOpacity
          onPress={() => setDropdown(prev => prev === "sort" ? null : "sort")}

          className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${sortBy !== "default" ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"}`}
        >
          <Ionicons name="swap-vertical-outline" size={13} color={sortBy !== "default" ? "#fff" : "#475569"} />
          <Text className={`text-xs font-semibold ml-1 ${sortBy !== "default" ? "text-white" : "text-slate-700"}`}>
            {sortBy !== "default" ? SORT_OPTIONS.find(s => s.key === sortBy)?.label.split(":")[0] : "Sort"}
          </Text>
          <Ionicons name="chevron-down" size={11} color={sortBy !== "default" ? "#fff" : "#94a3b8"} style={{ marginLeft: 2 }} />
        </TouchableOpacity>

        {/* Type */}
        <TouchableOpacity
          onPress={() => setDropdown(prev => prev === "type" ? null : "type")}

          className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${filterType ? "bg-[#d89b38] border-[#d89b38]" : "bg-white border-slate-200"}`}
        >
          <Text className={`text-xs font-semibold ${filterType ? "text-white" : "text-slate-700"}`}>
            {filterType ?? "Property Type"}
          </Text>
          <Ionicons name="chevron-down" size={11} color={filterType ? "#fff" : "#94a3b8"} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {/* City */}
        <TouchableOpacity
          onPress={() => setDropdown(prev => prev === "city" ? null : "city")}

          className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${filterCity ? "bg-[#d89b38] border-[#d89b38]" : "bg-white border-slate-200"}`}
        >
          <Ionicons name="location-outline" size={13} color={filterCity ? "#fff" : "#475569"} />
          <Text className={`text-xs font-semibold ml-1 ${filterCity ? "text-white" : "text-slate-700"}`}>
            {filterCity ?? "City"}
          </Text>
          <Ionicons name="chevron-down" size={11} color={filterCity ? "#fff" : "#94a3b8"} style={{ marginLeft: 2 }} />
        </TouchableOpacity>

        {/* Status */}
        <TouchableOpacity
          onPress={() => setDropdown(prev => prev === "status" ? null : "status")}

          className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${filterStatus ? "bg-[#d89b38] border-[#d89b38]" : "bg-white border-slate-200"}`}
        >
          <Text className={`text-xs font-semibold ${filterStatus ? "text-white" : "text-slate-700"}`}>
            {filterStatus ?? "Status"}
          </Text>
          <Ionicons name="chevron-down" size={11} color={filterStatus ? "#fff" : "#94a3b8"} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {/* Builder */}
        <TouchableOpacity
          onPress={() => setDropdown(prev => prev === "builder" ? null : "builder")}

          className={`flex-row items-center px-4 py-2 rounded-full border mr-2 ${filterBuilder ? "bg-[#d89b38] border-[#d89b38]" : "bg-white border-slate-200"}`}
        >
          <Text className={`text-xs font-semibold ${filterBuilder ? "text-white" : "text-slate-700"}`}>
            {filterBuilder ?? "Builder"}
          </Text>
          <Ionicons name="chevron-down" size={11} color={filterBuilder ? "#fff" : "#94a3b8"} style={{ marginLeft: 4 }} />
        </TouchableOpacity>


        {/* Clear all */}
        {(activeFilterCount > 0 || sortBy !== "default") && (
          <TouchableOpacity
            onPress={() => {
              setFilterType(null);
              setFilterCity(null);
              setFilterStatus(null);
              setFilterPriceRange(null);
              setFilterBuilder(null);
              setSortBy("default");
              setRouteContextTag(null);
              lastRouteSig.current = `${paramCity ?? ""}|${paramTag ?? ""}|${paramPriceRange ?? ""}|${paramSort ?? ""}|${paramBuilder ?? ""}`;
            }}

            className={styles.clearBtn}
          >
            <Ionicons name="close" size={13} color="#ef4444" />
            <Text className={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Result count */}
      <Text className={styles.resultText}>
        {filteredRef.current.length} RESULTS
        {filterCity ? ` in ${filterCity}` : ""}
        {filterPriceRange ? ` · ${filterPriceRange}` : ""}
        {routeContextTag ? ` · ${routeContextTag}` : ""}
        {filterType ? ` · ${filterType}` : ""}
        {filterStatus ? ` · ${filterStatus}` : ""}
        {filterBuilder ? ` · ${filterBuilder}` : ""}
        {search ? ` · "${search}"` : ""}
      </Text>


      {displayed.length === 0 && !loading && (
        <View className={styles.emptyWrap}>
          <Ionicons name="search-outline" size={48} color="#cbd5e1" />
          <Text className={styles.emptyTitle}>No properties found</Text>
          <Text className={styles.emptySubtitle}>Try a different search or clear filters</Text>
        </View>
      )}
    </View>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [search, sortBy, filterType, filterCity, filterStatus, filterPriceRange, filterBuilder, routeContextTag, paramCity, paramTag, paramPriceRange, paramBuilder, displayed.length, loading]);



  // Stable reference for viewability tracking to prevent FlatList crashes
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    viewableItems.forEach(({ item }: any) => {
      fetchProjectDetail(item.slugURL);
    });
  }).current;

  if (loading) {
    return (
      <View className={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#d89b38" />
        <Text className={styles.loadingText}>Loading properties…</Text>
      </View>
    );
  }
  return (
    <View className={styles.pageShell}>
      <FlatList
        data={displayed}
        keyExtractor={keyExtractor}
        renderItem={renderCard}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={
          loadingMore ? (
            <View className={styles.footerWrap}>
              <ActivityIndicator size="small" color="#d89b38" />
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 48, paddingBottom: 40 }}
        removeClippedSubviews={Platform.OS === "android"}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={30}
        windowSize={9}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      {/* ── Dropdown Modal ── */}
      <Modal visible={dropdown !== null} transparent animationType="fade" onRequestClose={() => setDropdown(null)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} onPress={() => setDropdown(null)}>
          <View style={{ position: "absolute", top: 160, left: 16, right: 16, backgroundColor: "#fff", borderRadius: 20, paddingVertical: 8, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }}>

            {/* Sort */}
            {dropdown === "sort" && (
              <View>
                <Text style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, fontWeight: "700", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>SORT BY</Text>
                {SORT_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => { setSortBy(opt.key); setDropdown(null); }}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: "#f8fafc" }}
                  >
                    <Text style={{ fontSize: 14, color: sortBy === opt.key ? "#d89b38" : "#1e293b", fontWeight: sortBy === opt.key ? "700" : "400" }}>{opt.label}</Text>
                    {sortBy === opt.key && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Type */}
            {dropdown === "type" && (
              <View>
                <Text style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, fontWeight: "700", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>PROPERTY TYPE</Text>
                {HOME_PROPERTY_TYPE_OPTIONS.map((t, i) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => { setFilterType(t); setDropdown(null); }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 16,
                      paddingVertical: 15,
                      borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
                      borderTopColor: "#e2e8f0",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: filterType === t ? "#d89b38" : "#0f172a", fontWeight: filterType === t ? "700" : "500" }}>{t}</Text>
                    {filterType === t && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* City */}
            {dropdown === "city" && (
              <View>
                <Text style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, fontWeight: "700", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>CITY</Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  <TouchableOpacity
                    onPress={() => { setFilterCity(null); setDropdown(null); }}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: "#f8fafc" }}
                  >
                    <Text style={{ fontSize: 14, color: !filterCity ? "#d89b38" : "#1e293b", fontWeight: !filterCity ? "700" : "400" }}>All Cities</Text>
                    {!filterCity && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                  </TouchableOpacity>
                  {cities.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => { setFilterCity(c); setDropdown(null); }}
                      style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: "#f8fafc" }}
                    >
                      <Text style={{ fontSize: 14, color: filterCity === c ? "#d89b38" : "#1e293b", fontWeight: filterCity === c ? "700" : "400" }}>{c}</Text>
                      {filterCity === c && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Status */}
            {dropdown === "status" && (
              <View>
                <Text style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, fontWeight: "700", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>STATUS</Text>
                <TouchableOpacity
                  onPress={() => { setFilterStatus(null); setDropdown(null); }}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: "#f8fafc" }}
                >
                  <Text style={{ fontSize: 14, color: !filterStatus ? "#d89b38" : "#1e293b", fontWeight: !filterStatus ? "700" : "400" }}>All Statuses</Text>
                  {!filterStatus && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                </TouchableOpacity>
                {statuses.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => { setFilterStatus(s); setDropdown(null); }}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderTopWidth: 1, borderTopColor: "#f8fafc" }}
                  >
                    <Text style={{ fontSize: 14, color: filterStatus === s ? "#d89b38" : "#1e293b", fontWeight: filterStatus === s ? "700" : "400" }}>{s}</Text>
                    {filterStatus === s && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Builder */}
            {dropdown === "builder" && (
              <View>
                <Text style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, fontWeight: "700", fontSize: 13, color: "#94a3b8", letterSpacing: 0.5 }}>BUILDER</Text>
                <FlatList
                  data={builders}
                  keyExtractor={(item) => item}
                  style={{ maxHeight: 350 }}
                  initialNumToRender={15}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  ListHeaderComponent={
                    <TouchableOpacity
                      onPress={() => { setFilterBuilder(null); setDropdown(null); }}
                      style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#f8fafc" }}
                    >
                      <Text style={{ fontSize: 14, color: !filterBuilder ? "#d89b38" : "#1e293b", fontWeight: !filterBuilder ? "700" : "400" }}>All Builders</Text>
                      {!filterBuilder && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                    </TouchableOpacity>
                  }
                  renderItem={({ item: b }) => (
                    <TouchableOpacity
                      onPress={() => { setFilterBuilder(b); setDropdown(null); }}
                      style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#f8fafc" }}
                    >
                      <Text style={{ fontSize: 14, color: filterBuilder === b ? "#d89b38" : "#1e293b", fontWeight: filterBuilder === b ? "700" : "400" }}>{b}</Text>
                      {filterBuilder === b && <Ionicons name="checkmark" size={18} color="#d89b38" />}
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}


          </View>

        </Pressable>
      </Modal>

      <ContactFormModal
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
        pageName="listing page"
        projectLink={selectedProjectLink}
      />
    </View>
  );
}
