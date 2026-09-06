import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppFonts } from '../../hooks/useAppFonts';
import {
  INDIAN_SKINCARE_CATALOG,
  ALL_SKINCARE_BRANDS,
  SkincareProduct,
} from '../../data/indianSkincareCatalog';
import { LOCAL_PRODUCT_IMAGES } from '../../assets/productImages';
import { useCartStore } from '../../store/useCartStore';
import { getDeviceCurrentLocation } from '../../services/locationService';
import { SearchProcessFlow } from '../../components/search/SearchProcessFlow';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');
const HORIZONTAL_CARD_WIDTH = 150;

const CATEGORIES = [
  { id: 'all', name: 'All Glow', image: LOCAL_PRODUCT_IMAGES.minimalistNiacinamide },
  { id: 'serums', name: 'Serums', image: LOCAL_PRODUCT_IMAGES.dermacoNiacinamide },
  { id: 'moisturizers', name: 'Moisturizers', image: LOCAL_PRODUCT_IMAGES.minimalistVitB5 },
  { id: 'suncare', name: 'Suncare', image: LOCAL_PRODUCT_IMAGES.dermacoSunscreen },
  { id: 'actives', name: 'Actives', image: LOCAL_PRODUCT_IMAGES.dermacoKojicAcid },
  { id: 'cleansers', name: 'Cleansers', image: LOCAL_PRODUCT_IMAGES.minimalistCleanser },
];

const COUPONS = [
  { id: 'c1', discount: 'FLAT ₹50 OFF', minSpend: 'above ₹999' },
  { id: 'c2', discount: 'FLAT ₹100 OFF', minSpend: 'above ₹1599' },
  { id: 'c3', discount: 'FLAT ₹150 OFF', minSpend: 'above ₹2199' },
  { id: 'c4', discount: 'FLAT ₹200 OFF', minSpend: 'above ₹2799' },
];

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();

  // 1. High-accuracy location state with Payikapuram fallback
  const [userLocation, setUserLocation] = useState('Payikapuram, Vijayawada, Andhra Pradesh');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFlowOpen, setIsSearchFlowOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'categories' | 'trending' | 'spotlight'>('home');

  // Global reactive cart store
  const { cart: cartItems, totalCount: totalCartCount, updateQty: handleUpdateQty } = useCartStore();

  // Continuous Brands Marquee Animation
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.timing(marqueeAnim, {
        toValue: -width * 2,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loopAnim.start();
    return () => loopAnim.stop();
  }, [marqueeAnim]);

  // 2. High-Accuracy Location Detection
  useEffect(() => {
    try {
      getDeviceCurrentLocation()
        .then(res => {
          if (res && res.formattedAddress) {
            setUserLocation(res.formattedAddress);
          }
        })
        .catch(() => null);
    } catch {
      // safe fallback
    }
  }, []);

  // Calculate dynamic cart pricing
  const totalCartPrice = Object.entries(cartItems).reduce((sum, [id, count]) => {
    const p = INDIAN_SKINCARE_CATALOG.find(item => item.id === id);
    const unitPrice = p ? p.price : 499;
    return sum + unitPrice * count;
  }, 0);

  const handleOpenProduct = (product: SkincareProduct) => {
    router.push({
      pathname: '/(customer)/product/[id]',
      params: { id: product.id },
    });
  };

  const handleLaunchFaceScan = () => {
    router.push('/(customer)/scan/camera');
  };

  const handleOpenVaithra = () => {
    Linking.openURL('https://vaithra.in').catch(() => {
      Alert.alert('Vaithra', 'Opening https://vaithra.in');
    });
  };

  // Group products by category for horizontal rows
  const serumsList = INDIAN_SKINCARE_CATALOG.filter(p => p.category === 'Serums');
  const moisturizersList = INDIAN_SKINCARE_CATALOG.filter(p => p.category === 'Moisturizers');
  const suncareList = INDIAN_SKINCARE_CATALOG.filter(p => p.category === 'Suncare');

  const renderHorizontalProductCard = (product: SkincareProduct) => {
    const qty = cartItems[product.id] || 0;
    const discount = product.discountPercent || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.horizontalProductCard}
        onPress={() => handleOpenProduct(product)}
        activeOpacity={0.9}
      >
        {/* Top Badges */}
        <View style={styles.cardTopBadgeRow}>
          <View style={styles.deliveryBadgePill}>
            <Ionicons name="flash" size={10} color="#15803D" />
            <Text style={styles.deliveryBadgeText}>10 MINS</Text>
          </View>
          {discount > 0 && (
            <View style={styles.discountPill}>
              <Text style={styles.discountPillText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Image */}
        <View style={styles.cardImageWrapper}>
          <Image source={product.imageSource} style={styles.productCardImage} resizeMode="contain" />
        </View>

        {/* Product Info */}
        <Text style={styles.cardBrandText} numberOfLines={1}>{product.brand}</Text>
        <Text style={styles.cardTitleText} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.cardVolumeText}>{product.volume || '30 ml'}</Text>

        {/* Price and Add Stepper */}
        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.cardPriceText}>₹{product.price}</Text>
            {product.originalPrice ? (
              <Text style={styles.cardMrpText}>₹{product.originalPrice}</Text>
            ) : null}
          </View>

          {qty === 0 ? (
            <TouchableOpacity
              style={styles.cardAddButton}
              onPress={() => handleUpdateQty(product.id, 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardAddButtonText}>ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cardStepperBox}>
              <TouchableOpacity
                style={styles.cardStepperBtn}
                onPress={() => handleUpdateQty(product.id, qty - 1)}
              >
                <Text style={styles.cardStepperText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.cardStepperQty}>{qty}</Text>
              <TouchableOpacity
                style={styles.cardStepperBtn}
                onPress={() => handleUpdateQty(product.id, qty + 1)}
              >
                <Text style={styles.cardStepperText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#7A0009" />

      {/* SINGLE UNIFIED SCROLLVIEW */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainUnifiedScrollContent}
      >
        {/* ========================================================================= */}
        {/* TOP 40%: SIGNATURE CRIMSON RED HEADER + FLASH GLOW DROP GRID              */}
        {/* ========================================================================= */}
        <LinearGradient
          colors={['#7A0009', '#90000C', '#A80010']}
          style={styles.topZeptoHeaderGradient}
        >
          <SafeAreaView style={styles.topHeaderSafeArea}>
            {/* Header Row 1: Status Demand & Address + Profile */}
            <View style={styles.headerRow1}>
              <TouchableOpacity
                style={styles.locationContainer}
                onPress={() => router.push('/(customer)/permissions')}
                activeOpacity={0.7}
              >
                <View style={styles.darkStoreStatusRow}>
                  <View style={styles.darkStoreLiveDot} />
                  <Text style={styles.statusDemandTitle}>⚡ 10 MINS</Text>
                </View>
                <View style={styles.addressLineRow}>
                  <Text style={styles.addressLineText} numberOfLines={1}>
                    {userLocation}
                  </Text>
                  <Ionicons name="chevron-down" size={13} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              {/* Profile Avatar */}
              <TouchableOpacity
                style={styles.profileAvatarCircle}
                onPress={() => router.push('/(customer)/(tabs)/profile')}
                activeOpacity={0.8}
              >
                <Ionicons name="person" size={18} color="#7A0009" />
              </TouchableOpacity>
            </View>

            {/* Header Row 2: Search Bar */}
            <TouchableOpacity
              style={styles.searchBarRow}
              onPress={() => setIsSearchFlowOpen(true)}
              activeOpacity={0.9}
            >
              <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                placeholder='Search "Niacinamide, Sunscreen & more"'
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onFocus={() => setIsSearchFlowOpen(true)}
                style={styles.searchInput}
              />
              <TouchableOpacity
                style={styles.nightStoreTagPill}
                onPress={handleLaunchFaceScan}
                activeOpacity={0.8}
              >
                <View style={styles.nightStoreDivider} />
                <MaterialCommunityIcons name="face-recognition" size={16} color="#0052FF" style={{ marginRight: 4 }} />
                <Text style={styles.nightStoreText}>AI Scan</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </SafeAreaView>

          {/* 1. TOP FOMO 5-BLOCK PROMO GRID */}
          <View style={styles.zeptoFestiveHeroContainer}>
            <View style={styles.festiveHeaderRow}>
              <Text style={styles.celebrateSub}>✨ FLASH GLOW DROP • 98% MATCH</Text>
              <Text
                style={[
                  styles.rakshaBandhanTitle,
                  syneFont ? { fontFamily: syneFont } : { fontWeight: '900' },
                ]}
              >
                Flat ₹100 Off Today
              </Text>
              <Text style={styles.festiveDateText}>⚡ Ends in 12 mins • Free 15-Min Drop</Text>
            </View>

            {/* 5-Block Grid Layout */}
            <View style={styles.festiveBlocksGridRow}>
              {/* Tall Left Block: Glow Specials (Transparent floating bottle) */}
              <TouchableOpacity
                style={styles.tallLeftBlock}
                onPress={handleLaunchFaceScan}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FFFDF4', '#FFF8E1']}
                  style={styles.tallBlockGradient}
                >
                  <Text style={styles.tallBlockTitle}>Glow Specials</Text>
                  <View style={styles.tallPricePill}>
                    <Text style={styles.tallPriceStrikethrough}>₹699</Text>
                    <Text style={styles.tallPriceMain}>₹99</Text>
                  </View>
                  <Image
                    source={LOCAL_PRODUCT_IMAGES.minimalistNiacinamide}
                    style={styles.tallBlockImg}
                    resizeMode="contain"
                  />
                </LinearGradient>
              </TouchableOpacity>

              {/* 4 Small Right Blocks (2x2 Grid) */}
              <View style={styles.rightBlocks2x2Grid}>
                {/* Row 1 */}
                <View style={styles.miniBlockRow}>
                  <TouchableOpacity
                    style={styles.miniBlockCard}
                    onPress={() => router.push('/(customer)/product/prod-02')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.miniBlockTitle}>Serums & More</Text>
                    <Image
                      source={LOCAL_PRODUCT_IMAGES.dermacoNiacinamide}
                      style={styles.miniBlockImg}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.miniBlockCard}
                    onPress={() => router.push('/(customer)/product/prod-07')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.miniBlockTitle}>SPF & Suncare</Text>
                    <Image
                      source={LOCAL_PRODUCT_IMAGES.dermacoSunscreen}
                      style={styles.miniBlockImg}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                {/* Row 2 */}
                <View style={styles.miniBlockRow}>
                  <TouchableOpacity
                    style={styles.miniBlockCard}
                    onPress={() => router.push('/(customer)/product/prod-05')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.miniBlockTitle}>Barrier Creams</Text>
                    <Image
                      source={LOCAL_PRODUCT_IMAGES.minimalistVitB5}
                      style={styles.miniBlockImg}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.miniBlockCard}
                    onPress={() => router.push('/(customer)/product/prod-03')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.miniBlockTitle}>Acne BHA</Text>
                    <Image
                      source={LOCAL_PRODUCT_IMAGES.minimalistSalicylic}
                      style={styles.miniBlockImg}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 3. SWIPEABLE OFFER RIBBONS CAROUSEL */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersCarouselContent}
            >
              {/* Card 1: AI Clinical Face Scan */}
              <TouchableOpacity
                style={styles.offerCarouselCard}
                activeOpacity={0.88}
                onPress={handleLaunchFaceScan}
              >
                <View style={styles.offerCardLeft}>
                  <Text style={styles.offerEmoji}>🔬</Text>
                  <View>
                    <Text style={styles.offerMainText}>AI Biometric Face Scan</Text>
                    <Text style={styles.offerSubText}>Diagnose barrier, acne & hydration pulse</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#FDE68A" />
              </TouchableOpacity>

              {/* Card 2: View Latest Skin Report */}
              <TouchableOpacity
                style={[styles.offerCarouselCard, styles.offerCardBlue]}
                activeOpacity={0.88}
                onPress={() => router.push('/(customer)/scan/report')}
              >
                <View style={styles.offerCardLeft}>
                  <Text style={styles.offerEmoji}>📊</Text>
                  <View>
                    <Text style={styles.offerMainText}>Latest Skin Report</Text>
                    <Text style={styles.offerSubText}>View 6-D metrics & routine prescription</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#93C5FD" />
              </TouchableOpacity>

              {/* Card 3: Login / Account Hub */}
              <TouchableOpacity
                style={[styles.offerCarouselCard, { backgroundColor: 'rgba(255, 255, 255, 0.18)' }]}
                activeOpacity={0.88}
                onPress={() => router.push('/(auth)/login')}
              >
                <View style={styles.offerCardLeft}>
                  <Text style={styles.offerEmoji}>👤</Text>
                  <View>
                    <Text style={styles.offerMainText}>GlowVAI Account & OTP</Text>
                    <Text style={styles.offerSubText}>Manage login, addresses & orders</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* 4. AUTO-SCROLLING INFINITY MARQUEE FOR BRANDS */}
          <View style={styles.brandsMarqueeWrapper}>
            <Animated.View
              style={[
                styles.brandsMarqueeRow,
                { transform: [{ translateX: marqueeAnim }] },
              ]}
            >
              {[...ALL_SKINCARE_BRANDS, ...ALL_SKINCARE_BRANDS].map((brand, idx) => (
                <View key={idx} style={styles.brandChip}>
                  <Text style={styles.brandChipText}>{brand}</Text>
                  <Text style={styles.brandChipDot}>•</Text>
                </View>
              ))}
            </Animated.View>
          </View>
        </LinearGradient>

        {/* ========================================================================= */}
        {/* 5. CURVED WHITE BACKGROUND (borderTopRadius: 28)                           */}
        {/* ========================================================================= */}
        <View style={styles.curvedWhiteBodyContainer}>
          {/* 6. HEADLINE: Zepto-Style Chunky Typography */}
          <View style={styles.smileHeaderSection}>
            <View style={styles.smileTitleRow}>
              <Text style={styles.smileMainText}>GLOW</Text>
              <View style={styles.smilePriceTagBadge}>
                <Text style={styles.smilePriceTagText}>@₹99</Text>
              </View>
            </View>
            <Text style={styles.smileSubtitleText}>Handpicked daily clinical essentials</Text>
          </View>

          {/* 7. CLEAN CATEGORIES CIRCLES */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cleanCategoriesScroll}
          >
            {CATEGORIES.map(cat => {
              const isSelected = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.cleanCategoryCol}
                  onPress={() => setActiveCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.cleanCatCircle, isSelected && styles.cleanCatCircleActive]}>
                    <Image source={cat.image} style={styles.cleanCatImg} resizeMode="contain" />
                  </View>
                  <Text style={[styles.cleanCatLabel, isSelected && styles.cleanCatLabelActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ========================================================================= */}
          {/* 8. HORIZONTAL SCROLLING PRODUCT ROWS (3-4 CATEGORY ROWS)                  */}
          {/* ========================================================================= */}

          {/* ROW 0: AI Prescribed Clinical Routine (Personalized for User) */}
          <View style={styles.categoryRowSection}>
            <View style={styles.categoryRowHeader}>
              <View style={styles.rowHeaderLeft}>
                <Text style={styles.rowHeaderEmoji}>✨</Text>
                <Text style={styles.rowHeaderTitle}>Prescribed For Your Skin</Text>
                <View style={styles.matchScoreBadge}>
                  <Text style={styles.matchScoreBadgeText}>98% Match</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleLaunchFaceScan}>
                <Text style={styles.rescanText}>Retake Scan ›</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsScroll}
            >
              {INDIAN_SKINCARE_CATALOG.filter(p => p.matchScore >= 92).map(product =>
                renderHorizontalProductCard(product)
              )}
            </ScrollView>
          </View>

          {/* ROW 1: Active Serums */}
          <View style={styles.categoryRowSection}>
            <View style={styles.categoryRowHeader}>
              <View style={styles.rowHeaderLeft}>
                <Text style={styles.rowHeaderEmoji}>💧</Text>
                <Text style={styles.rowHeaderTitle}>Active Serums & Toners</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(customer)/(tabs)/shop')}>
                <Text style={styles.seeAllText}>See all ›</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsScroll}
            >
              {serumsList.map(product => renderHorizontalProductCard(product))}
            </ScrollView>
          </View>

          {/* ROW 2: Barrier Repair Moisturizers */}
          <View style={styles.categoryRowSection}>
            <View style={styles.categoryRowHeader}>
              <View style={styles.rowHeaderLeft}>
                <Text style={styles.rowHeaderEmoji}>🧴</Text>
                <Text style={styles.rowHeaderTitle}>Barrier Repair Moisturizers</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(customer)/(tabs)/shop')}>
                <Text style={styles.seeAllText}>See all ›</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsScroll}
            >
              {moisturizersList.map(product => renderHorizontalProductCard(product))}
            </ScrollView>
          </View>

          {/* ROW 3: Suncare & UV Protection */}
          <View style={styles.categoryRowSection}>
            <View style={styles.categoryRowHeader}>
              <View style={styles.rowHeaderLeft}>
                <Text style={styles.rowHeaderEmoji}>☀️</Text>
                <Text style={styles.rowHeaderTitle}>Zero White-Cast Suncare</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(customer)/(tabs)/shop')}>
                <Text style={styles.seeAllText}>See all ›</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalProductsScroll}
            >
              {suncareList.map(product => renderHorizontalProductCard(product))}
            </ScrollView>
          </View>

          {/* ========================================================================= */}
          {/* 9. EXPLORE SECTION WITH 3D CARDS (EXACT IMAGE 4)                          */}
          {/* ========================================================================= */}
          <View style={styles.exploreSection}>
            <Text style={styles.sectionTitleHeader}>Explore</Text>

            {/* Top 2 Cards */}
            <View style={styles.exploreCardsGrid}>
              <TouchableOpacity style={styles.exploreFreshCard} activeOpacity={0.88}>
                <Image source={LOCAL_PRODUCT_IMAGES.minimalistNiacinamide} style={styles.exploreFreshImg} resizeMode="contain" />
                <Text style={styles.exploreFreshTitle}>Fresh</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.exploreSelectWideCard} onPress={handleLaunchFaceScan} activeOpacity={0.88}>
                <LinearGradient colors={['#FFF5EB', '#FFE8D6']} style={styles.selectWideGradient}>
                  <View>
                    <Text style={styles.selectBrandText}>select</Text>
                    <Text style={styles.selectSubText}>Find products you'll love</Text>
                  </View>
                  <View style={styles.gourmetPill}>
                    <Text style={styles.gourmetText}>Gourmet finds</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Bottom 3 Cards */}
            <View style={styles.exploreBottomRow}>
              <TouchableOpacity style={styles.exploreMiniCard} activeOpacity={0.85}>
                <Text style={styles.explore3DEmoji}>🌿</Text>
                <Text style={styles.exploreMiniTitle}>Ayurveda</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.exploreMiniCard} activeOpacity={0.85}>
                <Text style={styles.explore3DEmoji}>🏷️</Text>
                <Text style={styles.exploreMiniTitle}>50% Off</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.exploreMiniCard} activeOpacity={0.85}>
                <Text style={styles.explore3DEmoji}>☂️</Text>
                <Text style={styles.exploreMiniTitle}>Monsoon</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ========================================================================= */}
          {/* 10. COUPONS & OFFERS (EXACT IMAGE 4 GREEN CARDS + PAYMENT CASHBACK)       */}
          {/* ========================================================================= */}
          <View style={styles.couponsSection}>
            <Text style={styles.sectionTitleHeader}>Coupons & Offers</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.couponsScroll}
            >
              {COUPONS.map(c => (
                <View key={c.id} style={styles.couponCard}>
                  <View style={styles.couponIconCircle}>
                    <Ionicons name="pricetag" size={14} color="#059669" />
                  </View>
                  <Text style={styles.couponDiscountText}>{c.discount}</Text>
                  <Text style={styles.couponSpendText}>{c.minSpend}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Payment Cashback Banners (BHIM & Paytm) */}
            <View style={styles.cashbackBannersRow}>
              {/* BHIM UPI Card */}
              <TouchableOpacity style={styles.cashbackCard} activeOpacity={0.88}>
                <View style={styles.cashbackIconBg}>
                  <Ionicons name="flash" size={16} color="#D97706" />
                </View>
                <View style={styles.cashbackTextCol}>
                  <Text style={styles.cashbackTitle}>Get upto ₹50 instant cashback with BHIM App</Text>
                  <Text style={styles.cashbackSub}>Valid on orders above ₹99</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 11. STEAL DEALS SECTION */}
          <View style={styles.stealDealsSection}>
            <Text style={styles.sectionTitleHeader}>Steal Deals</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stealDealsScroll}
            >
              {INDIAN_SKINCARE_CATALOG.slice(0, 5).map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.stealDealCard}
                  onPress={() => handleOpenProduct(product)}
                  activeOpacity={0.9}
                >
                  <View style={styles.stealDealImgWrapper}>
                    <Image source={product.imageSource} style={styles.stealDealImg} resizeMode="contain" />
                    <TouchableOpacity
                      style={styles.stealDealAddBtn}
                      onPress={() => handleUpdateQty(product.id, 1)}
                    >
                      <Ionicons name="add" size={16} color="#E11D48" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.stealDealTitle} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.stealDealPrice}>₹{product.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* BLINKIT-STYLE QUICK-COMMERCE FLOATING CART BAR                             */}
      {/* ========================================================================= */}
      {totalCartCount > 0 && (
        <View style={styles.blinkitCartWrapper} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.blinkitCartPill}
            onPress={() => router.push('/(customer)/(tabs)/orders')}
            activeOpacity={0.9}
          >
            {/* Left Product/Bag Thumbnail */}
            <View style={styles.blinkitImgBadge}>
              <Ionicons name="bag-handle" size={15} color="#FFFFFF" />
            </View>

            {/* Center Stacked Text */}
            <View style={styles.blinkitTextCol}>
              <Text style={styles.blinkitViewCartTitle}>{totalCartCount} item{totalCartCount > 1 ? 's' : ''} • ₹{totalCartPrice}</Text>
              <Text style={styles.blinkitItemSub}>⚡ 10-Min Delivery from Payikapuram</Text>
            </View>

            {/* Right Action */}
            <View style={styles.blinkitViewCartActionRow}>
              <Text style={styles.blinkitViewCartActionText}>View Cart</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ========================================================================= */}
      {/* REFINED BOTTOM NAVIGATION BAR WITH 'vaithra ↗' REDIRECT                   */}
      {/* ========================================================================= */}
      <View style={styles.refinedBottomNavWrapper}>
        <View style={styles.refinedNavBar}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={styles.navTabBtn}
            onPress={() => setActiveNavTab('home')}
            activeOpacity={0.8}
          >
            <Ionicons name="home" size={20} color={activeNavTab === 'home' ? '#085cf0' : '#334155'} />
            <Text style={[styles.navTabLabel, activeNavTab === 'home' && styles.navTabLabelActive]}>Home</Text>
          </TouchableOpacity>

          {/* Tab 2: Categories */}
          <TouchableOpacity
            style={styles.navTabBtn}
            onPress={() => router.push('/(customer)/(tabs)/shop')}
            activeOpacity={0.8}
          >
            <Ionicons name="grid-outline" size={20} color="#334155" />
            <Text style={styles.navTabLabel}>Categories</Text>
          </TouchableOpacity>

          {/* Tab 3: Trending */}
          <TouchableOpacity
            style={styles.navTabBtn}
            onPress={() => router.push('/(customer)/(tabs)/shop')}
            activeOpacity={0.8}
          >
            <Feather name="zap" size={20} color="#334155" />
            <Text style={styles.navTabLabel}>Trending</Text>
          </TouchableOpacity>

          {/* Tab 4: Spotlight */}
          <TouchableOpacity
            style={styles.navTabBtn}
            onPress={handleLaunchFaceScan}
            activeOpacity={0.8}
          >
            <View style={styles.spotlightPurpleCircle}>
              <Ionicons name="sparkles" size={13} color="#FFFFFF" />
            </View>
            <Text style={styles.navTabLabel}>Spotlight</Text>
          </TouchableOpacity>

          {/* Tab 5: vaithra ↗ (Opens https://vaithra.in) */}
          <TouchableOpacity
            style={styles.vaithraEndCardBtn}
            onPress={handleOpenVaithra}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#8B4513', '#6A3805', '#4A2500']}
              style={styles.vaithraCardGradient}
            >
              <Text style={styles.vaithraCardTitle}>vaithra</Text>
              <Text style={styles.vaithraCardSub}>FINDS ↗</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Complete FlowMapp Search Process Modal */}
      <SearchProcessFlow
        visible={isSearchFlowOpen}
        onClose={() => setIsSearchFlowOpen(false)}
        onSelectProduct={(product) => {
          setIsSearchFlowOpen(false);
          handleOpenProduct(product);
        }}
        initialQuery={searchQuery}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainUnifiedScrollContent: {
    paddingBottom: 140,
  },

  /* Top Zepto Crimson Header */
  topZeptoHeaderGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 8,
    paddingBottom: 10,
  },
  topHeaderSafeArea: {
    paddingHorizontal: 16,
  },
  headerRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationContainer: {
    flex: 1,
    marginRight: 10,
  },
  statusDemandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  addressLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  addressLineText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: width * 0.68,
  },
  profileAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Search Bar */
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  nightStoreTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
  },
  nightStoreDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  nightStoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0052FF',
  },

  /* 1. Top 40% Festive / Promo Grid */
  zeptoFestiveHeroContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  festiveHeaderRow: {
    marginBottom: 8,
  },
  celebrateSub: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  rakshaBandhanTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    letterSpacing: -0.5,
    marginTop: 1,
  },
  festiveDateText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  /* 5-Block Grid */
  festiveBlocksGridRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tallLeftBlock: {
    flex: 1.1,
    borderRadius: 14,
    overflow: 'hidden',
    height: 195,
  },
  tallBlockGradient: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tallBlockTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#7A0009',
    textAlign: 'center',
  },
  tallPricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7A0009',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  tallPriceStrikethrough: {
    color: '#FDE68A',
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  tallPriceMain: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  tallBlockImg: {
    width: 92,
    height: 102,
    borderRadius: 10,
  },

  /* 2x2 Right Blocks */
  rightBlocks2x2Grid: {
    flex: 1.3,
    gap: 8,
  },
  miniBlockRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  miniBlockCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 93,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  miniBlockTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  miniBlockImg: {
    width: 48,
    height: 52,
    borderRadius: 6,
  },

  /* 3. Swipeable Offer Ribbons Carousel */
  offersCarouselContent: {
    gap: 8,
    paddingBottom: 8,
  },
  offerCarouselCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(253, 230, 138, 0.35)',
    width: width * 0.82, // Peeks the next card
  },
  offerCardBlue: {
    borderColor: 'rgba(147, 197, 253, 0.35)',
  },
  offerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  offerEmoji: {
    fontSize: 16,
  },
  offerMainText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  offerSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '500',
  },

  /* 4. Auto-Scrolling Infinity Marquee */
  brandsMarqueeWrapper: {
    paddingVertical: 7,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  brandsMarqueeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  brandChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  brandChipDot: {
    color: '#FDE68A',
    fontSize: 14,
    marginLeft: 10,
  },

  /* 5. Curved White Body Container */
  curvedWhiteBodyContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    marginTop: -8,
  },

  /* 6. Smile Header */
  smileHeaderSection: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  smileTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smileMainText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: -0.8,
  },
  smilePriceTagBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  smilePriceTagText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  smileSubtitleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },

  /* 7. Clean Categories Circles */
  cleanCategoriesScroll: {
    paddingHorizontal: 16,
    gap: 14,
    marginBottom: 18,
  },
  cleanCategoryCol: {
    alignItems: 'center',
  },
  cleanCatCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cleanCatCircleActive: {
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
    borderWidth: 2,
  },
  cleanCatImg: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  cleanCatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  cleanCatLabelActive: {
    color: '#0F172A',
    fontWeight: '900',
  },

  /* 8. Category Rows Section (Horizontal Scrolling) */
  categoryRowSection: {
    marginBottom: 20,
  },
  categoryRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  rowHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowHeaderEmoji: {
    fontSize: 16,
  },
  rowHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  matchScoreBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginLeft: 4,
  },
  matchScoreBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  rescanText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00C853',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00C853',
  },
  horizontalProductsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  darkStoreStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  darkStoreLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  horizontalProductCard: {
    width: HORIZONTAL_CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  deliveryBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  deliveryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  discountPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  cardImageWrapper: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  productCardImage: {
    width: '85%',
    height: '85%',
  },
  cardBrandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00C853',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
    minHeight: 32,
  },
  cardVolumeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 6,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  cardPriceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardMrpText: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  cardAddButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#00C853',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAddButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00C853',
  },
  cardStepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  cardStepperBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStepperText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  cardStepperQty: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  /* 9. Explore Section */
  exploreSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitleHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
  },
  exploreCardsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  exploreFreshCard: {
    flex: 1,
    backgroundColor: '#FDF2F8',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 95,
  },
  exploreFreshImg: {
    width: 44,
    height: 44,
    marginBottom: 2,
  },
  exploreFreshTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  exploreSelectWideCard: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
    height: 95,
  },
  selectWideGradient: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  selectBrandText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#8B4513',
  },
  selectSubText: {
    fontSize: 10,
    color: '#8B4513',
  },
  gourmetPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  gourmetText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8B4513',
  },
  exploreBottomRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exploreMiniCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  explore3DEmoji: {
    fontSize: 22,
  },
  exploreMiniTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* 10. Coupons Section */
  couponsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  couponsScroll: {
    gap: 10,
    marginBottom: 12,
  },
  couponCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 10,
    width: 135,
  },
  couponIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  couponDiscountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#065F46',
  },
  couponSpendText: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1,
  },
  cashbackBannersRow: {
    gap: 8,
  },
  cashbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
  },
  cashbackIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cashbackTextCol: {
    flex: 1,
  },
  cashbackTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E40AF',
  },
  cashbackSub: {
    fontSize: 10,
    color: '#3B82F6',
  },

  /* 11. Steal Deals */
  stealDealsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  stealDealsScroll: {
    gap: 12,
  },
  stealDealCard: {
    width: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stealDealImgWrapper: {
    width: '100%',
    height: 75,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  stealDealImg: {
    width: '75%',
    height: '75%',
  },
  stealDealAddBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stealDealTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  stealDealPrice: {
    fontSize: 11,
    fontWeight: '900',
    color: '#15803D',
    marginTop: 1,
  },

  /* ----------------------------------------- */
  /* BLINKIT COMPACT CART ISLAND               */
  /* ----------------------------------------- */
  blinkitCartWrapper: {
    position: 'absolute',
    bottom: 68, // Floating right above bottom nav
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  blinkitCartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C853', // Quick-Commerce Emerald Green
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    width: width * 0.92,
    justifyContent: 'space-between',
  },
  blinkitImgBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  blinkitTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  blinkitViewCartTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
  },
  blinkitItemSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  blinkitViewCartActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  blinkitViewCartActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  /* Refined Bottom Navigation Bar */
  refinedBottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    paddingHorizontal: 12,
    zIndex: 50,
  },
  refinedNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navTabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spotlightPurpleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  navTabLabelActive: {
    color: '#085cf0',
    fontWeight: '800',
  },
  vaithraEndCardBtn: {
    flex: 1.3,
    height: 38,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 4,
  },
  vaithraCardGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vaithraCardTitle: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  vaithraCardSub: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
});
