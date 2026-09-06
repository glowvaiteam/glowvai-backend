import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Modern High-Resolution Payment Brand Logos
 * Accurate colors, zero-latency, 100% offline reliable vector badges
 */

export const GooglePayLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <View style={[styles.logoCard, { width: size, height: size, backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}>
    <View style={styles.gpayContent}>
      <View style={styles.gpayDotsRow}>
        <View style={[styles.gDot, { backgroundColor: '#4285F4' }]} />
        <View style={[styles.gDot, { backgroundColor: '#EA4335' }]} />
        <View style={[styles.gDot, { backgroundColor: '#FBBC05' }]} />
        <View style={[styles.gDot, { backgroundColor: '#34A853' }]} />
      </View>
      <Text style={styles.gpayLabel}>GPay</Text>
    </View>
  </View>
);

export const PhonePeLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <View style={[styles.logoCard, { width: size, height: size, backgroundColor: '#5F259F', borderColor: '#5F259F' }]}>
    <View style={styles.phonePeCircle}>
      <Text style={styles.phonePeChar}>पे</Text>
    </View>
  </View>
);

export const PaytmLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <View style={[styles.logoCard, { width: size, height: size, backgroundColor: '#002E6E', borderColor: '#002E6E' }]}>
    <View style={styles.paytmWrap}>
      <Text style={styles.paytmWhite}>pay</Text>
      <Text style={styles.paytmCyan}>tm</Text>
    </View>
    <View style={styles.paytmUnderline} />
  </View>
);

export const BhimUpiLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <View style={[styles.logoCard, { width: size, height: size, backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' }]}>
    <View style={styles.upiIconWrap}>
      <View style={styles.upiTriangleOrange} />
      <View style={styles.upiTriangleGreen} />
    </View>
    <Text style={styles.upiLabel}>UPI</Text>
  </View>
);

export const CashOnDeliveryLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <View style={[styles.logoCard, { width: size, height: size, backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
    <MaterialCommunityIcons name="cash-fast" size={size * 0.58} color="#00C853" />
  </View>
);

const styles = StyleSheet.create({
  logoCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  // Google Pay
  gpayContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpayDotsRow: {
    flexDirection: 'row',
    gap: 1.5,
    marginBottom: 1,
  },
  gDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
  },
  gpayLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  // PhonePe
  phonePeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonePeChar: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: -1,
  },
  // Paytm
  paytmWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paytmWhite: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  paytmCyan: {
    fontSize: 11,
    fontWeight: '900',
    color: '#00BAF2',
  },
  paytmUnderline: {
    width: 16,
    height: 1.5,
    backgroundColor: '#00BAF2',
    marginTop: 1,
    borderRadius: 1,
  },
  // BHIM UPI
  upiIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  upiTriangleOrange: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F47920',
  },
  upiTriangleGreen: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#007730',
  },
  upiLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0B2046',
    letterSpacing: 0.5,
    marginTop: 1,
  },
});
