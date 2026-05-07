import { SendButton } from "@/components/common/ui/ButtonUI/ButtonUI";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { styles } from "./ContactFormModalUI";

import api from "@/services/api";


export default function ContactFormModal({
    visible,
    onClose,
    pageName,
    projectLink,
}: {
    visible: boolean;
    onClose: () => void;
    pageName: "home page" | "detailed page";
    projectLink?: string;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [focused, setFocused] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (loading) return false;
        if (!name.trim() || name.trim().length < 2) {
            setError("Please enter your full name");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        const phoneDigits = phone.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
            setError("Please enter a valid 10-digit phone number");
            return false;
        }
        setError("");
        return true;
    };


    const handleSubmit = async () => {
        try {
            setLoading(true);
            await api.post("/enquiry/post-app", {
                name,
                email,
                phone,
                message,
                pageName,
                projectLink,
            });

            // Give time for the "Sent!" animation to show before closing
            setTimeout(() => {
                onClose();
                // Reset form
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
                setError("");
            }, 1800);
        } catch (err: any) {
            console.error("Enquiry Submission Error:", err);
            setError(err?.response?.data?.message || "Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };


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

                                    {/* Error Message */}
                                    {error ? (
                                        <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                                            {error}
                                        </Text>
                                    ) : null}

                                    {/* CTA */}
                                    <SendButton onBeforePress={validate} onPress={handleSubmit} />


                                </ScrollView>
                            </View>
                        </Pressable>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}