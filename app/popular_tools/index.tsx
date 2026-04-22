import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { styles } from './toolUI';
import BackHeader from '@/components/layout/BackHeader';

const toolsData = [
    {
        id: 1,
        title: "budget calculator",
        desc: "check your byuing budget ",
        icon: <Ionicons name="calculator-outline" size={34} color="#d89b38" />,
        link: "/popular_tools/budget",
    },
    {
        id: 2,
        title: "EMI Calculator",
        desc: "Calculate monthly EMI",
        icon: <MaterialIcons name="calculate" size={34} color="#d89b38" />,
        link: "/popular_tools/emi",
    },
    {
        id: 3,
        title: "Area Converter",
        desc: "Convert area units easily",
        icon: <Ionicons name="resize-outline" size={34} color="#d89b38" />,
        link: "/popular_tools/area",
    },
    {
        id: 4,
        title: "Loan Eligibility",
        desc: "Check eligible loan amount",
        icon: <Ionicons name="cash-outline" size={34} color="#d89b38" />,
        link: "/popular_tools/loan",
    },
    {
        id: 5,
        title: "LocateScore",
        desc: "Check area convenience score",
        icon: <Ionicons name="location-outline" size={34} color="#d89b38" />,
        link: "/popular_tools/LocateScore",
    },
];

export default function PopularToolsPage() {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <BackHeader />
            <View className={styles.container}>
            <Text className={styles.heading}>
                Popular Tools
            </Text>
            <Text className={styles.subHeading}>
                Use smart tools for buying property
            </Text>
            <View className={styles.gridWrap}>
                {toolsData.map((a) => (
                    <TouchableOpacity
                        key={a.id}
                        className={styles.card}
                        onPress={() => router.push(a.link as any)}
                    >
                        <View className={styles.iconWrap}>
                            {a.icon}
                        </View>
                        <Text className={styles.title}>
                            {a.title}
                        </Text>
                        <Text className={styles.desc}>
                            {a.desc}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
            </View>
    );
}