import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppFonts } from '../../../src/hooks/useAppFonts';
import { getLatestSkinReport } from '../../../src/services/scanService';
import { getRecommendedRoutine } from '../../../src/services/recommendationService';

const { width } = Dimensions.get('window');

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();
  const [deliveryMode, setDeliveryMode] = useState<'INSTANT' | 'STANDARD'>('INSTANT');
  const [cartCount, setCartCount] = useState(0);

  const report = getLatestSkinReport();
  const recommendedRoutine = getRecommendedRoutine(report);

  const handleAddToCart = (productName: string) => {
    setCartCount(prev => prev + 1);
    Alert.alert('Added to Cart', `${productName} added to your delivery bag!`);
  };

  const handleAddAllToCart = () => {
    setCartCount(prev => prev + 4);
    Alert.alert('Full Routine Added!', 'All 4 curated skincare steps added to your bag with 20% AI Scan Discount applied!');
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  const glowScore = report?.overallScore || 84;
  const skinType = report?.skinType || 'COMBINATION';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060B18" />

      {/* Top Hyperlocal Location & Cart Header */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          style={styles.locationSelector}
          onPress={() => router.push('/(customer)/permissions')}
          activeOpacity={0.7}
        >
          <View style={styles.locationPinCircle}>
            <Ionicons name="location-sharp" size={16} color="#38BDF8" />
          </View>
          <View style={styles.locationInfo}>
            <View style={styles.locationTitleRow}>
              <Text style={styles.locationTitle}>HSR Layout, Bengaluru</Text>
              <Ionicons name="chevron-down" size={14} color="#94A3B8" />
            </View>
            <Text style={styles.serviceableTag}>⚡ 30-Min Delivery Active (1.4 km away)</Text>
          </View>
        </TouchableOpacity>

        {/* Cart Icon with Dynamic Count Badge */}
        <TouchableOpacity
          style={styles.cartIconBtn}
          onPress={() => Alert.alert('Your Cart', `${cartCount} items in your bag. Free delivery on orders over ₹300!`)}
          activeOpacity={0.7}
        >
          <Ionicons name="bag-handle-outline" size={22} color="#F8FAFC" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Delivery Mode Toggle (30-Min Flash vs Standard Dispatch) */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[styles.modeTab, deliveryMode === 'INSTANT' && styles.modeTabActive]}
            onPress={() => setDeliveryMode('INSTANT')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, deliveryMode === 'INSTANT' && styles.modeTabTextActive]}>
              ⚡ 30-Min Instant Drop
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, deliveryMode === 'STANDARD' && styles.modeTabActive]}
            onPress={() => setDeliveryMode('STANDARD')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeTabText, deliveryMode === 'STANDARD' && styles.modeTabTextActive]}>
              📦 Standard Catalog
            </Text>
          </TouchableOpacity>
        </View>

        {/* AI Skin Diagnosis Summary Card */}
        <TouchableOpacity
          style={styles.diagnosisHeroCard}
          onPress={() => router.push('/(customer)/scan/report')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#0F2552', '#0C1B3B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCardGradient}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillNum}>{glowScore}</Text>
                <Text style={styles.scorePillLabel}>/100 GLOW SCORE</Text>
              </View>
              <TouchableOpacity
                style={styles.rescanBtn}
                onPress={() => router.push('/(customer)/scan/camera')}
                activeOpacity={0.7}
              >
                <Ionicons name="scan" size={14} color="#38BDF8" />
                <Text style={styles.rescanText}>Rescan Face</Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.heroTitle,
                syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
              ]}
            >
              {skinType} Skin Profile
            </Text>
            <Text style={styles.heroSubtitle}>
              4 personalized steps formulated to balance sebum, refine pores & boost hydration.
            </Text>

            <View style={styles.discountTagRow}>
              <Ionicons name="pricetag" size={13} color="#10B981" />
              <Text style={styles.discountTagText}>20% AI Scan Discount Applied on Routine</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Section: AI-Curated 4-Step Routine */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Your AI-Curated Routine</Text>
            <Text style={styles.sectionSubtitle}>Dermatology formulations matched to your diagnostic report</Text>
          </View>
        </View>

        {/* 4-Step Routine Cards */}
        {recommendedRoutine.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productTopRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>STEP {product.stepNumber}: {product.stepName.toUpperCase()}</Text>
              </View>
              <View style={styles.etaBadge}>
                <Ionicons name="flash" size={12} color="#38BDF8" />
                <Text style={styles.etaText}>{product.deliveryMinutes} MINS</Text>
              </View>
            </View>

            <Text style={styles.brandName}>{product.brand}</Text>
            <Text style={styles.productTitle}>{product.name}</Text>

            {/* Key Active Ingredients */}
            <View style={styles.ingredientChipsRow}>
              {product.keyIngredients.map((ing, i) => (
                <View key={i} style={styles.ingChip}>
                  <Text style={styles.ingText}>{ing}</Text>
                </View>
              ))}
            </View>

            {/* Price & Add to Bag Row */}
            <View style={styles.priceRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>₹{product.price}</Text>
                <Text style={styles.originalPriceText}>₹{product.originalPrice}</Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>20% OFF</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAddToCart(product.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.addBtnText}>+ Add to Bag</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* 1-Tap Add All Routine to Cart CTA */}
        <TouchableOpacity
          style={styles.addAllBtn}
          onPress={handleAddAllToCart}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#1D4ED8', '#2563EB', '#38BDF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addAllGradient}
          >
            <Ionicons name="bag-check" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.addAllText}>Add Complete Routine to Cart (₹1,757)</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Dynamic Pricing Note (PDF Workflow Logic) */}
        <View style={styles.pricingNoteCard}>
          <Ionicons name="information-circle-outline" size={16} color="#38BDF8" />
          <Text style={styles.pricingNoteText}>
            Free delivery on orders over ₹300. Orders below ₹300 include a flat ₹25 small cart fee & ₹3 tamper-evident packaging.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  topHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#131D33',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationPinCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  serviceableTag: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  cartIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131D33',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F1E3D',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: '#1D4ED8',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  diagnosisHeroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  heroCardGradient: {
    padding: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  scorePillNum: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38BDF8',
  },
  scorePillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  rescanText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  heroTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  discountTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  discountTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  sectionHeaderRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  productCard: {
    backgroundColor: '#0F1E3D',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  productTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    backgroundColor: '#0A1329',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
  },
  brandName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  ingredientChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  ingChip: {
    backgroundColor: '#0A1329',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  ingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  originalPriceText: {
    fontSize: 12,
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  saveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
  },
  addBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addAllBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginVertical: 10,
  },
  addAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  addAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pricingNoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0A1329',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 8,
  },
  pricingNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
  },
});
