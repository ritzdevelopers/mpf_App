import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./EnquiryMiniCardUI";

export default function EnquiryMiniCard({
    onPress,
}: {
    onPress: () => void;
}) {
    return (
        <View className={styles.container}>

            <Text className={styles.title}>
                Submit Enquiry 🚀
            </Text>

            <Text className={styles.subtitle}>
                We'll call you within 10 mins
            </Text>

            <TouchableOpacity
                onPress={onPress}
                className={styles.button}
            >
                <Text className={styles.buttonText}>
                    Open Form
                </Text>
            </TouchableOpacity>

        </View>
    );
}