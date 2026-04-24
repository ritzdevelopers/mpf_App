import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./NewLaunchesUI";

const data = [
  {
    id: 1,
    name: "Fab Luxe Residences",
    location: "Sector 4, Noida Extension",
    price: "₹ 3 Cr",
    bhk: "3, 4 BHK",
    tag: "NEW LAUNCH",
    tagColor: "#16a34a",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800",
  },
  {
    id: 2,
    name: "Sobha Rivana",
    location: "Sector 1, Noida Extension",
    price: "₹ 2.08 Cr",
    bhk: "2, 3, 4 BHK",
    tag: "NEW LAUNCH",
    tagColor: "#16a34a",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800",
  },
  {
    id: 3,
    name: "DLF The Camellias",
    location: "Golf Course Road, Gurgaon",
    price: "₹ 12.5 Cr",
    bhk: "4, 5 BHK",
    tag: "ULTRA LUXURY",
    tagColor: "#d89b38",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  },
  {
    id: 4,
    name: "Godrej Aristocrat",
    location: "Sector 49, Gurgaon",
    price: "₹ 4.5 Cr",
    bhk: "3, 4 BHK",
    tag: "TRENDING",
    tagColor: "#ef4444",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",
  },
  {
    id: 5,
    name: "M3M Golf Estate",
    location: "Sector 65, Gurgaon",
    price: "₹ 5.8 Cr",
    bhk: "3, 4 BHK",
    tag: "NEW LAUNCH",
    tagColor: "#16a34a",
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800",
  },
  {
    id: 6,
    name: "Lodha Bellagio",
    location: "Powai, Mumbai",
    price: "₹ 6.2 Cr",
    bhk: "2, 3, 4 BHK",
    tag: "PREMIUM",
    tagColor: "#9333ea",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
  },
];

export default function NewLaunches() {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View className={styles.container}>
      {/* ── Section heading ───────────────────────── */}
      <View className={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View className={styles.titleRow}>
            <View className={styles.titleIcon}>
              <Ionicons name="rocket" size={14} color="#16a34a" />
            </View>
            <Text className={styles.title}>New Launches</Text>
          </View>
          <Text className={styles.subtitle}>
            Be the first to explore brand-new projects
          </Text>
        </View>

        <TouchableOpacity
          className={styles.viewAllBtn}
          activeOpacity={0.85}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text className={styles.viewAllText}>View all</Text>
          <Ionicons name="arrow-forward" size={12} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* ── Carousel ──────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
        decelerationRate="fast"
        snapToInterval={252}
        snapToAlignment="start"
      >
        {data.map((item) => {
          const isLiked = liked.has(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.92}
              className={styles.card}
              style={styles.cardShadow}
            >
              {/* Hero image */}
              <View className={styles.imageWrap}>
                <Image
                  source={{ uri: item.image }}
                  className={styles.image}
                  resizeMode="cover"
                />

                <View pointerEvents="none" style={styles.imageInsetGlow} />

               

                <TouchableOpacity
                  className={styles.heartBtn}
                  activeOpacity={0.8}
                  onPress={() => toggle(item.id)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={styles.glassHeart}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={15}
                    color={isLiked ? "#ef4444" : "#fff"}
                  />
                </TouchableOpacity>
              </View>

              {/* Info — solid frosted look (expo-blur not supported in Expo Go) */}
              <View className={styles.info} style={styles.infoGlass}>
                <View className={styles.infoTopRow}>
                  <View className={styles.titleWrap}>
                    <Text className={styles.projectName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <View className={styles.locationRow}>
                      <Ionicons
                        name="location-outline"
                        size={11}
                        color="#94a3b8"
                      />
                      <Text className={styles.location} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    className={styles.actionBtn}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color="#0f172a"
                    />
                  </TouchableOpacity>
                </View>

                <View className={styles.bottomRow}>
                  <View>
                    <Text className={styles.startFrom}>Starts at</Text>
                    <Text className={styles.price}>{item.price}</Text>
                  </View>

                  <View className={styles.rightMeta}>
                    <View className={styles.bhkChip}>
                      <Text className={styles.bhkText}>{item.bhk}</Text>
                    </View>
                    <Text className={styles.availabilityText}>
                      Limited inventory
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
