// components/Header/index.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ALL_CITY_NAMES } from "@/data/allCitiesCards";
import { HOME_PROPERTY_TYPE_OPTIONS } from "@/utils/homePropertyTypeTags";
import { styles } from "./hederUi";
const LOCATIONS: string[] = [...ALL_CITY_NAMES];
const PRICE_RANGES = ["Up to 1 Cr", "1–3 Cr", "3–5 Cr", "Above 5 Cr"];

export default function Header() {
  const insets = useSafeAreaInsets();
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [modal, setModal] = useState<"type" | "location" | "price" | null>(null);

  const openModal = (m: typeof modal) => setModal(m);
  const closeModal = () => setModal(null);

  const onSearch = () => {
    const params: Record<string, string> = {};
    if (location) params.city = location;
    if (propertyType) params.tag = propertyType;
    if (priceRange) params.priceRange = priceRange;
    if (Object.keys(params).length > 0) {
      router.push({ pathname: "/listings", params });
    } else {
      router.push("/listings");
    }
  };

  const options =
    modal === "type"
      ? [...HOME_PROPERTY_TYPE_OPTIONS]
      : modal === "location"
        ? LOCATIONS
        : modal === "price"
          ? PRICE_RANGES
          : [];

  const onPick = (value: string) => {
    if (modal === "type") setPropertyType(value);
    if (modal === "location") setLocation(value);
    if (modal === "price") setPriceRange(value);
    closeModal();
  };

  return (
    <View className={styles.container}>
      <View className={styles.banner}>
        <Image
          source={require("@/assets/images/mpf_generic_banner_tab.jpg")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View className={styles.overlay}>
          <Text className={styles.heading}>ISHVARA</Text>
          <Text className={styles.subHeading}>FOUR SIDE OPEN LIVING</Text>
        </View>
      </View>

      {/* Same overlap & horizontal inset as before: mx-4 -mt-4 */}
      <View className="mx-4 -mt-4 z-10" style={stylesGlass.shell}>
        <View style={stylesGlass.filtersRow}>
          <TouchableOpacity
            style={stylesGlass.field}
            activeOpacity={0.88}
            onPress={() => openModal("type")}
          >
            <Text style={stylesGlass.fieldText} numberOfLines={1}>
              {propertyType ?? "Property Type"}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesGlass.field}
            activeOpacity={0.88}
            onPress={() => openModal("location")}
          >
            <Text style={stylesGlass.fieldText} numberOfLines={1}>
              {location ?? "Select Location"}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesGlass.field}
            activeOpacity={0.88}
            onPress={() => openModal("price")}
          >
            <Text style={stylesGlass.fieldText} numberOfLines={1}>
              {priceRange ?? "Price Range"}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#64748b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={stylesGlass.searchBtn}
          activeOpacity={0.9}
          onPress={onSearch}
        >
          <Text style={stylesGlass.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modal !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={stylesGlass.modalBackdrop} onPress={closeModal}>
          <Pressable
            style={[
              stylesGlass.modalSheet,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={stylesGlass.modalTitle}>
              {modal === "type"
                ? "Property type"
                : modal === "location"
                  ? "Location"
                  : "Price range"}
            </Text>
            {modal === "type" ? (
              <View>
                {HOME_PROPERTY_TYPE_OPTIONS.map((o, i) => (
                  <TouchableOpacity
                    key={o}
                    style={[
                      stylesGlass.modalRow,
                      i > 0 && stylesGlass.modalRowDivider,
                    ]}
                    onPress={() => onPick(o)}
                    activeOpacity={0.7}
                  >
                    <Text style={stylesGlass.modalRowText}>{o}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 280 }}>
                {options.map((o) => (
                  <TouchableOpacity
                    key={o}
                    style={stylesGlass.modalRow}
                    onPress={() => onPick(o)}
                  >
                    <Text style={stylesGlass.modalRowText}>{o}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const stylesGlass = StyleSheet.create({
  shell: {
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  /* Three equal columns — price is never hidden behind Search */
  filtersRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 10,
  },
  field: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 11,
  },
  fieldText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
    flexShrink: 1,
    marginRight: 4,
  },
  searchBtn: {
    backgroundColor: "#166534",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  searchBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.6,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  modalRow: {
    paddingVertical: 15,
  },
  modalRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e2e8f0",
  },
  modalRowText: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
  },
});
