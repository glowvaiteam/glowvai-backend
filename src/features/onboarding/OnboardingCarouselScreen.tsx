import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  badge: string;
  icon: string;
  title: string;
  subtitle: string;
  gradientColors: [string, string, string];
  perks: string[];
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    badge: 'AI SKIN DIAGNOSTICS',
    icon: 'scan-outline',
    title: 'Precision AI Face Scan in Seconds',
    subtitle:
      'Analyze acne, hydration, texture roughness, and dark spots with clinical-grade biometric computer vision.',
    gradientColors: ['#0A1942', '#1E40AF', '#38BDF8'],
    perks: ['Multi-zone skin breakdown', 'Continuous barrier tracking', 'Clinical diagnostic report'],
  },
  {
    id: '2',
    badge: 'DERMATOLOGY SCIENCE',
    icon: 'flask-outline',
    title: 'Custom Ingredients Tailored to You',
    subtitle:
      'Zero guesswork. Get a targeted 4-step routine matched to your unique sebum and hydration metrics.',
    gradientColors: ['#042F2E', '#0D9488', '#2DD4BF'],
    perks: ['Active ingredient recommendations', 'Skin sensitivity match', 'Expert routine timeline'],
  },
  {
    id: '3',
    badge: 'HYPERLOCAL QUICK-COMMERCE',
    icon: 'flash-outline',
    title: '30-Min Express Delivery to Your Door',
    subtitle:
      'Verified skincare products from trusted local beauty partners, packed in tamper-proof packaging.',
    gradientColors: ['#1E1B4B', '#4F46E5', '#818CF8'],
    perks: ['Live rider GPS tracking', 'Tamper-evident QR security', '30-minute doorstep guarantee'],
  },
];

export const OnboardingCarouselScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    router.replace('/(auth)/login');
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Top Header Row with Skip Button */}
      <SafeAreaView style={styles.topHeader}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.brandLogo,
              syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
            ]}
          >
            glowvai
          </Text>
          <TouchableOpacity
            onPress={handleFinish}
            style={styles.skipButton}
            activeOpacity={0.7}
            accessibilityLabel="Skip onboarding to login"
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slideItem}>
            {/* Visual Card Hero */}
            <LinearGradient
              colors={item.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.artCard}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={48} color="#FFFFFF" />
              </View>
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            </LinearGradient>

            {/* Slide Content */}
            <View style={styles.textContent}>
              <Text
                style={[
                  styles.title,
                  syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              {/* Perks List */}
              <View style={styles.perksContainer}>
                {item.perks.map((perk, pIdx) => (
                  <View key={pIdx} style={styles.perkRow}>
                    <Ionicons name="checkmark-circle" size={16} color="#38BDF8" />
                    <Text style={styles.perkText}>{perk}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      />

      {/* Bottom Footer: Pagination & Next Button */}
      <SafeAreaView style={styles.bottomFooter}>
        <View style={styles.footerRow}>
          {/* Pagination Indicators */}
          <View style={styles.paginationRow}>
            {ONBOARDING_SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.paginationDot,
                  currentIndex === idx && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          {/* Action CTA Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={
              currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next slide'
            }
          >
            <LinearGradient
              colors={['#1D4ED8', '#2563EB', '#38BDF8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  topHeader: {
    paddingTop: 12,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  brandLogo: {
    fontSize: 24,
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#131D33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginRight: 2,
  },
  slideItem: {
    width: width,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  artCard: {
    width: width - 48,
    height: height * 0.36,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgePill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  textContent: {
    width: '100%',
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    color: '#F8FAFC',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 21,
    marginBottom: 18,
  },
  perksContainer: {
    gap: 8,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  bottomFooter: {
    paddingBottom: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#38BDF8',
  },
  nextButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  nextBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
