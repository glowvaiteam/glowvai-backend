import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppFonts } from '../../hooks/useAppFonts';
import { getCurrentUser } from '../../services/authService';

const { height, width } = Dimensions.get('window');

export interface WelcomeScreenProps {
  onFinish?: () => void;
  autoNavigateTimeoutMs?: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onFinish,
  autoNavigateTimeoutMs = 3500,
}) => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Continuous smooth spin animation for the modern bottom ring
  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();
    return () => spinLoop.stop();
  }, [spinAnim]);

  const handleProceed = () => {
    if (onFinish) {
      onFinish();
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      router.replace('/(customer)/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleProceed();
    }, autoNavigateTimeoutMs);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Safe font families with Android compatibility
  const bunchFont = isLoaded && fontFamily ? fontFamily.bunchBold || fontFamily.bunchHeavy : undefined;
  const syneFont = isLoaded && fontFamily ? fontFamily.syneExtraBold || fontFamily.syneBold : undefined;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleProceed}
      style={styles.touchable}
      accessibilityRole="button"
      accessibilityLabel="Welcome to GlowVAI. Tap to continue."
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Sky Blue to White Vertical Gradient matching exact reference */}
      <LinearGradient
        colors={[
          '#FFFFFF',
          '#FFFFFF',
          '#F8FAFC',
          '#F0F9FF',
          '#E0F2FE',
          '#BAE6FD',
          '#7DD3FC',
          '#38BDF8',
          '#0284C7',
        ]}
        locations={[0, 0.2, 0.35, 0.48, 0.6, 0.72, 0.82, 0.92, 1.0]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        {/* Top/Mid Section: Bold "Welcome,\nmate" Typography in Bunch Font */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              styles.welcomeTitle,
              bunchFont ? { fontFamily: bunchFont } : { fontWeight: '800' },
            ]}
          >
            Welcome,
          </Text>
          <Text
            style={[
              styles.mateTitle,
              bunchFont ? { fontFamily: bunchFont } : { fontWeight: '800' },
            ]}
          >
            mate
          </Text>
        </Animated.View>

        {/* Bottom Section: Modern Loading Arc & Centered "glowvai" in Syne Font */}
        <View style={styles.bottomSection}>
          {/* Animated Spinner Arc */}
          <Animated.View
            style={[
              styles.spinnerArc,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />

          {/* Centered Brand Mark in Loaded Syne Font (strictly lowercase "glowvai") */}
          <View style={styles.brandRow}>
            <Text
              style={[
                styles.brandTitle,
                syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
              ]}
              accessibilityRole="header"
            >
              glowvai
            </Text>
          </View>

          <Text style={styles.madeInIndiaText}>MADE IN INDIA</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  textContainer: {
    marginTop: height * 0.26,
    alignItems: 'flex-start',
  },
  welcomeTitle: {
    fontSize: 54,
    color: '#0F172A',
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  mateTitle: {
    fontSize: 54,
    color: '#0F172A',
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  spinnerArc: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3.5,
    borderColor: 'transparent',
    borderTopColor: '#0F172A',
    borderRightColor: '#0F172A',
    marginBottom: 20,
  },
  brandRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 28,
    color: '#0F172A',
    letterSpacing: -0.5,
    textAlign: 'center',
    includeFontPadding: false,
  },
  madeInIndiaText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(15, 23, 42, 0.55)',
    letterSpacing: 3.5,
    textAlign: 'center',
  },
});
