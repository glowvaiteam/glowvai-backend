/**
 * Native React Native Firebase Phone Authentication Service
 * 
 * Interacts with @react-native-firebase/auth native module.
 * Uses native Google Play Services Phone Auth with Google Play Integrity API.
 * 
 * Rules:
 * 1. Never generates or locally compares OTPs.
 * 2. Never navigates to authenticated routes before Firebase confirms.
 * 3. Keeps ConfirmationResult safely in-memory.
 * 4. Handles invalid OTP, expired session, resend, too many attempts, and network errors.
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { initializeCustomerProfile, getUserProfile } from './userService';
import { BaseUserDocument, CustomerUserDocument } from '../types';

// In-memory active confirmation session
let activeConfirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null;
let pendingPhoneNumber: string | null = null;

/**
 * Initiates native Firebase Phone Sign-In.
 * Sends real SMS OTP via Google Play Services / Firebase Authentication.
 */
export const sendPhoneOtp = async (
  phoneNumber: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    pendingPhoneNumber = phoneNumber;

    // Call native Android Firebase Phone Auth
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    activeConfirmationResult = confirmation;

    return { success: true };
  } catch (err: any) {
    console.error('[AuthService Native] sendPhoneOtp error:', err);
    activeConfirmationResult = null;

    let errorMessage = 'Failed to send OTP. Please check your mobile number.';

    if (err?.code === 'auth/invalid-phone-number') {
      errorMessage = 'The phone number is invalid. Please verify country code and format.';
    } else if (err?.code === 'auth/too-many-requests') {
      errorMessage = 'Too many attempts. Please wait a few minutes before trying again.';
    } else if (err?.code === 'auth/network-request-failed') {
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (err?.message) {
      errorMessage = err.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Confirms OTP code against native Firebase Authentication.
 * Never simulates success.
 */
export const verifyPhoneOtp = async (
  verificationCode: string
): Promise<{
  success: boolean;
  user?: FirebaseAuthTypes.User;
  profile?: BaseUserDocument | CustomerUserDocument;
  error?: string;
}> => {
  if (!activeConfirmationResult) {
    return {
      success: false,
      error: 'No active OTP session found. Please request a new OTP.',
    };
  }

  try {
    const userCredential = await activeConfirmationResult.confirm(verificationCode);
    if (!userCredential || !userCredential.user) {
      throw new Error('Firebase did not return a valid user credential.');
    }

    const user = userCredential.user;

    // Check or initialize Firestore profile
    let profile = await getUserProfile(user.uid);
    if (!profile) {
      profile = await initializeCustomerProfile({
        uid: user.uid,
        phoneNumber: user.phoneNumber || pendingPhoneNumber || '',
        consents: {
          cameraAndScanConsent: false,
          termsAcceptedAt: Date.now(),
          privacyAcceptedAt: Date.now(),
          medicalDisclaimerAcceptedAt: Date.now(),
        },
      });
    }

    // Reset in-memory session upon verified sign-in
    activeConfirmationResult = null;
    pendingPhoneNumber = null;

    return {
      success: true,
      user,
      profile,
    };
  } catch (err: any) {
    console.error('[AuthService Native] verifyPhoneOtp error:', err);

    let errorMessage = 'Verification failed. Please try again.';

    if (err?.code === 'auth/invalid-verification-code') {
      errorMessage = 'Invalid OTP code. Please enter the correct code.';
    } else if (err?.code === 'auth/session-expired') {
      errorMessage = 'The OTP code has expired. Please tap "Resend again".';
      activeConfirmationResult = null;
    } else if (err?.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please request a new OTP.';
    } else if (err?.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (err?.message) {
      errorMessage = err.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Subscribes to native Firebase Auth user state
 */
export const subscribeToAuthState = (
  callback: (user: FirebaseAuthTypes.User | null) => void
) => {
  return auth().onAuthStateChanged(callback);
};

/**
 * Returns current authenticated user synchronously
 */
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

/**
 * Signs out the current user
 */
export const logoutUser = async (): Promise<void> => {
  activeConfirmationResult = null;
  pendingPhoneNumber = null;
  await auth().signOut();
};
