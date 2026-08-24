import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
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
  autoNavigateTimeoutMs = 2600,
}) => {
  const router = useRouter();
  const { isLoaded, fontError, fontFamily } = useAppFonts();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const bottomFadeAnim = useRef(new Animated.Value(0)).current;

  const handleProceed = () => {
    if (onFinish) {
      onFinish();
      return;
    }

    // Real Firebase Auth routing check
    const currentUser = getCurrentUser();
    if (currentUser) {
      router.replace('/(customer)/(tabs)/index');
    } else {
      router.replace('/(auth)/login');
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(bottomFadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after timeout
    const timer = setTimeout(() => {
      handleProceed();
    }, autoNavigateTimeoutMs);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Development error state if Syne font fails to load (Rule 5)
  if (fontError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Font Loading Failure</Text>
        <Text style={styles.errorDescription}>
          Failed to load the official Syne font family: {fontError.message}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={isLoaded ? handleProceed : undefined}
      style={styles.touchable}
      accessibilityRole="button"
      accessibilityLabel="Welcome to GlowVAI. Tap to continue."
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Blue to White Vertical Gradient matching exact reference */}
      <LinearGradient
        colors={[
          '#1E78FF',
          '#2563EB',
          '#3B82F6',
          '#60A5FA',
          '#93C5FD',
          '#BFDBFE',
          '#DBEAFE',
          '#EFF6FF',
          '#F8FAFC',
          '#FFFFFF',
        ]}
        locations={[0, 0.12, 0.28, 0.45, 0.62, 0.75, 0.84, 0.92, 0.97, 1.0]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        {/* Centered Brand Mark with loaded Syne font */}
        <View style={styles.centerContainer}>
          {isLoaded && fontFamily ? (
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text
                style={[
                  styles.brandTitle,
                  { fontFamily: fontFamily.syneExtraBold },
                ]}
                accessibilityRole="header"
              >
                glowvai
              </Text>
            </Animated.View>
          ) : (
            <ActivityIndicator size="small" color="#0A1128" />
          )}
        </View>

        {/* Bottom Made in India Badge */}
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: isLoaded ? bottomFadeAnim : 0,
            },
          ]}
        >
          <Text style={styles.madeInIndiaText}>MADE IN INDIA</Text>
        </Animated.View>
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
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 52,
    fontWeight: '800',
    color: '#0A1128',
    letterSpacing: -1.5,
    textAlign: 'center',
    includeFontPadding: false,
  },
  bottomContainer: {
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  madeInIndiaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7D93B2',
    letterSpacing: 4.5,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorDescription: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
