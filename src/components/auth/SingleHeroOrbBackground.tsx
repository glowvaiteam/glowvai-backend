import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppFonts } from '../../hooks/useAppFonts';

const { height } = Dimensions.get('window');

export const SingleHeroOrbBackground: React.FC = () => {
  const { isLoaded, fontFamily } = useAppFonts();

  // Floating animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* 1. TOP LOGO WITH SYNE FONT */}
      <View style={styles.logoContainer}>
        <Text
          style={[
            styles.brandLogoText,
            fontFamily?.syneBold ? { fontFamily: fontFamily.syneBold } : { fontWeight: '800' },
          ]}
        >
          glowvai
        </Text>
      </View>

      {/* 2. THE TRUE BLUR HERO ORB */}
      <Animated.View style={[styles.orbPositionWrapper, { transform: [{ translateY }] }]}>
        <View style={styles.orbContainer}>
          {/* Feathered outer glow haze 1 */}
          <View style={styles.glowHaze1} />

          {/* Feathered outer glow haze 2 */}
          <View style={styles.glowHaze2} />

          {/* Core Vibrant Gradient Orb */}
          <LinearGradient
            colors={['#7DD3FC', '#38BDF8', '#3B82F6']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={styles.coreOrb}
          >
            {/* Specular 3D Highlight */}
            <View style={styles.specularHighlight} />

            {/* THE FACE (Centered directly over the Orb) */}
            <View style={styles.faceOverlay}>
              {/* ✨ ✨ Sparkle Eyes Row */}
              <View style={styles.eyesRow}>
                <View style={styles.eyePupil}>
                  <Text style={styles.sparkleStar}>✦</Text>
                </View>
                <View style={styles.eyePupil}>
                  <Text style={styles.sparkleStar}>✦</Text>
                </View>
              </View>

              {/* Confident Smirk */}
              <View style={styles.smirkWrapper}>
                <View style={styles.smirkCurve} />
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 42,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  brandLogoText: {
    fontSize: 32,
    color: '#0F172A',
    letterSpacing: -1,
  },
  orbPositionWrapper: {
    position: 'absolute',
    top: height * 0.11,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbContainer: {
    width: 380,
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowHaze1: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  glowHaze2: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(56, 189, 248, 0.28)',
  },
  coreOrb: {
    width: 250,
    height: 250,
    borderRadius: 125,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.9,
    shadowRadius: 60,
    elevation: 30,
  },
  specularHighlight: {
    position: 'absolute',
    top: '12%',
    left: '18%',
    width: '24%',
    height: '24%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  faceOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  eyesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    marginBottom: 12,
  },
  eyePupil: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleStar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: -2,
  },
  smirkWrapper: {
    alignItems: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  smirkCurve: {
    width: 24,
    height: 10,
    borderBottomWidth: 3.5,
    borderRightWidth: 2.5,
    borderColor: '#0F172A',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 14,
  },
});
