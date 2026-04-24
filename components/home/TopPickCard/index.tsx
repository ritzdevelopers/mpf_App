import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
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
import { styles } from "./TopPickCardUI";

const LINK_NAVY = "#1e3a5f";
const HERO_H = 384;

/** Featured project: Eldeco Camelot (match name or slug) — not other listings. */
function pickTopProject(list: Project[]): Project | null {
  if (!list.length) return null;
  const lower = (s: string) => (s || "").toLowerCase();
  const isEldecoCamelot = (p: Project) => {
    const n = lower(p.projectName);
    const s = lower(p.slugURL);
    return (
      (n.includes("eldeco") && n.includes("camelot")) ||
      (s.includes("eldeco") && s.includes("camelot"))
    );
  };
  const candidates = list.filter(isEldecoCamelot);
  if (!candidates.length) return null;
  const withThumb = candidates.find((p) => p.projectThumbnailImage);
  return withThumb ?? candidates[0] ?? null;
}

function formatLocation(p: Project): string {
  const a = p.projectLocality?.trim();
  const b = p.cityName?.trim();
  if (a && b) return `${a}, ${b}`;
  return a || b || p.projectAddress || "";
}

function builderInitial(name: string): string {
  const t = name.trim();
  return t ? t[0]!.toUpperCase() : "?";
}

export default function TopPickCard() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const load = useCallback(() => {
    const cached = getProjectsCache();
    if (cached?.length) {
      setProject(pickTopProject(cached));
      setLoading(false);
      return;
    }
    fetchProjects()
      .then((data) => setProject(pickTopProject(data)))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const goToPropertyDetail = useCallback(() => {
    if (project) {
      router.push(`/propertyDetail/${project.slugURL}` as any);
    }
  }, [project]);

  const heroUri =
    project && project.projectThumbnailImage
      ? getImageUrl(project.slugURL, project.projectThumbnailImage)
      : "";
  const logoUri =
    project && project.projectLogo
      ? getImageUrl(project.slugURL, project.projectLogo)
      : "";

  if (!loading && !project) {
    return null;
  }

  return (
    <View className={styles.container}>
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
          onPress={() => router.push("/listings" as any)}
        >
          <Text className={styles.seeAllText}>See all</Text>
          <Ionicons name="arrow-forward" size={12} color="#b45309" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View
          className={styles.card}
          style={styles.cardShadow}
        >
          <View
            style={{ height: HERO_H, backgroundColor: "#e2e8f0" }}
            className="items-center justify-center w-full"
          >
            <ActivityIndicator size="large" color="#d89b38" />
            <Text className="text-xs text-slate-500 mt-3">Loading top pick…</Text>
          </View>
        </View>
      )}

      {!loading && project && (
        <Pressable
          onPress={goToPropertyDetail}
          style={({ pressed }) => [styles.cardShadow, { opacity: pressed ? 0.97 : 1 }]}
          android_ripple={{ color: "rgba(15, 23, 42, 0.06)" }}
        >
        <View className={styles.card}>
          <View className={styles.imageWrap}>
            {heroUri ? (
              <Image
                source={{ uri: heroUri }}
                style={{ width: "100%", height: HERO_H }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />
            ) : (
              <View
                style={{ height: HERO_H, width: "100%", backgroundColor: "#cbd5e1" }}
                className="items-center justify-center"
              >
                <Ionicons name="image-outline" size={48} color="#64748b" />
              </View>
            )}

            <View className={styles.badge}>
              <View className={styles.badgeIconWrap}>
                <Ionicons name="trophy" size={11} color="#fff" />
              </View>
              <Text className={styles.badgeText}>TOP PICK</Text>
            </View>

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

            <TouchableOpacity
              className={styles.galleryChip}
              activeOpacity={0.8}
              onPress={goToPropertyDetail}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="images-outline" size={11} color="#fff" />
              <Text className={styles.galleryText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <View className={styles.infoWrap}>
            <View className={styles.devRow}>
              <View className={styles.logoWrap}>
                {logoUri ? (
                  <Image
                    source={{ uri: logoUri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <Text
                    className={styles.logoLetter}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ fontSize: 16 }}
                  >
                    {builderInitial(project.builderName)}
                  </Text>
                )}
              </View>
              <View className={styles.devTextCol}>
                <Text className={styles.builderName} numberOfLines={1}>
                  {project.builderName}
                </Text>
                <TouchableOpacity
                  className={styles.viewProjectsBtn}
                  activeOpacity={0.75}
                  hitSlop={{ top: 4, bottom: 4 }}
                  onPress={() =>
                    router.push({ pathname: "/listings" as any, params: { city: project.cityName } })
                  }
                >
                  <Text
                    className={styles.viewProjectsText}
                    style={{ color: LINK_NAVY }}
                    numberOfLines={1}
                  >
                    {`View Projects by ${project.builderName}`}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={LINK_NAVY}
                    style={{ marginLeft: 2 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className={styles.projectBlock}>
              <Text className={styles.projectTitle} numberOfLines={2}>
                {project.projectName}
              </Text>
              {formatLocation(project) ? (
                <View className={styles.locationRow}>
                  <Ionicons name="location" size={17} color="#dc2626" />
                  <Text className={styles.location} numberOfLines={2}>
                    {formatLocation(project)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className={styles.priceBoxColOnly}>
              <Text className={styles.startFrom}>Starting From</Text>
              <Text className={styles.price}>
                ₹{project.projectPrice} Cr*
              </Text>
            </View>

            <View className={styles.chipsRow}>
              {!!project.projectConfiguration && (
                <View className={styles.chipBhk}>
                  <Ionicons name="bed-outline" size={12} color="#475569" />
                  <Text
                    className={styles.chipBhkText}
                    numberOfLines={1}
                  >
                    {project.projectConfiguration}
                  </Text>
                </View>
              )}
              {!!project.propertyTypeName && (
                <View className={styles.chipBhk}>
                  <Ionicons name="pricetag-outline" size={12} color="#475569" />
                  <Text
                    className={styles.chipBhkText}
                    numberOfLines={1}
                  >
                    {project.propertyTypeName}
                  </Text>
                </View>
              )}
              {!!project.projectStatusName && (
                <View className={styles.chipDate}>
                  <Ionicons name="build-outline" size={12} color="#b45309" />
                  <Text className={styles.chipDateText} numberOfLines={1}>
                    {project.projectStatusName}
                  </Text>
                </View>
              )}
            </View>

            <View className={styles.ctaRow}>
              <TouchableOpacity
                className={styles.buttonOutline}
                activeOpacity={0.85}
                onPress={() => {
                  // Absorb touch so the card Pressable does not open property detail.
                }}
              >
                <Ionicons name="call-outline" size={15} color="#0f172a" />
                <Text className={styles.buttonOutlineText}>Enquire</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={styles.button}
                activeOpacity={0.85}
                onPress={goToPropertyDetail}
              >
                <Text className={styles.buttonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </Pressable>
      )}
    </View>
  );
}
