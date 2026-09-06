import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { syncUserOnboardingData } from '../src/services/userSyncService';

export default function RootLayout() {
  // Graceful non-blocking background permission initialization & Founder Firebase Sync
  useEffect(() => {
    try {
      Location.requestForegroundPermissionsAsync()
        .then(perm => {
          syncUserOnboardingData({
            locationGranted: perm.status === 'granted',
          }).catch(() => null);
        })
        .catch(() => null);
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}
