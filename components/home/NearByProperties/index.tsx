import {
    fetchProjects,
    getImageUrl,
    getProjectsCache,
    type Project,
} from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ExploreNearby() {
    const cached = getProjectsCache();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState<string | null>(null);

    // 📍 Get location
    const getUserLocation = async () => {
        try {
            setLoading(true);

            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                alert("Permission denied");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            const address = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            const detectedCity =
                address[0]?.city ||
                address[0]?.district ||
                address[0]?.region;

            setCity(detectedCity || "Nearby");

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // 📦 Load data + filter by city
    useEffect(() => {
        const loadData = async () => {
            let data = cached;

            if (!data) {
                data = await fetchProjects();
            }

            if (city) {
                const filtered = data.filter((p) =>
                    p.cityName?.toLowerCase().includes(city.toLowerCase())
                );

                // 👉 THIS IS YOUR slice(0,6)
                setProjects(filtered.slice(0, 6));
            } else {
                setProjects([]);
            }
        };

        loadData();
    }, [city]);

    return (
        <View className="bg-white px-4 pt-5 pb-6">

            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-xl font-bold text-slate-900">
                        Explore Nearby
                    </Text>
                    <Text className="text-xs text-slate-400 mt-0.5">
                        Properties around your location
                    </Text>
                </View>

                {/* 👉 SEE ALL */}
                {city && (
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/listings",
                                params: { city },
                            })
                        }
                        className="flex-row items-center"
                    >
                        <Text className="text-xs font-bold text-[#d89b38]">
                            See All
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color="#d89b38" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Button */}
            {!city && (
                <TouchableOpacity
                    onPress={getUserLocation}
                    className="bg-white p-5 rounded-2xl border border-slate-200 items-center mb-4"
                >
                    {loading ? (
                        <ActivityIndicator color="#2563eb" />
                    ) : (
                        <>
                            <Ionicons name="location-outline" size={26} color="#2563eb" />
                            <Text className="text-sm font-bold mt-2">
                                Use My Location
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            )}

            {/* Cards */}
            {city && projects.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {projects.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() =>
                                router.push(`/propertyDetail/${item.slugURL}` as any)
                            }
                            className="mr-4 w-64 bg-white rounded-2xl overflow-hidden border border-slate-100"
                        >
                            <Image
                                source={{
                                    uri: getImageUrl(
                                        item.slugURL,
                                        item.projectThumbnailImage
                                    ),
                                }}
                                style={{ width: "100%", height: 180 }}
                                contentFit="cover"
                            />

                            <View className="p-3">
                                <Text className="text-sm font-bold" numberOfLines={1}>
                                    {item.projectName}
                                </Text>
                                <Text className="text-xs text-slate-400 mt-1">
                                    {item.cityName}
                                </Text>
                                <Text className="text-sm font-bold mt-1">
                                    ₹{item.projectPrice} Cr
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}