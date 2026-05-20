import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchProjects,
  getImageUrl,
  getProjectsCache,
  type Project,
} from "@/utils/api";
import { projectMatchesHomeTypeTag } from "@/utils/homePropertyTypeTags";
import { useFavorites, toggleFavorite } from "@/utils/favoritesStore";
import { styles } from "./NewLaunchesUI";

const MAX_CARDS = 8;
const IMAGE_H = 208;

function newLaunchProjects(list: Project[]): Project[] {
  return list
    .filter((p) => projectMatchesHomeTypeTag(p, "New Launches"))
    .filter((p) => p.projectThumbnailImage);
}

function formatLocation(p: Project): string {
  const a = p.projectLocality?.trim();
  const b = p.cityName?.trim();
  if (a && b) return `${a}, ${b}`;
  return a || b || "";
}

function openNewLaunchesListings() {
  router.push({
    pathname: "/listings" as any,
    params: { tag: "New Launches", sort: "name_asc" },
  });
}

export default function NewLaunches() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const favorites = useFavorites();

  const openListings = useCallback(openNewLaunchesListings, []);
  const viewAllScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cached = getProjectsCache();
    if (cached?.length) {
      setProjects(newLaunchProjects(cached).slice(0, MAX_CARDS));
      setLoading(false);
      return;
    }
    fetchProjects()
      .then((data) => {
        setProjects(newLaunchProjects(data).slice(0, MAX_CARDS));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const goToProject = useCallback((slug: string) => {
    router.push(`/propertyDetail/${slug}` as any);
  }, []);


  if (!loading && projects.length === 0) {
    return null;
  }

  return (
    <View className={styles.container}>
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
          activeOpacity={1}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onPress={openListings}
          onPressIn={() => Animated.spring(viewAllScale, { toValue: 0.82, useNativeDriver: true, speed: 40, bounciness: 10 }).start()}
          onPressOut={() => Animated.spring(viewAllScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }).start()}
        >
          <Animated.View style={{ transform: [{ scale: viewAllScale }], flexDirection: "row", alignItems: "center" }}>
            <Text className={styles.viewAllText}>View all</Text>
            <Ionicons name="chevron-forward" size={12} color="#059669" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{ height: 320, paddingHorizontal: 16 }}
          className="items-center justify-center"
        >
          <ActivityIndicator size="large" color="#059669" />
          <Text className="text-xs text-slate-500 mt-3">Loading projects…</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          decelerationRate="fast"
          snapToInterval={252}
          snapToAlignment="start"
        >
          {projects.map((item) => {
            const uri = getImageUrl(item.slugURL, item.projectThumbnailImage);
            const loc = formatLocation(item);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.92}
                className={styles.card}
                style={styles.cardShadow}
                onPress={() => goToProject(item.slugURL)}
              >
                <View className={styles.imageWrap}>
                  {uri ? (
                    <Image
                      source={{ uri }}
                      style={{ width: "100%", height: IMAGE_H }}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                      transition={200}
                    />
                  ) : (
                    <View
                      style={{ height: IMAGE_H, backgroundColor: "#e2e8f0" }}
                      className="w-full"
                    />
                  )}

                  <View pointerEvents="none" style={styles.imageInsetGlow} />
                </View>

                <View className={styles.info} style={styles.infoGlass}>
                  <View className={styles.infoTopRow}>
                    <View className={styles.titleWrap}>
                      <Text className={styles.projectName} numberOfLines={1}>
                        {item.projectName}
                      </Text>

                      {loc ? (
                        <View className={styles.locationRow}>
                          <Ionicons
                            name="location-outline"
                            size={11}
                            color="#94a3b8"
                          />
                          <Text className={styles.location} numberOfLines={1}>
                            {loc}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      className={styles.actionBtn}
                      onPress={() => goToProject(item.slugURL)}
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
                      <Text className={styles.price}>
                        ₹{item.projectPrice} Cr
                      </Text>
                    </View>

                    <View className={styles.rightMeta}>
                      {!!item.projectConfiguration && (
                        <View className={styles.bhkChip}>
                          <Text className={styles.bhkText} numberOfLines={1}>
                            {item.projectConfiguration}
                          </Text>
                        </View>
                      )}
                      <Text className={styles.availabilityText}>
                        {item.projectStatusName || " "}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
