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
  Dimensions,
  TextInput,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { spacing, shadows } from '../../design';
import { useAppFonts } from '../../hooks/useAppFonts';
import { verifyPhoneOtp, sendPhoneOtp } from '../../services/authService';

const { height, width } = Dimensions.get('window');
const OTP_LENGTH = 4;

export const OtpVerificationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phoneNumber?: string;
    dialCode?: string;
    nationalNumber?: string;
  }>();
  const { fontFamily } = useAppFonts();

  const formattedPhoneNumber = params.phoneNumber || '';

  // State
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeBoxIndex, setActiveBoxIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<Array<TextInput | null>>([]);

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
      setError('Please enter all 4 digits of the OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Real Firebase Phone Auth OTP Verification (Rule 1, 2, 6)
      const result = await verifyPhoneOtp(enteredOtp);

      if (result.success && result.user) {
        // Authenticated successfully with real Firebase credentials
        router.replace('/(customer)/(tabs)/index');
      } else {
        setError(result.error || 'Invalid verification code. Please try again.');
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setError(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Atmospheric Blue Header Gradient */}
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
                Say It
              </Text>
              <Text style={styles.sparkleIcon}>✦</Text>
            </View>
            <Text
              style={[
                styles.heroSubtitle,
                fontFamily ? { fontFamily: fontFamily.syneBold } : null,
              ]}
            >
              We Translate It
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Form Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Section Titles */}
          <View style={styles.titleSection}>
            <Text style={styles.otpTitle}>OTP</Text>
            <Text style={styles.otpSubtitle}>
              You get a otp number <Text style={styles.phoneHighlight}>{formattedPhoneNumber || 'your mobile number'}</Text> in this mobile number.
            </Text>
          </View>

          {/* 4 Square PIN Boxes */}
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Resend Action */}
          <View style={styles.resendRow}>
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
                Resend again {timer > 0 ? `(${timer}s)` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              isOtpComplete && !isLoading ? styles.confirmActive : styles.confirmDisabled,
            ]}
            onPress={handleConfirmOtp}
            disabled={!isOtpComplete || isLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Confirm OTP"
          >
            <LinearGradient
              colors={
                isOtpComplete && !isLoading
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
                    styles.confirmText,
                    isOtpComplete ? styles.confirmTextActive : styles.confirmTextDisabled,
                  ]}
                >
                  Confirm
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  otpTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  otpSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 19,
  },
  phoneHighlight: {
    color: '#38BDF8',
    fontWeight: '600',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  otpBoxWrapper: {
    flex: 1,
    height: 64,
    backgroundColor: '#131D33',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: '#38BDF8',
    backgroundColor: '#0D1E42',
    ...shadows.glowPrimary,
  },
  otpBoxFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#10224A',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendRow: {
    alignItems: 'flex-start',
    marginBottom: spacing.xxl,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resendActiveText: {
    color: '#38BDF8',
  },
  resendDisabledText: {
    color: '#64748B',
  },
  confirmButton: {
    borderRadius: 14,
    overflow: 'hidden',
    ...shadows.card,
  },
  confirmActive: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '700',
  },
  confirmTextActive: {
    color: '#FFFFFF',
  },
  confirmTextDisabled: {
    color: '#64748B',
  },
});
