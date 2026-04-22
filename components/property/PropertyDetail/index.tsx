// components/PropertyDetail/index.tsx

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Animated,
  Pressable,
  Dimensions,
  StatusBar,
  FlatList,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import {
  PinchGestureHandler,
  PanGestureHandler,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getImageUrl, type Project, type ProjectDetail } from "@/utils/api";
import { styles } from "./PropertyDetailsUI";
import { useUser } from "@/utils/authStore";
import LoginSheet from "../LoginSheet";

function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|h\d|li)\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const HERO_H = 380;

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <View className={`${styles.glass} ${className}`}>{children}</View>;
}

/* ── Animated shimmer overlay (no LinearGradient required) ── */
function ShimmerOverlay({ width, height, borderRadius = 0 }: { width: number; height: number; borderRadius?: number }) {
  const translate = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: width,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [width, translate]);

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0, left: 0,
        width, height, borderRadius,
        backgroundColor: "#e2e8f0",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0, bottom: 0,
          width: width * 0.55,
          backgroundColor: "rgba(255,255,255,0.55)",
          transform: [{ translateX: translate }, { skewX: "-20deg" }],
        }}
      />
    </View>
  );
}

/* ── Gallery image card with shimmer skeleton until loaded ── */
function GalleryThumb({ uri, onPress }: { uri: string; onPress: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loaded) {
      Animated.timing(fade, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [loaded, fade]);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={{ marginRight: 10 }}>
      <View style={{ width: 200, height: 130, borderRadius: 14, overflow: "hidden", backgroundColor: "#e2e8f0" }}>
        <Image
          source={{ uri }}
          style={{ width: 200, height: 130 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={150}
          onLoadEnd={() => setLoaded(true)}
        />
        <Animated.View
          pointerEvents="none"
          style={{ ...StyleSheet.absoluteFillObject, opacity: fade }}
        >
          <ShimmerOverlay width={200} height={130} borderRadius={14} />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

function StatChip({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View className={styles.statChip}>
      <View className={styles.statIconWrap} style={{ backgroundColor: color + "18" }}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text className={styles.statLabel}>{label}</Text>
      <Text className={styles.statValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function SectionHeader({
  icon,
  title,
  color,
  subtitle,
}: {
  icon: string;
  title: string;
  color: string;
  subtitle?: string;
}) {
  return (
    <View className={styles.sectionHeaderRow}>
      <View className={styles.sectionIconWrap} style={{ backgroundColor: color + "18" }}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View className={styles.sectionTextCol}>
        <Text className={styles.sectionTitle}>{title}</Text>
        {!!subtitle && <Text className={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function OverviewItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View className={styles.overviewItem}>
      <Ionicons name={icon as any} size={15} color="#d89b38" />
      <Text className={styles.overviewLabel}>{label}</Text>
      <Text className={styles.overviewValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = Dimensions.get("window").height;

/* Per-slide pinch-to-zoom + pan image */
function ZoomableImage({
  uri,
  onZoomChange,
}: {
  uri: string;
  onZoomChange: (zoomed: boolean) => void;
}) {
  const IMG_H = SCREEN_H;

  // Accumulated zoom (persisted between gestures) × current gesture's relative zoom
  const baseScale  = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const scale      = useRef(Animated.multiply(baseScale, pinchScale)).current;
  const lastScale  = useRef(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Pan
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const pinchRef = useRef(null);
  const panRef = useRef(null);

  /* ── Pinch ── */
  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = (event: any) => {
    const { state, oldState, scale: gestureScale } = event.nativeEvent;

    if (state === State.ACTIVE) {
      setIsZoomed(true);
      onZoomChange(true);
    }

    if (oldState === State.ACTIVE) {
      // Commit the gesture into baseScale, then reset pinchScale so the
      // next gesture multiplies cleanly off the new cumulative zoom.
      const next = Math.max(1, Math.min(4, lastScale.current * gestureScale));
      lastScale.current = next;
      baseScale.setValue(next);
      pinchScale.setValue(1);

      if (next <= 1.05) {
        lastScale.current = 1;
        lastTranslateX.current = 0;
        lastTranslateY.current = 0;
        translateX.flattenOffset();
        translateY.flattenOffset();
        Animated.parallel([
          Animated.spring(baseScale,  { toValue: 1, useNativeDriver: true }),
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
        setIsZoomed(false);
        onZoomChange(false);
      }
    }
  };

  /* ── Pan ── */
  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onPanStateChange = (event: any) => {
    const { state, oldState, translationX: tx, translationY: ty } = event.nativeEvent;

    // Seed offset with saved position so current gesture adds on top of it
    if (state === State.BEGAN) {
      translateX.setOffset(lastTranslateX.current);
      translateX.setValue(0);
      translateY.setOffset(lastTranslateY.current);
      translateY.setValue(0);
    }

    if (oldState === State.ACTIVE) {
      const s = lastScale.current;
      // With translate-before-scale, translation is in screen space,
      // so clamp = half the extra size the image gained from zooming
      const maxX = (SCREEN_W * (s - 1)) / 2;
      const maxY = (IMG_H    * (s - 1)) / 2;

      // Clamp final position
      const newX = Math.max(-maxX, Math.min(maxX, lastTranslateX.current + tx));
      const newY = Math.max(-maxY, Math.min(maxY, lastTranslateY.current + ty));

      lastTranslateX.current = newX;
      lastTranslateY.current = newY;

      // Merge offset back into value so next gesture starts clean
      translateX.flattenOffset();
      translateY.flattenOffset();
      translateX.setValue(newX);
      translateY.setValue(newY);
    }
  };

  return (
    <PanGestureHandler
      ref={panRef}
      enabled={isZoomed}
      onGestureEvent={onPanEvent}
      onHandlerStateChange={onPanStateChange}
      simultaneousHandlers={pinchRef}
      minPointers={1}
      maxPointers={2}
      avgTouches
    >
      <Animated.View>
        <PinchGestureHandler
          ref={pinchRef}
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}
          simultaneousHandlers={panRef}
        >
          <Animated.View
            style={{
              width: SCREEN_W,
              height: IMG_H,
              transform: [{ translateX }, { translateY }, { scale }],
            }}
          >
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={120}
              priority="high"
            />
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
}

function ImageLightbox({
  uris,
  initialIndex,
  visible,
  onClose,
}: {
  uris: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const flatRef = useRef<FlatList>(null);

  React.useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setTimeout(() => {
        flatRef.current?.scrollToIndex({ index: initialIndex, animated: false });
      }, 50);
      Animated.timing(opacityAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    } else {
      opacityAnim.setValue(0);
    }
  }, [visible, initialIndex]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index ?? 0);
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, backgroundColor: "#000", opacity: opacityAnim }}>

          {/* Swipeable + pinch-zoomable image pager */}
          <FlatList
            ref={flatRef}
            data={uris}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({ length: SCREEN_W, offset: SCREEN_W * index, index })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <Pressable
                style={{ width: SCREEN_W, height: SCREEN_H, alignItems: "center", justifyContent: "center" }}
                onPress={onClose}
              >
                <ZoomableImage
                  uri={item}
                  onZoomChange={(zoomed) => setScrollEnabled(!zoomed)}
                />
              </Pressable>
            )}
          />

          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 56,
              right: 20,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Counter pill */}
          <View
            style={{
              position: "absolute",
              top: 60,
              alignSelf: "center",
              backgroundColor: "rgba(255,255,255,0.15)",
              paddingHorizontal: 14,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
              {currentIndex + 1} / {uris.length}
            </Text>
          </View>

          {/* Dot indicators */}
          <View
            style={{
              position: "absolute",
              bottom: 60,
              alignSelf: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            {uris.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === currentIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === currentIndex ? "#fff" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </View>

        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

export default function PropertyDetail({
  project,
  detail,
}: {
  project: Project | null;
  detail?: ProjectDetail | null;
}) {
  const [liked, setLiked] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const user = useUser();

  const handleBookVisit = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    // TODO: proceed with real booking flow
  };

  if (!project) {
    return (
      <View className={styles.emptyWrap}>
        <Ionicons name="home-outline" size={52} color="#cbd5e1" />
        <Text className={styles.emptyTitle}>Property not found</Text>
        <TouchableOpacity onPress={() => router.back()} className={`${styles.glass} ${styles.emptyBackBtn}`}>
          <Text className={styles.emptyBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const configurations = project.projectConfiguration.split(",").map((c) => c.trim()).filter(Boolean);
  const bannerUri    = getImageUrl(project.slugURL, project.projectBannerImage || project.projectThumbnailImage);
  const thumbnailUri = getImageUrl(project.slugURL, project.projectThumbnailImage);
  const emi = Math.round(parseFloat(project.projectPrice) * 100000 * 8.5 / 1200);
  const aboutText = stripHtml(detail?.projectWalkthroughDescription) || detail?.metaDescription || "";

  return (
    <View className={styles.page}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* ── HERO ── */}
        <View className={styles.hero} style={{ height: HERO_H }}>
          <Image
            source={{ uri: bannerUri }}
            placeholder={thumbnailUri ? { uri: thumbnailUri } : undefined}
            placeholderContentFit="cover"
            style={{ width: "100%", height: HERO_H }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            priority="high"
          />

          {/* top buttons */}
          <View className={styles.heroTopRow}>
            <TouchableOpacity onPress={() => router.back()} className={styles.heroBtn}>
              <Ionicons name="arrow-back" size={20} color="#1e293b" />
            </TouchableOpacity>
            <View className={styles.heroRightGroup}>
              <TouchableOpacity className={styles.heroBtn}>
                <Ionicons name="share-social-outline" size={18} color="#1e293b" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLiked(!liked)} className={styles.heroBtn}>
                <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#ef4444" : "#1e293b"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* badges */}
          <View className={styles.badgeRow}>
            <View className={styles.badgePill}>
              <View className={styles.badgeDotBlue} />
              <Text className={styles.badgeTextBlue}>{project.propertyTypeName}</Text>
            </View>
            <View className={styles.badgePill}>
              <View
                className={
                  project.projectStatusName === "Ready To Move"
                    ? styles.badgeDotGreen
                    : styles.badgeDotAmber
                }
              />
              <Text
                className={
                  project.projectStatusName === "Ready To Move"
                    ? styles.badgeTextGreen
                    : styles.badgeTextAmber
                }
              >
                {project.projectStatusName}
              </Text>
            </View>
          </View>

          {/* Glass title card pinned to hero bottom */}
          <View className={styles.titleCard}>
            <GlassCard>
              <Text className={styles.title} numberOfLines={2}>
                {project.projectName}
              </Text>
              <View className={styles.locationRow}>
                <View className={styles.locationGroup}>
                  <Ionicons name="location-outline" size={13} color="#94a3b8" />
                  <Text className={styles.locationText} numberOfLines={1}>{project.projectAddress}</Text>
                </View>
                <Text className={styles.price}>₹{project.projectPrice} Cr</Text>
              </View>
            </GlassCard>
          </View>
        </View>

        <View className={styles.content}>

          {/* ── STAT CHIPS ── */}
          <View className={styles.statRow}>
            <StatChip icon="business-outline"  label="Type"   value={project.propertyTypeName}    color="#2563eb" />
            <StatChip icon="location-outline"  label="City"   value={project.cityName}             color="#16a34a" />
            <StatChip icon="construct-outline" label="Status" value={project.projectStatusName}    color="#d89b38" />
          </View>

          {/* ── CONFIGURATIONS ── */}
          {configurations.length > 0 && (
            <GlassCard className={styles.cardSpacing}>
              <SectionHeader icon="grid-outline" title="Configurations" color="#2563eb" subtitle={`${configurations.length} available options`} />
              <View className={styles.configRow}>
                {configurations.map((cfg, i) => (
                  <View key={i} className={styles.configChip}>
                    <Text className={styles.configText}>{cfg}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {/* ── ABOUT ── */}
          {!!aboutText && (
            <GlassCard className={styles.cardSpacing}>
              <SectionHeader
                icon="document-text-outline"
                title={`About ${project.projectName}`}
                color="#6366f1"
                subtitle="Project walkthrough"
              />
              <View className={styles.aboutBody}>
                <Text className={styles.aboutText}>{aboutText}</Text>
              </View>
            </GlassCard>
          )}

          {/* ── GALLERY ── */}
          {detail?.galleryImages && detail.galleryImages.length > 0 && (
            <GlassCard className={styles.cardSpacing}>
              <SectionHeader
                icon="images-outline"
                title="Gallery"
                color="#e879f9"
                subtitle={`${detail.galleryImages.length} photos`}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className={styles.galleryScroll}
              >
                {detail.galleryImages.map((img, i) => {
                  const uri = getImageUrl(project.slugURL, img.imageName);
                  return (
                    <GalleryThumb
                      key={img.id ?? i}
                      uri={uri}
                      onPress={() => setLightboxIndex(i)}
                    />
                  );
                })}
              </ScrollView>
            </GlassCard>
          )}

          {/* ── OVERVIEW ── */}
          <GlassCard className={styles.cardSpacing}>
            <SectionHeader icon="information-circle-outline" title="Property Overview" color="#0ea5e9" subtitle="Key details at a glance" />
            <View className={styles.overviewGrid}>
              <OverviewItem icon="map-outline"    label="Locality"       value={project.projectLocality} />
              <OverviewItem icon="person-outline" label="Builder"        value={project.builderName} />
              <OverviewItem icon="cash-outline"   label="Starting Price" value={`₹${project.projectPrice} Cr`} />
              <OverviewItem icon="home-outline"   label="City"           value={project.cityName} />
            </View>
          </GlassCard>

          {/* ── FLOOR PLANS ── */}
          {detail?.floorPlans && detail.floorPlans.length > 0 && (
            <GlassCard className={styles.cardSpacing}>
              <SectionHeader icon="layers-outline" title="Floor Plans" color="#2563eb" subtitle={`${detail.floorPlans.length} layouts available`} />
              {!!stripHtml(detail.floorPlanDesc) && (
                <Text className={styles.sectionBlurb}>{stripHtml(detail.floorPlanDesc)}</Text>
              )}
              <View className={styles.fpList}>
                {detail.floorPlans.map((fp, i) => (
                  <View
                    key={`${fp.planType}-${fp.areaSqFt}-${i}`}
                    className={`${styles.fpRow} ${i === 0 ? "" : styles.fpRowDivider}`}
                  >
                    <View className={styles.fpLeft}>
                      <View className={styles.fpIconWrap}>
                        <Ionicons name="grid-outline" size={15} color="#2563eb" />
                      </View>
                      <Text className={styles.fpType}>{fp.planType}</Text>
                    </View>
                    <Text className={styles.fpArea}>
                      {fp.areaSqFt.toLocaleString("en-IN")} sq.ft
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {/* ── AMENITIES ── */}
          {detail?.amenities && detail.amenities.length > 0 && (
            <GlassCard className={styles.cardSpacing}>
              <SectionHeader icon="sparkles-outline" title="Amenities" color="#16a34a" subtitle={`${detail.amenities.length} features included`} />
              {!!stripHtml(detail.amenityDesc) && (
                <Text className={styles.sectionBlurb}>{stripHtml(detail.amenityDesc)}</Text>
              )}
              <View className={styles.amList}>
                {(showAllAmenities ? detail.amenities : detail.amenities.slice(0, 8)).map((a) => (
                  <View key={a.id + a.title} className={styles.amChip}>
                    <Ionicons name="checkmark-circle" size={13} color="#16a34a" style={{ marginRight: 5 }} />
                    <Text className={styles.amText}>{a.title}</Text>
                  </View>
                ))}
              </View>
              {detail.amenities.length > 8 && (
                <TouchableOpacity onPress={() => setShowAllAmenities((v) => !v)} className={styles.amToggle}>
                  <Text className={styles.amToggleText}>
                    {showAllAmenities ? "Show Less" : `Show all ${detail.amenities.length}`}
                  </Text>
                </TouchableOpacity>
              )}
            </GlassCard>
          )}

          {/* ── LOCATION BENEFITS ── */}
          {detail?.locationBenefits && detail.locationBenefits.length > 0 && (
            <GlassCard className={styles.cardSpacing}>
              <SectionHeader icon="navigate-outline" title="Location Highlights" color="#16a34a" subtitle="Nearby landmarks" />
              {!!stripHtml(detail.locationDesc) && (
                <Text className={styles.sectionBlurb}>{stripHtml(detail.locationDesc)}</Text>
              )}
              <View className={styles.locList}>
                {detail.locationBenefits.map((b, i) => (
                  <View
                    key={`${b.benefitName}-${i}`}
                    className={`${styles.locRow} ${i === 0 ? "" : styles.locRowDivider}`}
                  >
                    <View className={styles.locIconWrap}>
                      <Ionicons name="location" size={14} color="#16a34a" />
                    </View>
                    <Text className={styles.locName} numberOfLines={2}>{b.benefitName}</Text>
                    <Text className={styles.locDist}>{b.distance}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {/* ── RERA ── */}
          {detail?.reraNo && (
            <GlassCard className={styles.cardSpacing}>
              <View className={styles.reraRow}>
                <View className={styles.reraIconWrap}>
                  <Ionicons name="shield-checkmark" size={18} color="#16a34a" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text className={styles.reraLabel}>RERA Registration</Text>
                  <Text className={styles.reraNo}>{detail.reraNo}</Text>
                </View>
                {detail.reraWebsite && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(detail.reraWebsite as string)}
                    className={styles.reraBtn}
                  >
                    <Text className={styles.reraBtnText}>Verify</Text>
                  </TouchableOpacity>
                )}
              </View>
            </GlassCard>
          )}

          {/* ── WHY INVEST ── */}
          <GlassCard className={styles.cardSpacing}>
            <SectionHeader icon="trending-up-outline" title="Why Invest?" color="#d89b38" subtitle="Reasons to buy here" />
            {[
              { icon: "shield-checkmark-outline", text: "RERA Registered & Verified Project",           color: "#16a34a" },
              { icon: "trending-up-outline",      text: "High appreciation potential in this locality",  color: "#2563eb" },
              { icon: "people-outline",           text: "Trusted builder with proven track record",      color: "#d89b38" },
              { icon: "car-outline",              text: "Excellent connectivity & infrastructure",        color: "#9333ea" },
            ].map((item, i) => (
              <View key={i} className={styles.whyRow}>
                <View className={styles.whyIconWrap} style={{ backgroundColor: item.color + "15" }}>
                  <Ionicons name={item.icon as any} size={17} color={item.color} />
                </View>
                <Text className={styles.whyText}>{item.text}</Text>
              </View>
            ))}
          </GlassCard>

          {/* ── BUILDER ── */}
          <GlassCard className={styles.cardSpacing}>
            <SectionHeader icon="business-outline" title="Builder / Developer" color="#2563eb" subtitle="About the company" />
            <View className={styles.builderRow}>
              <View className={styles.builderLogoWrap}>
                <Image
                  source={{ uri: getImageUrl(project.slugURL, project.projectLogo) }}
                  style={{ width: 52, height: 52 }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  transition={150}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text className={styles.builderName}>{project.builderName}</Text>
                <View className={styles.builderMeta}>
                  <Ionicons name="location-outline" size={11} color="#94a3b8" />
                  <Text className={styles.builderMetaText}>{project.cityName}</Text>
                </View>
              </View>
            </View>
            {!!detail?.builder?.builderDescription && (
              <Text className={styles.builderDesc}>
                {stripHtml(detail.builder.builderDescription)}
              </Text>
            )}
          </GlassCard>

          {/* ── FAQs ── */}
          {detail?.faqs && detail.faqs.length > 0 && (
            <GlassCard className={styles.cardSpacing}>
              <SectionHeader icon="help-circle-outline" title="Frequently Asked Questions" color="#9333ea" subtitle={`${detail.faqs.length} common questions`} />
              <View className={styles.faqList}>
                {detail.faqs.map((q, i) => {
                  const open = openFaq === q.id;
                  return (
                    <View key={q.id} className={i === 0 ? styles.faqRow : `${styles.faqRow} ${styles.faqRowDivider}`}>
                      <TouchableOpacity
                        onPress={() => setOpenFaq(open ? null : q.id)}
                        className={styles.faqHead}
                      >
                        <Text className={styles.faqQ}>{q.question}</Text>
                        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color="#94a3b8" />
                      </TouchableOpacity>
                      {open && <Text className={styles.faqA}>{stripHtml(q.answer)}</Text>}
                    </View>
                  );
                })}
              </View>
            </GlassCard>
          )}

          {/* ── EMI TEASER ── */}
          <View className={styles.emiCard}>
            <View className={styles.emiInner}>
              <View className={styles.emiCol}>
                <Text className={styles.emiLabel}>EMI Starts at</Text>
                <Text className={styles.emiAmount}>
                  ₹{emi.toLocaleString("en-IN")}
                  <Text className={styles.emiUnit}> /mo</Text>
                </Text>
                <Text className={styles.emiNote}>Based on 20yr loan @ 8.5% p.a.</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/popular_tools/emi" as any)}
                className={styles.emiBtn}
              >
                <Text className={styles.emiBtnText}>Calculate</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View className={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => Linking.openURL("tel:+911234567890")}
          className={styles.iconActionBtn}
        >
          <Ionicons name="call" size={22} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://wa.me/911234567890")}
          className={styles.iconActionBtn}
        >
          <Ionicons name="logo-whatsapp" size={22} color="#16a34a" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBookVisit} className={styles.ctaBtn}>
          <Text className={styles.ctaText}>Book Site Visit</Text>
        </TouchableOpacity>
      </View>

      <LoginSheet
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        title="Login to continue"
        subtitle="Enter your email to book a site visit"
      />

      {detail?.galleryImages && detail.galleryImages.length > 0 && (
        <ImageLightbox
          uris={detail.galleryImages.map((img) => getImageUrl(project.slugURL, img.imageName))}
          initialIndex={lightboxIndex ?? 0}
          visible={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </View>
  );
}
