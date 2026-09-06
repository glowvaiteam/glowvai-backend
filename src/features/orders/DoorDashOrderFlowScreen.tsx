import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppFonts } from '../../hooks/useAppFonts';
import { useCartStore } from '../../store/useCartStore';
import { LOCAL_PRODUCT_IMAGES } from '../../assets/productImages';

const { width, height } = Dimensions.get('window');

// Precise DoorDash Tokens
const DD_RED = '#EB1700';
const DD_DARK = '#191919';
const DD_MUTED = '#5E5E5E';
const DD_LIGHT_MUTED = '#767676';
const DD_PEACH = '#FFF1ED';
const DD_SAVINGS_RED = '#D92300';
const DD_TEAL = '#00838C';
const DD_TEAL_BG = '#E6F7F8';
const DD_BORDER = '#EBEBEB';
const DD_SURFACE_ALT = '#F7F7F7';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: any;
  customization: string;
  originalPrice?: number;
}

export const DoorDashOrderFlowScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();
  const { cart, totalCount, updateQty, clearCart } = useCartStore();

  // Screen Stages:
  // 1 = 'store_menu' (Image 0)
  // 2 = 'cart_review' (Images 1-4)
  // 3 = 'checkout_address' (Image 5)
  // 4 = 'checkout_payment' (Image 6)
  // 5 = 'processing_loader' (Image 7)
  // 6 = 'live_tracking' (Images 8-9)
  const [currentStage, setCurrentStage] = useState<
    'store_menu' | 'cart_review' | 'checkout_address' | 'checkout_payment' | 'processing_loader' | 'live_tracking'
  >('cart_review');

  // Active Category Tab in Menu
  const [activeMenuTab, setActiveMenuTab] = useState<'most_ordered' | 'clinical_serums' | 'suncare' | 'barrier'>('most_ordered');

  // Fulfillment Toggle
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [timingOption, setTimingOption] = useState<'standard' | 'schedule'>('standard');
  const [dropoffOption, setDropoffOption] = useState<'door' | 'hand'>('door');

  // Tip Selector: 1, 2, 3, 5
  const [selectedTip, setSelectedTip] = useState<number>(30);

  // DoubleDash Cross Store Tab in Tracking
  const [selectedDoubleStore, setSelectedDoubleStore] = useState<'safeway' | 'seven_eleven' | 'mcdonalds'>('safeway');

  // Expanded Order Details Drawer in Tracking
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'prod-01',
      name: 'Minimalist 10% Niacinamide Serum',
      price: 599,
      originalPrice: 699,
      qty: 1,
      image: LOCAL_PRODUCT_IMAGES.minimalistNiacinamide,
      customization: '30ml • Clinical Zinc PCA • Alcohol Free',
    },
    {
      id: 'prod-07',
      name: 'The Derma Co 1% Hyaluronic Sunscreen Aqua Gel',
      price: 499,
      originalPrice: 599,
      qty: 1,
      image: LOCAL_PRODUCT_IMAGES.dermacoSunscreen,
      customization: '50g • SPF 50 PA++++ • Zero White Cast',
    },
  ]);

  // Complement Your Cart Addons
  const [addons, setAddons] = useState([
    {
      id: 'addon-01',
      name: '24K Gold Collagen Eye Mask',
      price: 99,
      image: LOCAL_PRODUCT_IMAGES.minimalistVitC,
      added: false,
    },
    {
      id: 'addon-02',
      name: 'Minimalist Salicylic Cleanser',
      price: 149,
      image: LOCAL_PRODUCT_IMAGES.minimalistSalicylic,
      added: false,
    },
    {
      id: 'addon-03',
      name: 'Ceramide Barrier Cream Mini',
      price: 129,
      image: LOCAL_PRODUCT_IMAGES.minimalistVitB5,
      added: false,
    },
  ]);

  // DoubleDash Products
  const doubleDashProducts = [
    {
      id: 'dd-01',
      name: 'Organic Lip Butter Balm',
      price: 199,
      stock: 'Many in stock',
      sales: '8.5k+ recently sold',
      image: LOCAL_PRODUCT_IMAGES.minimalistVitC,
    },
    {
      id: 'dd-02',
      name: 'Hydrating Thermal Spring Mist',
      price: 149,
      stock: 'In stock',
      sales: '4.8k+ recently sold',
      image: LOCAL_PRODUCT_IMAGES.dermacoNiacinamide,
    },
    {
      id: 'dd-03',
      name: 'Hyaluronic Sheet Mask 2-Pack',
      price: 99,
      stock: 'Many in stock',
      sales: '12k+ recently sold',
      image: LOCAL_PRODUCT_IMAGES.minimalistSalicylic,
    },
  ];

  // Animations
  const scooterAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Processing Loader Screen Timer
  useEffect(() => {
    if (currentStage === 'processing_loader') {
      // Loop scooter bounce & spin
      Animated.loop(
        Animated.sequence([
          Animated.timing(scooterAnim, {
            toValue: -8,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scooterAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Auto transition to Live Tracking after 2.8s
      const timer = setTimeout(() => {
        setCurrentStage('live_tracking');
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Helper Cart Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.qty, 0);
  const deliveryFee = 0; // $0.00
  const serviceFee = 49;
  const estimatedTax = Math.round(subtotal * 0.05);
  const promoDiscount = 100;
  const savings = (originalSubtotal - subtotal) + promoDiscount;
  const total = Math.max(0, subtotal + deliveryFee + serviceFee + estimatedTax + selectedTip - promoDiscount);

  const updateItemQty = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleAddon = (id: string) => {
    setAddons(prev =>
      prev.map(addon => {
        if (addon.id === id) {
          const nextState = !addon.added;
          if (nextState) {
            setCartItems(curr => [
              ...curr,
              {
                id: addon.id,
                name: addon.name,
                price: addon.price,
                qty: 1,
                image: addon.image,
                customization: '1-Click Quick Addon',
              },
            ]);
          } else {
            setCartItems(curr => curr.filter(i => i.id !== addon.id));
          }
          return { ...addon, added: nextState };
        }
        return addon;
      })
    );
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ========================================================================= */}
      {/* SCREEN 1: STORE MENU WITH FLOATING CART PILL (EXACT IMAGE 0)              */}
      {/* ========================================================================= */}
      {currentStage === 'store_menu' && (
        <SafeAreaView style={styles.screenWrapper}>
          {/* Header Zone: (X) Store Name (♥) (...) */}
          <View style={styles.menuHeaderRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircleBtn}>
              <Ionicons name="close" size={22} color={DD_DARK} />
            </TouchableOpacity>

            <Text style={[styles.storeNavTitle, syneFont ? { fontFamily: syneFont } : { fontWeight: '900' }]}>
              GlowVAI Clinical Hub
            </Text>

            <View style={styles.headerRightActions}>
              <TouchableOpacity style={styles.iconCircleBtn}>
                <Ionicons name="heart-outline" size={20} color={DD_DARK} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircleBtn}>
                <Ionicons name="ellipsis-horizontal" size={20} color={DD_DARK} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sub-header category navigation */}
          <View style={styles.menuCategoriesBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryTabsScroll}>
              <TouchableOpacity
                style={[styles.categoryTabItem, activeMenuTab === 'most_ordered' && styles.categoryTabItemActive]}
                onPress={() => setActiveMenuTab('most_ordered')}
              >
                <Ionicons name="menu-outline" size={16} color={activeMenuTab === 'most_ordered' ? DD_DARK : DD_MUTED} style={{ marginRight: 6 }} />
                <Text style={[styles.categoryTabText, activeMenuTab === 'most_ordered' && styles.categoryTabTextActive]}>
                  Most Ordered
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.categoryTabItem, activeMenuTab === 'clinical_serums' && styles.categoryTabItemActive]}
                onPress={() => setActiveMenuTab('clinical_serums')}
              >
                <Text style={[styles.categoryTabText, activeMenuTab === 'clinical_serums' && styles.categoryTabTextActive]}>
                  Clinical Serums
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.categoryTabItem, activeMenuTab === 'suncare' && styles.categoryTabItemActive]}
                onPress={() => setActiveMenuTab('suncare')}
              >
                <Text style={[styles.categoryTabText, activeMenuTab === 'suncare' && styles.categoryTabTextActive]}>
                  SPF & Suncare
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.categoryTabItem, activeMenuTab === 'barrier' && styles.categoryTabItemActive]}
                onPress={() => setActiveMenuTab('barrier')}
              >
                <Text style={[styles.categoryTabText, activeMenuTab === 'barrier' && styles.categoryTabTextActive]}>
                  Barrier Repair
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* 2-Column Product Grid (Featured Items) */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuGridScroll}>
            <Text style={styles.featuredSectionTitle}>Featured Items</Text>

            <View style={styles.twoColGridRow}>
              {/* Product 1 */}
              <View style={styles.gridProductCard}>
                <View style={styles.productImgBox}>
                  <Image source={LOCAL_PRODUCT_IMAGES.minimalistNiacinamide} style={styles.gridImg} resizeMode="contain" />
                  {/* Active In-Cart Circle */}
                  <TouchableOpacity style={styles.inCartBadgeCircle} onPress={() => updateItemQty('prod-01', 1)}>
                    <Text style={styles.inCartBadgeText}>1×</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.gridTitle} numberOfLines={1}>10% Niacinamide Serum</Text>
                <Text style={styles.gridPrice}>₹599 • 👍 88% (27)</Text>
                <View style={styles.greatPricePill}>
                  <Text style={styles.greatPriceText}>🏷️ Great Price</Text>
                </View>
              </View>

              {/* Product 2 */}
              <View style={styles.gridProductCard}>
                <View style={styles.productImgBox}>
                  <Image source={LOCAL_PRODUCT_IMAGES.dermacoSunscreen} style={styles.gridImg} resizeMode="contain" />
                  {/* Plus Button */}
                  <TouchableOpacity style={styles.inCartBadgeCircle} onPress={() => updateItemQty('prod-07', 1)}>
                    <Text style={styles.inCartBadgeText}>1×</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.gridTitle} numberOfLines={1}>1% Hyaluronic Sunscreen</Text>
                <Text style={styles.gridPrice}>₹499 • 👍 94% (42)</Text>
                <View style={styles.greatPricePill}>
                  <Text style={styles.greatPriceText}>🏷️ Great Price</Text>
                </View>
              </View>
            </View>

            <View style={styles.twoColGridRow}>
              {/* Product 3 */}
              <View style={styles.gridProductCard}>
                <View style={styles.productImgBox}>
                  <Image source={LOCAL_PRODUCT_IMAGES.minimalistSalicylic} style={styles.gridImg} resizeMode="contain" />
                  <TouchableOpacity style={styles.unselectedAddCircle} onPress={() => updateItemQty('prod-03', 1)}>
                    <Ionicons name="add" size={18} color={DD_DARK} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.gridTitle} numberOfLines={1}>2% Salicylic Acid Cleanser</Text>
                <Text style={styles.gridPrice}>₹299 • 👍 83% (18)</Text>
                <View style={styles.greatPricePill}>
                  <Text style={styles.greatPriceText}>🏷️ Great Price</Text>
                </View>
              </View>

              {/* Product 4 */}
              <View style={styles.gridProductCard}>
                <View style={styles.productImgBox}>
                  <Image source={LOCAL_PRODUCT_IMAGES.minimalistVitB5} style={styles.gridImg} resizeMode="contain" />
                  <TouchableOpacity style={styles.unselectedAddCircle} onPress={() => updateItemQty('prod-05', 1)}>
                    <Ionicons name="add" size={18} color={DD_DARK} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.gridTitle} numberOfLines={1}>Vitamin B5 Barrier Cream</Text>
                <Text style={styles.gridPrice}>₹349 • 👍 91% (35)</Text>
                <View style={styles.greatPricePill}>
                  <Text style={styles.greatPriceText}>🏷️ Great Price</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* DUAL FLOATING BOTTOM BAR (EXACT IMAGE 0) */}
          <View style={styles.dualBottomBarContainer}>
            {/* Tier 1: Red Cart Pill */}
            <TouchableOpacity
              style={styles.redCartPill}
              onPress={() => setCurrentStage('cart_review')}
              activeOpacity={0.92}
            >
              <Ionicons name="cart" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <View style={styles.redPillTextCol}>
                <Text style={styles.redPillStoreName}>GlowVAI • ₹{subtotal} total before tax</Text>
              </View>
              <View style={styles.redPillCountBadge}>
                <Text style={styles.redPillCountText}>{cartItems.reduce((s, i) => s + i.qty, 0)}</Text>
              </View>
            </TouchableOpacity>

            {/* Tier 2: Peach Promo Banner */}
            <TouchableOpacity
              style={styles.peachPromoStrip}
              onPress={() => setCurrentStage('cart_review')}
              activeOpacity={0.88}
            >
              <Text style={styles.peachPromoText}>Add ₹101 to get a ₹100 off deal ›</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: CART REVIEW & UPSELL THRESHOLD FLOW (EXACT IMAGES 1, 2, 3, 4)   */}
      {/* ========================================================================= */}
      {currentStage === 'cart_review' && (
        <SafeAreaView style={styles.screenWrapper}>
          {/* Top Bar with Segmented Control */}
          <View style={styles.cartTopNavRow}>
            <TouchableOpacity onPress={() => setCurrentStage('store_menu')} style={styles.iconCircleBtn}>
              <Ionicons name="close" size={22} color={DD_DARK} />
            </TouchableOpacity>

            {/* Delivery | Pickup Switcher */}
            <View style={styles.fulfillmentSegmentPill}>
              <TouchableOpacity
                style={[styles.fulfillmentBtn, fulfillmentType === 'delivery' && styles.fulfillmentBtnActive]}
                onPress={() => setFulfillmentType('delivery')}
              >
                <Text style={[styles.fulfillmentBtnText, fulfillmentType === 'delivery' && styles.fulfillmentBtnTextActive]}>
                  Delivery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fulfillmentBtn, fulfillmentType === 'pickup' && styles.fulfillmentBtnActive]}
                onPress={() => setFulfillmentType('pickup')}
              >
                <Text style={[styles.fulfillmentBtnText, fulfillmentType === 'pickup' && styles.fulfillmentBtnTextActive]}>
                  Pickup
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.iconCircleBtn} onPress={() => Alert.alert('Group Order', 'Invite friends to add items!')}>
              <Ionicons name="person-add-outline" size={18} color={DD_DARK} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cartScrollContent}>
            {/* Store Name & Chevron */}
            <View style={styles.cartStoreTitleRow}>
              <Text style={styles.cartStoreName}>GlowVAI Clinical Hub</Text>
              <Ionicons name="chevron-forward" size={18} color={DD_MUTED} />
            </View>

            {/* Cart Item Cells */}
            {cartItems.map(item => (
              <View key={item.id} style={styles.cartItemCell}>
                <Image source={item.image} style={styles.cartItemThumb} resizeMode="contain" />
                <View style={styles.cartItemInfoCol}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemCustom}>{item.customization}</Text>
                  <Text style={styles.cartItemPrice}>₹{item.price * item.qty}</Text>
                </View>

                {/* Stepper Pill [ 🗑 | 1 | + ] */}
                <View style={styles.cartStepperPill}>
                  <TouchableOpacity onPress={() => updateItemQty(item.id, -1)} style={styles.stepperActionBtn}>
                    {item.qty === 1 ? (
                      <Ionicons name="trash-outline" size={15} color={DD_DARK} />
                    ) : (
                      <Ionicons name="remove" size={15} color={DD_DARK} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.stepperQtyNum}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => updateItemQty(item.id, 1)} style={styles.stepperActionBtn}>
                    <Ionicons name="add" size={15} color={DD_DARK} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* + Add More Items Button */}
            <TouchableOpacity style={styles.addMoreItemsBtn} onPress={() => setCurrentStage('store_menu')}>
              <Ionicons name="add" size={18} color={DD_RED} style={{ marginRight: 4 }} />
              <Text style={styles.addMoreItemsBtnText}>Add more items</Text>
            </TouchableOpacity>

            {/* "Complement your cart" Carousel */}
            <View style={styles.complementSection}>
              <Text style={styles.complementTitle}>Complement your cart</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 10 }}>
                {addons.map(addon => (
                  <View key={addon.id} style={styles.addonImpulseCard}>
                    <Image source={addon.image} style={styles.addonImpulseImg} resizeMode="contain" />
                    <TouchableOpacity
                      style={[styles.addonImpulseAddBtn, addon.added && { backgroundColor: '#059669' }]}
                      onPress={() => toggleAddon(addon.id)}
                    >
                      <Ionicons name={addon.added ? 'checkmark' : 'add'} size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.addonImpulseName} numberOfLines={1}>{addon.name}</Text>
                    <Text style={styles.addonImpulsePrice}>₹{addon.price}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* DashPass / GlowPass Savings Banner */}
            <View style={styles.dashPassTealBox}>
              <View style={styles.tealTopRow}>
                <Ionicons name="flash" size={16} color={DD_TEAL} style={{ marginRight: 6 }} />
                <Text style={styles.tealBannerTitle}>Save ₹100 on clinical orders above ₹500</Text>
              </View>
              <View style={styles.tealProgressBarTrack}>
                <View style={[styles.tealProgressBarFill, { width: '85%' }]} />
              </View>
              <Text style={styles.tealSavingsToast}>✨ Promo successfully applied — Saving ₹100 with GlowPass</Text>
            </View>
          </ScrollView>

          {/* Bottom Continue Button */}
          <View style={styles.cartBottomActionZone}>
            <TouchableOpacity
              style={styles.fullWidthRedBtn}
              onPress={() => setCurrentStage('checkout_address')}
              activeOpacity={0.9}
            >
              <Text style={styles.fullWidthRedBtnText}>Continue • ₹{total}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: CHECKOUT - FULFILLMENT & ADDRESS DETAILS (EXACT IMAGE 5)         */}
      {/* ========================================================================= */}
      {currentStage === 'checkout_address' && (
        <SafeAreaView style={styles.screenWrapper}>
          <View style={styles.checkoutTopNavRow}>
            <TouchableOpacity onPress={() => setCurrentStage('cart_review')} style={styles.iconCircleBtn}>
              <Ionicons name="arrow-back" size={22} color={DD_DARK} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.checkoutNavHeaderTitle}>Checkout</Text>
              <Text style={styles.checkoutNavHeaderSub}>GlowVAI Clinical Hub</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.checkoutScrollContent}>
            {/* Interactive Mini Map Card with Adjust Pin */}
            <View style={styles.miniMapCardBox}>
              <View style={styles.mapGraphicPlaceholder}>
                <Ionicons name="map" size={32} color="#94A3B8" />
                <View style={styles.mapCenterPin}>
                  <Ionicons name="location" size={24} color={DD_RED} />
                </View>
              </View>
              <TouchableOpacity style={styles.adjustPinFloatingPill} onPress={() => Alert.alert('Adjust Pin', 'Move map pin to exact doorway')}>
                <Ionicons name="locate" size={14} color={DD_DARK} style={{ marginRight: 4 }} />
                <Text style={styles.adjustPinText}>Adjust Pin</Text>
              </TouchableOpacity>
            </View>

            {/* Delivery Timing Cards: Standard vs Schedule */}
            <View style={styles.timingSection}>
              <View style={styles.timingSectionHeaderRow}>
                <Ionicons name="time-outline" size={16} color={DD_DARK} style={{ marginRight: 6 }} />
                <Text style={styles.timingSectionTitle}>Delivery Time</Text>
                <Text style={styles.timingEtaText}>12 - 15 min</Text>
              </View>

              <View style={styles.timingCardsRow}>
                <TouchableOpacity
                  style={[styles.timingCard, timingOption === 'standard' && styles.timingCardActive]}
                  onPress={() => setTimingOption('standard')}
                >
                  <View style={styles.radioRow}>
                    <Text style={styles.timingCardTitle}>Standard</Text>
                    <Ionicons
                      name={timingOption === 'standard' ? 'radio-button-on' : 'radio-button-off'}
                      size={16}
                      color={timingOption === 'standard' ? DD_RED : DD_MUTED}
                    />
                  </View>
                  <Text style={styles.timingCardSub}>12 - 15 min</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.timingCard, timingOption === 'schedule' && styles.timingCardActive]}
                  onPress={() => setTimingOption('schedule')}
                >
                  <View style={styles.radioRow}>
                    <Text style={styles.timingCardTitle}>Schedule Ahead</Text>
                    <Ionicons
                      name={timingOption === 'schedule' ? 'radio-button-on' : 'radio-button-off'}
                      size={16}
                      color={timingOption === 'schedule' ? DD_RED : DD_MUTED}
                    />
                  </View>
                  <Text style={styles.timingCardSub}>Choose a time</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Friction Reduction Address & Instruction List */}
            <View style={styles.frictionListCard}>
              <TouchableOpacity style={styles.frictionRow} onPress={() => router.push('/(customer)/permissions')}>
                <Ionicons name="location-outline" size={20} color={DD_DARK} style={styles.frictionIcon} />
                <View style={styles.frictionTextCol}>
                  <Text style={styles.frictionTitle}>Flat 402, Royal Palms Apartment</Text>
                  <Text style={styles.frictionSub}>Payikapuram, Vijayawada</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={DD_MUTED} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.frictionRow} onPress={() => setDropoffOption(dropoffOption === 'door' ? 'hand' : 'door')}>
                <Ionicons name="bag-handle-outline" size={20} color={DD_DARK} style={styles.frictionIcon} />
                <View style={styles.frictionTextCol}>
                  <Text style={styles.frictionTitle}>
                    {dropoffOption === 'door' ? 'Leave it at my door' : 'Hand it to me in person'}
                  </Text>
                  <Text style={styles.frictionSub}>Add drop-off instructions</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={DD_MUTED} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.frictionRow}>
                <Ionicons name="call-outline" size={20} color={DD_DARK} style={styles.frictionIcon} />
                <View style={styles.frictionTextCol}>
                  <Text style={styles.frictionTitle}>+91 98765 43210</Text>
                  <Text style={styles.frictionSub}>Phone for courier updates</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={DD_MUTED} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.frictionRow}>
                <Ionicons name="gift-outline" size={20} color={DD_DARK} style={styles.frictionIcon} />
                <View style={styles.frictionTextCol}>
                  <Text style={styles.frictionTitle}>Send as a clinical gift</Text>
                  <Text style={styles.frictionSub}>Includes personalized note</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={DD_MUTED} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Bottom Next Button */}
          <View style={styles.cartBottomActionZone}>
            <TouchableOpacity
              style={styles.fullWidthRedBtn}
              onPress={() => setCurrentStage('checkout_payment')}
              activeOpacity={0.9}
            >
              <Text style={styles.fullWidthRedBtnText}>Next • Payment</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: CHECKOUT - SUMMARY, TIPPING & PAYMENT (EXACT IMAGE 6)           */}
      {/* ========================================================================= */}
      {currentStage === 'checkout_payment' && (
        <SafeAreaView style={styles.screenWrapper}>
          <View style={styles.checkoutTopNavRow}>
            <TouchableOpacity onPress={() => setCurrentStage('checkout_address')} style={styles.iconCircleBtn}>
              <Ionicons name="arrow-back" size={22} color={DD_DARK} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.checkoutNavHeaderTitle}>Checkout</Text>
              <Text style={styles.checkoutNavHeaderSub}>GlowVAI Clinical Hub</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.checkoutScrollContent}>
            {/* Deals & Gift Cards Row */}
            <TouchableOpacity style={styles.dealsRowCard} onPress={() => Alert.alert('Promo Codes', 'GLOW100 Applied (-₹100)')}>
              <Ionicons name="pricetag-outline" size={18} color={DD_DARK} style={{ marginRight: 10 }} />
              <Text style={styles.dealsText}>Deals & gift cards</Text>
              <Ionicons name="chevron-forward" size={18} color={DD_MUTED} />
            </TouchableOpacity>

            {/* Fee Breakdown Table with Peach Highlight on $0.00 Delivery */}
            <View style={styles.feeBreakdownCard}>
              <Text style={styles.feeSummaryTitle}>Summary</Text>

              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Subtotal</Text>
                <Text style={styles.feeValue}>₹{subtotal}</Text>
              </View>

              {/* Highlighted Delivery Fee ($0.00) in Peach */}
              <View style={[styles.feeRow, styles.peachHighlightedFeeRow]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.feeLabel}>Delivery Fee</Text>
                  <Ionicons name="information-circle-outline" size={14} color={DD_MUTED} style={{ marginLeft: 4 }} />
                </View>
                <Text style={[styles.feeValue, { color: '#059669', fontWeight: '900' }]}>₹0.00</Text>
              </View>

              <View style={styles.feeRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.feeLabel}>Service Fee</Text>
                  <Ionicons name="information-circle-outline" size={14} color={DD_MUTED} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.feeValue}>₹{serviceFee}</Text>
              </View>

              <View style={styles.feeRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.feeLabel}>Estimated Tax & Clinical Pack</Text>
                  <Ionicons name="information-circle-outline" size={14} color={DD_MUTED} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.feeValue}>₹{estimatedTax}</Text>
              </View>

              <View style={styles.feeRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.feeLabel}>Dasher / Courier Tip</Text>
                  <Ionicons name="information-circle-outline" size={14} color={DD_MUTED} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.feeValue}>₹{selectedTip}</Text>
              </View>

              {/* Interactive Tip Selector Pills */}
              <View style={styles.tipPillsContainer}>
                {[20, 30, 50, 0].map(tipVal => (
                  <TouchableOpacity
                    key={tipVal}
                    style={[styles.tipSelectPill, selectedTip === tipVal && styles.tipSelectPillActive]}
                    onPress={() => setSelectedTip(tipVal)}
                  >
                    <Text style={[styles.tipSelectPillText, selectedTip === tipVal && styles.tipSelectPillTextActive]}>
                      {tipVal === 0 ? 'Other' : `₹${tipVal}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.tipDisclaimer}>100% of the tip goes to your Dasher.</Text>

              {/* Total Row */}
              <View style={styles.totalRowContainer}>
                <Text style={styles.totalLabelMain}>Total</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <Text style={styles.originalTotalStrikethrough}>₹{originalSubtotal + serviceFee + estimatedTax + selectedTip}</Text>
                  <Text style={styles.finalTotalBig}>₹{total}</Text>
                </View>
              </View>
            </View>

            {/* Savings Illustrated Card in Peach (#FFF1ED) */}
            <View style={styles.savingsPeachCard}>
              <Text style={styles.piggyEmoji}>🐷</Text>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.savingsCardSub}>You're saving</Text>
                <Text style={styles.savingsCardAmount}>₹{savings}</Text>
                <Text style={styles.savingsCardFooter}>with promotions</Text>
              </View>
              <Text style={styles.coinEmoji}>🪙</Text>
            </View>

            {/* Payment Method Card */}
            <View style={styles.paymentCardBox}>
              <View style={styles.paymentCardLeft}>
                <View style={styles.visaIconBox}>
                  <Text style={styles.visaIconText}>VISA</Text>
                </View>
                <View>
                  <Text style={styles.paymentCardTitle}>Visa •••• 6660</Text>
                  <Text style={styles.paymentCardSub}>Expires 08/29 • GlowVAI Money</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Change Payment', 'Select UPI, Google Pay, or Card')}>
                <Text style={styles.changePaymentText}>Change ›</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Place Order CTA Button */}
          <View style={styles.cartBottomActionZone}>
            <TouchableOpacity
              style={styles.fullWidthRedBtn}
              onPress={() => setCurrentStage('processing_loader')}
              activeOpacity={0.92}
            >
              <Text style={styles.fullWidthRedBtnText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 5: ORDER PROCESSING TRANSITION (EXACT IMAGE 7)                      */}
      {/* ========================================================================= */}
      {currentStage === 'processing_loader' && (
        <View style={styles.processingScreenContainer}>
          {/* Top Status Indicators */}
          <SafeAreaView style={styles.processingSafeArea}>
            <View style={styles.processingTopRow}>
              <Text style={styles.processingClock}>9:41</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Ionicons name="cellular" size={16} color={DD_DARK} />
                <Ionicons name="wifi" size={16} color={DD_DARK} />
                <Ionicons name="battery-full" size={16} color={DD_DARK} />
              </View>
            </View>
          </SafeAreaView>

          {/* Courier on Red Scooter Illustration */}
          <View style={styles.scooterIllustrationZone}>
            <Animated.View style={{ transform: [{ translateY: scooterAnim }] }}>
              <View style={styles.courierScooterGraphicBox}>
                <View style={styles.courierBackpack}>
                  <Text style={styles.courierBackpackLogo}>DD</Text>
                </View>
                <MaterialCommunityIcons name="moped" size={110} color={DD_RED} />
              </View>
            </Animated.View>
          </View>

          {/* Bottom Processing Card */}
          <View style={styles.processingBottomCard}>
            <View style={styles.processingHeaderRow}>
              <Text style={styles.processingTitleText}>Processing Order...</Text>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name="sync" size={24} color={DD_DARK} />
              </Animated.View>
            </View>

            <View style={styles.processingCardDivider} />

            <Text style={styles.processingFieldLabel}>Address</Text>
            <Text style={styles.processingFieldValue}>Flat 402, Royal Palms, Payikapuram, Vijayawada</Text>

            <View style={styles.processingCardDivider} />

            <Text style={styles.processingFieldLabel}>GlowVAI Clinical Hub</Text>
            <Text style={styles.processingFieldValue}>2x Clinical Skincare Formulations</Text>
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 6: LIVE TRACKING & DOUBLEDASH UPSELL (EXACT IMAGES 8 & 9)           */}
      {/* ========================================================================= */}
      {currentStage === 'live_tracking' && (
        <View style={styles.trackingRootContainer}>
          {/* Top Map Floaters */}
          <SafeAreaView style={styles.trackingHeaderFloaters}>
            <TouchableOpacity onPress={() => setCurrentStage('store_menu')} style={styles.iconCircleBtn}>
              <Ionicons name="close" size={22} color={DD_DARK} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('GlowVAI Support', 'Connecting to 24/7 Help Desk...')}
              style={styles.helpPillBtn}
            >
              <Text style={styles.helpPillText}>Help</Text>
            </TouchableOpacity>
          </SafeAreaView>

          {/* Simulated Interactive Map Area */}
          <View style={styles.fullScreenMapArea}>
            <View style={styles.mapRoadGraphic} />
            <View style={styles.courierBeaconOnMap}>
              <Ionicons name="bicycle" size={18} color="#FFFFFF" />
            </View>
          </View>

          {/* Draggable Bottom Sheet with Stepper & DoubleDash */}
          <ScrollView style={styles.trackingBottomSheet} showsVerticalScrollIndicator={false}>
            <View style={styles.sheetDragHandle} />

            {/* ETA Header */}
            <View style={styles.trackingEtaHeaderRow}>
              <View>
                <Text style={styles.trackingStatusHeadline}>Preparing your order</Text>
                <Text style={styles.trackingArrivingEta}>Arriving: 12 - 15 mins</Text>
              </View>
              <View style={styles.storeMiniLogoBadge}>
                <Text style={styles.storeMiniLogoText}>GLOW</Text>
              </View>
            </View>

            {/* Horizontal Stepper Timeline: (DD -> Store -> Courier -> Home) */}
            <View style={styles.stepperTimelineRow}>
              <View style={styles.stepperNodeActive}>
                <Text style={styles.stepperNodeText}>DD</Text>
              </View>
              <View style={styles.stepperLineActive} />
              <View style={styles.stepperNodeActive}>
                <Ionicons name="storefront" size={14} color="#FFFFFF" />
              </View>
              <View style={styles.stepperLineInactive} />
              <View style={styles.stepperNodeInactive}>
                <Ionicons name="car" size={14} color={DD_MUTED} />
              </View>
              <View style={styles.stepperLineInactive} />
              <View style={styles.stepperNodeInactive}>
                <Ionicons name="home" size={14} color={DD_MUTED} />
              </View>
            </View>

            <Text style={styles.stepperSublineText}>GlowVAI Clinical Hub is preparing your order.</Text>

            {/* Action Buttons: [ Order details ] [ + Add items ] */}
            <View style={styles.trackingActionButtonsRow}>
              <TouchableOpacity
                style={styles.grayActionPill}
                onPress={() => setIsOrderDetailsOpen(!isOrderDetailsOpen)}
              >
                <Ionicons name={isOrderDetailsOpen ? 'chevron-up' : 'chevron-down'} size={14} color={DD_DARK} style={{ marginRight: 4 }} />
                <Text style={styles.grayActionPillText}>Order details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.grayActionPill}
                onPress={() => setCurrentStage('store_menu')}
              >
                <Ionicons name="add" size={16} color={DD_DARK} style={{ marginRight: 4 }} />
                <Text style={styles.grayActionPillText}>Add items</Text>
              </TouchableOpacity>
            </View>

            {/* EXPANDED ORDER DETAILS DRAWER (EXACT IMAGE 9) */}
            {isOrderDetailsOpen && (
              <View style={styles.expandedDetailsDrawer}>
                <View style={styles.drawerStoreHeader}>
                  <View style={styles.drawerStoreLogo}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 10 }}>GLOW</Text>
                  </View>
                  <View>
                    <Text style={styles.drawerStoreName}>GlowVAI Clinical Hub</Text>
                    <Text style={styles.drawerItemCount}>{cartItems.length} items</Text>
                  </View>
                </View>

                {cartItems.map(item => (
                  <View key={item.id} style={styles.drawerItemLine}>
                    <Image source={item.image} style={styles.drawerItemThumb} resizeMode="contain" />
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.drawerItemTitle}>{item.qty} × {item.name}</Text>
                      <Text style={styles.drawerItemCustom}>{item.customization}</Text>
                    </View>
                    <Text style={styles.drawerItemPrice}>₹{item.price * item.qty}</Text>
                  </View>
                ))}

                <View style={styles.drawerDivider} />

                <View style={styles.drawerFeeRow}>
                  <Text style={styles.drawerFeeLabel}>Subtotal</Text>
                  <Text style={styles.drawerFeeValue}>₹{subtotal}</Text>
                </View>
                <View style={styles.drawerFeeRow}>
                  <Text style={styles.drawerFeeLabel}>Delivery Fee</Text>
                  <Text style={[styles.drawerFeeValue, { color: '#059669' }]}>₹0.00</Text>
                </View>
                <View style={styles.drawerFeeRow}>
                  <Text style={styles.drawerFeeLabel}>Service Fee</Text>
                  <Text style={styles.drawerFeeValue}>₹{serviceFee}</Text>
                </View>
                <View style={styles.drawerFeeRow}>
                  <Text style={styles.drawerFeeLabel}>Dasher Tip</Text>
                  <Text style={styles.drawerFeeValue}>₹{selectedTip}</Text>
                </View>
                <View style={styles.drawerFeeRow}>
                  <Text style={[styles.drawerFeeLabel, { fontWeight: '900', color: DD_DARK }]}>Total</Text>
                  <Text style={[styles.drawerFeeValue, { fontWeight: '900', color: DD_DARK }]}>₹{total}</Text>
                </View>
              </View>
            )}

            {/* DOUBLEDASH CROSS-STORE UPSELL (EXACT IMAGE 8) */}
            <View style={styles.doubleDashSection}>
              <View style={styles.doubleDashHeaderRow}>
                <Ionicons name="timer-outline" size={18} color={DD_RED} style={{ marginRight: 6 }} />
                <Text style={styles.doubleDashCountdownTitle}>14:40 min to DoubleDash</Text>
              </View>
              <Text style={styles.doubleDashSubText}>
                Add on items from another store with no added delivery fee. Service fee applies.
              </Text>

              {/* Store Filter Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.doubleStorePillsScroll}>
                <TouchableOpacity
                  style={[styles.doubleStorePill, selectedDoubleStore === 'safeway' && styles.doubleStorePillActive]}
                  onPress={() => setSelectedDoubleStore('safeway')}
                >
                  <Text style={styles.doubleStorePillText}>🌿 Forest Essentials +14m</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.doubleStorePill, selectedDoubleStore === 'seven_eleven' && styles.doubleStorePillActive]}
                  onPress={() => setSelectedDoubleStore('seven_eleven')}
                >
                  <Text style={styles.doubleStorePillText}>⚡ Derma Pharmacy (No delay)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.doubleStorePill, selectedDoubleStore === 'mcdonalds' && styles.doubleStorePillActive]}
                  onPress={() => setSelectedDoubleStore('mcdonalds')}
                >
                  <Text style={styles.doubleStorePillText}>🧴 Minimalist Direct</Text>
                </TouchableOpacity>
              </ScrollView>

              {/* DoubleDash Product Carousel with Live Stock Badges */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.doubleProductsScroll}>
                {doubleDashProducts.map(p => (
                  <View key={p.id} style={styles.doubleProductCard}>
                    <Image source={p.image} style={styles.doubleProductImg} resizeMode="contain" />
                    <TouchableOpacity
                      style={styles.doubleAddCircleBtn}
                      onPress={() => {
                        setCartItems(curr => [
                          ...curr,
                          {
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            qty: 1,
                            image: p.image,
                            customization: 'DoubleDash Addon',
                          },
                        ]);
                        Alert.alert('DoubleDash Added!', `${p.name} added to your live delivery with zero extra delivery fee.`);
                      }}
                    >
                      <Ionicons name="add" size={16} color={DD_DARK} />
                    </TouchableOpacity>
                    <Text style={styles.doubleProductPrice}>₹{p.price}</Text>
                    <Text style={styles.doubleProductName} numberOfLines={1}>{p.name}</Text>
                    <View style={styles.stockBadgePill}>
                      <Text style={styles.stockBadgeText}>{p.stock}</Text>
                    </View>
                    <Text style={styles.salesStatsText}>{p.sales}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default DoorDashOrderFlowScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenWrapper: {
    flex: 1,
  },

  /* ----------------------------------------- */
  /* SCREEN 1: STORE MENU (IMAGE 0)            */
  /* ----------------------------------------- */
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DD_SURFACE_ALT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeNavTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: DD_DARK,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  menuCategoriesBar: {
    borderBottomWidth: 1,
    borderBottomColor: DD_BORDER,
  },
  categoryTabsScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryTabItemActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: DD_DARK,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: DD_MUTED,
  },
  categoryTabTextActive: {
    color: DD_DARK,
    fontWeight: '900',
  },
  menuGridScroll: {
    padding: 16,
    paddingBottom: 130,
  },
  featuredSectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: DD_DARK,
    marginBottom: 14,
  },
  twoColGridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  gridProductCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  productImgBox: {
    width: '100%',
    height: 140,
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  gridImg: {
    width: 100,
    height: 100,
  },
  inCartBadgeCircle: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DD_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  unselectedAddCircle: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: DD_DARK,
  },
  gridPrice: {
    fontSize: 12,
    color: DD_MUTED,
    marginTop: 2,
    fontWeight: '600',
  },
  greatPricePill: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  greatPriceText: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '800',
  },

  /* Dual Bottom Bar (Image 0) */
  dualBottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: DD_BORDER,
  },
  redCartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DD_RED,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    shadowColor: DD_RED,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  redPillTextCol: {
    flex: 1,
  },
  redPillStoreName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  redPillCountBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redPillCountText: {
    color: DD_RED,
    fontSize: 12,
    fontWeight: '900',
  },
  peachPromoStrip: {
    backgroundColor: DD_PEACH,
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  peachPromoText: {
    color: DD_SAVINGS_RED,
    fontSize: 12,
    fontWeight: '800',
  },

  /* ----------------------------------------- */
  /* SCREEN 2: CART REVIEW (IMAGES 1-4)        */
  /* ----------------------------------------- */
  cartTopNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: DD_BORDER,
  },
  fulfillmentSegmentPill: {
    flexDirection: 'row',
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 20,
    padding: 3,
  },
  fulfillmentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fulfillmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fulfillmentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: DD_MUTED,
  },
  fulfillmentBtnTextActive: {
    color: DD_DARK,
    fontWeight: '900',
  },
  cartScrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  cartStoreTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  cartStoreName: {
    fontSize: 18,
    fontWeight: '900',
    color: DD_DARK,
  },
  cartItemCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DD_BORDER,
  },
  cartItemThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: DD_SURFACE_ALT,
    marginRight: 12,
  },
  cartItemInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '800',
    color: DD_DARK,
  },
  cartItemCustom: {
    fontSize: 11,
    color: DD_MUTED,
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: DD_DARK,
    marginTop: 4,
  },
  cartStepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  stepperActionBtn: {
    padding: 4,
  },
  stepperQtyNum: {
    fontSize: 13,
    fontWeight: '900',
    color: DD_DARK,
  },
  addMoreItemsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: DD_BORDER,
  },
  addMoreItemsBtnText: {
    color: DD_RED,
    fontSize: 14,
    fontWeight: '800',
  },

  /* Complement Carousel */
  complementSection: {
    marginTop: 16,
  },
  complementTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: DD_DARK,
  },
  addonImpulseCard: {
    width: 110,
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 14,
    padding: 8,
    position: 'relative',
  },
  addonImpulseImg: {
    width: '100%',
    height: 60,
    marginBottom: 6,
  },
  addonImpulseAddBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: DD_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addonImpulseName: {
    fontSize: 11,
    fontWeight: '800',
    color: DD_DARK,
  },
  addonImpulsePrice: {
    fontSize: 11,
    fontWeight: '900',
    color: DD_MUTED,
    marginTop: 2,
  },

  /* DashPass Teal Banner */
  dashPassTealBox: {
    backgroundColor: DD_TEAL_BG,
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
  },
  tealTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tealBannerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: DD_TEAL,
  },
  tealProgressBarTrack: {
    height: 6,
    backgroundColor: '#B2EBF2',
    borderRadius: 3,
    marginVertical: 8,
    overflow: 'hidden',
  },
  tealProgressBarFill: {
    height: '100%',
    backgroundColor: DD_TEAL,
    borderRadius: 3,
  },
  tealSavingsToast: {
    fontSize: 11,
    fontWeight: '700',
    color: DD_TEAL,
  },

  cartBottomActionZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: DD_BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  fullWidthRedBtn: {
    backgroundColor: DD_RED,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: DD_RED,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fullWidthRedBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  /* ----------------------------------------- */
  /* SCREEN 3 & 4: CHECKOUT (IMAGES 5 & 6)     */
  /* ----------------------------------------- */
  checkoutTopNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DD_BORDER,
  },
  checkoutNavHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: DD_DARK,
  },
  checkoutNavHeaderSub: {
    fontSize: 11,
    color: DD_MUTED,
  },
  checkoutScrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  miniMapCardBox: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    height: 120,
    backgroundColor: DD_SURFACE_ALT,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DD_BORDER,
  },
  mapGraphicPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCenterPin: {
    position: 'absolute',
  },
  adjustPinFloatingPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adjustPinText: {
    fontSize: 11,
    fontWeight: '800',
    color: DD_DARK,
  },
  timingSection: {
    marginBottom: 16,
  },
  timingSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timingSectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: DD_DARK,
    flex: 1,
  },
  timingEtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: DD_DARK,
  },
  timingCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timingCard: {
    flex: 1,
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: DD_BORDER,
  },
  timingCardActive: {
    borderColor: DD_DARK,
    backgroundColor: '#FFFFFF',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timingCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: DD_DARK,
  },
  timingCardSub: {
    fontSize: 11,
    color: DD_MUTED,
    marginTop: 4,
  },
  frictionListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: DD_BORDER,
    paddingHorizontal: 14,
  },
  frictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: DD_BORDER,
  },
  frictionIcon: {
    marginRight: 12,
  },
  frictionTextCol: {
    flex: 1,
  },
  frictionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: DD_DARK,
  },
  frictionSub: {
    fontSize: 11,
    color: DD_MUTED,
    marginTop: 2,
  },

  /* Screen 4: Deals, Fee Breakdown & Peach Savings */
  dealsRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  dealsText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: DD_DARK,
  },
  feeBreakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: DD_BORDER,
    marginBottom: 14,
  },
  feeSummaryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: DD_DARK,
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  peachHighlightedFeeRow: {
    backgroundColor: DD_PEACH,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  feeLabel: {
    fontSize: 13,
    color: DD_MUTED,
    fontWeight: '600',
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: DD_DARK,
  },
  tipPillsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 6,
  },
  tipSelectPill: {
    flex: 1,
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tipSelectPillActive: {
    backgroundColor: DD_DARK,
  },
  tipSelectPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: DD_DARK,
  },
  tipSelectPillTextActive: {
    color: '#FFFFFF',
  },
  tipDisclaimer: {
    fontSize: 10,
    color: DD_MUTED,
    marginTop: 4,
    marginBottom: 12,
  },
  totalRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: DD_BORDER,
    paddingTop: 12,
  },
  totalLabelMain: {
    fontSize: 16,
    fontWeight: '900',
    color: DD_DARK,
  },
  originalTotalStrikethrough: {
    fontSize: 13,
    color: DD_MUTED,
    textDecorationLine: 'line-through',
  },
  finalTotalBig: {
    fontSize: 18,
    fontWeight: '900',
    color: DD_SAVINGS_RED,
  },

  savingsPeachCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DD_PEACH,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  piggyEmoji: {
    fontSize: 32,
  },
  coinEmoji: {
    fontSize: 32,
  },
  savingsCardSub: {
    fontSize: 12,
    color: DD_SAVINGS_RED,
    fontWeight: '700',
  },
  savingsCardAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: DD_SAVINGS_RED,
    marginVertical: 2,
  },
  savingsCardFooter: {
    fontSize: 11,
    color: DD_SAVINGS_RED,
    fontWeight: '600',
  },
  paymentCardBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: DD_BORDER,
  },
  paymentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visaIconBox: {
    backgroundColor: '#1E3A8A',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  visaIconText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  paymentCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: DD_DARK,
  },
  paymentCardSub: {
    fontSize: 11,
    color: DD_MUTED,
  },
  changePaymentText: {
    fontSize: 12,
    fontWeight: '800',
    color: DD_DARK,
  },

  /* ----------------------------------------- */
  /* SCREEN 5: PROCESSING LOADER (IMAGE 7)     */
  /* ----------------------------------------- */
  processingScreenContainer: {
    flex: 1,
    backgroundColor: '#FFF5F0',
    justifyContent: 'space-between',
  },
  processingSafeArea: {
    paddingHorizontal: 20,
  },
  processingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  processingClock: {
    fontSize: 14,
    fontWeight: '800',
    color: DD_DARK,
  },
  scooterIllustrationZone: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  courierScooterGraphicBox: {
    alignItems: 'center',
    position: 'relative',
  },
  courierBackpack: {
    position: 'absolute',
    top: 14,
    left: 28,
    backgroundColor: DD_RED,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  courierBackpackLogo: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  processingBottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  processingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  processingTitleText: {
    fontSize: 20,
    fontWeight: '900',
    color: DD_DARK,
  },
  processingCardDivider: {
    height: 1,
    backgroundColor: DD_BORDER,
    marginVertical: 10,
  },
  processingFieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: DD_DARK,
  },
  processingFieldValue: {
    fontSize: 12,
    color: DD_MUTED,
    marginTop: 2,
  },

  /* ----------------------------------------- */
  /* SCREEN 6: LIVE TRACKING & DOUBLEDASH (8-9)*/
  /* ----------------------------------------- */
  trackingRootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  trackingHeaderFloaters: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  helpPillBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: DD_DARK,
  },
  fullScreenMapArea: {
    height: height * 0.28,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapRoadGraphic: {
    width: '80%',
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
  },
  courierBeaconOnMap: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DD_RED,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  trackingBottomSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    marginTop: -20,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetDragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  trackingEtaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  trackingStatusHeadline: {
    fontSize: 20,
    fontWeight: '900',
    color: DD_DARK,
  },
  trackingArrivingEta: {
    fontSize: 13,
    fontWeight: '700',
    color: DD_MUTED,
    marginTop: 2,
  },
  storeMiniLogoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeMiniLogoText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  /* Stepper Timeline (DoorDash -> Store -> Car -> Home) */
  stepperTimelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  stepperNodeActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DD_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperNodeInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DD_SURFACE_ALT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DD_BORDER,
  },
  stepperNodeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  stepperLineActive: {
    flex: 1,
    height: 3,
    backgroundColor: DD_DARK,
  },
  stepperLineInactive: {
    flex: 1,
    height: 3,
    backgroundColor: DD_BORDER,
  },
  stepperSublineText: {
    fontSize: 12,
    color: DD_MUTED,
    marginBottom: 14,
  },
  trackingActionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  grayActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  grayActionPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: DD_DARK,
  },

  /* Expanded Details Drawer (Image 9) */
  expandedDetailsDrawer: {
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  drawerStoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  drawerStoreLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerStoreName: {
    fontSize: 14,
    fontWeight: '900',
    color: DD_DARK,
  },
  drawerItemCount: {
    fontSize: 11,
    color: DD_MUTED,
  },
  drawerItemLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  drawerItemThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 8,
  },
  drawerItemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: DD_DARK,
  },
  drawerItemCustom: {
    fontSize: 10,
    color: DD_MUTED,
  },
  drawerItemPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: DD_DARK,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: DD_BORDER,
    marginVertical: 8,
  },
  drawerFeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  drawerFeeLabel: {
    fontSize: 11,
    color: DD_MUTED,
  },
  drawerFeeValue: {
    fontSize: 11,
    color: DD_DARK,
    fontWeight: '700',
  },

  /* DoubleDash Section (Image 8) */
  doubleDashSection: {
    borderTopWidth: 1,
    borderTopColor: DD_BORDER,
    paddingTop: 16,
    paddingBottom: 40,
  },
  doubleDashHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  doubleDashCountdownTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: DD_DARK,
  },
  doubleDashSubText: {
    fontSize: 12,
    color: DD_MUTED,
    marginBottom: 12,
    lineHeight: 16,
  },
  doubleStorePillsScroll: {
    gap: 8,
    marginBottom: 14,
  },
  doubleStorePill: {
    backgroundColor: DD_SURFACE_ALT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: DD_BORDER,
  },
  doubleStorePillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: DD_DARK,
  },
  doubleStorePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: DD_DARK,
  },
  doubleProductsScroll: {
    gap: 12,
  },
  doubleProductCard: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: DD_BORDER,
    position: 'relative',
  },
  doubleProductImg: {
    width: '100%',
    height: 80,
    marginBottom: 6,
  },
  doubleAddCircleBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DD_SURFACE_ALT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleProductPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: DD_DARK,
  },
  doubleProductName: {
    fontSize: 11,
    fontWeight: '800',
    color: DD_DARK,
    marginTop: 2,
  },
  stockBadgePill: {
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  stockBadgeText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '800',
  },
  salesStatsText: {
    fontSize: 9,
    color: DD_MUTED,
    marginTop: 2,
  },
});
