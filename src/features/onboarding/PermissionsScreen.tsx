import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';
import {
  requestDeviceLocationPermission,
  getDeviceCurrentLocation,
} from '../../services/locationService';

export const PermissionsScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();

  // Profile Form State
  const [displayName, setDisplayName] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Value-driven permission toggles
  const [isCameraGranted, setIsCameraGranted] = useState(true);
  const [isLocationGranted, setIsLocationGranted] = useState(true);
  const [isNotificationsGranted, setIsNotificationsGranted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoDetectLocation = async () => {
    setIsLocating(true);
    try {
      const granted = await requestDeviceLocationPermission();
      if (granted) {
        const loc = await getDeviceCurrentLocation();
        if (loc) {
          setCityArea(`${loc.city || 'Bengaluru'}, ${loc.state || 'Karnataka'}`);
          setIsLocationGranted(true);
        }
      } else {
        Alert.alert('Permission Notice', 'Location permission was not granted. You can enter your delivery address manually.');
      }
    } catch {
      setCityArea('Koramangala, Bengaluru');
    } finally {
      setIsLocating(false);
    }
  };

  const handleAllowAndContinue = async () => {
    setIsLoading(true);

    try {
      if (isLocationGranted) {
        await requestDeviceLocationPermission();
      }

      // Proceed to Clinical Face Scan Screen
      if (isCameraGranted) {
        router.push('/(customer)/scan/camera');
      } else {
        router.replace('/(customer)/(tabs)');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Notice: Proceeding with default setup.';
      Alert.alert('Notice', msg);
      router.push('/(customer)/scan/camera');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(customer)/(tabs)');
  };

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Navigation */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(customer)/(tabs)');
            }
          }}
          style={styles.navIconButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} style={styles.skipPill} activeOpacity={0.7}>
          <Text style={styles.skipPillText}>Skip to Home</Text>
          <Ionicons name="chevron-forward" size={14} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Trust & Value Proposition Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#2563EB" />
            <Text style={styles.trustBadgeText}>100% PRIVATE & ENCRYPTED</Text>
          </View>

          <Text
            style={[
              styles.heroTitle,
              syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
            ]}
          >
            Unlock Personalized Skincare
          </Text>
          <Text style={styles.heroSubtitle}>
            To deliver clinical AI skin diagnostics and guarantee 30-min express deliveries, GlowVAI needs a few quick permissions.
          </Text>
        </View>

        {/* SECTION 1: Delivery Profile Setup */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconCircle}>
              <Ionicons name="person-circle-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.cardHeaderTextCol}>
              <Text style={styles.cardTitle}>Your Delivery Profile</Text>
              <Text style={styles.cardSubtitle}>Helps us tailor routines and address shipping</Text>
            </View>
          </View>

          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <View
              style={[
                styles.inputRow,
                focusedField === 'name' && styles.inputRowFocused,
              ]}
            >
              <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Alex Sharma"
                placeholderTextColor="#94A3B8"
                value={displayName}
                onChangeText={setDisplayName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Delivery Location Field */}
          <View style={styles.inputGroup}>
            <View style={styles.locationLabelRow}>
              <Text style={styles.inputLabel}>DELIVERY ADDRESS / AREA</Text>
              <TouchableOpacity
                onPress={handleAutoDetectLocation}
                disabled={isLocating}
                style={styles.autoLocateBtn}
                activeOpacity={0.7}
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <>
                    <Ionicons name="navigate-outline" size={12} color="#2563EB" />
                    <Text style={styles.autoLocateText}>Auto-Detect GPS</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputRow,
                focusedField === 'location' && styles.inputRowFocused,
              ]}
            >
              <Ionicons name="location-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Indiranagar, Bengaluru"
                placeholderTextColor="#94A3B8"
                value={cityArea}
                onChangeText={setCityArea}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: Value-Driven Permission Toggles */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why We Ask for Permissions</Text>

          {/* 1. Camera Permission */}
          <View style={styles.permissionRow}>
            <View style={[styles.permIconBadge, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="camera" size={20} color="#2563EB" />
            </View>
            <View style={styles.permTextContainer}>
              <Text style={styles.permTitle}>Camera Access</Text>
              <Text style={styles.permBenefit}>
                Enables clinical AI face diagnostics for measuring hydration, acne, and barrier score in 5 seconds.
              </Text>
            </View>
            <Switch
              value={isCameraGranted}
              onValueChange={setIsCameraGranted}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={isCameraGranted ? '#2563EB' : '#FFFFFF'}
            />
          </View>

          <View style={styles.divider} />

          {/* 2. Location Permission */}
          <View style={styles.permissionRow}>
            <View style={[styles.permIconBadge, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="location" size={20} color="#16A34A" />
            </View>
            <View style={styles.permTextContainer}>
              <Text style={styles.permTitle}>Precise Location</Text>
              <Text style={styles.permBenefit}>
                Locates your nearest verified partner dark store for guaranteed 30-minute doorstep drops.
              </Text>
            </View>
            <Switch
              value={isLocationGranted}
              onValueChange={setIsLocationGranted}
              trackColor={{ false: '#E2E8F0', true: '#BBF7D0' }}
              thumbColor={isLocationGranted ? '#16A34A' : '#FFFFFF'}
            />
          </View>

          <View style={styles.divider} />

          {/* 3. Smart Notifications */}
          <View style={styles.permissionRow}>
            <View style={[styles.permIconBadge, { backgroundColor: '#FAF5FF' }]}>
              <Ionicons name="notifications" size={20} color="#9333EA" />
            </View>
            <View style={styles.permTextContainer}>
              <Text style={styles.permTitle}>Live Delivery Alerts</Text>
              <Text style={styles.permBenefit}>
                Real-time rider tracking notifications and customized AM/PM skincare routine alerts.
              </Text>
            </View>
            <Switch
              value={isNotificationsGranted}
              onValueChange={setIsNotificationsGranted}
              trackColor={{ false: '#E2E8F0', true: '#E9D5FF' }}
              thumbColor={isNotificationsGranted ? '#9333EA' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* SECTION 3: Customer Trust & Privacy Commitment Shield */}
        <View style={styles.privacyGuaranteeCard}>
          <Ionicons name="lock-closed" size={20} color="#16A34A" />
          <View style={styles.privacyTextCol}>
            <Text style={styles.privacyTitle}>Clinical Biometric Privacy</Text>
            <Text style={styles.privacyDesc}>
              Your facial scan is processed on-device and securely encrypted. GlowVAI never sells or shares your personal biometric data.
            </Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.primaryBrandBtn}
          onPress={handleAllowAndContinue}
          disabled={isLoading}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Allow access and continue"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryBrandBtnText}>
                {isCameraGranted ? 'Allow Access & Start Skin Scan' : 'Save & Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        {/* Skip Ghost Link */}
        <TouchableOpacity style={styles.skipGhostBtn} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipGhostText}>Skip for now (Browse Products Directly) →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  navIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  skipPillText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 24,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 12,
    gap: 6,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 28,
    color: '#0F172A',
    letterSpacing: -0.7,
    marginBottom: 8,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  locationLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  autoLocateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  autoLocateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 52,
  },
  inputRowFocused: {
    borderColor: '#2563EB',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  permIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permTextContainer: {
    flex: 1,
    paddingRight: 4,
  },
  permTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  permBenefit: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  privacyGuaranteeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 20,
    gap: 10,
  },
  privacyTextCol: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  privacyDesc: {
    fontSize: 12,
    color: '#15803D',
    lineHeight: 17,
  },
  primaryBrandBtn: {
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBrandBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skipGhostBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  skipGhostText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
