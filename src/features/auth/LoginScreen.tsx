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
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';
import { COUNTRY_CODES, CountryCodeItem } from '../../data/countryCodes';
import { CountryCodePickerModal } from '../../components/modals/CountryCodePickerModal';
import { SingleHeroOrbBackground } from '../../components/auth/SingleHeroOrbBackground';
import {
  sendPhoneOtp,
  signInWithGoogle,
} from '../../services/authService';

const GOOGLE_LOGO_URI =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png';

type LoginStep = 'DUAL_PRIMARY' | 'PHONE_INPUT';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { isLoaded, fontFamily } = useAppFonts();

  // State
  const [loginStep, setLoginStep] = useState<LoginStep>('DUAL_PRIMARY');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(COUNTRY_CODES[0]!); // Default: India (+91)
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
      if (error) setError(null);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    const fullPhoneNumber = `${selectedCountry.dialCode}${phoneNumber}`.replace(/\s+/g, '');

    try {
      const result = await sendPhoneOtp(fullPhoneNumber);

      if (result.success) {
        router.push({
          pathname: '/(auth)/verify-otp',
          params: {
            phoneNumber: `${selectedCountry.dialCode} ${phoneNumber}`,
            dialCode: selectedCountry.dialCode,
            nationalNumber: phoneNumber,
          },
        });
      } else {
        setError(result.error || 'Failed to send OTP. Please check your phone number.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unexpected error occurred.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result.success && result.user) {
        router.replace('/(customer)/(tabs)');
      } else {
        setError(result.error || 'Google Sign-In failed.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Z-INDEX 0 & 1: HERO SINGLE BLURRED ORB & TOP LOGO */}
      <SingleHeroOrbBackground />

      {/* Top Floating Skip Button */}
      <SafeAreaView style={styles.topNavSafeArea} pointerEvents="box-none">
        <View style={styles.topNavRow} pointerEvents="box-none">
          <View style={{ width: 40 }} />
          <TouchableOpacity
            onPress={() => router.replace('/(customer)/(tabs)')}
            style={styles.skipBtn}
            activeOpacity={0.7}
            accessibilityLabel="Skip to app"
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Z-INDEX 2: THE BOTTOM SHEET (THE ACTION CARD) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.bottomSheetWrapper}
      >
        <View style={styles.bottomSheetCard}>
          <ScrollView
            contentContainerStyle={styles.bottomSheetScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header Title & Subtitle */}
            <View style={styles.headerSection}>
              <Text
                style={[
                  styles.sheetTitle,
                  syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
                ]}
              >
                Personalized AI Skincare
              </Text>
              <Text style={styles.sheetSubtitle}>Log in or sign up to continue</Text>
            </View>

            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            {/* STEP 1: DUAL-PRIMARY BUTTONS LAYOUT */}
            {loginStep === 'DUAL_PRIMARY' ? (
              <View style={styles.dualPrimaryContainer}>
                {/* 1. Primary Button 1: Continue with Phone */}
                <TouchableOpacity
                  style={styles.btnContinuePhone}
                  onPress={() => {
                    setError(null);
                    setLoginStep('PHONE_INPUT');
                  }}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Phone"
                >
                  <Ionicons name="call" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
                  <Text style={styles.btnContinuePhoneText}>Continue with Phone</Text>
                </TouchableOpacity>

                {/* 2. Primary Button 2: Continue with Google */}
                <TouchableOpacity
                  style={styles.btnContinueGoogle}
                  onPress={handleGoogleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Google"
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#0F172A" />
                  ) : (
                    <>
                      <Image
                        source={{ uri: GOOGLE_LOGO_URI }}
                        style={styles.googleLogo}
                        resizeMode="contain"
                      />
                      <Text style={styles.btnContinueGoogleText}>Continue with Google</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* STEP 2: PHONE NUMBER INPUT VIEW */
              <View style={styles.phoneInputContainer}>
                {/* Unified Phone Input */}
                <View
                  style={[
                    styles.phoneInputBox,
                    isFocused && styles.inputBoxFocused,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.countryPickerBtn}
                    onPress={() => setIsCountryModalVisible(true)}
                    activeOpacity={0.7}
                    accessibilityLabel="Select country code"
                  >
                    <Text style={styles.flagIcon}>{selectedCountry.flag}</Text>
                    <Text style={styles.dialCodeText}>{selectedCountry.dialCode}</Text>
                    <Ionicons name="chevron-down" size={14} color="#64748B" />
                  </TouchableOpacity>

                  <View style={styles.verticalDivider} />

                  <TextInput
                    style={styles.phoneTextInput}
                    placeholder="Enter mobile number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={10}
                    autoFocus
                  />
                </View>

                {/* Submit Phone Button */}
                <TouchableOpacity
                  style={[
                    styles.btnContinuePhone,
                    phoneNumber.length === 10 && !isLoading ? null : styles.btnDisabled,
                  ]}
                  onPress={handleSendPhoneOtp}
                  disabled={phoneNumber.length !== 10 || isLoading}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Send OTP"
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.btnContinuePhoneText}>Continue</Text>
                  )}
                </TouchableOpacity>

                {/* Back to Options Link */}
                <TouchableOpacity
                  style={styles.backLinkBtn}
                  onPress={() => {
                    setError(null);
                    setLoginStep('DUAL_PRIMARY');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backLinkText}>← Other Login Options</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Muted Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.footerLink}>Terms of Service</Text> &{' '}
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </View>
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
    backgroundColor: '#FFFFFF',
  },
  topNavSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  bottomSheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 30,
  },
  bottomSheetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  bottomSheetScroll: {
    paddingBottom: 8,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
  },

  /* Dual-Primary Buttons */
  dualPrimaryContainer: {
    width: '100%',
  },
  btnContinuePhone: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#818CF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnContinuePhoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btnContinueGoogle: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  btnContinueGoogleText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Phone Input View */
  phoneInputContainer: {
    width: '100%',
    gap: 12,
  },
  phoneInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
  },
  inputBoxFocused: {
    borderColor: '#818CF8',
  },
  countryPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 10,
  },
  flagIcon: {
    fontSize: 18,
  },
  dialCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: 0,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  backLinkBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* Footer */
  footerRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    color: '#64748B',
    fontWeight: '600',
  },
});
