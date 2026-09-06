import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Animated,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../store/useCartStore';
import { INDIAN_SKINCARE_CATALOG } from '../../data/indianSkincareCatalog';
import { LOCAL_PRODUCT_IMAGES } from '../../assets/productImages';
import { getDeviceCurrentLocation, geocodeUserAddress } from '../../services/locationService';
import { createOrder } from '../../services/orderService';
import { syncUserOnboardingData } from '../../services/userSyncService';
import { getBackendBaseUrl } from '../../services/apiConfig';
import { RealGoogleDeliveryMap } from '../../components/map/RealGoogleDeliveryMap';
import { triggerWhatsAppDispatchAlert } from '../../utils/whatsapp';
import {
  GooglePayLogo,
  PhonePeLogo,
  PaytmLogo,
  BhimUpiLogo,
  CashOnDeliveryLogo,
} from '../../components/payment/PaymentBrandLogos';

const { width } = Dimensions.get('window');

type FlowStage = 'cart_review' | 'payment_selection' | 'order_processing' | 'live_tracking';

export const ExpressOrderFlowScreen: React.FC = () => {
  const router = useRouter();
  const { cart, items, totalCount, incrementQuantity, decrementQuantity, clearCart } = useCartStore();
  const cartMap = items || cart || {};

  const [currentStage, setCurrentStage] = useState<FlowStage>('cart_review');

  // Customer Delivery Info (Blinkit Exact Format)
  const [deliveryAddress, setDeliveryAddress] = useState('Payikapuram, Vijayawada');
  const [customerCoords, setCustomerCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: 16.5417,
    longitude: 80.6425,
  });
  const [addressTag, setAddressTag] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [houseNumber, setHouseNumber] = useState('Flat 402, Sri Krishna Apts');
  const [contactName, setContactName] = useState('Mukesh');
  const [contactPhone, setContactPhone] = useState('8977855998');
  const [contactEmail, setContactEmail] = useState('mukesh@glowvai.com');

  // Delivery Instructions & Tips (Optional, default 0)
  const [avoidCalling, setAvoidCalling] = useState(false);
  const [dontRingBell, setDontRingBell] = useState(true);
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('ZEPTO50');

  // Payment Selection State
  const [selectedPayment, setSelectedPayment] = useState<
    'phonepe' | 'gpay' | 'paytm' | 'bhim' | 'card' | 'cod'
  >('phonepe');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string>(`ORD_${Date.now()}`);
  const [etaMinutes, setEtaMinutes] = useState(12);

  // Auto-advance from order_processing to live_tracking
  useEffect(() => {
    if (currentStage === 'order_processing') {
      const timer = setTimeout(() => {
        setCurrentStage('live_tracking');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  // Auto-detect GPS on mount & geocode
  useEffect(() => {
    getDeviceCurrentLocation().then(res => {
      if (res && res.formattedAddress) {
        setDeliveryAddress(res.formattedAddress);
        if (res.latitude && res.longitude) {
          setCustomerCoords({ latitude: res.latitude, longitude: res.longitude });
        }
      }
    });
  }, []);

  // Update coordinates whenever user manually edits address
  const handleUpdateAddress = async (newAddr: string) => {
    setDeliveryAddress(newAddr);
    const geocoded = await geocodeUserAddress(newAddr);
    if (geocoded && geocoded.latitude && geocoded.longitude) {
      setCustomerCoords({ latitude: geocoded.latitude, longitude: geocoded.longitude });
    }
  };

  // Compute Cart Items with safe fallback
  const safeCartMap = cartMap && typeof cartMap === 'object' ? cartMap : { 'prod-01': 1 };
  const cartEntries = Object.entries(safeCartMap);
  const activeCartItems = (cartEntries.length > 0 ? cartEntries : [['prod-01', 1]]).map(([id, qty]) => {
    const product = INDIAN_SKINCARE_CATALOG.find(p => p.id === id) || {
      id,
      name: 'Minimalist 10% Niacinamide Serum',
      brand: 'Minimalist',
      price: 599,
      originalPrice: 699,
      category: 'Serums',
      imageSource: LOCAL_PRODUCT_IMAGES.minimalistNiacinamide,
    };
    const quantity = typeof qty === 'number' && qty > 0 ? qty : 1;
    return {
      ...product,
      qty: quantity,
      totalItemPrice: product.price * quantity,
    };
  });

  // Financial Calculations matching Real-time Exact Item Totals
  const itemsTotal = activeCartItems.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const mrpTotal = activeCartItems.reduce((sum, item) => sum + (item.originalPrice || item.price + 100) * item.qty, 0);
  const mrpDiscount = Math.max(0, mrpTotal - itemsTotal);
  const couponDiscount = (appliedCoupon && itemsTotal >= 999) ? 50 : 0;
  const deliveryCharge = 0; // FREE 10-Min Delivery across Vijayawada
  const handlingCharge = 0; // FREE
  const lateNightFee = 0; // FREE
  const totalSavings = mrpDiscount + 30 + couponDiscount;
  const grandTotal = Math.max(1, itemsTotal - couponDiscount + deliveryCharge + handlingCharge + lateNightFee + selectedTip + donationAmount);

  // Auto transition from processing to Live Tracking
  useEffect(() => {
    if (currentStage === 'order_processing') {
      const timer = setTimeout(() => {
        setCurrentStage('live_tracking');
        logTelemetryEvent({
          eventType: 'ORDER_PLACED',
          data: {
            orderId: activeOrderId,
            totalAmount: grandTotal,
            paymentMethod: selectedPayment,
            deliveryAddress,
          },
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  /**
   * Action Flow: Native UPI Deep-Linking & Background Order Logging
   * Instantly navigates to Live Tracking with zero-block background dispatching
   */
  const handleSelectAndExecutePayment = async (method: 'phonepe' | 'gpay' | 'paytm' | 'bhim' | 'card' | 'cod') => {
    setSelectedPayment(method);
    setIsPlacingOrder(false); // Never block screen with spinner

    const newOrderId = `ORD_${Date.now()}`;
    setActiveOrderId(newOrderId);

    // 1. Digital UPI Dedicated App Launching Flow (PhonePe, Google Pay, Paytm, BHIM)
    if (['phonepe', 'gpay', 'paytm', 'bhim'].includes(method)) {
      const vpa = '8977855998@ibl';
      const merchantName = 'glowvai';
      const encodedNote = encodeURIComponent(`GlowVAI Order #${newOrderId}`);
      const standardUpiUrl = `upi://pay?pa=${vpa}&pn=${merchantName}&am=${grandTotal}&cu=INR&tn=${encodedNote}&tr=${newOrderId}&mode=02`;

      const appMeta: Record<string, { name: string; primaryUri: string; marketUri: string; playStoreUrl: string }> = {
        phonepe: {
          name: 'PhonePe',
          primaryUri: `phonepe://pay?pa=${vpa}&pn=${merchantName}&am=${grandTotal}&cu=INR&tn=${encodedNote}&tr=${newOrderId}`,
          marketUri: 'market://details?id=com.phonepe.app',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.phonepe.app',
        },
        gpay: {
          name: 'Google Pay',
          primaryUri: `gpay://upi/pay?pa=${vpa}&pn=${merchantName}&am=${grandTotal}&cu=INR&tn=${encodedNote}&tr=${newOrderId}`,
          marketUri: 'market://details?id=com.google.android.apps.nbu.paisa.user',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user',
        },
        paytm: {
          name: 'Paytm',
          primaryUri: `paytmmp://pay?pa=${vpa}&pn=${merchantName}&am=${grandTotal}&cu=INR&tn=${encodedNote}&tr=${newOrderId}`,
          marketUri: 'market://details?id=net.one97.paytm',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=net.one97.paytm',
        },
        bhim: {
          name: 'BHIM UPI',
          primaryUri: standardUpiUrl,
          marketUri: 'market://details?id=in.org.npci.upiapp',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=in.org.npci.upiapp',
        },
      };

      const selectedApp = appMeta[method] || appMeta.phonepe;
      Linking.openURL(selectedApp.primaryUri).catch(() => {
        Linking.openURL(standardUpiUrl).catch(() => null);
      });
    }

    // 1. Immediately advance to Live Tracking Screen
    setCurrentStage('live_tracking');

    // 2. Automated WhatsApp & Backend Dispatch in Non-blocking Background Job
    try {
      const dispatchPayload = {
        orderId: newOrderId,
        customerName: contactName || 'Mukesh',
        customerPhone: contactPhone || '8977855998',
        deliveryAddress: deliveryAddress || 'Payikapuram, Vijayawada',
        darkStoreName: 'Glowway Darkstore Payikapuram (DS-VIJ-01)',
        items: activeCartItems.map(p => ({
          name: p.name,
          qty: p.qty,
          price: p.price,
        })),
        totalAmount: grandTotal,
        paymentMethod: method === 'cod' ? 'CASH ON DELIVERY' : `ONLINE (${method.toUpperCase()})`,
        deliveryOtp: '4892',
      };

      triggerWhatsAppDispatchAlert(dispatchPayload).catch(() => null);

      createOrder({
        orderId: newOrderId,
        userId: 'user_mukesh_glow',
        customerName: contactName,
        customerPhone: contactPhone,
        deliveryType: 'EXPRESS_15_MIN',
        items: activeCartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          brand: item.brand,
          quantity: item.qty,
          unitPrice: item.price,
          totalPrice: item.totalItemPrice,
        })),
        shippingAddress: {
          addressId: `ADDR-${Date.now()}`,
          label: 'Home',
          houseOrFlatNumber: houseNumber,
          fullAddress: deliveryAddress,
          latitude: 16.5417,
          longitude: 80.6425,
          city: 'Vijayawada',
          postalCode: '520015',
          country: 'India',
          deliveryInstructions: dontRingBell ? 'Do not ring the bell' : 'Door delivery',
          isDefault: true,
        },
        pricing: {
          itemTotal: itemsTotal,
          discountTotal: mrpDiscount,
          deliveryFee: deliveryCharge,
          handlingFee: handlingCharge,
          tax: 0,
          tipAmount: selectedTip,
          grandTotal,
        },
        payment: {
          method: method.toUpperCase(),
          status: method === 'cod' ? 'PENDING' : 'COMPLETED',
          transactionId: `TXN_${Date.now()}`,
          paidAt: Date.now(),
        },
      }).catch(() => null);
    } catch (e: any) {
      console.warn('[Background Dispatch Catch]:', e?.message);
    }
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.phoneScaffold}>
        {/* ========================================================================= */}
        {/* TOP HEADER (Blinkit / Zepto Style for Cart & Payment)                     */}
        {/* ========================================================================= */}
        {currentStage !== 'live_tracking' && (
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.headerBackBtn}
              onPress={() => {
                if (currentStage === 'payment_selection') setCurrentStage('cart_review');
                else router.back();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              {currentStage === 'payment_selection' ? (
                <Text style={styles.headerTitleText}>Bill total: ₹{grandTotal}</Text>
              ) : (
                <View>
                  <View style={styles.headerHomeRow}>
                    <Text style={styles.headerTitleText}>Home</Text>
                    <Ionicons name="chevron-down" size={14} color="#0F172A" style={{ marginLeft: 2 }} />
                  </View>
                  <Text style={styles.headerSubAddress} numberOfLines={1}>
                    {deliveryAddress}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.headerRightAction} activeOpacity={0.7}>
              <Ionicons name="share-social-outline" size={20} color="#0F172A" />
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STAGE 1: CART REVIEW & BILL BREAKDOWN                                     */}
        {/* ========================================================================= */}
        {currentStage === 'cart_review' && (
          <View style={styles.stageBody}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              {/* Dark Store Network Routing Banner */}
              <View style={styles.darkstoreBanner}>
                <View style={styles.darkstoreDot} />
                <Text style={styles.darkstoreBannerText}>
                  ⚡ 10–12 Mins Delivery from <Text style={{ fontWeight: '800' }}>Glowway Darkstore A</Text> (Payikapuram • 1.2 km)
                </Text>
              </View>

              {/* Savings Green Pill Banner */}
              <View style={styles.savingsBanner}>
                <Ionicons name="checkmark-circle" size={16} color="#00C853" />
                <Text style={styles.savingsBannerText}>Yay! You saved ₹{totalSavings} on this order!</Text>
              </View>

              {/* Coupon Bar */}
              <TouchableOpacity style={styles.couponOfferBar} activeOpacity={0.85}>
                <Text style={styles.couponOfferTag}>SAVE</Text>
                <Text style={styles.couponOfferText}>Apply coupons + payment offers & save more</Text>
                <Ionicons name="chevron-forward" size={14} color="#085cf0" />
              </TouchableOpacity>

              {/* Cart Items List */}
              <View style={styles.cardBox}>
                {activeCartItems.map(item => (
                  <View key={item.id} style={styles.itemRow}>
                    <Image source={item.imageSource} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.itemBrand}>{item.brand} • 30 ml</Text>
                      <Text style={styles.itemPrice}>₹{item.price}</Text>
                    </View>
                    <View style={styles.stepperBox}>
                      <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.stepperBtn}>
                        <Text style={styles.stepperBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.stepperQtyText}>{item.qty}</Text>
                      <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.stepperBtn}>
                        <Text style={styles.stepperBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

              {/* Delivery Address & Location Input (MapmyIndia Geocoded) */}
              <View style={styles.cardBox}>
                <View style={styles.addressCardHeader}>
                  <View style={styles.addressTagPill}>
                    <Ionicons name="location" size={13} color="#00C853" />
                    <Text style={styles.addressTagText}>Delivery Address</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Change Area / Landmark',
                        'Quick select your location in Vijayawada:',
                        [
                          { text: 'Payikapuram Hub', onPress: () => handleUpdateAddress('Payikapuram Main Rd, Vijayawada') },
                          { text: 'Singh Nagar', onPress: () => handleUpdateAddress('Singh Nagar, Vijayawada') },
                          { text: 'Benz Circle', onPress: () => handleUpdateAddress('Benz Circle, MG Road, Vijayawada') },
                          { text: 'Governorpet', onPress: () => handleUpdateAddress('Governorpet, Besant Rd, Vijayawada') },
                          { text: 'Cancel', style: 'cancel' },
                        ]
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.changeAddressBtnText}>Select Landmark</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.addressTextInput}
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  onEndEditing={() => handleUpdateAddress(deliveryAddress)}
                  placeholder="Enter house/flat number, street, landmark"
                  placeholderTextColor="#94A3B8"
                />
                <Text style={styles.addressHintText}>
                  📍 MapmyIndia Geocoded • Delivering from Glowway Darkstore to your doorstep
                </Text>
              </View>

              {/* Delivery Instructions */}
              <View style={styles.cardBox}>
                <Text style={styles.cardHeading}>Delivery instructions</Text>
                <View style={styles.instructionsRow}>
                  <TouchableOpacity style={styles.instructionCard} activeOpacity={0.8}>
                    <View style={styles.instrHeaderRow}>
                      <Ionicons name="mic" size={16} color="#10B981" />
                      <Text style={styles.instrTagText}>Record</Text>
                    </View>
                    <Text style={styles.instrDescText}>Press here and hold</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.instructionCard, avoidCalling && styles.instructionCardActive]}
                    onPress={() => setAvoidCalling(!avoidCalling)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.instrHeaderRow}>
                      <Ionicons name="volume-mute-outline" size={16} color="#0F172A" />
                      <Ionicons
                        name={avoidCalling ? 'checkbox' : 'square-outline'}
                        size={16}
                        color={avoidCalling ? '#10B981' : '#CBD5E1'}
                      />
                    </View>
                    <Text style={styles.instrDescText}>Avoid calling</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.instructionCard, dontRingBell && styles.instructionCardActive]}
                    onPress={() => setDontRingBell(!dontRingBell)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.instrHeaderRow}>
                      <Ionicons name="notifications-off-outline" size={16} color="#0F172A" />
                      <Ionicons
                        name={dontRingBell ? 'checkbox' : 'square-outline'}
                        size={16}
                        color={dontRingBell ? '#10B981' : '#CBD5E1'}
                      />
                    </View>
                    <Text style={styles.instrDescText}>Don't ring the bell</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tip Your Delivery Partner */}
              <View style={styles.cardBox}>
                <Text style={styles.cardHeading}>Tip your delivery partner</Text>
                <Text style={styles.tipSubText}>
                  Your kindness means a lot! 100% of your tip will go directly to your delivery partner.
                </Text>
                <View style={styles.tipPillsRow}>
                  {[
                    { amt: 0, emoji: '🚫', label: 'No Tip' },
                    { amt: 10, emoji: '👍', label: '₹10' },
                    { amt: 20, emoji: '😀', label: '₹20' },
                    { amt: 30, emoji: '🤩', label: '₹30' },
                  ].map(t => (
                    <TouchableOpacity
                      key={t.amt}
                      style={[styles.tipPill, selectedTip === t.amt && styles.tipPillActive]}
                      onPress={() => setSelectedTip(selectedTip === t.amt ? 0 : t.amt)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.tipEmoji}>{t.emoji}</Text>
                      <Text style={[styles.tipPillText, selectedTip === t.amt && styles.tipPillTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Bill Details */}
              <View style={styles.cardBox}>
                <Text style={styles.cardHeading}>Bill details</Text>
                <View style={styles.billLineRow}>
                  <Text style={styles.billLineLabel}>Items total</Text>
                  <Text style={styles.billLineValue}>₹{itemsTotal}</Text>
                </View>
                <View style={styles.billLineRow}>
                  <Text style={styles.billLineLabel}>Delivery charge</Text>
                  <Text style={[styles.billLineValue, { color: '#10B981' }]}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </Text>
                </View>
                <View style={styles.billLineRow}>
                  <Text style={styles.billLineLabel}>Handling charge</Text>
                  <Text style={[styles.billLineValue, { color: '#10B981' }]}>FREE</Text>
                </View>
                <View style={styles.billLineRow}>
                  <Text style={styles.billLineLabel}>Late night convenience charge</Text>
                  <Text style={[styles.billLineValue, { color: '#10B981' }]}>FREE</Text>
                </View>
                {selectedTip > 0 && (
                  <View style={styles.billLineRow}>
                    <Text style={styles.billLineLabel}>Delivery partner tip</Text>
                    <Text style={styles.billLineValue}>₹{selectedTip}</Text>
                  </View>
                )}
                <View style={styles.billDottedDivider} />
                <View style={styles.billGrandTotalRow}>
                  <Text style={styles.billGrandTotalTitle}>Grand total</Text>
                  <Text style={styles.billGrandTotalAmt}>₹{grandTotal}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Sticky Green Bar */}
            <View style={styles.bottomStickyBar}>
              <View style={styles.bottomAddressBar}>
                <Ionicons name="home" size={15} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={styles.bottomAddressText} numberOfLines={1}>
                  Delivering to <Text style={{ fontWeight: '900', color: '#0F172A' }}>Home</Text> ({houseNumber})
                </Text>
                <TouchableOpacity onPress={() => Alert.alert('Address', deliveryAddress)}>
                  <Text style={styles.bottomAddressChange}>Change</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.greenCtaBtn}
                onPress={() => setCurrentStage('payment_selection')}
                activeOpacity={0.88}
              >
                <Text style={styles.greenCtaBtnText}>Select Payment Method</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: NATIVE PAYMENT SELECTION WITH AUTHENTIC LOGOS                    */}
        {/* ========================================================================= */}
        {currentStage === 'payment_selection' && (
          <View style={styles.stageBody}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
              {/* SECTION: Recommended */}
              <Text style={styles.paymentSectionHeader}>Recommended</Text>
              <View style={styles.paymentCardGroup}>
                {/* PhonePe UPI */}
                <TouchableOpacity
                  style={[styles.paymentItemRow, selectedPayment === 'phonepe' && styles.paymentItemRowActive]}
                  onPress={() => setSelectedPayment('phonepe')}
                  activeOpacity={0.7}
                >
                  <PhonePeLogo size={36} />
                  <View style={styles.payTextCol}>
                    <Text style={styles.payItemTitle}>PhonePe UPI</Text>
                    <Text style={styles.payItemSub}>Instant 1-tap authorization</Text>
                  </View>
                  <Ionicons
                    name={selectedPayment === 'phonepe' ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selectedPayment === 'phonepe' ? '#10B981' : '#CBD5E1'}
                  />
                </TouchableOpacity>

                <View style={styles.payDivider} />

                {/* Google Pay UPI */}
                <TouchableOpacity
                  style={[styles.paymentItemRow, selectedPayment === 'gpay' && styles.paymentItemRowActive]}
                  onPress={() => setSelectedPayment('gpay')}
                  activeOpacity={0.7}
                >
                  <GooglePayLogo size={36} />
                  <View style={styles.payTextCol}>
                    <Text style={styles.payItemTitle}>Google Pay</Text>
                    <Text style={styles.payItemSub}>Pay via linked bank account</Text>
                  </View>
                  <Ionicons
                    name={selectedPayment === 'gpay' ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selectedPayment === 'gpay' ? '#10B981' : '#CBD5E1'}
                  />
                </TouchableOpacity>

                <View style={styles.payDivider} />

                {/* Paytm UPI */}
                <TouchableOpacity
                  style={[styles.paymentItemRow, selectedPayment === 'paytm' && styles.paymentItemRowActive]}
                  onPress={() => setSelectedPayment('paytm')}
                  activeOpacity={0.7}
                >
                  <PaytmLogo size={36} />
                  <View style={styles.payTextCol}>
                    <Text style={styles.payItemTitle}>Paytm UPI</Text>
                    <Text style={styles.payItemSub}>Paytm Wallet & UPI</Text>
                  </View>
                  <Ionicons
                    name={selectedPayment === 'paytm' ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selectedPayment === 'paytm' ? '#10B981' : '#CBD5E1'}
                  />
                </TouchableOpacity>

                <View style={styles.payDivider} />

                {/* BHIM / Navi UPI */}
                <TouchableOpacity
                  style={[styles.paymentItemRow, selectedPayment === 'bhim' && styles.paymentItemRowActive]}
                  onPress={() => setSelectedPayment('bhim')}
                  activeOpacity={0.7}
                >
                  <BhimUpiLogo size={36} />
                  <View style={styles.payTextCol}>
                    <Text style={styles.payItemTitle}>BHIM / Other UPI</Text>
                    <Text style={styles.payItemSub}>Any UPI handle or QR</Text>
                  </View>
                  <Ionicons
                    name={selectedPayment === 'bhim' ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selectedPayment === 'bhim' ? '#10B981' : '#CBD5E1'}
                  />
                </TouchableOpacity>
              </View>

              {/* SECTION: Cards */}
              <Text style={styles.paymentSectionHeader}>Cards</Text>
              <View style={styles.paymentCardGroup}>
                <TouchableOpacity
                  style={[styles.paymentItemRow, selectedPayment === 'card' && styles.paymentItemRowActive]}
                  onPress={() => setSelectedPayment('card')}
                  activeOpacity={0.7}
                >
                  <View style={[styles.cardIconCircle, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="card-outline" size={20} color="#0F172A" />
                  </View>
                  <View style={styles.payTextCol}>
                    <Text style={styles.payItemTitle}>Add credit or debit cards</Text>
                    <Text style={styles.payItemSub}>Visa, Mastercard, RuPay</Text>
                  </View>
                  <Ionicons
                    name={selectedPayment === 'card' ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selectedPayment === 'card' ? '#10B981' : '#CBD5E1'}
                  />
                </TouchableOpacity>
              </View>

              {/* SECTION: Pay On Delivery */}
              <Text style={styles.paymentSectionHeader}>Pay On Delivery</Text>
              <View style={styles.paymentCardGroup}>
                <TouchableOpacity
                  style={[styles.paymentItemRow, selectedPayment === 'cod' && styles.paymentItemRowActive]}
                  onPress={() => {
                    setSelectedPayment('cod');
                    handleSelectAndExecutePayment('cod');
                  }}
                  activeOpacity={0.7}
                >
                  <CashOnDeliveryLogo size={36} />
                  <View style={styles.payTextCol}>
                    <Text style={[styles.payItemTitle, selectedPayment === 'cod' && { color: '#047857' }]}>
                      Cash / UPI on Delivery
                    </Text>
                    <Text style={styles.payItemSub}>Pay rider at doorstep via Cash or QR</Text>
                  </View>
                  <Ionicons
                    name={selectedPayment === 'cod' ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selectedPayment === 'cod' ? '#10B981' : '#CBD5E1'}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Bottom Sticky Green CTA Bar for Payment Stage */}
            <View style={styles.bottomStickyBar}>
              <View style={styles.bottomAddressBar}>
                <Ionicons name="shield-checkmark" size={15} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.bottomAddressText} numberOfLines={1}>
                  100% Safe & Instant Quick-Commerce Delivery
                </Text>
              </View>

              <TouchableOpacity
                style={styles.greenCtaBtn}
                onPress={() => handleSelectAndExecutePayment(selectedPayment)}
                activeOpacity={0.88}
              >
                <Text style={styles.greenCtaBtnText}>
                  {selectedPayment === 'cod'
                    ? `Place COD Order • ₹${grandTotal} ⚡`
                    : `Pay ₹${grandTotal} via ${selectedPayment.toUpperCase()} ⚡`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: INSTANT PROCESSING                                               */}
        {/* ========================================================================= */}
        {currentStage === 'order_processing' && (
          <View style={styles.processingCenter}>
            <View style={styles.processingCircle}>
              <Ionicons name="flash" size={40} color="#15803D" />
            </View>
            <Text style={styles.processingTitle}>Order Placed Successfully!</Text>
            <Text style={styles.processingSub}>Connecting to Glowvai Darkstore for 12-min packing...</Text>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: EXACT ZEPTO ORDER STATUS & TRACKING SCREEN                       */}
        {/* ========================================================================= */}
        {currentStage === 'live_tracking' && (
          <View style={styles.liveTrackingLayeredRoot}>
            <RealGoogleDeliveryMap
              orderId={activeOrderId}
              darkStoreName="Glowway Darkstore Payikapuram"
              darkStoreCoords={{ latitude: 16.5448, longitude: 80.6480 }}
              customerAddress={deliveryAddress}
              customerCoords={customerCoords}
              etaMinutes={etaMinutes}
              riderName="SANTOSH Rawat"
              riderPhone="+91 91234 56789"
              deliveryOtp="4892"
              isCod={selectedPayment === 'cod'}
              totalAmount={grandTotal}
              totalSaved={totalSavings}
              itemCount={activeCartItems.length}
              orderTime={new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              onBack={() => setCurrentStage('cart_review')}
              onContactSupport={() => Alert.alert('Support', 'Connecting with Glowvai Support Specialist...')}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExpressOrderFlowScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneScaffold: {
    width: '100%',
    maxWidth: 480,
    height: Platform.OS === 'web' ? ('96vh' as any) : '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: Platform.OS === 'web' ? 32 : 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 30,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerHomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  headerRightAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageBody: {
    flex: 1,
  },
  scrollPadding: {
    padding: 14,
    paddingBottom: 100,
  },
  darkstoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  darkstoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
  },
  darkstoreBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  savingsBannerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  couponOfferBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 12,
  },
  couponOfferTag: {
    backgroundColor: '#085cf0',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  couponOfferText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemBrand: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 10,
  },
  stepperBtn: {
    paddingHorizontal: 4,
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  stepperQtyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  // Address Card Styles
  addressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addressTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  addressTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00C853',
  },
  changeAddressBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#085cf0',
  },
  addressTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  addressHintText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
  },
  instructionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  instructionCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instructionCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  instrHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  instrTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  instrDescText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  tipSubText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  tipPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tipPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  tipEmoji: {
    fontSize: 13,
  },
  tipPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  tipPillTextActive: {
    color: '#059669',
  },
  billLineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLineLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  billLineValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  billDottedDivider: {
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  billGrandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billGrandTotalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  billGrandTotalAmt: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  bottomStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomAddressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomAddressText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
  },
  bottomAddressChange: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },
  greenCtaBtn: {
    backgroundColor: '#15803D',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  greenCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  paymentSectionHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paymentCardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  paymentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 12,
  },
  paymentItemRowActive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  payTextCol: {
    flex: 1,
  },
  payItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  payItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  payAddBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#15803D',
  },
  payDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  loadingBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  processingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  processingCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  processingSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  liveTrackingLayeredRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
