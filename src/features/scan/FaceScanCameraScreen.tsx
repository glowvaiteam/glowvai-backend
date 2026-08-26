import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';

const { width, height } = Dimensions.get('window');

export const FaceScanCameraScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const handleCapture = () => {
    router.push('/(customer)/scan/analyzing');
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip AI Skin Scan?',
      'Scanning your face gives you personalized ingredient matches and a 20% discount. Continue to home without scanning?',
      [
        { text: 'Scan Now', style: 'cancel' },
        {
          text: 'Skip to Home',
          style: 'destructive',
          onPress: () => router.replace('/(customer)/(tabs)'),
        },
      ]
    );
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Positive Tagline matching Reference */}
      <View style={styles.header}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.titleMain,
            syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
          ]}
        >
          it's time to
        </Text>
        <Text style={styles.titleSub}>give a second chance to your skin</Text>
      </View>

      {/* Center Camera Placeholder with Silhouette Guide */}
      <View style={styles.centerContainer}>
        <View style={styles.cameraBox}>
          {/* Inner Silhouette Face + Shoulders Frame */}
          <LinearGradient
            colors={['#E2E8F0', '#CBD5E1', '#94A3B8']}
            style={styles.silhouetteViewport}
          >
            {/* Top Face Circle / Lens Guide */}
            <View style={styles.faceGuideCircle}>
              <LinearGradient
                colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
                style={styles.faceGuideGradient}
              >
                <MaterialCommunityIcons name="face-recognition" size={80} color="#0284C7" />
              </LinearGradient>
            </View>

            {/* Bottom Shoulder Silhouette Arc */}
            <View style={styles.shoulderSilhouette} />
          </LinearGradient>
        </View>
      </View>

      {/* 3 Instructions Row below Camera Frame */}
      <View style={styles.instructionsSection}>
        <View style={styles.instructionItem}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="water-outline" size={20} color="#0284C7" />
          </View>
          <Text style={styles.instructionText}>Wash your face</Text>
        </View>

        <View style={styles.instructionItem}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="glasses-outline" size={20} color="#0284C7" />
          </View>
          <Text style={styles.instructionText}>Remove specs</Text>
        </View>

        <View style={styles.instructionItem}>
          <View style={styles.instructionIconCircle}>
            <Ionicons name="sunny-outline" size={20} color="#0284C7" />
          </View>
          <Text style={styles.instructionText}>Good lighting</Text>
        </View>
      </View>

      {/* Bottom Shutter & Controls Row matching Reference */}
      <View style={styles.bottomControlsRow}>
        {/* Left: Gallery Pick Action */}
        <TouchableOpacity
          style={styles.sideControlBtn}
          onPress={() => handleCapture()}
          activeOpacity={0.7}
          accessibilityLabel="Upload from gallery"
        >
          <Ionicons name="images-outline" size={22} color="#0F172A" />
        </TouchableOpacity>

        {/* Center: Double-Ring Shutter Button */}
        <TouchableOpacity
          style={styles.shutterOuterRing}
          onPress={handleCapture}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Capture face scan selfie"
        >
          <View style={styles.shutterInnerCircle} />
        </TouchableOpacity>

        {/* Right: Camera Flip Action */}
        <TouchableOpacity
          style={styles.sideControlBtn}
          onPress={() => setIsFrontCamera(prev => !prev)}
          activeOpacity={0.7}
          accessibilityLabel="Flip camera direction"
        >
          <Ionicons name="camera-reverse-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  topNavRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  titleMain: {
    fontSize: 24,
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  titleSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cameraBox: {
    width: width * 0.78,
    height: height * 0.44,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#CBD5E1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  silhouetteViewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 36,
  },
  faceGuideCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  faceGuideGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoulderSilhouette: {
    width: width * 0.78,
    height: 90,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: '#0F172A',
  },
  instructionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  instructionItem: {
    alignItems: 'center',
    gap: 6,
  },
  instructionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  instructionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  bottomControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 24,
  },
  sideControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shutterOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#0F172A',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInnerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: '#0F172A',
  },
});
