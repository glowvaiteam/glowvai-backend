import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppFonts } from '../../hooks/useAppFonts';

const { width } = Dimensions.get('window');

export const EmotionOrbsBackground: React.FC = () => {
  const { isLoaded, fontFamily } = useAppFonts();
  const syneFont = isLoaded && fontFamily ? fontFamily.syneExtraBold || fontFamily.syneBold : undefined;

  // Floating animation values with staggered timings
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;
  const float4 = useRef(new Animated.Value(0)).current;
  const float5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const a1 = createLoop(float1, 2600, 0);
    const a2 = createLoop(float2, 3100, 300);
    const a3 = createLoop(float3, 2800, 600);
    const a4 = createLoop(float4, 3400, 200);
    const a5 = createLoop(float5, 2900, 500);

    a1.start();
    a2.start();
    a3.start();
    a4.start();
    a5.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
      a4.stop();
      a5.stop();
    };
  }, [float1, float2, float3, float4, float5]);

  const translateY1 = float1.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const translateY2 = float2.interpolate({ inputRange: [0, 1], outputRange: [0, 16] });
  const translateY3 = float3.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const translateY4 = float4.interpolate({ inputRange: [0, 1], outputRange: [0, 14] });
  const translateY5 = float5.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <View style={styles.container}>
      {/* Brand Header Title (Moimoi Style) */}
      <View style={styles.headerContainer}>
        <Text style={[styles.brandTitle, syneFont ? { fontFamily: syneFont } : { fontWeight: '900' }]}>
          glowvai
        </Text>
      </View>

      {/* Orbs Canvas */}
      <View style={styles.canvasArea}>
        {/* 1. MINT FRESH ORB (Top Left) */}
        <Animated.View style={[styles.orbWrapper, styles.orb1Position, { transform: [{ translateY: translateY1 }] }]}>
          <LinearGradient
            colors={['#86EFAC', '#4ADE80', '#22C55E']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={[styles.orb, styles.orb1Size, styles.shadowGreen]}
          >
            {/* Specular Highlight */}
            <View style={styles.specularHighlight} />
            {/* Clean Expressive Face */}
            <View style={styles.faceColumn}>
              <View style={styles.eyesRow}>
                <View style={styles.eyeWink} />
                <View style={styles.eyeOpen} />
              </View>
              <View style={styles.smileArc} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* 2. CORAL BLUSH ORB (Top Right) */}
        <Animated.View style={[styles.orbWrapper, styles.orb2Position, { transform: [{ translateY: translateY2 }] }]}>
          <LinearGradient
            colors={['#FDA4AF', '#FB7185', '#E11D48']}
            start={{ x: 0.2, y: 0.1 }}
            end={{ x: 0.8, y: 0.9 }}
            style={[styles.orb, styles.orb2Size, styles.shadowPink]}
          >
            <View style={styles.specularHighlight} />
            <View style={styles.faceColumn}>
              <View style={styles.eyesRow}>
                <View style={styles.eyeArch} />
                <View style={styles.eyeArch} />
              </View>
              <View style={styles.smileJoy} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* 3. CALM SKY BLUE ORB (Center Left) */}
        <Animated.View style={[styles.orbWrapper, styles.orb3Position, { transform: [{ translateY: translateY3 }] }]}>
          <LinearGradient
            colors={['#7DD3FC', '#38BDF8', '#0284C7']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={[styles.orb, styles.orb3Size, styles.shadowBlue]}
          >
            <View style={styles.specularHighlight} />
            <View style={styles.faceColumn}>
              <View style={styles.eyesRowWide}>
                <View style={styles.eyeRound} />
                <View style={styles.eyeRound} />
              </View>
              <View style={styles.smileCalm} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* 4. SUNNY JOY ORB (Center Right) */}
        <Animated.View style={[styles.orbWrapper, styles.orb4Position, { transform: [{ translateY: translateY4 }] }]}>
          <LinearGradient
            colors={['#FDE047', '#FACC15', '#EAB308']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={[styles.orb, styles.orb4Size, styles.shadowYellow]}
          >
            <View style={styles.specularHighlight} />
            <View style={styles.faceColumn}>
              <View style={styles.eyesRowWide}>
                <View style={styles.eyeArchLarge} />
                <View style={styles.eyeArchLarge} />
              </View>
              <View style={styles.smileWide} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* 5. PETITE WONDER ORB (Bottom Center) */}
        <Animated.View style={[styles.orbWrapper, styles.orb5Position, { transform: [{ translateY: translateY5 }] }]}>
          <LinearGradient
            colors={['#FED7AA', '#FB923C', '#F97316']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={[styles.orb, styles.orb5Size, styles.shadowOrange]}
          >
            <View style={styles.specularHighlightSmall} />
            <View style={styles.faceColumn}>
              <View style={styles.eyesRowSmall}>
                <View style={styles.eyeDot} />
                <View style={styles.eyeDot} />
              </View>
              <View style={styles.mouthO} />
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 18,
    zIndex: 10,
  },
  brandTitle: {
    fontSize: 38,
    color: '#0F172A',
    letterSpacing: -1.2,
    fontWeight: '900',
  },
  canvasArea: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  orbWrapper: {
    position: 'absolute',
  },
  orb: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
  specularHighlightSmall: {
    position: 'absolute',
    top: '10%',
    left: '16%',
    width: '22%',
    height: '22%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  /* Positions & Sizes */
  orb1Position: {
    top: 10,
    left: width * 0.08,
  },
  orb1Size: {
    width: 82,
    height: 82,
  },
  orb2Position: {
    top: 18,
    right: width * 0.1,
  },
  orb2Size: {
    width: 90,
    height: 90,
  },
  orb3Position: {
    top: 105,
    left: width * 0.06,
  },
  orb3Size: {
    width: 102,
    height: 102,
  },
  orb4Position: {
    top: 115,
    right: width * 0.08,
  },
  orb4Size: {
    width: 108,
    height: 108,
  },
  orb5Position: {
    top: 190,
    left: width * 0.42,
  },
  orb5Size: {
    width: 54,
    height: 54,
  },

  /* Glow / Shadows */
  shadowGreen: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  shadowPink: {
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  shadowBlue: {
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.38,
    shadowRadius: 20,
    elevation: 9,
  },
  shadowYellow: {
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.38,
    shadowRadius: 20,
    elevation: 9,
  },
  shadowOrange: {
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },

  /* Facial Expressions */
  faceColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  eyesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eyesRowWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  eyesRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeOpen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F172A',
  },
  eyeWink: {
    width: 10,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#0F172A',
    transform: [{ rotate: '-10deg' }],
  },
  eyeArch: {
    width: 9,
    height: 5,
    borderTopWidth: 2.5,
    borderColor: '#0F172A',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  eyeArchLarge: {
    width: 11,
    height: 6,
    borderTopWidth: 2.8,
    borderColor: '#0F172A',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  eyeRound: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F172A',
  },
  eyeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F172A',
  },
  smileArc: {
    width: 12,
    height: 6,
    borderBottomWidth: 2,
    borderColor: '#0F172A',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  smileJoy: {
    width: 14,
    height: 8,
    backgroundColor: '#0F172A',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  smileCalm: {
    width: 16,
    height: 7,
    borderBottomWidth: 2.5,
    borderColor: '#0F172A',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  smileWide: {
    width: 18,
    height: 9,
    backgroundColor: '#0F172A',
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  mouthO: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0F172A',
  },
});
