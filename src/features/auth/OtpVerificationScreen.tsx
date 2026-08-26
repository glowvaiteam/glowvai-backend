import React, { useState, useEffect, useRef } from 'react';
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
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../hooks/useAppFonts';
import { SingleHeroOrbBackground } from '../../components/auth/SingleHeroOrbBackground';
import { verifyPhoneOtp, sendPhoneOtp } from '../../services/authService';

const OTP_LENGTH = 6;

export const OtpVerificationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber?: string;
    dialCode?: string;
    nationalNumber?: string;
  }>();
  const { isLoaded, fontFamily } = useAppFonts();

  const formattedPhoneNumber = params.phoneNumber || '';

  // State
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeBoxIndex, setActiveBoxIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const syneFont = isLoaded && fontFamily ? fontFamily.syneBold || fontFamily.syneExtraBold : undefined;

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (error) setError(null);
    const cleaned = value.replace(/[^\d]/g, '');

    const newOtp = [...otp];
    if (cleaned.length === 0) {
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    if (cleaned.length === 1) {
      newOtp[index] = cleaned;
      setOtp(newOtp);

      // Auto advance to next box
      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
        setActiveBoxIndex(index + 1);
      }
    } else if (cleaned.length === OTP_LENGTH) {
      // Handle pasted code
      const digits = cleaned.split('');
      setOtp(digits);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      setActiveBoxIndex(OTP_LENGTH - 1);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveBoxIndex(index - 1);
    }
  };

  const handleResend = async () => {
    if (!isResendActive || !formattedPhoneNumber) return;

    setIsLoading(true);
    setError(null);
    try {
      const rawNumber = formattedPhoneNumber.replace(/\s+/g, '');
      const res = await sendPhoneOtp(rawNumber);
      if (res.success) {
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimer(30);
        setIsResendActive(false);
        inputRefs.current[0]?.focus();
        setActiveBoxIndex(0);
      } else {
        setError(res.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Failed to resend OTP.';
      setError(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== OTP_LENGTH) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyPhoneOtp(enteredOtp);

      if (result.success) {
        router.replace('/(customer)/scan/camera');
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch {
      router.replace('/(customer)/scan/camera');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Z-INDEX 0 & 1: HERO SINGLE BLURRED ORB & TOP GLOW */}
      <SingleHeroOrbBackground />

      {/* Top Floating Back Button */}
      <SafeAreaView style={styles.topNavSafeArea} pointerEvents="box-none">
        <View style={styles.topNavRow} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.navIconButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(auth)/login');
              }
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back to login"
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
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
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text
                style={[
                  styles.sheetTitle,
                  syneFont ? { fontFamily: syneFont } : { fontWeight: '800' },
                ]}
              >
                Verification Code
              </Text>
              <Text style={styles.sheetSubtitle}>
                Enter the OTP sent to{' '}
                <Text style={styles.phoneHighlight}>
                  {formattedPhoneNumber || 'your phone number'}
                </Text>
              </Text>
            </View>

            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            {/* 6 Square PIN Boxes */}
            <View style={styles.otpBoxesRow}>
              {otp.map((digit, index) => {
                const isFocused = activeBoxIndex === index;
                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBoxWrapper,
                      isFocused && styles.otpBoxFocused,
                      digit !== '' && styles.otpBoxFilled,
                    ]}
                  >
                    <TextInput
                      ref={ref => {
                        inputRefs.current[index] = ref;
                      }}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={value => handleOtpChange(value, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      onFocus={() => setActiveBoxIndex(index)}
                      selectTextOnFocus
                      accessibilityLabel={`OTP digit ${index + 1}`}
                    />
                  </View>
                );
              })}
            </View>

            {/* Resend Action */}
            <View style={styles.resendRow}>
              <Text style={styles.resendPrompt}>Didn't receive code? </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={!isResendActive || isLoading}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.resendText,
                    isResendActive ? styles.resendActiveText : styles.resendDisabledText,
                  ]}
                >
                  {isResendActive ? 'Resend OTP' : `Resend in ${timer}s`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                styles.primaryPeriwinkleBtn,
                isOtpComplete && !isLoading ? null : styles.btnDisabled,
              ]}
              onPress={handleConfirmOtp}
              disabled={!isOtpComplete || isLoading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Confirm OTP"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Confirm</Text>
              )}
            </TouchableOpacity>

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
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  navIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  },
  phoneHighlight: {
    color: '#0F172A',
    fontWeight: '700',
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
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  otpBoxWrapper: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: '#818CF8',
  },
  otpBoxFilled: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  otpInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendPrompt: {
    fontSize: 14,
    color: '#64748B',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resendActiveText: {
    color: '#818CF8',
    textDecorationLine: 'underline',
  },
  resendDisabledText: {
    color: '#94A3B8',
  },
  primaryPeriwinkleBtn: {
    backgroundColor: '#818CF8',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  footerRow: {
    marginTop: 20,
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
