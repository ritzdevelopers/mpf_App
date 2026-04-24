import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchProjects,
  getImageUrl,
  getProjectsCache,
  type Project,
} from "@/utils/api";
import { projectMatchesHomeTypeTag } from "@/utils/homePropertyTypeTags";
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
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const openListings = useCallback(openNewLaunchesListings, []);

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

  const toggle = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
          className={styles.viewAllBtn}
          activeOpacity={0.85}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onPress={openListings}
        >
          <Text className={styles.viewAllText}>View all</Text>
          <Ionicons name="arrow-forward" size={12} color="#059669" />
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
            const isLiked = liked.has(item.id);
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
