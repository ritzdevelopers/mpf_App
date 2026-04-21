// components/PropertyDetail/index.tsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./PropertyDetailsUI";
import { IMAGE_BASE_URL, type Project } from "@/utils/api";

export default function PropertyDetail({ project }: { project: Project | null }) {
  if (!project) {
    return (
      <View className="flex-1 items-center justify-center bg-[#050816]">
        <Text className="text-slate-400 text-base">Property not found.</Text>
      </View>
    );
  }

  const configurations = project.projectConfiguration
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <View className={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View className={styles.imageWrapper}>
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${project.projectBannerImage}` }}
            className={styles.banner}
          />

          <View className={styles.overlay} />

          <TouchableOpacity className={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity className={styles.shareBtn}>
            <Ionicons name="share-social" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity className={styles.likeBtn}>
            <Ionicons name="heart-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <View className={styles.tagRow}>
            <Text className={styles.blueTag}>
              {project.propertyTypeName.toUpperCase()}
            </Text>
            <Text className={styles.greenTag}>
              {project.projectStatusName.toUpperCase()}
            </Text>
          </View>

          <View className={styles.floatingCard}>
            <Text className={styles.title}>{project.projectName}</Text>
            <Text className={styles.price}>₹{project.projectPrice} Cr</Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={14} color="#cbd5e1" />
              <Text className={styles.location}>{project.projectAddress}</Text>
            </View>
          </View>
        </View>

        {/* QUICK STATS */}
        <View className={styles.infoCard}>
          <View className={styles.featureRow}>
            <View className={styles.featureBox}>
              <Ionicons name="business-outline" size={20} color="#60a5fa" />
              <Text className={styles.featureLabel}>Type</Text>
              <Text className={styles.featureValue}>{project.propertyTypeName}</Text>
            </View>

            <View className={styles.featureBox}>
              <Ionicons name="location-outline" size={20} color="#60a5fa" />
              <Text className={styles.featureLabel}>City</Text>
              <Text className={styles.featureValue}>{project.cityName}</Text>
            </View>

            <View className={styles.featureBox}>
              <Ionicons name="construct-outline" size={20} color="#60a5fa" />
              <Text className={styles.featureLabel}>Status</Text>
              <Text className={styles.featureValue} numberOfLines={2}>
                {project.projectStatusName}
              </Text>
            </View>
          </View>
        </View>

        {/* CONFIGURATION */}
        {configurations.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>Configurations</Text>
            <View className={styles.amenityRow}>
              {configurations.map((config, i) => (
                <View key={i} className={styles.amenityBox}>
                  <Text className={styles.amenityText}>{config}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* OVERVIEW */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>Property Overview</Text>
          <View className={styles.grid}>
            <View className={styles.gridItem}>
              <Text className={styles.gridLabel}>Locality</Text>
              <Text className={styles.gridValue}>{project.projectLocality}</Text>
            </View>

            <View className={styles.gridItem}>
              <Text className={styles.gridLabel}>Builder</Text>
              <Text className={styles.gridValue}>{project.builderName}</Text>
            </View>

            <View className={styles.gridItem}>
              <Text className={styles.gridLabel}>Starting Price</Text>
              <Text className={styles.gridValue}>₹{project.projectPrice} Cr</Text>
            </View>

            <View className={styles.gridItem}>
              <Text className={styles.gridLabel}>Address</Text>
              <Text className={styles.gridValue}>{project.projectAddress}</Text>
            </View>
          </View>
        </View>

        {/* CONTACT */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>Contact Details</Text>
          <View className={styles.contactRow}>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${project.projectLogo}` }}
              className={styles.avatar}
            />

            <View className="flex-1">
              <Text className={styles.owner}>{project.builderName}</Text>
              <Text className={styles.ownerSub}>{project.cityName}</Text>
            </View>

            <TouchableOpacity className={styles.chatBtn}>
              <Text className={styles.chatText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-28" />
      </ScrollView>

      {/* BOTTOM CTA */}
      <View className={styles.bottomBar}>
        <TouchableOpacity className={styles.iconBtn}>
          <Ionicons name="call" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity className={styles.iconBtn}>
          <Ionicons name="logo-whatsapp" size={20} color="#22c55e" />
        </TouchableOpacity>

        <TouchableOpacity className={styles.visitBtn}>
          <Text className={styles.visitText}>Book Site Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
