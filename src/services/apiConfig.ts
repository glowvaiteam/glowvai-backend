/**
 * Universal Backend API Endpoint Resolver for GlowVAI V2
 * Resolves the correct backend URL dynamically across Physical Phones, Emulators, Web, and Cloud.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const getBackendBaseUrl = (): string => {
  // 1. If running on physical Android device connected via LAN / Expo
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:4000`;
    }
  }

  // 2. If running on Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }

  // 3. If running on Web or iOS Simulator
  return 'http://localhost:4000';
};

export const getCloudBackendUrl = (): string => {
  return process.env.EXPO_PUBLIC_RENDER_API_URL || 'https://glowvai-backend-r7u2.onrender.com';
};
