import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./TopPickCardUI";

export default function TopPickCard() {
  const [liked, setLiked] = useState(false);

  return (
    <View className={styles.container}>
      {/* ── Section heading ───────────────────────── */}
      <View className={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View className={styles.titleRow}>
            <View className={styles.titleIcon}>
              <Ionicons name="sparkles" size={14} color="#d89b38" />
            </View>
            <Text className={styles.title}>Top Picks For You</Text>
          </View>
          <Text className={styles.subtitle}>
            Handpicked premium homes worth your time
          </Text>
        </View>

        <TouchableOpacity
          className={styles.seeAllBtn}
          activeOpacity={0.85}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text className={styles.seeAllText}>See all</Text>
          <Ionicons name="arrow-forward" size={12} color="#b45309" />
        </TouchableOpacity>
      </View>

      {/* ── The card ──────────────────────────────── */}
      <View className={styles.card} style={styles.cardShadow}>
        {/* Hero image with overlays */}
        <View className={styles.imageWrap}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200",
            }}
            className={styles.image}
            resizeMode="cover"
          />

          {/* TOP PICK badge */}
          <View className={styles.badge}>
            <View className={styles.badgeIconWrap}>
              <Ionicons name="trophy" size={11} color="#fff" />
            </View>
            <Text className={styles.badgeText}>TOP PICK</Text>
          </View>

          {/* Heart toggle */}
          <TouchableOpacity
            className={styles.heartBtn}
            activeOpacity={0.8}
            onPress={() => setLiked((v) => !v)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={18}
              color={liked ? "#ef4444" : "#fff"}
            />
          </TouchableOpacity>

          {/* Gallery-count pill */}
          <View className={styles.galleryChip}>
            <Ionicons name="images-outline" size={11} color="#fff" />
            <Text className={styles.galleryText}>24 photos</Text>
          </View>

          {/* Property name + location over the image */}
          <View className={styles.overlayContent}>
            <Text className={styles.propertyName}>Eldeco Camelot</Text>
            <View className={styles.locationRow}>
              <Ionicons name="location" size={12} color="#fbbf24" />
              <Text className={styles.location}>Sector 17 Dwarka, Delhi</Text>
            </View>
          </View>
        </View>

        {/* Info block */}
        <View className={styles.infoWrap}>
          {/* Builder row */}
          <View className={styles.builderRow}>
            <View className={styles.logoWrap}>
              <Text className={styles.logoLetter}>E</Text>
            </View>

            <View className={styles.builderTextWrap}>
              <View className={styles.builderNameRow}>
                <Text className={styles.builderName}>Eldeco</Text>
                <View className={styles.verifiedPill}>
                  <Ionicons name="checkmark-circle" size={10} color="#2563eb" />
                  <Text className={styles.verifiedText}>Verified</Text>
                </View>
              </View>
              <Text className={styles.viewProject}>
                View all Eldeco projects
              </Text>
            </View>

            <View className={styles.ratingChip}>
              <Ionicons name="star" size={11} color="#d89b38" />
              <Text className={styles.ratingText}>4.6</Text>
            </View>
          </View>

          {/* Price card */}
          <View className={styles.priceBox}>
            <View className={styles.priceColLeft}>
              <Text className={styles.startFrom}>Starting From</Text>
              <Text className={styles.price}>₹ 7.42 Cr*</Text>
            </View>
            <View className={styles.priceDivider} />
            <View>
              <Text className={styles.startFrom}>EMI from</Text>
              <Text className={styles.emi}>₹ 5.8 L/mo</Text>
            </View>
          </View>

          {/* Feature chips */}
          <View className={styles.chipsRow}>
            <View className={styles.chipBhk}>
              <Ionicons name="bed-outline" size={12} color="#475569" />
              <Text className={styles.chipBhkText}>3 BHK</Text>
            </View>
            <View className={styles.chipBhk}>
              <Ionicons name="bed-outline" size={12} color="#475569" />
              <Text className={styles.chipBhkText}>4 BHK</Text>
            </View>
            <View className={styles.chipRera}>
              <Ionicons name="shield-checkmark" size={12} color="#16a34a" />
              <Text className={styles.chipReraText}>RERA</Text>
            </View>
            <View className={styles.chipDate}>
              <Ionicons name="calendar-outline" size={12} color="#b45309" />
              <Text className={styles.chipDateText}>Poss. Dec 2026</Text>
            </View>
          </View>

          {/* CTAs */}
          <View className={styles.ctaRow}>
            <TouchableOpacity
              className={styles.buttonOutline}
              activeOpacity={0.85}
            >
              <Ionicons name="call-outline" size={15} color="#0f172a" />
              <Text className={styles.buttonOutlineText}>Enquire</Text>
            </TouchableOpacity>

            <TouchableOpacity className={styles.button} activeOpacity={0.85}>
              <Text className={styles.buttonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
