import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DISPATCH_PHONE_PRIMARY, DISPATCH_PHONE_SECONDARY, createWhatsAppOrderLink } from '../../utils/whatsapp';

const { width } = Dimensions.get('window');

interface OrderItem {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  hub: string;
  items: string[];
  total: number;
  payment: string;
  otp: string;
  status: 'STORE_ASSIGNED' | 'PACKED' | 'IN_TRANSIT' | 'DELIVERED';
  slaSeconds: number;
}

export const VendorAdminPortalScreen: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'vendor' | 'admin'>('vendor');
  const [selectedHub, setSelectedHub] = useState('Payikapuram (DS-VIJ-01)');

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: '1',
      orderId: 'ORD-849201',
      customerName: 'Mukesh',
      customerPhone: '8977855998',
      deliveryAddress: 'Flat 402, Sri Krishna Apts, Payikapuram',
      hub: 'Payikapuram (DS-VIJ-01)',
      items: ['Minimalist 10% Niacinamide Serum (x1)', 'Instant Glow Booster ₹1 Sample (x1)'],
      total: 599,
      payment: 'PAID ONLINE (UPI)',
      otp: '4892',
      status: 'STORE_ASSIGNED',
      slaSeconds: 45,
    },
    {
      id: '2',
      orderId: 'ORD-849202',
      customerName: 'Kavitha R.',
      customerPhone: '9876543210',
      deliveryAddress: 'Street 4, Singh Nagar, Vijayawada',
      hub: 'Singh Nagar (DS-VIJ-02)',
      items: ['Derma Co 1% Hyaluronic Sunscreen (x1)'],
      total: 499,
      payment: 'PAID ONLINE (PhonePe)',
      otp: '1934',
      status: 'PACKED',
      slaSeconds: 110,
    },
  ]);

  const handleUpdateStatus = (orderId: string, nextStatus: OrderItem['status']) => {
    setOrders(prev =>
      prev.map(o => (o.orderId === orderId ? { ...o, status: nextStatus } : o))
    );
    Alert.alert('Status Updated ✅', `Order #${orderId} marked as ${nextStatus}!`);
  };

  const handleSendWhatsAppAlert = (order: OrderItem) => {
    const msg = `🚨 *GLOWVAI ORDER DISPATCH ALERT* 🚨
Order #${order.orderId}
Customer: ${order.customerName} (${order.customerPhone})
Address: ${order.deliveryAddress}
Pickup Hub: ${order.hub}
Delivery OTP: ${order.otp}
Amount: ₹${order.total} (${order.payment})`;
    const url = createWhatsAppOrderLink(DISPATCH_PHONE_PRIMARY, msg);
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp Alert', `Alerting dispatch team at ${DISPATCH_PHONE_PRIMARY} and ${DISPATCH_PHONE_SECONDARY}`);
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>⚡ Operations & Vendor Hub</Text>
          <Text style={styles.headerSub}>Vijayawada Hyperlocal Dark Store Network</Text>
        </View>
        <View style={styles.liveDot} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'vendor' && styles.tabBtnActive]}
          onPress={() => setActiveTab('vendor')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'vendor' && styles.tabBtnTextActive]}>
            🏬 Dark Store Operator
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'admin' && styles.tabBtnActive]}
          onPress={() => setActiveTab('admin')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'admin' && styles.tabBtnTextActive]}>
            📊 Dispatch Control Tower
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {/* Dark Store Hub Selector */}
        <View style={styles.hubSelectorCard}>
          <Text style={styles.hubSelectorLabel}>ACTIVE FULFILLMENT HUB</Text>
          <View style={styles.hubPillsRow}>
            {['Payikapuram (DS-VIJ-01)', 'Singh Nagar (DS-VIJ-02)', 'Benz Circle (DS-VIJ-03)'].map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.hubPill, selectedHub === h && styles.hubPillActive]}
                onPress={() => setSelectedHub(h)}
              >
                <Text style={[styles.hubPillText, selectedHub === h && styles.hubPillTextActive]}>
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Orders Queue */}
        <Text style={styles.sectionHeader}>
          {activeTab === 'vendor' ? '📦 Incoming Packing Queue (60s SLA)' : '⚡ Live Dispatch Stream'}
        </Text>

        {orders.map(order => (
          <View key={order.orderId} style={styles.orderCard}>
            <View style={styles.orderCardHeader}>
              <View>
                <Text style={styles.orderIdText}>#{order.orderId}</Text>
                <Text style={styles.orderHubText}>{order.hub}</Text>
              </View>
              <View style={[styles.statusBadge, styles[`statusBadge_${order.status}`]]}>
                <Text style={styles.statusBadgeText}>{order.status}</Text>
              </View>
            </View>

            {/* Customer Details */}
            <View style={styles.detailRow}>
              <Ionicons name="person" size={14} color="#94A3B8" />
              <Text style={styles.detailText}>
                {order.customerName} ({order.customerPhone})
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={14} color="#94A3B8" />
              <Text style={styles.detailText} numberOfLines={1}>
                {order.deliveryAddress}
              </Text>
            </View>

            {/* Items */}
            <View style={styles.itemsBox}>
              <Text style={styles.itemsLabel}>ITEMS TO PICK (BIN-A-01):</Text>
              {order.items.map((it, idx) => (
                <Text key={idx} style={styles.itemLine}>
                  • {it}
                </Text>
              ))}
            </View>

            {/* OTP & Price */}
            <View style={styles.otpPriceRow}>
              <Text style={styles.priceTag}>₹{order.total} • {order.payment}</Text>
              <View style={styles.otpPill}>
                <Text style={styles.otpPillText}>OTP: {order.otp}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              {order.status === 'STORE_ASSIGNED' && (
                <TouchableOpacity
                  style={[styles.btnAction, styles.btnPack]}
                  onPress={() => handleUpdateStatus(order.orderId, 'PACKED')}
                >
                  <Ionicons name="cube" size={14} color="#FFFFFF" />
                  <Text style={styles.btnActionText}>Mark Packed</Text>
                </TouchableOpacity>
              )}

              {order.status === 'PACKED' && (
                <TouchableOpacity
                  style={[styles.btnAction, styles.btnDispatch]}
                  onPress={() => handleUpdateStatus(order.orderId, 'IN_TRANSIT')}
                >
                  <MaterialCommunityIcons name="moped" size={16} color="#FFFFFF" />
                  <Text style={styles.btnActionText}>Handover to Rider</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.btnAction, styles.btnWhatsApp]}
                onPress={() => handleSendWhatsAppAlert(order)}
              >
                <Ionicons name="logo-whatsapp" size={14} color="#000000" />
                <Text style={[styles.btnActionText, { color: '#000000' }]}>WhatsApp Alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorAdminPortalScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C853',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabBtnActive: {
    backgroundColor: '#00C853',
    borderColor: '#00C853',
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  hubSelectorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  hubSelectorLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  hubPillsRow: {
    gap: 6,
  },
  hubPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  hubPillActive: {
    borderColor: '#00C853',
    backgroundColor: '#064E3B',
  },
  hubPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  hubPillTextActive: {
    color: '#00C853',
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  orderHubText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadge_STORE_ASSIGNED: {
    backgroundColor: '#451A03',
  },
  statusBadge_PACKED: {
    backgroundColor: '#172554',
  },
  statusBadge_IN_TRANSIT: {
    backgroundColor: '#064E3B',
  },
  statusBadge_DELIVERED: {
    backgroundColor: '#022C22',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#CBD5E1',
    flex: 1,
  },
  itemsBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  itemsLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 4,
  },
  itemLine: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  otpPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceTag: {
    fontSize: 13,
    fontWeight: '800',
    color: '#34D399',
  },
  otpPill: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  otpPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FDE68A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  btnPack: {
    backgroundColor: '#059669',
  },
  btnDispatch: {
    backgroundColor: '#D97706',
  },
  btnWhatsApp: {
    backgroundColor: '#25D366',
  },
  btnActionText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
