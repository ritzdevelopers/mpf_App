import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import {
    Animated,
    Easing,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/* ─────────────────────────────────────────────
   Animated Send Button (Final Polished)
   – Fixed crash by using scaleX instead of width
   – Improved staggered letter wave
   – Curved take-off with rotation
───────────────────────────────────────────── */

const SEND_TEXT = "Send Message";

export function SendButton({ onPress, onBeforePress }: { onPress: () => void, onBeforePress?: () => boolean }) {

    const [sent, setSent] = useState(false);
    
    // Animation Values
    const buttonScale = useRef(new Animated.Value(1)).current;
    const planeX = useRef(new Animated.Value(0)).current;
    const planeY = useRef(new Animated.Value(0)).current;
    const planeRotate = useRef(new Animated.Value(0)).current;
    const planeScale = useRef(new Animated.Value(1)).current;
    const planeOpacity = useRef(new Animated.Value(1)).current;
    
    // Using scaleX instead of width to prevent native driver crash
    const contrailScale = useRef(new Animated.Value(0)).current;
    const contrailOpacity = useRef(new Animated.Value(0)).current;

    const sentOpacity = useRef(new Animated.Value(0)).current;
    const sentScale = useRef(new Animated.Value(0.5)).current;

    // Individual letter animations
    const letterAnims = useRef(SEND_TEXT.split("").map(() => new Animated.Value(0))).current;

    useEffect(() => {
        runWaveAnimation();
    }, []);

    const runWaveAnimation = () => {
        const animations = letterAnims.map((anim, i) => {
            return Animated.sequence([
                Animated.delay(i * 30),
                Animated.spring(anim, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]);
        });
        Animated.parallel(animations).start();
    };

    const handlePress = () => {
        if (sent) return;

        // If validation fails, don't start the animation
        if (onBeforePress && !onBeforePress()) return;


        // 1. Initial Press Feedback
        Animated.sequence([
            Animated.timing(buttonScale, { toValue: 0.94, duration: 100, useNativeDriver: true }),
            Animated.timing(buttonScale, { toValue: 1.02, duration: 150, useNativeDriver: true }),
            Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]).start();

        // 2. Flight & Letter Dissolve
        Animated.parallel([
            // Curve the flight path
            Animated.timing(planeX, {
                toValue: 250,
                duration: 900,
                easing: Easing.bezier(0.42, 0, 0.58, 1),
                useNativeDriver: true,
            }),
            Animated.timing(planeY, {
                toValue: -150,
                duration: 900,
                easing: Easing.bezier(0.42, 0, 0.58, 1),
                useNativeDriver: true,
            }),
            Animated.timing(planeRotate, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(planeScale, {
                toValue: 0.3,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.timing(planeOpacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            // Contrail animation (Safe for Native Driver)
            Animated.sequence([
                Animated.timing(contrailOpacity, { toValue: 0.7, duration: 100, useNativeDriver: true }),
                Animated.timing(contrailScale, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(contrailOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]),
            // Staggered letter disappearance
            ...letterAnims.map((anim, i) => 
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 400,
                    delay: i * 15,
                    useNativeDriver: true,
                })
            )
        ]).start(() => {
            setSent(true);
            onPress();

            // 3. Success Appearance
            Animated.parallel([
                Animated.spring(sentScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 120,
                    useNativeDriver: true,
                }),
                Animated.timing(sentOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const planeRotation = planeRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['-45deg', '0deg']
    });

    return (
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={handlePress}
                style={{
                    height: 64,
                    borderRadius: 20,
                    backgroundColor: sent ? "#16a34a" : "#d89b38",
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginTop: 12,
                    shadowColor: sent ? "#16a34a" : "#d89b38",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.4,
                    shadowRadius: 18,
                    elevation: 12,
                }}
            >
                {/* Default State */}
                {!sent && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Animated.View
                            style={{
                                marginRight: 15,
                                opacity: planeOpacity,
                                transform: [
                                    { translateX: planeX },
                                    { translateY: planeY },
                                    { rotate: planeRotation },
                                    { scale: planeScale }
                                ]
                            }}
                        >
                            <Ionicons name="paper-plane" size={24} color="#fff" />
                            
                            {/* Contrail - Replaced width with scaleX */}
                            <Animated.View 
                                style={{
                                    position: 'absolute',
                                    left: -40,
                                    top: 12,
                                    height: 2,
                                    width: 80,
                                    backgroundColor: 'rgba(255,255,255,0.6)',
                                    opacity: contrailOpacity,
                                    transform: [
                                        { rotate: '45deg' },
                                        { scaleX: contrailScale },
                                        { translateX: -40 }
                                    ]
                                }}
                            />
                        </Animated.View>

                        <View style={{ flexDirection: 'row' }}>
                            {SEND_TEXT.split("").map((char, i) => (
                                <Animated.Text
                                    key={i}
                                    style={{
                                        color: "#fff",
                                        fontWeight: "900",
                                        fontSize: 18,
                                        letterSpacing: 1,
                                        opacity: letterAnims[i],
                                        transform: [
                                            {
                                                translateY: letterAnims[i].interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [25, 0]
                                                })
                                            },
                                            {
                                                scale: letterAnims[i].interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.5, 1]
                                                })
                                            }
                                        ]
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </Animated.Text>
                            ))}
                        </View>
                    </View>
                )}

                {/* Sent State */}
                {sent && (
                    <Animated.View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            opacity: sentOpacity,
                            transform: [{ scale: sentScale }],
                        }}
                    >
                        <Ionicons name="checkmark-circle" size={32} color="#fff" />
                        <Text
                            style={{
                                color: "#fff",
                                fontWeight: "900",
                                fontSize: 20,
                                marginLeft: 12,
                                letterSpacing: 1.5,
                            }}
                        >
                            SENT!
                        </Text>
                    </Animated.View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}