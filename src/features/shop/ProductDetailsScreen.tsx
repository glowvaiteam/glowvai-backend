import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppFonts } from '../../hooks/useAppFonts';
import { INDIAN_SKINCARE_CATALOG, SkincareProduct } from '../../data/indianSkincareCatalog';
import { useCartStore } from '../../store/useCartStore';

const { width, height } = Dimensions.get('window');

export const ProductDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoaded, fontFamily } = useAppFonts();
  const { addToCart, totalCount: globalCartCount, getTotalPrice } = useCartStore();

  // Find selected product or fallback to first
  const product: SkincareProduct =
    INDIAN_SKINCARE_CATALOG.find(p => p.id === id) || INDIAN_SKINCARE_CATALOG[0]!;

  const [isFavorite, setIsFavorite] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const flyAnim = useRef(new Animated.Value(0)).current;
  const [isFlying, setIsFlying] = useState(false);

  // 3D Hero Image Interpolation
  const imageScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.65],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.4],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 25],
    extrapolate: 'clamp',
  });

  // Calculate remaining threshold for free delivery (₹500 target)
  const currentCartTotal = (product.price * cartQuantity);
  const freeDeliveryThreshold = 500;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - currentCartTotal);
  const progressPercent = Math.min(100, (currentCartTotal / freeDeliveryThreshold) * 100);

  /**
   * Gamified Add to Cart Flow:
   * 1. Opens Apple-style Glassmorphism Modal.
   * 2. Plays flying particle animation towards top right Cart.
   * 3. Syncs with global Cart Store.
   */
  const handleOpenCartModal = () => {
    setIsAddToCartModalVisible(true);
  };

  const handleConfirmAddToCart = () => {
    setIsAddToCartModalVisible(false);
    setIsFlying(true);
    flyAnim.setValue(0);

    // Gamified Fly Animation: Shrinks and flies up into the cart icon
    Animated.timing(flyAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start(() => {
      setIsFlying(false);
      // Sync into reactive cart store
      addToCart(product.id, cartQuantity);
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(customer)/(tabs)');
    }
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  // Strict image resolution priority: official_brand_image_url > imageSource
  const resolvedImageSource = product.official_brand_image_url
    ? { uri: product.official_brand_image_url }
    : product.imageSource;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* SOFT LUXURY GRADIENT BACKGROUND */}
      <LinearGradient
        colors={[product.cardBg, '#FDFBF7', '#FFFFFF']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* TOP FLOATING NAVIGATION BAR */}
      <SafeAreaView style={styles.floatingTopNavSafeArea}>
        <View style={styles.floatingTopNavRow}>
          <TouchableOpacity
            style={styles.circleNavBtn}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.topRightActionsRow}>
            <TouchableOpacity
              style={styles.circleNavBtn}
              onPress={() => setIsFavorite(prev => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#EF4444' : '#0F172A'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleNavBtn, { marginLeft: 8 }]}
              onPress={() => router.push('/(customer)/(tabs)/orders')}
              activeOpacity={0.7}
            >
              <Ionicons name="bag-handle-outline" size={18} color="#0F172A" />
              {globalCartCount > 0 && (
                <View style={styles.navCartBadge}>
                  <Text style={styles.navCartBadgeText}>{globalCartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ANIMATED SCROLL VIEW */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* 1. STRICTLY DIMENSIONED HERO 3D PRODUCT IMAGE */}
        <Animated.View
          style={[
            styles.heroImageContainer,
            {
              transform: [
                { scale: imageScale },
                { translateY: imageTranslateY },
              ],
              opacity: imageOpacity,
            },
          ]}
        >
          <View style={styles.strictImageWrapper}>
            <Image
              source={resolvedImageSource}
              style={styles.hero3DImage}
              resizeMode="contain"
            />
          </View>

          {/* AI Match Floating Pill */}
          <View style={styles.heroMatchPill}>
            <Text style={styles.heroMatchPillText}>✨ {product.matchScore}% Biometric Match</Text>
          </View>
        </Animated.View>

        {/* 2. THE CLEAN WHITE CONTENT SHEET */}
        <View style={styles.contentSheet}>
          {/* Brand & Title */}
          <Text style={styles.sheetBrand}>{product.brand}</Text>
          <Text
            style={[
              styles.sheetTitle,
              syneFont ? { fontFamily: syneFont } : { fontWeight: '900' },
            ]}
          >
            {product.name}
          </Text>

          {/* Review & Delivery ETA Row */}
          <View style={styles.metaRow}>
            <View style={styles.starsContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingNum}>{product.rating}</Text>
              <Text style={styles.reviewCountText}>({product.reviewCount} reviews)</Text>
            </View>

            <View style={styles.deliveryBadge}>
              <Ionicons name="flash" size={12} color="#15803D" />
              <Text style={styles.deliveryText}>⚡ 10-MIN EXPRESS DROP</Text>
            </View>
          </View>

          {/* METRIC PILLS */}
          <View style={styles.metricsPillsRow}>
            <View style={styles.metricPill}>
              <Text style={styles.metricPillText}>💧 {product.metrics.hydration}</Text>
            </View>
            <View style={styles.metricPill}>
              <Text style={styles.metricPillText}>✨ {product.metrics.glow}</Text>
            </View>
            <View style={styles.metricPill}>
              <Text style={styles.metricPillText}>🛡️ {product.metrics.barrier}</Text>
            </View>
          </View>

          {/* SCIENCE-BACKED FORMULA DESCRIPTION */}
          <Text style={styles.sectionHeading}>Clinical Formulation</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          {/* KEY ACTIVE INGREDIENTS */}
          <Text style={styles.sectionHeading}>Key Actives</Text>
          <View style={styles.activesChipsContainer}>
            {product.keyActives.map((active, index) => (
              <View key={index} style={styles.activeChip}>
                <Ionicons name="checkmark-circle" size={14} color="#085cf0" style={{ marginRight: 6 }} />
                <Text style={styles.activeChipText}>{active}</Text>
              </View>
            ))}
          </View>

          {/* QUANTITY SELECTOR */}
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Select Units</Text>
            <View style={styles.quantityStepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setCartQuantity(prev => Math.max(1, prev - 1))}
              >
                <Ionicons name="remove" size={16} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{cartQuantity}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setCartQuantity(prev => prev + 1)}
              >
                <Ionicons name="add" size={16} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* GAMIFIED FLYING PRODUCT PARTICLE */}
      {isFlying && (
        <Animated.View
          style={[
            styles.flyingParticle,
            {
              transform: [
                {
                  translateX: flyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width / 2 - 40],
                  }),
                },
                {
                  translateY: flyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -height / 2 + 60],
                  }),
                },
                {
                  scale: flyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.15],
                  }),
                },
              ],
              opacity: flyAnim.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [1, 0.9, 0],
              }),
            },
          ]}
          pointerEvents="none"
        >
          <Image source={resolvedImageSource} style={styles.flyingImg} resizeMode="contain" />
        </Animated.View>
      )}

      {/* 2. STICKY BOTTOM ACTION BAR */}
      <View style={styles.bottomActionBar}>
        <View style={styles.priceCol}>
          <Text style={styles.priceSubtext}>Total Price</Text>
          <View style={styles.priceValuesRow}>
            <Text style={styles.currentPriceText}>₹{product.price * cartQuantity}</Text>
            <Text style={styles.originalPriceText}>₹{product.originalPrice * cartQuantity}</Text>
          </View>
        </View>

        {/* APPLE-STYLE MINIMALIST ADD TO CART BUTTON WITH #085cf0 BLUE ACCENT */}
        <TouchableOpacity
          style={styles.addToCartPillBtn}
          onPress={handleOpenCartModal}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#00C853', '#15803D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Ionicons name="bag-handle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.addToCartBtnText}>⚡ Add to Cart • ₹{product.price * cartQuantity}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ========================================================================= */}
      {/* 3. STANDARDIZED APPLE-STYLE GLASSMORPHISM ADD-TO-CART MODAL               */}
      {/* ========================================================================= */}
      <Modal
        visible={isAddToCartModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddToCartModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.glassmorphicModalCard}>
            {/* Modal Top Indicator */}
            <View style={styles.modalHandle} />

            {/* Modal Header Row */}
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalThumbnailWrapper}>
                <Image source={resolvedImageSource} style={styles.modalThumbnail} resizeMode="contain" />
              </View>
              <View style={styles.modalTitleCol}>
                <Text style={styles.modalBrandText}>{product.brand}</Text>
                <Text style={styles.modalProductName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.modalPriceText}>₹{product.price} × {cartQuantity} = ₹{product.price * cartQuantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsAddToCartModalVisible(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Dynamic Delivery Threshold Progress Bar */}
            <View style={styles.deliveryProgressCard}>
              <View style={styles.progressHeaderRow}>
                <Ionicons name="flash" size={14} color="#085cf0" />
                <Text style={styles.progressTitle}>
                  {remainingForFreeDelivery === 0
                    ? '🎉 You unlocked FREE 12-Min Instant Drop!'
                    : `Add ₹${remainingForFreeDelivery} more for FREE 12-Min Drop`}
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>

            {/* Modal Quantity Adjuster */}
            <View style={styles.modalQtyRow}>
              <Text style={styles.modalQtyLabel}>Adjust Units:</Text>
              <View style={styles.quantityStepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setCartQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Ionicons name="remove" size={16} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{cartQuantity}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setCartQuantity(prev => prev + 1)}
                >
                  <Ionicons name="add" size={16} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action Button (#085cf0) */}
            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={handleConfirmAddToCart}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#085cf0', '#0047cc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalBtnGradient}
              >
                <Text style={styles.modalConfirmBtnText}>
                  Confirm & Drop into Cart • ₹{product.price * cartQuantity}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingTopNavSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  floatingTopNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 8,
  },
  topRightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  navCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#085cf0',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 120,
  },

  /* Strictly Dimensioned Image Section */
  heroImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  strictImageWrapper: {
    width: width * 0.78,
    height: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  hero3DImage: {
    width: '100%',
    height: '100%',
  },
  heroMatchPill: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#085cf0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroMatchPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  /* White Content Sheet */
  contentSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    marginTop: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sheetBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#085cf0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 22,
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  reviewCountText: {
    fontSize: 12,
    color: '#64748B',
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  deliveryText: {
    color: '#085cf0',
    fontSize: 11,
    fontWeight: '800',
  },
  metricsPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  metricPill: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  activesChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  activeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 12,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Flying Particle */
  flyingParticle: {
    position: 'absolute',
    top: height / 2,
    left: width / 2 - 35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  flyingImg: {
    width: 50,
    height: 50,
  },

  /* Sticky Bottom Bar */
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  priceCol: {
    flex: 1,
  },
  priceSubtext: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  priceValuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  currentPriceText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  originalPriceText: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  addToCartPillBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Apple-Style Glassmorphism Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  glassmorphicModalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalThumbnailWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalThumbnail: {
    width: 38,
    height: 38,
  },
  modalTitleCol: {
    flex: 1,
    marginLeft: 12,
  },
  modalBrandText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#085cf0',
    textTransform: 'uppercase',
  },
  modalProductName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  modalPriceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryProgressCard: {
    backgroundColor: '#EBF2FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#085cf0',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BFDBFE',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#085cf0',
    borderRadius: 3,
  },
  modalQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalQtyLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  modalConfirmBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#085cf0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  modalBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
