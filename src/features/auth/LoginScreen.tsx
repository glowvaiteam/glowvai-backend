import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, shadows } from '../../design';
import { useAppFonts } from '../../hooks/useAppFonts';
import { COUNTRY_CODES, CountryCodeItem } from '../../data/countryCodes';
import { CountryCodePickerModal } from '../../components/modals/CountryCodePickerModal';
import { sendPhoneOtp } from '../../services/authService';
import { getDeviceCurrentLocation, requestDeviceLocationPermission } from '../../services/locationService';

const { height, width } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { fontFamily } = useAppFonts();

  // State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(COUNTRY_CODES[0]!); // Default: India (+91)
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger native OS location permission ONLY when user taps location action (Rule 10)
  const handleDetectLocation = async () => {
    setIsLocating(true);
    setError(null);
    try {
      const granted = await requestDeviceLocationPermission();
      if (granted) {
        const locResult = await getDeviceCurrentLocation();
        if (locResult && locResult.detectedCountryItem) {
          setSelectedCountry(locResult.detectedCountryItem);
        }
      } else {
        setError('Location permission was denied. You can select your country code manually.');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not detect location.');
    } finally {
      setIsLocating(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
      if (error) setError(null);
    }
  };

  const handleContinue = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    const fullPhoneNumber = `${selectedCountry.dialCode}${phoneNumber}`;

    try {
      // Real Firebase Phone Auth OTP Request (Rule 1 & 6)
      const result = await sendPhoneOtp(fullPhoneNumber);

      if (result.success) {
        // Navigate to real OTP verification screen
        router.push({
          pathname: '/(auth)/verify-otp',
          params: {
            phoneNumber: `${selectedCountry.dialCode} ${phoneNumber}`,
            dialCode: selectedCountry.dialCode,
            nationalNumber: phoneNumber,
          },
        });
      } else {
        setError(result.error || 'Failed to send OTP. Please check your phone number and network.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Atmospheric Blue Gradient Header */}
      <LinearGradient
        colors={[
          '#020617',
          '#0A1942',
          '#12357A',
          '#1D4ED8',
          '#2563EB',
          '#0E2A68',
          '#060B18',
        ]}
        locations={[0, 0.15, 0.35, 0.55, 0.72, 0.88, 1.0]}
        style={styles.gradientHeader}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <View style={styles.sparkleRow}>
              <Text
                style={[
                  styles.heroTitle,
                  fontFamily ? { fontFamily: fontFamily.syneBold } : null,
                ]}
              >
                Your Skin
              </Text>
              <Text style={styles.sparkleIcon}>✦</Text>
            </View>
            <Text
              style={[
                styles.heroSubtitle,
                fontFamily ? { fontFamily: fontFamily.syneBold } : null,
              ]}
            >
              Every Solution
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Main Login Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Section Heading */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.loginTitle}>Login</Text>
              
              {/* Optional user-triggered native location auto-detect button */}
              <TouchableOpacity
                style={styles.locationDetectBtn}
                onPress={handleDetectLocation}
                disabled={isLocating}
                accessibilityRole="button"
                accessibilityLabel="Auto-detect country code from location"
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color="#38BDF8" />
                ) : (
                  <>
                    <Ionicons name="location-outline" size={14} color="#38BDF8" />
                    <Text style={styles.locationDetectText}>Auto-detect</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.loginSubtitle}>Please enter your mobile number</Text>
          </View>

          {/* Mobile Number Input Card */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Mobile number</Text>

            <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
              {/* Country Code Selector Trigger */}
              <TouchableOpacity
                style={styles.countryPickerTrigger}
                onPress={() => setIsCountryModalVisible(true)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Country ${selectedCountry.name} dial code ${selectedCountry.dialCode}. Tap to change.`}
              >
                <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                <Text style={styles.dialCodeText}>{selectedCountry.dialCode}</Text>
                <Text style={styles.dropdownArrow}>▾</Text>
              </TouchableOpacity>

              <View style={styles.inputDivider} />

              {/* 10-Digit Mobile Number Input */}
              <TextInput
                style={styles.numberInput}
                placeholder="98765 43210"
                placeholderTextColor="#475569"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={10}
                autoFocus={false}
                accessibilityLabel="Enter mobile number"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              phoneNumber.length === 10 && !isLoading ? styles.continueActive : styles.continueDisabled,
            ]}
            onPress={handleContinue}
            disabled={phoneNumber.length !== 10 || isLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue to OTP verification"
          >
            <LinearGradient
              colors={
                phoneNumber.length === 10 && !isLoading
                  ? ['#1D4ED8', '#2563EB', '#38BDF8']
                  : ['#1E293B', '#1E293B']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.continueText,
                    phoneNumber.length === 10 ? styles.continueTextActive : styles.continueTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Code Picker Modal */}
      <CountryCodePickerModal
        visible={isCountryModalVisible}
        selectedCountry={selectedCountry}
        onSelect={setSelectedCountry}
        onClose={() => setIsCountryModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  gradientHeader: {
    height: height * 0.44,
    width: width,
    justifyContent: 'flex-end',
  },
  headerSafeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  sparkleIcon: {
    fontSize: 20,
    color: '#38BDF8',
    marginLeft: 6,
    marginTop: -8,
  },
  heroSubtitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginTop: -2,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#060B18',
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  locationDetectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: '#131D33',
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 4,
  },
  locationDetectText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  inputCard: {
    marginBottom: spacing.xxl,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E293B',
    paddingVertical: spacing.sm,
  },
  inputRowError: {
    borderBottomColor: '#EF4444',
  },
  countryPickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  dialCodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#94A3B8',
  },
  inputDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#334155',
    marginRight: spacing.md,
  },
  numberInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    letterSpacing: 1,
    paddingVertical: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: spacing.xs,
  },
  continueButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: spacing.xxxl,
    ...shadows.card,
  },
  continueActive: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  continueDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
  },
  continueTextActive: {
    color: '#FFFFFF',
  },
  continueTextDisabled: {
    color: '#64748B',
  },
});
