import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Animated,
  Easing,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DISPATCH_PHONE_PRIMARY } from '../../utils/whatsapp';
import { getBackendBaseUrl } from '../../services/apiConfig';

const { width } = Dimensions.get('window');

interface IncomingOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  distanceKm: string;
  earnings: number;
  totalAmount: number;
  items: Array<{ name: string; qty: number; bin: string }>;
  paymentMethod: string;
  otp: string;
  createdAt: number;
}

export const VendorAppScreen: React.FC = () => {
  const router = useRouter();

  // Vendor Status & Tabs
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'earnings' | 'notifications'>('orders');

  // Incoming Order Pop-up Modal State (Rapido / Zepto Captain Style)
  const [incomingOrder, setIncomingOrder] = useState<IncomingOrder | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(60);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const seenOrderIds = useRef<Set<string>>(new Set());

  // Real Cross-Phone Live Order Polling (APKs to APKs)
  useEffect(() => {
    if (!isOnline) return;

    const checkIncomingOrders = async () => {
      try {
        const url = `${getBackendBaseUrl()}/api/orders/all`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.orders) && data.orders.length > 0) {
            const latest = data.orders[data.orders.length - 1];
            if (latest && !seenOrderIds.current.has(latest.orderId)) {
              seenOrderIds.current.add(latest.orderId);

              // Trigger Rapido / Zepto Captain Incoming Order Modal
              setCountdownSeconds(60);
              setIncomingOrder({
                orderId: latest.orderId,
                customerName: latest.customerName || 'Mukesh',
                customerPhone: latest.customerPhone || '8977855998',
                deliveryAddress: latest.shippingAddress?.fullAddress || 'Payikapuram, Vijayawada',
                distanceKm: '0.8 km',
                earnings: 45,
                totalAmount: latest.pricing?.grandTotal || 1,
                items: (latest.items || []).map((it: any) => ({
                  name: it.productName || it.name || 'Skincare Item',
                  qty: it.quantity || it.qty || 1,
                  bin: 'BIN-A-01-02-01',
                })),
                paymentMethod: latest.payment?.method || 'CASH ON DELIVERY',
                otp: '4892',
                createdAt: latest.createdAt || Date.now(),
              });
            }
          }
        }
      } catch {
        // network polling
      }
    };

    const interval = setInterval(checkIncomingOrders, 2500);
    return () => clearInterval(interval);
  }, [isOnline]);

  // Active Orders List
  const [activeOrders, setActiveOrders] = useState<IncomingOrder[]>([
    {
      orderId: 'ORD-849201',
      customerName: 'Mukesh',
      customerPhone: '8977855998',
      deliveryAddress: 'Flat 402, Sri Krishna Apts, Payikapuram, Vijayawada',
      distanceKm: '0.8 km',
      earnings: 45,
      totalAmount: 599,
      items: [
        { name: 'Minimalist 10% Niacinamide Serum (30ml)', qty: 1, bin: 'BIN-A-01-02-01' },
        { name: 'Instant Glow Booster (1₹ Trial Sample)', qty: 1, bin: 'BIN-PROMO-01' },
      ],
      paymentMethod: 'PAID ONLINE (PHONEPE)',
      otp: '4892',
      createdAt: Date.now() - 40000,
    },
  ]);

  // Completed Orders
  const [completedOrders, setCompletedOrders] = useState<any[]>([
    {
      orderId: 'ORD-849188',
      customerName: 'Ananya S.',
      totalAmount: 749,
      earnings: 55,
      time: '10:15 AM',
      status: 'DELIVERED',
    },
    {
      orderId: 'ORD-849175',
      customerName: 'Rahul K.',
      totalAmount: 1199,
      earnings: 85,
      time: '09:42 AM',
      status: 'DELIVERED',
    },
  ]);

  // Pulsing animation for incoming pop-up
  useEffect(() => {
    if (incomingOrder) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [incomingOrder]);

  // 60-Second Acceptance Countdown Timer
  useEffect(() => {
    let timer: any = null;
    if (incomingOrder && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            handleDeclineOrder();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [incomingOrder, countdownSeconds]);

  const handleSimulateIncomingOrder = () => {
    if (!isOnline) {
      Alert.alert('You are Offline', 'Please turn on your Online Status toggle to receive incoming order alerts.');
      return;
    }
    const newId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setCountdownSeconds(60);
    setIncomingOrder({
      orderId: newId,
      customerName: 'Mukesh (Vijayawada)',
      customerPhone: '8977855998',
      deliveryAddress: 'Flat 402, Sri Krishna Apts, Payikapuram',
      distanceKm: '0.8 km',
      earnings: 45,
      totalAmount: 1,
      items: [
        { name: 'Instant Glow Booster (1₹ Trial Sample)', qty: 1, bin: 'BIN-PROMO-01' },
      ],
      paymentMethod: 'CASH ON DELIVERY (COD)',
      otp: '4892',
      createdAt: Date.now(),
    });
  };

  const handleAcceptOrder = () => {
    if (incomingOrder) {
      setActiveOrders(prev => [incomingOrder, ...prev]);
      setIncomingOrder(null);
      Alert.alert('Order Accepted! 📦', `Order #${incomingOrder.orderId} moved to your active packing queue.`);
    }
  };

  const handleDeclineOrder = () => {
    if (incomingOrder) {
      Alert.alert('Order Declined', `Order #${incomingOrder.orderId} reassigned to nearest hub.`);
      setIncomingOrder(null);
      setCountdownSeconds(60);
    }
  };

  const handleMarkPacked = (orderId: string) => {
    setActiveOrders(prev => prev.filter(o => o.orderId !== orderId));
    Alert.alert('Order Handed Over ✅', `Order #${orderId} packed & handed over to Rider at Bay 03.`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top Header with Online/Offline Toggle ─────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTextCol}>
          <Text style={styles.storeNameText}>Glowway Darkstore (DS-VIJ-01)</Text>
          <Text style={styles.storeLocationText}>📍 Payikapuram Hub • Vijayawada</Text>
        </View>

        {/* Live Online / Offline Toggle */}
        <View style={[styles.onlineStatusPill, isOnline ? styles.onlinePillActive : styles.offlinePillActive]}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#00C853' : '#EF4444' }]} />
          <Text style={[styles.onlineStatusText, { color: isOnline ? '#065F46' : '#991B1B' }]}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#E2E8F0', true: '#86EFAC' }}
            thumbColor={isOnline ? '#00C853' : '#94A3B8'}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>

      {/* ── Tabs (Orders, Earnings, Notifications) ────────────────────────── */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
          onPress={() => setActiveTab('orders')}
          activeOpacity={0.8}
        >
          <Ionicons name="cube-outline" size={16} color={activeTab === 'orders' ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.tabBtnText, activeTab === 'orders' && styles.tabBtnTextActive]}>
            Active Queue ({activeOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'earnings' && styles.tabBtnActive]}
          onPress={() => setActiveTab('earnings')}
          activeOpacity={0.8}
        >
          <Ionicons name="wallet-outline" size={16} color={activeTab === 'earnings' ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.tabBtnText, activeTab === 'earnings' && styles.tabBtnTextActive]}>
            Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'notifications' && styles.tabBtnActive]}
          onPress={() => setActiveTab('notifications')}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={16} color={activeTab === 'notifications' ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.tabBtnText, activeTab === 'notifications' && styles.tabBtnTextActive]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Body Content ─────────────────────────────────────────────────── */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Simulator Banner for testing incoming order pop-up */}
        <TouchableOpacity
          style={styles.simulateAlertBanner}
          onPress={handleSimulateIncomingOrder}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={18} color="#D97706" />
          <View style={{ flex: 1 }}>
            <Text style={styles.simulateAlertTitle}>Simulate Incoming Customer Order</Text>
            <Text style={styles.simulateAlertSub}>Tap to test the 60s Rapido / Zepto Acceptance Pop-up</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D97706" />
        </TouchableOpacity>

        {/* TAB 1: ACTIVE ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <View>
            <Text style={styles.sectionHeading}>PACKING & DISPATCH QUEUE (60s SLA)</Text>
            {activeOrders.length === 0 ? (
              <View style={styles.emptyStateBox}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#00C853" />
                <Text style={styles.emptyStateTitle}>All Orders Packed!</Text>
                <Text style={styles.emptyStateSub}>You are online. New orders will pop up instantly.</Text>
              </View>
            ) : (
              activeOrders.map(order => (
                <View key={order.orderId} style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <View>
                      <Text style={styles.orderCardId}>#{order.orderId}</Text>
                      <Text style={styles.orderCardTime}>Assigned just now • ⚡ 60s SLA</Text>
                    </View>
                    <View style={styles.paymentBadge}>
                      <Text style={styles.paymentBadgeText}>{order.paymentMethod}</Text>
                    </View>
                  </View>

                  {/* Customer Info */}
                  <View style={styles.customerRow}>
                    <Ionicons name="person" size={14} color="#64748B" />
                    <Text style={styles.customerText}>{order.customerName} (+91 {order.customerPhone})</Text>
                  </View>
                  <View style={styles.customerRow}>
                    <Ionicons name="location" size={14} color="#64748B" />
                    <Text style={styles.customerText} numberOfLines={1}>{order.deliveryAddress}</Text>
                  </View>

                  {/* Picking Checklist with Bins */}
                  <View style={styles.pickingBox}>
                    <Text style={styles.pickingLabel}>SHELF PICKING CHECKLIST:</Text>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.pickingItemRow}>
                        <Ionicons name="checkbox-outline" size={16} color="#00C853" />
                        <Text style={styles.pickingItemName}>
                          {item.name} (x{item.qty})
                        </Text>
                        <View style={styles.binPill}>
                          <Text style={styles.binPillText}>{item.bin}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Order Total & Handover Actions */}
                  <View style={styles.orderFooterRow}>
                    <View>
                      <Text style={styles.orderFooterLabel}>Grand Total</Text>
                      <Text style={styles.orderFooterAmount}>₹{order.totalAmount}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.markPackedBtn}
                      onPress={() => handleMarkPacked(order.orderId)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="cube" size={16} color="#FFFFFF" />
                      <Text style={styles.markPackedBtnText}>Mark Packed & Handover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB 2: EARNINGS & SETTLEMENT */}
        {activeTab === 'earnings' && (
          <View>
            <View style={styles.earningsSummaryCard}>
              <Text style={styles.earningsLabel}>TODAY'S TOTAL PAYOUT</Text>
              <Text style={styles.earningsAmount}>₹1,420.00</Text>
              <Text style={styles.earningsSub}>⚡ 18 Orders Fulfilled Today • Next Payout at 11:59 PM</Text>
            </View>

            <Text style={styles.sectionHeading}>SETTLEMENT HISTORY</Text>
            {completedOrders.map(item => (
              <View key={item.orderId} style={styles.historyItemRow}>
                <View style={styles.historyIconBox}>
                  <Ionicons name="checkmark-done" size={20} color="#00C853" />
                </View>
                <View style={styles.historyTextCol}>
                  <Text style={styles.historyOrderTitle}>#{item.orderId} • {item.customerName}</Text>
                  <Text style={styles.historyOrderTime}>{item.time} • Total: ₹{item.totalAmount}</Text>
                </View>
                <Text style={styles.historyEarnTag}>+₹{item.earnings}</Text>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: NOTIFICATIONS HISTORY */}
        {activeTab === 'notifications' && (
          <View>
            <Text style={styles.sectionHeading}>DISPATCH NOTIFICATION LOGS</Text>
            <View style={styles.notificationCard}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.notifTitle}>Automated WhatsApp Dispatch Sent</Text>
                <Text style={styles.notifSub}>Order #ORD-849201 broadcasted to +91 {DISPATCH_PHONE_PRIMARY}</Text>
                <Text style={styles.notifTime}>2 minutes ago</Text>
              </View>
            </View>

            <View style={styles.notificationCard}>
              <Ionicons name="flash" size={20} color="#D97706" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.notifTitle}>SLA Target Achieved (48s Pick)</Text>
                <Text style={styles.notifSub}>100% On-Time fulfillment rate maintained.</Text>
                <Text style={styles.notifTime}>15 minutes ago</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* RAPIDO / ZEPTO CAPTAIN-STYLE INCOMING ORDER POP-UP MODAL               */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={!!incomingOrder}
        transparent
        animationType="slide"
        onRequestClose={handleDeclineOrder}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.incomingModalCard, { transform: [{ scale: pulseAnim }] }]}>
            {/* Header Alert */}
            <View style={styles.incomingHeader}>
              <View style={styles.incomingFlashDot} />
              <Text style={styles.incomingHeaderTitle}>NEW INCOMING ORDER!</Text>
              <View style={styles.countdownPill}>
                <Ionicons name="time-outline" size={14} color="#FFFFFF" />
                <Text style={styles.countdownText}>{countdownSeconds}s</Text>
              </View>
            </View>

            {/* Earnings & Distance (Rapido Style) */}
            <View style={styles.earningsGrid}>
              <View style={styles.earningsGridCol}>
                <Text style={styles.earningsGridLabel}>VENDOR EARNING</Text>
                <Text style={styles.earningsGridValue}>₹{incomingOrder?.earnings || 45}</Text>
              </View>
              <View style={styles.earningsGridDivider} />
              <View style={styles.earningsGridCol}>
                <Text style={styles.earningsGridLabel}>DISTANCE</Text>
                <Text style={styles.earningsGridValue}>{incomingOrder?.distanceKm || '0.8 km'}</Text>
              </View>
              <View style={styles.earningsGridDivider} />
              <View style={styles.earningsGridCol}>
                <Text style={styles.earningsGridLabel}>ORDER TOTAL</Text>
                <Text style={styles.earningsGridValue}>₹{incomingOrder?.totalAmount || 1}</Text>
              </View>
            </View>

            {/* Customer & Address Details */}
            <View style={styles.modalDetailCard}>
              <Text style={styles.modalDetailLabel}>PICKUP LOCATION</Text>
              <Text style={styles.modalDetailBold}>Payikapuram Dark Store (Bay 03)</Text>

              <View style={styles.modalRouteDivider} />

              <Text style={styles.modalDetailLabel}>DROP DESTINATION</Text>
              <Text style={styles.modalDetailBold} numberOfLines={2}>
                {incomingOrder?.deliveryAddress}
              </Text>
            </View>

            {/* Items to Pack */}
            <View style={styles.modalItemsBox}>
              <Text style={styles.modalItemsTitle}>ITEMS TO PACK ({incomingOrder?.items.length || 1}):</Text>
              {incomingOrder?.items.map((it, idx) => (
                <Text key={idx} style={styles.modalItemText}>
                  • {it.name} (x{it.qty}) → <Text style={{ color: '#D97706', fontWeight: '800' }}>{it.bin}</Text>
                </Text>
              ))}
            </View>

            {/* Action Buttons (Accept vs Decline) */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.btnDecline}
                onPress={handleDeclineOrder}
                activeOpacity={0.8}
              >
                <Text style={styles.btnDeclineText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnAccept}
                onPress={handleAcceptOrder}
                activeOpacity={0.88}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.btnAcceptText}>Accept Order ({countdownSeconds}s)</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VendorAppScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  storeNameText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  storeLocationText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  onlineStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  onlinePillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#86EFAC',
  },
  offlinePillActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  onlineStatusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#15803D',
    borderColor: '#15803D',
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  simulateAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 10,
  },
  simulateAlertTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#78350F',
  },
  simulateAlertSub: {
    fontSize: 10,
    color: '#92400E',
    marginTop: 1,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderCardId: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  orderCardTime: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 1,
  },
  paymentBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  paymentBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#065F46',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  customerText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  pickingBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickingLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  pickingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  pickingItemName: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
    flex: 1,
  },
  binPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  binPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F172A',
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  orderFooterLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  orderFooterAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  markPackedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15803D',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  markPackedBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  earningsSummaryCard: {
    backgroundColor: '#065F46',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#065F46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  earningsLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  earningsSub: {
    fontSize: 11,
    color: '#6EE7B7',
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  historyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTextCol: {
    flex: 1,
  },
  historyOrderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  historyOrderTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  historyEarnTag: {
    fontSize: 14,
    fontWeight: '900',
    color: '#15803D',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  notifSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  incomingModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  incomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  incomingFlashDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  incomingHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  earningsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  earningsGridCol: {
    flex: 1,
    alignItems: 'center',
  },
  earningsGridLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
  },
  earningsGridValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#15803D',
  },
  earningsGridDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
  },
  modalDetailCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalDetailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  modalDetailBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  modalRouteDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  modalItemsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalItemsTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#64748B',
    marginBottom: 4,
  },
  modalItemText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 2,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnDecline: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnDeclineText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#64748B',
  },
  btnAccept: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#15803D',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnAcceptText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
