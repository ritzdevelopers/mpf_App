import { SendButton } from "@/components/common/ui/ButtonUI/ButtonUI";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { styles } from "./ContactFormModalUI";
import api from "@/services/api";
import Animated, { 
    FadeIn, 
    FadeOut, 
    SlideInDown, 
    SlideOutDown 
} from "react-native-reanimated";

export default function ContactFormModal({
    visible,
    onClose,
    pageName,
    projectLink,
}: {
    visible: boolean;
    onClose: () => void;
    pageName: "home page" | "detailed page" | "listing page";
    projectLink?: string;
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [focused, setFocused] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Form validation logic...
    const validate = () => {
        if (loading) return false;
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const phoneDigits = phone.replace(/\D/g, "");

        if (!trimmedName) { setError("Name is required"); return false; }
        if (trimmedName.length < 2) { setError("Name must be at least 2 characters"); return false; }
        if (trimmedName.length > 50) { setError("Name is too long"); return false; }
        
        const nameRegex = /^[a-zA-Z\s.'-]+$/;
        if (!nameRegex.test(trimmedName)) { setError("Name contains invalid characters"); return false; }
        if (/\s{2,}/.test(trimmedName)) { setError("Name cannot contain multiple spaces"); return false; }

        if (!trimmedEmail) { setError("Email is required"); return false; }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(trimmedEmail)) { setError("Please enter a valid email address"); return false; }
        if (trimmedEmail.includes("..")) { setError("Email cannot contain consecutive dots"); return false; }

        if (!phoneDigits) { setError("Phone number is required"); return false; }
        if (phoneDigits.length !== 10) { setError("Phone number must be exactly 10 digits"); return false; }
        if (!/^[6-9]/.test(phoneDigits)) { setError("Please enter a valid Indian phone number"); return false; }
        if (/^(\d)\1{9}$/.test(phoneDigits)) { setError("Invalid phone number"); return false; }

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

            setTimeout(() => {
                onClose();
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

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={{ flex: 1 }}>
                    {/* Backdrop - Fade in/out */}
                    <Animated.View 
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(200)}
                        style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <Pressable style={{ flex: 1 }} onPress={onClose} />
                    </Animated.View>

                    {/* Sheet - Smooth Slide up */}
                    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                        <Animated.View 
                            entering={SlideInDown.duration(350)}
                            exiting={SlideOutDown.duration(200)}
                        >
                            <Pressable onPress={Keyboard.dismiss}>
                                <View className={styles.sheet}>
                                    <View className={styles.handle} />

                                    <ScrollView
                                        keyboardShouldPersistTaps="handled"
                                        showsVerticalScrollIndicator={false}
                                        bounces={false}
                                    >
                                        <View className={styles.closeRow}>
                                            <View>
                                                <Text className={styles.title}>Submit Enquiry</Text>
                                                <Text className={styles.subtitle}>We'll call you within 10 mins</Text>
                                            </View>
                                            <TouchableOpacity onPress={onClose}>
                                                <Ionicons name="close" size={24} color="#374151" />
                                            </TouchableOpacity>
                                        </View>

                                        <View className={`${styles.inputWrap} ${focused === "name" ? styles.inputWrapFocused : ""}`}>
                                            <TextInput
                                                placeholder="Full Name" placeholderTextColor="#94a3b8"
                                                className={styles.input} value={name} onChangeText={setName}
                                                onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                                            />
                                        </View>

                                        <View className={`${styles.inputWrap} ${focused === "email" ? styles.inputWrapFocused : ""}`}>
                                            <TextInput
                                                placeholder="Email Address" placeholderTextColor="#94a3b8"
                                                className={styles.input} value={email} onChangeText={setEmail}
                                                keyboardType="email-address" autoCapitalize="none"
                                                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                                            />
                                        </View>

                                        <View className={`${styles.inputWrap} ${focused === "phone" ? styles.inputWrapFocused : ""}`}>
                                            <TextInput
                                                placeholder="Phone Number" placeholderTextColor="#94a3b8"
                                                className={styles.input} value={phone} onChangeText={setPhone}
                                                keyboardType="phone-pad"
                                                onFocus={() => setFocused("phone")} onBlur={() => setFocused("")}
                                            />
                                        </View>

                                        <View className={`${styles.messageWrap} ${focused === "message" ? styles.inputWrapFocused : ""}`}>
                                            <TextInput
                                                placeholder="What are you looking for?" placeholderTextColor="#94a3b8"
                                                className={styles.input} multiline
                                                value={message} onChangeText={setMessage}
                                                onFocus={() => setFocused("message")} onBlur={() => setFocused("")}
                                            />
                                        </View>

                                        {error ? (
                                            <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                                                {error}
                                            </Text>
                                        ) : null}

                                        <SendButton onBeforePress={validate} onPress={handleSubmit} />
                                    </ScrollView>
                                </View>
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}