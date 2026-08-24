import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { spacing, borderRadius } from '../../../src/design';
import { useAppFonts } from '../../../src/hooks/useAppFonts';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { fontFamily } = useAppFonts();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060B18" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Location Bar */}
        <View style={styles.locationBar}>
          <View style={styles.locationInfo}>
            <Ionicons name="location-sharp" size={20} color="#38BDF8" />
            <View style={styles.locationTextContainer}>
              <Text style={styles.deliveringToLabel}>Location</Text>
              <Text style={styles.currentAddressText}>Select delivery address ▾</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        {/* Quick Commerce 30-min Delivery Banner */}
        <LinearGradient
          colors={['#1D4ED8', '#2563EB', '#38BDF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.quickCommerceBanner}
        >
          <View style={styles.qcTextSection}>
            <Text style={styles.qcBadge}>⚡ QUICK-COMMERCE</Text>
            <Text style={styles.qcTitle}>Skincare in 30–45 Mins</Text>
            <Text style={styles.qcSubtitle}>Vijayawada Express Partner Pharmacies</Text>
          </View>
          <Text style={styles.qcIcon}>🧴</Text>
        </LinearGradient>

        {/* AI Face Scan Action Card */}
        <TouchableOpacity
          style={styles.scanCard}
          onPress={() => router.push('/(customer)/(tabs)/scan')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#0F1D3D', '#162854']}
            style={styles.scanCardGradient}
          >
            <View style={styles.scanIconCircle}>
              <MaterialCommunityIcons name="face-recognition" size={32} color="#38BDF8" />
            </View>
            <View style={styles.scanTextContainer}>
              <Text style={[styles.scanTitle, fontFamily ? { fontFamily: fontFamily.syneBold } : null]}>
                AI Skin Diagnostic Scan
              </Text>
              <Text style={styles.scanSubtitle}>
                Analyze acne, texture, hydration, and dark spots.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#38BDF8" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Real Catalogue Section Placeholder (Zero Dummy Items) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Products</Text>
        </View>

        <View style={styles.emptyCatalogCard}>
          <Ionicons name="sparkles-outline" size={28} color="#38BDF8" />
          <Text style={styles.emptyCatalogTitle}>No products published yet</Text>
          <Text style={styles.emptyCatalogSubtitle}>
            Approved vendor products from Cloud Firestore will appear here.
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
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: spacing.sm,
  },
  deliveringToLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  currentAddressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131D33',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  quickCommerceBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  qcTextSection: {
    flex: 1,
  },
  qcBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  qcTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qcSubtitle: {
    fontSize: 12,
    color: '#E0F2FE',
    marginTop: 2,
  },
  qcIcon: {
    fontSize: 34,
    marginLeft: spacing.md,
  },
  scanCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
    borderWidth: 1.5,
    borderColor: '#1E40AF',
  },
  scanCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  scanIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  scanSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  emptyCatalogCard: {
    backgroundColor: '#131D33',
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  emptyCatalogTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: spacing.md,
    marginBottom: 4,
  },
  emptyCatalogSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
