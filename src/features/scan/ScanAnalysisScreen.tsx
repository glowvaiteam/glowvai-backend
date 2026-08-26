import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';
import { analyzeFaceScan } from '../../services/scanService';

const { width, height } = Dimensions.get('window');

const ANALYSIS_PHASES = [
  { id: 1, text: 'Mapping facial zones (T-Zone & Cheeks)...', icon: 'scan' },
  { id: 2, text: 'Measuring moisture barrier & sebum balance...', icon: 'water-outline' },
  { id: 3, text: 'Evaluating acne lesions, texture & pore density...', icon: 'shield-outline' },
  { id: 4, text: 'Formulating clinical 4-step dermatology routine...', icon: 'sparkles' },
];

export const ScanAnalysisScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // Laser beam vertical sweep animation
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start continuous laser beam sweeping animation
    const laserLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    laserLoop.start();

    // Step through the phases
    const phaseInterval = setInterval(() => {
      setActivePhaseIndex(prev => {
        if (prev < ANALYSIS_PHASES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    // Execute real biometric analysis & route to report
    const runAnalysis = async () => {
      try {
        await analyzeFaceScan();
        clearInterval(phaseInterval);
        laserLoop.stop();
        router.replace('/(customer)/scan/report');
      } catch {
        router.replace('/(customer)/scan/report');
      }
    };

    runAnalysis();

    return () => {
      clearInterval(phaseInterval);
      laserLoop.stop();
    };
  }, []);

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height * 0.18, height * 0.18],
  });

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient
        colors={['#040914', '#0A1733', '#060B18']}
        locations={[0, 0.5, 1.0]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Top Title */}
          <View style={styles.topHeader}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>AI DIAGNOSTICS IN PROGRESS</Text>
            </View>
            <Text
              style={[
                styles.title,
                syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
              ]}
            >
              Analyzing Skin Profile
            </Text>
            <Text style={styles.subtitle}>
              Applying dermatological computer vision across 64 facial telemetry points.
            </Text>
          </View>

          {/* Central Face Target with Laser Sweep Animation */}
          <View style={styles.scannerCenter}>
            <View style={styles.scanTargetBox}>
              <MaterialCommunityIcons name="face-recognition" size={130} color="#38BDF8" />

              {/* Animated Glowing Laser Beam */}
              <Animated.View
                style={[
                  styles.laserBeam,
                  {
                    transform: [{ translateY: laserTranslateY }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(56, 189, 248, 0)', '#38BDF8', 'rgba(56, 189, 248, 0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.laserLine}
                />
              </Animated.View>
            </View>
          </View>

          {/* Stepper Phase Indicators */}
          <View style={styles.phasesCard}>
            {ANALYSIS_PHASES.map((phase, idx) => {
              const isCompleted = idx < activePhaseIndex;
              const isCurrent = idx === activePhaseIndex;

              return (
                <View key={phase.id} style={styles.phaseRow}>
                  <View
                    style={[
                      styles.phaseDot,
                      isCompleted && styles.phaseDotCompleted,
                      isCurrent && styles.phaseDotCurrent,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : (
                      <Ionicons
                        name={phase.icon as any}
                        size={12}
                        color={isCurrent ? '#38BDF8' : '#64748B'}
                      />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.phaseText,
                      isCurrent && styles.phaseTextCurrent,
                      isCompleted && styles.phaseTextCompleted,
                    ]}
                  >
                    {phase.text}
                  </Text>
                </View>
              );
            })}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040914',
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  topHeader: {
    alignItems: 'center',
    paddingTop: 12,
  },
  badgePill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 12,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 26,
    color: '#F8FAFC',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300,
  },
  scannerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTargetBox: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#0F1E3D',
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  laserBeam: {
    position: 'absolute',
    width: '100%',
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laserLine: {
    width: '100%',
    height: 3,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  phasesCard: {
    backgroundColor: '#0F1E3D',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 12,
    marginBottom: 20,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phaseDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseDotCurrent: {
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  phaseDotCompleted: {
    backgroundColor: '#10B981',
  },
  phaseText: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  phaseTextCurrent: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  phaseTextCompleted: {
    color: '#94A3B8',
  },
});
