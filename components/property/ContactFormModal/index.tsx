import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView, Text, TextInput, TouchableOpacity,
    View,
} from "react-native";
import { styles } from "./ContactFormModalUI";

export default function ContactFormModal({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [focused, setFocused] = useState("");

    return (
        <Modal visible={visible} transparent animationType="slide">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"} // ✅ handles both platforms
            >
                <View style={{ flex: 1 }}>

                    {/* Backdrop */}
                    <Pressable
                        style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                        onPress={onClose}
                    />

                    {/* Sheet pinned to bottom */}
                    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                        <Pressable onPress={Keyboard.dismiss}>
                            <View className={styles.sheet}>

                                <View className={styles.handle} />

                                {/* ✅ ScrollView so fields don't get cut off */}
                                <ScrollView
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    bounces={false}
                                >
                                    {/* Header */}
                                    <View className={styles.closeRow}>
                                        <View>
                                            <Text className={styles.title}>Submit Enquiry</Text>
                                            <Text className={styles.subtitle}>We'll call you within 10 mins</Text>
                                        </View>
                                        <TouchableOpacity onPress={onClose}>
                                            <Ionicons name="close" size={24} color="#374151" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* NAME */}
                                    <View className={`${styles.inputWrap} ${focused === "name" ? styles.inputWrapFocused : ""}`}>
                                        <TextInput
                                            placeholder="Full Name" placeholderTextColor="#94a3b8"
                                            className={styles.input} value={name} onChangeText={setName}
                                            onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                                        />
                                    </View>

                                    {/* EMAIL */}
                                    <View className={`${styles.inputWrap} ${focused === "email" ? styles.inputWrapFocused : ""}`}>
                                        <TextInput
                                            placeholder="Email Address" placeholderTextColor="#94a3b8"
                                            className={styles.input} value={email} onChangeText={setEmail}
                                            keyboardType="email-address" autoCapitalize="none"
                                            onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                                        />
                                    </View>

                                    {/* PHONE */}
                                    <View className={`${styles.inputWrap} ${focused === "phone" ? styles.inputWrapFocused : ""}`}>
                                        <TextInput
                                            placeholder="Phone Number" placeholderTextColor="#94a3b8"
                                            className={styles.input} value={phone} onChangeText={setPhone}
                                            keyboardType="phone-pad"
                                            onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                                        />
                                    </View>

                                    {/* MESSAGE */}
                                    <View className={`${styles.messageWrap} ${focused === "message" ? styles.inputWrapFocused : ""}`}>
                                        <TextInput
                                            placeholder="What are you looking for?" placeholderTextColor="#94a3b8"
                                            className={styles.input} multiline
                                            value={message} onChangeText={setMessage}
                                            onFocus={() => setFocused("message")} onBlur={() => setFocused("")}
                                        />
                                    </View>

                                    {/* CTA */}
                                    <TouchableOpacity
                                        onPress={() => { console.log({ name, email, phone, message }); onClose(); }}
                                        className={styles.button}
                                    >
                                        <Text className={styles.buttonText}>Submit Enquiry</Text>
                                    </TouchableOpacity>

                                </ScrollView>
                            </View>
                        </Pressable>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}