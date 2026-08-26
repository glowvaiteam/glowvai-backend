import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useAppFonts } from '../../hooks/useAppFonts';
import { analyzeFaceScan } from '../../services/scanService';

const { width } = Dimensions.get('window');

export const FaceScanScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();

  // Camera permissions & state
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Animations
  const flashAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Auto trigger permission prompt on load if needed
  useEffect(() => {
    if (!permission) {
      requestPermission();
    } else if (!permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // Pulsing dot animation for ready badge
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Flip camera between front & back
  const handleToggleFacing = () => {
    setFacing(prev => (prev === 'front' ? 'back' : 'front'));
  };

  // Toggle flash / torch
  const handleToggleFlash = () => {
    setIsFlashOn(prev => !prev);
  };

  // Shutter press handler: capture scan and transition to skin report
  const handleCapturePress = () => {
    if (isCapturing) return;
    setIsCapturing(true);

    // Flash animation burst
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    analyzeFaceScan().then(() => {
      setTimeout(() => {
        router.replace('/(customer)/scan/report');
      }, 1200);
    });
  };

  // Safe navigation back
  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(customer)/(tabs)');
    }
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneExtraBold || fontFamily.syneBold : undefined;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeftCol}>
          <Text style={styles.brandSubtitle}>GLOWVAI INSIGHT</Text>
          <Text
            style={[
              styles.brandTitle,
              syneFont ? { fontFamily: syneFont } : { fontWeight: '900' },
            ]}
          >
            SKIN PULSE
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeBtn}
          activeOpacity={0.7}
          accessibilityLabel="Close camera"
        >
          <Ionicons name="close" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* 1. THE LIVE HARDWARE CAMERA CONTAINER (Hero Viewfinder) */}
      <View style={styles.cameraHeroContainer}>
        {/* Flash Burst Overlay */}
        <Animated.View
          style={[
            styles.flashOverlay,
            {
              opacity: flashAnim,
            },
          ]}
          pointerEvents="none"
        />

        {/* Real-time Hardware Camera Feed */}
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            enableTorch={isFlashOn}
          />
        ) : (
          <View style={styles.permissionFallbackContainer}>
            <MaterialCommunityIcons name="camera-outline" size={54} color="#94A3B8" />
            <Text style={styles.permissionFallbackTitle}>Camera Access Required</Text>
            <Text style={styles.permissionFallbackSubtitle}>
              Please grant camera access so GlowVAI can scan your face in real-time.
            </Text>
            <TouchableOpacity
              style={styles.enableCameraBtn}
              onPress={requestPermission}
              activeOpacity={0.85}
            >
              <Text style={styles.enableCameraBtnText}>Enable Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Top Center Floating Badge */}
        <View style={styles.floatingBadgePill} pointerEvents="none">
          <Animated.View style={[styles.blackDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.floatingBadgeText}>READY TO SCAN</Text>
        </View>
      </View>

      {/* INSTRUCTION CARDS (Below Camera) */}
      <View style={styles.instructionCardsRow}>
        {/* Card 1: Remove Glasses */}
        <View style={styles.instructionCard}>
          <View style={[styles.instructionIconBadge, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="glasses-outline" size={22} color="#0284C7" />
          </View>
          <Text style={styles.instructionText}>Remove glasses</Text>
        </View>

        {/* Card 2: Natural Lighting */}
        <View style={styles.instructionCard}>
          <View style={[styles.instructionIconBadge, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="sunny-outline" size={22} color="#EA580C" />
          </View>
          <Text style={styles.instructionText}>Natural lighting</Text>
        </View>

        {/* Card 3: Clean Face Skin */}
        <View style={styles.instructionCard}>
          <View style={[styles.instructionIconBadge, { backgroundColor: '#F0FDFA' }]}>
            <Ionicons name="sparkles-outline" size={22} color="#0D9488" />
          </View>
          <Text style={styles.instructionText}>Clean face skin</Text>
        </View>
      </View>

      {/* BOTTOM CONTROLS */}
      <View style={styles.bottomControlsRow}>
        {/* Left: Flip Camera */}
        <TouchableOpacity
          style={styles.minimalControlBtn}
          onPress={handleToggleFacing}
          activeOpacity={0.7}
          accessibilityLabel="Flip camera"
        >
          <Ionicons name="camera-reverse-outline" size={24} color="#0F172A" />
        </TouchableOpacity>

        {/* Center: Large Shutter Button (Black outer ring, white gap, solid black inner circle) */}
        <TouchableOpacity
          style={styles.shutterRingOuter}
          onPress={handleCapturePress}
          activeOpacity={0.85}
          disabled={isCapturing}
          accessibilityRole="button"
          accessibilityLabel="Take face scan"
        >
          <View style={styles.shutterInnerBlackCircle}>
            {isCapturing && (
              <MaterialCommunityIcons name="loading" size={28} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>

        {/* Right: Flash Toggle */}
        <TouchableOpacity
          style={[
            styles.minimalControlBtn,
            isFlashOn && styles.minimalControlBtnActive,
          ]}
          onPress={handleToggleFlash}
          activeOpacity={0.7}
          accessibilityLabel="Toggle flash"
        >
          <Ionicons
            name={isFlashOn ? 'flash' : 'flash-off-outline'}
            size={22}
            color={isFlashOn ? '#2563EB' : '#0F172A'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 6,
  },
  headerLeftCol: {
    flexDirection: 'column',
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 28,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* The Live Camera Container */
  cameraHeroContainer: {
    height: 440,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 40,
  },

  /* Permissions Fallback */
  permissionFallbackContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  permissionFallbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 4,
    textAlign: 'center',
  },
  permissionFallbackSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  enableCameraBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  enableCameraBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Floating Badge Pill */
  floatingBadgePill: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 20,
  },
  blackDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0F172A',
    marginRight: 7,
  },
  floatingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.6,
  },

  /* Instruction Cards */
  instructionCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 14,
  },
  instructionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  instructionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },

  /* Bottom Controls */
  bottomControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 36,
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
    marginTop: 10,
  },
  minimalControlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minimalControlBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  shutterRingOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3.5,
    borderColor: '#0F172A',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  shutterInnerBlackCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
