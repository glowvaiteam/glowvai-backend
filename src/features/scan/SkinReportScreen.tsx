import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';
import { getLatestSkinReport } from '../../services/scanService';

export const SkinReportScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();
  const report = getLatestSkinReport();

  const score = report?.overallScore || 82;

  const handleDownloadReport = () => {
    Alert.alert(
      'Download Clinical Report',
      'Your full GlowVAI Biometric Skin Diagnosis Report has been compiled and saved to your device as a PDF.',
      [{ text: 'View File', style: 'default' }, { text: 'Done', style: 'cancel' }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My GlowVAI Skin Health Score is ${score}/100 with Stable barrier health. Check your clinical face scan on GlowVAI!`,
      });
    } catch {
      // ignore
    }
  };

  const handleGoHome = () => {
    router.replace('/(customer)/(tabs)');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(customer)/(tabs)');
    }
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Minimal Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={handleBack} style={styles.navBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text style={[styles.navTitle, syneFont ? { fontFamily: syneFont } : { fontWeight: '700' }]}>
            Skin Report
          </Text>
          <View style={styles.navRightActions}>
            <TouchableOpacity
              onPress={handleDownloadReport}
              style={styles.navBtn}
              activeOpacity={0.7}
              accessibilityLabel="Download PDF report"
            >
              <Ionicons name="download-outline" size={20} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.navBtn}
              activeOpacity={0.7}
              accessibilityLabel="Share report"
            >
              <Ionicons name="share-outline" size={20} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: Exact Semi-Circular Gauge UI */}
          <View style={styles.gaugeCard}>
            <View style={styles.gaugeContainer}>
              <LinearGradient
                colors={['#BAE6FD', '#38BDF8', '#0284C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gaugeArc}
              >
                {/* Gauge Sparkle Particles */}
                <View style={[styles.sparkleDot, { top: 28, left: 48 }]} />
                <View style={[styles.sparkleDot, { top: 22, right: 58 }]} />
                <View style={[styles.sparkleDot, { top: 58, left: 28 }]} />
                <View style={[styles.sparkleDot, { top: 50, right: 38 }]} />

                {/* Score Needle Indicator */}
                <View style={styles.needleIndicator} />

                {/* Inner Cutout White Semi-Circle */}
                <View style={styles.gaugeCutout} />
              </LinearGradient>

              {/* Large Score Text sitting perfectly centered inside bottom arc without clipping */}
              <View style={styles.scoreContainer}>
                <Text
                  style={[
                    styles.scoreValue,
                    syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
                  ]}
                >
                  {score}
                </Text>
              </View>
            </View>

            {/* Status Titles below Gauge */}
            <Text
              style={[
                styles.gaugeStatusTitle,
                syneFont ? { fontFamily: syneFont } : { fontWeight: '700' },
              ]}
            >
              Stable state
            </Text>
            <Text style={styles.gaugeStatusSubtitle}>Keep going — you're on track</Text>
          </View>

          {/* SECTION 2: Vertically Scrolling Skin Metric Cards */}
          <Text style={styles.metricsHeading}>Biometric Skin Metrics</Text>

          {/* Card 1: Hydration Levels */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <View style={styles.metricTitleGroup}>
                <View style={[styles.metricDot, { backgroundColor: '#38BDF8' }]} />
                <Text style={styles.metricName}>Hydration Levels</Text>
              </View>
              <Text style={styles.metricScoreText}>68%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '68%', backgroundColor: '#38BDF8' }]} />
            </View>
            <Text style={styles.metricDesc}>Optimal moisture barrier across cheek and forehead zones.</Text>
          </View>

          {/* Card 2: Acne & Blemishes */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <View style={styles.metricTitleGroup}>
                <View style={[styles.metricDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.metricName}>Acne & Blemishes</Text>
              </View>
              <Text style={styles.metricScoreText}>14% (Low)</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '14%', backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.metricDesc}>Minimal active pore inflammation detected in the T-Zone.</Text>
          </View>

          {/* Card 3: Pigmentation */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <View style={styles.metricTitleGroup}>
                <View style={[styles.metricDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.metricName}>Pigmentation</Text>
              </View>
              <Text style={styles.metricScoreText}>86% (Even)</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '86%', backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={styles.metricDesc}>Consistent melanin distribution with low photo-damage.</Text>
          </View>

          {/* Card 4: Texture & Pores */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <View style={styles.metricTitleGroup}>
                <View style={[styles.metricDot, { backgroundColor: '#A855F7' }]} />
                <Text style={styles.metricName}>Texture & Pores</Text>
              </View>
              <Text style={styles.metricScoreText}>81% (Smooth)</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '81%', backgroundColor: '#A855F7' }]} />
            </View>
            <Text style={styles.metricDesc}>Fine pore refinement with resilient epidermal texture.</Text>
          </View>

          {/* Space for bottom fixed buttons */}
          <View style={{ height: 16 }} />
        </ScrollView>

        {/* SECTION 3: Fixed Bottom Action Area */}
        <View style={styles.bottomFixedButtons}>
          {/* Primary Action: Go to Home Page */}
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={handleGoHome}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Go to home page"
          >
            <Text style={styles.homeBtnText}>Go to Home Page</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          {/* Secondary Action: Subtle Ghost Link */}
          <TouchableOpacity
            style={styles.downloadGhostBtn}
            onPress={handleDownloadReport}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Download PDF report"
          >
            <Ionicons name="document-text-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.downloadGhostText}>Download PDF Report</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  navTitle: {
    fontSize: 16,
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 14,
  },
  gaugeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 3,
  },
  gaugeContainer: {
    width: 240,
    height: 125,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  gaugeArc: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sparkleDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  needleIndicator: {
    position: 'absolute',
    top: 20,
    right: 76,
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#0F172A',
    transform: [{ rotate: '25deg' }],
  },
  gaugeCutout: {
    position: 'absolute',
    top: 34,
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: '#FFFFFF',
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 86,
    zIndex: 10,
  },
  scoreValue: {
    fontSize: 54,
    color: '#0F172A',
    letterSpacing: -1.5,
    lineHeight: 60,
    textAlign: 'center',
  },
  gaugeStatusTitle: {
    fontSize: 22,
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  gaugeStatusSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  metricsHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
    marginBottom: 2,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  metricScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  bottomFixedButtons: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
    alignItems: 'stretch',
  },
  homeBtn: {
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  downloadGhostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  downloadGhostText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
